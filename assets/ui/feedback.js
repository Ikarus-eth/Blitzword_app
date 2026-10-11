(function(root){
  'use strict';
  let current=null;
  function close(){if(!current)return;const {layer,previous,key,background}=current;current=null;document.removeEventListener('keydown',key);layer.remove();for(const e of background)e.removeAttribute('inert');if(previous?.isConnected)previous.focus?.();}
  function show({title,message,detail='',kind='success',content=null,actions=[{label:'Continue'}],onClose=()=>{}}){
    close();const previous=document.activeElement;
    const el=(tag,cls,text)=>{const e=document.createElement(tag);e.className=cls;if(text)e.textContent=text;return e;};
    const layer=el('div','questDialogLayer'),card=el('section','questDialog '+kind);
    card.setAttribute('role','dialog');card.setAttribute('aria-modal','true');card.setAttribute('aria-labelledby','questDialogTitle');card.setAttribute('aria-describedby','questDialogMessage');
    const crest=el('div','questDialogCrest');crest.setAttribute('aria-hidden','true');
    crest.innerHTML='<svg viewBox="0 0 48 48"><path d="M24 5L39 12V25Q37 36 24 43Q11 36 9 25V12Z"/><path d="'+(kind==='retry'?'M15 27Q14 15 25 15Q35 15 34 27M14 20L15 28L23 25':'M16 24L22 30L33 18')+'"/></svg>';
    const heading=el('h1','',title);heading.id='questDialogTitle';const copy=el('p','questDialogMessage',message);copy.id='questDialogMessage';
    card.append(crest,heading,copy);if(detail)card.append(el('p','questDialogDetail',detail));if(content)card.append(content);
    const controls=el('div','questDialogActions');
    actions.forEach(action=>{const b=el('button','questDialogButton',action.label);b.type='button';b.onclick=()=>{if(current?.layer!==layer)return;if(action.run?.()===false)return;close();onClose();};controls.append(b);});card.append(controls);layer.append(card);
    const key=e=>{if(e.key==='Escape'){e.preventDefault();return;}if(e.key!=='Tab')return;const nodes=[...card.querySelectorAll('button:not([disabled]),[tabindex="0"]')];if(!nodes.length)return;const first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}};
    const background=[...document.body.children].filter(e=>!e.hasAttribute('inert'));for(const e of background)e.setAttribute('inert','');
    current={layer,previous,key,background};document.body.append(layer);document.addEventListener('keydown',key);(card.querySelector('button')||card).focus?.();return card;
  }
  root.BlitzFeedback={show,close,isOpen:()=>!!current};
})(typeof window==='object'?window:globalThis);
