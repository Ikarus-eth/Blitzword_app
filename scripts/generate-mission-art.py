"""Fixed, manually reviewed fal.ai illustration batch. Never run in the browser.

One submission per prompt; uncertain/failed requests are never resubmitted.
Inspect requests.json and retrieve existing requests before commissioning a new run.
"""
import concurrent.futures
import json
import os
from pathlib import Path
import threading
import time
from urllib.parse import urlparse
from urllib.request import Request, urlopen

MODEL = 'fal-ai/nano-banana/edit'
OUT = Path('generated-mission-art')
OUT.mkdir(exist_ok=True)
key = os.environ.get('FAL_KEY')
if not key:
    raise SystemExit('Missing FAL_KEY. The workflow maps the repository secret AL_AI_API.')
spec = json.loads(Path('docs/adventures/art-prompts.json').read_text())
if len(spec['images']) != 12:
    raise SystemExit('This workflow permits exactly the reviewed 12-image batch.')
records = {}
lock = threading.Lock()

def save():
    with lock:
        (OUT / 'requests.json').write_text(json.dumps({'model': MODEL, 'requests': records}, indent=2))

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
            'prompt': spec['style'] + '\n' + item['prompt'], 'image_urls': item['references'],
            'num_images': 1, 'aspect_ratio': '3:2', 'output_format': 'webp', 'limit_generations': True})
        records[identity].update(queued)
        records[identity]['state'] = 'queued'
        save()
        deadline = time.monotonic() + 600
        while time.monotonic() < deadline:
            status = api(queued['status_url'])
            if status.get('status') == 'COMPLETED':
                break
            time.sleep(5)
        else:
            raise TimeoutError('Request still pending; retrieve its saved request without resubmitting')
        result = api(queued['response_url'])
        url = result['images'][0]['url']
        if urlparse(url).scheme != 'https':
            raise ValueError('Unexpected image URL')
        # No API key is sent to the image CDN.
        with urlopen(url, timeout=90) as image:
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
