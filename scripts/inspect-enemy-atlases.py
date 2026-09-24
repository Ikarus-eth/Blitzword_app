"""Read generated alpha atlases and record cell crop bounds; never redraw artwork."""
import json
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
jobs = json.loads((ROOT / 'docs/enemies/generation-prompts.json').read_text())
result = {}
for job in jobs:
    path = ROOT / 'assets/enemies/layered' / (job['id'] + '.png')
    if not path.exists():
        continue
    im = Image.open(path)
    if im.mode != 'RGBA' or im.getchannel('A').getextrema() != (0, 255):
        raise ValueError(f'{job["id"]}: missing genuine alpha')
    alpha = im.getchannel('A')
    width, height = im.size
    # Locate narrow transparent gutters near each expected quarter division.
    def dividers(size, vertical):
        output = [0]
        for fraction in (1, 2, 3):
            center = round(size * fraction / 4)
            radius = round(size * .025)
            def weight(pos):
                crop = alpha.crop((pos,0,pos+1,height) if vertical else (0,pos,width,pos+1))
                hist = crop.histogram()
                return sum(n * v for v,n in enumerate(hist)) + abs(pos-center)*.1
            output.append(min(range(center-radius, center+radius+1), key=weight))
        return output + [size]
    xs, ys = dividers(width, True), dividers(height, False)
    cells = []
    for row in range(4):
        for col in range(4):
            box = (xs[col], ys[row], xs[col+1], ys[row+1])
            tile = alpha.crop(box)
            opaque = tile.point(lambda v: 255 if v > 30 else 0)
            bounds = opaque.getbbox()
            if not bounds:
                raise ValueError(f'{job["id"]}: empty cell {row*4+col}')
            # Ignore tiny disconnected scraps from a neighbouring cell when
            # choosing the viewport. The PNG itself remains completely intact.
            pixels = opaque.tobytes()
            tw, th = opaque.size
            visited = bytearray(tw*th)
            components = []
            for seed,value in enumerate(pixels):
                if not value or visited[seed]:
                    continue
                stack=[seed];visited[seed]=1;area=0
                left=right=seed%tw;top=bottom=seed//tw
                while stack:
                    p=stack.pop();x=p%tw;y=p//tw;area+=1
                    left=min(left,x);right=max(right,x);top=min(top,y);bottom=max(bottom,y)
                    neighbours=[]
                    if x: neighbours.append(p-1)
                    if x<tw-1: neighbours.append(p+1)
                    if y: neighbours.append(p-tw)
                    if y<th-1: neighbours.append(p+tw)
                    for n in neighbours:
                        if pixels[n] and not visited[n]:visited[n]=1;stack.append(n)
                components.append((area,left,top,right+1,bottom+1))
            largest=max(c[0] for c in components)
            keep=[c for c in components if c[0]>=max(25,largest*.025)]
            bounds=(min(c[1] for c in keep),min(c[2] for c in keep),max(c[3] for c in keep),max(c[4] for c in keep))
            x1,y1,x2,y2 = bounds
            cells.append([box[0]+x1,box[1]+y1,x2-x1,y2-y1])
    result[job['id']] = {'name':job['name'],'selection':job['selection'],'rig':job['rig'],
        'source':'assets/enemies/layered/'+path.name,'width':width,'height':height,'cells':cells}
(ROOT / 'enemy-art-data.js').write_text('/* Generated crop metadata; original RGBA art is preserved. */\n(function(root){const data='+json.dumps(result,separators=(',',':'))+';if(typeof module!=="undefined"&&module.exports)module.exports=data;root.BlitzEnemyArtData=data;})(typeof window!=="undefined"?window:globalThis);\n')
print(f'Inspected {len(result)} alpha atlases / {len(result)*16} image regions')
