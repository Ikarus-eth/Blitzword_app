/* Optional stories share only the parent access setting; their own saves stay untouched. */
(function(){
  'use strict';
  function check(){
    let enabled=false;
    try{enabled=JSON.parse(localStorage.getItem('blitzword_state_v1'))?.settings?.storiesEnabled===true;}catch(error){}
    if(!enabled){document.documentElement.hidden=true;location.replace(new URL('../',document.currentScript?.src||new URL('../activity-access.js',location.href)).href);}
  }
  check();
  window.addEventListener('pageshow',check);
  window.addEventListener('storage',event=>{if(event.key==='blitzword_state_v1'||event.key===null)check();});
})();
