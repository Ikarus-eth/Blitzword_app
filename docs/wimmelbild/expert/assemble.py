import sys,json,hashlib
import cv2,numpy as np
from PIL import Image
from pathlib import Path
root=Path(sys.argv[1]);mid=root.name
paths=json.loads((root/'paths.json').read_text());s=4;W,H=6144,4096;tw,th=1728,1152
canvas=np.zeros((H,W,3),np.float32);weights=np.zeros((H,W),np.float32);report=[]
for i,path in enumerate(paths):
 ref=np.array(Image.open(root/f'crop-{i:02}.png').convert('RGB'))
 gen=np.array(Image.open(path).convert('RGB').resize((tw,th),Image.Resampling.LANCZOS))
 small=cv2.resize(gen,(432,288),interpolation=cv2.INTER_AREA)
 sift=cv2.SIFT_create(nfeatures=3000)
 kr,dr=sift.detectAndCompute(cv2.cvtColor(ref,cv2.COLOR_RGB2GRAY),None);kg,dg=sift.detectAndCompute(cv2.cvtColor(small,cv2.COLOR_RGB2GRAY),None)
 good=[a for a,b in cv2.BFMatcher().knnMatch(dg,dr,k=2) if a.distance<.75*b.distance]
 matrix=None
 if len(good)>8:
  matrix,_=cv2.estimateAffinePartial2D(np.float32([kg[a.queryIdx].pt for a in good]),np.float32([kr[a.trainIdx].pt for a in good]),method=cv2.RANSAC,ransacReprojThreshold=2)
  if matrix is not None:
   matrix[:,2]*=s;gen=cv2.warpAffine(gen,matrix,(tw,th),flags=cv2.INTER_CUBIC,borderMode=cv2.BORDER_REFLECT)
 small=cv2.resize(gen,(432,288),interpolation=cv2.INTER_AREA)
 flow=cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_MEDIUM).calc(cv2.cvtColor(ref,cv2.COLOR_RGB2GRAY),cv2.cvtColor(small,cv2.COLOR_RGB2GRAY),None)
 flow=cv2.resize(cv2.GaussianBlur(np.clip(flow,-10,10),(0,0),2),(tw,th))*s
 yy,xx=np.mgrid[:th,:tw].astype(np.float32);edge=np.zeros((th,tw),np.float32)
 if i%4>0:edge=np.maximum(edge,np.clip((320-xx)/64,0,1))
 if i%4<3:edge=np.maximum(edge,np.clip((xx-(tw-320))/64,0,1))
 if i//4>0:edge=np.maximum(edge,np.clip((235-yy)/64,0,1))
 if i//4<3:edge=np.maximum(edge,np.clip((yy-(th-235))/64,0,1))
 gen=cv2.remap(gen,xx+flow[:,:,0]*edge,yy+flow[:,:,1]*edge,cv2.INTER_CUBIC,borderMode=cv2.BORDER_REFLECT)
 x=[0,368,736,1104][i%4]*s;y=[0,245,491,736][i//4]*s
 wx=np.ones(tw,np.float32);wy=np.ones(th,np.float32)
 if i%4>0:wx[:256]=np.linspace(0,1,256)
 if i%4<3:wx[-256:]=np.linspace(1,0,256)
 if i//4>0:wy[:172]=np.linspace(0,1,172)
 if i//4<3:wy[-172:]=np.linspace(1,0,172)
 weight=wy[:,None]*wx[None,:];canvas[y:y+th,x:x+tw]+=gen*weight[:,:,None];weights[y:y+th,x:x+tw]+=weight
 report.append({'tile':i,'matchedFeatures':len(good),'affine':matrix.tolist() if matrix is not None else None,'sourceSha256':hashlib.sha256(Path(path).read_bytes()).hexdigest()});print(i,len(good),flush=True)
im=Image.fromarray(np.uint8(np.clip(canvas/np.maximum(weights[:,:,None],1e-8),0,255)))
im.save(root/'final.png');im.save(root/'final.webp',quality=94,method=6)
im.resize((1536,1024),Image.Resampling.LANCZOS).save(root/'overview.jpg',quality=95)
im.resize((768,512),Image.Resampling.LANCZOS).save(root/'thumbnail.webp',quality=86,method=6)
(root/'assembly.json').write_text(json.dumps({'size':[W,H],'generatedTileSize':[1536,1024],'placementTileSize':[tw,th],'note':'Sixteen generated overlapping detail passes, registered and fitted to a 6144x4096 canvas; not native single-pass 6K.','tiles':report},indent=2))
print('Complete',mid,im.size)
