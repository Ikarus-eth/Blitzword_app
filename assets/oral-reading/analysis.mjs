// Automated reading evidence, not a diagnostic or a human-verified running record.
export const tokenize = text => String(text).toLowerCase().replace(/[’‘]/g,"'").match(/[a-z]+(?:'[a-z]+)?|[0-9]+/g) || [];
const finite = (n,min,max) => typeof n==='number' && Number.isFinite(n) && n>=min && n<=max;
export function metadata(input) {
  if(!input || !/^[a-f0-9-]{36}$/.test(input.id||'') || typeof input.passage!=='string' || input.passage.length>8000 || tokenize(input.passage).length<3 || tokenize(input.passage).length>500 || !finite(input.duration,1,180) || !['en-GB','en-US'].includes(input.locale) || !/^\d{4}-\d{2}-\d{2}$/.test(input.recordedOn||'') || !Number.isFinite(Date.parse(input.recordedOn)) || !/^[a-f0-9]{64}$/.test(input.audioHash||'')) throw new Error('Invalid reading submission');
  return {id:input.id,passage:input.passage.trim(),title:String(input.title||'Reading sample').slice(0,100),notes:String(input.notes||'').slice(0,1000),duration:input.duration,locale:input.locale,recordedOn:input.recordedOn,audioHash:input.audioHash,assisted:input.assisted===true,reread:input.reread===true};
}
export function analyze(meta,phrases) {
  if(!Array.isArray(phrases)||!phrases.length||phrases.length>200)throw new Error('No complete speech results');
  const words=[];
  for(const p of phrases){
    if(!Array.isArray(p.words)||!p.words.length||p.words.length>1200)throw new Error('Invalid speech words');
    for(const w of p.words){
      if(typeof w.word!=='string'||w.word.length>100||tokenize(w.word).length!==1||!finite(w.offset,0,meta.duration+.5)||!finite(w.duration,0,meta.duration)||w.offset+w.duration>meta.duration+1||w.accuracy!=null&&!finite(w.accuracy,0,100))throw new Error('Invalid word timing');
      if(words.length&&w.offset<words.at(-1).offset)throw new Error('Out of order word timing');
      words.push({word:w.word,offset:w.offset,duration:w.duration,accuracy:w.accuracy??null,error:w.error==='Mispronunciation'?'pronunciation-check':null});
    }
  }
  if(words.length>1200)throw new Error('Too many speech words');
  const reference=tokenize(meta.passage),spoken=words.map(w=>tokenize(w.word)[0]),n=reference.length,m=words.length;
  // Global alignment keeps omissions, including unread endings, visible. Parent supplies the exact assessed excerpt.
  const d=Array.from({length:n+1},()=>new Uint16Array(m+1));
  for(let i=0;i<=n;i++)d[i][0]=i;for(let j=0;j<=m;j++)d[0][j]=j;
  for(let i=1;i<=n;i++)for(let j=1;j<=m;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(reference[i-1]===spoken[j-1]?0:1));
  let i=n,j=m;const alignment=[];
  while(i||j){
    if(i&&j&&d[i][j]===d[i-1][j-1]+(reference[i-1]===spoken[j-1]?0:1)){
      alignment.push({type:reference[i-1]===spoken[j-1]?'match':'substitution',expected:reference[i-1],heard:words[j-1].word,referenceIndex:i-1,wordIndex:j-1});i--;j--;
    }else if(j&&d[i][j]===d[i][j-1]+1){alignment.push({type:'insertion',heard:words[j-1].word,wordIndex:j-1});j--;}
    else {alignment.push({type:'omission',expected:reference[i-1],referenceIndex:i-1});i--;}
  }
  alignment.reverse();
  const counts={match:0,substitution:0,omission:0,insertion:0};for(const a of alignment)counts[a.type]++;
  const pauses=words.flatMap((w,k)=>k&&w.offset-(words[k-1].offset+words[k-1].duration)>=2?[{before:w.word,wordIndex:k,offset:words[k-1].offset+words[k-1].duration,seconds:w.offset-(words[k-1].offset+words[k-1].duration)}]:[]);
  const span=words.at(-1).offset+words.at(-1).duration-words[0].offset;
  if(span<=0)throw new Error('No timed speech');
  const pronunciationFlags=words.filter(w=>w.error||w.accuracy!=null&&w.accuracy<60).length;
  return {...meta,version:1,source:'azure-speech-sdk-1.52.0',verification:'automated-unreviewed',words,alignment,pauses,summary:{...counts,referenceWords:n,spokenWords:m,speechSpanSeconds:span,recordingSeconds:meta.duration,estimatedCorrectWpm:Math.round(counts.match/span*600)/10,wordMatchPercent:Math.round(counts.match/n*1000)/10,pronunciationFlags,longPauses:pauses.length},limitations:['Word matches are automated estimates, not verified correct reading.','Pronunciation flags are separate from word errors; accent and recognition mistakes need listening review.','Pauses of at least 2 seconds include normal punctuation and do not establish uncertainty.','Repetitions and self-corrections may appear as insertions or be missed by speech recognition.','Speed includes internal pauses, excludes leading/trailing silence; all omitted reference words remain counted.','Results came from the authenticated browser SDK, not a signed Azure assessment.']};
}
