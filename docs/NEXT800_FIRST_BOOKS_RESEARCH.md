# Next 800 words for first books

Research record · 9 October 2026 · Pool accepted and implemented; see [release status](NEXT800_RELEASE.md)

## Recommendation

Keep the existing 200 playable words and add the 800 distinct written forms below. Prioritise words that help a child read ordinary beginner stories: sentence-building words, common actions and their useful forms, dialogue, everyday life, feelings, nature and a smaller adventure vocabulary. Include written numbers explicitly. This is an editorial curriculum proposal informed by reading research, not a claim to have identified the statistically optimal 800 words for this child.

The parent has confirmed a broad beginner-book selection and everyday vocabulary rather than a strict fantasy-only restriction. These decisions supersede the old workbook's theme filter for this proposed expansion. The existing game can retain its fantasy setting while its reading targets cover ordinary books.

Book reading should start alongside the expansion. A count of 1,000 recognised words is neither a prerequisite nor proof of independent reading. A child also needs to decode unfamiliar words, understand sentences and sustain reading across a page.

## What was checked

- Read current main's README, CURRENT_STATUS and product specification, then fetched content.js and the original curriculum workbook through the GitHub connector on 9 October 2026.
- Confirmed 200 unique playable targets. Their set exactly matches the workbook's Core 200, although the game uses a different order.
- The workbook already proposes 1,000 words, including the original 200. Its overview describes a curated pool using the first 100 inspected CPB words, Dolch, Fry and phonics examples; it explicitly does not claim an exact frequency ranking.
- Compared the revised pool to the playable targets: exactly 800 additions, no case-insensitive duplicates or overlap, and exactly 1,000 combined forms. Of the additions, 457 are retained from the original expansion and 343 are new editorial selections. Accordingly, 343 original expansion entries are deferred.
- Confirmed all specified number words are present in the combined pool. The game already contains one, two and first; 37 number words are new. Another 12 quantity/maths words make the numbers-and-quantity group 49 additions.

Sources: [playable content](../content.js), [original workbook](../curriculum/BLITZWORD_CURRICULUM_200_1000.xlsx), [workbook provenance](../curriculum/README.md). The original workbook remains an unchanged provenance reference. Runtime content now includes the accepted expansion; the counts here describe the pre-expansion research baseline.

## What the research changes

**Use children's books to guide vocabulary.** The 2024 CPB study derives a list from 2,146 picture books and explains why older lists are imperfect proxies for beginning readers; Fry's source texts were for older pupils. This supports broadening the old pool and including useful inflected forms. It does not establish a unique best teaching order. [Green, Keogh and Prout, 2024](https://ila.onlinelibrary.wiley.com/doi/full/10.1002/trtr.2309).

**Frequency is useful evidence, not a complete curriculum.** CPB-Lex provides picture-book frequency information, but its source uses automatically transcribed read-aloud material. Corpus vocabulary can inform selection without determining an individual child's readiness or guaranteeing book coverage. [Green et al., 2023/2024](https://link.springer.com/article/10.3758/s13428-023-02198-y).

**Teach how the spelling works and read connected text.** The IES practice guide rates decoding and analysis of word parts as supported by strong evidence, and daily connected-text reading by moderate evidence. I recommend combining the game's recognition practice with reading aloud, short sentences and short books. [IES / What Works Clearinghouse](https://ies.ed.gov/ncee/WWC/PracticeGuide/21/Published).

**Match independent books to decoding knowledge.** England's English curriculum combines phonics, common exception words, endings and contractions, with books suited to the child's current knowledge. Teach regular spelling parts even in tricky words; practise unusual parts explicitly. A completed multiple-choice word should also be checked in an unfamiliar sentence. [Department for Education: English](https://www.gov.uk/government/publications/national-curriculum-in-england-english-programmes-of-study/national-curriculum-in-england-english-programmes-of-study).

**Include written numbers as reading vocabulary.** The mathematics curriculum introduces reading/writing one to twenty in words in Year 1 and numbers to at least 100 in Year 2. Our proposed thousand and ordinal coverage are useful extensions for books and game instructions, not claims about a required age or current level. [Department for Education: mathematics](https://www.gov.uk/government/publications/national-curriculum-in-england-mathematics-programmes-of-study/national-curriculum-in-england-mathematics-programmes-of-study).

### Evidence limit

The full modern CPB dataset was not retrieved: the publisher's supplementary-file URLs returned HTTP 403, and the linked TinyURL returned a Cloudflare challenge/403. The published papers were accessible. No new CPB ranks, per-book coverage percentages or claims of matching a complete modern top 1,000 are made here. Original-workbook ranks in the JSON identify old curated positions, not new frequency estimates. Source access to the BlitzWord repository succeeded through the connector after local Git failed to resolve github.com.

## The selection choices

- Fill sentence gaps early: has, been, does, which, these, those, where, why, should, under, through, together.
- Include dialogue as printed: can't, didn't, couldn't, won't, you're, I'll, that's, there's. Explain the expanded phrase and the apostrophe.
- Include high-use forms children meet on pages: going, goes, went; sleeping, slept; taking is deferred, but take, took and taken are covered. Teach families together without assuming knowledge automatically transfers to each spelling.
- Give ordinary life substantial space: breakfast, sandwich, kitchen, bedroom, teacher, pencil, bus, train, doctor, birthday, playground.
- Keep story interest: creature, monster, knight, princess, adventure, journey, clue, secret, escape. Defer many specialised fantasy nouns and mechanically added fantasy plurals to make room.
- Preserve existing mom and dad. Add mum, grandma and grandpa. Use the existing British narration convention for new teaching; include useful printed alternatives such as biscuit/cookie and truck rather than promising a pure dialect list. Properly capitalise I contractions and days of the week.

The counting unit is a distinct printed form. Thus sleep/sleeping/slept can be separate targets; contractions count as one. Letter case does not create an extra word. Generated plurals and number combinations do not silently inflate the 1,000-word count. The 800 IDs in the JSON are proposal IDs, not replacements for current save keys.

## Written numbers

The combined pool covers **zero to twenty; thirty, forty, fifty, sixty, seventy, eighty, ninety; hundred and thousand; first to tenth**. Keep one, two and first as existing targets, preserving their learning history.

Introduce the missing three-to-ten words and zero early, then eleven-to-twenty, then tens, hundred/thousand and ordinals. Interleave number practice with ordinary story language. Particular contrasts worth teaching are three/thirteen/thirty, four/fourteen/forty, five/fifteen/fifty and eight/eighteen/eighty. Avoid making all similar-looking number words simultaneous new targets.

After the component words are secure, practise **twenty-one, thirty-two, ninety-nine, one hundred and five, two hundred and thirty-six, one thousand** as readable combinations. These are not six extra vocabulary slots. Teach quantity in untimed sentences such as “There are twelve eggs” as well as isolated recognition. Word identification and understanding the quantity should be tracked separately if quantity checks are implemented.

## Suggested introduction and reading practice

The lists below are grouped for review, not a fixed lesson order. The existing adaptive practice can eventually draw from approved additions, but it will need explicit content and progression changes. Reaching a word in the pool does not establish mastery.

Start with this 40-word batch, introducing small sets at a time and retaining due reviews:

has, been, does, us, its, which, these, those, where, why, must, should, under, home, help, give, say, came, put, went, got, eat, ate, play, going, goes, can't, didn't, three, four, five, six, seven, eight, nine, ten, zero, friend, school, happy.

Then blend three priorities: remaining sentence words and everyday essentials; phonics patterns that match his current skills; number words and common story forms. Do not require completion of all 49 number/quantity targets before ordinary vocabulary continues.

For implementation, tag each word's spelling pattern, irregular element, syllables and related forms. Order new examples to support already taught consonant digraphs, adjacent consonants, long-vowel spellings, alternative vowel spellings, endings (-s/-es, -ed, -ing), contractions and increasingly complex words. Examples in this pool include sheep/chick, train/rainy, night/light from the existing core, boat/snow, bird from the core with girl, and mouse/house. The exact sequence should follow any phonics programme he already uses; these examples are not a replacement programme.

Use a broad reading mix: short decodable stories for independent practice; simple family/school/animal stories; counting and nature books; and richer picture books read together. Select actual independent books by the patterns he can decode, not a publisher's age label alone. At each new batch, check a few words aloud in a fresh sentence, read a short passage together, and ask him to retell what happened. Untimed accuracy and meaning matter before faster flashing.

## Original proposal: decisions and next implementation step

Implementation update: the parent approved this expansion, broad beginner-book vocabulary and written numbers. Stories are handled separately. All 800 now have contextual sentences, spelling/meaning tips, answer pools and local speech support; no paid audio or art generation was used. The following notes retain the original research recommendations.

**Settled by the parent:** broad beginner books; ordinary-life vocabulary is included; expand by 800; include written numbers.

**Recommended defaults for review:** keep all current 200 and learner history; count distinct written forms; use the number scope above with composite-number practice; keep British narration and cover useful alternative printed vocabulary; introduce additions gradually with sentence and book practice.

**Useful remaining information:** which phonics programme or letter–sound patterns he already knows. This affects introduction order, not the proposed pool. It can be supplied when available; no particular book series is required.

**Before making the expansion playable:** approve the proposed pool or substitutions, then author and review the new teaching sentences and fair distractors, map introduction/progression, handle existing completed saves, review pronunciation and recording cost, and run content, progression and save-preservation checks. Additional artwork and paid narration are not implied by this research request. Changing the workbook or this proposal alone does not unlock words in the game. No implementation or deployment is claimed.

## Complete proposed 800-word pool

The machine-readable companion is [NEXT800_FIRST_BOOKS.json](../curriculum/NEXT800_FIRST_BOOKS.json). Every word occurs once below. Groups describe its primary role here; words can serve several roles.

### Sentence building and common verbs — 108 words

am, has, been, does, us, its, which, these, those, where, why, much, must, may, should, never, once, soon, today, well, than, other, each, also, even, such, same, another, most, few, enough, almost, sometimes, still, already, yet, perhaps, maybe, together, under, through, between, below, above, across, along, behind, beside, inside, outside, without, until, while, during, against, towards, home, help, give, say, came, put, went, got, let, done, ran, eat, ate, play, fly, sing, use, live, try, grow, draw, fall, ride, buy, please, wash, going, goes, can't, didn't, couldn't, won't, wasn't, isn't, you're, I'll, let's, we'll, that's, there's, he's, she's, we're, they're, I've, you've, we've, doesn't, haven't, hadn't, aren't, weren't.

### Written numbers and quantity — 49 words

zero, three, four, five, six, seven, eight, nine, ten, eleven, twelve, thirteen, fourteen, fifteen, sixteen, seventeen, eighteen, nineteen, twenty, thirty, forty, fifty, sixty, seventy, eighty, ninety, hundred, thousand, second, third, fourth, fifth, sixth, seventh, eighth, ninth, tenth, half, quarter, double, pair, count, number, less, fewer, total, plus, minus, equal.

### Everyday story essentials — 272 words

old, cold, full, blue, better, black, round, warm, brown, clean, sun, door, pretty, king, town, drink, river, key, cloud, mountain, friend, friends, food, fish, horse, dark, morning, farm, egg, ground, field, road, happy, sky, boat, village, snow, hill, boy, lake, set, stone, men, hand, mother, father, feet, girl, dog, milk, tail, safe, bear, low, sea, table, box, room, strong, wind, school, rope, wood, fruit, people, window, bridge, camp, sad, star, sound, place, year, brother, thing, name, great, end, large, need, baby, land, different, move, picture, change, apple, air, animal, page, letter, answer, learn, world, high, near, plant, last, eye, thought, head, wild, story, next, hard, begin, life, paper, dress, children, side, began, took, foot, hear, late, face, bed, young, talk, song, leave, mouth, family, afternoon, body, stand, stick, knew, ever, piece, told, easy, heard, caught, fell, sure, become, top, short, fight, whole, remember, early, listen, hit, himself, step, cook, true, grass, slowly, pulled, voice, seen, lost, cried, wait, quickly, person, became, feel, garden, street, meat, nothing, hat, rest, stay, week, ago, stood, brought, understand, dry, deep, clear, nose, heavy, sugar, built, huge, felt, suddenly, ready, anything, swim, wall, legs, angry, branch, brave, leaf, mud, path, rescue, scared, sat, winter, kept, beautiful, sign, finished, gone, glass, weather, meet, soft, held, speak, son, ice, jumped, care, floor, pushed, everything, tall, evening, hope, spring, laughed, bright, everyone, hair, broken, moment, tiny, quiet, lot, middle, someone, wonder, smiled, trip, hole, surprise, cake, deer, flower, frog, rabbit, wolf, catch, climbed, wrote, shouted, else, ears, grew, cool, sent, wear, bad, alone, drawing, touch, party, woman, choose, sand, guess, crowd, poem, enjoy, fun, send, sister, pick, laugh, hurt, funny.

### Home, family, food and school — 131 words

mum, parents, grandma, grandpa, aunt, cousin, teacher, classroom, lesson, homework, pencil, pen, ruler, bag, lunch, breakfast, dinner, snack, bread, butter, cheese, sandwich, soup, rice, potato, tomato, carrot, bean, banana, orange, lemon, pear, chocolate, biscuit, cookie, sweet, honey, salt, juice, cup, plate, bowl, spoon, fork, knife, bottle, kitchen, bedroom, bathroom, toilet, bath, shower, towel, soap, brush, tooth, teeth, shirt, coat, jacket, trousers, skirt, sock, shoe, boot, pocket, toy, doll, teddy, puzzle, present, birthday, balloon, candle, picnic, beach, holiday, zoo, park, playground, swing, slide, football, swimming, bicycle, bike, bus, train, truck, plane, driver, station, ticket, wheel, engine, hospital, doctor, nurse, shop, money, price, pay, bought, sell, farmer, hen, duck, sheep, cow, goat, pony, mouse, mice, kitten, puppy, pet, elephant, monkey, tiger, whale, spider, ant, bee, butterfly, snail, worm, squirrel, nest, chick, lamb, cub.

### Actions and word families — 89 words

asked, says, talking, call, called, looked, looking, watch, search, hide, hid, hidden, coming, running, walked, walking, jumping, hop, skip, climb, stopped, sitting, lie, lay, sleeping, slept, wake, woke, awake, drank, taken, given, making, doing, getting, carrying, turn, turned, push, opened, close, closed, smile, cry, shout, whisper, whispered, listening, wanted, played, playing, finish, tried, bake, drew, writing, reading, build, break, broke, fallen, flew, flying, swam, rode, drive, drove, throw, threw, kick, follow, followed, lead, led, met, win, won, lose, thinking, known, feeling, forget, forgot, believe, seem, seemed, join, share, shared.

### Descriptions, feelings and story connections — 66 words

bigger, biggest, worse, worst, afraid, worried, lonely, excited, tired, sleepy, hungry, thirsty, ill, sick, shy, proud, silly, friendly, gentle, careful, lovely, dirty, messy, tidy, noisy, rough, smooth, empty, weak, fresh, square, silver, pink, purple, grey, everybody, nobody, somebody, anyone, something, somewhere, anywhere, everywhere, lots, really, nearly, often, usually, finally, later, yesterday, tomorrow, tonight, midnight, weekend, month, season, summer, autumn, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday.

### Nature, places, adventure and reading — 85 words

rainy, sunny, windy, fog, thunder, lightning, rainbow, space, ocean, pond, stream, waterfall, wave, island, dirt, leaves, root, trunk, bark, seed, bush, woods, city, country, yard, fence, roof, stair, tent, barn, tunnel, net, torch, flame, smoke, den, fur, shell, creature, monster, giant, witch, fairy, knight, prince, princess, hero, crown, gold, adventure, journey, problem, plan, idea, clue, secret, mistake, trouble, trap, trick, escape, enemy, group, women, word, sentence, cover, title, music, question, meaning, beginning, ending, chapter, fact, false, real, pretend, dream, reason, although, however, unless, whether, whose.
