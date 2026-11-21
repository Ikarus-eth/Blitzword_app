"""Records the November creature lines with George (ElevenLabs Multilingual v2) through fal.ai.

Bounded and paid: one request per line from docs/NARRATION_NOVEMBER_CREATURES_REQUEST.json, at most its
maxCharacters. Request IDs are saved before polling; an uncertain submission is never resubmitted.
Outputs: assets/narration/november-creatures/<id>.mp3 and docs/narration-november-creatures/generation.json.
Needs FAL_KEY in the environment (GitHub secret), ffprobe on PATH.
"""
import hashlib, json, os, pathlib, subprocess, time
from urllib.parse import urlparse
from urllib.request import Request, urlopen

ROOT = pathlib.Path(__file__).resolve().parent.parent
PLAN = json.loads((ROOT / 'docs/NARRATION_NOVEMBER_CREATURES_REQUEST.json').read_text())
MODEL = 'fal-ai/elevenlabs/tts/multilingual-v2'
assert PLAN['model'] == MODEL and PLAN['voice'] == 'JBFqnCBsd6RMkjVDRZzb'
assert sum(len(i['text']) for i in PLAN['items']) == PLAN['characters'] <= PLAN['maxCharacters']
assert len({i['id'] for i in PLAN['items']}) == len(PLAN['items'])
KEY = os.environ.get('FAL_KEY') or ''
if not KEY:
    raise SystemExit('Missing FAL_KEY')
AUDIO = ROOT / 'assets/narration/november-creatures'
DOCS = ROOT / 'docs/narration-november-creatures'
AUDIO.mkdir(parents=True, exist_ok=True)
DOCS.mkdir(parents=True, exist_ok=True)
LEDGER = DOCS / 'requests.json'
records = json.loads(LEDGER.read_text())['requests'] if LEDGER.exists() else {}


def save():
    LEDGER.write_text(json.dumps({'model': MODEL, 'voice': PLAN['voice'], 'requests': records}, indent=1) + '\n')


def api(url, payload=None):
    if urlparse(url).scheme != 'https' or urlparse(url).hostname != 'queue.fal.run':
        raise ValueError('Unexpected API host')
    req = Request(url, data=None if payload is None else json.dumps(payload).encode(),
                  headers={'Authorization': 'Key ' + KEY, 'Content-Type': 'application/json'})
    with urlopen(req, timeout=90) as r:
        return json.load(r)


clips = {}
for item in PLAN['items']:
    dest = AUDIO / (item['id'] + '.mp3')
    rec = records.get(item['id'])
    if rec and rec.get('state') == 'downloaded' and dest.exists():
        pass
    else:
        if rec and rec.get('text') != item['text']:
            raise SystemExit('Receipt belongs to different text: ' + item['id'])
        if rec and not rec.get('request_id'):
            raise SystemExit('Uncertain submission for ' + item['id'] + '; check fal history before any resubmission')
        if not rec:
            records[item['id']] = {'state': 'submitting', 'text': item['text'], 'characters': len(item['text'])}
            save()
            queued = api('https://queue.fal.run/' + MODEL, dict(PLAN['settings'], text=item['text'], voice=PLAN['voice']))
            records[item['id']].update(queued, state='queued')
            save()
        rec = records[item['id']]
        deadline = time.monotonic() + 600
        while time.monotonic() < deadline:
            if api(rec['status_url']).get('status') == 'COMPLETED':
                break
            time.sleep(2)
        else:
            raise SystemExit('Still pending: ' + item['id'] + ' (request id saved)')
        result = api(rec['response_url'])
        url = result['audio']['url']
        host = urlparse(url).hostname or ''
        if urlparse(url).scheme != 'https' or not (host == 'fal.media' or host.endswith('.fal.media')):
            raise SystemExit('Unexpected audio host for ' + item['id'])
        with urlopen(url, timeout=90) as r:
            data = r.read(2_000_001)
        if not 1000 < len(data) <= 2_000_000:
            raise SystemExit('Invalid audio size for ' + item['id'])
        dest.write_bytes(data)
        rec.update(state='downloaded', bytes=len(data), sha256=hashlib.sha256(data).hexdigest())
        save()
    data = dest.read_bytes()
    duration = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(dest)]).decode().strip())
    if not 0.2 < duration < 12:
        raise SystemExit('Odd duration for ' + item['id'])
    clips[item['key']] = {'file': 'assets/narration/november-creatures/' + dest.name, 'offset': 0, 'duration': round(duration, 6),
                          'sha256': hashlib.sha256(data).hexdigest()}
(DOCS / 'generation.json').write_text(json.dumps({'status': 'complete', 'model': MODEL, 'voice': PLAN['voice'], 'characters': PLAN['characters'],
                                                  'clips': clips}, indent=1, ensure_ascii=False) + '\n')
print(len(clips), 'clips,', PLAN['characters'], 'characters')
