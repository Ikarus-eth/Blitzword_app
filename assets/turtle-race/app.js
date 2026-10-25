/* Turtle Race UI. Independent local stats; never reads or writes the main BlitzWord save. */
(function(){
  'use strict';
  const Core=window.TurtleRaceCore,Data=window.TurtleRaceData;
  const $=s=>document.querySelector(s);
  const ROOT='../../';
  const INFO={
    dash:{title:'Turtle Dash',tag:'Read and answer',how:'Read the sentence. Then tap the answer. Right answers move Pip forward. Wrong answers move him back.',icon:'🏁'},
    flash:{title:'Flash Dash',tag:'Quick look, find the sentence',how:'The sentence shows for a moment. Then tap the sentence you read. Fast answers give Pip a blitz boost.',icon:'⚡'},
    duel:{title:'Shell Duel',tag:'Yes or no, beat the timer',how:'Read, then tap yes or no before the timer runs out. Fast right answers hit the turtle. Slow or wrong answers cost a heart.',icon:'🔥'}
  };
  const items=Data.items.filter(Core.validateItem);

  // ---------- saved stats (own key only) ----------
  let profile=load();
  function load(){try{return Core.normalizeProfile(JSON.parse(localStorage.getItem(Core.STORAGE_KEY)));}catch(e){return Core.defaultProfile();}}
  function store(){try{localStorage.setItem(Core.STORAGE_KEY,JSON.stringify(profile));}catch(e){}}

  // ---------- audio: recorded clips via Web Audio, synthesized effects ----------
  const Sound={
    ctx:null,buffers:new Map(),voice:null,
    unlock(){
      try{
        if(!this.ctx){const C=window.AudioContext||window.webkitAudioContext;if(!C)return;this.ctx=new C();}
        if(this.ctx.state==='suspended')this.ctx.resume();
        const b=this.ctx.createBuffer(1,1,22050),s=this.ctx.createBufferSource();s.buffer=b;s.connect(this.ctx.destination);s.start(0);
      }catch(e){}
    },
    load(file){
      if(!this.ctx)return Promise.reject(Error('no audio'));
      if(!this.buffers.has(file))this.buffers.set(file,fetch(ROOT+file).then(r=>{if(!r.ok)throw Error('audio '+r.status);return r.arrayBuffer();}).then(a=>new Promise((ok,no)=>this.ctx.decodeAudioData(a,ok,no))).catch(e=>{this.buffers.delete(file);throw e;}));
      return this.buffers.get(file);
    },
    // One spoken line at a time; a new line replaces the previous one.
    play(clip){
      if(!clip||!this.ctx)return Promise.resolve();
      return this.load(clip.file).then(buf=>{
        this.stopVoice();
        const src=this.ctx.createBufferSource();src.buffer=buf;src.connect(this.ctx.destination);
        const offset=clip.offset||0,dur=Math.min(clip.duration||buf.duration,buf.duration-offset);
        src.start(0,offset,dur);this.voice=src;
        return new Promise(done=>{src.onended=()=>{if(this.voice===src)this.voice=null;done();};});
      }).catch(()=>{});
    },
    stopVoice(){if(this.voice){try{this.voice.onended=null;this.voice.stop();}catch(e){}this.voice=null;}},
    line(key){return this.play(Data.voice[key]);},
    preload(keys){for(const k of keys){const c=Data.voice[k];if(c)this.load(c.file).catch(()=>{});}},
    tone(freqs,dur=.12,type='triangle',gain=.18){
      if(!this.ctx)return;
      try{
        let t=this.ctx.currentTime;
        for(const f of freqs){const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=type;o.frequency.setValueAtTime(f,t);g.gain.setValueAtTime(gain,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);o.connect(g);g.connect(this.ctx.destination);o.start(t);o.stop(t+dur);t+=dur*.8;}
      }catch(e){}
    },
    right(){this.tone([660,880],.11);},
    wrong(){this.tone([220,165],.16,'sawtooth',.08);},
    boost(){this.tone([523,659,784,1047],.07,'square',.07);},
    tick(){this.tone([1200],.04,'sine',.06);}
  };

  // ---------- screens ----------
  const screens=['pick','intro','play','result'];
  function show(id){for(const s of screens)$('#'+s).hidden=s!==id;}

  function renderPick(){
    const cards=$('#cards');cards.innerHTML='';
    for(const mode of Core.MODES){
      const info=INFO[mode],g=profile.games[mode];
      const b=document.createElement('button');b.type='button';b.className='card card-'+mode;
      const q=profile.progress[mode];
      b.innerHTML=`<span class="cardArt">${art(mode,true)}</span><span class="cardText"><strong>${info.title}</strong><small>${info.tag}</small><span class="cardStars" aria-label="${stars(q)} of ${Core.LEVEL_COUNT} turtles beaten">${starRow(q)}</span></span>`;
      b.onclick=()=>{Sound.unlock();openIntro(mode);};
      cards.append(b);
    }
    renderParents();
  }
  const stars=q=>q.wins.filter(w=>w>0).length;
  const starRow=q=>q.wins.map(w=>`<i class="${w>0?'on':''}">★</i>`).join('');
  function art(mode,small){
    const cls=small?'mini':'';
    if(mode==='duel')return `<span class="artDuel ${cls}"><img src="pip.webp" alt=""><span class="artVs">${INFO.duel.icon}</span><img class="flip" src="turtle.webp" alt=""></span>`;
    return `<span class="artRace ${cls}"><img src="pip.webp" alt=""><img src="turtle.webp" alt=""><span class="artFlag">${INFO[mode].icon}</span></span>`;
  }
  function renderParents(){
    const rows=Core.summary(profile).map(r=>`<tr><th>${INFO[r.mode].title}</th><td>${r.started}</td><td>${r.finished}</td><td>${r.quit}</td><td>${r.wins}</td><td>${r.accuracy==null?'–':r.accuracy+'%'}</td><td>${r.avgSeconds==null?'–':r.avgSeconds+' s'}</td><td>${r.lastPlayed?new Date(r.lastPlayed).toLocaleString([], {day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}):'–'}</td></tr>`).join('');
    const levels=Core.summary(profile).map(r=>`${INFO[r.mode].title}: level ${r.unlocked} of ${Core.LEVEL_COUNT} open · wins per level ${r.levelWins.join(' / ')} · races per level ${r.levelPlays.join(' / ')}`).join('<br>');
    const today=profile.time.days[Core.dayKey(Date.now())]||0,mins=ms=>Math.floor(ms/60000)+' min '+String(Math.floor(ms/1000)%60).padStart(2,'0')+' sec';
    $('#parentStats').innerHTML=`<p>Race reading time: today ${mins(today)} · total ${mins(Core.totalTime(profile))}. It also counts in active play on the main Parents dashboard.</p><p>Which race does he pick and finish? Started minus finished shows races he left early. Stats stay on this device and are separate from the main game save.</p><div class="tableWrap"><table><thead><tr><th>Race</th><th>Started</th><th>Finished</th><th>Left early</th><th>Won</th><th>Right</th><th>Avg answer</th><th>Last played</th></tr></thead><tbody>${rows}</tbody></table></div><p>${levels}</p><p>Each race has five turtles. Winning against the hardest open turtle opens the next one; he chooses which open turtle to race. Levels 1–2 use sentences of up to five words, level 3 up to six, levels 4–5 all.</p>`;
  }

  let currentMode='dash';
  function openIntro(mode){
    currentMode=mode;const info=INFO[mode];
    $('#introTitle').textContent=info.title;$('#introHow').textContent=info.how;$('#introArt').innerHTML=art(mode);
    renderLevels();
    show('intro');
    Sound.preload(['go','boost','great','slow','hit','race-win','race-lose','duel-win','duel-lose','time']);
    Sound.line('title-'+mode).then(()=>{if(!$('#intro').hidden&&currentMode===mode)Sound.line('how-'+mode);});
  }
  function renderLevels(){
    const mode=currentMode,q=profile.progress[mode],box=$('#levels');box.innerHTML='';
    for(let n=1;n<=Core.LEVEL_COUNT;n++){
      const open=n<=q.unlocked,won=q.wins[n-1]>0,b=document.createElement('button');
      b.type='button';b.className='levelButton'+(n===q.selected?' selected':'')+(open?'':' locked')+(won?' won':'');b.disabled=!open;
      b.setAttribute('aria-pressed',String(n===q.selected));b.dataset.level=n;
      b.innerHTML=`<span class="levelNum">${open?n:'🔒'}</span><span class="levelText"><strong>${Core.NAMES[n-1]}</strong><small>${open?Core.describeLevel(mode,n):'Beat the '+Core.NAMES[n-2]+' to open'}</small></span><span class="levelStar" aria-label="${won?'beaten':'not beaten yet'}">${won?'★':''}</span>`;
      b.onclick=()=>{Sound.unlock();if(Core.selectLevel(profile,mode,n)){store();renderLevels();Sound.tick();}};
      box.append(b);
    }
    $('#introStart').textContent='Race the '+Core.NAMES[q.selected-1];
  }
  $('#introListen').onclick=()=>{Sound.unlock();Sound.line('how-'+currentMode);};
  $('#introStart').onclick=()=>{Sound.unlock();startRun(currentMode);};
  for(const b of document.querySelectorAll('[data-back]'))b.onclick=()=>{stopRun();Sound.stopVoice();renderPick();show('pick');};
  $('#resultAgain').onclick=()=>{Sound.unlock();startRun(currentMode);};
  $('#resultOther').onclick=()=>{Sound.stopVoice();renderPick();show('pick');};

  // ---------- run loop ----------
  let run=null,deck=null,question=null,phase='idle',shownAt=0,phaseEnd=0,raf=0,last=0,lastYes=[],lastCallout={},token=0;
  // Credit race time as it happens, so leaving or closing mid-race still counts.
  function flushTime(r=run){if(!r)return;const d=r.elapsed-(r.loggedMs||0);if(d>0){Core.addTime(profile,d,Date.now());r.loggedMs=r.elapsed;store();}}
  function stopRun(){flushTime();token++;cancelAnimationFrame(raf);raf=0;run=null;phase='idle';$('#countdown').hidden=true;}

  function startRun(mode){
    stopRun();const my=token;
    currentMode=mode;run=Core.newRun(mode,profile);deck=Core.createDeck(Core.itemsForLevel(items,mode,run.level),Math.random);lastYes=[];lastCallout={};
    profile=Core.recordStart(profile,mode,new Date().toISOString());store();
    $('#playTitle').textContent=INFO[mode].title+' · '+run.levelName;
    buildStage();clearReader();updateClock();show('play');
    const cd=$('#countdown');cd.hidden=false;
    const steps=['3','2','1','Go!'];let i=0;
    Sound.line('go');
    const next=()=>{if(my!==token)return;if(i<steps.length){cd.textContent=steps[i];cd.classList.remove('pop');void cd.offsetWidth;cd.classList.add('pop');i===steps.length-1?Sound.tone([880],.15):Sound.tick();i++;setTimeout(next,i===steps.length?500:600);}else{cd.hidden=true;begin();}};
    next();
  }
  function begin(){last=performance.now();nextQuestion();raf=requestAnimationFrame(frame);}

  // The game clock advances only while frames run, so a hidden page pauses the race.
  function frame(now){
    if(!run)return;
    const dt=Math.min(250,Math.max(0,now-last));last=now;
    const before=run.elapsed;Core.tick(run,run.elapsed+dt);
    if(Math.ceil((Core.GAME_MS-run.elapsed)/1000)<=5&&Math.ceil((Core.GAME_MS-before)/1000)!==Math.ceil((Core.GAME_MS-run.elapsed)/1000))Sound.tick();
    updateClock();drawTurtle();
    if(run.over&&phase!=='end'){endRun();return;}
    if(phase==='flash'&&run.elapsed>=phaseEnd)showChoices();
    else if(phase==='choose'&&run.mode==='duel'){
      const left=Math.max(0,shownAt+run.timerMs-run.elapsed);
      $('#duelTimer span').style.transform=`scaleX(${left/run.timerMs})`;
      $('#duelTimer').classList.toggle('low',left<1500);
      if(left<=0)choose(-1);
    }else if(phase==='feedback'&&run.elapsed>=phaseEnd){if(run.over)endRun();else nextQuestion();}
    if(run&&!run.over||phase==='feedback')raf=requestAnimationFrame(frame);
  }

  function updateClock(){
    const left=run?Math.max(0,Core.GAME_MS-run.elapsed):Core.GAME_MS;
    $('#clockText').textContent=Math.ceil(left/1000);
    $('#clockArc').style.strokeDashoffset=String(119.4*(1-left/Core.GAME_MS));
    $('#clock').classList.toggle('low',left<=10000);
  }

  function clearReader(){$('#sentence').textContent='';$('#prompt').textContent='';$('#options').innerHTML='';$('#duelTimer').hidden=true;$('#reader').className='reader';}

  function nextQuestion(){
    if(!run||run.over)return;
    question=Core.buildQuestion(run.mode,deck.next(),Math.random,lastYes);
    if(question.mode==='duel')lastYes.push(question.yes);
    question.item=items.find(i=>i.s===question.sentence);
    clearReader();
    $('#sentence').textContent=question.sentence;
    if(run.mode==='flash'){
      $('#reader').classList.add('flashing');phase='flash';phaseEnd=run.elapsed+run.flashMs;
      $('#prompt').textContent='Read it fast!';
    }else showChoices();
  }
  function showChoices(){
    const box=$('#options');box.innerHTML='';
    if(run.mode==='flash'){$('#reader').classList.remove('flashing');$('#reader').classList.add('hiddenSentence');$('#sentence').textContent='✦ ✦ ✦';}
    $('#prompt').textContent=question.prompt;
    box.className='options options-'+run.mode;
    question.options.forEach((text,i)=>{
      const b=document.createElement('button');b.type='button';b.className='option'+(run.mode==='duel'?(i===0?' yes':' no'):'');b.textContent=text;
      b.onpointerdown=e=>{e.preventDefault();choose(i);};b.onclick=()=>choose(i);
      box.append(b);
    });
    if(run.mode==='duel'){$('#duelTimer').hidden=false;$('#duelTimer span').style.transform='scaleX(1)';}
    phase='choose';shownAt=run.elapsed;
  }

  function choose(i){
    if(phase!=='choose'||!run)return;
    phase='feedback';
    const timedOut=i<0,correct=!timedOut&&i===question.answer,ms=run.elapsed-shownAt;
    const out=Core.answer(run,timedOut?null:correct,ms);
    const buttons=[...$('#options').children];
    buttons.forEach((b,j)=>{b.disabled=true;if(j===question.answer)b.classList.add('right');else if(j===i)b.classList.add('wrong');});
    if(run.mode==='flash'){$('#sentence').textContent=question.sentence;$('#reader').classList.remove('hiddenSentence');}
    $('#duelTimer').hidden=true;
    if(correct){
      Sound.right();
      if(out.boost){Sound.boost();callout('Blitz boost!','boost');sayOnce('boost',3500);}
      else if(run.streak>0&&run.streak%3===0){callout('Great reading!','great');sayOnce('great',8000);}
      phaseEnd=run.elapsed+(run.over?900:650);
    }else{
      Sound.wrong();
      if(timedOut){callout('Too slow!','slow');sayOnce('slow',0);}
      else callout('Oops!','oops');
      // Hear the sentence once as a quick correction (skipped for the "too slow" line).
      if(!timedOut&&question.item)Sound.play(question.item.audio);
      phaseEnd=run.elapsed+1600;
    }
    animate(out);
  }
  function sayOnce(key,gapMs){const now=performance.now();if(lastCallout[key]&&now-lastCallout[key]<gapMs)return;lastCallout[key]=now;Sound.line(key);}
  function callout(text,kind){const c=$('#callout');c.textContent=text;c.className='callout '+kind;void c.offsetWidth;c.classList.add('show');}

  // ---------- stage ----------
  function buildStage(){
    const st=$('#stage');st.className='stage stage-'+run.mode;
    if(run.mode==='duel'){
      st.innerHTML=`<div class="arena"><div class="fighter pipSide"><div id="hearts" class="hearts"></div><img id="pipSprite" class="sprite" src="pip.webp" alt="Pip"></div><div class="fighter turtleSide"><div id="shells" class="shells"></div><img id="turtleSprite" class="sprite flip" src="turtle.webp" alt="Turtle"></div><div id="fx" class="fx"></div></div>`;
      drawDuel();
    }else{
      const marks=Array.from({length:run.goal-1},(_,i)=>`<i style="left:calc(var(--start) + (100% - var(--start) - var(--lane-pad)) * ${(i+1)/run.goal})"></i>`).join('');
      st.innerHTML=`<div class="track"><div class="startLine" aria-hidden="true"></div><div class="finish" aria-hidden="true"></div><div class="lane laneTop"><div class="marks">${marks}</div><img id="pipSprite" class="runner pipRunner" src="pip.webp" alt="Pip"></div><div class="lane laneBottom"><img id="turtleSprite" class="runner turtleRunner" src="turtle.webp" alt="Turtle"></div><div id="stepsLabel" class="stepsLabel"></div></div>`;
      drawPip();
    }
    drawTurtle();
  }
  function drawPip(){const p=$('#pipSprite');if(!p||run.mode==='duel')return;p.style.setProperty('--p',Core.pipProgress(run));$('#stepsLabel').textContent=`${run.steps} / ${run.goal}`;}
  function drawTurtle(){if(!run||run.mode==='duel')return;const t=$('#turtleSprite');if(t)t.style.setProperty('--p',Core.turtleProgress(run));}
  function drawDuel(r=run){
    if(!r||!$('#hearts'))return;
    $('#hearts').innerHTML=Array.from({length:r.maxHearts},(_,i)=>`<span class="heart${i<r.hearts?'':' lost'}">♥</span>`).join('');
    $('#shells').innerHTML=Array.from({length:r.maxShell},(_,i)=>`<span class="shell${i<r.shell?'':' lost'}"></span>`).join('');
  }
  function bump(el,cls){if(!el)return;el.classList.remove(cls);void el.offsetWidth;el.classList.add(cls);}
  function animate(out){
    if(run.mode==='duel'){
      const fx=$('#fx'),shot=document.createElement('span');
      if(out.correct){shot.className='fireball';bump($('#pipSprite'),'lunge');setTimeout(()=>{bump($('#turtleSprite'),'hurt');Sound.tone([180,120],.12,'square',.06);},380);}
      else{shot.className='wave';bump($('#turtleSprite'),'lungeLeft');setTimeout(()=>bump($('#pipSprite'),'hurt'),380);}
      fx.append(shot);setTimeout(()=>shot.remove(),900);
      const r=run;setTimeout(()=>drawDuel(r),400);
    }else{
      const p=$('#pipSprite');drawPip();
      if(out.delta>0)bump(p,out.boost?'zoom':'hop');else if(!out.correct)bump(p,'slip');
    }
  }

  // ---------- end ----------
  function endRun(){
    if(!run||phase==='end')return;
    phase='end';cancelAnimationFrame(raf);
    const r=run,my=token;
    flushTime(r);const opened=Core.recordFinish(profile,r,new Date().toISOString());store();
    const duel=r.mode==='duel';
    const lineKey=r.won?(duel?'duel-win':'race-win'):(duel?'duel-lose':'race-lose');
    const finishLine=()=>{
      if(my!==token)return;
      $('#resultTitle').textContent=r.won?(duel?'Pip wins the duel!':'Pip wins the race!'):(duel?'The turtle wins the duel':'The turtle wins this time');
      $('#resultArt').src=r.won?'pip.webp':'turtle.webp';$('#resultArt').className='resultArt'+(r.won?' happy':'');
      const avg=r.answers?(r.answerMs/r.answers/1000).toFixed(1):'–';
      let line;
      if(duel)line=r.won?`The turtle's shell is empty. ${r.hearts} heart${r.hearts===1?'':'s'} left.`:(r.reason==='time'?`Time is up. The turtle had ${r.shell} shell${r.shell===1?'':'s'} left.`:`The turtle had ${r.shell} shell${r.shell===1?'':'s'} left.`);
      else line=r.won?`Pip crossed the line with ${Math.ceil((Core.GAME_MS-r.elapsed)/1000)} seconds to spare.`:`Pip got ${r.steps} of ${r.goal} steps.`;
      $('#resultLine').textContent=line;
      const q=profile.progress[r.mode];
      $('#resultUnlock').hidden=!opened;
      if(opened)$('#resultUnlock').textContent=`New turtle unlocked: ${Core.NAMES[opened-1]}!`;
      // Offer the next open turtle after a win, an easier one after a loss; he decides.
      const next=r.won&&r.level<q.unlocked?r.level+1:null,easier=!r.won&&r.level>1?r.level-1:null,target=next||easier;
      $('#resultNext').hidden=!target;
      if(target){$('#resultNext').textContent=(next?'Try the ':'Race the ')+Core.NAMES[target-1];$('#resultNext').onclick=()=>{Sound.unlock();Core.selectLevel(profile,r.mode,target);store();startRun(r.mode);};}
      $('#resultAgain').textContent=r.won?'Same turtle again':'Try again';
      $('#resultAgain').className=target?'ghostButton':'goButton';
      $('#resultStats').textContent=`${r.correct} right of ${r.answers} · ${avg} s per answer · best streak ${r.bestStreak}`;
      show('result');
      Sound.line(lineKey);
      if(opened)setTimeout(()=>Sound.tone([523,659,784,1047,1319],.12,'triangle',.14),300);
    };
    if(r.reason==='time'){callout('Time is up!','slow');Sound.line('time').then(()=>setTimeout(finishLine,200));}
    else setTimeout(finishLine,900);
    run=null;
  }

  document.addEventListener('visibilitychange',()=>{if(document.hidden)flushTime();else last=performance.now();});
  window.addEventListener('pagehide',()=>flushTime());
  renderPick();show('pick');
})();
