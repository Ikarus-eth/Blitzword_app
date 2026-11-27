(function(root){
// Eleven creatures Artus chose on 20 November 2026 (docs/enemies/creature-votes/2026-11-20-votes.json).
// ChatGPT ImageGen pictures, cut out locally (rembg isnet-general-use) without redrawing, 512 × 512 RGBA PNG.
// This file adds them to the approved October roster; load it after approved-20261010/roster.js.
const base=typeof module==='object'&&module.exports?require('../approved-20261010/roster.js'):root.BlitzApprovedEnemies;
const art=id=>({source:'assets/enemies/approved-20261121/'+id+'.png',width:512,height:512,view:[0,0,512,512]});
const make=(id,file,name,title,option,attackMode,lore,description)=>({id,conceptId:null,name,option,title,description,
  reference:'concepts/*-20261120:'+file+'-'+option+'.png',score:5,availability:'future-chapter',family:id,minHealth:3,maxHealth:5,
  tier:0,count:1,stage:'adult',lore:['This friend comes from far away.',lore],art:art(file),attackMode,batch:'2026-11-20'});
const entries=[
  make('sun-tiger','tiger','Sun Tiger','Suncrest Tiger','c','melee','It wears a green cape and a bronze guard, and it is never afraid.','orange tiger with green cape and bronze shoulder guard'),
  make('red-phoenix','phoenix','Red Phoenix','Rowan Phoenix','a','ember','Its red and gold wings are as bright as a fire.','red and gold phoenix with a small amulet'),
  make('reef-octopus','octopus','Reef Octopus','Reefkeeper Octopus','c','melee','It has a coral crown and eight strong arms with gold rings.','teal octopus with coral crown and gold arm bands'),
  make('digger-aardvark','aardvark','Digger Aardvark','Champion Aardvark','c','melee','It has a long nose, big ears and a bag for its tools.','aardvark with goggles, green cape and leather satchel'),
  make('frost-bison','bison','Frost Bison','Elemental Bison','b','gust','Its white fur is as cold as snow, and its breath is like ice.','white and blue frost bison breathing cold mist'),
  make('star-camel','camel','Star Camel','Elemental Camel','b','gust','It walks at night, and there are little stars in its coat.','purple camel with starry markings and a glowing hump'),
  make('wave-pelican','pelican','Wave Pelican','Elemental Pelican','b','gust','It can carry a little sea in its big beak.','white pelican with blue water wings and a glowing pouch'),
  make('wind-fish','flying-fish','Wind Fish','Elemental Flying Fish','b','gust','It jumps out of the sea and flies on the wind.','blue flying fish with wide shining fins'),
  make('guard-okapi','okapi','Guard Okapi','Champion Okapi','c','melee','It has stripes on its legs, and it guards the deep forest.','okapi with green cape and gold chest guard'),
  make('crest-cassowary','cassowary','Crest Cassowary','Champion Cassowary','c','melee','It can not fly, but it can run very fast on strong legs.','dark cassowary with blue head, gold crest and leaf armour'),
  make('lava-triceratops','triceratops','Lava Triceratops','Elemental Triceratops','b','ember','It has three horns, and they are as hot as fire.','brown triceratops with glowing lava horns and cracks'),
];
const all=[...(base?.entries||[]),...entries];
const api={entries:all,byId:Object.fromEntries(all.map(e=>[e.id,e])),november:entries};
if(typeof module==='object'&&module.exports)module.exports=api;else root.BlitzApprovedEnemies=api;
})(typeof globalThis!=='undefined'?globalThis:this);
