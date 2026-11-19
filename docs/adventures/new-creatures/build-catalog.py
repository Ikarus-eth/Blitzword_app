"""Copy the reviewed sheets into the vote page and write its catalog with one crop per style.

Run after generation: python3 docs/adventures/new-creatures/build-catalog.py
`selected.json` (optional) maps a sheet id to the generated batch folder to take it from,
so a retake can replace one sheet without touching the others.
"""
import hashlib
import json
import shutil
from pathlib import Path

from PIL import Image

HERE = Path(__file__).parent
ROOT = HERE.parents[2]
DEST = ROOT / 'assets/new-creatures-vote'
concepts = json.loads((HERE / 'concepts.json').read_text())
batch = json.loads((HERE / 'sheets.json').read_text())
selected_path = HERE / 'selected.json'
selected = json.loads(selected_path.read_text()) if selected_path.exists() else {}
TITLES = {'a': 'Storybook', 'b': 'Elemental', 'c': 'Champion'}
KEEP = 0.87  # keep the top of each cell; the model sometimes writes a caption along the bottom
by_id = {c['id']: c for c in concepts['creatures']}
(DEST / 'sheets').mkdir(parents=True, exist_ok=True)
entities, manifest = [], []
for sheet in batch['images']:
    folder = selected.get(sheet['id'])
    if not folder:
        folder = 'sheets-1-test' if sheet['id'] == 'sheet-01' else 'sheets-2-rest'
    src = HERE / 'generated' / folder / (sheet['id'] + '.webp')
    out = DEST / 'sheets' / (sheet['id'] + '.webp')
    shutil.copyfile(src, out)
    width, height = Image.open(out).size
    rows = len(sheet['creatures'])
    cw, ch = width / 3, height / rows
    manifest.append({'file': 'sheets/' + out.name, 'source': str(src.relative_to(ROOT)), 'width': width, 'height': height,
                     'sha256': hashlib.sha256(out.read_bytes()).hexdigest()})
    for row, cid in enumerate(sheet['creatures']):
        c = by_id[cid]
        options = []
        for col, key in enumerate(['a', 'b', 'c']):
            inset = round(cw * 0.012)
            options.append({'id': key, 'title': TITLES[key], 'description': c[{'a': 'base', 'b': 'elemental', 'c': 'champion'}[key]],
                            'src': 'sheets/' + out.name + '?v=20261119', 'width': width, 'height': height,
                            'crop': [round(col * cw) + inset, round(row * ch) + inset, round(cw) - 2 * inset, round(ch * KEEP) - inset]})
        entities.append({'id': cid, 'name': c['name'], 'habitat': c['habitat'], 'sheet': sheet['id'], 'options': options})
entities.sort(key=lambda e: e['id'])
catalog = {'version': 1, 'reviewId': concepts['reviewId'], 'names': ['Artus', 'Juna'], 'styles': TITLES, 'entities': entities}
(DEST / 'catalog.json').write_text(json.dumps(catalog, indent=1, ensure_ascii=False) + '\n')
(DEST / 'artwork-manifest.json').write_text(json.dumps({'model': batch['model'], 'prompts': 'docs/adventures/new-creatures/sheets.json', 'sheets': manifest}, indent=1) + '\n')
print(len(entities), 'creatures,', len(manifest), 'sheets')
