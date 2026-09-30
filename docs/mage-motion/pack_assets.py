"""Package reviewed full frames; curve keys refer to the original 32 fps videos."""
from pathlib import Path
from PIL import Image, ImageDraw
import numpy as np
import json, math, sys
ROOT=Path(sys.argv[1]).resolve()
ACTORS=sys.argv[2:]
OLD=ROOT.parent/'game-combat-pilot'
OUT=Path(__file__).resolve().parents[2]/'assets/battle-motion'
OUT.mkdir(parents=True,exist_ok=True)
def arc(peak):return [[0,0],[.30,peak],[.52,peak],[1,0]]
spec={
'mage':{'cast':('mage-staff-solo-v1',[[0,0],[.10,16],[.22,48],[.30,64],[.64,64],[.78,40],[1,0]],48),'assistCast':('mage-staff-assist-v1',[[0,0],[.10,12],[.22,32],[.30,48],[.64,48],[.78,26],[1,0]],48),'hit':('mage-hit',arc(32),24),'defeat':('mage-defeat',[[0,0],[.8,52],[1,52]],24),'victory':('mage-victory',[[0,0],[.32,32],[.68,32],[1,0]],48)},
'golem':{'attack':('golem-attack',[[0,0],[.20,14],[.38,34],[.59,34],[1,0]],36),'hit':('golem-hit-v2',arc(24),24),'defeat':('golem-defeat',[[0,0],[.75,32],[1,32]],24),'victory':('golem-victory',[[0,0],[.25,20],[.62,20],[1,0]],48)},
'beetle':{'attack':('beetle-attack',[[0,0],[.18,8],[.65,58],[1,0]],36),'hit':('beetle-hit-v2',arc(10),24),'defeat':('beetle-defeat',[[0,0],[.8,48],[1,48]],24),'victory':('beetle-victory',[[0,0],[.35,40],[.65,40],[1,0]],48)},
'pip':{'fire':('pip-fire-v4',[[0,24],[.12,32],[.26,24],[.36,8],[.42,0],[.62,0],[.83,12],[1,24]],36)},
'thornling':{'attack':('thornling-attack-v2',[[0,0],[.24,20],[.59,50],[.67,52],[1,0]],36),'hit':('thornling-hit-v2',arc(26),24),'defeat':('thornling-defeat-v2',[[0,0],[.85,68],[1,68]],24),'victory':('thornling-victory-v2',[[0,0],[.4,80],[.63,104],[1,0]],48)}
}
points={'mage':{'spell':[172,89],'target':[260,276]},'golem':{'target':[240,245],'front':[94,335]},'beetle':{'target':[268,315],'front':[48,345]},'thornling':{'target':[218,255],'front':[58,305]},'pip':{'mouth':[413,267]}}
manifest=json.loads((OUT/'manifest.json').read_text()) if (OUT/'manifest.json').exists() else {}
selection={}
def get(source,index):
    directory=OLD if source.startswith('thornling') else ROOT
    im=Image.open(directory/(source+'-frames')/f'{index:03}.png').convert('RGBA')
    if source=='thornling-attack-v2':
        # Undo only this source's smaller input framing; preserve whole-frame motion.
        scale=424/314;im=im.resize((round(512*scale),round(512*scale)),Image.Resampling.LANCZOS)
        canvas=Image.new('RGBA',(512,512));canvas.paste(im,(round(46-112*scale),round(404-376*scale)));im=canvas
    if source.startswith('mage-staff-'):
        # Undo the whole-character input framing; leave room for the horizontal staff.
        im=im.resize((639,639),Image.Resampling.LANCZOS)
        canvas=Image.new('RGBA',(640,552));canvas.paste(im,(0,-90));im=canvas
    return im
for key in (ACTORS or spec.keys()):
    clips=spec[key];base=next(iter(clips.values()))[0]
    if key=='thornling':base='thornling-hit-v2'
    if key=='mage':base='mage-cast'
    rest=get(base,clips[next(iter(clips))][1][0][1] if key=='pip' else 0);box=rest.getchannel('A').point(lambda a:255 if a>100 else 0).getbbox();view=[box[0],box[1],box[2]-box[0],box[3]-box[1]]
    rest.save(OUT/(key+'-still.webp'),quality=94,method=6)
    record={'view':view,'still':'assets/battle-motion/'+key+'-still.webp',**points[key],'clips':{}}
    for action,(source,curve,n) in clips.items():
        if not (ROOT/(source+'-frames')).exists() and key!='thornling':
            print('Waiting for',source);continue
        indices=[round(np.interp(i/(n-1),[k[0] for k in curve],[k[1] for k in curve])) for i in range(n)]
        frames=[get(source,i) for i in indices];boxes=[im.getbbox() for im in frames]
        box=(max(0,min(b[0] for b in boxes)-2),max(0,min(b[1] for b in boxes)-2),min(frames[0].width,max(b[2] for b in boxes)+2),min(frames[0].height,max(b[3] for b in boxes)+2))
        w,h=box[2]-box[0],box[3]-box[1];tw,th=round(w*.8),round(h*.8);cols=6
        atlas=Image.new('RGBA',(cols*tw,math.ceil(n/cols)*th))
        for i,im in enumerate(frames):atlas.paste(im.crop(box).resize((tw,th),Image.Resampling.LANCZOS),((i%cols)*tw,(i//cols)*th))
        file=key+'-'+action+'.webp'
        atlas.save(OUT/file,quality=88,method=6)
        record['clips'][action]={'frames':n,'cols':cols,'perSheet':n,'tileW':tw,'tileH':th,'crop':[box[0],box[1],w,h],'sheets':['assets/battle-motion/'+file]}
        if key=='mage' and action in ('cast','assistCast'):
            record['clips'][action]['spell']=[475,189] if action=='cast' else [534,232]
        selection[key+'-'+action]={'source':source,'sourceIndices':indices,'curve':curve}
        thumb=Image.new('RGB',(256*6,280),(24,41,34))
        for j,i in enumerate([0,n//5,2*n//5,3*n//5,4*n//5,n-1]):
            im=frames[i].resize((256,256));thumb.paste(im,(j*256,0),im);ImageDraw.Draw(thumb).text((j*256+10,261),f'{key} {action} / {indices[i]}',fill='white')
        thumb.save(ROOT/(key+'-'+action+'-selected.jpg'))
    manifest[key]=record
(OUT/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
(OUT/'manifest.js').write_text('/* Static local assets; no generation services are contacted by the game. */\n(function(root){root.BlitzMotionAssets='+json.dumps(manifest,separators=(',',':'))+';})(typeof window==="object"?window:globalThis);\n')
old=json.loads((ROOT/'frame-selection.json').read_text()) if (ROOT/'frame-selection.json').exists() else {};old.update(selection)
(ROOT/'frame-selection.json').write_text(json.dumps(old,indent=2)+'\n')
print(json.dumps({'actors':list(manifest),'bytes':sum(p.stat().st_size for p in OUT.glob('*.webp'))}))
