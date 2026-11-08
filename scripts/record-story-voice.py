#!/usr/bin/env python3
"""Record tap-to-hear story clips with Kokoro-82M on the free GitHub runner (8 November 2026).

Same method as the Right Reader spelling app: Kokoro runs locally on the Actions machine, so it costs
nothing, and a local Whisper model then listens to every single-word clip. No paid API is called.

Usage (GitHub Actions only): python3 scripts/record-story-voice.py docs/adventures/<story>/voice-request.json
The request lists {id, text} items. Words are read as a short sentence ("dragon.") a little slower, so the
last sound is not swallowed. Output: one MP3 per item plus a manifest script the game loads.
"""
import hashlib, json, re, subprocess, sys, tempfile
from pathlib import Path
import numpy as np
import soundfile as sf
from kokoro import KPipeline

req_path = Path(sys.argv[1])
if len(sys.argv) != 2 or not str(req_path).startswith('docs/adventures/') or req_path.suffix != '.json':
    raise SystemExit('Pass one voice request under docs/adventures/.')
req = json.loads(req_path.read_text())
VOICE, CAMPAIGN, OUT = req['voice'], req['campaign'], Path(req['output'])
OUT.mkdir(parents=True, exist_ok=True)
pipe = KPipeline(lang_code='b' if VOICE.startswith('b') else 'a', repo_id='hexgrad/Kokoro-82M')
# Kokoro reads some names oddly; the text it is given can differ from the word on screen.
SAY = req.get('say', {})


def synth(text, speed):
    parts = []
    for r in pipe(text, voice=VOICE, speed=speed):
        a = getattr(r, 'audio', None)
        if a is None and isinstance(r, (tuple, list)):
            a = r[2]
        if a is not None:
            parts.append(a.detach().cpu().numpy() if hasattr(a, 'detach') else np.asarray(a))
    return np.concatenate(parts)


def to_mp3(audio, dest):
    with tempfile.NamedTemporaryFile(suffix='.wav') as tmp:
        sf.write(tmp.name, audio, 24000)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp.name, '-ac', '1',
                        '-af', 'silenceremove=start_periods=1:start_threshold=-60dB,areverse,'
                               'silenceremove=start_periods=1:start_threshold=-60dB,areverse,apad=pad_dur=0.15',
                        '-b:a', '64k', str(dest)], check=True)


clips = {}
for n, item in enumerate(req['items'], 1):
    word = item['id'].startswith('w:')
    text = SAY.get(item['id'], item['text'])
    spoken = text if not word or text.endswith(('.', '!', '?')) else text + '.'
    audio = synth(spoken, 0.9 if word else 0.95)
    slug = re.sub(r'[^a-z0-9]+', '-', item['id'].lower()).strip('-')[:40]
    tag = hashlib.sha256((VOICE + '|' + spoken).encode()).hexdigest()[:8]
    dest = OUT / f'{slug}-{tag}.mp3'
    to_mp3(audio, dest)
    data = dest.read_bytes()
    clips[f'story:{CAMPAIGN}:{item["id"]}'] = {'file': str(dest), 'text': item['text'], 'sha256': hashlib.sha256(data).hexdigest()}
    if n % 50 == 0:
        print(f'{n} of {len(req["items"])} recorded', flush=True)

# Old clips from an earlier run are removed, so the folder holds exactly the manifest.
keep = {Path(c['file']).name for c in clips.values()}
for f in OUT.glob('*.mp3'):
    if f.name not in keep:
        f.unlink()
manifest = {'version': req['version'], 'voice': 'Kokoro-82M ' + VOICE + ' (local, free)', 'campaign': CAMPAIGN, 'clips': clips}
(OUT / 'manifest.js').write_text(
    '(function(root){const voice=' + json.dumps(manifest, indent=1, ensure_ascii=False) + ';\n'
    'if(typeof module===\'object\'&&module.exports)module.exports=voice;else{root.BlitzStoryVoice=root.BlitzStoryVoice||{clips:{}};Object.assign(root.BlitzStoryVoice.clips,voice.clips);}\n'
    '})(typeof globalThis!==\'undefined\'?globalThis:this);\n')
print(f'recorded {len(clips)} clips with {VOICE}')

# Listening check: Whisper (base.en, local) hears every single-word clip.
from faster_whisper import WhisperModel
model = WhisperModel('base.en', device='cpu', compute_type='int8')
HOMO = [{'know', 'no'}, {'its', "it's"}, {'their', 'there'}, {'one', 'won'}, {'two', 'to', 'too'}, {'piece', 'peace'},
        {'wait', 'weight'}, {'hole', 'whole'}, {'heard', 'herd'}, {'eight', 'ate'}, {'right', 'write'}, {'sea', 'see'},
        {'tail', 'tale'}, {'by', 'buy', 'bye'}, {'for', 'four'}, {'new', 'knew'}, {'son', 'sun'}, {'hear', 'here'},
        {'red', 'read'}, {'blue', 'blew'}, {'night', 'knight'}, {'flies', 'flys'}, {'may', 'mae'}, {'sam', 'sem'}]
flat = lambda s: re.sub(r'[^a-z]', '', s.lower())
rows = []
for cid, clip in clips.items():
    if ':w:' not in cid:
        continue
    segs, _ = model.transcribe(clip['file'], language='en', beam_size=5, condition_on_previous_text=False, without_timestamps=True)
    segs = list(segs)
    heard = ' '.join(s.text for s in segs).strip()
    w = clip['text']
    ok = flat(heard) == flat(w) or any(flat(w) in {flat(x) for x in g} and flat(heard) in {flat(x) for x in g} for g in HOMO) \
        or flat(w) in [flat(t) for t in heard.split()]
    rows.append({'id': cid, 'word': w, 'heard': heard, 'match': ok,
                 'confidence': round(min((s.avg_logprob for s in segs), default=-9.0), 3)})
report = {'voice': VOICE, 'checked': len(rows), 'matched': sum(r['match'] for r in rows),
          'mismatches': [r for r in rows if not r['match']], 'words': rows}
Path(req_path.parent / 'voice-asr-report.json').write_text(json.dumps(report, indent=1, ensure_ascii=False))
print(f'word clips heard correctly: {report["matched"]} of {len(rows)}')
print('not matched:', ', '.join(f'{r["word"]}→{r["heard"]!r}' for r in report['mismatches']))
