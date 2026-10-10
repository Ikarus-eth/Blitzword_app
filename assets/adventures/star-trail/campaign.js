(function(root,factory){const data=factory();if(typeof module==='object'&&module.exports)module.exports=data;else root.BlitzStarCampaign=data;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const pick=(id,title,text,prompt,labels,answer,hint,explanation,reward)=>({id:'sky-'+id,title,text,prompt,type:'choose',options:labels.map((label,i)=>({id:String(i),label,icon:/^\d+$/.test(label)?'number':'mark'})),answer:String(answer),hint,explanation,reward});
  const order=(id,title,text,labels,answer,hint,explanation,reward)=>({...pick(id,title,text,'Tap the actions in the right order.',labels,0,hint,explanation,reward),type:'order',answer:answer.map(String)});
  const missions=[
    {id:'star-post',name:'The Letter from the Snow Owl',place:'Star Post Village',area:'chapter-7-place-1',requires:[],families:['snow-owl','hollow-owl'],
      goal:'Find the owl’s letter and the first star piece.',item:'Silver star piece',symbol:'wing',
      intro:'The sky has lost its stars! A white owl brings a letter. Eight star pieces are hidden in the hills. Find the first one in the village.',
      ending:'The silver piece shines. The letter shows two paths: a crystal pass and a snow garden.',
      riddles:[
        pick('post-letter','A letter changes hands',['The Snow Owl gives a letter to Pip.','Pip puts it in the blue box.','The Hollow Owl moves the whole box into the hut.'],'Where is the letter now?',['With the Snow Owl','In the blue box in the hut','Under the hut'],1,'Follow the letter and the box it is inside.','The letter stayed inside the blue box when the box moved.','You open the star letter.'),
        pick('post-address','The right door',['The letter is for a house with a round window.','Its door is not red.'],'Which house fits both clues?',['Round window · red door','Square window · blue door','Round window · green door'],2,'Check the window first, then the door.','Only the round window and green door fit both clues.','The keeper welcomes you.'),
        pick('post-stamps','Stamps for the reply',['The owl has twelve stamps.','She uses three on each of two letters.'],'How many stamps are left?',['Six','Nine','Ten'],0,'Work out how many stamps the two letters use.','Two groups of three use six stamps. Twelve minus six is six.','Both letters are ready.'),
        order('post-send','Send the news',['Put the letter in the bag before you tie the bag.','Ring the post bell after you tie the bag.'],['Ring bell','Put letter in','Tie bag'],[1,2,0],'Keep the letter safe before calling the owl.','Letter in, bag tied, then bell rung.','Search the village for the silver star piece.')
      ]},
    {id:'crystal-pass',name:'The Lynx and the Crystal Pass',place:'Crystal Pass',area:'chapter-6-place-5',requires:['star-post'],families:['frost-lynx','fern-wolf'],
      goal:'Open a safe path through the crystal gorge.',item:'Blue star piece',symbol:'gem',
      intro:'The Frost Lynx waits by a shining gorge. The bridge is closed. Read the trail signs to find a way through.',
      ending:'You cross the gorge. The blue piece is safe. Far above, a lift waits in the clouds.',
      riddles:[
        pick('pass-trail','The lynx’s trail',['Take a path that goes through a tunnel.','After the tunnel, pass a pine.','Do not use the broken bridge.'],'Which route is safe?',['Tunnel → bridge','Pine → tunnel','Tunnel → pine'],2,'The order matters as well as the places.','Tunnel then pine follows the clues without the broken bridge.','You reach the far side.'),
        pick('pass-ropes','Join the ropes',['One rope is four steps long. Another is six steps long.','The knot uses one step of rope from each piece.'],'How long is the joined rope?',['Eight steps','Nine steps','Ten steps'],0,'The knot uses two steps in all.','Four plus six is ten. Take away two for the knot: eight steps.','The rope reaches the ledge.'),
        order('pass-crate','Move the crystal',['Wrap the crystal before putting it in the crate.','Close the lid after the crystal is in.'],['Close lid','Put crystal in','Wrap crystal'],[2,1,0],'Protect the crystal first.','Wrap it, put it in, then close the lid.','The crystal travels safely.'),
        pick('pass-key','Two true clues',['Each key opens only one lock.','The blue key opens the store.','The star gate needs a key with teeth.','The red key has teeth; the green key is smooth.'],'Which key opens the star gate?',['Blue key','Red key','Green key'],1,'The blue key belongs to a different lock.','The red key is the remaining key with teeth.','Search the pass for the blue star piece.')
      ]},
    {id:'snow-garden',name:'The Hare’s Winter Garden',place:'Winter Garden',area:'chapter-3-place-2',requires:['star-post'],families:['snow-hare','acorn-imp'],
      goal:'Help the Snow Hare save the winter plants.',item:'Green star piece',symbol:'leaf',
      intro:'A cold wind blows through the garden. The Snow Hare needs help to cover the plants. A star piece is hidden here.',
      ending:'The plants are warm. The green piece glows. You can now carry supplies towards the high slopes.',
      riddles:[
        pick('garden-cover','A warm cover',['The plants need a cover that lets in light.','Rain must not get through it.'],'Which cover works?',['Clear glass','Dark cloth','A net with holes'],0,'Think about both light and rain.','Clear glass lets in light and keeps out rain.','The little plants stay safe.'),
        pick('garden-pots','Room for every seed',['There are four trays with three spaces in each.','Seven spaces already have seeds.'],'How many spaces are empty?',['Four','Six','Five'],2,'Count all the spaces before taking away seven.','Four groups of three make twelve. Twelve minus seven is five.','You find room for the last seeds.'),
        order('garden-plant','Plant a seed',['Make a hole before you put the seed in.','Cover the seed after it goes in.'],['Put seed in','Cover seed','Make hole'],[2,0,1],'The seed needs a place to go.','Hole first, seed in, then cover it.','A new plant can grow.'),
        pick('garden-water','Follow the water',['The hare fills a jug from the well.','She pours all its water into the red can.','The imp puts the empty jug by the green can.'],'Which thing holds the water?',['Green can','Red can','Jug'],1,'Moving the empty jug does not move the water.','All the water went into the red can.','Search the garden for the green star piece.')
      ]},
    {id:'cloud-lift',name:'The Yak and the Cloud Lift',place:'Cloud Lift',area:'chapter-7-place-2',requires:['crystal-pass','snow-garden'],families:['cloud-yak','stone-ram'],
      goal:'Mend the lift and carry the supplies up.',item:'Cloud star piece',symbol:'rope',
      intro:'The Cloud Yak has food for the high village. Its lift will not move. Find the fault and help the baskets rise.',
      ending:'The lift climbs above the clouds. You find a pale star piece. The pine store and wind tower are now within reach.',
      riddles:[
        pick('lift-load','A full basket',['The lift can hold ten stones of weight.','A food box weighs six stones.'],'Which extra load fills it exactly?',['Three stones','Five stones','Four stones'],2,'Find the gap between six and ten.','Six plus four makes ten.','The basket is balanced.'),
        pick('lift-wheel','The missing wheel',['The top wheel is big and dry.','The middle wheel is small and dry.','The bottom wheel is big and wet.','The lift needs a big wheel that is not wet.'],'Which wheel should you fit?',['Top wheel','Middle wheel','Bottom wheel'],0,'Both size and dryness matter.','Only the top wheel is both big and dry.','The new wheel fits.'),
        order('lift-start','Before the lift moves',['Close the basket gate before testing its latch.','Pull the lever after testing the latch.'],['Pull lever','Close gate','Test latch'],[1,2,0],'Secure the basket before you start.','Close the gate, test the latch, then pull the lever.','The basket starts to rise.'),
        pick('lift-trips','Supplies for the village',['There are eighteen food bags.','The lift takes six bags on each trip.'],'How many trips are needed?',['Two','Three','Four'],1,'Count groups of six until you reach eighteen.','Six, twelve, eighteen: three trips.','Search the lift station for the cloud star piece.')
      ]},
    {id:'pine-store',name:'The Marmot’s Missing Stores',place:'Pine Store Village',area:'chapter-3-place-1',requires:['cloud-lift'],families:['pinecone-marmot','bark-beetle'],
      goal:'Sort the winter food in the hollow tree.',item:'Amber star piece',symbol:'seed',
      intro:'The Pinecone Marmot has mixed up the winter stores. Read the labels and help each bag reach the right shelf.',
      ending:'The stores are ready for winter. The amber piece shines beside the others. The moon steps lie ahead.',
      riddles:[
        pick('store-shelf','A place for the nuts',['Nuts go above the apples.','Apples go above the roots.','There are three shelves.'],'What goes on the middle shelf?',['Roots','Nuts','Apples'],2,'Put the three foods in order from top to bottom.','Nuts, apples, roots: apples go in the middle.','The shelves have clear labels.'),
        pick('store-bags','Share the pine nuts',['The marmot has twenty nuts.','Five go into each bag.','One full bag is already packed.'],'How many more bags must be packed?',['Three','Four','Five'],0,'Twenty nuts fill four bags altogether.','Four bags are needed, and one is ready. Three more remain.','All the nuts are packed.'),
        pick('store-track','The beetle’s delivery',['The beetle puts a bag by the door.','The marmot moves it under the table.','Pip carries the table to the wall, leaving the bag where it was.'],'Where is the bag now?',['By the wall','Where the table used to stand','By the door'],1,'The last move carries only the table.','The bag stays on the floor where the table used to stand.','You find the missing bag.'),
        order('store-close','Keep the stores dry',['Check every lid before shutting the store door.','Hang the key up after shutting the door.'],['Shut door','Hang key up','Check lids'],[2,0,1],'Finish checking inside before you close the store.','Lids checked, door shut, key hung up.','Search the village for the amber star piece.')
      ]},
    {id:'wind-tower',name:'The Falcon’s Wind Tower',place:'Wind Tower',area:'chapter-7-place-4',requires:['cloud-lift'],families:['gale-falcon','storm-griffin'],
      goal:'Send a safe signal from the wind tower.',item:'Gold star piece',symbol:'lamp',
      intro:'The Gale Falcon circles the tower. A strong wind has mixed up the flags. Help send a signal to the mountain friends.',
      ending:'The signal flies above the tower. The gold piece is yours. The high friends will meet you at the moon steps.',
      riddles:[
        pick('tower-signal','Read the flags',['A safe signal has a blue flag above a yellow flag.','A red flag means wait.'],'Which signal says it is safe?',['Yellow above blue','Blue above yellow','Blue above red'],1,'Check the colour order, not just the colours.','Blue above yellow is the safe signal.','The falcon can fly on.'),
        pick('tower-time','A long flight',['The falcon flies for nine minutes to the ridge.','It rests for three minutes, then flies for eight more.'],'How many minutes does it spend flying?',['Seventeen','Twenty','Eleven'],0,'The question asks for flying time, not resting time.','Nine plus eight is seventeen minutes in flight.','You plan the next message.'),
        order('tower-mend','Mend the flag',['Take the flag down before you mend the tear.','Raise it after the tear is mended.'],['Mend tear','Raise flag','Take flag down'],[2,0,1],'Bring the cloth within reach first.','Take it down, mend the tear, then raise it.','The flag catches the wind.'),
        pick('tower-perch','Three resting birds',['The falcon is left of the owl.','The griffin is right of the owl.','All three face you in one row.'],'Who is in the middle?',['Falcon','Griffin','Owl'],2,'Place the owl between the other two birds.','Falcon, owl, griffin: the owl is in the middle.','Search the tower grounds for the gold star piece.')
      ]},
    {id:'moon-steps',name:'The Ibex and the Moon Steps',place:'Moon Steps',area:'chapter-7-place-3',requires:['pine-store','wind-tower'],families:['lichen-ibex','snail-knight'],
      goal:'Follow the moon steps to the summit.',item:'Violet star piece',symbol:'moon',
      intro:'The Lichen Ibex knows a path up the cliffs. The moon lights the steps. Read carefully to keep every friend on the safe route.',
      ending:'You reach the high garden. Seven pieces shine. The Aurora Elk guards the last one at the crown of the mountain.',
      riddles:[
        pick('steps-route','One safe crossing',['Cross a bridge before going under an arch.','Avoid the cave.'],'Which route fits?',['Bridge → cave → arch','Arch → bridge','Bridge → arch'],2,'Check the order and the place to avoid.','Bridge then arch follows both rules.','Your friends reach the moon steps.'),
        pick('steps-rest','Steps still to climb',['There are twenty-four steps to the garden.','You climb three groups of six.'],'How many steps are left?',['Six','Eighteen','Twelve'],0,'Three groups of six is the number already climbed.','Eighteen steps are climbed. Twenty-four minus eighteen leaves six.','The summit is close.'),
        pick('steps-pack','The lightest safe pack',['Take a pack with a rope and a lamp.','The red pack has only a rope.','The blue pack has both and weighs four stones.','The green pack has both and weighs six stones.'],'Which safe pack is lightest?',['Red pack','Blue pack','Green pack'],1,'First find the safe packs, then compare their weight.','Blue and green are safe. The blue pack is lighter.','You have light and a safety rope.'),
        order('steps-cross','Help the last friend',['Tie the safety rope before the knight crosses.','Untie it after the knight reaches the other side.'],['Knight crosses','Untie rope','Tie rope'],[2,0,1],'Keep the rope in place for the whole crossing.','Tie the rope, let the knight cross, then untie it.','Search the steps for the violet star piece.')
      ]},
    {id:'aurora-crown',name:'The Sky Shines Again',place:'Aurora Crown',area:'chapter-7-place-5',requires:['moon-steps'],families:['aurora-elk','snow-owl'],finale:true,
      goal:'Find the last piece and light the star crown.',item:'Aurora star piece',symbol:'star',
      intro:'The Aurora Elk waits beneath the northern lights. One star piece is still missing. Find it and help the whole sky shine again.',
      ending:'All eight pieces shine in the crown! Stars fill the sky. The owl, lynx, hare, yak, marmot, falcon, ibex and elk cheer for you.',
      riddles:[
        pick('crown-chest','The final hiding place',['Each box holds just one thing.','The red box holds ribbon.','The blue box is empty.','The last piece is in one of these three boxes.'],'Where is the star piece?',['Red box','Blue box','Green box'],2,'Two boxes are already ruled out.','Red has ribbon and blue is empty. The piece must be in green.','You find the final star clue.'),
        pick('crown-lamps','Lights round the crown',['Eight posts each need two lamps.','Ten lamps are already hung.'],'How many more lamps are needed?',['Six','Eight','Four'],0,'Count all the lamps, then take away those already hung.','Eight groups of two make sixteen. Sixteen minus ten leaves six.','The crown is ringed with light.'),
        order('crown-join','Build the star crown',['Put all the pieces in before closing the silver ring.','Lift the crown after closing the ring.'],['Lift crown','Put pieces in','Close ring'],[1,2,0],'Make the pieces secure before lifting them.','Pieces in, ring closed, then crown lifted.','The crown is ready to shine.'),
        pick('crown-code','The elk’s last clue',['The lock uses an even number.','It is greater than six and less than ten.'],'Which number opens it?',['Seven','Eight','Nine'],1,'An even number makes two equal groups.','Eight is the only even number between six and ten.','Explore the summit and light the sky!')
      ]}
  ];
  for(const m of missions){m.campaign='star-trail';m.art='assets/adventures/star-trail/'+m.id+'.png';m.artAlt='A detailed painted landscape of '+m.place+'.';}
  const campaign={id:'star-trail',name:'The Sky That Lost Its Stars',shortName:'Sky stars',scene:'assets/adventures/star-trail/aurora-crown.png',intro:'Eight star pieces are lost in the hills. Meet eight new friends and help the sky shine again.',ending:'All eight pieces shine! Your mountain friends celebrate beneath the stars.',prize:'Keeper of the Mountain Stars',missions:missions.map(m=>m.id)};
  return {campaign,missions};
});
