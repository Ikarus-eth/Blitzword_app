const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const qa=require('./narration-qa.js'),root=path.join(__dirname,'..');
test('narration QA has 42 unique representative local clips',()=>{
 assert.equal(qa.SAMPLES.length,42);assert.equal(new Set(qa.SAMPLES.map(x=>x.id)).size,42);
 const groups=new Map();
 for(const sample of qa.SAMPLES){
  assert.ok(sample.text&&sample.group&&sample.method&&sample.file,sample.id);
  const file=path.join(root,sample.file);assert.ok(fs.existsSync(file),sample.file);assert.ok(fs.statSync(file).size>1000,sample.file);
  groups.set(sample.group,(groups.get(sample.group)||0)+1);
 }
 assert.equal(groups.get('Gate review'),5);assert.equal(groups.get('Pip evolution'),4);assert.ok(groups.get('Assembled phrase')>=6);assert.equal(groups.get('Existing Tom word · round 2'),12);
});
test('narration QA summary and copied report keep bad notes and unrated clips explicit',()=>{
 const state={};state[qa.SAMPLES[0].id]={rating:'good'};state[qa.SAMPLES[1].id]={rating:'bad',note:'odd pause'};
 assert.deepEqual(qa.summarize(state),{rated:2,bad:1,good:1,total:42,complete:false});
 const report=qa.reportText(state);assert.match(report,/Reviewed 2\/42/);assert.match(report,/odd pause/);assert.match(report,/UNRATED \(40\)/);
});

test('narration QA mounts in a browser document and wires the Play button',()=>{
 const {parseHTML}=require('linkedom'),html=fs.readFileSync(path.join(__dirname,'narration-qa.html'),'utf8');
 const {document,window}=parseHTML(html),data={};
 Object.defineProperty(window,'localStorage',{value:{getItem:key=>data[key]||null,setItem:(key,value)=>{data[key]=String(value);}}});
 const player=document.getElementById('qaPlayer');player.pause=()=>{};player.play=()=>Promise.resolve();
 qa.mount(document);
 assert.equal(document.getElementById('qaText').textContent,'on');
 assert.equal(document.getElementById('qaGroup').textContent,'Existing Tom word');
 assert.equal(document.getElementById('qaProgress').textContent,'1 / 42');
 assert.equal(typeof document.getElementById('qaPlay').onclick,'function');
 assert.equal(typeof document.getElementById('qaGood').onclick,'function');
});

