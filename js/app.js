/* remind+ — aplikasi utama */
'use strict';

/* ================= Utilitas ================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = n => Math.round(Number(n) || 0).toLocaleString(LOC);
const rp = n => 'Rp' + Math.round(Number(n) || 0).toLocaleString(LOC);
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
const nowIso = () => new Date().toISOString();
const clone = o => JSON.parse(JSON.stringify(o));
const lsGet = (k, d = null) => { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
const lsDel = k => { try { localStorage.removeItem(k); } catch (e) {} };
const DAY = 864e5;
const VERSION = '2.10.0';

/* ================= Ikon ================= */
const P = {
  wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
  home: '<path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2h-4v-7H9v7H5a2 2 0 0 1-2-2z"/>',
  checks: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
  cap: '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2.7 9 2.7 12 0v-5"/><path d="M22 10v6"/>',
  timer: '<path d="M10 2h4"/><path d="M12 14l3-3"/><circle cx="12" cy="14" r="8"/>',
  gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5"/>',
  history: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>',
  sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  trash: '<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  alarm: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M5 3 2 6M22 6l-3-3"/>',
  cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  calplus: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M12 14v4M10 16h4"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
  play: '<path d="M7 4v16l13-8z"/>',
  pause: '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>',
  reset: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
  pencil: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  eyeoff: '<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.53 13.53 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61M2 2l20 20"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/>',
  cloud: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
  refresh: '<path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5M3 21v-5h5"/>',
  game: '<rect x="2" y="6" width="20" height="12" rx="4"/><path d="M6 12h4M8 10v4M15 13h.01M18 11h.01"/>',
  bag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18M16 10a4 4 0 0 1-8 0"/>',
  food: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
  film: '<rect x="2" y="2" width="20" height="20" rx="2.18"/><path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5"/>',
  spark: '<path d="M12 3l1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2z"/>',
  book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  up: '<path d="M7 17 17 7M7 7h10v10"/>',
  down: '<path d="M17 7 7 17M17 17H7V7"/>',
  wand: '<path d="m15 4-11 11 5 5 11-11zM14 5l5 5"/>',
  copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
  server: '<rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><path d="M6 6h.01M6 18h.01"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  warn: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4M12 17h.01"/>',
  monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  chev: '<path d="m6 9 6 6 6-6"/>',
  backpack: '<path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/><path d="M8 10h8M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M8 22v-6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6"/>',
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  chevl: '<path d="m15 18-6-6 6-6"/>',
  chevr: '<path d="m9 18 6-6-6-6"/>',
  chevu: '<path d="m18 15-6-6-6 6"/>',
  more: '<circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/>'
};
const I = (n, c = 'ic') => `<svg class="${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ''}</svg>`;

/* ================= Tema ================= */
const THEME_KEY = 'remindplus:theme';
const themePref = () => { try { return localStorage.getItem(THEME_KEY) || 'auto'; } catch (e) { return 'auto'; } };
const mq = matchMedia('(prefers-color-scheme: dark)');
function applyTheme() {
  const p = themePref();
  const dark = p === 'dark' || (p === 'auto' && mq.matches);
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  const m = $('#themeColor'); if (m) m.setAttribute('content', dark ? '#090A0F' : '#F4F5FA');
}
function setTheme(p) { try { localStorage.setItem(THEME_KEY, p); } catch (e) {} applyTheme(); }
const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';
mq.addEventListener && mq.addEventListener('change', () => { if (themePref() === 'auto') { applyTheme(); refreshThemeButtons(); } });
function refreshThemeButtons() {
  $$('[data-theme-toggle]').forEach(b => { b.innerHTML = I(isDark() ? 'sun' : 'moon'); b.title = isDark() ? 'Mode terang' : 'Mode gelap'; });
  $$('.theme-pick button').forEach(b => b.classList.toggle('on', b.dataset.t === themePref()));
}
function quickToggleTheme(e) { themeTransition(() => setTheme(isDark() ? 'light' : 'dark'), e); }

/* ================= Gerak & efek kaca ================= */
const FX_KEY = 'remindplus:fx';
let FX = Object.assign({ glass: true, motion: true }, lsGet(FX_KEY, {}) || {});
function setFx(patch) {
  FX = Object.assign(FX, patch); lsSet(FX_KEY, FX);
  document.documentElement.setAttribute('data-glass', FX.glass ? 'on' : 'off');
  document.documentElement.setAttribute('data-motion', FX.motion ? 'on' : 'off');
}
const rmq = matchMedia('(prefers-reduced-motion: reduce)');
const motionOn = () => FX.motion && !rmq.matches;

/* Kurva pegas fisik → fungsi easing linear() (Chrome 113+), dengan cadangan cubic-bezier */
function spring(stiffness, damping, mass = 1) {
  let x = 0, v = 0, t = 0;
  const dt = 1 / 120, pts = [0];
  for (let i = 0; i < 900; i++) {
    const f = -stiffness * (x - 1) - damping * v;
    v += (f / mass) * dt; x += v * dt; t += dt; pts.push(x);
    if (i > 40 && Math.abs(x - 1) < 0.0008 && Math.abs(v) < 0.008) break;
  }
  const step = Math.max(1, Math.ceil(pts.length / 64)), s = [];
  for (let i = 0; i < pts.length; i += step) s.push(+pts[i].toFixed(4));
  s.push(1);
  const ok = window.CSS && CSS.supports && CSS.supports('transition-timing-function', 'linear(0, 1)');
  return { e: ok ? 'linear(' + s.join(', ') + ')' : 'cubic-bezier(.34,1.56,.64,1)', d: Math.round(t * 1000) };
}
const SP = spring(210, 20);        // umum: sedikit memantul
const SP_SOFT = spring(150, 22);   // masuk halaman: lembut
const SP_NAV = spring(260, 22);    // indikator menu: cair & cepat

/* Indikator menu yang mengalir seperti cairan */
function moveBlobs(instant) {
  $$('.nav-blob').forEach(b => {
    const box = b.parentElement;
    placeBlob(b, $(box.classList.contains('side') ? '.nav-item.on' : 'button.on', box), instant);
  });
}
function placeBlob(blob, on, instant) {
  if (!on || !on.offsetParent) { blob.style.opacity = '0'; blob._r = null; return; }
  const r = { x: on.offsetLeft, y: on.offsetTop, w: on.offsetWidth, h: on.offsetHeight };
  const prev = blob._r; blob._r = r;
  blob.style.width = r.w + 'px'; blob.style.height = r.h + 'px';
  blob.style.transform = `translate(${r.x}px, ${r.y}px)`; blob.style.opacity = '1';
  if (instant || !prev || !motionOn() || (prev.x === r.x && prev.y === r.y && prev.w === r.w && prev.h === r.h)) return;
  const dx = r.x - prev.x, dy = r.y - prev.y, horiz = Math.abs(dx) > Math.abs(dy);
  const k = Math.min(.55, (horiz ? Math.abs(dx) / r.w : Math.abs(dy) / r.h) * .14);
  const sx = horiz ? 1 + k : 1 - k * .35, sy = horiz ? 1 - k * .35 : 1 + k;
  blob.animate([
    { transform: `translate(${prev.x}px, ${prev.y}px) scale(${prev.w / r.w}, ${prev.h / r.h})` },
    { transform: `translate(${prev.x + dx * .5}px, ${prev.y + dy * .5}px) scale(${sx}, ${sy})`, offset: .4 },
    { transform: `translate(${r.x}px, ${r.y}px) scale(1, 1)` }
  ], { duration: SP_NAV.d, easing: SP_NAV.e });
}
addEventListener('resize', () => moveBlobs(true));

/* Isi halaman muncul bertahap */
function enterAnim(root) {
  if (!motionOn() || !root) return;
  const els = [];
  $$(':scope > *', root).forEach(el => {
    if (el.matches('.grid')) els.push(...el.children);
    else if (el.matches('.list')) els.push(...[...el.children].slice(0, 8));
    else els.push(el);
  });
  els.slice(0, 22).forEach((el, i) => el.animate(
    [{ opacity: 0, transform: 'translateY(18px) scale(.98)' }, { opacity: 1, transform: 'none' }],
    { duration: SP_SOFT.d, delay: i * 45, easing: SP_SOFT.e, fill: 'backwards' }));
}

/* Riak cair saat disentuh */
document.addEventListener('pointerdown', e => {
  if (!motionOn()) return;
  const el = e.target.closest('.btn, .icon-btn, .nav-item, .bottom-nav button, .seg button, .theme-pick button, .check, .me, .cat-pick button, .tpl button, .dchips button');
  if (!el || el.disabled) return;
  const r = el.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2.2;
  const s = document.createElement('span');
  s.className = 'ripple';
  s.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
  el.appendChild(s);
  s.addEventListener('animationend', () => s.remove());
}, { passive: true });

/* Angka poin melayang */
function floatPoints(x, y, text) {
  if (!motionOn()) return;
  const f = document.createElement('div');
  f.className = 'floatpt'; f.textContent = text;
  f.style.left = x + 'px'; f.style.top = y + 'px';
  document.body.appendChild(f);
  f.animate([
    { opacity: 0, transform: 'translate(-50%, 0) scale(.6)' },
    { opacity: 1, transform: 'translate(-50%, -28px) scale(1.15)', offset: .3 },
    { opacity: 0, transform: 'translate(-50%, -80px) scale(1)' }
  ], { duration: 1100, easing: 'cubic-bezier(.2,.8,.2,1)' }).onfinish = () => f.remove();
}

/* Saldo menghitung naik/turun */
let LAST_BAL = null;
function countUp(el, to) {
  const from = LAST_BAL === null ? 0 : LAST_BAL;
  LAST_BAL = to;
  if (!el) return;
  if (!motionOn() || from === to) { el.textContent = fmt(to); return; }
  const t0 = performance.now(), d = 1000;
  const step = now => {
    const k = Math.min(1, (now - t0) / d), e = 1 - Math.pow(1 - k, 4);
    el.textContent = fmt(from + (to - from) * e);
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* Ganti tema dengan lingkaran yang meluas dari titik sentuh */
function themeTransition(fn, e) {
  const done = () => { fn(); refreshThemeButtons(); };
  if (!document.startViewTransition || !motionOn()) { done(); return; }
  const x = e && e.clientX ? e.clientX : innerWidth - 40, y = e && e.clientY ? e.clientY : 40;
  const R = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const t = document.startViewTransition(done);
  t.ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${R}px at ${x}px ${y}px)`] },
      { duration: 700, easing: 'cubic-bezier(.2,.8,.2,1)', pseudoElement: '::view-transition-new(root)' });
  }).catch(() => {});
}

/* ================= Server akun ================= */
const SERVER_KEY = 'remindplus:server';
function serverCfg() {
  const c = window.REMIND_CONFIG || {};
  if (c.supabaseUrl && c.supabaseAnonKey) return { url: c.supabaseUrl, key: c.supabaseAnonKey, fromFile: true };
  const s = lsGet(SERVER_KEY);
  if (s && s.url && s.key) return { url: s.url, key: s.key, fromFile: false };
  return null;
}
const CFG = serverCfg();
const sb = CFG ? new Supa(CFG.url, CFG.key) : null;
const APP_URL = location.origin + location.pathname;
const LOCAL_MODE_KEY = 'remindplus:local-mode';

function tr(e) {
  const m = (e && e.message) || String(e || '');
  const map = [
    [/invalid login credentials|invalid_credentials/i, 'Email atau password salah.'],
    [/email not confirmed/i, 'Email belum dikonfirmasi. Buka email Anda dan ketuk tautan konfirmasi.'],
    [/already registered|already been registered|user_already_exists/i, 'Email ini sudah terdaftar. Silakan masuk.'],
    [/password should be|weak.?password|at least 6/i, 'Password terlalu lemah. Minimal 6 karakter.'],
    [/unable to validate email|invalid format|email.*invalid|invalid.*email/i, 'Format email tidak valid.'],
    [/rate limit|too many|over_.*rate/i, 'Terlalu banyak percobaan. Tunggu beberapa menit lalu coba lagi.'],
    [/same.?password|should be different/i, 'Password baru harus berbeda dari password lama.'],
    [/expired|otp_expired|invalid.*(link|token)/i, 'Tautan sudah kedaluwarsa atau tidak valid. Minta tautan baru.'],
    [/signups? not allowed|signup.*disabled/i, 'Pendaftaran akun sedang dinonaktifkan di server.'],
    [/no api key|invalid api key|apikey/i, 'Kunci server tidak valid. Periksa pengaturan server.']
  ];
  for (const [r, x] of map) if (r.test(m)) return tx(x);
  return tx(m || 'Terjadi kesalahan. Coba lagi.');
}

/* ================= Data & sinkronisasi ================= */
const DEF = {
  v: 2,
  diff: [{ n: 'Mudah', p: 10 }, { n: 'Sedang', p: 25 }, { n: 'Sulit', p: 50 }, { n: 'Ekstrem', p: 100 }],
  study: { p: 10, m: 25 },
  rate: 100,
  levels: [{ n: 'Pemula', min: 0 }, { n: 'Rajin', min: 500 }, { n: 'Tekun', min: 1500 }, { n: 'Disiplin', min: 4000 }, { n: 'Mandiri', min: 10000 }],
  rewards: [{ id: 'r1', n: 'Main game 1 jam', p: 60 }, { id: 'r2', n: 'Nonton 1 film', p: 120 }, { id: 'r3', n: 'Jajan favorit', p: 80 }],
  tasks: [], exams: [], kas: [], kasPay: [], rem: [], log: [], earned: 0, balance: 0,
  /* Jadwal pelajaran: mapel & guru Year 9 (DHIS Lodaya), diisi per tanggal */
  subj: [{ id: 's1', n: 'Mathematics', t: 'Rizky (RZ)', h: 15 }, { id: 's2', n: 'Bahasa Indonesia', t: 'Ahmad (AD)', h: 62 }, { id: 's3', n: 'Biology', t: 'Dzihni Andiasari (DZ)', h: 109 }, { id: 's4', n: 'Chemistry', t: 'Vinna Octaviana (VO)', h: 156 }, { id: 's5', n: 'Physics', t: 'Dyantie (DY)', h: 203 }, { id: 's6', n: 'English Vocabulary', t: 'Yuni (YA)', h: 250 }, { id: 's7', n: 'English Reading & Writing', t: 'Nurul (NR)', h: 297 }, { id: 's8', n: 'English Listening & Speaking', t: 'Keith Langham (KT) / David (DV)', h: 344 }, { id: 's9', n: 'Islamic Studies', t: 'Anugrah Nurhakim (AG)', h: 31 }, { id: 's10', n: 'Tahsin & Tahfidz', t: 'Ari Fauzi (AF) / Hasan (HA)', h: 78 }, { id: 's11', n: 'Social Studies', t: 'Ananda Amalia (AN)', h: 125 }, { id: 's12', n: 'ICT / Computing', t: 'Erizka Yolanda (EY)', h: 172 }, { id: 's13', n: 'Physical Education', t: 'Irfan Fadhil (IF)', h: 219 }, { id: 's14', n: 'Entrepreneurship', t: 'Nunung Setiani (NS)', h: 266 }, { id: 's15', n: 'Civics / Art / Basa Sunda', t: 'M. Reza (MR) / Prega Panji (PR) / Sunda Teacher (SU)', h: 313 }, { id: 's16', n: 'Research', t: 'Salma (SA) & Ahmad (AD)', h: 0 }, { id: 's17', n: 'TKA Prep: Bahasa Indonesia', t: 'Hilwan Faruq (HF)', h: 47 }, { id: 's18', n: 'TKA Prep: Matematika', t: 'Maulana Fajar (MF)', h: 94 }, { id: 's19', n: 'Cambridge Checkpoint Try Out', t: 'Maulana Fajar (MF) / Dyantie (DY) / Febi (FS)', h: 141 }, { id: 's20', n: 'HRT Session', t: 'Dyantie (DY)', h: 188 }, { id: 's21', n: 'Extracurricular', t: '', h: 235 }],
  tt: {}, ttMin: 35, ttStart: '07:00',
  remind: { exam: '19:00', taskH: 24, latePct: 0, examBonus: 20, siren: true, ttLead: 0, ttAt: 0 },
  profile: { name: '' },
  meta: { modifiedAt: 0, syncedAt: null, dirty: false }
};
let S = clone(DEF);
let USER = null;           // {id, email, name, local}
let V = (() => { try { const v = sessionStorage.getItem('remindplus:back'); sessionStorage.removeItem('remindplus:back'); return v || 'home'; } catch (e) { return 'home'; } })();
const stateKey = id => 'remindplus:state:' + id;
const LEGACY_KEY = 'poin-mandiri-v1';

function merge(d) {
  d = d || {};
  S = Object.assign(clone(DEF), d);
  S.remind = Object.assign({}, DEF.remind, d.remind || {});
  S.profile = Object.assign({}, DEF.profile, d.profile || {});
  S.meta = Object.assign({}, DEF.meta, d.meta || {});
  if (!S.tt || typeof S.tt !== 'object' || Array.isArray(S.tt)) S.tt = {};
  ['tasks', 'exams', 'kas', 'kasPay', 'rem', 'log', 'rewards', 'diff', 'levels', 'subj'].forEach(k => { if (!Array.isArray(S[k])) S[k] = clone(DEF[k]); });
}
function saveLocal() { if (USER) lsSet(stateKey(USER.id), S); }
const isFresh = s => !(s.log && s.log.length) && !(s.tasks && s.tasks.length) && !(s.exams && s.exams.length);

/* Status sinkron untuk ditampilkan */
let SYNC = { st: 'local', txt: 'Mode lokal · di perangkat ini' };
function setSync(st, txt) {
  SYNC = { st, txt };
  $$('.sync').forEach(el => { el.className = 'sync ' + st; el.innerHTML = '<i></i><span>' + esc(txt) + '</span>'; });
}
const timeShort = d => new Date(d).toLocaleTimeString(LOC, { hour: '2-digit', minute: '2-digit' });

let pushT = null, pushing = false, pushAgain = false;
function persist() {
  S.meta.modifiedAt = Date.now();
  if (!USER.local) S.meta.dirty = true;
  saveLocal();
  if (USER.local) return;
  clearTimeout(pushT);
  pushT = setTimeout(push, 1200);
  setSync('busy', 'Menyimpan…');
}
async function push() {
  if (!USER || USER.local || !sb) return;
  if (pushing) { pushAgain = true; return; }
  pushing = true;
  const startedMod = S.meta.modifiedAt;
  const at = nowIso();
  try {
    const snap = clone(S);
    snap.meta.dirty = false; snap.meta.syncedAt = at;
    await sb.putState(USER.id, snap, at);
    S.meta.syncedAt = at;
    if (S.meta.modifiedAt === startedMod) S.meta.dirty = false;
    saveLocal();
    setSync('ok', T`Tersinkron · ${timeShort(at)}`);
  } catch (e) {
    if (e.code === 'offline') setSync('warn', 'Offline · disimpan di perangkat');
    else if (e.code === 'no_session') return;
    else setSync('err', T`Gagal sinkron: ${tr(e)}`);
  } finally {
    pushing = false;
    if (pushAgain || (S.meta.dirty && S.meta.modifiedAt !== startedMod)) { pushAgain = false; clearTimeout(pushT); pushT = setTimeout(push, 400); }
  }
}
async function pushNow() { clearTimeout(pushT); await push(); }

let pulling = false;
async function pull(first) {
  if (!USER || USER.local || !sb || pulling) return;
  pulling = true;
  if (first) setSync('busy', 'Menyinkronkan…');
  try {
    const row = await sb.getState(USER.id);
    if (!row) {
      await offerMigration();
      S.meta.modifiedAt = S.meta.modifiedAt || Date.now();
      S.meta.dirty = true; saveLocal();
      await push();
      render();
      return;
    }
    const cloudAt = Date.parse(row.updated_at) || 0;
    const syncedAt = Date.parse(S.meta.syncedAt || 0) || 0;
    if (S.meta.dirty && S.meta.modifiedAt > cloudAt) {
      await push();
    } else if (cloudAt !== syncedAt || S.meta.dirty) {
      merge(row.data);
      S.meta.syncedAt = row.updated_at; S.meta.dirty = false;
      saveLocal();
      render();
      setSync('ok', T`Tersinkron · ${timeShort(Date.now())}`);
    } else {
      setSync('ok', T`Tersinkron · ${timeShort(Date.now())}`);
    }
  } catch (e) {
    if (e.code === 'offline') setSync('warn', 'Offline · disimpan di perangkat');
    else if (e.code !== 'no_session') setSync('err', T`Gagal sinkron: ${tr(e)}`);
  } finally { pulling = false; }
}

/* Data lama (Poin Mandiri / mode lokal) yang bisa dipindahkan ke akun */
function migrationCandidate() {
  const done = lsGet('remindplus:migrated', {});
  for (const key of [stateKey('local'), LEGACY_KEY]) {
    if (done[key]) continue;
    const d = lsGet(key);
    if (d && Array.isArray(d.log) && !isFresh(d)) return { key, data: d };
  }
  return null;
}
function markMigrated(key) { const d = lsGet('remindplus:migrated', {}); d[key] = USER ? USER.id : true; lsSet('remindplus:migrated', d); }
async function offerMigration() {
  const c = migrationCandidate();
  if (!c || !isFresh(S)) return;
  const label = c.key === LEGACY_KEY ? 'Poin Mandiri' : tx('mode tanpa akun');
  const ok = await ask('Pindahkan data lama?',
    T`Ditemukan data ${label} di perangkat ini: ${fmt(c.data.balance)} poin, ${(c.data.tasks || []).length} tugas, ${(c.data.log || []).length} catatan riwayat. Pindahkan ke akun ${USER.email}?`,
    'Pindahkan', 'grad', 'Lewati');
  markMigrated(c.key);
  if (ok) { merge(c.data); S.meta = clone(DEF.meta); toast('Data lama dipindahkan ke akun'); }
}

/* ================= Modal & toast ================= */
function modal({ title, html = '', actions = [], wide = false }) {
  return new Promise(res => {
    const m = $('#modal');
    m.innerHTML = `<div class="box${wide ? ' wide' : ''}" role="dialog" aria-modal="true"><h3></h3><div class="mb">${html}</div><div class="acts"></div></div>`;
    $('h3', m).textContent = title;
    enhance(m);
    let closing = false;
    const close = v => {
      if (closing) return; closing = true;
      const fin = () => { m.getAnimations().forEach(a => a.cancel()); m.hidden = true; m.innerHTML = ''; res(v); };
      if (!motionOn()) { fin(); return; }
      $('.box', m).animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(6px) scale(.95)' }], { duration: 170, easing: 'cubic-bezier(.4,0,1,1)', fill: 'forwards' });
      m.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 190, easing: 'ease-in', fill: 'forwards' }).onfinish = fin;
    };
    actions.forEach(a => {
      const b = document.createElement('button');
      b.className = 'btn ' + (a.cls || '');
      b.textContent = a.label;
      b.onclick = () => { if (a.validate && !a.validate(m)) return; close(a.get ? a.get(m) : a.value); };
      $('.acts', m).appendChild(b);
    });
    m.onclick = e => { if (e.target === m) close(null); };
    m.hidden = false;
    if (motionOn()) {
      m.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220, easing: 'ease-out' });
      $('.box', m).animate([{ opacity: 0, transform: 'translateY(18px) scale(.9)' }, { opacity: 1, transform: 'none' }], { duration: SP.d, easing: SP.e });
    }
    const f = $('input', m); if (f) setTimeout(() => f.focus(), 60);
  });
}
const ask = (title, msg, ok = 'Ya', cls = '', cancel = 'Batal') =>
  modal({ title, html: `<p>${esc(msg)}</p>`, actions: [{ label: cancel, cls: 'ghost', value: false }, { label: ok, cls, value: true }] }).then(v => !!v);

function toast(msg, action) {
  const t = $('#toast');
  t.innerHTML = '';
  const s = document.createElement('span'); s.textContent = msg; t.appendChild(s);
  if (action) {
    const b = document.createElement('button');
    b.className = 'linkish'; b.style.cssText = 'margin-left:14px;color:inherit;text-decoration:underline';
    b.textContent = action.label;
    b.onclick = () => { t._seq++; t.hidden = true; action.fn(); };
    t.appendChild(b);
  }
  t._seq = (t._seq || 0) + 1;
  const was = t.hidden;
  t.getAnimations().forEach(a => a.cancel());
  t.hidden = false;
  if (motionOn()) t.animate(was
    ? [{ opacity: 0, transform: 'translate(-50%, 22px) scale(.88)' }, { opacity: 1, transform: 'translate(-50%, 0) scale(1)' }]
    : [{ transform: 'translate(-50%, 0) scale(.96)' }, { transform: 'translate(-50%, 0) scale(1)' }], { duration: SP.d, easing: SP.e });
  clearTimeout(t._h);
  t._h = setTimeout(hideToast, action ? 5500 : 2400);
}
function hideToast() {
  const t = $('#toast'); if (t.hidden) return;
  const seq = t._seq;
  if (!motionOn()) { t.hidden = true; return; }
  t.animate([{ opacity: 1, transform: 'translate(-50%, 0) scale(1)' }, { opacity: 0, transform: 'translate(-50%, 14px) scale(.94)' }], { duration: 220, easing: 'ease-in', fill: 'forwards' })
    .onfinish = () => { if (t._seq === seq) { t.hidden = true; t.getAnimations().forEach(a => a.cancel()); } };
}

/* ================= Pemilih kustom: dropdown, tanggal, jam ================= */
const BULAN = LANG === 'en'
  ? ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  : ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const pad2 = n => String(n).padStart(2, '0');
let POP = null;
function closePop(instant) {
  if (!POP) return;
  const p = POP; POP = null;
  p.anchor.setAttribute('aria-expanded', 'false'); p.anchor.classList.remove('open');
  if (instant || !motionOn()) { p.el.remove(); return; }
  p.el.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `translateY(${p.up ? 6 : -6}px) scale(.96)` }], { duration: 150, easing: 'ease-in', fill: 'forwards' }).onfinish = () => p.el.remove();
}
function openPop(anchor, cls, minW) {
  closePop(true);
  const el = document.createElement('div');
  el.className = 'pop ' + (cls || '');
  document.body.appendChild(el);
  POP = { el, anchor, up: false };
  anchor.setAttribute('aria-expanded', 'true'); anchor.classList.add('open');
  POP.place = () => {
    const r = anchor.getBoundingClientRect(), vw = innerWidth, vh = innerHeight;
    el.style.maxHeight = ''; el.style.width = Math.min(Math.max(r.width, minW || 220), vw - 24) + 'px';
    const h = el.offsetHeight, below = vh - r.bottom - 12, above = r.top - 12;
    const up = h > below && above > below; POP.up = up;
    el.style.left = Math.min(Math.max(12, r.left), vw - 12 - el.offsetWidth) + 'px';
    el.style.top = (up ? Math.max(12, r.top - 8 - Math.min(h, above)) : r.bottom + 8) + 'px';
    el.style.maxHeight = Math.max(160, (up ? above : below) - 8) + 'px';
    el.style.transformOrigin = up ? 'bottom center' : 'top center';
  };
  return el;
}
function popIn(el) {
  POP.place();
  if (motionOn()) el.animate([{ opacity: 0, transform: `translateY(${POP.up ? 10 : -10}px) scale(.93)` }, { opacity: 1, transform: 'none' }], { duration: SP.d, easing: SP.e });
}
document.addEventListener('pointerdown', e => { if (POP && !POP.el.contains(e.target) && !POP.anchor.contains(e.target)) closePop(); }, true);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && POP) { const a = POP.anchor; closePop(); a.focus(); } });
addEventListener('resize', () => closePop(true));
addEventListener('scroll', e => {
  if (!POP || POP.el.contains(e.target)) return;
  const r = POP.anchor.getBoundingClientRect();
  if (!POP.anchor.isConnected || r.bottom < 0 || r.top > innerHeight) closePop(true); else POP.place();
}, true);

function enhance(root) {
  if (!root) return;
  $$('select.input:not([data-enh])', root).forEach(enhSelect);
  $$('input.input[type=date]:not([data-enh]), input.input[type=time]:not([data-enh]), input.input[type=datetime-local]:not([data-enh])', root).forEach(enhDate);
}
function pickBtn(native, icon, role) {
  native.dataset.enh = '1'; native.classList.add('native-hidden'); native.tabIndex = -1;
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'input pick'; b.setAttribute('aria-haspopup', role); b.setAttribute('aria-expanded', 'false');
  b.innerHTML = `<span class="pv"></span>${I(icon, 'ic pick-ic')}`;
  native.after(b); native._btn = b;
  return b;
}
function setVal(inp, v) { inp.value = v; inp.dispatchEvent(new Event('input', { bubbles: true })); inp.dispatchEvent(new Event('change', { bubbles: true })); }

/* Dropdown */
function enhSelect(sel) {
  const b = pickBtn(sel, 'chev', 'listbox');
  const upd = () => { $('.pv', b).textContent = sel.selectedIndex >= 0 ? sel.options[sel.selectedIndex].textContent : '—'; };
  upd(); sel.addEventListener('change', upd);
  b.onclick = () => {
    if (POP && POP.anchor === b) { closePop(); return; }
    const el = openPop(b, 'pop-list', 200);
    el.setAttribute('role', 'listbox');
    el.innerHTML = [...sel.options].map((o, i) => `<button type="button" class="opt ${i === sel.selectedIndex ? 'on' : ''}" data-i="${i}" role="option" aria-selected="${i === sel.selectedIndex}"><span>${esc(o.textContent)}</span>${I('check', 'ic opt-ck')}</button>`).join('');
    popIn(el);
    const opts = $$('.opt', el);
    opts.forEach(o => o.onclick = () => {
      const i = +o.dataset.i;
      opts.forEach(x => x.classList.toggle('on', x === o));
      if (sel.selectedIndex !== i) { sel.selectedIndex = i; sel.dispatchEvent(new Event('change', { bubbles: true })); }
      setTimeout(() => { closePop(); b.focus({ preventScroll: true }); }, motionOn() ? 120 : 0);
    });
    const cur = opts[sel.selectedIndex] || opts[0];
    if (cur) { el.scrollTop = cur.offsetTop - el.clientHeight / 2 + cur.offsetHeight / 2; cur.focus({ preventScroll: true }); }
    if (motionOn()) opts.slice(0, 14).forEach((o, i) => o.animate([{ opacity: 0, transform: 'translateY(-6px)' }, { opacity: 1, transform: 'none' }], { duration: 300, delay: 20 + i * 22, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' }));
    el.onkeydown = e => {
      const i = opts.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); (opts[i + 1] || opts[0]).focus(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); (opts[i - 1] || opts[opts.length - 1]).focus(); }
    };
  };
}

/* Tanggal, jam, dan tanggal + jam */
function fmtPick(type, v) {
  if (!v) return '';
  if (type === 'time') return hhmm(v);
  const d = new Date(type === 'date' ? v + 'T00:00' : v);
  if (isNaN(d)) return v;
  const ds = d.toLocaleDateString(LOC, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  return type === 'date' ? ds : ds + ' · ' + pad2(d.getHours()) + TS + pad2(d.getMinutes());
}
function enhDate(inp) {
  const type = inp.type;
  const b = pickBtn(inp, type === 'time' ? 'clock' : 'cal', 'dialog');
  const ph = inp.dataset.ph || (type === 'time' ? 'Pilih jam' : type === 'date' ? 'Pilih tanggal' : 'Pilih tanggal & jam');
  const upd = () => { const pv = $('.pv', b); pv.textContent = inp.value ? fmtPick(type, inp.value) : ph; pv.classList.toggle('ph', !inp.value); };
  upd(); inp.addEventListener('change', upd); inp.addEventListener('input', upd);
  b.onclick = () => { if (POP && POP.anchor === b) { closePop(); return; } openDatePop(inp, b, type); };
}
function openDatePop(inp, b, type) {
  const hasDate = type !== 'time', hasTime = type !== 'date';
  let sel = null, h = 7, m = 0;
  if (type === 'time') { const t = (inp.value || '07:00').split(':'); h = +t[0] || 0; m = +t[1] || 0; }
  else if (inp.value) {
    const d = new Date(type === 'date' ? inp.value + 'T00:00' : inp.value);
    if (!isNaN(d)) { sel = new Date(d.getFullYear(), d.getMonth(), d.getDate()); h = d.getHours(); m = d.getMinutes(); }
  } else if (type === 'datetime-local') { h = 23; m = 59; }
  const view = sel ? new Date(sel) : new Date(); view.setDate(1);
  const wide = innerWidth >= 600;
  const el = openPop(b, 'pop-date', type === 'datetime-local' ? (wide ? 500 : 320) : type === 'time' ? 230 : 320);
  el.setAttribute('role', 'dialog');
  const today = sod(Date.now());
  const calHtml = () => {
    const y = view.getFullYear(), mo = view.getMonth(), first = (new Date(y, mo, 1).getDay() + 6) % 7;
    let cells = '';
    for (let i = 0; i < 42; i++) {
      const d = new Date(y, mo, 1 - first + i), t = d.getTime();
      cells += `<button type="button" class="day ${d.getMonth() !== mo ? 'out' : ''} ${t === today ? 'today' : ''} ${sel && t === sel.getTime() ? 'on' : ''}" data-t="${t}">${d.getDate()}</button>`;
    }
    return `<div class="cal-head"><button type="button" class="icon-btn sm" data-nav="-1" aria-label="Bulan sebelumnya">${I('chevl')}</button><b>${BULAN[mo]} ${y}</b><button type="button" class="icon-btn sm" data-nav="1" aria-label="Bulan berikutnya">${I('chevr')}</button></div>
      <div class="cal-wd">${[1, 2, 3, 4, 5, 6, 0].map(i => HARI_S[i]).map(x => `<span>${x}</span>`).join('')}</div><div class="cal-grid">${cells}</div>`;
  };
  const colHtml = (k, n, v) => `<div><div class="tp-lbl">${k === 'h' ? 'Jam' : 'Menit'}</div><div class="tp-col" data-k="${k}">${Array.from({ length: n }, (_, i) => `<button type="button" class="${i === v ? 'on' : ''}" data-v="${i}">${pad2(i)}</button>`).join('')}</div></div>`;
  const tpHtml = () => `<div class="tp">${colHtml('h', 24, h)}<div class="tp-sep">:</div>${colHtml('m', 60, m)}</div>`;
  const foot = type === 'date'
    ? `<button type="button" class="btn ghost sm" data-today>Hari ini</button>`
    : type === 'time' ? `<button type="button" class="btn grad sm" data-ok>Selesai</button>`
      : `${inp.value ? '<button type="button" class="btn ghost sm" data-clear>Tanpa deadline</button>' : ''}<button type="button" class="btn grad sm" data-ok>Simpan</button>`;
  el.innerHTML = `${hasDate && hasTime ? `<div class="dt-wrap"><div class="cal">${calHtml()}</div>${tpHtml()}</div>` : hasDate ? `<div class="cal">${calHtml()}</div>` : tpHtml()}<div class="pop-foot">${foot}</div>`;
  const apply = () => {
    if (type === 'time') setVal(inp, pad2(h) + ':' + pad2(m));
    else if (type === 'date') { if (sel) setVal(inp, ymd(sel)); }
    else { const d = sel || new Date(today); setVal(inp, ymd(d) + 'T' + pad2(h) + ':' + pad2(m)); }
  };
  const bindCal = () => {
    const c = $('.cal', el); if (!c) return;
    $$('[data-nav]', c).forEach(x => x.onclick = () => {
      view.setMonth(view.getMonth() + +x.dataset.nav); c.innerHTML = calHtml(); bindCal();
      if (motionOn()) $('.cal-grid', c).animate([{ opacity: 0, transform: `translateX(${+x.dataset.nav * 14}px)` }, { opacity: 1, transform: 'none' }], { duration: 320, easing: 'cubic-bezier(.2,.8,.2,1)' });
    });
    $$('.day', c).forEach(x => x.onclick = () => {
      sel = new Date(+x.dataset.t);
      $$('.day', c).forEach(y => y.classList.toggle('on', y === x));
      if (motionOn()) x.animate([{ transform: 'scale(.8)' }, { transform: 'scale(1)' }], { duration: SP.d, easing: SP.e });
      if (type === 'date') { apply(); setTimeout(() => closePop(), motionOn() ? 160 : 0); }
      else if (x.classList.contains('out')) { view.setFullYear(sel.getFullYear(), sel.getMonth(), 1); c.innerHTML = calHtml(); bindCal(); }
    });
  };
  bindCal();
  $$('.tp-col', el).forEach(col => {
    col.onclick = e => {
      const x = e.target.closest('button'); if (!x) return;
      if (col.dataset.k === 'h') h = +x.dataset.v; else m = +x.dataset.v;
      $$('button', col).forEach(y => y.classList.toggle('on', y === x));
      col.scrollTo({ top: x.offsetTop - col.clientHeight / 2 + x.offsetHeight / 2, behavior: motionOn() ? 'smooth' : 'auto' });
      if (type === 'time') apply();
    };
  });
  const ok = $('[data-ok]', el); if (ok) ok.onclick = () => { apply(); closePop(); b.focus({ preventScroll: true }); };
  const td = $('[data-today]', el); if (td) td.onclick = () => { sel = new Date(today); apply(); closePop(); };
  const cl = $('[data-clear]', el); if (cl) cl.onclick = () => { setVal(inp, ''); closePop(); };
  popIn(el);
  $$('.tp-col', el).forEach(col => { const on = $('.on', col); if (on) col.scrollTop = on.offsetTop - col.clientHeight / 2 + on.offsetHeight / 2; });
}

/* ================= Poin & level ================= */
function add(p, what, kind, extra) {
  p = Math.round(p);
  if (!p) return null;
  const before = levelOf(S.earned).i;
  S.balance += p;
  if (p > 0) S.earned += p;
  const entry = Object.assign({ id: uid(), t: nowIso(), p, what, kind }, extra || {});
  S.log.unshift(entry);
  if (S.log.length > 1000) S.log.length = 1000;
  persist();
  const after = levelOf(S.earned).i;
  if (after > before) setTimeout(() => toast(T`Naik level! Sekarang: ${tx(S.levels[after].n)}`), 2600);
  return entry.id;
}
function undoLog(id) {
  const i = S.log.findIndex(l => l.id === id);
  if (i < 0) return;
  const l = S.log[i];
  S.balance -= l.p;
  if (l.p > 0) S.earned -= l.p;
  S.log.splice(i, 1);
}
function levelOf(e) {
  const L = [...S.levels].sort((a, b) => a.min - b.min);
  let i = 0;
  L.forEach((l, k) => { if (e >= l.min) i = k; });
  S.levels = L;
  return { i, cur: L[i], next: L[i + 1] };
}

/* ================= Waktu ================= */
const sod = ms => { const d = new Date(ms); d.setHours(0, 0, 0, 0); return d.getTime(); };
const dayDiff = ms => Math.round((sod(ms) - sod(Date.now())) / DAY);
const fdt = ms => new Date(ms).toLocaleString(LOC, { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
const fd = ms => new Date(ms).toLocaleDateString(LOC, { weekday: 'long', day: 'numeric', month: 'long' });
const dlMs = t => t.dl ? new Date(t.dl).getTime() : null;
const examAt = e => new Date(e.tgl + 'T' + (e.jam || '07:00')).getTime();
function examNight(e) {
  const d = new Date(e.tgl + 'T00:00'); d.setDate(d.getDate() - 1);
  const [h, m] = (S.remind.exam || '19:00').split(':');
  d.setHours(+h || 0, +m || 0, 0, 0);
  return d.getTime();
}
function dueChip(ms) {
  const diff = ms - Date.now(), dd = dayDiff(ms);
  if (diff < 0) { const h = Math.floor(-diff / 36e5); return `<span class="chip danger">${I('warn')}${h < 24 ? T`Terlambat ${h} jam` : T`Terlambat ${Math.floor(h / 24)} hari`}</span>`; }
  if (dd === 0) { const h = Math.floor(diff / 36e5), m = Math.floor(diff % 36e5 / 6e4); return `<span class="chip danger">${I('clock')}${h ? T`Hari ini · ${h} j ${m} mnt` : T`Hari ini · ${m} mnt`}</span>`; }
  if (dd === 1) return `<span class="chip warn">${I('clock')}Besok</span>`;
  return `<span class="chip">${I('cal')}${T`${dd} hari lagi`}</span>`;
}
function greeting() {
  const h = new Date().getHours();
  return tx(h < 11 ? 'Selamat pagi' : h < 15 ? 'Selamat siang' : h < 18 ? 'Selamat sore' : 'Selamat malam');
}
const gutc = ms => new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const gcal = (title, start, end, details, recur) => 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(title) + '&dates=' + gutc(start) + '/' + gutc(end) + '&details=' + encodeURIComponent(details || tx('Dari remind+')) + (recur ? '&recur=' + encodeURIComponent(recur) : '');
function alarmIntent(ms, msg) {
  const d = new Date(ms);
  return 'intent:#Intent;action=android.intent.action.SET_ALARM;i.android.intent.extra.alarm.HOUR=' + d.getHours() + ';i.android.intent.extra.alarm.MINUTES=' + d.getMinutes() + ';S.android.intent.extra.alarm.MESSAGE=' + encodeURIComponent(('remind+ · ' + msg).slice(0, 60)) + ';B.android.intent.extra.alarm.SKIP_UI=false;end';
}
/* iPhone / iPad: Safari tidak bisa membuat alarm di aplikasi Jam, jadi diganti file kalender (.ics) berpengingat */
const IS_IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const IS_STANDALONE = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
const canAlarm = ms => ms > Date.now() && ms - Date.now() < DAY;
const alarmBtn = (ms, msg, rrule) => {
  if (IS_IOS) return ms > Date.now() || rrule ? `<button class="btn alarm-btn sm" data-ics="${esc(JSON.stringify({ t: msg, s: ms, r: rrule || '' }))}" title="Simpan pengingat ke Kalender iPhone">${I('alarm')}Pengingat iPhone</button>` : '';
  return canAlarm(ms) ? `<a class="btn alarm-btn sm" href="${alarmIntent(ms, msg)}" title="Pasang alarm di aplikasi Jam">${I('alarm')}Alarm HP</a>` : '';
};
const icsText = s => String(s || '').replace(/\\/g, '\\\\').replace(/[,;]/g, m => '\\' + m).replace(/\n/g, '\\n');
function makeIcs(title, start, mins, rrule) {
  const z = ms => new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//remind+//ID', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'BEGIN:VEVENT',
    'UID:' + uid() + '@remindplus', 'DTSTAMP:' + z(Date.now()), 'DTSTART:' + z(start), 'DTEND:' + z(start + mins * 6e4),
    'SUMMARY:' + icsText('⏰ ' + title), 'DESCRIPTION:' + icsText(tx('Pengingat dari remind+')), rrule ? rrule : null,
    'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:' + icsText(title), 'TRIGGER:-PT0M', 'END:VALARM',
    'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:' + icsText(title), 'TRIGGER:-PT10M', 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR'].filter(Boolean).join('\r\n');
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-ics]'); if (!b) return;
  let d; try { d = JSON.parse(b.dataset.ics); } catch (x) { return; }
  const start = d.r && d.s < Date.now() ? d.s + DAY : d.s;
  const blob = new Blob([makeIcs(d.t, start, 15, d.r)], { type: 'text/calendar;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = 'remind-plus.ics';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 60000);
  toast('Buka file lalu ketuk "Tambahkan ke Kalender"');
});
const calBtn = (title, start, end, details, recur) => `<a class="btn ghost sm" target="_blank" rel="noopener" href="${gcal(title, start, end, details, recur)}" title="Simpan ke Google Kalender">${I('calplus')}Kalender</a>`;

/* ================= Statistik ================= */
function weekStats() {
  const since = Date.now() - 7 * DAY;
  let pts = 0, mins = 0, tasks = 0;
  for (const l of S.log) {
    const t = Date.parse(l.t);
    if (t < since) break;
    if (l.p > 0) pts += l.p;
    if (l.kind === 'belajar') { const m = l.min || Number((/(\d+) menit/.exec(l.what) || [])[1]) || 0; mins += m; }
    if (l.kind === 'tugas') tasks++;
  }
  return { pts, mins, tasks };
}
function streak() {
  const days = new Set(S.log.filter(l => l.p > 0).map(l => sod(Date.parse(l.t))));
  let d = sod(Date.now()), n = 0;
  if (!days.has(d)) d -= DAY;
  while (days.has(d)) { n++; d -= DAY; }
  return n;
}
const hm = m => m >= 60 ? Math.floor(m / 60) + (LANG === 'en' ? 'h ' : 'j ') + (m % 60) + 'm' : m + (LANG === 'en' ? ' min' : ' mnt');

/* ================= Layar akun ================= */
function authArt() {
  return `<section class="auth-art">
    <div class="brand"><img src="logo.svg" alt=""><span>remind<b>+</b></span></div>
    <div>
      <h1>Ingat.<br>Kerjakan.<br>Dapat poin.</h1>
      <p>Pengingat ujian dan deadline yang benar-benar berbunyi, plus poin untuk setiap usaha belajar.</p>
    </div>
    <div class="feat">
      <div><span class="fi">${I('alarm')}</span>Alarm belajar malam sebelum ujian</div>
      <div><span class="fi">${I('checks')}</span>Deadline tugas dengan tingkat kesulitan</div>
      <div><span class="fi">${I('trophy')}</span>Poin dan level untuk setiap usaha</div>
      <div><span class="fi">${I('cloud')}</span>Tersinkron di semua perangkatmu</div>
    </div>
  </section>`;
}
let AUTH = { mode: 'login', email: '' };
function showAuth(mode, opts = {}) {
  stopLoops();
  AUTH = Object.assign({ email: AUTH.email || '' }, opts, { mode });
  $('#root').innerHTML = `<div class="auth">${authArt()}
    <section class="auth-form"><div class="auth-theme"><button class="icon-btn lang-btn" data-lang-toggle title="Bahasa / Language">${LANG === 'en' ? 'ID' : 'EN'}</button><button class="icon-btn" data-theme-toggle></button></div><div class="auth-card" id="authCard"></div></section></div>`;
  $('[data-theme-toggle]').onclick = quickToggleTheme;
  $('[data-lang-toggle]').onclick = () => setLang(LANG === 'en' ? 'id' : 'en');
  refreshThemeButtons();
  authCard();
  if (motionOn()) {
    $('.auth-card').animate([{ opacity: 0, transform: 'translateY(24px) scale(.97)' }, { opacity: 1, transform: 'none' }], { duration: SP_SOFT.d, easing: SP_SOFT.e });
    $$('.auth-art h1, .auth-art p, .feat > div').forEach((el, i) => el.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: SP_SOFT.d, delay: 80 + i * 60, easing: SP_SOFT.e, fill: 'backwards' }));
  }
}
const pwField = (id, label, ph, ac) => `<label class="field"><span>${label}</span><div class="input-wrap"><input class="input" id="${id}" type="password" placeholder="${ph}" autocomplete="${ac}" minlength="6" required><button type="button" class="icon-btn sm eye" data-eye="${id}" aria-label="Tampilkan password">${I('eye')}</button></div></label>`;
function msgBox() { return AUTH.error ? `<div class="err">${esc(AUTH.error)}</div>` : AUTH.info ? `<div class="ok">${esc(AUTH.info)}</div>` : ''; }
function authCard() {
  const c = $('#authCard');
  const m = AUTH.mode;
  const noServer = !sb;
  const localLink = `<div class="auth-foot"><button class="linkish" id="goLocal">Pakai tanpa akun</button> <span class="faint">· data hanya di perangkat ini</span></div>`;
  if (noServer && m !== 'server') {
    c.innerHTML = `<h2>Selamat datang</h2><p class="sub">Atur server akun dulu agar bisa daftar dan masuk.</p>
      <div class="notice"><b>Server akun belum disiapkan</b>Masukkan alamat server Supabase Anda, atau pakai remind+ tanpa akun dulu. Data tetap bisa dipindahkan ke akun nanti.</div>
      <div class="stack"><button class="btn grad block" id="goServer">${I('server')}Atur server akun</button><button class="btn ghost block" id="goLocal">Pakai tanpa akun</button></div>`;
  } else if (m === 'login') {
    c.innerHTML = `<h2>Masuk</h2><p class="sub">Selamat datang kembali di remind+.</p>
      <form id="f" novalidate>${msgBox()}
        <label class="field"><span>Email</span><input class="input" id="em" type="email" inputmode="email" autocomplete="email" placeholder="nama@email.com" value="${esc(AUTH.email)}" required></label>
        ${pwField('pw', 'Password', 'Password Anda', 'current-password')}
        <div class="auth-links"><span></span><button type="button" id="goForgot">Lupa password?</button></div>
        <button class="btn grad block" type="submit">Masuk</button>
      </form>
      <div class="auth-foot">Belum punya akun? <button class="linkish" id="goSignup">Daftar gratis</button></div>${localLink}`;
  } else if (m === 'signup') {
    c.innerHTML = `<h2>Buat akun</h2><p class="sub">Satu akun untuk semua perangkatmu.</p>
      <form id="f" novalidate>${msgBox()}
        <label class="field"><span>Nama panggilan</span><input class="input" id="nm" autocomplete="nickname" placeholder="Contoh: Vano" required></label>
        <label class="field"><span>Email</span><input class="input" id="em" type="email" inputmode="email" autocomplete="email" placeholder="nama@email.com" value="${esc(AUTH.email)}" required></label>
        ${pwField('pw', 'Password', 'Minimal 6 karakter', 'new-password')}
        ${pwField('pw2', 'Ulangi password', 'Ketik ulang password', 'new-password')}
        <button class="btn grad block" type="submit">Daftar</button>
      </form>
      <div class="auth-foot">Sudah punya akun? <button class="linkish" id="goLogin">Masuk</button></div>${localLink}`;
  } else if (m === 'forgot') {
    c.innerHTML = `<h2>Lupa password</h2><p class="sub">Kami kirim tautan untuk membuat password baru ke email Anda.</p>
      <form id="f" novalidate>${msgBox()}
        <label class="field"><span>Email</span><input class="input" id="em" type="email" inputmode="email" autocomplete="email" placeholder="nama@email.com" value="${esc(AUTH.email)}" required></label>
        <button class="btn grad block" type="submit">Kirim tautan reset</button>
      </form>
      <div class="auth-foot"><button class="linkish" id="goLogin">← Kembali ke Masuk</button></div>`;
  } else if (m === 'reset') {
    c.innerHTML = `<h2>Buat password baru</h2><p class="sub">${T`Untuk akun ${esc(sb && sb.user ? sb.user.email : '')}.`}</p>
      <form id="f" novalidate>${msgBox()}
        ${pwField('pw', 'Password baru', 'Minimal 6 karakter', 'new-password')}
        ${pwField('pw2', 'Ulangi password baru', 'Ketik ulang password', 'new-password')}
        <button class="btn grad block" type="submit">Simpan & masuk</button>
      </form>`;
  } else if (m === 'confirm') {
    c.innerHTML = `<div class="avatar lg" style="margin-bottom:18px">${I('mail')}</div><h2>Cek email Anda</h2>
      <p class="sub">${T`Kami mengirim tautan konfirmasi ke <b>${esc(AUTH.email)}</b>. Buka email itu di perangkat ini dan ketuk tautannya untuk mengaktifkan akun. Periksa juga folder Spam.`}</p>
      <button class="btn ghost block" id="goLogin">Sudah konfirmasi? Masuk</button>`;
  } else if (m === 'server') {
    const cur = lsGet(SERVER_KEY) || {};
    c.innerHTML = `<h2>Server akun</h2><p class="sub">Isi dari Supabase → Project Settings → API.</p>
      <form id="f" novalidate>${msgBox()}
        <label class="field"><span>Project URL</span><input class="input" id="su" inputmode="url" placeholder="https://xxxx.supabase.co" value="${esc(cur.url || '')}" required></label>
        <label class="field"><span>Anon public key</span><textarea class="input" id="sk" rows="3" placeholder="eyJhbGciOi…" required>${esc(cur.key || '')}</textarea></label>
        <button class="btn grad block" type="submit">Simpan server</button>
      </form>
      <div class="auth-foot"><button class="linkish" id="goBack">← Kembali</button></div>`;
  }
  // tautan antar layar
  const nav = (id, mode) => { const b = $('#' + id, c); if (b) b.onclick = () => { AUTH.email = ($('#em', c) || {}).value || AUTH.email; AUTH.error = AUTH.info = ''; AUTH.mode = mode; authCard(); }; };
  nav('goSignup', 'signup'); nav('goLogin', 'login'); nav('goForgot', 'forgot'); nav('goServer', 'server'); nav('goBack', 'login');
  const gl = $('#goLocal', c); if (gl) gl.onclick = startLocal;
  $$('[data-eye]', c).forEach(b => b.onclick = () => { const i = $('#' + b.dataset.eye); const show = i.type === 'password'; i.type = show ? 'text' : 'password'; b.innerHTML = I(show ? 'eyeoff' : 'eye'); });
  const f = $('#f', c);
  if (f) f.onsubmit = e => { e.preventDefault(); submitAuth(f); };
  const first = $('input:not([value]):not([type=hidden]), input[value=""]', c) || $('input', c);
  if (first && matchMedia('(min-width: 900px)').matches) first.focus();
}
/* Tampilkan pesan galat tanpa menghapus isian formulir */
function authFail(msg) {
  AUTH.error = msg; AUTH.info = '';
  const f = $('#f');
  if (!f) { authCard(); return; }
  let e = $('.err', f) || $('.ok', f);
  if (!e) { e = document.createElement('div'); f.prepend(e); }
  e.className = 'err'; e.textContent = msg;
  const btn = $('button[type=submit]', f);
  if (btn) { btn.disabled = false; if (btn.dataset.l) btn.textContent = btn.dataset.l; }
}
async function submitAuth(f) {
  const m = AUTH.mode, v = id => (($('#' + id, f) || {}).value || '').trim();
  const btn = $('button[type=submit]', f);
  const busy = on => { btn.disabled = on; btn.textContent = on ? 'Memproses…' : btn.dataset.l || btn.textContent; };
  btn.dataset.l = btn.textContent;
  try {
    if (m === 'server') {
      const url = v('su'), key = v('sk');
      if (!/^https:\/\/.+/.test(url)) return authFail('Project URL harus diawali https://');
      if (key.length < 30) return authFail('Anon key terlalu pendek. Salin lengkap dari Supabase.');
      lsSet(SERVER_KEY, { url, key });
      location.reload();
      return;
    }
    if (m === 'login') {
      AUTH.email = v('em');
      if (!AUTH.email || !v('pw')) return authFail('Isi email dan password.');
      busy(true);
      await sb.signIn(AUTH.email, $('#pw', f).value);
      enterApp(userFromSession());
    } else if (m === 'signup') {
      AUTH.email = v('em');
      const name = v('nm'), pw = $('#pw', f).value, pw2 = $('#pw2', f).value;
      if (!name) return authFail('Isi nama panggilan.');
      if (!AUTH.email) return authFail('Isi email.');
      if (pw.length < 6) return authFail('Password minimal 6 karakter.');
      if (pw !== pw2) return authFail('Kedua password tidak sama.');
      busy(true);
      const r = await sb.signUp(AUTH.email, pw, name, APP_URL);
      if (r.needsConfirm) { AUTH.error = ''; AUTH.mode = 'confirm'; authCard(); }
      else { enterApp(userFromSession()); toast(T`Akun dibuat. Selamat datang, ${name}!`); }
    } else if (m === 'forgot') {
      AUTH.email = v('em');
      if (!AUTH.email) return authFail('Isi email Anda.');
      busy(true);
      await sb.recover(AUTH.email, APP_URL);
      AUTH.error = ''; AUTH.info = 'Jika email terdaftar, tautan reset sudah dikirim. Buka email Anda di perangkat ini.'; authCard();
    } else if (m === 'reset') {
      const pw = $('#pw', f).value, pw2 = $('#pw2', f).value;
      if (pw.length < 6) return authFail('Password minimal 6 karakter.');
      if (pw !== pw2) return authFail('Kedua password tidak sama.');
      busy(true);
      await sb.updateUser({ password: pw });
      enterApp(userFromSession());
      toast('Password baru disimpan');
    }
  } catch (e) {
    authFail(tr(e));
  }
}
function userFromSession() {
  const u = sb.user || {};
  const md = u.user_metadata || {};
  return { id: u.id, email: u.email || '', name: md.name || md.full_name || '', local: false };
}
function startLocal() {
  lsSet(LOCAL_MODE_KEY, true);
  enterApp({ id: 'local', email: '', name: '', local: true });
}

/* ================= Aplikasi ================= */
const NAV = [
  ['home', 'Beranda', 'home'], ['tugas', 'Tugas', 'checks'], ['ujian', 'Ujian', 'cap'], ['jadwal', 'Jadwal', 'cal'], ['kas', 'Kas', 'wallet'], ['ingat', 'Pengingat', 'bell'], ['belajar', 'Belajar', 'timer'],
  ['riwayat', 'Riwayat', 'history'], ['atur', 'Pengaturan', 'sliders']
];
const TITLES = { tugas: 'Tugas', ujian: 'Ujian', jadwal: 'Jadwal Pelajaran', kas: 'Uang Kas', ingat: 'Pengingat', belajar: 'Belajar', riwayat: 'Riwayat', atur: 'Pengaturan' };
const displayName = () => (USER && (USER.local ? S.profile.name : USER.name)) || (USER && USER.email ? USER.email.split('@')[0] : '') || tx('Kamu');
const initial = () => (displayName().trim()[0] || 'R').toUpperCase();

function enterApp(user) {
  USER = user;
  merge(lsGet(stateKey(user.id)));
  if (user.local && isFresh(S)) {
    const legacy = lsGet(LEGACY_KEY);
    const done = lsGet('remindplus:migrated', {});
    if (legacy && Array.isArray(legacy.log) && !isFresh(legacy) && !done[LEGACY_KEY]) { merge(legacy); S.meta = clone(DEF.meta); markMigrated(LEGACY_KEY); saveLocal(); }
  }
  shell();
  if (user.local) setSync('local', 'Mode lokal · di perangkat ini');
  else setSync('busy', 'Menyinkronkan…');
  go(V && NAV.some(n => n[0] === V) ? V : 'home');
  startLoops();
  if (!user.local) pull(true);
}

function shell() {
  $('#root').innerHTML = `
  <svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7B5CFF"/><stop offset=".55" stop-color="#4E6BFF"/><stop offset="1" stop-color="#1FC9A2"/></linearGradient></defs></svg>
  <div class="app">
    <aside class="side"><span class="nav-blob" aria-hidden="true"></span>
      <div class="brand"><img src="logo.svg" alt=""><span>remind<b>+</b></span></div>
      ${NAV.map(([k, l, ic]) => `<button class="nav-item" data-go="${k}">${I(ic)}<span>${l}</span></button>`).join('')}
      <div class="side-foot">
        <div class="sync"></div>
        <button class="me" data-go="atur"><span class="avatar" data-av></span><span class="who"><b data-name></b><span data-mail></span></span></button>
      </div>
    </aside>
    <main class="main">
      <header class="top">
        <div style="display:flex;align-items:center;gap:12px;min-width:0">
          <img class="mobile-brand" src="logo.svg" alt="remind+" width="40" height="40" style="border-radius:12px">
          <div style="min-width:0"><div class="hello" id="hello"></div><h1 id="title"></h1></div>
        </div>
        <div class="top-actions">
          <button class="icon-btn" data-theme-toggle></button>
          <button class="avatar mobile-brand" data-go="atur" data-av style="border:0;cursor:pointer" aria-label="Akun"></button>
        </div>
      </header>
      <div id="alerts" class="alerts"></div>
      <div id="view"></div>
    </main>
    <nav class="bottom-nav"><span class="nav-blob" aria-hidden="true"></span>${NAV.map(([k, l, ic]) => `<button data-go="${k}">${I(ic)}<span>${k === 'atur' ? 'Atur' : k === 'ingat' ? 'Ingat' : l}</span></button>`).join('')}</nav>
  </div>`;
  $$('[data-go]').forEach(b => b.onclick = () => go(b.dataset.go));
  $$('[data-theme-toggle]').forEach(b => b.onclick = quickToggleTheme);
  refreshThemeButtons();
  setSync(SYNC.st, SYNC.txt);
}
function updateIdentity() {
  $$('[data-av]').forEach(e => avPaint(e));
  $$('[data-name]').forEach(e => { e.textContent = displayName(); });
  $$('[data-mail]').forEach(e => { e.textContent = USER.local ? 'Mode tanpa akun' : USER.email; });
}
let ENTER = true;
function go(v) {
  if (v !== V) ENTER = true;
  V = v;
  $$('[data-go]').forEach(b => b.classList.toggle('on', b.dataset.go === v && !b.classList.contains('me') && !b.classList.contains('avatar')));
  render();
  moveBlobs();
  window.scrollTo({ top: 0, behavior: motionOn() ? 'smooth' : 'auto' });
}
function render() {
  if (!USER || !$('#view')) return;
  closePop(true);
  const pages = { home, tugas, ujian, jadwal, kas, ingat, belajar, riwayat, atur };
  if (V === 'home') { $('#hello').textContent = greeting() + ' 👋'; $('#title').textContent = displayName(); }
  else { $('#hello').textContent = new Date().toLocaleDateString(LOC, { weekday: 'long', day: 'numeric', month: 'long' }); $('#title').textContent = TITLES[V]; }
  pages[V]();
  enhance(view());
  if (ENTER) { ENTER = false; enterAnim(view()); }
  updateIdentity();
  alerts();
  badges();
  syncReminders();
}
function badges() {
  const now = Date.now();
  const t = S.tasks.filter(x => !x.done && x.dl && dlMs(x) - now <= S.remind.taskH * 36e5).length;
  const u = S.exams.filter(e => !e.done && !e.studied && dayDiff(examAt(e)) === 1).length;
  const today = ymd(new Date());
  const k = S.kas.filter(x => kasUnpaid(x).length).length;
  const ri = S.rem.filter(r => { const d = remOcc(r, now, now)[0]; return d && !r.done.includes(d); }).length;
  $$('[data-go="tugas"], [data-go="ujian"], [data-go="kas"], [data-go="ingat"]').forEach(b => {
    const n = b.dataset.go === 'tugas' ? t : b.dataset.go === 'ujian' ? u : b.dataset.go === 'kas' ? k : ri;
    let d = $('.dot', b);
    if (!n) { if (d) d.remove(); return; }
    if (!d) { d = document.createElement('span'); d.className = 'dot'; b.appendChild(d); }
    d.textContent = b.classList.contains('nav-item') ? n : '';
  });
}
const view = () => $('#view');
const emptyBox = (ic, t, s) => `<div class="empty">${I(ic)}<b>${t}</b>${s}</div>`;

/* ---------- Beranda ---------- */
function home() {
  const { cur, next } = levelOf(S.earned);
  const pct = next ? Math.min(1, (S.earned - cur.min) / (next.min - cur.min)) : 1;
  const C = 2 * Math.PI * 40;
  const w = weekStats(), st = streak(), now = Date.now();
  const agenda = [
    ...S.tasks.filter(t => !t.done && t.dl).map(t => ({ at: dlMs(t), kind: 'tugas', t: t.n, sub: esc(t.d), ic: 'checks', tone: 't-brand' })),
    ...S.exams.filter(e => !e.done && examAt(e) > now - 3 * 36e5).map(e => ({ at: examAt(e), kind: 'ujian', t: T`Ujian ${e.mapel}`, sub: esc(e.jam), ic: 'cap', tone: 't-warn' })),
    ...S.kas.map(k => { const d = kasUnpaid(k)[0] || kasNext(k); return d && ymdMs(d) - now < 8 * DAY ? { at: kasAt(k, d), kind: 'kas', t: k.n + ' · ' + rp(k.amt), ic: 'wallet', tone: 't-mint' } : null; }).filter(Boolean),
    ...S.rem.map(r => { const d = remNext(r); const c = REM_CAT[r.cat] || REM_CAT.sekolah; return d && ymdMs(d) - now < 4 * DAY ? { at: remAt(r, d), kind: 'ingat', t: r.t, ic: c.ic, tone: c.tone } : null; }).filter(Boolean)
  ].sort((a, b) => a.at - b.at).slice(0, 6);
  const recent = S.log.slice(0, 6);
  view().innerHTML = `
  <div class="grid g-home">
    <section class="hero"><span class="liq" aria-hidden="true"></span>
      <div class="lbl">Saldo poin</div>
      <div class="big num"><span id="balNum">${fmt(LAST_BAL === null ? 0 : LAST_BAL)}</span><small>poin</small></div>
      <div class="meta">${T`Total didapat ${fmt(S.earned)} poin`}</div>
      <div class="acts">
        <button class="btn" data-go2="tugas">${I('plus')}Tambah tugas</button>
        <button class="btn glass" data-go2="belajar">${I('play')}Mulai belajar</button>
      </div>
    </section>
    <section class="card level">
      <div class="ring"><svg width="96" height="96" viewBox="0 0 96 96"><circle class="track" cx="48" cy="48" r="40" fill="none" stroke-width="9"/><circle class="val" cx="48" cy="48" r="40" fill="none" stroke-width="9" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${ENTER && motionOn() ? C : C * (1 - pct)}" data-to="${C * (1 - pct)}"/></svg>
        <div class="lv"><div><small>Level</small>${levelOf(S.earned).i + 1}</div></div></div>
      <div style="min-width:0">
        <h3>${esc(cur.n)}</h3>
        <div class="muted small" style="margin:2px 0 10px">${next ? T`${fmt(next.min - S.earned)} poin lagi menuju <b>${esc(tx(next.n))}</b>` : tx('Level tertinggi tercapai')}</div>
        <span class="chip ${st ? 'danger' : ''}">${I('flame')}${st ? T`${st} hari beruntun` : tx('Mulai streak hari ini')}</span>
      </div>
    </section>
  </div>
  <div class="grid g4" style="margin-top:16px">
    <div class="card stat"><div class="ico t-brand">${I('spark')}</div><div class="v num">${fmt(w.pts)}</div><div class="l">Poin 7 hari</div></div>
    <div class="card stat"><div class="ico t-mint">${I('book')}</div><div class="v num">${hm(w.mins)}</div><div class="l">Waktu belajar</div></div>
    <div class="card stat"><div class="ico t-warn">${I('checks')}</div><div class="v num">${w.tasks}</div><div class="l">Tugas selesai</div></div>
    <div class="card stat"><div class="ico t-danger">${I('trophy')}</div><div class="v num">${S.tasks.filter(t => !t.done).length}</div><div class="l">Tugas aktif</div></div>
  </div>
  ${ttHomeCard()}
  <div class="grid g2" style="margin-top:16px">
    <section class="card">
      <div class="card-head"><h2>Agenda terdekat</h2><button class="btn ghost sm" data-go2="ujian">${I('plus')}Ujian</button></div>
      <div class="list">${agenda.length ? agenda.map(a => `
        <div class="item" data-go2="${a.kind}" style="cursor:pointer"><div class="lead ${a.tone}">${I(a.ic)}</div>
          <div class="body"><div class="ttl">${esc(a.t)}</div><div class="meta">${dueChip(a.at)}<span class="faint small">${fdt(a.at)}</span></div></div></div>`).join('')
        : emptyBox('cal', 'Tidak ada agenda', 'Tambahkan deadline tugas atau jadwal ujian.')}</div>
    </section>
    <section class="card">
      <div class="card-head"><h2>Aktivitas terbaru</h2><button class="btn ghost sm" data-go2="riwayat">Semua</button></div>
      <div class="list">${recent.length ? recent.map(logItem).join('') : emptyBox('history', 'Belum ada aktivitas', 'Selesaikan tugas atau mulai belajar untuk dapat poin.')}</div>
    </section>
  </div>`;
  $$('[data-go2]', view()).forEach(b => b.onclick = () => go(b.dataset.go2));
  countUp($('#balNum'), S.balance);
  const ringV = $('.ring .val'); if (ringV) requestAnimationFrame(() => requestAnimationFrame(() => { ringV.style.strokeDashoffset = ringV.dataset.to; }));
  const hero = $('.hero');
  hero.addEventListener('pointermove', e => { const r = hero.getBoundingClientRect(); hero.style.setProperty('--mx', (e.clientX - r.left) + 'px'); hero.style.setProperty('--my', (e.clientY - r.top) + 'px'); });
}
function logItem(l) {
  const ic = { tugas: 'checks', belajar: 'book', reward: 'gift', ujian: 'cap', kas: 'wallet', ingat: 'bell', koreksi: 'pencil' }[l.kind] || 'spark';
  const tone = l.p > 0 ? 't-mint' : 't-danger';
  return `<div class="item"><div class="lead ${tone}">${I(ic)}</div><div class="body"><div class="ttl">${esc(logWhat(l.what))}</div><div class="faint small">${new Date(l.t).toLocaleString(LOC, { dateStyle: 'medium', timeStyle: 'short' })}</div></div><span class="pts num ${l.p > 0 ? 'plus' : 'minus'}">${l.p > 0 ? '+' : ''}${fmt(l.p)}</span></div>`;
}

/* ---------- Tugas ---------- */
let TF = 'aktif';
function tugas() {
  const nw = Date.now();
  const open = S.tasks.filter(t => !t.done).sort((a, b) => (dlMs(a) ?? 9e15) - (dlMs(b) ?? 9e15));
  const done = S.tasks.filter(t => t.done).slice(0, 30);
  const list = TF === 'aktif' ? open : done;
  view().innerHTML = `
  <section class="card">
    <h2>Tambah tugas</h2><p class="sub">Tentukan sendiri tingkat kesulitannya. Makin sulit, makin banyak poin.</p>
    <div class="form-row">
      <label class="field grow2"><span>Nama tugas</span><input class="input" id="tn" placeholder="Contoh: Laporan praktikum biologi"></label>
      <label class="field"><span>Kesulitan</span><select class="input" id="td">${S.diff.map((d, i) => `<option value="${i}">${T`${esc(tx(d.n))} · ${d.p} poin`}</option>`).join('')}</select></label>
      <label class="field"><span>Deadline (opsional)</span><input class="input" id="tdl" type="datetime-local" data-ph="Tanpa deadline"></label>
      <button class="btn grad" id="ta">${I('plus')}Tambah</button>
    </div>
    ${S.remind.latePct ? `<p class="faint small" style="margin:12px 0 0">${T`Tugas yang selesai lewat deadline hanya mendapat ${100 - S.remind.latePct}% poin.`}</p>` : ''}
  </section>
  <div class="sec-title"><div class="seg" id="tf"><button data-f="aktif" class="${TF === 'aktif' ? 'on' : ''}">${T`Aktif · ${open.length}`}</button><button data-f="selesai" class="${TF === 'selesai' ? 'on' : ''}">Selesai</button></div></div>
  <div class="list">${list.length ? list.map(t => {
    const d = dlMs(t), late = d && d < nw;
    const p = !t.done && late && S.remind.latePct ? Math.round(t.p * (1 - S.remind.latePct / 100)) : (t.done ? (t.got ?? t.p) : t.p);
    const rAt = d ? Math.max(nw + 6e4, d - S.remind.taskH * 36e5) : 0;
    return `<div class="item ${t.done ? 'done' : ''}" data-id="${t.id}">
      <button class="check ${t.done ? 'on' : ''}" data-done="${t.id}" aria-label="Tandai selesai" ${t.done ? 'disabled' : ''}>${I('check')}</button>
      <div class="body"><div class="ttl">${esc(t.n)}</div>
        <div class="meta"><span class="chip brand">${esc(t.d)}</span>${t.done ? (t.late ? '<span class="chip danger">Terlambat</span>' : '<span class="chip mint">Selesai</span>') : (d ? dueChip(d) + `<span class="faint small">${fdt(d)}</span>` : '<span class="faint small">Tanpa deadline</span>')}</div></div>
      <span class="pts num plus">+${p}</span>
      ${t.done ? `<div class="acts"><button class="icon-btn sm danger" data-del="${t.id}" aria-label="Hapus">${I('trash')}</button></div>` : `<div class="acts">
        ${d && !late ? alarmBtn(rAt, T`Deadline: ${t.n}`) + calBtn('⏰ ' + T`Deadline: ${t.n}`, rAt, rAt + 18e5, T`Tugas "${t.n}" jatuh tempo ${fdt(d)}.`) : ''}
        <button class="btn ghost sm" data-edl="${t.id}">${I('cal')}${d ? 'Ubah' : 'Deadline'}</button>
        <button class="icon-btn sm danger" data-del="${t.id}" aria-label="Hapus">${I('trash')}</button></div>`}
    </div>`;
  }).join('') : TF === 'aktif' ? emptyBox('checks', 'Belum ada tugas aktif', 'Tambahkan tugas di atas, lalu centang saat selesai.') : emptyBox('trophy', 'Belum ada yang selesai', 'Tugas yang dicentang akan muncul di sini.')}</div>`;
  const addT = () => {
    const n = $('#tn').value.trim(); if (!n) { $('#tn').focus(); return; }
    const d = S.diff[$('#td').value], dl = $('#tdl').value || '';
    S.tasks.unshift({ id: uid(), n, d: d.n, p: d.p, done: false, dl, c: Date.now() });
    persist(); TF = 'aktif'; render();
    toast(dl ? T`Tugas ditambah · pengingat ${S.remind.taskH} jam sebelum deadline` : tx('Tugas ditambah'));
  };
  $('#ta').onclick = addT; $('#tn').onkeydown = e => { if (e.key === 'Enter') addT(); };
  $$('#tf button').forEach(b => b.onclick = () => { TF = b.dataset.f; render(); });
  $$('[data-done]', view()).forEach(b => b.onclick = () => {
    const r = b.getBoundingClientRect(), id = b.dataset.done;
    if (!motionOn()) { completeTask(id); return; }
    b.classList.add('on', 'pop'); b.disabled = true;
    setTimeout(() => { const p = completeTask(id); if (p) floatPoints(r.left + r.width / 2, r.top - 6, '+' + p); }, 300);
  });
  $$('[data-del]', view()).forEach(b => b.onclick = async () => {
    if (!await ask('Hapus tugas?', 'Tugas ini akan dihapus. Poin yang sudah didapat tidak berubah.', 'Hapus', 'danger solid')) return;
    S.tasks = S.tasks.filter(x => x.id !== b.dataset.del); persist(); render();
  });
  $$('[data-edl]', view()).forEach(b => b.onclick = () => {
    const t = S.tasks.find(x => x.id === b.dataset.edl), item = b.closest('.item');
    if ($('.inline-edit', item)) return;
    const box = document.createElement('div'); box.className = 'inline-edit';
    box.innerHTML = `<input class="input" type="datetime-local" value="${esc(t.dl || '')}"><button class="btn sm">Simpan</button>${t.dl ? '<button class="btn ghost sm">Hapus deadline</button>' : ''}`;
    item.style.flexWrap = 'wrap'; item.appendChild(box);
    const [inp, sv, rm] = $$('input,button', box);
    inp.dataset.ph = 'Pilih tanggal & jam'; enhance(box); setTimeout(() => inp._btn && inp._btn.click(), 60);
    sv.onclick = () => { t.dl = inp.value || ''; t.c = Date.now(); persist(); render(); toast('Deadline disimpan'); };
    if (rm) rm.onclick = () => { t.dl = ''; persist(); render(); toast('Deadline dihapus'); };
  });
}
function completeTask(id) {
  const t = S.tasks.find(x => x.id === id); if (!t || t.done) return;
  const d = dlMs(t), late = !!(d && Date.now() > d);
  let p = t.p; if (late && S.remind.latePct) p = Math.round(p * (1 - S.remind.latePct / 100));
  t.done = true; t.at = nowIso(); t.late = late; t.got = p;
  const logId = add(p, 'Tugas: ' + t.n + (late ? ' (terlambat)' : ''), 'tugas');
  S.tasks = [...S.tasks.filter(x => !x.done), ...S.tasks.filter(x => x.done).sort((a, b) => (b.at || '').localeCompare(a.at || ''))].slice(0, 400);
  persist(); render();
  toast(late && S.remind.latePct ? T`+${p} poin (dipotong karena terlambat)` : T`+${p} poin`, {
    label: 'Batalkan', fn: () => { const x = S.tasks.find(y => y.id === id); if (x) { x.done = false; delete x.at; delete x.late; delete x.got; } undoLog(logId); persist(); render(); toast('Dibatalkan'); }
  });
  return p;
}

/* ---------- Ujian ---------- */
function ujian() {
  const now = Date.now();
  const up = S.exams.filter(e => !e.done).sort((a, b) => examAt(a) - examAt(b));
  const past = S.exams.filter(e => e.done).sort((a, b) => examAt(b) - examAt(a)).slice(0, 20);
  const tm = new Date(now + DAY);
  const tv = tm.getFullYear() + '-' + String(tm.getMonth() + 1).padStart(2, '0') + '-' + String(tm.getDate()).padStart(2, '0');
  view().innerHTML = `
  <section class="card">
    <h2>Tambah jadwal ujian</h2><p class="sub">${T`remind+ mengingatkan Anda belajar malam sebelumnya, jam <b>${esc(hhmm(S.remind.exam))}</b>. Bonus <b>+${S.remind.examBonus} poin</b> kalau sudah belajar.`}</p>
    <div class="form-row">
      <label class="field grow2"><span>Mata pelajaran / materi</span><input class="input" id="em" list="subjDL" autocomplete="off" placeholder="Contoh: Matematika – Trigonometri">${subjDL()}</label>
      <label class="field"><span>Tanggal</span><input class="input" id="et" type="date" value="${tv}"></label>
      <label class="field"><span>Jam mulai</span><input class="input" id="ej" type="time" value="07:30"></label>
    </div>
    <div class="tt-from" id="exTT" hidden></div>
    <div class="form-row" style="margin-top:12px">
      <label class="field grow2"><span>Catatan (opsional)</span><input class="input" id="en" placeholder="Contoh: bab 4–6, bawa kalkulator"></label>
      <button class="btn grad" id="ea">${I('plus')}Tambah ujian</button>
    </div>
  </section>
  <div class="sec-title"><h3>Ujian mendatang <span class="count">${up.length}</span></h3></div>
  <div class="list">${up.length ? up.map(e => {
    const at = examAt(e), nt = examNight(e), passed = at < now;
    return `<div class="item"><div class="lead t-warn">${I('cap')}</div>
      <div class="body"><div class="ttl">${esc(e.mapel)}</div>
        <div class="faint small" style="margin-top:2px">${fd(at)} · ${esc(e.jam)}${e.catatan ? ' · ' + esc(e.catatan) : ''}</div>
        <div class="meta">${passed ? '<span class="chip">Sudah lewat</span>' : dueChip(at)}${e.studied ? `<span class="chip mint">${I('check')}Sudah belajar</span>` : `<span class="chip">${I('bell')}${T`Belajar ${fdt(nt)}`}</span>`}</div></div>
      <div class="acts">
        ${!passed ? alarmBtn(nt, T`Belajar ujian ${e.mapel}`) : ''}
        ${!passed && nt > now ? calBtn('📚 ' + T`Belajar untuk ujian ${e.mapel}`, nt, nt + 2 * 36e5, T`Ujian ${e.mapel} ${fdt(at)}` + (e.catatan ? '. ' + e.catatan : '')) : ''}
        ${!passed ? `<button class="btn soft sm" data-est="${e.id}">${I('play')}Belajar</button>` : ''}
        ${!e.studied && !passed ? `<button class="btn mint sm" data-esd="${e.id}">${I('check')}Sudah belajar</button>` : ''}
        ${passed ? `<button class="btn mint sm" data-edn="${e.id}">${I('check')}Selesai</button>` : ''}
        <button class="icon-btn sm" data-ett="${e.tgl}" title="Lihat di jadwal" aria-label="Lihat di jadwal">${I('cal')}</button>
        <button class="icon-btn sm danger" data-edel="${e.id}" aria-label="Hapus">${I('trash')}</button>
      </div></div>`;
  }).join('') : emptyBox('cap', 'Belum ada jadwal ujian', 'Tambahkan ujian agar remind+ bisa mengingatkan Anda belajar.')}</div>
  ${past.length ? `<div class="sec-title"><h3>Selesai</h3></div><div class="list">${past.map(e => `
    <div class="item done"><div class="lead t-mint">${I('check')}</div><div class="body"><div class="ttl">${esc(e.mapel)}</div><div class="faint small">${fd(examAt(e))}</div></div>
    ${e.studied ? `<span class="chip mint">Belajar ✓</span>` : ''}<button class="icon-btn sm danger" data-edel="${e.id}" aria-label="Hapus">${I('trash')}</button></div>`).join('')}</div>` : ''}`;
  const addE = () => {
    const m = $('#em').value.trim(), t = $('#et').value, j = $('#ej').value || '07:00';
    if (!m) { $('#em').focus(); return; } if (!t) { $('#et').focus(); return; }
    const e = { id: uid(), mapel: m, tgl: t, jam: j, catatan: $('#en').value.trim(), done: false, studied: false, c: Date.now() };
    S.exams.push(e); persist(); render();
    toast(examNight(e) > Date.now() ? T`Ujian ditambah · pengingat ${fdt(examNight(e))}` : tx('Ujian ditambah'));
  };
  $('#ea').onclick = addE; $('#em').onkeydown = e => { if (e.key === 'Enter') addE(); };
  /* Pilih langsung dari jadwal pelajaran di tanggal itu */
  const fillTT = () => {
    const d = $('#et').value, box = $('#exTT');
    const ls = ttHas(d) ? ttSlots(S.tt[d]).filter(x => x.it.k !== 'b') : [];
    box.hidden = !ls.length;
    box.innerHTML = ls.length ? `<span class="faint small">${tx('Dari jadwal:')}</span>` + ls.map(x => `<button type="button" data-n="${esc(subjName(x.it.s))}" data-j="${rawMin(x.a)}" style="--h:${subjHue(x.it.s)}">${esc(subjName(x.it.s))}<small>${fromMin(x.a)}</small></button>`).join('') : '';
    $$('button', box).forEach(b => b.onclick = () => {
      $('#em').value = b.dataset.n; setVal($('#ej'), b.dataset.j);
      $$('button', box).forEach(x => x.classList.toggle('on', x === b));
      if (motionOn()) b.animate([{ transform: 'scale(.9)' }, { transform: 'scale(1)' }], { duration: SP.d, easing: SP.e });
    });
  };
  $('#et').addEventListener('change', fillTT); fillTT();
  $$('[data-ett]', view()).forEach(b => b.onclick = () => { TTD = b.dataset.ett; go('jadwal'); });
  $$('[data-est]', view()).forEach(b => b.onclick = () => startExamStudy(b.dataset.est));
  $$('[data-esd]', view()).forEach(b => b.onclick = () => examStudied(b.dataset.esd));
  $$('[data-edn]', view()).forEach(b => b.onclick = () => { const e = S.exams.find(x => x.id === b.dataset.edn); e.done = true; persist(); render(); });
  $$('[data-edel]', view()).forEach(b => b.onclick = async () => {
    if (!await ask('Hapus jadwal ujian?', 'Pengingat untuk ujian ini juga dihapus.', 'Hapus', 'danger solid')) return;
    S.exams = S.exams.filter(x => x.id !== b.dataset.edel); persist(); render();
  });
}
function startExamStudy(id) { const e = S.exams.find(x => x.id === id); if (!e) return; TM.topic = T`Persiapan ujian ${e.mapel}`; saveTM(); go('belajar'); toast('Timer siap. Ketuk Mulai.'); }
function examStudied(id) {
  const e = S.exams.find(x => x.id === id); if (!e || e.studied) return;
  e.studied = true;
  add(S.remind.examBonus, 'Bonus belajar sebelum ujian: ' + e.mapel, 'ujian');
  render();
  toast(T`+${S.remind.examBonus} poin. Semoga lancar ujiannya!`);
}

/* ---------- Uang kas ---------- */
const HARI = LANG === 'en' ? ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] : ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const BYDAY = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
const p2 = n => String(n).padStart(2, '0');
const ymd = d => d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate());
const ymdMs = s => new Date(s + 'T00:00').getTime();
/* Tanggal-tanggal jatuh tempo kas antara dua waktu (inklusif per hari) */
function kasDue(k, fromMs, toMs) {
  const out = [], d = new Date(sod(Math.max(fromMs, ymdMs(k.start)))), end = sod(toMs);
  let g = 0;
  while (d.getTime() <= end && g++ < 900) {
    const dow = d.getDay(), dt = d.getDate(), dim = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    if ((k.f === 'w' && dow === k.dow) || (k.f === 's' && dow >= 1 && dow <= 5) || (k.f === 'm' && dt === Math.min(k.dom, dim))) out.push(ymd(d));
    d.setDate(d.getDate() + 1);
  }
  return out;
}
const kasAt = (k, date) => new Date(date + 'T' + (k.jam || '06:30')).getTime();
const kasUnpaid = k => kasDue(k, Date.now() - 180 * DAY, Date.now()).filter(x => !k.paid.includes(x));
const kasNext = k => kasDue(k, Date.now() + DAY, Date.now() + 40 * DAY).find(x => !k.paid.includes(x));
const kasSched = k => k.f === 'w' ? T`Setiap ${HARI[k.dow]}` : k.f === 's' ? tx('Setiap hari sekolah (Sen–Jum)') : T`Setiap tanggal ${k.dom}`;
const kasRule = k => k.f === 'w' ? 'RRULE:FREQ=WEEKLY;BYDAY=' + BYDAY[k.dow] : k.f === 's' ? 'RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR' : 'RRULE:FREQ=MONTHLY;BYMONTHDAY=' + k.dom;

function kasForm(k) {
  k = k || { n: tx('Uang kas kelas'), amt: 5000, f: 'w', dow: 1, dom: 1, jam: '06:30', bonus: 5, h1: true };
  return `
    <div class="stack">
      <div class="form-row">
        <label class="field grow2"><span>Nama</span><input class="input" id="kn" value="${esc(k.n)}" placeholder="Uang kas kelas"></label>
        <label class="field"><span>Nominal (Rp)</span><input class="input" id="ka2" type="number" inputmode="numeric" min="0" value="${k.amt}"></label>
      </div>
      <div class="form-row">
        <label class="field"><span>Jadwal bayar</span><select class="input" id="kf">
          <option value="w" ${k.f === 'w' ? 'selected' : ''}>Mingguan</option>
          <option value="s" ${k.f === 's' ? 'selected' : ''}>Harian (hari sekolah)</option>
          <option value="m" ${k.f === 'm' ? 'selected' : ''}>Bulanan</option></select></label>
        <label class="field" id="kdowW"><span>Hari bayar</span><select class="input" id="kdow">${HARI.map((h, i) => `<option value="${i}" ${k.dow === i ? 'selected' : ''}>${h}</option>`).join('')}</select></label>
        <label class="field" id="kdomW"><span>Tanggal bayar</span><select class="input" id="kdom">${Array.from({ length: 31 }, (_, i) => `<option value="${i + 1}" ${k.dom === i + 1 ? 'selected' : ''}>${i + 1}</option>`).join('')}</select></label>
        <label class="field"><span>Jam pengingat</span><input class="input" id="kj" type="time" value="${esc(k.jam)}"></label>
      </div>
      <div class="form-row">
        <label class="field"><span>Bonus poin bayar tepat waktu</span><input class="input" id="kb" type="number" inputmode="numeric" min="0" value="${k.bonus}"></label>
        <label class="switch" style="flex:1 1 220px;min-height:48px"><input type="checkbox" id="kh1" ${k.h1 ? 'checked' : ''}>Ingatkan juga malam sebelumnya</label>
      </div>
    </div>`;
}
function kasFormBind(root) {
  const f = $('#kf', root), sync = () => { $('#kdowW', root).hidden = f.value !== 'w'; $('#kdomW', root).hidden = f.value !== 'm'; };
  f.onchange = sync; sync();
}
function kasRead(root) {
  const n = $('#kn', root).value.trim(), amt = Math.max(0, Math.round(Number($('#ka2', root).value) || 0));
  if (!n) { $('#kn', root).focus(); toast('Isi nama kas'); return null; }
  if (!amt) { $('#ka2', root).focus(); toast('Isi nominal'); return null; }
  return { n, amt, f: $('#kf', root).value, dow: Number($('#kdow', root).value), dom: Number($('#kdom', root).value), jam: $('#kj', root).value || '06:30', bonus: Math.max(0, Math.round(Number($('#kb', root).value) || 0)), h1: $('#kh1', root).checked };
}

function kas() {
  const now = Date.now();
  const mStart = new Date(); mStart.setDate(1); mStart.setHours(0, 0, 0, 0);
  const paidMonth = S.kasPay.filter(p => Date.parse(p.t) >= mStart.getTime()).reduce((a, b) => a + b.amt, 0);
  const owed = S.kas.reduce((a, k) => a + kasUnpaid(k).length * k.amt, 0);
  view().innerHTML = `
  <div class="grid g3" style="margin-bottom:16px">
    <div class="card stat"><div class="ico t-mint">${I('check')}</div><div class="v num">${rp(paidMonth)}</div><div class="l">Dibayar bulan ini</div></div>
    <div class="card stat"><div class="ico ${owed ? 't-danger' : 't-brand'}">${I('wallet')}</div><div class="v num ${owed ? 'minus' : ''}">${rp(owed)}</div><div class="l">Tunggakan</div></div>
    <div class="card stat"><div class="ico t-warn">${I('flame')}</div><div class="v num">${S.kasPay.filter(p => p.ontime).length}×</div><div class="l">Bayar tepat waktu</div></div>
  </div>
  <section class="card">
    <h2>Tambah pengingat kas</h2><p class="sub">${T`remind+ mengingatkan di hari bayar, dan bisa juga malam sebelumnya jam ${esc(hhmm(S.remind.exam))}.`}</p>
    <div id="kform">${kasForm()}</div>
    <div style="margin-top:14px"><button class="btn grad" id="kadd">${I('plus')}Tambah</button></div>
  </section>
  <div class="sec-title"><h3>Daftar kas <span class="count">${S.kas.length}</span></h3></div>
  <div class="list">${S.kas.length ? S.kas.map(k => {
    const un = kasUnpaid(k), today = ymd(new Date()), nx = kasNext(k);
    const dueToday = un.includes(today);
    const late = un.filter(x => x !== today);
    const nextDate = dueToday ? today : nx;
    const rAt = nextDate ? kasAt(k, nextDate) : 0;
    const hist = S.kasPay.filter(p => p.kasId === k.id).slice(0, 4);
    let st;
    if (late.length) st = `<span class="chip danger">${I('warn')}${T`Nunggak ${late.length}× · ${rp(late.length * k.amt)}`}</span>`;
    else if (dueToday) st = `<span class="chip warn">${I('clock')}Bayar hari ini</span>`;
    else st = `<span class="chip mint">${I('check')}Lunas</span>`;
    return `<div class="item" style="flex-wrap:wrap">
      <div class="lead ${late.length ? 't-danger' : dueToday ? 't-warn' : 't-mint'}">${I('wallet')}</div>
      <div class="body"><div class="ttl">${esc(k.n)} · ${rp(k.amt)}</div>
        <div class="faint small" style="margin-top:2px">${kasSched(k)} · ${T`pengingat ${esc(hhmm(k.jam))}`}${k.bonus ? ' · ' + T`bonus +${k.bonus} poin tepat waktu` : ''}</div>
        <div class="meta">${st}${!dueToday && !late.length && nx ? `<span class="faint small">${T`Berikutnya ${fd(ymdMs(nx))}`}</span>` : ''}</div>
        ${hist.length ? `<div class="faint small" style="margin-top:6px">${tx('Terakhir bayar:')} ${hist.map(h => new Date(ymdMs(h.date)).toLocaleDateString(LOC, { day: 'numeric', month: 'short' })).join(', ')}</div>` : ''}</div>
      <div class="acts">
        ${un.length > 1 ? `<button class="btn mint sm" data-kpall="${k.id}">${I('check')}${T`Bayar semua ${rp(un.length * k.amt)}`}</button>` : ''}
        ${un.length ? `<button class="btn ${un.length > 1 ? 'ghost' : 'mint'} sm" data-kp="${k.id}">${I('check')}${un.length > 1 ? 'Bayar 1' : 'Sudah bayar'}</button>` : `<button class="btn ghost sm" data-kp="${k.id}">Bayar duluan</button>`}
        ${rAt ? alarmBtn(rAt, T`Bayar ${k.n}`, kasRule(k)) : ''}
        ${calBtn('💰 ' + T`Bayar ${k.n}` + ' ' + rp(k.amt), kasAt(k, nextDate || nx || today), kasAt(k, nextDate || nx || today) + 9e5, k.n + ' ' + rp(k.amt) + ' — ' + kasSched(k), kasRule(k))}
        <button class="icon-btn sm" data-ke="${k.id}" aria-label="Ubah">${I('pencil')}</button>
        <button class="icon-btn sm danger" data-kd="${k.id}" aria-label="Hapus">${I('trash')}</button>
      </div></div>`;
  }).join('') : emptyBox('wallet', 'Belum ada pengingat kas', 'Tambahkan uang kas kelas atau iuran rutin lainnya.')}</div>`;
  kasFormBind($('#kform'));
  $('#kadd').onclick = () => {
    const d = kasRead($('#kform')); if (!d) return;
    S.kas.push(Object.assign({ id: uid(), paid: [], start: ymd(new Date()), c: Date.now() }, d));
    persist(); render(); toast(T`Pengingat kas ditambah · ${kasSched(d)}`);
  };
  $$('[data-kp]', view()).forEach(b => b.onclick = () => payKas(b.dataset.kp, false));
  $$('[data-kpall]', view()).forEach(b => b.onclick = () => payKas(b.dataset.kpall, true));
  $$('[data-kd]', view()).forEach(b => b.onclick = async () => {
    if (!await ask('Hapus pengingat kas?', 'Riwayat pembayarannya tetap tersimpan di Riwayat.', 'Hapus', 'danger solid')) return;
    S.kas = S.kas.filter(x => x.id !== b.dataset.kd); persist(); render();
  });
  $$('[data-ke]', view()).forEach(b => b.onclick = async () => {
    const k = S.kas.find(x => x.id === b.dataset.ke); if (!k) return;
    const p = modal({ wide: true, title: 'Ubah pengingat kas', html: '<div id="kedit">' + kasForm(k) + '</div>', actions: [{ label: 'Batal', cls: 'ghost', value: null }, { label: 'Simpan', cls: 'grad', validate: m => !!kasRead($('#kedit', m)), get: m => kasRead($('#kedit', m)) }] });
    kasFormBind($('#kedit'));
    const d = await p; if (!d) return;
    Object.assign(k, d, { c: Date.now() }); persist(); render(); toast('Pengingat kas diperbarui');
  });
}
function payKas(id, all) {
  const k = S.kas.find(x => x.id === id); if (!k) return;
  const un = kasUnpaid(k);
  const dates = un.length ? (all ? un : [un[0]]) : [kasNext(k)].filter(Boolean);
  if (!dates.length) return;
  const today = sod(Date.now()), logIds = [], payIds = [];
  let bonus = 0;
  dates.forEach(date => {
    const ontime = ymdMs(date) >= today;
    k.paid.push(date);
    const pid = uid(); payIds.push(pid);
    S.kasPay.unshift({ id: pid, kasId: k.id, n: k.n, date, amt: k.amt, t: nowIso(), ontime });
    if (ontime && k.bonus) bonus += k.bonus;
  });
  if (k.paid.length > 400) k.paid = k.paid.slice(-400);
  if (S.kasPay.length > 500) S.kasPay.length = 500;
  const total = dates.length * k.amt;
  if (bonus) logIds.push(add(bonus, 'Bayar ' + k.n + ' tepat waktu (' + rp(total) + ')', 'kas'));
  else persist();
  render();
  toast(T`Tercatat lunas ${rp(total)}` + (bonus ? ' · ' + T`+${bonus} poin` : ''), {
    label: 'Batalkan', fn: () => {
      k.paid = k.paid.filter(x => !dates.includes(x));
      S.kasPay = S.kasPay.filter(p => !payIds.includes(p.id));
      logIds.forEach(undoLog); persist(); render(); toast('Dibatalkan');
    }
  });
}

/* ---------- Pengingat non-akademik (hanya notifikasi, tanpa alarm) ---------- */
const REM_CAT = {
  sekolah: { n: 'Sekolah', sub: 'Non-akademik', ic: 'backpack', tone: 't-brand', chip: 'brand' },
  pribadi: { n: 'Pribadi', sub: 'Di luar sekolah', ic: 'heart', tone: 't-mint', chip: 'mint' }
};
const REM_TPL = {
  sekolah: [
    ['Bawa baju olahraga', { rep: 'weekly', days: [1], jam: '06:00', lead: 'eve' }],
    ['Piket kelas', { rep: 'weekly', days: [2], jam: '06:30', lead: 'eve' }],
    ['Ekskul', { rep: 'weekly', days: [5], jam: '14:00', lead: 60 }],
    ['Rapat OSIS', { rep: 'once', jam: '13:00', lead: 60 }],
    ['Bawa bekal', { rep: 'weekly', days: [1, 2, 3, 4, 5], jam: '06:00', lead: 0 }],
    ['Kembalikan buku perpustakaan', { rep: 'once', jam: '07:00', lead: 'eve' }],
    ['Kumpulkan surat izin / formulir', { rep: 'once', jam: '07:00', lead: 'eve' }],
    ['Pakai seragam batik', { rep: 'weekly', days: [4], jam: '05:45', lead: 'eve' }]
  ],
  pribadi: [
    ['Ulang tahun teman', { rep: 'yearly', jam: '08:00', lead: 'eve' }],
    ['Les / kursus', { rep: 'weekly', days: [3], jam: '16:00', lead: 60 }],
    ['Beli kuota internet', { rep: 'monthly', jam: '19:00', lead: 0 }],
    ['Olahraga', { rep: 'weekly', days: [6], jam: '07:00', lead: 15 }],
    ['Cuci sepatu', { rep: 'weekly', days: [6], jam: '09:00', lead: 0 }],
    ['Rapikan kamar', { rep: 'weekly', days: [0], jam: '09:00', lead: 0 }],
    ['Telepon keluarga', { rep: 'weekly', days: [0], jam: '19:00', lead: 0 }],
    ['Minum air putih', { rep: 'daily', jam: '10:00', lead: 0 }]
  ]
};
const LEAD = { 0: 'Tepat waktu', 15: '15 menit sebelum', 60: '1 jam sebelum', eve: 'Malam sebelumnya', both: 'Malam sebelumnya + tepat waktu' };
const HARI_S = LANG === 'en' ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] : ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const REP_N = { once: 'Sekali', daily: 'Setiap hari', weekly: 'Mingguan', monthly: 'Bulanan', yearly: 'Tahunan' };

function remOcc(r, fromMs, toMs) {
  const from = sod(fromMs), to = sod(toMs);
  if (r.rep === 'once') { const t = ymdMs(r.date); return t >= from && t <= to ? [r.date] : []; }
  const out = [], base = r.date ? new Date(r.date + 'T00:00') : new Date(ymdMs(r.start));
  const d = new Date(Math.max(from, ymdMs(r.start), r.rep === 'monthly' && r.date ? ymdMs(r.date) : 0)); let g = 0;
  while (d.getTime() <= to && g++ < 800) {
    const dow = d.getDay(), dt = d.getDate(), mo = d.getMonth(), dim = new Date(d.getFullYear(), mo + 1, 0).getDate();
    const ok = r.rep === 'daily' || (r.rep === 'weekly' && (r.days || []).includes(dow)) ||
      (r.rep === 'monthly' && dt === Math.min(base.getDate(), dim)) ||
      (r.rep === 'yearly' && mo === base.getMonth() && dt === Math.min(base.getDate(), dim));
    if (ok) out.push(ymd(d));
    d.setDate(d.getDate() + 1);
  }
  return out;
}
const remAt = (r, date) => new Date(date + 'T' + (r.jam || '07:00')).getTime();
const remNext = r => remOcc(r, Date.now(), Date.now() + 370 * DAY).find(d => !r.done.includes(d));
function remTimes(r, date) {
  const at = remAt(r, date), ev = new Date(date + 'T00:00');
  ev.setDate(ev.getDate() - 1);
  const [h, m] = (S.remind.exam || '19:00').split(':'); ev.setHours(+h || 19, +m || 0, 0, 0);
  if (r.lead === 'eve') return [[ev.getTime(), 'eve']];
  if (r.lead === 'both') return [[ev.getTime(), 'eve'], [at, 'now']];
  return [[at - (Number(r.lead) || 0) * 6e4, Number(r.lead) ? 'pre' : 'now']];
}
function remSched(r) {
  const jam = hhmm(r.jam || '');
  if (r.rep === 'once') return fd(ymdMs(r.date)) + ' · ' + jam;
  if (r.rep === 'daily') return tx('Setiap hari') + ' · ' + jam;
  if (r.rep === 'weekly') {
    const ds = [...(r.days || [])].sort((a, b) => ((a + 6) % 7) - ((b + 6) % 7));
    if (ds.length === 7) return tx('Setiap hari') + ' · ' + jam;
    const txt = ds.join() === '1,2,3,4,5' ? tx('Sen–Jum') : ds.map(x => HARI_S[x]).join(', ');
    return T`Setiap ${txt}` + ' · ' + jam;
  }
  const b = new Date(r.date + 'T00:00');
  if (r.rep === 'monthly') return T`Tiap tanggal ${b.getDate()}` + ' · ' + jam;
  return tx('Tiap') + ' ' + b.toLocaleDateString(LOC, { day: 'numeric', month: 'long' }) + ' · ' + jam;
}
function remRule(r) {
  if (r.rep === 'daily') return 'RRULE:FREQ=DAILY';
  if (r.rep === 'weekly') return 'RRULE:FREQ=WEEKLY;BYDAY=' + (r.days || []).map(x => BYDAY[x]).join(',');
  if (r.rep === 'monthly') return 'RRULE:FREQ=MONTHLY;BYMONTHDAY=' + new Date(r.date + 'T00:00').getDate();
  if (r.rep === 'yearly') return 'RRULE:FREQ=YEARLY';
  return '';
}
const softCalBtn = (title, start, rrule, details) => IS_IOS
  ? `<button class="btn ghost sm" data-ics="${esc(JSON.stringify({ t: title, s: start, r: rrule || '' }))}">${I('calplus')}Kalender</button>`
  : calBtn('🔔 ' + title, start, start + 18e5, details, rrule);

function remForm(r) {
  r = r || { cat: RFORM_CAT, t: '', rep: 'once', days: [1], jam: '07:00', lead: 'eve', note: '', pts: 0, date: ymd(new Date(Date.now() + DAY)) };
  const dayOrder = [1, 2, 3, 4, 5, 6, 0];
  return `<div class="rform" data-cat="${r.cat}">
    <div class="cat-pick">${Object.entries(REM_CAT).map(([k, c]) => `<button type="button" data-cat="${k}" class="${r.cat === k ? 'on' : ''}"><span class="ico ${c.tone}">${I(c.ic)}</span><span>${c.n}<small>${c.sub}</small></span></button>`).join('')}</div>
    <div class="tpl"></div>
    <div class="stack">
      <div class="form-row">
        <label class="field grow2"><span>Judul</span><input class="input" data-f="t" value="${esc(r.t)}" placeholder="Contoh: Bawa baju olahraga"></label>
        <label class="field"><span>Ulangi</span><select class="input" data-f="rep">${Object.entries(REP_N).map(([k, n]) => `<option value="${k}" ${r.rep === k ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
      </div>
      <div class="form-row">
        <label class="field" data-w="date"><span data-dl>Tanggal</span><input class="input" type="date" data-f="date" value="${esc(r.date || '')}"></label>
        <div class="field" data-w="days"><span>Hari</span><div class="dchips">${dayOrder.map(d => `<button type="button" data-d="${d}" class="${(r.days || []).includes(d) ? 'on' : ''}">${HARI_S[d]}</button>`).join('')}</div></div>
        <label class="field"><span>Jam</span><input class="input" type="time" data-f="jam" value="${esc(r.jam)}"></label>
        <label class="field"><span>Ingatkan</span><select class="input" data-f="lead">${Object.entries(LEAD).map(([k, n]) => `<option value="${k}" ${String(r.lead) === k ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
      </div>
      <div class="form-row">
        <label class="field grow2"><span>Catatan (opsional)</span><input class="input" data-f="note" value="${esc(r.note || '')}" placeholder="Contoh: kaos olahraga + sepatu"></label>
        <label class="field"><span>Poin saat selesai (opsional)</span><input class="input" type="number" inputmode="numeric" min="0" data-f="pts" value="${r.pts || 0}"></label>
      </div>
    </div></div>`;
}
function remFormBind(root) {
  const f = $('.rform', root), q = k => $(`[data-f="${k}"]`, f);
  const sync = () => {
    const rep = q('rep').value;
    $('[data-w="date"]', f).hidden = rep === 'daily' || rep === 'weekly';
    $('[data-w="days"]', f).hidden = rep !== 'weekly';
    $('[data-dl]', f).textContent = rep === 'monthly' ? 'Mulai (tanggal tiap bulan)' : rep === 'yearly' ? 'Tanggal (tiap tahun)' : 'Tanggal';
  };
  const tpl = () => {
    $('.tpl', f).innerHTML = REM_TPL[f.dataset.cat].map(([n], i) => `<button type="button" data-i="${i}">${esc(n)}</button>`).join('');
    $$('.tpl button', f).forEach(b => b.onclick = () => {
      const [n, o] = REM_TPL[f.dataset.cat][+b.dataset.i];
      q('t').value = tx(n); setVal(q('rep'), o.rep); setVal(q('jam'), o.jam); setVal(q('lead'), String(o.lead));
      if (o.days) $$('.dchips button', f).forEach(x => x.classList.toggle('on', o.days.includes(+x.dataset.d)));
      if (!q('date').value) setVal(q('date'), ymd(new Date(Date.now() + DAY)));
      sync();
      if (motionOn()) b.animate([{ transform: 'scale(.9)' }, { transform: 'scale(1)' }], { duration: SP.d, easing: SP.e });
    });
  };
  $$('.cat-pick button', f).forEach(b => b.onclick = () => {
    f.dataset.cat = b.dataset.cat; if (!root.closest || !root.closest('#modal')) RFORM_CAT = b.dataset.cat;
    $$('.cat-pick button', f).forEach(x => x.classList.toggle('on', x === b)); tpl();
    if (motionOn()) $$('.tpl button', f).forEach((x, i) => x.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 300, delay: i * 25, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' }));
  });
  $$('.dchips button', f).forEach(b => b.onclick = () => b.classList.toggle('on'));
  q('rep').addEventListener('change', sync);
  tpl(); sync();
}
function remRead(root) {
  const f = $('.rform', root), q = k => $(`[data-f="${k}"]`, f);
  const t = q('t').value.trim(), rep = q('rep').value;
  const days = $$('.dchips button.on', f).map(b => +b.dataset.d);
  if (!t) { toast('Isi judul pengingat'); q('t').focus(); return null; }
  if (rep === 'weekly' && !days.length) { toast('Pilih minimal satu hari'); return null; }
  if ((rep === 'once' || rep === 'monthly' || rep === 'yearly') && !q('date').value) { toast('Pilih tanggal'); return null; }
  const lead = q('lead').value;
  return { cat: f.dataset.cat, t, rep, days, date: q('date').value || ymd(new Date()), jam: q('jam').value || '07:00', lead: lead === 'eve' || lead === 'both' ? lead : Number(lead), note: q('note').value.trim(), pts: Math.max(0, Math.round(Number(q('pts').value) || 0)) };
}

let RCAT = 'semua', RFORM_CAT = 'sekolah';
function ingat() {
  const now = Date.now(), today = ymd(new Date());
  const list = S.rem.filter(r => RCAT === 'semua' || r.cat === RCAT);
  const groups = { today: [], missed: [], next: [], done: [] };
  list.forEach(r => {
    const tOcc = remOcc(r, now, now)[0];
    if (tOcc && !r.done.includes(tOcc)) groups.today.push({ r, d: tOcc });
    else if (r.rep === 'once' && r.date < today && !r.done.includes(r.date)) groups.missed.push({ r, d: r.date });
    else { const n = remNext(r); if (n) groups.next.push({ r, d: n }); else groups.done.push({ r, d: r.date }); }
  });
  groups.today.sort((a, b) => remAt(a.r, a.d) - remAt(b.r, b.d));
  groups.next.sort((a, b) => remAt(a.r, a.d) - remAt(b.r, b.d));
  const perm = ('Notification' in window) ? Notification.permission : 'unsupported';
  const item = ({ r, d }, kind) => {
    const c = REM_CAT[r.cat] || REM_CAT.sekolah, at = remAt(r, d), rule = remRule(r);
    const when = kind === 'today' ? `<span class="chip ${at < now ? 'warn' : 'brand'}">${I('clock')}${T`Hari ini ${hhmm(r.jam)}`}${at < now ? ' · ' + tx('lewat') : ''}</span>`
      : kind === 'missed' ? `<span class="chip danger">${I('warn')}Terlewat</span>`
        : kind === 'next' ? `<span class="chip">${I('cal')}${dayDiff(at) === 1 ? tx('Besok') : fd(at)} ${hhmm(r.jam)}</span>` : `<span class="chip mint">${I('check')}Selesai</span>`;
    return `<div class="item ${kind === 'done' ? 'done' : ''}" style="flex-wrap:wrap">
      <div class="lead ${c.tone}">${I(c.ic)}</div>
      <div class="body"><div class="ttl">${esc(r.t)}</div>
        <div class="faint small" style="margin-top:2px">${remSched(r)}${r.note ? ' · ' + esc(r.note) : ''}</div>
        <div class="meta"><span class="chip ${c.chip}">${c.n}</span>${when}<span class="chip">${I('bell')}${LEAD[r.lead]}</span>${r.pts ? `<span class="chip">${I('spark')}+${r.pts}</span>` : ''}</div></div>
      <div class="acts">
        ${kind === 'today' || kind === 'missed' ? `<button class="btn mint sm" data-rd="${r.id}" data-date="${d}">${I('check')}Selesai</button>` : ''}
        ${kind !== 'done' && kind !== 'missed' ? softCalBtn(r.t, rule ? remAt(r, remNext(r) || d) : at, rule, remSched(r) + (r.note ? '. ' + r.note : '')) : ''}
        <button class="icon-btn sm" data-re="${r.id}" aria-label="Ubah">${I('pencil')}</button>
        <button class="icon-btn sm danger" data-rx="${r.id}" aria-label="Hapus">${I('trash')}</button>
      </div></div>`;
  };
  const sec = (title, arr, kind) => arr.length ? `<div class="sec-title"><h3>${title} <span class="count">${arr.length}</span></h3></div><div class="list">${arr.map(x => item(x, kind)).join('')}</div>` : '';
  view().innerHTML = `
  ${perm === 'default' ? `<section class="card" style="margin-bottom:16px;display:flex;gap:14px;align-items:center;flex-wrap:wrap"><div class="lead t-brand" style="width:44px;height:44px;border-radius:13px;display:grid;place-items:center">${I('bell')}</div><div style="flex:1;min-width:200px"><b>Izinkan notifikasi</b><div class="muted small">Pengingat di menu ini muncul sebagai notifikasi biasa, tanpa sirene atau alarm.</div></div><button class="btn grad" id="rperm">${I('bell')}Izinkan</button></section>` : ''}
  <section class="card">
    <h2>Tambah pengingat</h2><p class="sub">${T`Untuk hal di luar pelajaran. Muncul sebagai <b>notifikasi biasa</b>, tanpa alarm. Pilih contoh di bawah atau tulis sendiri.`}</p>
    <div id="rform">${remForm()}</div>
    <div style="margin-top:14px"><button class="btn grad" id="radd">${I('plus')}Tambah pengingat</button></div>
  </section>
  <div class="sec-title"><div class="seg" id="rcat">${[['semua', 'Semua'], ['sekolah', 'Sekolah'], ['pribadi', 'Pribadi']].map(([k, n]) => `<button class="${RCAT === k ? 'on' : ''}" data-c="${k}">${tx(n)} · ${k === 'semua' ? S.rem.length : S.rem.filter(r => r.cat === k).length}</button>`).join('')}</div></div>
  ${list.length ? sec('Hari ini', groups.today, 'today') + sec('Terlewat', groups.missed, 'missed') + sec('Akan datang', groups.next, 'next') + sec('Selesai', groups.done.slice(0, 10), 'done')
      : emptyBox('bell', 'Belum ada pengingat', 'Tambahkan pengingat sekolah atau pribadi di atas.')}`;
  remFormBind($('#rform'));
  $('#radd').onclick = () => {
    const d = remRead($('#rform')); if (!d) return;
    S.rem.push(Object.assign({ id: uid(), done: [], start: ymd(new Date()), c: Date.now() }, d));
    persist(); RFORM_CAT = d.cat; render();
    const n = S.rem[S.rem.length - 1], nx = remNext(n);
    toast(nx ? T`Pengingat ditambah · ${dayDiff(remAt(n, nx)) === 0 ? tx('hari ini') : dayDiff(remAt(n, nx)) === 1 ? tx('besok') : fd(remAt(n, nx))} ${hhmm(n.jam)}` : tx('Pengingat ditambah'));
  };
  if ($('#rperm')) $('#rperm').onclick = async () => { try { await Notification.requestPermission(); } catch (e) {} if (Notification.permission === 'granted') { regPeriodic(); toast('Notifikasi aktif'); } render(); };
  $$('#rcat button').forEach(b => b.onclick = () => { RCAT = b.dataset.c; render(); });
  $$('[data-rd]', view()).forEach(b => b.onclick = () => remDone(b.dataset.rd, b.dataset.date));
  $$('[data-rx]', view()).forEach(b => b.onclick = async () => {
    if (!await ask('Hapus pengingat?', 'Pengingat ini dan jadwal berulangnya dihapus.', 'Hapus', 'danger solid')) return;
    S.rem = S.rem.filter(x => x.id !== b.dataset.rx); persist(); render();
  });
  $$('[data-re]', view()).forEach(b => b.onclick = async () => {
    const r = S.rem.find(x => x.id === b.dataset.re); if (!r) return;
    const p = modal({ wide: true, title: 'Ubah pengingat', html: '<div id="redit">' + remForm(r) + '</div>', actions: [{ label: 'Batal', cls: 'ghost', value: null }, { label: 'Simpan', cls: 'grad', validate: m => !!remRead($('#redit', m)), get: m => remRead($('#redit', m)) }] });
    remFormBind($('#redit'));
    const d = await p; if (!d) return;
    Object.assign(r, d, { c: Date.now() }); persist(); render(); toast('Pengingat diperbarui');
  });
}
function remDone(id, date) {
  const r = S.rem.find(x => x.id === id); if (!r || r.done.includes(date)) return;
  r.done.push(date); if (r.done.length > 300) r.done = r.done.slice(-300);
  const logId = r.pts ? add(r.pts, 'Pengingat: ' + r.t, 'ingat') : (persist(), null);
  render();
  toast((r.pts ? T`+${r.pts} poin` + ' · ' : '') + tx('Ditandai selesai'), {
    label: 'Batalkan', fn: () => { r.done = r.done.filter(x => x !== date); if (logId) undoLog(logId); persist(); render(); toast('Dibatalkan'); }
  });
}

/* ---------- Jadwal pelajaran (diisi per tanggal, karena jadwal berubah tiap minggu) ---------- */
const toMin = s => { const [h, m] = String(s || '07:00').split(':'); return (+h || 0) * 60 + (+m || 0); };
const fromMin = m => hhmm(p2(Math.floor(m / 60) % 24) + ':' + p2(m % 60));
const nowMin = () => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); };
const subjOf = id => S.subj.find(x => x.id === id);
const subjName = id => { const s = subjOf(id); return s ? s.n : tx('Mapel dihapus'); };
const subjHue = id => { const s = subjOf(id); return s ? s.h : 220; };
function ttSlots(day) {
  let m = toMin(day.start);
  return (day.items || []).map((it, i) => {
    const len = it.k === 'b' ? Math.max(0, Number(it.min) || 0) : Math.max(1, Number(it.n) || 1) * S.ttMin;
    const r = { it, i, a: m, b: m + len }; m += len; return r;
  });
}
const ttHas = d => !!(S.tt[d] && S.tt[d].items && S.tt[d].items.length);
const exLabel = m => /^(ujian|exam)\b/i.test(m) ? m : T`Ujian ${m}`;
const rawMin = m => p2(Math.floor(m / 60) % 24) + ':' + p2(m % 60);
const ttExams = d => S.exams.filter(e => e.tgl === d && !e.done);
/* Ujian yang jamnya jatuh di dalam satu pelajaran ditempel ke pelajaran itu */
const ttExamFor = (d, sl) => sl.it.k === 'b' ? null : ttExams(d).find(e => toMin(e.jam) >= sl.a && toMin(e.jam) < sl.b) || null;
const ttDotCls = d => ttExams(d).length ? 'ex' : ttHas(d) ? 'has' : '';
function ttDefaultDate() { const d = new Date(); if (d.getDay() === 0) d.setDate(d.getDate() + 1); return ymd(d); }
function weekOf(date) {
  const d = new Date(date + 'T00:00'); d.setDate(d.getDate() - (d.getDay() + 6) % 7);
  return Array.from({ length: 6 }, (_, i) => { const x = new Date(d); x.setDate(d.getDate() + i); return ymd(x); });
}
const addDays = (date, n) => { const d = new Date(date + 'T00:00'); d.setDate(d.getDate() + n); return ymd(d); };
function ttTouch(date) { const d = S.tt[date]; if (d) d.c = Date.now(); persist(); }
function ttPrune() { const lim = ymd(new Date(Date.now() - 200 * DAY)); for (const k in S.tt) if (k < lim || (!ttHas(k) && k !== TTD)) delete S.tt[k]; }
const subjDL = () => `<datalist id="subjDL">${S.subj.map(s => `<option value="${esc(s.n)}"></option>`).join('')}</datalist>`;

/* Halaman jadwal: strip minggu dengan sorotan cair, isi hari diganti tanpa memuat ulang halaman */
let TTD = null, TT_OPEN = -1;
const ttLive = (a, b) => TTD === ymd(new Date()) && nowMin() >= a && nowMin() < b;
function jadwal() {
  if (!TTD) TTD = ttDefaultDate();
  TT_OPEN = -1;
  ttPrune();
  view().innerHTML = `
  <section class="card tt-card">
    <div class="tt-top">
      <h2 id="ttMonth"></h2>
      <div class="tt-tools">
        <button class="icon-btn sm" id="ttSubj" title="Mata pelajaran & guru" aria-label="Mata pelajaran & guru">${I('book')}</button>
        <button class="icon-btn sm" id="ttSet" title="Pengaturan jadwal" aria-label="Pengaturan jadwal">${I('sliders')}</button>
      </div>
    </div>
    <div class="tt-week">
      <button class="icon-btn sm" data-wk="-7" aria-label="Minggu sebelumnya">${I('chevl')}</button>
      <div class="tt-days" id="ttDays"></div>
      <button class="icon-btn sm" data-wk="7" aria-label="Minggu berikutnya">${I('chevr')}</button>
    </div>
    <div class="tt-body" id="ttBody"></div>
  </section>`;
  ttWeek(0);
  ttDayDraw(0);
  $$('[data-wk]', view()).forEach(b => b.onclick = () => ttGo(addDays(TTD, +b.dataset.wk)));
  $('#ttSubj').onclick = subjModal;
  $('#ttSet').onclick = ttSettingsModal;
  // geser ke kiri/kanan untuk pindah hari
  const body = $('#ttBody'); let sx = null, sy = 0;
  body.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') { sx = e.clientX; sy = e.clientY; } }, { passive: true });
  body.addEventListener('pointerup', e => {
    if (sx === null) return; const dx = e.clientX - sx, dy = e.clientY - sy; sx = null;
    if (Math.abs(dx) > 70 && Math.abs(dy) < 45) ttStep(dx < 0 ? 1 : -1);
  }, { passive: true });
}
/* Pindah ke hari berikut/sebelumnya (lewati Minggu) */
function ttStep(n) { let d = addDays(TTD, n); if (new Date(d + 'T00:00').getDay() === 0) d = addDays(d, n); ttGo(d); }
function ttGo(d) {
  if (d === TTD) return;
  const dir = d > TTD ? 1 : -1, sameWeek = weekOf(d)[0] === weekOf(TTD)[0];
  TTD = d; TT_OPEN = -1;
  if (sameWeek) ttMoveBlob(); else ttWeek(dir);
  ttDayDraw(dir);
}
function ttWeek(dir) {
  const box = $('#ttDays'); if (!box) return;
  const wk = weekOf(TTD), today = ymd(new Date()), mon = new Date(wk[0] + 'T00:00');
  $('#ttMonth').textContent = BULAN[mon.getMonth()] + ' ' + mon.getFullYear();
  box.innerHTML = `<span class="nav-blob tt-blob" aria-hidden="true"></span>` + wk.map(d => { const x = new Date(d + 'T00:00'); return `<button class="tt-day ${d === TTD ? 'on' : ''} ${d === today ? 'today' : ''}" data-d="${d}"><small>${HARI_S[x.getDay()]}</small><b>${x.getDate()}</b><i class="${ttDotCls(d)}"></i></button>`; }).join('');
  $$('.tt-day', box).forEach(b => b.onclick = () => ttGo(b.dataset.d));
  placeBlob($('.tt-blob', box), $('.tt-day.on', box), true);
  if (dir && motionOn()) $$('.tt-day', box).forEach((b, i) => b.animate(
    [{ opacity: 0, transform: `translateX(${dir * 26}px) scale(.94)` }, { opacity: 1, transform: 'none' }],
    { duration: SP.d, delay: (dir > 0 ? i : 5 - i) * 28, easing: SP.e, fill: 'backwards' }));
  if (dir && motionOn()) { const bl = $('.tt-blob', box); bl.animate([{ opacity: 0, transform: bl.style.transform + ' scale(.6)' }, { opacity: 1, transform: bl.style.transform }], { duration: SP.d, easing: SP.e }); }
}
function ttMoveBlob() {
  const box = $('#ttDays'); if (!box) return;
  $$('.tt-day', box).forEach(b => b.classList.toggle('on', b.dataset.d === TTD));
  placeBlob($('.tt-blob', box), $('.tt-day.on', box));
}
function ttDots() { $$('#ttDays .tt-day').forEach(b => $('i', b).className = ttDotCls(b.dataset.d)); }
addEventListener('resize', () => { const bl = $('#ttDays .tt-blob'); if (bl) placeBlob(bl, $('#ttDays .tt-day.on'), true); });

function ttRowHtml(s, ex) {
  const { it, i, a, b } = s, open = TT_OPEN === i, live = ttLive(a, b);
  const ctl = open ? `<div class="tt-ctl">
      ${it.k === 'b' ? `<button class="btn ghost sm" data-tbe="${i}">${I('pencil')}Ubah</button>`
        : `<div class="tt-step"><button class="icon-btn sm" data-tm="${i}" aria-label="Kurangi sesi">−</button><b class="num">${T`${it.n} sesi`}</b><button class="icon-btn sm" data-tp="${i}" aria-label="Tambah sesi">+</button></div>`
          + (ex ? `<button class="btn ghost sm" data-tgo="ujian">${I('cap')}${tx('Lihat ujian')}</button>` : `<button class="btn ghost sm" data-txm="${i}" data-a="${a}">${I('cap')}${tx('Jadikan ujian')}</button>`)}
      <span style="flex:1"></span>
      <button class="icon-btn sm" data-tu="${i}" aria-label="Naikkan" ${i ? '' : 'disabled'}>${I('chevu')}</button>
      <button class="icon-btn sm" data-td="${i}" aria-label="Turunkan" ${i < S.tt[TTD].items.length - 1 ? '' : 'disabled'}>${I('chev')}</button>
      <button class="icon-btn sm danger" data-tx="${i}" aria-label="Hapus">${I('trash')}</button></div>` : '';
  if (it.k === 'b') return `<div class="tt-row tt-brk ${open ? 'open' : ''} ${live ? 'now' : ''}" data-i="${i}">
      <div class="tt-main"><div class="tt-time"><b>${fromMin(a)}</b></div>
      <div class="tt-brk-l"><span>${esc(tx(it.l) || tx('Istirahat'))} · ${T`${it.min} menit`}</span></div></div>${ctl}</div>`;
  const sub = subjOf(it.s);
  return `<div class="tt-row ${open ? 'open' : ''} ${live ? 'now' : ''} ${ex ? 'exam' : ''}" data-i="${i}" style="--h:${subjHue(it.s)}">
      <div class="tt-main"><div class="tt-time"><b>${fromMin(a)}</b><span>${fromMin(b)}</span></div>
      <div class="tt-txt"><div class="ttl">${esc(subjName(it.s))}</div><div class="tt-sub">${ex ? esc(exLabel(ex.mapel) + ' · ' + fromMin(toMin(ex.jam))) : sub && sub.t ? esc(sub.t) : ''}</div></div>
      ${ex ? `<span class="tt-exam">${I('cap')}${T`Ujian${''}`}</span>` : live ? `<span class="tt-now">${tx('Sekarang')}</span>` : `<span class="tt-n">${it.n}×</span>`}</div>${ctl}</div>`;
}
/* Ujian yang tidak menempel ke pelajaran tampil sebagai baris sendiri */
function ttExamRow(e) {
  return `<div class="tt-row tt-xrow" data-tgo="ujian"><div class="tt-main"><div class="tt-time"><b>${fromMin(toMin(e.jam))}</b></div>
    <div class="tt-txt"><div class="ttl">${esc(exLabel(e.mapel))}</div><div class="tt-sub">${esc(e.catatan || tx('Dari menu Ujian'))}</div></div>
    <span class="tt-exam">${I('cap')}${T`Ujian${''}`}</span></div></div>`;
}
function ttDayDraw(dir, keepOpen) {
  const box = $('#ttBody'); if (!box) return;
  if (!keepOpen) TT_OPEN = Math.min(TT_OPEN, -1);
  const day = S.tt[TTD], slots = day ? ttSlots(day) : [];
  const lessons = slots.filter(x => x.it.k !== 'b');
  const prevSame = addDays(TTD, -7);
  const exs = ttExams(TTD), used = new Set();
  const att = slots.map(sl => { const e = ttExamFor(TTD, sl); if (e) used.add(e.id); return e; });
  const loose = exs.filter(e => !used.has(e.id)).sort((x, y) => toMin(x.jam) - toMin(y.jam));
  let rows = '', li = 0;
  slots.forEach((sl, k) => { while (li < loose.length && toMin(loose[li].jam) < sl.a) rows += ttExamRow(loose[li++]); rows += ttRowHtml(sl, att[k]); });
  while (li < loose.length) rows += ttExamRow(loose[li++]);
  box.innerHTML = `
    <div class="tt-head">
      <div style="min-width:0"><h3>${fd(ymdMs(TTD))}</h3>
        <div class="muted small">${slots.length ? T`${lessons.length} pelajaran · selesai ${fromMin(slots[slots.length - 1].b)}` : tx('Belum diisi')}${exs.length ? ' · ' + T`${exs.length} ujian` : ''}</div></div>
      <div class="tt-start"><input class="input" type="time" id="tts" value="${esc(day ? day.start : (S.ttStart || '07:00'))}"></div>
    </div>
    <div class="tt-list">${slots.length ? rows
      : (loose.length ? `<div class="tt-list" style="margin-bottom:6px">${rows}</div>` : '') + `<div class="tt-empty">${I('cal')}<b>${tx('Belum ada pelajaran')}</b>${ttHas(prevSame) ? `<button class="btn soft sm" id="ttPrev">${I('copy')}${T`Salin dari ${fd(ymdMs(prevSame))}`}</button>` : `<span>${tx('Tambah pelajaran, atau salin dari hari lain.')}</span>`}</div>`}</div>
    <div class="tt-foot">
      <button class="btn grad sm" id="ttAddL">${I('plus')}Pelajaran</button>
      <button class="btn ghost sm" id="ttAddB">${I('plus')}Istirahat</button>
      <span style="flex:1"></span>
      <button class="icon-btn sm" id="ttMore" aria-label="Lainnya">${I('more')}</button>
    </div>`;
  enhance(box);
  ttBindDay(box);
  if (dir && motionOn()) {
    box.animate([{ opacity: 0, transform: `translateX(${dir * 34}px)`, filter: 'blur(8px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }], { duration: SP_SOFT.d, easing: SP_SOFT.e });
    $$('.tt-row', box).slice(0, 10).forEach((r, k) => r.animate([{ opacity: 0, transform: `translateX(${dir * 18}px)` }, { opacity: 1, transform: 'none' }], { duration: SP.d, delay: 40 + k * 32, easing: SP.e, fill: 'backwards' }));
  }
}
function ttChanged(open) { const d = S.tt[TTD]; if (d) d.c = Date.now(); persist(); TT_OPEN = open === undefined ? TT_OPEN : open; ttDayDraw(0, true); ttDots(); badges(); }
function ttBindDay(box) {
  const ensure = () => { if (!S.tt[TTD]) S.tt[TTD] = { start: $('#tts', box).value || S.ttStart || '07:00', items: [], c: Date.now() }; return S.tt[TTD]; };
  const items = () => S.tt[TTD].items;
  $('#tts', box).onchange = e => { if (!e.target.value) return; ensure().start = e.target.value; ttChanged(); };
  $$('.tt-row[data-i]', box).forEach(r => $('.tt-main', r).onclick = () => {
    const i = +r.dataset.i, was = TT_OPEN;
    TT_OPEN = was === i ? -1 : i;
    ttDayDraw(0, true);
    const nr = $(`.tt-row[data-i="${TT_OPEN}"] .tt-ctl`, box);
    if (nr && motionOn()) nr.animate([{ opacity: 0, transform: 'translateY(-8px) scale(.97)' }, { opacity: 1, transform: 'none' }], { duration: SP.d, easing: SP.e });
  });
  $$('[data-tp]', box).forEach(b => b.onclick = () => { const x = items()[+b.dataset.tp]; x.n = Math.min(8, x.n + 1); ttChanged(); });
  $$('[data-tm]', box).forEach(b => b.onclick = () => { const x = items()[+b.dataset.tm]; if (x.n > 1) { x.n--; ttChanged(); } });
  const swap = (i, j) => { const a = items(); if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; ttChanged(j); };
  $$('[data-tu]', box).forEach(b => b.onclick = () => swap(+b.dataset.tu, +b.dataset.tu - 1));
  $$('[data-td]', box).forEach(b => b.onclick = () => swap(+b.dataset.td, +b.dataset.td + 1));
  $$('[data-tx]', box).forEach(b => b.onclick = () => {
    const i = +b.dataset.tx, old = items()[i], date = TTD;
    const row = b.closest('.tt-row');
    const done = () => { items().splice(i, 1); ttChanged(-1); };
    if (motionOn() && row) row.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateX(-30px) scale(.96)' }], { duration: 200, easing: 'ease-in', fill: 'forwards' }).onfinish = done; else done();
    toast(tx('Dihapus dari jadwal'), { label: 'Batalkan', fn: () => { if (!S.tt[date]) S.tt[date] = { start: S.ttStart || '07:00', items: [], c: Date.now() }; S.tt[date].items.splice(i, 0, old); if (TTD === date) ttChanged(-1); else persist(); } });
  });
  $$('[data-tgo]', box).forEach(b => b.onclick = e => { e.stopPropagation(); go(b.dataset.tgo); });
  $$('[data-txm]', box).forEach(b => b.onclick = () => {
    const x = items()[+b.dataset.txm], a = +b.dataset.a;
    const e = { id: uid(), mapel: subjName(x.s), tgl: TTD, jam: rawMin(a), catatan: '', done: false, studied: false, c: Date.now() };
    S.exams.push(e); persist(); TT_OPEN = -1; ttDayDraw(0); ttDots(); badges();
    toast(examNight(e) > Date.now() ? T`Ujian ditambah · pengingat ${fdt(examNight(e))}` : tx('Ujian ditambah'), { label: 'Lihat', fn: () => go('ujian') });
  });
  $$('[data-tbe]', box).forEach(b => b.onclick = async () => { const x = items()[+b.dataset.tbe]; const d = await breakModal(x); if (d) { Object.assign(x, d); ttChanged(); } });
  $('#ttAddL', box).onclick = async () => {
    if (!S.subj.length) { toast(tx('Tambahkan mata pelajaran dulu')); subjModal(); return; }
    const d = await lessonModal(); if (!d) return;
    ensure().items.push({ k: 'l', s: d.s, n: d.n }); ttChanged(-1); ttFlashLast();
  };
  $('#ttAddB', box).onclick = async () => { const d = await breakModal(); if (!d) return; ensure().items.push(Object.assign({ k: 'b' }, d)); ttChanged(-1); ttFlashLast(); };
  if ($('#ttPrev', box)) $('#ttPrev', box).onclick = () => ttCopyDay(addDays(TTD, -7));
  $('#ttMore', box).onclick = e => ttMoreMenu(e.currentTarget);
}
function ttFlashLast() { const r = $$('#ttBody .tt-row').pop(); if (r && motionOn()) r.animate([{ opacity: 0, transform: 'translateY(14px) scale(.96)' }, { opacity: 1, transform: 'none' }], { duration: SP.d, easing: SP.e }); }
function ttCopyDay(src) { S.tt[TTD] = { start: S.tt[src].start, items: clone(S.tt[src].items), c: Date.now() }; TT_OPEN = -1; persist(); ttDayDraw(1); ttDots(); toast(T`Disalin dari ${fd(ymdMs(src))}`); }

/* Menu ⋯ : salin & kosongkan */
function ttMoreMenu(anchor) {
  if (POP && POP.anchor === anchor) { closePop(); return; }
  const el = openPop(anchor, 'pop-list', 240);
  const has = ttHas(TTD);
  el.innerHTML = `<button type="button" class="opt" data-m="day"><span>${tx('Salin dari hari lain…')}</span>${I('copy')}</button>
    <button type="button" class="opt" data-m="week"><span>${tx('Salin minggu lalu ke hari kosong')}</span>${I('refresh')}</button>
    ${has ? `<button type="button" class="opt" data-m="clr" style="color:var(--danger)"><span>${tx('Kosongkan hari ini')}</span>${I('trash')}</button>` : ''}`;
  popIn(el);
  $$('.opt', el).forEach(o => o.onclick = async () => {
    closePop();
    if (o.dataset.m === 'day') ttCopyModal();
    else if (o.dataset.m === 'week') {
      let n = 0;
      weekOf(TTD).forEach(d => { const s = addDays(d, -7); if (ttHas(s) && !ttHas(d)) { S.tt[d] = { start: S.tt[s].start, items: clone(S.tt[s].items), c: Date.now() }; n++; } });
      if (n) { persist(); ttDayDraw(0); ttDots(); }
      toast(n ? T`${n} hari disalin dari minggu lalu` : tx('Tidak ada hari kosong yang bisa diisi'));
    } else if (o.dataset.m === 'clr') {
      if (!await ask(tx('Kosongkan jadwal hari ini?'), tx('Semua pelajaran dan istirahat di hari ini dihapus.'), 'Kosongkan', 'danger solid')) return;
      delete S.tt[TTD]; persist(); ttDayDraw(0); ttDots();
    }
  });
}
function ttCopyModal() {
  const days = Object.keys(S.tt).filter(d => d !== TTD && ttHas(d)).sort().reverse().slice(0, 21);
  if (!days.length) { toast(tx('Belum ada hari lain yang sudah diisi')); return; }
  const p = modal({ title: tx('Salin dari hari lain'), wide: true,
    html: `<div class="tt-src">${days.map(d => `<button type="button" class="opt" data-src="${d}"><span><b>${fd(ymdMs(d))}</b><small>${S.tt[d].items.filter(x => x.k !== 'b').map(x => esc(subjName(x.s))).join(' · ')}</small></span>${I('chevr')}</button>`).join('')}</div>`,
    actions: [{ label: 'Batal', cls: 'ghost', value: null }] });
  const m = $('#modal');
  $$('[data-src]', m).forEach(b => b.onclick = () => { m._src = b.dataset.src; $('.acts .btn', m).click(); });
  p.then(() => { const s = m._src; m._src = null; if (s) ttCopyDay(s); });
}

/* Mata pelajaran & guru (lembar terpisah agar halaman tetap rapi) */
function subjModal() {
  const rows = () => S.subj.map((s, i) => `<div class="tt-sj" style="--h:${s.h}"><span class="tt-dot"></span><div class="tt-sf"><input class="input" data-sn="${i}" value="${esc(s.n)}" placeholder="Mata pelajaran"><input class="input" data-st="${i}" value="${esc(s.t)}" placeholder="Guru"></div><button type="button" class="icon-btn sm danger" data-sx="${i}" aria-label="Hapus">${I('x')}</button></div>`).join('') || `<p class="faint small">${tx('Belum ada.')}</p>`;
  const p = modal({ title: tx('Mata pelajaran & guru'), wide: true,
    html: `<div class="tt-sjs" id="sjRows">${rows()}</div><button type="button" class="btn soft sm" id="sjAdd" style="margin-top:12px">${I('plus')}Tambah</button>`,
    actions: [{ label: 'Selesai', cls: 'grad', value: true }] });
  const m = $('#modal');
  setTimeout(() => { const f = document.activeElement; if (f && m.contains(f)) f.blur(); }, 90);
  const bind = () => {
    $$('[data-sn]', m).forEach(el => el.onchange = () => { S.subj[el.dataset.sn].n = el.value.trim() || tx('Tanpa nama'); persist(); });
    $$('[data-st]', m).forEach(el => el.onchange = () => { S.subj[el.dataset.st].t = el.value.trim(); persist(); });
    $$('[data-sx]', m).forEach(b => b.onclick = () => {
      const i = +b.dataset.sx, s = S.subj[i];
      S.subj.splice(i, 1); persist(); $('#sjRows', m).innerHTML = rows(); bind();
      toast(T`${s.n} dihapus`, { label: 'Batalkan', fn: () => { S.subj.splice(i, 0, s); persist(); if (!m.hidden && $('#sjRows', m)) { $('#sjRows', m).innerHTML = rows(); bind(); } if (V === 'jadwal') ttDayDraw(0); } });
    });
  };
  bind();
  $('#sjAdd', m).onclick = () => {
    S.subj.push({ id: uid(), n: tx('Mapel baru'), t: '', h: (S.subj.length * 47 + 15) % 360 }); persist();
    $('#sjRows', m).innerHTML = rows(); bind();
    const x = $$('[data-sn]', m).pop(); if (x) { x.scrollIntoView({ block: 'center', behavior: motionOn() ? 'smooth' : 'auto' }); x.focus(); x.select(); }
  };
  p.then(() => { if (V === 'jadwal') ttDayDraw(0); });
}
function ttSettingsModal() {
  const p = modal({ title: tx('Pengaturan jadwal'),
    html: `<div class="stack">
      <label class="field"><span>${tx('Durasi 1 sesi (menit)')}</span><input class="input" type="number" inputmode="numeric" min="5" id="ttMin" value="${S.ttMin}"></label>
      <label class="field"><span>${tx('Jam mulai biasanya')}</span><input class="input" type="time" id="ttSt" value="${esc(S.ttStart || '07:00')}"></label>
      <label class="field"><span>${tx('Ingatkan sebelum pelajaran')}</span><select class="input" id="ttLead">${[0, 5, 10, 15].map(m => `<option value="${m}" ${S.remind.ttLead === m ? 'selected' : ''}>${m ? T`${m} menit sebelum` : tx('Mati')}</option>`).join('')}</select></label>
      <p class="faint small" style="margin:0">${tx('Muncul sebagai notifikasi biasa, tanpa alarm.')}</p></div>`,
    actions: [{ label: 'Batal', cls: 'ghost', value: null }, { label: 'Simpan', cls: 'grad', get: m => ({ min: Math.max(5, Math.round(Number($('#ttMin', m).value) || 35)), st: $('#ttSt', m).value || '07:00', lead: Number($('#ttLead', m).value) || 0 }) }] });
  p.then(d => {
    if (!d) return;
    S.ttMin = d.min; S.ttStart = d.st;
    if (S.remind.ttLead !== d.lead) { S.remind.ttLead = d.lead; S.remind.ttAt = Date.now(); }
    persist(); ttDayDraw(0); toast(tx('Pengaturan jadwal disimpan'));
  });
}

/* Pilih mata pelajaran untuk ditambahkan */
function lessonModal() {
  let n = 2;
  const p = modal({ title: tx('Tambah pelajaran'), wide: true,
    html: `<div class="field"><span>${tx('Jumlah sesi')}</span><div class="seg" id="lmN">${[1, 2, 3, 4].map(k => `<button type="button" data-n="${k}" class="${k === n ? 'on' : ''}">${k}</button>`).join('')}</div></div>
      <p class="faint small" style="margin:8px 0 14px">${T`1 sesi = ${S.ttMin} menit. Ketuk mata pelajaran untuk menambahkannya.`}</p>
      <div class="tt-pick">${S.subj.map(s => `<button type="button" data-s="${s.id}" style="--h:${s.h}"><b>${esc(s.n)}</b><small>${esc(s.t || '')}</small></button>`).join('')}</div>`,
    actions: [{ label: 'Batal', cls: 'ghost', value: null }] });
  const m = $('#modal');
  $$('#lmN button', m).forEach(b => b.onclick = () => { n = +b.dataset.n; $$('#lmN button', m).forEach(x => x.classList.toggle('on', x === b)); });
  $$('.tt-pick button', m).forEach(b => b.onclick = () => { m._pick = { s: b.dataset.s, n }; $('.acts .btn', m).click(); });
  return p.then(() => { const r = m._pick; m._pick = null; return r || null; });
}
/* Istirahat / kegiatan dengan durasi bebas */
function breakModal(x) {
  x = x || { l: 'Istirahat', min: 15 };
  const presets = ['Istirahat', 'Sholat & makan siang', 'Kegiatan pagi', 'Sholat Dhuha'];
  const p = modal({ title: tx(x.k ? 'Ubah istirahat' : 'Tambah istirahat'),
    html: `<div class="tpl" id="bmP">${presets.map(k => `<button type="button" data-l="${esc(k)}">${esc(tx(k))}</button>`).join('')}</div>
      <div class="stack"><label class="field"><span>${tx('Nama')}</span><input class="input" id="bmL" value="${esc(tx(x.l))}"></label>
      <label class="field"><span>${tx('Durasi (menit)')}</span><input class="input" id="bmM" type="number" inputmode="numeric" min="1" value="${x.min}"></label></div>`,
    actions: [{ label: 'Batal', cls: 'ghost', value: null }, { label: 'Simpan', cls: 'grad', validate: m => Number($('#bmM', m).value) > 0, get: m => ({ l: $('#bmL', m).value.trim() || tx('Istirahat'), min: Math.round(Number($('#bmM', m).value)) }) }] });
  const m = $('#modal');
  $$('#bmP button', m).forEach(b => b.onclick = () => { $('#bmL', m).value = tx(b.dataset.l); });
  return p;
}

/* Kartu jadwal di Beranda */
function ttHomeCard() {
  const today = ymd(new Date());
  let date = today, label = tx('Jadwal hari ini');
  const tSlots = ttHas(today) ? ttSlots(S.tt[today]) : [];
  if (!tSlots.length || nowMin() >= tSlots[tSlots.length - 1].b) {
    const tm = addDays(today, 1);
    if (ttHas(tm)) { date = tm; label = tx('Jadwal besok'); }
    else if (!tSlots.length) return `<section class="card" style="margin-top:16px"><div class="card-head"><h2>${tx('Jadwal hari ini')}</h2><button class="btn ghost sm" data-go2="jadwal">${I('plus')}Isi jadwal</button></div><p class="muted small" style="margin:0">${tx('Belum ada pelajaran untuk hari ini.')}</p></section>`;
  }
  const slots = ttSlots(S.tt[date]), nm = nowMin(), isT = date === today;
  const next = isT ? slots.find(s => s.it.k !== 'b' && s.a > nm) : null;
  const cur = isT ? slots.find(s => nm >= s.a && nm < s.b) : null;
  const sub = cur && cur.it.k !== 'b' ? T`Sekarang: ${subjName(cur.it.s)}` + (next ? ' · ' + T`berikutnya ${subjName(next.it.s)} jam ${fromMin(next.a)}` : '')
    : next ? T`Berikutnya: ${subjName(next.it.s)} jam ${fromMin(next.a)}` : isT ? tx('Pelajaran hari ini sudah selesai') : fd(ymdMs(date));
  return `<section class="card" style="margin-top:16px">
    <div class="card-head"><div><h2>${label}</h2><div class="muted small" style="margin-top:4px">${esc(sub)}</div></div><button class="btn ghost sm" data-go2="jadwal">${tx('Lihat')}</button></div>
    <div class="tt-strip">${slots.filter(s => s.it.k !== 'b').map(s => { const ex = ttExamFor(date, s); return `<div class="tt-chip ${isT && nm >= s.a && nm < s.b ? 'now' : ''} ${isT && nm >= s.b ? 'past' : ''} ${ex ? 'exam' : ''}" style="--h:${subjHue(s.it.s)}"><b>${esc(subjName(s.it.s))}</b><span>${ex ? I('cap') + T`Ujian${''}` + ' · ' : ''}${fromMin(s.a)}–${fromMin(s.b)}</span></div>`; }).join('')}</div>
  </section>`;
}

/* Notifikasi sebelum pelajaran (lembut) */
function ttReminders(push) {
  const lead = S.remind.ttLead; if (!lead) return;
  const today = ymd(new Date());
  [today, addDays(today, 1)].forEach(d => {
    if (!ttHas(d)) return;
    const day = S.tt[d], base = ymdMs(d);
    ttSlots(day).filter(s => s.it.k !== 'b').forEach(s => {
      const sub = subjOf(s.it.s);
      push(Math.max(day.c || 0, S.remind.ttAt || 0), { id: 'tt-' + d + '-' + s.i + '-' + s.it.s + '-' + s.a, at: base + (s.a - lead) * 6e4, soft: true,
        title: subjName(s.it.s), body: T`Mulai ${fromMin(s.a)}` + (sub && sub.t ? ' · ' + sub.t : '') });
    });
  });
}

/* ---------- Belajar ---------- */
const TM_KEY = 'remindplus:timer';
let TM = lsGet(TM_KEY) || { run: false, start: 0, acc: 0, topic: '' };
const saveTM = () => lsSet(TM_KEY, TM);
const elapsed = () => TM.acc + (TM.run ? Date.now() - TM.start : 0);
const ptsFor = min => Math.floor(min / S.study.m) * S.study.p;
let tick = null;
function belajar() {
  const C = 2 * Math.PI * 140;
  view().innerHTML = `
  <div class="grid g-study">
    <section class="card">
      <div class="card-head"><h2>Timer belajar</h2><span class="chip brand">${I('spark')}${T`${S.study.p} poin / ${S.study.m} mnt`}</span></div>
      <label class="field"><span>Sedang belajar apa?</span><input class="input" id="bt" list="subjDL" autocomplete="off" placeholder="Contoh: Bahasa Inggris, coding, fisika" value="${esc(TM.topic)}">${subjDL()}</label>
      <div class="timer-wrap"><div class="timer-ring">
        <svg viewBox="0 0 300 300"><circle class="track" cx="150" cy="150" r="140" fill="none" stroke-width="12"/><circle class="val" id="tring" cx="150" cy="150" r="140" fill="none" stroke-width="12" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C}"/></svg>
        <div class="center"><div><div class="t num" id="clk">00:00:00</div><div class="s" id="clkp"></div></div></div>
      </div></div>
      <div class="timer-acts">
        <button class="btn grad" id="bs"></button>
        <button class="btn mint" id="bf">${I('check')}Selesai & ambil poin</button>
        <button class="icon-btn" id="br" title="Reset" aria-label="Reset">${I('reset')}</button>
      </div>
    </section>
    <section class="card">
      <h2>Catat manual</h2><p class="sub">Untuk sesi belajar yang tidak memakai timer.</p>
      <div class="stack">
        <label class="field"><span>Topik</span><input class="input" id="mt" list="subjDL" autocomplete="off" placeholder="Topik"></label>
        <label class="field"><span>Durasi (menit)</span><input class="input" id="mm" type="number" inputmode="numeric" min="1" placeholder="60"></label>
      </div>
      <div class="calc"><span class="muted">Poin yang didapat</span><b class="num" id="mp">0</b></div>
      <button class="btn block" id="ms">${I('plus')}Simpan sesi</button>
    </section>
  </div>`;
  const draw = () => {
    if (!$('#clk')) return;
    const ms = elapsed(), s = Math.floor(ms / 1000);
    $('#clk').textContent = [s / 3600, s % 3600 / 60, s % 60].map(x => String(Math.floor(x)).padStart(2, '0')).join(':');
    const m = Math.floor(ms / 60000), blk = S.study.m * 60000, nx = S.study.m - (m % S.study.m);
    $('#clkp').textContent = T`${fmt(ptsFor(m))} poin · ${nx} mnt lagi untuk +${S.study.p}`;
    const pr = (ms % blk) / blk; $('#tring').style.strokeDashoffset = C * (1 - pr); $('#tring').style.opacity = pr > 0.002 ? 1 : 0;
    const bs = $('#bs'); bs.innerHTML = TM.run ? I('pause') + 'Jeda' : I('play') + (TM.acc ? 'Lanjut' : 'Mulai');
    bs.className = TM.run ? 'btn soft' : 'btn grad';
  };
  clearInterval(tick); tick = setInterval(() => { if (V === 'belajar') draw(); else clearInterval(tick); }, 1000); draw();
  $('#bt').oninput = e => { TM.topic = e.target.value; saveTM(); };
  $('#bs').onclick = () => { if (TM.run) { TM.acc += Date.now() - TM.start; TM.run = false; } else { TM.start = Date.now(); TM.run = true; } saveTM(); draw(); };
  $('#br').onclick = async () => { if (elapsed() > 60000 && !await ask('Reset timer?', 'Waktu yang berjalan akan dibuang tanpa poin.', 'Reset', 'danger solid')) return; TM = { run: false, start: 0, acc: 0, topic: TM.topic }; saveTM(); draw(); };
  $('#bf').onclick = async () => {
    const m = Math.floor(elapsed() / 60000), p = ptsFor(m);
    if (m < 1) { toast('Belum ada waktu belajar'); return; }
    if (!p && !await ask('Belum dapat poin', T`Baru ${m} menit. Minimal ${S.study.m} menit untuk mendapat poin. Tetap akhiri sesi?`, 'Akhiri')) return;
    if (p) { add(p, 'Belajar ' + m + ' menit' + (TM.topic ? ': ' + TM.topic : ''), 'belajar', { min: m }); toast(T`+${p} poin dari ${m} menit belajar`); }
    else toast('Sesi diakhiri');
    TM = { run: false, start: 0, acc: 0, topic: TM.topic }; saveTM(); render();
  };
  const upd = () => $('#mp').textContent = fmt(ptsFor(Number($('#mm').value) || 0));
  $('#mm').oninput = upd;
  $('#ms').onclick = () => {
    const m = Math.floor(Number($('#mm').value)); if (!m || m < 1) { $('#mm').focus(); return; }
    const p = ptsFor(m); if (!p) { toast(T`Minimal ${S.study.m} menit untuk mendapat poin`); return; }
    const t = $('#mt').value.trim();
    add(p, 'Belajar ' + m + ' menit' + (t ? ': ' + t : ''), 'belajar', { min: m });
    toast(T`+${p} poin`); $('#mm').value = ''; $('#mt').value = ''; upd(); render();
  };
}

/* ---------- Riwayat ---------- */
let RF = 'semua';
function riwayat() {
  const L = S.log.filter(l => RF === 'semua' || l.kind === RF);
  const today = sod(Date.now());
  const td = S.log.filter(l => sod(Date.parse(l.t)) === today);
  const inT = td.filter(l => l.p > 0).reduce((a, b) => a + b.p, 0), outT = -td.filter(l => l.p < 0).reduce((a, b) => a + b.p, 0);
  view().innerHTML = `
  <div class="grid g3">
    <div class="card stat"><div class="ico t-mint">${I('up')}</div><div class="v num plus">+${fmt(inT)}</div><div class="l">Didapat hari ini</div></div>
    <div class="card stat"><div class="ico t-danger">${I('down')}</div><div class="v num minus">−${fmt(outT)}</div><div class="l">Dipakai hari ini</div></div>
    <div class="card stat"><div class="ico t-brand">${I('trophy')}</div><div class="v num">${fmt(S.earned)}</div><div class="l">Total sepanjang waktu</div></div>
  </div>
  <div class="sec-title"><div class="seg" id="rf">${[['semua', 'Semua'], ['tugas', 'Tugas'], ['belajar', 'Belajar'], ['ujian', 'Ujian'], ['kas', 'Kas'], ['ingat', 'Pengingat'], ...(S.log.some(l => l.kind === 'reward') ? [['reward', 'Reward']] : []), ['koreksi', 'Koreksi']].map(([k, n]) => `<button class="${k === RF ? 'on' : ''}" data-f="${k}">${n}</button>`).join('')}</div></div>
  <div class="list">${L.length ? L.slice(0, 250).map(logItem).join('') : emptyBox('history', 'Belum ada catatan', 'Riwayat poin akan muncul di sini.')}</div>`;
  $$('#rf button').forEach(b => b.onclick = () => { RF = b.dataset.f; render(); });
}

/* ================= Foto profil ================= */
const AV_EMO = ['🦊', '🐱', '🐼', '🐨', '🐯', '🦁', '🐸', '🐧', '🦉', '🐙', '🦄', '🐲', '🚀', '⚡', '🔥', '🌙', '⭐', '🎧', '🎮', '⚽', '🏀', '📚', '🎨', '😎'];
const AV_HUE = [258, 220, 190, 160, 130, 40, 15, 330];
const avBg = h => `linear-gradient(135deg, hsl(${h} 82% 64%), hsl(${(h + 38) % 360} 76% 46%))`;
function avPaint(el, a) {
  a = a === undefined ? S.profile.av : a;
  el.classList.remove('av-img', 'av-emo'); el.style.background = '';
  if (a && a.t === 'img' && a.d) { el.classList.add('av-img'); el.innerHTML = `<img src="${a.d}" alt="" draggable="false">`; }
  else if (a && a.t === 'emo') { el.classList.add('av-emo'); el.textContent = a.e; el.style.background = avBg(a.c); }
  else el.textContent = initial();
}
/* Potong foto menjadi persegi 256px (JPEG kecil, ikut tersinkron di akun) */
function avatarModal() {
  let cur = S.profile.av ? clone(S.profile.av) : null;
  let crop = null; // { img, z, x, y }
  const hue0 = cur && cur.t === 'emo' ? cur.c : AV_HUE[0];
  const p = modal({ title: tx('Foto profil'), wide: true,
    html: `<div class="av-ed">
      <div class="av-stage" id="avStage"><div class="avatar av-prev" id="avPrev"></div><canvas id="avCv" width="520" height="520" hidden></canvas><div class="av-ring" hidden></div></div>
      <div class="av-zoom" id="avZoomW" hidden><input type="range" id="avZoom" min="1" max="4" step="0.01" value="1" aria-label="Zoom"><span class="faint small">${tx('Geser foto untuk mengatur posisi')}</span></div>
      <div class="av-btns">
        <label class="btn grad sm av-file">${I('upload')}${tx('Pilih foto')}<input type="file" id="avFile" accept="image/*" hidden></label>
        <button type="button" class="btn ghost sm" id="avInit">${tx('Pakai inisial')}</button>
      </div>
      <div class="field"><span>${tx('Atau pilih emoji')}</span><div class="av-emos">${AV_EMO.map(e => `<button type="button" data-e="${e}">${e}</button>`).join('')}</div></div>
      <div class="av-hues">${AV_HUE.map(h => `<button type="button" data-h="${h}" style="background:${avBg(h)}" aria-label="Warna" class="${h === hue0 ? 'on' : ''}"></button>`).join('')}</div>
    </div>`,
    actions: [{ label: 'Batal', cls: 'ghost', value: null }, { label: 'Simpan', cls: 'grad', get: () => (crop ? { t: 'img', d: cropOut() } : cur) || { t: 'none' } }] });
  const m = $('#modal'), prev = $('#avPrev', m), cv = $('#avCv', m), ctx = cv.getContext('2d');
  let hue = hue0;
  const showPrev = () => { crop = null; cv.hidden = true; $('.av-ring', m).hidden = true; $('#avZoomW', m).hidden = true; prev.hidden = false; avPaint(prev, cur); pulse(prev); };
  const pulse = el => { if (motionOn()) el.animate([{ transform: 'scale(.86)' }, { transform: 'scale(1)' }], { duration: SP.d, easing: SP.e }); };
  showPrev();
  $$('.av-emos button', m).forEach(b => b.onclick = () => { cur = { t: 'emo', e: b.dataset.e, c: hue }; $$('.av-emos button', m).forEach(x => x.classList.toggle('on', x === b)); showPrev(); });
  $$('.av-hues button', m).forEach(b => b.onclick = () => {
    hue = +b.dataset.h; $$('.av-hues button', m).forEach(x => x.classList.toggle('on', x === b));
    cur = { t: 'emo', e: cur && cur.t === 'emo' ? cur.e : AV_EMO[0], c: hue }; showPrev();
  });
  $('#avInit', m).onclick = () => { cur = null; $$('.av-emos button', m).forEach(x => x.classList.remove('on')); showPrev(); };
  // ---- potong foto ----
  const draw = () => {
    const { img, z } = crop, W = cv.width, base = Math.max(W / img.width, W / img.height), s = base * z;
    const w = img.width * s, h = img.height * s;
    crop.x = Math.min(0, Math.max(W - w, crop.x)); crop.y = Math.min(0, Math.max(W - h, crop.y));
    ctx.clearRect(0, 0, W, W); ctx.drawImage(img, crop.x, crop.y, w, h);
  };
  function cropOut() {
    const o = document.createElement('canvas'); o.width = o.height = 256;
    o.getContext('2d').drawImage(cv, 0, 0, 256, 256);
    return o.toDataURL('image/jpeg', 0.86);
  }
  $('#avFile', m).onchange = e => {
    const f = e.target.files && e.target.files[0]; if (!f) return;
    const url = URL.createObjectURL(f), img = new Image();
    img.onload = () => {
      const W = cv.width, s = Math.max(W / img.width, W / img.height);
      crop = { img, z: 1, x: (W - img.width * s) / 2, y: (W - img.height * s) / 2 };
      prev.hidden = true; cv.hidden = false; $('.av-ring', m).hidden = false; $('#avZoomW', m).hidden = false; $('#avZoom', m).value = 1;
      $$('.av-emos button', m).forEach(x => x.classList.remove('on'));
      draw(); pulse(cv); URL.revokeObjectURL(url);
    };
    img.onerror = () => { toast(tx('Foto tidak bisa dibuka')); URL.revokeObjectURL(url); };
    img.src = url;
  };
  $('#avZoom', m).oninput = e => {
    if (!crop) return;
    const W = cv.width, c = W / 2, oz = crop.z, nz = +e.target.value;
    crop.x = c - (c - crop.x) * nz / oz; crop.y = c - (c - crop.y) * nz / oz; crop.z = nz; draw();
  };
  let drag = null;
  cv.addEventListener('pointerdown', e => { if (!crop) return; cv.setPointerCapture(e.pointerId); drag = { x: e.clientX, y: e.clientY }; });
  cv.addEventListener('pointermove', e => {
    if (!drag || !crop) return;
    const k = cv.width / cv.getBoundingClientRect().width;
    crop.x += (e.clientX - drag.x) * k; crop.y += (e.clientY - drag.y) * k; drag = { x: e.clientX, y: e.clientY }; draw();
  });
  cv.addEventListener('pointerup', () => { drag = null; });
  cv.addEventListener('wheel', e => { if (!crop) return; e.preventDefault(); const z = $('#avZoom', m); z.value = Math.min(4, Math.max(1, +z.value - e.deltaY * 0.002)); z.oninput({ target: z }); }, { passive: false });
  setTimeout(() => { const f = document.activeElement; if (f && m.contains(f)) f.blur(); }, 90);
  p.then(v => {
    if (!v) return;
    S.profile.av = v.t === 'none' ? null : v;
    persist(); updateIdentity(); if (V === 'atur') render();
    toast(tx('Foto profil disimpan'));
  });
}

/* Changelog (CHANGELOG.md) */
async function changelogModal() {
  let md = '';
  try { const r = await fetch('CHANGELOG.md', { cache: 'no-cache' }); md = await r.text(); } catch (e) { try { const r = await caches.match('./CHANGELOG.md'); md = r ? await r.text() : ''; } catch (x) {} }
  if (!md) { toast(tx('Changelog belum bisa dimuat. Coba lagi saat online.')); return; }
  const inl = t => esc(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  let html = '', open = false;
  for (const ln of md.split('\n')) {
    const l = ln.trim();
    if (l.startsWith('- ')) { if (!open) { html += '<ul>'; open = true; } html += '<li>' + inl(l.slice(2)) + '</li>'; continue; }
    if (open) { html += '</ul>'; open = false; }
    if (l.startsWith('## ')) { const [v, d] = l.slice(3).split(' — '); html += `<div class="cl-v"><span class="cl-tag">v${esc(v)}</span><span class="faint small">${esc(d || '')}</span></div>`; }
    else if (l.startsWith('### ')) html += '<h4>' + inl(l.slice(4)) + '</h4>';
  }
  if (open) html += '</ul>';
  modal({ title: 'Changelog', wide: true, html: `<div class="cl">${html}</div>`, actions: [{ label: 'Tutup', cls: 'grad', value: true }] });
}
/* ---------- Pengaturan ---------- */
function atur() {
  const local = USER.local;
  const notifSt = !('Notification' in window) ? 'Tidak didukung di browser ini' : Notification.permission === 'granted' ? 'Aktif' : Notification.permission === 'denied' ? 'Diblokir. Izinkan dari pengaturan aplikasi.' : 'Belum diizinkan';
  const legacy = lsGet(LEGACY_KEY);
  view().innerHTML = `
  <section class="card" style="margin-bottom:16px">
    <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
      <button class="avatar lg av-edit" id="avEdit" data-av aria-label="Ubah foto profil"></button>
      <div style="flex:1;min-width:200px">
        <h2 style="margin:0">${esc(displayName())}</h2>
        <div class="muted">${local ? 'Mode tanpa akun · data hanya di perangkat ini' : esc(USER.email)}</div>
        <div class="sync" style="padding:6px 0 0"></div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${local ? (sb ? `<button class="btn grad" id="toAcc">${I('cloud')}Buat akun / Masuk</button>` : `<button class="btn grad" id="toServer">${I('server')}Atur server akun</button>`) : `<button class="btn ghost" id="syncNow">${I('refresh')}Sinkronkan</button>`}
        <button class="btn ghost" id="logout">${I('logout')}${local ? 'Keluar mode lokal' : 'Keluar'}</button>
      </div>
    </div>
  </section>
  <div class="grid g2">
    <section class="card">
      <h2>Profil</h2><p class="sub">${local ? 'Nama yang tampil di aplikasi.' : 'Nama dan password akun Anda.'}</p>
      <div class="stack">
        <div class="form-row"><label class="field"><span>Nama panggilan</span><input class="input" id="pn" value="${esc(displayName())}"></label><button class="btn ghost" id="pnS">Simpan</button></div>
        ${local ? '' : `<div class="form-row"><label class="field"><span>Password baru</span><input class="input" id="pp" type="password" autocomplete="new-password" placeholder="Minimal 6 karakter"></label><button class="btn ghost" id="ppS">${I('lock')}Ubah</button></div>`}
      </div>
    </section>
    <section class="card">
      <h2>Tampilan</h2><p class="sub">Pilih tema. Otomatis mengikuti pengaturan tablet.</p>
      <div class="theme-pick">
        <button data-t="light"><span class="sw sw-light"></span>${I('sun')}Terang</button>
        <button data-t="dark"><span class="sw sw-dark"></span>${I('moon')}Gelap</button>
        <button data-t="auto"><span class="sw sw-auto"></span>${I('monitor')}Otomatis</button>
      </div>
      <div class="field" style="margin-top:18px"><span>Bahasa / Language</span><div class="seg" id="langPick"><button data-l="id" class="${LANG === 'id' ? 'on' : ''}">Bahasa Indonesia</button><button data-l="en" class="${LANG === 'en' ? 'on' : ''}">English</button></div></div>
      <div class="stack" style="margin-top:18px;gap:12px">
        <label class="switch"><input type="checkbox" id="fxg" ${FX.glass ? 'checked' : ''}>Efek kaca (liquid glass)</label>
        <label class="switch"><input type="checkbox" id="fxm" ${FX.motion ? 'checked' : ''}>Animasi halus</label>
        <p class="faint small" style="margin:0">Matikan salah satunya jika tablet terasa lambat atau baterai cepat habis.</p>
      </div>
    </section>
    <section class="card">
      <h2>Pengingat & alarm</h2><p class="sub">Atur kapan remind+ mengingatkan Anda.</p>
      <div class="stack">
        <div class="form-row"><label class="field"><span>Jam belajar (malam sebelum ujian)</span><input class="input" type="time" id="rx" value="${esc(S.remind.exam)}"></label>
        <label class="field"><span>Ingatkan tugas (jam sebelum deadline)</span><input class="input" type="number" inputmode="numeric" id="rh" value="${S.remind.taskH}"></label></div>
        <div class="form-row"><label class="field"><span>Bonus belajar sebelum ujian</span><input class="input" type="number" inputmode="numeric" id="rb" value="${S.remind.examBonus}"></label>
        <label class="field"><span>Potongan poin jika telat (%)</span><input class="input" type="number" inputmode="numeric" id="rl" min="0" max="100" value="${S.remind.latePct}"></label></div>
        <label class="switch"><input type="checkbox" id="rs2" ${S.remind.siren ? 'checked' : ''}>Alarm darurat layar penuh + sirene</label>
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
          <button class="btn alarm-btn sm" id="atest">${I('alarm')}Tes alarm</button>
          ${('Notification' in window) && Notification.permission === 'default' ? `<button class="btn soft sm" id="nb">${I('bell')}Izinkan notifikasi</button>` : ''}
          <button class="btn ghost sm" id="nt">${I('bell')}Tes notifikasi</button>
          <span class="faint small">${T`Notifikasi: ${tx(notifSt)}`}</span>
        </div>
        <p class="faint small" style="margin:0">${IS_IOS ? T`Di iPhone/iPad, notifikasi hanya muncul saat remind+ terbuka. Agar <b>pasti berbunyi walau aplikasi tertutup</b>, ketuk <b>Pengingat iPhone</b> pada ujian, tugas, atau kas, lalu simpan ke Kalender. Supaya tetap berbunyi saat Fokus aktif, buka <b>Pengaturan iPhone → Notifikasi → Kalender</b> lalu nyalakan <b>Notifikasi Sensitif Waktu</b>.` : T`Agar alarm <b>pasti berbunyi walau mode Jangan Ganggu aktif</b>, ketuk <b>Alarm HP</b> pada ujian atau tugas. Tombolnya muncul saat pengingat tinggal kurang dari 24 jam.`}</p>
      </div>
    </section>
    <section class="card">
      <h2>Aturan poin</h2><p class="sub">Berapa nilai usaha Anda.</p>
      <div class="stack">
        <div class="form-row"><label class="field"><span>Poin belajar</span><input class="input" type="number" inputmode="numeric" id="sp" value="${S.study.p}"></label><label class="field"><span>setiap (menit)</span><input class="input" type="number" inputmode="numeric" id="sm" value="${S.study.m}"></label></div>
      </div>
    </section>
    <section class="card">
      <div class="card-head"><h2>Tingkat kesulitan</h2><button class="btn soft sm" id="da">${I('plus')}Tambah</button></div>
      <div class="rows">${S.diff.map((d, i) => `<div class="r"><input class="input" data-dn="${i}" value="${esc(d.n)}"><input class="input w-num" type="number" inputmode="numeric" data-dp="${i}" value="${d.p}"><button class="icon-btn sm danger" data-dx="${i}" aria-label="Hapus">${I('x')}</button></div>`).join('')}</div>
    </section>
    <section class="card">
      <div class="card-head"><h2>Level</h2><button class="btn soft sm" id="la">${I('plus')}Tambah</button></div>
      <div class="rows">${S.levels.map((l, i) => `<div class="r"><input class="input" data-ln="${i}" value="${esc(l.n)}"><input class="input w-num" type="number" inputmode="numeric" data-lm="${i}" value="${l.min}" ${i === 0 ? 'disabled' : ''}>${i === 0 ? '<span style="width:38px;flex:none"></span>' : `<button class="icon-btn sm danger" data-lx="${i}" aria-label="Hapus">${I('x')}</button>`}</div>`).join('')}</div>
      <p class="faint small" style="margin:10px 0 0">Angka = total poin yang dibutuhkan untuk mencapai level.</p>
    </section>
    <section class="card">
      <h2>Koreksi poin</h2><p class="sub">Bonus atau potongan manual.</p>
      <div class="form-row"><label class="field"><span>Poin (+/−)</span><input class="input" type="number" inputmode="numeric" id="kp" placeholder="50 atau -30"></label><label class="field"><span>Alasan</span><input class="input" id="ka" placeholder="Opsional"></label><button class="btn ghost" id="kgo">Terapkan</button></div>
    </section>
    <section class="card span2">
      <h2>Data</h2><p class="sub">${local ? 'Data hanya tersimpan di perangkat ini. Buat cadangan secara rutin.' : 'Data tersimpan di akun dan di perangkat ini.'}</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn ghost" id="ex">${I('copy')}Salin cadangan</button>
        <button class="btn ghost" id="im">${I('upload')}Pulihkan cadangan</button>
        ${legacy && Array.isArray(legacy.log) && !isFresh(legacy) ? `<button class="btn ghost" id="imOld">${I('wand')}Impor data Poin Mandiri</button>` : ''}
        <button class="btn danger" id="rs">${I('reset')}Reset data</button>
        ${local ? '' : `<button class="btn danger" id="delAcc">${I('trash')}Hapus akun</button>`}
      </div>
      <div id="bxw" hidden style="margin-top:12px"><textarea class="input" id="bx" rows="4" placeholder="Tempel teks cadangan di sini"></textarea><button class="btn" id="bxgo" style="margin-top:10px">Pulihkan</button></div>
      <button class="linkish small" id="clog" style="margin-top:16px">${T`remind+ versi ${VERSION}`} · ${tx('Lihat changelog')}</button>
    </section>
  </div>`;
  setSync(SYNC.st, SYNC.txt);
  refreshThemeButtons();
  const num = (v, min = 0) => Math.max(min, Math.round(Number(v) || 0));
  const on = (sel, fn) => $$(sel, view()).forEach(el => el.addEventListener('change', () => { fn(el); persist(); }));
  on('[data-dn]', el => S.diff[el.dataset.dn].n = el.value.trim() || tx('Tanpa nama'));
  on('[data-dp]', el => S.diff[el.dataset.dp].p = num(el.value, 1));
  on('[data-ln]', el => S.levels[el.dataset.ln].n = el.value.trim() || 'Level');
  on('[data-lm]', el => { S.levels[el.dataset.lm].min = num(el.value, 1); levelOf(S.earned); setTimeout(render, 0); });
  on('#sp', el => S.study.p = num(el.value, 1)); on('#sm', el => S.study.m = num(el.value, 1));
  on('#rx', el => S.remind.exam = el.value || '19:00'); on('#rh', el => S.remind.taskH = num(el.value, 1));
  on('#rb', el => S.remind.examBonus = num(el.value, 0)); on('#rl', el => S.remind.latePct = Math.min(100, num(el.value, 0)));
  on('#rs2', el => S.remind.siren = el.checked);
  const rm = (attr, arr, keep) => $$('[data-' + attr + ']', view()).forEach(b => b.onclick = () => {
    if (S[arr].length <= keep) { toast(T`Minimal ${keep} item`); return; }
    S[arr].splice(Number(b.dataset[attr]), 1); persist(); render();
  });
  rm('dx', 'diff', 1); rm('lx', 'levels', 1);
  $('#da').onclick = () => { S.diff.push({ n: tx('Baru'), p: 30 }); persist(); render(); };
  $('#la').onclick = () => { const mx = Math.max(...S.levels.map(l => l.min)); S.levels.push({ n: tx('Level baru'), min: mx + 5000 }); persist(); render(); };
  $$('.theme-pick button', view()).forEach(b => b.onclick = e => themeTransition(() => setTheme(b.dataset.t), e));
  $$('#langPick button', view()).forEach(b => b.onclick = () => { if (b.dataset.l === LANG) return; try { sessionStorage.setItem('remindplus:back', 'atur'); } catch (e) {} setLang(b.dataset.l); });
  $('#fxg').onchange = e => { setFx({ glass: e.target.checked }); toast(e.target.checked ? 'Efek kaca aktif' : 'Efek kaca dimatikan'); };
  $('#fxm').onchange = e => { setFx({ motion: e.target.checked }); toast(e.target.checked ? 'Animasi aktif' : 'Animasi dimatikan'); };
  // akun
  $('#pnS').onclick = async () => {
    const n = $('#pn').value.trim(); if (!n) return;
    if (local) { S.profile.name = n; persist(); render(); toast('Nama disimpan'); return; }
    try { await sb.updateUser({ data: { name: n } }); USER.name = n; render(); toast('Nama disimpan'); } catch (e) { toast(tr(e)); }
  };
  if ($('#ppS')) $('#ppS').onclick = async () => {
    const p = $('#pp').value; if (p.length < 6) { toast('Password minimal 6 karakter'); return; }
    try { await sb.updateUser({ password: p }); $('#pp').value = ''; toast('Password diubah'); } catch (e) { toast(tr(e)); }
  };
  if ($('#syncNow')) $('#syncNow').onclick = async () => { if (S.meta.dirty) await pushNow(); await pull(true); };
  if ($('#toAcc')) $('#toAcc').onclick = () => { lsDel(LOCAL_MODE_KEY); USER = null; showAuth('signup'); };
  if ($('#toServer')) $('#toServer').onclick = () => { lsDel(LOCAL_MODE_KEY); USER = null; showAuth('server'); };
  $('#logout').onclick = logout;
  $('#clog').onclick = changelogModal;
  $('#avEdit').onclick = avatarModal;
  if ($('#delAcc')) $('#delAcc').onclick = deleteAccount;
  // pengingat
  $('#atest').onclick = () => { const v = S.remind.siren; S.remind.siren = true; alarm({ id: 'test', title: tx('Tes alarm'), body: tx('Beginilah bunyi pengingat ujian dan deadline.') }); S.remind.siren = v; };
  if ($('#nb')) $('#nb').onclick = async () => { try { await Notification.requestPermission(); } catch (e) {} if (Notification.permission === 'granted') { regPeriodic(); toast('Notifikasi aktif'); } render(); };
  $('#nt').onclick = async () => { if (!(await notify({ id: 'test', title: 'remind+', body: tx('Notifikasi berfungsi. Semangat belajar!') }))) toast('Izinkan notifikasi dulu'); };
  // koreksi
  $('#kgo').onclick = async () => {
    const p = Math.round(Number($('#kp').value)); if (!p) { $('#kp').focus(); return; }
    if (p < 0 && -p > S.balance && !await ask('Saldo jadi minus', 'Lanjutkan koreksi ini?', 'Lanjutkan')) return;
    add(p, 'Koreksi: ' + ($('#ka').value.trim() || 'manual'), 'koreksi'); render(); toast('Saldo diperbarui');
  };
  // data
  $('#ex').onclick = async () => {
    const t = JSON.stringify(Object.assign({}, S, { meta: undefined }));
    try { await navigator.clipboard.writeText(t); toast('Cadangan disalin. Simpan di catatan Anda.'); }
    catch (e) { $('#bxw').hidden = false; $('#bxgo').hidden = true; $('#bx').value = t; $('#bx').select(); toast('Salin teks di kotak'); }
  };
  $('#im').onclick = () => { $('#bxw').hidden = false; $('#bxgo').hidden = false; $('#bx').value = ''; $('#bx').focus(); };
  $('#bxgo').onclick = async () => {
    let d; try { d = JSON.parse($('#bx').value); if (typeof d !== 'object' || !Array.isArray(d.log)) throw 0; } catch (e) { toast('Teks cadangan tidak valid'); return; }
    if (!await ask('Pulihkan cadangan?', 'Semua data sekarang diganti dengan isi cadangan.', 'Pulihkan', 'danger solid')) return;
    const meta = S.meta; merge(d); S.meta = meta; persist(); render(); toast('Data dipulihkan');
  };
  if ($('#imOld')) $('#imOld').onclick = async () => {
    if (!await ask('Impor data Poin Mandiri?', T`Data sekarang diganti dengan data dari aplikasi lama (${fmt(legacy.balance)} poin).`, 'Impor', 'grad')) return;
    const meta = S.meta; merge(legacy); S.meta = meta; markMigrated(LEGACY_KEY); persist(); render(); toast('Data lama diimpor');
  };
  $('#rs').onclick = async () => {
    if (!await ask('Reset semua data?', 'Poin, tugas, ujian, riwayat, dan pengaturan kembali ke awal. Tidak bisa dibatalkan.', 'Reset', 'danger solid')) return;
    const meta = S.meta, prof = S.profile; S = clone(DEF); S.meta = meta; S.profile = prof; persist(); render(); toast('Data direset');
  };
}
async function logout() {
  if (USER.local) {
    if (!await ask('Keluar dari mode lokal?', 'Data tetap tersimpan di perangkat ini dan bisa dipindahkan ke akun saat Anda masuk.', 'Keluar')) return;
    lsDel(LOCAL_MODE_KEY); USER = null; showAuth('login'); return;
  }
  if (S.meta.dirty) await pushNow();
  if (S.meta.dirty && !await ask('Ada perubahan belum tersinkron', 'Perubahan terakhir belum terkirim karena offline. Jika keluar sekarang, perubahan itu tidak masuk ke akun.', 'Tetap keluar', 'danger solid')) return;
  const id = USER.id;
  LOGGING_OUT = true; await sb.signOut(); LOGGING_OUT = false;
  lsDel(stateKey(id)); USER = null;
  showAuth('login', { info: 'Anda sudah keluar.', error: '' });
}
async function deleteAccount() {
  const v = await modal({
    title: 'Hapus akun permanen?',
    html: `<p>${T`Akun <b>${esc(USER.email)}</b> dan seluruh datanya akan dihapus dari server. Tindakan ini tidak bisa dibatalkan.`}</p><label class="field" style="margin-top:12px"><span>${T`Ketik ${tx('HAPUS')} untuk konfirmasi`}</span><input class="input" id="cf" autocomplete="off"></label>`,
    actions: [{ label: 'Batal', cls: 'ghost', value: false }, { label: 'Hapus akun', cls: 'danger solid', validate: m => $('#cf', m).value.trim().toUpperCase() === tx('HAPUS'), value: true }]
  });
  if (!v) return;
  try {
    await sb.rpc('delete_my_account');
    const id = USER.id;
    LOGGING_OUT = true; await sb.signOut(); LOGGING_OUT = false;
    lsDel(stateKey(id)); USER = null;
    showAuth('login', { info: 'Akun Anda sudah dihapus.', error: '' });
  } catch (e) { toast(tr(e)); }
}

/* ================= Peringatan & pengingat ================= */
function alerts() {
  const box = $('#alerts'); if (!box) return;
  const out = [], now = Date.now();
  S.exams.filter(e => !e.done).forEach(e => {
    const dd = dayDiff(examAt(e));
    if (dd === 1 && !e.studied) out.push(`<div class="alert warn"><div class="ico">${I('cap')}</div><div class="body"><b>${T`Ujian ${esc(e.mapel)} besok, ${timeShort(examAt(e))}`}</b><span class="small muted">${now >= examNight(e) ? tx('Waktunya belajar malam ini.') : T`Jadwal belajar malam ini jam ${esc(hhmm(S.remind.exam))}.`}</span></div>
      <div class="acts">${alarmBtn(examNight(e), T`Belajar ujian ${e.mapel}`)}<button class="btn sm" data-ast="${e.id}">${I('play')}Mulai belajar</button><button class="btn mint sm" data-asd="${e.id}">${I('check')}${T`Sudah (+${S.remind.examBonus})`}</button></div></div>`);
    else if (dd === 0 && examAt(e) > now - 3 * 36e5) out.push(`<div class="alert info"><div class="ico">${I('cap')}</div><div class="body"><b>${T`Ujian ${esc(e.mapel)} hari ini, ${timeShort(examAt(e))}`}</b><span class="small muted">Semangat! Kamu pasti bisa.</span></div></div>`);
  });
  const today = ymd(new Date());
  S.kas.forEach(k => {
    const un = kasUnpaid(k), late = un.filter(x => x !== today);
    if (late.length) out.push(`<div class="alert danger"><div class="ico">${I('wallet')}</div><div class="body"><b>${T`Nunggak ${esc(k.n)} ${late.length}× · ${rp(late.length * k.amt)}`}</b><span class="small muted">Segera lunasi ya.</span></div><div class="acts"><button class="btn mint sm" data-akall="${k.id}">${I('check')}Bayar semua</button>${V !== 'kas' ? '<button class="btn ghost sm" data-ago="kas">Lihat</button>' : ''}</div></div>`);
    else if (un.includes(today)) out.push(`<div class="alert warn"><div class="ico">${I('wallet')}</div><div class="body"><b>${T`Bayar ${esc(k.n)} hari ini · ${rp(k.amt)}`}</b><span class="small muted">${k.bonus ? T`Bayar hari ini dapat bonus +${k.bonus} poin.` : tx('Jangan lupa siapkan uangnya.')}</span></div><div class="acts"><button class="btn mint sm" data-ak="${k.id}">${I('check')}Sudah bayar</button></div></div>`);
    else { const nx = kasNext(k); if (nx && dayDiff(ymdMs(nx)) === 1 && k.h1) out.push(`<div class="alert info"><div class="ico">${I('wallet')}</div><div class="body"><b>${T`Besok bayar ${esc(k.n)} · ${rp(k.amt)}`}</b><span class="small muted">Siapkan uangnya malam ini.</span></div></div>`); }
  });
  const late = S.tasks.filter(t => !t.done && t.dl && dlMs(t) < now);
  const soon = S.tasks.filter(t => !t.done && t.dl && dlMs(t) >= now && dlMs(t) - now <= S.remind.taskH * 36e5);
  if (late.length) out.push(`<div class="alert danger"><div class="ico">${I('warn')}</div><div class="body"><b>${T`${late.length} tugas lewat deadline`}</b><span class="small muted">${late.slice(0, 3).map(t => esc(t.n)).join(', ')}${late.length > 3 ? '…' : ''}</span></div>${V !== 'tugas' ? `<div class="acts"><button class="btn ghost sm" data-ago="tugas">Lihat</button></div>` : ''}</div>`);
  if (soon.length) out.push(`<div class="alert warn"><div class="ico">${I('clock')}</div><div class="body"><b>${T`${soon.length} tugas deadline dalam ${S.remind.taskH} jam`}</b><span class="small muted">${soon.slice(0, 3).map(t => esc(t.n) + ' (' + fdt(dlMs(t)) + ')').join(', ')}</span></div>${V !== 'tugas' ? `<div class="acts"><button class="btn ghost sm" data-ago="tugas">Lihat</button></div>` : ''}</div>`);
  if (V === 'home') {
    const td = S.rem.map(r => ({ r, d: remOcc(r, now, now)[0] })).filter(x => x.d && !x.r.done.includes(x.d)).sort((a, b) => remAt(a.r, a.d) - remAt(b.r, b.d));
    if (td.length) out.push(`<div class="alert info"><div class="ico">${I('bell')}</div><div class="body"><b>${T`${td.length} pengingat hari ini`}</b><span class="small muted">${td.slice(0, 3).map(x => esc(x.r.t) + ' ' + hhmm(x.r.jam)).join(' · ')}${td.length > 3 ? '…' : ''}</span></div><div class="acts"><button class="btn ghost sm" data-ago="ingat">Lihat</button></div></div>`);
  }
  if (IS_IOS && !IS_STANDALONE && !lsGet('remindplus:ios-hint')) out.unshift(`<div class="alert info"><div class="ico">${I('upload')}</div><div class="body"><b>Pasang remind+ di iPhone/iPad</b><span class="small muted">${T`Di Safari, ketuk tombol Bagikan (kotak dengan panah ke atas), lalu pilih <strong>Tambahkan ke Layar Utama</strong>. Notifikasi baru bisa aktif setelah dipasang.`}</span></div><div class="acts"><button class="btn ghost sm" data-iosok>Mengerti</button></div></div>`);
  box.innerHTML = out.join('');
  const iosOk = $('[data-iosok]', box); if (iosOk) iosOk.onclick = () => { lsSet('remindplus:ios-hint', true); alerts(); };
  $$('[data-ago]', box).forEach(b => b.onclick = () => go(b.dataset.ago));
  $$('[data-ast]', box).forEach(b => b.onclick = () => startExamStudy(b.dataset.ast));
  $$('[data-asd]', box).forEach(b => b.onclick = () => examStudied(b.dataset.asd));
  $$('[data-ak]', box).forEach(b => b.onclick = () => payKas(b.dataset.ak, false));
  $$('[data-akall]', box).forEach(b => b.onclick = () => payKas(b.dataset.akall, true));
}

function reminderList() {
  const L = [];
  // Pengingat yang waktunya sudah lewat saat item dibuat/diubah tidak dibunyikan
  const push = (c, r) => { if (!c || r.at >= c) L.push(r); };
  S.exams.filter(e => !e.done).forEach(e => push(e.c, { id: 'ex-' + e.id + '-' + e.tgl, at: examNight(e), title: T`Belajar malam ini: ${e.mapel}`, body: T`Ujian ${e.mapel} besok, ${fdt(examAt(e))}. Ayo belajar sekarang!` }));
  S.tasks.filter(t => !t.done && t.dl).forEach(t => {
    const d = dlMs(t);
    push(t.c, { id: 'dl-' + t.id + '-' + t.dl, at: d - S.remind.taskH * 36e5, title: T`Deadline mendekat: ${t.n}`, body: T`Jatuh tempo ${fdt(d)}.` });
    push(t.c, { id: 'due-' + t.id + '-' + t.dl, at: d, title: T`Deadline sekarang: ${t.n}`, body: tx('Waktunya habis. Selesaikan secepatnya.') });
  });
  const today = ymd(new Date());
  S.kas.forEach(k => {
    kasDue(k, Date.now(), Date.now() + 2 * DAY).filter(d => !k.paid.includes(d)).forEach(d => {
      push(k.c, { id: 'kas-' + k.id + '-' + d, at: kasAt(k, d), title: d === today ? T`Bayar ${k.n} hari ini` : T`Bayar ${k.n}`, body: rp(k.amt) + ' · ' + kasSched(k) + '.' });
      if (k.h1) { const ev = new Date(d + 'T00:00'); ev.setDate(ev.getDate() - 1); const [h, m] = (S.remind.exam || '19:00').split(':'); ev.setHours(+h || 19, +m || 0, 0, 0); push(k.c, { id: 'kas1-' + k.id + '-' + d, at: ev.getTime(), title: T`Besok bayar ${k.n}`, body: T`Siapkan ${rp(k.amt)} malam ini.` }); }
    });
  });
  ttReminders(push);
  S.rem.forEach(r => {
    remOcc(r, Date.now() - DAY, Date.now() + 2 * DAY).filter(d => !r.done.includes(d)).forEach(d => {
      remTimes(r, d).forEach(([at, k], i) => push(r.c, {
        id: 'rem-' + r.id + '-' + d + '-' + i, at, soft: true, title: r.t,
        body: (k === 'eve' ? tx('Besok') + ' ' : k === 'pre' ? tx('Nanti') + ' ' : '') + hhmm(r.jam || '') + ' · ' + (r.note || tx((REM_CAT[r.cat] || REM_CAT.sekolah).n))
      }));
    });
  });
  return L;
}
const NKEY = 'remindplus:notified';
const getN = () => lsGet(NKEY, {});
const setN = n => lsSet(NKEY, n);
async function notify(r) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return false;
  const opt = r.soft
    ? { body: r.body, tag: r.id, icon: 'icon-192.png', badge: 'badge-96.png', renotify: false, requireInteraction: false, silent: false, vibrate: [180, 90, 180] }
    : { body: r.body, tag: r.id, icon: 'icon-192.png', badge: 'badge-96.png', renotify: true, requireInteraction: true, silent: false, vibrate: [800, 300, 800, 300, 800, 300, 800] };
  const title = (r.soft ? '🔔 ' : '⏰ ') + r.title;
  try { const reg = await navigator.serviceWorker.ready; await reg.showNotification(title, opt); return true; }
  catch (e) { try { new Notification(title, opt); return true; } catch (x) { return false; } }
}
let RT = [];
async function syncReminders() {
  if (!USER) return;
  const L = reminderList(), now = Date.now(), N = getN();
  try { const c = await caches.open('pm-data'), r = await c.match('./reminders.json'); if (r) { const d = await r.json(); Object.assign(N, d.notified || {}); } } catch (e) {}
  for (const r of L) { if (r.at <= now && now - r.at < 12 * 36e5 && !N[r.id]) { await notify(r); N[r.id] = now; if (!r.soft) alarm(r); else softAlert(r); } }
  for (const k in N) if (now - N[k] > 30 * DAY) delete N[k];
  setN(N);
  RT.forEach(clearTimeout); RT = [];
  L.filter(r => r.at > now && r.at - now < DAY).forEach(r => RT.push(setTimeout(async () => {
    const n = getN(); if (n[r.id]) return;
    await notify(r); n[r.id] = Date.now(); setN(n); if (!r.soft) alarm(r); else softAlert(r); alerts();
  }, r.at - now)));
  try { const c = await caches.open('pm-data'); await c.put('./reminders.json', new Response(JSON.stringify({ list: L, notified: getN() }), { headers: { 'Content-Type': 'application/json' } })); } catch (e) {}
}

/* Pengingat lembut saat aplikasi terbuka: cukup toast, tanpa sirene */
function softAlert(r) { if (!document.hidden) toast('🔔 ' + r.title + ' · ' + r.body); }

/* Alarm darurat layar penuh */
let AL = null, ACX = null;
function audioCtx() {
  try { if (!ACX) ACX = new (window.AudioContext || window.webkitAudioContext)(); if (ACX.state === 'suspended') ACX.resume(); } catch (e) {}
  return ACX;
}
/* iOS & Chrome hanya mengizinkan suara setelah layar disentuh: siapkan sekali di sentuhan pertama */
['pointerdown', 'keydown'].forEach(ev => addEventListener(ev, function unlock() { const c = audioCtx(); if (c && c.state === 'running') removeEventListener(ev, unlock); }, { passive: true }));
function alarm(r) {
  if (!S.remind.siren) return;
  $('#alT').textContent = r.title; $('#alB').textContent = r.body; $('#alarm').hidden = false;
  stopSiren();
  AL = { r, v: null };
  try {
    const AC = audioCtx();
    const g = AC.createGain(); g.gain.value = .9; g.connect(AC.destination);
    const o = AC.createOscillator(); o.type = 'square'; o.connect(g); o.start();
    const t0 = AC.currentTime; for (let i = 0; i < 600; i++) o.frequency.setValueAtTime(i % 2 ? 650 : 1050, t0 + i * .45);
    AL.g = g; AL.o = o;
  } catch (e) {}
  const vib = () => { try { navigator.vibrate && navigator.vibrate([700, 250, 700]); } catch (e) {} };
  vib(); AL.v = setInterval(vib, 1200);
}
function stopSiren() { if (!AL) return; try { AL.o && AL.o.stop(); AL.g && AL.g.disconnect(); } catch (e) {} clearInterval(AL.v); try { navigator.vibrate && navigator.vibrate(0); } catch (e) {} }
function closeAlarm() { stopSiren(); AL = null; $('#alarm').hidden = true; }
$('#alOff').onclick = closeAlarm;
$('#alGo').onclick = () => { const r = AL && AL.r; closeAlarm(); if (!USER || !r) return; if (r.id.startsWith('ex-')) startExamStudy(r.id.split('-')[1]); else if (r.id.startsWith('kas')) go('kas'); else go('tugas'); };
$('#alSn').onclick = () => { const r = AL && AL.r; closeAlarm(); if (!r) return; toast('Ditunda 10 menit'); RT.push(setTimeout(() => { notify(r); alarm(r); }, 6e5)); };

/* ================= Loop & siklus hidup ================= */
let LOOP = null, PULL_LOOP = null, LOGGING_OUT = false;
function startLoops() {
  stopLoops();
  LOOP = setInterval(() => { if (!USER) return; alerts(); badges(); if (V === 'tugas' || V === 'ujian' || V === 'home') render(); }, 60000);
  PULL_LOOP = setInterval(() => { if (USER && !USER.local && !document.hidden) { if (S.meta.dirty) push(); else pull(); } }, 5 * 60000);
}
function stopLoops() { clearInterval(LOOP); clearInterval(PULL_LOOP); clearInterval(tick); RT.forEach(clearTimeout); RT = []; }
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { if (USER && !USER.local && S.meta.dirty) pushNow(); return; }
  if (!USER) return;
  render();
  if (!USER.local) { if (S.meta.dirty) push(); else pull(); }
});
addEventListener('online', () => { if (USER && !USER.local) { if (S.meta.dirty) push(); else pull(); } });
addEventListener('offline', () => { if (USER && !USER.local) setSync('warn', 'Offline · disimpan di perangkat'); });

/* ================= Service worker ================= */
async function regPeriodic() { try { const r = await navigator.serviceWorker.ready; if (r.periodicSync) await r.periodicSync.register('pm-remind', { minInterval: 60 * 60 * 1000 }); } catch (e) {} }
if ('serviceWorker' in navigator) addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) {}
if ('Notification' in window && Notification.permission === 'granted') regPeriodic();

/* ================= Mulai ================= */
async function boot() {
  applyTheme();
  let red = null;
  if (sb) {
    sb.on(ev => {
      if (ev === 'SIGNED_OUT' && !LOGGING_OUT && USER && !USER.local) {
        USER = null;
        showAuth('login', { info: '', error: 'Sesi berakhir. Silakan masuk lagi.' });
      }
    });
    try { red = await sb.handleRedirect(); } catch (e) { red = { error: tr(e) }; }
  }
  if (red && red.type === 'recovery') { showAuth('reset'); return; }
  if (sb && sb.session && sb.user) {
    enterApp(userFromSession());
    if (red && (red.type === 'signup' || red.type === 'email')) toast('Email terkonfirmasi. Selamat datang!');
    return;
  }
  if (lsGet(LOCAL_MODE_KEY)) { enterApp({ id: 'local', email: '', name: '', local: true }); return; }
  showAuth('login', red && red.error ? { error: tr({ message: red.error }) } : {});
}
boot();
