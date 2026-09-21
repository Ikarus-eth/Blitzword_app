(function(root,factory) {
  if(typeof module==='object'&&module.exports) module.exports=factory(require('./game-core.js'));
  else root.BlitzStorage=factory(root.BlitzCore);
})(typeof globalThis!=='undefined'?globalThis:this,function(Core) {
  'use strict';
  const KEY='blitzword_state_v1';
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
  }
  return {AdventureStore,KEY};
});
