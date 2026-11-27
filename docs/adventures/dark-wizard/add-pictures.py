"""Converts the ChatGPT pictures for chapters 7 and 8 into the reader's WebP files.

Usage: python3 docs/adventures/dark-wizard/add-pictures.py FOLDER
FOLDER holds dw-storm-a.png (or .webp/.jpg) … wf-home-b.png. Each is cropped to 3:2 from the centre,
resized to 1248 × 832 and saved as assets/adventures/dark-wizard/<name>.webp (quality 84).
"""
import sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[3]
OUT = ROOT / 'assets/adventures/dark-wizard'
QUESTS = ['dw-storm', 'dw-trail', 'dw-jungle', 'dw-camp', 'dw-tunnel', 'dw-trap', 'wf-room', 'wf-stairs', 'wf-hall', 'wf-ring', 'wf-home']
NAMES = [q + s for q in QUESTS for s in ('-a', '-b')]
src = Path(sys.argv[1])
missing = []
for name in NAMES:
    found = [p for p in (src / (name + ext) for ext in ('.png', '.webp', '.jpg', '.jpeg')) if p.exists()]
    if not found:
        missing.append(name)
        continue
    im = Image.open(found[0]).convert('RGB')
    w, h = im.size
    if w / h > 1.5:
        nw = round(h * 1.5); im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    else:
        nh = round(w / 1.5); im = im.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
    im.resize((1248, 832), Image.LANCZOS).save(OUT / (name + '.webp'), 'WEBP', quality=84, method=6)
    print('ok', name, (w, h))
print('missing:', ', '.join(missing) if missing else 'none')
