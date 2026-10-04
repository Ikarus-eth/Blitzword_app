// Offline request preparation. Does not call a provider or change runtime audio.
const fs=require('node:fs'),C=require('../content'),M=require('../missions'),N=require('../narration');
const staged=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const stories=C.areas.slice(1).map(a=>C.chapterStories[a.id].sentence).filter(t=>!N.clips[t]);
const reused={};for(const text of stories){if(!staged.clips[text])throw Error('Missing previously paid story: '+text);reused[text]=staged.clips[text];}
const prompt='Tap the actions in the right order.',entries=new Map();
const add=(text,kind)=>{if(!N.clips[text]&&!entries.has(text))entries.set(text,{key:text,text,kind});};
for(const q of Object.values(M.puzzles)){
 if(q.prompt===prompt){add(q.text.join(' '),'ordering-riddle');add(prompt,'ordering-prompt');}
 else add(q.text.join(' ')+' '+q.prompt,'riddle');
}
const list=[...entries.values()],batches=[];
for(let i=0;i<list.length;i+=8){const segments=list.slice(i,i+8);batches.push({id:'story-riddle-'+String(batches.length+1).padStart(3,'0'),text:segments.map(s=>s.text).join('\n\n'),segments});}
const plan={version:1,base:'7107bf5f9105fd5a916c1b549be6c7483b4be3d0',voiceId:staged.voiceId,model:staged.model,settings:staged.settings,maxCharacters:6000,characters:batches.reduce((n,b)=>n+b.text.length,0),segmentCount:list.length,batches};
if(plan.characters>plan.maxCharacters)throw Error('Review budget');
fs.writeFileSync('docs/NARRATION_STORY_RIDDLE_REQUEST.json',JSON.stringify(plan,null,2)+'\n');
fs.writeFileSync('docs/NARRATION_STORY_RIDDLE_REUSE.json',JSON.stringify({sourceCommit:'12b9e3054c2ecf6ad81c0282825517ddfd270aa9',voiceId:staged.voiceId,model:staged.model,clips:reused},null,2)+'\n');
fs.writeFileSync('/tmp/blitzword-story-reuse-files.txt',[...new Set(Object.values(reused).map(c=>c.file))].join('\n')+'\n');
console.log(JSON.stringify({characters:plan.characters,newSegments:plan.segmentCount,reusedStories:stories.length,kinds:list.reduce((o,c)=>(o[c.kind]=(o[c.kind]||0)+1,o),{})}));
