"""Build the fal.ai sheet batch for the 35-creature style vote (19 Nov 2026).

Two creatures per 3:2 sheet (top row and bottom row, styles A B C left to right);
the odd last creature gets a one-row 16:9 sheet. 18 images at about $0.039 each.
Run: python3 docs/adventures/new-creatures/make-batch.py
"""
import json
from pathlib import Path

HERE = Path(__file__).parent
concepts = json.loads((HERE / 'concepts.json').read_text())['creatures']
REF = 'https://ikarus-eth.github.io/Blitzword_app/assets/enemy-finals/sheets/pair-05.png'
STYLE = ("Painterly premium children's fantasy storybook art in the exact painting language of image 1: "
         "warm ivory background, soft hand-painted textures, detailed natural fur, feathers, skin or scales, "
         "expressive friendly-but-brave eyes, rich strong colours, adventurous not babyish. Image 1 shows style and "
         "layout only: do NOT copy its bear or otter. Image 1 has captions under each animal; your sheet must have NO captions, "
         "text, letters, labels or numbers anywhere: leave plain ivory background below every creature. "
         "No scenery, no gore, no huge weapons, no cartoon outlines, no photorealism. Anatomically readable, "
         "no extra limbs, exactly one creature per cell, the whole body (feet, tail, wings, tentacles) inside its own cell "
         "with an empty margin.")
STYLES = ("Column 1 = STORYBOOK style: {base}. Column 2 = ELEMENTAL style, same animal with a strong glowing power: "
          "{elemental}. Column 3 = CHAMPION style, same animal as a braver armoured hero, clearly wearing armour or hero gear: {champion}.")


def row(c):
    return c['name'] + ' (' + c['habitat'] + '). ' + STYLES.format(**c)


images = []
pairs = [concepts[i:i + 2] for i in range(0, len(concepts), 2)]
for n, pair in enumerate(pairs, 1):
    if len(pair) == 2:
        layout = ("Create a NEW landscape 3:2 sheet: STRICT grid of THREE columns by TWO rows, SIX equal square cells, "
                  "thin light separators at one third and two thirds of the width and at half the height. "
                  "TOP ROW = three styles of " + pair[0]['name'] + ". BOTTOM ROW = three styles of " + pair[1]['name'] +
                  ". Do not swap rows. Each row is the same species in three clearly different looks, not recolours. ")
        body = 'TOP ROW: ' + row(pair[0]) + ' BOTTOM ROW: ' + row(pair[1])
        aspect = '3:2'
    else:
        layout = ("Create a NEW wide 16:9 sheet: STRICT single row of THREE equal cells side by side, thin light separators "
                  "at one third and two thirds of the width. All three cells show " + pair[0]['name'] +
                  " in three clearly different looks, not recolours. ")
        body = row(pair[0])
        aspect = '16:9'
    images.append({
        'id': 'sheet-%02d' % n,
        'creatures': [c['id'] for c in pair],
        'aspect_ratio': aspect,
        'references': [REF],
        'prompt': 'Use case: creature design vote for a children\'s reading game. ' + layout + STYLE + ' ' + body,
    })

batch = {'model': 'fal-ai/nano-banana/edit', 'stage': 'new-creatures-vote', 'count': len(images), 'images': images}
(HERE / 'sheets.json').write_text(json.dumps(batch, indent=2, ensure_ascii=False) + '\n')
print(len(images), 'images; estimated cost $%.2f' % (len(images) * 0.039))
