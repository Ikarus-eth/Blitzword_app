(function(root, factory) {
  const content = factory();
  if (typeof module === 'object' && module.exports) module.exports = content;
  else root.BlitzContent = content;
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  'use strict';
  // Thirty Core 200 targets with fixed, illustrated teaching support.
  // Artwork teaches meaning only; it is never displayed with answer choices.
  const words = [
    {w:'on', d:['on','in','an','no'], sentence:'Pip is on the rock.', image:'sat-rock', alt:'Pip rests on top of a broad gray rock.'},
    {w:'rock', d:['rock','lock','rack','ruck'], sentence:'Pip is on the rock.', image:'sat-rock', alt:'Pip sits on one large, clearly visible gray rock.'},
    {w:'tree', d:['tree','free','three','trie'], sentence:'The tree is green.', image:'green-tree', alt:'Pip holds a branch of a tree with green leaves.'},
    {w:'green', d:['green','seen','greet','grain'], sentence:'The tree is green.', image:'green-tree', alt:'A tree with rich green leaves stands against a warm, pale clearing.'},
    {w:'fox', d:['fox','box','fix','fax'], sentence:'Pip follows the fox.', image:'fox', alt:'A fox with pointed ears and a bushy white-tipped tail leads Pip along a path.'},
    {w:'cave', d:['cave','save','came','cove'], sentence:'Pip is by the cave.', image:'cave', alt:'Pip stands at the entrance of a large dark cave in a rocky hillside.'},
    {"w":"water","d":["water","later","waver","waiter"],"sentence":"Pip can jump over water.","image":"chapter-teaching","crop":[0,0,768,512],"alt":"Pip jumps over a stream while a bird flies above him with spread wings."},
    {"w":"bird","d":["bird","bind","bard","birth"],"sentence":"The bird flies up.","image":"chapter-teaching","crop":[0,0,768,512],"alt":"Pip jumps over a stream while a bird flies above him with spread wings."},
    {"w":"wing","d":["wing","wind","win","ring"],"sentence":"The bird has a wing.","image":"chapter-teaching","crop":[0,0,768,512],"alt":"Pip jumps over a stream while a bird flies above him with spread wings."},
    {"w":"jump","d":["jump","bump","lump","dump"],"sentence":"Pip can jump over water.","image":"chapter-teaching","crop":[0,0,768,512],"alt":"Pip jumps over a stream while a bird flies above him with spread wings."},
    {"w":"over","d":["over","oven","ever","cover"],"sentence":"Pip can jump over water.","image":"chapter-teaching","crop":[0,0,768,512],"alt":"Pip jumps over a stream while a bird flies above him with spread wings."},
    {"w":"up","d":["up","us","on","cup"],"sentence":"The bird flies up.","image":"chapter-teaching","crop":[0,0,768,512],"alt":"Pip jumps over a stream while a bird flies above him with spread wings."},
    {"w":"big","d":["big","bag","bit","pig"],"sentence":"The open book is big.","image":"chapter-teaching","crop":[768,0,768,512],"alt":"Pip compares two red books: a large open book and a small closed book."},
    {"w":"small","d":["small","smell","stall","shall"],"sentence":"The closed book is small.","image":"chapter-teaching","crop":[768,0,768,512],"alt":"Pip compares two red books: a large open book and a small closed book."},
    {"w":"two","d":["two","too","who","toe"],"sentence":"Pip has two books.","image":"chapter-teaching","crop":[768,0,768,512],"alt":"Pip compares two red books: a large open book and a small closed book."},
    {"w":"red","d":["red","read","rod","rid"],"sentence":"The books are red.","image":"chapter-teaching","crop":[768,0,768,512],"alt":"Pip compares two red books: a large open book and a small closed book."},
    {"w":"book","d":["book","boot","look","back"],"sentence":"The big book is open.","image":"chapter-teaching","crop":[768,0,768,512],"alt":"Pip compares two red books: a large open book and a small closed book."},
    {"w":"open","d":["open","oven","upon","opener"],"sentence":"The big book is open.","image":"chapter-teaching","crop":[768,0,768,512],"alt":"Pip compares two red books: a large open book and a small closed book."},
    {"w":"night","d":["night","light","right","sight"],"sentence":"The moon shines at night.","image":"chapter-teaching","crop":[0,512,768,512],"alt":"Moonlight and a campfire light the night forest; an owl sits on a branch beside Pip."},
    {"w":"moon","d":["moon","noon","moan","soon"],"sentence":"The moon shines at night.","image":"chapter-teaching","crop":[0,512,768,512],"alt":"Moonlight and a campfire light the night forest; an owl sits on a branch beside Pip."},
    {"w":"light","d":["light","night","right","sight"],"sentence":"The fire gives light.","image":"chapter-teaching","crop":[0,512,768,512],"alt":"Moonlight and a campfire light the night forest; an owl sits on a branch beside Pip."},
    {"w":"fire","d":["fire","fine","five","fir"],"sentence":"The fire gives light.","image":"chapter-teaching","crop":[0,512,768,512],"alt":"Moonlight and a campfire light the night forest; an owl sits on a branch beside Pip."},
    {"w":"owl","d":["owl","own","oil","owlet"],"sentence":"An owl sits on the branch.","image":"chapter-teaching","crop":[0,512,768,512],"alt":"Moonlight and a campfire light the night forest; an owl sits on a branch beside Pip."},
    {"w":"forest","d":["forest","fairest","forget","forges"],"sentence":"Pip is in the forest.","image":"chapter-teaching","crop":[0,512,768,512],"alt":"Moonlight and a campfire light the night forest; an owl sits on a branch beside Pip."},
    {"w":"dragon","d":["dragon","dragons","wagon","drags"],"sentence":"Pip is a dragon.","image":"chapter-teaching","crop":[768,512,768,512],"alt":"Pip magically lifts a coin from a treasure chest beside a castle gate."},
    {"w":"treasure","d":["treasure","measure","pleasure","treason"],"sentence":"Pip finds the treasure.","image":"chapter-teaching","crop":[768,512,768,512],"alt":"Pip magically lifts a coin from a treasure chest beside a castle gate."},
    {"w":"coin","d":["coin","coil","join","corn"],"sentence":"A coin floats above the chest.","image":"chapter-teaching","crop":[768,512,768,512],"alt":"Pip magically lifts a coin from a treasure chest beside a castle gate."},
    {"w":"gate","d":["gate","gave","gaze","date"],"sentence":"The gate is by the castle.","image":"chapter-teaching","crop":[768,512,768,512],"alt":"Pip magically lifts a coin from a treasure chest beside a castle gate."},
    {"w":"castle","d":["castle","cattle","candle","castles"],"sentence":"The gate is by the castle.","image":"chapter-teaching","crop":[768,512,768,512],"alt":"Pip magically lifts a coin from a treasure chest beside a castle gate."},
    {"w":"magic","d":["magic","magma","music","magnet"],"sentence":"Pip uses magic to lift a coin.","image":"chapter-teaching","crop":[768,512,768,512],"alt":"Pip magically lifts a coin from a treasure chest beside a castle gate."}
  ];
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
  // Each place has six fixed targets. Earlier places remain available for review.
  const areas = [
    {id:'lantern-trail',name:'Lantern Trail',x:17,y:73,available:true,words:words.slice(0,6).map(item=>item.w),checkpoint:2,goal:'Follow the ember trail.',discovery:'Ember scales lead towards the river.'},
    {id:'fox-crossing',name:'Fox Crossing',x:34,y:39,available:true,words:words.slice(6,12).map(item=>item.w),checkpoint:4,goal:'Cross the river with the fox.',discovery:'A red book points to the old grove.'},
    {id:'old-grove',name:'Old Grove',x:57,y:65,available:true,words:words.slice(12,18).map(item=>item.w),checkpoint:6,goal:'Search beneath the old oak.',discovery:'The book reveals a trail of lanterns.'},
    {id:'lantern-ruins',name:'Lantern Ruins',x:63,y:24,available:true,words:words.slice(18,24).map(item=>item.w),checkpoint:8,goal:'Follow the lights through the ruins.',discovery:'An owl shows the way to the hidden nest.'},
    {id:'hidden-nest',name:'Hidden Nest',x:89,y:19,available:true,words:words.slice(24,30).map(item=>item.w),checkpoint:10,goal:'Find the way to Pip’s siblings.',discovery:'The nest is close. Face its guardian.'}
  ];
  const dragonStages = [
    {name:'Hatchling Pip',xp:0,crop:[150,160,409,307],scale:1},
    {name:'Young Pip',xp:250,minMinutes:250,minDays:14,crop:[838,11,542,460],scale:1.14},
    {name:'Growing Pip',xp:750,minMinutes:750,minDays:14,crop:[88,494,615,491],scale:1.3},
    {name:'Rideable Pip',xp:1500,minMinutes:1500,minDays:14,crop:[869,464,657,533],scale:1.45,requiresChapter:true}
  ];
  return {words, legacyWords, assessmentPools, demoWords, enemies, areas, dragonStages, chapterWordGoal:30};
});
