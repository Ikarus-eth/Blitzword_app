(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  else { root.BlitzNarrationQA=api; api.mount(document); }
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const STORE_KEY='blitzword_narration_qa_v1';
  const SAMPLES=[
    {id:'en-male-001',group:'Existing Tom word',method:'Earlier standalone recording',text:'on',file:'assets/narration/en-male-001.mp3'},
    {id:'en-male-037',group:'Existing Tom word',method:'Earlier standalone recording',text:'ship',file:'assets/narration/en-male-037.mp3'},
    {id:'en-male-048',group:'Existing Tom word',method:'Earlier standalone recording',text:'creature',file:'assets/narration/en-male-048.mp3'},
    {id:'en-male-002',group:'Existing Tom word · round 2',method:'Earlier standalone recording',text:'rock',file:'assets/narration/en-male-002.mp3'},
    {id:'en-male-007',group:'Existing Tom word · round 2',method:'Earlier standalone recording',text:'water',file:'assets/narration/en-male-007.mp3'},
    {id:'en-male-012',group:'Existing Tom word · round 2',method:'Earlier standalone recording',text:'up',file:'assets/narration/en-male-012.mp3'},
    {id:'en-male-015',group:'Existing Tom word · round 2',method:'Earlier standalone recording',text:'two',file:'assets/narration/en-male-015.mp3'},
    {id:'en-male-020',group:'Existing Tom word · round 2',method:'Earlier standalone recording',text:'moon',file:'assets/narration/en-male-020.mp3'},
    {id:'en-male-025',group:'Existing Tom word · round 2',method:'Earlier standalone recording',text:'dragon',file:'assets/narration/en-male-025.mp3'},
    {id:'en-male-030',group:'Existing Tom word · round 2',method:'Earlier standalone recording',text:'magic',file:'assets/narration/en-male-030.mp3'},
    {id:'en-male-033',group:'Existing Tom word · round 2',method:'Earlier standalone recording',text:'cat',file:'assets/narration/en-male-033.mp3'},
    {id:'en-male-038',group:'Existing Tom word · round 2',method:'Earlier standalone recording',text:'star',file:'assets/narration/en-male-038.mp3'},
    {id:'en-male-041',group:'Existing Tom word · round 2',method:'Earlier standalone recording',text:'stone',file:'assets/narration/en-male-041.mp3'},
    {id:'en-male-045',group:'Existing Tom word · round 2',method:'Earlier standalone recording',text:'whisper',file:'assets/narration/en-male-045.mp3'},
    {id:'en-male-047',group:'Existing Tom word · round 2',method:'Earlier standalone recording',text:'lantern',file:'assets/narration/en-male-047.mp3'},
    {id:'core-male-001',group:'Recovered standalone word',method:'Standalone recording',text:'the',file:'assets/narration/core-male-001.mp3'},
    {id:'core-male-005',group:'Recovered standalone word',method:'Standalone recording',text:'i',file:'assets/narration/core-male-005.mp3'},
    {id:'core-male-008',group:'Recovered standalone word',method:'Standalone recording',text:'it',file:'assets/narration/core-male-008.mp3'},
    {id:'core-male-026',group:'Recovered batched word',method:'Silence-separated word',text:'said',file:'assets/narration/core-male-026.mp3'},
    {id:'core-male-149',group:'Recovered batched word',method:'Silence-separated word',text:'unicorn',file:'assets/narration/core-male-149.mp3'},
    {id:'core-male-153',group:'Recovered batched word',method:'Silence-separated word',text:'wizard',file:'assets/narration/core-male-153.mp3'},
    {id:'core-male-163',group:'Recovered batched word',method:'Silence-separated word',text:'thin',file:'assets/narration/core-male-163.mp3'},
    {id:'en-male-057',group:'Teaching sentence',method:'Earlier standalone recording',text:'Pip can jump over water.',file:'assets/narration/en-male-057.mp3'},
    {id:'core-male-166',group:'Teaching sentence',method:'Standalone recording',text:'The mom and dad hold hands.',file:'assets/narration/core-male-166.mp3'},
    {id:'core-male-182',group:'Teaching sentence',method:'Standalone recording',text:'Can you see the fox?',file:'assets/narration/core-male-182.mp3'},
    {id:'core-male-810',group:'Teaching sentence',method:'Standalone recording',text:'The bell is by the door.',file:'assets/narration/core-male-810.mp3'},
    {id:'core-male-822',group:'Teaching sentence',method:'Standalone recording',text:'The snake is thin.',file:'assets/narration/core-male-822.mp3'},
    {id:'core-male-167',group:'Assembled phrase',method:'Concatenated recordings',text:'Practice turn. You keep your heart. The mom and dad hold hands.',file:'assets/narration/core-male-167.mp3'},
    {id:'core-male-165',group:'Assembled phrase',method:'Concatenated recordings',text:'Practice turn. You keep your heart. The word was the.',file:'assets/narration/core-male-165.mp3'},
    {id:'core-male-171',group:'Assembled phrase',method:'Concatenated recordings',text:'Practice turn. You keep your heart. A cat is by the house.',file:'assets/narration/core-male-171.mp3'},
    {id:'core-male-809',group:'Assembled phrase',method:'Concatenated recordings',text:'Practice turn. You keep your heart. The word was pan.',file:'assets/narration/core-male-809.mp3'},
    {id:'core-male-823',group:'Assembled phrase',method:'Concatenated recordings',text:'Practice turn. You keep your heart. The snake is thin.',file:'assets/narration/core-male-823.mp3'},
    {id:'core-male-825',group:'Assembled phrase',method:'Concatenated recordings',text:'Practice turn. You keep your heart. The word was thin.',file:'assets/narration/core-male-825.mp3'},
    {id:'en-male-028',group:'Gate review',method:'Currently excluded from runtime',text:'gate',file:'assets/narration/en-male-028.mp3'},
    {id:'en-male-087',group:'Gate review',method:'Currently excluded from runtime',text:'The gate is by the castle.',file:'assets/narration/en-male-087.mp3'},
    {id:'en-male-088',group:'Gate review',method:'Currently excluded from runtime',text:'Practice turn. You keep your heart. The gate is by the castle.',file:'assets/narration/en-male-088.mp3'},
    {id:'en-male-147',group:'Gate review',method:'Currently excluded from runtime',text:'The word was gate.',file:'assets/narration/en-male-147.mp3'},
    {id:'en-male-148',group:'Gate review',method:'Currently excluded from runtime',text:'Practice turn. You keep your heart. The word was gate.',file:'assets/narration/en-male-148.mp3'},
    {id:'evolution-0',group:'Pip evolution',method:'Parallel evolution narration',text:"Look! Your dragon is glowing. Let's see what happens.",file:'assets/narration/evolution-0.mp3'},
    {id:'evolution-1',group:'Pip evolution',method:'Parallel evolution narration',text:'I am big. I can help.',file:'assets/narration/evolution-1.mp3'},
    {id:'evolution-2',group:'Pip evolution',method:'Parallel evolution narration',text:'My wings are big. I can help you.',file:'assets/narration/evolution-2.mp3'},
    {id:'evolution-3',group:'Pip evolution',method:'Parallel evolution narration',text:'Hop on my back. We can go far.',file:'assets/narration/evolution-3.mp3'}
  ];
  function load(storage){
    try{const parsed=JSON.parse(storage.getItem(STORE_KEY)||'{}');return parsed&&typeof parsed==='object'?parsed:{};}catch{return {};}
  }
  function save(storage,state){try{storage.setItem(STORE_KEY,JSON.stringify(state));return true;}catch{return false;}}
  function summarize(state){
    const rated=SAMPLES.filter(function(s){return state[s.id]&&state[s.id].rating;});
    const bad=rated.filter(function(s){return state[s.id].rating==='bad';});
    const good=rated.filter(function(s){return state[s.id].rating==='good';});
    return {rated:rated.length,bad:bad.length,good:good.length,total:SAMPLES.length,complete:rated.length===SAMPLES.length};
  }
  function reportText(state){
    const sum=summarize(state),lines=['BlitzWord Narration QA','Reviewed '+sum.rated+'/'+sum.total+'; good '+sum.good+'; bad '+sum.bad+'.'];
    const bad=SAMPLES.filter(function(s){return state[s.id]&&state[s.id].rating==='bad';});
    lines.push('','BAD ('+bad.length+')');
    if(!bad.length) lines.push('- none');
    bad.forEach(function(s){const note=((state[s.id]&&state[s.id].note)||'').trim();lines.push('- '+s.id+' | '+s.group+' | '+s.text+(note?' | note: '+note:''));});
    const unrated=SAMPLES.filter(function(s){return !(state[s.id]&&state[s.id].rating);});
    if(unrated.length){lines.push('','UNRATED ('+unrated.length+')');unrated.forEach(function(s){lines.push('- '+s.id+' | '+s.group+' | '+s.text);});}
    return lines.join('\n');
  }
  function mount(doc){
    if(!doc||!doc.getElementById)return;
    const $=function(id){return doc.getElementById(id);},view=doc.defaultView||(typeof globalThis!=='undefined'?globalThis:null),storage=view&&view.localStorage?view.localStorage:null;
    let state=storage?load(storage):{},index=0;
    const player=$('qaPlayer'),play=$('qaPlay'),good=$('qaGood'),bad=$('qaBad'),note=$('qaNote');
    function stop(){try{player.pause();player.currentTime=0;}catch{}play.textContent='Play';}
    function current(){return SAMPLES[index];}
    function render(){
      const s=current(),entry=state[s.id]||{};stop();
      $('qaProgress').textContent=(index+1)+' / '+SAMPLES.length;
      $('qaGroup').textContent=s.group;$('qaMethod').textContent=s.method;$('qaText').textContent=s.text;$('qaId').textContent=s.id;
      note.value=entry.note||'';good.classList.toggle('selected',entry.rating==='good');bad.classList.toggle('selected',entry.rating==='bad');
      $('qaPrev').disabled=index===0;$('qaNext').disabled=index===SAMPLES.length-1;
      const sum=summarize(state);$('qaSummary').textContent=sum.rated+'/'+sum.total+' reviewed · '+sum.bad+' bad';
      $('qaBarFill').style.width=Math.round(100*sum.rated/sum.total)+'%';
      $('qaGateNote').hidden=s.group!=='Gate review';
    }
    function go(next){index=Math.max(0,Math.min(SAMPLES.length-1,next));render();}
    function rate(value){
      const s=current();state[s.id]=Object.assign({},state[s.id]||{},{rating:value,note:note.value.trim(),updatedAt:new Date().toISOString()});
      save(storage,state);render();
      const next=SAMPLES.findIndex(function(x,i){return i>index&&!(state[x.id]&&state[x.id].rating);});
      if(next>=0)setTimeout(function(){go(next);},180);
    }
    play.onclick=async function(){const s=current();stop();player.src='../'+s.file;play.textContent='Playing…';try{await player.play();}catch{play.textContent='Play failed';}};
    player.onended=function(){play.textContent='Play';};player.onerror=function(){play.textContent='Play failed';};
    good.onclick=function(){rate('good');};bad.onclick=function(){rate('bad');};
    $('qaPrev').onclick=function(){go(index-1);};$('qaNext').onclick=function(){go(index+1);};
    note.oninput=function(){const s=current();state[s.id]=Object.assign({},state[s.id]||{},{note:note.value,updatedAt:new Date().toISOString()});save(storage,state);};
    $('qaNextUnrated').onclick=function(){
      const next=SAMPLES.findIndex(function(s,i){return i>index&&!(state[s.id]&&state[s.id].rating);});
      const wrap=next>=0?next:SAMPLES.findIndex(function(s){return !(state[s.id]&&state[s.id].rating);});
      if(wrap>=0)go(wrap);
    };
    $('qaCopy').onclick=async function(){
      const text=reportText(state);
      try{await navigator.clipboard.writeText(text);$('qaCopyStatus').textContent='Copied. Paste it into ChatGPT.';}
      catch{$('qaCopyFallback').hidden=false;$('qaCopyFallback').value=text;$('qaCopyFallback').focus();$('qaCopyFallback').select();$('qaCopyStatus').textContent='Copy the selected text below.';}
    };
    $('qaReset').onclick=function(){if(!confirm('Clear all narration QA ratings on this device?'))return;state={};save(storage,state);render();$('qaCopyStatus').textContent='Ratings cleared.';};
    render();
  }
  return {STORE_KEY:STORE_KEY,SAMPLES:SAMPLES,load:load,summarize:summarize,reportText:reportText,mount:mount};
});
