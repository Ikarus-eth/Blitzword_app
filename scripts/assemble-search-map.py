"""Assemble nine overlapping detail passes. Requires Pillow, NumPy and OpenCV.
Usage: python assemble-search-map.py <directory with crop-0..8.png and paths.json>
Input crop origins: x=0,480,960; y=0,320,640 from a 1536x1024 base.
"""
import sys,json
import cv2,numpy as np
from PIL import Image
from pathlib import Path
root=Path(sys.argv[1])
paths=json.loads((root/'paths.json').read_text())
s=8/3; W,H=4096,2731
canvas=np.zeros((H,W,3),np.float32);weights=np.zeros((H,W),np.float32)
for i,path in enumerate(paths):
 ref=np.array(Image.open(root/f'crop-{i}.png').convert('RGB'));gen=np.array(Image.open(path).convert('RGB').resize((1536,1024),Image.Resampling.LANCZOS))
 small=cv2.resize(gen,(576,384),interpolation=cv2.INTER_AREA)
 sift=cv2.SIFT_create(nfeatures=4000)
 kr,dr=sift.detectAndCompute(cv2.cvtColor(ref,cv2.COLOR_RGB2GRAY),None);kg,dg=sift.detectAndCompute(cv2.cvtColor(small,cv2.COLOR_RGB2GRAY),None)
 good=[a for a,b in cv2.BFMatcher().knnMatch(dg,dr,k=2) if a.distance<.75*b.distance]
 if len(good)>8:
  m,_=cv2.estimateAffinePartial2D(np.float32([kg[a.queryIdx].pt for a in good]),np.float32([kr[a.trainIdx].pt for a in good]),method=cv2.RANSAC,ransacReprojThreshold=2)
  if m is not None:
   m[:,2]*=s;gen=cv2.warpAffine(gen,m,(1536,1024),flags=cv2.INTER_CUBIC,borderMode=cv2.BORDER_REFLECT)
 # Align only shared edges locally; leave corrected subjects inside tiles intact.
 small=cv2.resize(gen,(576,384),interpolation=cv2.INTER_AREA)
 flow=cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_MEDIUM).calc(cv2.cvtColor(ref,cv2.COLOR_RGB2GRAY),cv2.cvtColor(small,cv2.COLOR_RGB2GRAY),None)
 flow=cv2.resize(cv2.GaussianBlur(np.clip(flow,-12,12),(0,0),2),(1536,1024))*s
 yy,xx=np.mgrid[:1024,:1536].astype(np.float32)
 edge=np.zeros((1024,1536),np.float32)
 if i%3>0:edge=np.maximum(edge,np.clip((320-xx)/64,0,1))
 if i%3<2:edge=np.maximum(edge,np.clip((xx-1216)/64,0,1))
 if i//3>0:edge=np.maximum(edge,np.clip((220-yy)/49,0,1))
 if i//3<2:edge=np.maximum(edge,np.clip((yy-804)/49,0,1))
 gen=cv2.remap(gen,xx+flow[:,:,0]*edge,yy+flow[:,:,1]*edge,cv2.INTER_CUBIC,borderMode=cv2.BORDER_REFLECT)
 x=(i%3)*1280;y=round((i//3)*320*s)
 wx=np.ones(1536,np.float32);wy=np.ones(1024,np.float32)
 if i%3>0:wx[:256]=np.linspace(0,1,256)
 if i%3<2:wx[-256:]=np.linspace(1,0,256)
 if i//3>0:wy[:171]=np.linspace(0,1,171)
 if i//3<2:wy[-171:]=np.linspace(1,0,171)
 weight=wy[:,None]*wx[None,:];canvas[y:y+1024,x:x+1536]+=gen*weight[:,:,None];weights[y:y+1024,x:x+1536]+=weight
 print(i,len(good))
im=Image.fromarray(np.uint8(np.clip(canvas/np.maximum(weights[:,:,None],1e-8),0,255)))
im.save(root/'final.png');im.save(root/'final.jpg',quality=97,subsampling=0)
im.save(root/'final.webp',quality=94,method=6)
print(im.size)
