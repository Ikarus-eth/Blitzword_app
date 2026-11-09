#!/usr/bin/env python3
"""Teaching pictures for words that had none (9 November 2026).

The first 200 curriculum words have teaching pictures; the 800 expansion words showed an empty picture area.
Each request is one fal.ai nano-banana picture of the word's own example sentence. One submission per word;
failures are listed, never resubmitted automatically. Output is shrunk to 768x512 WebP for the iPad.
Usage (GitHub Actions only): python3 scripts/generate-word-pictures.py docs/word-pictures/<request>.json
"""
import concurrent.futures, io, json, os, sys, threading, time
from pathlib import Path
from urllib.parse import urlparse
from urllib.request import Request, urlopen
from PIL import Image

MODEL = 'fal-ai/nano-banana/edit'
spec = json.loads(Path(sys.argv[1]).read_text())
assert spec['model'] == MODEL and len(spec['words']) == spec['count'] <= 400
key = os.environ['FAL_KEY']
OUT = Path(spec['output'])
OUT.mkdir(parents=True, exist_ok=True)
records, lock = {}, threading.Lock()


def api(url, payload=None):
    if urlparse(url).scheme != 'https' or urlparse(url).hostname != 'queue.fal.run':
        raise ValueError('Unexpected authenticated API host')
    req = Request(url, data=None if payload is None else json.dumps(payload).encode(),
                  headers={'Authorization': 'Key ' + key, 'Content-Type': 'application/json'})
    with urlopen(req, timeout=90) as r:
        return json.load(r)


def generate(item):
    w = item['word']
    try:
        q = api('https://queue.fal.run/' + MODEL, {'prompt': item['prompt'], 'image_urls': item['references'], 'num_images': 1,
                                                   'aspect_ratio': '3:2', 'output_format': 'webp', 'limit_generations': True})
        deadline = time.monotonic() + 600
        while time.monotonic() < deadline and api(q['status_url']).get('status') != 'COMPLETED':
            time.sleep(4)
        url = api(q['response_url'])['images'][0]['url']
        with urlopen(url, timeout=90) as image:
            data = image.read(20_000_001)
        im = Image.open(io.BytesIO(data)).convert('RGB').resize((768, 512), Image.LANCZOS)
        im.save(OUT / (item['file'] + '.webp'), 'WEBP', quality=80, method=6)
        state = {'state': 'saved', 'request_id': q.get('request_id')}
        print(w + ': saved', flush=True)
    except Exception as exc:
        detail = ''
        if hasattr(exc, 'code'):
            try:
                detail = f" {exc.code} {exc.read()[:200].decode(errors='replace')}"
            except Exception:
                detail = f' {exc.code}'
        state = {'state': 'needs-review', 'error': type(exc).__name__ + detail}
        print(w + ': needs review (' + state['error'] + ')', flush=True)
    with lock:
        records[w] = state


with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
    list(pool.map(generate, spec['words']))
Path(sys.argv[1]).with_suffix('.report.json').write_text(json.dumps(records, indent=1, sort_keys=True))
saved = {i['word']: i for i in spec['words'] if records.get(i['word'], {}).get('state') == 'saved'}
# The game reads every picture made so far, from this and earlier requests.
manifest = OUT / 'pictures.js'
old = {}
if manifest.exists():
    txt = manifest.read_text()
    old = json.loads(txt[txt.index('=') + 1:txt.rindex(';')])
for w, i in saved.items():
    old[w] = {'source': f"{spec['output']}/{i['file']}.webp", 'alt': i['alt']}
manifest.write_text('// Teaching pictures for expansion words (fal.ai, 9 November 2026). Generated; do not edit by hand.\n'
                    'globalThis.BlitzWordPictures=' + json.dumps(dict(sorted(old.items())), ensure_ascii=False, indent=0) + ';\n')
print(f'saved {len(saved)} of {len(spec["words"])}')
