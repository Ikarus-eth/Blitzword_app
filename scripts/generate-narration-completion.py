"""Generate the bounded narration request using the repository secret in Actions.
Existing approved public Pages recordings are only aligned. No automatic retries.
"""
import base64, concurrent.futures, hashlib, json, os, pathlib, shutil, sys, threading, urllib.request, urllib.error, uuid
ROOT=pathlib.Path(__file__).resolve().parent.parent
OUT=ROOT/'narration-output'; OUT.mkdir(exist_ok=True)
PLAN=json.loads((ROOT/'docs/NARRATION_COMPLETION_REQUEST.json').read_text())
KEY=os.environ['ELEVENLABS_API_KEY']
if not KEY: raise SystemExit('ELEVENLABS_API_KEY is empty')
if PLAN['voiceId']!='JBFqnCBsd6RMkjVDRZzb' or PLAN['characters']>40000 or len(PLAN['batches'])>220 or len(PLAN['alignments'])>402: raise SystemExit('Request exceeds approved scope')
# Recover committed paid outputs before any request. Validate identity and hashes.
for batch in PLAN['batches']:
    receipt=ROOT/'docs/narration-completion/receipts'/(batch['id']+'.json')
    audio=ROOT/'assets/narration'/('completion-'+batch['id']+'.mp3')
    if receipt.exists():
        saved=json.loads(receipt.read_text())
        if saved['text']!=batch['text'] or hashlib.sha256(audio.read_bytes()).hexdigest()!=saved['sha256']: raise SystemExit('Saved generation does not match request')
        dest=OUT/batch['id'];dest.mkdir(exist_ok=True);shutil.copyfile(receipt,dest/'receipt.json');shutil.copyfile(audio,dest/'audio.mp3')
for item in PLAN['alignments']:
    name='align-'+hashlib.sha256(item['text'].encode()).hexdigest()[:16]+'.json'
    receipt=ROOT/'docs/narration-completion/receipts'/name
    if receipt.exists():
        saved=json.loads(receipt.read_text())
        if saved['text']!=item['text'] or saved['sha256']!=item['sha256']: raise SystemExit('Saved alignment does not match request')
        shutil.copyfile(receipt,OUT/name)
STOP=threading.Event()
def request(endpoint,data,content_type):
    req=urllib.request.Request('https://api.elevenlabs.io/v1/'+endpoint,data=data,headers={'xi-api-key':KEY,'Content-Type':content_type},method='POST')
    try:
        with urllib.request.urlopen(req,timeout=180) as response:
            return json.load(response),response.headers.get('request-id')
    except urllib.error.HTTPError as error:
        detail=error.read().decode('utf-8',errors='replace').replace(KEY,'[redacted]')
        raise RuntimeError('ElevenLabs HTTP '+str(error.code)+': '+detail[:1200]) from None

def generate(batch):
    dest=OUT/batch['id'];dest.mkdir(exist_ok=True)
    if (dest/'receipt.json').exists(): return
    response,request_id=request('text-to-speech/'+PLAN['voiceId']+'/with-timestamps?output_format=mp3_44100_128',json.dumps({'text':batch['text'],'model_id':PLAN['model'],'voice_settings':PLAN['settings']}).encode(),'application/json')
    audio=base64.b64decode(response.pop('audio_base64'),validate=True)
    (dest/'audio.mp3').write_bytes(audio)
    response.update(requestId=request_id,sha256=hashlib.sha256(audio).hexdigest(),text=batch['text'])
    (dest/'receipt.json').write_text(json.dumps(response))
    print('Generated '+batch['id'],flush=True)

def align(item):
    ident='align-'+hashlib.sha256(item['text'].encode()).hexdigest()[:16];dest=OUT/(ident+'.json')
    if dest.exists(): return
    audio=(ROOT/item['file']).read_bytes()
    if hashlib.sha256(audio).hexdigest()!=item['sha256']: raise RuntimeError('Approved audio hash changed: '+item['file'])
    boundary='BlitzWord'+uuid.uuid4().hex
    data=(('--'+boundary+'\r\nContent-Disposition: form-data; name="text"\r\n\r\n'+item['text']+'\r\n--'+boundary+'\r\nContent-Disposition: form-data; name="file"; filename="clip.mp3"\r\nContent-Type: audio/mpeg\r\n\r\n').encode()+audio+('\r\n--'+boundary+'--\r\n').encode())
    response,request_id=request('forced-alignment',data,'multipart/form-data; boundary='+boundary)
    response.update(text=item['text'],file=item['file'],sha256=item['sha256'],requestId=request_id)
    dest.write_text(json.dumps(response))
    print('Aligned '+ident,flush=True)

def work(job):
    if STOP.is_set(): return
    try: job[0](job[1])
    except Exception as error:
        STOP.set();print(str(error).replace(KEY,'[redacted]'),file=sys.stderr,flush=True);raise

generate(PLAN['batches'][0]);align(PLAN['alignments'][0])
jobs=[(generate,b) for b in PLAN['batches'][1:]]+[(align,a) for a in PLAN['alignments'][1:]]
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
    for _ in pool.map(work,jobs): pass
print('Generation and forced alignment complete.',flush=True)
