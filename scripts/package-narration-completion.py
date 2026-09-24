"""Validate provider output and stage generated audio without changing old MP3s.
Use --apply only after every requested clip and alignment is present.
"""
import argparse,hashlib,json,pathlib,re,shutil,subprocess
ROOT=pathlib.Path(__file__).resolve().parent.parent
parser=argparse.ArgumentParser();parser.add_argument('raw_directory',type=pathlib.Path);parser.add_argument('--apply',action='store_true');args=parser.parse_args()
plan=json.loads((ROOT/'docs/NARRATION_COMPLETION_REQUEST.json').read_text())
receipts=ROOT/'docs/narration-completion/receipts';receipts.mkdir(parents=True,exist_ok=True)
clips={};alignments={};batches=[];missing=[]

def digest(data):return hashlib.sha256(data).hexdigest()
def probe(file):
 result=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration:stream=codec_name,sample_rate,channels','-of','json',str(file)],text=True))
 assert result['streams'][0]['codec_name']=='mp3',str(file)
 return float(result['format']['duration'])
def words(text,chars,starts,ends,offset=0):
 assert ''.join(chars)==text,'Alignment transcript mismatch: '+text
 assert len(chars)==len(starts)==len(ends)
 assert all(0<=start<=end for start,end in zip(starts,ends))
 assert all(a<=b+.001 for a,b in zip(starts,starts[1:]))
 # Provider arrays use one character per entry for this English corpus.
 assert all(len(c)==1 for c in chars)
 return [{'charIndex':m.start(),'charLength':m.end()-m.start(),'start':round(starts[m.start()]-offset,4),'end':round(ends[m.end()-1]-offset,4)} for m in re.finditer(r"[A-Za-z]+(?:['’][A-Za-z]+)*",text)]

for batch in plan['batches']:
 directory=args.raw_directory/batch['id'];receipt=directory/'receipt.json'
 if not receipt.exists():missing.append(batch['id']);continue
 r=json.loads(receipt.read_text());audio=(directory/'audio.mp3').read_bytes();assert digest(audio)==r['sha256'];assert r['text']==batch['text']
 file='assets/narration/completion-'+batch['id']+'.mp3';dest=ROOT/file;dest.write_bytes(audio);duration=probe(dest)
 a=r['alignment'];chars=a['characters'];starts=a['character_start_times_seconds'];ends=a['character_end_times_seconds'];words(batch['text'],chars,starts,ends)
 cursor=0;ranges=[]
 for item in batch['clips']:
  ranges.append((cursor,cursor+len(item['text']),item));cursor+=len(item['text'])+2
 cuts=[0]+[(ends[left[1]-1]+starts[right[0]])/2 for left,right in zip(ranges,ranges[1:])]+[duration]
 for i,(start,end,item) in enumerate(ranges):
  offset=cuts[i];length=cuts[i+1]-offset;assert length>.2
  timed=words(item['text'],chars[start:end],starts[start:end],ends[start:end],offset)
  assert all(0<=w['start']<w['end']<=length+.05 for w in timed),item['text']
  clips[item['text']]={'file':file,'offset':round(offset,4),'duration':round(length,4),'sha256':r['sha256'],'words':timed}
 batches.append({'id':batch['id'],'file':file,'duration':duration,'sha256':r['sha256'],'requestId':r['requestId'],'clipCount':len(batch['clips'])})
 (receipts/(batch['id']+'.json')).write_text(json.dumps({k:v for k,v in r.items() if k!='normalized_alignment'},ensure_ascii=False,separators=(',',':'))+'\n')
for item in plan['alignments']:
 ident='align-'+digest(item['text'].encode())[:16];file=args.raw_directory/(ident+'.json')
 if not file.exists():missing.append(ident);continue
 r=json.loads(file.read_text());assert r['text']==item['text'] and r['sha256']==item['sha256'];assert digest((ROOT/item['file']).read_bytes())==item['sha256']
 chars=r['characters'];timed=words(item['text'],[x['text'] for x in chars],[x['start'] for x in chars],[x['end'] for x in chars]);duration=probe(ROOT/item['file'])
 assert all(0<=w['start']<w['end']<=duration+.05 for w in timed)
 alignments[item['text']]=timed
 (receipts/(ident+'.json')).write_text(json.dumps(r,ensure_ascii=False,separators=(',',':'))+'\n')
record={'provider':'ElevenLabs','voiceId':plan['voiceId'],'model':plan['model'],'settings':plan['settings'],'status':'complete' if not missing else 'incomplete','expectedClips':plan['clipCount'],'stagedClips':len(clips),'expectedAlignments':len(plan['alignments']),'stagedAlignments':len(alignments),'batches':batches,'clips':clips,'alignments':alignments,'missing':missing,'listeningReview':'New audio has not received user listening approval.'}
(ROOT/'docs/NARRATION_COMPLETION_GENERATION.json').write_text(json.dumps(record,ensure_ascii=False,indent=2)+'\n')
if args.apply:
 if missing:raise SystemExit('Cannot apply incomplete narration: '+str(len(missing))+' requests missing')
 # Keep every old entry and file; add only missing text and verified timing metadata.
 source=ROOT/'narration.js';text=source.read_text();a=text.index('const narration=')+len('const narration=');b=text.index(';\nif(typeof module',a);manifest=json.loads(text[a:b])
 for text,clip in clips.items():
  assert text not in manifest['clips'];manifest['clips'][text]=clip
 for text,timing in alignments.items():manifest['clips'][text]['words']=timing
 manifest.update(version='recorded-voice-20260924-r6',recordedClipCount=len(manifest['clips']),runtimeClipCount=len(manifest['clips']))
 source.write_text('(function(root){\nconst narration='+json.dumps(manifest,ensure_ascii=False,indent=2)+";\nif(typeof module==='object'&&module.exports)module.exports=narration;else root.BlitzNarration=narration;\n})(typeof globalThis!=='undefined'?globalThis:this);\n")
print(json.dumps({k:record[k] for k in ['status','expectedClips','stagedClips','expectedAlignments','stagedAlignments']}))
