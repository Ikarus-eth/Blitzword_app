// Rebuild runtime metadata from the reviewed mapping; never calls a provider.
const fs=require('fs');const p='assets/teaching/200-400/visuals.js';let s=fs.readFileSync(p,'utf8');const data=JSON.parse(fs.readFileSync('docs/teaching-200-400/VISUAL_MAPPING.json','utf8'));s=s.replace(/const words=.*;\nconst source=/,'const words='+JSON.stringify(data)+';\nconst source=');fs.writeFileSync(p,s);
