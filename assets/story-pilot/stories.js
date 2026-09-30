(function(root,factory){const data=factory();if(typeof module==='object'&&module.exports)module.exports=data;else root.BlitzStoryPilotContent=data;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const item=(id,label,icon,extra={})=>({id,label,icon,...extra});
  const amount=(n,unit,icon=null)=>item(String(n),`${n} ${unit}`,icon,{number:n});
  const mark=name=>item(name,name[0].toUpperCase()+name.slice(1),name,{marked:true});
  const stories=[
    {
      id:'fox-call',title:'The Fox’s Call',shortTitle:'The tunnel',level:'Pack for the dark',scene:'scenes/fox-call.webp',sceneLabel:'Artus and Pip listen to a mother fox by a dark tunnel. The old tower stands on a distant hill.',
      paragraphs:[
        '“My cub is stuck high in the old tower!” cries a mother fox. “Please help!”',
        '“We will,” says Artus. His pet dragon, Pip, runs to his side.',
        'A dark tunnel leads towards the tower. Artus picks up his shield. Then he puts it down and takes a torch instead.',
        'There are three torches in his pack. One is wet and will not burn. Artus leaves that one behind.',
        'Help Artus choose what to hold. Then count the dry torches he can take.'
      ],
      questions:[
        {id:'held',prompt:'What does Artus hold now?',answer:'torch',choices:[item('shield','Shield','shield'),item('torch','Torch','torch'),item('sword','Sword','sword')],clues:[2],hint:'Artus changes his mind. Read what he puts down and what he takes instead.',explanation:'He puts down the shield and takes a torch to light the dark tunnel.'},
        {id:'torches',prompt:'How many dry torches can he take?',answer:'2',choices:[1,2,3].map(n=>amount(n,n===1?'torch':'torches','torch')),clues:[3],hint:'Start with three torches. Leave the wet one behind.',explanation:'One of the three torches is wet. Artus can take two dry torches. 3 − 1 = 2.'}
      ],
      endingTitle:'Into the tunnel!',ending:'Artus holds up a torch. He has two dry torches for the trip. He and Pip follow the path through the dark. On the far side, they hear a fast stream.',nextLabel:'Go to the bridge',endingImage:'scenes/fox-call.webp',endingAlt:'Artus and Pip at the start of their journey to help the mother fox.'
    },
    {
      id:'broken-bridge',title:'The Broken Bridge',shortTitle:'The bridge',level:'Take away, then add',scene:'scenes/bridge.webp',sceneLabel:'Artus, Pip and the Acorn Imp inspect a broken wooden bridge over a woodland stream.',
      paragraphs:[
        'The path to the tower crosses a stream. But the wood bridge is broken!',
        '“I can fix it with wood pegs,” says a small imp. “They will hold the boards in place.”',
        'Artus puts eight pegs in his red bag. The bag has a hole, so he moves all the pegs to his blue bag.',
        'Three pegs are bent. Artus takes them out. Pip finds two good pegs and drops them into the blue bag.',
        'The imp is ready to work. Which bag should Pip bring, and how many good pegs are in it?'
      ],
      questions:[
        {id:'bag',prompt:'Which bag holds the pegs for the bridge?',answer:'blue',choices:['red','blue','green'].map(c=>item(c,`${c[0].toUpperCase()+c.slice(1)} bag`,'bag',{colour:c})),clues:[2,3],hint:'Follow the pegs. Artus moves them out of the bag with a hole.',explanation:'Artus moves all the pegs to the blue bag. That is the bag the imp needs.'},
        {id:'pegs',prompt:'How many good pegs are in that bag?',answer:'7',choices:[5,7,10].map(n=>amount(n,'pegs')),clues:[2,3],hint:'Start with eight pegs. Take out three bent ones, then add the two Pip finds.',explanation:'Eight pegs minus three bent ones leaves five. Pip adds two good pegs, making seven. 8 − 3 + 2 = 7.'}
      ],
      endingTitle:'The bridge is fixed!',ending:'Pip brings the blue bag. The imp uses its seven good pegs to fix the bridge. Artus and Pip cross the stream. A tall stone gate blocks the next part of the path.',nextLabel:'Go to the stone gate',endingImage:'scenes/bridge.webp',endingAlt:'Artus, Pip and the Imp working together at the woodland bridge.'
    },
    {
      id:'troll-lock',title:'The Troll’s Lock',shortTitle:'The gate',level:'A riddle and groups',scene:'scenes/troll.webp',sceneLabel:'Artus and Pip talk with the mossy Cave Troll at a locked wooden gate in an old stone arch.',
      paragraphs:[
        'A troll stands by the gate. “I want to help the cub too,” he says. “But this gate is locked.”',
        '“Find a thing with teeth that cannot bite. It can open a lock.”',
        'Artus has a key, a comb and a saw. Which thing fits both clues?',
        'The troll has more of that thing in his pouch: three rings with five on each ring.',
        'Four are bent and will not turn in the lock. How many good ones can Artus try?'
      ],
      questions:[
        {id:'riddle',prompt:'Which thing should Artus try in the lock?',answer:'key',choices:[item('key','Key','key'),item('comb','Comb','comb'),item('saw','Saw','saw')],clues:[1,2],hint:'All three things have teeth. Which one can open a lock too?',explanation:'A key has teeth and can open a lock. It fits both clues, so the things on the rings are keys.'},
        {id:'keys',prompt:'How many good ones can Artus try?',answer:'11',choices:[11,12,15].map(n=>item(String(n),String(n),null,{number:n})),clues:[3,4],hint:'Count three groups of five. Then leave out the four bent ones.',explanation:'Three rings of five hold fifteen keys. Four are bent, so eleven good keys remain. 3 × 5 − 4 = 11.'}
      ],
      endingTitle:'One key fits!',ending:'One of the eleven good keys turns in the lock. The troll opens the gate. “Ask the owl for a basket,” he says. “It will help you bring the cub down.”',nextLabel:'Find the owl',endingImage:'scenes/troll.webp',endingAlt:'Artus and Pip with the helpful troll at the stone gate.'
    },
    {
      id:'owl-rope',title:'The Owl’s Chest',shortTitle:'The old oak',level:'Find, then share',scene:'scenes/owl.webp',sceneLabel:'Beneath an old oak, Artus and Pip ask the Hollow Owl about four closed chests and an empty rescue basket.',
      paragraphs:[
        'The owl has a basket to lift the cub down. It needs three ropes of the same length to hang level.',
        'Four chests stand in a row. From left to right, their marks are sun, moon, star and leaf.',
        '“The rope is in a chest between sun and leaf,” says the owl. “It is not in the star chest.”',
        'That rope is twenty-four feet long. Six feet at one end are worn, so Artus cuts that bit off.',
        'He cuts the good rope into three equal pieces for the basket. Find the chest, then work out how long each piece is.'
      ],
      arrangement:{after:1,kind:'chests',marks:['sun','moon','star','leaf'],label:'The four chests, from left to right'},
      questions:[
        {id:'chest',prompt:'Which chest holds the rope?',answer:'moon',choices:['sun','moon','star','leaf'].map(mark),clues:[1,2],hint:'Two chests are between sun and leaf. The owl rules out one of them.',explanation:'Moon and star are between sun and leaf. It is not star, so the rope is in the moon chest.'},
        {id:'rope',prompt:'How long is each good piece of rope?',answer:'6',choices:[3,6,8,18].map(n=>amount(n,'feet')),clues:[3,4],hint:'Cut off the six worn feet first. Split the good part into three equal lengths.',explanation:'Twenty-four minus six leaves eighteen feet. Split into three equal pieces, that is six feet each. (24 − 6) ÷ 3 = 6.'}
      ],
      endingTitle:'The basket is ready!',ending:'Artus finds the rope in the moon chest. He ties three six-foot pieces to the basket. It hangs level. Pip helps him carry it up the hill to the old tower.',nextLabel:'Go to the tower',endingImage:'scenes/owl.webp',endingAlt:'Artus, Pip and the Owl prepare to make the rescue basket beneath the oak.'
    },
    {
      id:'last-door',title:'The Last Door',shortTitle:'The tower',level:'Put the clues together',scene:'scenes/gate.webp',sceneLabel:'At the old tower, Artus and Pip stand with the Stone Ram before three closed doors, ready with their rescue basket.',
      paragraphs:[
        'At last, Artus and Pip reach the tower. The cub is on a high ledge inside. Three doors have sun, moon and star marks. Only one door leads to the cub.',
        '“Only one sign is true,” says the stone ram. “The other two are wrong.”',
        'The right door has a number lock. Its number is more than fifty and less than sixty. It is in the seven times table.',
        'Pick the right door and set its number. Then Artus and Pip can take the basket inside and help the cub!'
      ],
      arrangement:{after:1,kind:'signs',marks:['sun','moon','star'],label:'Read all three door signs',signs:['The moon door leads to the cub.','The moon door does not lead to the cub.','The sun door does not lead to the cub.']},
      questions:[
        {id:'door',prompt:'Which door leads to the cub?',answer:'sun',choices:['sun','moon','star'].map(name=>item(name,name[0].toUpperCase()+name.slice(1),name)),clues:[0,1],hint:'Try one door at a time. If it leads to the cub, exactly one sign must be true. Check all three signs.',explanation:'If sun leads to the cub, only the moon sign is true. Moon or star would make two signs true. So Artus must use the sun door.'},
        {id:'number',prompt:'Which number opens that door?',answer:'56',choices:[49,54,56,63].map(n=>item(String(n),String(n),null,{number:n})),clues:[2],hint:'Which number in the seven times table is more than fifty but less than sixty?',explanation:'Seven times eight is fifty-six. It is between fifty and sixty. Artus sets the sun door’s lock to 56.'}
      ],
      endingTitle:'The fox cub is safe!',ending:'The sun door opens at 56. Pip flies the basket to the ledge. The cub hops in, and Artus lowers it gently. Outside, the mother fox runs to her cub. “You brought my little one home!” Artus and Pip grin.',endingImage:'scenes/reunion.webp',endingAlt:'Artus and Pip smile as the rescued fox cub nuzzles its mother beside the empty basket at the tower.'
    }
  ];
  return {version:2,title:'The fox cub rescue',stories};
});
