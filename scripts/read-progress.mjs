#!/usr/bin/env node
// Node 22+. The key is read from stdin (never put it in a URL or command argument).
import {decryptReport} from '../sync-service/lib/github-mirror.mjs';
import {readFile} from 'node:fs/promises';
const input=[];for await(const chunk of process.stdin)input.push(chunk);
const secret=Buffer.concat(input).toString().trim();
try {
 const path=process.argv[2];
 let envelope;
 if(path)envelope=JSON.parse(await readFile(path,'utf8'));
 else{
  const response=await fetch('https://raw.githubusercontent.com/Ikarus-eth/Blitzword_app/refs/heads/progress-data/latest.enc.json?fresh='+Date.now(),{cache:'no-store'});
  if(!response.ok)throw new Error('Encrypted report fetch failed: '+response.status);
  envelope=await response.json();
 }
 const report=await decryptReport(envelope,secret);
 process.stdout.write(JSON.stringify(report,null,2)+'\n');
}catch(error){process.stderr.write('Progress could not be read: '+error.message+'\n');process.exitCode=1;}
