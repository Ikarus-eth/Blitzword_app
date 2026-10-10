(function(root){
  'use strict';
  function create(ctx){
    const {Core,Content}=ctx,A=Core.Adventure,D=A.Data,$=s=>document.querySelector(s);
    let stamp=null,bookReturn='hub',selectedCreature=null,mapViewer=null,mapCamera=null,mapCameraId=null;
    const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
    const button=(text,cls,fn)=>{const b=el('button',cls,text);b.onclick=fn;return b;};
    const paths={
      seed:'M20 35C5 32 5 12 31 7C37 27 31 36 20 35ZM13 29L27 15',
      leaf:'M8 34Q4 10 35 6Q36 34 8 34ZM8 34L27 15',
      star:'M20 4L25 15L37 16L28 24L30 36L20 30L10 36L12 24L3 16L15 15Z',
      moon:'M28 5A16 16 0 1 0 35 28A15 15 0 0 1 28 5Z',
      sun:'M20 10A10 10 0 1 0 20 30A10 10 0 1 0 20 10ZM20 1V6M20 34V39M1 20H6M34 20H39M6 6L10 10M30 30L34 34M6 34L10 30M30 10L34 6',
      key:'M14 8A7 7 0 1 0 14 22A7 7 0 1 0 14 8ZM19 20L34 35M27 28L32 23M31 32L36 27',
      bell:'M10 28V18Q10 6 20 6Q30 6 30 18V28L34 31H6ZM16 35Q20 40 24 35M20 2V6',
      bag:'M12 5H28L25 13Q38 22 31 35H9Q2 22 15 13ZM13 13H27',
      chest:'M5 18Q5 7 20 7Q35 7 35 18V34H5ZM5 20H35M17 17H23V25H17Z',
      water:'M6 29Q11 24 16 29T26 29T36 29M6 35Q11 30 16 35T26 35T36 35M20 4Q7 21 20 24Q33 21 20 4Z',
      tree:'M20 3L7 19H13L4 29H17V38H23V29H36L27 19H33Z',
      cave:'M3 35Q5 5 20 5Q35 5 37 35ZM13 35V26Q13 14 20 14Q27 14 27 26V35',
      rope:'M10 5Q34 5 27 16T12 25Q5 35 31 35M13 8Q34 12 18 20Q3 28 28 32',
      gear:'M16 4H24L26 10L32 9L36 16L32 21L34 28L28 34L21 31L16 36L9 32L10 25L4 23V16L10 13L9 8ZM20 14A6 6 0 1 0 20 26A6 6 0 1 0 20 14Z',
      basket:'M5 17H35L31 35H9ZM10 17Q10 4 20 4Q30 4 30 17M14 21L15 31M25 21L24 31',
      stone:'M5 28L12 13L27 9L36 25L30 34H12Z',
      wood:'M7 7L35 13L31 34L3 28ZM12 14L29 18M10 23L27 27',
      lamp:'M12 12H28L31 32H9ZM12 12L15 6H25L28 12M15 6V3H25V6M20 18Q12 29 20 29Q28 29 20 18Z',
      gem:'M5 14L12 5H28L35 14L20 36ZM5 14H35M12 5L15 14L20 36L25 14L28 5',
      wing:'M6 33Q5 8 36 5Q34 20 22 25L18 18L16 29Z',
      map:'M3 8L14 4L26 9L37 5V32L26 36L14 31L3 35ZM14 4V31M26 9V36',
      tool:'M10 4L5 12L10 20L16 18L30 35L36 29L20 15L21 9L15 3L15 11L10 12Z',
      mark:'M7 20L16 29L34 10',
      step:'M6 21H33M23 11L33 21L23 31'
    };
    function icon(name){return '<svg viewBox="0 0 40 42" aria-hidden="true"><path d="'+(paths[name]||paths.mark)+'"/></svg>';}
    function timeTap(){
      const s=ctx.state(),p=A.of(s).current?.phase==='search'?{solved:false}:A.of(s).current?.puzzle,now=performance.now();
      const delta=stamp===null?0:Math.max(0,now-stamp);
      if(s.screen==='mission'&&p&&!p.solved&&ctx.active()&&!document.hidden&&delta<=5000)Core.recordRiddleTime(s,delta,Date.now());
      stamp=now;
    }
    function stopTiming(){stamp=null;}
    function act(fn){if(!ctx.active())return;timeTap();fn();if(ctx.save()){if(ctx.state().activity==='result')ctx.enter();else renderMission();}}
    function missionArt(m){return m.art||Content.chapterBackgrounds[m.area].src;}
    function heading(kicker,title,detail){const h=el('header','adventureHeading');h.append(el('p','adventureEyebrow',kicker),el('h1','',title));if(detail)h.append(el('p','adventureIntro',detail));return h;}
    function renderProgress(element,compact=false){
      const s=ctx.state(),p=A.progress(s),m=A.current(s);element.replaceChildren();
      element.classList.add('questProgress');element.classList.toggle('compactQuest',compact);
      if(!p||!m)return;
      element.append(el('strong','questProgressTitle',compact?'Quest':m.name),el('span','questProgressCount',p.done+' of '+p.total+' steps done · '+p.left+' left'));
      const track=el('div','questSteps');track.setAttribute('role','progressbar');track.setAttribute('aria-label',p.total===9?'Quest: four fights, four clues and a map search':'Quest: four fights and four clues');track.setAttribute('aria-valuemin','0');track.setAttribute('aria-valuemax',String(p.total));track.setAttribute('aria-valuenow',String(p.done));
      for(let i=0;i<p.total;i++){const step=el('span','questStep'+(i<p.done?' done':i===p.done?' current':''),compact?'':(i===8?'Map':i%2?'Clue':'Fight'));step.setAttribute('aria-hidden','true');track.append(step);}element.append(track);
      if(!compact)element.append(el('small','questNext',p.left?'Next: '+p.next.toLowerCase()+' · Treasure after step '+p.total:'All done! Your treasure is ready.'));
    }
    function teamCard(){
      const s=ctx.state(),c=A.of(s).current,family=A.companion(s),card=el('div','questTeam');
      if(family){const art=el('span','sceneSprite');ctx.paintEnemy(art,family,8);card.append(art);}
      const copy=el('div','questTeamCopy');copy.append(el('strong','',family?'On your side: '+Content.enemyAt(family).name:'Choose an animal for your team'),el('p','',!family?'It can stop one hit each quest.':c?.companionHelpUsed?'Your friend has stopped a hit. It can help again next quest.':'Your friend can stop one hit this quest.'));
      copy.append(button(family?'Change animal':'Choose my animal','textButton',()=>openBook(family)));card.append(copy);return card;
    }
    function renderBattleTeam(){
      const s=ctx.state(),family=s.battle?.missionId?A.companion(s):null,box=$('#battleCompanion');box.hidden=!family;$('#battle').classList.toggle('hasQuestCompanion',!!family);
      if(!family)return;
      const art=$('#battleCompanionArt');if(art.dataset.family!==family){ctx.paintEnemy(art,family,8);art.dataset.family=family;}
      box.setAttribute('role','img');box.setAttribute('aria-label',Content.enemyAt(family).name+' companion');
    }
    function renderHub(){
      stopTiming();if(mapViewer){mapCamera=mapViewer.snapshot();mapViewer.destroy();mapViewer=null;}const s=ctx.state(),e=A.of(s),report=A.report(s);ctx.show('adventureHub');
      const screen=$('#adventureHub');screen.replaceChildren();
      const c=D.campaigns.find(c=>c.id===e.selectedCampaign)||D.campaigns[0];
      screen.style.backgroundImage='linear-gradient(180deg,#10282088,#10282044 40%,#102820bb),url("'+c.scene+'")';
      const top=el('div','adventureTop'),tabs=el('nav','campaignTabs');tabs.setAttribute('aria-label','Choose a campaign');
      D.campaigns.forEach((campaign,i)=>{const open=i===0||A.campaignComplete(s,D.campaigns[i-1].id);const b=button((i+1)+'. '+campaign.shortName,'campaignTab'+(c.id===campaign.id?' selected':''),()=>{e.selectedCampaign=campaign.id;if(ctx.save())renderHub();});b.disabled=!open;b.setAttribute('aria-pressed',String(c.id===campaign.id));if(!open)b.title='Finish Forest lights to open this campaign.';tabs.append(b);});
      const book=button('Creature Book · '+report.seen+'/20','bookLauncher',()=>openBook());book.insertAdjacentHTML('afterbegin',icon('leaf'));top.append(tabs,book);screen.append(top);
      const done=c.missions.filter(id=>e.missions[id]?.completedAt).length;
      screen.append(heading('Adventure '+(D.campaigns.indexOf(c)+1)+' · '+done+'/6 treasures',c.name,done===6?c.ending:c.intro));
      if(e.current&&e.current.phase!=='complete'){
        const current=D.byId[e.current.missionId],resume=button('Continue '+current.name+' · '+A.progress(s).left+' steps left','greenButton missionResume',()=>ctx.launch(current.id));resume.id='missionResume';screen.append(resume);
      }
      const grid=el('div','missionGrid');
      c.missions.forEach((id,i)=>{
        const m=D.byId[id],open=A.unlocked(s,id),complete=!!e.missions[id]?.completedAt,busy=e.current&&e.current.phase!=='complete'&&e.current.missionId!==id;
        const card=button('','missionCard'+(complete?' complete':'')+(!open?' locked':''),()=>ctx.launch(id));card.dataset.mission=id;card.disabled=!open||busy;
        card.setAttribute('aria-label',(complete?'Play again: ':open?'Start mission: ':'Locked mission: ')+m.name);
        const art=el('div','missionCardArt');art.style.backgroundImage='url("'+missionArt(m)+'")';
        const medal=el('span','missionNumber',complete?'✓':String(i+1));art.append(medal);
        const creatures=el('span','missionCreatures');for(const family of m.families){const face=el('span','missionCreature sceneSprite');ctx.paintEnemy(face,family,8);if(!e.book[family]?.seen)face.classList.add('undiscovered');creatures.append(face);}art.append(creatures);
        const copy=el('div','missionCardCopy');copy.append(el('h2','',m.name),el('p','',m.goal));
        const status=e.current?.missionId===id&&e.current.phase!=='complete'?A.progress(s).left+' steps left':complete?'Treasure found · play again':!open?'Follow the earlier paths':busy?'Your current mission is saved':m.finale?'Final mission':'Choose this path';copy.append(el('span','missionCardStatus',status));card.append(art,copy);grid.append(card);
      });screen.append(grid);
      const camp=el('footer','adventureCamp'),pip=button('','campPip',ctx.growth);pip.setAttribute('aria-label','See Pip’s growth');const pipArt=el('span','sceneSprite');ctx.paintPip(pipArt);pip.append(pipArt,el('span','',ctx.dragonText('Pip')+' · '+Math.floor(s.dragon.xp||0)+' XP'));camp.append(pip);
      if(A.companion(s)){const friend=button('','campFriend',()=>openBook(e.favourite));const art=el('span','sceneSprite');ctx.paintEnemy(art,e.favourite,8);friend.append(art,el('span','','Your team · '+Content.enemyAt(e.favourite).name));camp.append(friend);}
      else camp.append(button('Choose my animal','bookLauncher',()=>openBook()));
      const controls=el('div','campControls');controls.append(button('⌕ Dragon path','textButton',ctx.wimmelbild),button('Word trails','textButton',ctx.legacy),button('Speed','textButton',ctx.speed),button('Parents','textButton',ctx.parents));camp.append(controls);screen.append(camp);
    }
    function renderMission(){
      const s=ctx.state(),e=A.of(s),c=e.current,m=A.current(s);if(!m||!c){ctx.home();return;}
      const screen=$('#mission'),view=m.id+':'+c.step+':'+c.phase,scroll=screen.dataset.view===view?screen.scrollTop:0;
      if(mapViewer){mapCamera=mapViewer.snapshot();mapViewer.destroy();mapViewer=null;}
      ctx.show('mission');screen.replaceChildren();screen.dataset.view=view;
      if(c.phase==='search'){renderSearch(screen,s,c,m);screen.scrollTop=scroll;return;}
      const complete=c.phase==='complete',p=c.puzzle,q=D.puzzles[p?.id],solving=c.phase==='puzzle';
      const top=el('div','missionTop');renderProgress(top);screen.append(top);
      const body=el('div','missionBody'),scene=el('figure','missionScene');
      const image=el('img');const pageArt=c.phase==='complete'?{art:m.endingArt||m.art,alt:m.endingArtAlt||m.artAlt}:m.scenes?.[c.step];image.src=pageArt?.art||missionArt(m);image.alt=pageArt?.alt||m.artAlt||m.place;image.decoding='async';scene.append(image);
      const medallion=el('div','missionSceneMedallion');medallion.innerHTML=icon(complete?m.symbol:solving?'map':m.finale?'star':'leaf');scene.append(medallion);
      scene.append(el('figcaption','',complete?m.item:solving?q.reward.replace(/\.$/,''):'Your goal: '+m.goal));
      // Before an answer, the caption states the task rather than giving away its outcome.
      if(solving&&!p.solved)scene.querySelector('figcaption').textContent=m.goal;
      const panel=el('div','missionReading parchment');
      if(!complete){const hearts=el('p','questHearts','♥ '+c.hearts+' / '+c.maxHearts+' hearts · Same hearts for this quest');panel.append(hearts);}
      if(complete){
        const campaign=D.campaigns.find(x=>x.id===m.campaign),all=A.campaignComplete(s,m.campaign);
        panel.append(heading(all?'Campaign complete!':'Mission complete!',all?campaign.prize:m.item,ctx.dragonText(m.ending)));
        const badge=el('div','treasureBadge');badge.innerHTML=icon(m.symbol);panel.append(badge);
        const friends=el('div','missionFriends');for(const family of m.families){const b=button('','friendReward',()=>openBook(family));const art=el('span','sceneSprite');ctx.paintEnemy(art,family,8);b.append(art,el('strong','',Content.enemyAt(family).name),el('small','','Clue stamp earned'));friends.append(b);}panel.append(friends);
        panel.append(button(all&&m.campaign==='lost-lights'?'Explore the river':'Choose another mission','greenButton',()=>{if(all&&m.campaign==='lost-lights')e.selectedCampaign='river-song';ctx.save();ctx.home();}),button('Rest here','textButton',ctx.home));
      }else if(!solving){
        const family=m.encounters[c.step],first=c.step===0;
        panel.append(heading(first?'A new quest':c.step>=2?'Big fight':'Next fight',first?m.name:m.riddles[c.step].title,ctx.dragonText(first?m.intro:m.scenes?.[c.step]?.intro||'Win this fight. Get the next clue.')));
        const actor=el('div','missionIntroEnemy sceneSprite');ctx.paintEnemy(actor,family,m.health[c.step]);panel.append(actor);
        panel.append(button(first?'Let’s go':'Start the fight','greenButton',()=>{if(!ctx.active())return;if(Core.startMissionBattle(s,Date.now())&&ctx.save())ctx.enter();}),button('Back to camp','textButton',ctx.home));
      }else{
        panel.append(heading('Read the clues',q.title));
        const text=el('div','riddleText');q.text.forEach(line=>text.append(el('p','',ctx.dragonText(line))));panel.append(text);
        if(q.diagram){const diagram=el('div','riddleDiagram');diagram.setAttribute('aria-label','Left to right');q.diagram.forEach((label,i)=>{const item=el('span','');item.append(el('small','',String(i+1)),el('strong','',label));diagram.append(item);});panel.append(diagram);}
        panel.append(el('h2','riddlePrompt',q.prompt));
        if(q.type==='order'){
          const sequence=el('div','riddleSequence'+(p.solved?' solved':''));sequence.setAttribute('aria-label','Your chosen order');for(let i=0;i<q.answer.length;i++){const id=p.selection[i];sequence.append(el('span','',String(i+1)+'. '+(id!==undefined?q.options.find(o=>o.id===id).label:'…')));}panel.append(sequence);
        }
        const choices=el('div','riddleChoices');choices.setAttribute('role','group');choices.setAttribute('aria-label',q.prompt);
        p.order.forEach(id=>{const option=q.options.find(o=>o.id===id),selected=p.selection.includes(id),b=button('','riddleOption'+(selected?' selected':'')+(p.solved&&selected?' correct':''),()=>act(()=>A.choose(s,id)));b.dataset.choice=id;b.setAttribute('aria-pressed',String(selected));b.disabled=p.solved||c.hearts<=0||q.type==='order'&&selected;
          if(option.icon==='number'){b.classList.add('numberOption');b.append(el('span','riddleNumber',option.label));}else{const glyph=el('span','riddleGlyph');glyph.innerHTML=icon(option.icon);if(option.colour)glyph.style.color={red:'#a24436',blue:'#3766a0',green:'#497448'}[option.colour];b.append(glyph,el('span','',option.label));}if(p.solved&&selected){const mark=el('span','riddleAnswerMark','✓');mark.setAttribute('aria-label','Correct answer');b.append(mark);}choices.append(b);});panel.append(choices);
        const feedback=el('div','riddleFeedback');feedback.setAttribute('role','status');feedback.setAttribute('aria-live','polite');
        if(p.solved){feedback.classList.add('solved');feedback.tabIndex=-1;const mark=el('span','riddleSuccessMark','✓');mark.setAttribute('aria-hidden','true');feedback.append(mark,el('strong','riddleSuccessTitle',p.assisted?'Answer revealed':'Correct!'),el('strong','',q.reward+(p.xpEarned?' · +'+p.xpEarned+' XP':'')),el('p','',q.explanation));}
        else if(p.wrong){feedback.classList.add('wrong');feedback.append(el('strong','',c.hearts<=0?'No hearts left. Rest, then try this clue again.':'Not quite. −1 heart · '+c.hearts+' left'),el('p','',q.hint));}
        else if(p.hint)feedback.append(el('p','',q.hint));panel.append(feedback);
        const actions=el('div','riddleActions');
        if(p.solved){actions.append(button(c.step===3?(c.ninthRequired?'Open the search map':'Claim the treasure'):'Follow the trail','greenButton',()=>act(()=>A.next(s,Date.now()))));}
        else if(c.hearts<=0){actions.append(button('Rest and retry · '+c.maxHearts+' hearts','greenButton',()=>act(()=>{A.retreat(s,true);A.retry(s);})));}
        else{
          const ready=button('Try it','greenButton',()=>act(()=>Core.checkRiddle(s,Date.now())));ready.disabled=p.wrong||p.selection.length!==(Array.isArray(q.answer)?q.answer.length:1);actions.append(ready);
          if(q.type==='order')actions.append(button('Start order again','textButton',()=>act(()=>{p.selection=[];p.wrong=false;})));
          actions.append(button('A clue, please','textButton',()=>act(()=>{p.hint=true;})),button('Listen','textButton',()=>{if(!ctx.active())return;timeTap();p.listened=true;if(ctx.save())ctx.speak(q.text.join(' ')+' '+q.prompt);}),);
          if(p.attempts)actions.append(button('Show me how','textButton',()=>act(()=>Core.checkRiddle(s,Date.now(),{reveal:true}))));
        }if(p.solved){panel.classList.add('riddleSolved');const answer=el('p','riddleSolvedAnswer',[q.answer].flat().map(id=>q.options.find(o=>o.id===id).label).join(' → '));feedback.insertBefore(answer,feedback.querySelector('p'));feedback.insertBefore(actions,feedback.querySelector('p'));}else panel.append(actions);
      }
      const picture=el('div','missionPicture');picture.append(scene,teamCard());body.append(picture,panel);screen.append(body);screen.scrollTop=scroll;if(solving&&p.solved){const feedback=panel.querySelector('.riddleFeedback');feedback.focus?.({preventScroll:true});feedback.scrollIntoView?.({block:'start'});}stamp=solving&&!p.solved?performance.now():null;
    }
    function renderSearch(screen,s,c,m){
      const map=A.Maps[m.id],q=A.mapQuestion(s),p=c.search;if(!map||!q){ctx.home();return;}
      const top=el('div','missionTop');renderProgress(top);screen.append(top);
      const wrap=el('div','questSearch'),head=el('header','searchHead');
      head.append(el('div','',m.name+' · Map question '+(p.index+1)+' of 3'),el('strong','questHearts','♥ '+c.hearts+' / '+c.maxHearts+' lives'));wrap.append(head);
      const host=el('div','questMapViewer');wrap.append(host);
      const panel=el('section','searchReading parchment');panel.append(el('p','searchRegion',q.region),el('h1','',q.prompt));
      const lines=el('div','searchClue');q.text.forEach(line=>{const row=el('p','');line.split(/(\s+)/).forEach(word=>{if(/^\s+$/.test(word)){row.append(document.createTextNode(word));return;}const b=button(word,'searchWord',()=>{if(!ctx.active())return;p.listened=true;if(ctx.save())ctx.speak(word);});b.setAttribute('aria-label','Hear '+word);row.append(b);});lines.append(row);});panel.append(lines);
      const choices=el('div','searchAnswers');choices.setAttribute('role','group');choices.setAttribute('aria-label',q.prompt);
      q.options.forEach(option=>{const b=button(option.label,'searchAnswer'+(p.selection===option.id?' selected':''),()=>{if(!b.isConnected||!ctx.active())return;act(()=>A.chooseMap(s,option.id,q.id));});b.dataset.mapChoice=option.id;b.setAttribute('aria-pressed',String(p.selection===option.id));choices.append(b);});panel.append(choices);
      const feedback=el('p','searchFeedback',p.wrong?'Not quite. −1 life. Check every part of the clue before trying again.':p.index?'Good searching! Keep using this map for the next clue.':'Zoom in to check the small details. Choose only from the written answers.');feedback.setAttribute('role','status');panel.append(feedback);
      if(p.hint)panel.append(el('p','searchHint',q.hint));
      const actions=el('div','searchActions'),submit=button('Check my answer','greenButton',()=>{if(!submit.isConnected||!ctx.active()||!mapViewer?.ready())return;act(()=>Core.checkMap(s,Date.now(),q.id));});submit.disabled=!p.selection||p.wrong;
      actions.append(submit,button('A clue, please','textButton',()=>act(()=>{p.hint=true;})),button('Listen','textButton',()=>{if(!ctx.active())return;timeTap();p.listened=true;if(ctx.save())ctx.speak(q.text.join(' ')+' '+q.prompt);}),button('Back to camp','textButton',ctx.home));panel.append(actions);wrap.append(panel);screen.append(wrap);
      mapViewer=window.BlitzMapViewer.mount(host,map.image,map.title,mapCameraId===m.id?mapCamera:null);mapCameraId=m.id;
      stamp=performance.now();
    }
    function renderResult(){
      const s=ctx.state(),e=A.of(s),m=A.current(s),r=s.result,c=e.current;if(!r?.missionId||!m)return false;
      $('#resultMessage').textContent=r.victory?(r.newDiscovery?'New creature discovered!':'A new clue is ready.'): 'No hearts left. '+(c.retryFromStep===0?'Try the first step again.':'Go back '+((c.retryFromStep??c.step*2)-(c.retryTargetStep??Math.max(0,c.step*2-2)))+' steps. Your XP stays safe.');
      $('#checkpoint').textContent='';const box=$('#opponents');box.replaceChildren();box.classList.add('missionResultActions');
      box.append(button(r.victory?'Read the next clue':'Try again · 4 hearts','greenButton',()=>{if(!ctx.active())return;if(r.victory)A.startPuzzle(s);else Core.startMissionBattle(s,Date.now());if(ctx.save())ctx.enter();}));
      if(r.victory&&c.step===3)$('#resultMessage').textContent=c.ninthRequired?'Star stamp earned! One clue and the map search remain.':'Star stamp earned! One clue left.';
      const family=A.companion(s),friend=$('#resultCompanion');friend.hidden=!family;if(family)ctx.paintEnemy(friend,family,8);
      $('#resultNext').textContent='Back to camp';return true;
    }
    function openBook(family=null){
      timeTap();bookReturn=ctx.state().screen==='mission'?'mission':'hub';if(!ctx.suspend())return;selectedCreature=family;renderBook();
    }
    function renderBook(){
      const s=ctx.state(),e=A.of(s),report=A.report(s);ctx.show('creatureBook');const screen=$('#creatureBook');screen.replaceChildren();
      const top=el('div','bookTop');top.append(button('← '+(bookReturn==='mission'?'Back to mission':'Back to camp'),'secondaryButton',()=>bookReturn==='mission'?ctx.enter():ctx.home()),el('span','bookCount',report.seen+' / 20 discovered'));screen.append(top);
      screen.append(heading('Your animal friends','Creature Book','Choose a friend to join you in fights. It can stop one hit each quest.'));
      const legend=el('div','bookLegend');for(const text of ['◆ Met: meet this friend','✦ Clue: solve its clue','★ Star: win its big fight'])legend.append(el('span','',text));screen.append(legend);
      const layout=el('div','bookLayout'),grid=el('div','creatureGrid');
      Content.enemies.forEach((enemy,i)=>{const entry=e.book[enemy.id],b=button('','creatureTile'+(!entry?.seen?' unseen':'')+(selectedCreature===enemy.id?' selected':''),()=>{selectedCreature=enemy.id;renderBook();$('#creatureDetail').scrollIntoView?.({block:'nearest'});});b.dataset.family=enemy.id;b.setAttribute('aria-label',entry?.seen?enemy.name:'Unknown creature '+(i+1));
        const art=el('span','sceneSprite');ctx.paintEnemy(art,enemy.id,8);art.setAttribute('aria-hidden','true');b.append(el('small','creatureNumber',String(i+1).padStart(2,'0')),art,el('strong','',entry?.seen?enemy.name:'???'));
        const stamps=el('span','creatureStamps');for(const [field,label,symbol] of [['seen','Met','◆'],['studied','Clue','✦'],['champion','Star','★']]){const stamp=el('span',entry?.[field]?'earned':'',symbol+' '+label);stamp.setAttribute('aria-label',label+(entry?.[field]?': earned':': not yet'));stamps.append(stamp);}b.append(stamps);grid.append(b);
      });layout.append(grid);
      const detail=el('aside','creatureDetail parchment');detail.id='creatureDetail';
      if(selectedCreature){const enemy=Content.enemyAt(selectedCreature),entry=e.book[selectedCreature],m=A.findMission(selectedCreature),lore=D.lore[selectedCreature];
        const art=el('div','detailCreature sceneSprite'+(!entry?.seen?' undiscovered':''));ctx.paintEnemy(art,selectedCreature,8);detail.append(art,el('h2','',entry?.seen?enemy.name:'Who is hiding here?'),el('p','',entry?.studied?lore[1]:lore[0]));
        detail.append(el('p','creatureWhere','Find this friend: '+m.name));
        const stamps=el('ul','bookStampList');for(const [field,label] of [['seen','Met this friend'],['studied','Solved its clue'],['champion','Won its big fight']])stamps.append(el('li',entry?.[field]?'earned':'',(entry?.[field]?'✓ ':'○ ')+label));detail.append(stamps);
        if(!entry?.studied)detail.append(el('p','bookHint','Finish a clue with this creature to learn its secret.'));
        if(!entry?.champion)detail.append(el('p','bookHint','Win its big fight to earn the star.'));
        if(entry?.seen){const favourite=button(e.favourite===selectedCreature?'On your team ✓':'Choose for my team','secondaryButton',()=>{if(A.selectCompanion(s,selectedCreature)&&ctx.save())renderBook();});detail.append(favourite);}
        detail.append(button('Find this path','textButton',()=>{e.selectedCampaign=m.campaign;if(!ctx.save())return;ctx.home();const card=$('#adventureHub [data-mission="'+m.id+'"]');card?.classList.add('creatureTarget');card?.scrollIntoView?.({block:'center'});}));
      }else {detail.append(el('h2','','Every friend has a secret'),el('p','','Tap a page to see its clues. A dark shape means there is someone new to find.'));}
      layout.append(detail);screen.append(layout);
    }
    return {renderHub,renderMission,renderResult,openBook,renderBook,timeTap,stopTiming,icon,renderProgress,renderBattleTeam};
  }
  root.BlitzAdventureUI={create};
})(typeof window==='object'?window:globalThis);
