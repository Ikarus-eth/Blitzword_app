(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  else { root.BlitzRemainderQA=api; api.mount(document); }
})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const STORE_KEY='blitzword_narration_remainder_qa_v1';
const SAMPLES=[
  {
    "id": "story-intro-01",
    "group": "Chapter story intro",
    "method": "George - Warm, Captivating Storyteller · eleven_multilingual_v2 · 0.9×",
    "text": "A fox waits beside the stream. Pip follows it to a safe place to cross.",
    "file": "assets/narration/story-intro-fox-crossing.mp3"
  },
  {
    "id": "story-intro-02",
    "group": "Chapter story intro",
    "method": "George - Warm, Captivating Storyteller · eleven_multilingual_v2 · 0.9×",
    "text": "Beyond the stream, old trees shelter a red book. Pip stops to look inside.",
    "file": "assets/narration/story-intro-old-grove.mp3"
  },
  {
    "id": "story-intro-03",
    "group": "Chapter story intro",
    "method": "George - Warm, Captivating Storyteller · eleven_multilingual_v2 · 0.9×",
    "text": "The book shows a trail of lights. Pip follows them as the forest grows dark.",
    "file": "assets/narration/story-intro-lantern-ruins.mp3"
  },
  {
    "id": "story-intro-04",
    "group": "Chapter story intro",
    "method": "George - Warm, Captivating Storyteller · eleven_multilingual_v2 · 0.9×",
    "text": "An owl has shown you the hidden nest. A little spark shines beside its gate.",
    "file": "assets/narration/story-intro-hidden-nest.mp3"
  },
  {
    "id": "story-intro-05",
    "group": "Chapter story intro",
    "method": "George - Warm, Captivating Storyteller · eleven_multilingual_v2 · 0.9×",
    "text": "A bright stream leads away from the nest. Pip wants to see where it goes.",
    "file": "assets/narration/story-intro-chapter-2-place-1.mp3"
  },
  {
    "id": "story-intro-06",
    "group": "Chapter story intro",
    "method": "George - Warm, Captivating Storyteller · eleven_multilingual_v2 · 0.9×",
    "text": "You reach a stone bridge. Pip waits for you before crossing to the other side.",
    "file": "assets/narration/story-intro-chapter-2-place-2.mp3"
  },
  {
    "id": "story-intro-07",
    "group": "Chapter story intro",
    "method": "George - Warm, Captivating Storyteller · eleven_multilingual_v2 · 0.9×",
    "text": "Tall reeds whisper beside the river. A narrow path leads you both onward.",
    "file": "assets/narration/story-intro-chapter-2-place-3.mp3"
  },
  {
    "id": "story-intro-08",
    "group": "Chapter story intro",
    "method": "George - Warm, Captivating Storyteller · eleven_multilingual_v2 · 0.9×",
    "text": "The river opens into a still blue pool. Pip stops beside the clear water.",
    "file": "assets/narration/story-intro-chapter-2-place-4.mp3"
  },
  {
    "id": "story-intro-09",
    "group": "Chapter story intro",
    "method": "George - Warm, Captivating Storyteller · eleven_multilingual_v2 · 0.9×",
    "text": "A gate stands at the end of the river path. Warm light shines through it.",
    "file": "assets/narration/story-intro-chapter-2-place-5.mp3"
  },
  {
    "id": "story-intro-10",
    "group": "Chapter story intro",
    "method": "George - Warm, Captivating Storyteller · eleven_multilingual_v2 · 0.9×",
    "text": "Beyond the gate, golden leaves cover a winding path. Pip finds the next trail.",
    "file": "assets/narration/story-intro-chapter-3-place-1.mp3"
  },
  {
    "id": "story-intro-11",
    "group": "Chapter story intro",
    "method": "George - Warm, Captivating Storyteller · eleven_multilingual_v2 · 0.9×",
    "text": "The trees grow close together. Pip finds a cosy space among the leaves.",
    "file": "assets/narration/story-intro-chapter-3-place-2.mp3"
  },
  {
    "id": "story-intro-12",
    "group": "Chapter story intro",
    "method": "George - Warm, Captivating Storyteller · eleven_multilingual_v2 · 0.9×",
    "text": "Moss covers a line of old steps. You and Pip climb them one at a time.",
    "file": "assets/narration/story-intro-chapter-3-place-3.mp3"
  },
  {
    "id": "story-intro-13",
    "group": "Chapter story intro",
    "method": "George - Warm, Captivating Storyteller · eleven_multilingual_v2 · 0.9×",
    "text": "The roots form an arch across the path. Pip waits beneath it for you.",
    "file": "assets/narration/story-intro-chapter-3-place-4.mp3"
  },
  {
    "id": "story-intro-14",
    "group": "Chapter story intro",
    "method": "George - Warm, Captivating Storyteller · eleven_multilingual_v2 · 0.9×",
    "text": "The oldest oak stands ahead. Its branches point towards a distant glow.",
    "file": "assets/narration/story-intro-chapter-3-place-5.mp3"
  },
  {
    "id": "story-intro-15",
    "group": "Chapter story intro",
    "method": "George - Warm, Captivating Storyteller · eleven_multilingual_v2 · 0.9×",
    "text": "A stone path winds towards the glow. Pip follows the warm light between the trees.",
    "file": "assets/narration/story-intro-chapter-4-place-1.mp3"
  },
  {
    "id": "story-intro-16",
    "group": "Chapter story intro",
    "method": "George - Warm, Captivating Storyteller · eleven_multilingual_v2 · 0.9×",
    "text": "Small lamps light the grove. Pip pauses to watch their gentle glow.",
    "file": "assets/narration/story-intro-chapter-4-place-2.mp3"
  },
  {
    "id": "story-intro-17",
    "group": "Chapter story intro",
    "method": "George - Warm, Captivating Storyteller · eleven_multilingual_v2 · 0.9×",
    "text": "An old wall rises beside the trail. There is a way through for you and Pip.",
    "file": "assets/narration/story-intro-chapter-4-place-3.mp3"
  },
  {
    "id": "story-intro-18",
    "group": "Chapter story intro",
    "method": "George - Warm, Captivating Storyteller · eleven_multilingual_v2 · 0.9×",
    "text": "A golden door glows in the stone. Pip waits while you find the way inside.",
    "file": "assets/narration/story-intro-chapter-4-place-4.mp3"
  },
  {
    "id": "story-intro-19",
    "group": "Chapter story intro",
    "method": "George - Warm, Captivating Storyteller · eleven_multilingual_v2 · 0.9×",
    "text": "The hall is full of soft light. A window shows the moon above the next wood.",
    "file": "assets/narration/story-intro-chapter-4-place-5.mp3"
  },
  {
    "id": "story-intro-20",
    "group": "Chapter story intro",
    "method": "George - Warm, Captivating Storyteller · eleven_multilingual_v2 · 0.9×",
    "text": "Moonlight leads you into a quiet wood. Pip stays close beside you.",
    "file": "assets/narration/story-intro-chapter-5-place-1.mp3"
  },
  {
    "id": "story-intro-21",
    "group": "Chapter story intro",
    "method": "George - Warm, Captivating Storyteller · eleven_multilingual_v2 · 0.9×",
    "text": "An owl watches from a high branch. Pip looks up to follow its gaze.",
    "file": "assets/narration/story-intro-chapter-5-place-2.mp3"
  },
  {
    "id": "story-intro-22",
    "group": "Chapter story intro",
    "method": "George - Warm, Captivating Storyteller · eleven_multilingual_v2 · 0.9×",
    "text": "Stars shine in a still pool. Pip stops beside the water to look.",
    "file": "assets/narration/story-intro-chapter-5-place-3.mp3"
  },
  {
    "id": "story-intro-23",
    "group": "Chapter story intro",
    "method": "George - Warm, Captivating Storyteller · eleven_multilingual_v2 · 0.9×",
    "text": "A dark arch opens between the trees. Moonlight shows a path through it.",
    "file": "assets/narration/story-intro-chapter-5-place-4.mp3"
  },
  {
    "id": "story-intro-24",
    "group": "Chapter story intro",
    "method": "George - Warm, Captivating Storyteller · eleven_multilingual_v2 · 0.9×",
    "text": "You reach a sheltered nest beneath the moon. A blue glow shines beyond the wood.",
    "file": "assets/narration/story-intro-chapter-5-place-5.mp3"
  },
  {
    "id": "story-intro-25",
    "group": "Chapter story intro",
    "method": "George - Warm, Captivating Storyteller · eleven_multilingual_v2 · 0.9×",
    "text": "The blue glow comes from a cave. Pip peeks inside, then waits for you.",
    "file": "assets/narration/story-intro-chapter-6-place-1.mp3"
  },
  {
    "id": "story-intro-26",
    "group": "Chapter story intro",
    "method": "George - Warm, Captivating Storyteller · eleven_multilingual_v2 · 0.9×",
    "text": "Blue stones shine along the cave wall. Pip follows their light into the mountain.",
    "file": "assets/narration/story-intro-chapter-6-place-2.mp3"
  },
  {
    "id": "story-intro-27",
    "group": "Chapter story intro",
    "method": "George - Warm, Captivating Storyteller · eleven_multilingual_v2 · 0.9×",
    "text": "A deep pool fills the quiet cave. You and Pip take the dry path beside it.",
    "file": "assets/narration/story-intro-chapter-6-place-3.mp3"
  },
  {
    "id": "story-intro-28",
    "group": "Chapter story intro",
    "method": "George - Warm, Captivating Storyteller · eleven_multilingual_v2 · 0.9×",
    "text": "The cave opens into a glowing hall. Pip looks at the lights all around you.",
    "file": "assets/narration/story-intro-chapter-6-place-4.mp3"
  },
  {
    "id": "story-intro-29",
    "group": "Chapter story intro",
    "method": "George - Warm, Captivating Storyteller · eleven_multilingual_v2 · 0.9×",
    "text": "A crystal gate opens towards the sky. Pip can feel the warm air beyond it.",
    "file": "assets/narration/story-intro-chapter-6-place-5.mp3"
  },
  {
    "id": "story-intro-30",
    "group": "Chapter story intro",
    "method": "George - Warm, Captivating Storyteller · eleven_multilingual_v2 · 0.9×",
    "text": "Sunlight warms the hill path. Pip looks up at a castle high above you.",
    "file": "assets/narration/story-intro-chapter-7-place-1.mp3"
  },
  {
    "id": "story-intro-31",
    "group": "Chapter story intro",
    "method": "George - Warm, Captivating Storyteller · eleven_multilingual_v2 · 0.9×",
    "text": "Stone steps climb towards the clouds. You and Pip take the next step together.",
    "file": "assets/narration/story-intro-chapter-7-place-2.mp3"
  },
  {
    "id": "story-intro-32",
    "group": "Chapter story intro",
    "method": "George - Warm, Captivating Storyteller · eleven_multilingual_v2 · 0.9×",
    "text": "A high bridge stretches towards the keep. Pip stays beside you as you cross.",
    "file": "assets/narration/story-intro-chapter-7-place-3.mp3"
  },
  {
    "id": "story-intro-33",
    "group": "Chapter story intro",
    "method": "George - Warm, Captivating Storyteller · eleven_multilingual_v2 · 0.9×",
    "text": "The tower is close now. Pip looks up at its bright flags in the sky.",
    "file": "assets/narration/story-intro-chapter-7-place-4.mp3"
  },
  {
    "id": "story-intro-34",
    "group": "Chapter story intro",
    "method": "George - Warm, Captivating Storyteller · eleven_multilingual_v2 · 0.9×",
    "text": "You have reached the sky keep together. Pip is ready for the final path.",
    "file": "assets/narration/story-intro-chapter-7-place-5.mp3"
  },
  {
    "id": "shield-stopped",
    "group": "Shield prefix",
    "method": "George - Warm, Captivating Storyteller · eleven_multilingual_v2 · 0.9×",
    "text": "Your shield stopped the hit.",
    "file": "assets/narration/shield-stopped.mp3"
  }
];
function load(storage){try{const x=JSON.parse(storage.getItem(STORE_KEY)||'{}');return x&&typeof x==='object'?x:{};}catch{return {};}}
function save(storage,state){try{storage.setItem(STORE_KEY,JSON.stringify(state));return true;}catch{return false;}}
function summarize(state){const rated=SAMPLES.filter(s=>state[s.id]?.rating);const bad=rated.filter(s=>state[s.id].rating==='bad');return {rated:rated.length,good:rated.length-bad.length,bad:bad.length,total:SAMPLES.length,complete:rated.length===SAMPLES.length};}
function reportText(state){const sum=summarize(state),lines=['BlitzWord ElevenLabs remainder QA',`Reviewed ${sum.rated}/${sum.total}; good ${sum.good}; bad ${sum.bad}.`,'','BAD ('+sum.bad+')'];const bad=SAMPLES.filter(s=>state[s.id]?.rating==='bad');if(!bad.length)lines.push('- none');bad.forEach(s=>{const note=(state[s.id]?.note||'').trim();lines.push('- '+s.id+' | '+s.text+(note?' | note: '+note:''));});const unrated=SAMPLES.filter(s=>!state[s.id]?.rating);if(unrated.length){lines.push('','UNRATED ('+unrated.length+')');unrated.forEach(s=>lines.push('- '+s.id+' | '+s.text));}return lines.join('\n');}
function mount(doc){
 if(!doc?.getElementById)return;const $=id=>doc.getElementById(id),view=doc.defaultView||globalThis,storage=view?.localStorage||null;let state=storage?load(storage):{},index=0;
 const player=$('qaPlayer'),play=$('qaPlay'),good=$('qaGood'),bad=$('qaBad'),note=$('qaNote');
 function stop(){try{player.pause();player.currentTime=0;}catch{}play.textContent='Play';}
 function render(){const s=SAMPLES[index],e=state[s.id]||{};stop();$('qaProgress').textContent=(index+1)+' / '+SAMPLES.length;$('qaGroup').textContent=s.group;$('qaMethod').textContent=s.method;$('qaText').textContent=s.text;$('qaId').textContent=s.id;note.value=e.note||'';good.classList.toggle('selected',e.rating==='good');bad.classList.toggle('selected',e.rating==='bad');$('qaPrev').disabled=index===0;$('qaNext').disabled=index===SAMPLES.length-1;const sum=summarize(state);$('qaSummary').textContent=sum.rated+'/'+sum.total+' reviewed · '+sum.bad+' bad';$('qaBarFill').style.width=Math.round(100*sum.rated/sum.total)+'%';}
 function go(i){index=Math.max(0,Math.min(SAMPLES.length-1,i));render();}
 function rate(value){const s=SAMPLES[index];state[s.id]={...(state[s.id]||{}),rating:value,note:note.value.trim(),updatedAt:new Date().toISOString()};save(storage,state);render();const next=SAMPLES.findIndex((s,i)=>i>index&&!state[s.id]?.rating);if(next>=0)setTimeout(()=>go(next),160);}
 play.onclick=async()=>{const s=SAMPLES[index];stop();player.src='../'+s.file;play.textContent='Playing…';try{await player.play();}catch{play.textContent='Play failed';}};
 player.onended=()=>play.textContent='Play';player.onerror=()=>play.textContent='Play failed';good.onclick=()=>rate('good');bad.onclick=()=>rate('bad');$('qaPrev').onclick=()=>go(index-1);$('qaNext').onclick=()=>go(index+1);
 $('qaNextUnrated').onclick=()=>{let next=SAMPLES.findIndex((s,i)=>i>index&&!state[s.id]?.rating);if(next<0)next=SAMPLES.findIndex(s=>!state[s.id]?.rating);if(next>=0)go(next);};
 note.oninput=()=>{const s=SAMPLES[index];state[s.id]={...(state[s.id]||{}),note:note.value,updatedAt:new Date().toISOString()};save(storage,state);};
 $('qaCopy').onclick=async()=>{const t=reportText(state);try{await navigator.clipboard.writeText(t);$('qaCopyStatus').textContent='Copied. Paste it into ChatGPT.';}catch{$('qaCopyFallback').hidden=false;$('qaCopyFallback').value=t;$('qaCopyFallback').focus();$('qaCopyFallback').select();$('qaCopyStatus').textContent='Copy the selected text below.';}};
 $('qaReset').onclick=()=>{if(!confirm('Clear all remainder QA ratings on this device?'))return;state={};save(storage,state);render();};
 render();
}
return {STORE_KEY,SAMPLES,load,summarize,reportText,mount};
});