(function(root){
const entries=[
  {
    "id": "snow-owl",
    "conceptId": 1,
    "name": "Snow Owl",
    "option": "d",
    "title": "Aurora Seer",
    "description": "white snowy owl, long layered feathers, turquoise-violet aurora edging, spreading wings",
    "reference": "assets/enemy-finals/sheets/pair-01.png",
    "referenceColumn": 2,
    "referenceRow": 0,
    "score": 5,
    "atlas": 1,
    "cell": 0,
    "availability": "future-chapter",
    "family": "snow-owl",
    "minHealth": 3,
    "maxHealth": 5,
    "tier": 0,
    "count": 1,
    "stage": "adult",
    "lore": [
      "This friend lives in the deep forest.",
      "Its white wings shine with the colours of the northern lights."
    ],
    "art": {
      "source": "assets/enemies/approved-20261010/atlas-01.png",
      "width": 1536,
      "height": 1024,
      "view": [
        0,
        0,
        512,
        512
      ]
    },
    "attackMode": "gust"
  },
  {
    "id": "bramble-badger",
    "conceptId": 2,
    "name": "Bramble Badger",
    "option": "d",
    "title": "Amber Burrower",
    "description": "dark badger with amber crystal ridges and warm golden paws",
    "reference": "assets/enemy-finals/sheets/pair-01.png",
    "referenceColumn": 2,
    "referenceRow": 1,
    "score": 5,
    "atlas": 1,
    "cell": 1,
    "availability": "future-chapter",
    "family": "bramble-badger",
    "minHealth": 3,
    "maxHealth": 5,
    "tier": 0,
    "count": 1,
    "stage": "adult",
    "lore": [
      "This friend lives in the deep forest.",
      "It digs safe tunnels with its strong golden claws."
    ],
    "art": {
      "source": "assets/enemies/approved-20261010/atlas-01.png",
      "width": 1536,
      "height": 1024,
      "view": [
        512,
        0,
        512,
        512
      ]
    },
    "attackMode": "melee"
  },
  {
    "id": "ember-fox",
    "conceptId": 3,
    "name": "Ember Fox",
    "option": "d",
    "title": "Sunflare Trickster",
    "description": "golden fox with black legs and vivid ember mane, light agile stance",
    "reference": "assets/enemy-finals/sheets/pair-02.png",
    "referenceColumn": 2,
    "referenceRow": 0,
    "score": 5,
    "atlas": 1,
    "cell": 2,
    "availability": "future-chapter",
    "family": "ember-fox",
    "minHealth": 3,
    "maxHealth": 5,
    "tier": 0,
    "count": 1,
    "stage": "adult",
    "lore": [
      "This friend lives in the deep forest.",
      "Its bright tail keeps lost travellers warm."
    ],
    "art": {
      "source": "assets/enemies/approved-20261010/atlas-01.png",
      "width": 1536,
      "height": 1024,
      "view": [
        1024,
        0,
        512,
        512
      ]
    },
    "attackMode": "ember"
  },
  {
    "id": "rowan-stag",
    "conceptId": 4,
    "name": "Rowan Stag",
    "option": "d",
    "title": "Wild Verdant",
    "description": "dark stag with vibrant green antlers, sparse vine markings and powerful long legs",
    "reference": "assets/enemy-finals/sheets/pair-02.png",
    "referenceColumn": 2,
    "referenceRow": 1,
    "score": 5,
    "atlas": 1,
    "cell": 3,
    "availability": "future-chapter",
    "family": "rowan-stag",
    "minHealth": 3,
    "maxHealth": 5,
    "tier": 0,
    "count": 1,
    "stage": "adult",
    "lore": [
      "This friend lives in the deep forest.",
      "New green leaves grow on its branching antlers."
    ],
    "art": {
      "source": "assets/enemies/approved-20261010/atlas-01.png",
      "width": 1536,
      "height": 1024,
      "view": [
        0,
        512,
        512,
        512
      ]
    },
    "attackMode": "melee"
  },
  {
    "id": "pine-marten",
    "conceptId": 6,
    "name": "Pine Marten",
    "option": "c",
    "title": "Storm Marten",
    "description": "long marten with teal back markings, swept ears and sparking tail tip",
    "reference": "assets/enemy-finals/sheets/pair-03.png",
    "referenceColumn": 1,
    "referenceRow": 0,
    "score": 5,
    "atlas": 1,
    "cell": 4,
    "availability": "future-chapter",
    "family": "pine-marten",
    "minHealth": 3,
    "maxHealth": 5,
    "tier": 0,
    "count": 1,
    "stage": "adult",
    "lore": [
      "This friend lives in the deep forest.",
      "Blue sparks race along its tail before a storm."
    ],
    "art": {
      "source": "assets/enemies/approved-20261010/atlas-01.png",
      "width": 1536,
      "height": 1024,
      "view": [
        512,
        512,
        512,
        512
      ]
    },
    "attackMode": "melee"
  },
  {
    "id": "hazel-hare",
    "conceptId": 7,
    "name": "Hazel Hare",
    "option": "d",
    "title": "Windfoot",
    "description": "cream hare with flowing blue-green scarf and pale wind ribbons around long feet",
    "reference": "assets/enemy-finals/sheets/pair-03.png",
    "referenceColumn": 2,
    "referenceRow": 1,
    "score": 5,
    "atlas": 2,
    "cell": 0,
    "availability": "future-chapter",
    "family": "hazel-hare",
    "minHealth": 3,
    "maxHealth": 5,
    "tier": 0,
    "count": 1,
    "stage": "adult",
    "lore": [
      "This friend lives in the deep forest.",
      "Its blue cloak rides the wind as it leaps."
    ],
    "art": {
      "source": "assets/enemies/approved-20261010/atlas-02.png",
      "width": 1536,
      "height": 1024,
      "view": [
        0,
        0,
        512,
        512
      ]
    },
    "attackMode": "melee"
  },
  {
    "id": "cloak-raccoon",
    "conceptId": 8,
    "name": "Cloak Raccoon",
    "option": "b",
    "title": "Oakshield Scout",
    "description": "upright raccoon with clear black mask, round wooden shield, crimson short cloak",
    "reference": "assets/enemy-finals/sheets/pair-04.png",
    "referenceColumn": 0,
    "referenceRow": 0,
    "score": 5,
    "atlas": 2,
    "cell": 1,
    "availability": "future-chapter",
    "family": "cloak-raccoon",
    "minHealth": 3,
    "maxHealth": 5,
    "tier": 0,
    "count": 1,
    "stage": "adult",
    "lore": [
      "This friend lives in the deep forest.",
      "It shares its wooden shield with smaller friends."
    ],
    "art": {
      "source": "assets/enemies/approved-20261010/atlas-02.png",
      "width": 1536,
      "height": 1024,
      "view": [
        512,
        0,
        512,
        512
      ]
    },
    "attackMode": "melee"
  },
  {
    "id": "chestnut-squirrel",
    "conceptId": 9,
    "name": "Chestnut Squirrel",
    "option": "c",
    "title": "Ember Collector",
    "description": "deep red squirrel with golden glowing tail spiral and cream belly",
    "reference": "assets/enemy-finals/sheets/pair-04.png",
    "referenceColumn": 1,
    "referenceRow": 1,
    "score": 5,
    "atlas": 2,
    "cell": 2,
    "availability": "future-chapter",
    "family": "chestnut-squirrel",
    "minHealth": 3,
    "maxHealth": 5,
    "tier": 0,
    "count": 1,
    "stage": "adult",
    "lore": [
      "This friend lives in the deep forest.",
      "It keeps one warm acorn inside its fiery tail."
    ],
    "art": {
      "source": "assets/enemies/approved-20261010/atlas-02.png",
      "width": 1536,
      "height": 1024,
      "view": [
        1024,
        0,
        512,
        512
      ]
    },
    "attackMode": "melee"
  },
  {
    "id": "moss-bear",
    "conceptId": 10,
    "name": "Moss Bear",
    "option": "c",
    "title": "Sun Bear",
    "description": "dark sleek bear, brilliant golden chest crescent and amber shoulder fur",
    "reference": "assets/enemy-finals/sheets/pair-05.png",
    "referenceColumn": 1,
    "referenceRow": 0,
    "score": 5,
    "atlas": 2,
    "cell": 3,
    "availability": "future-chapter",
    "family": "moss-bear",
    "minHealth": 3,
    "maxHealth": 5,
    "tier": 0,
    "count": 1,
    "stage": "adult",
    "lore": [
      "This friend lives in the deep forest.",
      "Its golden collar glows when the sun comes out."
    ],
    "art": {
      "source": "assets/enemies/approved-20261010/atlas-02.png",
      "width": 1536,
      "height": 1024,
      "view": [
        0,
        512,
        512,
        512
      ]
    },
    "attackMode": "melee"
  },
  {
    "id": "lily-otter",
    "conceptId": 11,
    "name": "Lily Otter",
    "option": "c",
    "title": "River Duelist",
    "description": "upright otter, cobalt reed cape and smooth river pebble shield",
    "reference": "assets/enemy-finals/sheets/pair-05.png",
    "referenceColumn": 1,
    "referenceRow": 1,
    "score": 5,
    "atlas": 2,
    "cell": 4,
    "availability": "future-chapter",
    "family": "lily-otter",
    "minHealth": 3,
    "maxHealth": 5,
    "tier": 0,
    "count": 1,
    "stage": "adult",
    "lore": [
      "This friend lives beside the river.",
      "Its round shield turns river stones into a safe path."
    ],
    "art": {
      "source": "assets/enemies/approved-20261010/atlas-02.png",
      "width": 1536,
      "height": 1024,
      "view": [
        512,
        512,
        512,
        512
      ]
    },
    "attackMode": "melee"
  },
  {
    "id": "dam-beaver",
    "conceptId": 12,
    "name": "Dam Beaver",
    "option": "c",
    "title": "Copper Carpenter",
    "description": "russet beaver with copper-edged log buckler and blue sash",
    "reference": "assets/enemy-finals/sheets/pair-06.png",
    "referenceColumn": 1,
    "referenceRow": 0,
    "score": 5,
    "atlas": 3,
    "cell": 0,
    "availability": "future-chapter",
    "family": "dam-beaver",
    "minHealth": 3,
    "maxHealth": 5,
    "tier": 0,
    "count": 1,
    "stage": "adult",
    "lore": [
      "This friend lives beside the river.",
      "It builds strong dams and carries tools beside its shield."
    ],
    "art": {
      "source": "assets/enemies/approved-20261010/atlas-03.png",
      "width": 1536,
      "height": 1024,
      "view": [
        0,
        0,
        534,
        520
      ]
    },
    "attackMode": "melee"
  },
  {
    "id": "amber-newt",
    "conceptId": 13,
    "name": "Amber Newt",
    "option": "c",
    "title": "Citrine Crest",
    "description": "golden newt with translucent yellow dorsal crest and dark sapphire markings",
    "reference": "assets/enemy-finals/sheets/pair-06.png",
    "referenceColumn": 1,
    "referenceRow": 1,
    "score": 5,
    "atlas": 3,
    "cell": 1,
    "availability": "future-chapter",
    "family": "amber-newt",
    "minHealth": 3,
    "maxHealth": 5,
    "tier": 0,
    "count": 1,
    "stage": "adult",
    "lore": [
      "This friend lives beside the river.",
      "Its golden crest catches the last light of day."
    ],
    "art": {
      "source": "assets/enemies/approved-20261010/atlas-03.png",
      "width": 1536,
      "height": 1024,
      "view": [
        534,
        0,
        490,
        520
      ]
    },
    "attackMode": "melee"
  },
  {
    "id": "cattail-heron",
    "conceptId": 14,
    "name": "Cattail Heron",
    "option": "c",
    "title": "Storm Heron",
    "description": "blue-grey heron with sweeping silver crest, vivid cobalt shoulders",
    "reference": "assets/enemy-finals/sheets/pair-07.png",
    "referenceColumn": 1,
    "referenceRow": 0,
    "score": 4,
    "atlas": 3,
    "cell": 2,
    "availability": "future-chapter",
    "family": "cattail-heron",
    "minHealth": 3,
    "maxHealth": 5,
    "tier": 0,
    "count": 1,
    "stage": "adult",
    "lore": [
      "This friend lives beside the river.",
      "Its long blue feathers ripple before the rain."
    ],
    "art": {
      "source": "assets/enemies/approved-20261010/atlas-03.png",
      "width": 1536,
      "height": 1024,
      "view": [
        1024,
        0,
        512,
        535
      ]
    },
    "attackMode": "gust"
  },
  {
    "id": "brook-turtle",
    "conceptId": 15,
    "name": "Brook Turtle",
    "option": "c",
    "title": "Waterfall Keeper",
    "description": "green turtle with smooth turquoise shell plates and flowing miniature water ribbons",
    "reference": "assets/enemy-finals/sheets/pair-07.png",
    "referenceColumn": 1,
    "referenceRow": 1,
    "score": 5,
    "atlas": 3,
    "cell": 3,
    "availability": "future-chapter",
    "family": "brook-turtle",
    "minHealth": 3,
    "maxHealth": 5,
    "tier": 0,
    "count": 1,
    "stage": "adult",
    "lore": [
      "This friend lives beside the river.",
      "A tiny waterfall runs over its shining blue shell."
    ],
    "art": {
      "source": "assets/enemies/approved-20261010/atlas-03.png",
      "width": 1536,
      "height": 1024,
      "view": [
        0,
        535,
        532,
        489
      ]
    },
    "attackMode": "melee"
  },
  {
    "id": "willow-kingfisher",
    "conceptId": 16,
    "name": "Willow Kingfisher",
    "option": "b",
    "title": "Sapphire Arrow",
    "description": "small vivid cobalt kingfisher, orange breast, long beak, swept sleek plumage",
    "reference": "assets/enemy-finals/sheets/pair-08.png",
    "referenceColumn": 0,
    "referenceRow": 0,
    "score": 5,
    "atlas": 3,
    "cell": 4,
    "availability": "future-chapter",
    "family": "willow-kingfisher",
    "minHealth": 3,
    "maxHealth": 5,
    "tier": 0,
    "count": 1,
    "stage": "adult",
    "lore": [
      "This friend lives beside the river.",
      "It watches the water from a branch before a swift dive."
    ],
    "art": {
      "source": "assets/enemies/approved-20261010/atlas-03.png",
      "width": 1536,
      "height": 1024,
      "view": [
        532,
        520,
        492,
        504
      ]
    },
    "attackMode": "gust"
  },
  {
    "id": "ripple-salamander",
    "conceptId": 18,
    "name": "Ripple Salamander",
    "option": "d",
    "title": "Deepwater Spark",
    "description": "indigo salamander with luminous cyan ring markings and curling wave tail",
    "reference": "assets/enemy-finals/sheets/pair-08.png",
    "referenceColumn": 2,
    "referenceRow": 1,
    "score": 5,
    "atlas": 4,
    "cell": 0,
    "availability": "future-chapter",
    "family": "ripple-salamander",
    "minHealth": 3,
    "maxHealth": 5,
    "tier": 0,
    "count": 1,
    "stage": "adult",
    "lore": [
      "This friend lives beside the river.",
      "Blue rings on its skin glow deep below the water."
    ],
    "art": {
      "source": "assets/enemies/approved-20261010/atlas-04.png",
      "width": 1536,
      "height": 1024,
      "view": [
        0,
        0,
        512,
        520
      ]
    },
    "attackMode": "melee"
  },
  {
    "id": "shell-lobster",
    "conceptId": 19,
    "name": "Shell Lobster",
    "option": "c",
    "title": "Tide Armour",
    "description": "cobalt lobster, elongated narrow body, copper shell edges and broad fan tail",
    "reference": "assets/enemy-finals/sheets/pair-09.png",
    "referenceColumn": 1,
    "referenceRow": 0,
    "score": 3,
    "atlas": 4,
    "cell": 1,
    "availability": "future-chapter",
    "family": "shell-lobster",
    "minHealth": 3,
    "maxHealth": 5,
    "tier": 0,
    "count": 1,
    "stage": "adult",
    "lore": [
      "This friend lives beside the river.",
      "Its smooth pearl armour hides a gentle river friend."
    ],
    "art": {
      "source": "assets/enemies/approved-20261010/atlas-04.png",
      "width": 1536,
      "height": 1024,
      "view": [
        512,
        0,
        536,
        520
      ]
    },
    "attackMode": "melee"
  },
  {
    "id": "marsh-crane",
    "conceptId": 20,
    "name": "Marsh Crane",
    "option": "c",
    "title": "Dusk Crane",
    "description": "violet-grey crane with amber crown and long elegant neck",
    "reference": "assets/enemy-finals/sheets/pair-09.png",
    "referenceColumn": 1,
    "referenceRow": 1,
    "score": 4,
    "atlas": 4,
    "cell": 2,
    "availability": "future-chapter",
    "family": "marsh-crane",
    "minHealth": 3,
    "maxHealth": 5,
    "tier": 0,
    "count": 1,
    "stage": "adult",
    "lore": [
      "This friend lives beside the river.",
      "It steps quietly through the mist on long thin legs."
    ],
    "art": {
      "source": "assets/enemies/approved-20261010/atlas-04.png",
      "width": 1536,
      "height": 1024,
      "view": [
        1048,
        0,
        488,
        520
      ]
    },
    "attackMode": "gust"
  },
  {
    "id": "coal-salamander",
    "conceptId": 21,
    "name": "Coal Salamander",
    "option": "c",
    "title": "Obsidian Blaze",
    "description": "black salamander with red glass dorsal fins and bright molten yellow belly",
    "reference": "assets/enemy-finals/sheets/pair-10.png",
    "referenceColumn": 1,
    "referenceRow": 0,
    "score": 5,
    "atlas": 4,
    "cell": 3,
    "availability": "future-chapter",
    "family": "coal-salamander",
    "minHealth": 3,
    "maxHealth": 5,
    "tier": 0,
    "count": 1,
    "stage": "adult",
    "lore": [
      "This friend lives near the glowing caves.",
      "Its dark scales hold a warm light from deep in the earth."
    ],
    "art": {
      "source": "assets/enemies/approved-20261010/atlas-04.png",
      "width": 1536,
      "height": 1024,
      "view": [
        0,
        520,
        512,
        504
      ]
    },
    "attackMode": "ember"
  },
  {
    "id": "quartz-mole",
    "conceptId": 22,
    "name": "Quartz Mole",
    "option": "d",
    "title": "Golden Delver",
    "description": "velvet black mole with gold stone claws and amber crystal back ridge",
    "reference": "assets/enemy-finals/sheets/pair-10.png",
    "referenceColumn": 2,
    "referenceRow": 1,
    "score": 5,
    "atlas": 4,
    "cell": 4,
    "availability": "future-chapter",
    "family": "quartz-mole",
    "minHealth": 3,
    "maxHealth": 5,
    "tier": 0,
    "count": 1,
    "stage": "adult",
    "lore": [
      "This friend lives near the glowing caves.",
      "It finds hidden gems with its strong digging paws."
    ],
    "art": {
      "source": "assets/enemies/approved-20261010/atlas-04.png",
      "width": 1536,
      "height": 1024,
      "view": [
        512,
        520,
        548,
        504
      ]
    },
    "attackMode": "melee"
  },
  {
    "id": "copper-scorpion",
    "conceptId": 23,
    "name": "Copper Scorpion",
    "option": "d",
    "title": "Furnace Scorpion",
    "description": "dark bronze scorpion with orange seam glow and angular compact tail",
    "reference": "assets/enemy-finals/sheets/pair-11.png",
    "referenceColumn": 2,
    "referenceRow": 0,
    "score": 5,
    "atlas": 5,
    "cell": 0,
    "availability": "future-chapter",
    "family": "copper-scorpion",
    "minHealth": 3,
    "maxHealth": 5,
    "tier": 0,
    "count": 1,
    "stage": "adult",
    "lore": [
      "This friend lives near the glowing caves.",
      "Its shining tail curls above its copper armour."
    ],
    "art": {
      "source": "assets/enemies/approved-20261010/atlas-05.png",
      "width": 1536,
      "height": 1024,
      "view": [
        0,
        0,
        528,
        530
      ]
    },
    "attackMode": "melee"
  },
  {
    "id": "lantern-gecko",
    "conceptId": 24,
    "name": "Lantern Gecko",
    "option": "c",
    "title": "Sunspot Gecko",
    "description": "bright orange gecko with turquoise spots and amber dorsal gems",
    "reference": "assets/enemy-finals/sheets/pair-11.png",
    "referenceColumn": 1,
    "referenceRow": 1,
    "score": 5,
    "atlas": 5,
    "cell": 1,
    "availability": "future-chapter",
    "family": "lantern-gecko",
    "minHealth": 3,
    "maxHealth": 5,
    "tier": 0,
    "count": 1,
    "stage": "adult",
    "lore": [
      "This friend lives near the glowing caves.",
      "Its soft light helps friends find their way through caves."
    ],
    "art": {
      "source": "assets/enemies/approved-20261010/atlas-05.png",
      "width": 1536,
      "height": 1024,
      "view": [
        528,
        0,
        496,
        530
      ]
    },
    "attackMode": "ember"
  },
  {
    "id": "slate-pangolin",
    "conceptId": 25,
    "name": "Slate Pangolin",
    "option": "b",
    "title": "Slate Sentinel",
    "description": "long-nosed pangolin, large overlapping dark slate scales edged bright cyan",
    "reference": "assets/enemy-finals/sheets/pair-12.png",
    "referenceColumn": 0,
    "referenceRow": 0,
    "score": 5,
    "atlas": 5,
    "cell": 2,
    "availability": "future-chapter",
    "family": "slate-pangolin",
    "minHealth": 3,
    "maxHealth": 5,
    "tier": 0,
    "count": 1,
    "stage": "adult",
    "lore": [
      "This friend lives near the glowing caves.",
      "Its stone scales fold into a safe round shield."
    ],
    "art": {
      "source": "assets/enemies/approved-20261010/atlas-05.png",
      "width": 1536,
      "height": 1024,
      "view": [
        1024,
        0,
        512,
        530
      ]
    },
    "attackMode": "melee"
  },
  {
    "id": "cinder-porcupine",
    "conceptId": 26,
    "name": "Cinder Porcupine",
    "option": "c",
    "title": "Ruby Spines",
    "description": "russet porcupine with deep crimson crystal quills, angular long silhouette",
    "reference": "assets/enemy-finals/sheets/pair-12.png",
    "referenceColumn": 1,
    "referenceRow": 1,
    "score": 5,
    "atlas": 5,
    "cell": 3,
    "availability": "future-chapter",
    "family": "cinder-porcupine",
    "minHealth": 3,
    "maxHealth": 5,
    "tier": 0,
    "count": 1,
    "stage": "adult",
    "lore": [
      "This friend lives near the glowing caves.",
      "Its bright quills glow like warm coals in the dark."
    ],
    "art": {
      "source": "assets/enemies/approved-20261010/atlas-05.png",
      "width": 1536,
      "height": 1024,
      "view": [
        0,
        530,
        512,
        494
      ]
    },
    "attackMode": "ember"
  },
  {
    "id": "gem-spider",
    "conceptId": 27,
    "name": "Gem Spider",
    "option": "d",
    "title": "Emerald Watcher",
    "description": "dark spider, faceted green abdomen, copper joints, exactly eight legs",
    "reference": "assets/enemy-finals/sheets/pair-13.png",
    "referenceColumn": 2,
    "referenceRow": 0,
    "score": 5,
    "atlas": 5,
    "cell": 4,
    "availability": "future-chapter",
    "family": "gem-spider",
    "minHealth": 3,
    "maxHealth": 5,
    "tier": 0,
    "count": 1,
    "stage": "adult",
    "lore": [
      "This friend lives near the glowing caves.",
      "It spins fine threads that sparkle like tiny jewels."
    ],
    "art": {
      "source": "assets/enemies/approved-20261010/atlas-05.png",
      "width": 1536,
      "height": 1024,
      "view": [
        512,
        530,
        550,
        494
      ]
    },
    "attackMode": "melee"
  },
  {
    "id": "echo-lizard",
    "conceptId": 28,
    "name": "Echo Lizard",
    "option": "d",
    "title": "Sunstone Echo",
    "description": "orange lizard with golden fan crest and cyan throat, upright curious pose",
    "reference": "assets/enemy-finals/sheets/pair-13.png",
    "referenceColumn": 2,
    "referenceRow": 1,
    "score": 5,
    "atlas": 6,
    "cell": 0,
    "availability": "future-chapter",
    "family": "echo-lizard",
    "minHealth": 3,
    "maxHealth": 5,
    "tier": 0,
    "count": 1,
    "stage": "adult",
    "lore": [
      "This friend lives near the glowing caves.",
      "Its bright markings flash when a sound echoes nearby."
    ],
    "art": {
      "source": "assets/enemies/approved-20261010/atlas-06.png",
      "width": 1536,
      "height": 1024,
      "view": [
        0,
        0,
        512,
        490
      ]
    },
    "attackMode": "melee"
  },
  {
    "id": "flint-armadillo",
    "conceptId": 29,
    "name": "Flint Armadillo",
    "option": "c",
    "title": "Citrine Roller",
    "description": "gold plated armadillo with banded domed shell, short ears, long tail",
    "reference": "assets/enemy-finals/sheets/pair-14.png",
    "referenceColumn": 1,
    "referenceRow": 0,
    "score": 5,
    "atlas": 6,
    "cell": 1,
    "availability": "future-chapter",
    "family": "flint-armadillo",
    "minHealth": 3,
    "maxHealth": 5,
    "tier": 0,
    "count": 1,
    "stage": "adult",
    "lore": [
      "This friend lives near the glowing caves.",
      "Its smooth armour rolls into a hard protective ball."
    ],
    "art": {
      "source": "assets/enemies/approved-20261010/atlas-06.png",
      "width": 1536,
      "height": 1024,
      "view": [
        512,
        0,
        512,
        490
      ]
    },
    "attackMode": "melee"
  },
  {
    "id": "frost-lynx",
    "conceptId": 31,
    "name": "Frost Lynx",
    "option": "d",
    "title": "Aurora Hunter",
    "description": "grey lynx, teal-violet tail and ear tips, large paws and clear dark face markings",
    "reference": "assets/enemy-finals/sheets/pair-15.png",
    "referenceColumn": 2,
    "referenceRow": 0,
    "score": 5,
    "atlas": 6,
    "cell": 2,
    "availability": "future-chapter",
    "family": "frost-lynx",
    "minHealth": 3,
    "maxHealth": 5,
    "tier": 0,
    "count": 1,
    "stage": "adult",
    "lore": [
      "This friend lives among snowy peaks.",
      "It walks softly through snow on wide furry paws."
    ],
    "art": {
      "source": "assets/enemies/approved-20261010/atlas-06.png",
      "width": 1536,
      "height": 1024,
      "view": [
        1024,
        0,
        512,
        490
      ]
    },
    "attackMode": "melee"
  },
  {
    "id": "aurora-elk",
    "conceptId": 32,
    "name": "Aurora Elk",
    "option": "b",
    "title": "Aurora Crown",
    "description": "large elk with wide antlers bearing teal and violet light ribbons",
    "reference": "assets/enemy-finals/sheets/pair-15.png",
    "referenceColumn": 0,
    "referenceRow": 1,
    "score": 5,
    "atlas": 6,
    "cell": 3,
    "availability": "future-chapter",
    "family": "aurora-elk",
    "minHealth": 3,
    "maxHealth": 5,
    "tier": 0,
    "count": 1,
    "stage": "adult",
    "lore": [
      "This friend lives among snowy peaks.",
      "Its antlers shine with colours from the night sky."
    ],
    "art": {
      "source": "assets/enemies/approved-20261010/atlas-06.png",
      "width": 1536,
      "height": 1024,
      "view": [
        0,
        490,
        512,
        534
      ]
    },
    "attackMode": "melee"
  },
  {
    "id": "snow-hare",
    "conceptId": 33,
    "name": "Snow Hare",
    "option": "c",
    "title": "Frost Dancer",
    "description": "white hare with sapphire ear tips and flowing icy neck ruff",
    "reference": "assets/enemy-finals/sheets/pair-16.png",
    "referenceColumn": 1,
    "referenceRow": 0,
    "score": 5,
    "atlas": 6,
    "cell": 4,
    "availability": "future-chapter",
    "family": "snow-hare",
    "minHealth": 3,
    "maxHealth": 5,
    "tier": 0,
    "count": 1,
    "stage": "adult",
    "lore": [
      "This friend lives among snowy peaks.",
      "Its bright cloak leaves a soft trail across the snow."
    ],
    "art": {
      "source": "assets/enemies/approved-20261010/atlas-06.png",
      "width": 1536,
      "height": 1024,
      "view": [
        512,
        490,
        512,
        534
      ]
    },
    "attackMode": "melee"
  },
  {
    "id": "cloud-yak",
    "conceptId": 34,
    "name": "Cloud Yak",
    "option": "c",
    "title": "Thunder Yak",
    "description": "blue-black yak with cream wool shoulders and golden lightning markings on horns",
    "reference": "assets/enemy-finals/sheets/pair-16.png",
    "referenceColumn": 1,
    "referenceRow": 1,
    "score": 5,
    "atlas": 7,
    "cell": 0,
    "availability": "future-chapter",
    "family": "cloud-yak",
    "minHealth": 3,
    "maxHealth": 5,
    "tier": 0,
    "count": 1,
    "stage": "adult",
    "lore": [
      "This friend lives among snowy peaks.",
      "Its thick coat keeps smaller friends warm in the wind."
    ],
    "art": {
      "source": "assets/enemies/approved-20261010/atlas-07.png",
      "width": 1536,
      "height": 1024,
      "view": [
        0,
        0,
        512,
        512
      ]
    },
    "attackMode": "melee"
  },
  {
    "id": "pinecone-marmot",
    "conceptId": 35,
    "name": "Pinecone Marmot",
    "option": "c",
    "title": "Mountain Lookout",
    "description": "russet marmot with slate blue short cloak, bright orange neck ruff",
    "reference": "assets/enemy-finals/sheets/pair-17.png",
    "referenceColumn": 1,
    "referenceRow": 0,
    "score": 5,
    "atlas": 7,
    "cell": 1,
    "availability": "future-chapter",
    "family": "pinecone-marmot",
    "minHealth": 3,
    "maxHealth": 5,
    "tier": 0,
    "count": 1,
    "stage": "adult",
    "lore": [
      "This friend lives among snowy peaks.",
      "It stores food under the snow for the long winter."
    ],
    "art": {
      "source": "assets/enemies/approved-20261010/atlas-07.png",
      "width": 1536,
      "height": 1024,
      "view": [
        512,
        0,
        512,
        512
      ]
    },
    "attackMode": "melee"
  },
  {
    "id": "gale-falcon",
    "conceptId": 36,
    "name": "Gale Falcon",
    "option": "c",
    "title": "Sunwind",
    "description": "rust-gold falcon with cream breast and long sharp orange-edged wings",
    "reference": "assets/enemy-finals/sheets/pair-17.png",
    "referenceColumn": 1,
    "referenceRow": 1,
    "score": 5,
    "atlas": 7,
    "cell": 2,
    "availability": "future-chapter",
    "family": "gale-falcon",
    "minHealth": 3,
    "maxHealth": 5,
    "tier": 0,
    "count": 1,
    "stage": "adult",
    "lore": [
      "This friend lives among snowy peaks.",
      "It rides high winds above the tallest cliffs."
    ],
    "art": {
      "source": "assets/enemies/approved-20261010/atlas-07.png",
      "width": 1536,
      "height": 1024,
      "view": [
        1024,
        0,
        512,
        512
      ]
    },
    "attackMode": "gust"
  },
  {
    "id": "lichen-ibex",
    "conceptId": 37,
    "name": "Lichen Ibex",
    "option": "d",
    "title": "Emerald Crag",
    "description": "brown ibex with immense swept green mineral horns and dark narrow hooves",
    "reference": "assets/enemy-finals/sheets/pair-18.png",
    "referenceColumn": 2,
    "referenceRow": 0,
    "score": 5,
    "atlas": 7,
    "cell": 3,
    "availability": "future-chapter",
    "family": "lichen-ibex",
    "minHealth": 3,
    "maxHealth": 5,
    "tier": 0,
    "count": 1,
    "stage": "adult",
    "lore": [
      "This friend lives among snowy peaks.",
      "Its strong hooves grip the narrow mountain paths."
    ],
    "art": {
      "source": "assets/enemies/approved-20261010/atlas-07.png",
      "width": 1536,
      "height": 1024,
      "view": [
        0,
        512,
        512,
        512
      ]
    },
    "attackMode": "melee"
  },
  {
    "id": "hail-wolverine",
    "conceptId": 38,
    "name": "Hail Wolverine",
    "option": "d",
    "title": "Storm Pelt",
    "description": "black wolverine with vivid violet-blue streaked mane and orange eyes",
    "reference": "assets/enemy-finals/sheets/pair-18.png",
    "referenceColumn": 2,
    "referenceRow": 1,
    "score": 5,
    "atlas": 7,
    "cell": 4,
    "availability": "future-chapter",
    "family": "hail-wolverine",
    "minHealth": 3,
    "maxHealth": 5,
    "tier": 0,
    "count": 1,
    "stage": "adult",
    "lore": [
      "This friend lives among snowy peaks.",
      "Its thick winter coat keeps out the sharpest cold."
    ],
    "art": {
      "source": "assets/enemies/approved-20261010/atlas-07.png",
      "width": 1536,
      "height": 1024,
      "view": [
        512,
        512,
        512,
        512
      ]
    },
    "attackMode": "melee"
  },
  {
    "id": "mist-leopard",
    "conceptId": 39,
    "name": "Mist Leopard",
    "option": "c",
    "title": "Moon Panther",
    "description": "dark violet leopard with silver rosettes and long flowing mist tail",
    "reference": "assets/enemy-finals/sheets/pair-19.png",
    "referenceColumn": 1,
    "referenceRow": 0,
    "score": 5,
    "atlas": 8,
    "cell": 0,
    "availability": "future-chapter",
    "family": "mist-leopard",
    "minHealth": 3,
    "maxHealth": 5,
    "tier": 0,
    "count": 1,
    "stage": "adult",
    "lore": [
      "This friend lives among snowy peaks.",
      "It moves like a quiet shadow through the mountain mist."
    ],
    "art": {
      "source": "assets/enemies/approved-20261010/atlas-08.png",
      "width": 1536,
      "height": 1024,
      "view": [
        0,
        0,
        522,
        510
      ]
    },
    "attackMode": "melee"
  },
  {
    "id": "glacier-seal",
    "conceptId": 40,
    "name": "Glacier Seal",
    "option": "c",
    "title": "Aurora Seal",
    "description": "silver seal with violet-teal patterned flippers and gentle long neck",
    "reference": "assets/enemy-finals/sheets/pair-19.png",
    "referenceColumn": 1,
    "referenceRow": 1,
    "score": 5,
    "atlas": 8,
    "cell": 1,
    "availability": "future-chapter",
    "family": "glacier-seal",
    "minHealth": 3,
    "maxHealth": 5,
    "tier": 0,
    "count": 1,
    "stage": "adult",
    "lore": [
      "This friend lives among snowy peaks.",
      "It glides under the ice and rests beside clear blue pools."
    ],
    "art": {
      "source": "assets/enemies/approved-20261010/atlas-08.png",
      "width": 1536,
      "height": 1024,
      "view": [
        522,
        0,
        502,
        510
      ]
    },
    "attackMode": "melee"
  },
  {
    "id": "ink-raven",
    "conceptId": 41,
    "name": "Ink Raven",
    "option": "b",
    "title": "Ink Scribe",
    "description": "black raven, violet sheen, cream scroll band on leg and gold eyes",
    "reference": "assets/enemy-finals/sheets/pair-20.png",
    "referenceColumn": 0,
    "referenceRow": 0,
    "score": 5,
    "atlas": 8,
    "cell": 2,
    "availability": "future-chapter",
    "family": "ink-raven",
    "minHealth": 3,
    "maxHealth": 5,
    "tier": 0,
    "count": 1,
    "stage": "adult",
    "lore": [
      "This friend lives in the hidden garden.",
      "It carries little messages beneath its dark wings."
    ],
    "art": {
      "source": "assets/enemies/approved-20261010/atlas-08.png",
      "width": 1536,
      "height": 1024,
      "view": [
        1024,
        0,
        512,
        510
      ]
    },
    "attackMode": "gust"
  },
  {
    "id": "bramble-peacock",
    "conceptId": 42,
    "name": "Bramble Peacock",
    "option": "c",
    "title": "Autumn Crown",
    "description": "copper peacock, orange-red eye-pattern tail, long elegant neck",
    "reference": "assets/enemy-finals/sheets/pair-20.png",
    "referenceColumn": 1,
    "referenceRow": 1,
    "score": 5,
    "atlas": 8,
    "cell": 3,
    "availability": "future-chapter",
    "family": "bramble-peacock",
    "minHealth": 3,
    "maxHealth": 5,
    "tier": 0,
    "count": 1,
    "stage": "adult",
    "lore": [
      "This friend lives in the hidden garden.",
      "Its wide tail opens like a bright fan of jewels."
    ],
    "art": {
      "source": "assets/enemies/approved-20261010/atlas-08.png",
      "width": 1536,
      "height": 1024,
      "view": [
        0,
        510,
        520,
        514
      ]
    },
    "attackMode": "gust"
  },
  {
    "id": "bell-tortoise",
    "conceptId": 43,
    "name": "Bell Tortoise",
    "option": "c",
    "title": "Sun Chime",
    "description": "golden tortoise with rounded embossed bell shell and crimson hanging tassels",
    "reference": "assets/enemy-finals/sheets/pair-21.png",
    "referenceColumn": 1,
    "referenceRow": 0,
    "score": 5,
    "atlas": 8,
    "cell": 4,
    "availability": "future-chapter",
    "family": "bell-tortoise",
    "minHealth": 3,
    "maxHealth": 5,
    "tier": 0,
    "count": 1,
    "stage": "adult",
    "lore": [
      "This friend lives in the hidden garden.",
      "Its shell rings softly when a friend needs help."
    ],
    "art": {
      "source": "assets/enemies/approved-20261010/atlas-08.png",
      "width": 1536,
      "height": 1024,
      "view": [
        520,
        510,
        504,
        514
      ]
    },
    "attackMode": "melee"
  },
  {
    "id": "honey-wasp",
    "conceptId": 44,
    "name": "Honey Wasp",
    "option": "d",
    "title": "Cobalt Wasp",
    "description": "deep cobalt and golden striped wasp with broad amber wings, sharp readable insect silhouette",
    "reference": "assets/enemy-finals/sheets/pair-21.png",
    "referenceColumn": 2,
    "referenceRow": 1,
    "score": 5,
    "atlas": 9,
    "cell": 0,
    "availability": "future-chapter",
    "family": "honey-wasp",
    "minHealth": 3,
    "maxHealth": 5,
    "tier": 0,
    "count": 1,
    "stage": "adult",
    "lore": [
      "This friend lives in the hidden garden.",
      "It guards the sweet flowers in the sunny garden."
    ],
    "art": {
      "source": "assets/enemies/approved-20261010/atlas-09.png",
      "width": 1536,
      "height": 1024,
      "view": [
        0,
        0,
        512,
        512
      ]
    },
    "attackMode": "gust"
  },
  {
    "id": "velvet-shrew",
    "conceptId": 45,
    "name": "Velvet Shrew",
    "option": "b",
    "title": "Seed Scout",
    "description": "tiny slender shrew with pointed snout, huge ears and crimson seedpod cape",
    "reference": "assets/enemy-finals/sheets/pair-22.png",
    "referenceColumn": 0,
    "referenceRow": 0,
    "score": 5,
    "atlas": 9,
    "cell": 1,
    "availability": "future-chapter",
    "family": "velvet-shrew",
    "minHealth": 3,
    "maxHealth": 5,
    "tier": 0,
    "count": 1,
    "stage": "adult",
    "lore": [
      "This friend lives in the hidden garden.",
      "It follows tiny sounds with its pointed nose."
    ],
    "art": {
      "source": "assets/enemies/approved-20261010/atlas-09.png",
      "width": 1536,
      "height": 1024,
      "view": [
        512,
        0,
        512,
        512
      ]
    },
    "attackMode": "melee"
  },
  {
    "id": "dusk-firefly",
    "conceptId": 46,
    "name": "Dusk Firefly",
    "option": "c",
    "title": "Emerald Lantern",
    "description": "firefly with vivid emerald luminous abdomen and copper wing cases",
    "reference": "assets/enemy-finals/sheets/pair-22.png",
    "referenceColumn": 1,
    "referenceRow": 1,
    "score": 5,
    "atlas": 9,
    "cell": 2,
    "availability": "future-chapter",
    "family": "dusk-firefly",
    "minHealth": 3,
    "maxHealth": 5,
    "tier": 0,
    "count": 1,
    "stage": "adult",
    "lore": [
      "This friend lives in the hidden garden.",
      "Its gentle glow marks a safe path after sunset."
    ],
    "art": {
      "source": "assets/enemies/approved-20261010/atlas-09.png",
      "width": 1536,
      "height": 1024,
      "view": [
        1024,
        0,
        512,
        512
      ]
    },
    "attackMode": "gust"
  },
  {
    "id": "petal-chameleon",
    "conceptId": 48,
    "name": "Petal Chameleon",
    "option": "d",
    "title": "Orchid Shifter",
    "description": "violet chameleon with teal limbs and magenta orchid petal head frill",
    "reference": "assets/enemy-finals/sheets/pair-23.png",
    "referenceColumn": 2,
    "referenceRow": 0,
    "score": 5,
    "atlas": 9,
    "cell": 3,
    "availability": "future-chapter",
    "family": "petal-chameleon",
    "minHealth": 3,
    "maxHealth": 5,
    "tier": 0,
    "count": 1,
    "stage": "adult",
    "lore": [
      "This friend lives in the hidden garden.",
      "Its colours change as it moves between the flowers."
    ],
    "art": {
      "source": "assets/enemies/approved-20261010/atlas-09.png",
      "width": 1536,
      "height": 1024,
      "view": [
        0,
        512,
        512,
        512
      ]
    },
    "attackMode": "melee"
  },
  {
    "id": "moon-hare-knight",
    "conceptId": 50,
    "name": "Moon Hare Knight",
    "option": "b",
    "title": "Moonshield",
    "description": "slender upright brown hare knight, silver crescent shield, cobalt cape, no weapon",
    "reference": "assets/enemy-finals/sheets/pair-23.png",
    "referenceColumn": 0,
    "referenceRow": 1,
    "score": 5,
    "atlas": 9,
    "cell": 4,
    "availability": "future-chapter",
    "family": "moon-hare-knight",
    "minHealth": 3,
    "maxHealth": 5,
    "tier": 0,
    "count": 1,
    "stage": "adult",
    "lore": [
      "This friend lives in the hidden garden.",
      "It raises its moon shield to protect a smaller friend."
    ],
    "art": {
      "source": "assets/enemies/approved-20261010/atlas-09.png",
      "width": 1536,
      "height": 1024,
      "view": [
        512,
        512,
        512,
        512
      ]
    },
    "attackMode": "melee"
  }
];
const api={entries,byId:Object.fromEntries(entries.map(e=>[e.id,e]))};
if(typeof module==='object'&&module.exports)module.exports=api;else root.BlitzApprovedEnemies=api;
})(typeof globalThis!=='undefined'?globalThis:this);
