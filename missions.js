(function(root,factory){
  if(typeof module==='object'&&module.exports)module.exports=factory();
  else root.BlitzMissions=factory();
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const choice=(id,label,icon='mark',colour=null)=>({id,label,icon,colour});
  const pick=(id,title,text,prompt,labels,answer,hint,explanation,reward,extra={})=>({
    id,title,text,prompt,type:'choose',options:labels.map((label,i)=>typeof label==='string'?choice(String(i),label):label),
    answer:typeof answer==='number'?String(answer):answer,hint,explanation,reward,...extra
  });
  const order=(id,title,text,labels,answer,hint,explanation,reward)=>({
    id,title,text,prompt:'Tap the actions in the right order.',type:'order',options:labels.map((label,i)=>choice(String(i),label,'step')),
    answer:answer.map(String),hint,explanation,reward
  });
  const bag=c=>choice(c,c[0].toUpperCase()+c.slice(1)+' bag','bag',c);
  const chest=c=>choice(c,c[0].toUpperCase()+c.slice(1)+' chest','chest');
  const number=(n,unit='')=>choice(String(n),String(n)+(unit?' '+unit:''),'number');
  const campaigns=[
    {id:'lost-lights',name:'The Lost Forest Lights',shortName:'Forest lights',scene:'assets/campaign-hd/forest.webp',
      intro:'The forest lights have gone out. Help twelve woodland creatures find the six light seeds. Bring them to the old oak before the moon rises.',
      ending:'All six light seeds glow in the old oak. Paths shine from root to branch. Your woodland friends gather below. The forest has its lights back!',
      prize:'Keeper of the Forest Lights',missions:['first-spark','moth-post','root-workshop','owl-watch','mimic-vault','oak-heart']},
    {id:'river-song',name:'The River That Lost Its Song',shortName:'River song',scene:'assets/campaign-hd/river.webp',
      intro:'The river is silent. Six old water bells have stopped ringing. Follow the river, help its creatures and bring the bells back to life.',
      ending:'The six bells ring together. Water runs through the gates and under the bridges. Boats set off again. Even the Storm Griffin hums along!',
      prize:'Friend of the Singing River',missions:['reed-message','crab-ferry','stone-dam','mist-lamps','high-nest','river-heart']}
  ];
  const missions=[
    {id:'first-spark',campaign:'lost-lights',name:'The First Spark',place:'Lantern Trail',area:'lantern-trail',requires:[],families:['thornling','bark-beetle'],
      goal:'Find the first light seed in the beetle’s hollow log.',item:'Amber light seed',symbol:'seed',
      intro:'A Thornling has found a warm trail. A Bark Beetle guards the log at its end. Win their trail games, then help them find the first light seed.',
      ending:'The log opens. An amber seed glows inside! The Thornling plants a small sign: Friends of the forest. Two new paths are ready.',
      riddles:[
        pick('spark-bag','The beetle’s key',['Pip puts a key in the red bag.','He moves it to the blue bag.','The beetle takes the empty red bag.'],'Which bag holds the key?',[bag('red'),bag('blue'),bag('green')],'blue','Follow the key, not the bag that the beetle takes.','Pip moved the key to the blue bag. The red bag is empty.','You have the log key.'),
        pick('spark-path','Three trails',['The Thornling says, “Take a dry path.”','“Keep away from the cave too.”'],'Which trail fits both clues?',[
          choice('stream','Stream · trees','water'),choice('cave','Dry · cave','cave'),choice('oak','Dry · oak','tree')],'oak','First rule out the wet trail. Then rule out the cave.','Only the dry trail by the oak fits both clues.','You reach the hollow log.'),
        order('spark-lamp','A lamp for the log',['Put the seed cup down before you add the oil.','Add the oil before you light the lamp.'],['Light lamp','Put cup down','Add oil'],[1,2,0],'What must happen before the oil goes in?','Cup down, oil in, then light the lamp.','Warm light fills the log.'),
        pick('spark-box','The hidden seed',['Three boxes have leaf, sun and moon marks.','The seed is not in the leaf box.','Its mark lights and warms the day.'],'Open the seed box.',[chest('leaf'),chest('sun'),chest('moon')],'sun','Which mark warms the world during the day?','The sun mark fits the daytime clue.','The amber light seed is yours.')
      ]},
    {id:'moth-post',campaign:'lost-lights',name:'The Moon Post',place:'Fox Crossing',area:'fox-crossing',requires:['first-spark'],families:['moon-moth','acorn-imp'],
      goal:'Deliver the right parcel to the Moon Moth.',item:'Silver light seed',symbol:'moon',
      intro:'A Moon Moth carries letters after dark. An Acorn Imp has mixed up the bags at the crossing. Help sort the post and earn the silver seed.',
      ending:'The Moon Moth unfolds a silver wing. The right parcel holds a silver seed and a thank-you note. The post can fly again.',
      riddles:[
        pick('post-parcel','The torn label',['The moth’s parcel is small.','It has a star on it, not a leaf.'],'Which parcel belongs to the moth?',[
          choice('large-star','Big · star','star'),choice('small-leaf','Small · leaf','leaf'),choice('small-star','Small · star','star')],'small-star','A star alone is not enough. Check the size too.','The small parcel with a star fits both clues.','You find the right parcel.'),
        pick('post-letters','One empty pocket',['The imp has seven letters.','Two go to the owl. Three go to the moth.'],'How many letters are left?',[number(2),number(4),number(5)],'2','Take away the two owl letters, then the three moth letters.','Seven minus two leaves five. Five minus three leaves two.','All the letters are sorted.'),
        order('post-cross','The windy bridge',['Close the bag before you cross.','Cross before you hand the bag to the moth.'],['Cross bridge','Give bag','Close bag'],[2,0,1],'Stop the letters blowing away first.','Close the bag, cross the bridge, then give it to the moth.','The letters arrive safely.'),
        pick('post-code','The silver pocket',['The pocket opens with an even number.','It is more than four and less than eight.'],'Which number opens it?',[number(4),number(6),number(7),number(8)],'6','An even number can split into two equal groups. Check the two limits too.','Six is even, greater than four and less than eight.','The silver light seed shines.')
      ]},
    {id:'root-workshop',campaign:'lost-lights',name:'The Root Workshop',place:'Old Grove',area:'old-grove',requires:['first-spark'],families:['root-sprite','mushroom-guard'],
      goal:'Mend the seed lift beneath the old roots.',item:'Green light seed',symbol:'leaf',
      intro:'The Root Sprite’s lift is stuck. A Mushroom Guard has kept its parts safe. Find the right parts and send the green seed up to the trees.',
      ending:'The tiny lift climbs through the roots. At the top, a green seed pops out like a bright pea. The workshop is open again.',
      riddles:[
        pick('root-rope','A rope that will hold',['The lift needs a long rope.','A wet rope will slip.'],'Choose the rope.',[
          choice('short-dry','Short · dry','rope'),choice('long-wet','Long · wet','rope'),choice('long-dry','Long · dry','rope')],'long-dry','Look for the rope that is both long and dry.','The long, dry rope reaches the lift and will not slip.','A safe rope is tied on.'),
        pick('root-pegs','Bent pegs',['There are nine pegs in the tray.','Three are bent. Pip brings two more good pegs.'],'How many good pegs can you use?',[number(6),number(8),number(11)],'8','Leave out the three bent pegs before adding Pip’s two.','Nine minus three is six. Two more makes eight good pegs.','The lift has strong pegs.'),
        pick('root-box','Follow the gear',['The guard takes a gear from the green box.','She puts it under the blue box.','The green box goes on a shelf.'],'Where is the gear now?',[
          choice('green','In green box','chest'),choice('under-blue','Under blue box','gear'),choice('blue','In blue box','chest')],'under-blue','Watch the word “under”. It does not mean “in”.','The gear is under the blue box.','The missing gear is found.'),
        order('root-lift','Start the lift',['Fit the gear before you pull the rope.','Put the seed in the lift before you fit the gear.'],['Pull rope','Fit gear','Put seed in'],[2,1,0],'The seed must be in place before the gear is fitted.','Seed in, gear fitted, then pull the rope.','The green light seed reaches you.')
      ]},
    {id:'owl-watch',campaign:'lost-lights',name:'The Owl’s Watch',place:'Lantern Ruins',area:'lantern-ruins',requires:['moth-post','root-workshop'],families:['hollow-owl','briar-bat'],
      goal:'Help the night watch find a lost nest.',item:'Blue light seed',symbol:'star',
      intro:'The Hollow Owl can hear a chick, but cannot find its nest. A Briar Bat saw three paths from above. Put their clues together and guide the watch.',
      ending:'The chick hops into its nest. The owl gives you a blue seed that glows softly enough for small birds to sleep.',
      riddles:[
        pick('owl-perch','The owl’s clue',['Three trees stand in a row: oak, pine, birch.','The chick is not at either end.'],'Which tree should you search?',[
          choice('oak','Oak','tree'),choice('pine','Pine','tree'),choice('birch','Birch','tree')],'pine','Which tree is between the other two?','The pine is in the middle of the row.','You hear the chick in the pine.',{diagram:['Oak','Pine','Birch']}),
        pick('owl-track','Who went first?',['The owl flew past before the bat.','The moth flew past after the bat.'],'Who flew past last?',[
          choice('owl','Owl','wing'),choice('bat','Bat','wing'),choice('moth','Moth','wing')],'moth','Put the owl first, then the bat. Who comes after the bat?','Owl, bat, moth: the moth was last.','The moth points to the nest path.'),
        pick('owl-ladder','Two missing rungs',['The ladder needs eight rungs.','Six rungs are already fixed in place.','Pip has three spare rungs.'],'How many spare rungs will be left after the repair?',[number(1),number(2),number(3)],'1','Work out how many the ladder needs before taking them from Pip’s three.','The ladder needs two more rungs. Three spare rungs minus two leaves one.','The ladder reaches the nest.'),
        pick('owl-nest','A safe basket',['The chick needs a basket with a lid.','It must have no hole in the bottom.'],'Choose its basket.',[
          choice('open','No lid · no hole','basket'),choice('hole','Lid · hole','basket'),choice('safe','Lid · no hole','basket')],'safe','A lid is only one clue. Check the bottom too.','The lidded basket with no hole keeps the chick safe.','The blue light seed is yours.')
      ]},
    {id:'mimic-vault',campaign:'lost-lights',name:'The Laughing Vault',place:'Hidden Nest',area:'hidden-nest',requires:['moth-post','root-workshop'],families:['chest-mimic','snail-knight'],
      goal:'Get the golden seed from a very ticklish vault.',item:'Gold light seed',symbol:'key',
      intro:'The Chest Mimic laughs whenever its lock is touched. The Snail Knight knows the trick: bring a soft brush, solve the signs and ask politely.',
      ending:'The mimic giggles, then opens its lid. The Snail Knight bows so low that his shell tips forward. You catch the golden seed!',
      riddles:[
        pick('vault-tool','The ticklish lock',['Use something soft with no sharp teeth.','It must brush dust from a tiny lock.'],'Which tool should you take?',[
          choice('saw','Saw','tool'),choice('brush','Soft brush','tool'),choice('comb','Hard comb','tool')],'brush','Think about both the soft bristles and the job.','A soft brush can clear the lock without scratching it.','The dusty lock is clean.'),
        pick('vault-key','The knight’s keys',['The knight has a round key and a square key.','The round key opens the gate.','The other key opens the vault.'],'Which key opens the vault?',[
          choice('round','Round key','key'),choice('square','Square key','key'),choice('neither','Neither key','key')],'square','“The other key” means the one not used for the gate.','The square key is the other key.','The vault key turns.'),
        pick('vault-code','Three rows of bells',['The vault has three rows of bells.','There are four bells in each row.','Two bells make no sound.'],'How many bells can ring?',[number(7),number(10),number(12)],'10','Count all three groups of four. Then leave out the two silent bells.','Three groups of four makes twelve. Two are silent, so ten can ring.','The ringing code wakes the vault.'),
        order('vault-open','Mind your fingers',['Knock before you turn the key.','Step back after you turn the key.'],['Step back','Knock','Turn key'],[1,2,0],'Begin with the polite knock.','Knock, turn the key, then step back as the lid opens.','The gold light seed is yours.')
      ]},
    {id:'oak-heart',campaign:'lost-lights',name:'The Heart of the Oak',place:'The Oldest Oak',area:'chapter-3-place-5',requires:['owl-watch','mimic-vault'],families:['moss-golem','bramble-boar'],
      goal:'Find the last seed and bring light back to the forest.',item:'Ruby light seed',symbol:'sun',finale:true,
      intro:'Five seeds are safe. The Moss Golem and Bramble Boar guard the last one at the old oak. Earn their trust, mend the light ring and wake the tree.',
      ending:'The ruby seed joins the other five. Six lights climb the trunk and spread along every branch. Your first campaign is complete. A quiet river waits beyond the trees.',
      riddles:[
        pick('oak-trail','The boar’s tracks',['The boar crossed no bridge.','It went past a pond, then under an arch.'],'Which trail did it take?',[
          choice('bridge','Pond → bridge','map'),choice('arch','Pond → arch','map'),choice('reverse','Arch → pond','map')],'arch','The places matter, and so does their order.','Pond then arch matches both parts of the clue.','You reach the roots of the oak.'),
        pick('oak-seeds','The seed ring',['The ring has six spaces.','You have five seeds. The golem has the last one.','Two of your seeds are already in the ring.'],'How many more seeds must go in?',[number(3),number(4),number(6)],'4','Six spaces minus the two already filled. Count the golem’s seed too.','Four spaces remain: three of yours and the golem’s last seed.','You know how to fill the ring.'),
        pick('oak-mark','The last seed',['Three pots show a moon, a leaf and a sun.','The last seed is not under the leaf.','The golem says, “Its mark gives light, but is not the sun.”'],'Lift the right pot.',[chest('moon'),chest('leaf'),chest('sun')],'moon','Rule out leaf, then rule out sun.','The moon is the only mark left.','The ruby seed is found.'),
        order('oak-wake','Wake the forest',['Put every seed in before you close the ring.','Close the ring before you ring the bell.'],['Ring bell','Close ring','Put seeds in'],[2,1,0],'The seeds must be safely inside first.','Seeds in, ring closed, bell rung. Six colours light the forest.','The forest lights are back!')
      ]},
    {id:'reed-message',campaign:'river-song',name:'The Message in the Reeds',place:'River Path',area:'chapter-2-place-3',requires:[],families:['reed-serpent','bog-toad'],
      goal:'Find the first water bell and send a message downstream.',item:'Reed bell',symbol:'bell',
      intro:'The Reed Serpent finds a bottle in the silent river. A Bog Toad can carry a reply. Read the message, choose a safe route and wake the first bell.',
      ending:'The reed bell rings with a low, soft note. The toad carries your reply downstream. Two river paths open in the mist.',
      riddles:[
        pick('reed-bottle','A message moves',['The serpent puts the bottle beside a rock.','The toad moves it behind a tall reed.','Pip lifts the rock, but finds nothing.'],'Where is the bottle?',[
          choice('rock','Under rock','stone'),choice('reed','Behind reed','leaf'),choice('water','In water','water')],'reed','Track the toad’s move after the serpent puts the bottle down.','The toad moved the bottle behind the reed.','The message is in your hands.'),
        pick('reed-stones','Across the mud',['The toad needs a path with four stones.','None of the stones may be under water.'],'Choose its path.',[
          choice('three','3 dry stones','stone'),choice('wet','4 stones · 1 wet','water'),choice('four','4 dry stones','stone')],'four','Check both the number and whether every stone is dry.','Four dry stones meet both rules.','The toad crosses with the message.'),
        pick('reed-jumps','One trip too many?',['The toad carries two small notes on each trip.','There are eight notes to deliver.'],'How many trips does it need?',[number(3),number(4),number(6)],'4','Split eight notes into groups of two.','Four groups of two make eight notes.','Every creature gets the news.'),
        order('reed-bell','Free the first bell',['Lift the bell after you untie the reed.','Ring the bell after you lift it clear of the mud.'],['Ring bell','Lift bell','Untie reed'],[2,1,0],'The reed holds the bell down. Deal with that first.','Untie the reed, lift the bell, then ring it.','The reed bell rings!')
      ]},
    {id:'crab-ferry',campaign:'river-song',name:'The Crystal Ferry',place:'Still Pool',area:'chapter-2-place-4',requires:['reed-message'],families:['crystal-crab','stone-ram'],
      goal:'Help the ferry carry a crystal bell across the pool.',item:'Crystal bell',symbol:'gem',
      intro:'The Crystal Crab has a bell too heavy to carry. The Stone Ram has a small ferry. Mend the ferry and plan a safe crossing.',
      ending:'The ferry glides to the far bank. The crystal bell rings clear as a drop of rain. The ram gives a proud little bow.',
      riddles:[
        pick('ferry-load','A balanced boat',['The bell weighs four stones.','The boat can carry six stones in all.','Choose one extra load that fills it exactly.'],'Which load goes with the bell?',[number(1,'stone'),number(2,'stones'),number(3,'stones')],'2','How much room is left after the four-stone bell?','Six minus four leaves room for two stones.','The boat is balanced.'),
        pick('ferry-board','The repair board',['The hole is wide.','Use a wide board with no crack.'],'Choose a board.',[
          choice('thin','Narrow · sound','wood'),choice('cracked','Wide · cracked','wood'),choice('sound','Wide · sound','wood')],'sound','A wide board will not help if it has a crack.','The wide, sound board covers the hole safely.','The ferry is watertight.'),
        pick('ferry-rope','Find the coil',['Coils sit in four boxes: sun, leaf, moon, star.','Take a box between sun and star.','Do not take the leaf box.'],'Which box has your rope?',[chest('sun'),chest('leaf'),chest('moon'),chest('star')],'moon','Leaf and moon are between the end boxes. One is ruled out.','Moon is between sun and star and is not leaf.','You find the ferry rope.',{diagram:['Sun','Leaf','Moon','Star']}),
        order('ferry-land','Land the bell',['Tie the boat before you lift the bell out.','Lift the bell out before you untie the boat.'],['Lift bell out','Untie boat','Tie boat'],[2,0,1],'Keep the boat still while the heavy bell comes out.','Tie the boat, lift out the bell, then untie the boat.','The crystal bell is on its stand.')
      ]},
    {id:'stone-dam',campaign:'river-song',name:'The Sleeping Waterwheel',place:'Stone Bridge',area:'chapter-2-place-2',requires:['reed-message'],families:['cave-troll','mushroom-guard'],
      goal:'Repair the wheel that lifts water to the next bell.',item:'Wheel bell',symbol:'gear',
      intro:'A Cave Troll has fallen asleep beside a stuck waterwheel. The Mushroom Guard knows where the repair tools are. Wake the wheel with a clever plan.',
      ending:'The wheel turns. Water rises in small wooden cups and spills into a shining pool. The wheel bell beats a steady rhythm.',
      riddles:[
        pick('wheel-tools','Follow the wrench',['The guard gives the wrench to the troll.','The troll lends it to Pip.','Pip puts it on the flat stone.'],'Where should you look for it?',[
          choice('guard','With guard','leaf'),choice('troll','With troll','cave'),choice('stone','On flat stone','stone')],'stone','Follow all three moves, right to the end.','Pip left the wrench on the flat stone.','The wrench is ready.'),
        pick('wheel-cups','A leaking cup',['There are four cups on the wheel.','Each good cup lifts three scoops of water.','One cup has a hole and lifts no water.'],'How many scoops can one turn lift?',[number(7),number(9),number(12)],'9','Only three cups work. Each of those lifts three scoops.','Three good cups times three scoops makes nine.','You find which cup needs repair.'),
        order('wheel-fix','Fix it safely',['Stop the wheel before you change the cup.','Open the gate after you change the cup.'],['Open gate','Change cup','Stop wheel'],[2,1,0],'Begin by making the wheel still.','Stop the wheel, change the cup, then open the gate.','All four cups fill with water.'),
        pick('wheel-gate','Enough water',['The pool needs twelve scoops.','The mended wheel lifts four cups of three scoops each turn.'],'How many full turns fill the empty pool?',[number(1),number(3),number(4)],'1','Four cups of three scoops makes how many?','Four times three is twelve. One full turn fills the pool.','The wheel bell wakes!')
      ]},
    {id:'mist-lamps',campaign:'river-song',name:'The Lamps in the Mist',place:'Lantern Grove',area:'chapter-4-place-2',requires:['crab-ferry','stone-dam'],families:['lantern-wisp','fern-wolf'],
      goal:'Guide the wolf pack to the hidden mist bell.',item:'Mist bell',symbol:'lamp',
      intro:'Lantern Wisps blink over the river. A Fern Wolf and two pups need a safe way through the mist. Read the signs and lead them to the bell.',
      ending:'The pack reaches the safe bank. The pups shake water from their paws while the wisps dance around the ringing mist bell.',
      riddles:[
        pick('mist-lamp','A lamp signal',['A safe lamp blinks twice, then stays on.','A lamp that goes dark marks deep water.'],'Which signal should the wolves follow?',[
          choice('one','1 blink → on','lamp'),choice('dark','2 blinks → dark','lamp'),choice('safe','2 blinks → on','lamp')],'safe','Count the blinks and check what happens after them.','Two blinks followed by steady light marks safety.','The pack follows your signal.'),
        pick('mist-sign','The dry bank',['Every sign tells the truth.','The left sign says, “This bank is wet.”','The middle sign says, “The right bank is dry.”'],'Which bank is definitely dry?',[
          choice('left','Left bank','water'),choice('middle','Middle bank','map'),choice('right','Right bank','leaf')],'right','A sign can tell you about a different place. Read the middle sign carefully.','The middle sign tells us that the right bank is dry.','You find a firm place to land.',{diagram:['Left: wet','Middle: right is dry','Right']}),
        pick('mist-pack','Share the blankets',['The wolf and two pups each need two blankets.','There are eight blankets in the boat.'],'How many blankets will be left?',[number(2),number(4),number(6)],'2','There are three wolves in all. Give each one two blankets.','Three times two is six. Eight minus six leaves two.','The whole pack is warm.'),
        order('mist-ring','A bell in a thorn bush',['Push the thorns aside before you reach for the bell.','Put on gloves before you push the thorns.'],['Reach for bell','Put gloves on','Push thorns aside'],[1,2,0],'Protect your hands first.','Gloves on, thorns aside, then reach for the bell.','The mist bell rings through the fog.')
      ]},
    {id:'high-nest',campaign:'river-song',name:'The Nest Above the Falls',place:'High Bridge',area:'chapter-7-place-3',requires:['crab-ferry','stone-dam'],families:['storm-griffin','moon-moth'],
      goal:'Carry a wind bell down from the griffin’s high nest.',item:'Wind bell',symbol:'wing',
      intro:'The Storm Griffin’s nest hangs above the falls. A Moon Moth has seen a safe way up. Earn the griffin’s trust and bring the wind bell down.',
      ending:'The griffin spreads its wings to shelter the climb down. The wind bell rings above the falls. One final job waits at the river gates.',
      riddles:[
        pick('nest-route','Above the falls',['Use a route that passes the pine.','Do not cross a bridge.'],'Choose the safe route.',[
          choice('pine-bridge','Pine → bridge','map'),choice('oak-stairs','Oak → steps','map'),choice('pine-stairs','Pine → steps','map')],'pine-stairs','The pine is needed, but the bridge is forbidden.','Pine then steps fits both clues.','The nest is in sight.'),
        pick('nest-rest','The long climb',['There are fifteen steps to the nest.','You climb six, then four more.'],'How many steps are left?',[number(5),number(9),number(11)],'5','Add the steps already climbed, then take that from fifteen.','Six plus four is ten. Fifteen minus ten leaves five.','You reach the griffin’s ledge.'),
        pick('nest-code','The griffin’s number',['The lock uses a number in the three times table.','It is greater than ten and less than fifteen.'],'Choose the number.',[number(9),number(12),number(14),number(15)],'12','List the nearby groups of three, then check the two limits.','Twelve is in the three times table and lies between ten and fifteen.','The wind bell comes free.'),
        order('nest-lower','Lower the bell',['Tie the rope to the bell before you lower it.','Test the knot after you tie it, but before you lower it.'],['Lower bell','Test knot','Tie rope'],[2,1,0],'Tying comes first. One check belongs between tying and lowering.','Tie the rope, test the knot, then lower the bell.','The wind bell reaches the bank.')
      ]},
    {id:'river-heart',campaign:'river-song',name:'The River Sings Again',place:'River Gate',area:'chapter-2-place-5',requires:['mist-lamps','high-nest'],families:['stone-ram','reed-serpent'],
      goal:'Find the last bell and open the six river gates.',item:'Heart bell',symbol:'bell',finale:true,
      intro:'Five bells are ready. The Stone Ram and Reed Serpent wait at the last gate. One bell is still hidden. Use what you have learned to bring the river’s song back.',
      ending:'The heart bell answers the other five. Six gates open. The river sings from the forest to the sea, and all your creature friends come to celebrate.',
      riddles:[
        pick('river-chest','The last bell',['The three chests are red, blue and green.','All three clues are true: the bell is not in red; blue holds rope; each chest holds just one thing.'],'Which chest holds the bell?',[
          choice('red','Red chest','chest','red'),choice('blue','Blue chest','chest','blue'),choice('green','Green chest','chest','green')],'green','Red is ruled out. Blue is already full of a different thing.','The green chest is the only possible place for the bell.','The heart bell is found.'),
        pick('river-teams','Pairs at the gates',['There are six gates.','Two friends must stand at each gate.','Eight friends are in place.'],'How many more friends do you need?',[number(2),number(4),number(6)],'4','Six pairs means twelve friends altogether. Eight are already there.','Six times two is twelve. Twelve minus eight leaves four.','Every gate has a team.'),
        order('river-signal','Send the signal',['Ring the small bell before the big bell.','Raise the flag after the small bell, but before the big bell.'],['Big bell','Raise flag','Small bell'],[2,1,0],'The flag goes between the two bells.','Small bell, flag up, big bell. Everyone hears the signal.','All six teams are ready.'),
        pick('river-final','The final lever',['Pull a lever marked with a wave.','It must be next to the bell, not next to the fire.'],'Which lever opens the river?',[
          choice('fire-wave','Wave · by fire','water'),choice('bell-leaf','Leaf · by bell','leaf'),choice('bell-wave','Wave · by bell','water')],'bell-wave','Use both the mark and its position.','The wave lever beside the bell matches both clues.','The river sings again!')
      ]}
  ];
  const lore={
    'thornling':['Find me on the Lantern Trail.','A Thornling grows a new leaf whenever it makes a friend.'],
    'bark-beetle':['Look inside a hollow log.','Bark Beetles tap secret messages on old wood.'],
    'moon-moth':['Follow the moonlit post route.','Moon Moths carry tiny letters between the treetops.'],
    'acorn-imp':['Look for mixed-up parcels.','An Acorn Imp always keeps one acorn for a rainy day.'],
    'root-sprite':['Search the workshop under the roots.','Root Sprites build lifts from roots and nutshells.'],
    'mushroom-guard':['Visit the root workshop.','Mushroom Guards keep spare tools under their broad caps.'],
    'hollow-owl':['Listen near the night watch.','A Hollow Owl can remember every turn on a moonlit path.'],
    'briar-bat':['Follow the owl’s night watch.','Briar Bats fold their wings like little forest umbrellas.'],
    'chest-mimic':['Find the laughing vault.','A Chest Mimic keeps its best jokes beneath its lid.'],
    'snail-knight':['Seek the knight beside the vault.','Snail Knights polish their shells with soft moss.'],
    'moss-golem':['Climb to the oldest oak.','Moss Golems keep warm seeds safe in their stone hands.'],
    'bramble-boar':['Follow tracks to the old oak.','Bramble Boars use their tusks to lift fallen branches.'],
    'reed-serpent':['Look beside the river reeds.','Reed Serpents can tie a knot without using any hands.'],
    'bog-toad':['Find the message in the reeds.','Bog Toads practise new songs in puddles.'],
    'crystal-crab':['Look for the ferry by the pool.','Crystal Crabs collect pebbles that sparkle underwater.'],
    'stone-ram':['Visit the crystal ferry.','Stone Rams can balance on a rock the size of a hoof.'],
    'cave-troll':['Listen for a sleeping waterwheel.','Cave Trolls hum so deeply that cups ripple nearby.'],
    'lantern-wisp':['Search the lamps in the mist.','Lantern Wisps send messages by blinking their light.'],
    'fern-wolf':['Follow the lights through the mist.','Fern Wolves make soft beds for their pups from fallen leaves.'],
    'storm-griffin':['Climb above the waterfall.','Storm Griffins spread their wings to shelter smaller friends.']
  };
  for(const m of missions){
    m.art='assets/adventures/'+m.id+'.webp';
    m.artAlt='The young mage and small Pip meet '+m.families[0].replace(/-/g,' ')+' at '+m.place+'.';
    m.health=[8,9,10,12];
    m.encounters=[m.families[0],m.families[1],m.families[0],m.families[1]];
    m.riddles.forEach((r,i)=>{r.family=m.encounters[i];r.number=i+1;});
  }
  const byId=Object.fromEntries(missions.map(m=>[m.id,m]));
  const puzzles=Object.fromEntries(missions.flatMap(m=>m.riddles.map(r=>[r.id,r])));
  return {version:1,campaigns,missions,byId,puzzles,lore};
});
