"""Retake batch for the new creature vote (19 Nov 2026).

Sheet 10 failed; the crocodile and flamingo Champions copied the reference otter; the dragonfly
had a four-legged body; kangaroo, meerkat, tiger, phoenix and wombat styles were too alike.
Uses a caption-free reference built from two good rows (Gum Koala, Iceberg Penguin) and
strict per-column rules. 5 images at about $0.039 each.
"""
import json
from pathlib import Path

HERE = Path(__file__).parent
by_id = {c['id']: c for c in json.loads((HERE / 'concepts.json').read_text())['creatures']}
REF = 'https://raw.githubusercontent.com/Ikarus-eth/Blitzword_app/claude/new-creatures-vote/docs/adventures/new-creatures/reference-clean.webp'
PAIRS = [('19', '20'), ('14', '31'), ('17', '03'), ('25', '08'), ('10', '33')]
EXTRA = {
    '25': 'It is an INSECT: slim segmented body, six thin legs, two pairs of long clear wings, big round eyes; no fur, not a mammal, no four legs.',
    '14': 'Every cell in this row is a CROCODILE.',
    '31': 'Every cell in this row is a FLAMINGO bird with long thin legs and a curved beak.',
    '33': 'A wombat is a small round marsupial with a short nose and tiny ears, not a bear.',
}
RULES = ("Column 1 STORYBOOK: the natural animal only, NO glow, NO magic, NO armour or clothing. "
         "Column 2 ELEMENTAL: strong glowing magic power, NO armour or clothing. "
         "Column 3 CHAMPION: clearly wearing armour or hero gear, NO glow or magic effects. The three must look clearly different.")
STYLE = ("Painterly premium children's fantasy storybook art in the exact painting language of image 1: warm ivory background, "
         "soft hand-painted textures, detailed natural fur, feathers, skin or scales, expressive friendly-but-brave eyes, rich strong colours. "
         "Image 1 shows style, layout and how the three columns differ; do NOT draw a koala or penguin. NO text, captions, letters or numbers anywhere. "
         "No scenery, no gore, no cartoon outlines, no photorealism. Anatomically readable, no extra limbs, exactly one creature per cell, "
         "the whole body inside its own cell with an empty margin.")


def row(c):
    n = c['name']
    return (n + ' (' + c['habitat'] + '). ' + EXTRA.get(c['id'], '') + ' Column 1: ' + n + ', ' + c['base'] + '. Column 2: ' + n + ', ' +
            c['elemental'] + '. Column 3: ' + n + ', ' + c['champion'] + '.')


images = []
for n, (top, bottom) in enumerate(PAIRS, 1):
    t, b = by_id[top], by_id[bottom]
    layout = ("Create a NEW landscape 3:2 sheet: STRICT grid of THREE columns by TWO rows, SIX equal square cells, thin light separators. "
              "TOP ROW = " + t['name'] + " three times. BOTTOM ROW = " + b['name'] + " three times. Do not swap rows. ")
    images.append({'id': 'retake-%02d' % n, 'creatures': [top, bottom], 'aspect_ratio': '3:2', 'references': [REF],
                   'prompt': "Use case: creature design vote for a children's reading game. " + layout + RULES + ' ' + STYLE +
                   ' TOP ROW: ' + row(t) + ' BOTTOM ROW: ' + row(b)})
batch = {'model': 'fal-ai/nano-banana/edit', 'stage': 'new-creatures-vote-retakes', 'count': len(images), 'images': images}
(HERE / 'sheets-3-retake.json').write_text(json.dumps(batch, indent=2, ensure_ascii=False) + '\n')
print(len(images), 'images; estimated cost $%.2f' % (len(images) * 0.039))
