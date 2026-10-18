# Changelog remind+

Semua perubahan penting pada remind+ (dulu Poin Mandiri), dari yang terbaru.

## 3.4.0 — 18 Oktober 2026
### Mode libur
- Atur → **Mode libur**: catat libur semester atau hari raya (nama + tanggal mulai–selesai), bisa direncanakan jauh hari.
- Selama libur, pengingat pelajaran, pertanyaan PR, tagihan uang kas, dan pengingat kategori Sekolah berhenti. Ujian, tugas, acara, dan pengingat pribadi tetap jalan.
- Streak tidak putus selama libur. Widget jadwal menampilkan sisa hari libur, dan hari libur ditandai di Jadwal.

### Hitung mundur
- Kartu **Hitung mundur** di Beranda: ujian, acara sekolah, awal/akhir libur, dan hitung mundur buatan sendiri (misalnya study tour) dengan pilihan warna.

### Bagikan jadwal lewat QR
- Tombol QR di Jadwal membuat QR code dan link untuk minggu ini, minggu depan, atau 2 minggu, bisa termasuk jadwal ujian.
- Teman cukup memindai QR dengan kamera HP. remind+ terbuka dan menampilkan jadwalnya, lalu bisa diterima ke hari yang masih kosong atau menimpa semua. Mata pelajaran dan guru yang belum ada ikut ditambahkan.
- Bisa juga lewat Jadwal → ⋯ → Terima jadwal teman (pindai kamera bila didukung browser, atau tempel link).
- Pembuat QR ditulis sendiri untuk remind+, tanpa library luar.

## Android build 4 — 18 Oktober 2026
- Tombol Bagikan link memakai lembar bagikan Android.
- Izin kamera untuk memindai QR jadwal di dalam aplikasi.

## 3.3.0 — 18 Oktober 2026
### Panduan untuk pengguna baru
- Saat pertama kali masuk, muncul panduan singkat 7 langkah (bisa digeser) tentang poin, tugas, ujian, jadwal, pengingat, dan kas, lengkap dengan tombol izinkan notifikasi.
- Kartu **Mulai di sini** di Beranda: daftar 6 langkah pertama (notifikasi, foto profil, jadwal, tugas, ujian, timer) yang tercentang otomatis dan langsung membuka menu terkait.
- Panduan bisa dibuka lagi dari Atur → Tentang → Lihat panduan.

## 3.2.0 — 18 Oktober 2026
### Acara sekolah di Pengingat
- Kategori baru **Acara sekolah** di samping Sekolah dan Pribadi, lengkap dengan tab filternya.
- Contoh siap pakai: upacara bendera, class meeting, pentas seni, study tour, lomba, rapat orang tua, pembagian rapor, peringatan hari besar, libur sekolah.
- Acara satu kali bisa diberi tanggal **Sampai** untuk acara beberapa hari (mis. 22–24 Okt).

## 3.1.2 — 18 Oktober 2026
### Saran mata pelajaran ber-liquid glass
- Daftar saran mata pelajaran di Ujian dan Belajar kini berupa popover kaca dengan titik warna mapel dan nama guru, menggantikan daftar abu-abu bawaan Android.
- Saran tersaring sambil mengetik dan keyboard tidak tertutup saat memilih.

## Android build 3 — 18 Oktober 2026
### Widget di layar kunci
- Widget **Jadwal berikutnya** kini juga boleh dipasang di layar kunci, di perangkat yang mendukung widget layar kunci dari aplikasi lain.

## 3.1.1 — 18 Oktober 2026
### Animasi lebih lancar di aplikasi Android
- **Mode lancar** (default di aplikasi Android): latar aurora dibuat diam dan efek kaca diringankan, karena latar yang bergerak membuat kaca buram digambar ulang terus-menerus.
- Bisa dinyalakan/dimatikan di Atur → Tampilan.
- Aplikasi Android memakai akselerasi GPU dan pra-render agar animasi dan gulir lebih mulus.

## 3.1.0 — 18 Oktober 2026
### Aplikasi Android dengan widget layar utama
- remind+ kini tersedia sebagai aplikasi Android (APK) di halaman Releases GitHub.
- Widget layar utama **Jadwal berikutnya**: pelajaran sekarang dengan progres dan sisa waktu; setelah lewat setengah jalan, pelajaran berikutnya ikut tampil.
- Widget memperbarui dirinya sendiri di tiap pergantian pelajaran, walau aplikasi ditutup. Ketuk widget untuk membuka Jadwal.
- Pengingat dan alarm dijadwalkan langsung oleh Android, jadi tetap berbunyi walau aplikasi ditutup atau tablet baru dinyalakan ulang.
- Tombol unduh aplikasi Android di Atur → Tentang.

## 3.0.0 — 18 Oktober 2026
### Widget jadwal berikutnya
- Kartu baru di paling atas Beranda: pelajaran yang sedang berlangsung, lengkap dengan guru, catatan, dan sisa waktunya.
- Setelah pelajaran lewat setengah jalan, pelajaran berikutnya ikut tampil di bawahnya.
- Saat istirahat tampil "sampai jam …" dan pelajaran berikutnya; sebelum sekolah tampil pelajaran pertama; setelah sekolah tampil hari sekolah berikutnya.

### Rencana belajar ujian
- Tombol **Rencana** di tiap ujian: tulis bab atau topik, lalu remind+ membaginya ke hari-hari sebelum ujian.
- Hitung mundur H-n dan progres topik di daftar ujian.
- Kartu **Rencana belajar hari ini** di Beranda; tiap topik selesai +5 poin.

### PR dari jadwal
- Setelah pelajaran selesai, remind+ bertanya "Ada PR?" dengan pilihan pelajaran hari itu.
- Deadline PR otomatis diisi dengan pelajaran yang sama berikutnya di jadwal.

### Catatan pelajaran
- Tambahkan catatan di tiap pelajaran (mis. bawa kalkulator); tampil di jadwal dan di widget.

### Ringkasan mingguan
- Tiap Minggu sore dan Senin muncul ringkasan minggu: poin, waktu belajar, tugas, dan ujian minggu depan.
- Ringkasan lengkap (belajar per mata pelajaran, hari terbaik) bisa dibuka kapan saja dari Riwayat.

### Pencapaian
- 19 lencana, dari "Langkah pertama" sampai "Sebulan konsisten", di Atur → Pencapaian dan di kartu level Beranda.

### Pembeku streak
- Lindungi streak dengan 50 poin di hari kamu tidak sempat belajar (maksimal 2 kali per minggu).

### Pelacak nilai (opsional)
- Aktifkan nilai per mata pelajaran lewat tombol **Nilai** di daftar mata pelajaran & guru.
- Tab **Nilai** di menu Ujian: rata-rata, tren naik/turun, dan grafik kecil tiap mapel.
- Ujian yang sudah lewat bisa langsung diisi nilainya.

## 2.12.0 — 18 Oktober 2026
### 🥚 Rahasia
- Ada kejutan tersembunyi di Atur → Tentang. Petunjuk: logonya suka disentuh.

## 2.11.1 — 18 Oktober 2026
### Update lebih cepat masuk
- Aplikasi selalu mengecek versi terbaru ke server, tidak lagi memakai salinan lama hingga 10 menit.
- Saat versi baru siap, muncul tombol **Muat ulang** untuk langsung memakainya.

## 2.11.0 — 18 Oktober 2026
### Pengaturan dipisah per bagian
- Halaman Atur kini berupa menu ringkas: kartu profil dan 5 bagian (Tampilan, Pengingat & alarm, Poin & level, Data & cadangan, Tentang).
- Tiap bagian terbuka di halamannya sendiri dengan tombol kembali, dan isinya meluncur masuk dengan animasi liquid glass.
- Tiap baris menu menampilkan ringkasan pengaturannya (mis. tema dan bahasa yang dipakai).
- Ketuk kartu profil untuk foto, nama, password, sinkron, keluar, dan hapus akun.
- Ketuk Atur di menu bawah untuk kembali ke menu pengaturan dari bagian mana pun.

## 2.10.0 — 18 Oktober 2026
### Ujian terhubung dengan jadwal
- Ujian tampil langsung di Jadwal pada tanggal dan jamnya.
- Ujian yang jamnya jatuh di dalam satu pelajaran menempel ke pelajaran itu, dengan tanda **Ujian** berwarna oranye.
- Ujian di luar jam pelajaran tampil sebagai baris sendiri.
- Titik oranye di deretan tanggal menandai hari yang ada ujiannya.
- Tombol **Jadikan ujian** pada pelajaran langsung membuat ujian di tanggal dan jam itu, lengkap dengan pengingat belajar.
- Di menu Ujian, pilih pelajaran **dari jadwal** untuk mengisi nama dan jam ujian otomatis.
- Tombol kalender di tiap ujian membuka jadwal di tanggal ujian itu.
- Kartu jadwal di Beranda menandai pelajaran yang ada ujiannya.

## 2.9.0 — 18 Oktober 2026
### Foto profil
- Foto profil sekarang bisa diganti dari Atur: ketuk foto di kartu paling atas.
- Pilih foto dari galeri, lalu geser dan zoom untuk mengatur bagian yang dipakai.
- Atau pilih salah satu dari 24 emoji dengan 8 pilihan warna latar.
- "Pakai inisial" mengembalikan huruf depan nama seperti semula.
- Foto disimpan kecil (256 piksel) dan ikut tersinkron di akun.

## 2.8.1 — 18 Oktober 2026
### Jadwal: liquid glass & tampilan ringkas
- Sorotan kaca meluncur dan memantul saat pindah tanggal, seperti menu bawah.
- Isi hari bergeser masuk dengan efek buram, tanpa memuat ulang halaman.
- Geser jari ke kiri/kanan di area jadwal untuk pindah hari.
- Baris pelajaran lebih bersih; ketuk satu pelajaran untuk membuka tombol ubah.
- Istirahat tampil sebagai garis tipis, bukan kotak.
- Mata pelajaran & guru serta pengaturan jadwal pindah ke ikon di pojok kanan atas.
- Menu ⋯ berisi salin dari hari lain, salin minggu lalu, dan kosongkan hari.

## 2.8.0 — 18 Oktober 2026
### Jadwal pelajaran
- Menu baru **Jadwal**: jadwal diisi per tanggal karena berubah tiap minggu.
- Mata pelajaran dan guru Year 9 sudah terisi dari jadwal sekolah.
- Jam mulai berbeda tiap hari; 1 sesi = 35 menit, jam pelajaran dihitung otomatis.
- Istirahat dengan durasi bebas.
- Salin jadwal dari hari yang sama minggu lalu atau dari hari mana pun.
- Kartu jadwal hari ini (sekarang & berikutnya) di Beranda.
- Saran nama mata pelajaran di Ujian dan Belajar.
- Pengingat sebelum pelajaran (opsional, notifikasi biasa).
- Label "Jadwal" di Kas menjadi "Jadwal bayar".

## 2.7.0 — 18 Oktober 2026
### Sistem reward dihapus
- Menu Reward, reward tetap, dan kurs poin ke Rupiah dihapus.
- Poin, saldo, level, streak, riwayat, dan koreksi poin tetap utuh.
- Tombol Beranda menjadi "Tambah tugas" dan "Mulai belajar".
- Riwayat penukaran lama tetap tersimpan.

## 2.6.0 — 18 Oktober 2026
### Bahasa Inggris
- Pilihan bahasa di Atur → Tampilan → Bahasa / Language.
- Tombol EN / ID di layar masuk.
- Semua layar, notifikasi, dan alarm ikut diterjemahkan; format tanggal & angka menyesuaikan.
- Riwayat lama diterjemahkan saat ditampilkan.
- Perbaikan: tulisan "Setiap Setiap hari" dan tombol tema yang tertutup kartu di layar masuk (HP).

## 2.5.0 — 17 Oktober 2026
### Menu Pengingat
- Pengingat non-akademik: kategori Sekolah dan Pribadi.
- Contoh siap pakai (bawa baju olahraga, piket, ulang tahun teman, dll.).
- Berulang: sekali, harian, mingguan, bulanan, tahunan.
- Hanya notifikasi biasa (getar), tanpa sirene, agar beda dari alarm akademik.

## 2.4.0 — 17 Oktober 2026
### Pemilih kaca
- Dropdown, kalender, dan pemilih jam dibuat ulang dengan gaya kaca agar senada dengan desain.

## 2.3.0 — 17 Oktober 2026
### Dukungan iPhone/iPad
- Tombol "Pengingat iPhone" menyimpan pengingat ke Kalender (file .ics), karena Safari tidak bisa membuat alarm.
- Petunjuk memasang remind+ ke Layar Utama di iPhone/iPad.

## 2.2.0 — 17 Oktober 2026
### Liquid glass
- Kartu, menu, dialog, dan notifikasi transparan dengan latar buram.
- Latar aurora yang bergerak pelan.
- Sorotan menu cair dan animasi pegas di seluruh aplikasi.
- Angka +poin melayang, saldo menghitung naik, ganti tema dengan lingkaran meluas.
- Efek kaca dan animasi bisa dimatikan di Atur.

## 2.1.0 — 17 Oktober 2026
### Menu Kas
- Pengingat bayar uang kas: mingguan, harian (hari sekolah), atau bulanan.
- Catat tunggakan, bayar semua sekaligus, dan bonus poin bayar tepat waktu.
- Pengingat di hari bayar dan malam sebelumnya.

## 2.0.0 — 17 Oktober 2026
### Poin Mandiri menjadi remind+
- Nama, logo, dan desain baru dengan mode terang/gelap.
- Akun online (daftar, masuk, lupa password, hapus akun) lewat server Supabase.
- Data tersinkron di semua perangkat; data lama Poin Mandiri bisa dipindahkan ke akun.
- Mode tanpa akun tetap tersedia.

## 1.2.0 — 17 Oktober 2026
### Alarm darurat
- Alarm layar penuh dengan sirene dan getar untuk pengingat penting.
- Tombol "Alarm HP" untuk memasang alarm di aplikasi Jam Android.
- Notifikasi prioritas tinggi.

## 1.1.0 — 17 Oktober 2026
### Ujian & deadline
- Menu Ujian dengan pengingat belajar malam sebelum ujian dan bonus poin.
- Deadline tugas, pengingat sebelum deadline, dan potongan poin jika terlambat.

## 1.0.0 — 17 Oktober 2026
### Poin Mandiri
- Rilis pertama sebagai aplikasi web yang bisa dipasang di tablet.
- Tugas dengan tingkat kesulitan sendiri, poin saat selesai.
- Timer belajar dan catat belajar manual.
- Level, riwayat poin, dan koreksi poin.
- Reward tetap dan penukaran poin dengan kurs Rupiah.
- Cadangan dan pulihkan data.
