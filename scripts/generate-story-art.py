"""Bounded fal.ai batch for one reviewed story-art prompt file. Never run in the browser.

Usage (GitHub Actions only): python3 scripts/generate-story-art.py docs/adventures/<story>/<batch>.json
One submission per prompt; uncertain or failed requests are never resubmitted automatically.
The batch file states its exact image count; a mismatch stops before any paid request.
"""
import concurrent.futures
import json
import os
import sys
import threading
import time
from pathlib import Path
from urllib.parse import urlparse
from urllib.request import Request, urlopen

MODEL = 'fal-ai/nano-banana/edit'
if len(sys.argv) != 2 or not sys.argv[1].startswith('docs/adventures/') or not sys.argv[1].endswith('.json'):
    raise SystemExit('Pass one reviewed batch file under docs/adventures/.')
spec = json.loads(Path(sys.argv[1]).read_text())
if spec.get('model') != MODEL or len(spec['images']) != spec.get('count') or not 1 <= spec['count'] <= 24:
    raise SystemExit('Batch must name the model and state its exact image count (at most 24).')
key = os.environ.get('FAL_KEY')
if not key:
    raise SystemExit('Missing FAL_KEY. The workflow maps the repository secret AL_AI_API.')
OUT = Path('generated-story-art')
OUT.mkdir(exist_ok=True)
records = {}
lock = threading.Lock()


def save():
    with lock:
        (OUT / 'requests.json').write_text(json.dumps({'model': MODEL, 'batch': sys.argv[1], 'requests': records}, indent=2))


def api(url, payload=None):
    if urlparse(url).scheme != 'https' or urlparse(url).hostname != 'queue.fal.run':
        raise ValueError('Unexpected authenticated API host')
    req = Request(url, data=None if payload is None else json.dumps(payload).encode(),
                  headers={'Authorization': 'Key ' + key, 'Content-Type': 'application/json'})
    with urlopen(req, timeout=90) as response:
        return json.load(response)


def generate(item):
    identity = item['id']
    records[identity] = {'state': 'submitting', 'prompt': item['prompt'], 'references': item['references']}
    save()
    try:
        queued = api('https://queue.fal.run/' + MODEL, {
            'prompt': item['prompt'], 'image_urls': item['references'], 'num_images': 1,
            'aspect_ratio': item.get('aspect_ratio', '3:2'), 'output_format': 'webp', 'limit_generations': True})
        records[identity].update(queued)
        records[identity]['state'] = 'queued'
        save()
        deadline = time.monotonic() + 600
        while time.monotonic() < deadline:
            if api(queued['status_url']).get('status') == 'COMPLETED':
                break
            time.sleep(5)
        else:
            raise TimeoutError('Request still pending; retrieve its saved request without resubmitting')
        result = api(queued['response_url'])
        url = result['images'][0]['url']
        if urlparse(url).scheme != 'https':
            raise ValueError('Unexpected image URL')
        with urlopen(url, timeout=90) as image:  # no API key is sent to the image CDN
            data = image.read(20_000_001)
        if len(data) > 20_000_000:
            raise ValueError('Image too large')
        (OUT / (identity + '.webp')).write_bytes(data)
        records[identity].update(state='downloaded', bytes=len(data), image_url=url)
        print(identity + ': downloaded', flush=True)
    except Exception as exc:
        records[identity].update(state='needs-review', error=type(exc).__name__)
        print(identity + ': needs review (' + type(exc).__name__ + ')', flush=True)
    finally:
        save()


with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
    list(pool.map(generate, spec['images']))
if any(r['state'] != 'downloaded' for r in records.values()):
    raise SystemExit('Some requests need review; request IDs are saved in the artifact. Do not blindly rerun.')
