(function(root,factory) {
  if(typeof module==='object'&&module.exports) module.exports=factory(require('./game-core.js'));
  else root.BlitzStorage=factory(root.BlitzCore);
})(typeof globalThis!=='undefined'?globalThis:this,function(Core) {
  'use strict';
  const KEY='blitzword_state_v1';
  const BACKUP_FORMAT='blitzword-backup',BACKUP_VERSION=1,BACKUP_LIMIT=20*1024*1024;
  function problem(message,code){const e=new Error(message);e.code=code;return e;}
  class AdventureStore {
    constructor(storage){this.storage=storage;this.expected=null;this.recovered=false;}
    load(){
      let raw,backup;
      try{raw=this.storage.getItem(KEY);backup=this.storage.getItem(KEY+'_backup');}
      catch(e){throw problem('This browser is not allowing progress to be saved.','storage');}
      this.expected=raw;
      if(raw===null&&backup===null)return Core.migrate(Core.fresh());
      try{if(raw===null)throw new Error();return Core.migrate(JSON.parse(raw));}
      catch(e){try{if(!backup)throw new Error();const s=Core.migrate(JSON.parse(backup));this.recovered=true;return s;}
        catch(err){throw problem('The saved adventure could not be read. It has been kept unchanged.','corrupt');}}
    }
    save(state){
      try{
        if(this.storage.getItem(KEY)!==this.expected)throw problem('Another tab updated this adventure. Reload to use its saved progress.','conflict');
        const next={...state,revision:state.revision+1},payload=JSON.stringify(next);
        if(this.expected){
          if(this.recovered)this.storage.setItem(KEY+'_unreadable_backup',this.expected);
          else{
            if(JSON.parse(this.expected).schemaVersion!==2&&!this.storage.getItem(KEY+'_legacy_backup'))this.storage.setItem(KEY+'_legacy_backup',this.expected);
            this.storage.setItem(KEY+'_backup',this.expected);
          }
        }
        this.storage.setItem(KEY,payload);this.expected=payload;this.recovered=false;state.revision=next.revision;
      }catch(e){if(e.code)throw e;throw problem('Progress could not be saved. Keep this tab open and try saving again.','storage');}
    }
    // Replace the save with a checked backup. The current save is kept first; a failed write changes nothing.
    restore(state,currentRevision=0){
      let current,previous;
      try{current=this.storage.getItem(KEY);previous=this.storage.getItem(KEY+'_before_restore');}
      catch(e){throw problem('This browser is not allowing progress to be saved.','storage');}
      if(current!==this.expected)throw problem('Another tab updated this adventure. Reload to use its saved progress.','conflict');
      if(this.recovered)throw problem('Progress could not be saved. Keep this tab open and try saving again.','storage');
      const payload=JSON.stringify({...state,revision:Math.max(Number(state.revision)||0,Number(currentRevision)||0)+1});
      try{if(current!==null)this.storage.setItem(KEY+'_before_restore',current);}
      catch(e){throw problem('There is not enough space on this device to keep a copy of the current progress. Nothing was changed.','space');}
      try{this.storage.setItem(KEY,payload);}
      catch(e){
        try{if(current!==null){if(previous===null)this.storage.removeItem(KEY+'_before_restore');else this.storage.setItem(KEY+'_before_restore',previous);}}catch(err){}
        throw problem('There is not enough space on this device to restore this backup. Nothing was changed.','space');
      }
      this.expected=payload;this.recovered=false;return payload;
    }
  }
  const isRecord=value=>!!value&&typeof value==='object'&&!Array.isArray(value);
  // The file holds the whole save plus when and by which build it was made.
  function backupFile(state,{now=Date.now(),build=''}={}){
    const d=new Date(now),pad=n=>String(n).padStart(2,'0');
    const stamp=d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())+'-'+pad(d.getHours())+pad(d.getMinutes());
    const who=String(state.profile?.name||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Za-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,24);
    return {name:'blitzword-backup-'+(who?who+'-':'')+stamp+'.json',
      text:JSON.stringify({format:BACKUP_FORMAT,version:BACKUP_VERSION,exportedAt:d.toISOString(),build,storageKey:KEY,state})};
  }
  // Accept a backup file or a raw save. Any other JSON is refused, because migrate() would turn it into an empty adventure.
  function readBackup(text){
    const refuse=message=>problem(message+' Nothing was changed.','backup');
    if(typeof text!=='string'||text.length>BACKUP_LIMIT)throw refuse('This file is too large to be a BlitzWord backup.');
    let data;try{data=JSON.parse(text);}catch(e){throw refuse('This file is not a BlitzWord backup.');}
    let saved=data,exportedAt=null;
    if(isRecord(data)&&data.format===BACKUP_FORMAT){
      if(data.version!==BACKUP_VERSION)throw refuse('This backup was made by a newer version of BlitzWord.');
      saved=data.state;if(typeof data.exportedAt==='string'&&Number.isFinite(Date.parse(data.exportedAt)))exportedAt=data.exportedAt;
    }
    if(!isRecord(saved)||!isRecord(saved.profile)||!['assessment','learning','campaign'].some(key=>isRecord(saved[key])))throw refuse('This file is not a BlitzWord backup.');
    if(saved.schemaVersion!==undefined&&saved.schemaVersion!==1&&saved.schemaVersion!==2){
      throw refuse(Number(saved.schemaVersion)>2?'This backup was made by a newer version of BlitzWord.':'This file is not a BlitzWord backup.');
    }
    try{return {state:Core.migrate(saved),exportedAt};}catch(e){throw refuse('This backup could not be read.');}
  }
  function backupSummary(state,now=Date.now()){
    return {name:state.profile.name||'No name yet',xp:Math.floor(Number(state.dragon.xp)||0),
      words:Core.parentProgress(state,now).introduced,chapters:state.story.clearedAreas.length};
  }
  return {AdventureStore,KEY,BACKUP_LIMIT,backupFile,readBackup,backupSummary};
});
