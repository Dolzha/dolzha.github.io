/* 3D-телефон для окна работы (04.10, шестнадцатый круг). Выбор Роберта: модель и появление варианта 11 (тёмный iPhone,
   крупный план → отъезд), интерфейс как на настоящем iPhone: адресной строки нет, сверху строка состояния с Dynamic Island,
   снизу полоска «домой». Листание без лагов: снимок сайта один раз раскладывается в текстуру-атлас (колонки 780×4096),
   при прокрутке меняется только число в шейдере, экран не перерисовывается. Phone3D.mount(box, {k}) → функция удаления. */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const m = { kind: 'ios', W: .72, H: 1.48, D: .082, R: .125, bez: .02, frame: 0x3A3B3F, back: 0x2E2F33, metal: .95, rough: .33 };
const deg = Math.PI / 180, mix = (a, b, t) => a + (b - a) * t, io = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const DUR = 2.4, pose = t => { const e = io(t); return { cz: mix(.28, 1, e), cy: mix(.6, 0, e), ry: mix(-12, 0, e) * deg }; };

// ---------- геометрия ----------
const rrShape = (w, h, r) => { const s = new THREE.Shape(), x = -w / 2, y = -h / 2; s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0); s.lineTo(x + w, y + h - r); s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2); s.lineTo(x + r, y + h); s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI); s.lineTo(x, y + r); s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5); return s; };
const flat = (w, h, r) => { const g = new THREE.ShapeGeometry(rrShape(w, h, r), 48), p = g.attributes.position, uv = g.attributes.uv; for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) + w / 2) / w, (p.getY(i) + h / 2) / h); return g; };
const pill = (w, h, d, r) => { const b = Math.min(r, d / 2) * .9; const g = new THREE.ExtrudeGeometry(rrShape(w - 2 * b, h - 2 * b, Math.max(.001, r - b)), { depth: d - 2 * b, bevelEnabled: true, bevelThickness: b, bevelSize: b, bevelSegments: 5, curveSegments: 24 }); g.translate(0, 0, -(d - 2 * b) / 2); return g; };

function buildPhone(m) {
  const g = new THREE.Group();
  const bt = .016, bs = .014;
  const body = new THREE.ExtrudeGeometry(rrShape(m.W - 2 * bs, m.H - 2 * bs, m.R - bs), { depth: m.D - 2 * bt, bevelEnabled: true, bevelThickness: bt, bevelSize: bs, bevelSegments: 10, curveSegments: 64 });
  body.translate(0, 0, -(m.D - 2 * bt) / 2);
  const frameMat = new THREE.MeshPhysicalMaterial({ color: m.frame, metalness: m.metal, roughness: m.rough, clearcoat: .4, clearcoatRoughness: .3 });
  g.add(new THREE.Mesh(body, frameMat));
  const glass = new THREE.MeshPhysicalMaterial({ color: 0x050506, metalness: 0, roughness: .06, clearcoat: 1, clearcoatRoughness: .04 });
  const front = new THREE.Mesh(flat(m.W - .012, m.H - .012, m.R - .006), glass); front.position.z = m.D / 2 + .0004; g.add(front);
  const backMat = new THREE.MeshPhysicalMaterial({ color: m.back, metalness: .1, roughness: .55, clearcoat: .5, clearcoatRoughness: .4 });
  const back = new THREE.Mesh(flat(m.W - .012, m.H - .012, m.R - .006), backMat); back.position.z = -m.D / 2 - .0004; back.rotation.y = Math.PI; g.add(back);
  // экран
  const sw = m.W - 2 * m.bez, sh = m.H - 2 * m.bez;
  const scr = new THREE.Mesh(flat(sw, sh, m.R - m.bez), new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false }));
  scr.position.z = m.D / 2 + .0012; g.add(scr);
  // кнопки на торцах
  const btnMat = new THREE.MeshPhysicalMaterial({ color: m.frame, metalness: m.metal, roughness: m.rough * .8 });
  const btn = (side, y, h) => { const b = new THREE.Mesh(pill(.014, h, .032, .006), btnMat); b.rotation.y = Math.PI / 2; b.position.set(side * (m.W / 2 + .002), y, 0); g.add(b); };
  if (m.kind === 'android') { btn(1, .3, .13); btn(1, .08, .2); }
  else { btn(-1, .38, .06); btn(-1, .24, .13); btn(-1, .07, .13); btn(1, .22, .2); }
  // камеры
  const lensRing = new THREE.MeshPhysicalMaterial({ color: 0x1A1B1E, metalness: .9, roughness: .25 });
  const lensGlass = new THREE.MeshPhysicalMaterial({ color: 0x020203, metalness: .2, roughness: .05, clearcoat: 1 });
  const lens = (x, y, r, z) => { const o = new THREE.Mesh(new THREE.CylinderGeometry(r, r, .014, 48), lensRing); o.rotation.x = Math.PI / 2; o.position.set(x, y, z); g.add(o); const i = new THREE.Mesh(new THREE.CylinderGeometry(r * .68, r * .68, .016, 48), lensGlass); i.rotation.x = Math.PI / 2; i.position.set(x, y, z - .002); g.add(i); };
  if (m.kind === 'android') {
    const bar = new THREE.Mesh(pill(m.W - .02, .17, .036, .07), new THREE.MeshPhysicalMaterial({ color: m.frame, metalness: m.metal, roughness: m.rough }));
    bar.position.set(0, m.H / 2 - .3, -m.D / 2 - .012); g.add(bar);
    const win = new THREE.Mesh(flat(.36, .11, .055), new THREE.MeshPhysicalMaterial({ color: 0x0A0A0C, roughness: .08, clearcoat: 1 })); win.position.set(.1, m.H / 2 - .3, -m.D / 2 - .0305); win.rotation.y = Math.PI; g.add(win);
    lens(.2, m.H / 2 - .3, .035, -m.D / 2 - .034); lens(.05, m.H / 2 - .3, .035, -m.D / 2 - .034);
  } else {
    const bump = new THREE.Mesh(pill(.32, .33, .026, .075), new THREE.MeshPhysicalMaterial({ color: m.back, metalness: .2, roughness: .25, clearcoat: .8 }));
    bump.position.set(m.W / 2 - .2, m.H / 2 - .2, -m.D / 2 - .008); g.add(bump);
    const bx = m.W / 2 - .2, by = m.H / 2 - .2, z = -m.D / 2 - .025;
    lens(bx + .065, by + .07, .055, z); lens(bx + .065, by - .07, .055, z); lens(bx - .07, by, .055, z);
  }
  return { g, scr, sw, sh };
}


// ---------- экран: шейдер (страница из атласа + строка состояния + полоска «домой») ----------
const VS = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }';
const FS = `
uniform sampler2D uAtlas; uniform sampler2D uUI;
uniform float uScroll, uViewH, uTop, uColW, uColH, uStride, uAW, uAH, uPageH, uReady, uBarDark;
uniform vec3 uBar;
varying vec2 vUv;
void main(){
  float fy = 1.0 - vUv.y;
  vec3 col;
  if (fy < uTop) col = uBar;
  else if (uReady < 0.5) col = vec3(1.0);
  else {
    float py = uScroll + (fy - uTop) / (1.0 - uTop) * uViewH;
    if (py >= uPageH) col = vec3(1.0);
    else {
      float c = floor(py / uColH);
      float y = py - c * uColH;
      col = texture2D(uAtlas, vec2((c * uStride + vUv.x * uColW) / uAW, 1.0 - y / uAH)).rgb;
    }
  }
  vec4 ui = texture2D(uUI, vUv);
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  vec3 glyph = fy < uTop ? (uBarDark > 0.5 ? vec3(1.0) : vec3(0.0)) : (lum > 0.55 ? vec3(0.0) : vec3(1.0));
  col = mix(col, ui.r > 0.5 ? glyph : vec3(0.0), ui.a);
  gl_FragColor = vec4(col, 1.0);
}`;

// элементы iOS: белые глифы (цвет меняется под фон), чёрный остров. Пропорции iPhone 15 Pro: 393×852 pt.
function drawUI(CW, CH, top) {
  const cv = document.createElement('canvas'); cv.width = CW; cv.height = CH;
  const c = cv.getContext('2d'), pt = CW / 393, cy = 29.5 * pt;
  const rr = (x, y, w, h, r) => { c.beginPath(); c.roundRect(x, y, w, h, r); c.fill(); };
  c.fillStyle = '#000'; rr(CW / 2 - 63 * pt, 11 * pt, 126 * pt, 37 * pt, 18.5 * pt); // Dynamic Island
  c.fillStyle = '#fff'; c.strokeStyle = '#fff';
  c.font = `600 ${17 * pt}px -apple-system,"SF Pro Text","Helvetica Neue",Arial,sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText('9:41', 67 * pt, cy);
  // связь: 4 столбика
  const sx = CW - 108 * pt;
  for (let i = 0; i < 4; i++) { const h = (4 + i * 2.6) * pt; rr(sx + i * 4.6 * pt, cy + 5.5 * pt - h, 3.2 * pt, h, 1 * pt); }
  // wi-fi: три дуги-сектора
  const wx = sx + 31 * pt, wy = cy + 5.2 * pt;
  [[11.5, 8.6], [7.6, 4.8], [3.8, 0]].forEach(([r1, r0]) => { c.beginPath(); c.arc(wx, wy, r1 * pt, -Math.PI * .75, -Math.PI * .25); c.arc(wx, wy, r0 * pt, -Math.PI * .25, -Math.PI * .75, true); c.closePath(); c.fill(); });
  // батарея
  const bx = sx + 48 * pt, by = cy - 6.2 * pt;
  c.globalAlpha = .4; c.lineWidth = 1.1 * pt; c.beginPath(); c.roundRect(bx, by, 25 * pt, 12.4 * pt, 4 * pt); c.stroke();
  rr(bx + 26.3 * pt, by + 4.2 * pt, 1.6 * pt, 4 * pt, .8 * pt); c.globalAlpha = 1;
  rr(bx + 2 * pt, by + 2 * pt, 21 * pt, 8.4 * pt, 2.4 * pt);
  // полоска «домой»
  rr(CW / 2 - 67 * pt, CH - 13 * pt, 134 * pt, 5 * pt, 2.5 * pt);
  return cv;
}

function mount(box, o) {
  const wrap = document.createElement('div'); wrap.className = 'p3d'; wrap.tabIndex = 0; wrap.setAttribute('role', 'region'); wrap.setAttribute('aria-label', 'Мобильная версия сайта, листайте колесом мыши или пальцем');
  wrap.innerHTML = '<i class="p3d-sh" aria-hidden="true"></i><span class="p3d-hint" aria-hidden="true">Листайте</span>';
  box.appendChild(wrap);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2)); renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  wrap.prepend(renderer.domElement);
  const scene = new THREE.Scene(), pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new RoomEnvironment(), .04).texture;
  const key = new THREE.DirectionalLight(0xffffff, 1.4); key.position.set(-2, 3, 4); scene.add(key);
  const rim = new THREE.DirectionalLight(0xDFF5EC, 1.1); rim.position.set(3, 1, -2); scene.add(rim);
  const cam = new THREE.PerspectiveCamera(26, 1, .05, 50);
  const { g, scr, sw, sh } = buildPhone(m), pivot = new THREE.Group(); pivot.add(g); scene.add(pivot);
  const maxTex = renderer.capabilities.maxTextureSize;
  const COLW = 780, COLH = Math.min(4096, maxTex), STRIDE = COLW + 12, TOP = 54 / 852;
  const CW = 1080, CH = Math.round(CW * sh / sw);
  const uiTex = new THREE.CanvasTexture(drawUI(CW, CH, TOP)); uiTex.colorSpace = THREE.NoColorSpace; uiTex.anisotropy = 8;
  const U = { uAtlas: { value: null }, uUI: { value: uiTex }, uScroll: { value: 0 }, uViewH: { value: COLW * sh * (1 - TOP) / sw }, uTop: { value: TOP },
    uColW: { value: COLW }, uColH: { value: COLH }, uStride: { value: STRIDE }, uAW: { value: 1 }, uAH: { value: COLH }, uPageH: { value: 1 }, uReady: { value: 0 }, uBar: { value: new THREE.Vector3(1, 1, 1) }, uBarDark: { value: 0 } };
  scr.material.dispose(); scr.material = new THREE.ShaderMaterial({ uniforms: U, vertexShader: VS, fragmentShader: FS });
  let atlas = null, maxY = 0, sy = 0, ty = 0, vel = 0, raf = 0, t0 = 0, done = reduce, alive = true, dist = 4, drag = false, kpx = 2;
  const im = new Image(); im.decoding = 'async'; im.src = `img/mob3/${o.k}.jpg`;
  im.onload = () => {
    if (!alive) return;
    const k = im.naturalWidth / COLW, pageH = Math.floor(im.naturalHeight / k), cols = Math.max(1, Math.min(Math.ceil(pageH / COLH), Math.floor(maxTex / STRIDE)));
    const cv = document.createElement('canvas'); cv.width = cols * STRIDE; cv.height = COLH;
    const c = cv.getContext('2d'); c.fillStyle = '#fff'; c.fillRect(0, 0, cv.width, cv.height);
    for (let i = 0; i < cols; i++) { const y = i * COLH, h = Math.min(COLH, pageH - y); if (h > 0) c.drawImage(im, 0, y * k, im.naturalWidth, h * k, i * STRIDE, 0, COLW, h); }
    const px = c.getImageData(0, 0, COLW, 3).data; let r = 0, gg = 0, b = 0, n = 0; for (let i = 0; i < px.length; i += 16) { r += px[i]; gg += px[i + 1]; b += px[i + 2]; n++; }
    r /= n * 255; gg /= n * 255; b /= n * 255; U.uBar.value.set(r, gg, b); U.uBarDark.value = (.299 * r + .587 * gg + .114 * b) < .55 ? 1 : 0;
    atlas = new THREE.CanvasTexture(cv); atlas.colorSpace = THREE.NoColorSpace; atlas.anisotropy = renderer.capabilities.getMaxAnisotropy(); atlas.minFilter = THREE.LinearMipmapLinearFilter; atlas.generateMipmaps = true;
    U.uAtlas.value = atlas; U.uAW.value = cv.width; U.uPageH.value = Math.min(pageH, cols * COLH); U.uReady.value = 1;
    maxY = Math.max(0, U.uPageH.value - U.uViewH.value); kick();
  };
  const fit = () => {
    const r = wrap.getBoundingClientRect(); if (!r.width) return;
    renderer.setSize(r.width, r.height, false); cam.aspect = r.width / r.height;
    const need = Math.max(m.H / .93, m.W / .9 / cam.aspect); dist = need / 2 / Math.tan(cam.fov / 2 * deg);
    kpx = COLW * need / (sw * r.height); // пиксели страницы на экранный пиксель: палец двигает страницу один к одному
    cam.updateProjectionMatrix(); kick();
  };
  const ro = new ResizeObserver(fit); ro.observe(wrap); fit();
  function frame(now) {
    raf = 0; if (!alive) return;
    if (!t0) t0 = now;
    const t = done ? 1 : Math.min(1, (now - t0) / 1000 / DUR);
    if (t >= 1 && !done) { done = true; wrap.classList.add('ready'); }
    const p = pose(t), d = dist * p.cz;
    pivot.rotation.set(0, p.ry, 0); cam.position.set(0, p.cy, d); cam.lookAt(0, p.cy * .55, 0);
    if (!drag) { if (Math.abs(vel) > .1) { ty += vel; vel *= .94; } ty = Math.max(0, Math.min(maxY, ty)); sy += (ty - sy) * .22; if (Math.abs(ty - sy) < .05) sy = ty; }
    U.uScroll.value = sy;
    renderer.render(scene, cam);
    if (!done || Math.abs(ty - sy) > .05 || Math.abs(vel) > .1) kick();
  }
  function kick() { if (!raf && alive) raf = requestAnimationFrame(frame); }
  if (done) wrap.classList.add('ready');
  kick();
  // листание: колесо, палец или мышь с инерцией, клавиши
  let lastY = 0, lastT = 0, v = 0;
  wrap.addEventListener('wheel', e => { if (!done) return; e.preventDefault(); vel = 0; ty = Math.max(0, Math.min(maxY, ty + e.deltaY * kpx * (e.deltaMode ? 30 : 1))); wrap.classList.add('used'); kick(); }, { passive: false });
  wrap.addEventListener('pointerdown', e => { if (!done) return; drag = true; vel = 0; lastY = e.clientY; lastT = performance.now(); v = 0; wrap.setPointerCapture(e.pointerId); wrap.classList.add('drag', 'used'); });
  wrap.addEventListener('pointermove', e => { if (!drag) return; const d = (lastY - e.clientY) * kpx, now = performance.now(); ty = sy = Math.max(0, Math.min(maxY, sy + d)); v = d / Math.max(8, now - lastT) * 16; lastY = e.clientY; lastT = now; kick(); });
  const up = () => { if (!drag) return; drag = false; vel = performance.now() - lastT < 80 ? v : 0; wrap.classList.remove('drag'); kick(); };
  wrap.addEventListener('pointerup', up); wrap.addEventListener('pointercancel', up);
  wrap.addEventListener('keydown', e => { const step = { ArrowDown: 160, ArrowUp: -160, PageDown: 700, PageUp: -700, ' ': 700 }[e.key]; if (step && done) { e.preventDefault(); vel = 0; ty = Math.max(0, Math.min(maxY, ty + step)); kick(); } if (e.key === 'Home') { ty = 0; kick(); } if (e.key === 'End') { ty = maxY; kick(); } });
  return () => {
    alive = false; cancelAnimationFrame(raf); ro.disconnect();
    scene.traverse(x => { if (x.geometry) x.geometry.dispose(); if (x.material) x.material.dispose(); });
    if (atlas) atlas.dispose(); uiTex.dispose(); pm.dispose(); renderer.dispose(); renderer.forceContextLoss(); wrap.remove();
  };
}

window.Phone3D = { mount };
window.dispatchEvent(new Event('phone3d-ready'));
