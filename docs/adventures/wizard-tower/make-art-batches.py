"""Writes the Wizard's Tower fal.ai batches for mission-art.yml (14 November 2026).
Budget set by the parent: at most $2 of fal.ai credit for this chapter (nano-banana edit, about $0.039 a picture).
Plan: 2 character references, then a cover and four pictures per quest (33), one picture for every two story pages.
Run: python3 docs/adventures/wizard-tower/make-art-batches.py"""
import json
from pathlib import Path

HERE = Path(__file__).parent
B = 'https://ikarus-eth.github.io/Blitzword_app/'
REF = 'https://raw.githubusercontent.com/Ikarus-eth/Blitzword_app/claude/wizard-tower/docs/adventures/wizard-tower/generated/art-characters/'
STYLE = B + 'assets/story-pilot/scenes/fox-call.webp'
MODEL = 'fal-ai/nano-banana/edit'
OREN = ('Oren, a very old, kind and slightly silly wizard: very long white hair, a very long soft white beard that reaches his belt, '
        'bushy white eyebrows, rosy cheeks, twinkly blue eyes, no glasses, a tall pointed deep-blue hat with small gold stars, '
        'a long deep-blue robe with small gold stars and a plain brown belt, a knobbly wooden staff topped with a small glowing white crystal')
GUS = ('Gus, a gentle young giant about six times as tall as a boy: broad shoulders, round friendly freckled face, big kind blue eyes, '
       'short curly ginger-red hair and a short neat ginger-red beard, a wide straw farmer’s hat, a cream shirt with rolled-up sleeves, '
       'green farmer’s dungarees with one very large patch pocket on the chest bib, big brown boots')
CHARS = {
    'A': (B + 'assets/family-review/images/knight-boy-d.webp', 'Artus, a young boy knight and mage: tousled golden-ginger hair, freckles, green eyes, green botanical tunic, worn silver armour, red scarf and cape. Keep child proportions'),
    'P': (B + 'assets/evolution/pip-stage-1.webp', 'Pip, his dragon: orange-gold scales, cream fluffy chest, amber eyes, curved cream horns, blue-grey wing membranes with a pale flame mark, leafy tail tuft. Pip’s back is about as high as Artus’s chest'),
    'O': (REF + 'ref-oren.webp', OREN),
    'G': (REF + 'ref-gus.webp', GUS),
}
SAFE = ('Draw new natural poses, not the reference poses pasted on. Full scene, edge-to-edge, coherent perspective and shared lighting, '
        'natural contact shadows. No text, no letters, no numbers, no writing on pages or signs, no UI, no borders, no panels, no inset portraits. '
        'Child-friendly: nothing frightening, no injuries. Keep every named character fully inside the frame unless the scene says otherwise.')
SCALE = 'Scale: Gus is a true giant, about six times as tall as Artus; Artus and Pip together fit easily in his chest pocket.'


def prompt(chars, scene):
    lines = ['Use case: illustration-story. Create one polished landscape 3:2 children’s fantasy storybook painting for a seven-year-old, '
             'in the exact painted style of image 1: richly detailed painterly picture book, warm light, tactile moss, stone, wood and water, '
             'gentle expressive faces. Image 1 is a style reference only; do not copy its fox, tunnel or composition.']
    refs = [STYLE]
    for c in chars:
        url, desc = CHARS[c]
        refs.append(url)
        lines.append(f'Image {len(refs)} is the exact identity of {desc}.')
    if 'G' in chars:
        lines.append(SCALE)
    if 'A' in chars and ('G' in chars or 'O' in chars):
        lines.append('Only Artus wears armour and a red cape; Gus and Oren never wear armour, capes or scarves.')
    absent = [n for c, n in [('A', 'no boy'), ('O', 'no old man'), ('G', 'no giant')] if c not in chars]
    lines.append('Scene: ' + scene)
    lines.append('Only the characters named in the scene appear' + ('; ' + ', '.join(absent) if absent else '') + '.')
    lines.append(SAFE)
    return refs, ' '.join(lines)


REFS = [
    ('ref-oren', OREN),
    ('ref-gus', GUS),
]


def ref_prompt(desc):
    return ('Use case: character reference. Paint one full-length character on a plain warm cream background, standing, three-quarter view, '
            'friendly smile, in the exact painted children’s picture-book style of image 1 (style only; do not copy its fox, tunnel or scene). '
            f'Character: {desc}. Original character design. Whole figure visible from hat to boots with a little space around. '
            'No other characters, no scenery, no text, no letters, no border, no turnaround sheet: one single pose.')


PAGES = [
    ('cover', 'APOG', 'Golden late afternoon. A tall round stone wizard’s tower with a pointed blue roof stands on a green hill above soft clouds, with a faint grey glow at its very top. Gus stands beside the tower, smiling; Artus and Pip wave from his chest pocket. Old Oren waves from a high tower window. A silver lake and a dark wood lie below the hill.'),
    # 1 The giant at the door
    ('wt-giant-a1', 'AP', 'Sunny morning inside a cosy wooden cottage room. Artus stands at an open window and looks up in amazement; outside the window there is only a gigantic brown boot and the leg of a giant, cut off by the top of the frame. Pip by the fireplace drops his bread and cheese in surprise. Note: in this picture the giant is only a huge boot and leg outside the window, no face.'),
    ('wt-giant-a2', 'APG', 'Outside a small wooden cottage on a sunny morning. Gus sits on the grass so that his big friendly face is level with the cottage window; he looks in shyly and gently, holding a small folded letter between two fingers. Pip peeks out from behind the open cottage door, worried. Artus stands in the doorway, curious.'),
    ('wt-giant-1', 'APG', 'Sunny morning by the cottage. Gus kneels and holds out his huge open hand; a tiny folded letter lies on his palm. Artus stands on the ground and reads the unfolded letter with excitement (the paper shows only faint wavy lines, no letters). Pip looks up at Gus with growing trust.'),
    ('wt-giant-2', 'APG', 'Gus strides over a green forest and a river, giant boots among the treetops, wind in the leaves. Artus and Pip peek happily out of the big chest pocket of his dungarees, hair blown by the wind; next to them in the pocket is a red tomato as big as Pip. The little cottage is small far behind.'),
    # 2 Gus's farm
    ('wt-farm-a1', 'APG', 'A giant’s farm in sunshine: a carrot plant as tall as a tree with a huge orange carrot top showing, bean pods as long as boats hanging from tall poles, and a field of tomatoes each as big as a ball. Artus and Pip stand tiny in front, staring up in wonder. Gus stands proudly behind, near a huge farmhouse.'),
    ('wt-farm-a2', 'APG', 'In the giant’s farmyard: a brown hen as big as a horse stands up from her straw nest, revealing a white egg as big as Pip. Pip hides behind Artus. Gus laughs kindly. Later lunch idea: a huge plate with a giant fried egg and a slice of bread beside them.'),
    ('wt-farm-1', 'APG', 'The end of the giant’s farm field: the big trees have brown, falling leaves, the bean pods are small and grey, the carrots thin. Gus sits on the ground, very sad, his huge shoulders down. Artus and Pip stand by his boot, looking around with concern. Soft grey light.'),
    ('wt-farm-2', 'APG', 'Gus sits on the ground, sad but starting to smile. Pip stands on Gus’s huge knee and holds up a slice of cake to him; the cake is tiny next to Gus’s giant fingers. Artus stands beside them with a brave, determined look, pointing towards a distant hill with a tower.'),
    # 3 The lake
    ('wt-lake-a1', 'APG', 'Late afternoon in a dark, tall, quiet wood. A narrow road runs through the trees. Gus walks very carefully between the tall trunks, ducking his head under branches, his hat in his hand. Artus and Pip look out of his chest pocket.'),
    ('wt-lake-a2', 'APG', 'On the dark forest road: Pip stands proudly and breathes a small, gentle, warm orange flame onto a few sticks on the road, making a little campfire. Five little cold birds huddle close to it and fluff up as they get warm; one bird already flies up. Artus kneels, smiling. Gus watches from behind, crouching.'),
    ('wt-lake-1', 'APG', 'Evening. Gus wades into a wide, still, dark lake; the water reaches his chest pocket. Artus and Pip look down from the pocket into the dark water, worried. On the far side of the lake, on a hill, stands a tall stone tower with a pointed blue roof and a tiny light at its top.'),
    ('wt-lake-2', 'APG', 'Night on the lake. From the pocket, Artus holds up his hand and a bright white magic light shines down into the clear water, showing a path of big white stepping stones on the lake bottom. Gus steps carefully onto the glowing stones. Pip cheers. The tower on the hill waits on the far shore.'),
    # 4 The tower
    ('wt-tower-a1', 'APG', 'A very tall round stone tower with a pointed blue roof stands on a green hill and rises up above the clouds. Its small wooden door is far too small for Gus. Gus sits beside the door like a little hill, waving. Artus and Pip stand at the open door, about to go in.'),
    ('wt-tower-a2', 'APO', 'Inside a warm round wizard’s room full of shelves of books, rolled maps and a crackling fireplace. Oren sits beside the fire in a big armchair; he has stood up and looks around, puzzled, searching for his hat while his tall starry hat is right on his head. Artus points at the hat and grins; Pip laughs.'),
    ('wt-tower-1', 'APO', 'Night at the open top of the tower: a round stone room with no roof and the dark sky above. In the middle sits a big round stone on a stone stand; it is dull grey with only a very faint white glow. Oren stands beside it with his staff, serious and kind, explaining. Artus and Pip look at the stone.'),
    ('wt-tower-2', 'APO', 'At the top of the tower beside the dull grey round stone: Oren bends down and puts a kind hand on Artus’s shoulder, smiling encouragingly. Artus looks thoughtful and a little unsure. Pip flies towards a wooden door in the background, eager to go.'),
    # 5 The flying books
    ('wt-books-a1', 'APO', 'A round tower book room with tall wooden bookshelves. Dozens of books fly around the room flapping their covers like birds; small books hop on the floor; some bounce up and down. Pip leaps up to grab one and a big blue book bumps him so he tumbles. Artus and Oren stand at the doorway, amazed. Pages show only faint wavy lines.'),
    ('wt-books-a2', 'APO', 'In the book room: Artus sits on the floor reading a small green book aloud. Many books have landed and sit in a calm half circle around him, as if listening. Pip sits beside him, quiet. Oren smiles in the doorway. Warm, calm light. Pages show only faint wavy lines.'),
    ('wt-books-1', 'APO', 'In the book room: a very big old red-and-gold spell book floats gently down from high up near the ceiling towards Artus, who sits reading a small green book. Pip and Oren watch with hope. Pages show only faint wavy lines.'),
    ('wt-books-2', 'APOG', 'In the tower book room: Oren holds the big open red spell book and looks worried, because two pages are torn out (a ragged edge shows). Outside the open round window, Gus’s huge friendly face looks in and he points far away. Artus and Pip turn to the window, ready to go. Pages show only faint wavy lines.'),
    # 6 The lost pages
    ('wt-pages-a1', 'APG', 'A snowy mountain top in cold wind and blue sky. Gus walks in deep snow, holding his hat on. Artus and Pip in his chest pocket point at a small snowy pine tree, under which one white page is half buried in the snow. Pip shivers, wings wrapped around himself.'),
    ('wt-pages-a2', 'APG', 'Snowy mountain top in sunshine: Pip breathes a very tiny, soft, warm glow (not a big flame) onto the snow under a small pine tree, and the snow melts. Artus holds up a white page with shining gold lines on it (no readable letters), smiling. Gus kneels behind them, delighted.'),
    ('wt-pages-1', 'APG', 'Deep in the green woods: a huge ancient tree with a thick trunk and grey bark whose knots form a gentle, kind old face with sleepy eyes just opening. Artus, Pip and Gus look up at it in wonder. Big roots spread over the dry ground.'),
    ('wt-pages-2', 'APG', 'At the roots of the ancient tree with the kind bark face: Gus pours water from his big straw hat onto the roots. Pip, with very muddy hands and dirt on his nose, proudly holds up a white page he dug out of the dirt. Artus holds a little brown seed in his palm, smiling.'),
    # 7 The spell
    ('wt-spell-a1', 'APOG', 'Evening in the warm wizard’s room by the fire: Oren pours hot chocolate from a big pan into cups. Artus and Pip hold steaming cups. Outside the round window, Gus holds the biggest cup, which looks tiny in his giant fingers, and drinks it in one go.'),
    ('wt-spell-a2', 'APO', 'By the fire in the wizard’s room: Pip happily holds four round cookies, with crumbs on his face, while Artus looks at him with mock surprise. Oren laughs and holds out a plate of more cookies. A window shows a dark night with a moon but no stars.'),
    ('wt-spell-1', 'APO', 'Night at the open top of the tower under a dark sky with a moon and no stars: Artus holds the big open red spell book and reads aloud to the round grey stone, which is starting to glow softly. Oren stands beside him, pointing gently at the page; Pip watches, holding his breath. Pages show only faint wavy lines.'),
    ('wt-spell-2', 'APO', 'Night at the top of the tower: the round stone blazes with warm golden-white light like a small sun, beams shining up into the sky. Artus, holding the open spell book, looks up in wonder; Oren raises his staff with joy; Pip spreads his wings in the light.'),
    # 8 The light
    ('wt-light-a1', 'APOG', 'Night landscape seen from the hill: a beam of gold light rises from the top of the tower, and a thousand bright stars and a bright moon fill the sky. Below, the land glows: green farm fields and a lit village. Gus jumps for joy beside the tower; Artus, Pip and Oren stand at the top of the tower.'),
    ('wt-light-a2', 'APO', 'Night in a small village below the hill: every cottage window glows warm yellow. Men, mothers, fathers, girls and boys come out of their houses and look up at the bright tower on the hill. Seen from the top of the tower, Oren puts a hand on Artus’s back, and Pip smiles.'),
    ('wt-light-1', 'APG', 'Sunny morning on the hill by the tower: villagers gather around. Gus carries a giant round plate with an enormous cake. A little village boy looks up at Artus with admiration. Pip eats cake from a big bowl, cake on his face.'),
    ('wt-light-2', 'APOG', 'Morning on top of the hill beside a small new green sapling tree: Oren pins a little gold star onto a small hat that Artus holds, smiling proudly. Artus beams. Pip sits beside him. Gus smiles shyly in the background, ready to carry them home.'),
]


def batch(name, items):
    # A batch that was already sent is the record of its prompts, so it is never rewritten.
    if (HERE / (name + '.json')).exists():
        return print(name, 'already sent; kept')
    spec = {'model': MODEL, 'stage': name, 'count': len(items), 'images': items}
    (HERE / (name + '.json')).write_text(json.dumps(spec, indent=1, ensure_ascii=False) + '\n')
    print(name, len(items))


# Retakes after review (14 November 2026): the giant or the wizard took Artus's armour, Gus was missing from the
# cover or drawn too small, Oren wore armour, and Artus was missing from the last picture.
RETAKES = [
    ('cover', 'APOG', 'Golden late afternoon. A tall round stone wizard’s tower with a pointed blue roof stands on a green hill above soft clouds. Gus stands on the hill right beside the tower and is almost as tall as it: his head is level with its top window. Artus and Pip peek out of Gus’s chest pocket and wave. Old Oren waves from the top window of the tower. A silver lake and a dark wood lie far below.'),
    ('wt-giant-1', 'APG', 'Sunny morning on the grass by a small cottage. Gus kneels on one knee and lowers his huge open hand towards Artus; even kneeling, Gus is taller than the cottage door. Artus stands on the grass and reads an unfolded letter with excitement (the paper shows only faint wavy lines, no letters). Pip stands beside Artus and looks up at Gus with growing trust.'),
    ('wt-farm-1', 'APG', 'The end of the giant’s farm field: big trees with brown, falling leaves, small grey bean pods, thin carrots. Gus, in his green dungarees and straw hat, sits on the ground, very sad, his huge shoulders down; even sitting he is far taller than Artus. Artus and Pip stand by his big boot, looking around with concern. Soft grey light.'),
    ('wt-tower-a2', 'APO', 'Inside a warm round wizard’s room full of shelves of books, rolled maps and a crackling fireplace. Oren, wearing only his long deep-blue starry robe and tall starry hat, stands beside the fire, looking around puzzled for his hat while his tall starry hat is right on his head. Artus points at the hat and grins; Pip laughs.'),
    ('wt-lake-1', 'APG', 'Evening. Gus is a huge giant who fills most of the picture’s height; he wades into a wide, still, dark lake and the water reaches up to his chest pocket. Artus and Pip look down from the pocket into the dark water, worried. On the far side of the lake, on a hill, stands a tall stone tower with a pointed blue roof and a tiny light at its top.'),
    ('wt-pages-2', 'APG', 'At the roots of a huge ancient tree whose bark has a gentle, kind face: Gus kneels behind and tips water from his big straw hat onto the roots; kneeling, he is still three times as tall as Artus. Pip, with very muddy hands and dirt on his nose, proudly holds up a white page he dug out of the dirt. Artus holds a little brown seed in his palm, smiling.'),
    ('wt-light-2', 'APOG', 'Morning on top of a green hill beside a small new green sapling tree. Artus, in his silver armour and red cape, holds out both hands; Oren bends down and places a little shining gold star in Artus’s hands. Artus beams. Pip sits beside Artus. Gus stands behind them, smiling shyly.'),
]
batch('art-characters', [{'id': i, 'references': [STYLE], 'aspect_ratio': '2:3', 'prompt': ref_prompt(d)} for i, d in REFS])
scenes = []
for pid, chars, scene in PAGES:
    refs, text = prompt(chars, scene)
    scenes.append({'id': pid, 'references': refs, 'aspect_ratio': '3:2', 'prompt': text})
batch('art-scenes-1', scenes[:17])
batch('art-scenes-2', scenes[17:])
batch('art-retakes-1', [{'id': pid, 'references': prompt(chars, scene)[0], 'aspect_ratio': '3:2', 'prompt': prompt(chars, scene)[1]} for pid, chars, scene in RETAKES])
