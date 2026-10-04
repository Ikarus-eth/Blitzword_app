"""Bounded, resumable generation. Runs only in Actions with the repository secret.
No retries and no account/plan changes. Successful paid outputs survive errors.
"""
import base64, hashlib, json, os, pathlib, shutil, subprocess, sys, urllib.request, urllib.error
ROOT=pathlib.Path(__file__).resolve().parent.parent
MODE=sys.argv[1] if len(sys.argv)>1 else 'budget'
CONFIG={'budget':('NARRATION_BUDGET_REQUEST.json','narration-budget',8000),'story-riddle':('NARRATION_STORY_RIDDLE_REQUEST.json','narration-story-riddle',6000)}
assert MODE in CONFIG,'Unknown narration scope'
request_file,folder,cap=CONFIG[MODE]
PLAN=json.loads((ROOT/'docs'/request_file).read_text())
OUT=ROOT/(folder+'-output');OUT.mkdir(exist_ok=True)
KEY=os.environ['ELEVENLABS_API_KEY']
assert KEY and PLAN['voiceId']=='JBFqnCBsd6RMkjVDRZzb'
assert PLAN['model']=='eleven_multilingual_v2' and PLAN['characters']<=cap
assert all(shutil.which(binary) for binary in ['ffmpeg','ffprobe']),'Audio validation tools must exist before any paid request'
assert sum(len(b['text']) for b in PLAN['batches'])==PLAN['characters']
def request(endpoint,data=None):
 req=urllib.request.Request('https://api.elevenlabs.io/v1/'+endpoint,data=None if data is None else json.dumps(data).encode(),headers={'xi-api-key':KEY,'Content-Type':'application/json'})
 try:
  with urllib.request.urlopen(req,timeout=180) as response:return json.load(response),response.headers.get('request-id')
 except urllib.error.HTTPError as e:
  raise RuntimeError('ElevenLabs HTTP '+str(e.code)+': '+e.read().decode(errors='replace').replace(KEY,'[redacted]')[:1200]) from None
def allowance():
 try:
  value,_=request('user/subscription');return {k:value.get(k) for k in ['character_count','character_limit','next_character_count_reset_unix']}
 except Exception as e:
  print('Allowance endpoint unavailable; generation will respect provider limits. '+str(e),flush=True);return None
before=allowance();print('Allowance before: '+json.dumps(before),flush=True)
existing={};missing=[]
for b in PLAN['batches']:
 receipt=ROOT/'docs'/folder/'receipts'/(b['id']+'.json');audio=ROOT/'assets/narration'/(b['id']+'.mp3')
 if receipt.exists():
  r=json.loads(receipt.read_text());assert r['text']==b['text'] and hashlib.sha256(audio.read_bytes()).hexdigest()==r['sha256'];existing[b['id']]=r
 else:missing.append(b)
needed=sum(len(b['text']) for b in missing)
if before and all(isinstance(before.get(k),int) for k in ['character_count','character_limit']):
 if before['character_limit']-before['character_count']<needed:raise SystemExit('Insufficient allowance for bounded batch: need '+str(needed)+' characters; no generation started.')
summary={'voiceId':PLAN['voiceId'],'model':PLAN['model'],'settings':PLAN['settings'],'charactersRequested':0,'before':before,'batches':[],'clips':{},'status':'incomplete'}
def save(): (OUT/'generation.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n')
save()
for b in PLAN['batches']:
 dest=OUT/b['id'];dest.mkdir(exist_ok=True)
 if b['id'] in existing:
  r=existing[b['id']];audio=(ROOT/'assets/narration'/(b['id']+'.mp3')).read_bytes()
 else:
  r,request_id=request('text-to-speech/'+PLAN['voiceId']+'/with-timestamps?output_format=mp3_44100_128',{'text':b['text'],'model_id':PLAN['model'],'voice_settings':PLAN['settings']})
  audio=base64.b64decode(r.pop('audio_base64'),validate=True)
  r.update(requestId=request_id,text=b['text'],sha256=hashlib.sha256(audio).hexdigest())
  summary['charactersRequested']+=len(b['text'])
 (dest/'audio.mp3').write_bytes(audio);(dest/'receipt.json').write_text(json.dumps(r,ensure_ascii=False)+'\n');save()
 # Preserve raw paid output before validation, even if the alignment needs repair.
 probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration:stream=codec_name','-of','json',str(dest/'audio.mp3')],text=True))
 assert probe['streams'][0]['codec_name']=='mp3'
 duration=float(probe['format']['duration'])
 subprocess.run(['ffmpeg','-v','error','-i',str(dest/'audio.mp3'),'-f','null','-'],check=True)
 a=r['alignment'];chars=a['characters'];starts=a['character_start_times_seconds'];ends=a['character_end_times_seconds']
 assert ''.join(chars)==b['text'] and len(chars)==len(starts)==len(ends)
 assert all(len(c)==1 for c in chars) and all(0<=s<=e for s,e in zip(starts,ends))
 assert all(a<=b+.001 for a,b in zip(starts,starts[1:]))
 ranges=[];cursor=0
 for s in b['segments']:ranges.append((cursor,cursor+len(s['text']),s));cursor+=len(s['text'])+2
 cuts=[0]+[(ends[left[1]-1]+starts[right[0]])/2 for left,right in zip(ranges,ranges[1:])]+[duration]
 for i,(start,end,s) in enumerate(ranges):
  offset=cuts[i];length=cuts[i+1]-offset
  assert length>.15 and starts[start]>=offset-.001 and ends[end-1]<=offset+length+.001,s['text']
  summary['clips'][s['key']]={'file':'assets/narration/'+b['id']+'.mp3','offset':round(offset,4),'duration':round(length,4),'sha256':r['sha256']}
 summary['batches'].append({'id':b['id'],'duration':duration,'sha256':r['sha256'],'requestId':r.get('requestId'),'characters':len(b['text']),'segments':len(b['segments'])})
 save();print('Validated '+b['id']+' ('+str(len(b['segments']))+' segments)',flush=True)
summary.update(status='complete',after=allowance());save()
print('Complete: '+str(summary['charactersRequested'])+' text characters submitted.',flush=True)
