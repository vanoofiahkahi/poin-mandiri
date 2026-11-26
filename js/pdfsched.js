/* remind+ · pembaca PDF jadwal sekolah (berjalan di perangkat, tanpa server).
   Dibuat untuk format "Regular Program Schedule" DHIS (Excel → Microsoft Print to PDF):
   tabel per hari, kolom per kelas (mis. Y9), kolom jam di kiri, garis batas antar sel.
   Membaca teks (huruf CID + ToUnicode), posisi tiap potongan teks, dan garis tabel,
   lalu menyusun blok jam untuk satu kelas. */
(function () {
  'use strict';
  const latin1 = u8 => { let s = ''; for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000)); return s; };
  async function inflate(u8) {
    for (const fmt of ['deflate', 'deflate-raw']) {
      try { return new Uint8Array(await new Response(new Blob([u8]).stream().pipeThrough(new DecompressionStream(fmt))).arrayBuffer()); } catch (e) {}
    }
    throw new Error('Bagian PDF tidak bisa dibuka');
  }

  /* ---------- tingkat PDF: objek, stream, huruf ---------- */
  async function parseDoc(buf) {
    const u8 = new Uint8Array(buf), src = latin1(u8);
    if (!/^%PDF-/.test(src.slice(0, 1024).replace(/^[^%]*/, ''))) throw new Error('File ini bukan PDF');
    const objs = {};
    const re = /(\d+)\s+0\s+obj\b/g; let m; const starts = [];
    while ((m = re.exec(src))) starts.push([+m[1], m.index + m[0].length]);
    starts.forEach(([n, at]) => { const end = src.indexOf('endobj', at); if (end > 0) objs[n] = { at, end, body: src.slice(at, end) }; });
    const ref = (s, key) => { const r = new RegExp('/' + key + '\\s+(\\d+)\\s+0\\s+R').exec(s); return r ? +r[1] : null; };
    async function stream(n) {
      const o = objs[n]; if (!o) return '';
      const sIdx = o.body.indexOf('stream'); if (sIdx < 0) return '';
      let a = o.at + sIdx + 6; if (src[a] === '\r') a++; if (src[a] === '\n') a++;
      let b = src.indexOf('endstream', a); while (b > a && (src[b - 1] === '\n' || src[b - 1] === '\r')) b--;
      let data = u8.subarray(a, b);
      const head = o.body.slice(0, sIdx);
      if (/\/FlateDecode/.test(head)) data = await inflate(data);
      else if (/\/Filter/.test(head)) throw new Error('Format kompresi PDF ini belum didukung');
      return latin1(data);
    }
    const dictOf = n => (objs[n] ? objs[n].body : '');
    /* daftar halaman berurutan */
    const root = ref((/trailer[\s\S]*$/.exec(src) || [''])[0], 'Root') || Object.keys(objs).find(k => /\/Type\s*\/Catalog/.test(objs[k].body));
    const pages = [];
    const walk = n => {
      const b = dictOf(n);
      if (/\/Type\s*\/Pages\b/.test(b)) { const kids = /\/Kids\s*\[([^\]]*)\]/.exec(b); if (kids) (kids[1].match(/\d+\s+0\s+R/g) || []).forEach(k => walk(parseInt(k, 10))); }
      else if (/\/Type\s*\/Page\b/.test(b)) pages.push(n);
    };
    walk(ref(dictOf(+root), 'Pages'));
    const fontCache = {};
    async function font(n) {
      if (fontCache[n]) return fontCache[n];
      const b = dictOf(n);
      const map = {};
      const tu = ref(b, 'ToUnicode');
      if (tu) {
        const t = await stream(tu);
        const hex = h => { let s = ''; for (let i = 0; i + 4 <= h.length; i += 4) s += String.fromCharCode(parseInt(h.slice(i, i + 4), 16)); return s; };
        (t.match(/beginbfchar([\s\S]*?)endbfchar/g) || []).forEach(blk => { let r; const rr = /<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>/g; while ((r = rr.exec(blk))) map[parseInt(r[1], 16)] = hex(r[2].padStart(4, '0')); });
        (t.match(/beginbfrange([\s\S]*?)endbfrange/g) || []).forEach(blk => { let r; const rr = /<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>/g; while ((r = rr.exec(blk))) { const a = parseInt(r[1], 16), z = parseInt(r[2], 16), s = parseInt(r[3], 16); for (let k = a; k <= z && k - a < 5000; k++) map[k] = String.fromCharCode(s + k - a); } });
      }
      /* lebar huruf (untuk posisi potongan teks) */
      const widths = {}; let dw = 1000;
      const desc = /\/DescendantFonts\s*\[([\s\S]*?)\]\s*(\/|>>)/.exec(b);
      let dd = desc ? desc[1] : '';
      const dref = /^\s*(\d+)\s+0\s+R/.exec(dd); if (dref) dd = dictOf(+dref[1]);
      const dwm = /\/DW\s+(\d+)/.exec(dd); if (dwm) dw = +dwm[1];
      let wsrc = null; const wref = /\/W\s+(\d+)\s+0\s+R/.exec(dd), winl = /\/W\s*\[([\s\S]*?)\]\s*(\/|>>)/.exec(dd);
      if (wref) wsrc = dictOf(+wref[1]).replace(/^[^\[]*\[/, '').replace(/\][^\]]*$/, ''); else if (winl) wsrc = winl[1];
      if (wsrc) {
        const toks = wsrc.match(/\[|\]|-?\d*\.?\d+/g) || []; let i = 0;
        while (i < toks.length) {
          const c1 = +toks[i++];
          if (toks[i] === '[') { i++; let c = c1; while (i < toks.length && toks[i] !== ']') widths[c++] = +toks[i++]; i++; }
          else { const c2 = +toks[i++], w = +toks[i++]; for (let c = c1; c <= c2 && c - c1 < 5000; c++) widths[c] = w; }
        }
      }
      return (fontCache[n] = { map, widths, dw, two: /Identity-H|Type0/.test(b) });
    }
    return { pages, dictOf, stream, font, ref };
  }

  /* ---------- isi halaman: potongan teks + garis ---------- */
  async function readPage(doc, pn) {
    const pb = doc.dictOf(pn);
    let contents = [];
    const cArr = /\/Contents\s*\[([^\]]*)\]/.exec(pb), cOne = /\/Contents\s+(\d+)\s+0\s+R/.exec(pb);
    if (cArr) contents = (cArr[1].match(/\d+\s+0\s+R/g) || []).map(x => parseInt(x, 10));
    else if (cOne) {
      /* /Contents bisa menunjuk ke objek berisi daftar stream (mis. PDF dari Chrome/Google Sheets) */
      const arr = /^\s*\[([^\]]*)\]\s*$/.exec(doc.dictOf(+cOne[1]));
      contents = arr ? (arr[1].match(/\d+\s+0\s+R/g) || []).map(x => parseInt(x, 10)) : [+cOne[1]];
    }
    let res = pb; const rRef = /\/Resources\s+(\d+)\s+0\s+R/.exec(pb); if (rRef) res = doc.dictOf(+rRef[1]);
    const fdict = /\/Font\s*<<([\s\S]*?)>>/.exec(res);
    const fonts = {};
    if (fdict) { let r; const rr = /\/([^\s\/]+)\s+(\d+)\s+0\s+R/g; while ((r = rr.exec(fdict[1]))) fonts[r[1]] = await doc.font(+r[2]); }
    let t = ''; for (const c of contents) t += (await doc.stream(c)) + '\n';
    const toks = t.match(/\[(?:<[^>]*>|\((?:\\.|[^\\)])*\)|[^\]])*\]|<[0-9A-Fa-f\s]*>|\((?:\\.|[^\\)])*\)|\/[^\s\/\[\]<>()]+|-?\d*\.?\d+|[A-Za-z'"\*]+/g) || [];
    const runs = [], rects = [];
    /* Koordinat: semua posisi dibawa lewat matriks (cm, q/Q, Tm, Td) ke halaman, lalu dibalik jadi
       atas→bawah dan dibagi 0,75 (satuan "piksel" 96 dpi). Untuk PDF dari Microsoft Print to PDF hasilnya
       persis sama dengan koordinat mentahnya, jadi semua ambang jarak di bawah tetap berlaku. */
    const mb = /\/MediaBox\s*\[\s*(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)/.exec(pb) || /\/MediaBox\s*\[\s*(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)/.exec(doc.dictOf(doc.ref(pb, 'Parent') || 0)) || [0, 0, 0, 612, 792];
    const PH = +mb[4], K = 0.75;
    const mul = (m, n) => [m[0] * n[0] + m[1] * n[2], m[0] * n[1] + m[1] * n[3], m[2] * n[0] + m[3] * n[2], m[2] * n[1] + m[3] * n[3], m[4] * n[0] + m[5] * n[2] + n[4], m[4] * n[1] + m[5] * n[3] + n[5]];
    const pt = (m, x, y) => [(x * m[0] + y * m[2] + m[4]) / K, (PH - (x * m[1] + y * m[3] + m[5])) / K];
    let ctm = [1, 0, 0, 1, 0, 0], gstack = [];
    let st = [], sub = [], cur = [], f = null, fs = 10, tm = [1, 0, 0, 1, 0, 0], lm = [1, 0, 0, 1, 0, 0], lastShow = null;
    const flushPath = (fill, stroke) => {
      if (sub.length) { cur.push(sub); sub = []; }
      /* garis tabel yang digambar sebagai garis (stroke), bukan kotak tipis: tiap ruas jadi "garis" */
      if (stroke) cur.forEach(sp => { for (let i = 1; i < sp.length; i++) { const a = pt(ctm, sp[i - 1][0], sp[i - 1][1]), b = pt(ctm, sp[i][0], sp[i][1]); rects.push([Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[0], b[0]), Math.max(a[1], b[1])]); } });
      if (fill) cur.forEach(sp => { const ps = sp.map(p => pt(ctm, p[0], p[1])), xs = ps.map(p => p[0]), ys = ps.map(p => p[1]); rects.push([Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]); });
      cur = [];
    };
    const show = arr => {
      const font = f || { map: {}, widths: {}, dw: 1000, two: true };
      const M = mul(tm, ctm), efs = fs * Math.hypot(M[2], M[3]) / K; // ukuran huruf di halaman
      let x = 0, seg = { x: 0, s: '' };
      const end = () => {
        if (!seg.s.trim()) return;
        const a = pt(M, seg.x, 0), b = pt(M, x, 0), r = { x: Math.min(a[0], b[0]), x2: Math.max(a[0], b[0]), y: a[1], t: seg.s, fs: efs };
        /* PDF yang menulis satu huruf per perintah (mis. Chrome/Google Sheets): sambung jadi kata */
        /* (disambung nanti, setelah garis tabel diketahui, supaya tidak menyambung lewat batas sel) */
        const L = lastShow && runs[runs.length - 1] === lastShow ? lastShow : null;
        if (L && Math.abs(L.y - r.y) < 0.3 * efs && r.x >= L.x2 - 0.3 * efs && r.x - L.x2 < 0.8 * efs) r.join = true;
        runs.push(r); lastShow = r;
      };
      const items = typeof arr === 'string' ? [arr] : arr;
      items.forEach(it => {
        if (typeof it === 'number') { const d = -it / 1000 * fs; if (it < -800) { end(); x += d; seg = { x, s: '' }; } else x += d; return; }
        if (it[0] === '<') {
          const h = it.slice(1, -1).replace(/\s+/g, ''), step = font.two ? 4 : 2;
          for (let i = 0; i + step <= h.length; i += step) { const code = parseInt(h.slice(i, i + step), 16); seg.s += font.map[code] != null ? font.map[code] : String.fromCharCode(code); x += (font.widths[code] != null ? font.widths[code] : font.dw) / 1000 * fs; }
        } else if (it[0] === '(') {
          const s = it.slice(1, -1).replace(/\\([\\()])/g, '$1');
          for (const ch of s) { const code = ch.charCodeAt(0); seg.s += font.map[code] != null ? font.map[code] : ch; x += (font.widths[code] != null ? font.widths[code] : 500) / 1000 * fs; }
        }
      });
      if (seg.s.trim()) end(); else if (!seg.s && lastShow) { /* spasi saja: biarkan kata berikutnya tersambung */ }
      tm = [tm[0], tm[1], tm[2], tm[3], x * tm[0] + tm[4], x * tm[1] + tm[5]];
    };
    for (const tk of toks) {
      const c0 = tk[0];
      if (c0 === '[' || c0 === '<' || c0 === '(' || c0 === '/' || c0 === '-' || c0 === '.' || (c0 >= '0' && c0 <= '9')) { st.push(tk); continue; }
      const n = i => +st[st.length - i];
      switch (tk) {
        case 'q': gstack.push(ctm); break;
        case 'Q': if (gstack.length) ctm = gstack.pop(); break;
        case 'cm': ctm = mul([n(6), n(5), n(4), n(3), n(2), n(1)], ctm); break;
        case 'm': if (sub.length) cur.push(sub); sub = [[n(2), n(1)]]; break;
        case 'l': sub.push([n(2), n(1)]); break;
        case 're': { const x = n(4), y = n(3), w = n(2), h = n(1); if (sub.length) cur.push(sub); cur.push([[x, y], [x + w, y + h]]); sub = []; break; }
        case 'h': if (sub.length) { cur.push(sub); sub = []; } break;
        case 'f': case 'f*': case 'F': case 'B': case 'B*': flushPath(true); break;
        case 'S': case 's': flushPath(false, true); break;
        case 'n': flushPath(false); break;
        case 'BT': tm = lm = [1, 0, 0, 1, 0, 0]; break;
        case 'Tf': f = fonts[String(st[st.length - 2]).slice(1)] || null; fs = Math.abs(n(1)) || fs; break;
        case 'Tm': tm = lm = [n(6), n(5), n(4), n(3), n(2), n(1)]; break;
        case 'Td': case 'TD': lm = mul([1, 0, 0, 1, n(2), n(1)], lm); tm = lm; break;
        case 'T*': break;
        case 'TJ': { const a = st[st.length - 1] || '[]'; const parts = a.slice(1, -1).match(/<[^>]*>|\((?:\\.|[^\\)])*\)|-?\d*\.?\d+/g) || []; show(parts.map(p => (p[0] === '<' || p[0] === '(') ? p : +p)); break; }
        case 'Tj': case "'": show(st[st.length - 1] || ''); break;
      }
      st = [];
    }
    /* sambung huruf/kata yang berurutan jadi satu potongan teks, kecuali ada garis tegak tabel di antaranya */
    const vl = rects.filter(q => q[2] - q[0] < 1.6 && q[3] - q[1] > 1);
    const out = [];
    runs.forEach(r => {
      const L = out[out.length - 1];
      if (r.join && L && !vl.some(q => q[0] >= L.x2 - 0.25 * r.fs && q[2] <= r.x + 0.25 * r.fs && q[1] < r.y && q[3] > r.y - 0.5 * r.fs)) {
        L.t += (r.x - L.x2 > 0.12 * r.fs && !/\s$/.test(L.t) ? ' ' : '') + r.t; L.x2 = r.x2;
      } else { delete r.join; out.push(r); }
    });
    return { runs: out, rects };
  }

  /* ---------- susun jadwal satu kelas ---------- */
  /* nama hari saja ("Monday"), atau di awal judul bertanggal ("Monday, 30 November 2026 (Lower Secondary)") */
  const DAYS = [/^(monday|senin)\b/i, /^(tuesday|selasa)\b/i, /^(wednesday|rabu)\b/i, /^(thursday|kamis)\b/i, /^(friday|jumat|jum'at)\b/i, /^(saturday|sabtu)\b/i];
  const isDay = t => DAYS.some(re => re.test(t)) && (t.length <= 9 || /^[a-z']+\s*,/i.test(t));
  const MON = ['jan', 'feb', 'mar', 'apr', 'ma[yi]', 'jun', 'jul', 'a[uv]g', 'sep', 'o[ck]t', 'nov', 'de[cs]'];
  const dateOf = t => {
    const m = /(\d{1,2})\s+([a-z]+)\s+(\d{4})/i.exec(t); if (!m) return null;
    const mi = MON.findIndex(x => new RegExp('^' + x, 'i').test(m[2])); if (mi < 0) return null;
    return m[3] + '-' + String(mi + 1).padStart(2, '0') + '-' + String(+m[1]).padStart(2, '0');
  };
  /* "Year 9" di jadwal ujian = kelas "Y9" di jadwal biasa */
  const canon = t => t.toUpperCase().replace(/^YEAR\s*(\d{1,2})$/, 'Y$1');
  const TIME = /^(\d{1,2})[.:](\d{2})\s*[-–]\s*(\d{1,2})[.:](\d{2})$/;
  const norm = s => String(s || '').replace(/\s+/g, ' ').trim();
  const cx = r => (r.x + r.x2) / 2;
  function schedule(pages, kelas) {
    const want = norm(kelas).toUpperCase().replace(/^YEAR\s*/, 'Y');
    const days = {}, dates = {}, classes = new Set();
    pages.forEach(pg => {
      const runs = pg.runs.map(r => Object.assign({}, r, { t: norm(r.t) })).filter(r => r.t);
      const sub = new Set(runs.filter(r => /^\d{1,2}[A-Z]$/.test(r.t)).map(r => r.t.replace(/\D/g, '')));
      runs.forEach(r => {
        if (/^(Y\d{1,2}|\d{1,2}[A-Z])$/.test(r.t)) classes.add(r.t);
        else if (/^year\s*\d{1,2}$/i.test(r.t) && !sub.has(r.t.replace(/\D/g, ''))) classes.add(canon(r.t)); // "Year 9" tanpa 9A/9B
      });
      let heads = runs.filter(r => r.t.toUpperCase() === want);
      if (!heads.length) heads = runs.filter(r => canon(r.t) === want);
      heads.sort((a, b) => a.y - b.y);
      heads.forEach((H, hi) => {
        /* hari: judul hari terdekat di atas kepala kolom */
        const dayRun = runs.filter(r => r.y < H.y && H.y - r.y < 80 && isDay(r.t)).sort((a, b) => (H.y - a.y) + Math.abs(cx(a) - cx(H)) / 20 - ((H.y - b.y) + Math.abs(cx(b) - cx(H)) / 20))[0];
        if (!dayRun) return;
        const di = DAYS.findIndex(re => re.test(dayRun.t));
        /* batas kolom dari tetangga kiri/kanan di baris kepala */
        const row = runs.filter(r => Math.abs(r.y - H.y) < 3 && r !== H);
        const L = row.filter(r => r.x2 <= H.x + 1).sort((a, b) => b.x2 - a.x2)[0];
        const R = row.filter(r => r.x >= H.x2 - 1).sort((a, b) => a.x - b.x)[0];
        let colL = L ? L.x2 + 1 : H.x - 60, colR = R ? R.x - 1 : H.x2 + 60;
        const mid = cx(H);
        const yEnd = heads[hi + 1] ? heads[hi + 1].y - 20 : Infinity;
        /* kolom jam milik kelas ini: kolom jam terdekat di kiri kepala kolom */
        const tAll = runs.filter(r => TIME.test(r.t) && r.y > H.y && r.y < yEnd && cx(r) < mid);
        let tx0 = -Infinity; tAll.forEach(r => { if (cx(r) > tx0) tx0 = cx(r); });
        const tCol = tAll.filter(r => Math.abs(cx(r) - tx0) < Math.max(6, r.fs * 2));
        if (tCol.length) colL = Math.max(colL, Math.max(...tCol.map(r => r.x2)) + 1);
        const times = tCol
          .map(r => { const m = TIME.exec(r.t); return { y: r.y, a: (+m[1]) * 60 + (+m[2]), z: (+m[3]) * 60 + (+m[4]) }; })
          .sort((a, b) => a.y - b.y);
        const tr = []; times.forEach(t => { if (!tr.length || t.y - tr[tr.length - 1].y > 2) tr.push(t); });
        if (!tr.length) return;
        /* garis batas mendatar yang memotong kolom */
        const lines = pg.rects.filter(q => q[3] - q[1] < 1.6 && q[2] - q[0] > 8 && q[0] < mid && q[2] > mid && q[1] > H.y && q[1] < yEnd)
          .map(q => (q[1] + q[3]) / 2).sort((a, b) => a - b);
        const bl = []; lines.forEach(y => { if (!bl.length || y - bl[bl.length - 1] > 1.5) bl.push(y); });
        /* baris pertama di bawah kepala kolom juga dihitung walau garisnya tertutup sel gabungan */
        if (!bl.length || bl[0] > tr[0].y - 1) bl.unshift(Math.min(H.y + 1, tr[0].y - 1));
        const lastY = tr[tr.length - 1].y + 6;
        if (!bl.length || bl[bl.length - 1] < lastY) bl.push(lastY);
        /* batas kolom yang lebih tepat: garis tegak tabel terdekat di kiri & kanan */
        const vlines = pg.rects.filter(q => q[2] - q[0] < 1.6 && q[3] - q[1] > 3);
        const vx = vlines.filter(q => q[1] < (isFinite(yEnd) ? yEnd : 1e9) && q[3] > tr[0].y - 6).map(q => (q[0] + q[2]) / 2);
        const vL = Math.max(-Infinity, ...vx.filter(x => x < mid - 2)), vR = Math.min(Infinity, ...vx.filter(x => x > mid + 2));
        const cL = isFinite(vL) && vL > colL - 12 ? vL : colL, cR = isFinite(vR) && vR < colR + 40 ? vR : colR;
        const textIn = (y0, y1) => runs.filter(r => r.y > y0 && r.y <= y1 + 0.5 && cx(r) > cL && cx(r) < cR && !TIME.test(r.t) && r !== H).sort((a, b) => a.y - b.y || a.x - b.x).map(r => r.t).join(' ');
        /* sel gabungan selebar beberapa kelas: teksnya di luar kolom, tapi tidak ada garis tegak di antaranya */
        const blocked = (xa, xb, y) => vlines.some(q => q[0] > Math.min(xa, xb) && q[2] < Math.max(xa, xb) && q[1] < y && q[3] > y - 3);
        const mergedText = (y0, y1) => {
          const cand = runs.filter(r => r.y > y0 && r.y <= y1 + 0.5 && (cx(r) <= cL || cx(r) >= cR) && !TIME.test(r.t) && !/^\d{1,2}$/.test(r.t) && !blocked(mid, cx(r), r.y));
          return cand.sort((a, b) => a.y - b.y || a.x - b.x).map(r => r.t).join(' ');
        };
        const cells = [];
        for (let i = 0; i < bl.length - 1; i++) {
          const y0 = bl[i], y1 = bl[i + 1];
          const rows = tr.filter(t => t.y > y0 && t.y <= y1 + 0.5);
          if (!rows.length) continue;
          cells.push({ a: rows[0].a, z: rows[rows.length - 1].z, text: norm(textIn(y0, y1) || mergedText(y0, y1)) });
        }
        if (cells.length) { days[di] = cells; const dt = dateOf(dayRun.t); if (dt) dates[di] = dt; }
      });
    });
    /* jadwal ujian (mis. "End-of-Semester Assessment (ASAS)"): mata pelajarannya jadi daftar ujian */
    const EX = /\b(assessment|asas|asts|ujian|exams?|examination|sumatif|PAS|PAT|UTS|UAS|STS|SAS)\b/i;
    const exam = pages.some(pg => pg.runs.some(r => EX.test(r.t) && r.t.length < 90));
    return { days, dates, exam, classes: [...classes].sort((a, b) => a.localeCompare(b, undefined, { numeric: true })) };
  }

  async function read(buf, kelas) {
    const doc = await parseDoc(buf);
    if (!doc.pages.length) throw new Error('PDF tidak berisi halaman');
    const pages = [];
    for (const pn of doc.pages) pages.push(await readPage(doc, pn));
    return schedule(pages, kelas);
  }
  const api = { read, parseDoc, readPage, schedule };
  (typeof self !== 'undefined' ? self : window).RemindPDF = api;
})();
