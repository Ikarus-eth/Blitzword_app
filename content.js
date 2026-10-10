(function(root, factory) {
  const content = factory();
  if (typeof module === 'object' && module.exports) module.exports = content;
  else root.BlitzContent = content;
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  'use strict';
  // Full approved Core 200. Existing first-chapter order and saved targets are preserved.
  // Artwork teaches meaning only; it is never displayed with answer choices.
  const words = [
    {w:'on', d:["on","own","om","an"], sentence:'Pip is on the rock.', image:'sat-rock', alt:'Pip rests on top of a broad gray rock.'},
    {w:'rock', d:["rock","rack","ruck","lock"], sentence:'Pip is on the rock.', image:'sat-rock', alt:'Pip sits on one large, clearly visible gray rock.'},
    {w:'tree', d:["tree","trie","trea","three"], sentence:'The tree is green.', image:'green-tree', alt:'Pip holds a branch of a tree with green leaves.'},
    {w:'green', d:["green","grean","grain","greet"], sentence:'The tree is green.', image:'green-tree', alt:'A tree with rich green leaves stands against a warm, pale clearing.'},
    {w:'fox', d:["fox","fix","fax","foz"], sentence:'Pip follows the fox.', image:'fox', alt:'A fox with pointed ears and a bushy white-tipped tail leads Pip along a path.'},
    {w:'cave', d:["cave","cove","cive","came"], sentence:'Pip is by the cave.', image:'cave', alt:'Pip stands at the entrance of a large dark cave in a rocky hillside.'},
    {"w":"water","d":["water","watre","waiter","waver"],"sentence":"Pip can jump over water.","image":"chapter-teaching","crop":[0,0,768,512],"alt":"Pip jumps over a stream while a bird flies above him with spread wings."},
    {"w":"bird","d":["bird","bard","birn","bind"],"sentence":"The bird flies up.","image":"chapter-teaching","crop":[0,0,768,512],"alt":"Pip jumps over a stream while a bird flies above him with spread wings."},
    {"w":"wing","d":["wing","wung","wind","win"],"sentence":"The bird has a wing.","image":"chapter-teaching","crop":[0,0,768,512],"alt":"Pip jumps over a stream while a bird flies above him with spread wings."},
    {"w":"jump","d":["jump","jamp","jumb","just"],"sentence":"Pip can jump over water.","image":"chapter-teaching","crop":[0,0,768,512],"alt":"Pip jumps over a stream while a bird flies above him with spread wings."},
    {"w":"over","d":["over","ovar","ower","oven"],"sentence":"Pip can jump over water.","image":"chapter-teaching","crop":[0,0,768,512],"alt":"Pip jumps over a stream while a bird flies above him with spread wings."},
    {"w":"up","d":["up","us","un","um"],"sentence":"The bird flies up.","image":"chapter-teaching","crop":[0,0,768,512],"alt":"Pip jumps over a stream while a bird flies above him with spread wings."},
    {"w":"big","d":["big","bag","beg","bit"],"sentence":"The open book is big.","image":"chapter-teaching","crop":[768,0,768,512],"alt":"Pip compares two red books: a large open book and a small closed book."},
    {"w":"small","d":["small","smell","smoll","shall"],"sentence":"The closed book is small.","image":"chapter-teaching","crop":[768,0,768,512],"alt":"Pip compares two red books: a large open book and a small closed book."},
    {"w":"two","d":["two","tow","too","twu"],"sentence":"Pip has two books.","image":"chapter-teaching","crop":[768,0,768,512],"alt":"Pip compares two red books: a large open book and a small closed book."},
    {"w":"red","d":["red","rod","rid","read"],"sentence":"The books are red.","image":"chapter-teaching","crop":[768,0,768,512],"alt":"Pip compares two red books: a large open book and a small closed book."},
    {"w":"book","d":["book","boak","boot","back"],"sentence":"The big book is open.","image":"chapter-teaching","crop":[768,0,768,512],"alt":"Pip compares two red books: a large open book and a small closed book."},
    {"w":"open","d":["open","opne","opan","oven"],"sentence":"The big book is open.","image":"chapter-teaching","crop":[768,0,768,512],"alt":"Pip compares two red books: a large open book and a small closed book."},
    {"w":"night","d":["night","nigth","nite","right"],"sentence":"The moon shines at night.","image":"chapter-teaching","crop":[0,512,768,512],"alt":"Moonlight and a campfire light the night forest; an owl sits on a branch beside Pip."},
    {"w":"moon","d":["moon","moan","moom","noon"],"sentence":"The moon shines at night.","image":"chapter-teaching","crop":[0,512,768,512],"alt":"Moonlight and a campfire light the night forest; an owl sits on a branch beside Pip."},
    {"w":"light","d":["light","ligth","lign","lift"],"sentence":"The fire gives light.","image":"chapter-teaching","crop":[0,512,768,512],"alt":"Moonlight and a campfire light the night forest; an owl sits on a branch beside Pip."},
    {"w":"fire","d":["fire","fier","fine","fir"],"sentence":"The fire gives light.","image":"chapter-teaching","crop":[0,512,768,512],"alt":"Moonlight and a campfire light the night forest; an owl sits on a branch beside Pip."},
    {"w":"owl","d":["owl","owp","own","oil"],"sentence":"An owl sits on the branch.","image":"chapter-teaching","crop":[0,512,768,512],"alt":"Moonlight and a campfire light the night forest; an owl sits on a branch beside Pip."},
    {"w":"forest","d":["forest","forset","forst","forget"],"sentence":"Pip is in the forest.","image":"chapter-teaching","crop":[0,512,768,512],"alt":"Moonlight and a campfire light the night forest; an owl sits on a branch beside Pip."},
    {"w":"dragon","d":["dragon","drigon","drgaon","dragoon"],"sentence":"Pip is a dragon.","image":"chapter-teaching","crop":[768,512,768,512],"alt":"Pip magically lifts a coin from a treasure chest beside a castle gate."},
    {"w":"treasure","d":["treasure","traesure","trasure","treason"],"sentence":"Pip finds the treasure.","image":"chapter-teaching","crop":[768,512,768,512],"alt":"Pip magically lifts a coin from a treasure chest beside a castle gate."},
    {"w":"coin","d":["coin","cain","coim","coil"],"sentence":"A coin floats above the chest.","image":"chapter-teaching","crop":[768,512,768,512],"alt":"Pip magically lifts a coin from a treasure chest beside a castle gate."},
    {"w":"gate","d":["gate","gote","gait","gave"],"sentence":"The gate is by the castle.","image":"chapter-teaching","crop":[768,512,768,512],"alt":"Pip magically lifts a coin from a treasure chest beside a castle gate."},
    {"w":"castle","d":["castle","castel","castal","cattle"],"sentence":"The gate is by the castle.","image":"chapter-teaching","crop":[768,512,768,512],"alt":"Pip magically lifts a coin from a treasure chest beside a castle gate."},
    {"w":"magic","d":["magic","magik","magci","magma"],"sentence":"Pip uses magic to lift a coin.","image":"chapter-teaching","crop":[768,512,768,512],"alt":"Pip magically lifts a coin from a treasure chest beside a castle gate."}
  ];
  words.push(...[
  {
    "w": "the",
    "d": ["the","teh","ten","then"],
    "sentence": "The tree is green.",
    "alt": "The tree is green.",
    "image": "green-tree"
  },
  {
    "w": "and",
    "d": ["and","ant","amd","end"],
    "sentence": "The mom and dad hold hands.",
    "alt": "The mom and dad hold hands.",
    "image": "core-teaching",
    "crop": [
      512,
      0,
      512,
      512
    ]
  },
  {
    "w": "a",
    "d": ["a","e","i","o"],
    "sentence": "A cat is by the house.",
    "alt": "A cat is by the house.",
    "image": "core-teaching",
    "crop": [
      0,
      0,
      512,
      512
    ]
  },
  {
    "w": "to",
    "d": ["to","te","ta","too"],
    "sentence": "Pip walks to the cave.",
    "alt": "Pip walks to the cave.",
    "image": "cave"
  },
  {
    "w": "i",
    "d": ["i","l","t","j"],
    "sentence": "I can draw a map.",
    "alt": "I can draw a map.",
    "image": "core-teaching",
    "crop": [
      1024,
      1536,
      512,
      512
    ]
  },
  {
    "w": "you",
    "d": ["you","yuo","yow","your"],
    "sentence": "Can you see the fox?",
    "alt": "Can you see the fox?",
    "image": "fox"
  },
  {
    "w": "in",
    "d": ["in","im","it","is"],
    "sentence": "The shark is in the water.",
    "alt": "The shark is in the water.",
    "image": "core-teaching",
    "crop": [
      0,
      512,
      512,
      512
    ]
  },
  {
    "w": "of",
    "d": ["of","ov","on","off"],
    "sentence": "The top of the tree is green.",
    "alt": "The top of the tree is green.",
    "image": "green-tree"
  },
  {
    "w": "it",
    "d": ["it","in","is","if"],
    "sentence": "It is a red ball.",
    "alt": "It is a red ball.",
    "image": "core-teaching",
    "crop": [
      0,
      0,
      512,
      512
    ]
  },
  {
    "w": "he",
    "d": ["he","ha","hi","her"],
    "sentence": "He has a magic staff.",
    "alt": "He has a magic staff.",
    "image": "core-teaching",
    "crop": [
      1024,
      512,
      512,
      512
    ]
  },
  {
    "w": "is",
    "d": ["is","it","in","as"],
    "sentence": "Pip is on the rock.",
    "alt": "Pip is on the rock.",
    "image": "sat-rock"
  },
  {
    "w": "was",
    "d": ["was","wos","war","has"],
    "sentence": "The pan was by the fire.",
    "alt": "The pan was by the fire.",
    "image": "core-teaching",
    "crop": [
      512,
      1536,
      512,
      512
    ]
  },
  {
    "w": "for",
    "d": ["for","far","fir","fox"],
    "sentence": "This book is for the child.",
    "alt": "This book is for the child.",
    "image": "core-teaching",
    "crop": [
      1024,
      1536,
      512,
      512
    ]
  },
  {
    "w": "that",
    "d": ["that","taht","than","chat"],
    "sentence": "That is a tall tree.",
    "alt": "That is a tall tree.",
    "image": "green-tree"
  },
  {
    "w": "with",
    "d": ["with","wiht","wuth","wish"],
    "sentence": "The child is with mom and dad.",
    "alt": "The child is with mom and dad.",
    "image": "core-teaching",
    "crop": [
      512,
      0,
      512,
      512
    ]
  },
  {
    "w": "but",
    "d": ["but","bat","bet","bun"],
    "sentence": "The book is big, but Pip is small.",
    "alt": "The book is big, but Pip is small.",
    "image": "chapter-teaching",
    "crop": [
      768,
      0,
      768,
      512
    ]
  },
  {
    "w": "his",
    "d": ["his","has","him","hits"],
    "sentence": "The wizard holds his staff.",
    "alt": "The wizard holds his staff.",
    "image": "core-teaching",
    "crop": [
      1024,
      512,
      512,
      512
    ]
  },
  {
    "w": "all",
    "d": ["all","aal","ill","ale"],
    "sentence": "All three animals are by the fence.",
    "alt": "All three animals are by the fence.",
    "image": "core-teaching",
    "crop": [
      0,
      1536,
      512,
      512
    ]
  },
  {
    "w": "they",
    "d": ["they","tehy","them","then"],
    "sentence": "They hold hands.",
    "alt": "They hold hands.",
    "image": "core-teaching",
    "crop": [
      512,
      0,
      512,
      512
    ]
  },
  {
    "w": "my",
    "d": ["my","me","mi","may"],
    "sentence": "This is my map.",
    "alt": "This is my map.",
    "image": "core-teaching",
    "crop": [
      1024,
      1536,
      512,
      512
    ]
  },
  {
    "w": "so",
    "d": ["so","sa","se","son"],
    "sentence": "The tree is so tall.",
    "alt": "The tree is so tall.",
    "image": "green-tree"
  },
  {
    "w": "be",
    "d": ["be","by","ba","bee"],
    "sentence": "Be kind to the cat.",
    "alt": "Be kind to the cat.",
    "image": "core-teaching",
    "crop": [
      0,
      0,
      512,
      512
    ]
  },
  {
    "w": "she",
    "d": ["she","seh","shy","see"],
    "sentence": "She is a queen.",
    "alt": "She is a queen.",
    "image": "core-teaching",
    "crop": [
      512,
      512,
      512,
      512
    ]
  },
  {
    "w": "at",
    "d": ["at","an","as","it"],
    "sentence": "Pip is at the cave.",
    "alt": "Pip is at the cave.",
    "image": "cave"
  },
  {
    "w": "are",
    "d": ["are","aer","art","arm"],
    "sentence": "The books are red.",
    "alt": "The books are red.",
    "image": "chapter-teaching",
    "crop": [
      768,
      0,
      768,
      512
    ]
  },
  {
    "w": "one",
    "d": ["one","oen","owe","once"],
    "sentence": "One cat is by the house.",
    "alt": "One cat is by the house.",
    "image": "core-teaching",
    "crop": [
      0,
      0,
      512,
      512
    ]
  },
  {
    "w": "said",
    "d": ["said","sadi","sand","sail"],
    "sentence": "The child said, \"I can draw.\"",
    "alt": "The child said, \"I can draw.\"",
    "image": "core-teaching",
    "crop": [
      1024,
      1536,
      512,
      512
    ]
  },
  {
    "w": "what",
    "d": ["what","waht","whot","that"],
    "sentence": "What is in the sea?",
    "alt": "What is in the sea?",
    "image": "core-teaching",
    "crop": [
      0,
      512,
      512,
      512
    ]
  },
  {
    "w": "this",
    "d": ["this","thsi","thus","thin"],
    "sentence": "This book is open.",
    "alt": "This book is open.",
    "image": "chapter-teaching",
    "crop": [
      768,
      0,
      768,
      512
    ]
  },
  {
    "w": "when",
    "d": ["when","whne","went","then"],
    "sentence": "The moon shines when it is night.",
    "alt": "The moon shines when it is night.",
    "image": "chapter-teaching",
    "crop": [
      0,
      512,
      768,
      512
    ]
  },
  {
    "w": "we",
    "d": ["we","wo","wi","wet"],
    "sentence": "We can hold hands.",
    "alt": "We can hold hands.",
    "image": "core-teaching",
    "crop": [
      512,
      0,
      512,
      512
    ]
  },
  {
    "w": "me",
    "d": ["me","my","ma","met"],
    "sentence": "Come with me to the house.",
    "alt": "Come with me to the house.",
    "image": "core-teaching",
    "crop": [
      512,
      0,
      512,
      512
    ]
  },
  {
    "w": "have",
    "d": ["have","haev","hive","hate"],
    "sentence": "The animals have a fence.",
    "alt": "The animals have a fence.",
    "image": "core-teaching",
    "crop": [
      0,
      1536,
      512,
      512
    ]
  },
  {
    "w": "as",
    "d": ["as","at","an","is"],
    "sentence": "The child draws as he reads.",
    "alt": "The child reads an open book and draws a map at a desk.",
    "image": "core-teaching",
    "crop": [
      1024,
      1536,
      512,
      512
    ]
  },
  {
    "w": "do",
    "d": ["do","da","de","dot"],
    "sentence": "Do you see the moon?",
    "alt": "Do you see the moon?",
    "image": "chapter-teaching",
    "crop": [
      0,
      512,
      768,
      512
    ]
  },
  {
    "w": "like",
    "d": ["like","liek","lake","line"],
    "sentence": "I like this book.",
    "alt": "I like this book.",
    "image": "core-teaching",
    "crop": [
      1024,
      1536,
      512,
      512
    ]
  },
  {
    "w": "out",
    "d": ["out","uot","our","oat"],
    "sentence": "Pip is out of the cave.",
    "alt": "Pip is out of the cave.",
    "image": "cave"
  },
  {
    "w": "can",
    "d": ["can","cen","cat","cap"],
    "sentence": "Pip can jump over water.",
    "alt": "Pip can jump over water.",
    "image": "chapter-teaching",
    "crop": [
      0,
      0,
      768,
      512
    ]
  },
  {
    "w": "her",
    "d": ["her","hir","hen","here"],
    "sentence": "The queen holds her sword.",
    "alt": "The queen holds her sword.",
    "image": "core-teaching",
    "crop": [
      512,
      512,
      512,
      512
    ]
  },
  {
    "w": "not",
    "d": ["not","nut","nit","now"],
    "sentence": "The closed book is not open.",
    "alt": "The closed book is not open.",
    "image": "chapter-teaching",
    "crop": [
      768,
      0,
      768,
      512
    ]
  },
  {
    "w": "then",
    "d": ["then","tehn","than","them"],
    "sentence": "Read the book, then draw a map.",
    "alt": "Read the book, then draw a map.",
    "image": "core-teaching",
    "crop": [
      1024,
      1536,
      512,
      512
    ]
  },
  {
    "w": "your",
    "d": ["your","yuor","yore","tour"],
    "sentence": "Hold your mom's hand.",
    "alt": "Hold your mom's hand.",
    "image": "core-teaching",
    "crop": [
      512,
      0,
      512,
      512
    ]
  },
  {
    "w": "no",
    "d": ["no","na","nu","nod"],
    "sentence": "There is no bird in the pan.",
    "alt": "There is no bird in the pan.",
    "image": "core-teaching",
    "crop": [
      512,
      1536,
      512,
      512
    ]
  },
  {
    "w": "there",
    "d": ["there","thare","thera","these"],
    "sentence": "There is a fox on the path.",
    "alt": "There is a fox on the path.",
    "image": "fox"
  },
  {
    "w": "day",
    "d": ["day","dey","dad","dry"],
    "sentence": "The lion rests in the day.",
    "alt": "The lion rests in the day.",
    "image": "core-teaching",
    "crop": [
      1024,
      1024,
      512,
      512
    ]
  },
  {
    "w": "just",
    "d": ["just","jast","jest","dust"],
    "sentence": "Just one cat is by the house.",
    "alt": "Just one cat is by the house.",
    "image": "core-teaching",
    "crop": [
      0,
      0,
      512,
      512
    ]
  },
  {
    "w": "it's",
    "d": ["it's","its","it'z","is't"],
    "sentence": "It's a red car.",
    "alt": "It's a red car.",
    "image": "core-teaching",
    "crop": [
      1024,
      0,
      512,
      512
    ]
  },
  {
    "w": "see",
    "d": ["see","sse","sea","set"],
    "sentence": "I see a fox.",
    "alt": "I see a fox.",
    "image": "fox"
  },
  {
    "w": "little",
    "d": ["little","litle","litlle","litter"],
    "sentence": "The little cat is by the house.",
    "alt": "The little cat is by the house.",
    "image": "core-teaching",
    "crop": [
      0,
      0,
      512,
      512
    ]
  },
  {
    "w": "time",
    "d": ["time","tiem","tame","tide"],
    "sentence": "It is time to read.",
    "alt": "It is time to read.",
    "image": "core-teaching",
    "crop": [
      1024,
      1536,
      512,
      512
    ]
  },
  {
    "w": "from",
    "d": ["from","form","frmo","frog"],
    "sentence": "Light comes from the fire.",
    "alt": "Light comes from the fire.",
    "image": "chapter-teaching",
    "crop": [
      0,
      512,
      768,
      512
    ]
  },
  {
    "w": "had",
    "d": ["had","hed","has","hat"],
    "sentence": "The child had a book to read.",
    "alt": "The child had a book to read.",
    "image": "core-teaching",
    "crop": [
      1024,
      1536,
      512,
      512
    ]
  },
  {
    "w": "now",
    "d": ["now","naw","new","not"],
    "sentence": "Pip can jump now.",
    "alt": "Pip can jump now.",
    "image": "chapter-teaching",
    "crop": [
      0,
      0,
      768,
      512
    ]
  },
  {
    "w": "will",
    "d": ["will","wull","well","wall"],
    "sentence": "The child will draw a map.",
    "alt": "The child will draw a map.",
    "image": "core-teaching",
    "crop": [
      1024,
      1536,
      512,
      512
    ]
  },
  {
    "w": "i'm",
    "d": ["i'm","i'd","im'","i'll"],
    "sentence": "I'm drawing a map.",
    "alt": "I'm drawing a map.",
    "image": "core-teaching",
    "crop": [
      1024,
      1536,
      512,
      512
    ]
  },
  {
    "w": "go",
    "d": ["go","ga","gi","got"],
    "sentence": "Go to the house.",
    "alt": "Go to the house.",
    "image": "core-teaching",
    "crop": [
      0,
      0,
      512,
      512
    ]
  },
  {
    "w": "were",
    "d": ["were","wree","ware","where"],
    "sentence": "The books were by Pip.",
    "alt": "The books were by Pip.",
    "image": "chapter-teaching",
    "crop": [
      768,
      0,
      768,
      512
    ]
  },
  {
    "w": "too",
    "d": ["too","to","two","top"],
    "sentence": "The big book is too big for Pip.",
    "alt": "The big book is too big for Pip.",
    "image": "chapter-teaching",
    "crop": [
      768,
      0,
      768,
      512
    ]
  },
  {
    "w": "them",
    "d": ["them","tehm","then","they"],
    "sentence": "Mom and dad have a child between them.",
    "alt": "Mom and dad have a child between them.",
    "image": "core-teaching",
    "crop": [
      512,
      0,
      512,
      512
    ]
  },
  {
    "w": "him",
    "d": ["him","ham","hum","his"],
    "sentence": "The wizard has a unicorn by him.",
    "alt": "The wizard has a unicorn by him.",
    "image": "core-teaching",
    "crop": [
      1024,
      512,
      512,
      512
    ]
  },
  {
    "w": "some",
    "d": ["some","smoe","same","sum"],
    "sentence": "Some leaves are on the tree.",
    "alt": "Some leaves are on the tree.",
    "image": "green-tree"
  },
  {
    "w": "get",
    "d": ["get","git","got","gem"],
    "sentence": "Get the red ball.",
    "alt": "Get the red ball.",
    "image": "core-teaching",
    "crop": [
      0,
      0,
      512,
      512
    ]
  },
  {
    "w": "if",
    "d": ["if","ig","it","in"],
    "sentence": "If it rains, the ground gets wet.",
    "alt": "If it rains, the ground gets wet.",
    "image": "core-teaching",
    "crop": [
      0,
      1024,
      512,
      512
    ]
  },
  {
    "w": "good",
    "d": ["good","godo","goad","goon"],
    "sentence": "This is a good book.",
    "alt": "This is a good book.",
    "image": "core-teaching",
    "crop": [
      1024,
      1536,
      512,
      512
    ]
  },
  {
    "w": "don't",
    "d": ["don't","do'nt","dont","done"],
    "sentence": "Don't touch the hot pan.",
    "alt": "Don't touch the hot pan.",
    "image": "core-teaching",
    "crop": [
      512,
      1536,
      512,
      512
    ]
  },
  {
    "w": "down",
    "d": ["down","dwon","dawn","town"],
    "sentence": "The rain falls down.",
    "alt": "The rain falls down.",
    "image": "core-teaching",
    "crop": [
      0,
      1024,
      512,
      512
    ]
  },
  {
    "w": "by",
    "d": ["by","bi","be","bay"],
    "sentence": "Pip is by the cave.",
    "alt": "Pip is by the cave.",
    "image": "cave"
  },
  {
    "w": "how",
    "d": ["how","hwo","hew","now"],
    "sentence": "How tall is the tree?",
    "alt": "How tall is the tree?",
    "image": "green-tree"
  },
  {
    "w": "know",
    "d": ["know","knwo","knew","knob"],
    "sentence": "I know where the house is.",
    "alt": "I know where the house is.",
    "image": "core-teaching",
    "crop": [
      0,
      0,
      512,
      512
    ]
  },
  {
    "w": "an",
    "d": ["an","am","at","as"],
    "sentence": "An owl sits on the branch.",
    "alt": "An owl sits on the branch.",
    "image": "chapter-teaching",
    "crop": [
      0,
      512,
      768,
      512
    ]
  },
  {
    "w": "oh",
    "d": ["oh","ho","on","of"],
    "sentence": "Oh, a friendly ghost!",
    "alt": "Oh, a friendly ghost!",
    "image": "core-teaching",
    "crop": [
      512,
      1024,
      512,
      512
    ]
  },
  {
    "w": "more",
    "d": ["more","mroe","mare","move"],
    "sentence": "The big book has more pages.",
    "alt": "The big book has more pages.",
    "image": "chapter-teaching",
    "crop": [
      768,
      0,
      768,
      512
    ]
  },
  {
    "w": "their",
    "d": ["their","thier","ther","there"],
    "sentence": "Mom and dad hold their child's hands.",
    "alt": "Mom and dad hold their child's hands.",
    "image": "core-teaching",
    "crop": [
      512,
      0,
      512,
      512
    ]
  },
  {
    "w": "could",
    "d": ["could","cuold","coud","cold"],
    "sentence": "The child could read the book.",
    "alt": "The child could read the book.",
    "image": "core-teaching",
    "crop": [
      1024,
      1536,
      512,
      512
    ]
  },
  {
    "w": "about",
    "d": ["about","abuot","abot","abort"],
    "sentence": "This book is about a map.",
    "alt": "This book is about a map.",
    "image": "core-teaching",
    "crop": [
      1024,
      1536,
      512,
      512
    ]
  },
  {
    "w": "back",
    "d": ["back","bakc","buck","bank"],
    "sentence": "Pip can go back to the cave.",
    "alt": "Pip can go back to the cave.",
    "image": "cave"
  },
  {
    "w": "who",
    "d": ["who","woh","why","whom"],
    "sentence": "Who is by the unicorn?",
    "alt": "Who is by the unicorn?",
    "image": "core-teaching",
    "crop": [
      1024,
      512,
      512,
      512
    ]
  },
  {
    "w": "or",
    "d": ["or","ar","on","ore"],
    "sentence": "Is it a cat or a fox?",
    "alt": "Is it a cat or a fox?",
    "image": "core-teaching",
    "crop": [
      0,
      0,
      512,
      512
    ]
  },
  {
    "w": "make",
    "d": ["make","maek","made","male"],
    "sentence": "The wizard can make a spell.",
    "alt": "The wizard can make a spell.",
    "image": "core-teaching",
    "crop": [
      1024,
      512,
      512,
      512
    ]
  },
  {
    "w": "into",
    "d": ["into","itno","info","intro"],
    "sentence": "Pip looks into the cave.",
    "alt": "Pip looks into the cave.",
    "image": "cave"
  },
  {
    "w": "look",
    "d": ["look","loak","lock","loop"],
    "sentence": "Look at the fox.",
    "alt": "Look at the fox.",
    "image": "fox"
  },
  {
    "w": "very",
    "d": ["very","vrey","vary","verb"],
    "sentence": "The tree is very tall.",
    "alt": "The tree is very tall.",
    "image": "green-tree"
  },
  {
    "w": "would",
    "d": ["would","wuold","woud","wound"],
    "sentence": "Would you like this book?",
    "alt": "Would you like this book?",
    "image": "core-teaching",
    "crop": [
      1024,
      1536,
      512,
      512
    ]
  },
  {
    "w": "right",
    "d": ["right","rigth","rigt","rigid"],
    "sentence": "The fox is right by Pip.",
    "alt": "The fox is right by Pip.",
    "image": "fox"
  },
  {
    "w": "here",
    "d": ["here","heer","hire","her"],
    "sentence": "The cat is here.",
    "alt": "The cat is here.",
    "image": "core-teaching",
    "crop": [
      0,
      0,
      512,
      512
    ]
  },
  {
    "w": "love",
    "d": ["love","lvoe","live","lose"],
    "sentence": "Mom and dad love their child.",
    "alt": "Mom and dad love their child.",
    "image": "core-teaching",
    "crop": [
      512,
      0,
      512,
      512
    ]
  },
  {
    "w": "way",
    "d": ["way","wey","was","why"],
    "sentence": "The map shows the way.",
    "alt": "The map shows the way.",
    "image": "core-teaching",
    "crop": [
      1024,
      1536,
      512,
      512
    ]
  },
  {
    "w": "did",
    "d": ["did","ded","dad","dig"],
    "sentence": "Did you see the owl?",
    "alt": "Did you see the owl?",
    "image": "chapter-teaching",
    "crop": [
      0,
      512,
      768,
      512
    ]
  },
  {
    "w": "new",
    "d": ["new","nwe","now","net"],
    "sentence": "The child draws a new map.",
    "alt": "The child draws a new map.",
    "image": "core-teaching",
    "crop": [
      1024,
      1536,
      512,
      512
    ]
  },
  {
    "w": "come",
    "d": ["come","cmoe","came","cone"],
    "sentence": "Come to the house.",
    "alt": "Come to the house.",
    "image": "core-teaching",
    "crop": [
      0,
      0,
      512,
      512
    ]
  },
  {
    "w": "our",
    "d": ["our","oru","out","ore"],
    "sentence": "This is our house.",
    "alt": "This is our house.",
    "image": "core-teaching",
    "crop": [
      512,
      0,
      512,
      512
    ]
  },
  {
    "w": "want",
    "d": ["want","wnat","went","wand"],
    "sentence": "I want to read this book.",
    "alt": "I want to read this book.",
    "image": "core-teaching",
    "crop": [
      1024,
      1536,
      512,
      512
    ]
  },
  {
    "w": "made",
    "d": ["made","maed","make","mate"],
    "sentence": "The wizard made a spell.",
    "alt": "The wizard made a spell.",
    "image": "core-teaching",
    "crop": [
      1024,
      512,
      512,
      512
    ]
  },
  {
    "w": "around",
    "d": ["around","aruond","arond","abound"],
    "sentence": "Trees grow around the cave.",
    "alt": "Trees grow around the cave.",
    "image": "cave"
  },
  {
    "w": "after",
    "d": ["after","atfer","afetr","alter"],
    "sentence": "Draw a map after you read.",
    "alt": "Draw a map after you read.",
    "image": "core-teaching",
    "crop": [
      1024,
      1536,
      512,
      512
    ]
  },
  {
    "w": "again",
    "d": ["again","agian","agin","align"],
    "sentence": "Read the book again.",
    "alt": "Read the book again.",
    "image": "core-teaching",
    "crop": [
      1024,
      1536,
      512,
      512
    ]
  },
  {
    "w": "always",
    "d": ["always","alwyas","alwavs","allays"],
    "sentence": "Always be kind to animals.",
    "alt": "Always be kind to animals.",
    "image": "core-teaching",
    "crop": [
      0,
      1536,
      512,
      512
    ]
  },
  {
    "w": "any",
    "d": ["any","amy","and","ant"],
    "sentence": "Can you see any birds?",
    "alt": "Can you see any birds?",
    "image": "chapter-teaching",
    "crop": [
      0,
      0,
      768,
      512
    ]
  },
  {
    "w": "ask",
    "d": ["ask","aks","ash","ark"],
    "sentence": "Ask dad to read a book.",
    "alt": "Ask dad to read a book.",
    "image": "core-teaching",
    "crop": [
      512,
      0,
      512,
      512
    ]
  },
  {
    "w": "away",
    "d": ["away","awya","awey","awry"],
    "sentence": "The fox walks away.",
    "alt": "The fox walks away.",
    "image": "fox"
  },
  {
    "w": "because",
    "d": ["because","becuase","becase","became"],
    "sentence": "The ground is wet because it rains.",
    "alt": "The ground is wet because it rains.",
    "image": "core-teaching",
    "crop": [
      0,
      1024,
      512,
      512
    ]
  },
  {
    "w": "before",
    "d": ["before","befroe","befor","become"],
    "sentence": "Read before you draw.",
    "alt": "Read before you draw.",
    "image": "core-teaching",
    "crop": [
      1024,
      1536,
      512,
      512
    ]
  },
  {
    "w": "best",
    "d": ["best","bset","bast","bent"],
    "sentence": "This is my best map.",
    "alt": "This is my best map.",
    "image": "core-teaching",
    "crop": [
      1024,
      1536,
      512,
      512
    ]
  },
  {
    "w": "both",
    "d": ["both","btoh","bath","booth"],
    "sentence": "Both books are red.",
    "alt": "Both books are red.",
    "image": "chapter-teaching",
    "crop": [
      768,
      0,
      768,
      512
    ]
  },
  {
    "w": "bring",
    "d": ["bring","biring","brign","brine"],
    "sentence": "Bring the book to the desk.",
    "alt": "Bring the book to the desk.",
    "image": "core-teaching",
    "crop": [
      1024,
      1536,
      512,
      512
    ]
  },
  {
    "w": "carry",
    "d": ["carry","carri","carrry","curry"],
    "sentence": "The queen can carry the sword.",
    "alt": "The queen can carry the sword.",
    "image": "core-teaching",
    "crop": [
      512,
      512,
      512,
      512
    ]
  },
  {
    "w": "cut",
    "d": ["cut","cet","cat","cup"],
    "sentence": "A sword can cut.",
    "alt": "A sword can cut.",
    "image": "core-teaching",
    "crop": [
      512,
      512,
      512,
      512
    ]
  },
  {
    "w": "every",
    "d": ["every","evrey","evry","entry"],
    "sentence": "Every animal is by the fence.",
    "alt": "Every animal is by the fence.",
    "image": "core-teaching",
    "crop": [
      0,
      1536,
      512,
      512
    ]
  },
  {
    "w": "fast",
    "d": ["fast","fats","fist","last"],
    "sentence": "A car can go fast.",
    "alt": "A car can go fast.",
    "image": "core-teaching",
    "crop": [
      1024,
      0,
      512,
      512
    ]
  },
  {
    "w": "find",
    "d": ["find","fidn","fund","fine"],
    "sentence": "Find the bird above the water.",
    "alt": "Find the bird above the water.",
    "image": "chapter-teaching",
    "crop": [
      0,
      0,
      768,
      512
    ]
  },
  {
    "w": "first",
    "d": ["first","frist","firt","fist"],
    "sentence": "First read, then draw.",
    "alt": "First read, then draw.",
    "image": "core-teaching",
    "crop": [
      1024,
      1536,
      512,
      512
    ]
  },
  {
    "w": "found",
    "d": ["found","fuond","foudn","fund"],
    "sentence": "Pip found the treasure.",
    "alt": "Pip found the treasure.",
    "image": "chapter-teaching",
    "crop": [
      768,
      512,
      768,
      512
    ]
  },
  {
    "w": "gave",
    "d": ["gave","gaev","give","gaze"],
    "sentence": "Dad gave the child his hand.",
    "alt": "Dad gave the child his hand.",
    "image": "core-teaching",
    "crop": [
      512,
      0,
      512,
      512
    ]
  },
  {
    "w": "hold",
    "d": ["hold","holb","held","told"],
    "sentence": "Mom and dad hold hands.",
    "alt": "Mom and dad hold hands.",
    "image": "core-teaching",
    "crop": [
      512,
      0,
      512,
      512
    ]
  },
  {
    "w": "hot",
    "d": ["hot","het","hat","hit"],
    "sentence": "The pan is hot.",
    "alt": "The pan is hot.",
    "image": "core-teaching",
    "crop": [
      512,
      1536,
      512,
      512
    ]
  },
  {
    "w": "keep",
    "d": ["keep","keap","keen","kelp"],
    "sentence": "Keep the book open.",
    "alt": "Keep the book open.",
    "image": "core-teaching",
    "crop": [
      1024,
      1536,
      512,
      512
    ]
  },
  {
    "w": "kind",
    "d": ["kind","kidn","king","kiln"],
    "sentence": "Be kind to the cat.",
    "alt": "Be kind to the cat.",
    "image": "core-teaching",
    "crop": [
      0,
      0,
      512,
      512
    ]
  },
  {
    "w": "long",
    "d": ["long","lonk","lung","lone"],
    "sentence": "The snake is long.",
    "alt": "The snake is long.",
    "image": "core-teaching",
    "crop": [
      0,
      1024,
      512,
      512
    ]
  },
  {
    "w": "many",
    "d": ["many","mamy","mane","man"],
    "sentence": "The tree has many leaves.",
    "alt": "The tree has many leaves.",
    "image": "green-tree"
  },
  {
    "w": "off",
    "d": ["off","of","oft","aff"],
    "sentence": "The bird is off the ground.",
    "alt": "The bird is off the ground.",
    "image": "chapter-teaching",
    "crop": [
      0,
      0,
      768,
      512
    ]
  },
  {
    "w": "only",
    "d": ["only","onyl","onli","oily"],
    "sentence": "Only one cat is by the house.",
    "alt": "Only one cat is by the house.",
    "image": "core-teaching",
    "crop": [
      0,
      0,
      512,
      512
    ]
  },
  {
    "w": "own",
    "d": ["own","owm","owl","owe"],
    "sentence": "The child draws his own map.",
    "alt": "The child draws his own map.",
    "image": "core-teaching",
    "crop": [
      1024,
      1536,
      512,
      512
    ]
  },
  {
    "w": "pull",
    "d": ["pull","pall","pill","pool"],
    "sentence": "Pull the pan away from the fire.",
    "alt": "Pull the pan away from the fire.",
    "image": "core-teaching",
    "crop": [
      512,
      1536,
      512,
      512
    ]
  },
  {
    "w": "read",
    "d": ["read","raed","road","real"],
    "sentence": "The child can read a book.",
    "alt": "The child can read a book.",
    "image": "core-teaching",
    "crop": [
      1024,
      1536,
      512,
      512
    ]
  },
  {
    "w": "run",
    "d": ["run","rnu","ran","rug"],
    "sentence": "The fox can run.",
    "alt": "The fox can run.",
    "image": "fox"
  },
  {
    "w": "saw",
    "d": ["saw","sew","say","raw"],
    "sentence": "Pip saw a fox.",
    "alt": "Pip saw a fox.",
    "image": "fox"
  },
  {
    "w": "show",
    "d": ["show","shwo","shaw","shot"],
    "sentence": "Show me the map.",
    "alt": "Show me the map.",
    "image": "core-teaching",
    "crop": [
      1024,
      1536,
      512,
      512
    ]
  },
  {
    "w": "sit",
    "d": ["sit","set","sat","six"],
    "sentence": "Pip can sit on the rock.",
    "alt": "Pip can sit on the rock.",
    "image": "sat-rock"
  },
  {
    "w": "sleep",
    "d": ["sleep","slep","sleap","sleet"],
    "sentence": "The lion can sleep on the grass.",
    "alt": "The lion can sleep on the grass.",
    "image": "core-teaching",
    "crop": [
      1024,
      1024,
      512,
      512
    ]
  },
  {
    "w": "start",
    "d": ["start","strat","sart","stark"],
    "sentence": "Start to draw a map.",
    "alt": "Start to draw a map.",
    "image": "core-teaching",
    "crop": [
      1024,
      1536,
      512,
      512
    ]
  },
  {
    "w": "stop",
    "d": ["stop","sotp","step","shop"],
    "sentence": "Stop by the house.",
    "alt": "Stop by the house.",
    "image": "core-teaching",
    "crop": [
      0,
      0,
      512,
      512
    ]
  },
  {
    "w": "take",
    "d": ["take","taek","tale","tame"],
    "sentence": "Take the red ball.",
    "alt": "Take the red ball.",
    "image": "core-teaching",
    "crop": [
      0,
      0,
      512,
      512
    ]
  },
  {
    "w": "tell",
    "d": ["tell","tlel","tall","till"],
    "sentence": "Tell me about the book.",
    "alt": "Tell me about the book.",
    "image": "core-teaching",
    "crop": [
      1024,
      1536,
      512,
      512
    ]
  },
  {
    "w": "thank",
    "d": ["thank","thnak","thonk","think"],
    "sentence": "Thank mom and dad.",
    "alt": "Thank mom and dad.",
    "image": "core-teaching",
    "crop": [
      512,
      0,
      512,
      512
    ]
  },
  {
    "w": "think",
    "d": ["think","thnik","thick","thing"],
    "sentence": "Think about the map.",
    "alt": "Think about the map.",
    "image": "core-teaching",
    "crop": [
      1024,
      1536,
      512,
      512
    ]
  },
  {
    "w": "walk",
    "d": ["walk","wolk","wlak","wall"],
    "sentence": "Pip and the fox walk.",
    "alt": "Pip and the fox walk.",
    "image": "fox"
  },
  {
    "w": "white",
    "d": ["white","whiet","whote","while"],
    "sentence": "The unicorn is white.",
    "alt": "The unicorn is white.",
    "image": "core-teaching",
    "crop": [
      1024,
      512,
      512,
      512
    ]
  },
  {
    "w": "wish",
    "d": ["wish","wihs","wash","with"],
    "sentence": "I wish I had a unicorn.",
    "alt": "I wish I had a unicorn.",
    "image": "core-teaching",
    "crop": [
      1024,
      512,
      512,
      512
    ]
  },
  {
    "w": "work",
    "d": ["work","wrok","word","worm"],
    "sentence": "Drawing a map takes work.",
    "alt": "Drawing a map takes work.",
    "image": "core-teaching",
    "crop": [
      1024,
      1536,
      512,
      512
    ]
  },
  {
    "w": "write",
    "d": ["write","wirte","writ","wrote"],
    "sentence": "The child can write with a pen.",
    "alt": "The child can write with a pen.",
    "image": "core-teaching",
    "crop": [
      1024,
      1536,
      512,
      512
    ]
  },
  {
    "w": "cat",
    "d": ["cat","cet","can","cap"],
    "sentence": "The cat is by the house.",
    "alt": "The cat is by the house.",
    "image": "core-teaching",
    "crop": [
      0,
      0,
      512,
      512
    ]
  },
  {
    "w": "car",
    "d": ["car","cor","cat","can"],
    "sentence": "The car is on the path.",
    "alt": "The car is on the path.",
    "image": "core-teaching",
    "crop": [
      1024,
      0,
      512,
      512
    ]
  },
  {
    "w": "house",
    "d": ["house","huose","hous","horse"],
    "sentence": "The cat is by the house.",
    "alt": "The cat is by the house.",
    "image": "core-teaching",
    "crop": [
      0,
      0,
      512,
      512
    ]
  },
  {
    "w": "mom",
    "d": ["mom","mem","mop","mum"],
    "sentence": "Mom holds the child's hand.",
    "alt": "Mom holds the child's hand.",
    "image": "core-teaching",
    "crop": [
      512,
      0,
      512,
      512
    ]
  },
  {
    "w": "dad",
    "d": ["dad","ded","did","day"],
    "sentence": "Dad holds the child's hand.",
    "alt": "Dad holds the child's hand.",
    "image": "core-teaching",
    "crop": [
      512,
      0,
      512,
      512
    ]
  },
  {
    "w": "ship",
    "d": ["ship","sihp","shop","shin"],
    "sentence": "The ship is on the sea.",
    "alt": "The ship is on the sea.",
    "image": "core-teaching",
    "crop": [
      0,
      512,
      512,
      512
    ]
  },
  {
    "w": "shark",
    "d": ["shark","shrak","shork","sharp"],
    "sentence": "The shark is under the ship.",
    "alt": "The shark is under the ship.",
    "image": "core-teaching",
    "crop": [
      0,
      512,
      512,
      512
    ]
  },
  {
    "w": "map",
    "d": ["map","mep","mop","mat"],
    "sentence": "The child draws a map.",
    "alt": "The child draws a map.",
    "image": "core-teaching",
    "crop": [
      1024,
      1536,
      512,
      512
    ]
  },
  {
    "w": "queen",
    "d": ["queen","quene","queem","queue"],
    "sentence": "The queen holds a sword.",
    "alt": "The queen holds a sword.",
    "image": "core-teaching",
    "crop": [
      512,
      512,
      512,
      512
    ]
  },
  {
    "w": "snake",
    "d": ["snake","snkae","snace","stake"],
    "sentence": "The snake is on the wet ground.",
    "alt": "The snake is on the wet ground.",
    "image": "core-teaching",
    "crop": [
      0,
      1024,
      512,
      512
    ]
  },
  {
    "w": "spell",
    "d": ["spell","spel","speil","spill"],
    "sentence": "The wizard makes a spell.",
    "alt": "The wizard makes a spell.",
    "image": "core-teaching",
    "crop": [
      1024,
      512,
      512,
      512
    ]
  },
  {
    "w": "sword",
    "d": ["sword","swrod","sord","sworn"],
    "sentence": "The queen holds a sword.",
    "alt": "The queen holds a sword.",
    "image": "core-teaching",
    "crop": [
      512,
      512,
      512,
      512
    ]
  },
  {
    "w": "rain",
    "d": ["rain","rian","rein","raid"],
    "sentence": "The rain makes the ground wet.",
    "alt": "The rain makes the ground wet.",
    "image": "core-teaching",
    "crop": [
      0,
      1024,
      512,
      512
    ]
  },
  {
    "w": "child",
    "d": ["child","chlid","chide","chill"],
    "sentence": "The child holds hands with mom and dad.",
    "alt": "The child holds hands with mom and dad.",
    "image": "core-teaching",
    "crop": [
      512,
      0,
      512,
      512
    ]
  },
  {
    "w": "ghost",
    "d": ["ghost","ghsot","gohst","ghoul"],
    "sentence": "The ghost is by the cave.",
    "alt": "The ghost is by the cave.",
    "image": "core-teaching",
    "crop": [
      512,
      1024,
      512,
      512
    ]
  },
  {
    "w": "unicorn",
    "d": ["unicorn","unicron","unihorn","uniform"],
    "sentence": "The unicorn is by the wizard.",
    "alt": "The unicorn is by the wizard.",
    "image": "core-teaching",
    "crop": [
      1024,
      512,
      512,
      512
    ]
  },
  {
    "w": "lion",
    "d": ["lion","loin","lian","line"],
    "sentence": "The lion is on the grass.",
    "alt": "The lion is on the grass.",
    "image": "core-teaching",
    "crop": [
      1024,
      1024,
      512,
      512
    ]
  },
  {
    "w": "pig",
    "d": ["pig","pug","peg","pin"],
    "sentence": "The pig is by the fence.",
    "alt": "The pig is by the fence.",
    "image": "core-teaching",
    "crop": [
      0,
      1536,
      512,
      512
    ]
  },
  {
    "w": "yellow",
    "d": ["yellow","yelow","yallow","mellow"],
    "sentence": "The lion has a yellow mane.",
    "alt": "The lion has a yellow mane.",
    "image": "core-teaching",
    "crop": [
      1024,
      1024,
      512,
      512
    ]
  },
  {
    "w": "wizard",
    "d": ["wizard","wizrad","wizerd","lizard"],
    "sentence": "The wizard has a staff.",
    "alt": "The wizard has a staff.",
    "image": "core-teaching",
    "crop": [
      1024,
      512,
      512,
      512
    ]
  },
  {
    "w": "chicken",
    "d": ["chicken","chikcen","chiken","thicken"],
    "sentence": "The chicken is by the fence.",
    "alt": "The chicken is by the fence.",
    "image": "core-teaching",
    "crop": [
      0,
      1536,
      512,
      512
    ]
  },
  {
    "w": "man",
    "d": ["man","men","mon","mat"],
    "sentence": "The man holds the child's hand.",
    "alt": "The man holds the child's hand.",
    "image": "core-teaching",
    "crop": [
      512,
      0,
      512,
      512
    ]
  },
  {
    "w": "wet",
    "d": ["wet","wot","wit","web"],
    "sentence": "The ground is wet.",
    "alt": "The ground is wet.",
    "image": "core-teaching",
    "crop": [
      0,
      1024,
      512,
      512
    ]
  },
  {
    "w": "bat",
    "d": ["bat","bet","bit","bag"],
    "sentence": "The bat flies by the cave.",
    "alt": "The bat flies by the cave.",
    "image": "core-teaching",
    "crop": [
      512,
      1024,
      512,
      512
    ]
  },
  {
    "w": "yes",
    "d": ["yes","yas","yet","yew"],
    "sentence": "Yes, the book is open.",
    "alt": "Yes, the book is open.",
    "image": "core-teaching",
    "crop": [
      1024,
      1536,
      512,
      512
    ]
  },
  {
    "w": "pan",
    "d": ["pan","pen","pon","pat"],
    "sentence": "The pan is by the fire.",
    "alt": "The pan is by the fire.",
    "image": "core-teaching",
    "crop": [
      512,
      1536,
      512,
      512
    ]
  },
  {
    "w": "bell",
    "d": ["bell","bel","ball","belt"],
    "sentence": "The bell is by the door.",
    "alt": "The bell is by the door.",
    "image": "core-teaching",
    "crop": [
      0,
      0,
      512,
      512
    ]
  },
  {
    "w": "mule",
    "d": ["mule","mile","mole","mute"],
    "sentence": "The mule is by the fence.",
    "alt": "The mule is by the fence.",
    "image": "core-teaching",
    "crop": [
      0,
      1536,
      512,
      512
    ]
  },
  {
    "w": "ball",
    "d": ["ball","bal","bell","bull"],
    "sentence": "The ball is by the cat.",
    "alt": "The ball is by the cat.",
    "image": "core-teaching",
    "crop": [
      0,
      0,
      512,
      512
    ]
  },
  {
    "w": "thin",
    "d": ["thin","thni","than","this"],
    "sentence": "The snake is thin.",
    "alt": "The snake is thin.",
    "image": "core-teaching",
    "crop": [
      0,
      1024,
      512,
      512
    ]
  }
]);
  // Rotating wrong answers (point 2): each question draws three of these per word; see chooseOptions in game-core.js.
  // A trailing * marks a made-up word. Made-up words are never curriculum words; "a" and "i" use look-alike letters.
  const choicePools = {
    on:'own an awn in un*',
    rock:'rack lock lack sock sack rick lick',
    tree:'free tee fee true frue*',
    green:'greet grean* great greed gread*',
    fox:'fix fog fig for fir fax far',
    cave:'cove came come gave game save same',
    water:'later waver laver* cater caver* wafer lafer*',
    bird:'bard bind band wird* wind ward',
    wing:'ring wig rig ping pig ding dig',
    jump:'jamp* lump lamp dump damp jimp* limp',
    over:'oven ovar* even ever ovan* evar*',
    up:'ump ap* amp ip* imp',
    big:'bag bug bit bat but bad bid',
    small:'smell shall shell smoll* snall*',
    two:'too toe owe ewe awe',
    red:'bed rad bad rid bid led lad',
    book:'look bock* lock rook rock',
    open:'oven opan* ovan* oper* over',
    night:'light nught* lught* might mught*',
    moon:'moan noon noan* mood noad*',
    light:'right lught* rught* might mught*',
    fire:'fore fare far firm form hire',
    owl:'oil awl ail own owe',
    forest:'forget foreset* forset* korest* farest*',
    dragon:'drogon* dragan* drogan* dregon* dregan*',
    treasure:'treasury treasore* treasory* treesure* treesury*',
    coin:'corn boin* born toin* torn',
    gate:'gave rate rave game fate fame',
    castle:'cattle battle bastle* caste paste pastle*',
    magic:'manic magik* manik* mafic* malic* makic*',
    the:'she tee see then ten teen thee',
    and:'add aid ad an had',
    a:'e* o* u* i c* d*',
    to:'too go goo zoo zo*',
    i:'l* j* t* f* r* a',
    you:'your yau* yaur* yeu* yeur*',
    in:'ion on an un* inn',
    of:'if iff off oaf on',
    it:'int* at ant irt* art',
    he:'hue de* due hee* be bee',
    is:'its as ats* us uts*',
    was:'has wis* his gas way',
    for:'four or our fur fury',
    that:'chat chart what thet* whet',
    with:'wish dish dith* witch ditch',
    but:'bat cat cut bit pit put',
    his:'has hat hit him ham hid had',
    all:'ill ail oil awl owl',
    they:'thay* then than thet* that',
    my:'may by bay buy boy',
    so:'soo* to too go goo',
    be:'bee se* see bye de* dye',
    she:'see the tee shed seed',
    at:'ant it int* art irt*',
    are:'ace act art awe owe ore',
    one:'once ore on or orce*',
    said:'maid sad mad paid pad',
    what:'hat heat wheat chat cheat',
    this:'thus thin thun* thes* then thas* than',
    when:'whin* then thin whan* than',
    we:'woe fe* foe de* doe',
    me:'moe* we woe de* doe',
    have:'gave give hive hare rare rave',
    as:'ads is ids* abs us',
    do:'doo* go goo to too',
    like:'lake make mike line mine',
    out:'oat cut cat hut hat but bat',
    can:'con cap cop tan ton cat cot',
    her:'hear ear pear per bear',
    not:'net new now nut hut hot',
    then:'than when whan* thin whin*',
    your:'yours four tour yoar* toar* sour',
    no:'noo* go goo to too',
    there:'these where thete* whete* three thene*',
    day:'days dry dey* bay bey* dab',
    just:'jest must mest* rust rest',
    "it's":"its at's* ats* in's* ins",
    see:'she tee the seed shed',
    little:'kittle lettle* kettle lattle* battle bittle*',
    time:'tie lime lie tame tile tale',
    from:'prom frim* prim fram* pram',
    had:'hand sand sad bad band bid hid',
    now:'new not net how hew sow sew',
    will:'bell bill well wall ball till tell',
    "i'm":"a'm* im* am u'm* um",
    go:'goo to too zo* zoo mo* moo',
    were:'here hire wire mere more wore',
    too:'goo to go zoo zo* moo mo*',
    them:'tham* then than thim* thin',
    him:'ham has his hit hat hum hut',
    some:'came come same hole home sole',
    get:'got let lot bet but gut',
    if:'iff of off oaf it',
    good:'gold hold hood mold mood',
    "don't":"won't dont* wont can't dan't* con't*",
    down:'don ton town dawn gown',
    by:'bay my may boy buy',
    how:'hew now new sow sew',
    know:'knew knot knet* known knewn*',
    an:'awn on own in ion',
    oh:'ooh ah aah oath no',
    more:'mere were wore core cove move',
    their:'thair* theer* thaer* there thear*',
    could:'would cound* wound mould mound',
    about:'abaut* aboot* abeut* ebout* ebaut*',
    back:'bark pack park bank rack rank',
    who:'woo tho* too two why whom',
    or:'oar ar* ear er* arm',
    make:'lake mike like male mile take tale',
    into:'onto intro ontro* info unto',
    look:'lock rook rock took tock*',
    very:'vary wery* wary verb varb*',
    would:'could cound* wound mould mound',
    right:'light rught* lught* might mught*',
    here:'hire were wire hare ware mere mare',
    love:'live dove dive lone done line',
    way:'why say shy day wry dry',
    did:'dad hid had mid mad lid lad',
    new:'now net not sew sow',
    come:'came some same cope home hope',
    our:'oar out oat fur far',
    want:'went rant rent wand wend*',
    made:'make wade wake mode mare more',
    around:'ground aroond* groond* aruond* gruond*',
    after:'alter aftar* altar aster astar*',
    again:'agein* egain* egein* agoin* gain agian* align',
    always:'allays alwoys* alloys alwais* allais*',
    any:'ary* ant art and army',
    ask:'ark ash art asp arm',
    away:'atay* sway stay awry awey*',
    because:'becouse* bacause* bacouse* becaose* becuase* became',
    before:'bofore* befere* bofere* become befure* bafore*',
    best:'bent west went rest rent test tent',
    both:'bath moth math bonth* month',
    bring:'brang* brink brank* being brine brig',
    carry:'cerry* marry merry curry parry',
    cut:'cat hut hat put pat but bat',
    every:'evary* emery emary* evory* ever',
    fast:'fist last list fact past pact',
    find:'fond bind bond fand* wind wand band',
    first:'fist farst* fast ferst* fest',
    found:'fond pound pond bound bond',
    gave:'game cave came give have hive',
    hold:'gold hood good fold food mold mood',
    hot:'hit lot lit hut not nut',
    keep:'kelp heep* help yeep* yelp',
    kind:'kid mind mid bind bid',
    long:'lung song sung ling sing',
    many:'mane miny* mine maky* make',
    off:'of oaf if iff oof*',
    only:'oily anly* aily* omly* onli* unly*',
    own:'awn on an one owner',
    pull:'pill full fill bull bill hull hill',
    read:'lead road load rear roar',
    run:'ran fun fan bun ban pun pan',
    saw:'sow law low raw row',
    show:'slow shot slot stow shop stop',
    sit:'sat hit hat set bit bet',
    sleep:'sheep sleet sheet sweep sweet',
    start:'stare scart* scare stark spart* spark',
    stop:'stip* shop ship slop slip',
    take:'tale make male tame cake came',
    tell:'tall well wall fell fall bell ball',
    thank:'than think thin thunk* thun*',
    think:'thank thin than thick thack*',
    walk:'wask* talk task balk bask',
    white:'while whate* whale whote* whole',
    wish:'wash dish dash fish with',
    work:'wark* pork park fork word worm',
    write:'wrote white whote* wrate* whate* while',
    cat:'cut bat but hat hut pat put',
    car:'far cor* for cur fur',
    house:'hose rouse rose nouse* nose',
    mom:'mam* mop map mum mob',
    dad:'did bad bid had hid mad mid',
    ship:'shop chip chop shin skip skin',
    shark:'spark share spare stark stare',
    map:'mop tap top cap cop',
    queen:'quien* queon* quion* queem* quiem*',
    snake:'shake snare share stake stare',
    spell:'smell spill smill* swell swill',
    sword:'swore stord* store shord* shore',
    rain:'ran main man pain pan ruin run',
    child:'chill chald* chall* chold* choll*',
    ghost:'ghast* gholt* ghalt* ghist* ghilt*',
    unicorn:'unacorn* unicarn* unacarn* unicorm* unecorn*',
    lion:'loon lian* loan lien line',
    pig:'ping rig ring wig wing dig ding',
    yellow:'yallow* fellow fallow yillow* bellow billow',
    wizard:'lizard wizerd* lizerd* wazard* wizord*',
    chicken:'thicken chucken* thucken* chickon* chiken*',
    man:'men pan pen tan ten main pain',
    wet:'wit set sit bet bit let lit',
    bat:'bit hat hit but cat cut',
    yes:'yet yas* yat* yos* yot*',
    pan:'man pen men tan ten pin tin',
    bell:'bill well will ball tell tall',
    mule:'mole rule role mute male mate',
    ball:'bell wall well bill hall hill',
    thin:'than think thank then thing theng*'
  };
  // A word without a list keeps its fixed options (item.d); the tests require a list for every word.
  for (const item of words) {
    if (!choicePools[item.w]) continue;
    const entries = choicePools[item.w].split(' ');
    item.pool = entries.map(entry => entry.replace(/\*$/, ''));
    item.madeUp = entries.filter(entry => entry.endsWith('*')).map(entry => entry.slice(0, -1));
  }
  // Existing assessment items, axes, and stopping thresholds are preserved.
  // One reviewed fixed set per reading-check item; only answer positions are shuffled.
  const assessmentPools = [
    [
      {
        "w": "you",
        "d": [
          "you",
          "your",
          "yau",
          "yaur"
        ],
        "madeUp": [
          "yau",
          "yaur"
        ]
      },
      {
        "w": "cat",
        "d": [
          "cat",
          "cut",
          "bat",
          "but"
        ]
      },
      {
        "w": "car",
        "d": [
          "car",
          "far",
          "cur",
          "fur"
        ]
      },
      {
        "w": "can",
        "d": [
          "can",
          "con",
          "cap",
          "cop"
        ]
      },
      {
        "w": "fox",
        "d": [
          "fox",
          "fix",
          "fog",
          "fig"
        ]
      },
      {
        "w": "map",
        "d": [
          "map",
          "mop",
          "tap",
          "top"
        ]
      }
    ],
    [
      {
        "w": "rock",
        "d": [
          "rock",
          "rack",
          "lock",
          "lack"
        ]
      },
      {
        "w": "tree",
        "d": [
          "tree",
          "free",
          "tee",
          "fee"
        ]
      },
      {
        "w": "green",
        "d": [
          "green",
          "greet",
          "grean",
          "great"
        ],
        "madeUp": [
          "grean"
        ]
      },
      {
        "w": "ship",
        "d": [
          "ship",
          "shop",
          "chip",
          "chop"
        ]
      },
      {
        "w": "cave",
        "d": [
          "cave",
          "cove",
          "came",
          "come"
        ]
      },
      {
        "w": "star",
        "d": [
          "star",
          "scar",
          "stay",
          "scay"
        ],
        "madeUp": [
          "scay"
        ]
      }
    ],
    [
      {
        "w": "night",
        "d": [
          "night",
          "light",
          "nought",
          "lought"
        ],
        "madeUp": [
          "lought"
        ]
      },
      {
        "w": "shark",
        "d": [
          "shark",
          "spark",
          "share",
          "spare"
        ]
      },
      {
        "w": "bright",
        "d": [
          "bright",
          "blight",
          "fright",
          "flight"
        ]
      },
      {
        "w": "stone",
        "d": [
          "stone",
          "store",
          "shone",
          "shore"
        ]
      },
      {
        "w": "storm",
        "d": [
          "storm",
          "stork",
          "swarm",
          "swark"
        ],
        "madeUp": [
          "swark"
        ]
      }
    ],
    [
      {
        "w": "dragon",
        "d": [
          "dragon",
          "dragoon",
          "wagon",
          "wagoon"
        ],
        "madeUp": [
          "wagoon"
        ]
      },
      {
        "w": "forest",
        "d": [
          "forest",
          "forget",
          "foreset",
          "forset"
        ],
        "madeUp": [
          "foreset",
          "forset"
        ]
      },
      {
        "w": "castle",
        "d": [
          "castle",
          "cattle",
          "battle",
          "bastle"
        ],
        "madeUp": [
          "bastle"
        ]
      },
      {
        "w": "shadow",
        "d": [
          "shadow",
          "shadew",
          "meadow",
          "meadew"
        ],
        "madeUp": [
          "shadew",
          "meadew"
        ]
      },
      {
        "w": "silver",
        "d": [
          "silver",
          "solver",
          "silber",
          "solber"
        ],
        "madeUp": [
          "silber",
          "solber"
        ]
      }
    ],
    [
      {
        "w": "whisper",
        "d": [
          "whisper",
          "whisker",
          "whimper",
          "whimker"
        ],
        "madeUp": [
          "whimker"
        ]
      },
      {
        "w": "journey",
        "d": [
          "journey",
          "journal",
          "jourmey",
          "jourmal"
        ],
        "madeUp": [
          "jourmey",
          "jourmal"
        ]
      },
      {
        "w": "lantern",
        "d": [
          "lantern",
          "pattern",
          "lantren",
          "pattren"
        ],
        "madeUp": [
          "lantren",
          "pattren"
        ]
      },
      {
        "w": "creature",
        "d": [
          "creature",
          "treasure",
          "creasure",
          "treature"
        ],
        "madeUp": [
          "creasure",
          "treature"
        ]
      }
    ]
  ];
  // Old saved questions and teaching cards remain readable, but are never newly selected.
  const legacyWords = [{w:'sat', d:['sat','set','sap','sad'], sentence:'Pip sat on the rock.', image:'sat-rock', alt:'Pip sits on a broad gray rock.'}];
  const demoWords = ['on','fox','rock','tree','green','cave'];
  const enemies = [
    {id:'thornling',name:'Thornling',sprite:7},
    {id:'moss-golem',name:'Moss Golem',crop:[28,10,716,492]},
    {id:'moon-moth',name:'Moon Moth',crop:[812,0,682,503]},
    {id:'root-sprite',name:'Root Sprite',crop:[143,513,487,500]},
    {id:'cave-troll',name:'Cave Troll',crop:[812,510,654,514]},
    {id:'acorn-imp',name:'Acorn Imp',sprite:7},
    {id:'mushroom-guard',name:'Mushroom Guard',sprite:7},
    {id:'bark-beetle',name:'Bark Beetle',sprite:7},
    {id:'bramble-boar',name:'Bramble Boar',sprite:7},
    {id:'reed-serpent',name:'Reed Serpent',sprite:7},
    {id:'bog-toad',name:'Bog Toad',sprite:7},
    {id:'lantern-wisp',name:'Lantern Wisp',sprite:7},
    {id:'crystal-crab',name:'Crystal Crab',sprite:7},
    {id:'hollow-owl',name:'Hollow Owl',sprite:7},
    {id:'fern-wolf',name:'Fern Wolf',sprite:7},
    {id:'stone-ram',name:'Stone Ram',sprite:7},
    {id:'briar-bat',name:'Briar Bat',sprite:7},
    {id:'snail-knight',name:'Snail Knight',sprite:7},
    {id:'chest-mimic',name:'Chest Mimic',sprite:7},
    {id:'storm-griffin',name:'Storm Griffin',sprite:7}
  ];
  enemies.forEach(enemy=>{enemy.minHealth=3;enemy.maxHealth=5;enemy.tier=0;enemy.family=enemy.id;});
  // Total encounter HP, including every member of a group. Stable IDs are saved.
  // A fourth, champion form (26–32 HP) was added on 2 October 2026 so the 32-HP ceiling rotates
  // through all 20 families instead of only the adult Storm Griffin. Appending keeps saved IDs.
  const enemyPlans=[
    ['thornling',['Baby',6,9,'baby'],['Young',12,17,'young'],['Adult',18,23,'adult'],['Mighty',26,32,'adult']],
    ['moss-golem',['Small',10,14,'baby'],['Grown',16,22,'young'],['Ancient',23,28,'adult'],['Mighty',26,32,'adult']],
    ['moon-moth',['One',5,8,'adult',1],['Two',10,16,'adult',2],['Three',15,24,'adult',3],['Five',26,32,'adult',5]],
    ['root-sprite',['Sapling',8,12,'baby'],['Grown',15,20,'young'],['Elder',20,25,'adult'],['Mighty',26,32,'adult']],
    ['cave-troll',['Baby',10,14,'baby'],['Young',17,22,'young'],['Adult',23,30,'adult'],['Mighty',26,32,'adult']],
    ['acorn-imp',['One',7,9,'adult',1],['Two',14,18,'adult',2],['Three',21,27,'adult',3],['Five',26,32,'adult',5]],
    ['mushroom-guard',['Sprout',9,13,'baby'],['Grown',15,20,'young'],['Elder',20,25,'adult'],['Mighty',26,32,'adult']],
    ['bark-beetle',['One',4,5,'adult',1],['Three',12,15,'adult',3],['Five',20,25,'adult',5],['Mighty',26,32,'adult']],
    ['bramble-boar',['Piglet',8,12,'baby'],['Young',15,20,'young'],['Adult',20,26,'adult'],['Mighty',26,32,'adult']],
    ['reed-serpent',['Hatchling',7,11,'baby'],['Young',14,19,'young'],['Adult',19,25,'adult'],['Mighty',26,32,'adult']],
    ['bog-toad',['Toadlet',7,11,'baby'],['Young',14,19,'young'],['Adult',19,24,'adult'],['Mighty',26,32,'adult']],
    ['lantern-wisp',['One',6,8,'adult',1],['Two',12,16,'adult',2],['Three',18,24,'adult',3],['Five',26,32,'adult',5]],
    ['crystal-crab',['Small',8,12,'baby'],['Grown',15,20,'young'],['Large',20,25,'adult'],['Mighty',26,32,'adult']],
    ['hollow-owl',['Fledgling',8,12,'baby'],['Young',14,18,'young'],['Adult',18,23,'adult'],['Mighty',26,32,'adult']],
    ['fern-wolf',['Young',8,12,'young'],['Adult',17,23,'adult'],['Two young',16,24,'young',2],['Three',26,32,'adult',3]],
    ['stone-ram',['Lamb',10,14,'baby'],['Young',16,21,'young'],['Adult',22,28,'adult'],['Mighty',26,32,'adult']],
    ['briar-bat',['One',4,5,'adult',1],['Three',12,15,'adult',3],['Five',20,25,'adult',5],['Mighty',26,32,'adult']],
    ['snail-knight',['Small',9,13,'baby'],['Grown',16,21,'young'],['Elder',21,26,'adult'],['Mighty',26,32,'adult']],
    ['chest-mimic',['Small box',10,14,'baby'],['Chest',17,23,'young'],['Large coffer',24,30,'adult'],['Mighty',26,32,'adult']],
    ['storm-griffin',['Hatchling',11,15,'baby'],['Young',18,24,'young'],['Adult',25,32,'adult']]
  ];
  const enemyVariants=enemyPlans.flatMap(([family,...forms])=>forms.map(([label,minHealth,maxHealth,stage,count=1],i)=>{
    const base=enemies.find(e=>e.id===family);
    return {...base,id:family+'--'+(i+1),family,stage,count,minHealth,maxHealth,champion:i===3,
      name:count>1?count+' '+(label==='Two young'?'young ':'')+(family==='fern-wolf'?'Fern Wolves':base.name+'s'):label==='One'||label==='Chest'?base.name:label+' '+base.name};
  }));
  // Keep the existing 3-HP entry point; these training encounters are the only range exception.
  const trainingEnemies=['thornling','moon-moth','bark-beetle','briar-bat'].map(family=>{
    const base=enemies.find(e=>e.id===family);
    return {...base,id:family+'--training',stage:'baby',count:1,minHealth:3,maxHealth:3,name:'Tiny '+base.name};
  });
  function enemyAt(id){
    const variant=enemyVariants.find(e=>e.id===id)||trainingEnemies.find(e=>e.id===id);if(variant)return variant;
    const direct=enemies.find(enemy=>enemy.id===id);if(direct)return direct;
    const match=/^(.*)-tier-(\d+)$/.exec(id||'');if(!match)return enemies[0];
    const base=enemies.find(enemy=>enemy.id===match[1]),tier=Number(match[2]);if(!base||tier<1||!Number.isSafeInteger(tier))return enemies[0];
    const title=['','Woodland','Great','Ancient','Elder'][tier]||'Elder '+tier;
    return {...base,id,name:title+' '+base.name,tier,minHealth:3+tier*3,maxHealth:5+tier*3};
  }
  function enemiesForHealth(health){
    if(health<=32)return [...enemyVariants,...trainingEnemies].filter(e=>health>=e.minHealth&&health<=e.maxHealth);
    // Readable legacy encounters above the new roster ceiling retain their saved strength.
    const tier=Math.max(0,Math.floor((health-3)/3));
    return enemies.map(enemy=>tier?enemyAt(enemy.id+'-tier-'+tier):enemy);
  }
  function enemyMembers(enemyId,maxHealth,remaining=maxHealth){
    const count=enemyAt(enemyId).count||1,total=Math.max(count,Math.round(maxHealth));
    let damage=total-Math.max(0,Math.min(total,remaining));
    return Array.from({length:count},(_,index)=>{
      const max=Math.floor(total/count)+(index<total%count?1:0),health=Math.max(0,max-damage);
      damage=Math.max(0,damage-max);return {index,maxHealth:max,health};
    });
  }
  // Each place has six fixed targets. Earlier places remain available for review.
  const areas = [
    {id:'lantern-trail',name:'Lantern Trail',x:17,y:73,available:true,words:words.slice(0,6).map(item=>item.w),checkpoint:2,goal:'Follow the ember trail.',discovery:'Ember scales lead towards the river.'},
    {id:'fox-crossing',name:'Fox Crossing',x:34,y:39,available:true,words:words.slice(6,12).map(item=>item.w),checkpoint:4,goal:'Cross the river with the fox.',discovery:'A red book points to the old grove.'},
    {id:'old-grove',name:'Old Grove',x:57,y:65,available:true,words:words.slice(12,18).map(item=>item.w),checkpoint:6,goal:'Search beneath the old oak.',discovery:'The book reveals a trail of lanterns.'},
    {id:'lantern-ruins',name:'Lantern Ruins',x:63,y:24,available:true,words:words.slice(18,24).map(item=>item.w),checkpoint:8,goal:'Follow the lights through the ruins.',discovery:'An owl shows the way to the hidden nest.'},
    {id:'hidden-nest',name:'Hidden Nest',x:89,y:19,available:true,words:words.slice(24,30).map(item=>item.w),checkpoint:10,goal:'Find the way to Pip’s siblings.',discovery:'The nest is close. Face its guardian.'}
  ];
  const chapters=[
    {id:'chapter-1',name:'Pip',scene:null},
    {id:'chapter-2',name:'River Path',scene:0},
    {id:'chapter-3',name:'Old Oak',scene:1},
    {id:'chapter-4',name:'Lost Lights',scene:2},
    {id:'chapter-5',name:'Moon Wood',scene:3},
    {id:'chapter-6',name:'Crystal Cave',scene:4},
    {id:'chapter-7',name:'Sky Keep',scene:5}
  ];
  // Full-size standalone campaign images; never enlarge a 512px atlas tile.
  const campaignBackgrounds={
    'chapter-1':{src:'assets/campaign-hd/forest.webp'},
    'chapter-2':{src:'assets/campaign-hd/river.webp'},
    'chapter-3':{src:'assets/campaign-hd/oak.webp'},
    'chapter-4':{src:'assets/campaign-hd/ruins.webp'},
    'chapter-5':{src:'assets/campaign-hd/moon.webp'},
    'chapter-6':{src:'assets/campaign-hd/cave.webp'},
    'chapter-7':{src:'assets/campaign-hd/keep.webp'}
  };
  const placeNames=[[],['River Bank','Stone Bridge','Reed Path','Blue Pool','River Gate'],['Oak Path','Leaf Den','Moss Steps','Root Arch','Old Oak'],['Stone Path','Lamp Grove','Old Wall','Gold Door','Light Hall'],['Moon Path','Owl Tree','Star Pool','Night Arch','Moon Nest'],['Cave Mouth','Blue Stone','Deep Pool','Glow Hall','Crystal Gate'],['Hill Path','Cloud Steps','Sky Bridge','High Tower','Sky Keep']];
  areas.forEach((a,i)=>{a.chapterId='chapter-1';a.shortName=['Path','Fox','Trees','Cave','Home'][i];});
  const coords=areas.map(a=>[a.x,a.y]);
  chapters.forEach((chapter,c)=>{
    chapter.words=words.slice(c*30,Math.min(words.length,(c+1)*30)).map(item=>item.w);
    if(c){const width=Math.ceil(chapter.words.length/5);for(let i=0;i<5;i++){
      const targets=chapter.words.slice(i*width,(i+1)*width);if(!targets.length)continue;
      areas.push({id:chapter.id+'-place-'+(i+1),chapterId:chapter.id,name:placeNames[c][i],shortName:placeNames[c][i].split(' ').at(-1),x:coords[i][0],y:coords[i][1],available:true,words:targets,checkpoint:(c*5+i+1)*2,goal:'Explore '+placeNames[c][i]+'.',discovery:'The path is open.'});
    }}
  });
  // Chapter IDs remain save identities; campaign scene indices remain map-only.
  const chapterBackgrounds={
    'lantern-trail': {src:'assets/forest-clearing.webp',width:1536,height:1024},
    'fox-crossing': {src:'assets/scenery/fox-crossing.webp',width:1536,height:1024},
    'old-grove': {src:'assets/scenery/old-grove.webp',width:1536,height:1024},
    'lantern-ruins': {src:'assets/scenery/lantern-ruins.webp',width:1536,height:1024},
    'hidden-nest': {src:'assets/scenery/hidden-nest.webp',width:1536,height:1024},
    'chapter-2-place-1': {src:'assets/scenery/chapter-2-place-1.webp',width:1536,height:1024},
    'chapter-2-place-2': {src:'assets/campaign-hd/river.webp',width:1254,height:1254},
    'chapter-2-place-3': {src:'assets/scenery/chapter-2-place-3.webp',width:1536,height:1024},
    'chapter-2-place-4': {src:'assets/scenery/chapter-2-place-4.webp',width:1536,height:1024},
    'chapter-2-place-5': {src:'assets/scenery/chapter-2-place-5.webp',width:1536,height:1024},
    'chapter-3-place-1': {src:'assets/campaign-hd/oak.webp',width:1254,height:1254},
    'chapter-3-place-2': {src:'assets/scenery/chapter-3-place-2.webp',width:1536,height:1024},
    'chapter-3-place-3': {src:'assets/scenery/chapter-3-place-3.webp',width:1536,height:1024},
    'chapter-3-place-4': {src:'assets/scenery/chapter-3-place-4.webp',width:1536,height:1024},
    'chapter-3-place-5': {src:'assets/scenery/chapter-3-place-5.webp',width:1536,height:1024},
    'chapter-4-place-1': {src:'assets/campaign-hd/ruins.webp',width:1254,height:1254},
    'chapter-4-place-2': {src:'assets/scenery/chapter-4-place-2.webp',width:1536,height:1024},
    'chapter-4-place-3': {src:'assets/scenery/chapter-4-place-3.webp',width:1536,height:1024},
    'chapter-4-place-4': {src:'assets/scenery/chapter-4-place-4.webp',width:1536,height:1024},
    'chapter-4-place-5': {src:'assets/scenery/chapter-4-place-5.webp',width:1536,height:1024},
    'chapter-5-place-1': {src:'assets/scenery/chapter-5-place-1.webp',width:1536,height:1024},
    'chapter-5-place-2': {src:'assets/scenery/chapter-5-place-2.webp',width:1536,height:1024},
    'chapter-5-place-3': {src:'assets/campaign-hd/moon.webp',width:1254,height:1254},
    'chapter-5-place-4': {src:'assets/scenery/chapter-5-place-4.webp',width:1536,height:1024},
    'chapter-5-place-5': {src:'assets/scenery/chapter-5-place-5.webp',width:1536,height:1024},
    'chapter-6-place-1': {src:'assets/scenery/chapter-6-place-1.webp',width:1536,height:1024},
    'chapter-6-place-2': {src:'assets/scenery/chapter-6-place-2.webp',width:1536,height:1024},
    'chapter-6-place-3': {src:'assets/scenery/chapter-6-place-3.webp',width:1536,height:1024},
    'chapter-6-place-4': {src:'assets/campaign-hd/cave.webp',width:1254,height:1254},
    'chapter-6-place-5': {src:'assets/scenery/chapter-6-place-5.webp',width:1536,height:1024},
    'chapter-7-place-1': {src:'assets/scenery/chapter-7-place-1.webp',width:1536,height:1024},
    'chapter-7-place-2': {src:'assets/scenery/chapter-7-place-2.webp',width:1536,height:1024},
    'chapter-7-place-3': {src:'assets/scenery/chapter-7-place-3.webp',width:1536,height:1024},
    'chapter-7-place-4': {src:'assets/scenery/chapter-7-place-4.webp',width:1536,height:1024},
    'chapter-7-place-5': {src:'assets/campaign-hd/keep.webp',width:1254,height:1254}
  };
  // One short transition for each later map field.
  const storyLines = [
    ['The forest path is open. Pip is ready to explore with you.', 'Pip is on the path.'],
    ['A fox waits beside the stream. Pip follows it to a safe place to cross.', "Jump, Pip!"],
    ['Beyond the stream, old trees shelter a red book. Pip stops to look inside.', "Pip, jump over water."],
    ['The book shows a trail of lights. Pip follows them as the forest grows dark.', "Open the book, Pip."],
    ['An owl has shown you the hidden nest. A little spark shines beside its gate.', "Look up, Pip."],
    ['A bright stream leads away from the nest. Pip wants to see where it goes.', "Pip, jump up!"],
    ['You reach a stone bridge. Pip waits for you before crossing to the other side.', "Open the gate."],
    ['Tall reeds whisper beside the river. A narrow path leads you both onward.', "The bird is over the water."],
    ['The river opens into a still blue pool. Pip stops beside the clear water.', "The water is in the forest."],
    ['A gate stands at the end of the river path. Warm light shines through it.', "Pip is at the gate."],
    ['Beyond the gate, golden leaves cover a winding path. Pip finds the next trail.', "The tree is big."],
    ['The trees grow close together. Pip finds a cosy space among the leaves.', "Pip is in the forest."],
    ['Moss covers a line of old steps. You and Pip climb them one at a time.', "Pip can jump over the water."],
    ['The roots form an arch across the path. Pip waits beneath it for you.', "There is a big tree."],
    ['The oldest oak stands ahead. Its branches point towards a distant glow.', "The tree is green."],
    ['A stone path winds towards the glow. Pip follows the warm light between the trees.', "Pip is on the rock."],
    ['Small lamps light the grove. Pip pauses to watch their gentle glow.', "The fire is in the forest."],
    ['An old wall rises beside the trail. There is a way through for you and Pip.', "The gate is not open."],
    ['A golden door glows in the stone. Pip waits while you find the way inside.', "Pip is by the treasure."],
    ['The hall is full of soft light. A window shows the moon above the next wood.', "Look at the moon."],
    ['Moonlight leads you into a quiet wood. Pip stays close beside you.', "It is not day."],
    ['An owl watches from a high branch. Pip looks up to follow its gaze.', "The owl is in the tree."],
    ['Stars shine in a still pool. Pip stops beside the water to look.', "The light is on the water."],
    ['A dark arch opens between the trees. Moonlight shows a path through it.', "We can see the moon."],
    ['You reach a sheltered nest beneath the moon. A blue glow shines beyond the wood.', "Pip is by the fire."],
    ['The blue glow comes from a cave. Pip peeks inside, then waits for you.', "Look into the cave."],
    ['Blue stones shine along the cave wall. Pip follows their light into the mountain.', "There is light in the cave."],
    ['A deep pool fills the quiet cave. You and Pip take the dry path beside it.', "The water is in the cave."],
    ['The cave opens into a glowing hall. Pip looks at the lights all around you.', "We are in the cave."],
    ['A crystal gate opens towards the sky. Pip can feel the warm air beyond it.', "The gate is open."],
    ['Sunlight warms the hill path. Pip looks up at a castle high above you.', "Look up at the castle."],
    ['Stone steps climb towards the clouds. You and Pip take the next step together.', "We go up."],
    ['A high bridge stretches towards the keep. Pip stays beside you as you cross.', "We can see the castle."],
    ['The tower is close now. Pip looks up at its bright flags in the sky.', "The castle is by the tree."],
    ['You have reached the sky keep together. Pip is ready for the final path.', "The queen is by the gate."]
  ];
  // Point 6: all 34 sentence/picture pairs approved on 24 September 2026 (PR #66).
  const storyPictures = {
  "jump": {
    "src": "assets/teaching/chapter-teaching.png",
    "width": 1536,
    "height": 1024,
    "crop": [
      0,
      0,
      768,
      512
    ],
    "alt": "Pip jumps over a stream; a bird flies above the water."
  },
  "rock": {
    "src": "assets/teaching/sat-rock.webp",
    "width": 1536,
    "height": 1024,
    "crop": null,
    "alt": "Pip sits on top of one broad rock."
  },
  "fox": {
    "src": "assets/teaching/fox.webp",
    "width": 1536,
    "height": 1024,
    "crop": null,
    "alt": "Pip follows a fox along a dry woodland path."
  },
  "tree": {
    "src": "assets/teaching/green-tree.webp",
    "width": 1536,
    "height": 1024,
    "crop": null,
    "alt": "Pip looks up at a large tree with green leaves."
  },
  "cave": {
    "src": "assets/teaching/cave.webp",
    "width": 1536,
    "height": 1024,
    "crop": null,
    "alt": "Pip stands outside a dark cave and looks inside."
  },
  "owl-fire": {
    "src": "assets/teaching/chapter-teaching.png",
    "width": 1536,
    "height": 1024,
    "crop": [
      0,
      512,
      768,
      512
    ],
    "alt": "Pip looks up towards an owl; a campfire burns in the night forest."
  },
  "treasure-gate": {
    "src": "assets/teaching/chapter-teaching.png",
    "width": 1536,
    "height": 1024,
    "crop": [
      768,
      512,
      768,
      512
    ],
    "alt": "Pip and an open treasure chest stand beside a closed castle gate."
  },
  "open-book": {
    "src": "assets/teaching/chapter-teaching.png",
    "width": 1536,
    "height": 1024,
    "crop": [
      880,
      225,
      425,
      200
    ],
    "alt": "An open book with its pages visible."
  },
  "closed-book": {
    "src": "assets/teaching/chapter-teaching.png",
    "width": 1536,
    "height": 1024,
    "crop": [
      1320,
      280,
      170,
      140
    ],
    "alt": "A small red book with its cover shut."
  },
  "pan-fire": {
    "src": "assets/teaching/core-teaching.webp",
    "width": 1086,
    "height": 1448,
    "crop": [
      362,
      1086,
      362,
      362
    ],
    "alt": "A pan stands in a room beside a cooking fire."
  },
  "queen": {
    "src": "assets/teaching/core-teaching.webp",
    "width": 1086,
    "height": 1448,
    "crop": [
      362,
      362,
      362,
      362
    ],
    "alt": "A queen stands beside a closed castle gate, holding a sword."
  },
  "open-gate": {
    "src": "assets/scenery/chapter-2-place-5.webp",
    "width": 1536,
    "height": 1024,
    "crop": null,
    "alt": "Two gate doors stand open, leaving a clear passage."
  },
  "forest-pool": {
    "src": "assets/scenery/chapter-2-place-4.webp",
    "width": 1536,
    "height": 1024,
    "crop": null,
    "alt": "Water fills an open-air pool among rocks and trees."
  },
  "cave-pool": {
    "src": "assets/scenery/chapter-6-place-3.webp",
    "width": 1536,
    "height": 1024,
    "crop": null,
    "alt": "Water fills a pool inside a cave beneath a rock ceiling."
  },
  "glow-cave": {
    "src": "assets/scenery/chapter-6-place-4.webp",
    "width": 512,
    "height": 512,
    "crop": null,
    "alt": "A glowing cavern surrounds a pool, entirely beneath a rocky roof."
  },
  "autumn-tree": {
    "src": "assets/scenery/chapter-3-place-5.webp",
    "width": 1536,
    "height": 1024,
    "crop": null,
    "alt": "A large oak has golden autumn leaves."
  },
  "cave-light": {
    "src": "assets/scenery/chapter-6-place-2.webp",
    "width": 1536,
    "height": 1024,
    "crop": null,
    "alt": "Glowing stones light the inside of a cave."
  },
  "moon-path": {
    "src": "assets/scenery/chapter-5-place-1.webp",
    "width": 1536,
    "height": 1024,
    "crop": null,
    "alt": "A bright moon is high above a forest path at night."
  },
  "day-path": {
    "src": "assets/scenery/chapter-2-place-3.webp",
    "width": 1536,
    "height": 1024,
    "crop": null,
    "alt": "A dry path beside reeds in daylight; no moon is visible."
  },
  "star-pool": {
    "src": "assets/scenery/chapter-5-place-3.webp",
    "width": 512,
    "height": 512,
    "crop": null,
    "alt": "Moonlight is reflected in a forest pool at night."
  },
  "hill-castle": {
    "src": "assets/scenery/chapter-7-place-1.webp",
    "width": 1536,
    "height": 1024,
    "crop": null,
    "alt": "A castle stands high on a distant hill."
  },
  "cloud-steps": {
    "src": "assets/scenery/chapter-7-place-2.webp",
    "width": 1536,
    "height": 1024,
    "crop": null,
    "alt": "A long flight of stone steps rises towards a castle."
  },
  "sky-bridge": {
    "src": "assets/scenery/chapter-7-place-3.webp",
    "width": 1536,
    "height": 1024,
    "crop": null,
    "alt": "A broad bridge leads straight towards a large castle."
  },
  "sky-keep": {
    "src": "assets/scenery/chapter-7-place-5.webp",
    "width": 512,
    "height": 512,
    "crop": null,
    "alt": "A castle gate and stone steps stand on the mountainside."
  }
};
  const storyChecks = {
  "fox-crossing": {
    "match": "jump",
    "other": "rock",
    "untaughtWord": "jump"
  },
  "old-grove": {
    "match": "jump",
    "other": "fox",
    "untaughtWord": null
  },
  "lantern-ruins": {
    "match": "open-book",
    "other": "closed-book",
    "untaughtWord": "the"
  },
  "hidden-nest": {
    "match": "owl-fire",
    "other": "fox",
    "untaughtWord": "look"
  },
  "chapter-2-place-1": {
    "match": "jump",
    "other": "rock",
    "untaughtWord": null
  },
  "chapter-2-place-2": {
    "match": "open-gate",
    "other": "treasure-gate",
    "untaughtWord": null
  },
  "chapter-2-place-3": {
    "match": "jump",
    "other": "owl-fire",
    "untaughtWord": null
  },
  "chapter-2-place-4": {
    "match": "forest-pool",
    "other": "cave-pool",
    "untaughtWord": null
  },
  "chapter-2-place-5": {
    "match": "treasure-gate",
    "other": "cave",
    "untaughtWord": null
  },
  "chapter-3-place-1": {
    "match": "tree",
    "other": "closed-book",
    "untaughtWord": null
  },
  "chapter-3-place-2": {
    "match": "owl-fire",
    "other": "treasure-gate",
    "untaughtWord": null
  },
  "chapter-3-place-3": {
    "match": "jump",
    "other": "rock",
    "untaughtWord": null
  },
  "chapter-3-place-4": {
    "match": "tree",
    "other": "open-book",
    "untaughtWord": null
  },
  "chapter-3-place-5": {
    "match": "tree",
    "other": "autumn-tree",
    "untaughtWord": null
  },
  "chapter-4-place-1": {
    "match": "rock",
    "other": "jump",
    "untaughtWord": null
  },
  "chapter-4-place-2": {
    "match": "owl-fire",
    "other": "pan-fire",
    "untaughtWord": null
  },
  "chapter-4-place-3": {
    "match": "treasure-gate",
    "other": "open-gate",
    "untaughtWord": null
  },
  "chapter-4-place-4": {
    "match": "treasure-gate",
    "other": "open-book",
    "untaughtWord": null
  },
  "chapter-4-place-5": {
    "match": "moon-path",
    "other": "day-path",
    "untaughtWord": null
  },
  "chapter-5-place-1": {
    "match": "moon-path",
    "other": "day-path",
    "untaughtWord": null
  },
  "chapter-5-place-2": {
    "match": "owl-fire",
    "other": "jump",
    "untaughtWord": null
  },
  "chapter-5-place-3": {
    "match": "star-pool",
    "other": "owl-fire",
    "untaughtWord": null
  },
  "chapter-5-place-4": {
    "match": "moon-path",
    "other": "day-path",
    "untaughtWord": null
  },
  "chapter-5-place-5": {
    "match": "owl-fire",
    "other": "rock",
    "untaughtWord": null
  },
  "chapter-6-place-1": {
    "match": "cave",
    "other": "fox",
    "untaughtWord": null
  },
  "chapter-6-place-2": {
    "match": "cave-light",
    "other": "owl-fire",
    "untaughtWord": null
  },
  "chapter-6-place-3": {
    "match": "cave-pool",
    "other": "forest-pool",
    "untaughtWord": null
  },
  "chapter-6-place-4": {
    "match": "glow-cave",
    "other": "forest-pool",
    "untaughtWord": null
  },
  "chapter-6-place-5": {
    "match": "open-gate",
    "other": "treasure-gate",
    "untaughtWord": null
  },
  "chapter-7-place-1": {
    "match": "hill-castle",
    "other": "day-path",
    "untaughtWord": null
  },
  "chapter-7-place-2": {
    "match": "cloud-steps",
    "other": "day-path",
    "untaughtWord": null
  },
  "chapter-7-place-3": {
    "match": "sky-bridge",
    "other": "forest-pool",
    "untaughtWord": null
  },
  "chapter-7-place-4": {
    "match": "sky-keep",
    "other": "forest-pool",
    "untaughtWord": null
  },
  "chapter-7-place-5": {
    "match": "queen",
    "other": "treasure-gate",
    "untaughtWord": null
  }
};
  const chapterStories=Object.fromEntries(areas.map((area,i)=>[area.id,{narration:storyLines[i][0],sentence:storyLines[i][1],scene:chapters.find(c=>c.id===area.chapterId).scene,check:storyChecks[area.id]||null}]));
  const dragonStages = [
    {name:'Small Pip',xp:0,crop:[150,160,409,307],scale:1},
    {name:'Big Pip',xp:15000,crop:[838,11,542,460],scale:1.14},
    {name:'Bigger Pip',xp:45000,crop:[88,494,615,491],scale:1.3},
    {name:'Ride on Pip',xp:70000,crop:[869,464,657,533],scale:1.45}
  ];
  // BEGIN NEXT800 — compiled offline by scripts/build-next800.cjs.
  const coreWords=words.slice();
  words.push(...[{"w":"has","d":["has","his","bas","bis"],"pool":["his","bas","bis","das","dis"],"madeUp":[],"sentence":"The dog has a red ball.","expansion":true,"sourceId":"next800-002","batch":1,"group":"Sentence building and common verbs","teaching":{"tip":"Look at every letter in has. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"been","d":["been","bien","bean","bian"],"pool":["bien","bean","bian","beon","bion"],"madeUp":["bian","beon"],"sentence":"We have been to the park.","expansion":true,"sourceId":"next800-003","batch":1,"group":"Sentence building and common verbs","teaching":{"tip":"Word family: be → been. Notice how the spelling changes.","family":"be","pattern":"changed word form"}},{"w":"does","d":["does","dous","doec","douc"],"pool":["dous","doec","douc","doeg","doug"],"madeUp":["dous","doec"],"sentence":"What does the little dog want?","expansion":true,"sourceId":"next800-004","batch":1,"group":"Sentence building and common verbs","teaching":{"tip":"Word family: do → does. Notice how the spelling changes.","family":"do","pattern":"changed word form"}},{"w":"us","d":["us","uss","es","ess"],"pool":["uss","es","ess","is","iss"],"madeUp":["uss","iss"],"sentence":"Come and sit with us.","expansion":true,"sourceId":"next800-005","batch":1,"group":"Sentence building and common verbs","teaching":{"tip":"Look at every letter in us. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"its","d":["its","ids","ots","ods"],"pool":["ids","ots","ods","uts","uds"],"madeUp":["ids","ots","uts"],"sentence":"The cat licks its paw.","expansion":true,"sourceId":"next800-006","batch":1,"group":"Sentence building and common verbs","teaching":{"symbol":null,"tip":"Its means belonging to it. There is no apostrophe.","pattern":"tricky spelling or meaning"}},{"w":"which","d":["which","wrich","whach","wrach"],"pool":["wrich","whach","wrach","whech","wrech"],"madeUp":["wrich","whach","wrach","whech","wrech"],"sentence":"Tell me which book you want.","expansion":true,"sourceId":"next800-007","batch":1,"group":"Sentence building and common verbs","teaching":{"tip":"Look carefully at “ch” in which. Listen, then read the whole sentence.","pattern":"letter group ch"}},{"w":"these","d":["these","there","thase","thare"],"pool":["there","thase","thare","those","thore"],"madeUp":["thase","thare","thore"],"sentence":"All these apples are red.","expansion":true,"sourceId":"next800-008","batch":1,"group":"Sentence building and common verbs","teaching":{"tip":"Look carefully at “th” in these. Listen, then read the whole sentence.","pattern":"letter group th"}},{"w":"those","d":["those","thore","thase","thare"],"pool":["thore","thase","thare","these","there"],"madeUp":["thore","thase","thare"],"sentence":"Look at those birds in the tree.","expansion":true,"sourceId":"next800-009","batch":1,"group":"Sentence building and common verbs","teaching":{"tip":"Look carefully at “th” in those. Listen, then read the whole sentence.","pattern":"letter group th"}},{"w":"where","d":["where","whele","whare","whale"],"pool":["whele","whare","whale","whire","while"],"madeUp":["whele","whire"],"sentence":"Tell me where the cat is.","expansion":true,"sourceId":"next800-010","batch":1,"group":"Sentence building and common verbs","teaching":{"tip":"Look carefully at “er” in where. Listen, then read the whole sentence.","pattern":"letter group er"}},{"w":"why","d":["why","whey","thy","they"],"pool":["whey","thy","they","shy","shey"],"madeUp":["shey"],"sentence":"Tell me why you are sad.","expansion":true,"sourceId":"next800-011","batch":1,"group":"Sentence building and common verbs","teaching":{"tip":"Look at every letter in why. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"must","d":["must","mast","fust","fast"],"pool":["mast","fust","fast","gust","gast"],"madeUp":[],"sentence":"We must look before we cross.","expansion":true,"sourceId":"next800-013","batch":1,"group":"Sentence building and common verbs","teaching":{"tip":"Look at every letter in must. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"should","d":["should","shiuld","shoald","shiald"],"pool":["shiuld","shoald","shiald","shoeld","shield"],"madeUp":["shiuld","shoald","shiald","shoeld"],"sentence":"We should help our friend.","expansion":true,"sourceId":"next800-015","batch":1,"group":"Sentence building and common verbs","teaching":{"tip":"Look carefully at “sh” in should. Listen, then read the whole sentence.","pattern":"letter group sh"}},{"w":"under","d":["under","udder","ander","adder"],"pool":["udder","ander","adder","ender","edder"],"madeUp":["ander"],"sentence":"The cat is under the table.","expansion":true,"sourceId":"next800-040","batch":1,"group":"Sentence building and common verbs","teaching":{"tip":"Look carefully at “er” in under. Listen, then read the whole sentence.","pattern":"letter group er"}},{"w":"home","d":["home","hame","come","came"],"pool":["hame","come","came","dome","dame"],"madeUp":[],"sentence":"We walk home after school.","expansion":true,"sourceId":"next800-057","batch":1,"group":"Sentence building and common verbs","teaching":{"tip":"Look at every letter in home. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"help","d":["help","halp","celp","calp"],"pool":["halp","celp","calp","gelp","galp"],"madeUp":["halp","celp","gelp"],"sentence":"Please help me lift the box.","expansion":true,"sourceId":"next800-058","batch":1,"group":"Sentence building and common verbs","teaching":{"tip":"Look at every letter in help. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"give","d":["give","gave","cive","cave"],"pool":["gave","cive","cave","dive","dave"],"madeUp":[],"sentence":"Please give the book to me.","expansion":true,"sourceId":"next800-059","batch":1,"group":"Sentence building and common verbs","teaching":{"tip":"Look at every letter in give. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"say","d":["say","sey","bay","bey"],"pool":["sey","bay","bey","day","dey"],"madeUp":[],"sentence":"What did you say?","expansion":true,"sourceId":"next800-060","batch":1,"group":"Sentence building and common verbs","teaching":{"tip":"Look carefully at “ay” in say. Listen, then read the whole sentence.","pattern":"letter group ay"}},{"w":"came","d":["came","come","dame","dome"],"pool":["come","dame","dome","hame","home"],"madeUp":[],"sentence":"My friend came to play.","expansion":true,"sourceId":"next800-061","batch":1,"group":"Sentence building and common verbs","teaching":{"tip":"Word family: come → came. Notice how the spelling changes.","family":"come","pattern":"changed word form"}},{"w":"put","d":["put","pat","but","bat"],"pool":["pat","but","bat","cut","cat"],"madeUp":[],"sentence":"Please put the cup on the table.","expansion":true,"sourceId":"next800-062","batch":1,"group":"Sentence building and common verbs","teaching":{"tip":"Look at every letter in put. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"went","d":["went","want","bent","bant"],"pool":["want","bent","bant","cent","cant"],"madeUp":[],"sentence":"We went to the park.","expansion":true,"sourceId":"next800-063","batch":1,"group":"Sentence building and common verbs","teaching":{"tip":"Word family: go → went. Notice how the spelling changes.","family":"go","pattern":"changed word form"}},{"w":"got","d":["got","gat","bot","bat"],"pool":["gat","bot","bat","cot","cat"],"madeUp":[],"sentence":"I got a book for my birthday.","expansion":true,"sourceId":"next800-064","batch":1,"group":"Sentence building and common verbs","teaching":{"tip":"Word family: get → got. Notice how the spelling changes.","family":"get","pattern":"changed word form"}},{"w":"eat","d":["eat","eit","aat","ait"],"pool":["eit","aat","ait","oat","oit"],"madeUp":["eit","aat","oit"],"sentence":"We eat our lunch together.","expansion":true,"sourceId":"next800-068","batch":1,"group":"Sentence building and common verbs","teaching":{"tip":"Look carefully at “ea” in eat. Listen, then read the whole sentence.","pattern":"letter group ea"}},{"w":"ate","d":["ate","abe","ata","aba"],"pool":["abe","ata","aba","ati","abi"],"madeUp":["abi"],"sentence":"The horse ate the apple.","expansion":true,"sourceId":"next800-069","batch":1,"group":"Sentence building and common verbs","teaching":{"tip":"Word family: eat → ate. Notice how the spelling changes.","family":"eat","pattern":"changed word form"}},{"w":"play","d":["play","ploy","blay","bloy"],"pool":["ploy","blay","bloy","clay","cloy"],"madeUp":["bloy"],"sentence":"Come and play with me.","expansion":true,"sourceId":"next800-070","batch":1,"group":"Sentence building and common verbs","teaching":{"tip":"Look carefully at “ay” in play. Listen, then read the whole sentence.","pattern":"letter group ay"}},{"w":"going","d":["going","geing","boing","being"],"pool":["geing","boing","being","doing","deing"],"madeUp":["geing","boing","deing"],"sentence":"We are going to the beach.","expansion":true,"sourceId":"next800-083","batch":1,"group":"Sentence building and common verbs","teaching":{"tip":"Word family: go → going. Read the whole word, including its ending.","family":"go","pattern":"word ending"}},{"w":"goes","d":["goes","gees","boes","bees"],"pool":["gees","boes","bees","does","dees"],"madeUp":["gees","boes","dees"],"sentence":"My sister goes to school.","expansion":true,"sourceId":"next800-084","batch":1,"group":"Sentence building and common verbs","teaching":{"tip":"Word family: go → goes. Read the whole word, including its ending.","family":"go","pattern":"word ending"}},{"w":"can't","d":["can't","con't","ban't","bon't"],"pool":["con't","ban't","bon't","dan't","don't"],"madeUp":["con't","ban't","bon't","dan't"],"sentence":"I can't reach the top shelf.","expansion":true,"sourceId":"next800-085","batch":1,"group":"Sentence building and common verbs","teaching":{"tip":"can't means cannot. The apostrophe takes the place of missing letters.","family":"cannot","pattern":"contraction"}},{"w":"didn't","d":["didn't","dadn't","bidn't","badn't"],"pool":["dadn't","bidn't","badn't","hidn't","hadn't"],"madeUp":["dadn't","bidn't","badn't","hidn't"],"sentence":"I didn't hear the bell.","expansion":true,"sourceId":"next800-086","batch":1,"group":"Sentence building and common verbs","teaching":{"tip":"didn't means did not. The apostrophe takes the place of missing letters.","family":"did not","pattern":"contraction"}},{"w":"three","d":["three","throe","threa","throa"],"pool":["throe","threa","throa","threi","throi"],"madeUp":["threa","throa","threi","throi"],"sentence":"There are three eggs in the nest.","expansion":true,"sourceId":"next800-110","batch":1,"group":"Written numbers and quantity","teaching":{"symbol":"3","number":3,"tip":"three is 3. Read the word, then say the number.","pattern":"number word"}},{"w":"four","d":["four","foer","dour","doer"],"pool":["foer","dour","doer","hour","hoer"],"madeUp":["foer"],"sentence":"The cat has four paws.","expansion":true,"sourceId":"next800-111","batch":1,"group":"Written numbers and quantity","teaching":{"symbol":"4","number":4,"tip":"four is 4. Read the word, then say the number.","pattern":"number word"}},{"w":"five","d":["five","fave","cive","cave"],"pool":["fave","cive","cave","dive","dave"],"madeUp":["fave"],"sentence":"I have five fingers on one hand.","expansion":true,"sourceId":"next800-112","batch":1,"group":"Written numbers and quantity","teaching":{"symbol":"5","number":5,"tip":"five is 5. Read the word, then say the number.","pattern":"number word"}},{"w":"six","d":["six","sax","sib","sab"],"pool":["sax","sib","sab","sic","sac"],"madeUp":[],"sentence":"There are six apples in the bag.","expansion":true,"sourceId":"next800-113","batch":1,"group":"Written numbers and quantity","teaching":{"symbol":"6","number":6,"tip":"six is 6. Read the word, then say the number.","pattern":"number word"}},{"w":"seven","d":["seven","saven","beven","baven"],"pool":["saven","beven","baven","deven","daven"],"madeUp":["saven","beven","baven","deven"],"sentence":"There are seven days in a week.","expansion":true,"sourceId":"next800-114","batch":1,"group":"Written numbers and quantity","teaching":{"symbol":"7","number":7,"tip":"seven is 7. Read the word, then say the number.","pattern":"number word"}},{"w":"eight","d":["eight","eught","aight","aught"],"pool":["eught","aight","aught","oight","ought"],"madeUp":["eught","aight","oight"],"sentence":"A spider has eight legs.","expansion":true,"sourceId":"next800-115","batch":1,"group":"Written numbers and quantity","teaching":{"symbol":"8","tip":"Eight sounds like ate.","pattern":"tricky spelling or meaning"}},{"w":"nine","d":["nine","nane","bine","bane"],"pool":["nane","bine","bane","cine","cane"],"madeUp":[],"sentence":"There are nine shells in the box.","expansion":true,"sourceId":"next800-116","batch":1,"group":"Written numbers and quantity","teaching":{"symbol":"9","number":9,"tip":"nine is 9. Read the word, then say the number.","pattern":"number word"}},{"w":"ten","d":["ten","tan","ben","ban"],"pool":["tan","ben","ban","den","dan"],"madeUp":[],"sentence":"I can count to ten.","expansion":true,"sourceId":"next800-117","batch":1,"group":"Written numbers and quantity","teaching":{"symbol":"10","number":10,"tip":"ten is 10. Read the word, then say the number.","pattern":"number word"}},{"w":"zero","d":["zero","zaro","cero","caro"],"pool":["zaro","cero","caro","fero","faro"],"madeUp":["zaro","fero"],"sentence":"There are zero cakes left on the plate.","expansion":true,"sourceId":"next800-109","batch":1,"group":"Written numbers and quantity","teaching":{"symbol":"0","number":0,"tip":"zero is 0. Read the word, then say the number.","pattern":"number word"}},{"w":"friend","d":["friend","fraend","friand","fraand"],"pool":["fraend","friand","fraand","friind","fraind"],"madeUp":["fraend","fraand","friind","fraind"],"sentence":"My friend likes to play with me.","expansion":true,"sourceId":"next800-178","batch":1,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in friend. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"school","d":["school","schaol","schoal","schaal"],"pool":["schaol","schoal","schaal","schoel","schael"],"madeUp":["schaol","schoal","schaal","schoel","schael"],"sentence":"We learn to read at school.","expansion":true,"sourceId":"next800-218","batch":1,"group":"Everyday story essentials","teaching":{"symbol":null,"tip":"In school, ch sounds like k.","pattern":"tricky spelling or meaning"}},{"w":"happy","d":["happy","hippy","cappy","cippy"],"pool":["hippy","cappy","cippy","gappy","gippy"],"madeUp":["cippy"],"sentence":"I feel happy when we play together.","expansion":true,"sourceId":"next800-190","batch":1,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in happy. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"am","d":["am","amm","em","emm"],"pool":["amm","em","emm","om","omm"],"madeUp":["amm","omm"],"sentence":"I am glad to see you.","expansion":true,"sourceId":"next800-001","batch":1,"group":"Sentence building and common verbs","teaching":{"tip":"Look at every letter in am. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"much","d":["much","mush","buch","bush"],"pool":["mush","buch","bush","cuch","cush"],"madeUp":["mush","buch","cuch"],"sentence":"There is too much water in the cup.","expansion":true,"sourceId":"next800-012","batch":1,"group":"Sentence building and common verbs","teaching":{"tip":"Look carefully at “ch” in much. Listen, then read the whole sentence.","pattern":"letter group ch"}},{"w":"old","d":["old","odd","ald","add"],"pool":["odd","ald","add","eld","edd"],"madeUp":["ald","edd"],"sentence":"The old tree has a thick trunk.","expansion":true,"sourceId":"next800-158","batch":1,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in old. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"cold","d":["cold","celd","bold","beld"],"pool":["celd","bold","beld","gold","geld"],"madeUp":["celd"],"sentence":"The snow feels cold on my hands.","expansion":true,"sourceId":"next800-159","batch":1,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in cold. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"mum","d":["mum","mam","dum","dam"],"pool":["mam","dum","dam","fum","fam"],"madeUp":[],"sentence":"My mum reads a book with me.","expansion":true,"sourceId":"next800-430","batch":1,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in mum. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"parents","d":["parents","perents","parants","perants"],"pool":["perents","parants","perants","parints","perints"],"madeUp":["perents","parants","perants","parints","perints"],"sentence":"My parents help me learn.","expansion":true,"sourceId":"next800-431","batch":1,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “ar” in parents. Listen, then read the whole sentence.","pattern":"letter group ar"}},{"w":"asked","d":["asked","adked","asbed","adbed"],"pool":["adked","asbed","adbed","asded","added"],"madeUp":["adked","asbed","adbed","asded"],"sentence":"I asked my friend to play.","expansion":true,"sourceId":"next800-561","batch":1,"group":"Actions and word families","teaching":{"tip":"Word family: ask → asked. Read the whole word, including its ending.","family":"ask","pattern":"word ending"}},{"w":"bigger","d":["bigger","bagger","digger","dagger"],"pool":["bagger","digger","dagger","gigger","gagger"],"madeUp":[],"sentence":"This box is bigger than that one.","expansion":true,"sourceId":"next800-650","batch":1,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Word family: big → bigger. Read the whole word, including its ending.","family":"big","pattern":"word ending"}},{"w":"rainy","d":["rainy","rairy","dainy","dairy"],"pool":["rairy","dainy","dairy","fainy","fairy"],"madeUp":["rairy","dainy","fainy"],"sentence":"We wear boots on a rainy day.","expansion":true,"sourceId":"next800-716","batch":1,"group":"Nature, places, adventure and reading","teaching":{"tip":"Word family: rain → rainy. Read the whole word, including its ending.","family":"rain","pattern":"word ending"}},{"w":"eleven","d":["eleven","elaven","elevan","elavan"],"pool":["elaven","elevan","elavan","elevon","elavon"],"madeUp":["elaven","elevan","elavan","elavon"],"sentence":"There are eleven players on the team.","expansion":true,"sourceId":"next800-118","batch":1,"group":"Written numbers and quantity","teaching":{"symbol":"11","number":11,"tip":"eleven is 11. Read the word, then say the number.","pattern":"number word"}},{"w":"may","d":["may","moy","bay","boy"],"pool":["moy","bay","boy","cay","coy"],"madeUp":[],"sentence":"You may have an apple.","expansion":true,"sourceId":"next800-014","batch":1,"group":"Sentence building and common verbs","teaching":{"tip":"Look carefully at “ay” in may. Listen, then read the whole sentence.","pattern":"letter group ay"}},{"w":"never","d":["never","niver","bever","biver"],"pool":["niver","bever","biver","fever","fiver"],"madeUp":["niver","biver"],"sentence":"I never put my hand in a fire.","expansion":true,"sourceId":"next800-016","batch":1,"group":"Sentence building and common verbs","teaching":{"tip":"Look carefully at “er” in never. Listen, then read the whole sentence.","pattern":"letter group er"}},{"w":"full","d":["full","fall","bull","ball"],"pool":["fall","bull","ball","cull","call"],"madeUp":[],"sentence":"My cup is full of water.","expansion":true,"sourceId":"next800-160","batch":1,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in full. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"blue","d":["blue","blee","clue","clee"],"pool":["blee","clue","clee","flue","flee"],"madeUp":[],"sentence":"The sky is blue today.","expansion":true,"sourceId":"next800-161","batch":1,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in blue. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"grandma","d":["grandma","grandpa","grendma","grendpa"],"pool":["grandpa","grendma","grendpa","grindma","grindpa"],"madeUp":["grendma","grendpa","grindma","grindpa"],"sentence":"My grandma tells wonderful stories.","expansion":true,"sourceId":"next800-432","batch":1,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in grandma. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"grandpa","d":["grandpa","grandma","grendpa","grendma"],"pool":["grandma","grendpa","grendma","grindpa","grindma"],"madeUp":["grendpa","grendma","grindpa","grindma"],"sentence":"My grandpa grows flowers.","expansion":true,"sourceId":"next800-433","batch":1,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in grandpa. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"says","d":["says","seys","bays","beys"],"pool":["seys","bays","beys","days","deys"],"madeUp":["seys","bays","beys","deys"],"sentence":"The sign says to stop.","expansion":true,"sourceId":"next800-562","batch":1,"group":"Actions and word families","teaching":{"tip":"Word family: say → says. Read the whole word, including its ending.","family":"say","pattern":"word ending"}},{"w":"biggest","d":["biggest","baggest","biggast","baggast"],"pool":["baggest","biggast","baggast","biggist","baggist"],"madeUp":["baggest","biggast","baggast","biggist","baggist"],"sentence":"The elephant is the biggest animal here.","expansion":true,"sourceId":"next800-651","batch":1,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Word family: big → biggest. Read the whole word, including its ending.","family":"big","pattern":"word ending"}},{"w":"sunny","d":["sunny","sanny","dunny","danny"],"pool":["sanny","dunny","danny","funny","fanny"],"madeUp":["sanny"],"sentence":"It is a warm, sunny day.","expansion":true,"sourceId":"next800-717","batch":1,"group":"Nature, places, adventure and reading","teaching":{"tip":"Word family: sun → sunny. Read the whole word, including its ending.","family":"sun","pattern":"word ending"}},{"w":"twelve","d":["twelve","twalve","twelva","twalva"],"pool":["twalve","twelva","twalva","twelvi","twalvi"],"madeUp":["twalve","twelva","twalva","twelvi","twalvi"],"sentence":"There are twelve eggs in the box.","expansion":true,"sourceId":"next800-119","batch":1,"group":"Written numbers and quantity","teaching":{"symbol":"12","number":12,"tip":"twelve is 12. Read the word, then say the number.","pattern":"number word"}},{"w":"once","d":["once","onbe","ince","inbe"],"pool":["onbe","ince","inbe","unce","unbe"],"madeUp":["onbe","ince","unce"],"sentence":"I saw a whale once.","expansion":true,"sourceId":"next800-017","batch":1,"group":"Sentence building and common verbs","teaching":{"tip":"Look at every letter in once. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"soon","d":["soon","sion","boon","bion"],"pool":["sion","boon","bion","doon","dion"],"madeUp":[],"sentence":"We will be home soon.","expansion":true,"sourceId":"next800-018","batch":1,"group":"Sentence building and common verbs","teaching":{"tip":"Look carefully at “oo” in soon. Listen, then read the whole sentence.","pattern":"letter group oo"}},{"w":"better","d":["better","batter","fetter","fatter"],"pool":["batter","fetter","fatter","getter","gatter"],"madeUp":[],"sentence":"I feel better after a rest.","expansion":true,"sourceId":"next800-162","batch":1,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “er” in better. Listen, then read the whole sentence.","pattern":"letter group er"}},{"w":"black","d":["black","bleck","clack","cleck"],"pool":["bleck","clack","cleck","flack","fleck"],"madeUp":[],"sentence":"The black cat sits on the wall.","expansion":true,"sourceId":"next800-163","batch":1,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in black. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"aunt","d":["aunt","aint","eunt","eint"],"pool":["aint","eunt","eint","ount","oint"],"madeUp":["eunt","eint","ount"],"sentence":"My aunt is my mother's sister.","expansion":true,"sourceId":"next800-434","batch":1,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in aunt. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"cousin","d":["cousin","causin","coasin","caasin"],"pool":["causin","coasin","caasin","coesin","caesin"],"madeUp":["causin","coasin","caasin","coesin","caesin"],"sentence":"My cousin is my aunt's child.","expansion":true,"sourceId":"next800-435","batch":1,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “ou” in cousin. Listen, then read the whole sentence.","pattern":"letter group ou"}},{"w":"talking","d":["talking","tacking","balking","backing"],"pool":["tacking","balking","backing","calking","cacking"],"madeUp":["balking","cacking"],"sentence":"We are talking about the story.","expansion":true,"sourceId":"next800-563","batch":1,"group":"Actions and word families","teaching":{"tip":"Word family: talk → talking. Read the whole word, including its ending.","family":"talk","pattern":"word ending"}},{"w":"worse","d":["worse","warse","corse","carse"],"pool":["warse","corse","carse","gorse","garse"],"madeUp":[],"sentence":"The rain is worse than it was before.","expansion":true,"sourceId":"next800-652","batch":1,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look carefully at “or” in worse. Listen, then read the whole sentence.","pattern":"letter group or"}},{"w":"windy","d":["windy","wandy","bindy","bandy"],"pool":["wandy","bindy","bandy","cindy","candy"],"madeUp":["bindy"],"sentence":"We fly a kite on a windy day.","expansion":true,"sourceId":"next800-718","batch":1,"group":"Nature, places, adventure and reading","teaching":{"tip":"Word family: wind → windy. Read the whole word, including its ending.","family":"wind","pattern":"word ending"}},{"w":"thirteen","d":["thirteen","tharteen","thirtaen","thartaen"],"pool":["tharteen","thirtaen","thartaen","thirtien","thartien"],"madeUp":["tharteen","thirtaen","thartaen","thirtien","thartien"],"sentence":"We count thirteen leaves on the branch.","expansion":true,"sourceId":"next800-120","batch":1,"group":"Written numbers and quantity","teaching":{"symbol":"13","tip":"Compare three, thirteen and thirty.","pattern":"tricky spelling or meaning"}},{"w":"today","d":["today","teday","boday","beday"],"pool":["teday","boday","beday","coday","ceday"],"madeUp":["teday","boday","coday","ceday"],"sentence":"We will go to the park today.","expansion":true,"sourceId":"next800-019","batch":1,"group":"Sentence building and common verbs","teaching":{"tip":"A day of the week. Its name starts with a capital letter.","pattern":"day name"}},{"w":"well","d":["well","wall","bell","ball"],"pool":["wall","bell","ball","cell","call"],"madeUp":[],"sentence":"You can read that word well.","expansion":true,"sourceId":"next800-020","batch":1,"group":"Sentence building and common verbs","teaching":{"tip":"Look at every letter in well. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"round","d":["round","raund","bound","baund"],"pool":["raund","bound","baund","found","faund"],"madeUp":["raund","baund","faund"],"sentence":"The ball is round.","expansion":true,"sourceId":"next800-164","batch":1,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ou” in round. Listen, then read the whole sentence.","pattern":"letter group ou"}},{"w":"warm","d":["warm","worm","barm","borm"],"pool":["worm","barm","borm","farm","form"],"madeUp":["borm"],"sentence":"My coat keeps me warm.","expansion":true,"sourceId":"next800-165","batch":1,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ar” in warm. Listen, then read the whole sentence.","pattern":"letter group ar"}},{"w":"teacher","d":["teacher","toacher","teicher","toicher"],"pool":["toacher","teicher","toicher","teucher","toucher"],"madeUp":["toacher","toicher","teucher"],"sentence":"Our teacher helps us learn to read.","expansion":true,"sourceId":"next800-436","batch":1,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “ch” in teacher. Listen, then read the whole sentence.","pattern":"letter group ch"}},{"w":"classroom","d":["classroom","clessroom","classraom","clessraom"],"pool":["clessroom","classraom","clessraom","classreom","clessreom"],"madeUp":["clessroom","classraom","clessraom","classreom","clessreom"],"sentence":"We read together in our classroom.","expansion":true,"sourceId":"next800-437","batch":1,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “oo” in classroom. Listen, then read the whole sentence.","pattern":"letter group oo"}},{"w":"call","d":["call","cell","ball","bell"],"pool":["cell","ball","bell","fall","fell"],"madeUp":[],"sentence":"I call my dog to come home.","expansion":true,"sourceId":"next800-564","batch":1,"group":"Actions and word families","teaching":{"tip":"Look at every letter in call. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"worst","d":["worst","warst","dorst","darst"],"pool":["warst","dorst","darst","forst","farst"],"madeUp":["dorst","farst"],"sentence":"This is the worst weather of the week.","expansion":true,"sourceId":"next800-653","batch":1,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look carefully at “or” in worst. Listen, then read the whole sentence.","pattern":"letter group or"}},{"w":"fog","d":["fog","fig","bog","big"],"pool":["fig","bog","big","cog","cig"],"madeUp":[],"sentence":"The thick fog makes it hard to see.","expansion":true,"sourceId":"next800-719","batch":1,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look at every letter in fog. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"fourteen","d":["fourteen","faurteen","foarteen","faarteen"],"pool":["faurteen","foarteen","faarteen","foerteen","faerteen"],"madeUp":["faurteen","foarteen","faarteen","foerteen","faerteen"],"sentence":"There are fourteen beads on the string.","expansion":true,"sourceId":"next800-121","batch":1,"group":"Written numbers and quantity","teaching":{"symbol":"14","tip":"Compare four, fourteen and forty.","pattern":"tricky spelling or meaning"}},{"w":"than","d":["than","tran","then","tren"],"pool":["tran","then","tren","thin","trin"],"madeUp":["tran","tren","trin"],"sentence":"The tree is taller than the house.","expansion":true,"sourceId":"next800-021","batch":1,"group":"Sentence building and common verbs","teaching":{"tip":"Look carefully at “th” in than. Listen, then read the whole sentence.","pattern":"letter group th"}},{"w":"other","d":["other","ocher","ather","acher"],"pool":["ocher","ather","acher","ether","echer"],"madeUp":["ather","echer"],"sentence":"Put your other shoe on.","expansion":true,"sourceId":"next800-022","batch":1,"group":"Sentence building and common verbs","teaching":{"tip":"Look carefully at “th” in other. Listen, then read the whole sentence.","pattern":"letter group th"}},{"w":"brown","d":["brown","brawn","crown","crawn"],"pool":["brawn","crown","crawn","frown","frawn"],"madeUp":["crawn"],"sentence":"The horse has a brown tail.","expansion":true,"sourceId":"next800-166","batch":1,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ow” in brown. Listen, then read the whole sentence.","pattern":"letter group ow"}},{"w":"clean","d":["clean","claan","blean","blaan"],"pool":["claan","blean","blaan","glean","glaan"],"madeUp":["claan","blean","blaan","glaan"],"sentence":"My hands are clean now.","expansion":true,"sourceId":"next800-167","batch":1,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ea” in clean. Listen, then read the whole sentence.","pattern":"letter group ea"}},{"w":"lesson","d":["lesson","lasson","besson","basson"],"pool":["lasson","besson","basson","cesson","casson"],"madeUp":["lasson","besson","basson","cesson"],"sentence":"We learn something new in the lesson.","expansion":true,"sourceId":"next800-438","batch":1,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in lesson. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"homework","d":["homework","hamework","homawork","hamawork"],"pool":["hamework","homawork","hamawork","homiwork","hamiwork"],"madeUp":["hamework","homawork","hamawork","homiwork","hamiwork"],"sentence":"I put my homework in my bag.","expansion":true,"sourceId":"next800-439","batch":1,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “or” in homework. Listen, then read the whole sentence.","pattern":"letter group or"}},{"w":"called","d":["called","celled","balled","belled"],"pool":["celled","balled","belled","galled","gelled"],"madeUp":["gelled"],"sentence":"My friend called my name.","expansion":true,"sourceId":"next800-565","batch":1,"group":"Actions and word families","teaching":{"tip":"Word family: call → called. Read the whole word, including its ending.","family":"call","pattern":"word ending"}},{"w":"afraid","d":["afraid","abraid","efraid","ebraid"],"pool":["abraid","efraid","ebraid","ifraid","ibraid"],"madeUp":["efraid","ebraid","ifraid","ibraid"],"sentence":"The little puppy is afraid of the thunder.","expansion":true,"sourceId":"next800-654","batch":1,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look carefully at “ai” in afraid. Listen, then read the whole sentence.","pattern":"letter group ai"}},{"w":"thunder","d":["thunder","thonder","thundar","thondar"],"pool":["thonder","thundar","thondar","thundir","thondir"],"madeUp":["thundar","thondar","thundir","thondir"],"sentence":"We hear thunder during the storm.","expansion":true,"sourceId":"next800-720","batch":1,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look carefully at “th” in thunder. Listen, then read the whole sentence.","pattern":"letter group th"}},{"w":"fifteen","d":["fifteen","fafteen","fiftaen","faftaen"],"pool":["fafteen","fiftaen","faftaen","fiftien","faftien"],"madeUp":["fafteen","fiftaen","faftaen","fiftien","faftien"],"sentence":"There are fifteen children on the bus.","expansion":true,"sourceId":"next800-122","batch":1,"group":"Written numbers and quantity","teaching":{"symbol":"15","tip":"Compare five, fifteen and fifty.","pattern":"tricky spelling or meaning"}},{"w":"each","d":["each","euch","aach","auch"],"pool":["euch","aach","auch","oach","ouch"],"madeUp":["euch","aach","auch","oach"],"sentence":"Give each child an apple.","expansion":true,"sourceId":"next800-023","batch":1,"group":"Sentence building and common verbs","teaching":{"tip":"Look carefully at “ch” in each. Listen, then read the whole sentence.","pattern":"letter group ch"}},{"w":"also","d":["also","albo","alsa","alba"],"pool":["albo","alsa","alba","alse","albe"],"madeUp":["albo","alsa","alse"],"sentence":"I like cats and I also like dogs.","expansion":true,"sourceId":"next800-024","batch":1,"group":"Sentence building and common verbs","teaching":{"tip":"Look at every letter in also. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"sun","d":["sun","san","bun","ban"],"pool":["san","bun","ban","dun","dan"],"madeUp":[],"sentence":"The sun shines in the sky.","expansion":true,"sourceId":"next800-168","batch":1,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in sun. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"door","d":["door","daor","doer","daer"],"pool":["daor","doer","daer","dour","daur"],"madeUp":["daor"],"sentence":"Please close the door.","expansion":true,"sourceId":"next800-169","batch":1,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “oo” in door. Listen, then read the whole sentence.","pattern":"letter group oo"}},{"w":"pencil","d":["pencil","pancil","penbil","panbil"],"pool":["pancil","penbil","panbil","penfil","panfil"],"madeUp":["pancil","penbil","panbil","penfil"],"sentence":"I write with a pencil.","expansion":true,"sourceId":"next800-440","batch":1,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in pencil. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"pen","d":["pen","pan","ben","ban"],"pool":["pan","ben","ban","den","dan"],"madeUp":[],"sentence":"The pen makes a blue line.","expansion":true,"sourceId":"next800-441","batch":1,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in pen. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"looked","d":["looked","laoked","booked","baoked"],"pool":["laoked","booked","baoked","cooked","caoked"],"madeUp":["laoked","baoked","cooked","caoked"],"sentence":"We looked inside the box.","expansion":true,"sourceId":"next800-566","batch":1,"group":"Actions and word families","teaching":{"tip":"Word family: look → looked. Read the whole word, including its ending.","family":"look","pattern":"word ending"}},{"w":"worried","d":["worried","warried","borried","barried"],"pool":["warried","borried","barried","corried","carried"],"madeUp":["warried","borried","barried","corried"],"sentence":"I felt worried when I lost my bag.","expansion":true,"sourceId":"next800-655","batch":1,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look carefully at “or” in worried. Listen, then read the whole sentence.","pattern":"letter group or"}},{"w":"lightning","d":["lightning","laghtning","lightnang","laghtnang"],"pool":["laghtning","lightnang","laghtnang","lightneng","laghtneng"],"madeUp":["laghtning","lightnang","laghtnang","lightneng","laghtneng"],"sentence":"A flash of lightning lights up the sky.","expansion":true,"sourceId":"next800-721","batch":1,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look carefully at “igh” in lightning. Listen, then read the whole sentence.","pattern":"letter group igh"}},{"w":"sixteen","d":["sixteen","saxteen","sixtaen","saxtaen"],"pool":["saxteen","sixtaen","saxtaen","sixtien","saxtien"],"madeUp":["saxteen","sixtaen","saxtaen","sixtien","saxtien"],"sentence":"We count sixteen seeds in the packet.","expansion":true,"sourceId":"next800-123","batch":1,"group":"Written numbers and quantity","teaching":{"symbol":"16","number":16,"tip":"sixteen is 16. Read the word, then say the number.","pattern":"number word"}},{"w":"even","d":["even","eben","evan","eban"],"pool":["eben","evan","eban","evon","ebon"],"madeUp":["eban","evon"],"sentence":"The bag is heavy, even for Dad.","expansion":true,"sourceId":"next800-025","batch":2,"group":"Sentence building and common verbs","teaching":{"tip":"Look at every letter in even. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"such","d":["such","sugh","sech","segh"],"pool":["sugh","sech","segh","sich","sigh"],"madeUp":["segh","sich"],"sentence":"It is such a hot day!","expansion":true,"sourceId":"next800-026","batch":2,"group":"Sentence building and common verbs","teaching":{"tip":"Look carefully at “ch” in such. Listen, then read the whole sentence.","pattern":"letter group ch"}},{"w":"pretty","d":["pretty","pritty","fretty","fritty"],"pool":["pritty","fretty","fritty","gretty","gritty"],"madeUp":["pritty","fritty","gretty"],"sentence":"The flower is pretty and pink.","expansion":true,"sourceId":"next800-170","batch":2,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in pretty. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"king","d":["king","kang","bing","bang"],"pool":["kang","bing","bang","ding","dang"],"madeUp":[],"sentence":"The king wears a gold crown.","expansion":true,"sourceId":"next800-171","batch":2,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ng” in king. Listen, then read the whole sentence.","pattern":"letter group ng"}},{"w":"ruler","d":["ruler","raler","buler","baler"],"pool":["raler","buler","baler","duler","daler"],"madeUp":["raler","buler"],"sentence":"I use a ruler to draw a straight line.","expansion":true,"sourceId":"next800-442","batch":2,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “er” in ruler. Listen, then read the whole sentence.","pattern":"letter group er"}},{"w":"bag","d":["bag","big","cag","cig"],"pool":["big","cag","cig","dag","dig"],"madeUp":[],"sentence":"My books are in my bag.","expansion":true,"sourceId":"next800-443","batch":2,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in bag. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"looking","d":["looking","laoking","booking","baoking"],"pool":["laoking","booking","baoking","cooking","caoking"],"madeUp":["laoking","baoking","caoking"],"sentence":"I am looking for my hat.","expansion":true,"sourceId":"next800-567","batch":2,"group":"Actions and word families","teaching":{"tip":"Word family: look → looking. Read the whole word, including its ending.","family":"look","pattern":"word ending"}},{"w":"lonely","d":["lonely","lovely","lanely","lavely"],"pool":["lovely","lanely","lavely","linely","lively"],"madeUp":["lanely","lavely","linely"],"sentence":"I felt lonely until my friend came.","expansion":true,"sourceId":"next800-656","batch":2,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look at every letter in lonely. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"rainbow","d":["rainbow","reinbow","raanbow","reanbow"],"pool":["reinbow","raanbow","reanbow","raenbow","reenbow"],"madeUp":["reinbow","raanbow","reanbow","raenbow","reenbow"],"sentence":"We see a rainbow after the rain.","expansion":true,"sourceId":"next800-722","batch":2,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look carefully at “ai” in rainbow. Listen, then read the whole sentence.","pattern":"letter group ai"}},{"w":"seventeen","d":["seventeen","saventeen","sevanteen","savanteen"],"pool":["saventeen","sevanteen","savanteen","sevinteen","savinteen"],"madeUp":["saventeen","sevanteen","savanteen","sevinteen","savinteen"],"sentence":"There are seventeen books on the shelf.","expansion":true,"sourceId":"next800-124","batch":2,"group":"Written numbers and quantity","teaching":{"symbol":"17","number":17,"tip":"seventeen is 17. Read the word, then say the number.","pattern":"number word"}},{"w":"same","d":["same","seme","dame","deme"],"pool":["seme","dame","deme","fame","feme"],"madeUp":[],"sentence":"We are reading the same book.","expansion":true,"sourceId":"next800-027","batch":2,"group":"Sentence building and common verbs","teaching":{"tip":"Look at every letter in same. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"another","d":["another","anither","enother","enither"],"pool":["anither","enother","enither","inother","inither"],"madeUp":["enother","enither","inother","inither"],"sentence":"May I have another apple?","expansion":true,"sourceId":"next800-028","batch":2,"group":"Sentence building and common verbs","teaching":{"tip":"Look carefully at “th” in another. Listen, then read the whole sentence.","pattern":"letter group th"}},{"w":"town","d":["town","tawn","down","dawn"],"pool":["tawn","down","dawn","gown","gawn"],"madeUp":[],"sentence":"There are many shops in the town.","expansion":true,"sourceId":"next800-172","batch":2,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ow” in town. Listen, then read the whole sentence.","pattern":"letter group ow"}},{"w":"drink","d":["drink","drank","brink","brank"],"pool":["drank","brink","brank","crink","crank"],"madeUp":[],"sentence":"I drink water when I am thirsty.","expansion":true,"sourceId":"next800-173","batch":2,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in drink. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"lunch","d":["lunch","lench","bunch","bench"],"pool":["lench","bunch","bench","dunch","dench"],"madeUp":["dench"],"sentence":"We eat lunch in the middle of the day.","expansion":true,"sourceId":"next800-444","batch":2,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “ch” in lunch. Listen, then read the whole sentence.","pattern":"letter group ch"}},{"w":"breakfast","d":["breakfast","braakfast","breikfast","braikfast"],"pool":["braakfast","breikfast","braikfast","breokfast","braokfast"],"madeUp":["braakfast","breikfast","braikfast","breokfast","braokfast"],"sentence":"I eat breakfast when I get up.","expansion":true,"sourceId":"next800-445","batch":2,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “ea” in breakfast. Listen, then read the whole sentence.","pattern":"letter group ea"}},{"w":"watch","d":["watch","witch","catch","citch"],"pool":["witch","catch","citch","datch","ditch"],"madeUp":["citch"],"sentence":"We watch the birds in the garden.","expansion":true,"sourceId":"next800-568","batch":2,"group":"Actions and word families","teaching":{"tip":"Look carefully at “ch” in watch. Listen, then read the whole sentence.","pattern":"letter group ch"}},{"w":"excited","d":["excited","excated","axcited","axcated"],"pool":["excated","axcited","axcated","ixcited","ixcated"],"madeUp":["excated","axcited","axcated","ixcited","ixcated"],"sentence":"I am excited about my birthday.","expansion":true,"sourceId":"next800-657","batch":2,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look at every letter in excited. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"space","d":["space","scace","spece","scece"],"pool":["scace","spece","scece","spice","scice"],"madeUp":["scace","scece","scice"],"sentence":"The moon is out in space.","expansion":true,"sourceId":"next800-723","batch":2,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look at every letter in space. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"eighteen","d":["eighteen","eaghteen","aighteen","aaghteen"],"pool":["eaghteen","aighteen","aaghteen","iighteen","iaghteen"],"madeUp":["eaghteen","aighteen","aaghteen","iighteen","iaghteen"],"sentence":"There are eighteen flowers in the garden.","expansion":true,"sourceId":"next800-125","batch":2,"group":"Written numbers and quantity","teaching":{"symbol":"18","tip":"Eighteen has one t. Compare eight and eighty.","pattern":"tricky spelling or meaning"}},{"w":"most","d":["most","mast","bost","bast"],"pool":["mast","bost","bast","cost","cast"],"madeUp":["bost"],"sentence":"The big tree has the most leaves.","expansion":true,"sourceId":"next800-029","batch":2,"group":"Sentence building and common verbs","teaching":{"tip":"Look at every letter in most. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"few","d":["few","fow","dew","dow"],"pool":["fow","dew","dow","hew","how"],"madeUp":[],"sentence":"There are a few cakes left.","expansion":true,"sourceId":"next800-030","batch":2,"group":"Sentence building and common verbs","teaching":{"tip":"Look at every letter in few. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"river","d":["river","raver","diver","daver"],"pool":["raver","diver","daver","fiver","faver"],"madeUp":["faver"],"sentence":"The river flows under the bridge.","expansion":true,"sourceId":"next800-174","batch":2,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “er” in river. Listen, then read the whole sentence.","pattern":"letter group er"}},{"w":"key","d":["key","kay","bey","bay"],"pool":["kay","bey","bay","dey","day"],"madeUp":[],"sentence":"This key opens the door.","expansion":true,"sourceId":"next800-175","batch":2,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in key. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"dinner","d":["dinner","danner","finner","fanner"],"pool":["danner","finner","fanner","ginner","ganner"],"madeUp":[],"sentence":"We have dinner in the evening.","expansion":true,"sourceId":"next800-446","batch":2,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “er” in dinner. Listen, then read the whole sentence.","pattern":"letter group er"}},{"w":"snack","d":["snack","stack","sneck","steck"],"pool":["stack","sneck","steck","snick","stick"],"madeUp":["steck"],"sentence":"I have an apple for a snack.","expansion":true,"sourceId":"next800-447","batch":2,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in snack. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"search","d":["search","siarch","bearch","biarch"],"pool":["siarch","bearch","biarch","dearch","diarch"],"madeUp":["siarch","bearch","biarch","dearch"],"sentence":"We search for the missing key.","expansion":true,"sourceId":"next800-569","batch":2,"group":"Actions and word families","teaching":{"tip":"Look carefully at “ch” in search. Listen, then read the whole sentence.","pattern":"letter group ch"}},{"w":"tired","d":["tired","tored","cired","cored"],"pool":["tored","cired","cored","fired","fored"],"madeUp":["cired","fored"],"sentence":"I feel tired after a long walk.","expansion":true,"sourceId":"next800-658","batch":2,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look carefully at “ir” in tired. Listen, then read the whole sentence.","pattern":"letter group ir"}},{"w":"ocean","d":["ocean","odean","acean","adean"],"pool":["odean","acean","adean","icean","idean"],"madeUp":["odean","acean","adean","icean"],"sentence":"A whale swims in the ocean.","expansion":true,"sourceId":"next800-724","batch":2,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look carefully at “ea” in ocean. Listen, then read the whole sentence.","pattern":"letter group ea"}},{"w":"nineteen","d":["nineteen","naneteen","ninateen","nanateen"],"pool":["naneteen","ninateen","nanateen","niniteen","naniteen"],"madeUp":["naneteen","ninateen","nanateen","niniteen","naniteen"],"sentence":"We count nineteen shells on the sand.","expansion":true,"sourceId":"next800-126","batch":2,"group":"Written numbers and quantity","teaching":{"symbol":"19","number":19,"tip":"nineteen is 19. Read the word, then say the number.","pattern":"number word"}},{"w":"enough","d":["enough","eneugh","anough","aneugh"],"pool":["eneugh","anough","aneugh","inough","ineugh"],"madeUp":["anough","aneugh","inough","ineugh"],"sentence":"We have enough food for everyone.","expansion":true,"sourceId":"next800-031","batch":2,"group":"Sentence building and common verbs","teaching":{"tip":"Look carefully at “ou” in enough. Listen, then read the whole sentence.","pattern":"letter group ou"}},{"w":"almost","d":["almost","acmost","albost","acbost"],"pool":["acmost","albost","acbost","alcost","accost"],"madeUp":["acmost","albost","acbost","alcost"],"sentence":"The cup is almost full.","expansion":true,"sourceId":"next800-032","batch":2,"group":"Sentence building and common verbs","teaching":{"tip":"Look at every letter in almost. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"cloud","d":["cloud","cleud","cload","clead"],"pool":["cleud","cload","clead","cloed","cleed"],"madeUp":["cleud","cload","cloed","cleed"],"sentence":"A white cloud floats across the sky.","expansion":true,"sourceId":"next800-176","batch":2,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ou” in cloud. Listen, then read the whole sentence.","pattern":"letter group ou"}},{"w":"mountain","d":["mountain","mauntain","bountain","bauntain"],"pool":["mauntain","bountain","bauntain","fountain","fauntain"],"madeUp":["mauntain","bountain","bauntain","fauntain"],"sentence":"There is snow on the mountain.","expansion":true,"sourceId":"next800-177","batch":2,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ai” in mountain. Listen, then read the whole sentence.","pattern":"letter group ai"}},{"w":"bread","d":["bread","broad","breed","broed"],"pool":["broad","breed","broed","breod","brood"],"madeUp":["broed","breod"],"sentence":"We cut a slice of bread.","expansion":true,"sourceId":"next800-448","batch":2,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “ea” in bread. Listen, then read the whole sentence.","pattern":"letter group ea"}},{"w":"butter","d":["butter","batter","cutter","catter"],"pool":["batter","cutter","catter","gutter","gatter"],"madeUp":["catter"],"sentence":"I spread butter on my bread.","expansion":true,"sourceId":"next800-449","batch":2,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “er” in butter. Listen, then read the whole sentence.","pattern":"letter group er"}},{"w":"hide","d":["hide","hade","bide","bade"],"pool":["hade","bide","bade","fide","fade"],"madeUp":[],"sentence":"I hide behind the tree.","expansion":true,"sourceId":"next800-570","batch":2,"group":"Actions and word families","teaching":{"tip":"Look at every letter in hide. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"sleepy","d":["sleepy","slaepy","sleapy","slaapy"],"pool":["slaepy","sleapy","slaapy","sleipy","slaipy"],"madeUp":["slaepy","sleapy","slaapy","sleipy","slaipy"],"sentence":"The sleepy baby closes her eyes.","expansion":true,"sourceId":"next800-659","batch":2,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look carefully at “ee” in sleepy. Listen, then read the whole sentence.","pattern":"letter group ee"}},{"w":"pond","d":["pond","pand","bond","band"],"pool":["pand","bond","band","cond","cand"],"madeUp":[],"sentence":"Ducks swim on the pond.","expansion":true,"sourceId":"next800-725","batch":2,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look at every letter in pond. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"twenty","d":["twenty","thenty","twanty","thanty"],"pool":["thenty","twanty","thanty","twinty","thinty"],"madeUp":["thenty","twanty","thanty","twinty","thinty"],"sentence":"There are twenty pencils in the box.","expansion":true,"sourceId":"next800-127","batch":2,"group":"Written numbers and quantity","teaching":{"symbol":"20","number":20,"tip":"twenty is 20. Read the word, then say the number.","pattern":"number word"}},{"w":"sometimes","d":["sometimes","sametimes","somatimes","samatimes"],"pool":["sametimes","somatimes","samatimes","somitimes","samitimes"],"madeUp":["sametimes","somatimes","samatimes","somitimes","samitimes"],"sentence":"We sometimes walk to school.","expansion":true,"sourceId":"next800-033","batch":2,"group":"Sentence building and common verbs","teaching":{"tip":"Look at every letter in sometimes. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"still","d":["still","scill","stall","scall"],"pool":["scill","stall","scall","stull","scull"],"madeUp":["scill"],"sentence":"The baby is still sleeping.","expansion":true,"sourceId":"next800-034","batch":2,"group":"Sentence building and common verbs","teaching":{"tip":"Look at every letter in still. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"friends","d":["friends","fraends","friands","fraands"],"pool":["fraends","friands","fraands","friinds","frainds"],"madeUp":["fraends","friands","fraands","friinds","frainds"],"sentence":"My friends came to my party.","expansion":true,"sourceId":"next800-179","batch":2,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in friends. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"food","d":["food","feod","foed","feed"],"pool":["feod","foed","feed","foud","feud"],"madeUp":["foed"],"sentence":"We put food in the dog's bowl.","expansion":true,"sourceId":"next800-180","batch":2,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “oo” in food. Listen, then read the whole sentence.","pattern":"letter group oo"}},{"w":"cheese","d":["cheese","choese","cheose","choose"],"pool":["choese","cheose","choose","cheuse","chouse"],"madeUp":["choese","cheose","cheuse"],"sentence":"I put cheese in my sandwich.","expansion":true,"sourceId":"next800-450","batch":2,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “ee” in cheese. Listen, then read the whole sentence.","pattern":"letter group ee"}},{"w":"sandwich","d":["sandwich","sendwich","sandwach","sendwach"],"pool":["sendwich","sandwach","sendwach","sandwech","sendwech"],"madeUp":["sendwich","sandwach","sendwach","sandwech","sendwech"],"sentence":"My sandwich has two slices of bread.","expansion":true,"sourceId":"next800-451","batch":2,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “ch” in sandwich. Listen, then read the whole sentence.","pattern":"letter group ch"}},{"w":"hid","d":["hid","had","bid","bad"],"pool":["had","bid","bad","cid","cad"],"madeUp":[],"sentence":"The mouse hid in a hole.","expansion":true,"sourceId":"next800-571","batch":2,"group":"Actions and word families","teaching":{"tip":"Word family: hide → hid. Notice how the spelling changes.","family":"hide","pattern":"changed word form"}},{"w":"hungry","d":["hungry","hangry","hungby","hangby"],"pool":["hangry","hungby","hangby","hungcy","hangcy"],"madeUp":["hangry","hungby","hungcy","hangcy"],"sentence":"I am hungry and ready for lunch.","expansion":true,"sourceId":"next800-660","batch":2,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look carefully at “ng” in hungry. Listen, then read the whole sentence.","pattern":"letter group ng"}},{"w":"stream","d":["stream","scream","straam","scraam"],"pool":["scream","straam","scraam","stroam","scroam"],"madeUp":["straam","scraam","scroam"],"sentence":"The little stream flows over stones.","expansion":true,"sourceId":"next800-726","batch":2,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look carefully at “ea” in stream. Listen, then read the whole sentence.","pattern":"letter group ea"}},{"w":"thirty","d":["thirty","trirty","tharty","trarty"],"pool":["trirty","tharty","trarty","therty","trerty"],"madeUp":["trirty","tharty","trarty","therty","trerty"],"sentence":"There are thirty children in the class.","expansion":true,"sourceId":"next800-128","batch":2,"group":"Written numbers and quantity","teaching":{"symbol":"30","tip":"Compare three, thirteen and thirty.","pattern":"tricky spelling or meaning"}},{"w":"already","d":["already","alraady","elready","elraady"],"pool":["alraady","elready","elraady","ilready","ilraady"],"madeUp":["alraady","elready","elraady","ilready","ilraady"],"sentence":"I have already put my coat on.","expansion":true,"sourceId":"next800-035","batch":2,"group":"Sentence building and common verbs","teaching":{"tip":"Look carefully at “ea” in already. Listen, then read the whole sentence.","pattern":"letter group ea"}},{"w":"yet","d":["yet","yat","eet","eat"],"pool":["yat","eet","eat","oet","oat"],"madeUp":["eet","oet"],"sentence":"The cake is not ready yet.","expansion":true,"sourceId":"next800-036","batch":2,"group":"Sentence building and common verbs","teaching":{"tip":"Look at every letter in yet. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"fish","d":["fish","fash","dish","dash"],"pool":["fash","dish","dash","gish","gash"],"madeUp":[],"sentence":"A fish swims in the pond.","expansion":true,"sourceId":"next800-181","batch":2,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “sh” in fish. Listen, then read the whole sentence.","pattern":"letter group sh"}},{"w":"horse","d":["horse","harse","corse","carse"],"pool":["harse","corse","carse","gorse","garse"],"madeUp":["harse"],"sentence":"The horse runs across the field.","expansion":true,"sourceId":"next800-182","batch":2,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “or” in horse. Listen, then read the whole sentence.","pattern":"letter group or"}},{"w":"soup","d":["soup","saup","coup","caup"],"pool":["saup","coup","caup","goup","gaup"],"madeUp":["saup"],"sentence":"The warm soup is in a bowl.","expansion":true,"sourceId":"next800-452","batch":2,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “ou” in soup. Listen, then read the whole sentence.","pattern":"letter group ou"}},{"w":"rice","d":["rice","race","dice","dace"],"pool":["race","dice","dace","fice","face"],"madeUp":[],"sentence":"We eat rice with our dinner.","expansion":true,"sourceId":"next800-453","batch":2,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in rice. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"hidden","d":["hidden","hirden","hadden","harden"],"pool":["hirden","hadden","harden","hodden","horden"],"madeUp":["hirden","horden"],"sentence":"The key is hidden in the box.","expansion":true,"sourceId":"next800-572","batch":2,"group":"Actions and word families","teaching":{"tip":"Word family: hide → hidden. Notice how the spelling changes.","family":"hide","pattern":"changed word form"}},{"w":"thirsty","d":["thirsty","trirsty","tharsty","trarsty"],"pool":["trirsty","tharsty","trarsty","thersty","trersty"],"madeUp":["trirsty","tharsty","trarsty","thersty","trersty"],"sentence":"I am thirsty and need some water.","expansion":true,"sourceId":"next800-661","batch":2,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look carefully at “th” in thirsty. Listen, then read the whole sentence.","pattern":"letter group th"}},{"w":"waterfall","d":["waterfall","weterfall","watarfall","wetarfall"],"pool":["weterfall","watarfall","wetarfall","watirfall","wetirfall"],"madeUp":["weterfall","watarfall","wetarfall","watirfall","wetirfall"],"sentence":"Water falls over the rocks in a waterfall.","expansion":true,"sourceId":"next800-727","batch":2,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look carefully at “er” in waterfall. Listen, then read the whole sentence.","pattern":"letter group er"}},{"w":"forty","d":["forty","firty","borty","birty"],"pool":["firty","borty","birty","dorty","dirty"],"madeUp":["firty","birty"],"sentence":"We count forty steps to the gate.","expansion":true,"sourceId":"next800-129","batch":2,"group":"Written numbers and quantity","teaching":{"symbol":"40","tip":"Forty has no u. Compare four, fourteen and forty.","pattern":"tricky spelling or meaning"}},{"w":"perhaps","d":["perhaps","parhaps","perheps","parheps"],"pool":["parhaps","perheps","parheps","perhips","parhips"],"madeUp":["parhaps","perheps","parheps","perhips","parhips"],"sentence":"The cat is perhaps under the bed.","expansion":true,"sourceId":"next800-037","batch":2,"group":"Sentence building and common verbs","teaching":{"tip":"Look carefully at “er” in perhaps. Listen, then read the whole sentence.","pattern":"letter group er"}},{"w":"maybe","d":["maybe","meybe","mayba","meyba"],"pool":["meybe","mayba","meyba","maybi","meybi"],"madeUp":["meybe","mayba","meyba","maybi","meybi"],"sentence":"We can maybe go after lunch.","expansion":true,"sourceId":"next800-038","batch":2,"group":"Sentence building and common verbs","teaching":{"tip":"Look carefully at “ay” in maybe. Listen, then read the whole sentence.","pattern":"letter group ay"}},{"w":"dark","d":["dark","dirk","bark","birk"],"pool":["dirk","bark","birk","cark","cirk"],"madeUp":["cirk"],"sentence":"It is dark outside at night.","expansion":true,"sourceId":"next800-183","batch":2,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ar” in dark. Listen, then read the whole sentence.","pattern":"letter group ar"}},{"w":"morning","d":["morning","murning","borning","burning"],"pool":["murning","borning","burning","corning","curning"],"madeUp":["murning","curning"],"sentence":"We eat breakfast in the morning.","expansion":true,"sourceId":"next800-184","batch":2,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ng” in morning. Listen, then read the whole sentence.","pattern":"letter group ng"}},{"w":"potato","d":["potato","patato","potabo","patabo"],"pool":["patato","potabo","patabo","potaco","pataco"],"madeUp":["patato","potabo","patabo","potaco"],"sentence":"We cook a potato for lunch.","expansion":true,"sourceId":"next800-454","batch":2,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in potato. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"tomato","d":["tomato","tamato","tometo","tameto"],"pool":["tamato","tometo","tameto","tomito","tamito"],"madeUp":["tamato","tometo","tameto","tomito","tamito"],"sentence":"The tomato is red and round.","expansion":true,"sourceId":"next800-455","batch":2,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in tomato. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"coming","d":["coming","caming","boming","baming"],"pool":["caming","boming","baming","goming","gaming"],"madeUp":["caming","boming","baming","goming"],"sentence":"My friend is coming to play.","expansion":true,"sourceId":"next800-573","batch":2,"group":"Actions and word families","teaching":{"tip":"Word family: come → coming. Read the whole word, including its ending.","family":"come","pattern":"word ending"}},{"w":"ill","d":["ill","ibl","all","abl"],"pool":["ibl","all","abl","ell","ebl"],"madeUp":["ibl","abl","ebl"],"sentence":"I stay in bed when I am ill.","expansion":true,"sourceId":"next800-662","batch":2,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look at every letter in ill. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"wave","d":["wave","wive","cave","cive"],"pool":["wive","cave","cive","dave","dive"],"madeUp":[],"sentence":"A wave rolls onto the beach.","expansion":true,"sourceId":"next800-728","batch":2,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look at every letter in wave. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"fifty","d":["fifty","fefty","bifty","befty"],"pool":["fefty","bifty","befty","hifty","hefty"],"madeUp":["fefty","bifty","befty","hifty"],"sentence":"There are fifty pages in the book.","expansion":true,"sourceId":"next800-130","batch":2,"group":"Written numbers and quantity","teaching":{"symbol":"50","tip":"Compare five, fifteen and fifty.","pattern":"tricky spelling or meaning"}},{"w":"together","d":["together","tagether","togather","tagather"],"pool":["tagether","togather","tagather","togither","tagither"],"madeUp":["tagether","togather","tagather","togither","tagither"],"sentence":"We can build a house together.","expansion":true,"sourceId":"next800-039","batch":2,"group":"Sentence building and common verbs","teaching":{"tip":"Look carefully at “th” in together. Listen, then read the whole sentence.","pattern":"letter group th"}},{"w":"through","d":["through","thraugh","throubh","thraubh"],"pool":["thraugh","throubh","thraubh","throuch","thrauch"],"madeUp":["thraugh","throubh","thraubh","thrauch"],"sentence":"We walk through the open gate.","expansion":true,"sourceId":"next800-041","batch":2,"group":"Sentence building and common verbs","teaching":{"tip":"Look carefully at “th” in through. Listen, then read the whole sentence.","pattern":"letter group th"}},{"w":"farm","d":["farm","ferm","barm","berm"],"pool":["ferm","barm","berm","darm","derm"],"madeUp":["ferm","darm"],"sentence":"The sheep live on a farm.","expansion":true,"sourceId":"next800-185","batch":2,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ar” in farm. Listen, then read the whole sentence.","pattern":"letter group ar"}},{"w":"egg","d":["egg","ebg","egb","ebb"],"pool":["ebg","egb","ebb","egc","ebc"],"madeUp":["ebg","egb","egc","ebc"],"sentence":"A chick comes out of an egg.","expansion":true,"sourceId":"next800-186","batch":2,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in egg. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"carrot","d":["carrot","cerrot","barrot","berrot"],"pool":["cerrot","barrot","berrot","garrot","gerrot"],"madeUp":["cerrot","barrot","berrot","gerrot"],"sentence":"The rabbit eats a carrot.","expansion":true,"sourceId":"next800-456","batch":2,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “ar” in carrot. Listen, then read the whole sentence.","pattern":"letter group ar"}},{"w":"bean","d":["bean","bian","been","bien"],"pool":["bian","been","bien","beon","bion"],"madeUp":["bian","beon"],"sentence":"A bean can grow into a plant.","expansion":true,"sourceId":"next800-457","batch":2,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “ea” in bean. Listen, then read the whole sentence.","pattern":"letter group ea"}},{"w":"running","d":["running","ranning","bunning","banning"],"pool":["ranning","bunning","banning","cunning","canning"],"madeUp":["ranning","bunning"],"sentence":"The dog is running across the field.","expansion":true,"sourceId":"next800-574","batch":2,"group":"Actions and word families","teaching":{"tip":"Word family: run → running. Read the whole word, including its ending.","family":"run","pattern":"word ending"}},{"w":"sick","d":["sick","sack","bick","back"],"pool":["sack","bick","back","cick","cack"],"madeUp":["cick"],"sentence":"The doctor helps the sick child.","expansion":true,"sourceId":"next800-663","batch":2,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look at every letter in sick. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"island","d":["island","islend","asland","aslend"],"pool":["islend","asland","aslend","esland","eslend"],"madeUp":["islend","asland","aslend","esland","eslend"],"sentence":"Water is all around the island.","expansion":true,"sourceId":"next800-729","batch":2,"group":"Nature, places, adventure and reading","teaching":{"symbol":null,"tip":"The s is silent.","pattern":"tricky spelling or meaning"}},{"w":"sixty","d":["sixty","soxty","bixty","boxty"],"pool":["soxty","bixty","boxty","cixty","coxty"],"madeUp":["soxty","bixty","cixty","coxty"],"sentence":"There are sixty seconds in a minute.","expansion":true,"sourceId":"next800-131","batch":2,"group":"Written numbers and quantity","teaching":{"symbol":"60","number":60,"tip":"sixty is 60. Read the word, then say the number.","pattern":"number word"}},{"w":"between","d":["between","batween","betwaen","batwaen"],"pool":["batween","betwaen","batwaen","betwien","batwien"],"madeUp":["batween","betwaen","batwaen","betwien","batwien"],"sentence":"The ball is between my feet.","expansion":true,"sourceId":"next800-042","batch":2,"group":"Sentence building and common verbs","teaching":{"tip":"Look carefully at “ee” in between. Listen, then read the whole sentence.","pattern":"letter group ee"}},{"w":"below","d":["below","balow","belaw","balaw"],"pool":["balow","belaw","balaw","belew","balew"],"madeUp":["belaw","balaw","belew","balew"],"sentence":"The fish swims below the boat.","expansion":true,"sourceId":"next800-043","batch":2,"group":"Sentence building and common verbs","teaching":{"tip":"Look carefully at “ow” in below. Listen, then read the whole sentence.","pattern":"letter group ow"}},{"w":"ground","d":["ground","greund","groand","greand"],"pool":["greund","groand","greand","groend","greend"],"madeUp":["groand","greand","groend","greend"],"sentence":"The ball falls to the ground.","expansion":true,"sourceId":"next800-187","batch":2,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ou” in ground. Listen, then read the whole sentence.","pattern":"letter group ou"}},{"w":"field","d":["field","faeld","bield","baeld"],"pool":["faeld","bield","baeld","hield","haeld"],"madeUp":["faeld","baeld","haeld"],"sentence":"The cows eat grass in the field.","expansion":true,"sourceId":"next800-188","batch":2,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in field. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"banana","d":["banana","benana","banaba","benaba"],"pool":["benana","banaba","benaba","banaca","benaca"],"madeUp":["benana","benaba","banaca","benaca"],"sentence":"I peel a yellow banana.","expansion":true,"sourceId":"next800-458","batch":2,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in banana. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"orange","d":["orange","orenge","arange","arenge"],"pool":["orenge","arange","arenge","erange","erenge"],"madeUp":["orenge","arange","arenge","erange","erenge"],"sentence":"The orange has a thick peel.","expansion":true,"sourceId":"next800-459","batch":2,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “ng” in orange. Listen, then read the whole sentence.","pattern":"letter group ng"}},{"w":"walked","d":["walked","walled","balked","balled"],"pool":["walled","balked","balled","calked","called"],"madeUp":["walled","balked","calked"],"sentence":"We walked home together.","expansion":true,"sourceId":"next800-575","batch":2,"group":"Actions and word families","teaching":{"tip":"Word family: walk → walked. Read the whole word, including its ending.","family":"walk","pattern":"word ending"}},{"w":"shy","d":["shy","sky","sha","ska"],"pool":["sky","sha","ska","she","ske"],"madeUp":["sha","ska","ske"],"sentence":"The shy child smiles at a new friend.","expansion":true,"sourceId":"next800-664","batch":2,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look carefully at “sh” in shy. Listen, then read the whole sentence.","pattern":"letter group sh"}},{"w":"dirt","d":["dirt","dart","dird","dard"],"pool":["dart","dird","dard","dirg","darg"],"madeUp":["dirg"],"sentence":"We wash the dirt off our hands.","expansion":true,"sourceId":"next800-730","batch":2,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look carefully at “ir” in dirt. Listen, then read the whole sentence.","pattern":"letter group ir"}},{"w":"seventy","d":["seventy","saventy","sevanty","savanty"],"pool":["saventy","sevanty","savanty","sevinty","savinty"],"madeUp":["saventy","sevanty","savanty","sevinty","savinty"],"sentence":"The bus has seventy seats.","expansion":true,"sourceId":"next800-132","batch":2,"group":"Written numbers and quantity","teaching":{"symbol":"70","number":70,"tip":"seventy is 70. Read the word, then say the number.","pattern":"number word"}},{"w":"above","d":["above","agove","abave","agave"],"pool":["agove","abave","agave","abeve","ageve"],"madeUp":["agove","abeve","ageve"],"sentence":"A bird flies above the tree.","expansion":true,"sourceId":"next800-044","batch":2,"group":"Sentence building and common verbs","teaching":{"tip":"Look at every letter in above. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"across","d":["across","accoss","acrass","accass"],"pool":["accoss","acrass","accass","acress","access"],"madeUp":["accoss","acrass","accass","acress"],"sentence":"We walk across the bridge.","expansion":true,"sourceId":"next800-045","batch":2,"group":"Sentence building and common verbs","teaching":{"tip":"Look at every letter in across. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"road","d":["road","read","roed","reed"],"pool":["read","roed","reed","roid","reid"],"madeUp":[],"sentence":"We look both ways before crossing the road.","expansion":true,"sourceId":"next800-189","batch":2,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “oa” in road. Listen, then read the whole sentence.","pattern":"letter group oa"}},{"w":"sky","d":["sky","shy","ska","sha"],"pool":["shy","ska","sha","ske","she"],"madeUp":["ska","sha","ske"],"sentence":"Birds fly high in the sky.","expansion":true,"sourceId":"next800-191","batch":2,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in sky. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"lemon","d":["lemon","limon","leman","liman"],"pool":["limon","leman","liman","lemen","limen"],"madeUp":["limon","lemen"],"sentence":"The yellow lemon tastes sour.","expansion":true,"sourceId":"next800-460","batch":2,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in lemon. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"pear","d":["pear","peer","dear","deer"],"pool":["peer","dear","deer","fear","feer"],"madeUp":[],"sentence":"I eat a soft, sweet pear.","expansion":true,"sourceId":"next800-461","batch":2,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “ar” in pear. Listen, then read the whole sentence.","pattern":"letter group ar"}},{"w":"walking","d":["walking","wacking","balking","backing"],"pool":["wacking","balking","backing","calking","cacking"],"madeUp":["wacking","balking","cacking"],"sentence":"We are walking to school.","expansion":true,"sourceId":"next800-576","batch":2,"group":"Actions and word families","teaching":{"tip":"Word family: walk → walking. Read the whole word, including its ending.","family":"walk","pattern":"word ending"}},{"w":"proud","d":["proud","praud","droud","draud"],"pool":["praud","droud","draud","froud","fraud"],"madeUp":["praud","draud","froud"],"sentence":"I feel proud of the book I read.","expansion":true,"sourceId":"next800-665","batch":2,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look carefully at “ou” in proud. Listen, then read the whole sentence.","pattern":"letter group ou"}},{"w":"leaves","d":["leaves","laaves","leaveb","laaveb"],"pool":["laaves","leaveb","laaveb","leaved","laaved"],"madeUp":["laaves","leaveb","laaveb","laaved"],"sentence":"Green leaves grow on the tree.","expansion":true,"sourceId":"next800-731","batch":2,"group":"Nature, places, adventure and reading","teaching":{"tip":"Word family: leaf → leaves. Notice how the spelling changes.","family":"leaf","pattern":"changed word form"}},{"w":"eighty","d":["eighty","eaghty","aighty","aaghty"],"pool":["eaghty","aighty","aaghty","iighty","iaghty"],"madeUp":["eaghty","aighty","aaghty","iighty","iaghty"],"sentence":"The farmer has eighty sheep.","expansion":true,"sourceId":"next800-133","batch":2,"group":"Written numbers and quantity","teaching":{"symbol":"80","tip":"Compare eight, eighteen and eighty.","pattern":"tricky spelling or meaning"}},{"w":"along","d":["along","agong","alang","agang"],"pool":["agong","alang","agang","aling","aging"],"madeUp":["agong","alang","agang","aling"],"sentence":"The dog runs along the path.","expansion":true,"sourceId":"next800-046","batch":3,"group":"Sentence building and common verbs","teaching":{"tip":"Look carefully at “ng” in along. Listen, then read the whole sentence.","pattern":"letter group ng"}},{"w":"behind","d":["behind","bebind","cehind","cebind"],"pool":["bebind","cehind","cebind","dehind","debind"],"madeUp":["bebind","cehind","cebind","dehind"],"sentence":"The boy hides behind the tree.","expansion":true,"sourceId":"next800-047","batch":3,"group":"Sentence building and common verbs","teaching":{"tip":"Look at every letter in behind. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"boat","d":["boat","bout","doat","dout"],"pool":["bout","doat","dout","goat","gout"],"madeUp":[],"sentence":"The boat floats on the lake.","expansion":true,"sourceId":"next800-192","batch":3,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “oa” in boat. Listen, then read the whole sentence.","pattern":"letter group oa"}},{"w":"village","d":["village","vallage","billage","ballage"],"pool":["vallage","billage","ballage","fillage","fallage"],"madeUp":["vallage","billage","ballage","fillage"],"sentence":"The village has a few houses and a shop.","expansion":true,"sourceId":"next800-193","batch":3,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in village. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"chocolate","d":["chocolate","chacolate","chocalate","chacalate"],"pool":["chacolate","chocalate","chacalate","chocelate","chacelate"],"madeUp":["chacolate","chocalate","chacalate","chocelate","chacelate"],"sentence":"The cake has chocolate on top.","expansion":true,"sourceId":"next800-462","batch":3,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “ch” in chocolate. Listen, then read the whole sentence.","pattern":"letter group ch"}},{"w":"biscuit","d":["biscuit","bascuit","biscait","bascait"],"pool":["bascuit","biscait","bascait","bisceit","basceit"],"madeUp":["bascuit","biscait","bascait","bisceit","basceit"],"sentence":"May I have a biscuit with my milk?","expansion":true,"sourceId":"next800-463","batch":3,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in biscuit. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"jumping","d":["jumping","jamping","bumping","bamping"],"pool":["jamping","bumping","bamping","dumping","damping"],"madeUp":["jamping","bamping"],"sentence":"The frog is jumping over a stone.","expansion":true,"sourceId":"next800-577","batch":3,"group":"Actions and word families","teaching":{"tip":"Word family: jump → jumping. Read the whole word, including its ending.","family":"jump","pattern":"word ending"}},{"w":"silly","d":["silly","sally","billy","bally"],"pool":["sally","billy","bally","dilly","dally"],"madeUp":[],"sentence":"The clown makes a silly face.","expansion":true,"sourceId":"next800-666","batch":3,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look at every letter in silly. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"root","d":["root","riot","boot","biot"],"pool":["riot","boot","biot","foot","fiot"],"madeUp":["biot"],"sentence":"The root takes water from the soil.","expansion":true,"sourceId":"next800-732","batch":3,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look carefully at “oo” in root. Listen, then read the whole sentence.","pattern":"letter group oo"}},{"w":"ninety","d":["ninety","nanety","nibety","nabety"],"pool":["nanety","nibety","nabety","nicety","nacety"],"madeUp":["nanety","nibety","nabety","nacety"],"sentence":"The puzzle has ninety pieces.","expansion":true,"sourceId":"next800-134","batch":3,"group":"Written numbers and quantity","teaching":{"symbol":"90","number":90,"tip":"ninety is 90. Read the word, then say the number.","pattern":"number word"}},{"w":"beside","d":["beside","becide","ceside","cecide"],"pool":["becide","ceside","cecide","deside","decide"],"madeUp":["becide","ceside","cecide","deside"],"sentence":"Come and sit beside me.","expansion":true,"sourceId":"next800-048","batch":3,"group":"Sentence building and common verbs","teaching":{"tip":"Look at every letter in beside. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"inside","d":["inside","incide","anside","ancide"],"pool":["incide","anside","ancide","onside","oncide"],"madeUp":["anside","ancide","oncide"],"sentence":"The toy is inside the box.","expansion":true,"sourceId":"next800-049","batch":3,"group":"Sentence building and common verbs","teaching":{"tip":"Look at every letter in inside. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"snow","d":["snow","scow","snob","scob"],"pool":["scow","snob","scob","snog","scog"],"madeUp":[],"sentence":"White snow covers the ground.","expansion":true,"sourceId":"next800-194","batch":3,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ow” in snow. Listen, then read the whole sentence.","pattern":"letter group ow"}},{"w":"hill","d":["hill","hall","bill","ball"],"pool":["hall","bill","ball","fill","fall"],"madeUp":[],"sentence":"We walk up the little hill.","expansion":true,"sourceId":"next800-195","batch":3,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in hill. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"cookie","d":["cookie","caokie","bookie","baokie"],"pool":["caokie","bookie","baokie","dookie","daokie"],"madeUp":["caokie","baokie","dookie","daokie"],"sentence":"I put a cookie on my plate.","expansion":true,"sourceId":"next800-464","batch":3,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “oo” in cookie. Listen, then read the whole sentence.","pattern":"letter group oo"}},{"w":"sweet","d":["sweet","sceet","sweat","sceat"],"pool":["sceet","sweat","sceat","sweit","sceit"],"madeUp":["sceet","sweit","sceit"],"sentence":"The honey tastes sweet.","expansion":true,"sourceId":"next800-465","batch":3,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “ee” in sweet. Listen, then read the whole sentence.","pattern":"letter group ee"}},{"w":"hop","d":["hop","hap","bop","bap"],"pool":["hap","bop","bap","cop","cap"],"madeUp":[],"sentence":"A rabbit can hop.","expansion":true,"sourceId":"next800-578","batch":3,"group":"Actions and word families","teaching":{"tip":"Look at every letter in hop. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"friendly","d":["friendly","fraendly","friandly","fraandly"],"pool":["fraendly","friandly","fraandly","friindly","fraindly"],"madeUp":["fraendly","friandly","fraandly","friindly","fraindly"],"sentence":"The friendly dog wags its tail.","expansion":true,"sourceId":"next800-667","batch":3,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Word family: friend → friendly. Read the whole word, including its ending.","family":"friend","pattern":"word ending"}},{"w":"trunk","d":["trunk","trank","crunk","crank"],"pool":["trank","crunk","crank","drunk","drank"],"madeUp":[],"sentence":"The tree has a thick trunk.","expansion":true,"sourceId":"next800-733","batch":3,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look at every letter in trunk. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"hundred","d":["hundred","handred","hundrad","handrad"],"pool":["handred","hundrad","handrad","hundrid","handrid"],"madeUp":["handred","hundrad","handrad","hundrid","handrid"],"sentence":"There are one hundred beads in the jar.","expansion":true,"sourceId":"next800-135","batch":3,"group":"Written numbers and quantity","teaching":{"symbol":"100","number":100,"tip":"hundred is 100. Read the word, then say the number.","pattern":"number word"}},{"w":"outside","d":["outside","oatside","autside","aatside"],"pool":["oatside","autside","aatside","eutside","eatside"],"madeUp":["oatside","autside","aatside","eutside","eatside"],"sentence":"The children play outside the house.","expansion":true,"sourceId":"next800-050","batch":3,"group":"Sentence building and common verbs","teaching":{"tip":"Look carefully at “ou” in outside. Listen, then read the whole sentence.","pattern":"letter group ou"}},{"w":"without","d":["without","wathout","withaut","wathaut"],"pool":["wathout","withaut","wathaut","witheut","watheut"],"madeUp":["wathout","withaut","wathaut","witheut","watheut"],"sentence":"I cannot see without my glasses.","expansion":true,"sourceId":"next800-051","batch":3,"group":"Sentence building and common verbs","teaching":{"tip":"Look carefully at “th” in without. Listen, then read the whole sentence.","pattern":"letter group th"}},{"w":"boy","d":["boy","bay","coy","cay"],"pool":["bay","coy","cay","foy","fay"],"madeUp":[],"sentence":"The boy is reading a book.","expansion":true,"sourceId":"next800-196","batch":3,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in boy. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"lake","d":["lake","like","bake","bike"],"pool":["like","bake","bike","fake","fike"],"madeUp":[],"sentence":"The lake is full of clear water.","expansion":true,"sourceId":"next800-197","batch":3,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in lake. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"honey","d":["honey","haney","boney","baney"],"pool":["haney","boney","baney","doney","daney"],"madeUp":["haney","baney","daney"],"sentence":"Bees make honey.","expansion":true,"sourceId":"next800-466","batch":3,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in honey. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"salt","d":["salt","selt","balt","belt"],"pool":["selt","balt","belt","galt","gelt"],"madeUp":[],"sentence":"We put a little salt in the soup.","expansion":true,"sourceId":"next800-467","batch":3,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in salt. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"skip","d":["skip","ship","skap","shap"],"pool":["ship","skap","shap","skep","shep"],"madeUp":["skap","shep"],"sentence":"I can skip along the path.","expansion":true,"sourceId":"next800-579","batch":3,"group":"Actions and word families","teaching":{"tip":"Look at every letter in skip. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"gentle","d":["gentle","gantle","centle","cantle"],"pool":["gantle","centle","cantle","hentle","hantle"],"madeUp":["gantle","centle","hentle"],"sentence":"Be gentle when you hold the kitten.","expansion":true,"sourceId":"next800-668","batch":3,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look at every letter in gentle. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"bark","d":["bark","back","cark","cack"],"pool":["back","cark","cack","hark","hack"],"madeUp":[],"sentence":"The bark covers the tree's trunk.","expansion":true,"sourceId":"next800-734","batch":3,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look carefully at “ar” in bark. Listen, then read the whole sentence.","pattern":"letter group ar"}},{"w":"thousand","d":["thousand","thausand","thoasand","thaasand"],"pool":["thausand","thoasand","thaasand","thoesand","thaesand"],"madeUp":["thausand","thoasand","thaasand","thoesand","thaesand"],"sentence":"The big puzzle has one thousand pieces.","expansion":true,"sourceId":"next800-136","batch":3,"group":"Written numbers and quantity","teaching":{"symbol":"1000","number":1000,"tip":"thousand is 1000. Read the word, then say the number.","pattern":"number word"}},{"w":"until","d":["until","undil","untid","undid"],"pool":["undil","untid","undid","untig","undig"],"madeUp":["undil","untid","untig"],"sentence":"We wait until the rain stops.","expansion":true,"sourceId":"next800-052","batch":3,"group":"Sentence building and common verbs","teaching":{"tip":"Look at every letter in until. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"while","d":["while","whise","whale","whase"],"pool":["whise","whale","whase","whole","whose"],"madeUp":["whise"],"sentence":"I read while the baby sleeps.","expansion":true,"sourceId":"next800-053","batch":3,"group":"Sentence building and common verbs","teaching":{"tip":"Look at every letter in while. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"set","d":["set","sat","bet","bat"],"pool":["sat","bet","bat","get","gat"],"madeUp":[],"sentence":"Please set the cup on the table.","expansion":true,"sourceId":"next800-198","batch":3,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in set. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"stone","d":["stone","scone","stane","scane"],"pool":["scone","stane","scane","stene","scene"],"madeUp":["scane","stene"],"sentence":"I found a smooth stone on the beach.","expansion":true,"sourceId":"next800-199","batch":3,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in stone. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"juice","d":["juice","jeice","buice","beice"],"pool":["jeice","buice","beice","duice","deice"],"madeUp":["jeice","buice","duice"],"sentence":"I drink orange juice.","expansion":true,"sourceId":"next800-468","batch":3,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in juice. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"cup","d":["cup","cap","dup","dap"],"pool":["cap","dup","dap","gup","gap"],"madeUp":[],"sentence":"My cup is full of milk.","expansion":true,"sourceId":"next800-469","batch":3,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in cup. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"climb","d":["climb","chimb","clamb","chamb"],"pool":["chimb","clamb","chamb","clomb","chomb"],"madeUp":["chimb","chamb","chomb"],"sentence":"The cat can climb the tree.","expansion":true,"sourceId":"next800-580","batch":3,"group":"Actions and word families","teaching":{"tip":"Look at every letter in climb. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"careful","d":["careful","cireful","bareful","bireful"],"pool":["cireful","bareful","bireful","dareful","direful"],"madeUp":["cireful","bareful","bireful"],"sentence":"Be careful with the full cup.","expansion":true,"sourceId":"next800-669","batch":3,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Word family: care → careful. Read the whole word, including its ending.","family":"care","pattern":"word ending"}},{"w":"seed","d":["seed","saed","sead","saad"],"pool":["saed","sead","saad","seid","said"],"madeUp":["saed","sead"],"sentence":"We plant a seed in the ground.","expansion":true,"sourceId":"next800-735","batch":3,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look carefully at “ee” in seed. Listen, then read the whole sentence.","pattern":"letter group ee"}},{"w":"second","d":["second","sacond","secand","sacand"],"pool":["sacond","secand","sacand","secund","sacund"],"madeUp":["sacond","secand","sacand","sacund"],"sentence":"I came second in the race.","expansion":true,"sourceId":"next800-137","batch":3,"group":"Written numbers and quantity","teaching":{"symbol":"2nd","tip":"second tells us position 2 in an order.","number":2,"pattern":"ordinal"}},{"w":"during","d":["during","daring","buring","baring"],"pool":["daring","buring","baring","curing","caring"],"madeUp":["buring","caring"],"sentence":"The sun came out during our walk.","expansion":true,"sourceId":"next800-054","batch":3,"group":"Sentence building and common verbs","teaching":{"tip":"Look carefully at “ng” in during. Listen, then read the whole sentence.","pattern":"letter group ng"}},{"w":"against","d":["against","ageinst","egainst","egeinst"],"pool":["ageinst","egainst","egeinst","igainst","igeinst"],"madeUp":["ageinst","egainst","egeinst","igainst","igeinst"],"sentence":"The bike rests against the wall.","expansion":true,"sourceId":"next800-055","batch":3,"group":"Sentence building and common verbs","teaching":{"tip":"Look carefully at “ai” in against. Listen, then read the whole sentence.","pattern":"letter group ai"}},{"w":"men","d":["men","man","ben","ban"],"pool":["man","ben","ban","den","dan"],"madeUp":[],"sentence":"Two men carry the heavy box.","expansion":true,"sourceId":"next800-200","batch":3,"group":"Everyday story essentials","teaching":{"tip":"Word family: man → men. Notice how the spelling changes.","family":"man","pattern":"changed word form"}},{"w":"hand","d":["hand","hend","band","bend"],"pool":["hend","band","bend","fand","fend"],"madeUp":[],"sentence":"Hold my hand as we cross the road.","expansion":true,"sourceId":"next800-201","batch":3,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in hand. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"plate","d":["plate","plote","place","ploce"],"pool":["plote","place","ploce","plage","ploge"],"madeUp":["ploge"],"sentence":"The sandwich is on my plate.","expansion":true,"sourceId":"next800-470","batch":3,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in plate. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"bowl","d":["bowl","boll","cowl","coll"],"pool":["boll","cowl","coll","dowl","doll"],"madeUp":[],"sentence":"I eat soup from a bowl.","expansion":true,"sourceId":"next800-471","batch":3,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “ow” in bowl. Listen, then read the whole sentence.","pattern":"letter group ow"}},{"w":"stopped","d":["stopped","stepped","stoppad","steppad"],"pool":["stepped","stoppad","steppad","stoppid","steppid"],"madeUp":["stoppad","steppad","stoppid","steppid"],"sentence":"The bus stopped at the gate.","expansion":true,"sourceId":"next800-581","batch":3,"group":"Actions and word families","teaching":{"tip":"Word family: stop → stopped. Read the whole word, including its ending.","family":"stop","pattern":"word ending"}},{"w":"lovely","d":["lovely","lonely","lavely","lanely"],"pool":["lonely","lavely","lanely","lively","linely"],"madeUp":["lavely","lanely","linely"],"sentence":"We had a lovely day together.","expansion":true,"sourceId":"next800-670","batch":3,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look at every letter in lovely. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"bush","d":["bush","bash","cush","cash"],"pool":["bash","cush","cash","dush","dash"],"madeUp":[],"sentence":"The bird hides in the bush.","expansion":true,"sourceId":"next800-736","batch":3,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look carefully at “sh” in bush. Listen, then read the whole sentence.","pattern":"letter group sh"}},{"w":"third","d":["third","thind","thirb","thinb"],"pool":["thind","thirb","thinb","thirg","thing"],"madeUp":["thind","thirb","thinb","thirg"],"sentence":"Open the book at the third page.","expansion":true,"sourceId":"next800-138","batch":3,"group":"Written numbers and quantity","teaching":{"symbol":"3rd","tip":"third tells us position 3 in an order.","number":3,"pattern":"ordinal"}},{"w":"towards","d":["towards","tawards","towerds","tawerds"],"pool":["tawards","towerds","tawerds","towirds","tawirds"],"madeUp":["tawards","towerds","tawerds","towirds","tawirds"],"sentence":"The puppy runs towards me.","expansion":true,"sourceId":"next800-056","batch":3,"group":"Sentence building and common verbs","teaching":{"tip":"Look carefully at “ow” in towards. Listen, then read the whole sentence.","pattern":"letter group ow"}},{"w":"let","d":["let","lat","bet","bat"],"pool":["lat","bet","bat","get","gat"],"madeUp":[],"sentence":"Please let me have a turn.","expansion":true,"sourceId":"next800-065","batch":3,"group":"Sentence building and common verbs","teaching":{"tip":"Look at every letter in let. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"mother","d":["mother","mather","bother","bather"],"pool":["mather","bother","bather","fother","father"],"madeUp":["mather"],"sentence":"My mother reads with me.","expansion":true,"sourceId":"next800-202","batch":3,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “th” in mother. Listen, then read the whole sentence.","pattern":"letter group th"}},{"w":"father","d":["father","fatter","bather","batter"],"pool":["fatter","bather","batter","gather","gatter"],"madeUp":[],"sentence":"My father helps me ride my bike.","expansion":true,"sourceId":"next800-203","batch":3,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “th” in father. Listen, then read the whole sentence.","pattern":"letter group th"}},{"w":"spoon","d":["spoon","scoon","spaon","scaon"],"pool":["scoon","spaon","scaon","spion","scion"],"madeUp":["spaon","scaon","spion"],"sentence":"I use a spoon to eat soup.","expansion":true,"sourceId":"next800-472","batch":3,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “oo” in spoon. Listen, then read the whole sentence.","pattern":"letter group oo"}},{"w":"fork","d":["fork","fark","bork","bark"],"pool":["fark","bork","bark","cork","cark"],"madeUp":["fark","bork"],"sentence":"I pick up food with my fork.","expansion":true,"sourceId":"next800-473","batch":3,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “or” in fork. Listen, then read the whole sentence.","pattern":"letter group or"}},{"w":"sitting","d":["sitting","setting","bitting","betting"],"pool":["setting","bitting","betting","fitting","fetting"],"madeUp":["bitting","fetting"],"sentence":"The girl is sitting on a chair.","expansion":true,"sourceId":"next800-582","batch":3,"group":"Actions and word families","teaching":{"tip":"Word family: sit → sitting. Read the whole word, including its ending.","family":"sit","pattern":"word ending"}},{"w":"dirty","d":["dirty","dorty","birty","borty"],"pool":["dorty","birty","borty","firty","forty"],"madeUp":["birty","firty"],"sentence":"My boots are dirty after our walk.","expansion":true,"sourceId":"next800-671","batch":3,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look carefully at “ir” in dirty. Listen, then read the whole sentence.","pattern":"letter group ir"}},{"w":"woods","d":["woods","waods","boods","baods"],"pool":["waods","boods","baods","goods","gaods"],"madeUp":["waods","boods","baods","gaods"],"sentence":"We walk among the trees in the woods.","expansion":true,"sourceId":"next800-737","batch":3,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look carefully at “oo” in woods. Listen, then read the whole sentence.","pattern":"letter group oo"}},{"w":"fourth","d":["fourth","faurth","foarth","faarth"],"pool":["faurth","foarth","faarth","foerth","faerth"],"madeUp":["faurth","foarth","faarth","foerth","faerth"],"sentence":"The fourth duck is the smallest.","expansion":true,"sourceId":"next800-139","batch":3,"group":"Written numbers and quantity","teaching":{"symbol":"4th","tip":"fourth tells us position 4 in an order.","number":4,"pattern":"ordinal"}},{"w":"done","d":["done","dane","bone","bane"],"pool":["dane","bone","bane","cone","cane"],"madeUp":[],"sentence":"I have done all my work.","expansion":true,"sourceId":"next800-066","batch":3,"group":"Sentence building and common verbs","teaching":{"tip":"Word family: do → done. Notice how the spelling changes.","family":"do","pattern":"changed word form"}},{"w":"ran","d":["ran","ron","ban","bon"],"pool":["ron","ban","bon","can","con"],"madeUp":[],"sentence":"The rabbit ran into its hole.","expansion":true,"sourceId":"next800-067","batch":3,"group":"Sentence building and common verbs","teaching":{"tip":"Word family: run → ran. Notice how the spelling changes.","family":"run","pattern":"changed word form"}},{"w":"feet","d":["feet","feat","beet","beat"],"pool":["feat","beet","beat","geet","geat"],"madeUp":[],"sentence":"I put shoes on my feet.","expansion":true,"sourceId":"next800-204","batch":3,"group":"Everyday story essentials","teaching":{"tip":"Word family: foot → feet. Notice how the spelling changes.","family":"foot","pattern":"changed word form"}},{"w":"girl","d":["girl","gurl","birl","burl"],"pool":["gurl","birl","burl","cirl","curl"],"madeUp":["cirl"],"sentence":"The girl kicks the ball.","expansion":true,"sourceId":"next800-205","batch":3,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ir” in girl. Listen, then read the whole sentence.","pattern":"letter group ir"}},{"w":"knife","d":["knife","knafe","knifa","knafa"],"pool":["knafe","knifa","knafa","knifi","knafi"],"madeUp":["knafe","knifa","knafa","knifi","knafi"],"sentence":"An adult uses a knife to cut the bread.","expansion":true,"sourceId":"next800-474","batch":3,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in knife. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"bottle","d":["bottle","battle","cottle","cattle"],"pool":["battle","cottle","cattle","dottle","dattle"],"madeUp":["cottle","dattle"],"sentence":"My bottle is full of water.","expansion":true,"sourceId":"next800-475","batch":3,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in bottle. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"lie","d":["lie","lee","fie","fee"],"pool":["lee","fie","fee","gie","gee"],"madeUp":[],"sentence":"I lie down on the soft grass.","expansion":true,"sourceId":"next800-583","batch":3,"group":"Actions and word families","teaching":{"tip":"Look at every letter in lie. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"messy","d":["messy","mossy","bessy","bossy"],"pool":["mossy","bessy","bossy","gessy","gossy"],"madeUp":["gessy"],"sentence":"The toys make my room messy.","expansion":true,"sourceId":"next800-672","batch":3,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look at every letter in messy. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"city","d":["city","caty","cita","cata"],"pool":["caty","cita","cata","cite","cate"],"madeUp":["caty","cita","cata"],"sentence":"The city has many buildings and streets.","expansion":true,"sourceId":"next800-738","batch":3,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look at every letter in city. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"fifth","d":["fifth","fafth","bifth","bafth"],"pool":["fafth","bifth","bafth","cifth","cafth"],"madeUp":["fafth","bifth","bafth","cifth","cafth"],"sentence":"The fifth candle is blue.","expansion":true,"sourceId":"next800-140","batch":3,"group":"Written numbers and quantity","teaching":{"symbol":"5th","tip":"fifth tells us position 5 in an order.","number":5,"pattern":"ordinal"}},{"w":"fly","d":["fly","fry","bly","bry"],"pool":["fry","bly","bry","cly","cry"],"madeUp":["bly","bry"],"sentence":"A bird can fly over the tree.","expansion":true,"sourceId":"next800-071","batch":3,"group":"Sentence building and common verbs","teaching":{"tip":"Look at every letter in fly. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"sing","d":["sing","sang","bing","bang"],"pool":["sang","bing","bang","ding","dang"],"madeUp":[],"sentence":"We sing a song together.","expansion":true,"sourceId":"next800-072","batch":3,"group":"Sentence building and common verbs","teaching":{"tip":"Look carefully at “ng” in sing. Listen, then read the whole sentence.","pattern":"letter group ng"}},{"w":"dog","d":["dog","dag","bog","bag"],"pool":["dag","bog","bag","cog","cag"],"madeUp":[],"sentence":"The dog wags its tail.","expansion":true,"sourceId":"next800-206","batch":3,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in dog. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"milk","d":["milk","mulk","bilk","bulk"],"pool":["mulk","bilk","bulk","filk","fulk"],"madeUp":["filk"],"sentence":"We pour milk into the cup.","expansion":true,"sourceId":"next800-207","batch":3,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in milk. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"kitchen","d":["kitchen","kutchen","kitchan","kutchan"],"pool":["kutchen","kitchan","kutchan","kitchin","kutchin"],"madeUp":["kutchen","kitchan","kutchan","kitchin"],"sentence":"We cook food in the kitchen.","expansion":true,"sourceId":"next800-476","batch":3,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “ch” in kitchen. Listen, then read the whole sentence.","pattern":"letter group ch"}},{"w":"bedroom","d":["bedroom","badroom","bebroom","babroom"],"pool":["badroom","bebroom","babroom","begroom","bagroom"],"madeUp":["badroom","bebroom","babroom","begroom"],"sentence":"My bed is in my bedroom.","expansion":true,"sourceId":"next800-477","batch":3,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “oo” in bedroom. Listen, then read the whole sentence.","pattern":"letter group oo"}},{"w":"lay","d":["lay","ley","bay","bey"],"pool":["ley","bay","bey","day","dey"],"madeUp":[],"sentence":"The dog lay down beside me.","expansion":true,"sourceId":"next800-584","batch":3,"group":"Actions and word families","teaching":{"tip":"Word family: lie → lay. Notice how the spelling changes.","family":"lie","pattern":"changed word form"}},{"w":"tidy","d":["tidy","tiny","tody","tony"],"pool":["tiny","tody","tony","tudy","tuny"],"madeUp":["tony","tudy"],"sentence":"I put my toys away to make my room tidy.","expansion":true,"sourceId":"next800-673","batch":3,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look at every letter in tidy. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"country","d":["country","cauntry","bountry","bauntry"],"pool":["cauntry","bountry","bauntry","gountry","gauntry"],"madeUp":["cauntry","bountry","bauntry","gountry"],"sentence":"We live in a country with many towns.","expansion":true,"sourceId":"next800-739","batch":3,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look carefully at “ou” in country. Listen, then read the whole sentence.","pattern":"letter group ou"}},{"w":"sixth","d":["sixth","saxth","sibth","sabth"],"pool":["saxth","sibth","sabth","sidth","sadth"],"madeUp":["saxth","sibth","sabth","sadth"],"sentence":"The sixth house has a red door.","expansion":true,"sourceId":"next800-141","batch":3,"group":"Written numbers and quantity","teaching":{"symbol":"6th","tip":"sixth tells us position 6 in an order.","number":6,"pattern":"ordinal"}},{"w":"use","d":["use","ube","ase","abe"],"pool":["ube","ase","abe","ose","obe"],"madeUp":["ube"],"sentence":"You can use my pencil.","expansion":true,"sourceId":"next800-073","batch":3,"group":"Sentence building and common verbs","teaching":{"tip":"Look at every letter in use. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"live","d":["live","lave","cive","cave"],"pool":["lave","cive","cave","dive","dave"],"madeUp":[],"sentence":"We live in a small house.","expansion":true,"sourceId":"next800-074","batch":3,"group":"Sentence building and common verbs","teaching":{"tip":"Look at every letter in live. Listen, say the word, then read the sentence.","pattern":"whole word"},"spoken":"We live in a small house."},{"w":"tail","d":["tail","toil","bail","boil"],"pool":["toil","bail","boil","fail","foil"],"madeUp":[],"sentence":"The fox has a long tail.","expansion":true,"sourceId":"next800-208","batch":3,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ai” in tail. Listen, then read the whole sentence.","pattern":"letter group ai"}},{"w":"safe","d":["safe","sife","sabe","sibe"],"pool":["sife","sabe","sibe","sade","side"],"madeUp":["sibe"],"sentence":"We keep the baby safe.","expansion":true,"sourceId":"next800-209","batch":3,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in safe. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"bathroom","d":["bathroom","bethroom","bathraom","bethraom"],"pool":["bethroom","bathraom","bethraom","bathreom","bethreom"],"madeUp":["bethroom","bathraom","bethraom","bathreom","bethreom"],"sentence":"We wash our hands in the bathroom.","expansion":true,"sourceId":"next800-478","batch":3,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “oo” in bathroom. Listen, then read the whole sentence.","pattern":"letter group oo"}},{"w":"toilet","d":["toilet","tailet","toileb","taileb"],"pool":["tailet","toileb","taileb","toiled","tailed"],"madeUp":["toileb","taileb"],"sentence":"I wash my hands after using the toilet.","expansion":true,"sourceId":"next800-479","batch":3,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in toilet. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"sleeping","d":["sleeping","slaeping","sleaping","slaaping"],"pool":["slaeping","sleaping","slaaping","sleiping","slaiping"],"madeUp":["slaeping","sleaping","slaaping","sleiping","slaiping"],"sentence":"The baby is sleeping in bed.","expansion":true,"sourceId":"next800-585","batch":3,"group":"Actions and word families","teaching":{"tip":"Word family: sleep → sleeping. Read the whole word, including its ending.","family":"sleep","pattern":"word ending"}},{"w":"noisy","d":["noisy","noosy","boisy","boosy"],"pool":["noosy","boisy","boosy","goisy","goosy"],"madeUp":["noosy","boisy","goisy"],"sentence":"The noisy truck wakes me up.","expansion":true,"sourceId":"next800-674","batch":3,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look at every letter in noisy. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"yard","d":["yard","yird","aard","aird"],"pool":["yird","aard","aird","eard","eird"],"madeUp":["aard","aird","eard","eird"],"sentence":"The dog plays in the yard.","expansion":true,"sourceId":"next800-740","batch":3,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look carefully at “ar” in yard. Listen, then read the whole sentence.","pattern":"letter group ar"}},{"w":"seventh","d":["seventh","saventh","sevanth","savanth"],"pool":["saventh","sevanth","savanth","sevinth","savinth"],"madeUp":["saventh","sevanth","savanth","sevinth","savinth"],"sentence":"The seventh day is our rest day.","expansion":true,"sourceId":"next800-142","batch":3,"group":"Written numbers and quantity","teaching":{"symbol":"7th","tip":"seventh tells us position 7 in an order.","number":7,"pattern":"ordinal"}},{"w":"try","d":["try","thy","tra","tha"],"pool":["thy","tra","tha","tre","the"],"madeUp":["thy","tra","tha","tre"],"sentence":"I will try to read this word.","expansion":true,"sourceId":"next800-075","batch":3,"group":"Sentence building and common verbs","teaching":{"tip":"Look at every letter in try. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"grow","d":["grow","grew","brow","brew"],"pool":["grew","brow","brew","crow","crew"],"madeUp":[],"sentence":"Plants need water to grow.","expansion":true,"sourceId":"next800-076","batch":3,"group":"Sentence building and common verbs","teaching":{"tip":"Look carefully at “ow” in grow. Listen, then read the whole sentence.","pattern":"letter group ow"}},{"w":"bear","d":["bear","boar","dear","doar"],"pool":["boar","dear","doar","hear","hoar"],"madeUp":["doar"],"sentence":"The bear catches a fish.","expansion":true,"sourceId":"next800-210","batch":3,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ar” in bear. Listen, then read the whole sentence.","pattern":"letter group ar"}},{"w":"low","d":["low","law","bow","baw"],"pool":["law","bow","baw","cow","caw"],"madeUp":[],"sentence":"The low branch is easy to reach.","expansion":true,"sourceId":"next800-211","batch":3,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ow” in low. Listen, then read the whole sentence.","pattern":"letter group ow"}},{"w":"bath","d":["bath","both","cath","coth"],"pool":["both","cath","coth","gath","goth"],"madeUp":["cath","gath"],"sentence":"The baby has a warm bath.","expansion":true,"sourceId":"next800-480","batch":3,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “th” in bath. Listen, then read the whole sentence.","pattern":"letter group th"}},{"w":"shower","d":["shower","shawer","shober","shaber"],"pool":["shawer","shober","shaber","shoder","shader"],"madeUp":["shawer","shober","shaber"],"sentence":"Water falls from the shower.","expansion":true,"sourceId":"next800-481","batch":3,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “sh” in shower. Listen, then read the whole sentence.","pattern":"letter group sh"}},{"w":"slept","d":["slept","slent","blept","blent"],"pool":["slent","blept","blent","glept","glent"],"madeUp":["slent","blept","glept"],"sentence":"I slept well last night.","expansion":true,"sourceId":"next800-586","batch":3,"group":"Actions and word families","teaching":{"tip":"Word family: sleep → slept. Notice how the spelling changes.","family":"sleep","pattern":"changed word form"}},{"w":"rough","d":["rough","rouch","bough","bouch"],"pool":["rouch","bough","bouch","cough","couch"],"madeUp":["rouch","bouch"],"sentence":"The tree has rough bark.","expansion":true,"sourceId":"next800-675","batch":3,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look carefully at “ou” in rough. Listen, then read the whole sentence.","pattern":"letter group ou"}},{"w":"fence","d":["fence","fance","dence","dance"],"pool":["fance","dence","dance","hence","hance"],"madeUp":["fance","dence"],"sentence":"The fence keeps the sheep in the field.","expansion":true,"sourceId":"next800-741","batch":3,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look at every letter in fence. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"eighth","d":["eighth","eaghth","aighth","aaghth"],"pool":["eaghth","aighth","aaghth","iighth","iaghth"],"madeUp":["eaghth","aighth","aaghth","iighth","iaghth"],"sentence":"The eighth shell is pink.","expansion":true,"sourceId":"next800-143","batch":3,"group":"Written numbers and quantity","teaching":{"symbol":"8th","tip":"eighth tells us position 8 in an order.","number":8,"pattern":"ordinal"}},{"w":"draw","d":["draw","drew","braw","brew"],"pool":["drew","braw","brew","craw","crew"],"madeUp":[],"sentence":"I can draw a cat.","expansion":true,"sourceId":"next800-077","batch":4,"group":"Sentence building and common verbs","teaching":{"tip":"Look at every letter in draw. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"fall","d":["fall","fell","ball","bell"],"pool":["fell","ball","bell","call","cell"],"madeUp":[],"sentence":"Do not let the cup fall.","expansion":true,"sourceId":"next800-078","batch":4,"group":"Sentence building and common verbs","teaching":{"tip":"Look at every letter in fall. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"sea","d":["sea","saa","bea","baa"],"pool":["saa","bea","baa","cea","caa"],"madeUp":["cea","caa"],"sentence":"The ship sails across the sea.","expansion":true,"sourceId":"next800-212","batch":4,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ea” in sea. Listen, then read the whole sentence.","pattern":"letter group ea"}},{"w":"table","d":["table","toble","cable","coble"],"pool":["toble","cable","coble","fable","foble"],"madeUp":["toble","foble"],"sentence":"We eat our lunch at the table.","expansion":true,"sourceId":"next800-213","batch":4,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in table. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"towel","d":["towel","tewel","bowel","bewel"],"pool":["tewel","bowel","bewel","dowel","dewel"],"madeUp":["bewel","dewel"],"sentence":"I dry my hands with a towel.","expansion":true,"sourceId":"next800-482","batch":4,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “ow” in towel. Listen, then read the whole sentence.","pattern":"letter group ow"}},{"w":"soap","d":["soap","soup","coap","coup"],"pool":["soup","coap","coup","doap","doup"],"madeUp":["coap","doap"],"sentence":"I wash my hands with soap.","expansion":true,"sourceId":"next800-483","batch":4,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “oa” in soap. Listen, then read the whole sentence.","pattern":"letter group oa"}},{"w":"wake","d":["wake","woke","bake","boke"],"pool":["woke","bake","boke","cake","coke"],"madeUp":[],"sentence":"We wake when the sun comes up.","expansion":true,"sourceId":"next800-587","batch":4,"group":"Actions and word families","teaching":{"tip":"Look at every letter in wake. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"smooth","d":["smooth","scooth","smoath","scoath"],"pool":["scooth","smoath","scoath","smouth","scouth"],"madeUp":["scooth","smoath","scoath","smouth"],"sentence":"The stone feels smooth in my hand.","expansion":true,"sourceId":"next800-676","batch":4,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look carefully at “oo” in smooth. Listen, then read the whole sentence.","pattern":"letter group oo"}},{"w":"roof","d":["roof","roaf","boof","boaf"],"pool":["roaf","boof","boaf","goof","goaf"],"madeUp":["roaf","boaf"],"sentence":"The roof keeps rain out of the house.","expansion":true,"sourceId":"next800-742","batch":4,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look carefully at “oo” in roof. Listen, then read the whole sentence.","pattern":"letter group oo"}},{"w":"ninth","d":["ninth","nunth","ninbh","nunbh"],"pool":["nunth","ninbh","nunbh","ninch","nunch"],"madeUp":["nunth","ninbh","nunbh","ninch"],"sentence":"The ninth step is broken.","expansion":true,"sourceId":"next800-144","batch":4,"group":"Written numbers and quantity","teaching":{"symbol":"9th","tip":"ninth tells us position 9 in an order.","number":9,"pattern":"ordinal"}},{"w":"ride","d":["ride","rice","bide","bice"],"pool":["rice","bide","bice","fide","fice"],"madeUp":[],"sentence":"I can ride my bike.","expansion":true,"sourceId":"next800-079","batch":4,"group":"Sentence building and common verbs","teaching":{"tip":"Look at every letter in ride. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"buy","d":["buy","bay","cuy","cay"],"pool":["bay","cuy","cay","duy","day"],"madeUp":["cuy","duy"],"sentence":"We buy bread at the shop.","expansion":true,"sourceId":"next800-080","batch":4,"group":"Sentence building and common verbs","teaching":{"tip":"Look at every letter in buy. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"box","d":["box","bax","bob","bab"],"pool":["bax","bob","bab","bog","bag"],"madeUp":["bax"],"sentence":"Put the toys in the box.","expansion":true,"sourceId":"next800-214","batch":4,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in box. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"room","d":["room","roam","rood","road"],"pool":["roam","rood","road","roof","roaf"],"madeUp":["roaf"],"sentence":"My bed is in my room.","expansion":true,"sourceId":"next800-215","batch":4,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “oo” in room. Listen, then read the whole sentence.","pattern":"letter group oo"}},{"w":"brush","d":["brush","brash","crush","crash"],"pool":["brash","crush","crash","frush","frash"],"madeUp":["frash"],"sentence":"I use a brush on my hair.","expansion":true,"sourceId":"next800-484","batch":4,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “sh” in brush. Listen, then read the whole sentence.","pattern":"letter group sh"}},{"w":"tooth","d":["tooth","touth","booth","bouth"],"pool":["touth","booth","bouth","cooth","couth"],"madeUp":["touth","bouth","cooth"],"sentence":"My first tooth has fallen out.","expansion":true,"sourceId":"next800-485","batch":4,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “oo” in tooth. Listen, then read the whole sentence.","pattern":"letter group oo"}},{"w":"woke","d":["woke","wake","boke","bake"],"pool":["wake","boke","bake","coke","cake"],"madeUp":[],"sentence":"I woke up early today.","expansion":true,"sourceId":"next800-588","batch":4,"group":"Actions and word families","teaching":{"tip":"Word family: wake → woke. Notice how the spelling changes.","family":"wake","pattern":"changed word form"}},{"w":"empty","d":["empty","ebpty","ampty","abpty"],"pool":["ebpty","ampty","abpty","umpty","ubpty"],"madeUp":["ebpty","ampty","abpty","ubpty"],"sentence":"There is nothing in the empty box.","expansion":true,"sourceId":"next800-677","batch":4,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look at every letter in empty. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"stair","d":["stair","steir","staib","steib"],"pool":["steir","staib","steib","staid","steid"],"madeUp":["steir","staib","steib"],"sentence":"I put my foot on the first stair.","expansion":true,"sourceId":"next800-743","batch":4,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look carefully at “ai” in stair. Listen, then read the whole sentence.","pattern":"letter group ai"}},{"w":"tenth","d":["tenth","tench","benth","bench"],"pool":["tench","benth","bench","centh","cench"],"madeUp":["benth","centh","cench"],"sentence":"The tenth runner crosses the line.","expansion":true,"sourceId":"next800-145","batch":4,"group":"Written numbers and quantity","teaching":{"symbol":"10th","tip":"tenth tells us position 10 in an order.","number":10,"pattern":"ordinal"}},{"w":"please","d":["please","plaase","pleise","plaise"],"pool":["plaase","pleise","plaise","pleose","plaose"],"madeUp":["plaase","pleise","plaise","pleose","plaose"],"sentence":"Can you help me, please?","expansion":true,"sourceId":"next800-081","batch":4,"group":"Sentence building and common verbs","teaching":{"tip":"Look carefully at “ea” in please. Listen, then read the whole sentence.","pattern":"letter group ea"}},{"w":"wash","d":["wash","wish","dash","dish"],"pool":["wish","dash","dish","fash","fish"],"madeUp":[],"sentence":"We wash our hands before lunch.","expansion":true,"sourceId":"next800-082","batch":4,"group":"Sentence building and common verbs","teaching":{"tip":"Look carefully at “sh” in wash. Listen, then read the whole sentence.","pattern":"letter group sh"}},{"w":"strong","d":["strong","sprong","strang","sprang"],"pool":["sprong","strang","sprang","streng","spreng"],"madeUp":["sprong"],"sentence":"The strong horse pulls the cart.","expansion":true,"sourceId":"next800-216","batch":4,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ng” in strong. Listen, then read the whole sentence.","pattern":"letter group ng"}},{"w":"wind","d":["wind","wand","bind","band"],"pool":["wand","bind","band","find","fand"],"madeUp":[],"sentence":"The wind blows the leaves.","expansion":true,"sourceId":"next800-217","batch":4,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in wind. Listen, say the word, then read the sentence.","pattern":"whole word"},"spoken":"The wind blows the leaves."},{"w":"teeth","d":["teeth","teath","beeth","beath"],"pool":["teath","beeth","beath","ceeth","ceath"],"madeUp":["teath","ceeth","ceath"],"sentence":"I brush my teeth every day.","expansion":true,"sourceId":"next800-486","batch":4,"group":"Home, family, food and school","teaching":{"tip":"Word family: tooth → teeth. Notice how the spelling changes.","family":"tooth","pattern":"changed word form"}},{"w":"shirt","d":["shirt","skirt","shart","skart"],"pool":["skirt","shart","skart","short","skort"],"madeUp":["shart","skort"],"sentence":"My shirt has blue buttons.","expansion":true,"sourceId":"next800-487","batch":4,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “sh” in shirt. Listen, then read the whole sentence.","pattern":"letter group sh"}},{"w":"awake","d":["awake","awave","abake","abave"],"pool":["awave","abake","abave","agake","agave"],"madeUp":["awave","abake","agake"],"sentence":"The baby is awake now.","expansion":true,"sourceId":"next800-589","batch":4,"group":"Actions and word families","teaching":{"tip":"Look at every letter in awake. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"weak","d":["weak","week","beak","beek"],"pool":["week","beak","beek","feak","feek"],"madeUp":["feek"],"sentence":"The weak branch cannot hold the heavy swing.","expansion":true,"sourceId":"next800-678","batch":4,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look carefully at “ea” in weak. Listen, then read the whole sentence.","pattern":"letter group ea"}},{"w":"tent","d":["tent","tint","bent","bint"],"pool":["tint","bent","bint","dent","dint"],"madeUp":[],"sentence":"We sleep in a tent at camp.","expansion":true,"sourceId":"next800-744","batch":4,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look at every letter in tent. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"half","d":["half","haff","balf","baff"],"pool":["haff","balf","baff","calf","caff"],"madeUp":["balf","caff"],"sentence":"We cut the apple in half.","expansion":true,"sourceId":"next800-146","batch":4,"group":"Written numbers and quantity","teaching":{"symbol":"½","tip":"One of two equal parts.","pattern":"tricky spelling or meaning"}},{"w":"couldn't","d":["couldn't","cauldn't","coaldn't","caaldn't"],"pool":["cauldn't","coaldn't","caaldn't","coeldn't","caeldn't"],"madeUp":["cauldn't","coaldn't","caaldn't","coeldn't","caeldn't"],"sentence":"The little dog couldn't reach the ball.","expansion":true,"sourceId":"next800-087","batch":4,"group":"Sentence building and common verbs","teaching":{"tip":"couldn't means could not. The apostrophe takes the place of missing letters.","family":"could not","pattern":"contraction"}},{"w":"won't","d":["won't","wan't","con't","can't"],"pool":["wan't","con't","can't","don't","dan't"],"madeUp":["wan't","con't","dan't"],"sentence":"The door won't open.","expansion":true,"sourceId":"next800-088","batch":4,"group":"Sentence building and common verbs","teaching":{"tip":"won't means will not. The apostrophe takes the place of missing letters.","family":"will not","pattern":"contraction"}},{"w":"rope","d":["rope","ripe","robe","ribe"],"pool":["ripe","robe","ribe","rode","ride"],"madeUp":[],"sentence":"The boat is tied with a rope.","expansion":true,"sourceId":"next800-219","batch":4,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in rope. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"wood","d":["wood","woad","bood","boad"],"pool":["woad","bood","boad","good","goad"],"madeUp":["boad"],"sentence":"The little chair is made of wood.","expansion":true,"sourceId":"next800-220","batch":4,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “oo” in wood. Listen, then read the whole sentence.","pattern":"letter group oo"}},{"w":"coat","d":["coat","ceat","boat","beat"],"pool":["ceat","boat","beat","goat","geat"],"madeUp":["ceat"],"sentence":"I put on my coat to go outside.","expansion":true,"sourceId":"next800-488","batch":4,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “oa” in coat. Listen, then read the whole sentence.","pattern":"letter group oa"}},{"w":"jacket","d":["jacket","jecket","backet","becket"],"pool":["jecket","backet","becket","cacket","cecket"],"madeUp":["jecket","cacket","cecket"],"sentence":"My jacket keeps the wind out.","expansion":true,"sourceId":"next800-489","batch":4,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in jacket. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"drank","d":["drank","drink","brank","brink"],"pool":["drink","brank","brink","crank","crink"],"madeUp":[],"sentence":"I drank a glass of water.","expansion":true,"sourceId":"next800-590","batch":4,"group":"Actions and word families","teaching":{"tip":"Word family: drink → drank. Notice how the spelling changes.","family":"drink","pattern":"changed word form"}},{"w":"fresh","d":["fresh","frush","bresh","brush"],"pool":["frush","bresh","brush","cresh","crush"],"madeUp":["bresh","cresh"],"sentence":"The bread is fresh from the oven.","expansion":true,"sourceId":"next800-679","batch":4,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look carefully at “sh” in fresh. Listen, then read the whole sentence.","pattern":"letter group sh"}},{"w":"barn","d":["barn","bern","darn","dern"],"pool":["bern","darn","dern","harn","hern"],"madeUp":[],"sentence":"The farmer keeps hay in the barn.","expansion":true,"sourceId":"next800-745","batch":4,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look carefully at “ar” in barn. Listen, then read the whole sentence.","pattern":"letter group ar"}},{"w":"quarter","d":["quarter","qaarter","querter","qaerter"],"pool":["qaarter","querter","qaerter","quirter","qairter"],"madeUp":["qaarter","querter","qaerter","quirter","qairter"],"sentence":"A quarter of the cake is one of four equal pieces.","expansion":true,"sourceId":"next800-147","batch":4,"group":"Written numbers and quantity","teaching":{"symbol":"¼","tip":"One of four equal parts.","pattern":"tricky spelling or meaning"}},{"w":"wasn't","d":["wasn't","wesn't","basn't","besn't"],"pool":["wesn't","basn't","besn't","casn't","cesn't"],"madeUp":["wesn't","basn't","besn't","casn't","cesn't"],"sentence":"The box wasn't empty.","expansion":true,"sourceId":"next800-089","batch":4,"group":"Sentence building and common verbs","teaching":{"tip":"wasn't means was not. The apostrophe takes the place of missing letters.","family":"was not","pattern":"contraction"}},{"w":"isn't","d":["isn't","ibn't","asn't","abn't"],"pool":["ibn't","asn't","abn't","esn't","ebn't"],"madeUp":["ibn't","asn't","abn't","esn't","ebn't"],"sentence":"The cake isn't ready.","expansion":true,"sourceId":"next800-090","batch":4,"group":"Sentence building and common verbs","teaching":{"tip":"isn't means is not. The apostrophe takes the place of missing letters.","family":"is not","pattern":"contraction"}},{"w":"fruit","d":["fruit","freit","bruit","breit"],"pool":["freit","bruit","breit","cruit","creit"],"madeUp":["breit","cruit","creit"],"sentence":"An apple is a kind of fruit.","expansion":true,"sourceId":"next800-221","batch":4,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in fruit. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"people","d":["people","poople","peoble","pooble"],"pool":["poople","peoble","pooble","peodle","poodle"],"madeUp":["poople","peoble","pooble","peodle"],"sentence":"There are many people in the park.","expansion":true,"sourceId":"next800-222","batch":4,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in people. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"trousers","d":["trousers","trausers","troasers","traasers"],"pool":["trausers","troasers","traasers","troesers","traesers"],"madeUp":["trausers","troasers","traasers","troesers","traesers"],"sentence":"My trousers cover both my legs.","expansion":true,"sourceId":"next800-490","batch":4,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “ou” in trousers. Listen, then read the whole sentence.","pattern":"letter group ou"}},{"w":"skirt","d":["skirt","shirt","skart","shart"],"pool":["shirt","skart","shart","skort","short"],"madeUp":["shart","skort"],"sentence":"She wears a red skirt.","expansion":true,"sourceId":"next800-491","batch":4,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “ir” in skirt. Listen, then read the whole sentence.","pattern":"letter group ir"}},{"w":"taken","d":["taken","token","baken","boken"],"pool":["token","baken","boken","caken","coken"],"madeUp":["boken","caken","coken"],"sentence":"The dog has taken my shoe.","expansion":true,"sourceId":"next800-591","batch":4,"group":"Actions and word families","teaching":{"tip":"Word family: take → taken. Notice how the spelling changes.","family":"take","pattern":"changed word form"}},{"w":"square","d":["square","sqaare","squere","sqaere"],"pool":["sqaare","squere","sqaere","squire","sqaire"],"madeUp":["sqaare","squere","sqaere","sqaire"],"sentence":"A square has four equal sides.","expansion":true,"sourceId":"next800-680","batch":4,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look carefully at “ar” in square. Listen, then read the whole sentence.","pattern":"letter group ar"}},{"w":"tunnel","d":["tunnel","tannel","cunnel","cannel"],"pool":["tannel","cunnel","cannel","funnel","fannel"],"madeUp":["tannel","cunnel"],"sentence":"The train goes through the tunnel.","expansion":true,"sourceId":"next800-746","batch":4,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look at every letter in tunnel. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"double","d":["double","doable","doucle","doacle"],"pool":["doable","doucle","doacle","doudle","doadle"],"madeUp":["doucle","doacle","doadle"],"sentence":"I have double your number of apples.","expansion":true,"sourceId":"next800-148","batch":4,"group":"Written numbers and quantity","teaching":{"symbol":"×2","tip":"Twice as many.","pattern":"tricky spelling or meaning"}},{"w":"you're","d":["you're","you've","yau're","yau've"],"pool":["you've","yau're","yau've","yeu're","yeu've"],"madeUp":["yau're","yau've","yeu're","yeu've"],"sentence":"I am glad you're here.","expansion":true,"sourceId":"next800-091","batch":4,"group":"Sentence building and common verbs","teaching":{"tip":"you're means you are. The apostrophe takes the place of missing letters.","family":"you are","pattern":"contraction"}},{"w":"I'll","d":["I'll","I'bl","A'll","A'bl"],"pool":["I'bl","A'll","A'bl","E'll","E'bl"],"madeUp":["I'bl","A'll","A'bl","E'll","E'bl"],"sentence":"I'll help you carry the bag.","expansion":true,"sourceId":"next800-092","batch":4,"group":"Sentence building and common verbs","teaching":{"tip":"I'll means I will. The apostrophe takes the place of missing letters.","family":"I will","pattern":"contraction"}},{"w":"window","d":["window","wandow","windaw","wandaw"],"pool":["wandow","windaw","wandaw","windew","wandew"],"madeUp":["wandow","windaw","wandaw","windew","wandew"],"sentence":"I can see the garden through the window.","expansion":true,"sourceId":"next800-223","batch":4,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ow” in window. Listen, then read the whole sentence.","pattern":"letter group ow"}},{"w":"bridge","d":["bridge","brudge","dridge","drudge"],"pool":["brudge","dridge","drudge","gridge","grudge"],"madeUp":["brudge","dridge","gridge"],"sentence":"The bridge goes over the river.","expansion":true,"sourceId":"next800-224","batch":4,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in bridge. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"sock","d":["sock","seck","bock","beck"],"pool":["seck","bock","beck","dock","deck"],"madeUp":[],"sentence":"I put a sock on my foot.","expansion":true,"sourceId":"next800-492","batch":4,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in sock. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"shoe","d":["shoe","shee","shoa","shea"],"pool":["shee","shoa","shea","shou","sheu"],"madeUp":["sheu"],"sentence":"There is a stone in my shoe.","expansion":true,"sourceId":"next800-493","batch":4,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “sh” in shoe. Listen, then read the whole sentence.","pattern":"letter group sh"}},{"w":"given","d":["given","gaven","diven","daven"],"pool":["gaven","diven","daven","hiven","haven"],"madeUp":["gaven","diven","hiven"],"sentence":"Grandma has given me a book.","expansion":true,"sourceId":"next800-592","batch":4,"group":"Actions and word families","teaching":{"tip":"Word family: give → given. Notice how the spelling changes.","family":"give","pattern":"changed word form"}},{"w":"silver","d":["silver","salver","bilver","balver"],"pool":["salver","bilver","balver","cilver","calver"],"madeUp":["bilver","balver","cilver"],"sentence":"The silver ring shines in the light.","expansion":true,"sourceId":"next800-681","batch":4,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look carefully at “er” in silver. Listen, then read the whole sentence.","pattern":"letter group er"}},{"w":"net","d":["net","nat","bet","bat"],"pool":["nat","bet","bat","get","gat"],"madeUp":[],"sentence":"The ball lands in the net.","expansion":true,"sourceId":"next800-747","batch":4,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look at every letter in net. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"pair","d":["pair","peir","paar","pear"],"pool":["peir","paar","pear","paer","peer"],"madeUp":["peir","paer"],"sentence":"I have a pair of red shoes.","expansion":true,"sourceId":"next800-149","batch":4,"group":"Written numbers and quantity","teaching":{"symbol":"2","tip":"Two things that go together.","pattern":"tricky spelling or meaning"}},{"w":"let's","d":["let's","lat's","bet's","bat's"],"pool":["lat's","bet's","bat's","cet's","cat's"],"madeUp":["lat's","bet's","bat's","cet's","cat's"],"sentence":"Now let's go to the park.","expansion":true,"sourceId":"next800-093","batch":4,"group":"Sentence building and common verbs","teaching":{"tip":"let's means let us. The apostrophe takes the place of missing letters.","family":"let us","pattern":"contraction"}},{"w":"we'll","d":["we'll","wa'll","be'll","ba'll"],"pool":["wa'll","be'll","ba'll","ce'll","ca'll"],"madeUp":["wa'll","be'll","ba'll","ce'll","ca'll"],"sentence":"After lunch, we'll read a book.","expansion":true,"sourceId":"next800-094","batch":4,"group":"Sentence building and common verbs","teaching":{"tip":"we'll means we will. The apostrophe takes the place of missing letters.","family":"we will","pattern":"contraction"}},{"w":"camp","d":["camp","cump","damp","dump"],"pool":["cump","damp","dump","gamp","gump"],"madeUp":[],"sentence":"We sleep in tents at camp.","expansion":true,"sourceId":"next800-225","batch":4,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in camp. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"sad","d":["sad","sid","bad","bid"],"pool":["sid","bad","bid","cad","cid"],"madeUp":[],"sentence":"I feel sad when my friend leaves.","expansion":true,"sourceId":"next800-226","batch":4,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in sad. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"boot","d":["boot","boat","coot","coat"],"pool":["boat","coot","coat","doot","doat"],"madeUp":["doot"],"sentence":"My boot keeps my foot dry.","expansion":true,"sourceId":"next800-494","batch":4,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “oo” in boot. Listen, then read the whole sentence.","pattern":"letter group oo"}},{"w":"pocket","d":["pocket","packet","bocket","backet"],"pool":["packet","bocket","backet","cocket","cacket"],"madeUp":["bocket","cacket"],"sentence":"I keep a shell in my pocket.","expansion":true,"sourceId":"next800-495","batch":4,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in pocket. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"making","d":["making","maring","baking","baring"],"pool":["maring","baking","baring","daking","daring"],"madeUp":["maring","daking"],"sentence":"We are making a cake.","expansion":true,"sourceId":"next800-593","batch":4,"group":"Actions and word families","teaching":{"tip":"Word family: make → making. Read the whole word, including its ending.","family":"make","pattern":"word ending"}},{"w":"pink","d":["pink","pank","bink","bank"],"pool":["pank","bink","bank","dink","dank"],"madeUp":[],"sentence":"The flower is pink.","expansion":true,"sourceId":"next800-682","batch":4,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look at every letter in pink. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"torch","d":["torch","totch","borch","botch"],"pool":["totch","borch","botch","corch","cotch"],"madeUp":["totch","borch","corch"],"sentence":"We use a torch to see in the dark.","expansion":true,"sourceId":"next800-748","batch":4,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look carefully at “ch” in torch. Listen, then read the whole sentence.","pattern":"letter group ch"}},{"w":"count","d":["count","caunt","dount","daunt"],"pool":["caunt","dount","daunt","fount","faunt"],"madeUp":["caunt","dount","faunt"],"sentence":"We count the ducks on the pond.","expansion":true,"sourceId":"next800-150","batch":4,"group":"Written numbers and quantity","teaching":{"tip":"Look carefully at “ou” in count. Listen, then read the whole sentence.","pattern":"letter group ou"}},{"w":"that's","d":["that's","trat's","thet's","tret's"],"pool":["trat's","thet's","tret's","thit's","trit's"],"madeUp":["trat's","thet's","tret's","thit's","trit's"],"sentence":"Look, that's my dog!","expansion":true,"sourceId":"next800-095","batch":4,"group":"Sentence building and common verbs","teaching":{"tip":"that's means that is. The apostrophe takes the place of missing letters.","family":"that is","pattern":"contraction"}},{"w":"there's","d":["there's","thare's","thera's","thara's"],"pool":["thare's","thera's","thara's","theri's","thari's"],"madeUp":["thare's","thera's","thara's","theri's","thari's"],"sentence":"Look, there's a bird in the tree.","expansion":true,"sourceId":"next800-096","batch":4,"group":"Sentence building and common verbs","teaching":{"tip":"there's means there is. The apostrophe takes the place of missing letters.","family":"there is","pattern":"contraction"}},{"w":"star","d":["star","scar","stab","scab"],"pool":["scar","stab","scab","stad","scad"],"madeUp":["stad"],"sentence":"A bright star shines at night.","expansion":true,"sourceId":"next800-227","batch":4,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ar” in star. Listen, then read the whole sentence.","pattern":"letter group ar"}},{"w":"sound","d":["sound","saund","bound","baund"],"pool":["saund","bound","baund","found","faund"],"madeUp":["saund","baund","faund"],"sentence":"I hear the sound of a bell.","expansion":true,"sourceId":"next800-228","batch":4,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ou” in sound. Listen, then read the whole sentence.","pattern":"letter group ou"}},{"w":"toy","d":["toy","tay","boy","bay"],"pool":["tay","boy","bay","coy","cay"],"madeUp":[],"sentence":"My favourite toy is a little car.","expansion":true,"sourceId":"next800-496","batch":4,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in toy. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"doll","d":["doll","dell","boll","bell"],"pool":["dell","boll","bell","coll","cell"],"madeUp":[],"sentence":"The doll has a little dress.","expansion":true,"sourceId":"next800-497","batch":4,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in doll. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"doing","d":["doing","deing","boing","being"],"pool":["deing","boing","being","going","geing"],"madeUp":["deing","boing","geing"],"sentence":"What are you doing with that box?","expansion":true,"sourceId":"next800-594","batch":4,"group":"Actions and word families","teaching":{"tip":"Word family: do → doing. Read the whole word, including its ending.","family":"do","pattern":"word ending"}},{"w":"purple","d":["purple","pubple","purble","pubble"],"pool":["pubple","purble","pubble","purfle","pubfle"],"madeUp":["pubple","purble","pubfle"],"sentence":"I draw with a purple pencil.","expansion":true,"sourceId":"next800-683","batch":4,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look carefully at “ur” in purple. Listen, then read the whole sentence.","pattern":"letter group ur"}},{"w":"flame","d":["flame","flime","blame","blime"],"pool":["flime","blame","blime","clame","clime"],"madeUp":["flime","blime"],"sentence":"A small flame burns on the candle.","expansion":true,"sourceId":"next800-749","batch":4,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look at every letter in flame. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"number","d":["number","nomber","bumber","bomber"],"pool":["nomber","bumber","bomber","cumber","comber"],"madeUp":["nomber","bumber"],"sentence":"Tell me the number on the door.","expansion":true,"sourceId":"next800-151","batch":4,"group":"Written numbers and quantity","teaching":{"tip":"Look carefully at “er” in number. Listen, then read the whole sentence.","pattern":"letter group er"}},{"w":"he's","d":["he's","ha's","be's","ba's"],"pool":["ha's","be's","ba's","ce's","ca's"],"madeUp":["ha's","be's","ba's","ce's","ca's"],"sentence":"My brother says he's hungry.","expansion":true,"sourceId":"next800-097","batch":4,"group":"Sentence building and common verbs","teaching":{"tip":"he's means he is. The apostrophe takes the place of missing letters.","family":"he is","pattern":"contraction"}},{"w":"she's","d":["she's","sce's","sha's","sca's"],"pool":["sce's","sha's","sca's","shi's","sci's"],"madeUp":["sce's","sha's","sca's","shi's","sci's"],"sentence":"My sister says she's tired.","expansion":true,"sourceId":"next800-098","batch":4,"group":"Sentence building and common verbs","teaching":{"tip":"she's means she is. The apostrophe takes the place of missing letters.","family":"she is","pattern":"contraction"}},{"w":"place","d":["place","plate","plece","plete"],"pool":["plate","plece","plete","ploce","plote"],"madeUp":["plece","plete"],"sentence":"This is a good place to sit.","expansion":true,"sourceId":"next800-229","batch":4,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in place. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"year","d":["year","yoar","yeer","yoer"],"pool":["yoar","yeer","yoer","yeur","your"],"madeUp":["yoar","yeer","yoer","yeur"],"sentence":"My birthday comes once each year.","expansion":true,"sourceId":"next800-230","batch":4,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ar” in year. Listen, then read the whole sentence.","pattern":"letter group ar"}},{"w":"teddy","d":["teddy","tiddy","beddy","biddy"],"pool":["tiddy","beddy","biddy","deddy","diddy"],"madeUp":["beddy","deddy"],"sentence":"I take my teddy to bed.","expansion":true,"sourceId":"next800-498","batch":4,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in teddy. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"puzzle","d":["puzzle","pezzle","buzzle","bezzle"],"pool":["pezzle","buzzle","bezzle","guzzle","gezzle"],"madeUp":["pezzle","gezzle"],"sentence":"We put the pieces of the puzzle together.","expansion":true,"sourceId":"next800-499","batch":4,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in puzzle. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"getting","d":["getting","gatting","betting","batting"],"pool":["gatting","betting","batting","cetting","catting"],"madeUp":["gatting","cetting"],"sentence":"The sky is getting dark.","expansion":true,"sourceId":"next800-595","batch":4,"group":"Actions and word families","teaching":{"tip":"Word family: get → getting. Read the whole word, including its ending.","family":"get","pattern":"word ending"}},{"w":"grey","d":["grey","gray","brey","bray"],"pool":["gray","brey","bray","drey","dray"],"madeUp":["drey"],"sentence":"The grey cloud covers the sun.","expansion":true,"sourceId":"next800-684","batch":4,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look at every letter in grey. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"smoke","d":["smoke","scoke","smake","scake"],"pool":["scoke","smake","scake","smeke","sceke"],"madeUp":["smake","scake","smeke","sceke"],"sentence":"We see smoke rising from the fire.","expansion":true,"sourceId":"next800-750","batch":4,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look at every letter in smoke. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"less","d":["less","lass","bess","bass"],"pool":["lass","bess","bass","cess","cass"],"madeUp":[],"sentence":"My cup has less water than yours.","expansion":true,"sourceId":"next800-152","batch":4,"group":"Written numbers and quantity","teaching":{"tip":"Look at every letter in less. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"we're","d":["we're","we've","wa're","wa've"],"pool":["we've","wa're","wa've","wi're","wi've"],"madeUp":["wa're","wa've","wi're","wi've"],"sentence":"Come in, we're ready to play.","expansion":true,"sourceId":"next800-099","batch":4,"group":"Sentence building and common verbs","teaching":{"tip":"we're means we are. The apostrophe takes the place of missing letters.","family":"we are","pattern":"contraction"}},{"w":"they're","d":["they're","thay're","they'ra","thay'ra"],"pool":["thay're","they'ra","thay'ra","they'ri","thay'ri"],"madeUp":["thay're","they'ra","thay'ra","they'ri","thay'ri"],"sentence":"Look at the birds; they're flying home.","expansion":true,"sourceId":"next800-100","batch":4,"group":"Sentence building and common verbs","teaching":{"tip":"they're means they are. The apostrophe takes the place of missing letters.","family":"they are","pattern":"contraction"}},{"w":"brother","d":["brother","brather","frother","frather"],"pool":["brather","frother","frather","grother","grather"],"madeUp":["brather","frather","grother"],"sentence":"My brother shares his toys with me.","expansion":true,"sourceId":"next800-231","batch":4,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “th” in brother. Listen, then read the whole sentence.","pattern":"letter group th"}},{"w":"thing","d":["thing","thirg","thinb","thirb"],"pool":["thirg","thinb","thirb","thind","third"],"madeUp":["thirg","thinb","thirb","thind"],"sentence":"What is that little thing in the box?","expansion":true,"sourceId":"next800-232","batch":4,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “th” in thing. Listen, then read the whole sentence.","pattern":"letter group th"}},{"w":"present","d":["present","prasent","prebent","prabent"],"pool":["prasent","prebent","prabent","precent","pracent"],"madeUp":["prasent","prebent","prabent","pracent"],"sentence":"I open my birthday present.","expansion":true,"sourceId":"next800-500","batch":4,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in present. Listen, say the word, then read the sentence.","pattern":"whole word"},"spoken":"I open my birthday present."},{"w":"birthday","d":["birthday","barthday","birthdey","barthdey"],"pool":["barthday","birthdey","barthdey","birthdiy","barthdiy"],"madeUp":["barthday","birthdey","barthdey","birthdiy","barthdiy"],"sentence":"We celebrate my birthday with a cake.","expansion":true,"sourceId":"next800-501","batch":4,"group":"Home, family, food and school","teaching":{"tip":"A day of the week. Its name starts with a capital letter.","pattern":"day name"}},{"w":"carrying","d":["carrying","cerrying","carryang","cerryang"],"pool":["cerrying","carryang","cerryang","carryeng","cerryeng"],"madeUp":["cerrying","carryang","cerryang","carryeng","cerryeng"],"sentence":"I am carrying a heavy bag.","expansion":true,"sourceId":"next800-596","batch":4,"group":"Actions and word families","teaching":{"tip":"Word family: carry → carrying. Read the whole word, including its ending.","family":"carry","pattern":"word ending"}},{"w":"everybody","d":["everybody","evarybody","averybody","avarybody"],"pool":["evarybody","averybody","avarybody","iverybody","ivarybody"],"madeUp":["evarybody","averybody","avarybody","iverybody","ivarybody"],"sentence":"There is enough cake for everybody.","expansion":true,"sourceId":"next800-685","batch":4,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look carefully at “er” in everybody. Listen, then read the whole sentence.","pattern":"letter group er"}},{"w":"den","d":["den","dan","ben","ban"],"pool":["dan","ben","ban","fen","fan"],"madeUp":[],"sentence":"The fox rests in its den.","expansion":true,"sourceId":"next800-751","batch":4,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look at every letter in den. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"fewer","d":["fewer","fawer","dewer","dawer"],"pool":["fawer","dewer","dawer","hewer","hawer"],"madeUp":["fawer","dawer"],"sentence":"I have fewer apples than you.","expansion":true,"sourceId":"next800-153","batch":4,"group":"Written numbers and quantity","teaching":{"tip":"Look carefully at “er” in fewer. Listen, then read the whole sentence.","pattern":"letter group er"}},{"w":"I've","d":["I've","I'be","I'va","I'ba"],"pool":["I'be","I'va","I'ba","I'vi","I'bi"],"madeUp":["I'be","I'va","I'ba","I'vi","I'bi"],"sentence":"I've found your missing shoe.","expansion":true,"sourceId":"next800-101","batch":5,"group":"Sentence building and common verbs","teaching":{"tip":"I've means I have. The apostrophe takes the place of missing letters.","family":"I have","pattern":"contraction"}},{"w":"you've","d":["you've","you're","yau've","yau're"],"pool":["you're","yau've","yau're","yeu've","yeu're"],"madeUp":["yau've","yau're","yeu've","yeu're"],"sentence":"Look, you've made a tall tower!","expansion":true,"sourceId":"next800-102","batch":5,"group":"Sentence building and common verbs","teaching":{"tip":"you've means you have. The apostrophe takes the place of missing letters.","family":"you have","pattern":"contraction"}},{"w":"name","d":["name","nome","came","come"],"pool":["nome","came","come","dame","dome"],"madeUp":[],"sentence":"Please tell me your name.","expansion":true,"sourceId":"next800-233","batch":5,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in name. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"great","d":["great","groat","breat","broat"],"pool":["groat","breat","broat","creat","croat"],"madeUp":["breat","broat"],"sentence":"We had a great day at the beach.","expansion":true,"sourceId":"next800-234","batch":5,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ea” in great. Listen, then read the whole sentence.","pattern":"letter group ea"}},{"w":"balloon","d":["balloon","belloon","calloon","celloon"],"pool":["belloon","calloon","celloon","galloon","gelloon"],"madeUp":["belloon","calloon","celloon","gelloon"],"sentence":"The red balloon floats in the air.","expansion":true,"sourceId":"next800-502","batch":5,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “oo” in balloon. Listen, then read the whole sentence.","pattern":"letter group oo"}},{"w":"candle","d":["candle","cindle","bandle","bindle"],"pool":["cindle","bandle","bindle","dandle","dindle"],"madeUp":["cindle"],"sentence":"I blow out the candle on my cake.","expansion":true,"sourceId":"next800-503","batch":5,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in candle. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"turn","d":["turn","tarn","burn","barn"],"pool":["tarn","burn","barn","durn","darn"],"madeUp":[],"sentence":"Please turn the page.","expansion":true,"sourceId":"next800-597","batch":5,"group":"Actions and word families","teaching":{"tip":"Look carefully at “ur” in turn. Listen, then read the whole sentence.","pattern":"letter group ur"}},{"w":"nobody","d":["nobody","nabody","nobady","nabady"],"pool":["nabody","nobady","nabady","nobedy","nabedy"],"madeUp":["nabody","nobady","nabady","nobedy","nabedy"],"sentence":"There is nobody in the empty room.","expansion":true,"sourceId":"next800-686","batch":5,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look at every letter in nobody. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"fur","d":["fur","far","bur","bar"],"pool":["far","bur","bar","cur","car"],"madeUp":[],"sentence":"The rabbit has soft fur.","expansion":true,"sourceId":"next800-752","batch":5,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look carefully at “ur” in fur. Listen, then read the whole sentence.","pattern":"letter group ur"}},{"w":"total","d":["total","tatal","dotal","datal"],"pool":["tatal","dotal","datal","fotal","fatal"],"madeUp":["tatal","datal","fotal"],"sentence":"There are five apples in total.","expansion":true,"sourceId":"next800-154","batch":5,"group":"Written numbers and quantity","teaching":{"tip":"Look at every letter in total. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"we've","d":["we've","we're","wa've","wa're"],"pool":["we're","wa've","wa're","wi've","wi're"],"madeUp":["wa've","wa're","wi've","wi're"],"sentence":"Look, we've finished the puzzle!","expansion":true,"sourceId":"next800-103","batch":5,"group":"Sentence building and common verbs","teaching":{"tip":"we've means we have. The apostrophe takes the place of missing letters.","family":"we have","pattern":"contraction"}},{"w":"doesn't","d":["doesn't","daesn't","doasn't","daasn't"],"pool":["daesn't","doasn't","daasn't","doisn't","daisn't"],"madeUp":["daesn't","doasn't","daasn't","doisn't","daisn't"],"sentence":"The cat doesn't like rain.","expansion":true,"sourceId":"next800-104","batch":5,"group":"Sentence building and common verbs","teaching":{"tip":"doesn't means does not. The apostrophe takes the place of missing letters.","family":"does not","pattern":"contraction"}},{"w":"end","d":["end","edd","and","add"],"pool":["edd","and","add","ind","idd"],"madeUp":["edd","idd"],"sentence":"We have reached the end of the story.","expansion":true,"sourceId":"next800-235","batch":5,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in end. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"large","d":["large","ladge","barge","badge"],"pool":["ladge","barge","badge","carge","cadge"],"madeUp":["ladge","carge"],"sentence":"The elephant is a large animal.","expansion":true,"sourceId":"next800-236","batch":5,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ar” in large. Listen, then read the whole sentence.","pattern":"letter group ar"}},{"w":"picnic","d":["picnic","pacnic","picnac","pacnac"],"pool":["pacnic","picnac","pacnac","picnec","pacnec"],"madeUp":["pacnic","picnac","pacnac","picnec","pacnec"],"sentence":"We eat our picnic under a tree.","expansion":true,"sourceId":"next800-504","batch":5,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in picnic. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"beach","d":["beach","beath","beech","beeth"],"pool":["beath","beech","beeth","beich","beith"],"madeUp":["beech","beich","beith"],"sentence":"We play on the sand at the beach.","expansion":true,"sourceId":"next800-505","batch":5,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “ch” in beach. Listen, then read the whole sentence.","pattern":"letter group ch"}},{"w":"turned","d":["turned","tarned","burned","barned"],"pool":["tarned","burned","barned","durned","darned"],"madeUp":["tarned","barned","durned"],"sentence":"The dog turned to look at me.","expansion":true,"sourceId":"next800-598","batch":5,"group":"Actions and word families","teaching":{"tip":"Word family: turn → turned. Read the whole word, including its ending.","family":"turn","pattern":"word ending"}},{"w":"somebody","d":["somebody","semebody","somabody","semabody"],"pool":["semebody","somabody","semabody","somibody","semibody"],"madeUp":["semebody","somabody","semabody","somibody"],"sentence":"I hear somebody at the door.","expansion":true,"sourceId":"next800-687","batch":5,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look at every letter in somebody. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"shell","d":["shell","shill","sheld","shild"],"pool":["shill","sheld","shild","shelf","shilf"],"madeUp":["shild"],"sentence":"The snail has a shell on its back.","expansion":true,"sourceId":"next800-753","batch":5,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look carefully at “sh” in shell. Listen, then read the whole sentence.","pattern":"letter group sh"}},{"w":"plus","d":["plus","ples","plub","pleb"],"pool":["ples","plub","pleb","plud","pled"],"madeUp":["ples","plub"],"sentence":"Two plus three is five.","expansion":true,"sourceId":"next800-155","batch":5,"group":"Written numbers and quantity","teaching":{"symbol":"+","tip":"Put amounts together.","pattern":"tricky spelling or meaning"}},{"w":"haven't","d":["haven't","heven't","havan't","hevan't"],"pool":["heven't","havan't","hevan't","havin't","hevin't"],"madeUp":["heven't","havan't","hevan't","havin't","hevin't"],"sentence":"We haven't had lunch yet.","expansion":true,"sourceId":"next800-105","batch":5,"group":"Sentence building and common verbs","teaching":{"tip":"haven't means have not. The apostrophe takes the place of missing letters.","family":"have not","pattern":"contraction"}},{"w":"hadn't","d":["hadn't","hidn't","badn't","bidn't"],"pool":["hidn't","badn't","bidn't","dadn't","didn't"],"madeUp":["hidn't","badn't","bidn't","dadn't"],"sentence":"I hadn't seen that bird before.","expansion":true,"sourceId":"next800-106","batch":5,"group":"Sentence building and common verbs","teaching":{"tip":"hadn't means had not. The apostrophe takes the place of missing letters.","family":"had not","pattern":"contraction"}},{"w":"need","d":["need","neod","deed","deod"],"pool":["neod","deed","deod","feed","feod"],"madeUp":["neod","deod"],"sentence":"Plants need water and light.","expansion":true,"sourceId":"next800-237","batch":5,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ee” in need. Listen, then read the whole sentence.","pattern":"letter group ee"}},{"w":"baby","d":["baby","boby","daby","doby"],"pool":["boby","daby","doby","gaby","goby"],"madeUp":["boby","daby"],"sentence":"The baby sleeps in a cot.","expansion":true,"sourceId":"next800-238","batch":5,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in baby. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"holiday","d":["holiday","haliday","holaday","haladay"],"pool":["haliday","holaday","haladay","holeday","haleday"],"madeUp":["haliday","holaday","haladay","holeday","haleday"],"sentence":"We go to the sea on holiday.","expansion":true,"sourceId":"next800-506","batch":5,"group":"Home, family, food and school","teaching":{"tip":"A day of the week. Its name starts with a capital letter.","pattern":"day name"}},{"w":"zoo","d":["zoo","zeo","boo","beo"],"pool":["zeo","boo","beo","goo","geo"],"madeUp":["zeo","beo"],"sentence":"We see an elephant at the zoo.","expansion":true,"sourceId":"next800-507","batch":5,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “oo” in zoo. Listen, then read the whole sentence.","pattern":"letter group oo"}},{"w":"push","d":["push","pash","bush","bash"],"pool":["pash","bush","bash","cush","cash"],"madeUp":[],"sentence":"I push the toy car along the floor.","expansion":true,"sourceId":"next800-599","batch":5,"group":"Actions and word families","teaching":{"tip":"Look carefully at “sh” in push. Listen, then read the whole sentence.","pattern":"letter group sh"}},{"w":"anyone","d":["anyone","anyane","enyone","enyane"],"pool":["anyane","enyone","enyane","inyone","inyane"],"madeUp":["anyane","enyone","enyane","inyone","inyane"],"sentence":"Does anyone know where my hat is?","expansion":true,"sourceId":"next800-688","batch":5,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look at every letter in anyone. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"creature","d":["creature","craature","creiture","craiture"],"pool":["craature","creiture","craiture","creoture","craoture"],"madeUp":["craature","creiture","craiture","creoture","craoture"],"sentence":"A tiny creature moves under the leaf.","expansion":true,"sourceId":"next800-754","batch":5,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look carefully at “ur” in creature. Listen, then read the whole sentence.","pattern":"letter group ur"}},{"w":"minus","d":["minus","manus","minas","manas"],"pool":["manus","minas","manas","mines","manes"],"madeUp":["minas"],"sentence":"Five minus two is three.","expansion":true,"sourceId":"next800-156","batch":5,"group":"Written numbers and quantity","teaching":{"symbol":"−","tip":"Take an amount away.","pattern":"tricky spelling or meaning"}},{"w":"aren't","d":["aren't","aran't","eren't","eran't"],"pool":["aran't","eren't","eran't","iren't","iran't"],"madeUp":["aran't","eren't","eran't","iren't","iran't"],"sentence":"Those shoes aren't mine.","expansion":true,"sourceId":"next800-107","batch":5,"group":"Sentence building and common verbs","teaching":{"tip":"aren't means are not. The apostrophe takes the place of missing letters.","family":"are not","pattern":"contraction"}},{"w":"weren't","d":["weren't","waren't","weran't","waran't"],"pool":["waren't","weran't","waran't","werin't","warin't"],"madeUp":["waren't","weran't","waran't","werin't","warin't"],"sentence":"We weren't at home yesterday.","expansion":true,"sourceId":"next800-108","batch":5,"group":"Sentence building and common verbs","teaching":{"tip":"weren't means were not. The apostrophe takes the place of missing letters.","family":"were not","pattern":"contraction"}},{"w":"land","d":["land","lend","band","bend"],"pool":["lend","band","bend","fand","fend"],"madeUp":[],"sentence":"The boat comes back to land.","expansion":true,"sourceId":"next800-239","batch":5,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in land. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"different","d":["different","dafferent","diffarent","daffarent"],"pool":["dafferent","diffarent","daffarent","diffirent","daffirent"],"madeUp":["dafferent","diffarent","daffarent","diffirent","daffirent"],"sentence":"These two socks are different colours.","expansion":true,"sourceId":"next800-240","batch":5,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “er” in different. Listen, then read the whole sentence.","pattern":"letter group er"}},{"w":"park","d":["park","pack","bark","back"],"pool":["pack","bark","back","cark","cack"],"madeUp":[],"sentence":"We play in the park.","expansion":true,"sourceId":"next800-508","batch":5,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “ar” in park. Listen, then read the whole sentence.","pattern":"letter group ar"}},{"w":"playground","d":["playground","pleyground","playgraund","pleygraund"],"pool":["pleyground","playgraund","pleygraund","playgreund","pleygreund"],"madeUp":["pleyground","playgraund","pleygraund","playgreund","pleygreund"],"sentence":"The playground has a swing and a slide.","expansion":true,"sourceId":"next800-509","batch":5,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “ay” in playground. Listen, then read the whole sentence.","pattern":"letter group ay"}},{"w":"opened","d":["opened","opaned","apened","apaned"],"pool":["opaned","apened","apaned","epened","epaned"],"madeUp":["opaned","apened","apaned","epened","epaned"],"sentence":"I opened the box carefully.","expansion":true,"sourceId":"next800-600","batch":5,"group":"Actions and word families","teaching":{"tip":"Word family: open → opened. Read the whole word, including its ending.","family":"open","pattern":"word ending"}},{"w":"something","d":["something","samething","somathing","samathing"],"pool":["samething","somathing","samathing","somithing","samithing"],"madeUp":["samething","somathing","samathing","somithing","samithing"],"sentence":"There is something in my pocket.","expansion":true,"sourceId":"next800-689","batch":5,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look carefully at “th” in something. Listen, then read the whole sentence.","pattern":"letter group th"}},{"w":"monster","d":["monster","minster","mobster","mibster"],"pool":["minster","mobster","mibster","mocster","micster"],"madeUp":["mibster","mocster","micster"],"sentence":"The monster in our story is friendly.","expansion":true,"sourceId":"next800-755","batch":5,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look carefully at “er” in monster. Listen, then read the whole sentence.","pattern":"letter group er"}},{"w":"equal","d":["equal","eqaal","aqual","aqaal"],"pool":["eqaal","aqual","aqaal","iqual","iqaal"],"madeUp":["eqaal","aqual","aqaal","iqual","iqaal"],"sentence":"We cut the cake into equal pieces.","expansion":true,"sourceId":"next800-157","batch":5,"group":"Written numbers and quantity","teaching":{"symbol":"=","tip":"The same amount or size.","pattern":"tricky spelling or meaning"}},{"w":"move","d":["move","mode","cove","code"],"pool":["mode","cove","code","dove","dode"],"madeUp":[],"sentence":"Please move the chair beside the table.","expansion":true,"sourceId":"next800-241","batch":5,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in move. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"picture","d":["picture","pacture","bicture","bacture"],"pool":["pacture","bicture","bacture","ficture","facture"],"madeUp":["pacture","bicture","bacture","ficture"],"sentence":"I drew a picture of my dog.","expansion":true,"sourceId":"next800-242","batch":5,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ur” in picture. Listen, then read the whole sentence.","pattern":"letter group ur"}},{"w":"swing","d":["swing","scing","swang","scang"],"pool":["scing","swang","scang","swung","scung"],"madeUp":["scing","scang","scung"],"sentence":"I go back and forth on the swing.","expansion":true,"sourceId":"next800-510","batch":5,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “ng” in swing. Listen, then read the whole sentence.","pattern":"letter group ng"}},{"w":"slide","d":["slide","slade","blide","blade"],"pool":["slade","blide","blade","glide","glade"],"madeUp":["blide"],"sentence":"I go down the slide.","expansion":true,"sourceId":"next800-511","batch":5,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in slide. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"close","d":["close","chose","clase","chase"],"pool":["chose","clase","chase","clese","chese"],"madeUp":["clase","clese","chese"],"sentence":"Please close the door.","expansion":true,"sourceId":"next800-601","batch":5,"group":"Actions and word families","teaching":{"tip":"Look at every letter in close. Listen, say the word, then read the sentence.","pattern":"whole word"},"spoken":"Please close the door."},{"w":"somewhere","d":["somewhere","samewhere","somawhere","samawhere"],"pool":["samewhere","somawhere","samawhere","somiwhere","samiwhere"],"madeUp":["samewhere","somawhere","samawhere","somiwhere","samiwhere"],"sentence":"My hat is somewhere in this room.","expansion":true,"sourceId":"next800-690","batch":5,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look carefully at “er” in somewhere. Listen, then read the whole sentence.","pattern":"letter group er"}},{"w":"giant","d":["giant","geant","biant","beant"],"pool":["geant","biant","beant","hiant","heant"],"madeUp":["geant","biant","heant"],"sentence":"The giant in the story is taller than a house.","expansion":true,"sourceId":"next800-756","batch":5,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look at every letter in giant. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"change","d":["change","crange","chanbe","cranbe"],"pool":["crange","chanbe","cranbe","chance","crance"],"madeUp":["crange","chanbe","cranbe"],"sentence":"I need to change my wet socks.","expansion":true,"sourceId":"next800-243","batch":5,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ch” in change. Listen, then read the whole sentence.","pattern":"letter group ch"}},{"w":"apple","d":["apple","adple","apble","adble"],"pool":["adple","apble","adble","apdle","addle"],"madeUp":["adple","apble","adble","apdle"],"sentence":"I eat a red apple.","expansion":true,"sourceId":"next800-244","batch":5,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in apple. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"football","d":["football","faotball","footcall","faotcall"],"pool":["faotball","footcall","faotcall","footfall","faotfall"],"madeUp":["faotball","footcall","faotcall","faotfall"],"sentence":"We kick a football in the park.","expansion":true,"sourceId":"next800-512","batch":5,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “oo” in football. Listen, then read the whole sentence.","pattern":"letter group oo"}},{"w":"swimming","d":["swimming","scimming","swamming","scamming"],"pool":["scimming","swamming","scamming","swumming","scumming"],"madeUp":["scimming","swamming","scamming","swumming"],"sentence":"The ducks are swimming in the pond.","expansion":true,"sourceId":"next800-513","batch":5,"group":"Home, family, food and school","teaching":{"tip":"Word family: swim → swimming. Read the whole word, including its ending.","family":"swim","pattern":"word ending"}},{"w":"closed","d":["closed","clased","closad","clasad"],"pool":["clased","closad","clasad","closid","clasid"],"madeUp":["clased","closad","clasad","closid","clasid"],"sentence":"The shop is closed today.","expansion":true,"sourceId":"next800-602","batch":5,"group":"Actions and word families","teaching":{"tip":"Word family: close → closed. Read the whole word, including its ending.","family":"close","pattern":"word ending"}},{"w":"anywhere","d":["anywhere","anywhare","enywhere","enywhare"],"pool":["anywhare","enywhere","enywhare","inywhere","inywhare"],"madeUp":["anywhare","enywhere","enywhare","inywhere","inywhare"],"sentence":"I cannot find my shoe anywhere.","expansion":true,"sourceId":"next800-691","batch":5,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look carefully at “er” in anywhere. Listen, then read the whole sentence.","pattern":"letter group er"}},{"w":"witch","d":["witch","watch","citch","catch"],"pool":["watch","citch","catch","ditch","datch"],"madeUp":["citch"],"sentence":"The witch makes a spell in the story.","expansion":true,"sourceId":"next800-757","batch":5,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look carefully at “ch” in witch. Listen, then read the whole sentence.","pattern":"letter group ch"}},{"w":"air","d":["air","aer","eir","eer"],"pool":["aer","eir","eer","oir","oer"],"madeUp":["eir","oir"],"sentence":"A bird flies through the air.","expansion":true,"sourceId":"next800-245","batch":5,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ai” in air. Listen, then read the whole sentence.","pattern":"letter group ai"}},{"w":"animal","d":["animal","abimal","anibal","abibal"],"pool":["abimal","anibal","abibal","anidal","abidal"],"madeUp":["abimal","anibal","abibal","anidal"],"sentence":"A rabbit is a small animal.","expansion":true,"sourceId":"next800-246","batch":5,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in animal. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"bicycle","d":["bicycle","bacycle","cicycle","cacycle"],"pool":["bacycle","cicycle","cacycle","dicycle","dacycle"],"madeUp":["bacycle","cicycle","cacycle","dacycle"],"sentence":"My bicycle has two wheels.","expansion":true,"sourceId":"next800-514","batch":5,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in bicycle. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"bike","d":["bike","bake","fike","fake"],"pool":["bake","fike","fake","hike","hake"],"madeUp":[],"sentence":"I wear a helmet when I ride my bike.","expansion":true,"sourceId":"next800-515","batch":5,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in bike. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"smile","d":["smile","scile","smale","scale"],"pool":["scile","smale","scale","smele","scele"],"madeUp":["scile","smale","smele","scele"],"sentence":"Your smile makes me happy.","expansion":true,"sourceId":"next800-603","batch":5,"group":"Actions and word families","teaching":{"tip":"Look at every letter in smile. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"everywhere","d":["everywhere","evarywhere","averywhere","avarywhere"],"pool":["evarywhere","averywhere","avarywhere","iverywhere","ivarywhere"],"madeUp":["evarywhere","averywhere","avarywhere","iverywhere","ivarywhere"],"sentence":"There are flowers everywhere in the garden.","expansion":true,"sourceId":"next800-692","batch":5,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look carefully at “er” in everywhere. Listen, then read the whole sentence.","pattern":"letter group er"}},{"w":"fairy","d":["fairy","faery","dairy","daery"],"pool":["faery","dairy","daery","hairy","haery"],"madeUp":["daery","haery"],"sentence":"The fairy has tiny wings.","expansion":true,"sourceId":"next800-758","batch":5,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look carefully at “ai” in fairy. Listen, then read the whole sentence.","pattern":"letter group ai"}},{"w":"page","d":["page","pace","cage","cace"],"pool":["pace","cage","cace","fage","face"],"madeUp":["cace"],"sentence":"Turn the page to read more.","expansion":true,"sourceId":"next800-247","batch":5,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in page. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"letter","d":["letter","latter","better","batter"],"pool":["latter","better","batter","fetter","fatter"],"madeUp":[],"sentence":"The first letter of cat is c.","expansion":true,"sourceId":"next800-248","batch":5,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “er” in letter. Listen, then read the whole sentence.","pattern":"letter group er"}},{"w":"bus","d":["bus","bas","bub","bab"],"pool":["bas","bub","bab","bud","bad"],"madeUp":[],"sentence":"The bus takes us to school.","expansion":true,"sourceId":"next800-516","batch":5,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in bus. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"train","d":["train","trein","brain","brein"],"pool":["trein","brain","brein","grain","grein"],"madeUp":["trein","brein"],"sentence":"The train stops at the station.","expansion":true,"sourceId":"next800-517","batch":5,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “ai” in train. Listen, then read the whole sentence.","pattern":"letter group ai"}},{"w":"cry","d":["cry","cly","bry","bly"],"pool":["cly","bry","bly","fry","fly"],"madeUp":["bry","bly"],"sentence":"The baby starts to cry.","expansion":true,"sourceId":"next800-604","batch":5,"group":"Actions and word families","teaching":{"tip":"Look at every letter in cry. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"lots","d":["lots","loss","lats","lass"],"pool":["loss","lats","lass","lets","less"],"madeUp":["loss","lats","lets"],"sentence":"There are lots of books on the shelf.","expansion":true,"sourceId":"next800-693","batch":5,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look at every letter in lots. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"knight","d":["knight","knaght","knibht","knabht"],"pool":["knaght","knibht","knabht","knicht","knacht"],"madeUp":["knaght","knibht","knabht","knicht","knacht"],"sentence":"The knight rides a horse.","expansion":true,"sourceId":"next800-759","batch":5,"group":"Nature, places, adventure and reading","teaching":{"symbol":null,"tip":"The k is silent. Knight sounds like night.","pattern":"tricky spelling or meaning"}},{"w":"answer","d":["answer","answar","enswer","enswar"],"pool":["answar","enswer","enswar","inswer","inswar"],"madeUp":["answar","enswer","enswar","inswer","inswar"],"sentence":"I know the answer to your question.","expansion":true,"sourceId":"next800-249","batch":5,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “er” in answer. Listen, then read the whole sentence.","pattern":"letter group er"}},{"w":"learn","d":["learn","liarn","learb","liarb"],"pool":["liarn","learb","liarb","leard","liard"],"madeUp":["liarn","learb","liarb","leard"],"sentence":"We learn something new at school.","expansion":true,"sourceId":"next800-250","batch":5,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ar” in learn. Listen, then read the whole sentence.","pattern":"letter group ar"}},{"w":"truck","d":["truck","track","bruck","brack"],"pool":["track","bruck","brack","cruck","crack"],"madeUp":["bruck"],"sentence":"The truck carries a heavy load.","expansion":true,"sourceId":"next800-518","batch":5,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in truck. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"plane","d":["plane","plone","place","ploce"],"pool":["plone","place","ploce","plage","ploge"],"madeUp":["plone","ploge"],"sentence":"The plane flies high in the sky.","expansion":true,"sourceId":"next800-519","batch":5,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in plane. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"shout","d":["shout","scout","shoat","scoat"],"pool":["scout","shoat","scoat","shoot","scoot"],"madeUp":["scoat"],"sentence":"We shout to be heard across the field.","expansion":true,"sourceId":"next800-605","batch":5,"group":"Actions and word families","teaching":{"tip":"Look carefully at “sh” in shout. Listen, then read the whole sentence.","pattern":"letter group sh"}},{"w":"really","d":["really","rually","beally","bually"],"pool":["rually","beally","bually","deally","dually"],"madeUp":["rually","beally","bually","deally"],"sentence":"I really like this story.","expansion":true,"sourceId":"next800-694","batch":5,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look carefully at “ea” in really. Listen, then read the whole sentence.","pattern":"letter group ea"}},{"w":"prince","d":["prince","prance","brince","brance"],"pool":["prance","brince","brance","crince","crance"],"madeUp":["brince","brance","crince"],"sentence":"The prince lives in the castle.","expansion":true,"sourceId":"next800-760","batch":5,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look at every letter in prince. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"world","d":["world","warld","borld","barld"],"pool":["warld","borld","barld","corld","carld"],"madeUp":["warld","borld","barld","corld","carld"],"sentence":"People live all around the world.","expansion":true,"sourceId":"next800-251","batch":5,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “or” in world. Listen, then read the whole sentence.","pattern":"letter group or"}},{"w":"high","d":["high","hich","hegh","hech"],"pool":["hich","hegh","hech","hugh","huch"],"madeUp":["hich","hegh","huch"],"sentence":"The bird flies high above the tree.","expansion":true,"sourceId":"next800-252","batch":5,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “igh” in high. Listen, then read the whole sentence.","pattern":"letter group igh"}},{"w":"driver","d":["driver","draver","briver","braver"],"pool":["draver","briver","braver","criver","craver"],"madeUp":["draver","briver","criver"],"sentence":"The driver stops the bus.","expansion":true,"sourceId":"next800-520","batch":5,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “er” in driver. Listen, then read the whole sentence.","pattern":"letter group er"}},{"w":"station","d":["station","stetion","stabion","stebion"],"pool":["stetion","stabion","stebion","stadion","stedion"],"madeUp":["stetion","stabion","stebion","stedion"],"sentence":"We wait for the train at the station.","expansion":true,"sourceId":"next800-521","batch":5,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in station. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"whisper","d":["whisper","whasper","whispar","whaspar"],"pool":["whasper","whispar","whaspar","whispir","whaspir"],"madeUp":["whasper","whispar","whaspar","whispir","whaspir"],"sentence":"I whisper so the baby can sleep.","expansion":true,"sourceId":"next800-606","batch":5,"group":"Actions and word families","teaching":{"tip":"Look carefully at “er” in whisper. Listen, then read the whole sentence.","pattern":"letter group er"}},{"w":"nearly","d":["nearly","naarly","bearly","baarly"],"pool":["naarly","bearly","baarly","dearly","daarly"],"madeUp":["naarly","bearly","baarly","daarly"],"sentence":"We are nearly home.","expansion":true,"sourceId":"next800-695","batch":5,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look carefully at “ar” in nearly. Listen, then read the whole sentence.","pattern":"letter group ar"}},{"w":"princess","d":["princess","prancess","princass","prancass"],"pool":["prancess","princass","prancass","princiss","pranciss"],"madeUp":["prancess","princass","prancass","princiss","pranciss"],"sentence":"The princess helps the lost dragon.","expansion":true,"sourceId":"next800-761","batch":5,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look at every letter in princess. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"near","d":["near","neer","dear","deer"],"pool":["neer","dear","deer","fear","feer"],"madeUp":[],"sentence":"Sit near me so you can see the book.","expansion":true,"sourceId":"next800-253","batch":5,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ar” in near. Listen, then read the whole sentence.","pattern":"letter group ar"}},{"w":"plant","d":["plant","plent","blant","blent"],"pool":["plent","blant","blent","glant","glent"],"madeUp":["plent","blant","glant"],"sentence":"We water the little plant.","expansion":true,"sourceId":"next800-254","batch":5,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in plant. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"ticket","d":["ticket","tacket","bicket","backet"],"pool":["tacket","bicket","backet","cicket","cacket"],"madeUp":["bicket","cicket","cacket"],"sentence":"We show our ticket to get on the train.","expansion":true,"sourceId":"next800-522","batch":5,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in ticket. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"wheel","d":["wheel","whael","wheal","whaal"],"pool":["whael","wheal","whaal","wheil","whail"],"madeUp":["whael","whaal","wheil","whail"],"sentence":"The wheel goes round and round.","expansion":true,"sourceId":"next800-523","batch":5,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “ee” in wheel. Listen, then read the whole sentence.","pattern":"letter group ee"}},{"w":"whispered","d":["whispered","whaspered","whispared","whaspared"],"pool":["whaspered","whispared","whaspared","whispired","whaspired"],"madeUp":["whaspered","whispared","whaspared","whispired","whaspired"],"sentence":"She whispered a secret to me.","expansion":true,"sourceId":"next800-607","batch":5,"group":"Actions and word families","teaching":{"tip":"Word family: whisper → whispered. Read the whole word, including its ending.","family":"whisper","pattern":"word ending"}},{"w":"often","d":["often","octen","oftan","octan"],"pool":["octen","oftan","octan","oftin","octin"],"madeUp":["octen","oftan","oftin","octin"],"sentence":"We often read before bed.","expansion":true,"sourceId":"next800-696","batch":5,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look at every letter in often. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"hero","d":["hero","haro","cero","caro"],"pool":["haro","cero","caro","fero","faro"],"madeUp":["haro","fero"],"sentence":"The hero helps everyone get home.","expansion":true,"sourceId":"next800-762","batch":5,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look carefully at “er” in hero. Listen, then read the whole sentence.","pattern":"letter group er"}},{"w":"last","d":["last","lest","bast","best"],"pool":["lest","bast","best","cast","cest"],"madeUp":[],"sentence":"I ate the last apple.","expansion":true,"sourceId":"next800-255","batch":5,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in last. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"eye","d":["eye","eae","aye","aae"],"pool":["eae","aye","aae","iye","iae"],"madeUp":["eae","aae","iye","iae"],"sentence":"I have something in my eye.","expansion":true,"sourceId":"next800-256","batch":5,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in eye. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"engine","d":["engine","endine","angine","andine"],"pool":["endine","angine","andine","ongine","ondine"],"madeUp":["endine","angine","ongine"],"sentence":"The engine helps the train move.","expansion":true,"sourceId":"next800-524","batch":5,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “ng” in engine. Listen, then read the whole sentence.","pattern":"letter group ng"}},{"w":"hospital","d":["hospital","haspital","hospatal","haspatal"],"pool":["haspital","hospatal","haspatal","hospetal","haspetal"],"madeUp":["haspital","hospatal","haspatal","hospetal","haspetal"],"sentence":"The hospital cares for sick people.","expansion":true,"sourceId":"next800-525","batch":5,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in hospital. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"listening","d":["listening","lastening","bistening","bastening"],"pool":["lastening","bistening","bastening","fistening","fastening"],"madeUp":["lastening","bistening","bastening","fistening"],"sentence":"We are listening to a story.","expansion":true,"sourceId":"next800-608","batch":5,"group":"Actions and word families","teaching":{"tip":"Word family: listen → listening. Read the whole word, including its ending.","family":"listen","pattern":"word ending"}},{"w":"usually","d":["usually","usaally","asually","asaally"],"pool":["usaally","asually","asaally","esually","esaally"],"madeUp":["usaally","asually","asaally","esually","esaally"],"sentence":"I usually walk to school.","expansion":true,"sourceId":"next800-697","batch":5,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look at every letter in usually. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"crown","d":["crown","crawn","brown","brawn"],"pool":["crawn","brown","brawn","frown","frawn"],"madeUp":["crawn"],"sentence":"The queen wears a crown.","expansion":true,"sourceId":"next800-763","batch":5,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look carefully at “ow” in crown. Listen, then read the whole sentence.","pattern":"letter group ow"}},{"w":"thought","d":["thought","thaught","thoaght","thaaght"],"pool":["thaught","thoaght","thaaght","thoeght","thaeght"],"madeUp":["thoaght","thaaght","thoeght","thaeght"],"sentence":"I thought the box was empty.","expansion":true,"sourceId":"next800-257","batch":5,"group":"Everyday story essentials","teaching":{"tip":"Word family: think → thought. Notice how the spelling changes.","family":"think","pattern":"changed word form"}},{"w":"head","d":["head","haad","heab","haab"],"pool":["haad","heab","haab","heaf","haaf"],"madeUp":["haad","heab"],"sentence":"I put a hat on my head.","expansion":true,"sourceId":"next800-258","batch":5,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ea” in head. Listen, then read the whole sentence.","pattern":"letter group ea"}},{"w":"doctor","d":["doctor","dobtor","dector","debtor"],"pool":["dobtor","dector","debtor","ductor","dubtor"],"madeUp":["dobtor","dector","dubtor"],"sentence":"The doctor helps me feel better.","expansion":true,"sourceId":"next800-526","batch":5,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “or” in doctor. Listen, then read the whole sentence.","pattern":"letter group or"}},{"w":"nurse","d":["nurse","narse","burse","barse"],"pool":["narse","burse","barse","curse","carse"],"madeUp":["narse"],"sentence":"The nurse puts a bandage on my knee.","expansion":true,"sourceId":"next800-527","batch":5,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “ur” in nurse. Listen, then read the whole sentence.","pattern":"letter group ur"}},{"w":"wanted","d":["wanted","wonted","canted","conted"],"pool":["wonted","canted","conted","fanted","fonted"],"madeUp":["conted","fanted"],"sentence":"I wanted to play outside.","expansion":true,"sourceId":"next800-609","batch":6,"group":"Actions and word families","teaching":{"tip":"Word family: want → wanted. Read the whole word, including its ending.","family":"want","pattern":"word ending"}},{"w":"finally","d":["finally","fanally","binally","banally"],"pool":["fanally","binally","banally","cinally","canally"],"madeUp":["fanally","binally","cinally","canally"],"sentence":"We finally found the missing key.","expansion":true,"sourceId":"next800-698","batch":6,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look at every letter in finally. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"gold","d":["gold","geld","bold","beld"],"pool":["geld","bold","beld","hold","held"],"madeUp":[],"sentence":"The ring is made of gold.","expansion":true,"sourceId":"next800-764","batch":6,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look at every letter in gold. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"wild","d":["wild","weld","bild","beld"],"pool":["weld","bild","beld","gild","geld"],"madeUp":["bild"],"sentence":"The wild rabbit lives in the woods.","expansion":true,"sourceId":"next800-259","batch":6,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in wild. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"story","d":["story","stary","stocy","stacy"],"pool":["stary","stocy","stacy","stogy","stagy"],"madeUp":["stocy"],"sentence":"Please read me a story.","expansion":true,"sourceId":"next800-260","batch":6,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “or” in story. Listen, then read the whole sentence.","pattern":"letter group or"}},{"w":"shop","d":["shop","shap","shod","shad"],"pool":["shap","shod","shad","shog","shag"],"madeUp":[],"sentence":"We buy bread at the shop.","expansion":true,"sourceId":"next800-528","batch":6,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “sh” in shop. Listen, then read the whole sentence.","pattern":"letter group sh"}},{"w":"money","d":["money","maney","boney","baney"],"pool":["maney","boney","baney","doney","daney"],"madeUp":["baney","daney"],"sentence":"We use money to pay for food.","expansion":true,"sourceId":"next800-529","batch":6,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in money. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"played","d":["played","pleyed","playad","pleyad"],"pool":["pleyed","playad","pleyad","playid","pleyid"],"madeUp":["pleyed","playad","pleyad","playid","pleyid"],"sentence":"We played in the garden.","expansion":true,"sourceId":"next800-610","batch":6,"group":"Actions and word families","teaching":{"tip":"Word family: play → played. Read the whole word, including its ending.","family":"play","pattern":"word ending"}},{"w":"later","d":["later","liter","bater","biter"],"pool":["liter","bater","biter","cater","citer"],"madeUp":[],"sentence":"We will play outside later.","expansion":true,"sourceId":"next800-699","batch":6,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look carefully at “er” in later. Listen, then read the whole sentence.","pattern":"letter group er"}},{"w":"adventure","d":["adventure","advanture","edventure","edvanture"],"pool":["advanture","edventure","edvanture","idventure","idvanture"],"madeUp":["advanture","edventure","edvanture","idventure","idvanture"],"sentence":"Our adventure begins in the forest.","expansion":true,"sourceId":"next800-765","batch":6,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look carefully at “ur” in adventure. Listen, then read the whole sentence.","pattern":"letter group ur"}},{"w":"next","d":["next","nest","bext","best"],"pool":["nest","bext","best","cext","cest"],"madeUp":["bext","cext"],"sentence":"We will read the next page.","expansion":true,"sourceId":"next800-261","batch":6,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in next. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"hard","d":["hard","hand","bard","band"],"pool":["hand","bard","band","card","cand"],"madeUp":[],"sentence":"The stone feels hard.","expansion":true,"sourceId":"next800-262","batch":6,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ar” in hard. Listen, then read the whole sentence.","pattern":"letter group ar"}},{"w":"price","d":["price","prace","brice","brace"],"pool":["prace","brice","brace","grice","grace"],"madeUp":["prace","brice"],"sentence":"The price tells us how much the toy costs.","expansion":true,"sourceId":"next800-530","batch":6,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in price. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"pay","d":["pay","poy","bay","boy"],"pool":["poy","bay","boy","cay","coy"],"madeUp":[],"sentence":"We pay for the apples at the shop.","expansion":true,"sourceId":"next800-531","batch":6,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “ay” in pay. Listen, then read the whole sentence.","pattern":"letter group ay"}},{"w":"playing","d":["playing","ploying","blaying","bloying"],"pool":["ploying","blaying","bloying","claying","cloying"],"madeUp":["ploying","blaying","bloying","claying"],"sentence":"The children are playing together.","expansion":true,"sourceId":"next800-611","batch":6,"group":"Actions and word families","teaching":{"tip":"Word family: play → playing. Read the whole word, including its ending.","family":"play","pattern":"word ending"}},{"w":"yesterday","d":["yesterday","yasterday","yestarday","yastarday"],"pool":["yasterday","yestarday","yastarday","yestirday","yastirday"],"madeUp":["yasterday","yestarday","yastarday","yestirday","yastirday"],"sentence":"We went to the park yesterday.","expansion":true,"sourceId":"next800-700","batch":6,"group":"Descriptions, feelings and story connections","teaching":{"tip":"A day of the week. Its name starts with a capital letter.","pattern":"day name"}},{"w":"journey","d":["journey","jaurney","joarney","jaarney"],"pool":["jaurney","joarney","jaarney","joerney","jaerney"],"madeUp":["jaurney","joarney","jaarney","joerney","jaerney"],"sentence":"We pack a bag for the long journey.","expansion":true,"sourceId":"next800-766","batch":6,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look carefully at “ou” in journey. Listen, then read the whole sentence.","pattern":"letter group ou"}},{"w":"begin","d":["begin","bogin","began","bogan"],"pool":["bogin","began","bogan","begun","bogun"],"madeUp":["bogin","bogun"],"sentence":"We can begin the game now.","expansion":true,"sourceId":"next800-263","batch":6,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in begin. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"life","d":["life","lafe","lice","lace"],"pool":["lafe","lice","lace","lide","lade"],"madeUp":["lafe"],"sentence":"A butterfly starts its life as an egg.","expansion":true,"sourceId":"next800-264","batch":6,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in life. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"bought","d":["bought","baught","cought","caught"],"pool":["baught","cought","caught","dought","daught"],"madeUp":["baught","cought","daught"],"sentence":"We bought milk and bread.","expansion":true,"sourceId":"next800-532","batch":6,"group":"Home, family, food and school","teaching":{"tip":"Word family: buy → bought. Notice how the spelling changes.","family":"buy","pattern":"changed word form"}},{"w":"sell","d":["sell","sill","bell","bill"],"pool":["sill","bell","bill","dell","dill"],"madeUp":[],"sentence":"They sell fruit at the market.","expansion":true,"sourceId":"next800-533","batch":6,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in sell. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"finish","d":["finish","fanish","binish","banish"],"pool":["fanish","binish","banish","dinish","danish"],"madeUp":["fanish","binish","dinish"],"sentence":"We will finish the puzzle together.","expansion":true,"sourceId":"next800-612","batch":6,"group":"Actions and word families","teaching":{"tip":"Look carefully at “sh” in finish. Listen, then read the whole sentence.","pattern":"letter group sh"}},{"w":"tomorrow","d":["tomorrow","tamorrow","tomarrow","tamarrow"],"pool":["tamorrow","tomarrow","tamarrow","tomerrow","tamerrow"],"madeUp":["tamorrow","tomarrow","tamarrow","tomerrow","tamerrow"],"sentence":"We will visit Grandma tomorrow.","expansion":true,"sourceId":"next800-701","batch":6,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look carefully at “ow” in tomorrow. Listen, then read the whole sentence.","pattern":"letter group ow"}},{"w":"problem","d":["problem","prablem","problam","prablam"],"pool":["prablem","problam","prablam","problim","prablim"],"madeUp":["prablem","problam","prablam","problim","prablim"],"sentence":"We work together to solve the problem.","expansion":true,"sourceId":"next800-767","batch":6,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look at every letter in problem. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"paper","d":["paper","piper","caper","ciper"],"pool":["piper","caper","ciper","gaper","giper"],"madeUp":["ciper","giper"],"sentence":"I draw on a sheet of paper.","expansion":true,"sourceId":"next800-265","batch":6,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “er” in paper. Listen, then read the whole sentence.","pattern":"letter group er"}},{"w":"dress","d":["dress","dross","cress","cross"],"pool":["dross","cress","cross","gress","gross"],"madeUp":["gress"],"sentence":"My sister wears a yellow dress.","expansion":true,"sourceId":"next800-266","batch":6,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in dress. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"farmer","d":["farmer","former","farcer","forcer"],"pool":["former","farcer","forcer","farger","forger"],"madeUp":["farger"],"sentence":"The farmer looks after the sheep.","expansion":true,"sourceId":"next800-534","batch":6,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “ar” in farmer. Listen, then read the whole sentence.","pattern":"letter group ar"}},{"w":"hen","d":["hen","han","ben","ban"],"pool":["han","ben","ban","den","dan"],"madeUp":[],"sentence":"The hen lays an egg.","expansion":true,"sourceId":"next800-535","batch":6,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in hen. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"tried","d":["tried","treed","cried","creed"],"pool":["treed","cried","creed","fried","freed"],"madeUp":[],"sentence":"I tried to reach the apple.","expansion":true,"sourceId":"next800-613","batch":6,"group":"Actions and word families","teaching":{"tip":"Word family: try → tried. Read the whole word, including its ending.","family":"try","pattern":"word ending"}},{"w":"tonight","d":["tonight","tenight","bonight","benight"],"pool":["tenight","bonight","benight","conight","cenight"],"madeUp":["tenight","bonight","conight","cenight"],"sentence":"We will look at the stars tonight.","expansion":true,"sourceId":"next800-702","batch":6,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look carefully at “igh” in tonight. Listen, then read the whole sentence.","pattern":"letter group igh"}},{"w":"plan","d":["plan","plen","blan","blen"],"pool":["plen","blan","blen","clan","clen"],"madeUp":["plen","blen","clen"],"sentence":"Our plan is to cross the river by boat.","expansion":true,"sourceId":"next800-768","batch":6,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look at every letter in plan. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"children","d":["children","chaldren","childran","chaldran"],"pool":["chaldren","childran","chaldran","childrin","chaldrin"],"madeUp":["chaldren","childran","chaldran","childrin","chaldrin"],"sentence":"The children play in the park.","expansion":true,"sourceId":"next800-267","batch":6,"group":"Everyday story essentials","teaching":{"tip":"Word family: child → children. Notice how the spelling changes.","family":"child","pattern":"changed word form"}},{"w":"side","d":["side","sade","bide","bade"],"pool":["sade","bide","bade","fide","fade"],"madeUp":[],"sentence":"The dog walks by my side.","expansion":true,"sourceId":"next800-268","batch":6,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in side. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"duck","d":["duck","deck","buck","beck"],"pool":["deck","buck","beck","huck","heck"],"madeUp":[],"sentence":"The duck swims on the pond.","expansion":true,"sourceId":"next800-536","batch":6,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in duck. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"sheep","d":["sheep","sleep","shaep","slaep"],"pool":["sleep","shaep","slaep","shiep","sliep"],"madeUp":["shaep","slaep","shiep","sliep"],"sentence":"The sheep has a woolly coat.","expansion":true,"sourceId":"next800-537","batch":6,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “ee” in sheep. Listen, then read the whole sentence.","pattern":"letter group ee"}},{"w":"bake","d":["bake","bike","fake","fike"],"pool":["bike","fake","fike","hake","hike"],"madeUp":[],"sentence":"We bake bread in the oven.","expansion":true,"sourceId":"next800-614","batch":6,"group":"Actions and word families","teaching":{"tip":"Look at every letter in bake. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"midnight","d":["midnight","madnight","midnaght","madnaght"],"pool":["madnight","midnaght","madnaght","midneght","madneght"],"madeUp":["madnight","midnaght","madnaght","midneght","madneght"],"sentence":"We are usually asleep at midnight.","expansion":true,"sourceId":"next800-703","batch":6,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look carefully at “igh” in midnight. Listen, then read the whole sentence.","pattern":"letter group igh"}},{"w":"idea","d":["idea","idaa","adea","adaa"],"pool":["idaa","adea","adaa","edea","edaa"],"madeUp":["idaa","adea","adaa","edaa"],"sentence":"I have an idea for a new game.","expansion":true,"sourceId":"next800-769","batch":6,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look carefully at “ea” in idea. Listen, then read the whole sentence.","pattern":"letter group ea"}},{"w":"began","d":["began","bogan","begin","bogin"],"pool":["bogan","begin","bogin","begun","bogun"],"madeUp":["bogin","bogun"],"sentence":"The rain began after lunch.","expansion":true,"sourceId":"next800-269","batch":6,"group":"Everyday story essentials","teaching":{"tip":"Word family: begin → began. Notice how the spelling changes.","family":"begin","pattern":"changed word form"}},{"w":"took","d":["took","toak","book","boak"],"pool":["toak","book","boak","cook","coak"],"madeUp":["toak","boak"],"sentence":"I took my book to school.","expansion":true,"sourceId":"next800-270","batch":6,"group":"Everyday story essentials","teaching":{"tip":"Word family: take → took. Notice how the spelling changes.","family":"take","pattern":"changed word form"}},{"w":"cow","d":["cow","caw","bow","baw"],"pool":["caw","bow","baw","dow","daw"],"madeUp":[],"sentence":"The cow eats grass.","expansion":true,"sourceId":"next800-538","batch":6,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “ow” in cow. Listen, then read the whole sentence.","pattern":"letter group ow"}},{"w":"goat","d":["goat","gout","boat","bout"],"pool":["gout","boat","bout","doat","dout"],"madeUp":[],"sentence":"The goat climbs on a rock.","expansion":true,"sourceId":"next800-539","batch":6,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “oa” in goat. Listen, then read the whole sentence.","pattern":"letter group oa"}},{"w":"drew","d":["drew","draw","brew","braw"],"pool":["draw","brew","braw","crew","craw"],"madeUp":[],"sentence":"I drew a picture of a dog.","expansion":true,"sourceId":"next800-615","batch":6,"group":"Actions and word families","teaching":{"tip":"Word family: draw → drew. Notice how the spelling changes.","family":"draw","pattern":"changed word form"}},{"w":"weekend","d":["weekend","waekend","weakend","waakend"],"pool":["waekend","weakend","waakend","weikend","waikend"],"madeUp":["waekend","weakend","waakend","weikend","waikend"],"sentence":"We visit our friends at the weekend.","expansion":true,"sourceId":"next800-704","batch":6,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look carefully at “ee” in weekend. Listen, then read the whole sentence.","pattern":"letter group ee"}},{"w":"clue","d":["clue","clee","blue","blee"],"pool":["clee","blue","blee","flue","flee"],"madeUp":[],"sentence":"The footprint is a clue to where the dog went.","expansion":true,"sourceId":"next800-770","batch":6,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look at every letter in clue. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"foot","d":["foot","foat","boot","boat"],"pool":["foat","boot","boat","coot","coat"],"madeUp":["foat"],"sentence":"I have a sock on one foot.","expansion":true,"sourceId":"next800-271","batch":6,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “oo” in foot. Listen, then read the whole sentence.","pattern":"letter group oo"}},{"w":"hear","d":["hear","heer","dear","deer"],"pool":["heer","dear","deer","fear","feer"],"madeUp":[],"sentence":"I can hear a bird singing.","expansion":true,"sourceId":"next800-272","batch":6,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ar” in hear. Listen, then read the whole sentence.","pattern":"letter group ar"}},{"w":"pony","d":["pony","poby","dony","doby"],"pool":["poby","dony","doby","gony","goby"],"madeUp":["poby","dony","gony"],"sentence":"The pony is smaller than the horse.","expansion":true,"sourceId":"next800-540","batch":6,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in pony. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"mouse","d":["mouse","moose","bouse","boose"],"pool":["moose","bouse","boose","douse","doose"],"madeUp":["doose"],"sentence":"The little mouse eats a seed.","expansion":true,"sourceId":"next800-541","batch":6,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “ou” in mouse. Listen, then read the whole sentence.","pattern":"letter group ou"}},{"w":"writing","d":["writing","wrating","briting","brating"],"pool":["wrating","briting","brating","griting","grating"],"madeUp":["wrating","briting","brating","griting"],"sentence":"I am writing my name.","expansion":true,"sourceId":"next800-616","batch":6,"group":"Actions and word families","teaching":{"symbol":null,"tip":"The w is silent, as in write.","pattern":"tricky spelling or meaning"}},{"w":"month","d":["month","munth","monbh","munbh"],"pool":["munth","monbh","munbh","monch","munch"],"madeUp":["munth","monbh","munbh","monch"],"sentence":"My birthday is next month.","expansion":true,"sourceId":"next800-705","batch":6,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look carefully at “th” in month. Listen, then read the whole sentence.","pattern":"letter group th"}},{"w":"secret","d":["secret","sacret","secreb","sacreb"],"pool":["sacret","secreb","sacreb","secred","sacred"],"madeUp":["sacret","secreb","sacreb","secred"],"sentence":"The story has a secret door.","expansion":true,"sourceId":"next800-771","batch":6,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look at every letter in secret. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"late","d":["late","lite","bate","bite"],"pool":["lite","bate","bite","cate","cite"],"madeUp":[],"sentence":"We are late for school.","expansion":true,"sourceId":"next800-273","batch":6,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in late. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"face","d":["face","fice","bace","bice"],"pool":["fice","bace","bice","dace","dice"],"madeUp":["bace"],"sentence":"Wash your face with warm water.","expansion":true,"sourceId":"next800-274","batch":6,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in face. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"mice","d":["mice","mace","dice","dace"],"pool":["mace","dice","dace","fice","face"],"madeUp":[],"sentence":"Two mice hide under the floor.","expansion":true,"sourceId":"next800-542","batch":6,"group":"Home, family, food and school","teaching":{"tip":"Word family: mouse → mice. Notice how the spelling changes.","family":"mouse","pattern":"changed word form"}},{"w":"kitten","d":["kitten","katten","bitten","batten"],"pool":["katten","bitten","batten","fitten","fatten"],"madeUp":["katten"],"sentence":"The kitten is a young cat.","expansion":true,"sourceId":"next800-543","batch":6,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in kitten. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"reading","d":["reading","roading","beading","boading"],"pool":["roading","beading","boading","deading","doading"],"madeUp":["boading","doading"],"sentence":"We are reading a book together.","expansion":true,"sourceId":"next800-617","batch":6,"group":"Actions and word families","teaching":{"tip":"Word family: read → reading. Read the whole word, including its ending.","family":"read","pattern":"word ending"},"spoken":"We are reading a book together."},{"w":"season","d":["season","seison","beason","beison"],"pool":["seison","beason","beison","geason","geison"],"madeUp":["seison","beason","beison"],"sentence":"Spring is the season after winter.","expansion":true,"sourceId":"next800-706","batch":6,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look carefully at “ea” in season. Listen, then read the whole sentence.","pattern":"letter group ea"}},{"w":"mistake","d":["mistake","mastake","mistabe","mastabe"],"pool":["mastake","mistabe","mastabe","mistage","mastage"],"madeUp":["mastake","mistabe","mastabe","mistage"],"sentence":"It is all right to make a mistake.","expansion":true,"sourceId":"next800-772","batch":6,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look at every letter in mistake. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"bed","d":["bed","bad","fed","fad"],"pool":["bad","fed","fad","ged","gad"],"madeUp":[],"sentence":"I sleep in my bed.","expansion":true,"sourceId":"next800-275","batch":6,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in bed. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"young","d":["young","yaung","yoang","yaang"],"pool":["yaung","yoang","yaang","yoeng","yaeng"],"madeUp":["yaung","yoang","yaang","yoeng","yaeng"],"sentence":"The young puppy is very small.","expansion":true,"sourceId":"next800-276","batch":6,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ng” in young. Listen, then read the whole sentence.","pattern":"letter group ng"}},{"w":"puppy","d":["puppy","pappy","cuppy","cappy"],"pool":["pappy","cuppy","cappy","guppy","gappy"],"madeUp":[],"sentence":"The puppy is a young dog.","expansion":true,"sourceId":"next800-544","batch":6,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in puppy. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"pet","d":["pet","pat","bet","bat"],"pool":["pat","bet","bat","get","gat"],"madeUp":[],"sentence":"We take good care of our pet.","expansion":true,"sourceId":"next800-545","batch":6,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in pet. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"build","d":["build","biild","buald","biald"],"pool":["biild","buald","biald","bueld","bield"],"madeUp":["biild","buald","biald","bueld"],"sentence":"We build a tower with blocks.","expansion":true,"sourceId":"next800-618","batch":6,"group":"Actions and word families","teaching":{"tip":"Look at every letter in build. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"summer","d":["summer","sammer","bummer","bammer"],"pool":["sammer","bummer","bammer","gummer","gammer"],"madeUp":["bammer"],"sentence":"We play outside in summer.","expansion":true,"sourceId":"next800-707","batch":6,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look carefully at “er” in summer. Listen, then read the whole sentence.","pattern":"letter group er"}},{"w":"trouble","d":["trouble","trauble","troable","traable"],"pool":["trauble","troable","traable","troeble","traeble"],"madeUp":["trauble","troable","traable","troeble","traeble"],"sentence":"The stuck kitten is in trouble.","expansion":true,"sourceId":"next800-773","batch":6,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look carefully at “ou” in trouble. Listen, then read the whole sentence.","pattern":"letter group ou"}},{"w":"talk","d":["talk","tack","balk","back"],"pool":["tack","balk","back","calk","cack"],"madeUp":[],"sentence":"We talk about our day.","expansion":true,"sourceId":"next800-277","batch":6,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in talk. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"song","d":["song","sang","bong","bang"],"pool":["sang","bong","bang","dong","dang"],"madeUp":[],"sentence":"We sing a happy song.","expansion":true,"sourceId":"next800-278","batch":6,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ng” in song. Listen, then read the whole sentence.","pattern":"letter group ng"}},{"w":"elephant","d":["elephant","eliphant","alephant","aliphant"],"pool":["eliphant","alephant","aliphant","olephant","oliphant"],"madeUp":["eliphant","alephant","aliphant","olephant"],"sentence":"The elephant has a long trunk.","expansion":true,"sourceId":"next800-546","batch":6,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in elephant. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"monkey","d":["monkey","minkey","bonkey","binkey"],"pool":["minkey","bonkey","binkey","donkey","dinkey"],"madeUp":["minkey","bonkey","binkey"],"sentence":"The monkey climbs a tree.","expansion":true,"sourceId":"next800-547","batch":6,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in monkey. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"break","d":["break","broak","creak","croak"],"pool":["broak","creak","croak","freak","froak"],"madeUp":["broak","froak"],"sentence":"Do not let the cup break.","expansion":true,"sourceId":"next800-619","batch":6,"group":"Actions and word families","teaching":{"tip":"Look carefully at “ea” in break. Listen, then read the whole sentence.","pattern":"letter group ea"}},{"w":"autumn","d":["autumn","aatumn","eutumn","eatumn"],"pool":["aatumn","eutumn","eatumn","iutumn","iatumn"],"madeUp":["aatumn","eutumn","eatumn","iutumn","iatumn"],"sentence":"Some trees lose their leaves in autumn.","expansion":true,"sourceId":"next800-708","batch":6,"group":"Descriptions, feelings and story connections","teaching":{"tip":"Look at every letter in autumn. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"trap","d":["trap","trip","drap","drip"],"pool":["trip","drap","drip","frap","frip"],"madeUp":["drap","frip"],"sentence":"The story's hero opens the trap to free the fox.","expansion":true,"sourceId":"next800-774","batch":6,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look at every letter in trap. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"leave","d":["leave","loave","deave","doave"],"pool":["loave","deave","doave","geave","goave"],"madeUp":["doave","geave"],"sentence":"We will leave after breakfast.","expansion":true,"sourceId":"next800-279","batch":6,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ea” in leave. Listen, then read the whole sentence.","pattern":"letter group ea"}},{"w":"mouth","d":["mouth","mooth","bouth","booth"],"pool":["mooth","bouth","booth","couth","cooth"],"madeUp":["bouth","cooth"],"sentence":"Open your mouth to take a bite.","expansion":true,"sourceId":"next800-280","batch":6,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “th” in mouth. Listen, then read the whole sentence.","pattern":"letter group th"}},{"w":"tiger","d":["tiger","ticer","ciger","cicer"],"pool":["ticer","ciger","cicer","diger","dicer"],"madeUp":["ciger","diger"],"sentence":"The tiger has dark stripes.","expansion":true,"sourceId":"next800-548","batch":6,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “er” in tiger. Listen, then read the whole sentence.","pattern":"letter group er"}},{"w":"whale","d":["whale","whase","while","whise"],"pool":["whase","while","whise","whole","whose"],"madeUp":["whise"],"sentence":"The whale swims in the ocean.","expansion":true,"sourceId":"next800-549","batch":6,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in whale. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"broke","d":["broke","brake","croke","crake"],"pool":["brake","croke","crake","droke","drake"],"madeUp":["croke","droke"],"sentence":"The stick broke in half.","expansion":true,"sourceId":"next800-620","batch":6,"group":"Actions and word families","teaching":{"tip":"Word family: break → broke. Notice how the spelling changes.","family":"break","pattern":"changed word form"}},{"w":"Monday","d":["Monday","Minday","Mobday","Mibday"],"pool":["Minday","Mobday","Mibday","Modday","Midday"],"madeUp":["Minday","Mobday","Mibday","Modday"],"sentence":"Monday comes after Sunday.","expansion":true,"sourceId":"next800-709","batch":6,"group":"Descriptions, feelings and story connections","teaching":{"tip":"A day of the week. Its name starts with a capital letter.","pattern":"day name"}},{"w":"trick","d":["trick","track","brick","brack"],"pool":["track","brick","brack","crick","crack"],"madeUp":[],"sentence":"The magician shows us a trick.","expansion":true,"sourceId":"next800-775","batch":6,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look at every letter in trick. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"family","d":["family","fomily","gamily","gomily"],"pool":["fomily","gamily","gomily","hamily","homily"],"madeUp":["fomily","gomily","hamily"],"sentence":"My family eats dinner together.","expansion":true,"sourceId":"next800-281","batch":6,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in family. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"afternoon","d":["afternoon","aftarnoon","efternoon","eftarnoon"],"pool":["aftarnoon","efternoon","eftarnoon","ifternoon","iftarnoon"],"madeUp":["aftarnoon","efternoon","eftarnoon","ifternoon","iftarnoon"],"sentence":"We go to the park in the afternoon.","expansion":true,"sourceId":"next800-282","batch":6,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “oo” in afternoon. Listen, then read the whole sentence.","pattern":"letter group oo"}},{"w":"spider","d":["spider","shider","spader","shader"],"pool":["shider","spader","shader","spoder","shoder"],"madeUp":["shider","spoder"],"sentence":"A spider has eight legs.","expansion":true,"sourceId":"next800-550","batch":6,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “er” in spider. Listen, then read the whole sentence.","pattern":"letter group er"}},{"w":"ant","d":["ant","aft","ent","eft"],"pool":["aft","ent","eft","ont","oft"],"madeUp":["ent","ont"],"sentence":"The tiny ant carries a crumb.","expansion":true,"sourceId":"next800-551","batch":6,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in ant. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"fallen","d":["fallen","fellen","ballen","bellen"],"pool":["fellen","ballen","bellen","hallen","hellen"],"madeUp":["ballen","bellen","hallen"],"sentence":"A leaf has fallen from the tree.","expansion":true,"sourceId":"next800-621","batch":6,"group":"Actions and word families","teaching":{"tip":"Word family: fall → fallen. Notice how the spelling changes.","family":"fall","pattern":"changed word form"}},{"w":"Tuesday","d":["Tuesday","Taesday","Tuasday","Taasday"],"pool":["Taesday","Tuasday","Taasday","Tuisday","Taisday"],"madeUp":["Taesday","Tuasday","Taasday","Tuisday","Taisday"],"sentence":"Tuesday comes after Monday.","expansion":true,"sourceId":"next800-710","batch":6,"group":"Descriptions, feelings and story connections","teaching":{"tip":"A day of the week. Its name starts with a capital letter.","pattern":"day name"}},{"w":"escape","d":["escape","escepe","ascape","ascepe"],"pool":["escepe","ascape","ascepe","iscape","iscepe"],"madeUp":["escepe","ascape","ascepe","iscape","iscepe"],"sentence":"The mouse can escape through the little hole.","expansion":true,"sourceId":"next800-776","batch":6,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look at every letter in escape. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"body","d":["body","bogy","dody","dogy"],"pool":["bogy","dody","dogy","fody","fogy"],"madeUp":["dody","fody"],"sentence":"My arms and legs are parts of my body.","expansion":true,"sourceId":"next800-283","batch":6,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in body. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"stand","d":["stand","scand","stend","scend"],"pool":["scand","stend","scend","stind","scind"],"madeUp":["scand","stind"],"sentence":"Please stand beside the door.","expansion":true,"sourceId":"next800-284","batch":6,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in stand. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"bee","d":["bee","bae","dee","dae"],"pool":["bae","dee","dae","fee","fae"],"madeUp":[],"sentence":"A bee flies from flower to flower.","expansion":true,"sourceId":"next800-552","batch":6,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “ee” in bee. Listen, then read the whole sentence.","pattern":"letter group ee"}},{"w":"butterfly","d":["butterfly","batterfly","buttarfly","battarfly"],"pool":["batterfly","buttarfly","battarfly","buttirfly","battirfly"],"madeUp":["batterfly","buttarfly","battarfly","buttirfly","battirfly"],"sentence":"The butterfly has colourful wings.","expansion":true,"sourceId":"next800-553","batch":6,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “er” in butterfly. Listen, then read the whole sentence.","pattern":"letter group er"}},{"w":"flew","d":["flew","flaw","blew","blaw"],"pool":["flaw","blew","blaw","clew","claw"],"madeUp":["blew"],"sentence":"The bird flew over the house.","expansion":true,"sourceId":"next800-622","batch":6,"group":"Actions and word families","teaching":{"tip":"Word family: fly → flew. Notice how the spelling changes.","family":"fly","pattern":"changed word form"}},{"w":"Wednesday","d":["Wednesday","Wadnesday","Wednasday","Wadnasday"],"pool":["Wadnesday","Wednasday","Wadnasday","Wednisday","Wadnisday"],"madeUp":["Wadnesday","Wednasday","Wadnasday","Wednisday","Wadnisday"],"sentence":"Wednesday comes after Tuesday.","expansion":true,"sourceId":"next800-711","batch":6,"group":"Descriptions, feelings and story connections","teaching":{"symbol":null,"tip":"Listen carefully: Wednesday sounds like Wenz-day.","pattern":"tricky spelling or meaning"}},{"w":"enemy","d":["enemy","enomy","anemy","anomy"],"pool":["enomy","anemy","anomy","inemy","inomy"],"madeUp":["enomy","anemy","inemy","inomy"],"sentence":"The enemy blocks the hero's path in the story.","expansion":true,"sourceId":"next800-777","batch":6,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look at every letter in enemy. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"stick","d":["stick","snick","stack","snack"],"pool":["snick","stack","snack","steck","sneck"],"madeUp":["steck"],"sentence":"The dog carries a stick.","expansion":true,"sourceId":"next800-285","batch":6,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in stick. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"knew","d":["knew","knaw","kneb","knab"],"pool":["knaw","kneb","knab","kneg","knag"],"madeUp":["knaw","kneb","kneg"],"sentence":"I knew where the missing toy was.","expansion":true,"sourceId":"next800-286","batch":6,"group":"Everyday story essentials","teaching":{"tip":"Word family: know → knew. Notice how the spelling changes.","family":"know","pattern":"changed word form"}},{"w":"snail","d":["snail","scail","snaal","scaal"],"pool":["scail","snaal","scaal","snaul","scaul"],"madeUp":["scail","snaal","scaal","snaul"],"sentence":"The snail carries its shell.","expansion":true,"sourceId":"next800-554","batch":6,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “ai” in snail. Listen, then read the whole sentence.","pattern":"letter group ai"}},{"w":"worm","d":["worm","warm","borm","barm"],"pool":["warm","borm","barm","form","farm"],"madeUp":["borm"],"sentence":"A worm lives in the soil.","expansion":true,"sourceId":"next800-555","batch":6,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “or” in worm. Listen, then read the whole sentence.","pattern":"letter group or"}},{"w":"flying","d":["flying","frying","flyang","fryang"],"pool":["frying","flyang","fryang","flyeng","fryeng"],"madeUp":["frying","flyang","fryang","flyeng","fryeng"],"sentence":"The plane is flying above the clouds.","expansion":true,"sourceId":"next800-623","batch":6,"group":"Actions and word families","teaching":{"tip":"Word family: fly → flying. Read the whole word, including its ending.","family":"fly","pattern":"word ending"}},{"w":"Thursday","d":["Thursday","Tharsday","Thursdey","Tharsdey"],"pool":["Tharsday","Thursdey","Tharsdey","Thursdiy","Tharsdiy"],"madeUp":["Tharsday","Thursdey","Tharsdey","Thursdiy","Tharsdiy"],"sentence":"Thursday comes after Wednesday.","expansion":true,"sourceId":"next800-712","batch":6,"group":"Descriptions, feelings and story connections","teaching":{"tip":"A day of the week. Its name starts with a capital letter.","pattern":"day name"}},{"w":"group","d":["group","graup","groip","graip"],"pool":["graup","groip","graip","groop","graop"],"madeUp":["graup","groip","graop"],"sentence":"A group of children plays together.","expansion":true,"sourceId":"next800-778","batch":7,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look carefully at “ou” in group. Listen, then read the whole sentence.","pattern":"letter group ou"}},{"w":"ever","d":["ever","ecer","aver","acer"],"pool":["ecer","aver","acer","over","ocer"],"madeUp":["ecer","ocer"],"sentence":"Have you ever seen a whale?","expansion":true,"sourceId":"next800-287","batch":7,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “er” in ever. Listen, then read the whole sentence.","pattern":"letter group er"}},{"w":"piece","d":["piece","peece","piace","peace"],"pool":["peece","piace","peace","pioce","peoce"],"madeUp":["peece","piace","pioce","peoce"],"sentence":"May I have a piece of cake?","expansion":true,"sourceId":"next800-288","batch":7,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in piece. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"squirrel","d":["squirrel","sqairrel","squarrel","sqaarrel"],"pool":["sqairrel","squarrel","sqaarrel","squerrel","sqaerrel"],"madeUp":["sqairrel","squarrel","sqaarrel","squerrel","sqaerrel"],"sentence":"The squirrel climbs the tree.","expansion":true,"sourceId":"next800-556","batch":7,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “ir” in squirrel. Listen, then read the whole sentence.","pattern":"letter group ir"}},{"w":"nest","d":["nest","nast","best","bast"],"pool":["nast","best","bast","cest","cast"],"madeUp":[],"sentence":"The bird builds a nest.","expansion":true,"sourceId":"next800-557","batch":7,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in nest. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"swam","d":["swam","scam","swab","scab"],"pool":["scam","swab","scab","swad","scad"],"madeUp":[],"sentence":"The duck swam across the pond.","expansion":true,"sourceId":"next800-624","batch":7,"group":"Actions and word families","teaching":{"tip":"Word family: swim → swam. Notice how the spelling changes.","family":"swim","pattern":"changed word form"}},{"w":"Friday","d":["Friday","Fraday","Fridey","Fradey"],"pool":["Fraday","Fridey","Fradey","Fridiy","Fradiy"],"madeUp":["Fraday","Fridey","Fradey","Fridiy","Fradiy"],"sentence":"Friday comes after Thursday.","expansion":true,"sourceId":"next800-713","batch":7,"group":"Descriptions, feelings and story connections","teaching":{"tip":"A day of the week. Its name starts with a capital letter.","pattern":"day name"}},{"w":"women","d":["women","woman","bomen","boman"],"pool":["woman","bomen","boman","comen","coman"],"madeUp":["bomen","boman","comen"],"sentence":"Two women carry the box together.","expansion":true,"sourceId":"next800-779","batch":7,"group":"Nature, places, adventure and reading","teaching":{"tip":"Word family: woman → women. Notice how the spelling changes.","family":"woman","pattern":"changed word form"}},{"w":"told","d":["told","tald","bold","bald"],"pool":["tald","bold","bald","cold","cald"],"madeUp":["cald"],"sentence":"My sister told me a story.","expansion":true,"sourceId":"next800-289","batch":7,"group":"Everyday story essentials","teaching":{"tip":"Word family: tell → told. Notice how the spelling changes.","family":"tell","pattern":"changed word form"}},{"w":"easy","d":["easy","eesy","iasy","iesy"],"pool":["eesy","iasy","iesy","oasy","oesy"],"madeUp":["eesy","iasy","iesy","oasy","oesy"],"sentence":"This puzzle is easy for me.","expansion":true,"sourceId":"next800-290","batch":7,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ea” in easy. Listen, then read the whole sentence.","pattern":"letter group ea"}},{"w":"chick","d":["chick","click","chack","clack"],"pool":["click","chack","clack","check","cleck"],"madeUp":["click"],"sentence":"The chick comes out of its egg.","expansion":true,"sourceId":"next800-558","batch":7,"group":"Home, family, food and school","teaching":{"tip":"Look carefully at “ch” in chick. Listen, then read the whole sentence.","pattern":"letter group ch"}},{"w":"lamb","d":["lamb","limb","camb","cimb"],"pool":["limb","camb","cimb","gamb","gimb"],"madeUp":["cimb","gimb"],"sentence":"A lamb is a young sheep.","expansion":true,"sourceId":"next800-559","batch":7,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in lamb. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"rode","d":["rode","rude","dode","dude"],"pool":["rude","dode","dude","gode","gude"],"madeUp":[],"sentence":"I rode my bike to the park.","expansion":true,"sourceId":"next800-625","batch":7,"group":"Actions and word families","teaching":{"tip":"Word family: ride → rode. Notice how the spelling changes.","family":"ride","pattern":"changed word form"}},{"w":"Saturday","d":["Saturday","Seturday","Satarday","Setarday"],"pool":["Seturday","Satarday","Setarday","Saterday","Seterday"],"madeUp":["Seturday","Satarday","Setarday","Saterday","Seterday"],"sentence":"Saturday comes after Friday.","expansion":true,"sourceId":"next800-714","batch":7,"group":"Descriptions, feelings and story connections","teaching":{"tip":"A day of the week. Its name starts with a capital letter.","pattern":"day name"}},{"w":"word","d":["word","ward","bord","bard"],"pool":["ward","bord","bard","cord","card"],"madeUp":[],"sentence":"I can read this word.","expansion":true,"sourceId":"next800-780","batch":7,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look carefully at “or” in word. Listen, then read the whole sentence.","pattern":"letter group or"}},{"w":"heard","d":["heard","hoard","beard","board"],"pool":["hoard","beard","board","ceard","coard"],"madeUp":["ceard","coard"],"sentence":"We heard the school bell.","expansion":true,"sourceId":"next800-291","batch":7,"group":"Everyday story essentials","teaching":{"tip":"Word family: hear → heard. Notice how the spelling changes.","family":"hear","pattern":"changed word form"}},{"w":"caught","d":["caught","cought","baught","bought"],"pool":["cought","baught","bought","daught","dought"],"madeUp":["cought","baught","daught"],"sentence":"I caught the ball with both hands.","expansion":true,"sourceId":"next800-292","batch":7,"group":"Everyday story essentials","teaching":{"tip":"Word family: catch → caught. Notice how the spelling changes.","family":"catch","pattern":"changed word form"}},{"w":"cub","d":["cub","cab","bub","bab"],"pool":["cab","bub","bab","dub","dab"],"madeUp":[],"sentence":"The fox cub stays near its mother.","expansion":true,"sourceId":"next800-560","batch":7,"group":"Home, family, food and school","teaching":{"tip":"Look at every letter in cub. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"drive","d":["drive","drave","brive","brave"],"pool":["drave","brive","brave","crive","crave"],"madeUp":["drave","brive","crive"],"sentence":"An adult can drive a car.","expansion":true,"sourceId":"next800-626","batch":7,"group":"Actions and word families","teaching":{"tip":"Look at every letter in drive. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"Sunday","d":["Sunday","Sanday","Sundey","Sandey"],"pool":["Sanday","Sundey","Sandey","Sundiy","Sandiy"],"madeUp":["Sanday","Sundey","Sandey","Sundiy","Sandiy"],"sentence":"Sunday comes after Saturday.","expansion":true,"sourceId":"next800-715","batch":7,"group":"Descriptions, feelings and story connections","teaching":{"tip":"A day of the week. Its name starts with a capital letter.","pattern":"day name"}},{"w":"sentence","d":["sentence","santence","sentance","santance"],"pool":["santence","sentance","santance","sentince","santince"],"madeUp":["santence","sentance","santance","sentince","santince"],"sentence":"A sentence can tell us something.","expansion":true,"sourceId":"next800-781","batch":7,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look at every letter in sentence. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"fell","d":["fell","fall","bell","ball"],"pool":["fall","bell","ball","cell","call"],"madeUp":[],"sentence":"The apple fell from the tree.","expansion":true,"sourceId":"next800-293","batch":7,"group":"Everyday story essentials","teaching":{"tip":"Word family: fall → fell. Notice how the spelling changes.","family":"fall","pattern":"changed word form"}},{"w":"sure","d":["sure","sare","bure","bare"],"pool":["sare","bure","bare","cure","care"],"madeUp":[],"sentence":"I am sure this is my coat.","expansion":true,"sourceId":"next800-294","batch":7,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ur” in sure. Listen, then read the whole sentence.","pattern":"letter group ur"}},{"w":"drove","d":["drove","drave","brove","brave"],"pool":["drave","brove","brave","grove","grave"],"madeUp":["drave","brove"],"sentence":"Dad drove us home.","expansion":true,"sourceId":"next800-627","batch":7,"group":"Actions and word families","teaching":{"tip":"Word family: drive → drove. Notice how the spelling changes.","family":"drive","pattern":"changed word form"}},{"w":"cover","d":["cover","caver","dover","daver"],"pool":["caver","dover","daver","hover","haver"],"madeUp":["caver"],"sentence":"The book has a red cover.","expansion":true,"sourceId":"next800-782","batch":7,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look carefully at “er” in cover. Listen, then read the whole sentence.","pattern":"letter group er"}},{"w":"become","d":["become","befome","became","befame"],"pool":["befome","became","befame","becume","befume"],"madeUp":["befome","becume"],"sentence":"A little seed can become a tall tree.","expansion":true,"sourceId":"next800-295","batch":7,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in become. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"top","d":["top","tap","bop","bap"],"pool":["tap","bop","bap","cop","cap"],"madeUp":[],"sentence":"The bird sits at the top of the tree.","expansion":true,"sourceId":"next800-296","batch":7,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in top. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"throw","d":["throw","thraw","throb","thrab"],"pool":["thraw","throb","thrab","throc","thrac"],"madeUp":["throb","thrab","throc","thrac"],"sentence":"Please throw the ball to me.","expansion":true,"sourceId":"next800-628","batch":7,"group":"Actions and word families","teaching":{"tip":"Look carefully at “th” in throw. Listen, then read the whole sentence.","pattern":"letter group th"}},{"w":"title","d":["title","tatle","tible","table"],"pool":["tatle","tible","table","ticle","tacle"],"madeUp":["tatle","tible","ticle","tacle"],"sentence":"The title tells us the name of the book.","expansion":true,"sourceId":"next800-783","batch":7,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look at every letter in title. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"short","d":["short","skort","shart","skart"],"pool":["skort","shart","skart","shirt","skirt"],"madeUp":["skort","shart"],"sentence":"The pencil is very short now.","expansion":true,"sourceId":"next800-297","batch":7,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “sh” in short. Listen, then read the whole sentence.","pattern":"letter group sh"}},{"w":"fight","d":["fight","faght","bight","baght"],"pool":["faght","bight","baght","dight","daght"],"madeUp":["faght","baght","daght"],"sentence":"The knights fight in the story.","expansion":true,"sourceId":"next800-298","batch":7,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “igh” in fight. Listen, then read the whole sentence.","pattern":"letter group igh"}},{"w":"threw","d":["threw","thraw","threb","thrab"],"pool":["thraw","threb","thrab","threc","thrac"],"madeUp":["threb","thrab","threc","thrac"],"sentence":"I threw the ball to my friend.","expansion":true,"sourceId":"next800-629","batch":7,"group":"Actions and word families","teaching":{"tip":"Word family: throw → threw. Notice how the spelling changes.","family":"throw","pattern":"changed word form"}},{"w":"music","d":["music","mesic","mucic","mecic"],"pool":["mesic","mucic","mecic","mudic","medic"],"madeUp":["mecic","mudic"],"sentence":"We listen to music and dance.","expansion":true,"sourceId":"next800-784","batch":7,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look at every letter in music. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"whole","d":["whole","whose","whale","whase"],"pool":["whose","whale","whase","while","whise"],"madeUp":["whise"],"sentence":"The whole family came to the party.","expansion":true,"sourceId":"next800-299","batch":7,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in whole. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"remember","d":["remember","ramember","remamber","ramamber"],"pool":["ramember","remamber","ramamber","remimber","ramimber"],"madeUp":["ramember","remamber","ramamber","remimber","ramimber"],"sentence":"I remember where I put my shoes.","expansion":true,"sourceId":"next800-300","batch":7,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “er” in remember. Listen, then read the whole sentence.","pattern":"letter group er"}},{"w":"kick","d":["kick","keck","bick","beck"],"pool":["keck","bick","beck","fick","feck"],"madeUp":["fick"],"sentence":"I kick the ball into the goal.","expansion":true,"sourceId":"next800-630","batch":7,"group":"Actions and word families","teaching":{"tip":"Look at every letter in kick. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"question","d":["question","qaestion","quastion","qaastion"],"pool":["qaestion","quastion","qaastion","quistion","qaistion"],"madeUp":["qaestion","quastion","qaastion","quistion","qaistion"],"sentence":"I have a question about the story.","expansion":true,"sourceId":"next800-785","batch":7,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look at every letter in question. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"early","d":["early","eerly","iarly","ierly"],"pool":["eerly","iarly","ierly","oarly","oerly"],"madeUp":["eerly","iarly","ierly","oarly","oerly"],"sentence":"We got up early to see the sun rise.","expansion":true,"sourceId":"next800-301","batch":7,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ar” in early. Listen, then read the whole sentence.","pattern":"letter group ar"}},{"w":"listen","d":["listen","lasten","bisten","basten"],"pool":["lasten","bisten","basten","fisten","fasten"],"madeUp":["lasten","bisten","fisten"],"sentence":"Please listen to the song.","expansion":true,"sourceId":"next800-302","batch":7,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in listen. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"follow","d":["follow","fallow","bollow","ballow"],"pool":["fallow","bollow","ballow","hollow","hallow"],"madeUp":["bollow"],"sentence":"We follow the path to the river.","expansion":true,"sourceId":"next800-631","batch":7,"group":"Actions and word families","teaching":{"tip":"Look carefully at “ow” in follow. Listen, then read the whole sentence.","pattern":"letter group ow"}},{"w":"meaning","d":["meaning","moaning","meening","moening"],"pool":["moaning","meening","moening","meoning","mooning"],"madeUp":["meening","moening","meoning"],"sentence":"Tell me the meaning of this word.","expansion":true,"sourceId":"next800-786","batch":7,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look carefully at “ng” in meaning. Listen, then read the whole sentence.","pattern":"letter group ng"}},{"w":"hit","d":["hit","hat","bit","bat"],"pool":["hat","bit","bat","cit","cat"],"madeUp":[],"sentence":"The ball hit the wall.","expansion":true,"sourceId":"next800-303","batch":7,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in hit. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"himself","d":["himself","hamself","himsalf","hamsalf"],"pool":["hamself","himsalf","hamsalf","himsilf","hamsilf"],"madeUp":["hamself","himsalf","hamsalf","himsilf","hamsilf"],"sentence":"The boy put his coat on by himself.","expansion":true,"sourceId":"next800-304","batch":7,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in himself. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"followed","d":["followed","fallowed","bollowed","ballowed"],"pool":["fallowed","bollowed","ballowed","hollowed","hallowed"],"madeUp":["fallowed","bollowed","ballowed","hollowed"],"sentence":"The ducklings followed their mother.","expansion":true,"sourceId":"next800-632","batch":7,"group":"Actions and word families","teaching":{"tip":"Word family: follow → followed. Read the whole word, including its ending.","family":"follow","pattern":"word ending"}},{"w":"beginning","d":["beginning","baginning","beganning","baganning"],"pool":["baginning","beganning","baganning","begenning","bagenning"],"madeUp":["baginning","beganning","baganning","begenning","bagenning"],"sentence":"The beginning is the first part of the story.","expansion":true,"sourceId":"next800-787","batch":7,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look carefully at “ng” in beginning. Listen, then read the whole sentence.","pattern":"letter group ng"}},{"w":"step","d":["step","shep","stap","shap"],"pool":["shep","stap","shap","stop","shop"],"madeUp":["shep"],"sentence":"Take one step towards me.","expansion":true,"sourceId":"next800-305","batch":7,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in step. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"cook","d":["cook","coak","book","boak"],"pool":["coak","book","boak","dook","doak"],"madeUp":["boak","doak"],"sentence":"We cook soup in a pot.","expansion":true,"sourceId":"next800-306","batch":7,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “oo” in cook. Listen, then read the whole sentence.","pattern":"letter group oo"}},{"w":"lead","d":["lead","load","leed","loed"],"pool":["load","leed","loed","leud","loud"],"madeUp":["loed"],"sentence":"I can lead the way home.","expansion":true,"sourceId":"next800-633","batch":7,"group":"Actions and word families","teaching":{"tip":"Look carefully at “ea” in lead. Listen, then read the whole sentence.","pattern":"letter group ea"},"spoken":"I can lead the way home."},{"w":"ending","d":["ending","enging","edding","edging"],"pool":["enging","edding","edging","egding","egging"],"madeUp":["enging","edding","egding"],"sentence":"The story has a happy ending.","expansion":true,"sourceId":"next800-788","batch":7,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look carefully at “ng” in ending. Listen, then read the whole sentence.","pattern":"letter group ng"}},{"w":"true","d":["true","tree","brue","bree"],"pool":["tree","brue","bree","grue","gree"],"madeUp":["brue"],"sentence":"It is true that birds have feathers.","expansion":true,"sourceId":"next800-307","batch":7,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in true. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"grass","d":["grass","griss","brass","briss"],"pool":["griss","brass","briss","crass","criss"],"madeUp":["griss"],"sentence":"The rabbit eats green grass.","expansion":true,"sourceId":"next800-308","batch":7,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in grass. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"led","d":["led","lad","bed","bad"],"pool":["lad","bed","bad","fed","fad"],"madeUp":[],"sentence":"The path led us to the lake.","expansion":true,"sourceId":"next800-634","batch":7,"group":"Actions and word families","teaching":{"tip":"Word family: lead → led. Notice how the spelling changes.","family":"lead","pattern":"changed word form"}},{"w":"chapter","d":["chapter","chepter","chaptar","cheptar"],"pool":["chepter","chaptar","cheptar","chaptir","cheptir"],"madeUp":["chepter","chaptar","cheptar","chaptir","cheptir"],"sentence":"We read one chapter of the book.","expansion":true,"sourceId":"next800-789","batch":7,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look carefully at “ch” in chapter. Listen, then read the whole sentence.","pattern":"letter group ch"}},{"w":"slowly","d":["slowly","scowly","slawly","scawly"],"pool":["scowly","slawly","scawly","slewly","scewly"],"madeUp":["scowly","slawly","scawly","slewly","scewly"],"sentence":"The snail moves slowly.","expansion":true,"sourceId":"next800-309","batch":7,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ow” in slowly. Listen, then read the whole sentence.","pattern":"letter group ow"}},{"w":"pulled","d":["pulled","palled","bulled","balled"],"pool":["palled","bulled","balled","culled","called"],"madeUp":["bulled","culled"],"sentence":"The horse pulled the cart.","expansion":true,"sourceId":"next800-310","batch":7,"group":"Everyday story essentials","teaching":{"tip":"Word family: pull → pulled. Read the whole word, including its ending.","family":"pull","pattern":"word ending"}},{"w":"met","d":["met","mat","bet","bat"],"pool":["mat","bet","bat","get","gat"],"madeUp":[],"sentence":"We met our friends at the park.","expansion":true,"sourceId":"next800-635","batch":7,"group":"Actions and word families","teaching":{"tip":"Word family: meet → met. Notice how the spelling changes.","family":"meet","pattern":"changed word form"}},{"w":"fact","d":["fact","fast","fect","fest"],"pool":["fast","fect","fest","fict","fist"],"madeUp":["fect","fict"],"sentence":"A fact is something that is true.","expansion":true,"sourceId":"next800-790","batch":7,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look at every letter in fact. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"voice","d":["voice","veice","boice","beice"],"pool":["veice","boice","beice","doice","deice"],"madeUp":["veice","boice","doice"],"sentence":"I know my mother's voice.","expansion":true,"sourceId":"next800-311","batch":7,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in voice. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"seen","d":["seen","sean","been","bean"],"pool":["sean","been","bean","deen","dean"],"madeUp":["deen"],"sentence":"Have you seen my red hat?","expansion":true,"sourceId":"next800-312","batch":7,"group":"Everyday story essentials","teaching":{"tip":"Word family: see → seen. Notice how the spelling changes.","family":"see","pattern":"changed word form"}},{"w":"win","d":["win","wan","bin","ban"],"pool":["wan","bin","ban","din","dan"],"madeUp":[],"sentence":"We try to win the game.","expansion":true,"sourceId":"next800-636","batch":7,"group":"Actions and word families","teaching":{"tip":"Look at every letter in win. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"false","d":["false","filse","galse","gilse"],"pool":["filse","galse","gilse","halse","hilse"],"madeUp":["filse","galse","hilse"],"sentence":"It is false that a cat has six legs.","expansion":true,"sourceId":"next800-791","batch":7,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look at every letter in false. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"lost","d":["lost","loft","lest","left"],"pool":["loft","lest","left","list","lift"],"madeUp":[],"sentence":"I have lost one of my shoes.","expansion":true,"sourceId":"next800-313","batch":7,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in lost. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"cried","d":["cried","creed","bried","breed"],"pool":["creed","bried","breed","fried","freed"],"madeUp":["bried"],"sentence":"The baby cried when she was hungry.","expansion":true,"sourceId":"next800-314","batch":7,"group":"Everyday story essentials","teaching":{"tip":"Word family: cry → cried. Read the whole word, including its ending.","family":"cry","pattern":"word ending"}},{"w":"won","d":["won","wan","bon","ban"],"pool":["wan","bon","ban","con","can"],"madeUp":[],"sentence":"Our team won the game.","expansion":true,"sourceId":"next800-637","batch":7,"group":"Actions and word families","teaching":{"tip":"Word family: win → won. Notice how the spelling changes.","family":"win","pattern":"changed word form"}},{"w":"real","d":["real","rial","beal","bial"],"pool":["rial","beal","bial","deal","dial"],"madeUp":["bial"],"sentence":"This is a real horse, not a toy.","expansion":true,"sourceId":"next800-792","batch":7,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look carefully at “ea” in real. Listen, then read the whole sentence.","pattern":"letter group ea"}},{"w":"wait","d":["wait","waet","bait","baet"],"pool":["waet","bait","baet","gait","gaet"],"madeUp":["waet","baet"],"sentence":"Please wait for me.","expansion":true,"sourceId":"next800-315","batch":7,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ai” in wait. Listen, then read the whole sentence.","pattern":"letter group ai"}},{"w":"quickly","d":["quickly","qaickly","quackly","qaackly"],"pool":["qaickly","quackly","qaackly","queckly","qaeckly"],"madeUp":["qaickly","quackly","qaackly","queckly","qaeckly"],"sentence":"The rabbit runs quickly.","expansion":true,"sourceId":"next800-316","batch":7,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in quickly. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"lose","d":["lose","lode","bose","bode"],"pool":["lode","bose","bode","dose","dode"],"madeUp":[],"sentence":"I do not want to lose my key.","expansion":true,"sourceId":"next800-638","batch":7,"group":"Actions and word families","teaching":{"tip":"Look at every letter in lose. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"pretend","d":["pretend","protend","pretand","protand"],"pool":["protend","pretand","protand","pretind","protind"],"madeUp":["pretand","protand","pretind","protind"],"sentence":"We pretend the box is a boat.","expansion":true,"sourceId":"next800-793","batch":7,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look at every letter in pretend. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"person","d":["person","parson","perbon","parbon"],"pool":["parson","perbon","parbon","perdon","pardon"],"madeUp":["perbon","parbon","perdon"],"sentence":"One person is waiting at the door.","expansion":true,"sourceId":"next800-317","batch":7,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “er” in person. Listen, then read the whole sentence.","pattern":"letter group er"}},{"w":"became","d":["became","befame","become","befome"],"pool":["befame","become","befome","becume","befume"],"madeUp":["befome","becume"],"sentence":"The sky became dark before the storm.","expansion":true,"sourceId":"next800-318","batch":7,"group":"Everyday story essentials","teaching":{"tip":"Word family: become → became. Notice how the spelling changes.","family":"become","pattern":"changed word form"}},{"w":"thinking","d":["thinking","thanking","thinkang","thankang"],"pool":["thanking","thinkang","thankang","thinkeng","thankeng"],"madeUp":["thanking","thinkang","thankang","thinkeng","thankeng"],"sentence":"I am thinking about the answer.","expansion":true,"sourceId":"next800-639","batch":7,"group":"Actions and word families","teaching":{"tip":"Word family: think → thinking. Read the whole word, including its ending.","family":"think","pattern":"word ending"}},{"w":"dream","d":["dream","draam","bream","braam"],"pool":["draam","bream","braam","cream","craam"],"madeUp":["draam","braam","craam"],"sentence":"I had a dream about a flying dragon.","expansion":true,"sourceId":"next800-794","batch":7,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look carefully at “ea” in dream. Listen, then read the whole sentence.","pattern":"letter group ea"}},{"w":"feel","d":["feel","foel","feal","foal"],"pool":["foel","feal","foal","feil","foil"],"madeUp":["foel"],"sentence":"I feel the warm sun on my face.","expansion":true,"sourceId":"next800-319","batch":7,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ee” in feel. Listen, then read the whole sentence.","pattern":"letter group ee"}},{"w":"garden","d":["garden","gurden","barden","burden"],"pool":["gurden","barden","burden","harden","hurden"],"madeUp":["gurden","barden","hurden"],"sentence":"Flowers grow in our garden.","expansion":true,"sourceId":"next800-320","batch":7,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ar” in garden. Listen, then read the whole sentence.","pattern":"letter group ar"}},{"w":"known","d":["known","knawn","knobn","knabn"],"pool":["knawn","knobn","knabn","knocn","knacn"],"madeUp":["knawn","knobn","knabn","knocn","knacn"],"sentence":"I have known my friend for a long time.","expansion":true,"sourceId":"next800-640","batch":7,"group":"Actions and word families","teaching":{"tip":"Word family: know → known. Notice how the spelling changes.","family":"know","pattern":"changed word form"}},{"w":"reason","d":["reason","reison","beason","beison"],"pool":["reison","beason","beison","geason","geison"],"madeUp":["reison","beason","beison"],"sentence":"Rain is the reason we are staying inside.","expansion":true,"sourceId":"next800-795","batch":7,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look carefully at “ea” in reason. Listen, then read the whole sentence.","pattern":"letter group ea"}},{"w":"street","d":["street","screet","streeb","screeb"],"pool":["screet","streeb","screeb","streed","screed"],"madeUp":["streeb","screeb","streed"],"sentence":"Our house is on this street.","expansion":true,"sourceId":"next800-321","batch":7,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ee” in street. Listen, then read the whole sentence.","pattern":"letter group ee"}},{"w":"meat","d":["meat","moat","beat","boat"],"pool":["moat","beat","boat","geat","goat"],"madeUp":[],"sentence":"The lion eats meat.","expansion":true,"sourceId":"next800-322","batch":7,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ea” in meat. Listen, then read the whole sentence.","pattern":"letter group ea"}},{"w":"feeling","d":["feeling","foeling","feiling","foiling"],"pool":["foeling","feiling","foiling","feoling","fooling"],"madeUp":["foeling","feiling","feoling"],"sentence":"I am feeling happy today.","expansion":true,"sourceId":"next800-641","batch":7,"group":"Actions and word families","teaching":{"tip":"Word family: feel → feeling. Read the whole word, including its ending.","family":"feel","pattern":"word ending"}},{"w":"although","d":["although","althaugh","elthough","elthaugh"],"pool":["althaugh","elthough","elthaugh","ilthough","ilthaugh"],"madeUp":["althaugh","elthough","elthaugh","ilthough","ilthaugh"],"sentence":"We went out although it was raining.","expansion":true,"sourceId":"next800-796","batch":7,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look carefully at “th” in although. Listen, then read the whole sentence.","pattern":"letter group th"}},{"w":"nothing","d":["nothing","nathing","bothing","bathing"],"pool":["nathing","bothing","bathing","cothing","cathing"],"madeUp":["nathing","bothing","cothing","cathing"],"sentence":"There is nothing in the empty box.","expansion":true,"sourceId":"next800-323","batch":7,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “th” in nothing. Listen, then read the whole sentence.","pattern":"letter group th"}},{"w":"hat","d":["hat","het","bat","bet"],"pool":["het","bat","bet","gat","get"],"madeUp":[],"sentence":"I wear a hat in the sun.","expansion":true,"sourceId":"next800-324","batch":7,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in hat. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"forget","d":["forget","farget","borget","barget"],"pool":["farget","borget","barget","gorget","garget"],"madeUp":["farget","borget","barget"],"sentence":"Do not forget your coat.","expansion":true,"sourceId":"next800-642","batch":7,"group":"Actions and word families","teaching":{"tip":"Look carefully at “or” in forget. Listen, then read the whole sentence.","pattern":"letter group or"}},{"w":"however","d":["however","hawever","howaver","hawaver"],"pool":["hawever","howaver","hawaver","howiver","hawiver"],"madeUp":["hawever","howaver","hawaver","howiver","hawiver"],"sentence":"I wanted to play; however, it was time for bed.","expansion":true,"sourceId":"next800-797","batch":7,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look carefully at “ow” in however. Listen, then read the whole sentence.","pattern":"letter group ow"}},{"w":"rest","d":["rest","rist","cest","cist"],"pool":["rist","cest","cist","fest","fist"],"madeUp":[],"sentence":"We sit down for a rest.","expansion":true,"sourceId":"next800-325","batch":7,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in rest. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"stay","d":["stay","scay","stey","scey"],"pool":["scay","stey","scey","stiy","sciy"],"madeUp":["scay","scey","stiy","sciy"],"sentence":"Please stay beside me.","expansion":true,"sourceId":"next800-326","batch":7,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ay” in stay. Listen, then read the whole sentence.","pattern":"letter group ay"}},{"w":"forgot","d":["forgot","forget","borgot","borget"],"pool":["forget","borgot","borget","gorgot","gorget"],"madeUp":["borgot","borget","gorgot"],"sentence":"I forgot where I put my bag.","expansion":true,"sourceId":"next800-643","batch":7,"group":"Actions and word families","teaching":{"tip":"Word family: forget → forgot. Notice how the spelling changes.","family":"forget","pattern":"changed word form"}},{"w":"unless","d":["unless","udless","anless","adless"],"pool":["udless","anless","adless","enless","edless"],"madeUp":["udless","anless","enless","edless"],"sentence":"We will play outside unless it rains.","expansion":true,"sourceId":"next800-798","batch":7,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look at every letter in unless. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"week","d":["week","weak","beek","beak"],"pool":["weak","beek","beak","feek","feak"],"madeUp":["feek"],"sentence":"There are seven days in a week.","expansion":true,"sourceId":"next800-327","batch":7,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ee” in week. Listen, then read the whole sentence.","pattern":"letter group ee"}},{"w":"ago","d":["ago","abo","aga","aba"],"pool":["abo","aga","aba","age","abe"],"madeUp":[],"sentence":"We went to the beach a week ago.","expansion":true,"sourceId":"next800-328","batch":7,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in ago. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"believe","d":["believe","balieve","belaeve","balaeve"],"pool":["balieve","belaeve","balaeve","beleeve","baleeve"],"madeUp":["balieve","belaeve","balaeve","beleeve","baleeve"],"sentence":"I believe what you told me.","expansion":true,"sourceId":"next800-644","batch":7,"group":"Actions and word families","teaching":{"tip":"Look at every letter in believe. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"whether","d":["whether","whethar","whither","whithar"],"pool":["whethar","whither","whithar","whuther","whuthar"],"madeUp":["whethar","whithar","whuthar"],"sentence":"I do not know whether it will rain.","expansion":true,"sourceId":"next800-799","batch":7,"group":"Nature, places, adventure and reading","teaching":{"tip":"Look carefully at “th” in whether. Listen, then read the whole sentence.","pattern":"letter group th"}},{"w":"stood","d":["stood","steod","stoad","stead"],"pool":["steod","stoad","stead","stoed","steed"],"madeUp":["steod","stoad","stoed"],"sentence":"The horse stood under the tree.","expansion":true,"sourceId":"next800-329","batch":7,"group":"Everyday story essentials","teaching":{"tip":"Word family: stand → stood. Notice how the spelling changes.","family":"stand","pattern":"changed word form"}},{"w":"brought","d":["brought","braught","drought","draught"],"pool":["braught","drought","draught","frought","fraught"],"madeUp":["braught","frought"],"sentence":"My friend brought a book to share.","expansion":true,"sourceId":"next800-330","batch":7,"group":"Everyday story essentials","teaching":{"tip":"Word family: bring → brought. Notice how the spelling changes.","family":"bring","pattern":"changed word form"}},{"w":"seem","d":["seem","siem","seam","siam"],"pool":["siem","seam","siam","seum","sium"],"madeUp":["siem","seum"],"sentence":"You seem happy today.","expansion":true,"sourceId":"next800-645","batch":7,"group":"Actions and word families","teaching":{"tip":"Look carefully at “ee” in seem. Listen, then read the whole sentence.","pattern":"letter group ee"}},{"w":"whose","d":["whose","whole","whase","whale"],"pool":["whole","whase","whale","whise","while"],"madeUp":["whise"],"sentence":"Can you tell me whose coat this is?","expansion":true,"sourceId":"next800-800","batch":7,"group":"Nature, places, adventure and reading","teaching":{"symbol":null,"tip":"Whose asks who something belongs to.","pattern":"tricky spelling or meaning"}},{"w":"understand","d":["understand","undarstand","anderstand","andarstand"],"pool":["undarstand","anderstand","andarstand","enderstand","endarstand"],"madeUp":["undarstand","anderstand","andarstand","enderstand","endarstand"],"sentence":"I understand what you mean.","expansion":true,"sourceId":"next800-331","batch":7,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “er” in understand. Listen, then read the whole sentence.","pattern":"letter group er"}},{"w":"dry","d":["dry","dwy","dra","dwa"],"pool":["dwy","dra","dwa","dre","dwe"],"madeUp":["dwy","dra","dwa","dre","dwe"],"sentence":"My socks are dry now.","expansion":true,"sourceId":"next800-332","batch":7,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in dry. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"seemed","d":["seemed","seamed","beemed","beamed"],"pool":["seamed","beemed","beamed","ceemed","ceamed"],"madeUp":["beemed","ceemed","ceamed"],"sentence":"The bag seemed very heavy.","expansion":true,"sourceId":"next800-646","batch":7,"group":"Actions and word families","teaching":{"tip":"Word family: seem → seemed. Read the whole word, including its ending.","family":"seem","pattern":"word ending"}},{"w":"deep","d":["deep","diep","deeb","dieb"],"pool":["diep","deeb","dieb","deed","died"],"madeUp":["diep","deeb","died"],"sentence":"The well is very deep.","expansion":true,"sourceId":"next800-333","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ee” in deep. Listen, then read the whole sentence.","pattern":"letter group ee"}},{"w":"clear","d":["clear","claar","blear","blaar"],"pool":["claar","blear","blaar","flear","flaar"],"madeUp":["claar","blaar","flear","flaar"],"sentence":"We can see fish in the clear water.","expansion":true,"sourceId":"next800-334","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ar” in clear. Listen, then read the whole sentence.","pattern":"letter group ar"}},{"w":"join","d":["join","jain","boin","bain"],"pool":["jain","boin","bain","coin","cain"],"madeUp":["boin"],"sentence":"Come and join our game.","expansion":true,"sourceId":"next800-647","batch":8,"group":"Actions and word families","teaching":{"tip":"Look at every letter in join. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"nose","d":["nose","node","bose","bode"],"pool":["node","bose","bode","dose","dode"],"madeUp":[],"sentence":"The dog has a wet nose.","expansion":true,"sourceId":"next800-335","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in nose. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"heavy","d":["heavy","heevy","heaby","heeby"],"pool":["heevy","heaby","heeby","heady","heedy"],"madeUp":["heevy","heaby","heeby"],"sentence":"This box is too heavy for me.","expansion":true,"sourceId":"next800-336","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ea” in heavy. Listen, then read the whole sentence.","pattern":"letter group ea"}},{"w":"share","d":["share","scare","shire","scire"],"pool":["scare","shire","scire","shore","score"],"madeUp":["scire"],"sentence":"We share our toys with each other.","expansion":true,"sourceId":"next800-648","batch":8,"group":"Actions and word families","teaching":{"tip":"Look carefully at “sh” in share. Listen, then read the whole sentence.","pattern":"letter group sh"}},{"w":"sugar","d":["sugar","sufar","sagar","safar"],"pool":["sufar","sagar","safar","sogar","sofar"],"madeUp":["sufar","sagar","sogar"],"sentence":"We put sugar in the cake.","expansion":true,"sourceId":"next800-337","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ar” in sugar. Listen, then read the whole sentence.","pattern":"letter group ar"}},{"w":"built","d":["built","bailt","cuilt","cailt"],"pool":["bailt","cuilt","cailt","guilt","gailt"],"madeUp":["bailt","cuilt","cailt","gailt"],"sentence":"We built a house from blocks.","expansion":true,"sourceId":"next800-338","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Word family: build → built. Notice how the spelling changes.","family":"build","pattern":"changed word form"}},{"w":"shared","d":["shared","scared","shered","scered"],"pool":["scared","shered","scered","shored","scored"],"madeUp":["shered","scered"],"sentence":"We shared the last piece of cake.","expansion":true,"sourceId":"next800-649","batch":8,"group":"Actions and word families","teaching":{"tip":"Word family: share → shared. Read the whole word, including its ending.","family":"share","pattern":"word ending"}},{"w":"huge","d":["huge","hage","cuge","cage"],"pool":["hage","cuge","cage","fuge","fage"],"madeUp":["hage","cuge","fuge"],"sentence":"The whale is huge.","expansion":true,"sourceId":"next800-339","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in huge. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"felt","d":["felt","falt","belt","balt"],"pool":["falt","belt","balt","gelt","galt"],"madeUp":["falt"],"sentence":"The blanket felt soft.","expansion":true,"sourceId":"next800-340","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Word family: feel → felt. Notice how the spelling changes.","family":"feel","pattern":"changed word form"}},{"w":"suddenly","d":["suddenly","soddenly","suddanly","soddanly"],"pool":["soddenly","suddanly","soddanly","suddinly","soddinly"],"madeUp":["suddanly","soddanly","suddinly","soddinly"],"sentence":"The door suddenly flew open.","expansion":true,"sourceId":"next800-341","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in suddenly. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"ready","d":["ready","reedy","beady","beedy"],"pool":["reedy","beady","beedy","deady","deedy"],"madeUp":["beedy","deady"],"sentence":"I am ready to play.","expansion":true,"sourceId":"next800-342","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ea” in ready. Listen, then read the whole sentence.","pattern":"letter group ea"}},{"w":"anything","d":["anything","anythang","enything","enythang"],"pool":["anythang","enything","enythang","inything","inythang"],"madeUp":["anythang","enything","enythang","inything","inythang"],"sentence":"I cannot see anything in the dark.","expansion":true,"sourceId":"next800-343","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “th” in anything. Listen, then read the whole sentence.","pattern":"letter group th"}},{"w":"swim","d":["swim","swam","swib","swab"],"pool":["swam","swib","swab","swig","swag"],"madeUp":["swib"],"sentence":"Fish swim in water.","expansion":true,"sourceId":"next800-344","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in swim. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"wall","d":["wall","well","ball","bell"],"pool":["well","ball","bell","call","cell"],"madeUp":[],"sentence":"The picture hangs on the wall.","expansion":true,"sourceId":"next800-345","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in wall. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"legs","d":["legs","less","begs","bess"],"pool":["less","begs","bess","cegs","cess"],"madeUp":["begs","cegs"],"sentence":"A dog has four legs.","expansion":true,"sourceId":"next800-346","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in legs. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"angry","d":["angry","andry","engry","endry"],"pool":["andry","engry","endry","ungry","undry"],"madeUp":["andry","engry","endry","ungry"],"sentence":"I felt angry when my tower fell.","expansion":true,"sourceId":"next800-347","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ng” in angry. Listen, then read the whole sentence.","pattern":"letter group ng"}},{"w":"branch","d":["branch","brunch","cranch","crunch"],"pool":["brunch","cranch","crunch","granch","grunch"],"madeUp":["cranch","grunch"],"sentence":"The bird sits on a branch.","expansion":true,"sourceId":"next800-348","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ch” in branch. Listen, then read the whole sentence.","pattern":"letter group ch"}},{"w":"brave","d":["brave","breve","brava","breva"],"pool":["breve","brava","breva","bravo","brevo"],"madeUp":["brevo"],"sentence":"The brave child asks for help.","expansion":true,"sourceId":"next800-349","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in brave. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"leaf","d":["leaf","loaf","lead","load"],"pool":["loaf","lead","load","leah","loah"],"madeUp":["loah"],"sentence":"A green leaf falls from the tree.","expansion":true,"sourceId":"next800-350","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ea” in leaf. Listen, then read the whole sentence.","pattern":"letter group ea"}},{"w":"mud","d":["mud","mad","bud","bad"],"pool":["mad","bud","bad","cud","cad"],"madeUp":[],"sentence":"My boots are covered in mud.","expansion":true,"sourceId":"next800-351","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in mud. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"path","d":["path","pash","bath","bash"],"pool":["pash","bath","bash","cath","cash"],"madeUp":["cath"],"sentence":"We follow the path through the woods.","expansion":true,"sourceId":"next800-352","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “th” in path. Listen, then read the whole sentence.","pattern":"letter group th"}},{"w":"rescue","d":["rescue","rascue","bescue","bascue"],"pool":["rascue","bescue","bascue","fescue","fascue"],"madeUp":["rascue","bescue","bascue","fascue"],"sentence":"We help rescue the lost kitten.","expansion":true,"sourceId":"next800-353","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in rescue. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"scared","d":["scared","shared","scered","shered"],"pool":["shared","scered","shered","scored","shored"],"madeUp":["scered","shered"],"sentence":"The loud noise made me feel scared.","expansion":true,"sourceId":"next800-354","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ar” in scared. Listen, then read the whole sentence.","pattern":"letter group ar"}},{"w":"sat","d":["sat","set","bat","bet"],"pool":["set","bat","bet","gat","get"],"madeUp":[],"sentence":"The cat sat on the mat.","expansion":true,"sourceId":"next800-355","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Word family: sit → sat. Notice how the spelling changes.","family":"sit","pattern":"changed word form"}},{"w":"winter","d":["winter","wanter","binter","banter"],"pool":["wanter","binter","banter","cinter","canter"],"madeUp":["binter"],"sentence":"It can be very cold in winter.","expansion":true,"sourceId":"next800-356","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “er” in winter. Listen, then read the whole sentence.","pattern":"letter group er"}},{"w":"kept","d":["kept","kelt","bept","belt"],"pool":["kelt","bept","belt","fept","felt"],"madeUp":["kelt","bept","fept"],"sentence":"I kept the shell in a little box.","expansion":true,"sourceId":"next800-357","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Word family: keep → kept. Notice how the spelling changes.","family":"keep","pattern":"changed word form"}},{"w":"beautiful","d":["beautiful","baautiful","beiutiful","baiutiful"],"pool":["baautiful","beiutiful","baiutiful","beoutiful","baoutiful"],"madeUp":["baautiful","beiutiful","baiutiful","beoutiful","baoutiful"],"sentence":"The rainbow is beautiful.","expansion":true,"sourceId":"next800-358","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ea” in beautiful. Listen, then read the whole sentence.","pattern":"letter group ea"}},{"w":"sign","d":["sign","sagn","bign","bagn"],"pool":["sagn","bign","bagn","cign","cagn"],"madeUp":["sagn","bign","bagn","cign"],"sentence":"The sign tells us where to go.","expansion":true,"sourceId":"next800-359","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in sign. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"finished","d":["finished","fanished","finashed","fanashed"],"pool":["fanished","finashed","fanashed","fineshed","faneshed"],"madeUp":["fanished","finashed","fanashed","fineshed","faneshed"],"sentence":"I have finished my lunch.","expansion":true,"sourceId":"next800-360","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Word family: finish → finished. Read the whole word, including its ending.","family":"finish","pattern":"word ending"}},{"w":"gone","d":["gone","gane","bone","bane"],"pool":["gane","bone","bane","cone","cane"],"madeUp":[],"sentence":"The bird has gone back to its nest.","expansion":true,"sourceId":"next800-361","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Word family: go → gone. Notice how the spelling changes.","family":"go","pattern":"changed word form"}},{"w":"glass","d":["glass","grass","blass","brass"],"pool":["grass","blass","brass","class","crass"],"madeUp":["blass"],"sentence":"I drink water from a glass.","expansion":true,"sourceId":"next800-362","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in glass. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"weather","d":["weather","waather","beather","baather"],"pool":["waather","beather","baather","feather","faather"],"madeUp":["waather","beather","baather","faather"],"sentence":"The weather is warm and sunny.","expansion":true,"sourceId":"next800-363","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “th” in weather. Listen, then read the whole sentence.","pattern":"letter group th"}},{"w":"meet","d":["meet","meat","beet","beat"],"pool":["meat","beet","beat","feet","feat"],"madeUp":[],"sentence":"We will meet our friends at the park.","expansion":true,"sourceId":"next800-364","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ee” in meet. Listen, then read the whole sentence.","pattern":"letter group ee"}},{"w":"soft","d":["soft","saft","boft","baft"],"pool":["saft","boft","baft","coft","caft"],"madeUp":["boft","caft"],"sentence":"The rabbit has soft fur.","expansion":true,"sourceId":"next800-365","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in soft. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"held","d":["held","hold","beld","bold"],"pool":["hold","beld","bold","geld","gold"],"madeUp":[],"sentence":"I held the baby carefully.","expansion":true,"sourceId":"next800-366","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Word family: hold → held. Notice how the spelling changes.","family":"hold","pattern":"changed word form"}},{"w":"speak","d":["speak","spaak","speik","spaik"],"pool":["spaak","speik","spaik","speok","spaok"],"madeUp":["spaak","speik","speok","spaok"],"sentence":"Please speak so I can hear you.","expansion":true,"sourceId":"next800-367","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ea” in speak. Listen, then read the whole sentence.","pattern":"letter group ea"}},{"w":"son","d":["son","san","bon","ban"],"pool":["san","bon","ban","con","can"],"madeUp":[],"sentence":"The father reads to his son.","expansion":true,"sourceId":"next800-368","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in son. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"ice","d":["ice","ide","ace","ade"],"pool":["ide","ace","ade","oce","ode"],"madeUp":["oce"],"sentence":"Water turns to ice when it freezes.","expansion":true,"sourceId":"next800-369","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in ice. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"jumped","d":["jumped","jamped","bumped","bamped"],"pool":["jamped","bumped","bamped","dumped","damped"],"madeUp":["jamped","bumped","bamped","dumped"],"sentence":"The frog jumped into the pond.","expansion":true,"sourceId":"next800-370","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Word family: jump → jumped. Read the whole word, including its ending.","family":"jump","pattern":"word ending"}},{"w":"care","d":["care","cere","bare","bere"],"pool":["cere","bare","bere","dare","dere"],"madeUp":[],"sentence":"We take care of our pets.","expansion":true,"sourceId":"next800-371","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ar” in care. Listen, then read the whole sentence.","pattern":"letter group ar"}},{"w":"floor","d":["floor","fluor","floer","fluer"],"pool":["fluor","floer","fluer","flour","fluur"],"madeUp":["floer","fluur"],"sentence":"The rug is on the floor.","expansion":true,"sourceId":"next800-372","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “oo” in floor. Listen, then read the whole sentence.","pattern":"letter group oo"}},{"w":"pushed","d":["pushed","pashed","bushed","bashed"],"pool":["pashed","bushed","bashed","dushed","dashed"],"madeUp":["pashed","bashed","dushed"],"sentence":"I pushed the door open.","expansion":true,"sourceId":"next800-373","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Word family: push → pushed. Read the whole word, including its ending.","family":"push","pattern":"word ending"}},{"w":"everything","d":["everything","evarything","averything","avarything"],"pool":["evarything","averything","avarything","iverything","ivarything"],"madeUp":["evarything","averything","avarything","iverything","ivarything"],"sentence":"We put everything back in the box.","expansion":true,"sourceId":"next800-374","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “th” in everything. Listen, then read the whole sentence.","pattern":"letter group th"}},{"w":"tall","d":["tall","tell","ball","bell"],"pool":["tell","ball","bell","call","cell"],"madeUp":[],"sentence":"The tall tree reaches above the house.","expansion":true,"sourceId":"next800-375","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in tall. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"evening","d":["evening","evaning","avening","avaning"],"pool":["evaning","avening","avaning","ivening","ivaning"],"madeUp":["evaning","avening","avaning","ivening","ivaning"],"sentence":"We eat dinner in the evening.","expansion":true,"sourceId":"next800-376","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ng” in evening. Listen, then read the whole sentence.","pattern":"letter group ng"}},{"w":"hope","d":["hope","home","cope","come"],"pool":["home","cope","come","dope","dome"],"madeUp":[],"sentence":"I hope my friend can come.","expansion":true,"sourceId":"next800-377","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in hope. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"spring","d":["spring","string","sprang","strang"],"pool":["string","sprang","strang","spreng","streng"],"madeUp":["string"],"sentence":"New leaves grow in spring.","expansion":true,"sourceId":"next800-378","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ng” in spring. Listen, then read the whole sentence.","pattern":"letter group ng"}},{"w":"laughed","d":["laughed","loughed","baughed","boughed"],"pool":["loughed","baughed","boughed","caughed","coughed"],"madeUp":["loughed","baughed","caughed","coughed"],"sentence":"We laughed at the funny story.","expansion":true,"sourceId":"next800-379","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Word family: laugh → laughed. Read the whole word, including its ending.","family":"laugh","pattern":"word ending"}},{"w":"bright","d":["bright","braght","cright","craght"],"pool":["braght","cright","craght","fright","fraght"],"madeUp":["braght","cright","craght","fraght"],"sentence":"The sun is very bright.","expansion":true,"sourceId":"next800-380","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “igh” in bright. Listen, then read the whole sentence.","pattern":"letter group igh"}},{"w":"everyone","d":["everyone","evaryone","averyone","avaryone"],"pool":["evaryone","averyone","avaryone","iveryone","ivaryone"],"madeUp":["evaryone","averyone","avaryone","iveryone","ivaryone"],"sentence":"There is a seat for everyone.","expansion":true,"sourceId":"next800-381","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “er” in everyone. Listen, then read the whole sentence.","pattern":"letter group er"}},{"w":"hair","d":["hair","heir","haar","hear"],"pool":["heir","haar","hear","haer","heer"],"madeUp":["haar","haer"],"sentence":"I brush my hair in the morning.","expansion":true,"sourceId":"next800-382","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ai” in hair. Listen, then read the whole sentence.","pattern":"letter group ai"}},{"w":"broken","d":["broken","braken","brokan","brakan"],"pool":["braken","brokan","brakan","brokin","brakin"],"madeUp":["braken","brokan","brakan","brokin","brakin"],"sentence":"We cannot use the broken cup.","expansion":true,"sourceId":"next800-383","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Word family: break → broken. Notice how the spelling changes.","family":"break","pattern":"changed word form"}},{"w":"moment","d":["moment","mement","coment","cement"],"pool":["mement","coment","cement","doment","dement"],"madeUp":["mement","coment"],"sentence":"Please wait a moment.","expansion":true,"sourceId":"next800-384","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in moment. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"tiny","d":["tiny","tidy","tony","tody"],"pool":["tidy","tony","tody","tuny","tudy"],"madeUp":["tony","tudy"],"sentence":"The ant is tiny.","expansion":true,"sourceId":"next800-385","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in tiny. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"quiet","d":["quiet","qaiet","quaet","qaaet"],"pool":["qaiet","quaet","qaaet","queet","qaeet"],"madeUp":["qaiet","quaet","qaaet","qaeet"],"sentence":"Please be quiet while the baby sleeps.","expansion":true,"sourceId":"next800-386","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in quiet. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"lot","d":["lot","lat","bot","bat"],"pool":["lat","bot","bat","cot","cat"],"madeUp":[],"sentence":"There is a lot of sand on the beach.","expansion":true,"sourceId":"next800-387","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in lot. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"middle","d":["middle","maddle","diddle","daddle"],"pool":["maddle","diddle","daddle","fiddle","faddle"],"madeUp":[],"sentence":"The jam is in the middle of the sandwich.","expansion":true,"sourceId":"next800-388","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in middle. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"someone","d":["someone","sameone","somaone","samaone"],"pool":["sameone","somaone","samaone","somione","samione"],"madeUp":["sameone","somaone","samaone","somione","samione"],"sentence":"There is someone at the door.","expansion":true,"sourceId":"next800-389","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in someone. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"wonder","d":["wonder","wander","bonder","bander"],"pool":["wander","bonder","bander","donder","dander"],"madeUp":["donder"],"sentence":"I wonder where the bird is going.","expansion":true,"sourceId":"next800-390","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “er” in wonder. Listen, then read the whole sentence.","pattern":"letter group er"}},{"w":"smiled","d":["smiled","sciled","smaled","scaled"],"pool":["sciled","smaled","scaled","smeled","sceled"],"madeUp":["sciled","smaled","smeled","sceled"],"sentence":"My friend smiled when she saw me.","expansion":true,"sourceId":"next800-391","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Word family: smile → smiled. Read the whole word, including its ending.","family":"smile","pattern":"word ending"}},{"w":"trip","d":["trip","trap","drip","drap"],"pool":["trap","drip","drap","frip","frap"],"madeUp":["drap","frip"],"sentence":"We went on a trip to the zoo.","expansion":true,"sourceId":"next800-392","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in trip. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"hole","d":["hole","hale","bole","bale"],"pool":["hale","bole","bale","dole","dale"],"madeUp":[],"sentence":"The rabbit runs into a hole.","expansion":true,"sourceId":"next800-393","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in hole. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"surprise","d":["surprise","sorprise","burprise","borprise"],"pool":["sorprise","burprise","borprise","furprise","forprise"],"madeUp":["sorprise","burprise","borprise","furprise"],"sentence":"The present was a lovely surprise.","expansion":true,"sourceId":"next800-394","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ur” in surprise. Listen, then read the whole sentence.","pattern":"letter group ur"}},{"w":"cake","d":["cake","cade","bake","bade"],"pool":["cade","bake","bade","fake","fade"],"madeUp":[],"sentence":"We share a birthday cake.","expansion":true,"sourceId":"next800-395","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in cake. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"deer","d":["deer","dear","feer","fear"],"pool":["dear","feer","fear","heer","hear"],"madeUp":[],"sentence":"The deer runs through the woods.","expansion":true,"sourceId":"next800-396","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ee” in deer. Listen, then read the whole sentence.","pattern":"letter group ee"}},{"w":"flower","d":["flower","flawer","blower","blawer"],"pool":["flawer","blower","blawer","glower","glawer"],"madeUp":["flawer","blawer","glawer"],"sentence":"A bee lands on the flower.","expansion":true,"sourceId":"next800-397","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ow” in flower. Listen, then read the whole sentence.","pattern":"letter group ow"}},{"w":"frog","d":["frog","frig","brog","brig"],"pool":["frig","brog","brig","grog","grig"],"madeUp":[],"sentence":"The frog jumps into the water.","expansion":true,"sourceId":"next800-398","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in frog. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"rabbit","d":["rabbit","ribbit","rabbat","ribbat"],"pool":["ribbit","rabbat","ribbat","rabbet","ribbet"],"madeUp":["ribbit","rabbat","ribbat"],"sentence":"The rabbit has long ears.","expansion":true,"sourceId":"next800-399","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in rabbit. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"wolf","d":["wolf","welf","dolf","delf"],"pool":["welf","dolf","delf","golf","gelf"],"madeUp":["dolf","gelf"],"sentence":"The wolf howls at night.","expansion":true,"sourceId":"next800-400","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in wolf. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"catch","d":["catch","cotch","batch","botch"],"pool":["cotch","batch","botch","gatch","gotch"],"madeUp":[],"sentence":"Can you catch the ball?","expansion":true,"sourceId":"next800-401","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ch” in catch. Listen, then read the whole sentence.","pattern":"letter group ch"}},{"w":"climbed","d":["climbed","clambed","climbad","clambad"],"pool":["clambed","climbad","clambad","climbid","clambid"],"madeUp":["clambed","climbad","clambad","climbid","clambid"],"sentence":"The cat climbed the tree.","expansion":true,"sourceId":"next800-402","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Word family: climb → climbed. Read the whole word, including its ending.","family":"climb","pattern":"word ending"}},{"w":"wrote","d":["wrote","whote","wrate","whate"],"pool":["whote","wrate","whate","write","white"],"madeUp":["whote","wrate","whate"],"sentence":"I wrote my name on the page.","expansion":true,"sourceId":"next800-403","batch":8,"group":"Everyday story essentials","teaching":{"symbol":null,"tip":"The w is silent, as in write.","pattern":"tricky spelling or meaning"}},{"w":"shouted","d":["shouted","shauted","shoated","shaated"],"pool":["shauted","shoated","shaated","shoeted","shaeted"],"madeUp":["shauted","shoated","shaated","shoeted","shaeted"],"sentence":"We shouted so our friend could hear us.","expansion":true,"sourceId":"next800-404","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Word family: shout → shouted. Read the whole word, including its ending.","family":"shout","pattern":"word ending"}},{"w":"else","d":["else","elbe","alse","albe"],"pool":["elbe","alse","albe","ilse","ilbe"],"madeUp":["elbe","alse","ilse","ilbe"],"sentence":"Who else wants to play?","expansion":true,"sourceId":"next800-405","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in else. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"ears","d":["ears","eurs","aars","aurs"],"pool":["eurs","aars","aurs","oars","ours"],"madeUp":["eurs","aars","aurs","oars"],"sentence":"I hear sounds with my ears.","expansion":true,"sourceId":"next800-406","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ar” in ears. Listen, then read the whole sentence.","pattern":"letter group ar"}},{"w":"grew","d":["grew","grow","brew","brow"],"pool":["grow","brew","brow","crew","crow"],"madeUp":[],"sentence":"The seed grew into a plant.","expansion":true,"sourceId":"next800-407","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Word family: grow → grew. Notice how the spelling changes.","family":"grow","pattern":"changed word form"}},{"w":"cool","d":["cool","coal","fool","foal"],"pool":["coal","fool","foal","gool","goal"],"madeUp":[],"sentence":"The water feels cool on my feet.","expansion":true,"sourceId":"next800-408","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “oo” in cool. Listen, then read the whole sentence.","pattern":"letter group oo"}},{"w":"sent","d":["sent","sant","bent","bant"],"pool":["sant","bent","bant","cent","cant"],"madeUp":[],"sentence":"We sent Grandma a birthday card.","expansion":true,"sourceId":"next800-409","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Word family: send → sent. Notice how the spelling changes.","family":"send","pattern":"changed word form"}},{"w":"wear","d":["wear","waar","bear","baar"],"pool":["waar","bear","baar","dear","daar"],"madeUp":["daar"],"sentence":"I wear a coat when it is cold.","expansion":true,"sourceId":"next800-410","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ar” in wear. Listen, then read the whole sentence.","pattern":"letter group ar"}},{"w":"bad","d":["bad","bed","fad","fed"],"pool":["bed","fad","fed","gad","ged"],"madeUp":[],"sentence":"The bad weather kept us inside.","expansion":true,"sourceId":"next800-411","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in bad. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"alone","d":["alone","aline","acone","acine"],"pool":["aline","acone","acine","agone","agine"],"madeUp":["acine","agine"],"sentence":"The little bird is alone in the nest.","expansion":true,"sourceId":"next800-412","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in alone. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"drawing","d":["drawing","drowing","crawing","crowing"],"pool":["drowing","crawing","crowing","grawing","growing"],"madeUp":["drowing","crawing","grawing"],"sentence":"I am drawing a house.","expansion":true,"sourceId":"next800-413","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ng” in drawing. Listen, then read the whole sentence.","pattern":"letter group ng"}},{"w":"touch","d":["touch","tauch","bouch","bauch"],"pool":["tauch","bouch","bauch","couch","cauch"],"madeUp":["tauch","bouch"],"sentence":"The kitten lets me touch its soft fur.","expansion":true,"sourceId":"next800-414","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ch” in touch. Listen, then read the whole sentence.","pattern":"letter group ch"}},{"w":"party","d":["party","perty","barty","berty"],"pool":["perty","barty","berty","carty","certy"],"madeUp":["barty","berty"],"sentence":"My friends came to my birthday party.","expansion":true,"sourceId":"next800-415","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ar” in party. Listen, then read the whole sentence.","pattern":"letter group ar"}},{"w":"woman","d":["woman","waman","coman","caman"],"pool":["waman","coman","caman","doman","daman"],"madeUp":["waman","doman"],"sentence":"The woman carries a bag.","expansion":true,"sourceId":"next800-416","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in woman. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"choose","d":["choose","chaose","choise","chaise"],"pool":["chaose","choise","chaise","chouse","chause"],"madeUp":["chaose","choise","chause"],"sentence":"You can choose which book we read.","expansion":true,"sourceId":"next800-417","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “oo” in choose. Listen, then read the whole sentence.","pattern":"letter group oo"}},{"w":"sand","d":["sand","send","band","bend"],"pool":["send","band","bend","fand","fend"],"madeUp":[],"sentence":"We build a castle in the sand.","expansion":true,"sourceId":"next800-418","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in sand. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"guess","d":["guess","gaess","guass","gaass"],"pool":["gaess","guass","gaass","guuss","gauss"],"madeUp":["gaess","guass","gaass","guuss"],"sentence":"Can you guess what is in the box?","expansion":true,"sourceId":"next800-419","batch":8,"group":"Everyday story essentials","teaching":{"symbol":null,"tip":"The u is silent.","pattern":"tricky spelling or meaning"}},{"w":"crowd","d":["crowd","chowd","crawd","chawd"],"pool":["chowd","crawd","chawd","crewd","chewd"],"madeUp":["chowd","crawd","chawd","crewd","chewd"],"sentence":"A crowd of people waits for the bus.","expansion":true,"sourceId":"next800-420","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ow” in crowd. Listen, then read the whole sentence.","pattern":"letter group ow"}},{"w":"poem","d":["poem","poom","boem","boom"],"pool":["poom","boem","boom","coem","coom"],"madeUp":["poom","boem","coem"],"sentence":"We read a short poem together.","expansion":true,"sourceId":"next800-421","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in poem. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"enjoy","d":["enjoy","enboy","anjoy","anboy"],"pool":["enboy","anjoy","anboy","unjoy","unboy"],"madeUp":["enboy","anjoy","anboy","unjoy"],"sentence":"I enjoy playing with my friends.","expansion":true,"sourceId":"next800-422","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in enjoy. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"fun","d":["fun","fan","bun","ban"],"pool":["fan","bun","ban","dun","dan"],"madeUp":[],"sentence":"We have fun at the park.","expansion":true,"sourceId":"next800-423","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in fun. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"send","d":["send","sand","bend","band"],"pool":["sand","bend","band","fend","fand"],"madeUp":[],"sentence":"We can send a card to Grandpa.","expansion":true,"sourceId":"next800-424","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in send. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"sister","d":["sister","saster","bister","baster"],"pool":["saster","bister","baster","fister","faster"],"madeUp":["saster"],"sentence":"My sister helps me with the puzzle.","expansion":true,"sourceId":"next800-425","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “er” in sister. Listen, then read the whole sentence.","pattern":"letter group er"}},{"w":"pick","d":["pick","pack","bick","back"],"pool":["pack","bick","back","cick","cack"],"madeUp":["cick"],"sentence":"You can pick an apple from the tree.","expansion":true,"sourceId":"next800-426","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in pick. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"laugh","d":["laugh","lough","baugh","bough"],"pool":["lough","baugh","bough","caugh","cough"],"madeUp":["baugh","caugh"],"sentence":"The funny story makes me laugh.","expansion":true,"sourceId":"next800-427","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in laugh. Listen, say the word, then read the sentence.","pattern":"whole word"}},{"w":"hurt","d":["hurt","hart","burt","bart"],"pool":["hart","burt","bart","curt","cart"],"madeUp":[],"sentence":"I hurt my knee when I fell.","expansion":true,"sourceId":"next800-428","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look carefully at “ur” in hurt. Listen, then read the whole sentence.","pattern":"letter group ur"}},{"w":"funny","d":["funny","fenny","bunny","benny"],"pool":["fenny","bunny","benny","gunny","genny"],"madeUp":[],"sentence":"That funny dog makes us smile.","expansion":true,"sourceId":"next800-429","batch":8,"group":"Everyday story essentials","teaching":{"tip":"Look at every letter in funny. Listen, say the word, then read the sentence.","pattern":"whole word"}}]);
  const curriculumSet=new Set(words.map(item=>item.w.toLowerCase()));
  for(const item of coreWords)item.madeUp=item.madeUp.filter(w=>!curriculumSet.has(w.toLowerCase()));
  // END NEXT800
  const teachingSource=item=>'assets/teaching/'+item.image+(item.image==='core-teaching'?'.webp':item.crop?'.png':'.webp');
  const evolution={intro:"Look! Your dragon is glowing. Let's see what happens.",
    frames:[0,1,2,3].map(stage=>'assets/evolution/pip-stage-'+stage+'.webp'),
    lines:[null,['I am big.','I can help.'],['My wings are big.','I can help you.'],['Hop on my back.','We can go far.']]};
  return {teachingSource, coreWords, words, legacyWords, assessmentPools, demoWords, enemies, enemyVariants, enemyAt, enemiesForHealth, enemyMembers, areas, chapters, chapterStories, storyPictures, chapterBackgrounds, campaignBackgrounds, dragonStages, evolution, chapterWordGoal:30};
});
