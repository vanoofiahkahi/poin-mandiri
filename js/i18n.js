/* remind+ — bahasa / language
   Teks sumber ditulis dalam Bahasa Indonesia. Saat bahasa Inggris dipilih:
   - teks statis di layar diterjemahkan otomatis lewat kamus EN (dicocokkan persis),
   - teks dinamis memakai tx('…') atau T`… ${x} …` (kunci memakai {0}, {1}, …). */
'use strict';
(function () {
  const KEY = 'remindplus:lang';
  let L = 'id';
  try { L = localStorage.getItem(KEY) === 'en' ? 'en' : 'id'; } catch (e) {}
  const s = n => (n == 1 ? '' : 's');

  const EN = {
    /* ---------- umum ---------- */
    'Ya': 'Yes', 'Batal': 'Cancel', 'Batalkan': 'Undo', 'Dibatalkan': 'Undone', 'Simpan': 'Save', 'Hapus': 'Delete', 'Ubah': 'Edit',
    'Tambah': 'Add', 'Lihat': 'View', 'Mengerti': 'Got it', 'Lanjutkan': 'Continue', 'Lewati': 'Skip', 'Semua': 'All', 'Selesai': 'Done',
    'Mulai': 'Start', 'Lanjut': 'Resume', 'Jeda': 'Pause', 'Reset': 'Reset', 'Tukar': 'Redeem', 'Impor': 'Import', 'Pulihkan': 'Restore',
    'Pindahkan': 'Move', 'Akhiri': 'End', 'Terapkan': 'Apply', 'Izinkan': 'Allow', 'Buka': 'Open', 'Matikan': 'Turn off',
    'Tunda 10 menit': 'Snooze 10 min', 'Ditunda 10 menit': 'Snoozed for 10 minutes', 'Kamu': 'You', 'Opsional': 'Optional',
    'Besok': 'Tomorrow', 'besok': 'tomorrow', 'Hari ini': 'Today', 'hari ini': 'today', 'Nanti': 'Later', 'lewat': 'passed',
    'Terlambat': 'Late', 'Terlewat': 'Missed', 'Sudah lewat': 'Passed', 'Tanpa deadline': 'No deadline', 'Deadline': 'Deadline',
    'Kalender': 'Calendar', 'Alarm HP': 'Phone alarm', 'Pengingat iPhone': 'iPhone reminder',
    'Pasang alarm di aplikasi Jam': 'Set an alarm in the Clock app', 'Simpan ke Google Kalender': 'Save to Google Calendar',
    'Simpan pengingat ke Kalender iPhone': 'Save reminder to iPhone Calendar', 'Buka file lalu ketuk "Tambahkan ke Kalender"': 'Open the file, then tap "Add to Calendar"',
    'Dari remind+': 'From remind+', 'Pengingat dari remind+': 'Reminder from remind+', 'Tandai selesai': 'Mark as done', 'Tampilkan password': 'Show password',
    'Bulan sebelumnya': 'Previous month', 'Bulan berikutnya': 'Next month', 'Jam': 'Time', 'Menit': 'Minute', 'Hari': 'Days',
    'Pilih jam': 'Pick a time', 'Pilih tanggal': 'Pick a date', 'Pilih tanggal & jam': 'Pick date & time', 'Mode terang': 'Light mode', 'Mode gelap': 'Dark mode',
    'Sen–Jum': 'Mon–Fri', 'Setiap hari': 'Every day', 'Tiap': 'Every', 'HAPUS': 'DELETE', 'Akun': 'Account',

    /* ---------- sinkron & galat ---------- */
    'Mode lokal · di perangkat ini': 'Local mode · on this device', 'Menyimpan…': 'Saving…', 'Menyinkronkan…': 'Syncing…', 'Memproses…': 'Working…',
    'Offline · disimpan di perangkat': 'Offline · saved on device', 'Tersinkron · {0}': 'Synced · {0}', 'Gagal sinkron: {0}': 'Sync failed: {0}',
    'Email atau password salah.': 'Wrong email or password.', 'Email belum dikonfirmasi. Buka email Anda dan ketuk tautan konfirmasi.': 'Email not confirmed yet. Open your email and tap the confirmation link.',
    'Email ini sudah terdaftar. Silakan masuk.': 'This email is already registered. Please sign in.', 'Password terlalu lemah. Minimal 6 karakter.': 'Password is too weak. At least 6 characters.',
    'Format email tidak valid.': 'Invalid email format.', 'Terlalu banyak percobaan. Tunggu beberapa menit lalu coba lagi.': 'Too many attempts. Wait a few minutes and try again.',
    'Password baru harus berbeda dari password lama.': 'The new password must be different from the old one.', 'Tautan sudah kedaluwarsa atau tidak valid. Minta tautan baru.': 'This link has expired or is invalid. Request a new one.',
    'Pendaftaran akun sedang dinonaktifkan di server.': 'Sign-ups are currently disabled on the server.', 'Kunci server tidak valid. Periksa pengaturan server.': 'Invalid server key. Check the server settings.',
    'Terjadi kesalahan. Coba lagi.': 'Something went wrong. Try again.', 'Tidak ada koneksi internet.': 'No internet connection.', 'Sesi berakhir. Silakan masuk lagi.': 'Session expired. Please sign in again.',
    'mode tanpa akun': 'no-account mode', 'Pindahkan data lama?': 'Move old data?', 'Data lama dipindahkan ke akun': 'Old data moved to your account',
    'Ditemukan data {0} di perangkat ini: {1} poin, {2} tugas, {3} catatan riwayat. Pindahkan ke akun {4}?': (a, b, c, d, e) => `Found ${a} data on this device: ${b} points, ${c} task${s(c)}, ${d} history entr${d == 1 ? 'y' : 'ies'}. Move it to the account ${e}?`,

    /* ---------- layar akun ---------- */
    'Ingat.': 'Remember.', 'Kerjakan.': 'Get it done.', 'Dapat poin.': 'Earn points.',
    'Pengingat ujian dan deadline yang benar-benar berbunyi, plus poin untuk setiap usaha belajar.': 'Exam and deadline reminders that actually ring, plus points for every bit of studying.',
    'Alarm belajar malam sebelum ujian': 'Study alarm the night before exams', 'Deadline tugas dengan tingkat kesulitan': 'Task deadlines with difficulty levels',
    'Poin dan level untuk setiap usaha': 'Points and levels for every effort', 'Tersinkron di semua perangkatmu': 'Synced across all your devices',
    'Pakai tanpa akun': 'Use without an account', '· data hanya di perangkat ini': '· data stays on this device', 'Selamat datang': 'Welcome',
    'Atur server akun dulu agar bisa daftar dan masuk.': 'Set up the account server first so you can sign up and sign in.', 'Server akun belum disiapkan': 'Account server not set up yet',
    'Masukkan alamat server Supabase Anda, atau pakai remind+ tanpa akun dulu. Data tetap bisa dipindahkan ke akun nanti.': 'Enter your Supabase server address, or use remind+ without an account for now. You can move your data to an account later.',
    'Atur server akun': 'Set up account server', 'Masuk': 'Sign in', 'Selamat datang kembali di remind+.': 'Welcome back to remind+.', 'Email': 'Email',
    'nama@email.com': 'name@email.com', 'Password': 'Password', 'Password Anda': 'Your password', 'Lupa password?': 'Forgot password?', 'Belum punya akun?': "Don't have an account?",
    'Daftar gratis': 'Sign up free', 'Buat akun': 'Create account', 'Satu akun untuk semua perangkatmu.': 'One account for all your devices.', 'Nama panggilan': 'Nickname',
    'Contoh: Vano': 'e.g. Vano', 'Minimal 6 karakter': 'At least 6 characters', 'Ulangi password': 'Repeat password', 'Ketik ulang password': 'Type the password again',
    'Daftar': 'Sign up', 'Sudah punya akun?': 'Already have an account?', 'Lupa password': 'Forgot password', 'Kami kirim tautan untuk membuat password baru ke email Anda.': "We'll email you a link to create a new password.",
    'Kirim tautan reset': 'Send reset link', '← Kembali ke Masuk': '← Back to sign in', '← Kembali': '← Back', 'Buat password baru': 'Create a new password',
    'Untuk akun {0}.': 'For the account {0}.', 'Password baru': 'New password', 'Ulangi password baru': 'Repeat new password', 'Simpan & masuk': 'Save & sign in', 'Cek email Anda': 'Check your email',
    'Kami mengirim tautan konfirmasi ke <b>{0}</b>. Buka email itu di perangkat ini dan ketuk tautannya untuk mengaktifkan akun. Periksa juga folder Spam.': 'We sent a confirmation link to <b>{0}</b>. Open that email on this device and tap the link to activate your account. Check your Spam folder too.',
    'Sudah konfirmasi? Masuk': 'Confirmed? Sign in', 'Server akun': 'Account server', 'Isi dari Supabase → Project Settings → API.': 'Copy these from Supabase → Project Settings → API.', 'Simpan server': 'Save server',
    'Project URL harus diawali https://': 'Project URL must start with https://', 'Anon key terlalu pendek. Salin lengkap dari Supabase.': 'Anon key is too short. Copy the whole key from Supabase.',
    'Isi email dan password.': 'Enter your email and password.', 'Isi nama panggilan.': 'Enter a nickname.', 'Isi email.': 'Enter your email.', 'Password minimal 6 karakter.': 'Password must be at least 6 characters.',
    'Kedua password tidak sama.': "The passwords don't match.", 'Akun dibuat. Selamat datang, {0}!': 'Account created. Welcome, {0}!', 'Isi email Anda.': 'Enter your email.',
    'Jika email terdaftar, tautan reset sudah dikirim. Buka email Anda di perangkat ini.': 'If that email is registered, a reset link has been sent. Open your email on this device.',
    'Password baru disimpan': 'New password saved', 'Email terkonfirmasi. Selamat datang!': 'Email confirmed. Welcome!', 'Anda sudah keluar.': "You've signed out.", 'Akun Anda sudah dihapus.': 'Your account has been deleted.',

    /* ---------- menu ---------- */
    'Beranda': 'Home', 'Tugas': 'Tasks', 'Ujian': 'Exams', 'Kas': 'Dues', 'Uang Kas': 'Class Dues', 'Pengingat': 'Reminders', 'Ingat': 'Remind',
    'Belajar': 'Study', 'Reward': 'Rewards', 'Riwayat': 'History', 'Pengaturan': 'Settings', 'Atur': 'Settings', 'Mode tanpa akun': 'No-account mode',
    'Selamat pagi': 'Good morning', 'Selamat siang': 'Good afternoon', 'Selamat sore': 'Good afternoon', 'Selamat malam': 'Good evening',

    /* ---------- beranda ---------- */
    'Saldo poin': 'Points balance', 'poin': 'points', 'Total didapat {0} poin': '{0} points earned in total', 'Tukar reward': 'Redeem reward', 'Level': 'Level',
    '{0} poin lagi menuju <b>{1}</b>': '{0} more points to <b>{1}</b>', 'Level tertinggi tercapai': 'Highest level reached', '{0} hari beruntun': n => `${n}-day streak`,
    'Mulai streak hari ini': 'Start a streak today', 'Poin 7 hari': 'Points (7 days)', 'Waktu belajar': 'Study time', 'Tugas selesai': 'Tasks done', 'Tugas aktif': 'Active tasks',
    'Agenda terdekat': 'Coming up', 'Tidak ada agenda': 'Nothing coming up', 'Tambahkan deadline tugas atau jadwal ujian.': 'Add a task deadline or an exam date.', 'Aktivitas terbaru': 'Recent activity',
    'Belum ada aktivitas': 'No activity yet', 'Selesaikan tugas atau mulai belajar untuk dapat poin.': 'Finish a task or start studying to earn points.',
    'Naik level! Sekarang: {0}': 'Level up! You are now: {0}', 'Ujian {0}': '{0} exam',
    'Terlambat {0} jam': n => `${n} hour${s(n)} late`, 'Terlambat {0} hari': n => `${n} day${s(n)} late`, 'Hari ini · {0} j {1} mnt': 'Today · {0}h {1}m', 'Hari ini · {0} mnt': 'Today · {0} min',
    '{0} hari lagi': n => `In ${n} day${s(n)}`,

    /* ---------- tugas ---------- */
    'Tambah tugas': 'Add a task', 'Tentukan sendiri tingkat kesulitannya. Makin sulit, makin banyak poin.': 'Choose the difficulty yourself. The harder it is, the more points you get.',
    'Nama tugas': 'Task name', 'Contoh: Laporan praktikum biologi': 'e.g. Biology lab report', 'Kesulitan': 'Difficulty', 'Deadline (opsional)': 'Deadline (optional)',
    '{0} · {1} poin': '{0} · {1} pts', 'Tugas yang selesai lewat deadline hanya mendapat {0}% poin.': 'Tasks finished after the deadline only get {0}% of the points.', 'Aktif · {0}': 'Active · {0}',
    'Deadline: {0}': 'Deadline: {0}', 'Tugas "{0}" jatuh tempo {1}.': 'Task "{0}" is due {1}.', 'Belum ada tugas aktif': 'No active tasks', 'Tambahkan tugas di atas, lalu centang saat selesai.': 'Add a task above, then tick it off when done.',
    'Belum ada yang selesai': 'Nothing finished yet', 'Tugas yang dicentang akan muncul di sini.': 'Ticked-off tasks will show up here.', 'Tugas ditambah': 'Task added',
    'Tugas ditambah · pengingat {0} jam sebelum deadline': n => `Task added · reminder ${n} hour${s(n)} before the deadline`, 'Hapus tugas?': 'Delete task?',
    'Tugas ini akan dihapus. Poin yang sudah didapat tidak berubah.': "This task will be deleted. Points you've already earned stay the same.", 'Hapus deadline': 'Remove deadline',
    'Deadline disimpan': 'Deadline saved', 'Deadline dihapus': 'Deadline removed', '+{0} poin': '+{0} points', '+{0} poin (dipotong karena terlambat)': '+{0} points (reduced for being late)',

    /* ---------- ujian ---------- */
    'Tambah jadwal ujian': 'Add an exam', 'remind+ mengingatkan Anda belajar malam sebelumnya, jam <b>{0}</b>. Bonus <b>+{1} poin</b> kalau sudah belajar.': 'remind+ reminds you to study the night before, at <b>{0}</b>. Get a <b>+{1} point</b> bonus once you have studied.',
    'Mata pelajaran / materi': 'Subject / topic', 'Contoh: Matematika – Trigonometri': 'e.g. Math – Trigonometry', 'Tanggal': 'Date', 'Jam mulai': 'Start time', 'Catatan (opsional)': 'Notes (optional)',
    'Contoh: bab 4–6, bawa kalkulator': 'e.g. chapters 4–6, bring a calculator', 'Tambah ujian': 'Add exam', 'Ujian mendatang': 'Upcoming exams', 'Sudah belajar': 'Studied',
    'Belajar {0}': 'Study: {0}', 'Belajar ujian {0}': 'Study for {0} exam', 'Belajar untuk ujian {0}': 'Study for the {0} exam', 'Ujian {0} {1}': '{0} exam {1}', 'Belajar ✓': 'Studied ✓',
    'Belum ada jadwal ujian': 'No exams yet', 'Tambahkan ujian agar remind+ bisa mengingatkan Anda belajar.': 'Add an exam so remind+ can remind you to study.', 'Ujian ditambah': 'Exam added',
    'Ujian ditambah · pengingat {0}': 'Exam added · reminder {0}', 'Hapus jadwal ujian?': 'Delete exam?', 'Pengingat untuk ujian ini juga dihapus.': "This exam's reminders will be deleted too.",
    'Persiapan ujian {0}': '{0} exam prep', 'Timer siap. Ketuk Mulai.': 'Timer ready. Tap Start.', '+{0} poin. Semoga lancar ujiannya!': '+{0} points. Good luck on the exam!',

    /* ---------- uang kas ---------- */
    'Setiap {0}': 'Every {0}', 'Setiap hari sekolah (Sen–Jum)': 'Every school day (Mon–Fri)', 'Setiap tanggal {0}': 'Every month on day {0}', 'Uang kas kelas': 'Class dues',
    'Nama': 'Name', 'Nominal (Rp)': 'Amount (Rp)', 'Jadwal bayar': 'Payment schedule', 'Mingguan': 'Weekly', 'Harian (hari sekolah)': 'Daily (school days)', 'Bulanan': 'Monthly',
    'Hari bayar': 'Payment day', 'Tanggal bayar': 'Payment date', 'Jam pengingat': 'Reminder time', 'Bonus poin bayar tepat waktu': 'Bonus points for paying on time',
    'Ingatkan juga malam sebelumnya': 'Also remind me the night before', 'Isi nama kas': 'Enter a name', 'Isi nominal': 'Enter an amount', 'Dibayar bulan ini': 'Paid this month',
    'Tunggakan': 'Overdue', 'Bayar tepat waktu': 'Paid on time', 'Tambah pengingat kas': 'Add a dues reminder',
    'remind+ mengingatkan di hari bayar, dan bisa juga malam sebelumnya jam {0}.': 'remind+ reminds you on payment day, and can also remind you the night before at {0}.',
    'Daftar kas': 'Dues', 'Nunggak {0}× · {1}': 'Overdue {0}× · {1}', 'Bayar hari ini': 'Pay today', 'Lunas': 'Paid up', 'pengingat {0}': 'reminder {0}',
    'bonus +{0} poin tepat waktu': 'bonus +{0} points on time', 'Berikutnya {0}': 'Next: {0}', 'Terakhir bayar:': 'Last paid:', 'Bayar semua {0}': 'Pay all {0}', 'Bayar 1': 'Pay 1',
    'Sudah bayar': 'Paid', 'Bayar duluan': 'Pay in advance', 'Bayar {0}': 'Pay {0}', 'Belum ada pengingat kas': 'No dues reminders yet',
    'Tambahkan uang kas kelas atau iuran rutin lainnya.': 'Add class dues or any other regular payment.', 'Pengingat kas ditambah · {0}': 'Dues reminder added · {0}',
    'Hapus pengingat kas?': 'Delete dues reminder?', 'Riwayat pembayarannya tetap tersimpan di Riwayat.': 'Its payment history stays in History.', 'Ubah pengingat kas': 'Edit dues reminder',
    'Pengingat kas diperbarui': 'Dues reminder updated', 'Tercatat lunas {0}': 'Recorded as paid {0}',

    /* ---------- pengingat ---------- */
    'Sekolah': 'School', 'Non-akademik': 'Non-academic', 'Pribadi': 'Personal', 'Di luar sekolah': 'Outside school',
    'Bawa baju olahraga': 'Bring PE clothes', 'Piket kelas': 'Class cleaning duty', 'Ekskul': 'Extracurricular', 'Rapat OSIS': 'Student council meeting', 'Bawa bekal': 'Bring a packed lunch',
    'Kembalikan buku perpustakaan': 'Return library books', 'Kumpulkan surat izin / formulir': 'Hand in permission slip / form', 'Pakai seragam batik': 'Wear batik uniform',
    'Ulang tahun teman': "Friend's birthday", 'Les / kursus': 'Tutoring / course', 'Beli kuota internet': 'Buy mobile data', 'Olahraga': 'Exercise', 'Cuci sepatu': 'Wash shoes',
    'Rapikan kamar': 'Tidy my room', 'Telepon keluarga': 'Call family', 'Minum air putih': 'Drink water',
    'Tepat waktu': 'On time', '15 menit sebelum': '15 minutes before', '1 jam sebelum': '1 hour before', 'Malam sebelumnya': 'The night before', 'Malam sebelumnya + tepat waktu': 'The night before + on time',
    'Sekali': 'Once', 'Tahunan': 'Yearly', 'Tiap tanggal {0}': 'Monthly on day {0}', 'Judul': 'Title', 'Contoh: Bawa baju olahraga': 'e.g. Bring PE clothes', 'Ulangi': 'Repeat',
    'Ingatkan': 'Remind me', 'Contoh: kaos olahraga + sepatu': 'e.g. PE shirt + shoes', 'Poin saat selesai (opsional)': 'Points when done (optional)',
    'Mulai (tanggal tiap bulan)': 'Start (day of each month)', 'Tanggal (tiap tahun)': 'Date (every year)', 'Isi judul pengingat': 'Enter a reminder title', 'Pilih minimal satu hari': 'Pick at least one day',
    'Hari ini {0}': 'Today {0}', 'Izinkan notifikasi': 'Allow notifications', 'Pengingat di menu ini muncul sebagai notifikasi biasa, tanpa sirene atau alarm.': 'Reminders here show up as regular notifications, with no siren or alarm.',
    'Tambah pengingat': 'Add a reminder', 'Untuk hal di luar pelajaran. Muncul sebagai <b>notifikasi biasa</b>, tanpa alarm. Pilih contoh di bawah atau tulis sendiri.': 'For things outside of lessons. Shows up as a <b>regular notification</b>, with no alarm. Pick an example below or write your own.',
    'Akan datang': 'Upcoming', 'Belum ada pengingat': 'No reminders yet', 'Tambahkan pengingat sekolah atau pribadi di atas.': 'Add a school or personal reminder above.', 'Pengingat ditambah': 'Reminder added',
    'Pengingat ditambah · {0} {1}': 'Reminder added · {0} {1}', 'Notifikasi aktif': 'Notifications on', 'Hapus pengingat?': 'Delete reminder?',
    'Pengingat ini dan jadwal berulangnya dihapus.': 'This reminder and its repeat schedule will be deleted.', 'Ubah pengingat': 'Edit reminder', 'Pengingat diperbarui': 'Reminder updated', 'Ditandai selesai': 'Marked as done',

    /* ---------- belajar ---------- */
    'Timer belajar': 'Study timer', '{0} poin / {1} mnt': '{0} pts / {1} min', 'Sedang belajar apa?': 'What are you studying?', 'Contoh: Bahasa Inggris, coding, fisika': 'e.g. English, coding, physics',
    'Selesai & ambil poin': 'Finish & collect points', 'Catat manual': 'Log manually', 'Untuk sesi belajar yang tidak memakai timer.': "For study sessions where you didn't use the timer.",
    'Topik': 'Topic', 'Durasi (menit)': 'Duration (minutes)', 'Poin yang didapat': 'Points earned', 'Simpan sesi': 'Save session',
    '{0} poin · {1} mnt lagi untuk +{2}': '{0} points · {1} min to go for +{2}', 'Reset timer?': 'Reset the timer?', 'Waktu yang berjalan akan dibuang tanpa poin.': 'The time so far will be discarded without points.',
    'Belum ada waktu belajar': 'No study time yet', 'Belum dapat poin': 'No points yet', 'Baru {0} menit. Minimal {1} menit untuk mendapat poin. Tetap akhiri sesi?': (a, b) => `Only ${a} minute${s(a)} so far. You need at least ${b} minutes to earn points. End the session anyway?`,
    '+{0} poin dari {1} menit belajar': (a, b) => `+${a} points for ${b} minute${s(b)} of study`, 'Sesi diakhiri': 'Session ended', 'Minimal {0} menit untuk mendapat poin': 'At least {0} minutes to earn points',

    /* ---------- reward ---------- */
    'Top-up game': 'Game top-up', 'Belanja': 'Shopping', 'Jajan / makan': 'Snacks / food', 'Hiburan': 'Entertainment', 'Lainnya': 'Other',
    'Tukar dengan pengeluaran': 'Redeem for spending', 'Masukkan nominal yang ingin dibelanjakan. Poin dihitung otomatis: <b>1 poin = {0}</b>.': 'Enter how much you want to spend. Points are calculated automatically: <b>1 point = {0}</b>.',
    'Kategori': 'Category', 'Untuk apa? (opsional)': 'What for? (optional)', 'Contoh: Diamond Mobile Legends, skin, buku': 'e.g. Mobile Legends diamonds, a skin, a book', 'Poin terpakai': 'Points used',
    'Tukar poin': 'Redeem points', 'Reward tetap': 'Fixed rewards', 'Hadiah dengan harga poin yang Anda tentukan sendiri. Terbuka saat saldo cukup.': 'Rewards with a point price you set yourself. Unlocked when your balance is enough.',
    'Bisa ditukar': 'Available', 'Kurang {0}': '{0} short', 'Belum ada reward tetap': 'No fixed rewards yet', 'Tambahkan di Pengaturan.': 'Add some in Settings.',
    'Saldo kurang {0} poin.': 'You are {0} points short.', 'Sisa saldo setelah ditukar: <b>{0}</b> poin.': 'Balance after redeeming: <b>{0}</b> points.', 'Tukar {0} poin?': 'Redeem {0} points?',
    '{0} senilai {1}. Saldo jadi {2} poin.': '{0} worth {1}. Your balance will be {2} points.', '−{0} poin. Selamat menikmati!': '−{0} points. Enjoy!', 'Tukar reward?': 'Redeem reward?',
    '"{0}" seharga {1} poin.': '"{0}" for {1} points.', 'Reward ditukar. Nikmati!': 'Reward redeemed. Enjoy!',

    /* ---------- riwayat ---------- */
    'Didapat hari ini': 'Earned today', 'Dipakai hari ini': 'Spent today', 'Total sepanjang waktu': 'All-time total', 'Koreksi': 'Adjustments',
    'Belum ada catatan': 'No entries yet', 'Riwayat poin akan muncul di sini.': 'Your points history will show up here.',

    /* ---------- pengaturan ---------- */
    'Tidak didukung di browser ini': 'Not supported in this browser', 'Aktif': 'On', 'Diblokir. Izinkan dari pengaturan aplikasi.': 'Blocked. Allow it in the app settings.', 'Belum diizinkan': 'Not allowed yet',
    'Mode tanpa akun · data hanya di perangkat ini': 'No-account mode · data stays on this device', 'Buat akun / Masuk': 'Create account / Sign in', 'Sinkronkan': 'Sync now',
    'Keluar mode lokal': 'Leave local mode', 'Keluar': 'Sign out', 'Profil': 'Profile', 'Nama yang tampil di aplikasi.': 'The name shown in the app.', 'Nama dan password akun Anda.': 'Your account name and password.',
    'Tampilan': 'Appearance', 'Pilih tema. Otomatis mengikuti pengaturan tablet.': 'Choose a theme. Auto follows your tablet settings.', 'Terang': 'Light', 'Gelap': 'Dark', 'Otomatis': 'Auto',
    'Efek kaca (liquid glass)': 'Glass effect (liquid glass)', 'Animasi halus': 'Smooth animations', 'Matikan salah satunya jika tablet terasa lambat atau baterai cepat habis.': 'Turn one of them off if your tablet feels slow or the battery drains quickly.',
    'Pengingat & alarm': 'Reminders & alarms', 'Atur kapan remind+ mengingatkan Anda.': 'Choose when remind+ reminds you.', 'Jam belajar (malam sebelum ujian)': 'Study time (night before an exam)',
    'Ingatkan tugas (jam sebelum deadline)': 'Task reminder (hours before deadline)', 'Bonus belajar sebelum ujian': 'Pre-exam study bonus', 'Potongan poin jika telat (%)': 'Late penalty (%)',
    'Alarm darurat layar penuh + sirene': 'Full-screen emergency alarm + siren', 'Tes alarm': 'Test alarm', 'Tes notifikasi': 'Test notification', 'Notifikasi: {0}': 'Notifications: {0}',
    'Di iPhone/iPad, notifikasi hanya muncul saat remind+ terbuka. Agar <b>pasti berbunyi walau aplikasi tertutup</b>, ketuk <b>Pengingat iPhone</b> pada ujian, tugas, atau kas, lalu simpan ke Kalender. Supaya tetap berbunyi saat Fokus aktif, buka <b>Pengaturan iPhone → Notifikasi → Kalender</b> lalu nyalakan <b>Notifikasi Sensitif Waktu</b>.':
      'On iPhone/iPad, notifications only appear while remind+ is open. To <b>make sure it rings even when the app is closed</b>, tap <b>iPhone reminder</b> on an exam, task, or dues item, then save it to Calendar. To keep it ringing when Focus is on, open <b>iPhone Settings → Notifications → Calendar</b> and turn on <b>Time Sensitive Notifications</b>.',
    'Agar alarm <b>pasti berbunyi walau mode Jangan Ganggu aktif</b>, ketuk <b>Alarm HP</b> pada ujian atau tugas. Tombolnya muncul saat pengingat tinggal kurang dari 24 jam.':
      'To <b>make sure the alarm rings even in Do Not Disturb</b>, tap <b>Phone alarm</b> on an exam or task. The button appears when the reminder is less than 24 hours away.',
    'Aturan poin': 'Point rules', 'Berapa nilai usaha Anda.': 'How much your effort is worth.', 'Poin belajar': 'Study points', 'setiap (menit)': 'every (minutes)',
    'Kurs penukaran: 1 poin = Rp': 'Exchange rate: 1 point = Rp', 'Contoh: kurs {0} → top-up {1} memakai {2} poin.': 'Example: at {0} per point, a {1} top-up uses {2} points.',
    'Tingkat kesulitan': 'Difficulty levels', 'Angka = total poin yang dibutuhkan untuk mencapai level.': 'Number = total points needed to reach the level.', 'Belum ada.': 'None yet.',
    'Koreksi poin': 'Point adjustment', 'Bonus atau potongan manual.': 'Manual bonus or deduction.', 'Poin (+/−)': 'Points (+/−)', '50 atau -30': '50 or -30', 'Alasan': 'Reason',
    'Data': 'Data', 'Data hanya tersimpan di perangkat ini. Buat cadangan secara rutin.': 'Data is only stored on this device. Back it up regularly.', 'Data tersimpan di akun dan di perangkat ini.': 'Data is stored in your account and on this device.',
    'Salin cadangan': 'Copy backup', 'Pulihkan cadangan': 'Restore backup', 'Impor data Poin Mandiri': 'Import Poin Mandiri data', 'Reset data': 'Reset data', 'Hapus akun': 'Delete account',
    'Tempel teks cadangan di sini': 'Paste your backup text here', 'remind+ versi {0}': 'remind+ version {0}', 'Tanpa nama': 'Untitled', 'Baru': 'New', 'Level baru': 'New level', 'Reward baru': 'New reward',
    'Minimal {0} item': n => `At least ${n} item${s(n)}`, 'Efek kaca aktif': 'Glass effect on', 'Efek kaca dimatikan': 'Glass effect off', 'Animasi aktif': 'Animations on', 'Animasi dimatikan': 'Animations off',
    'Nama disimpan': 'Name saved', 'Password minimal 6 karakter': 'Password must be at least 6 characters', 'Password diubah': 'Password changed',
    'Beginilah bunyi pengingat ujian dan deadline.': 'This is how exam and deadline reminders sound.', 'Notifikasi berfungsi. Semangat belajar!': 'Notifications work. Happy studying!', 'Izinkan notifikasi dulu': 'Allow notifications first',
    'Saldo jadi minus': 'Balance will go negative', 'Lanjutkan koreksi ini?': 'Continue with this adjustment?', 'Saldo diperbarui': 'Balance updated',
    'Cadangan disalin. Simpan di catatan Anda.': 'Backup copied. Save it in your notes.', 'Salin teks di kotak': 'Copy the text in the box', 'Teks cadangan tidak valid': 'Invalid backup text',
    'Pulihkan cadangan?': 'Restore backup?', 'Semua data sekarang diganti dengan isi cadangan.': 'All current data will be replaced with the backup.', 'Data dipulihkan': 'Data restored',
    'Impor data Poin Mandiri?': 'Import Poin Mandiri data?', 'Data sekarang diganti dengan data dari aplikasi lama ({0} poin).': 'Current data will be replaced with data from the old app ({0} points).', 'Data lama diimpor': 'Old data imported',
    'Reset semua data?': 'Reset all data?', 'Poin, tugas, ujian, riwayat, dan pengaturan kembali ke awal. Tidak bisa dibatalkan.': 'Points, tasks, exams, history, and settings go back to the start. This cannot be undone.', 'Data direset': 'Data reset',
    'Keluar dari mode lokal?': 'Leave local mode?', 'Data tetap tersimpan di perangkat ini dan bisa dipindahkan ke akun saat Anda masuk.': 'Your data stays on this device and can be moved to an account when you sign in.',
    'Ada perubahan belum tersinkron': 'Some changes are not synced yet', 'Perubahan terakhir belum terkirim karena offline. Jika keluar sekarang, perubahan itu tidak masuk ke akun.': "Your latest changes weren't sent because you're offline. If you sign out now, they won't reach your account.",
    'Tetap keluar': 'Sign out anyway', 'Hapus akun permanen?': 'Delete account permanently?',
    'Akun <b>{0}</b> dan seluruh datanya akan dihapus dari server. Tindakan ini tidak bisa dibatalkan.': 'The account <b>{0}</b> and all its data will be deleted from the server. This cannot be undone.', 'Ketik {0} untuk konfirmasi': 'Type {0} to confirm',

    /* ---------- peringatan & notifikasi ---------- */
    'Ujian {0} besok, {1}': '{0} exam tomorrow, {1}', 'Waktunya belajar malam ini.': 'Time to study tonight.', 'Jadwal belajar malam ini jam {0}.': 'Study session tonight at {0}.',
    'Mulai belajar': 'Start studying', 'Sudah (+{0})': 'Done (+{0})', 'Ujian {0} hari ini, {1}': '{0} exam today, {1}', 'Semangat! Kamu pasti bisa.': "You've got this!",
    'Nunggak {0} {1}× · {2}': 'Overdue {0} {1}× · {2}', 'Segera lunasi ya.': 'Pay it off soon.', 'Bayar semua': 'Pay all', 'Bayar {0} hari ini · {1}': 'Pay {0} today · {1}',
    'Bayar hari ini dapat bonus +{0} poin.': 'Pay today for a +{0} point bonus.', 'Jangan lupa siapkan uangnya.': "Don't forget to have the money ready.", 'Besok bayar {0} · {1}': 'Pay {0} tomorrow · {1}',
    'Siapkan uangnya malam ini.': 'Get the money ready tonight.', '{0} tugas lewat deadline': n => `${n} task${s(n)} past the deadline`,
    '{0} tugas deadline dalam {1} jam': (a, b) => `${a} task${s(a)} due within ${b} hour${s(b)}`, '{0} pengingat hari ini': n => `${n} reminder${s(n)} today`,
    'Pasang remind+ di iPhone/iPad': 'Install remind+ on iPhone/iPad',
    'Di Safari, ketuk tombol Bagikan (kotak dengan panah ke atas), lalu pilih <strong>Tambahkan ke Layar Utama</strong>. Notifikasi baru bisa aktif setelah dipasang.': 'In Safari, tap the Share button (the square with an up arrow), then choose <strong>Add to Home Screen</strong>. Notifications only work once it is installed.',
    'Belajar malam ini: {0}': 'Study tonight: {0}', 'Ujian {0} besok, {1}. Ayo belajar sekarang!': '{0} exam tomorrow, {1}. Time to study!', 'Deadline mendekat: {0}': 'Deadline coming up: {0}',
    'Jatuh tempo {0}.': 'Due {0}.', 'Deadline sekarang: {0}': 'Deadline now: {0}', 'Waktunya habis. Selesaikan secepatnya.': "Time's up. Finish it as soon as you can.",
    'Bayar {0} hari ini': 'Pay {0} today', 'Besok bayar {0}': 'Pay {0} tomorrow', 'Siapkan {0} malam ini.': 'Get {0} ready tonight.',

    /* ---------- jadwal pelajaran ---------- */
    'Jadwal': 'Timetable', 'Jadwal Pelajaran': 'Timetable', 'Mapel dihapus': 'Deleted subject', 'Istirahat': 'Break', '{0} menit': '{0} min', 'Sekarang': 'Now',
    '{0} sesi': n => `${n} session${s(n)}`, 'Naikkan': 'Move up', 'Kurangi sesi': 'Fewer sessions', 'Tambah sesi': 'More sessions',
    'Minggu sebelumnya': 'Previous week', 'Minggu berikutnya': 'Next week',
    '{0} pelajaran · {1} sesi · selesai {2}': (a, b, c) => `${a} lesson${s(a)} · ${b} session${s(b)} · ends ${c}`, 'Belum diisi': 'Not filled in yet',
    'Jadwal hari ini masih kosong': "This day's timetable is empty", 'Tambah pelajaran di bawah, atau salin dari hari lain.': 'Add lessons below, or copy from another day.',
    'Salin dari {0}': 'Copy from {0}', 'Pelajaran': 'Lesson', 'Salin dari…': 'Copy from…', 'Kosongkan': 'Clear',
    'Mata pelajaran & guru': 'Subjects & teachers', 'Mata pelajaran': 'Subject', 'Guru': 'Teacher', 'Pengaturan jadwal': 'Timetable settings', 'Berlaku untuk semua hari.': 'Applies to every day.',
    'Durasi 1 sesi (menit)': 'Session length (minutes)', 'Jam mulai biasanya': 'Usual start time', 'Ingatkan sebelum pelajaran': 'Remind me before lessons', '{0} menit sebelum': '{0} minutes before', 'Mati': 'Off',
    'Muncul sebagai notifikasi biasa, tanpa alarm.': 'Shows up as a regular notification, with no alarm.', 'Dihapus dari jadwal': 'Removed from the timetable', 'Tambahkan mata pelajaran dulu': 'Add a subject first',
    'Disalin dari {0}': 'Copied from {0}', 'Belum ada hari lain yang sudah diisi': 'No other days are filled in yet', 'Salin jadwal': 'Copy timetable',
    'Salin seluruh minggu lalu ke minggu ini': 'Copy all of last week into this week', 'Hanya mengisi hari yang masih kosong.': 'Only fills days that are still empty.', 'Atau salin ke hari ini dari:': 'Or copy into this day from:',
    'Kosongkan jadwal hari ini?': "Clear this day's timetable?", 'Semua pelajaran dan istirahat di hari ini dihapus.': 'All lessons and breaks on this day will be removed.', 'Hapus {0}?': 'Delete {0}?',
    'Mata pelajaran ini masih ada di jadwal. Di sana akan tampil sebagai "Mapel dihapus".': 'This subject is still in your timetable. It will show there as "Deleted subject".', 'Mapel baru': 'New subject',
    '{0} hari disalin dari minggu lalu': n => `${n} day${s(n)} copied from last week`, 'Semua hari minggu ini sudah terisi': 'Every day this week is already filled in',
    'Tambah pelajaran': 'Add a lesson', 'Jumlah sesi': 'Sessions', '1 sesi = {0} menit. Ketuk mata pelajaran untuk menambahkannya.': '1 session = {0} minutes. Tap a subject to add it.',
    'Sholat & makan siang': 'Prayer & lunch', 'Kegiatan pagi': 'Morning activity', 'Sholat Dhuha': 'Dhuha prayer', 'Ubah istirahat': 'Edit break', 'Tambah istirahat': 'Add a break',
    'Jadwal hari ini': "Today's timetable", 'Jadwal besok': "Tomorrow's timetable", 'Isi jadwal': 'Fill in', 'Belum ada pelajaran untuk hari ini.': 'No lessons for today yet.',
    'Sekarang: {0}': 'Now: {0}', 'berikutnya {0} jam {1}': 'next {0} at {1}', 'Berikutnya: {0} jam {1}': 'Next: {0} at {1}', 'Pelajaran hari ini sudah selesai': "Today's lessons are over", 'Mulai {0}': 'Starts {0}',

    'Belum ada pelajaran': 'No lessons yet', 'Tambah pelajaran, atau salin dari hari lain.': 'Add a lesson, or copy from another day.',
    '{0} pelajaran · selesai {1}': (a, b) => `${a} lesson${s(a)} · ends ${b}`, 'Turunkan': 'Move down', 'Lainnya': 'More',
    'Salin dari hari lain…': 'Copy from another day…', 'Salin dari hari lain': 'Copy from another day', 'Salin minggu lalu ke hari kosong': "Copy last week into empty days",
    'Kosongkan hari ini': 'Clear this day', 'Tidak ada hari kosong yang bisa diisi': 'No empty days to fill', '{0} dihapus': '{0} deleted', 'Pengaturan jadwal disimpan': 'Timetable settings saved',

    'Foto profil': 'Profile picture', 'Ubah foto profil': 'Change profile picture', 'Geser foto untuk mengatur posisi': 'Drag the photo to position it', 'Pilih foto': 'Choose photo',
    'Pakai inisial': 'Use initial', 'Atau pilih emoji': 'Or pick an emoji', 'Warna': 'Colour', 'Foto tidak bisa dibuka': "This photo can't be opened", 'Foto profil disimpan': 'Profile picture saved',

    'Lihat changelog': 'View changelog', 'Changelog belum bisa dimuat. Coba lagi saat online.': "The changelog couldn't load. Try again when online.", 'Tutup': 'Close',
    'Ujian{0}': 'Exam{0}', 'Lihat ujian': 'View exam', 'Jadikan ujian': 'Mark as exam', 'Dari menu Ujian': 'From the Exams page', '{0} ujian': n => `${n} exam${s(n)}`,
    'Dari jadwal:': 'From timetable:', 'Lihat di jadwal': 'View in timetable',
    'Profil & akun': 'Profile & account', 'Poin & level': 'Points & levels', 'Data & cadangan': 'Data & backup', 'Tentang': 'About', 'Tema': 'Theme', 'Efek': 'Effects',
    'Waktu pengingat': 'Reminder times', 'Alarm & notifikasi': 'Alarms & notifications', 'Cadangan': 'Backup', 'Akun dan semua datanya dihapus dari server.': 'Your account and all its data are deleted from the server.',
    'Belajar jam {0} · tugas {1} jam sebelum': (a, b) => `Study at ${a} · tasks ${b} hour${s(b)} before`, '{0} tingkat kesulitan · {1} level': (a, b) => `${a} difficulty level${s(a)} · ${b} level${s(b)}`,
    'Hanya di perangkat ini': 'Only on this device', 'Tersimpan di akun': 'Saved to your account', 'Versi {0}': 'Version {0}',
    'Versi baru remind+ sudah siap': 'A new version of remind+ is ready', 'Muat ulang': 'Reload',
    '2 kali lagi…': '2 more taps…', 'Sekali lagi…': 'One more…', '🥚 Kamu menemukan rahasia!': '🥚 You found a secret!',
    'remind+ dibuat khusus oleh <b>{0}</b>, untuk belajar lebih mandiri.': 'remind+ was made especially by <b>{0}</b>, to study more independently.',
    'poin total': 'total points', 'tugas selesai': 'tasks done', 'waktu belajar': 'study time', 'hari bersama': 'days together',
    'Mode rahasia: aurora pelangi': 'Secret mode: rainbow aurora', 'Aurora pelangi aktif 🌈': 'Rainbow aurora on 🌈', 'Aurora pelangi dimatikan': 'Rainbow aurora off',
    /* ---------- 3.0: widget, rencana, PR, ringkasan, pencapaian, nilai ---------- */
    'Berikutnya': 'Next', 'Pelajaran pertama': 'First lesson', 'sisa {0} menit': n => `${n} min left`, 'Jadwal berikutnya': 'Next up', 'Mulai dalam {0}': 'Starts in {0}', 'sampai {0}': 'until {0}',
    '{0} pelajaran lagi hari ini': n => `${n} more lesson${s(n)} today`, '{0} pelajaran': n => `${n} lesson${s(n)}`, 'Isi jadwal pelajaran agar pelajaran berikutnya tampil di sini.': 'Fill in your timetable so your next lesson shows up here.',
    '{0} jam {1} menit': '{0}h {1}m',
    'Catatan pelajaran': 'Lesson note', 'Contoh: bawa kalkulator, hal. 45–50': 'e.g. bring a calculator, p. 45–50', 'Catatan': 'Note',
    'PR {0}': '{0} homework', 'Deadline otomatis diisi dengan pelajaran yang sama berikutnya di jadwal.': "The deadline is set to this subject's next lesson in your timetable.", 'PR ditambahkan ke Tugas': 'Homework added to Tasks',
    'Ada PR dari {0}?': 'Any homework from {0}?', 'Pelajaran selesai jam {0}': 'Lesson ended at {0}', 'Catat PR': 'Add homework', 'Tidak ada': 'None',
    'H-{0}': n => (n == 1 ? 'Tomorrow' : `${n} days left`), 'Hari H': 'Exam day', '{0}/{1} topik selesai': '{0}/{1} topics done', 'Belum dijadwalkan': 'Not scheduled',
    'Tulis bab atau materi yang perlu dipelajari, lalu remind+ membaginya ke hari-hari sebelum ujian.': 'Write the chapters or topics to study, and remind+ spreads them over the days before the exam.',
    'Rencana belajar: {0}': 'Study plan: {0}', 'Topik / bab': 'Topic / chapter', 'Contoh: Bab 3 – Sel': 'e.g. Chapter 3 – Cells', 'Bagi ulang ke hari-hari': 'Re-spread over the days', 'Topik dibagi ulang': 'Topics re-spread',
    'Rencana belajar hari ini': "Today's study plan", '{0} topik': n => `${n} topic${s(n)}`, 'tertunda': 'overdue', '{0}/{1} topik': '{0}/{1} topics', 'Rencana': 'Plan',
    'Butuh {0} poin': 'You need {0} points', 'Lindungi streak hari ini?': 'Protect your streak today?',
    '{0} poin dipakai agar streak {1} hari tetap aman walau hari ini tidak belajar. Maksimal 2 kali per minggu.': (a, b) => `${a} points keep your ${b}-day streak safe even if you don't study today. Up to 2 times a week.`,
    'Lindungi': 'Protect', '❄️ Streak aman hari ini': '❄️ Streak protected today', 'Lindungi · {0} poin': 'Protect · {0} pts',
    'Ringkasan minggu ini': 'This week in review', 'ujian minggu depan': 'exams next week', 'Lihat ringkasan lengkap': 'See full summary', 'Ringkasan mingguan': 'Weekly summary',
    'tugas selesai · {0} terlambat': 'tasks done · {0} late', 'hari terbaik: {0}': 'best day: {0}', 'hari terbaik': 'best day', 'Belajar per mata pelajaran': 'Study by subject',
    'Belum ada sesi belajar minggu ini.': 'No study sessions this week yet.', 'Ujian minggu depan': 'Exams next week', 'Tidak ada ujian minggu depan.': 'No exams next week.',
    '🏅 Pencapaian baru: {0} {1}': '🏅 New achievement: {0} {1}', '+{0} lagi': '+{0} more', '{0} dari {1} terbuka': '{0} of {1} unlocked', 'Pencapaian': 'Achievements',
    'Langkah pertama': 'First step', 'Selesaikan 1 tugas': 'Finish 1 task', 'Rajin mengerjakan': 'Hard worker', 'Selesaikan 10 tugas': 'Finish 10 tasks', 'Mesin tugas': 'Task machine', 'Selesaikan 50 tugas': 'Finish 50 tasks',
    'Tepat waktu': 'On time', '10 tugas selesai sebelum deadline': 'Finish 10 tasks before the deadline', 'Satu jam fokus': 'One focused hour', 'Total belajar 1 jam': 'Study 1 hour in total',
    'Kutu buku': 'Bookworm', 'Total belajar 10 jam': 'Study 10 hours in total', 'Profesor muda': 'Young professor', 'Total belajar 50 jam': 'Study 50 hours in total',
    'Mulai panas': 'Warming up', 'Streak 3 hari': '3-day streak', 'Seminggu penuh': 'Full week', 'Streak 7 hari': '7-day streak', 'Sebulan konsisten': 'Month of consistency', 'Streak 30 hari': '30-day streak',
    'Siap ujian': 'Exam ready', 'Belajar sebelum ujian': 'Study before an exam', 'Rencana tuntas': 'Plan complete', 'Selesaikan semua topik rencana belajar satu ujian': "Finish every topic in an exam's study plan",
    'Tidak ada PR terlewat': 'No homework missed', 'Catat 5 PR dari jadwal': 'Log 5 homework from the timetable', 'Bendahara teladan': 'Model treasurer', 'Bayar kas tepat waktu 5 kali': 'Pay dues on time 5 times',
    'Jadwal lengkap': 'Full timetable', 'Isi jadwal 6 hari dalam satu minggu': 'Fill in 6 days of a week', 'Naik kelas': 'Moving up', 'Capai level 3': 'Reach level 3',
    'Seribu poin': 'A thousand points', 'Kumpulkan 1.000 poin': 'Earn 1,000 points', 'Nilai gemilang': 'Top marks', 'Dapat nilai 90 atau lebih': 'Score 90 or more',
    'Penjelajah': 'Explorer', 'Temukan rahasia remind+': 'Find the remind+ secret',
    'Aktifkan nilai di mata pelajaran dulu': 'Turn on grades for a subject first', 'Tambah nilai': 'Add grade', 'Nama penilaian': 'Assessment name', 'Contoh: Ulangan Bab 3': 'e.g. Chapter 3 test',
    'Nilai': 'Grades', 'Nilai yang didapat': 'Score', 'Nilai maksimal': 'Out of', 'Penilaian': 'Assessment', 'Nilai disimpan': 'Grade saved', 'Pelacak nilai belum aktif': 'Grade tracker is off',
    'Pilih mata pelajaran yang nilainya ingin kamu catat. Mapel lain tidak ikut tampil.': 'Choose the subjects you want to track grades for. Other subjects stay hidden.',
    'Pilih mata pelajaran': 'Choose subjects', 'Rata-rata semua: {0}': 'Overall average: {0}', 'Belum ada nilai': 'No grades yet', '{0} nilai': n => `${n} grade${s(n)}`, 'Nilai dihapus': 'Grade deleted',
    'Isi nilai': 'Add grade', 'Lacak nilai': 'Track grades',

    'Ada PR dari pelajaran hari ini?': "Any homework from today's lessons?", 'Ketuk pelajaran yang ada PR-nya.': 'Tap the lessons that gave homework.', 'Tidak ada PR': 'No homework',
    'Aplikasi Android. Tambahkan widget: tekan lama layar utama → Widget → remind+.': 'Android app. To add the widget: long-press your home screen → Widgets → remind+.', 'Unduh aplikasi Android (dengan widget)': 'Download the Android app (with widget)',
    'Mode lancar (latar diam, kaca lebih ringan)': 'Smooth mode (still background, lighter glass)', 'Mode lancar aktif': 'Smooth mode on', 'Mode lancar dimatikan': 'Smooth mode off',
    'Acara sekolah': 'School events', 'Upacara, lomba, rapat': 'Ceremonies, contests, meetings', 'Sampai (opsional)': 'Until (optional)', 'Satu hari': 'One day',
    'Upacara bendera': 'Flag ceremony', 'Class meeting': 'Class meeting', 'Pentas seni': 'Art performance', 'Study tour / field trip': 'Study tour / field trip', 'Lomba': 'Competition',
    'Rapat orang tua': 'Parent meeting', 'Pembagian rapor': 'Report card day', 'Peringatan hari besar': 'Holiday commemoration', 'Libur sekolah': 'School holiday',
    'Selamat datang di remind+': 'Welcome to remind+', 'Teman belajar yang mengingatkan ujian, tugas, dan jadwalmu, sekaligus memberi poin untuk setiap usaha. Ikuti panduan singkat ini, cuma 1 menit.': 'A study buddy that reminds you of exams, tasks, and your timetable, and gives you points for every effort. This quick guide takes just 1 minute.',
    'Tugas & poin': 'Tasks & points', 'Tambahkan tugas di menu Tugas dan pilih tingkat kesulitannya. Centang saat selesai untuk dapat poin. Makin rajin, makin tinggi levelmu.': 'Add tasks in Tasks and choose how hard they are. Tick them off when done to earn points. The more you do, the higher your level.',
    'Ujian & rencana belajar': 'Exams & study plans', 'Catat jadwal ujian di menu Ujian. remind+ mengingatkan belajar malam sebelumnya, dan tombol Rencana membagi bab yang harus dipelajari ke hari-hari sebelum ujian.': 'Log your exams in Exams. remind+ reminds you to study the night before, and the Plan button spreads your chapters over the days before the exam.',
    'Jadwal pelajaran': 'Timetable', 'Isi jadwal per hari di menu Jadwal. Jadwal minggu lalu bisa disalin dengan sekali ketuk. Pelajaran sekarang dan berikutnya tampil di Beranda.': "Fill in each day in Timetable. Last week's timetable can be copied in one tap. Your current and next lesson show up on Home.",
    'Pengingat & uang kas': 'Reminders & dues', 'Menu Ingat untuk hal di luar pelajaran: bawa baju olahraga, acara sekolah, ulang tahun teman. Menu Kas mengingatkan bayar uang kas.': "Remind is for things outside lessons: PE clothes, school events, friends' birthdays. Dues reminds you to pay class dues.",
    'Nyalakan notifikasi': 'Turn on notifications', 'Supaya pengingat benar-benar berbunyi, izinkan notifikasi untuk remind+.': 'So your reminders actually ring, allow notifications for remind+.',
    'Siap mulai!': 'Ready to go!', 'Ikuti daftar "Mulai di sini" di Beranda untuk langkah pertamamu. Panduan ini bisa dibuka lagi kapan saja dari Atur → Tentang.': 'Follow the "Start here" list on Home for your first steps. You can reopen this guide any time from Settings → About.',
    'Notifikasi sudah aktif': 'Notifications are on', 'Kembali': 'Back', 'Lanjut': 'Next', 'Lewati': 'Skip',
    'Mulai di sini': 'Start here', '{0} dari {1} langkah selesai': '{0} of {1} steps done', 'Izinkan notifikasi': 'Allow notifications', 'Pasang foto profil & nama': 'Set your photo & name',
    'Isi jadwal pelajaran': 'Fill in your timetable', 'Tambah tugas pertama': 'Add your first task', 'Catat jadwal ujian': 'Log an exam', 'Coba timer belajar': 'Try the study timer',
    'Panduan bisa dibuka lagi dari Atur → Tentang': 'You can reopen the guide from Settings → About', 'Lihat panduan': 'View guide', 'Panduan': 'Guide',
    /* ---------- mode libur, hitung mundur, bagikan jadwal ---------- */
    'Mode libur': 'Holiday mode', 'Tambah libur': 'Add holiday', 'Ubah libur': 'Edit holiday', 'Nama libur': 'Holiday name', 'Contoh: Libur semester': 'E.g. Semester break',
    'Sampai': 'Until', 'Libur': 'Holiday', 'Libur dihapus': 'Holiday deleted', '🌴 Mode libur aktif': '🌴 Holiday mode on', 'Libur disimpan': 'Holiday saved',
    'Selama libur: pengingat pelajaran, pertanyaan PR, uang kas, dan pengingat sekolah berhenti. Streak tidak putus. Ujian dan tugas tetap diingatkan.': 'During the holiday, lesson reminders, homework prompts, class cash and school reminders pause. Your streak won\'t break. Exams and tasks are still reminded.',
    'Tanggal selesai harus setelah tanggal mulai': 'The end date must be after the start date', 'Mode libur diakhiri. Selamat sekolah lagi!': 'Holiday mode ended. Welcome back to school!',
    'Aktif sampai {0}': 'On until {0}', 'Hentikan pengingat sekolah saat libur tanpa memutus streak.': 'Pause school reminders during holidays without breaking your streak.',
    'Akhiri sekarang': 'End now', 'Jadwal libur': 'Holidays', 'Belum ada libur. Tambahkan libur semester atau libur hari raya dari kalender sekolah.': 'No holidays yet. Add semester or public holidays from your school calendar.',
    'Sudah lewat': 'Past', 'Yang berubah saat libur': 'What changes during a holiday', 'Pengingat pelajaran & pertanyaan PR berhenti': 'Lesson reminders & homework prompts pause',
    'Uang kas tidak ditagih': 'Class cash isn\'t charged', 'Pengingat kategori Sekolah berhenti': 'School-category reminders pause', 'Streak tidak putus walau tidak belajar': 'Your streak won\'t break even if you don\'t study',
    'Ujian, tugas, acara, dan pengingat pribadi tetap jalan': 'Exams, tasks, events and personal reminders keep running', 'Akhiri mode libur?': 'End holiday mode?', 'Pengingat sekolah akan aktif lagi mulai hari ini.': 'School reminders will resume from today.', 'Akhiri': 'End',
    'Tidak aktif': 'Off', '{0} libur terjadwal': n => n === 1 ? '1 holiday planned' : `${n} holidays planned`, 'Libur sampai {0}': 'Holiday until {0}', 'hari terakhir': 'last day', 'sisa {0} hari': n => n === 1 ? '1 day left' : `${n} days left`,
    'Hari libur · {0}': 'Holiday · {0}', 'Pengingat pelajaran tidak dibunyikan': 'Lesson reminders are muted',
    'Hitung mundur': 'Countdown', 'mulai': 'starts', 'Masuk sekolah lagi': 'Back to school', 'hari lagi': 'days to go',
    'Ujian, acara, dan libur akan muncul di sini.': 'Exams, events and holidays will show up here.', 'Hitung mundur baru': 'New countdown', 'Ubah hitung mundur': 'Edit countdown', 
    'Contoh: Study tour, lomba, ulang tahun': 'E.g. Study tour, competition, birthday', 'Ujian, acara sekolah, dan libur sudah otomatis muncul di hitung mundur.': 'Exams, school events and holidays already show up in the countdown automatically.', 'Warna': 'Colour',
    'Bagikan jadwal': 'Share timetable', 'Minggu ini': 'This week', 'Minggu depan': 'Next week', '2 minggu': '2 weeks', 'Sertakan jadwal ujian': 'Include exams', 'Bagikan link': 'Share link', 'Salin link': 'Copy link',
    'Teman cukup memindai QR ini dengan kamera HP, lalu membuka link-nya.': 'Friends just scan this QR with their phone camera and open the link.', 'Terima jadwal teman': 'Get a friend\'s timetable',
    'Belum ada jadwal di rentang ini': 'No timetable in this range yet', 'Jadwal terlalu panjang untuk satu QR. Pilih rentang yang lebih pendek, atau bagikan lewat link.': 'This timetable is too long for one QR. Pick a shorter range, or share the link instead.',
    '{0} hari': n => n === 1 ? '1 day' : `${n} days`, 'Jadwal pelajaran dari {0}': 'Timetable from {0}', 'Link disalin': 'Link copied', 'Gagal menyalin': 'Couldn\'t copy',
    'Menyalakan kamera…': 'Starting camera…', 'Pilih foto QR': 'Choose QR photo', 'Pindai QR teman dengan aplikasi Kamera HP atau Google Lens, lalu buka link yang muncul. Jadwalnya langsung masuk ke remind+.': 'Scan your friend\'s QR with your phone\'s Camera app or Google Lens, then open the link. The timetable goes straight into remind+.',
    'Atau tempel link jadwal': 'Or paste a timetable link', 'Ini bukan QR jadwal remind+': 'This isn\'t a remind+ timetable QR', 'Kamera tidak bisa dibuka. Pilih foto QR saja.': 'Couldn\'t open the camera. Choose a QR photo instead.',
    'Membaca foto…': 'Reading photo…', 'QR tidak terbaca. Coba foto yang lebih jelas.': 'Couldn\'t read the QR. Try a clearer photo.', 'Link jadwal rusak atau tidak lengkap': 'This timetable link is broken or incomplete', 'Link jadwal ini kosong': 'This timetable link is empty',
    'Mapel': 'Subject', 'Terima jadwal': 'Receive timetable', 'Dari {0}': 'From {0}', 'sudah ada': 'already filled', 'Isi hari kosong saja': 'Only fill empty days', 'Timpa semua': 'Replace all',
    'Tambahkan {0} ujian': n => n === 1 ? 'Add 1 exam' : `Add ${n} exams`, 'Catatan: satu sesi di jadwal ini {0} menit, sedangkan milikmu {1} menit.': 'Note: one session in this timetable is {0} minutes, yours is {1} minutes.', 'Terima': 'Accept',
    'Jadwal diterima · {0} hari': n => n === 1 ? 'Timetable received · 1 day' : `Timetable received · ${n} days`, 'Bagikan lewat QR': 'Share via QR',
    /* ---------- data bawaan (nama awal) ---------- */
    'Mudah': 'Easy', 'Sedang': 'Medium', 'Sulit': 'Hard', 'Ekstrem': 'Extreme',
    'Pemula': 'Beginner', 'Rajin': 'Diligent', 'Tekun': 'Persistent', 'Disiplin': 'Disciplined', 'Mandiri': 'Independent',
    'Main game 1 jam': 'Play games for 1 hour', 'Nonton 1 film': 'Watch a movie', 'Jajan favorit': 'Favourite snack'
  };

  const fill = (str, v) => str.replace(/\{(\d+)\}/g, (m, i) => (v[i] === undefined ? m : v[i]));
  function render(key, vals) {
    const e = L === 'en' ? EN[key] : undefined;
    if (e === undefined) return fill(key, vals);
    return typeof e === 'function' ? e(...vals) : fill(e, vals);
  }
  /* tx('teks') → terjemahan, atau teks aslinya */
  const tx = str => { if (L !== 'en' || str == null) return str; const e = EN[str]; return typeof e === 'string' ? e : str; };
  /* T`Halo ${nama}` → kunci "Halo {0}" */
  const T = (strs, ...vals) => { let k = strs[0]; for (let i = 1; i < strs.length; i++) k += '{' + (i - 1) + '}' + strs[i]; return render(k, vals); };

  /* Riwayat poin disimpan dalam Bahasa Indonesia; diterjemahkan saat ditampilkan */
  const LOGRX = [
    [/^Tugas: (.*?) \(terlambat\)$/, (m, a) => `Task: ${a} (late)`],
    [/^Tugas: (.*)$/, (m, a) => `Task: ${a}`],
    [/^Belajar (\d+) menit(?:: (.*))?$/, (m, a, b) => `Studied ${a} min` + (b ? ': ' + b : '')],
    [/^Bonus belajar sebelum ujian: (.*)$/, (m, a) => `Pre-exam study bonus: ${a}`],
    [/^Bayar (.*) tepat waktu \((.*)\)$/, (m, a, b) => `Paid ${a} on time (${b})`],
    [/^Pengingat: (.*)$/, (m, a) => `Reminder: ${a}`],
    [/^Reward: (.*)$/, (m, a) => `Reward: ${tx(a)}`],
    [/^Koreksi: manual$/, () => 'Adjustment: manual'],
    [/^Topik ujian: (.*)$/, (m, a) => `Exam topic: ${a}`],
    [/^Pembeku streak$/, () => 'Streak freeze'],
    [/^Koreksi: (.*)$/, (m, a) => `Adjustment: ${a}`],
    [/^(Top-up game|Belanja|Jajan \/ makan|Hiburan|Lainnya)(.*)$/, (m, a, b) => tx(a) + b]
  ];
  const logWhat = w => { if (L !== 'en' || !w) return w; for (const [r, f] of LOGRX) if (r.test(w)) return w.replace(r, f); return w; };

  /* Penerjemah layar: teks statis & atribut yang cocok persis dengan kamus */
  const ATTRS = ['placeholder', 'title', 'aria-label'];
  const SKIP = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1 };
  function trText(n) {
    const v = n.nodeValue, k = v.trim();
    if (!k || k.length > 400) return;
    const e = EN[k];
    if (typeof e === 'string' && e !== k) n.nodeValue = v.replace(k, e);
  }
  function trAttrs(el) {
    for (const a of ATTRS) { const v = el.getAttribute(a); if (v) { const e = EN[v.trim()]; if (typeof e === 'string' && e !== v) el.setAttribute(a, e); } }
  }
  function walk(root) {
    if (!root) return;
    if (root.nodeType === 3) { if (!(root.parentNode && SKIP[root.parentNode.nodeName])) trText(root); return; }
    if (root.nodeType !== 1) return;
    if (SKIP[root.nodeName]) { trAttrs(root); return; }
    trAttrs(root);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
      acceptNode: n => { if (n.nodeType === 1 && SKIP[n.nodeName]) { trAttrs(n); return NodeFilter.FILTER_REJECT; } return NodeFilter.FILTER_ACCEPT; }
    });
    let n; while ((n = w.nextNode())) { if (n.nodeType === 3) trText(n); else trAttrs(n); }
  }
  function startObserver() {
    walk(document.body);
    new MutationObserver(recs => {
      for (const r of recs) {
        if (r.type === 'childList') r.addedNodes.forEach(walk);
        else if (r.type === 'characterData') { if (!(r.target.parentNode && SKIP[r.target.parentNode.nodeName])) trText(r.target); }
        else if (r.type === 'attributes') trAttrs(r.target);
      }
    }).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  }

  function setLang(l) {
    try { localStorage.setItem(KEY, l); } catch (e) {}
    location.reload();
  }

  document.documentElement.lang = L;
  if (L === 'en') startObserver();

  Object.assign(window, {
    LANG: L, LOC: L === 'en' ? 'en-GB' : 'id-ID', TS: L === 'en' ? ':' : '.',
    hhmm: v => (L === 'en' ? String(v || '') : String(v || '').replace(':', '.')),
    tx, T, logWhat, setLang, I18N_EN: EN
  });
})();
