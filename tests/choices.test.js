const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const zlib=require('node:zlib');
const Core=require('../game-core.js');
const Content=require('../content.js');
const START=Date.UTC(2026,8,24,10);
const DRAWS=400;
const seeded=seed=>()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
// Near-miss words a child must never meet as an answer option: rude words, slurs, violence and unkind words.
const BLOCKED=new Set(`ass arse bum butt boob bra cock cok dick dik cum cunt fag fuck fuk shit crap piss pee poo poop turd
  fart tit tits twat slut whore hoe ho nig nigga nigger coon spic kike chink gook wop dyke homo jap paki retard tranny nazi
  rape porn sex sexy nude damn hell kill die dead death gun drug beer wine gin rum ale vodka weed bitch bastard pussy nob knob
  bod bust wank jizz spunk scum slag sod bloody bugger jerk moron idiot stupid dumb hate ugly fat lame drown`.split(/\s+/));

// Independent versions of the fairness checks, so a mistake in game-core.js cannot hide itself.
function distance(a,b){ // fewest inserts, deletes, letter changes and neighbour swaps; each counts one
  const memo=new Map();
  const go=(i,j)=>{
    if(!i||!j)return i+j;
    const key=i*100+j;if(memo.has(key))return memo.get(key);
    let best=Math.min(go(i-1,j)+1,go(i,j-1)+1,go(i-1,j-1)+(a[i-1]===b[j-1]?0:1));
    if(i>1&&j>1&&a[i-1]===b[j-2]&&a[i-2]===b[j-1])best=Math.min(best,go(i-2,j-2)+1);
    memo.set(key,best);return best;
  };
  return go(a.length,b.length);
}
function middleChance(options,target){ // the option closest to the other three, ties split evenly
  const totals=options.map(o=>options.reduce((sum,p)=>sum+distance(o,p),0)),low=Math.min(...totals);
  const tied=options.filter((o,i)=>totals[i]===low);
  return tied.includes(target)?1/tied.length:0;
}
function clues(options,target){
  const first=o=>o[0]===target[0],last=o=>o.at(-1)===target.at(-1);
  return {first:options.filter(first).length,last:options.filter(last).length,
    both:options.filter(o=>first(o)&&last(o)).length,length:options.filter(o=>o.length===target.length).length};
}
function giveaways(options,target){ // target positions whose letter no wrong option shares
  const wrong=options.filter(o=>o!==target);
  return [...target].flatMap((letter,i)=>wrong.some(o=>o[i]===letter)?[]:[i]);
}

// Reads one file from the curriculum workbook (a zip file) with Node's zlib only.
function unzip(file,name){
  const zip=fs.readFileSync(file),end=zip.lastIndexOf(Buffer.from([0x50,0x4b,5,6]));
  for(let at=zip.readUInt32LE(end+16),n=zip.readUInt16LE(end+10);n>0;n--){
    const size=zip.readUInt32LE(at+20),nameLength=zip.readUInt16LE(at+28);
    if(zip.toString('utf8',at+46,at+46+nameLength)===name){
      const local=zip.readUInt32LE(at+42),start=local+30+zip.readUInt16LE(local+26)+zip.readUInt16LE(local+28);
      const data=zip.subarray(start,start+size);
      return (zip.readUInt16LE(at+10)===8?zlib.inflateRawSync(data):data).toString('utf8');
    }
    at+=46+nameLength+zip.readUInt16LE(at+30)+zip.readUInt16LE(at+32);
  }
  throw new Error(name+' is missing from '+file);
}
function curriculumWords(){
  const file=path.join(__dirname,'..','curriculum','BLITZWORD_CURRICULUM_200_1000.xlsx');
  const sheet=unzip(file,'xl/workbook.xml').split(/<(?:\w+:)?sheet /).find(x=>x.startsWith('name="BlitzWord 1000"'));
  const id=sheet.match(/r:id="([^"]+)"/)[1];
  const target=unzip(file,'xl/_rels/workbook.xml.rels').split('<Relationship ').find(x=>x.includes(`Id="${id}"`)).match(/Target="([^"]+)"/)[1];
  const xml=unzip(file,target.startsWith('/')?target.slice(1):'xl/'+target);
  const text=s=>s.replace(/&(amp|apos|quot|lt|gt);/g,(m,e)=>({amp:'&',apos:"'",quot:'"',lt:'<',gt:'>'})[e]);
  return new Set([...xml.matchAll(/<(?:\w+:)?c r="B(\d+)"[^>]*>\s*<(?:\w+:)?v>([^<]*)</g)]
    .filter(([,row])=>row!=='1').map(([,,word])=>text(word).trim().toLowerCase()));
}

// The same seeded draws feed the checks below: DRAWS questions for each of the 200 words.
const random=seeded(20260924),checked=new Map();
const draws=Content.words.map(item=>({item,questions:Array.from({length:DRAWS},()=>Core.chooseOptions(item,random))}));
function check(options,target){
  const key=target+'|'+[...options].sort().join(' ');
  if(!checked.has(key))checked.set(key,{clues:clues(options,target),giveaways:giveaways(options,target),middle:middleChance(options,target)});
  return checked.get(key);
}

test('the fairness checks match game-core on known sets',()=>{
  assert.equal(Core.editDistance('night','nigth'),1);assert.equal(distance('night','nigth'),1);
  assert.equal(Core.editDistance('rock','lick'),2);assert.equal(distance('rock','lick'),2);
  const old=['rock','lock','rack','ruck'],rhyme=['night','light','right','might'],square=['rock','rack','lock','lack'];
  assert.equal(Core.middleGuess(old,'rock'),1);assert.equal(middleChance(old,'rock'),1);
  assert.equal(Core.oneLetterGiveaway(rhyme,'night'),true);assert.deepEqual(giveaways(rhyme,'night'),[0]);
  assert.equal(Core.middleGuess(square,'rock'),.25);assert.equal(Core.fairChoice(square,'rock'),true);
  assert.equal(Core.fairChoice(old,'rock'),false);assert.equal(Core.fairChoice(rhyme,'night'),false);
  for(const {item,questions} of draws.slice(0,40))for(const options of questions.slice(0,20)){
    assert.equal(Core.middleGuess(options,item.w),middleChance(options,item.w),item.w+' '+options);
  }
});

test('every practice word has five to seven wrong-answer candidates',()=>{
  assert.equal(Content.words.length,200);
  for(const item of Content.words){
    assert.ok(item.pool.length>=5&&item.pool.length<=7,`${item.w} has ${item.pool.length} candidates`);
    assert.equal(new Set(item.pool).size,item.pool.length,item.w+' repeats a candidate');
    assert.ok(!item.pool.includes(item.w),item.w+' lists itself');
    assert.ok(item.pool.every(w=>/^[a-z']+$/.test(w)),item.w);
    assert.ok(item.madeUp.every(w=>item.pool.includes(w)),item.w);
  }
});

test('every candidate can be drawn, and every word has two or more fair sets',()=>{
  for(const item of Content.words){
    const sets=Core.choiceSets(item),used=new Set(sets.flatMap(x=>x.set));
    assert.deepEqual(item.pool.filter(w=>!used.has(w)),[],item.w+' has a candidate that is never drawn');
    assert.ok(sets.length>=2,item.w);
  }
});

test('(i) in every sampled question, first letter, last letter, both, and length each match two or more options',()=>{
  for(const {item,questions} of draws)for(const options of questions){
    const target=item.w;
    assert.equal(options.length,4,target);assert.equal(new Set(options).size,4,target);
    assert.ok(options.every(o=>o===target||item.pool.includes(o)),target+' '+options);
    assert.ok(options.includes(target),target);
    // "a" and "i" are single letters, so they are shown with three other single letters.
    if(target.length===1){assert.ok(options.every(o=>o.length===1),target+' '+options);continue;}
    const result=check(options,target);
    for(const [name,count] of Object.entries(result.clues))assert.ok(count>=2,`${target} ${options}: ${name} matches ${count}`);
    assert.deepEqual(result.giveaways,[],`${target} ${options}: one letter gives the answer away`);
  }
});

test('(ii) the "middle option" guess finds the answer in at most 35% of sampled questions across all 200 words',t=>{
  let sum=0,count=0;
  for(const {item,questions} of draws)for(const options of questions){
    const middle=check(options,item.w).middle;
    assert.ok(middle<=.5,`${item.w} ${options}: middle guess ${middle}`);
    sum+=middle;count++;
  }
  const rate=sum/count,old=Content.words.reduce((n,item)=>n+middleChance(item.d,item.w),0)/Content.words.length;
  t.diagnostic(`middle guess ${(rate*100).toFixed(1)}% now, ${(old*100).toFixed(1)}% with the old fixed options`);
  assert.ok(rate<=.35,`middle guess ${rate}`);
  assert.ok(old>.85,'the same check catches the old fixed options');
});

test('wrong answers and the answer position rotate between questions',()=>{
  for(const {item,questions} of draws){
    const sets=new Set(questions.map(o=>o.filter(w=>w!==item.w).sort().join(' '))),seen=new Set(questions.flat());
    assert.ok(sets.size>=2,item.w);
    assert.deepEqual(item.pool.filter(w=>!seen.has(w)),[],item.w+' candidate never shown');
    assert.equal(new Set(questions.map(o=>o.indexOf(item.w))).size,4,item.w+' answer position');
  }
});

test('made-up wrong answers are never curriculum words, and no wrong answer is on the blocked list',()=>{
  const curriculum=curriculumWords();
  assert.equal(curriculum.size,1000);
  for(const item of Content.words){
    assert.ok(curriculum.has(item.w),item.w+' is missing from the curriculum sheet');
    for(const w of item.madeUp){
      assert.ok(!curriculum.has(w),`${item.w}: made-up "${w}" is a curriculum word`);
      assert.ok(w.length===1||/[aeiouy]/.test(w),`${item.w}: made-up "${w}" has no vowel`);
    }
    for(const w of item.pool)assert.ok(!BLOCKED.has(w),`${item.w}: "${w}" is blocked`);
  }
});

test('new practice questions draw fair sets; saved questions keep their options; the reading check keeps its fixed options',()=>{
  const roundtrip=s=>Core.migrate(JSON.parse(JSON.stringify(s)));
  let s=Core.migrate(Core.fresh());s.profile.name='Choice tester';s.assessment.done=true;Core.startBattle(s,START);
  const q=Core.prepareBattle(s,START,seeded(5)),item=Core.byWord[q.target];
  assert.ok(q.options.every(o=>o===q.target||item.pool.includes(o)),q.target+' '+q.options);
  assert.ok(Core.fairChoice(q.options,q.target)||q.target.length===1);
  // A question saved before this change shows its old options after reload.
  q.options=[...item.d].reverse();const before=[...q.options];
  s=roundtrip(s);
  assert.deepEqual(Core.prepareBattle(s,START+1000,seeded(6)).options,before);

  let r=Core.migrate(Core.fresh());Core.startAssessment(r,START);
  const first=Core.prepareAssessment(r,START,seeded(7)),fixed=Content.assessmentPools.flat().find(x=>x.w===first.target);
  assert.deepEqual([...first.options].sort(),[...fixed.d].sort());
  const saved=[...first.options];r=roundtrip(r);
  assert.deepEqual(Core.prepareAssessment(r,START+1000,seeded(8)).options,saved);
  for(const x of Content.assessmentPools.flat())assert.deepEqual([...Core.chooseOptions(x,seeded(9))].sort(),[...x.d].sort(),x.w);
  for(const x of Content.legacyWords)assert.deepEqual([...Core.chooseOptions(x,seeded(9))].sort(),[...x.d].sort(),x.w);
});
