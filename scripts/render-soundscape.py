"""Original approved forest score; no external samples or paid generation.
Rebuild: python3 scripts/render-soundscape.py
Requires NumPy, SciPy and ffmpeg. Only compact MP3s ship; temporary WAVs do not.
"""
from pathlib import Path
import functools,hashlib,json,subprocess,tempfile
import numpy as np
from scipy import signal
from scipy.io import wavfile
SR=44100
CHORDS = {
    'Dm':[50,57,62,65,69,65], 'C':[48,55,60,64,67,64],
    'Bb':[46,53,58,62,65,62], 'F':[53,60,65,69,72,69],
    'Gm':[43,50,55,58,62,58], 'Am':[45,52,57,60,64,60],
}
LEADS = {
    'Dm':[(.22,69,.42),(.69,74,.35)],
    'C':[(.19,76,.25),(.49,74,.36),(.90,69,.22)],
    'Bb':[(.19,77,.32),(.54,76,.35)],
    'F':[(.20,72,.40),(.67,69,.34)],
    'Gm':[(.22,70,.40),(.69,69,.30)],
    'Am':[(.20,72,.32),(.58,76,.34)],
}
CONFIGS = [
    dict(key='Home',title='Lanternlit Home',duration=80,bar=2.5,bars=32,
         progression='Dm C Bb Dm F C Gm Am Dm F Bb C Gm Bb Am Dm Dm C Bb Dm F C Bb Am Gm Dm Bb C F Gm Am Dm',
         pluck=.102,pad=.0165,flute=.044,drum=0,air=.0025,reverb=.18,lufs=-20,
         note='Warm, spacious home-screen music with eight evolving phrases.'),
    dict(key='Battle',title='Thornwood Encounter',duration=64,bar=2,bars=32,
         progression='Dm Dm Bb C Dm F Gm Am Dm C Bb Am Gm Bb Am Dm Dm F Bb C Gm Dm Am Am Bb C Dm F Gm Bb Am Dm',
         pluck=.091,pad=.016,flute=.030,drum=.019,air=.0015,reverb=.16,lufs=-21,
         note='Restrained tension and a low pulse; sparse melody for reading encounters.'),
    dict(key='Number_Duel',title='Counting Sparks',duration=48,bar=1.5,bars=32,
         progression='Dm C Bb Dm F C Gm Am Dm F Bb C Gm Bb Am Dm Dm C Bb Dm F C Bb Am Gm Dm Bb C F Gm Am Dm',
         pluck=.094,pad=.0105,flute=.026,drum=.021,air=.001,reverb=.13,lufs=-20.5,
         note='Quicker plucked patterns and light percussion for the 1x1 battle; no accelerating countdown.'),
    dict(key='Transition',title='Beyond the Ferns',duration=20,bar=2.5,bars=8,
         progression='Gm C Dm F Bb C Am Dm',pluck=.076,pad=.017,flute=.034,
         drum=0,air=.002,reverb=.20,lufs=-21,
         note='A gentle travelling phrase for movement between scenes.'),
    dict(key='Victory',title='A Little Triumph',duration=16,bar=2,bars=8,
         progression='F C Bb F Dm Bb C F',pluck=.104,pad=.017,flute=.046,
         drum=.009,air=.0014,reverb=.18,lufs=-19.5,
         note='Bright and warm, with a rising shared motif. Can follow the optional short victory cue.'),
    dict(key='Defeat',title='Rest and Return',duration=20,bar=2.5,bars=8,
         progression='Dm Bb F C Gm Bb Am Dm',pluck=.071,pad=.017,flute=.032,
         drum=0,air=.002,reverb=.17,lufs=-22,
         note='A gentle falling phrase and space to regroup. Can follow the optional short defeat cue.'),
]

def hz(midi):
    return 440 * 2 ** ((midi-69)/12)

@functools.lru_cache(maxsize=180)
def pluck(midi, length=3.0):
    t=np.arange(int(length*SR))/SR
    x=np.zeros_like(t)
    for k in range(1,15):
        x += k**-1.62*np.sin(2*np.pi*hz(midi)*k*np.sqrt(1+.000035*k*k)*t)*np.exp(-t/(1.55/(1+.23*(k-1))))
    x *= (1-np.exp(-t/.007))*np.clip((length-t)/.07,0,1)
    return x.astype(np.float32)

@functools.lru_cache(maxsize=150)
def flute(midi, length):
    rng=np.random.default_rng(midi*100+int(length*100))
    t=np.arange(int(length*SR))/SR
    vibrato=.0014*np.sin(2*np.pi*4.7*t)*(1-np.exp(-t/.45))
    phase=2*np.pi*np.cumsum(hz(midi)*(1+vibrato))/SR
    x=np.sin(phase)+.16*np.sin(2*phase)+.055*np.sin(3*phase)
    breath=signal.sosfilt(signal.butter(2,[900,4300],btype='band',fs=SR,output='sos'),rng.normal(size=len(t)))
    env=np.minimum(t/.12,1)*np.minimum((length-t)/.30,1)
    return ((x+.033*breath)*np.maximum(env,0)*(.91+.09*np.sin(np.pi*t/length))).astype(np.float32)

@functools.lru_cache(maxsize=100)
def pad(midi,length):
    t=np.arange(int(length*SR))/SR
    x=sum(np.sin(2*np.pi*hz(midi)*ratio*t+phase) for ratio,phase in [(0.9988,.7),(1.0011,1.3),(2.0004,.2)])/3
    env=np.minimum(t/.8,1)*np.minimum((length-t)/1,1)
    return (x*np.maximum(env,0)).astype(np.float32)

def drum(seed):
    rng=np.random.default_rng(seed)
    t=np.arange(int(.32*SR))/SR
    phase=2*np.pi*(100*t+25*.03*(1-np.exp(-t/.03)))
    skin=np.sin(phase)*np.exp(-t/.065)+.22*np.sin(phase*1.59)*np.exp(-t/.045)
    noise=signal.sosfilt(signal.butter(2,650,fs=SR,output='sos'),rng.normal(size=len(t)))
    return ((skin+.08*noise*np.exp(-t/.02))*(1-np.exp(-t/.004))*np.clip((.32-t)/.03,0,1)).astype(np.float32)

def place(bus,x,start,gain,pan=0):
    # Wrap every tail into the beginning: the buffer represents one period.
    i=int(round(start*SR))%len(bus)
    angle=(pan+1)*np.pi/4
    weights=np.array([np.cos(angle),np.sin(angle)])*gain
    first=min(len(x),len(bus)-i)
    bus[i:i+first] += x[:first,None]*weights
    if first<len(x):
        bus[:len(x)-first] += x[first:,None]*weights

def periodic_air(n,seed,level):
    rng=np.random.default_rng(seed)
    freq=np.fft.rfftfreq(n,1/SR)
    shape=(freq/250)**2/(1+(freq/250)**2)/(1+(freq/3800)**4)
    shape[0]=0
    t=np.arange(n)/n
    out=np.zeros((n,2),np.float32)
    common=rng.normal(size=n)
    for c in range(2):
        raw=.65*common+.35*rng.normal(size=n)
        air=np.fft.irfft(np.fft.rfft(raw)*shape,n=n)
        air/=max(np.std(air),1e-10)
        envelope=.72+.12*np.sin(2*np.pi*2*t+c*.2)+.08*np.sin(2*np.pi*5*t+1.2)
        out[:,c]=air*envelope*level
    return out

def reverb(dry,amount,seed,periodic=True):
    rng=np.random.default_rng(seed)
    out=dry.copy()
    for c in range(2):
        t=np.arange(int(1.65*SR))/SR
        ir=rng.normal(size=len(t))*np.exp(-t/.34)
        ir=signal.sosfilt(signal.butter(2,3600,fs=SR,output='sos'),ir)
        ir[:int(.025*SR)]=0
        ir/=np.sqrt(np.sum(ir**2))
        tail=signal.fftconvolve(dry[:,c],ir)
        out[:,c]+=amount*tail[:len(dry)]
        if periodic:
            out[:len(tail)-len(dry),c]+=amount*tail[len(dry):]
    return out

def compose(conf,index):
    rng=np.random.default_rng(28914+index*900)
    bar=conf['bar']
    n=int(conf['duration']*SR)
    dry=np.zeros((n,2),np.float32)
    accents=np.zeros_like(dry)
    prog=conf['progression'].split()
    assert len(prog)==conf['bars']
    for b,chord in enumerate(prog):
        notes=CHORDS[chord]
        section=b//4
        # Alternate the middle registers and leave space in later phrases.
        order=[0,1,2,3,4,3] if section%2==0 else [0,2,1,4,3,2]
        for beat,j in enumerate(order):
            if conf['key']=='Defeat' and beat in (2,5):
                continue
            if conf['key']=='Transition' and b%2 and beat==5:
                continue
            note=notes[j]
            gain=conf['pluck']*(1.15 if beat%3==0 else .91)*rng.uniform(.94,1.06)
            place(dry,pluck(note),b*bar+beat*bar/6+.015+rng.uniform(-.007,.007),gain,-.22+.07*(beat%5))
        for j,note in enumerate(notes[:4]):
            place(dry,pad(note,bar+.9),b*bar,conf['pad'],(-1)**j*.6)
        if conf['drum']:
            for pos in (0,.5):
                place(accents,drum(index*100+b),b*bar+pos*bar+.024,conf['drum']*(1 if pos==0 else .65),-.05)
            if conf['key']=='Number_Duel' and b%4==3:
                place(dry,pluck(notes[2],.7),b*bar+.83*bar,.032,.30)

        melody=list(LEADS[chord])
        if chord=='Dm' and b%4==3:
            melody=[(.024,74,.74)]
        if conf['key']=='Home' and section in (3,6) and b%4 in (1,2):
            melody=[]
        if conf['key']=='Battle':
            melody=melody[:1] if b%4 in (0,2) else []
        if conf['key']=='Number_Duel':
            melody=melody[:1] if b%4==0 else []
        if conf['key']=='Victory':
            motif=[[(.12,69,.25),(.45,72,.25),(.77,77,.32)],[(.15,76,.36),(.62,74,.34)],
                   [(.18,74,.35),(.62,77,.33)],[(.14,76,.26),(.48,72,.26),(.79,69,.45)]]
            melody=motif[b%4]
        if conf['key']=='Defeat':
            melody={0:[(.20,69,.40),(.68,65,.42)],1:[(.2,62,.66)],
                    3:[(.20,67,.42),(.65,64,.46)],4:[(.24,62,.66)],
                    6:[(.22,64,.5)],7:[(.12,62,.70)]}.get(b,[])
        for pos,note,length in melody:
            # Later home phrases vary direction without changing the palette.
            if conf['key']=='Home' and section in (2,5) and pos>.5:
                note=max(62,note-12)
            place(accents,flute(note,round(max(.4,length*bar),3)),b*bar+pos*bar,conf['flute'],.12)

    out=reverb(dry,conf['reverb'],7800+index)
    accents=reverb(accents,conf['reverb'],7800+index)
    return out,accents

def main():
    output=Path(__file__).resolve().parents[1]/'assets'/'soundscape'
    output.mkdir(parents=True,exist_ok=True)
    records={}
    with tempfile.TemporaryDirectory() as temp:
        for i,conf in enumerate(CONFIGS):
            # Defeat uses a short supportive cue followed by forest ambience.
            if conf['key']=='Defeat': continue
            key={'Number_Duel':'duel'}.get(conf['key'],conf['key'].lower())
            bed,accents=compose(conf,i)
            mix=bed+accents
            tempwav=Path(temp)/'mix.wav';wavfile.write(tempwav,SR,mix)
            check=subprocess.run(['ffmpeg','-hide_banner','-i',str(tempwav),'-af','loudnorm=I=-21:TP=-3:LRA=11:print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
            measured=json.loads(check.stderr[check.stderr.rfind('{'):])
            db=min(conf['lufs']-float(measured['input_i']),-6-float(measured['input_tp']))
            gain=10**(db/20)
            rec={'duration':conf['duration'],'bar':conf['bar'],'layers':{}}
            for name,audio in [('bed',bed),('accents',accents)]:
                audio*=gain
                assert np.isfinite(audio).all() and np.max(np.abs(audio))<.9
                wav=Path(temp)/f'{key}-{name}.wav';wavfile.write(wav,SR,np.int16(np.clip(audio,-1,1)*32767))
                target=output/f'{key}-{name}.mp3'
                subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(wav),'-ar','32000','-c:a','libmp3lame','-b:a','80k','-write_xing','1',str(target)],check=True)
                decoded=subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-i',str(target),'-f','f32le','-acodec','pcm_f32le','-'],capture_output=True,check=True).stdout
                samples=np.frombuffer(decoded,dtype=np.float32).reshape(-1,2)
                assert abs(len(samples)/32000-conf['duration'])<.002
                boundary=float(np.max(np.abs(samples[0]-samples[-1])))
                rec['layers'][name]={'file':target.name,'sha256':hashlib.sha256(target.read_bytes()).hexdigest(),'bytes':target.stat().st_size,'peak_dbfs':round(float(20*np.log10(np.max(np.abs(samples)))),2),'boundary_step':round(boundary,5)}
            records[key]=rec
            print(key,conf['duration'],sum(x['bytes'] for x in rec['layers'].values()),flush=True)
    (output/'manifest.json').write_text(json.dumps({'version':'forest-v2','sampleRate':32000,'tracks':records,'provenance':'Original synthesized compositions derived from the user-approved forest sketch. No external samples.','validation':'Decoded lengths, peaks and boundaries checked. Physical iPad listening still required.'},indent=2)+'\n')
if __name__=='__main__':main()
