(function(root,factory){const data=factory();if(typeof module==='object'&&module.exports)module.exports=data;else root.BlitzStoryPilotContent=data;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const item=(id,label,icon,extra={})=>({id,label,icon,...extra});
  const amount=(n,unit,icon)=>item(String(n),`${n} ${unit}`,icon,{number:n});
  const mark=name=>item(name,name[0].toUpperCase()+name.slice(1),name,{marked:true});
  const stories=[
    {
      id:'fox-cave',title:'The Fox in the Cave',shortTitle:'The fox',level:'A small change',scene:'../scenery/chapter-6-place-1.webp',sceneLabel:'At the cave',
      paragraphs:[
        'Artus and his pet dragon, Pip, find a cave.',
        'They hear a small fox inside. It needs help!',
        'Artus picks up his shield. But the cave is dark. He puts the shield down and takes a torch instead.',
        'Artus has three apples in his bag. Pip eats one.',
        '“Pip! The rest are for the fox,” says Artus.'
      ],
      questions:[
        {id:'held',prompt:'What does Artus hold now?',answer:'torch',choices:[item('shield','Shield','shield'),item('torch','Torch','torch'),item('sword','Sword','sword')],clues:[2],hint:'Read what Artus does with his shield. What does he take instead?',explanation:'Artus puts down the shield and takes the torch.'},
        {id:'apples',prompt:'How many apples are left in his bag?',answer:'2',choices:[1,2,3].map(n=>item(String(n),`${n} ${n===1?'apple':'apples'}`,'apple',{repeat:n})),clues:[3],hint:'Pip eats one of the three apples. Count what is left.',explanation:'Three apples, with one eaten, leaves two. 3 − 1 = 2.'}
      ],
      endingTitle:'The fox is safe!',ending:'The torch lights the cave. Artus finds the fox and gives it the two apples. Together, they head home.',endingImage:'../teaching/fox.webp',endingAlt:'Pip and the fox on a forest path.'
    },
    {
      id:'river-bag',title:'The River Bag',shortTitle:'The river',level:'Take away, then add',scene:'../scenery/chapter-2-place-1.webp',sceneLabel:'By the stream',guest:'../family-review/images/acorn-imp-c.webp',guestAlt:'The small Acorn Imp in his leaf coat.',
      paragraphs:[
        'Artus and Pip reach a wide stream. A rope can help Artus get across.',
        'Artus puts the rope in his red bag. Then he finds a hole in that bag. He moves the rope to his blue bag and leaves the red bag by a tree.',
        'Artus has eight nuts. He gives three to a small imp.',
        'Pip finds two more nuts and gives them to Artus.',
        '“Let’s cross,” says Artus. “Pip, bring the bag with the rope!”'
      ],
      questions:[
        {id:'bag',prompt:'Which bag must Pip bring?',answer:'blue',choices:['red','blue','green'].map(c=>item(c,`${c[0].toUpperCase()+c.slice(1)} bag`,'bag',{colour:c})),clues:[1],hint:'The rope starts in one bag. Read where Artus moves it.',explanation:'Artus moves the rope from the red bag to the blue bag.'},
        {id:'nuts',prompt:'How many nuts does Artus have now?',answer:'7',choices:[5,7,10].map(n=>amount(n,'nuts','nut')),clues:[2,3],hint:'Start with eight. Take away the nuts for the imp, then add the nuts from Pip.',explanation:'Eight minus three is five. Two more makes seven. 8 − 3 + 2 = 7.'}
      ],
      endingTitle:'Across the stream!',ending:'Pip brings the blue bag. Artus uses the rope to cross. He still has seven nuts for the long walk ahead.',endingImage:'../scenery/chapter-2-place-2.webp',endingAlt:'A stone bridge over the stream.'
    },
    {
      id:'troll-gate',title:'The Troll’s Gate',shortTitle:'The troll',level:'A riddle and groups',scene:'../scenery/chapter-4-place-4.webp',sceneLabel:'At the stone gate',guest:'../family-review/images/cave-troll-c.webp',guestAlt:'The Cave Troll, covered in moss and small flowers.',
      paragraphs:[
        'A troll stops Artus and Pip at a stone gate.',
        '“Bring me a thing with teeth that cannot bite,” he says. “It can open a lock.”',
        'Artus has a key, a comb and a saw.',
        'Artus also has three bags. Each bag holds five coins.',
        'The troll asks for four coins to let them through. Artus pays him from the bags.',
        '“We must keep the rest,” says Artus. Pip nods.'
      ],
      questions:[
        {id:'riddle',prompt:'Which thing fits both clues?',answer:'key',choices:[item('key','Key','key'),item('comb','Comb','comb'),item('saw','Saw','saw')],clues:[1,2],hint:'All three have teeth. Which one can also open a lock?',explanation:'A key has teeth and opens a lock. A comb and a saw do not fit both clues.'},
        {id:'coins',prompt:'How many coins are left in all the bags?',answer:'11',choices:[11,12,15].map(n=>amount(n,'coins','coin')),clues:[3,4],hint:'Count all three bags of five first. Then take away the four coins for the troll.',explanation:'Three bags of five hold fifteen coins. Four are paid, so eleven remain. 3 × 5 − 4 = 11.'}
      ],
      endingTitle:'The gate swings open.',ending:'Artus hands over the key and pays four coins. The troll steps aside. Artus and Pip walk on with eleven coins left.',endingImage:'../scenery/chapter-4-place-5.webp',endingAlt:'A quiet, glowing hall beyond the old gate.'
    },
    {
      id:'owl-chests',title:'The Owl’s Chests',shortTitle:'The owl',level:'Find, then share',scene:'../scenery/chapter-3-place-5.webp',sceneLabel:'Under the old oak',guest:'../family-review/images/hollow-owl-c.webp',guestAlt:'The Hollow Owl with bright green eyes and leaf-like feathers.',
      paragraphs:[
        'An owl shows Artus and Pip four chests. From left to right, their marks are sun, moon, star and leaf.',
        '“The key is in a chest between the sun chest and the leaf chest,” says the owl. “It is not in the star chest.”',
        'Pip finds twenty-four gems. Artus puts six aside for the owl.',
        'He shares the rest into three bags, with the same number of gems in each bag.',
        'Choose the chest with the key. Then pack one bag for Artus.'
      ],
      arrangement:{after:0,kind:'chests',marks:['sun','moon','star','leaf'],label:'The four chests, from left to right'},
      questions:[
        {id:'chest',prompt:'Which chest holds the key?',answer:'moon',choices:['sun','moon','star','leaf'].map(mark),clues:[0,1],hint:'Two chests are between the sun and leaf. The owl rules out one of them.',explanation:'Moon and star lie between sun and leaf. The owl rules out star, so the key is in the moon chest.'},
        {id:'gems',prompt:'How many gems go in each bag?',answer:'6',choices:[3,6,8,18].map(n=>amount(n,'gems','gem')),clues:[2,3],hint:'Put aside the owl’s six gems first. Share what is left into three equal groups.',explanation:'Twenty-four minus six leaves eighteen. Eighteen shared into three bags is six in each. (24 − 6) ÷ 3 = 6.'}
      ],
      endingTitle:'A key in the moon chest!',ending:'Artus finds the key. The owl gets six gems, and each bag holds six more. Pip spots one last gate on the hill.',endingImage:'../scenery/chapter-7-place-1.webp',endingAlt:'The forest path rises towards the hills.'
    },
    {
      id:'last-gate',title:'The Last Gate',shortTitle:'The last gate',level:'Put all the clues together',scene:'../scenery/chapter-7-place-5.webp',sceneLabel:'At the last gate',guest:'../family-review/images/stone-ram-b.webp',guestAlt:'The Stone Ram, with curled stone horns and bright autumn leaves.',
      paragraphs:[
        'Artus, Pip and the fox reach three doors. One is safe. A stone ram guards them.',
        '“Only one sign is true,” says the ram. “The other two are wrong.”',
        'The safe door needs a number. It is more than fifty and less than sixty. It is in the seven times table.',
        'Artus has three bags with nine gems in each bag. He gives six gems to the ram.',
        'He shares the rest equally between himself, Pip and the fox.',
        'Find the safe door and its number. Work out how many gems Pip gets.'
      ],
      arrangement:{after:1,kind:'signs',marks:['sun','moon','star'],label:'Read all three door signs',signs:['Go through the moon door.','Do not use the moon door.','Do not use the sun door.']},
      questions:[
        {id:'door',prompt:'Which door is safe?',answer:'sun',choices:['sun','moon','star'].map(name=>item(name,name[0].toUpperCase()+name.slice(1),name)),clues:[0,1],hint:'Try one door at a time. If it is safe, exactly one sign must be true. Check all three signs.',explanation:'If sun is safe: the sun sign is wrong, the moon sign is true, and the star sign is wrong. That is one true sign. Moon or star would make two signs true.'},
        {id:'number',prompt:'Which number opens the door?',answer:'56',choices:[49,54,56,63].map(n=>item(String(n),String(n),null,{number:n})),clues:[2],hint:'Find numbers in the seven times table. Which one is more than fifty but less than sixty?',explanation:'Seven times eight is fifty-six. It lies between fifty and sixty. 7 × 8 = 56.'},
        {id:'share',prompt:'How many gems does Pip get?',answer:'7',choices:[3,7,9,21].map(n=>amount(n,'gems','gem')),clues:[3,4],hint:'Count the three bags of nine. Pay the ram six. Then share what is left between three friends.',explanation:'Three bags hold twenty-seven gems. Six are paid, leaving twenty-one. Each of the three friends gets seven. (3 × 9 − 6) ÷ 3 = 7.'}
      ],
      endingTitle:'Home, at last!',ending:'Artus picks the sun door and sets the number to 56. Pip gets seven gems. The gate opens, and the three friends head home together.',endingImage:'../scenery/hidden-nest.webp',endingAlt:'A warm, peaceful clearing in the forest.'
    }
  ];
  return {version:1,stories};
});
