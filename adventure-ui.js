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
      const s=ctx.state(),phase=A.of(s).current?.phase,p=['search','story'].includes(phase)?{solved:false}:A.of(s).current?.puzzle,now=performance.now();
      const delta=stamp===null||window.BlitzFeedback.isOpen()?0:Math.max(0,now-stamp);
      // Reading a story page takes longer than a tap gap; the core caps each page by its word count.
      if(s.screen==='mission'&&p&&!p.solved&&ctx.active()&&!document.hidden&&delta<=(phase==='story'?180000:5000))Core.recordRiddleTime(s,delta,Date.now());
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
      const track=el('div','questSteps');if(compact)track.style.gridTemplateColumns='repeat('+p.total+',minmax(0,1fr))';track.setAttribute('role','progressbar');track.setAttribute('aria-label',p.labels?'Quest: two fights and a story, then two fights and a story':p.total===9?(m.story?'Quest: four fights, four clues and a story to read':'Quest: four fights, four clues and a map search'):'Quest: four fights and four clues');track.setAttribute('aria-valuemin','0');track.setAttribute('aria-valuemax',String(p.total));track.setAttribute('aria-valuenow',String(p.done));
      for(let i=0;i<p.total;i++){const step=el('span','questStep'+(i<p.done?' done':i===p.done?' current':''),compact?'':p.labels?p.labels[i]:(i===8?(m.story?'Story':'Map'):i%2?'Clue':'Fight'));step.setAttribute('aria-hidden','true');track.append(step);}element.append(track);
      if(!compact)element.append(el('small','questNext',p.left?'Next: '+p.next.toLowerCase()+' · Treasure after step '+p.total:'All done! Your treasure is ready.'));
    }
    function teamCard(){
      const s=ctx.state(),c=A.of(s).current,family=A.companion(s),card=el('div','questTeam');
      if(family){const art=el('span','sceneSprite');ctx.paintEnemy(art,family,8);card.append(art);}
      const copy=el('div','questTeamCopy');copy.append(el('strong','',family?'On your side: '+Content.enemyAt(family).name:'Choose an animal for your team'),el('p','',!family?'It can stop one hit each quest.':c?.companionHelpUsed?'Your friend has stopped a hit. It can help again next quest.':'Your friend can stop one hit this quest.'));
      copy.append(button(family?'Change animal':'Choose my animal','textButton',()=>openBook(family)));card.append(copy);return card;
    }
    function chooseSupport(done=()=>{},force=false){
      const s=ctx.state();if(!force&&(!s.rewards.shield||!s.rewards.supportPending))return false;
      const choices=A.supportChoices(s);if(!choices.length)return false;
      let selected=choices.includes(A.of(s).supportFavourite)?A.of(s).supportFavourite:choices[0];
      const grid=el('div','supportChoices');
      const card=window.BlitzFeedback.show({title:force?'Choose your shield friend':'You earned a shield!',message:'Your friend will stop one hit, then head home.',detail:A.supportNeed(s).accurate<8?'After a lost fight, five accurate answers, or four quick ones, can call a friend.':'Eight accurate answers, or six quick accurate answers, can call a friend.',content:grid,actions:[{label:'Join my team',run:()=>{if(!ctx.active()||!A.selectSupport(s,selected)||!ctx.save())return false;return true;}}],onClose:()=>{renderBattleTeam();done();}});
      choices.forEach(family=>{const b=button('','supportChoice',()=>{selected=family;for(const option of grid.children)option.setAttribute('aria-pressed',String(option===b));});b.setAttribute('aria-pressed',String(selected===family));const art=el('span','sceneSprite');ctx.paintEnemy(art,family,8);b.append(art,el('span','',Content.enemyAt(family).name));grid.append(b);});
      card.querySelector('.supportChoice')?.focus?.();return true;
    }
    function puzzleFeedback(result,q,map=false){
      if(!result)return;const s=ctx.state(),c=A.of(s).current,won=result.correct,ended=c.phase==='complete',lost=c.hearts===0,earned=map?result.xpEarned:c.puzzle?.xpEarned;
      window.BlitzFeedback.show({kind:won?'success':'retry',title:won?(ended?'You found the treasure!':map?'You found it!':result.assisted?'Let’s learn this clue':'Clue solved!'):lost?'Time for a fresh start':'Take another look',message:won?((q.reward||'Every part of the clue fits.')+(earned?' +'+earned+' XP':'')):lost?'Return to step '+((c.retryTargetStep||0)+1)+' with four hearts. Your XP is safe.':'One heart used. You have '+c.hearts+' left.',detail:won?(ended?'All three secrets found. Your quest is complete.':q.explanation||'Look for the next secret in the same map.'):q.hint,actions:[{label:won?(ended?'See my treasure':map?'Next map clue':'Continue'):lost?'Try again':'Back to the clue'}],onClose:()=>{if(!ctx.active())return;if(lost){Core.startMissionBattle(s,Date.now());if(ctx.save())ctx.enter();}else if(won&&!map){act(()=>A.next(s,Date.now()));}else stamp=performance.now();}});
      stamp=null;
    }
    function checkPuzzle(q,options={}){let result;act(()=>{result=Core.checkRiddle(ctx.state(),Date.now(),options);});if(!ctx.active())return;puzzleFeedback(result,q);}
    function renderBattleTeam(heldAtImpact=null,shown=null){
      const s=ctx.state(),family=s.battle?.missionId?A.companion(s):null,box=$('#battleCompanion');box.hidden=!family;$('#battle').classList.toggle('hasQuestCompanion',!!family);
      const support=heldAtImpact||(s.rewards.shield?s.rewards.supportFamily:null),extra=$('#battleSupport');extra.hidden=!support;$('#battle').classList.toggle('hasShieldSupport',!!support);
      // Shields shown until the hit lands; a second held shield is a ×2 badge on the same friend.
      const count=Math.max(support?1:0,shown??A.heldShields(s));let badge=extra.querySelector('.shieldCount');
      if(support&&count>1){if(!badge){badge=el('b','shieldCount');badge.setAttribute('aria-hidden','true');extra.append(badge);}badge.textContent='×'+count;}else badge?.remove();
      if(support){const art=$('#battleSupportArt');if(art.dataset.family!==support){ctx.paintEnemy(art,support,8);art.dataset.family=support;}extra.setAttribute('role','img');extra.setAttribute('aria-label',Content.enemyAt(support).name+' shield friend'+(count>1?', '+count+' shields':''));}
      if(!family)return;
      const art=$('#battleCompanionArt');if(art.dataset.family!==family){ctx.paintEnemy(art,family,8);art.dataset.family=family;}
      box.setAttribute('role','img');box.setAttribute('aria-label',Content.enemyAt(family).name+' companion');
    }
    // ---- Pip Grows Up (12 November 2026): quests pause at 44,000 XP until Pip's story is read ----
    function startGrowth(){const s=ctx.state(),next=A.growthNext(s);if(!next)return;A.of(s).selectedCampaign=A.GROWTH.campaign;ctx.launch(next);}
    function growthBanner(s,inQuest=false){
      const box=el('section','growthBanner parchment'),art=el('span','sceneSprite growthBannerPip');ctx.paintPip(art);art.setAttribute('aria-hidden','true');
      const copy=el('div','growthBannerCopy'),next=A.growthNext(s),stuck=next&&A.blocking(s,next);
      copy.append(el('strong','',ctx.dragonText('Pip is glowing!')),el('p','',ctx.dragonText(inQuest?'Pip is ready to grow. Read Pip’s story now. Your quest will wait for you.':'Pip is ready to grow. Read Pip’s story first. Then your quests go on.')));
      const go=button(ctx.dragonText('Read Pip’s story'),'greenButton',startGrowth);go.id=inQuest?'growthStartQuest':'growthStart';go.disabled=!next||stuck;copy.append(go);
      if(stuck)copy.append(el('small','growthBannerNote','Finish this fight first.'));
      box.append(art,copy);return box;
    }
    function renderGrowthGate(screen,s,m){
      const top=el('div','missionTop');renderProgress(top);screen.append(top);
      const body=el('div','missionBody'),scene=el('figure','missionScene'),image=el('img');
      const cover=D.campaigns.find(c=>c.id===A.GROWTH.campaign);image.src=cover.scene;image.alt=cover.coverAlt||'';image.decoding='async';image.onerror=()=>{image.onerror=null;image.src=missionArt(m);};scene.append(image);
      const panel=el('div','missionReading parchment');panel.append(heading(m.name,ctx.dragonText('Pip is glowing!'),ctx.dragonText('Pip has 44,000 XP. He is ready to grow! First read his story with him. This quest will wait for you, and you can go on after the story.')));
      panel.append(growthBanner(s,true),button('Back to camp','textButton',ctx.home));
      const picture=el('div','missionPicture');picture.append(scene);body.append(picture,panel);screen.append(body);
    }
    function renderReadIntro(screen,s,c,m){
      const top=el('div','missionTop');renderProgress(top);screen.append(top);
      const campaign=D.campaigns.find(x=>x.id===m.campaign),part=campaign.missions.indexOf(m.id)+1;
      const body=el('div','missionBody'),scene=el('figure','missionScene'),image=el('img');image.src=m.art;image.alt=m.artAlt;image.decoding='async';scene.append(image);scene.append(el('figcaption','',m.goal));
      const panel=el('div','missionReading parchment');
      panel.append(heading(campaign.name+' · Part '+part+' of '+campaign.missions.length,m.name,ctx.dragonText(m.intro)));
      panel.append(el('p','storyTip','No fights in this story. Read it, then answer three questions.'));
      panel.append(button('Read the story','greenButton',()=>act(()=>A.beginStory(s,Date.now(),1))),button('Back to camp','textButton',ctx.home));
      const picture=el('div','missionPicture');picture.append(scene);body.append(picture,panel);screen.append(body);
    }
    function renderHub(){
      stopTiming();if(mapViewer){mapCamera=mapViewer.snapshot();mapViewer.destroy();mapViewer=null;}const s=ctx.state(),e=A.of(s),report=A.report(s);ctx.show('adventureHub');
      const screen=$('#adventureHub');screen.replaceChildren();
      const c=D.campaigns.find(c=>c.id===e.selectedCampaign)||D.campaigns[0];
      screen.style.backgroundImage='linear-gradient(180deg,#10282088,#10282044 40%,#102820bb),url("'+c.scene+'")';
      const top=el('div','adventureTop'),tabs=el('nav','campaignTabs');tabs.setAttribute('aria-label','Choose a campaign');
      D.campaigns.forEach((campaign,i)=>{if(campaign.growth&&!A.growthOpen(s))return;const open=campaign.growth||D.campaigns.slice(0,i).every(prior=>prior.growth||A.campaignComplete(s,prior.id));const b=button((i+1)+'. '+campaign.shortName,'campaignTab'+(c.id===campaign.id?' selected':''),()=>{e.selectedCampaign=campaign.id;if(ctx.save())renderHub();});b.disabled=!open;b.setAttribute('aria-pressed',String(c.id===campaign.id));if(!open)b.title='Finish '+D.campaigns[i-1].shortName+' to open this campaign.';if(campaign.growth)b.classList.add('growthTab');tabs.append(b);});
      const book=button('Creature Book · '+report.seen+'/'+Content.creatures.length,'bookLauncher',()=>openBook());book.insertAdjacentHTML('afterbegin',icon('leaf'));
      // Turtle Race is always offered: a separate page with its own stats, never the learner save.
      const race=button('Turtle race','raceLauncher',ctx.turtleRace);race.id='hubTurtleRace';race.setAttribute('aria-label','Open Turtle race: three reading races against the turtle');race.insertAdjacentHTML('afterbegin','<img src="assets/turtle-race/turtle.webp" alt="" aria-hidden="true">');
      const launchers=el('div','hubLaunchers');launchers.append(race,book);top.append(tabs,launchers);screen.append(top);
      const done=c.missions.filter(id=>e.missions[id]?.completedAt).length;
      screen.append(heading('Adventure '+(D.campaigns.indexOf(c)+1)+' · '+done+'/'+c.missions.length+' treasures',c.name,done===c.missions.length?c.ending:c.intro));
      if(c.id==='star-trail')screen.append(button('Read a star message · about 1 minute','greenButton',()=>{if(ctx.save())location.href='assets/oral-reading/?sky='+encodeURIComponent(e.current?.missionId&&c.missions.includes(e.current.missionId)?e.current.missionId:c.missions.find(id=>!e.missions[id]?.completedAt)||c.missions[0]);}));
      if(A.growthDue(s))screen.append(growthBanner(s));
      if(e.current&&e.current.phase!=='complete'){
        const current=D.byId[e.current.missionId],resume=button((e.current.replay?'Keep playing again: ':'Continue ')+current.name+' · '+A.progress(s).left+' steps left','greenButton missionResume',()=>ctx.launch(current.id));resume.id='missionResume';screen.append(resume);
      }else if(e.parked&&!A.growthDue(s)){
        const parked=D.byId[e.parked.missionId],resume=button('Continue '+parked.name,'greenButton missionResume',()=>ctx.launch(parked.id));resume.id='missionResume';screen.append(resume);
      }
      const grid=el('div','missionGrid');
      c.missions.forEach((id,i)=>{
        const m=D.byId[id],open=A.unlocked(s,id),complete=!!e.missions[id]?.completedAt,busy=A.blocking(s,id);
        const card=button('','missionCard'+(complete?' complete':'')+(!open?' locked':''),()=>ctx.launch(id));card.dataset.mission=id;card.disabled=!open||busy;
        card.setAttribute('aria-label',(complete?'Play again: ':open?'Start mission: ':'Locked mission: ')+m.name);
        const art=el('div','missionCardArt');art.style.backgroundImage='url("'+missionArt(m)+'")';
        const medal=el('span','missionNumber',complete?'✓':String(i+1));art.append(medal);
        const creatures=el('span','missionCreatures');for(const family of m.families){const face=el('span','missionCreature sceneSprite');ctx.paintEnemy(face,family,8);if(!e.book[family]?.seen)face.classList.add('undiscovered');creatures.append(face);}art.append(creatures);
        const copy=el('div','missionCardCopy');copy.append(el('h2','',m.name),el('p','',m.goal));
        const status=e.current?.missionId===id&&e.current.phase!=='complete'?(e.current.replay?'Treasure found · playing again · ':'')+A.progress(s).left+' steps left':complete?'Treasure found · play again':!open&&A.growthDue(s)&&!A.isGrowth(id)?ctx.dragonText('After Pip’s story'):!open?'Follow the earlier paths':busy?'Your current mission is saved':m.finale?'Final mission':'Choose this path';copy.append(el('span','missionCardStatus',status));card.append(art,copy);grid.append(card);
      });screen.append(grid);
      const camp=el('footer','adventureCamp'),pip=button('','campPip',ctx.growth);pip.setAttribute('aria-label','See Pip’s growth');const pipArt=el('span','sceneSprite');ctx.paintPip(pipArt);pip.append(pipArt,el('span','',ctx.dragonText('Pip')+' · '+Math.floor(s.dragon.xp||0)+' XP'));camp.append(pip);
      if(A.companion(s)){const friend=button('','campFriend',()=>openBook(e.favourite));const art=el('span','sceneSprite');ctx.paintEnemy(art,e.favourite,8);friend.append(art,el('span','','Your team · '+Content.enemyAt(e.favourite).name));camp.append(friend);}
      else camp.append(button('Choose my animal','bookLauncher',()=>openBook()));
      const controls=el('div','campControls');if(s.settings.storiesEnabled===true)controls.append(button('⌕ Dragon path','textButton',ctx.wimmelbild),button('Story adventures','textButton',ctx.stories));if(s.settings.legacyEnabled===true)controls.append(button('Word trails','textButton',ctx.legacy));controls.append(button('Speed','textButton',ctx.speed),button('Parents','textButton',ctx.parents));camp.append(controls);screen.append(camp);
    }
    function renderMission(){
      const s=ctx.state(),e=A.of(s),c=e.current,m=A.current(s);if(!m||!c){ctx.home();return;}
      const screen=$('#mission'),view=m.id+':'+c.step+':'+c.phase,scroll=screen.dataset.view===view?screen.scrollTop:0;
      if(mapViewer){mapCamera=mapViewer.snapshot();mapViewer.destroy();mapViewer=null;}
      ctx.show('mission');screen.replaceChildren();screen.dataset.view=view;
      if(c.phase==='search'){renderSearch(screen,s,c,m);screen.scrollTop=scroll;return;}
      if(c.phase==='story'){renderStory(screen,s,c,m);screen.scrollTop=scroll;return;}
      if(c.phase==='intro'&&A.growthDue(s)&&!A.isGrowth(m.id)){renderGrowthGate(screen,s,m);return;}
      if(c.phase==='intro'&&m.storyOnly){renderReadIntro(screen,s,c,m);return;}
      const complete=c.phase==='complete',p=c.puzzle,q=D.puzzles[p?.id],solving=c.phase==='puzzle';
      const top=el('div','missionTop');renderProgress(top);screen.append(top);
      const body=el('div','missionBody'),scene=el('figure','missionScene');
      const image=el('img');const pageArt=c.phase==='complete'?{art:m.endingArt||m.art,alt:m.endingArtAlt||m.artAlt}:m.story?null:m.scenes?.[c.step];image.src=pageArt?.art||missionArt(m);image.alt=pageArt?.alt||m.artAlt||m.place;image.decoding='async';scene.append(image);
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
        const read=e.missions[m.id]?.storyLast;if(m.story&&read)panel.append(storySummary(m,read,all,campaign));
        const friends=el('div','missionFriends');for(const family of m.families){const b=button('','friendReward',()=>openBook(family));const art=el('span','sceneSprite');ctx.paintEnemy(art,family,8);b.append(art,el('strong','',Content.enemyAt(family).name),el('small','','Clue stamp earned'));friends.append(b);}panel.append(friends);
        const nextCampaign=all?D.campaigns[D.campaigns.indexOf(campaign)+1]:null,parked=e.parked&&D.byId[e.parked.missionId];
        if(m.storyOnly&&!all){const next=D.byId[campaign.missions[campaign.missions.indexOf(m.id)+1]];panel.append(button('Read part '+(campaign.missions.indexOf(m.id)+2)+': '+next.name,'greenButton',()=>ctx.launch(next.id)),button('Rest here','textButton',ctx.home));}
        else if(campaign.growth&&parked)panel.append(button(ctx.dragonText('Ride on Pip: back to '+parked.name),'greenButton',()=>ctx.launch(parked.id)),button('Rest here','textButton',ctx.home));
        else if(campaign.growth)panel.append(button('Choose a quest','greenButton',()=>{e.selectedCampaign=D.campaigns.find(x=>!x.growth&&!A.campaignComplete(s,x.id))?.id||e.selectedCampaign;if(ctx.save())ctx.home();}),button('Rest here','textButton',ctx.home));
        else panel.append(button(nextCampaign&&!nextCampaign.growth?'Explore '+nextCampaign.shortName:'Choose another mission','greenButton',()=>{if(nextCampaign&&!nextCampaign.growth)e.selectedCampaign=nextCampaign.id;if(ctx.save())ctx.home();}),button('Rest here','textButton',ctx.home));
      }else if(!solving){
        const family=m.encounters[c.step],first=c.step===0;
        panel.append(heading(first?(m.story?'A story quest':'A new quest'):c.step>=2?'Big fight':'Next fight',first?m.name:m.stories?'Fight '+(c.step+1)+' of 4':m.riddles[c.step].title,ctx.dragonText(first?m.intro:m.stories?(c.step%2?'Win this fight, then read a story.':'Win this fight. These words are in the next story.'):m.scenes?.[c.step]?.intro||'Win this fight. Get the next clue.')));
        if(m.story)panel.append(storyWordPreview(m));
        if(first&&m.campaign==='star-trail')panel.append(button('Read a star message','greenButton',()=>{if(ctx.save())location.href='assets/oral-reading/?sky='+encodeURIComponent(m.id);}));
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
          const ready=button('Try it','greenButton',()=>checkPuzzle(q));ready.disabled=p.wrong||p.selection.length!==(Array.isArray(q.answer)?q.answer.length:1);actions.append(ready);
          if(q.type==='order')actions.append(button('Start order again','textButton',()=>act(()=>{p.selection=[];p.wrong=false;})));
          actions.append(button('A clue, please','textButton',()=>act(()=>{p.hint=true;})),button('Listen','textButton',()=>{if(!ctx.active())return;timeTap();p.listened=true;if(ctx.save())ctx.speak(q.text.join(' ')+' '+q.prompt);}),);
          if(p.attempts)actions.append(button('Show me how','textButton',()=>checkPuzzle(q,{reveal:true})));
        }if(p.solved){panel.classList.add('riddleSolved');const answer=el('p','riddleSolvedAnswer',[q.answer].flat().map(id=>q.options.find(o=>o.id===id).label).join(' → '));feedback.insertBefore(answer,feedback.querySelector('p'));feedback.insertBefore(actions,feedback.querySelector('p'));}else panel.append(actions);
      }
      const picture=el('div','missionPicture');picture.append(scene);if(!m.storyOnly)picture.append(teamCard());body.append(picture,panel);screen.append(body);screen.scrollTop=scroll;if(solving&&p.solved){const feedback=panel.querySelector('.riddleFeedback');feedback.focus?.({preventScroll:true});feedback.scrollIntoView?.({block:'start'});}stamp=solving&&!p.solved?performance.now():null;
    }

    // ---- Story quests: a chapter to read with every word tappable (2 November 2026) ----
    const STORY_FUNCTION_WORDS=new Set('a an and the to of in on at by is it was he she we you i they them him his her my me be am are were do did not no so but for from with this that there then too can will'.split(' '));
    function storyKey(word){return word.toLowerCase().replace(/[’']s$/,'').replace(/[^a-z]/g,'');}
    // Recorded tap-to-hear clips for a story campaign (Moon Key, 8 November 2026): 'story:<campaign>:w:<word>',
    // ':m:<word>' for its meaning and ':q:<question>'. Without a clip the words are spoken as before.
    function storyClip(id){const c=A.current(ctx.state())?.campaign,key=c&&'story:'+c+':'+id;return key&&window.BlitzStoryVoice?.clips?.[key]?key:null;}
    function sayStory(text,id){ctx.speak(text,{clip:storyClip(id)});}
    function glossaryEntry(key){const s=ctx.state(),name=(s.dragon.name||'Pip').toLowerCase();return D.glossary[key===name?'pip':key]||null;}
    function chunked(word,entry){
      const box=el('div','storyChunks');box.setAttribute('aria-hidden','true');
      const parts=(entry?.[1]||word).split('|'),plain=parts.join(''),lower=plain.toLowerCase(),marks=new Set(),pattern=entry?.[2];
      // 'a_e' marks a split vowel (came, home); other patterns mark one letter group (ou, igh).
      if(pattern&&pattern.includes('_')){const [v,e]=pattern.split('_'),at=lower.search(new RegExp(v+'[^aeiou]'+e+'s?$'));if(at>=0){marks.add(at);marks.add(at+2);}}
      else if(pattern){const at=lower.indexOf(pattern);if(at>=0)for(let k=0;k<pattern.length;k++)marks.add(at+k);}
      let index=0;parts.forEach((part,n)=>{if(n)box.append(el('span','storyChunkDot','·'));const chunk=el('span','storyChunk');for(const ch of part){const letter=el('span',marks.has(index)?'storyLetter tricky':'storyLetter',ch);chunk.append(letter);index++;}box.append(chunk);});
      return box;
    }
    function openStoryWord(word){
      const s=ctx.state(),key=storyKey(word),entry=glossaryEntry(key),spoken=word.replace(/[^A-Za-z’']/g,'').replace(/’/g,"'");
      if(!key||!ctx.active())return;timeTap();Core.noteStoryTap(s,word,'sound',Date.now());if(!ctx.save())return;const wordClip='w:'+spoken.toLowerCase();sayStory(spoken,wordClip);
      const content=el('div','storyWordCard');content.append(chunked(spoken.replace(/'s$/,''),entry));
      const tools=el('div','storyWordTools');
      tools.append(button('Hear it again','secondaryButton',()=>sayStory(spoken,wordClip)));
      const meaning=el('p','storyMeaning');meaning.hidden=true;
      if(entry&&!STORY_FUNCTION_WORDS.has(key)){tools.append(button('What does it mean?','secondaryButton',()=>{if(!ctx.active())return;Core.noteStoryTap(ctx.state(),word,'meaning',Date.now());ctx.save();meaning.hidden=false;meaning.textContent=ctx.dragonText(entry[0]);sayStory(entry[0],'m:'+key);}));}
      content.append(tools,meaning);
      window.BlitzFeedback.show({kind:'success',title:spoken,message:'Tap a button to hear it again or find out what it means.',content,actions:[{label:'Back to the story'}],onClose:()=>{stamp=performance.now();}});
    }
    function tappableText(text,cls='storyParagraph'){
      const row=el('p',cls);ctx.dragonText(text).split(/(\s+)/).forEach(token=>{if(!token)return;if(/^\s+$/.test(token)){row.append(document.createTextNode(token));return;}
        if(!/[A-Za-z]/.test(token)){row.append(document.createTextNode(token));return;}
        const b=button(token,'storyWord',()=>openStoryWord(token));b.setAttribute('aria-label','Hear '+token.replace(/[^A-Za-z’']/g,''));row.append(b);});
      return row;
    }
    function previewClip(m,w){const key='story:'+m.campaign+':w:'+w.toLowerCase();return window.BlitzStoryVoice?.clips?.[key]?key:null;}
    function storyWordPreview(m){
      const box=el('div','storyPreview');box.append(el('p','storyPreviewLabel','Words for the next part of the story:'));
      const list=el('div','storyPreviewWords');for(const w of m.targets){const b=button(w,'storyPreviewWord',()=>{if(ctx.active())ctx.speak(w,{clip:previewClip(m,w)});});b.setAttribute('aria-label','Hear '+w);list.append(b);}box.append(list);return box;
    }
    function storySummary(m,read,all,campaign){
      const box=el('div','storySummary');
      const words=all?campaign.missions.reduce((n,id)=>n+(D.byId[id].stories||[D.byId[id].story]).reduce((t,st)=>t+st.words,0),0):read.words;
      box.append(el('p','storySummaryBig',all?'You read the whole story: '+words+' words!':'You read '+(read.stories===2?'two stories, ':'')+read.words+' words, by yourself!'));
      box.append(el('p','',read.taps?'You tapped '+read.taps+(read.taps===1?' word':' words')+' to hear them. Great reading!':'You did not need any help. Wow!'));
      box.append(el('p','',read.firstTry+' of '+(read.questions||3)+' questions right the first time.'));return box;
    }
    function storyFeedback(result,q){
      if(!result)return;const s=ctx.state(),done=result.storyDone==='end',mid=result.storyDone==='mid';
      if(result.correct&&result.grows)window.BlitzFeedback.show({kind:'success',title:ctx.dragonText('Pip is growing!'),message:'You read the whole story!'+(result.xpEarned?' +'+result.xpEarned+' XP':'')+ctx.dragonText(' Pip has 45,000 XP now.'),actions:[{label:'Watch Pip grow'}],onClose:()=>{if(!ctx.evolve())renderMission();}});
      else if(result.correct)window.BlitzFeedback.show({kind:'success',title:done?'You finished the story part!':mid?'You finished the story!':'That’s right!',message:(done||mid?'You read it and you understood it.':'Great reading.')+(result.xpEarned?' +'+result.xpEarned+' XP':''),actions:[{label:done?'See my treasure':mid?'Next fight':'Next question'}],onClose:()=>renderMission()});
      else window.BlitzFeedback.show({kind:'retry',title:'Not quite',message:'The answer is on page '+result.page+'. Let’s look again.',actions:[{label:'Look at page '+result.page,run:()=>{if(!ctx.active()||!A.lookBack(s)||!ctx.save())return false;return true;}}],onClose:()=>renderMission()});
    }
    function renderStory(screen,s,c,m){
      const r=c.read,st=A.currentStory(s),top=el('div','missionTop');renderProgress(top);screen.append(top);
      const partNo=D.campaigns.find(x=>x.id===m.campaign).missions.indexOf(m.id)+1,quiz=r.stage==='quiz',label='Part '+partNo+(m.stories?' · Story '+(r.which===0?1:2)+' of 2':''),count=st.questions.length,words=['','one','two','three','four'][count]||String(count);
      const body=el('div','missionBody storyBody'),scene=el('figure','missionScene'),image=el('img');// Questions show the campaign cover, so no page picture gives an answer away.
      const art=quiz?D.campaigns.find(x=>x.id===m.campaign).scene:st.art?.[r.page];
      image.src=art||missionArt(m);image.alt=quiz?(D.campaigns.find(x=>x.id===m.campaign).coverAlt||'Artus, Pip and Jet look at Thunder Mountain.'):st.title+' · picture '+(r.page+1);image.decoding='async';image.onerror=()=>{image.onerror=null;image.src=missionArt(m);};scene.append(image);
      scene.append(el('figcaption','',quiz?words[0].toUpperCase()+words.slice(1)+' questions about the story':label+' · Page '+(r.page+1)+' of '+st.pages.length));
      const panel=el('section','missionReading parchment storyPanel');
      if(!quiz){
        if(r.stage==='lookback'){const q=A.storyQuestion(s),hint=el('div','storyLookback');hint.append(el('strong','','Find the answer:'),tappableText(q.prompt,'storyLookbackQuestion'));panel.append(hint);}
        panel.append(heading(label+' · Page '+(r.page+1)+' of '+st.pages.length,st.title));
        const text=el('div','storyText');st.pages[r.page].forEach(p=>text.append(tappableText(p)));panel.append(text);
        panel.append(el('p','storyTip','Tap any word to hear it.'));
        const nav=el('div','storyNav');
        if(r.page>0)nav.append(button('← Page '+r.page,'secondaryButton',()=>act(()=>A.turnStoryPage(s,r.page-1))));
        if(r.stage==='lookback')nav.append(button('Back to the question','greenButton',()=>act(()=>A.backToQuestion(s))));
        if(r.page<st.pages.length-1)nav.append(button('Next page →','greenButton',()=>act(()=>A.turnStoryPage(s,r.page+1))));
        else if(r.stage==='read')nav.append(button('I read it! Answer '+count+' questions','greenButton',()=>{let result;act(()=>{result=Core.finishStoryReading(s,Date.now());});if(result?.xpEarned&&ctx.active())window.BlitzFeedback.show({kind:'success',title:'You read “'+st.title+'”!',message:'+'+result.xpEarned+' XP for reading. Now answer '+words+' questions.',actions:[{label:'Let’s go'}]});}));
        panel.append(nav);
      }else{
        const q=A.storyQuestion(s);panel.append(heading('Question '+(r.index+1)+' of '+st.questions.length,'What happened?'));
        panel.append(tappableText(q.prompt,'storyQuestion'));
        const choices=el('div','storyAnswers');choices.setAttribute('role','group');choices.setAttribute('aria-label',q.prompt);
        r.orders[r.index].forEach(id=>{const o=q.options.find(x=>x.id===id),b=button(ctx.dragonText(o.label),'searchAnswer storyAnswer'+(r.selection===id?' selected':''),()=>{if(!b.isConnected||!ctx.active())return;act(()=>A.chooseStory(s,id,q.id));});b.dataset.storyChoice=id;b.setAttribute('aria-pressed',String(r.selection===id));choices.append(b);});panel.append(choices);
        const actions=el('div','storyNav'),submit=button('Check my answer','greenButton',()=>{if(!submit.isConnected||!ctx.active())return;let result;act(()=>{result=Core.checkStory(s,Date.now(),q.id);});if(ctx.active())storyFeedback(result,q);});submit.disabled=!r.selection||r.wrong;
        actions.append(submit,button('Listen to the question','textButton',()=>{if(ctx.active())sayStory(q.prompt,'q:'+q.id);}));panel.append(actions);
      }
      panel.append(button('Back to camp','textButton storyCamp',ctx.home));
      const picture=el('div','missionPicture');picture.append(scene);body.append(picture,panel);screen.append(body);stamp=performance.now();
    }
    function renderSearch(screen,s,c,m){
      const map=A.Maps[m.id],q=A.mapQuestion(s),p=c.search;if(!map||!q){ctx.home();return;}
      const top=el('div','missionTop');renderProgress(top);screen.append(top);
      const wrap=el('div','questSearch'),head=el('header','searchHead');
      head.append(el('div','',m.name+' · Map question '+(p.index+1)+' of 3'),el('strong','questHearts','♥ '+c.hearts+' / '+c.maxHearts+' lives'));wrap.append(head);
      const layout=el('div','mapPlayLayout'),host=el('div','questMapViewer');layout.append(host);wrap.append(layout);
      const panel=el('section','searchReading parchment');panel.tabIndex=-1;panel.append(el('p','searchRegion',q.region),el('h1','',q.prompt));
      const lines=el('div','searchClue');q.text.forEach(line=>{const row=el('p','');line.split(/(\s+)/).forEach(word=>{if(/^\s+$/.test(word)){row.append(document.createTextNode(word));return;}const b=button(word,'searchWord',()=>{if(!ctx.active())return;p.listened=true;if(ctx.save())ctx.speak(word);});b.setAttribute('aria-label','Hear '+word);row.append(b);});lines.append(row);});panel.append(lines);
      const choices=el('div','searchAnswers');choices.setAttribute('role','group');choices.setAttribute('aria-label',q.prompt);
      q.options.forEach(option=>{const b=button(option.label,'searchAnswer'+(p.selection===option.id?' selected':''),()=>{if(!b.isConnected||!ctx.active())return;act(()=>A.chooseMap(s,option.id,q.id));});b.dataset.mapChoice=option.id;b.setAttribute('aria-pressed',String(p.selection===option.id));choices.append(b);});panel.append(choices);
      const feedback=el('p','searchFeedback',p.wrong?'Not quite. −1 life. Check every part of the clue before trying again.':p.index?'Good searching! Keep using this map for the next clue.':'Zoom in to check the small details. Choose only from the written answers.');feedback.setAttribute('role','status');panel.append(feedback);
      if(p.hint)panel.append(el('p','searchHint',q.hint));
      const actions=el('div','searchActions'),submit=button('Check my answer','greenButton',()=>{if(!submit.isConnected||!ctx.active()||!mapViewer?.ready())return;let result;act(()=>{result=Core.checkMap(s,Date.now(),q.id);});if(ctx.active())puzzleFeedback(result,q,true);});submit.disabled=!p.selection||p.wrong;
      actions.append(submit,button('A clue, please','textButton',()=>act(()=>{p.hint=true;})),button('Listen','textButton',()=>{if(!ctx.active())return;timeTap();p.listened=true;if(ctx.save())ctx.speak(q.text.join(' ')+' '+q.prompt);}),button('Back to camp','textButton',ctx.home));panel.append(actions);layout.append(panel);screen.append(wrap);
      mapViewer=window.BlitzMapViewer.mount(host,map.image,map.title,mapCameraId===m.id?mapCamera:null);mapCameraId=m.id;mapViewer.setClue(q.text,q.prompt,panel);
      stamp=performance.now();
    }
    function renderResult(){
      const s=ctx.state(),e=A.of(s),m=A.current(s),r=s.result,c=e.current;if(!r?.missionId||!m)return false;
      if(m.stories){const reading=c.phase==='story';
        $('#resultMessage').textContent=r.victory?(r.newDiscovery?'New creature discovered! ':'')+(reading?'Now read the story!':'On to the next fight!'):'No hearts left. Try this fight again with four hearts. Your XP stays safe.';
        $('#checkpoint').textContent='';const box=$('#opponents');box.replaceChildren();box.classList.add('missionResultActions');
        box.append(button(r.victory?(reading?'Read the story':'Next fight'):'Try again · 4 hearts','greenButton',()=>{if(!ctx.active())return;if(!r.victory)Core.startMissionBattle(s,Date.now());else s.activity='mission';if(ctx.save())ctx.enter();}));
        const family=A.companion(s),friend=$('#resultCompanion');friend.hidden=!family;if(family)ctx.paintEnemy(friend,family,8);
        $('#resultNext').textContent='Back to camp';return true;
      }
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
      const top=el('div','bookTop');top.append(button('← '+(bookReturn==='mission'?'Back to mission':'Back to camp'),'secondaryButton',()=>bookReturn==='mission'?ctx.enter():ctx.home()),el('span','bookCount',report.seen+' / '+Content.creatures.length+' discovered'));screen.append(top);
      screen.append(heading('Your animal friends','Creature Book','Your team friend stops one hit each quest. Accurate reading can call a shield friend, too.'));
      const legend=el('div','bookLegend');for(const text of ['◆ Met: meet this friend','✦ Clue: solve its clue','★ Star: win its big fight'])legend.append(el('span','',text));screen.append(legend);
      const upcoming=Content.newEnemies.filter(enemy=>!A.findMission(enemy.id)).length;
      if(upcoming)screen.append(el('p','bookHint',upcoming+' more friends are waiting for future chapters.'));
      const layout=el('div','bookLayout'),grid=el('div','creatureGrid');
      Content.creatures.forEach((enemy,i)=>{const entry=e.book[enemy.id],b=button('','creatureTile'+(!entry?.seen?' unseen':'')+(selectedCreature===enemy.id?' selected':''),()=>{selectedCreature=enemy.id;renderBook();$('#creatureDetail').scrollIntoView?.({block:'nearest'});});b.dataset.family=enemy.id;b.setAttribute('aria-label',entry?.seen?enemy.name:'Unknown creature '+(i+1));
        const art=el('span','sceneSprite');ctx.paintEnemy(art,enemy.id,8);art.setAttribute('aria-hidden','true');b.append(el('small','creatureNumber',String(i+1).padStart(2,'0')),art,el('strong','',entry?.seen?enemy.name:'???'));
        const stamps=el('span','creatureStamps');for(const [field,label,symbol] of [['seen','Met','◆'],['studied','Clue','✦'],['champion','Star','★']]){const stamp=el('span',entry?.[field]?'earned':'',symbol+' '+label);stamp.setAttribute('aria-label',label+(entry?.[field]?': earned':': not yet'));stamps.append(stamp);}b.append(stamps);grid.append(b);
      });layout.append(grid);
      const detail=el('aside','creatureDetail parchment');detail.id='creatureDetail';
      if(selectedCreature){const enemy=Content.enemyAt(selectedCreature),entry=e.book[selectedCreature],m=A.findMission(selectedCreature),lore=D.lore[selectedCreature];
        const art=el('div','detailCreature sceneSprite'+(!entry?.seen?' undiscovered':''));ctx.paintEnemy(art,selectedCreature,8);detail.append(art,el('h2','',entry?.seen?enemy.name:'Who is hiding here?'),el('p','',entry?.studied?lore[1]:lore[0]));
        detail.append(el('p','creatureWhere',m?'Find this friend: '+m.name:'A future chapter will reveal this friend.'));
        detail.append(button('Listen','textButton',()=>ctx.speak(entry?.studied?lore[1]:lore[0])));
        if(entry?.seen)detail.append(button('Hear name','textButton',()=>ctx.speak(enemy.name)));
        const stamps=el('ul','bookStampList');for(const [field,label] of [['seen','Met this friend'],['studied','Solved its clue'],['champion','Won its big fight']])stamps.append(el('li',entry?.[field]?'earned':'',(entry?.[field]?'✓ ':'○ ')+label));detail.append(stamps);
        if(!entry?.studied)detail.append(el('p','bookHint','Finish a clue with this creature to learn its secret.'));
        if(!entry?.champion)detail.append(el('p','bookHint','Win its big fight to earn the star.'));
        if(entry?.seen&&A.supportChoices(s).includes(selectedCreature))detail.append(button(e.supportFavourite===selectedCreature?'Shield friend ✓':'Choose as shield friend','secondaryButton',()=>{if(A.selectSupport(s,selectedCreature)&&ctx.save())renderBook();}));
        if(entry?.seen){const favourite=button(e.favourite===selectedCreature?'On your team ✓':'Choose for my team','secondaryButton',()=>{if(A.selectCompanion(s,selectedCreature)&&ctx.save())renderBook();});detail.append(favourite);}
        if(m)detail.append(button('Find this path','textButton',()=>{e.selectedCampaign=m.campaign;if(!ctx.save())return;ctx.home();const card=$('#adventureHub [data-mission="'+m.id+'"]');card?.classList.add('creatureTarget');card?.scrollIntoView?.({block:'center'});}));
      }else {detail.append(el('h2','','Every friend has a secret'),el('p','','Tap a page to see its clues. A dark shape means there is someone new to find.'));}
      layout.append(detail);screen.append(layout);
    }
    return {renderHub,renderMission,renderResult,openBook,renderBook,timeTap,stopTiming,icon,renderProgress,renderBattleTeam,chooseSupport};
  }
  root.BlitzAdventureUI={create};
})(typeof window==='object'?window:globalThis);
