/* This preview never imports app.js/storage.js or reads/writes learner data. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id), motion = matchMedia('(prefers-reduced-motion: reduce)');
  const rig = BlitzArcherStudy.create($('archer'));
  let frame = null, time = 0, start = 0, startTime = 0;
  $('enemy').innerHTML = BlitzEnemyArt.render('thornling', { prefix: '../../../' });
  const enemySVG = $('enemy').querySelector('svg');
  enemySVG.setAttribute('x', '708'); enemySVG.setAttribute('y', '197');
  enemySVG.setAttribute('width', '270'); enemySVG.setAttribute('height', '290');
  function stop() { if (frame !== null) cancelAnimationFrame(frame); frame = null; $('play').innerHTML = 'Play attack <span aria-hidden="true">↗</span>'; }
  function paint(ms) {
    time = Math.max(0, Math.min(1200, Number(ms) || 0));
    const p = rig.paint(time, { bones: $('bones').checked, reducedMotion: motion.matches });
    $('time').value = time; $('phase').textContent = motion.matches ? 'Still · reduced motion' : p.phase;
    const recoil = p.impact ? Math.sin((time - 660) / 220 * Math.PI) : 0;
    $('enemy').setAttribute('transform', `translate(${recoil * 12} ${-recoil * 4})`);
    $('impact').innerHTML = p.impact ? `<g transform="translate(793 391)" opacity="${1 - (time - 660) / 220}"><circle r="${10 + (time - 660) / 8}" fill="none" stroke="#fff4b3" stroke-width="3"/><path d="M-19 0H-9M9 0H19M0 -19V-9M0 9V19" stroke="#ffdf81" stroke-width="3"/></g>` : '';
    return p;
  }
  function tick(now) {
    const ms = startTime + (now - start) * Number($('speed').value);
    paint(ms);
    if (ms >= 1200) stop(); else frame = requestAnimationFrame(tick);
  }
  $('play').onclick = () => {
    if (frame !== null) { stop(); return; }
    if (motion.matches) { paint(0); return; }
    startTime = time >= 1200 ? 0 : time; start = performance.now();
    $('play').textContent = 'Pause'; frame = requestAnimationFrame(tick);
  };
  $('reset').onclick = () => { stop(); paint(0); };
  $('time').oninput = () => { stop(); paint($('time').value); };
  $('speed').onchange = () => { if (frame !== null) { startTime = time; start = performance.now(); } };
  $('bones').onchange = () => paint(time);
  $('closeup').onchange = () => { $('stage').setAttribute('viewBox', $('closeup').checked ? '105 40 335 455' : '0 0 1000 540'); };
  document.querySelectorAll('[data-ms]').forEach(button => { button.onclick = () => { stop(); paint(button.dataset.ms); }; });
  function motionChanged() {
    stop(); paint(0); $('play').disabled = motion.matches;
    $('motionNote').textContent = motion.matches ? 'Reduced motion is on. The archer stays still.' : 'One attack takes 1.2 seconds. Drag the timeline to inspect any pose.';
  }
  motion.addEventListener('change', motionChanged);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  window.addEventListener('pagehide', stop);
  motionChanged();
})();
