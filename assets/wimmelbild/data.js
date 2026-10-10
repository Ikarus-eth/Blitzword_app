(function(root,factory){const data=factory();if(typeof module==='object'&&module.exports)module.exports=data;else root.WimmelData=data;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
// Rectangles are normalised coordinates measured against the authored 1536 × 1024 images.
return {version:1,title:'The secret dragon path',words:{
  scales:'The small plates that cover a dragon’s skin.',stripes:'Long bands of colour, like the marks on a tiger.',
  tail:'The long part at the back of an animal.',pink:'A light red colour.',black:'A very dark colour.',
  above:'Higher than something.',below:'Lower than something.',bell:'A thing that rings.',
  door:'You open it to go into a room.',chest:'A big box for treasure.',gold:'A shiny yellow metal.',
  closed:'Not open.',arch:'A curved opening made of stone.',moon:'The bright shape we see in the sky at night.',
  red:'The colour of a ripe strawberry.',white:'The colour of snow.',left:'This side: ←',right:'This side: →'
},scenes:[
 {id:'harbour',title:'The secret path',place:'The harbour',image:'harbour.webp',
  intro:'A secret path leads to a dragon’s treasure. Read the map to find the first stop.',
  lines:['Go from the ship to the big tree.','Then find a dragon.','The castle is the last stop.'],
  question:'Where do we go first?',action:'Go this way',answer:'tree',
  hint:'Read the first line again. Find the place it names in the picture.',arrival:'You found the tree village. Now look for the right door.',
  alt:'A harbour, a huge tree village, a rocky cave and a distant castle, with many little paths and buildings.',
  options:[{id:'cave',label:'To the cave',box:[.84,.40,.105,.13],feedback:'The cave is in the picture. Does the first line send us there?'},{id:'tree',label:'To the big tree',box:[.155,.03,.36,.43]},{id:'castle',label:'To the castle',box:[.60,.005,.16,.13],feedback:'The castle is the last stop. Where do we go first?'}]},
 {id:'village',title:'A door in the tree',place:'The tree village',image:'village.webp',
  intro:'Three red doors. Only one opens the way to the dragons.',
  lines:['Find a red door.','A white owl is above it.','A gold bell is by it.'],
  question:'Which door will you open?',action:'Open this door',answer:'high',
  hint:'Find the two white owls. Look beside each door: a bell or a light?',arrival:'The door opens onto the dragon valley. Find your guide.',
  alt:'A busy tree village with three red doors, bridges, stalls, animals, lanterns and bells.',
  options:[{id:'low',label:'The low door',box:[.502,.65,.076,.163],feedback:'There is a white owl here. Look again for the gold bell.'},{id:'right',label:'The door on the right',box:[.89,.246,.055,.126],feedback:'There is a bell here. What colour is the bird?'},{id:'high',label:'The high door on the left',box:[.092,.09,.05,.14]}]},
 {id:'dragons',title:'Find the dragon guide',place:'Dragon valley',image:'dragons.webp',
  intro:'One dragon knows the way to the castle. Look closely: some are very much alike.',
  lines:['Find the dragon with red and pink scales.','It has black stripes.','Its tail is long.'],
  question:'Which dragon will you ask?',action:'Ask this dragon',answer:'arch',
  hint:'Two red dragons have black stripes. Compare their tails. Pinch out to get closer.',arrival:'Your dragon guide brings you to the castle. The treasure is close.',
  alt:'Dragons with different colours, markings and tails gather among ruined arches, market stalls, a stream and flowering terraces.',
  options:[{id:'short',label:'High on the left',box:[.035,.185,.14,.145],feedback:'These colours and stripes fit. Is this tail long?'},{id:'water',label:'By the water',box:[.365,.495,.19,.245],feedback:'The stripes and long tail fit. Check the colour of the scales.'},{id:'arch',label:'By the stone arch',box:[.665,.31,.265,.235]},{id:'spots',label:'Low on the left',box:[.026,.593,.215,.24],feedback:'These colours and the long tail fit. Are those stripes or spots?'}]},
 {id:'treasure',title:'The moon treasure',place:'Inside the castle',image:'treasure.webp',
  intro:'The dragon leaves you one last clue. Take your time and look at every part.',
  lines:['Find the green chest with a gold moon.','A red book is open by it.','A white cat is below the book.'],
  question:'Which chest has the treasure?',action:'Open this chest',answer:'right',
  hint:'Find the two moon chests. Zoom in on the red book beside each. Is it open?',arrival:'You found the moon treasure!',
  alt:'A detailed castle treasury on several levels with green chests, books, cats, stairs, globes and moonlit windows.',
  options:[{id:'top',label:'The chest at the top',box:[.414,.148,.082,.089],feedback:'The book is open and the cat is there. Check the shape on the chest.'},{id:'right',label:'The chest on the right',box:[.713,.414,.083,.084]},{id:'left',label:'The chest low on the left',box:[.117,.767,.091,.095],feedback:'The chest has a moon. Look closely: is the red book open?'}]}
]};
});
