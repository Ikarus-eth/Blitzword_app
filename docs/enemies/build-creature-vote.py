"""Rebuild the creature vote page (assets/new-creatures-vote) from ChatGPT ImageGen concept pictures.

Usage: python3 docs/enemies/build-creature-vote.py REVIEW_ID SOURCE_DIR ORIGIN KEY:Name[:a,b,c files] ...
SOURCE_DIR holds the PNGs (KEY-a.png, KEY-b.png, KEY-c.png unless files are given);
ORIGIN is "branch:folder" for the manifest. Pictures become 900 px WebP and are shown whole.
"""
import hashlib, json, shutil, sys
from pathlib import Path
from PIL import Image

review_id, src_dir, origin, *specs = sys.argv[1:]
SRC, DEST = Path(src_dir), Path(__file__).resolve().parents[2] / 'assets/new-creatures-vote'
TITLES = {'a': 'Storybook', 'b': 'Elemental', 'c': 'Champion'}
shutil.rmtree(DEST / 'pictures', ignore_errors=True)
(DEST / 'pictures').mkdir()
entities, manifest = [], []
for i, spec in enumerate(specs, 1):
    key, name, *files = spec.split(':')
    files = files[0].split(',') if files else [f'{key}-{s}.png' for s in 'abc']
    options = []
    for s, fname in zip('abc', files):
        src, out = SRC / fname, DEST / 'pictures' / f'{key}-{s}.webp'
        Image.open(src).convert('RGB').resize((900, 900), Image.LANCZOS).save(out, 'WEBP', quality=84, method=6)
        manifest.append({'file': 'pictures/' + out.name, 'source': origin + '/' + fname,
                         'sourceSha256': hashlib.sha256(src.read_bytes()).hexdigest(),
                         'sha256': hashlib.sha256(out.read_bytes()).hexdigest(), 'bytes': out.stat().st_size})
        options.append({'id': s, 'title': TITLES[s], 'description': '', 'src': f'pictures/{out.name}?v={review_id[-8:]}',
                        'width': 900, 'height': 900, 'crop': [0, 0, 900, 900]})
    entities.append({'id': '%02d' % i, 'key': key, 'name': name, 'habitat': '', 'options': options})
(DEST / 'catalog.json').write_text(json.dumps({'version': 1, 'reviewId': review_id, 'names': ['Artus', 'Juna'], 'styles': TITLES,
                                               'entities': entities}, indent=1, ensure_ascii=False) + '\n')
(DEST / 'artwork-manifest.json').write_text(json.dumps({'method': 'Built-in ImageGen (ChatGPT) 1254 px PNG originals on the concept branch; 900 px WebP q84 copies for the vote page',
                                                        'pictures': manifest}, indent=1) + '\n')
print(len(entities), 'creatures,', sum(m['bytes'] for m in manifest) // 1024, 'KB')
