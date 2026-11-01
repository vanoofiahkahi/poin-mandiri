// remind+ · Edge Function "parse-schedule"
// Membaca PDF jadwal sekolah dengan AI (Claude) lalu mengembalikan jadwal satu kelas
// dalam bentuk JSON yang dipahami aplikasi. API key disimpan sebagai secret di Supabase,
// tidak pernah dikirim ke aplikasi.
//
// Secret yang dibutuhkan:  ANTHROPIC_API_KEY
// Opsional:                 ANTHROPIC_MODEL   (bawaan: claude-sonnet-5-5)
//                           ALLOWED_EMAILS    (daftar email dipisah koma; kosong = semua akun boleh)

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const MAX_B64 = 12_000_000; // ±9 MB PDF

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });

const TOOL = {
  name: 'jadwal',
  description: 'Kirim jadwal pelajaran mingguan untuk satu kelas yang diminta.',
  input_schema: {
    type: 'object',
    properties: {
      kelas_ditemukan: { type: 'string', description: 'Nama kelas/kolom di PDF yang dipakai, mis. "Y9". Kosong bila tidak ketemu.' },
      catatan: { type: 'string', description: 'Catatan singkat bila ada bagian yang ragu (bahasa Indonesia), atau kosong.' },
      hari: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            hari: { type: 'string', enum: ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'] },
            blok: {
              type: 'array',
              description: 'Semua blok waktu hari itu, urut dari pagi.',
              items: {
                type: 'object',
                properties: {
                  mulai: { type: 'string', description: 'Jam mulai, format HH:MM (24 jam).' },
                  selesai: { type: 'string', description: 'Jam selesai, format HH:MM (24 jam).' },
                  jenis: { type: 'string', enum: ['pelajaran', 'istirahat', 'kegiatan'] },
                  nama: { type: 'string', description: 'Nama mata pelajaran / istirahat / kegiatan.' },
                  guru: { type: 'string', description: 'Kode atau nama guru seperti tertulis di PDF (tanpa kurung), atau kosong.' },
                },
                required: ['mulai', 'selesai', 'jenis', 'nama'],
              },
            },
          },
          required: ['hari', 'blok'],
        },
      },
    },
    required: ['kelas_ditemukan', 'hari'],
  },
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json(405, { error: 'Metode tidak didukung' });

  const key = Deno.env.get('ANTHROPIC_API_KEY');
  if (!key) return json(500, { error: 'API key AI belum dipasang di server (secret ANTHROPIC_API_KEY).' });

  // Hanya akun yang masuk; opsional dibatasi ke email tertentu
  const auth = req.headers.get('Authorization') || '';
  const allowed = (Deno.env.get('ALLOWED_EMAILS') || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (allowed.length) {
    const r = await fetch(`${Deno.env.get('SUPABASE_URL')}/auth/v1/user`, {
      headers: { Authorization: auth, apikey: Deno.env.get('SUPABASE_ANON_KEY') || '' },
    });
    const u = r.ok ? await r.json() : null;
    if (!u || !allowed.includes(String(u.email || '').toLowerCase())) return json(403, { error: 'Akun ini belum diizinkan memakai impor AI.' });
  }

  let body: { pdf?: string; kelas?: string; mapel?: string[] };
  try { body = await req.json(); } catch { return json(400, { error: 'Permintaan tidak valid' }); }
  const pdf = String(body.pdf || '');
  const kelas = String(body.kelas || '').slice(0, 40).trim();
  const mapel = Array.isArray(body.mapel) ? body.mapel.slice(0, 80).map((s) => String(s).slice(0, 120)) : [];
  if (!pdf || !kelas) return json(400, { error: 'PDF dan nama kelas wajib diisi' });
  if (pdf.length > MAX_B64) return json(413, { error: 'PDF terlalu besar (maksimal ±9 MB)' });

  const prompt = `Ini PDF jadwal pelajaran sekolah. Ambil jadwal MINGGUAN hanya untuk kelas "${kelas}" (cocokkan dengan nama kolom/kelas yang paling sesuai, mis. "Y9", "Year 9", "9A").

Aturan:
- Untuk setiap hari Senin–Sabtu yang ada, tulis semua blok waktu kelas itu berurutan dari pagi sampai pulang, dengan jam mulai & selesai yang tertulis di PDF (format HH:MM).
- Bila satu pelajaran menempati beberapa baris jam berturut-turut, tulis sebagai SATU blok dari jam mulai pertama sampai jam selesai terakhir.
- jenis "istirahat": break, istirahat, sholat, makan siang. jenis "kegiatan": upacara, assembly, senam/morning exercise, dan kegiatan lain yang bukan mata pelajaran — KECUALI namanya ada di daftar mapel di bawah, maka jenisnya "pelajaran".
- Kode guru dalam kurung, mis. "(RZ)", tulis di kolom guru tanpa kurung. Jangan masukkan kode guru ke nama.
- Bila nama mapel sama atau mirip dengan daftar mapel yang sudah dipakai siswa berikut, pakai ejaan PERSIS dari daftar ini:
${mapel.length ? mapel.map((m) => '  • ' + m).join('\n') : '  (belum ada)'}
- Jangan mengarang. Bila kelas tidak ditemukan, kosongkan kelas_ditemukan dan hari.
Kirim hasilnya lewat tool "jadwal".`;

  let r: Response;
  try {
    r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({
        model: Deno.env.get('ANTHROPIC_MODEL') || 'claude-sonnet-5-5',
        max_tokens: 8000,
        tools: [TOOL],
        tool_choice: { type: 'tool', name: 'jadwal' },
        messages: [{
          role: 'user',
          content: [
            { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: pdf } },
            { type: 'text', text: prompt },
          ],
        }],
      }),
    });
  } catch {
    return json(502, { error: 'Server AI tidak bisa dihubungi. Coba lagi.' });
  }
  const out = await r.json().catch(() => null);
  if (!r.ok) {
    const msg = out?.error?.message || `Kesalahan AI (${r.status})`;
    return json(502, { error: r.status === 401 ? 'API key AI tidak valid.' : r.status === 429 ? 'AI sedang sibuk atau kuota habis. Coba lagi nanti.' : msg });
  }
  const use = (out?.content || []).find((c: { type: string }) => c.type === 'tool_use');
  if (!use) return json(502, { error: 'AI tidak mengembalikan jadwal. Coba lagi.' });
  return json(200, use.input);
});
