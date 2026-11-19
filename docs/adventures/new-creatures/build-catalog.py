"""Copy the reviewed sheets into the vote page and write its catalog with one crop per style.

Run after generation: python3 docs/adventures/new-creatures/build-catalog.py
Batches are read in run order; a creature in a later (retake) batch uses that newer sheet.
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
# Batches in the order they ran; a later batch replaces a creature's earlier sheet.
BATCHES = ['sheets-1-test', 'sheets-2-rest', 'sheets-3-retake']
TITLES = {'a': 'Storybook', 'b': 'Elemental', 'c': 'Champion'}
FIELD = {'a': 'base', 'b': 'elemental', 'c': 'champion'}
KEEP = 0.87  # keep the top of each cell; the model sometimes writes a caption along the bottom
# Single cells taken from another sheet after review: (creature, style) -> (batch, sheet, row, column, rows).
OVERRIDES = json.loads((HERE / 'cell-overrides.json').read_text())['cells']
by_id = {c['id']: c for c in concepts['creatures']}
placement = {}
for name in BATCHES:
    spec = json.loads((HERE / (name + '.json')).read_text())
    for sheet in spec['images']:
        src = HERE / 'generated' / name / (sheet['id'] + '.webp')
        if src.exists():
            for row, cid in enumerate(sheet['creatures']):
                placement[cid] = (src, row, len(sheet['creatures']))
missing = sorted(set(by_id) - set(placement))
if missing:
    raise SystemExit('No artwork yet for creatures ' + ', '.join(missing))
dest_sheets = DEST / 'sheets'
if dest_sheets.exists():
    shutil.rmtree(dest_sheets)
dest_sheets.mkdir(parents=True)
entities, manifest, copied = [], [], {}


def crop(column, row, rows, cw, ch, height, inset):
    if rows == 1:  # the one-row 16:9 sheet (Dream Tapir) has its animals in the upper middle and captions below them
        return [round(column * cw) + inset, round(height * 0.08), round(cw) - 2 * inset, round(height * 0.56)]
    return [round(column * cw) + inset, round(row * ch) + inset, round(cw) - 2 * inset, round(ch * KEEP) - inset]


def sheet_file(src):
    if src not in copied:
        out = dest_sheets / (src.parent.name.split('-')[-1] + '-' + src.name)
        shutil.copyfile(src, out)
        width, height = Image.open(out).size
        copied[src] = (out, width, height)
        manifest.append({'file': 'sheets/' + out.name, 'source': str(src.relative_to(ROOT)), 'width': width, 'height': height,
                         'sha256': hashlib.sha256(out.read_bytes()).hexdigest()})
    return copied[src]


for cid in sorted(by_id):
    c = by_id[cid]
    options = []
    for col, key in enumerate(['a', 'b', 'c']):
        src, row, rows = placement[cid]
        column = col
        o = OVERRIDES.get(cid + key)
        if o:
            src, row, column, rows = HERE / 'generated' / o['batch'] / (o['sheet'] + '.webp'), o['row'], o['column'], o['rows']
        out, width, height = sheet_file(src)
        cw, ch = width / 3, height / rows
        inset = round(cw * 0.012)
        options.append({'id': key, 'title': TITLES[key], 'description': c[FIELD[key]], 'src': 'sheets/' + out.name + '?v=20261119',
                        'width': width, 'height': height,
                        'crop': crop(column, row, rows, cw, ch, height, inset)})
    entities.append({'id': cid, 'name': c['name'], 'habitat': c['habitat'], 'options': options})
entities.sort(key=lambda e: e['id'])
catalog = {'version': 1, 'reviewId': concepts['reviewId'], 'names': ['Artus', 'Juna'], 'styles': TITLES, 'entities': entities}
(DEST / 'catalog.json').write_text(json.dumps(catalog, indent=1, ensure_ascii=False) + '\n')
(DEST / 'artwork-manifest.json').write_text(json.dumps({'model': 'fal-ai/nano-banana/edit', 'prompts': ['docs/adventures/new-creatures/' + n + '.json' for n in BATCHES], 'sheets': manifest}, indent=1) + '\n')
print(len(entities), 'creatures,', len(manifest), 'sheets')
