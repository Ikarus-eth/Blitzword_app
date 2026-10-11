const fs=require('fs'),C=require('../content'),N=require('../narration');
const prior=require('../docs/NARRATION_WORDS_FAL_REQUEST.json');
const items=[];const seen=new Set(Object.keys(N.clips));
for(const w of C.words.slice(199,400))for(const [kind,text] of [['sentence',w.sentence],['tip',w.teaching?.tip]]){
 if(!text||seen.has(text))continue;seen.add(text);items.push({id:'teach-200-400-'+String(items.length+1).padStart(3,'0'),key:text,text,kind});
}
const characters=items.reduce((n,x)=>n+x.text.length,0);
const plan={version:1,scope:'Missing teaching sentences and tips for one-based words 200–400',provider:'fal.ai',model:prior.model,voice:prior.voice,settings:prior.settings,characters,maxCharacters:characters,estimatedUSD:characters*.0001,aliases:{},items};
fs.writeFileSync('docs/TEACHING_200_400_AUDIO_REQUEST.json',JSON.stringify(plan,null,2)+'\n');
console.log(JSON.stringify({clips:items.length,characters,estimatedUSD:plan.estimatedUSD}));
