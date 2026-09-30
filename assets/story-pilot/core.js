(function(root,factory){const api=factory(typeof module==='object'&&module.exports?require('./stories'):root.BlitzStoryPilotContent);if(typeof module==='object'&&module.exports)module.exports=api;else root.BlitzStoryPilot=api;})(typeof globalThis!=='undefined'?globalThis:this,function(Content){
  'use strict';
  const KEY='blitzword_story_pilot_v2',copy=v=>JSON.parse(JSON.stringify(v));
  const getStory=id=>Content.stories.find(s=>s.id===id);
  const shuffled=(a,random=Math.random)=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.min(i,Math.max(0,Math.floor(random()*(i+1))));[b[i],b[j]]=[b[j],b[i]];}return b;};
  function newRun(story,random){return {choices:{},orders:Object.fromEntries(story.questions.map(q=>[q.id,q.fixedOrder?q.choices.map(c=>c.id):shuffled(q.choices.map(c=>c.id),random)])),checks:0,hints:[],revealed:false,complete:false};}
  function fresh(random){return {version:2,revision:0,activeId:Content.stories[0].id,stories:Object.fromEntries(Content.stories.map(s=>[s.id,{first:null,everComplete:false,replays:0,run:newRun(s,random)}]))};}
  const count=v=>Number.isSafeInteger(v)&&v>=0?v:0;
  function cleanChoices(story,v){const out={};for(const q of story.questions)if(q.choices.some(c=>c.id===v?.[q.id]))out[q.id]=v[q.id];return out;}
  function matches(story,choices){return Object.fromEntries(story.questions.map(q=>[q.id,choices[q.id]===q.answer]));}
  function restore(text,random){
    if(text===null||text===undefined)return fresh(random);
    let saved;try{saved=JSON.parse(text);}catch{throw new Error('The story save could not be read. It has been kept unchanged.');}
    if(!saved||saved.version!==2||typeof saved.stories!=='object'||!saved.stories)throw new Error('This story save is not supported. It has been kept unchanged.');
    const state=fresh(random);state.revision=count(saved.revision);if(getStory(saved.activeId))state.activeId=saved.activeId;
    for(const story of Content.stories){
      const old=saved.stories[story.id],entry=state.stories[story.id];if(!old||typeof old!=='object')continue;
      entry.replays=count(old.replays);entry.everComplete=old.everComplete===true;
      if(old.first){const choices=cleanChoices(story,old.first.choices);if(Object.keys(choices).length===story.questions.length)entry.first={choices,matches:matches(story,choices),hints:Array.isArray(old.first.hints)?old.first.hints.filter(id=>story.questions.some(q=>q.id===id)):[]};}
      const run=old.run;if(!run||typeof run!=='object')continue;
      entry.run.choices=cleanChoices(story,run.choices);entry.run.checks=count(run.checks);entry.run.hints=Array.isArray(run.hints)?[...new Set(run.hints.filter(id=>story.questions.some(q=>q.id===id)))]:[];
      entry.run.revealed=run.revealed===true;entry.run.complete=run.complete===true&&Object.values(matches(story,entry.run.choices)).every(Boolean);
      entry.everComplete=entry.everComplete||entry.run.complete;
      for(const q of story.questions){const ids=q.choices.map(c=>c.id),order=run.orders?.[q.id];if(!q.fixedOrder&&Array.isArray(order)&&order.length===ids.length&&new Set(order).size===ids.length&&order.every(id=>ids.includes(id)))entry.run.orders[q.id]=order;}
    }
    return state;
  }
  function active(state){const story=getStory(state.activeId);if(!story)throw new Error('Story not found.');return {story,entry:state.stories[story.id]};}
  function selectStory(state,id){if(!getStory(id))throw new Error('Story not found.');state.activeId=id;}
  function choose(state,qid,value){const {story,entry}=active(state),q=story.questions.find(q=>q.id===qid);if(entry.run.complete)throw new Error('Replay before making new choices.');if(!q||!q.choices.some(c=>c.id===value))throw new Error('Choose one of the pictures.');entry.run.choices[qid]=value;}
  function ready(state){const {story,entry}=active(state);return story.questions.every(q=>q.choices.some(c=>c.id===entry.run.choices[q.id]));}
  function check(state){
    const {story,entry}=active(state);if(entry.run.complete)return {complete:true,matches:matches(story,entry.run.choices)};
    if(!ready(state))throw new Error('Choose one picture in each row.');
    const matched=matches(story,entry.run.choices);entry.run.checks++;
    if(!entry.first)entry.first={choices:copy(entry.run.choices),matches:matched,hints:[...entry.run.hints]};
    entry.run.complete=Object.values(matched).every(Boolean);entry.everComplete=entry.everComplete||entry.run.complete;return {complete:entry.run.complete,matches:matched};
  }
  function hint(state,qid){const {story,entry}=active(state);if(entry.run.complete)return null;const q=qid?story.questions.find(q=>q.id===qid):story.questions.find(q=>entry.run.choices[q.id]!==q.answer);if(!q)return null;if(!entry.run.hints.includes(q.id))entry.run.hints.push(q.id);return q;}
  function reveal(state){const {story,entry}=active(state);if(entry.run.complete)return;if(!entry.run.checks)throw new Error('Try the puzzle first.');entry.run.choices=Object.fromEntries(story.questions.map(q=>[q.id,q.answer]));entry.run.revealed=true;entry.run.complete=true;entry.everComplete=true;}
  function replay(state,random){const {story,entry}=active(state);entry.replays++;entry.run=newRun(story,random);}
  function createStore(storage){
    let expected;
    return {load(){expected=storage.getItem(KEY);return restore(expected);},save(state){if(storage.getItem(KEY)!==expected){const e=new Error('Another tab changed your stories. Reload to keep that progress.');e.code='conflict';throw e;}const next=copy(state);next.revision=state.revision+1;const text=JSON.stringify(next);storage.setItem(KEY,text);expected=text;state.revision=next.revision;},changed(){return storage.getItem(KEY)!==expected;}};
  }
  return {KEY,fresh,restore,active,selectStory,choose,ready,check,hint,reveal,replay,createStore};
});
