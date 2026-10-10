"""Bounded words-only generation using a fal.ai key from the process environment.

Never resubmit an uncertain request. Save request IDs before polling and preserve
every paid output before validation. No account/plan changes or paid retries.
"""
import concurrent.futures, hashlib, json, os, pathlib, shutil, subprocess, threading, time
from urllib.parse import urlparse
from urllib.request import Request, urlopen

ROOT=pathlib.Path(__file__).resolve().parent.parent
PLAN=json.loads((ROOT/'docs/NARRATION_WORDS_FAL_REQUEST.json').read_text())
OUT=ROOT/'narration-words-fal-output';OUT.mkdir(exist_ok=True)
MODEL='fal-ai/elevenlabs/tts/multilingual-v2'
assert PLAN['model']==MODEL and PLAN['voice']=='onwK4e9ZLuTAKqWW03F9'
assert len(PLAN['items'])==675 and len({i['key'] for i in PLAN['items']})==675
assert sum(len(i['text']) for i in PLAN['items'])==PLAN['characters']==4471
assert PLAN['characters']<=PLAN['maxCharacters']
assert all(shutil.which(b) for b in ['ffmpeg','ffprobe']), 'Audio tools required before generation'
KEY=os.environ.get('FAL_KEY')
if not KEY:raise SystemExit('Missing FAL_KEY environment variable')
lock=threading.Lock();stop=threading.Event()
ledger=OUT/'requests.json'
records=json.loads(ledger.read_text())['requests'] if ledger.exists() else {}
def save():
 with lock:
  tmp=ledger.with_suffix('.tmp');tmp.write_text(json.dumps({'model':MODEL,'voice':PLAN['voice'],'plannedCharacters':PLAN['characters'],'requests':records},indent=2)+'\n');tmp.replace(ledger)
def update(identity,**values):
 with lock:records.setdefault(identity,{}).update(values)
 save()
def api(url,payload=None):
 if urlparse(url).scheme!='https' or urlparse(url).hostname!='queue.fal.run':raise ValueError('Unexpected authenticated API host')
 request=Request(url,data=None if payload is None else json.dumps(payload).encode(),headers={'Authorization':'Key '+KEY,'Content-Type':'application/json'})
 with urlopen(request,timeout=90) as r:return json.load(r)
def generate(item):
 identity=item['id'];dest=OUT/(identity+'.mp3')
 if stop.is_set():return
 try:
  existing=records.get(identity)
  if existing and (existing.get('key')!=item['key'] or existing.get('text')!=item['text']):raise ValueError('Receipt belongs to different text')
  if existing and existing.get('state')=='validated':
   assert dest.exists() and hashlib.sha256(dest.read_bytes()).hexdigest()==existing['sha256'];return
  if existing:
   if not existing.get('request_id'):raise RuntimeError('Uncertain submission; inspect provider history before any resubmission')
   queued=existing
  else:
   update(identity,state='submitting',key=item['key'],text=item['text'],characters=len(item['text']))
   queued=api('https://queue.fal.run/'+MODEL,dict(PLAN['settings'],text=item['text'],voice=PLAN['voice'],timestamps=True))
   update(identity,**queued,state='queued')
  deadline=time.monotonic()+600
  while time.monotonic()<deadline:
   status=api(queued['status_url'])
   if status.get('status')=='COMPLETED':break
   time.sleep(2)
  else:raise TimeoutError('Request still pending; recover saved request ID')
  result=api(queued['response_url']);(OUT/(identity+'.json')).write_text(json.dumps(result)+'\n')
  url=result['audio']['url'];host=urlparse(url).hostname or ''
  if urlparse(url).scheme!='https' or not (host=='fal.media' or host.endswith('.fal.media')):raise ValueError('Unexpected audio CDN')
  with urlopen(url,timeout=90) as r:data=r.read(5_000_001)
  if not 1000<len(data)<=5_000_000:raise ValueError('Invalid audio size')
  dest.write_bytes(data);update(identity,state='downloaded',bytes=len(data),sha256=hashlib.sha256(data).hexdigest())
  probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration:stream=codec_name','-of','json',str(dest)],text=True))
  duration=float(probe['format']['duration']);assert probe['streams'][0]['codec_name']=='mp3'
  assert .2<duration<20,'Implausible duration'
  subprocess.run(['ffmpeg','-v','error','-i',str(dest),'-f','null','-'],check=True)
  update(identity,state='validated',duration=duration)
  print(identity+' '+item['key']+': validated',flush=True)
 except Exception as e:
  stop.set();update(identity,state='needs-review',error=type(e).__name__,httpStatus=getattr(e,'code',None))
  print(identity+': stopped for review ('+type(e).__name__+')',flush=True)

save()
# One early probe verifies the model, voice, secret and download before the rest.
generate(PLAN['items'][0])
if not stop.is_set():
 with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:list(pool.map(generate,PLAN['items'][1:]))
if len(records)!=675 or any(r.get('state')!='validated' for r in records.values()):
 raise SystemExit('Incomplete; inspect saved request IDs and paid output. Do not blindly rerun.')
summary={'provider':'fal.ai','model':MODEL,'voice':PLAN['voice'],'characters':PLAN['characters'],'estimatedUSD':PLAN['estimatedUSD'],'status':'complete','clips':{}}
for item in PLAN['items']:
 r=records[item['id']];summary['clips'][item['key']]={'file':'assets/narration/'+item['id']+'.mp3','duration':r['duration'],'sha256':r['sha256']}
(OUT/'generation.json').write_text(json.dumps(summary,indent=2)+'\n')
print('Complete: 675 clips, 4471 characters; estimate $0.4471, not an invoice.',flush=True)
