(() => {
  'use strict';
  const Content=window.BlitzStoryPilotContent,Core=window.BlitzStoryPilot,$=id=>document.getElementById(id);
  let store,state,blocked=false;
  function storageProblem(error){blocked=true;$('save-warning').hidden=false;$('save-message').textContent=error.code==='conflict'?error.message:'Story progress could not be saved or opened. Your game progress is unchanged. '+error.message;document.querySelectorAll('button:not(#reload)').forEach(b=>b.disabled=true);}
  try{store=Core.createStore(window.localStorage);state=store.load();}catch(error){state=Core.fresh();storageProblem(error);}
  function persist(){try{store.save(state);return true;}catch(error){storageProblem(error);return false;}}
  function active(){return Core.active(state);}
  function el(tag,className,text){const e=document.createElement(tag);if(className)e.className=className;if(text!==undefined)e.textContent=text;return e;}
  function symbol(name,colour){const img=el('span','symbol');img.setAttribute('aria-hidden','true');img.style.setProperty('--symbol',`url("assets/${name}.svg")`);if(colour)img.classList.add('colour-'+colour);return img;}
  function art(choice){
    const holder=el('span',choice.repeat?'apple-cluster':choice.marked?'marked-object':'object-picture');holder.setAttribute('aria-hidden','true');
    if(choice.marked){holder.append(symbol('chest'),symbol(choice.icon));}
    else if(choice.number!==undefined){if(choice.icon)holder.append(symbol(choice.icon));holder.append(el('strong','choice-number',String(choice.number)));}
    else for(let i=0;i<(choice.repeat||1);i++)holder.append(symbol(choice.icon,choice.colour||undefined));
    return holder;
  }
  function message(text,isHint=false){$('feedback').textContent=text;$('feedback').classList.toggle('hint',isHint);}
  function clearClues(){document.querySelectorAll('.clue').forEach(p=>p.classList.remove('clue'));}
  function renderNav(){
    $('story-nav').replaceChildren(...Content.stories.map((s,i)=>{
      const button=el('button','story-tab');button.type='button';button.setAttribute('aria-current',s.id===state.activeId?'page':'false');button.setAttribute('aria-label',`${i+1}. ${s.title}${state.stories[s.id].everComplete?' — stop completed':''}`);
      button.append(el('span','story-index',String(i+1)),el('span','story-short',s.shortTitle));if(state.stories[s.id].everComplete)button.append(el('span','finished-mark','✓'));
      button.onclick=()=>navigate(s.id);return button;
    }));
    $('progress').textContent=`${Content.stories.filter(s=>state.stories[s.id].everComplete).length} of 5 stops`;
  }
  function renderArrangement(story){
    const a=story.arrangement;if(!a)return null;
    const block=el('div','arrangement '+a.kind);block.id='story-arrangement';block.setAttribute('role','group');block.setAttribute('aria-label',a.label);
    a.marks.forEach((mark,i)=>{const tile=el('div','arrangement-tile');tile.append(symbol(mark),el('strong',null,mark[0].toUpperCase()+mark.slice(1)+(a.signs?' door':'')));if(a.signs)tile.append(el('p',null,'“'+a.signs[i]+'”'));block.append(tile);});return block;
  }
  function renderReport(){
    $('report').replaceChildren(...Content.stories.map(story=>{
      const entry=state.stories[story.id],first=entry.first,section=el('div','story-report');section.append(el('strong',null,story.title));
      const score=first?Object.values(first.matches).filter(Boolean).length:0;
      const detail=first?`First check: ${score} of ${story.questions.length} choices matched. Hints before that check: ${first.hints.length}.`:'No first check yet.';
      section.append(el('p',null,detail+` Replays: ${entry.replays}.`+(entry.run.revealed?' Current ending shown with help.':entry.run.complete?' Current ending reached.':'')));return section;
    }));
  }
  function updateChoices(){
    const {story,entry}=active();
    document.querySelectorAll('.choice').forEach(b=>b.setAttribute('aria-pressed',String(entry.run.choices[b.dataset.question]===b.dataset.value)));
    $('submit').disabled=blocked||!Core.ready(state);$('show').hidden=!entry.run.checks;
    $('puzzle').hidden=entry.run.complete;$('ending').hidden=!entry.run.complete;
    const index=Content.stories.indexOf(story);$('next').hidden=index===Content.stories.length-1;$('all-done').hidden=index!==Content.stories.length-1;
    renderNav();renderReport();if(blocked)document.querySelectorAll('button:not(#reload)').forEach(b=>b.disabled=true);
  }
  function render(){
    const {story,entry}=active(),index=Content.stories.indexOf(story);
    document.title=story.title+' · Artus & Pip';$('story-title').textContent=story.title;$('story-level').textContent=`Stop ${index+1} · ${story.level}`;$('page-number').textContent=String(index+1).padStart(2,'0');
    $('scene-clues').replaceChildren();$('scene-clues').hidden=story.arrangement?.placement!=='scene';
    const paragraphs=[];story.paragraphs.forEach((text,i)=>{const p=el('p',null,text);p.id='clue-'+i;paragraphs.push(p);if(story.arrangement?.after===i&&story.arrangement.placement!=='scene')paragraphs.push(renderArrangement(story));});$('story-text').replaceChildren(...paragraphs);
    if(story.arrangement?.placement==='scene')$('scene-clues').append(el('p','signs-heading','The signs on the doors · left to right'),renderArrangement(story));
    $('scene-image').src=story.scene;$('scene-image').alt=story.sceneLabel;$('scene-caption').textContent=`${index+1} / 5 · The fox cub rescue`;
    $('questions').replaceChildren(...story.questions.map(q=>{
      const field=el('fieldset');field.append(el('legend',null,q.prompt));const choices=el('div','choices count-'+q.choices.length);
      for(const id of entry.run.orders[q.id]){const c=q.choices.find(c=>c.id===id),button=el('button','choice');button.type='button';button.dataset.question=q.id;button.dataset.value=c.id;button.setAttribute('aria-label',c.label);button.append(art(c));if(c.number===undefined||c.label!==String(c.number))button.append(el('span',null,c.label));
        button.onclick=()=>{if(blocked)return;Core.choose(state,q.id,c.id);clearClues();message(Core.ready(state)?'Ready? You can reread before you go.':'Choose one picture in each row.');persist();updateChoices();};choices.append(button);
      }field.append(choices);return field;
    }));
    $('submit').textContent=index===4?'Rescue the cub!':'Ready!';$('next').textContent=story.nextLabel||'Next stop';
    $('ending-title').textContent=story.endingTitle;$('ending-text').textContent=story.ending;$('ending-picture').src=story.endingImage;$('ending-picture').hidden=story.endingImage===story.scene;$('ending-picture').alt=story.endingAlt;
    $('explanations').replaceChildren(...story.questions.map(q=>el('li',null,q.explanation)));document.querySelector('.answer-explanations').open=entry.run.revealed;
    message(entry.run.checks&&!entry.run.complete?'Something needs another look. Reread the story, or try a hint.':Core.ready(state)?'Ready? You can reread before you go.':'Choose one picture in each row.');
    updateChoices();
  }
  function navigate(id){if(blocked)return;Core.selectStory(state,id);persist();render();$('storybook').scrollIntoView?.({block:'start',behavior:'auto'});}
  function finish(){clearClues();updateChoices();$('ending-title').focus?.({preventScroll:true});$('ending').scrollIntoView?.({block:'start',behavior:'auto'});}
  function check(){if(blocked)return;const result=Core.check(state);persist();if(result.complete)finish();else{message('Something needs another look. Reread the story, or try a hint.');updateChoices();}}
  function giveHint(){
    if(blocked)return;const q=Core.hint(state);if(!q)return;clearClues();q.clues.forEach(i=>$('clue-'+i).classList.add('clue'));
    if(active().story.arrangement&&q.clues.includes(active().story.arrangement.after))$('story-arrangement').classList.add('clue');
    message(q.hint,true);persist();renderReport();
    if(window.innerWidth<=700)$('clue-'+q.clues[0]).scrollIntoView?.({block:'center',behavior:'auto'});
  }
  $('submit').onclick=check;$('hint').onclick=giveHint;$('show').onclick=()=>{if(blocked)return;Core.reveal(state);persist();document.querySelector('.answer-explanations').open=true;finish();};
  $('replay').onclick=()=>{if(blocked)return;Core.replay(state);persist();render();$('storybook').scrollIntoView?.({block:'start',behavior:'auto'});};
  $('next').onclick=()=>{const index=Content.stories.indexOf(active().story);if(Content.stories[index+1])navigate(Content.stories[index+1].id);};
  $('reload').onclick=()=>window.location.reload();
  function checkExternalSave(){if(blocked||!store)return;try{if(store.changed())storageProblem(Object.assign(new Error('Another tab changed your stories. Reload to keep that progress.'),{code:'conflict'}));}catch(error){storageProblem(error);}}
  window.addEventListener('storage',event=>{if(event.key===Core.KEY||event.key===null)checkExternalSave();});
  window.addEventListener('pageshow',event=>{if(event.persisted)checkExternalSave();});
  render();
})();
