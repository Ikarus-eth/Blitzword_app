/* Archer study. A reusable painted rig; no game state or storage dependencies. */
(function (root) {
  'use strict';
  const DURATION = 1200, RELEASE = 500, IMPACT = 660;
  const atlas = 'assets/heroes/prototype/archer-boy-parts.png';
  let instance = 0;
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
  const smooth = t => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  const direction = (a, length) => [Math.cos(a) * length, Math.sin(a) * length];
  const mixAngle = (a, b, t) => a + Math.atan2(Math.sin(b - a), Math.cos(b - a)) * t;
  const BOW_UPPER = 62, DRAW_UPPER = 68, ARM_LOWER = 64;
  const ANCHOR = [250, 209], DRAW_LENGTH = 153, BRACE_LENGTH = 26;
  // Two-bone IK keeps each hand on its contact point, with constant limb lengths.
  function solveIK(start, end, upper, lower, side = 1) {
    const dx = end[0] - start[0], dy = end[1] - start[1];
    const d = clamp(Math.hypot(dx, dy), Math.abs(upper - lower) + .001, upper + lower - .001);
    const direction = Math.atan2(dy, dx);
    const offset = Math.acos(clamp((upper * upper + d * d - lower * lower) / (2 * upper * d), -1, 1));
    return add(start, [upper * Math.cos(direction + side * offset), upper * Math.sin(direction + side * offset)]);
  }
  // An elbow can pass toward the viewer as it opens, rather than sweeping over
  // the face in the picture plane. Project that depth into the same 2D artwork.
  // The underlying upper/lower lengths remain fixed in three dimensions.
  function drawingJoint(shoulder, wrist, pole) {
    const d = distance(shoulder, wrist), a = angle(shoulder, wrist);
    const along = (DRAW_UPPER ** 2 + d ** 2 - ARM_LOWER ** 2) / (2 * d);
    const radius = Math.sqrt(Math.max(0, DRAW_UPPER ** 2 - along ** 2));
    const center = add(shoulder, direction(a, along));
    return { point: add(center, direction(a + Math.PI / 2, radius * pole)), depth: radius * Math.sqrt(Math.max(0, 1 - pole ** 2)) };
  }
  // One shooting line runs from the cheek to the target. Raise the undrawn bow
  // first; then extend the bow arm while the other hand draws back to the cheek.
  function sample(ms, target = [793, 391]) {
    ms = clamp(Number(ms) || 0, 0, DURATION);
    const aim = angle(ANCHOR, target), unit = direction(aim, 1);
    const restGrip = [298, 321], fullGrip = add(ANCHOR, direction(aim, DRAW_LENGTH));
    const raisedGrip = add(fullGrip, [-45, 10]);
    const raise = smooth(ms / 180), pull = smooth((ms - 180) / 180);
    const recover = smooth((ms - 820) / 380);
    let grip = ms < 180 ? lerp(restGrip, raisedGrip, raise) : lerp(raisedGrip, fullGrip, pull);
    if (ms > 820) grip = lerp(fullGrip, restGrip, recover);
    let draw = mix(BRACE_LENGTH, DRAW_LENGTH, pull), bend = pull;
    if (ms > RELEASE) {
      const snap = smooth((ms - RELEASE) / 40);
      draw = mix(DRAW_LENGTH, BRACE_LENGTH, snap);
      bend = 1 - snap;
      if (ms >= 540 && ms < 640) bend = -.09 * Math.sin((ms - 540) / 100 * Math.PI);
    }
    const nock = add(grip, direction(aim, -draw));
    const lean = 0, shoulderBow = [260, 239], shoulderDraw = [206, 242];
    const wristBow = add(grip, rotate([-10, 7], aim));
    const contactWrist = point => add(point, rotate([-22, 4], aim));
    let wristDraw = contactWrist(nock);
    // On release the hand follows the shooting line backward; it never chases
    // the rebounding string or gets pulled forward to the bow.
    if (ms > RELEASE && ms < DURATION) {
      wristDraw = add(contactWrist(ANCHOR), direction(aim, -12 * smooth((ms - RELEASE) / 110)));
    }
    const elbowBow = solveIK(shoulderBow, wristBow, BOW_UPPER, ARM_LOWER, 1);
    const pole = ms <= 180 ? .7 * (1 - raise) : -smooth((ms - 255) / 105);
    const projected = drawingJoint(shoulderDraw, wristDraw, pole);
    let elbowDraw = projected.point, elbowDepth = projected.depth, wristDepth = 0;
    if (ms > 820 && ms < DURATION) {
      const followWrist = add(contactWrist(ANCHOR), direction(aim, -12));
      const followElbow = drawingJoint(shoulderDraw, followWrist, -1).point;
      const restWrist = contactWrist(add(restGrip, direction(aim, -BRACE_LENGTH)));
      const rest = drawingJoint(shoulderDraw, restWrist, .7), restElbow = rest.point;
      // Lower the elbow around the back/down side of the shoulder. Taking the
      // numerical shortest arc would sweep it up over the face instead.
      let endAngle = angle(shoulderDraw, restElbow);
      while (endAngle > angle(shoulderDraw, followElbow)) endAngle -= 2 * Math.PI;
      const upperAngle = mix(angle(shoulderDraw, followElbow), endAngle, recover);
      const lowerAngle = mixAngle(angle(followElbow, followWrist), angle(restElbow, restWrist), recover);
      const upperElevation = Math.atan2(rest.depth, distance(shoulderDraw, restElbow)) * recover;
      const lowerElevation = Math.atan2(-rest.depth, distance(restElbow, restWrist)) * recover;
      elbowDraw = add(shoulderDraw, direction(upperAngle, DRAW_UPPER * Math.cos(upperElevation)));
      wristDraw = add(elbowDraw, direction(lowerAngle, ARM_LOWER * Math.cos(lowerElevation)));
      elbowDepth = DRAW_UPPER * Math.sin(upperElevation);
      wristDepth = elbowDepth + ARM_LOWER * Math.sin(lowerElevation);
    } else if (ms === DURATION) {
      const rest = drawingJoint(shoulderDraw, wristDraw, .7);
      elbowDraw = rest.point; elbowDepth = rest.depth;
    }
    // The bow limbs pivot slightly under draw; their painted tips and string share geometry.
    const bowRotation = bend * .115;
    const top = add(grip, rotate(rotate([-10, -110], -bowRotation), aim));
    const bottom = add(grip, rotate(rotate([-10, 110], bowRotation), aim));
    const arrowLength = 178;
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
      head: -2 * raise * (1 - recover), shoulderBow, shoulderDraw, wristBow, wristDraw,
      elbowBow, elbowDraw, elbowDepth, wristDepth, hipFar, hipNear, ankleFar, ankleNear,
      kneeFar: solveIK(hipFar, ankleFar, 59, 56, -1), kneeNear: solveIK(hipNear, ankleNear, 59, 56, -1),
      arrow, arrowLength, released: ms > RELEASE && ms < 1050,
      impact: ms >= IMPACT && ms < 880,
      phase: ms === 0 || ms === DURATION ? 'Ready' : ms <= 180 ? 'Raise' : ms < 360 ? 'Draw' : ms <= RELEASE ? 'Aim' : ms < 560 ? 'Release' : ms <= 820 ? 'Follow through' : 'Recover'
    };
  }
  function create(element, { prefix = '../../../', target = [793, 391] } = {}) {
    const bowClip = 'archer-bow-' + (++instance);
    function part(name, x, y, width, height, rect = cells[name]) {
      return `<svg x="${x}" y="${y}" width="${width}" height="${height}" viewBox="${rect.join(' ')}" preserveAspectRatio="none" overflow="hidden"><image href="${prefix + atlas}" width="1254" height="1254"${name === 'bow' ? ` clip-path="url(#${bowClip})"` : ''}/></svg>`;
    }
    const limb = (name, start, end, width, before = 8, after = 8) => `<g transform="translate(${xy(start)}) rotate(${fmt(degrees(angle(start, end)) - 90)})">${part(name, -width / 2, -before, width, distance(start, end) + before + after)}</g>`;
    function paint(ms, { bones = false, reducedMotion = false } = {}) {
      const p = sample(reducedMotion ? 0 : ms, target);
      const bodyMove = `translate(${p.lean} 0)`;
      const farLeg = limb('farBoot', p.kneeFar, p.ankleFar, 55, 7, 28) + limb('farThigh', p.hipFar, p.kneeFar, 37, 8, 18);
      const nearLeg = limb('nearBoot', p.kneeNear, p.ankleNear, 58, 7, 28) + limb('nearThigh', p.hipNear, p.kneeNear, 40, 8, 18);
      const bowArm = limb('bowUpper', p.shoulderBow, p.elbowBow, 35) + limb('bowLower', p.elbowBow, p.wristBow, 30);
      const drawUpper = limb('drawUpper', p.shoulderDraw, p.elbowDraw, 34);
      const drawLower = limb('drawLower', p.elbowDraw, p.wristDraw, 29);
      const bow = `<g transform="translate(${xy(p.grip)}) rotate(${fmt(degrees(p.aim))})"><g transform="rotate(${fmt(-degrees(p.bowRotation))})">${part('bow', -32, -112, 46, 114, [1098, 640, 65, 156])}</g><g transform="rotate(${fmt(degrees(p.bowRotation))})">${part('bow', -32, -1, 46, 113, [1098, 795, 65, 154])}</g></g>`;
      const string = `<path d="M${xy(p.top)} L${xy(p.nock)} L${xy(p.bottom)}" fill="none" stroke="#f6deb1" stroke-width="1.65" stroke-linecap="round"/>`;
      const arrow = p.arrow.visible ? `<g data-arrow="${p.arrow.flying ? 'flight' : 'nocked'}" transform="translate(${xy(p.arrow.tail)}) rotate(${fmt(degrees(p.arrow.angle))})"><path d="M0 0H${p.arrowLength - 5}" stroke="#603b1e" stroke-width="3"/><path d="M0 -1H${p.arrowLength - 6}" stroke="#dcb373" stroke-width="1"/><path d="M8 0L-1 -7L13 -5L20 0L13 5L-1 7Z" fill="#dfd3b1" stroke="#73543b" stroke-width="1"/><path d="M${p.arrowLength - 9} -4L${p.arrowLength} 0L${p.arrowLength - 9} 4Z" fill="#ddd6ba" stroke="#594e37" stroke-width="1"/></g>` : '';
      const hands = `<g transform="translate(${xy(p.grip)}) rotate(${fmt(degrees(p.aim))})">${part('grip', -13, -14, 26, 32)}</g><g transform="translate(${xy(p.wristDraw)}) rotate(${fmt(degrees(p.aim))})">${part(p.released ? 'open' : 'draw', -4, -12, p.released ? 33 : 31, p.released ? 23 : 19)}</g>`;
      const chain = points => `<polyline points="${points.map(p => p.join(',')).join(' ')}" fill="none" stroke="#68eff3" stroke-width="2"/>${points.map(q => `<circle cx="${q[0]}" cy="${q[1]}" r="3.5" fill="#163936" stroke="#a0ffff"/>`).join('')}`;
      const debug = bones ? `<g opacity=".9">${chain([p.shoulderBow,p.elbowBow,p.wristBow])}${chain([p.shoulderDraw,p.elbowDraw,p.wristDraw])}${chain([p.hipFar,p.kneeFar,p.ankleFar])}${chain([p.hipNear,p.kneeNear,p.ankleNear])}</g>` : '';
      element.innerHTML = `<g class="archerPaint"><defs><clipPath id="${bowClip}" clipPathUnits="userSpaceOnUse"><path d="M1120 640H1164V944H1118V940H1098V662H1120Z"/></clipPath></defs><ellipse cx="224" cy="475" rx="93" ry="12" fill="#18291c" opacity=".22"/><g transform="${bodyMove}"><g transform="rotate(${fmt(-p.bend * 2)} 210 220)">${part('cape', 145, 193, 154, 228)}</g>${part('quiver', 159, 156, 57, 131)}</g>${farLeg}${nearLeg}${bowArm}${drawUpper}<g transform="${bodyMove}">${part('torso', 172, 188, 119, 158)}<g transform="rotate(${p.head} 234 211)">${part('head', 167, 85, 124, 125)}</g></g>${drawLower}${bow}${string}${arrow}${hands}${debug}</g>`;
      element.dataset.phase = p.phase;
      return p;
    }
    paint(0);
    return { paint };
  }
  const api = { DURATION, RELEASE, IMPACT, BOW_UPPER, DRAW_UPPER, ARM_LOWER, cells, atlas, sample, solveIK, create };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.BlitzArcherStudy = api;
})(typeof window !== 'undefined' ? window : globalThis);
