// Offline corpus preparation. This command does not contact a speech service or incur charges.
const fs=require('node:fs'),path=require('node:path'),C=require('../content');
const groups={words:[...new Set([...C.words,...C.legacyWords,...C.assessmentPools.flat()].map(x=>x.w))],sentences:[...new Set([...C.words,...C.legacyWords].map(x=>x.sentence))]};
const phrases=new Map();function add(text,kind){if(!phrases.has(text))phrases.set(text,{text,kind});}
for(const text of groups.words)add(text,'word');
for(const text of groups.sentences){add(text,'teaching');add('Practice turn. You keep your heart. '+text,'supported-teaching');}
for(const item of [...C.words,...C.legacyWords]){add('The word was '+item.w+'.','correction');add('Practice turn. You keep your heart. The word was '+item.w+'.','practice-correction');}
for(const enemy of C.enemies){add('A '+enemy.name+' is on the path. Ready to battle?','encounter');add('Reading check complete. Now your first chapter begins. A '+enemy.name+' is on the path. Ready to battle?','first-encounter');}
add('Let’s try a few words. Look at the word. When it hides, tap the same word. Tap the question mark if you are not sure.','instructions');
const clips=[...phrases.values()].map((x,i)=>({id:'en-male-'+String(i+1).padStart(3,'0'),...x,file:'assets/narration/en-male-'+String(i+1).padStart(3,'0')+'.mp3'}));
const result={status:'awaiting generation and listening review',language:'en-GB',direction:'A deep adult male British English voice. Warm, calm, clear natural articulation suitable for children learning to read. Moderate pace, no music, no dramatic character acting, no added words. Keep vowels and final consonants intelligible. Do not artificially pitch-shift recordings.',wordCount:groups.words.length,sentenceCount:groups.sentences.length,clipCount:clips.length,characters:clips.reduce((n,x)=>n+x.text.length,0),clips};
fs.writeFileSync(path.join(__dirname,'../docs/NARRATION_CORPUS.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({words:result.wordCount,sentences:result.sentenceCount,clips:result.clipCount,characters:result.characters}));
