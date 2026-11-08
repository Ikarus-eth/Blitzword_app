#!/usr/bin/env python3
"""Second listening check for story word clips (8 November 2026).

Whisper hears a lone short word poorly ("he" -> "Here."), so this pass plays the word clips in groups of six
with short pauses, the way a sentence sounds, and checks that each word is heard in order. A word that fails
both this pass and the single-clip pass is listed for a retake. Free: runs locally on the GitHub runner.
Usage: python3 scripts/listen-story-voice.py docs/adventures/<story>/voice-request.json
"""
import difflib, json, re, subprocess, sys, tempfile
from pathlib import Path
from faster_whisper import WhisperModel

req_path = Path(sys.argv[1])
req = json.loads(req_path.read_text())
src = (Path(req['output']) / 'manifest.js').read_text()
start = src.index('const voice=') + len('const voice=')
clips = json.loads(src[start:src.index(';\nif(typeof module')])['clips']
single = {r['id']: r for r in json.loads((req_path.parent / 'voice-asr-report.json').read_text())['words']}
words = [(cid, c) for cid, c in clips.items() if ':w:' in cid]
model = WhisperModel('small.en', device='cpu', compute_type='int8')
flat = lambda s: re.sub(r'[^a-z]', '', s.lower())
SAME = [{'grey', 'gray'}, {'mum', 'mom'}, {'two', '2', 'to', 'too'}, {'three', '3'}, {'for', '4', 'four'}, {'one', '1', 'won'},
        {'no', 'know'}, {'wood', 'would'}, {'hole', 'whole'}, {'tail', 'tale'}, {'sam', 'sem'}, {'its', 'its'}, {'eight', '8', 'ate'},
        {'i', 'eye'}, {'be', 'bee'}, {'see', 'sea'}, {'by', 'buy', 'bye'}, {'here', 'hear'}, {'there', 'their'}, {'right', 'write'},
        {'night', 'knight'}, {'son', 'sun'}, {'new', 'knew'}, {'red', 'read'}, {'blue', 'blew'}, {'wait', 'weight'}, {'piece', 'peace'}]
def same(a, b):
    a, b = flat(a), flat(b)
    return a == b or any(a in {flat(x) for x in g} and b in {flat(x) for x in g} for g in SAME)

rows = []
with tempfile.TemporaryDirectory() as tmp:
    silence = Path(tmp) / 'gap.wav'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', 'anullsrc=r=24000:cl=mono', '-t', '0.45', str(silence)], check=True)
    for g in range(0, len(words), 6):
        group = words[g:g + 6]
        listing = Path(tmp) / 'list.txt'
        parts = []
        for _, c in group:
            parts += [f"file '{Path(c['file']).resolve()}'", f"file '{silence}'"]
        listing.write_text('\n'.join(parts))
        joined = Path(tmp) / 'group.wav'
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', str(listing), '-ar', '16000', '-ac', '1', str(joined)], check=True)
        segs, _ = model.transcribe(str(joined), language='en', beam_size=5, condition_on_previous_text=False)
        heard = ' '.join(s.text for s in segs)
        tokens = [t for t in re.split(r"[\s,.!?;:]+", heard) if flat(t)]
        expected = [c['text'] for _, c in group]
        matcher = difflib.SequenceMatcher(a=[flat(e) for e in expected], b=[flat(t) for t in tokens], autojunk=False)
        hit = set()
        for i, e in enumerate(expected):
            if any(same(e, t) for t in tokens):
                hit.add(i)
        for i, (cid, c) in enumerate(group):
            rows.append({'id': cid, 'word': c['text'], 'heard_in_group': heard.strip(), 'match_in_group': i in hit,
                         'match_alone': single.get(cid, {}).get('match')})
fails = [r for r in rows if not r['match_in_group'] and not r['match_alone']]
report = {'model': 'whisper small.en', 'checked': len(rows), 'matched_in_group': sum(r['match_in_group'] for r in rows),
          'matched_either': sum(bool(r['match_in_group'] or r['match_alone']) for r in rows), 'retake': fails, 'words': rows}
(req_path.parent / 'voice-listen-report.json').write_text(json.dumps(report, indent=1, ensure_ascii=False))
print(f"heard in groups: {report['matched_in_group']} of {len(rows)}; either pass: {report['matched_either']}")
print('failed both:', ', '.join(f"{r['word']} (group heard {r['heard_in_group']!r})" for r in fails))
