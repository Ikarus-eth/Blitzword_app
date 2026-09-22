"""Download a supplied list of generated clips once, preserving completed files.

Input JSON is [{id, file, url}]. Keep signed provider URLs outside the repository.
Failures are reported, never automatically retried.
"""
import concurrent.futures
import json
import pathlib
import sys
import urllib.request

root = pathlib.Path(__file__).resolve().parent.parent

def download(clip):
    target = root / clip['file']
    if target.exists():
        return {'id': clip['id'], 'status': 'present', 'bytes': target.stat().st_size}
    try:
        with urllib.request.urlopen(clip['url'], timeout=25) as response:
            data = response.read()
        if len(data) < 1000:
            raise ValueError('Audio response too small')
        target.parent.mkdir(parents=True, exist_ok=True)
        temp = target.with_suffix('.part')
        temp.write_bytes(data)
        temp.replace(target)
        return {'id': clip['id'], 'status': 'downloaded', 'bytes': len(data)}
    except Exception as error:
        return {'id': clip['id'], 'status': 'failed', 'error': type(error).__name__}

clips = json.loads(pathlib.Path(sys.argv[1]).read_text())
failed = False
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    for result in pool.map(download, clips):
        print(json.dumps(result), flush=True)
        failed = failed or result['status'] == 'failed'
sys.exit(1 if failed else 0)
