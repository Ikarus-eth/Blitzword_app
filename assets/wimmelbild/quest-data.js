(function(root,factory){const data=factory();if(typeof module==='object'&&module.exports)module.exports=data;else root.BlitzMapQuests=data;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const colours=['Red','Blue','Green','Yellow'];
function question(id,region,text,prompt,answer,options=colours){return {id,region,text,prompt,answer:answer.toLowerCase(),options:options.map(label=>({id:label.toLowerCase(),label})),hint:'Check each part of the clue. Several things look alike. Zoom in to check the small marks.'};}
function map(id,title,questions){return {id,title,image:'assets/wimmelbild/maps/'+id+'.webp',width:3072,height:2048,questions};}
return {
'crab-ferry':map('crab-ferry','The Crystal Ferry — the harbour map',[
question('ferry-map-boat','Upper left · Ferry docks',['Find a boat with a moon on its sail.','It has two red flags.','Look at the chest on that boat.'],'What colour is the chest?','Green'),
question('ferry-map-stall','Upper right · The market',['Find the stall with a white owl and a gold bell.','It sells yellow pears.','Look at the cloth roof.'],'What colour is the roof?','Blue'),
question('ferry-map-rope','Lower left · The boatyard',['Find a closed green chest with a gold moon.','A red rope is by it.','Look at the bottle on the same bench.'],'What colour is the bottle?','Blue')]),
'stone-dam':map('stone-dam','The Sleeping Waterwheel — the mill map',[
question('wheel-map-hut','Upper left · The mills',['Find a hut with a green door and a gold moon.','Two pots of red flowers are by the door.','Look up at its roof.'],'What colour is the roof?','Blue'),
question('wheel-map-table','Upper right · The workshop',['Find the table with an open blue book.','A gold bell is on the same table.','Look for its jug.'],'What colour is the jug?','Red'),
question('wheel-map-gate','Lower left · The water gates',['Find a gate with a gold moon.','A white cat is beside it.','Its flags are blue.'],'How many blue flags are there?','Two',['One','Two','Three','Four'])]),
'mist-lamps':map('mist-lamps','The Lamps in the Mist — the woodland map',[
question('mist-map-hut','Upper left · The tree houses',['Find a red door with a white owl above it.','A gold bell is by the door. There is no red lamp.','Look at that house.'],'What colour is its roof?','Green'),
question('mist-map-dock','Upper right · The landing places',['Find just one gold bell over a landing place.','A white cat is below them.','Look at the boat beside it.'],'What colour is the boat?','Red'),
question('mist-map-lamp','Lower left · The lamp clearing',['Find the gold moon.','A closed blue book is below it.','Look at the lantern beside the book.'],'What colour is the lantern?','Yellow')]),
'high-nest':map('high-nest','The Nest Above the Falls — the high map',[
question('nest-map-dragon','Upper left · Dragon terraces',['Find a dragon with red and pink scales.','It has black stripes and a long tail.','Look at the crystal beside it.'],'What colour is the crystal?','Green'),
question('nest-map-eggs','Upper right · The nests',['Find a white bird with two blue eggs.','Look beside its nest.','There is a small flag.'],'What colour is the flag?','Red'),
question('nest-map-basket','Lower left · The rope lifts',['Find a basket with no hole.','A red rope is above it, below a gold star.','Look inside the basket.'],'What colour is the book?','Blue')]),
'river-heart':map('river-heart','The River Sings Again — the river-gate map',[
question('river-map-lever','Upper left · The gate controls',['Find a gate with a blue wave.','Two red lamps are by the gate.','Look at its lever.'],'What colour is the handle?','Yellow'),
question('river-map-chest','Upper right · The treasure terraces',['Find a green chest with a gold moon.','An open red book is beside it.','A white cat is below the book.'],'What colour is the flag above this chest?','Blue'),
question('river-map-tower','Lower left · The bell towers',['Find a tower with a gold moon.','It has two blue flags.','Look at the gold bells in that tower.'],'How many bells are there?','Three',['One','Two','Three','Four'])])
};
});
