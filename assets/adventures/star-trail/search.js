(function(root,factory){const data=factory();if(typeof module==='object'&&module.exports)module.exports=data;else root.BlitzStarMaps=data;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  function q(id,text,prompt,labels,answer,hint){return {id:'sky-map-'+id,region:'Explore the whole picture',text,prompt,options:labels.map((label,i)=>({id:String(i),label})),answer:String(answer),hint};}
  function map(id,title,questions){return {id,title,image:'assets/adventures/star-trail/'+id+'.png',width:1536,height:1024,revision:'sky-stars-20261010-r1',questions};}
  return {
    'star-post':map('star-post','Star Post Village',[
      q('post-cat',['The village is busy, but the white cat is asleep.','Find its resting place.'],'Where is the cat sleeping?',['On a roof','In a blue wheelbarrow','Under a bridge','In a post bag'],1,'Look inside the things used to carry supplies.'),
      q('post-scarf',['Clothes are drying outside.','Look for the long scarf hanging on the line.'],'What colour is the scarf?',['Blue','Green','Red','Yellow'],2,'Search around the cottages, above the paths.'),
      q('post-boat',['Find the small wooden boat in the stream.','Look closely at its load.'],'What is the boat carrying?',['Yellow flowers','Red apples','Blue blankets','Orange pumpkins'],0,'Follow the water through the village.')]),
    'crystal-pass':map('crystal-pass','Crystal Pass',[
      q('pass-dog',['Find the small brown dog near a workshop.','It has climbed up high.'],'What is it standing on?',['A wooden barrel','A stone wall','A blue cart','A roof'],0,'Look around the places where people work.'),
      q('pass-fruit',['Find the green umbrella at the fruit stall.','Look at the round red fruit below it.'],'What is the round red fruit?',['Pears','Lemons','Plums','Apples'],3,'Check the terraces on both sides of the gorge.'),
      q('pass-boat',['Find the red boat.','Look at what is above it.'],'Where is the boat?',['Inside a cave','Under a stone bridge','Beside the lift','On a roof'],1,'Follow the river through each crossing.')]),
    'snow-garden':map('snow-garden','Winter Garden',[
      q('garden-hat',['Snowmen stand among the garden terraces.','Search the whole garden. Count each snowman once.'],'How many snowmen can you find?',['One','Two','Three','Four'],1,'Check near the glasshouse and beside the lower paths. A scarecrow is not a snowman.'),
      q('garden-cat',['Find the black cat.','It is sleeping on a piece of garden furniture.'],'Where is it sleeping?',['On a yellow bench','In a red cart','Under a table','On a blue chair'],0,'Look along the lower garden paths.'),
      q('garden-crop',['The red wheelbarrow holds food from the garden.','Look inside it.'],'What is in the wheelbarrow?',['Apples','Potatoes','Cabbages','Carrots'],3,'Search the terraces between the greenhouses.')]),
    'cloud-lift':map('cloud-lift','Cloud Lift Station',[
      q('lift-goat',['A white goat has found a high place to stand.','Find it near the lift buildings.'],'Where is the goat?',['On a bridge','On a shed roof','In a lift basket','On a barrel'],1,'Look above the doors of the small buildings.'),
      q('lift-kite',['A yellow kite has stopped flying.','Search the tall things around the station.'],'Where is it caught?',['On the lift cable','In a pine tree','On the shed door','On a flagpole'],1,'Look among the branches, high above the paths.'),
      q('lift-cart',['Follow the lift cables across the valley.','Count the baskets hanging from them.'],'How many hanging lift baskets can you see?',['One','Three','Two','Four'],2,'Do not count the blue cart on the platform.')]),
    'pine-store':map('pine-store','Pine Store Village',[
      q('store-ribbon',['Find the red squirrel on the big hollow tree.','Look at the ribbon it is holding.'],'What colour is the ribbon?',['Yellow','Red','Green','Blue'],3,'Search above the storehouse doors.'),
      q('store-cat',['A white cat is curled up in a basket.','Find its cosy place.'],'What colour is the basket?',['Green','Blue','Red','Yellow'],0,'Check the baskets near the front of the village.'),
      q('store-cart',['Find the wooden cart beside a small bridge.','Look at its round orange load.'],'What is in the cart?',['Bread','Pumpkins','Apples','Pots'],1,'Follow the paths to the bridge.')]),
    'wind-tower':map('wind-tower','Wind Tower Grounds',[
      q('tower-kite',['Find the red kite in the sky.','Follow its string all the way down.'],'Who is holding the string?',['A boy in blue','A girl in yellow','A man in green','A woman in red'],1,'Keep following the red kite’s own string.'),
      q('tower-bird',['Find the blue bird high on the tower.','Look beneath its feet.'],'What is it sitting on?',['A red flag','A wooden box','A gold bell','A blue roof'],2,'Look around the openings near the top of the tower.'),
      q('tower-dog',['A brown dog is resting in the shade.','Search the places where people can sit.'],'Where is the dog?',['Under a wooden bench','In a cart','On a table','Beside the tower door'],0,'Check underneath the seats, not just on top.')]),
    'moon-steps':map('moon-steps','Moon Steps',[
      q('steps-rabbit',['Find the red boat by the steps.','Look inside it.'],'Which animal is in the boat?',['A black cat','A brown dog','A blue bird','A white rabbit'],3,'Follow the water near the foot of the cliffs.'),
      q('steps-light',['Find the stone arch with a lantern hanging beneath it.','Look at the lantern.'],'What colour is the lantern?',['Yellow','Green','Red','Blue'],1,'Look below the arch, rather than above it.'),
      q('steps-pack',['Someone left a yellow backpack on a high terrace.','Find the pack’s resting place.'],'Where is the backpack?',['On a wooden bench','In a boat','Under a bridge','Beside a waterfall'],0,'Follow the steps upwards and check each terrace.')]),
    'aurora-crown':map('aurora-crown','Aurora Crown Garden',[
      q('crown-cat',['Find the white cat outside a round dome.','It is sleeping on a soft cushion.'],'What colour is the cushion?',['Green','Yellow','Blue','Red'],3,'Search around the observatory buildings.'),
      q('crown-flowers',['Ducks are swimming in the garden water.','Check both above and below the stone bridge.'],'How many ducks are swimming?',['Two','Four','Three','Five'],1,'Count the ducks in the upper pond and in the water below it.'),
      q('crown-dog',['Find the brown dog beside the pond.','Look at the scarf in its mouth.'],'What colour is the scarf?',['Green','Blue','Yellow','Red'],0,'Search around the water in the middle of the garden.')])
  };
});
