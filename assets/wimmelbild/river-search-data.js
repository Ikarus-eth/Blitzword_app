(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./quest-data.js'));else root.BlitzMapQuests=factory(root.BlitzMapQuests);})(typeof globalThis!=='undefined'?globalThis:this,function(original){
'use strict';
// Continuous scenes shared by the main game and the temporary bilingual sharing page.
function q(id,text,prompt,answer,labels,hint){return {id,region:'Explore the whole picture',text,prompt,answer:answer.toLowerCase(),options:labels.map(label=>({id:label.toLowerCase(),label})),hint};}
function scene(id,questions){return {...original[id],revision:'continuous-20261010-r1',image:'assets/wimmelbild/maps/'+id+'-continuous.webp',width:4096,height:2731,questions};}
return {...original,
'stone-dam':scene('stone-dam',[
 q('wheel-map-hut',['Some small animals have taken food.','Look all around the mill. Count only the squirrels with a red apple.'],'How many have a red apple?','Three',['Two','Three','Four','Five'],'Look on roofs, near trees and by the water. Do not count a squirrel with a nut.'),
 q('wheel-map-table',['Find the white cat.','It has found a place to sleep while people work.'],'Where is the cat sleeping?','In a blue cart',['In a blue cart','Under a table','On a flour bag','In a bread basket'],'Look around the bakehouse. Check inside things, too.'),
 q('wheel-map-gate',['Find the red hose by the water pump.','Follow it all the way to the other end.'],'What is at the end of the hose?','Yellow flowers',['Yellow flowers','A fish pond','A pile of wood','A row of boots'],'Follow the same red line, even where it bends.')]),
'mist-lamps':scene('mist-lamps',[
 q('mist-map-hut',['Some birds have blue ribbons in their beaks.','Search high and low. Count each bird just once.'],'How many birds have a blue ribbon?','Three',['One','Two','Three','Four'],'Look on both sides of the stream, including the high branches and roofs.'),
 q('mist-map-dock',['The lamps are lit, but one fox is having a rest.','Find its small hiding place.'],'Where is the fox resting?','Under a bridge',['Inside a boat','Under a bridge','On a roof','Beside the tea cups'],'Follow the stream and look below the paths that cross it.'),
 q('mist-map-lamp',['Find the red boat.','Someone has left a net and something to wear inside.'],'What did they leave with the net?','A pair of boots',['A pair of gloves','A red hat','A pair of boots','A blue coat'],'Look inside the boat, not on the landing beside it.')]),
'high-nest':scene('high-nest',[
 q('nest-map-dragon',['Look at every dragon, from the high rocks to the low nests.','Count only those resting with their heads down.'],'How many dragons are asleep?','Two',['One','Two','Three','Four'],'Check opposite corners of the picture. A dragon with its head up does not count.'),
 q('nest-map-eggs',['Find the dragon with red and pink scales.','It has black stripes and a long tail. Look by its front feet.'],'What is it playing with?','A blue ball',['A red kite','A green rope','A blue ball','A yellow cup'],'Look for a small round toy on the grass.'),
 q('nest-map-basket',['Find the nest with green eggs and one purple egg.','Look at the small animals on the rocks around it.'],'Which pair can you find there?','A blue bird and a squirrel',['A white cat and a mouse','A fox and a rabbit','A dog and a duck','A blue bird and a squirrel'],'Check the rocks beside and below the nest. Both animals must be there.')]),
'river-heart':scene('river-heart',[
 q('river-map-lever',['Little boats are sailing through the town.','Find every boat with a red sail. Check the far water, too.'],'How many boats have red sails?','Three',['Two','Four','Three','Five'],'Follow the river from the far bank down to the front. Ignore blue and white sails.'),
 q('river-map-chest',['Find the brown dog carrying something in its mouth.','Look closely at what it has picked up.'],'What colour is the thing it carries?','Green',['Red','Blue','Yellow','Green'],'Look around the garden and the people beside it.'),
 q('river-map-tower',['Find the red kite in the sky.','Follow its string down to the person holding it.'],'Who is flying the red kite?','The girl in yellow',['The boy in blue','The girl in yellow','The man in green','The girl in red'],'Keep following the red kite’s own string. Another kite has a different owner.')])
};
});
