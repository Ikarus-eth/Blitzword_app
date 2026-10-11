import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {metadata,analyze,tokenize} from '../lib/oral-analysis.mjs';
const meta=()=>metadata({id:crypto.randomUUID(),passage:'The small cat sat on the mat.',duration:20,locale:'en-GB',recordedOn:'2026-10-11',audioHash:'a'.repeat(64)});
const phrase=(text,offsets)=>({words:text.split(' ').map((word,i)=>({word,offset:offsets?.[i]??2+i,duration:.5,accuracy:95}))});
test('alignment counts substitutions, omissions and insertions separately',()=>{
 const r=analyze(meta(),[phrase('the big cat sat on the rug')]);assert.equal(r.summary.match,5);assert.equal(r.summary.substitution,2);assert.equal(r.summary.wordMatchPercent,71.4);
 const omission=analyze(meta(),[phrase('the cat sat on the mat')]);assert.equal(omission.summary.omission,1);
 const insertion=analyze(meta(),[phrase('the small cat cat sat on the mat')]);assert.equal(insertion.summary.insertion,1);assert.equal(insertion.summary.match,7);
});
test('speed excludes leading/trailing silence but retains internal pauses; accent flags do not deduct words',()=>{
 const p=phrase('the small cat sat on the mat',[2,3,4,8,9,10,11]);p.words[1].accuracy=40;
 const r=analyze(meta(),[p]);assert.equal(r.summary.speechSpanSeconds,9.5);assert.equal(r.summary.estimatedCorrectWpm,44.2);assert.equal(r.summary.pronunciationFlags,1);assert.equal(r.summary.match,7);assert.equal(r.pauses[0].seconds,3.5);
});
test('timings, oversized clips, bad dates and empty speech are rejected',()=>{
 assert.throws(()=>metadata({...meta(),duration:181}));assert.throws(()=>metadata({...meta(),recordedOn:'bad'}));assert.throws(()=>analyze(meta(),[]));assert.throws(()=>analyze(meta(),[phrase('the small cat',[5,2,3])])) ;assert.throws(()=>analyze(meta(),[phrase('the small cat',[2,3,99])])) ;
});
test('unread endings remain omissions; apostrophes and case normalize',()=>{
 assert.deepEqual(tokenize('I’m HERE!'),["i'm",'here']);const r=analyze(meta(),[phrase('the small cat')]);assert.equal(r.summary.omission,4);assert.equal(r.summary.wordMatchPercent,42.9);
});
test('browser and server analysis use identical code',()=>assert.equal(readFileSync(new URL('../lib/oral-analysis.mjs',import.meta.url),'utf8'),readFileSync(new URL('../../assets/oral-reading/analysis.mjs',import.meta.url),'utf8')));
