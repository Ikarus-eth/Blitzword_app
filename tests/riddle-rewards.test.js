const test=require('node:test'),assert=require('node:assert/strict');
const C=require('../game-core'),A=C.Adventure,S=require('../storage');
const NOW=new Date(2026,9,7,12).getTime();
function puzzle(){const s=C.migrate(C.fresh());s.profile.name='Reader';s.assessment.done=true;C.startMission(s,'first-spark',NOW);C.startMissionBattle(s,NOW);s.battle.enemyHealth=0;C.resolveBattle(s,NOW);A.startPuzzle(s);return s;}
function solve(s,now=NOW){const p=s.expedition.current.puzzle;for(const id of [A.Data.puzzles[p.id].answer].flat())A.choose(s,id);return C.checkRiddle(s,now);}
test('thinking time caps at three minutes for the whole riddle, surviving backup, retries and hints',()=>{
 let s=puzzle();assert.equal(C.recordRiddleTime(s,150000,NOW),150000);
 s=S.readBackup(S.backupFile(s).text).state;s.expedition.current.puzzle.hint=true;
 assert.equal(C.recordRiddleTime(s,90000,NOW+90000),30000);assert.equal(A.report(s).riddleMs,180000);
 A.retreat(s,true);A.retry(s);s.expedition.current.phase='spoils';A.startPuzzle(s);assert.equal(C.recordRiddleTime(s,60000,NOW+150000),0);
 solve(s);assert.equal(C.recordRiddleTime(s,60000,NOW+210000),0);
});
test('combined reading, maths and riddle time unlocks daily XP and boosts both riddles and fights once',()=>{
 let s=puzzle();C.recordTime(s,360000,'practice',NOW-60000);C.recordTime(s,60000,'math',NOW);
 assert.equal(C.bonusProgress(s,NOW).active,false);C.recordRiddleTime(s,180000,NOW+180000);
 assert.equal(C.bonusProgress(s,NOW+180000).activeMs,600000);assert.equal(s.rewards.xpDays[C.dayKey(NOW)].daily,20);
 const xp=s.dragon.xp;s.expedition.current.puzzle.listened=true;s.expedition.current.puzzle.hint=true;solve(s,NOW+180000);
 assert.equal(s.dragon.xp-xp,88);assert.equal(s.expedition.current.puzzle.xpEarned,88);
 s=C.migrate(C.copy(s));const earned=s.dragon.xp;assert.equal(C.checkRiddle(s,NOW+180000),false);assert.equal(s.dragon.xp,earned);
 A.next(s,NOW);C.startMissionBattle(s,NOW+181000);const q=C.prepareBattle(s,NOW+181000);q.phase='choices';q.supportReasons=[];
 assert.ok(C.answerBattle(s,q.target,NOW+182000).xpEarned>=5);
 assert.equal(s.rewards.xpDays[C.dayKey(NOW)].daily,20);
});
test('ordinary solves give 50 XP; reveal, duplicate submit and replay cannot farm XP',()=>{
 let s=puzzle(),xp=s.dragon.xp;solve(s);assert.equal(s.dragon.xp-xp,50);assert.equal(C.checkRiddle(s,NOW),false);
 s.expedition.current.phase='spoils';A.startPuzzle(s);xp=s.dragon.xp;solve(s);assert.equal(s.dragon.xp,xp);
 s=puzzle();A.choose(s,'red');C.checkRiddle(s,NOW);xp=s.dragon.xp;C.checkRiddle(s,NOW,{reveal:true});assert.equal(s.dragon.xp,xp);
});
test('midnight splits riddle credit, resets boost and includes previous riddle days in consistency',()=>{
 const s=puzzle(),midnight=new Date(2026,9,8).getTime();C.recordTime(s,599000,'practice',midnight-2000);
 C.recordRiddleTime(s,4000,midnight+1000);
 assert.equal(s.expedition.riddleDays[C.dayKey(midnight-1)],3000);assert.equal(s.expedition.riddleDays[C.dayKey(midnight)],1000);
 assert.equal(s.rewards.xpDays[C.dayKey(midnight-1)].daily,20);assert.equal(C.bonusProgress(s,midnight+1000).active,false);
 assert.equal(C.bonusProgress(s,midnight+1000).consistencyXP,10);
});
test('parent grant is exactly 1000, repeatable, persisted, separate from learning and battle XP, and supports growth',()=>{
 let s=puzzle();assert.equal(C.grantParentXP(s,NOW),0);s.screen='parentDashboard';s.dragon.xp=14500;
 const battleXP=s.battle.xpEarned,learning=C.copy(s.learning),timing=C.copy(s.timing);C.grantParentXP(s,NOW);
 assert.equal(s.dragon.xp,15500);assert.equal(s.dragon.stage,1);assert.equal(s.battle.xpEarned,battleXP);
 assert.deepEqual(s.learning,learning);assert.deepEqual(s.timing,timing);s=S.readBackup(S.backupFile(s).text).state;
 C.grantParentXP(s,NOW);assert.equal(s.dragon.xp,16500);assert.equal(s.rewards.xpDays[C.dayKey(NOW)].parent,2000);
});
