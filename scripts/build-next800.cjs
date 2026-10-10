// Offline, deterministic compiler. No network or paid generation.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..'),C=require('../content'),Core=require('../game-core');
const proposal=require('../curriculum/NEXT800_FIRST_BOOKS.json');
const lessons=new Map(fs.readFileSync(path.join(root,'curriculum/next800-sentences.txt'),'utf8').trim().split('\n').map(line=>line.split('|')));
const base=C.words.slice(0,200),all=new Set([...base.map(x=>x.w),...proposal.words.map(x=>x.word)].map(x=>x.toLowerCase()));
// This checked-in lexicon makes regeneration portable. It records only the candidate
// spellings selected during authoring, rather than redistributing a system dictionary.
const lexiconPath=path.join(root,'curriculum/next800-real-options.json');
const dictionary=new Set(fs.existsSync(lexiconPath)?JSON.parse(fs.readFileSync(lexiconPath,'utf8')):
 fs.readFileSync('/usr/share/dict/words','utf8').split(/\s+/).map(w=>w.toLowerCase()));
for(const w of all)dictionary.add(w);
const blocked=new Set(fs.readFileSync(path.join(root,'tests/choices.test.js'),'utf8').match(/const BLOCKED=new Set\(`([\s\S]*?)`\.split/)[1].split(/\s+/));
const vowel='aeiou',consonant='bcdfghjklmnprstvwz';
const starts=new Set('bl br ch cl cr dr dw fl fr gl gr kn ph pl pr qu sc sch scr sh shr sk sl sm sn sp spl spr sq squ st str sw th thr tr tw wh wr'.split(' '));
const safe=w=>{const low=w.toLowerCase(),cluster=low.match(/^[^aeiouy']+/)?.[0]||'';return /^[a-zA-Z']+$/.test(w)&&/[aeiouy]/i.test(w)&&!blocked.has(low)&&(cluster.length<2||starts.has(cluster));};
const replace=(w,i,c)=>w.slice(0,i)+c+w.slice(i+1);
function alternatives(w,i){const c=w[i].toLowerCase();return ((vowel.includes(c)||c==='y')?vowel:consonant).split('').filter(x=>x!==c).map(x=>c!==w[i]?x.toUpperCase():x);}
function options(w){
 if(w==='why')return {d:['why','whey','thy','they'],pool:['whey','thy','they','shy','shey'],madeUp:['shey']};
 const positions=[...w].flatMap((c,i)=>/[a-z]/i.test(c)?[i]:[]),interior=positions.filter(i=>i>0&&i<w.length-1);
 const pairs=[];
 for(const i of interior)for(const j of positions.filter(j=>j!==i))pairs.push([i,j]);
 if(!pairs.length)pairs.push([w.length-1,0]);
 let best=null;
 const offer=pool=>{
  if(pool.length!==5||new Set([w,...pool]).size!==6||!pool.every(safe))return;
  const score=pool.filter(x=>dictionary.has(x.toLowerCase())).length;
  if(best&&score<=best.score)return;
  const item={w,pool},sets=Core.choiceSets(item);
  if(sets.length<2||pool.some(x=>!sets.some(s=>s.set.includes(x))))return;
  if(sets.some(s=>s.guess>1/3+1e-9))return;
  const d=sets.map(s=>[w,...s.set]).find(d=>d.some(x=>x!==w&&x.length===w.length));
  if(!d)return;
  // Prefer words over invented strings, but never weaken the fairness checks.
  if(!best||score>best.score)best={pool,d,score};
 };
 // Two independent letter contrasts make rectangles rather than an obvious
 // correct-word centre surrounded by three one-letter errors.
 for(const [i,j] of pairs.sort((a,b)=>a.reduce((n,i)=>n+(!vowel.includes(w[i])),0)-b.reduce((n,i)=>n+(!vowel.includes(w[i])),0)).slice(0,24)){
  for(const x of alternatives(w,i)){
   const ys=alternatives(w,j).slice(0,5);
   for(let a=0;a<ys.length;a++)for(let b=a+1;b<ys.length;b++){
    const wx=replace(w,i,x),y=replace(w,j,ys[a]),z=replace(w,j,ys[b]);
    offer([wx,y,replace(wx,j,ys[a]),z,replace(wx,j,ys[b])]);
   }
  }
 }
 // Insertion plus substitution covers short words while retaining an option
 // with BOTH the target's first and last letters.
 if(!best){
  const i=w.length-1;
  for(const x of alternatives(w,i))for(const y of 'rlnaei')for(const z of 'rlnaei'){
   if(y===z)continue;
   const wx=replace(w,i,x),insert=(s,c)=>s.slice(0,1)+c+s.slice(1);
   offer([wx,insert(w,y),insert(wx,y),insert(w,z),insert(wx,z)]);
  }
 }
 if(!best){for(const x of alternatives(w,0))for(const y of alternatives(w,0)){if(x===y)continue;const a=replace(w,0,x),b=replace(w,0,y),tail=w.at(-1);offer([w+tail,a,a+tail,b,b+tail]);}}
 assert(best,'No fair pool: '+w);
 return {d:best.d,pool:best.pool,madeUp:best.pool.filter(x=>!dictionary.has(x.toLowerCase()))};
}
const contractions={"can't":"cannot","didn't":"did not","couldn't":"could not","won't":"will not","wasn't":"was not","isn't":"is not","you're":"you are","I'll":"I will","let's":"let us","we'll":"we will","that's":"that is","there's":"there is","he's":"he is","she's":"she is","we're":"we are","they're":"they are","I've":"I have","you've":"you have","we've":"we have","doesn't":"does not","haven't":"have not","hadn't":"had not","aren't":"are not","weren't":"were not"};
const irregular={been:'be',does:'do',came:'come',went:'go',got:'get',done:'do',ran:'run',ate:'eat',thought:'think',began:'begin',took:'take',knew:'know',told:'tell',heard:'hear',caught:'catch',fell:'fall',seen:'see',became:'become',stood:'stand',brought:'bring',built:'build',felt:'feel',sat:'sit',kept:'keep',gone:'go',held:'hold',wrote:'write',grew:'grow',sent:'send',bought:'buy',hid:'hide',hidden:'hide',lay:'lie',slept:'sleep',woke:'wake',drank:'drink',taken:'take',given:'give',drew:'draw',broke:'break',broken:'break',fallen:'fall',flew:'fly',swam:'swim',rode:'ride',drove:'drive',threw:'throw',led:'lead',met:'meet',won:'win',known:'know',forgot:'forget',men:'man',women:'woman',children:'child',feet:'foot',teeth:'tooth',mice:'mouse',leaves:'leaf'};
const cardinal='zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty'.split(' ');
const numbers=Object.fromEntries(cardinal.map((w,n)=>[w,n]));Object.assign(numbers,{thirty:30,forty:40,fifty:50,sixty:60,seventy:70,eighty:80,ninety:90,hundred:100,thousand:1000});
const ordinals='first second third fourth fifth sixth seventh eighth ninth tenth'.split(' ');
const special={half:['½','One of two equal parts.'],quarter:['¼','One of four equal parts.'],double:['×2','Twice as many.'],pair:['2','Two things that go together.'],plus:['+','Put amounts together.'],minus:['−','Take an amount away.'],equal:['=','The same amount or size.'],forty:['40','Forty has no u. Compare four, fourteen and forty.'],fifteen:['15','Compare five, fifteen and fifty.'],fifty:['50','Compare five, fifteen and fifty.'],thirteen:['13','Compare three, thirteen and thirty.'],thirty:['30','Compare three, thirteen and thirty.'],fourteen:['14','Compare four, fourteen and forty.'],eighteen:['18','Eighteen has one t. Compare eight and eighty.'],eighty:['80','Compare eight, eighteen and eighty.'],whose:[null,'Whose asks who something belongs to.'],its:[null,'Its means belonging to it. There is no apostrophe.'],school:[null,'In school, ch sounds like k.'],knight:[null,'The k is silent. Knight sounds like night.'],write:[null,'The w is silent.'],writing:[null,'The w is silent, as in write.'],wrote:[null,'The w is silent, as in write.'],island:[null,'The s is silent.'],guess:[null,'The u is silent.'],Wednesday:[null,'Listen carefully: Wednesday sounds like Wenz-day.'],eight:['8','Eight sounds like ate.'],two:[null,'Two sounds like too.'],know:[null,'The k is silent.']};
const families={running:'run',sitting:'sit',stopped:'stop',swimming:'swim',jumping:'jump',walking:'walk',walked:'walk',looking:'look',looked:'look',talking:'talk',called:'call',asked:'ask',carrying:'carry',making:'make',doing:'do',getting:'get',thinking:'think',feeling:'feel',reading:'read',sleeping:'sleep',playing:'play',played:'play',flying:'fly',coming:'come',going:'go',goes:'go',says:'say',bigger:'big',biggest:'big',rainy:'rain',sunny:'sun',windy:'wind',friendly:'friend',careful:'care',helpful:'help',shared:'share',listening:'listen',wanted:'want',closed:'close',opened:'open',whispered:'whisper',followed:'follow',finished:'finish',laughed:'laugh',smiled:'smile',cried:'cry',tried:'try',climbed:'climb',jumped:'jump',pulled:'pull',pushed:'push',shouted:'shout',seemed:'seem',turned:'turn'};
function teaching(w){
 if(special[w])return {symbol:special[w][0],tip:special[w][1],pattern:'tricky spelling or meaning'};
 if(contractions[w])return {tip:w+' means '+contractions[w]+'. The apostrophe takes the place of missing letters.',family:contractions[w],pattern:'contraction'};
 if(numbers[w]!==undefined)return {symbol:String(numbers[w]),number:numbers[w],tip:w+' is '+numbers[w]+'. Read the word, then say the number.',pattern:'number word'};
 if(ordinals.includes(w)){const n=ordinals.indexOf(w)+1;return {symbol:n+({1:'st',2:'nd',3:'rd'}[n]||'th'),tip:w+' tells us position '+n+' in an order.',number:n,pattern:'ordinal'};}
 if(irregular[w])return {tip:'Word family: '+irregular[w]+' → '+w+'. Notice how the spelling changes.',family:irregular[w],pattern:'changed word form'};
 if(families[w])return {tip:'Word family: '+families[w]+' → '+w+'. Read the whole word, including its ending.',family:families[w],pattern:'word ending'};
 if(/day$/.test(w))return {tip:'A day of the week. Its name starts with a capital letter.',pattern:'day name'};
 const spelling=['igh','ee','oo','sh','ch','th','ng','ai','ay','oa','ow','ou','ar','or','er','ir','ur','ea'].find(p=>w.toLowerCase().includes(p));
 return {tip:spelling?'Look carefully at “'+spelling+'” in '+w+'. Listen, then read the whole sentence.':'Look at every letter in '+w+'. Listen, say the word, then read the sentence.',pattern:spelling?'letter group '+spelling:'whole word'};
}
const first='has been does us its which these those where why must should under home help give say came put went got eat ate play going goes can\'t didn\'t three four five six seven eight nine ten zero friend school happy'.split(' ');
const source=new Map(proposal.words.map(x=>[x.word,x])),queues=[...new Set(proposal.words.map(x=>x.group))].map(g=>proposal.words.filter(x=>x.group===g&&!first.includes(x.word)));
const ordered=first.map(w=>source.get(w));
// Mix language and topics rather than require a long number-only block.
while(queues.some(q=>q.length))for(const i of [0,0,2,2,3,3,4,5,6,1])if(queues[i].length)ordered.push(queues[i].shift());
assert.equal(ordered.length,800);assert.equal(lessons.size,800);
const entries=ordered.map((r,i)=>{
 const w=r.word,sentence=lessons.get(w);assert(sentence,w);assert(new RegExp('\\b'+w+'\\b','i').test(sentence),w);
 const entry={w,...options(w),sentence,expansion:true,sourceId:r.id,batch:Math.floor(i/100)+1,group:r.group,teaching:teaching(w)};
 // These spellings have multiple spoken readings; use the authored context for
 // standalone Listen/success so device speech receives the intended meaning.
 if(['live','wind','close','lead','reading','present','minute'].includes(w))entry.spoken=sentence;
 return entry;
});
const usedReal=[...new Set(entries.flatMap(x=>x.pool.filter(w=>!x.madeUp.includes(w))).map(w=>w.toLowerCase()))].sort();
if(!fs.existsSync(lexiconPath))fs.writeFileSync(lexiconPath,JSON.stringify(usedReal,null,2)+'\n');
const data=JSON.stringify(entries,null,2)+'\n';fs.writeFileSync(path.join(root,'curriculum/next800-content.json'),data);
let content=fs.readFileSync(path.join(root,'content.js'),'utf8');
content=content.replace(/  \/\/ BEGIN NEXT800[\s\S]*?  \/\/ END NEXT800\n/,'');
const block='  // BEGIN NEXT800 — compiled offline by scripts/build-next800.cjs.\n  const coreWords=words.slice();\n  words.push(...'+JSON.stringify(entries)+');\n  const curriculumSet=new Set(words.map(item=>item.w.toLowerCase()));\n  for(const item of coreWords)item.madeUp=item.madeUp.filter(w=>!curriculumSet.has(w.toLowerCase()));\n  // END NEXT800\n';
content=content.replace('  const teachingSource=',block+'  const teachingSource=');
content=content.replace('return {teachingSource, words,','return {teachingSource, coreWords, words,');
fs.writeFileSync(path.join(root,'content.js'),content);
console.log('Compiled',entries.length,'words and authored sentences; every pool has at least two fair rotating sets.');
