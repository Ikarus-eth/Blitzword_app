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
  // Existing assessment items, axes, and stopping thresholds are preserved.
  const assessmentPools = [
    [{w:'you',d:['you','your','yuo','yue']},{w:'cat',d:['cat','can','cap','cet']},{w:'car',d:['car','cat','can','cor']},{w:'can',d:['can','cat','cap','cen']},{w:'fox',d:['fox','box','fix','fax']},{w:'map',d:['map','man','mat','mop']}],
    [{w:'rock',d:['rock','lock','rack','ruck']},{w:'tree',d:['tree','free','three','trie']},{w:'green',d:['green','seen','greet','grain']},{w:'ship',d:['ship','shop','shin','chip']},{w:'cave',d:['cave','save','came','cove']},{w:'star',d:['star','scar','stay','stir']}],
    [{w:'night',d:['night','light','right','nigth']},{w:'shark',d:['shark','sharp','share','shork']},{w:'bright',d:['bright','right','bring','brigt']},{w:'stone',d:['stone','store','stove','ston']},{w:'storm',d:['storm','store','story','starm']}],
    [{w:'dragon',d:['dragon','drigon','wagon','drayon']},{w:'forest',d:['forest','fortest','forst','forset']},{w:'castle',d:['castle','cattle','candle','castel']},{w:'shadow',d:['shadow','shallow','shade','shado']},{w:'silver',d:['silver','sliver','river','silvar']}],
    [{w:'whisper',d:['whisper','whisker','whimper','wisper']},{w:'journey',d:['journey','jersey','joyous','jorney']},{w:'lantern',d:['lantern','pattern','later','lantren']},{w:'creature',d:['creature','feature','create','creatuer']}]
  ];
  // Old saved questions and teaching cards remain readable, but are never newly selected.
  const legacyWords = [{w:'sat', d:['sat','set','sap','sad'], sentence:'Pip sat on the rock.', image:'sat-rock', alt:'Pip sits on a broad gray rock.'}];
  const demoWords = ['on','fox','rock','tree','green','cave'];
  const enemies = [
    {id:'thornling',name:'Thornling',sprite:7},
    {id:'moss-golem',name:'Moss Golem',crop:[28,10,716,492]},
    {id:'moon-moth',name:'Moon Moth',crop:[812,0,682,503]},
    {id:'root-sprite',name:'Root Sprite',crop:[143,513,487,500]},
    {id:'cave-troll',name:'Cave Troll',crop:[812,510,654,514]}
  ];
  enemies.forEach(enemy=>{enemy.minHealth=3;enemy.maxHealth=5;enemy.tier=0;enemy.family=enemy.id;});
  function enemyAt(id){
    const direct=enemies.find(enemy=>enemy.id===id);if(direct)return direct;
    const match=/^(.*)-tier-(\d+)$/.exec(id||'');if(!match)return enemies[0];
    const base=enemies.find(enemy=>enemy.id===match[1]),tier=Number(match[2]);if(!base||tier<1||!Number.isSafeInteger(tier))return enemies[0];
    const title=['','Woodland','Great','Ancient','Elder'][tier]||'Elder '+tier;
    return {...base,id,name:title+' '+base.name,tier,minHealth:3+tier*3,maxHealth:5+tier*3};
  }
  function enemiesForHealth(health){
    const tier=Math.max(0,Math.floor((health-3)/3));
    return enemies.map(enemy=>tier?enemyAt(enemy.id+'-tier-'+tier):enemy);
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
  const dragonStages = [
    {name:'Small Pip',xp:0,crop:[150,160,409,307],scale:1},
    {name:'Big Pip',xp:3000,crop:[838,11,542,460],scale:1.14},
    {name:'Bigger Pip',xp:8900,crop:[88,494,615,491],scale:1.3},
    {name:'Ride on Pip',xp:13400,crop:[869,464,657,533],scale:1.45}
  ];
  const teachingSource=item=>'assets/teaching/'+item.image+(item.image==='core-teaching'?'.webp':item.crop?'.png':'.webp');
  return {teachingSource, words, legacyWords, assessmentPools, demoWords, enemies, enemyAt, enemiesForHealth, areas, chapters, dragonStages, chapterWordGoal:30};
});
