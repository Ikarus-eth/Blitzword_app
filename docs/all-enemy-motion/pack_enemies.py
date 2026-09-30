from pathlib import Path
from PIL import Image,ImageDraw
from concurrent.futures import ThreadPoolExecutor
import json,math,numpy as np,sys
ROOT=Path(sys.argv.pop(1)).resolve();OUT=Path(__file__).resolve().parents[2]/'assets/battle-motion'
config=json.loads((ROOT/'reviewed-selection.json').read_text());specs=json.loads((ROOT/'enemy-specs.json').read_text())
def build(item):
 key,selection=item;clips={};provenance={};motionBounds=[];rest=Image.open(ROOT/((selection['attack'].get('source',key+'-attack') if isinstance(selection['attack'],dict) else key+'-attack')+'-frames')/'000.png').convert('RGBA');box=rest.getchannel('A').point(lambda a:255 if a>100 else 0).getbbox();x,y,right,bottom=box;w,h=right-x,bottom-y
 rest.save(OUT/(key+'-still.webp'),quality=92,method=4)
 mode=specs[key]['mode'];record={'view':[x,y,w,h],'still':'assets/battle-motion/'+key+'-still.webp','attackMode':mode,'family':key,'target':[round(x+.43*w),round(y+.52*h)],'front':[round(x+.2*w),round(y+.48*h)],'clips':clips}
 contact=Image.new('RGB',(1280,1120),(24,40,31));d=ImageDraw.Draw(contact)
 for row,action in enumerate(['attack','hit','defeat','victory']):
  value=selection[action];source=value.get('source',key+'-'+action) if isinstance(value,dict) else key+'-'+action;peak=value['peak'] if isinstance(value,dict) else value
  if action=='attack':curve=[[0,0],[.16,round(peak*.18)],[.36 if mode!='melee' else .50,peak],[.60,peak],[1,0]];n=36
  elif action=='hit':curve=[[0,0],[.30,peak],[.50,peak],[1,0]];n=24
  elif action=='defeat':curve=[[0,0],[.82,peak],[1,peak]];n=24
  else:curve=[[0,0],[.37,peak],[.65,peak],[1,0]];n=40
  indices=[round(np.interp(i/(n-1),[p[0] for p in curve],[p[1] for p in curve])) for i in range(n)];unique=list(dict.fromkeys(indices));sequence=[unique.index(i) for i in indices];frames=[Image.open(ROOT/(source+'-frames')/f'{i:03}.png').convert('RGBA') for i in unique];boxes=[im.getbbox() for im in frames];motionBounds.extend(im.getchannel('A').point(lambda a:255 if a>100 else 0).getbbox() for im in frames)
  crop=(max(0,min(b[0] for b in boxes)-2),max(0,min(b[1] for b in boxes)-2),min(512,max(b[2] for b in boxes)+2),min(512,max(b[3] for b in boxes)+2));cw,ch=crop[2]-crop[0],crop[3]-crop[1];ratio=min(.8,300/max(cw,ch));tw,th=round(cw*ratio),round(ch*ratio);cols=min(6,len(unique));atlas=Image.new('RGBA',(cols*tw,math.ceil(len(unique)/cols)*th))
  for i,im in enumerate(frames):atlas.paste(im.crop(crop).resize((tw,th),Image.Resampling.LANCZOS),((i%cols)*tw,(i//cols)*th))
  name=key+'-'+action+'.webp';atlas.save(OUT/name,quality=87,method=4)
  clips[action]={'frames':n,'cols':cols,'perSheet':len(unique),'tileW':tw,'tileH':th,'crop':[crop[0],crop[1],cw,ch],'sequence':sequence,'sheets':['assets/battle-motion/'+name]}
  provenance[action]={'source':source,'peak':peak,'sourceIndices':indices,'uniqueSourceIndices':unique,'curve':curve}
  if action=='attack' and mode=='melee':
   b=frames[unique.index(peak)].getchannel('A').point(lambda a:255 if a>140 else 0).getbbox();record['front']=[round(b[0]+.16*(b[2]-b[0])),round(b[1]+.50*(b[3]-b[1]))]
  for col,k in enumerate([0,n//4,n//2,3*n//4,n-1]):
   im=frames[sequence[k]].resize((256,256));contact.paste(im,(col*256,row*280),im);d.text((col*256+6,row*280+258),action+' '+str(indices[k]),fill='white')
 envelope=[box]+motionBounds;left=min(b[0] for b in envelope);top=min(b[1] for b in envelope);right=max(b[2] for b in envelope);bottom=max(b[3] for b in envelope);record['view']=[left,top,right-left,bottom-top]
 contact.save(ROOT/(key+'-selected.jpg'),quality=89)
 return key,record,provenance
manifest=json.loads((OUT/'manifest.json').read_text());selected={}
items=[(k,v) for k,v in config.items() if not sys.argv[1:] or k in sys.argv[1:]]
with ThreadPoolExecutor(max_workers=3) as pool:
 for key,record,provenance in pool.map(build,items):manifest[key]=record;selected[key]=provenance;print(key+' packed',flush=True)
(OUT/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n');(OUT/'manifest.js').write_text('/* Local pre-generated artwork; no runtime API calls. */\n(function(root){root.BlitzMotionAssets='+json.dumps(manifest,separators=(',',':'))+';})(typeof window==="object"?window:globalThis);\n')
p=ROOT/'packed-selection.json';old=json.loads(p.read_text()) if p.exists() else {};old.update(selected);p.write_text(json.dumps(old,indent=2)+'\n')
