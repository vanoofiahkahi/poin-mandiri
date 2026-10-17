# remind+

Ingat ujian, kejar deadline, kumpulkan poin, tukar reward.
Aplikasi web yang bisa dipasang di Android (PWA), dengan akun online yang tersinkron.

Buka: https://vanoofiahkahi.github.io/poin-mandiri/

## Struktur
- `index.html`, `css/app.css`, `js/app.js` — aplikasi
- `js/supa.js` — penghubung akun & database (Supabase), tanpa library eksternal
- `js/config.js` — alamat server akun (Project URL + anon key)
- `sw.js` — offline, cache, pengingat latar belakang
- `supabase/setup.sql` — skrip database (jalankan sekali di Supabase)

## Menyiapkan server akun (sekali saja)
1. Buat project gratis di https://supabase.com (masuk dengan GitHub), region Southeast Asia (Singapore).
2. SQL Editor → New query → tempel isi `supabase/setup.sql` → Run.
3. Authentication → URL Configuration → Site URL: `https://vanoofiahkahi.github.io/poin-mandiri/`
4. Project Settings → API → salin Project URL dan anon public key ke `js/config.js`.

Catatan: project Supabase gratis dijeda otomatis jika tidak dipakai 7 hari. Data tetap aman; aktifkan lagi dari dashboard Supabase.
