(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('../wimmelbild/quest-data'));else root.AtlasCore=factory(root.BlitzMapQuests);})(typeof globalThis!=='undefined'?globalThis:this,function(Maps){
'use strict';
const KEY='blitzword.hidden-atlas.v1',fresh=()=>({version:1,maps:{}}),blank=()=>({index:0,lives:4,selection:null,wrong:false});
function restore(s){if(!s||s.version!==1||!s.maps||typeof s.maps!=='object'||Array.isArray(s.maps))throw Error('Invalid atlas save');const out=fresh();for(const id of Object.keys(Maps)){const p=s.maps[id];if(!p)continue;if(!Number.isInteger(p.index)||p.index<0||p.index>3||!Number.isInteger(p.lives)||p.lives<0||p.lives>4||typeof p.wrong!=='boolean'||(p.selection!==null&&!Maps[id].questions[Math.min(p.index,2)].options.some(o=>o.id===p.selection)))throw Error('Invalid map progress');out.maps[id]={index:p.index,lives:p.lives,selection:p.selection,wrong:p.wrong};}return out;}
function start(s,id){if(!Maps[id])return false;s.maps[id] ||=blank();return true;}
function choose(s,id,choice,index){const p=s.maps[id],q=Maps[id]?.questions[p?.index];if(!p||!q||p.index!==index||p.lives===0||!q.options.some(o=>o.id===choice))return false;p.selection=choice;p.wrong=false;return true;}
function check(s,id,index){const p=s.maps[id],q=Maps[id]?.questions[p?.index];if(!p||!q||p.index!==index||p.lives===0||p.wrong||!q.options.some(o=>o.id===p.selection))return false;if(p.selection!==q.answer){p.lives--;p.wrong=true;return {correct:false};}p.index++;p.selection=null;p.wrong=false;return {correct:true,complete:p.index===3};}
function retry(s,id){const p=s.maps[id];if(!p||p.lives!==0||p.index===3)return false;p.lives=4;p.wrong=false;p.selection=null;return true;}
function replay(s,id){if(s.maps[id]?.index!==3)return false;s.maps[id]=blank();return true;}
return {KEY,Maps,fresh,restore,start,choose,check,retry,replay};
});
