"""Writes the four reviewed Moon Key scene batches (cover plus one picture per story page) for mission-art.yml.
Run: python3 docs/adventures/moon-key/make-art-batches.py"""
import json
from pathlib import Path

B = 'https://ikarus-eth.github.io/Blitzword_app/'
REF = 'https://raw.githubusercontent.com/Ikarus-eth/Blitzword_app/claude/moon-key-art/docs/adventures/moon-key/generated/art-characters/'
STYLE = B + 'assets/story-pilot/scenes/fox-call.webp'
CHARS = {
    'A': (B + 'assets/family-review/images/knight-boy-d.webp', 'Artus, a young boy knight: tousled golden-ginger hair, freckles, green eyes, green botanical tunic, worn silver armour, red scarf and cape. Keep child proportions'),
    'P': (B + 'assets/evolution/pip-stage-0.webp', 'Pip, his small dragon: orange-gold scales, cream fluffy chest, amber eyes, small dark-membrane wings, leafy tail tuft; Pip is about knee high to Artus'),
    'J': (B + 'assets/adventures/thunder-mountain/ref-jet.webp', 'Jet, Pip’s cousin: a small young dragon the same size as Pip with bright red scales, cream belly, small cream horns and big leaf-green wings'),
    'S': (REF + 'ref-sam.webp', 'Sam, a kind old sailor with white hair and a short white beard, a dark blue knitted jumper and a faded red woollen cap'),
    'M': (REF + 'ref-may.webp', 'May, a friendly little ghost girl, softly glowing pale blue-white and slightly see-through, in a long old-fashioned nightdress; sweet, never scary'),
    'B': (REF + 'ref-blackbird.webp', 'the black bird, a very big glossy black bird like a huge friendly raven with black-and-blue wings, and her three tiny fluffy black chicks'),
    'Q': (REF + 'ref-owl-queen.webp', 'the owls: the large snowy Owl Queen with a small gold crown, and her much smaller plain white messenger owl'),
}
SAFE = ('Draw new natural poses, not the reference poses pasted on. Full scene, edge-to-edge, coherent perspective and shared lighting, '
        'natural contact shadows. No text, no letters, no numbers, no UI, no borders, no panels, no inset portraits. '
        'Child-friendly: nothing frightening, no injuries. Keep every character fully inside the frame.')

def prompt(chars, scene, night=False):
    lines = ['Use case: illustration-story. Create one polished landscape 3:2 children’s fantasy storybook painting for a seven-year-old, '
             'in the exact painted style of image 1: richly detailed painterly picture book, warm light, tactile moss, stone, wood and water, '
             'gentle expressive faces. Image 1 is a style reference only; do not copy its fox, tunnel or composition.']
    refs = [STYLE]
    for c in chars:
        url, desc = CHARS[c]
        refs.append(url)
        lines.append(f'Image {len(refs)} is the exact identity of {desc}.')
    if 'P' in chars and 'J' in chars:
        lines.append('Pip is orange-gold, never red; Jet is the red dragon with green wings. Draw exactly one of each.')
    if night:
        lines.append('The night sky has NO moon at all: no full moon, no crescent moon, no moon reflection anywhere. Only stars or clouds.')
    absent = [n for c, n in [('A', 'no boy'), ('M', 'no ghost'), ('S', 'no old man')] if c not in chars]
    lines.append('Scene: ' + scene)
    if absent:
        lines.append('Only the characters named in the scene appear; ' + ', '.join(absent) + ' unless the scene names them.')
    lines.append(SAFE)
    return refs, ' '.join(lines)

PAGES = [
    ('cover', 'APJQ', 'Night on a grassy hill above a sleeping village. Artus, Pip and Jet stand together looking up at a dark sky full of stars but with no moon at all. A small white messenger owl flies towards them. Far away on the dark ocean horizon, a tiny island with an old castle on top.'),
    # The Owl at the Window
    ('mk-owl-a1', 'AP', 'Night in Artus’s cosy wooden bedroom. Artus looks out of an open window at a very dark sky with no stars and no moon. Pip is curled up sleepily on a rug by a small glowing fireplace, almost asleep.'),
    ('mk-owl-a2', 'APQ', 'Night. Outside Artus’s bedroom window, only the small plain white messenger owl taps on the glass with its beak (no crowned owl). Artus points at it in surprise; drowsy Pip lifts his head by the fire.'),
    ('mk-owl-a3', 'APQ', 'Inside the cosy bedroom at night: only the small plain white messenger owl sits on a stool by the warm fire, fluffed up and talking. Artus and Pip sit on the rug listening closely. No crowned owl.'),
    ('mk-owl-a4', 'APQ', 'Inside by the fire at night: only the small plain white messenger owl speaks earnestly with one wing raised. Pip beams with pride, wings up; Artus listens, thoughtful and brave. No crowned owl.'),
    ('mk-owl-1', 'Q', 'Night. Only the Owl Queen with her small gold crown stands on the tower of a castle on a very high rock, holding up a gold key towards a softly glowing round moon in the dark sky. Magical, calm, beautiful. No other characters.'),
    ('mk-owl-2', 'B', 'Night over a dark forest. The big black bird flies away high over the trees, carrying a bright glowing gold key in her beak. Below, little forest animals peek up from the trees. A few small cottages with dark windows. Not scary, a little mysterious. No chicks.'),
    ('mk-owl-3', 'APQ', 'Night at the open bedroom window. Only the small plain white messenger owl holds out a small white bell to Artus with one wing; Artus takes it carefully. Pip watches. Dark sky outside. No crowned owl.'),
    ('mk-owl-4', 'APJ', 'Bright morning at a cottage door. Jet has just arrived with a big bag on his back and holds up a round cake. Pip is thrilled by the cake, wings fluttering. Artus smiles in the doorway.'),
    ('mk-owl-5', 'APJ', 'Morning outside the cottage. Artus puts a rolled map and a small white bell into his brown leather shoulder bag. Pip happily stuffs cake, bread and cheese into his own small overfull bag. Jet waits on the path that leads down to a river.'),
    # The Beaver's Boat
    ('mk-river-a1', 'APJ', 'Sunny day. Artus, Pip and Jet walk along the bank of a fast, sparkling blue river. Birds fly over the water. Pip looks tired and hungry.'),
    ('mk-river-a2', 'APJ', 'At the top of a big waterfall that pours down over large rocks. Artus, Pip and Jet stand near the edge, looking down, worried. Spray and rainbows in the mist.'),
    ('mk-river-a3', 'APJ', 'By the river: a brown beaver with big front teeth pushes a big stick into its dam of sticks and rocks in the water. Artus, Pip and Jet watch from the bank, curious. The beaver looks busy and a little grumpy.'),
    ('mk-river-a4', 'APJ', 'By the beaver’s dam: Artus kneels down and speaks kindly to the grumpy brown beaver, who listens with a big stick in its paws. Pip flexes his small arm to show he is strong; Jet watches.'),
    ('mk-river-1', 'APJ', 'By the river: Pip and Jet fly carrying big sticks of wood; Artus carries a rock. The brown beaver smiles on its dam. Busy, happy teamwork.'),
    ('mk-river-2', 'APJ', 'By the river: the smiling brown beaver proudly shows a small round wooden boat it has made. Artus, Pip and Jet look at the boat, delighted.'),
    ('mk-river-3', 'APJ', 'A narrow path down beside the big waterfall. Little Pip carries the small round wooden boat on his back, upside down like a shell, looking very strong and proud. Artus and Jet follow down the path.'),
    ('mk-river-4', 'APJ', 'The small round wooden boat floats on a calm green and blue river in warm sun. Artus, Pip and Jet sit in it. A very old turtle with a big blue shell pops its head up beside the boat to talk to them.'),
    ('mk-river-5', 'APJ', 'Night in the small round wooden boat, tied to the river bank. Artus sleeps. Pip guiltily eats a piece of cake with crumbs on his face; Jet frowns at him with hands on hips.'),
    # The Fox in the Fog
    ('mk-fog-a1', 'APJ', 'Morning. Thick white fog covers the river. The small round wooden boat drifts slowly; Artus, Pip and Jet peer into the fog, very quiet and a little nervous. Only faint shapes of trees.'),
    ('mk-fog-a2', 'APJ', 'In the fog: the small wooden boat has bumped a rock and water splashes in. Pip flies to a tree holding a rope and pulls; the boat slides up onto the grassy land. Artus and Jet hold on.'),
    ('mk-fog-a3', 'APJ', 'Foggy river bank: the small wooden boat lies on the grass with a big hole in its side. Out of the fog steps a friendly red fox with a long bushy tail. Artus, Pip and Jet turn in surprise.'),
    ('mk-fog-a4', 'APJ', 'Foggy river bank: the red fox patches the hole in the boat with a piece of wood and pats mud on it. Pip offers the fox a slice of cake. Artus and Jet watch.'),
    ('mk-fog-1', 'APJ', 'On the misty bank: the red fox happily eats a slice of cake. Jet looks proud of his grandma’s cake. Artus kneels and asks the fox a question.'),
    ('mk-fog-2', 'APJ', 'On the misty bank: the red fox sits up and points one paw up at the sky, telling a story. Artus, Pip and Jet look up where it points, amazed.'),
    ('mk-fog-3', 'APJ', 'On the misty bank: the red fox talks; Jet hugs himself looking afraid; Pip holds a piece of cake and grins; Artus listens bravely.'),
    ('mk-fog-4', 'APJ', 'Edge of a misty forest: the red fox trots away into the trees, only its red tail still showing. Artus, Pip and Jet wave goodbye by their boat.'),
    ('mk-fog-5', 'APJ', 'Sunny late morning. The small wooden boat floats on a wide river. Ahead, a little town of white houses by the river, and beyond it the huge sparkling blue ocean. Jet points excitedly; Pip and Artus cheer.'),
    # Sam's Ship
    ('mk-town-a1', 'APJ', 'A small quiet seaside town with white houses, boats by the water and a harbour. Artus asks a friendly fisherman for directions; Pip and Jet look around. The fisherman is a background villager in a brown coat, not a sailor in a red cap.'),
    ('mk-town-a2', 'APJS', 'End of the harbour: Sam sits sadly on a crate beside his big old wooden sailing ship. Artus, Pip and Jet greet him politely.'),
    ('mk-town-a3', 'APJS', 'Beside the old ship: Sam stands up and looks up at the sky, deciding to help. Artus, Pip and Jet smile hopefully.'),
    ('mk-town-a4', 'APJ', 'A busy little market in the seaside town: Artus holds bread and a fish; Jet carries a water jug; Pip proudly carries a very big cake, almost bigger than him.'),
    ('mk-town-1', 'APJS', 'Sunny morning: Sam pulls a long rope and the old sailing ship leaves the harbour. Artus, Pip and Jet stand at the back of the ship; the little white town gets small behind them.'),
    ('mk-town-2', 'APJS', 'The old ship sails fast over blue waves under white sails. Pip and Jet fly above the ship. Artus helps Sam pull ropes on the deck.'),
    ('mk-town-3', 'APJS', 'Open blue ocean: a big friendly grey shark swims round the old ship, its fin out of the water, with a gentle face. Jet clings to the rail, scared; Sam laughs kindly; Pip leans over curiously.'),
    ('mk-town-4', 'APJS', 'Golden evening on the ship’s deck: Sam at the wheel tells a story; Artus, Pip and Jet sit and listen. Far away, a tiny island on the horizon.'),
    ('mk-town-5', 'APJS', 'Night with no moon, black sky. Pip and Jet sit high on the ship’s mast holding small bright flames that light the dark waves. Sam steers below, smiling; Artus watches.'),
    # The Storm
    ('mk-storm-a1', 'APJS', 'Morning on the ship under a grey sky; the waves are getting big. Pip eats bread and a fish for breakfast. Sam looks up worried. Far away, lightning flashes over the ocean.'),
    ('mk-storm-a2', 'APJS', 'Heavy rain; the ship rides up a huge wave. Pip covers frightened Jet with his wing; Artus holds on and calls to be brave; Sam grips the wheel. Dramatic but child-friendly.'),
    ('mk-storm-a3', 'APJS', 'A big wave splashes over the deck. Artus holds a snapped rope tight with both hands as the wind pulls; a piece of wood has fallen. Sam shouts encouragement.'),
    ('mk-storm-a4', 'APJ', 'Stormy sea: little Jet is in the big waves, his wings wet, calling for help. On the ship, Artus leans over the rail reaching out; Pip looks shocked. Child-friendly, hopeful.'),
    ('mk-storm-1', 'APJ', 'Stormy sea: Pip tries to fly to Jet but the strong wind pushes him back. Artus throws a rope but it falls short of Jet in the waves.'),
    ('mk-storm-2', 'APJ', 'Stormy sea: the big friendly grey shark rises up under Jet, and Jet sits on her back as she swims towards the ship. Artus and Pip watch from the ship in amazement.'),
    ('mk-storm-3', 'APJS', 'On the ship’s deck in the rain: Artus pulls wet Jet aboard with a rope; Sam smiles; Pip leans over waving thank you to the grey shark in the water.'),
    ('mk-storm-4', 'APJ', 'After the storm: the sea is calm and a bright rainbow arches over the ocean. On deck, Pip makes a small warm fire on his palm to warm Jet, who sits wrapped in a blanket and smiles.'),
    ('mk-storm-5', 'APJS', 'Bright day at sea: ahead is an island with big black rocks, tall green trees and an old stone castle on top. Artus points from the front of the ship; Pip, Jet and Sam look.'),
    # The Little Ghost
    ('mk-castle-a1', 'APJ', 'A rocky path up an island to an old castle, with old trees and big rocks. Pip finds an old rusty sword stuck in the rocks and looks at it; Artus shakes his head kindly; Jet watches. Far below, the old ship waits in the bay.'),
    ('mk-castle-a2', 'APJ', 'In front of a big black old castle gate: Artus pulls on it, but it won’t open. Pip laughs; Jet looks up at the high wall.'),
    ('mk-castle-a3', 'APJ', 'At the castle wall: little Jet squeezes into a small hole near the ground, his tail still showing. Artus and Pip wait beside the closed gate.'),
    ('mk-castle-a4', 'APJ', 'The big castle gate stands open. Jet stands in the gateway with a big proud smile. Artus and Pip cheer.'),
    ('mk-castle-1', 'APJ', 'Inside a dark, cold old castle hall with old wooden doors. Pip holds up a small flame to light the way; Artus and Jet walk close together. Cobwebs, cosy-spooky but not frightening.'),
    ('mk-castle-2', 'APJ', 'An old castle corridor: Artus, Pip and Jet tiptoe very quietly towards a half-open door, listening; Jet looks scared; soft light comes from the room.'),
    ('mk-castle-3', 'APJM', 'A big old castle room: May the little ghost girl sits on the floor crying softly. Jet hides under Pip’s wing. Artus steps forward kindly.'),
    ('mk-castle-4', 'APJM', 'In the castle room: May looks sad and lonely, talking. Pip pulls a cake out of his bag with a hopeful smile; Artus and Jet sit near her.'),
    ('mk-castle-5', 'APJM', 'In the castle room: Artus, Pip, Jet and May sit on the floor sharing cake. May smiles happily. Warm, friendly.'),
    # The Nest
    ('mk-nest-a1', 'APJM', 'In a castle room: May shows a small hidden door in the stone wall. Artus, Pip and Jet look at it in wonder.'),
    ('mk-nest-a2', 'APJM', 'A dark winding stone staircase going up and round. May floats ahead glowing softly; Artus and Jet climb; Pip sits on a step, tired, then looks at his own wings.'),
    ('mk-nest-a3', 'APJM', 'On the winding stairs: May tells them a story with a gentle face; Jet and Pip listen, remembering being afraid of the dark; Artus listens.'),
    ('mk-nest-a4', 'APJM', 'At the top of the stairs: Artus opens a little wooden door very slowly; warm light shines out; Pip, Jet and May peek in.'),
    ('mk-nest-1', 'APJMB', 'A tower room with a very big nest made of sticks and old rope. In it sit three tiny fluffy black chicks among shiny coins, small bells and keys, and in the middle a big glowing gold key. Artus, Pip, Jet and May peek in from the doorway. The mother black bird is not here yet.'),
    ('mk-nest-2', 'APJB', 'The big black bird swoops in through the tower window, wings spread wide, protecting her nest and chicks. Jet hides under Pip’s wing. Artus stands calm and does not run.'),
    ('mk-nest-3', 'APJB', 'In the tower room: Artus speaks gently to the big black bird, one hand open. She listens, wings folding. Pip and Jet stand behind Artus.'),
    ('mk-nest-4', 'APJB', 'In the tower room: the big black bird explains, looking at her three tiny chicks snuggled close to the glowing gold key in the nest. Artus, Pip and Jet listen with sympathy.'),
    ('mk-nest-5', 'APJB', 'In the tower room: the big black bird looks sadly out of the window at a black night sky with no moon. Artus looks at Pip; Pip lifts one claw with a bright idea on his face; Jet watches.'),
    # The Moon Comes Back
    ('mk-moon-a1', 'APJB', 'In the tower room by the nest: Pip holds up a small round blue coin and breathes a tiny flame onto it, and the coin starts to glow bright blue. Artus, Jet and the big black bird watch.'),
    ('mk-moon-a2', 'PB', 'Close view of the big nest: the three tiny fluffy black chicks gaze in delight at a glowing blue coin, like a little star. Pip smiles beside the nest; the mother black bird looks on.'),
    ('mk-moon-a3', 'APB', 'In the tower room: the big black bird looks at the glowing blue coin, then at Pip with surprised, grateful eyes. Pip offers the coin; Artus smiles.'),
    ('mk-moon-a4', 'APJB', 'In the tower room: the three chicks sleep peacefully around the softly glowing blue coin in the nest. The big black bird gives the big gold key to Artus with her beak. Pip and Jet smile.'),
    ('mk-moon-a5', 'APJMB', 'In the tower room: May floats by the nest smiling at the sleeping chicks; the big black bird sings with her head raised; May twirls happily round the room. Artus, Pip and Jet watch, happy.'),
    ('mk-moon-1', 'APJQ', 'On the castle tower at night: Artus rings a small white bell. Over the dark ocean, many white owls fly towards them, led by the big Owl Queen with her small gold crown. Pip and Jet look up in wonder.'),
    ('mk-moon-2', 'APQB', 'On the castle tower at night: Artus gives the big gold key to the Owl Queen with the small gold crown. The big black bird stands nearby, a little ashamed; Pip watches.'),
    ('mk-moon-3', 'Q', 'High in the dark night sky: only the Owl Queen with her small gold crown flies upward holding the gold key, and the big round moon bursts out in a wave of bright white light. Magical and joyful. No other characters.'),
    ('mk-moon-4', 'APJM', 'Moonlit night: a big bright round moon over the island castle. May waves happily from a castle window. Artus, Pip and Jet wave back from the path. In the far distance, the town’s windows glow.'),
    ('mk-moon-5', 'AP', 'Night at home in Artus’s cosy bedroom: Artus looks out of the window at a big bright full moon. Pip sits by the warm fireplace happily holding the last piece of cake.'),
]

RETAKES = {}
BATCHES = [('art-scenes-1', 'cover mk-owl mk-river'), ('art-scenes-2', 'mk-fog mk-town'), ('art-scenes-3', 'mk-storm mk-castle'), ('art-scenes-4', 'mk-nest mk-moon')]
here = Path(__file__).parent
done = set()
for name, prefixes in BATCHES:
    imgs = []
    for pid, chars, scene in PAGES:
        if any(pid == p or pid.startswith(p + '-') for p in prefixes.split()):
            order = [p[0] for p in PAGES]
            night = order.index(pid) < order.index('mk-moon-3') and any(w in scene.lower() for w in ('night', 'dark sky', 'no moon'))
            refs, text = prompt(chars, scene, night)
            imgs.append({'id': pid, 'references': refs, 'aspect_ratio': '3:2', 'prompt': text})
            done.add(pid)
    (here / (name + '.json')).write_text(json.dumps({'model': 'fal-ai/nano-banana/edit', 'stage': name, 'count': len(imgs), 'images': imgs}, indent=1, ensure_ascii=False))
    print(name, len(imgs))
assert done == {p[0] for p in PAGES}, 'every page in a batch'
