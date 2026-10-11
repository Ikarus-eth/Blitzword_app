const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const script=fs.readFileSync(require('node:path').join(__dirname,'../assets/activity-access.js'),'utf8');
for(const setting of [undefined,false,true])test('standalone story access: '+setting,()=>{
 const callbacks={},redirects=[],document={documentElement:{hidden:false},currentScript:{src:'https://example.org/Blitzword_app/assets/activity-access.js'}};
 let saved=JSON.stringify({settings:{storiesEnabled:setting}});
 const ctx={URL,document,localStorage:{getItem:()=>saved},location:{href:'https://example.org/Blitzword_app/assets/story-pilot/',replace:url=>redirects.push(url)},window:{addEventListener:(name,fn)=>callbacks[name]=fn}};
 vm.runInNewContext(script,ctx);
 assert.equal(redirects.length,setting===true?0:1);
 if(setting!==true)assert.equal(redirects[0],'https://example.org/Blitzword_app/');
 saved=JSON.stringify({settings:{storiesEnabled:false}});document.currentScript=null;callbacks.storage({key:'blitzword_state_v1'});
 assert.equal(redirects.at(-1),'https://example.org/Blitzword_app/');assert.equal(document.documentElement.hidden,true);
});
