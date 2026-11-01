# Impor jadwal dari PDF (AI)

Fungsi server ini dipakai menu **Jadwal → ⋯ → Impor dari PDF (AI)** di remind+.
Aplikasi mengirim PDF ke fungsi ini, lalu fungsi ini meminta AI Claude membaca jadwal
satu kelas. API key AI disimpan aman di Supabase dan tidak pernah sampai ke aplikasi.

## Yang dibutuhkan

- **API key Anthropic (Claude).** Akun API mensyaratkan usia 18+, jadi minta orang tua
  membuatnya di https://console.anthropic.com → isi saldo di *Billing* → *API Keys* →
  *Create Key*. Biayanya dihitung per pemakaian; satu PDF jadwal biasanya hanya beberapa
  sen dolar (lihat harga terbaru di halaman Pricing Anthropic).
- Akses ke dashboard Supabase project remind+.

## Cara memasang (bisa dari browser tablet)

1. Buka https://supabase.com/dashboard → pilih project remind+.
2. Menu **Edge Functions** → **Deploy a new function** → **Via Editor**.
3. Beri nama fungsi persis: `parse-schedule`.
4. Hapus contoh kode, lalu tempel seluruh isi file `index.ts` di folder ini → **Deploy function**.
   Biarkan pengaturan *Verify JWT* tetap menyala (hanya akun yang masuk yang bisa memakai).
5. Menu **Edge Functions → Secrets** → **Add new secret**:
   - `ANTHROPIC_API_KEY` = API key dari langkah di atas.
   - *(Sangat disarankan bila remind+ dipakai banyak orang)* `ALLOWED_EMAILS` = email akun
     yang boleh memakai fitur ini, dipisah koma. Tanpa ini, semua akun bisa memakai dan
     biayanya ikut ditagihkan ke API key kamu.
   - *(Opsional)* `ANTHROPIC_MODEL` untuk memakai model Claude lain (bawaan: `claude-sonnet-5-5`).
6. Selesai. Di remind+, buka **Jadwal → ⋯ → Impor dari PDF (AI)**, pilih PDF, tulis kelasmu
   (mis. `Y9`), lalu **Baca dengan AI**. Hasilnya bisa diperiksa dulu sebelum disimpan.

## Cara kerja singkat

- Aplikasi mengirim PDF (maks ±9 MB), nama kelas, dan daftar mata pelajaran yang sudah ada.
- AI mengembalikan blok waktu per hari (pelajaran, istirahat, kegiatan) beserta kode guru.
- Aplikasi mengubahnya ke format jadwal remind+ (sesi 35 menit + istirahat), menyamakan nama
  mata pelajaran yang sudah ada, lalu mengulang pola mingguan itu sesuai pilihan (1–16 minggu).
