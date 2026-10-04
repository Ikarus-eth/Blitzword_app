// Offline inventory. No provider calls. Existing approved recordings remain untouched.
const fs=require('node:fs'),C=require('../content'),N=require('../narration'),M=require('../missions');
const old=require('../docs/NARRATION_BUDGET_REUSE.json');
const reused=Object.fromEntries(Object.entries(old.clips).filter(([t])=>/^(You chose |The word is |(?:Reading check complete\. Now your first chapter begins\. )?(?:A |An ).+ is on the path\. Ready to battle\?$)/.test(t)));
const clips={...N.clips,...reused},entries=new Map();
function add(key,text,kind){if(!clips[key]&&!entries.has(key))entries.set(key,{key,text,kind});}
const items=[...C.words,...C.legacyWords,...C.assessmentPools.flat()];
for(const item of items)for(const word of new Set([...(item.pool||[]),...item.d.filter(w=>w!==item.w)])){
 if(!clips['You chose '+word+'.'])add(word,word+'.','choice-word');
}
add('You chose.','You chose.','prefix');add('The word is.','The word is.','prefix');
add('Practice turn. You keep your heart.','Practice turn. You keep your heart.','prefix');
const first='Reading check complete. Now your first chapter begins.';
add(first,first,'prefix');
for(const e of [...C.enemies,...C.enemyVariants]){
 const name=C.enemyAt(e.family).name;
 const text=(e.count||1)>1?e.name+' are on the path. Ready to battle?':(/^Acorn/.test(name)?'An ':'A ')+name+' is on the path. Ready to battle?';
 add(text,text,'trail-encounter');
}
for(const m of M.missions)for(const family of m.encounters){const text='A '+C.enemyAt(family).name+' is ready for your challenge.';add(text,text,'mission-encounter');}
const list=[...entries.values()],batches=[];
for(let i=0;i<list.length;i+=8){const segments=list.slice(i,i+8);batches.push({id:'budget-'+String(batches.length+1).padStart(3,'0'),text:segments.map(s=>s.text).join('\n\n'),segments});}
const plan={version:1,base:'53cf987bea9c14041775f782a55b338ddf45ba39',voiceId:old.voiceId,model:old.model,settings:{stability:.65,similarity_boost:.8,style:0,use_speaker_boost:true,speed:.9},maxCharacters:8000,characters:batches.reduce((n,b)=>n+b.text.length,0),segmentCount:list.length,batches};
if(plan.characters>plan.maxCharacters)throw Error('Budget exceeded');
fs.writeFileSync('docs/NARRATION_BUDGET_REQUEST.json',JSON.stringify(plan,null,2)+'\n');
fs.writeFileSync('docs/NARRATION_BUDGET_REUSE.json',JSON.stringify({sourceCommit:'12b9e3054c2ecf6ad81c0282825517ddfd270aa9',voiceId:old.voiceId,model:old.model,clips:reused},null,2)+'\n');
fs.writeFileSync('/tmp/blitzword-reused-files.txt',[...new Set(Object.values(reused).map(c=>c.file))].join('\n')+'\n');
console.log(JSON.stringify({characters:plan.characters,segments:list.length,reused:Object.keys(reused).length,kinds:list.reduce((o,c)=>(o[c.kind]=(o[c.kind]||0)+1,o),{})}));
