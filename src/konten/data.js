// Konstanta dan data awal CMS @rafiberfilsafat.
// Data pengguna sendiri disimpan di localStorage (lihat store.js)
// file ini hanya berisi pilihan tetap dan contoh untuk pertama kali dibuka.

export const STATUS = [
  { id: 'ide',      label: 'Ide' },
  { id: 'naskah',   label: 'Naskah' },
  { id: 'produksi', label: 'Rekam & edit' },
  { id: 'siap',     label: 'Siap tayang' },
  { id: 'tayang',   label: 'Tayang' },
]

export const FORMAT = [
  { id: 'video',    label: 'Video' },
  { id: 'carousel', label: 'Carousel' },
]

/* Target porsi tiap pilar, dari rencana konten awal. */
export const PILAR = [
  { id: 'eksistensialisme', label: 'Eksistensialisme kerja', target: 60 },
  { id: 'nihilisme',        label: 'Nihilisme',              target: 30 },
  { id: 'jernih',           label: 'Berpikir jernih',        target: 10 },
]

export const JENIS_SLIDE = [
  { id: 'sampul',  label: 'Sampul' },
  { id: 'isi',     label: 'Isi' },
  { id: 'kutipan', label: 'Kutipan' },
  { id: 'penutup', label: 'Penutup' },
]

export const METRIK = [
  { id: 'tayangan', label: 'Tayangan' },
  { id: 'suka',     label: 'Suka' },
  { id: 'komentar', label: 'Komentar' },
  { id: 'simpan',   label: 'Simpan' },
  { id: 'bagikan',  label: 'Bagikan' },
]

/* Kata kunci SFX untuk saran di kolom audio. Bahasa Inggris karena
   pencarian di CapCut, Pixabay, dan Freesound lebih lengkap begitu. */
export const SFX = [
  'cinematic boom', 'deep impact', 'alarm clock', 'car horn traffic', 'keyboard typing',
  'door close', 'tape rewind', 'clock ticking', 'stone dragging', 'rock rolling down',
  'low drone', 'dark ambient pad', 'heartbeat slow', 'low hum', 'cinematic swell', 'riser',
  'coffee pouring', 'page turning', 'single piano note', 'soft chime', 'whoosh',
  'Hening', 'Musik berhenti mendadak', 'Musik memudar',
]

export const PROFIL_AWAL = {
  handle: 'rafiberfilsafat',
  nama: 'Rafi | Filsafat Sehari-hari',
  bio: 'Kalau hidup tak bermakna, kenapa kita tetap bangun pagi? 🪨',
  targetMingguan: 3,
}

const sekarang = () => new Date().toISOString()

export const buatId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

export function kontenBaru(awal = {}) {
  return {
    id: buatId(),
    judul: '',
    format: 'video',
    pilar: 'eksistensialisme',
    status: 'ide',
    jadwal: '',
    hook: '',
    musik: '',
    tema: 'gelap',
    adegan: [],
    slide: [],
    caption: '',
    hashtag: '',
    catatan: '',
    metrik: { tayangan: '', suka: '', komentar: '', simpan: '', bagikan: '' },
    dibuat: sekarang(),
    diubah: sekarang(),
    ...awal,
  }
}

export const adeganBaru = (awal = {}) => ({
  id: buatId(), waktu: '', ucapan: '', teks: '', visual: '', audio: '', ...awal,
})

export const slideBaru = (awal = {}) => ({
  id: buatId(), jenis: 'isi', judul: '', isi: '', ...awal,
})

/* Jadwal disimpan sebagai string datetime-local ("2026-10-21T19:30"),
   yang dibaca new Date() sebagai waktu lokal. */
function hariIni(tambahHari, jam) {
  const d = new Date()
  d.setDate(d.getDate() + tambahHari)
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${jam}`
}

const A = (waktu, ucapan, teks, visual, audio) => adeganBaru({ waktu, ucapan, teks, visual, audio })

export function dataAwal() {
  const video1 = kontenBaru({
    judul: 'Kenapa kita tetap bangun pagi?',
    format: 'video',
    pilar: 'eksistensialisme',
    status: 'naskah',
    jadwal: hariIni(1, '19:30'),
    hook: 'Kalau hidup memang nggak ada artinya... kenapa kamu tetap bangun pagi buat kerja?',
    musik: 'Gymnopédie No. 1 (Erik Satie) atau "ambient piano melancholic", volume 10-15%',
    adegan: [
      A('0-4', 'Kalau hidup memang nggak ada artinya... kenapa kamu tetap bangun pagi buat kerja?',
        'Kalau hidup tak bermakna, kenapa kita tetap bangun pagi?', 'Wajah dari dekat, menatap kamera',
        'Tanpa musik. Setelah kalimat: cinematic boom (pelan), lalu musik masuk'),
      A('4-5', 'Bangun.', 'Bangun', 'Wajah / jam weker', 'alarm clock (0,5 dtk) + clock ticking pelan'),
      A('5-6', 'Macet.', '→ Macet', 'Wajah / jalan macet', 'car horn traffic'),
      A('6-7', 'Kerja.', '→ Kerja', 'Wajah / layar laptop', 'keyboard typing'),
      A('7-8', 'Pulang.', '→ Pulang', 'Wajah', 'door close'),
      A('8-9', 'Tidur.', '→ Tidur', 'Wajah', 'Hening (ticking tetap ada)'),
      A('9-10', 'Besoknya... ulang lagi.', '🔁', 'Wajah', 'tape rewind'),
      A('10-15', 'Pernah nggak, di tengah rutinitas itu, kamu tiba-tiba mikir: sebenarnya ini semua buat apa?',
        'Sebenarnya ini semua buat apa?', 'Wajah, nada pelan', 'Ticking berhenti, musik saja'),
      A('15-20', 'Di mitologi Yunani, ada seorang bernama Sisifus. Dia dihukum dewa untuk mendorong batu besar ke puncak gunung.',
        'Sisifus: dihukum mendorong batu. Selamanya.', 'Lukisan Sisyphus (Titian), zoom pelan',
        'stone dragging + low drone di bawah musik'),
      A('20-25', 'Begitu sampai di atas... batunya menggelinding turun lagi. Dan dia harus mulai dari awal. Selamanya.',
        '(teks tetap)', 'Lukisan, gerakan kamera ke bawah', 'rock rolling down (biarkan terdengar jelas)'),
      A('25-30', 'Kedengarannya familiar? Itu kita. Setiap hari Senin.', 'Itu kita. Setiap Senin.',
        'Kembali ke wajah', 'Musik berhenti mendadak di "Itu kita.", hening 1 dtk, lalu musik masuk lagi'),
      A('30-37', 'Kalau hidup memang seabsurd itu, kita punya dua pilihan. Pertama: menyerah. Jalanin hidup setengah hati, mati rasa, mode autopilot.',
        '❌ Menyerah: hidup autopilot', 'Wajah, ekspresi datar', 'heartbeat slow / low hum'),
      A('37-45', 'Atau kedua, kata filsuf Albert Camus: memberontak. Bukan dengan kabur dari batunya... tapi dengan sadar penuh saat mendorongnya.',
        '✊ Memberontak: sadar penuh menjalaninya (Camus)', 'Wajah, lebih tegas', 'cinematic swell / riser'),
      A('45-50', 'Mungkin makna bukan sesuatu yang menunggu di puncak gunung. Mungkin makna ada di cara kita mendorong batunya.',
        'Makna bukan di puncak. Makna ada di cara kita mendorong.', 'Wajah', 'Musik berubah lebih hangat (piano)'),
      A('50-60', 'Kopi pagi yang benar-benar kamu nikmati. Rekan kerja yang kamu bantu. Buku yang kamu baca sepulang kantor.',
        '☕ Kopi pagi · 🤝 Rekan kerja · 📖 Buku', 'Wajah / potongan kopi, buku', 'coffee pouring, page turning'),
      A('60-66', 'Camus menutup tulisannya dengan satu kalimat: "Kita harus membayangkan Sisifus bahagia."',
        '"Kita harus membayangkan Sisifus bahagia." (Albert Camus)', 'Wajah / lukisan Sisifus', 'Musik naik sampai sekitar 20%'),
      A('66-68', '...Bahkan di hari Senin. (senyum tipis)', '...bahkan di hari Senin. 🪨', 'Wajah, senyum tipis',
        'Hening sejenak, lalu single piano note'),
      A('68-72', 'Kalau kamu juga lagi mendorong batu, follow. Kita dorong bareng.', 'Follow @rafiberfilsafat 🪨',
        'Wajah', 'Musik memudar sampai habis'),
    ],
    caption:
      'Bangun, kerja, pulang, ulang. Pernah ngerasa hidup kayak Sisifus? 🪨\nCamus punya jawaban yang menarik. Kamu sendiri, apa yang bikin kamu tetap bangun pagi? Tulis di komentar.',
    hashtag: '#filsafat #eksistensialisme #albertcamus #sisifus #maknahidup #quarterlifecrisis #kerjakantoran #fyp',
    catatan: 'Video perkenalan. Setelah tayang, sematkan di profil karena menjawab pertanyaan di bio.',
  })

  const carousel1 = kontenBaru({
    judul: '5 buku eksistensialis untuk pemula',
    format: 'carousel',
    pilar: 'eksistensialisme',
    status: 'naskah',
    jadwal: hariIni(3, '19:30'),
    hook: '5 buku eksistensialis untuk pemula, diurutkan dari yang paling ringan.',
    slide: [
      slideBaru({ jenis: 'sampul', judul: '5 buku eksistensialis untuk pemula', isi: 'Diurutkan dari yang paling ringan.' }),
      slideBaru({ judul: '1. Orang Asing\nAlbert Camus', isi: 'Novel tipis tentang Meursault, pria yang menolak berpura-pura merasakan apa yang tidak ia rasakan. Pintu masuk paling ringan ke absurdisme.' }),
      slideBaru({ judul: "2. Man's Search for Meaning\nViktor Frankl", isi: 'Psikiater yang selamat dari kamp konsentrasi Nazi menulis tentang makna di tengah penderitaan. Paling dekat dengan psikologi.' }),
      slideBaru({ judul: '3. Eksistensialisme adalah Humanisme\nJean-Paul Sartre', isi: 'Ceramah pendek Sartre: kita tidak lahir dengan tujuan. Kita menciptakannya lewat pilihan.' }),
      slideBaru({ judul: '4. Mitos Sisifus\nAlbert Camus', isi: 'Esai tentang absurditas dan pemberontakan. Dari sinilah kalimat "Kita harus membayangkan Sisifus bahagia" berasal.' }),
      slideBaru({ judul: '5. Catatan dari Bawah Tanah\nFyodor Dostoevsky', isi: 'Monolog pahit seorang pria yang muak pada rasionalitas modern. Paling berat, tapi jujur sekali.' }),
      slideBaru({ jenis: 'penutup', judul: 'Mulai dari yang mana?', isi: 'Tulis di komentar. Simpan carousel ini untuk daftar bacaanmu.' }),
    ],
    caption: 'Bingung mau mulai baca filsafat eksistensialis dari mana? Ini lima buku, dari yang paling ringan. Kamu sudah baca yang mana? 🪨',
    hashtag: '#filsafat #eksistensialisme #rekomendasibuku #albertcamus #sartre #bacabuku',
  })

  const ide = [
    ['Nihilisme pasif vs aktif', 'nihilisme',
      'Dua orang sama-sama merasa hidup hampa. Satu menyerah, satu malah merasa bebas. Bedanya apa?'],
    ['Sartre: dikutuk untuk bebas', 'eksistensialisme',
      'Kenapa memilih karier terasa seberat ini? Sartre punya jawabannya.'],
    ['Bad faith: "ya mau gimana lagi"', 'eksistensialisme',
      '"Ya mau gimana lagi, namanya juga kerjaan." Menurut Sartre, kalimat ini adalah bentuk menipu diri.'],
    ['Kierkegaard dan quarter-life crisis', 'eksistensialisme',
      'Cemas soal masa depan di usia 20-an? Kierkegaard bilang itu tanda kamu bebas.'],
    ['Stock opname hidup', 'eksistensialisme',
      'Aku kerja di inventory control. Ternyata hidup juga butuh stock opname.'],
    ['Kenapa konten motivasi bikin makin hampa', 'jernih',
      'Semakin banyak nonton konten motivasi, kok hidup makin terasa kosong?'],
    ['Satu Kalimat, Satu Filsuf: Nietzsche', 'nihilisme',
      '"Tuhan sudah mati." Nietzsche tidak sedang merayakan. Dia sedang khawatir.'],
  ].map(([judul, pilar, hook]) => kontenBaru({ judul, pilar, hook }))

  return { versi: 1, profil: { ...PROFIL_AWAL }, konten: [video1, carousel1, ...ide] }
}
