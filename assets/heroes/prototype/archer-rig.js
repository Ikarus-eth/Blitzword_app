/* Archer study. A reusable painted rig; no game state or storage dependencies. */
(function (root) {
  'use strict';
  const DURATION = 1200, RELEASE = 500, IMPACT = 660;
  const atlas = 'assets/heroes/prototype/archer-boy-parts.png';
  // Source rectangles measured from the generated alpha, not assumed grid cells.
  const cells = {
    head: [28, 17, 296, 298], torso: [361, 25, 268, 348],
    cape: [661, 10, 345, 372], quiver: [1010, 19, 217, 337],
    bowUpper: [77, 380, 140, 254], bowLower: [398, 382, 149, 266],
    drawUpper: [704, 383, 150, 255], drawLower: [1055, 382, 131, 267],
    grip: [104, 742, 107, 131], draw: [404, 739, 162, 99],
    open: [714, 745, 188, 132], bow: [1098, 640, 65, 309],
    farThigh: [80, 945, 156, 289], farBoot: [399, 943, 210, 293],
    nearThigh: [723, 940, 165, 289], nearBoot: [1024, 944, 209, 293]
  };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const mix = (a, b, t) => a + (b - a) * t;
  const lerp = (a, b, t) => [mix(a[0], b[0], t), mix(a[1], b[1], t)];
  const distance = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
  const angle = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]);
  const degrees = a => a * 180 / Math.PI;
  const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
  const rotate = (p, a) => [p[0] * Math.cos(a) - p[1] * Math.sin(a), p[0] * Math.sin(a) + p[1] * Math.cos(a)];
  const fmt = n => Number(n.toFixed(3));
  const xy = p => p.map(fmt).join(' ');
  // Two-bone IK keeps each hand on its contact point, with constant limb lengths.
  function solveIK(start, end, upper, lower, side = 1) {
    const dx = end[0] - start[0], dy = end[1] - start[1];
    const d = clamp(Math.hypot(dx, dy), Math.abs(upper - lower) + .001, upper + lower - .001);
    const direction = Math.atan2(dy, dx);
    const offset = Math.acos(clamp((upper * upper + d * d - lower * lower) / (2 * upper * d), -1, 1));
    return add(start, [upper * Math.cos(direction + side * offset), upper * Math.sin(direction + side * offset)]);
  }
  // Raise → draw → aim → release → follow-through → recover, within existing feedback time.
  const keys = [
    { ms: 0, grip: [281, 307], draw: 29, lean: 0, bend: 0, head: 0 },
    { ms: 180, grip: [310, 240], draw: 55, lean: -1, bend: .4, head: -3 },
    { ms: 360, grip: [340, 214], draw: 84, lean: -2, bend: 1, head: -4 },
    { ms: 500, grip: [340, 214], draw: 85, lean: -2, bend: 1, head: -4 },
    { ms: 540, grip: [340, 214], draw: 22, lean: -1, bend: -.16, head: -4 },
    { ms: 660, grip: [339, 215], draw: 26, lean: 0, bend: .06, head: -3 },
    { ms: 780, grip: [329, 220], draw: 26, lean: 0, bend: 0, head: -2 },
    { ms: 1020, grip: [295, 276], draw: 28, lean: 1, bend: 0, head: -1 },
    { ms: 1200, grip: [281, 307], draw: 29, lean: 0, bend: 0, head: 0 }
  ];
  function sample(ms, target = [793, 391]) {
    ms = clamp(Number(ms) || 0, 0, DURATION);
    let next = keys.findIndex(k => k.ms >= ms); if (next < 1) next = 1;
    const a = keys[next - 1], b = keys[next];
    let t = (ms - a.ms) / (b.ms - a.ms); t = t * t * (3 - 2 * t);
    const grip = lerp(a.grip, b.grip, t), draw = mix(a.draw, b.draw, t);
    const aim = angle(grip, target), unit = [Math.cos(aim), Math.sin(aim)];
    const nock = add(grip, [-draw * unit[0], -draw * unit[1]]);
    const lean = mix(a.lean, b.lean, t), bend = mix(a.bend, b.bend, t);
    const shoulderBow = [211 + lean, 222], shoulderDraw = [252 + lean, 225];
    const wristBow = add(grip, rotate([-10, 7], aim));
    const anchor = add(nock, rotate([-22, 4], aim));
    let wristDraw = anchor;
    if (ms > RELEASE && ms < 860) {
      const releasePose = sample(RELEASE, target);
      const follow = clamp((ms - RELEASE) / 105, 0, 1);
      wristDraw = add(releasePose.wristDraw, [-12 * follow, 3 * follow]);
      if (ms > 740) wristDraw = lerp(wristDraw, anchor, (ms - 740) / 120);
    }
    const elbowBow = solveIK(shoulderBow, wristBow, 58, 64, 1);
    const elbowDraw = solveIK(shoulderDraw, wristDraw, 60, 62, -1);
    // The bow limbs pivot slightly under draw; their painted tips and string share geometry.
    const bowRotation = bend * .115;
    const top = add(grip, rotate(rotate([-10, -110], -bowRotation), aim));
    const bottom = add(grip, rotate(rotate([-10, 110], bowRotation), aim));
    const arrowLength = 117;
    let arrow = { tail: nock, angle: aim, visible: ms <= RELEASE || ms === DURATION, flying: false };
    if (ms > RELEASE && ms < IMPACT) {
      const atRelease = sample(RELEASE, target);
      const startTip = add(atRelease.nock, [arrowLength * Math.cos(atRelease.aim), arrowLength * Math.sin(atRelease.aim)]);
      const tip = lerp(startTip, target, (ms - RELEASE) / (IMPACT - RELEASE));
      arrow = { tail: add(tip, [-arrowLength * Math.cos(atRelease.aim), -arrowLength * Math.sin(atRelease.aim)]), angle: atRelease.aim, visible: true, flying: true };
    }
    const hipFar = [205 + lean, 327], hipNear = [242 + lean, 327];
    const ankleFar = [193, 436], ankleNear = [269, 437];
    return { ms, grip, nock, aim, bend, bowRotation, top, bottom, lean,
      head: mix(a.head, b.head, t), shoulderBow, shoulderDraw, wristBow, wristDraw,
      elbowBow, elbowDraw, hipFar, hipNear, ankleFar, ankleNear,
      kneeFar: solveIK(hipFar, ankleFar, 59, 56, -1), kneeNear: solveIK(hipNear, ankleNear, 59, 56, -1),
      arrow, arrowLength, released: ms > RELEASE && ms < 860,
      impact: ms >= IMPACT && ms < 880,
      phase: ms === 0 || ms === DURATION ? 'Ready' : ms < 210 ? 'Raise' : ms < 360 ? 'Draw' : ms <= RELEASE ? 'Aim' : ms < 560 ? 'Release' : ms < 850 ? 'Follow through' : 'Recover'
    };
  }
  function create(element, { prefix = '../../../', target = [793, 391] } = {}) {
    function part(name, x, y, width, height, rect = cells[name]) {
      return `<svg x="${x}" y="${y}" width="${width}" height="${height}" viewBox="${rect.join(' ')}" preserveAspectRatio="none" overflow="hidden"><image href="${prefix + atlas}" width="1254" height="1254"/></svg>`;
    }
    const limb = (name, start, end, width, before = 8, after = 8) => `<g transform="translate(${xy(start)}) rotate(${fmt(degrees(angle(start, end)) - 90)})">${part(name, -width / 2, -before, width, distance(start, end) + before + after)}</g>`;
    function paint(ms, { bones = false, reducedMotion = false } = {}) {
      const p = sample(reducedMotion ? 0 : ms, target);
      const bodyMove = `translate(${p.lean} 0)`;
      const farLeg = limb('farBoot', p.kneeFar, p.ankleFar, 55, 7, 28) + limb('farThigh', p.hipFar, p.kneeFar, 37, 8, 18);
      const nearLeg = limb('nearBoot', p.kneeNear, p.ankleNear, 58, 7, 28) + limb('nearThigh', p.hipNear, p.kneeNear, 40, 8, 18);
      const bowArm = limb('bowUpper', p.shoulderBow, p.elbowBow, 35) + limb('bowLower', p.elbowBow, p.wristBow, 30);
      const drawArm = limb('drawUpper', p.shoulderDraw, p.elbowDraw, 34) + limb('drawLower', p.elbowDraw, p.wristDraw, 29);
      const bow = `<g transform="translate(${xy(p.grip)}) rotate(${fmt(degrees(p.aim))})"><g transform="rotate(${fmt(-degrees(p.bowRotation))})">${part('bow', -32, -112, 46, 114, [1098, 640, 65, 156])}</g><g transform="rotate(${fmt(degrees(p.bowRotation))})">${part('bow', -32, -1, 46, 113, [1098, 795, 65, 154])}</g></g>`;
      const string = `<path d="M${xy(p.top)} L${xy(p.nock)} L${xy(p.bottom)}" fill="none" stroke="#f6deb1" stroke-width="1.65" stroke-linecap="round"/>`;
      const arrow = p.arrow.visible ? `<g data-arrow="${p.arrow.flying ? 'flight' : 'nocked'}" transform="translate(${xy(p.arrow.tail)}) rotate(${fmt(degrees(p.arrow.angle))})"><path d="M0 0H112" stroke="#603b1e" stroke-width="3"/><path d="M0 -1H111" stroke="#dcb373" stroke-width="1"/><path d="M8 0L-1 -7L13 -5L20 0L13 5L-1 7Z" fill="#dfd3b1" stroke="#73543b" stroke-width="1"/><path d="M108 -4L117 0L108 4Z" fill="#ddd6ba" stroke="#594e37" stroke-width="1"/></g>` : '';
      const hands = `<g transform="translate(${xy(p.grip)}) rotate(${fmt(degrees(p.aim))})">${part('grip', -13, -14, 26, 32)}</g><g transform="translate(${xy(p.wristDraw)}) rotate(${fmt(degrees(p.aim))})">${part(p.released ? 'open' : 'draw', -4, -12, p.released ? 33 : 31, p.released ? 23 : 19)}</g>`;
      const chain = points => `<polyline points="${points.map(p => p.join(',')).join(' ')}" fill="none" stroke="#68eff3" stroke-width="2"/>${points.map(q => `<circle cx="${q[0]}" cy="${q[1]}" r="3.5" fill="#163936" stroke="#a0ffff"/>`).join('')}`;
      const debug = bones ? `<g opacity=".9">${chain([p.shoulderBow,p.elbowBow,p.wristBow])}${chain([p.shoulderDraw,p.elbowDraw,p.wristDraw])}${chain([p.hipFar,p.kneeFar,p.ankleFar])}${chain([p.hipNear,p.kneeNear,p.ankleNear])}</g>` : '';
      element.innerHTML = `<g class="archerPaint"><ellipse cx="224" cy="475" rx="93" ry="12" fill="#18291c" opacity=".22"/><g transform="${bodyMove}"><g transform="rotate(${fmt(-p.bend * 2)} 210 220)">${part('cape', 145, 193, 154, 228)}</g>${part('quiver', 159, 156, 57, 131)}</g>${farLeg}${nearLeg}${bowArm}<g transform="${bodyMove}">${part('torso', 172, 188, 119, 158)}<g transform="rotate(${p.head} 234 198)">${part('head', 167, 72, 124, 125)}</g></g>${drawArm}${bow}${string}${arrow}${hands}${debug}</g>`;
      element.dataset.phase = p.phase;
      return p;
    }
    paint(0);
    return { paint };
  }
  const api = { DURATION, RELEASE, IMPACT, cells, atlas, sample, solveIK, create };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.BlitzArcherStudy = api;
})(typeof window !== 'undefined' ? window : globalThis);
