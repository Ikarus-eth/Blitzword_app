"""Style test (20 Nov 2026): the first vote sheets were too soft and pastel for the game.
Three creatures, one 16:9 sheet each, three looks in the in-game creature style.
Reference: six real in-game creatures (approved atlases) on parchment, no captions.
3 images at about $0.039 each.
"""
import json
from pathlib import Path

HERE = Path(__file__).parent
REF = ('https://raw.githubusercontent.com/Ikarus-eth/Blitzword_app/claude/new-creatures-style-test/'
       'docs/adventures/new-creatures/style-test/reference-game-style.webp')
STYLE = ("Match image 1 EXACTLY in rendering: these are creatures from the same fantasy reading game. Detailed fantasy RPG creature "
         "illustration, crisp dark contour lines, high contrast, rich saturated natural colours, fine individual fur, feather and scale "
         "strokes, realistic natural-history anatomy with a slightly heroic stance, natural materials worked into the animal (moss, bark, "
         "leaves, stone, crystal, water, fire) exactly like the fox, stag, turtle and porcupine in image 1, small handmade ornaments like the "
         "beaver's shield and the kingfisher's amulet. NOT soft, NOT pastel, NOT plush or chibi, no big baby eyes, no watercolour wash. "
         "Do not copy the animals in image 1. Plain flat parchment background (#EFE5CD), no ground, no shadow, no scenery, "
         "NO text, captions, letters or numbers. Exactly one full-body creature per cell, whole body inside the cell with an empty margin.")
LOOKS = ("Cell 1 WILD: the natural animal with a few nature-material details, no glow and no gear. "
         "Cell 2 ELEMENTAL: the same animal whose body is partly made of its element, like the ember fox, crystal porcupine and waterfall turtle; no gear. "
         "Cell 3 GUARDIAN: the same animal carrying handmade gear (shield, sash, amulet, light armour) like the beaver and kingfisher; no glow. "
         "The three must look clearly different.")
CREATURES = [
    ('jade-tiger', 'Jade Tiger', 'a jungle tiger with bold black stripes', 'jade-green crystal stripes and drifting jungle leaves',
     'bronze-and-jade shoulder guard, red cloth sash and a round leaf-pattern shield'),
    ('sun-phoenix', 'Sun Phoenix', 'a large red-and-gold bird with a long tail and bright crest', 'wings and tail feathers made of living flame',
     'golden feather breastplate and a sun-disc amulet'),
    ('tide-octopus', 'Tide Octopus', 'a sea octopus with curling striped arms and clever eyes', 'arms swirling with seawater and sea-foam, shell and coral growing on its head',
     'coral crown, shell shoulder plate and a small round shell shield held in one arm'),
]
images = []
for cid, name, base, element, gear in CREATURES:
    prompt = ("Use case: new creature designs for a children's fantasy reading game. Create a NEW wide 16:9 sheet: a STRICT single row of "
              "THREE equal cells side by side with thin light separators. All three cells show " + name + ", " + base + ". " + LOOKS +
              " Cell 1: " + name + ", natural. Cell 2: " + name + ", " + element + ". Cell 3: " + name + ", " + gear + ". " + STYLE)
    images.append({'id': cid, 'aspect_ratio': '16:9', 'references': [REF], 'prompt': prompt})
batch = {'model': 'fal-ai/nano-banana/edit', 'stage': 'new-creatures-style-test', 'count': len(images), 'images': images}
(HERE / 'test.json').write_text(json.dumps(batch, indent=2) + '\n')
print(len(images), 'images, about $%.2f' % (len(images) * 0.039))
