// Penjelasan mendalam per bab TOEFL, dipasangkan dengan LESSONS di toeflGrammar.js lewat id.
// `rules[i]` melengkapi `LESSONS[x].rules[i]` (urutan harus sama).
// `parts`: kalimat yang dibedah — [teks, peran]. Peran: S, V, O, K, C, X (lihat ROLES).
// Teks di antara **…** ditampilkan tebal.

export const ROLES = {
  S: { label: 'Subject', color: '#0071E3' },
  V: { label: 'Verb', color: '#34C759' },
  O: { label: 'Object / Pelengkap', color: '#AF52DE' },
  K: { label: 'Keterangan', color: '#8E8E93' },
  C: { label: 'Penghubung', color: '#FF9F0A' },
  X: { label: 'Salah', color: '#FF375F' },
}

export const EXPLAIN = {
  'subject-verb': {
    concepts: [
      { term: 'Subject (S)', meaning: 'Pelaku atau "siapa/apa" yang dibicarakan. Biasanya noun (benda/orang) atau pronoun (I, you, he, she, it, we, they).', example: '**The students** study.' },
      { term: 'Verb (V)', meaning: 'Kata kerja utama yang menunjukkan aksi atau keadaan, dan punya "waktu" (sekarang/lampau). Contoh: study, studied, is, was, can go.', example: 'The students **study**.' },
      { term: 'Clause', meaning: 'Sekelompok kata yang punya subject DAN verb sendiri. Satu kalimat bisa berisi satu clause atau lebih.', example: '**She sleeps** / **because she is tired**' },
      { term: 'Preposition', meaning: 'Kata depan: in, on, at, of, with, for, from, by, during, after… Noun yang mengikutinya membentuk "prepositional phrase" (keterangan).', example: '**in the library**, **with his friends**' },
      { term: 'Participle', meaning: 'Bentuk verb V-ing (running) atau V3 (written). Bentuk ini TIDAK punya waktu, jadi tidak bisa jadi verb utama sendirian.', example: 'running, written, taken' },
    ],
    rules: [
      {
        explain: [
          'Bayangkan kalimat seperti mobil: **subject** adalah sopirnya, **verb** adalah mesinnya. Tanpa salah satunya, mobil tidak jalan — kalimatnya tidak sah dalam bahasa Inggris.',
          'Dalam bahasa Indonesia kita sering menghilangkan verb ("Dia guru"), tapi bahasa Inggris wajib punya verb: "She **is** a teacher".',
          'Di TOEFL Structure, kalimat soal sering sengaja dibuat **kehilangan subject, verb, atau keduanya**. Tugasmu: cek apa yang kurang, lalu pilih opsi yang mengisinya — tidak kurang, tidak lebih.',
        ],
        parts: [['The students', 'S'], ['study', 'V'], ['English', 'O'], ['every morning', 'K']],
      },
      {
        explain: [
          'Kalimat sering diawali frasa preposisi seperti "In the morning", "With his friends", "Of all the planets". Noun di dalamnya (morning, friends, planets) **terlihat seperti subject, tapi bukan**.',
          'Trik: **tutup/coret** semua frasa yang diawali preposisi. Yang tersisa adalah inti kalimat. Kalau setelah dicoret tidak ada subject, berarti jawabanmu harus menyediakan subject.',
        ],
        parts: [['With his friends,', 'K'], ['he', 'S'], ['went', 'V'], ['to the beach', 'K']],
      },
      {
        explain: [
          'V-ing (running) dan V3 (written) disebut participle. Mereka tidak menunjukkan kapan kejadiannya, jadi **tidak bisa berdiri sendiri sebagai verb utama**.',
          'Supaya bisa jadi verb utama, participle harus dibantu: **be + V-ing** (is running, was running), **have + V3** (has written), atau **be + V3** untuk pasif (was written). Alternatifnya, ganti ke bentuk biasa: runs / ran.',
          'Jadi kalau di soal kamu melihat "The boy running in the park." — ini belum kalimat utuh, hanya frasa "anak yang berlari di taman".',
        ],
        parts: [['The boy', 'S'], ['running', 'X'], ['in the park', 'K']],
        more: [
          { ok: true, text: 'The boy is running in the park.', note: 'is + V-ing → verb utama lengkap.' },
          { ok: true, text: 'The boy running in the park is my brother.', note: '"running in the park" hanya keterangan; verb utamanya "is".' },
        ],
      },
      {
        explain: [
          'Dalam bahasa lisan Indonesia kita biasa bilang "Kakak saya, **dia** kerja di bank". Dalam bahasa Inggris formal ini salah: subject hanya boleh disebut **sekali**.',
          'Kalau subject sudah ada (My brother), jangan tambahkan he/she/it/they tepat sesudahnya. Di Structure, opsi yang mengandung "it was…", "they are…" sering menjadi jebakan dobel subject.',
        ],
        parts: [['My brother', 'S'], ['he', 'X'], ['works', 'V'], ['at a bank', 'K']],
      },
    ],
    walkthrough: {
      q: 'With its sharp claws, ____ easily climb trees.',
      options: ['the leopard can', 'can the leopard', "the leopard's", 'the leopard being'],
      answer: 0,
      steps: [
        'Coret frasa preposisi: "With its sharp claws" → sisa: "____ easily climb trees."',
        'Cek yang ada: "climb" adalah verb dasar, tapi belum ada subject, dan verb dasar setelah subject tunggal butuh penolong (can/will).',
        'Jadi yang kurang: **subject + penolong verb**. Opsi A "the leopard can" memberi keduanya dengan urutan pernyataan.',
        'B salah (urutan pertanyaan), C hanya kepemilikan tanpa verb, D "being" bukan verb utama.',
      ],
    },
  },

  agreement: {
    concepts: [
      { term: 'Singular', meaning: 'Satu (a book, the man, she, it). Di present tense, verb untuk he/she/it/singular memakai **-s**: works, is, has, does.', example: 'The dog **barks**.' },
      { term: 'Plural', meaning: 'Lebih dari satu (books, the men, they). Verb-nya TANPA -s: work, are, have, do.', example: 'The dogs **bark**.' },
      { term: 'Agreement', meaning: '"Kecocokan": jumlah subject menentukan bentuk verb. Ingat kebalikannya: noun plural pakai -s, verb singular pakai -s.', example: 'dogs bark / a dog barks' },
      { term: 'Head noun', meaning: 'Noun inti dari subject. Pada "The box of apples", head noun-nya **box** — apples hanya keterangan.', example: '**The box** of apples' },
    ],
    rules: [
      {
        explain: [
          'TOEFL suka menaruh "pengalih" di antara subject dan verb supaya kamu tertipu oleh noun yang paling dekat dengan verb.',
          'Cara: temukan **head noun** (noun pertama sebelum preposisi of/in/with atau sebelum who/which), lalu cocokkan verb dengan noun itu saja.',
          'Pada "The box of apples **is** heavy", yang berat adalah kotaknya (satu) — bukan apelnya.',
        ],
        parts: [['The box', 'S'], ['of apples', 'K'], ['is', 'V'], ['heavy', 'O']],
        more: [
          { ok: false, text: 'The results of the experiment was surprising.', note: 'Head noun "results" plural → were.' },
          { ok: true, text: 'The teacher who taught my sisters is retiring.', note: 'Head noun "teacher" singular → is.' },
        ],
      },
      {
        explain: [
          'Kata-kata seperti each, every, everyone, someone, nobody, anything selalu dianggap **satu** — walaupun maknanya terasa banyak.',
          'Pola **each of / one of / neither of + noun plural** tetap singular, karena yang dihitung adalah "each/one/neither"-nya. "One of the students **is**…" (satu dari para siswa).',
        ],
        parts: [['Each', 'S'], ['of the students', 'K'], ['has', 'V'], ['a book', 'O']],
      },
      {
        explain: [
          '**The number of** = "jumlah dari" → satu angka → singular. "The number of cars **is** increasing" (angkanya naik).',
          '**A number of** = "sejumlah/banyak" → plural. "A number of cars **are** parked outside" (banyak mobil diparkir).',
          'Trik ingat: "the" = satu angka spesifik; "a number of" = sama dengan "many".',
        ],
        parts: [['A number of cars', 'S'], ['are', 'V'], ['parked outside', 'K']],
      },
      {
        explain: [
          'Dengan **either…or / neither…nor / not only…but also / or**, verb melihat subject yang **paling dekat** dengannya.',
          '"Neither the teacher nor the **students are**…" (students dekat → plural). Balik urutannya: "Neither the students nor the **teacher is**…".',
        ],
        parts: [['Neither the teacher nor', 'C'], ['the students', 'S'], ['are', 'V'], ['ready', 'O']],
      },
      {
        explain: [
          'Beda dengan "and"! "The manager **and** his staff **are**…" (dua pihak → plural).',
          'Tapi along with, as well as, together with, accompanied by, in addition to hanya **tambahan keterangan** — biasanya diapit koma. Abaikan, lalu ikuti subject pertama.',
        ],
        parts: [['The manager,', 'S'], ['along with his staff,', 'K'], ['is', 'V'], ['here', 'K']],
      },
      {
        explain: [
          'Pada kalimat "There is / There are", kata **there bukan subject sebenarnya**. Subject aslinya ada SETELAH verb.',
          '"There **is** a reason" (a reason = satu), "There **are** many reasons" (reasons = banyak). Lihat ke kanan, bukan ke kiri.',
        ],
        parts: [['There', 'K'], ['are', 'V'], ['many reasons', 'S']],
      },
    ],
    walkthrough: {
      q: 'The {{results}} of the {{survey}} {{was}} published {{last}} week.',
      answer: 2,
      steps: [
        'Cari head noun subject: "The results" — noun pertama sebelum "of".',
        '"of the survey" hanya keterangan, abaikan.',
        '"results" plural → verb harus plural: **were**, bukan "was".',
        'Jawaban: bagian C (was → were).',
      ],
    },
  },

  'verb-forms': {
    concepts: [
      { term: 'V1 / V2 / V3', meaning: 'Tiga bentuk verb: V1 = dasar (go, write), V2 = lampau (went, wrote), V3 = past participle (gone, written). Banyak verb tak beraturan — hafalkan.', example: 'go–went–gone, take–took–taken' },
      { term: 'Auxiliary (kata bantu)', meaning: 'Kata yang "memerintah" bentuk verb setelahnya: have/has/had, be (am/is/are/was/were/been), modal (can, will, must…).', example: '**has** + V3, **is** + V-ing, **can** + V1' },
      { term: 'Tense', meaning: 'Penanda waktu dalam verb: present (sekarang/kebiasaan), past (lampau, sudah selesai), perfect (ada hubungan dengan waktu lain).', example: 'She works / worked / has worked' },
    ],
    rules: [
      {
        explain: [
          'Setiap kali melihat **have / has / had** sebagai kata bantu, verb setelahnya WAJIB bentuk **V3**.',
          'Jebakan TOEFL paling sering: memakai V2 setelah have. "has **went**" ✗ → "has **gone**" ✓; "had **took**" ✗ → "had **taken**" ✓.',
          'Hafalkan V3 tak beraturan yang umum: begun, chosen, driven, eaten, fallen, flown, forgotten, given, grown, known, risen, seen, shown, spoken, stolen, written.',
        ],
        parts: [['She', 'S'], ['has', 'V'], ['gone', 'V'], ['home', 'K']],
      },
      {
        explain: [
          'Setelah bentuk **be** (am, is, are, was, were, be, been, being) hanya ada dua pilihan:',
          '• **V-ing** kalau subject sedang melakukan aksi (aktif progresif): "The man **is writing** a letter".',
          '• **V3** kalau subject dikenai aksi (pasif): "The letter **is written** by the man".',
          'Jadi "is write" atau "was wrote" pasti salah.',
        ],
        parts: [['The letter', 'S'], ['was', 'V'], ['written', 'V'], ['in 1920', 'K']],
      },
      {
        explain: [
          'Modal (can, could, will, would, shall, should, may, might, must) selalu diikuti **V1 polos** — tanpa to, tanpa -s, tanpa -ed, tanpa -ing.',
          '"She can **swims**" ✗, "must **to submit**" ✗, "should **went**" ✗. Yang benar: can swim, must submit, should go.',
          'Pengecualian bentuk: ought **to**, have **to**, be able **to** — tapi ini bukan modal murni.',
        ],
        parts: [['Students', 'S'], ['must', 'V'], ['submit', 'V'], ['the form', 'O']],
      },
      {
        explain: [
          'Bagian kalimat yang **tidak bergaris bawah** sering berisi penanda waktu — itu petunjuk tense yang benar.',
          '• **ago, yesterday, last year, in 1990** → simple past (V2): "She **moved** here in 1990".',
          '• **since, for, so far, up to now, recently** → present perfect (has/have + V3): "She **has lived** here since 1990".',
          '• **by the time + past, before + past** → past perfect (had + V3): "By the time we arrived, the film **had started**".',
        ],
        parts: [['She', 'S'], ['has lived', 'V'], ['here', 'K'], ['since 2015', 'K']],
      },
    ],
    walkthrough: {
      q: 'The museum {{has}} {{became}} one of the {{most}} popular attractions {{in}} the city.',
      answer: 1,
      steps: [
        'Lihat kata bantu "has" → setelahnya wajib V3.',
        '"became" adalah V2. V3 dari become adalah **become** (become–became–become).',
        'Jawaban: bagian B (became → become).',
      ],
    },
  },

  passive: {
    concepts: [
      { term: 'Kalimat aktif', meaning: 'Subject MELAKUKAN aksi. Seperti "me-" dalam bahasa Indonesia.', example: 'Ana **wrote** the letter. (Ana menulis)' },
      { term: 'Kalimat pasif', meaning: 'Subject DIKENAI aksi. Seperti "di-" dalam bahasa Indonesia. Rumus: be + V3.', example: 'The letter **was written** by Ana. (Surat ditulis)' },
      { term: 'Transitive verb', meaning: 'Verb yang butuh object (write something, build something). Hanya verb ini yang bisa dipasifkan.', example: 'build a house → a house is built' },
      { term: 'Intransitive verb', meaning: 'Verb tanpa object (happen, arrive, die, sleep). Tidak bisa dipasifkan.', example: 'It happened. (bukan "was happened")' },
    ],
    rules: [
      {
        explain: [
          'Passive selalu terdiri dari dua bagian: **be** (yang menunjukkan tense) + **V3** (yang menunjukkan aksinya).',
          'Pelaku (agent) boleh disebut dengan "by…", tapi sering dihilangkan kalau tidak penting.',
          'Bandingkan: "Ana **wrote** the letter" (aktif) → "The letter **was written** (by Ana)" (pasif). Object kalimat aktif pindah menjadi subject kalimat pasif.',
        ],
        parts: [['The letter', 'S'], ['was written', 'V'], ['by Ana', 'K']],
      },
      {
        explain: [
          'Cara paling gampang: terjemahkan ke bahasa Indonesia. Kalau terasa "**di-**", berarti pasif.',
          '"Rumah itu ___ tahun 1990" → rumah tidak membangun dirinya sendiri; rumah **dibangun** → "The house **was built** in 1990".',
          '"The house built in 1990" bisa benar HANYA jika itu frasa keterangan (rumah yang dibangun tahun 1990) dan ada verb utama lain setelahnya.',
        ],
        parts: [['The house', 'S'], ['was built', 'V'], ['in 1990', 'K']],
      },
      {
        explain: [
          'Verb seperti happen, occur, arise, exist, appear, disappear, die, rise, emerge, arrive, remain tidak punya object, sehingga **tidak bisa** diberi bentuk pasif.',
          'Orang Indonesia sering salah karena "terjadi" terasa pasif. Tapi "The accident **was happened**" ✗ → "The accident **happened**" ✓.',
          'Perhatikan juga: rise (naik, intransitif) vs raise (menaikkan, transitif). "Prices **rose**" ✓, "Prices **were raised** by the company" ✓.',
        ],
        parts: [['The accident', 'S'], ['happened', 'V'], ['last night', 'K']],
      },
      {
        explain: [
          'Rumusnya tetap be + V3; yang berubah hanya bentuk **be** sesuai tense:',
          '• Present: is/are **done** • Past: was/were **done** • Perfect: has/have/had **been done**',
          '• Progressive: is/was **being done** • Future/modal: will/can/must **be done**',
          'Jebakan: "has been build", "can be find", "is being make" — selalu cek bahwa kata terakhir adalah V3.',
        ],
        parts: [['The bridge', 'S'], ['has been repaired', 'V'], ['twice', 'K']],
      },
    ],
    walkthrough: {
      q: 'English ____ in many countries around the world.',
      options: ['speaks', 'is spoken', 'is speaking', 'has spoken'],
      answer: 1,
      steps: [
        'Subject: "English". Apakah bahasa Inggris berbicara? Tidak — bahasa Inggris **dibicarakan/dipakai**. Jadi pasif.',
        'Pasif = be + V3. V3 dari speak adalah spoken.',
        'Jawaban B "is spoken". A, C, D semuanya bentuk aktif.',
      ],
    },
  },

  parallel: {
    concepts: [
      { term: 'Parallel structure', meaning: 'Unsur-unsur yang disejajarkan (dalam daftar atau perbandingan) harus memakai bentuk kata yang sama.', example: 'reading, writing, and **swimming**' },
      { term: 'Coordinating conjunction', meaning: 'and, but, or — menyambung unsur yang setara.', example: 'quick **and** easy' },
      { term: 'Paired conjunction', meaning: 'Pasangan: both…and, either…or, neither…nor, not only…but also.', example: '**both** smart **and** kind' },
    ],
    rules: [
      {
        explain: [
          'Bayangkan barisan tentara: semua harus berseragam sama. Kalau satu unsur V-ing, semuanya V-ing; kalau noun, semuanya noun; kalau adjective, semuanya adjective.',
          '"She likes reading, writing, and **to swim**" ✗ → "…and **swimming**" ✓.',
          '"The job is challenging, interesting, and **pays well**" ✗ → "…and **well-paid**" ✓ (adjective semua).',
          'Di Written Expression, cek kata setelah "and/or/but" — lalu bandingkan dengan unsur sebelumnya.',
        ],
        parts: [['She likes', 'K'], ['reading,', 'O'], ['writing,', 'O'], ['and', 'C'], ['swimming', 'O']],
      },
      {
        explain: [
          'Pada pasangan konjungsi, lihat kata **tepat setelah** bagian pertama dan **tepat setelah** bagian kedua — keduanya harus berbentuk sama.',
          '"She is **not only** smart **but also** kind" ✓ (adjective–adjective).',
          '"She **not only** plays piano **but also** the violin" ✗ (verb vs noun) → "…plays **not only** the piano **but also** the violin" ✓.',
          'Juga pastikan pasangannya benar: both…**and** (bukan both…or), neither…**nor** (bukan neither…or).',
        ],
        parts: [['not only', 'C'], ['for its beauty', 'O'], ['but also', 'C'], ['for its history', 'O']],
      },
      {
        explain: [
          'Saat membandingkan (than, as…as, prefer…to), kedua hal yang dibandingkan harus **sejenis**.',
          '"Swimming is more fun than **to run**" ✗ → "…than **running**" ✓.',
          'Jebakan halus: "The climate of Bali is warmer than **Bandung**" ✗ — membandingkan iklim dengan kota. Yang benar: "…than **that of** Bandung".',
        ],
        parts: [['prefer', 'V'], ['reading', 'O'], ['to', 'C'], ['watching TV', 'O']],
      },
    ],
    walkthrough: {
      q: 'The new program is designed to be {{simple}}, {{efficient}}, and {{saving money}} {{for}} users.',
      answer: 2,
      steps: [
        'Cari daftar yang disambung "and": simple, efficient, and ____.',
        'Dua unsur pertama adjective → unsur ketiga juga harus adjective.',
        '"saving money" adalah frasa V-ing, tidak sejajar. Seharusnya **economical / affordable**.',
        'Jawaban: bagian C.',
      ],
    },
  },

  comparison: {
    concepts: [
      { term: 'Comparative', meaning: 'Membandingkan DUA hal: lebih … daripada. Selalu berpasangan dengan **than**.', example: 'taller **than**, more useful **than**' },
      { term: 'Superlative', meaning: 'Paling … di antara TIGA atau lebih. Selalu dengan **the**.', example: '**the** tallest, **the** most useful' },
      { term: 'Suku kata (syllable)', meaning: 'Adjective 1 suku kata (tall, fast) pakai -er/-est. 3+ suku kata (expensive) pakai more/most. Yang berakhiran -y (happy) jadi -ier/-iest.', example: 'happy → happier → happiest' },
      { term: 'Countable / Uncountable', meaning: 'Countable bisa dihitung (books, people). Uncountable tidak (water, money, information).', example: 'fewer books / less water' },
    ],
    rules: [
      {
        explain: [
          'Comparative dibentuk dengan **-er** (kata pendek) atau **more** (kata panjang), dan selalu diikuti "than" ketika hal pembandingnya disebut.',
          'Jebakan: "more taller", "taller as", "more better". Ingat: -er dan more tidak boleh dipakai bersamaan, dan pasangan comparative adalah **than**, bukan "as" atau "that".',
        ],
        parts: [['Jakarta', 'S'], ['is', 'V'], ['bigger than', 'O'], ['Bandung', 'O']],
      },
      {
        explain: [
          'Superlative menyatakan "paling", jadi butuh **the** dan kelompok pembanding (in the class, of all, in the world).',
          '"She is **tallest** girl" ✗ → "She is **the tallest** girl in the class" ✓.',
          'Kalau yang dibandingkan hanya dua, pakai comparative: "the **taller** of the two".',
        ],
        parts: [['Mount Everest', 'S'], ['is', 'V'], ['the highest mountain', 'O'], ['in the world', 'K']],
      },
      {
        explain: [
          'Pilih SATU cara: -er ATAU more; -est ATAU most. "more easier", "most fastest" selalu salah.',
          'Ini sering muncul di Written Expression karena kesalahannya kelihatan "wajar" saat dibaca cepat.',
        ],
        parts: [['more', 'X'], ['taller', 'O']],
      },
      {
        explain: [
          'Pola "**The + comparative …, the + comparative …**" artinya "semakin …, semakin …".',
          '"The harder you study, the better you score" = semakin keras belajar, semakin baik nilainya.',
          'Kedua bagian harus diawali **the + bentuk -er/more**. "The harder you study, **you score better**" ✗.',
        ],
        parts: [['The harder', 'C'], ['you study,', 'O'], ['the better', 'C'], ['you score', 'O']],
      },
      {
        explain: [
          '**as + adjective/adverb dasar + as** = "sama …-nya dengan". Tidak boleh pakai bentuk -er di tengah: "as taller as" ✗.',
          'Irregular yang harus dihafal: good–**better**–**best**, bad–**worse**–**worst**, many/much–**more**–**most**, little–**less**–**least**, far–**farther/further**–**farthest/furthest**.',
        ],
        parts: [['He', 'S'], ['is', 'V'], ['as tall as', 'O'], ['his father', 'O']],
      },
      {
        explain: [
          '**fewer** untuk benda yang bisa dihitung (plural): fewer books, fewer people, fewer mistakes.',
          '**less** untuk yang tidak bisa dihitung: less water, less time, less money.',
          'Sama halnya: **many** (countable) vs **much** (uncountable), **number** vs **amount**.',
        ],
        parts: [['fewer', 'C'], ['cars', 'O'], ['/', 'K'], ['less', 'C'], ['traffic', 'O']],
      },
    ],
    walkthrough: {
      q: 'Of all the planets, Jupiter is ____.',
      options: ['larger', 'the largest', 'more large', 'the most large'],
      answer: 1,
      steps: [
        '"Of all the planets" → dibandingkan dengan banyak (lebih dari dua) → superlative.',
        'large adalah kata pendek → the + -est.',
        'Jawaban B "the largest". C dan D salah bentuk; A comparative.',
      ],
    },
  },

  'gerund-infinitive': {
    concepts: [
      { term: 'Gerund', meaning: 'V-ing yang berfungsi sebagai **noun** (nama aktivitas). "Swimming" = kegiatan berenang.', example: '**Swimming** is fun.' },
      { term: 'Infinitive', meaning: 'to + V1. Sering menyatakan tujuan, rencana, atau sesuatu yang akan dilakukan.', example: 'I want **to swim**.' },
      { term: 'Preposition', meaning: 'Kata depan (in, on, at, of, about, for, without, before, after, to…). Setelahnya harus noun atau gerund.', example: 'good **at** swimming' },
    ],
    rules: [
      {
        explain: [
          'Verb di daftar ini harus diikuti **V-ing**: enjoy, avoid, finish, consider, suggest, mind, deny, keep, practice, admit, risk, postpone, miss, quit, recommend, appreciate.',
          'Polanya cenderung: aktivitas yang **sedang/sudah** dialami atau dipertimbangkan.',
          '"I enjoy **to read**" ✗ → "I enjoy **reading**" ✓. "She suggested **to go**" ✗ → "She suggested **going**" ✓.',
        ],
        parts: [['I', 'S'], ['enjoy', 'V'], ['reading novels', 'O']],
      },
      {
        explain: [
          'Verb di daftar ini harus diikuti **to + V1**: want, decide, plan, hope, agree, refuse, promise, need, fail, expect, afford, manage, seem, learn, offer, tend, choose.',
          'Polanya cenderung: sesuatu yang **akan** dilakukan (rencana, keinginan, keputusan).',
          '"They decided **going**" ✗ → "They decided **to go**" ✓.',
        ],
        parts: [['They', 'S'], ['decided', 'V'], ['to postpone the trip', 'O']],
      },
      {
        explain: [
          'Setelah preposisi apa pun, verb harus menjadi **V-ing**: interested **in learning**, good **at singing**, **before leaving**, **without saying**.',
          'Jebakan besar: "**to**" bisa preposisi! Pada frasa berikut, "to" adalah preposisi sehingga diikuti V-ing: look forward to, be used to, get used to, object to, be committed to, be devoted to, contribute to, in addition to.',
          '"I look forward to **meet** you" ✗ → "…to **meeting** you" ✓.',
          'Tes cepat: coba ganti dengan noun. "look forward to **the party**" masuk akal → "to" preposisi → pakai V-ing.',
        ],
        parts: [['She', 'S'], ['is interested', 'V'], ['in', 'C'], ['learning Korean', 'O']],
      },
      {
        explain: [
          'Kalau sebuah aktivitas menjadi subject kalimat, gunakan **gerund** (V-ing). Verb setelahnya singular.',
          '"**Exercise** regularly is healthy" ✗ (exercise di sini verb dasar) → "**Exercising** regularly **is** healthy" ✓.',
          '"To exercise is healthy" secara grammar mungkin, tapi di TOEFL bentuk gerund jauh lebih umum.',
        ],
        parts: [['Exercising regularly', 'S'], ['is', 'V'], ['healthy', 'O']],
      },
      {
        explain: [
          'Untuk menyatakan **tujuan** ("untuk/agar"), pakai to + V1 — bukan "for + V-ing" dan bukan "for to".',
          '"She came **for helping** me" ✗ → "She came **to help** me" ✓.',
          'Bentuk lain yang benar: "in order to help", "so as to help".',
        ],
        parts: [['She', 'S'], ['came', 'V'], ['to help us', 'K']],
      },
    ],
    walkthrough: {
      q: 'Many residents objected {{to}} {{build}} a new airport {{near}} the {{city}}.',
      answer: 1,
      steps: [
        '"object to" adalah frasa dengan "to" sebagai **preposisi** (bisa diganti: objected to the plan).',
        'Setelah preposisi → V-ing. Jadi "build" harus "**building**".',
        'Jawaban: bagian B.',
      ],
    },
  },

  'adjective-clause': {
    concepts: [
      { term: 'Adjective clause', meaning: 'Clause yang menjelaskan sebuah noun, seperti "yang…" dalam bahasa Indonesia.', example: 'the man **who lives next door**' },
      { term: 'Relative pronoun', meaning: 'Kata pembuka adjective clause: who, whom, which, that, whose, where, when. Ia menggantikan noun yang dijelaskan.', example: 'the book **which** I bought' },
      { term: 'Defining vs non-defining', meaning: 'Defining (tanpa koma) membatasi noun mana yang dimaksud. Non-defining (dengan koma) hanya informasi tambahan.', example: 'my brother **who** lives… / Jakarta**, which** is…' },
    ],
    rules: [
      {
        explain: [
          'Pilih berdasarkan **noun yang dijelaskan** dan **perannya di dalam clause**:',
          '• **who** = orang, berperan sebagai subject di clause: "the man **who** called me".',
          '• **whom** = orang, berperan sebagai object: "the man **whom** I called". Tes: kalau setelahnya langsung ada subject lain (I, she, they), pakai whom.',
          '• **which** = benda/hewan. **that** = orang atau benda (hanya tanpa koma).',
          '• **whose** = milik (diikuti noun): "the girl **whose** bag was stolen".',
          '• **where** = tempat (diikuti S + V lengkap); **when** = waktu.',
        ],
        parts: [['The man', 'S'], ['who lives next door', 'K'], ['is', 'V'], ['a doctor', 'O']],
      },
      {
        explain: [
          'Relative pronoun sudah **menggantikan** noun-nya. Jadi di dalam clause jangan ada pronoun lagi yang menunjuk noun yang sama.',
          '"This is the book which I read **it** yesterday" ✗ — "which" sudah mewakili "the book", "it" berlebihan.',
          '"The woman who **she** called me" ✗ → "The woman who called me" ✓.',
        ],
        parts: [['the book', 'O'], ['which', 'C'], ['I read', 'S'], ['it', 'X']],
      },
      {
        explain: [
          'Kalau adjective clause diapit **koma**, itu informasi tambahan (non-defining). Di posisi ini **that tidak boleh** dipakai — gunakan which (benda) atau who (orang).',
          '"Jakarta, **that** is the capital, is crowded" ✗ → "Jakarta, **which** is the capital, is crowded" ✓.',
          'Tanpa koma, that dan which sama-sama boleh untuk benda.',
        ],
        parts: [['Jakarta,', 'S'], ['which is the capital,', 'K'], ['is', 'V'], ['crowded', 'O']],
      },
    ],
    walkthrough: {
      q: 'The scientist ____ discovered penicillin was Alexander Fleming.',
      options: ['which', 'who', 'whom', 'whose'],
      answer: 1,
      steps: [
        'Noun yang dijelaskan: "The scientist" → orang. Coret "which".',
        'Setelah kotak kosong langsung ada verb "discovered" → relative pronoun berperan sebagai **subject** clause.',
        'Orang + subject → **who**. "whom" untuk object, "whose" butuh noun setelahnya.',
      ],
    },
  },

  'noun-adverb-clause': {
    concepts: [
      { term: 'Noun clause', meaning: 'Clause yang menempati posisi noun (sebagai subject atau object). Diawali that, what, who, where, when, why, how, whether, if.', example: 'I know **where she lives**.' },
      { term: 'Adverb clause', meaning: 'Clause yang memberi keterangan waktu, sebab, syarat, atau pertentangan pada clause utama.', example: '**Because it rained**, we stayed home.' },
      { term: 'Connector', meaning: 'Kata penghubung clause (because, although, when, if, while…). Diikuti S + V lengkap.', example: '**although** she was tired' },
    ],
    rules: [
      {
        explain: [
          'Ketika kata tanya (what, where, how, why, who) atau whether/if dipakai **di tengah kalimat** sebagai noun clause, urutannya kembali ke urutan pernyataan: **S + V**.',
          '"I don\'t know where **does she live**" ✗ → "I don\'t know where **she lives**" ✓.',
          '"Can you tell me what **is the time**" ✗ → "…what **the time is**" ✓.',
          'Di TOEFL, opsi dengan urutan pertanyaan (aux sebelum subject) di tengah kalimat hampir selalu salah.',
        ],
        parts: [['I', 'S'], ['know', 'V'], ['where she lives', 'O']],
      },
      {
        explain: [
          'Noun clause bisa menjadi subject seluruh kalimat. Setelah noun clause itu selesai, **masih butuh verb utama**.',
          '"**That he lied** / **surprised** us" — subject = That he lied, verb = surprised.',
          '"**What she said** / **was** true", "**Whether** we go / **depends** on the weather". Verb utamanya singular.',
          'Soal Structure sering mengosongkan kata pembukanya: "____ he lied surprised us" → jawabannya "That".',
        ],
        parts: [['That he lied', 'S'], ['surprised', 'V'], ['everyone', 'O']],
      },
      {
        explain: [
          'Banyak connector punya "kembaran" yang maknanya sama tapi pola berbeda:',
          '• because / since / as + **S + V** ↔ because of / due to + **noun**',
          '• although / though / even though + **S + V** ↔ despite / in spite of + **noun**',
          '• while / when + **S + V** ↔ during + **noun**',
          'Cara memilih: lihat yang mengikuti. Ada verb → pakai connector clause. Hanya noun/frasa → pakai preposisi.',
        ],
        parts: [['Although', 'C'], ['it rained,', 'K'], ['we', 'S'], ['went out', 'V']],
        more: [
          { ok: true, text: 'Despite the rain, we went out.', note: '"the rain" hanya noun → despite.' },
          { ok: false, text: 'Despite it rained, we went out.', note: 'Ada S + V (it rained) → although.' },
        ],
      },
    ],
    walkthrough: {
      q: '____ the heavy traffic, she arrived on time.',
      options: ['Although', 'Despite', 'Because', 'Even though'],
      answer: 1,
      steps: [
        'Lihat yang mengikuti kotak: "the heavy traffic" → hanya noun phrase, tanpa verb.',
        'Maknanya pertentangan (macet, tapi tetap tepat waktu).',
        'Pertentangan + noun → **Despite**. Although/Even though butuh S + V; Because maknanya tidak cocok.',
      ],
    },
  },

  'reduced-clause': {
    concepts: [
      { term: 'Reduced clause', meaning: 'Adjective/adverb clause yang dipendekkan dengan membuang relative pronoun + be, menyisakan V-ing atau V3.', example: 'the man (who is) sitting there' },
      { term: 'Appositive', meaning: 'Noun phrase yang langsung menjelaskan noun di sebelahnya, biasanya diapit koma, tanpa verb.', example: 'Jupiter, **the largest planet**, …' },
      { term: 'Dangling modifier', meaning: 'Frasa pembuka yang "nyasar" karena subject setelahnya bukan pelaku yang dimaksud.', example: 'Walking home, **the rain** started ✗' },
    ],
    rules: [
      {
        explain: [
          'Kalau noun yang dijelaskan **melakukan** aksi, ringkasan clause-nya memakai **V-ing**.',
          '"The man **who is sitting** there is my uncle" → "The man **sitting** there is my uncle". Pria itu yang duduk (aktif).',
          '"Students **who want** to join…" → "Students **wanting** to join…".',
        ],
        parts: [['The man', 'S'], ['sitting there', 'K'], ['is', 'V'], ['my uncle', 'O']],
      },
      {
        explain: [
          'Kalau noun yang dijelaskan **dikenai** aksi, ringkasannya memakai **V3**.',
          '"The car **which was made** in Japan" → "The car **made** in Japan". Mobil dibuat (pasif).',
          'Tes "di-": kalau terjemahannya "yang di-…", pakai V3. Kalau "yang me-…", pakai V-ing.',
          '"The language **speaking** in Brazil is Portuguese" ✗ → bahasa itu **dituturkan** → "**spoken**" ✓.',
        ],
        parts: [['The car', 'S'], ['made in Japan', 'K'], ['is', 'V'], ['reliable', 'O']],
      },
      {
        explain: [
          'Appositive adalah "julukan" atau penjelasan berbentuk noun phrase, ditaruh di samping noun yang dijelaskan. Tidak ada verb di dalamnya.',
          '"Jupiter, **the largest planet in our solar system**, has 95 moons."',
          'Di Structure, kalau kalimat sudah punya subject + verb utama dan ada celah di antara koma, jawabannya sering appositive (noun phrase tanpa verb). Opsi yang memakai "it is…" atau "which it…" biasanya salah.',
        ],
        parts: [['Jupiter,', 'S'], ['the largest planet,', 'K'], ['has', 'V'], ['95 moons', 'O']],
      },
      {
        explain: [
          'Frasa V-ing/V3 di **awal** kalimat selalu menjelaskan **subject clause berikutnya**. Subject itu harus logis sebagai pelakunya.',
          '"Walking home, **the rain** started" ✗ — seolah-olah hujan yang berjalan pulang. → "Walking home, **I** got caught in the rain" ✓.',
          '"Written in 1850, **the novel** became…" ✓ — novel memang ditulis.',
          'Di Structure, pilih opsi yang menempatkan **pelaku yang tepat** langsung setelah koma.',
        ],
        parts: [['Walking home,', 'K'], ['I', 'S'], ['saw', 'V'], ['an old friend', 'O']],
      },
    ],
    walkthrough: {
      q: '____ in 1885, the Statue of Liberty was a gift from France.',
      options: ['Completing', 'Completed', 'It was completed', 'Was completed'],
      answer: 1,
      steps: [
        'Clause utama sudah lengkap: "the Statue of Liberty was a gift…". Celah hanya untuk frasa pembuka (tanpa subject/verb baru).',
        'Patung itu **diselesaikan** (pasif) → V3 "Completed".',
        'C menambah clause tanpa penghubung, D tidak punya subject, A bermakna aktif.',
      ],
    },
  },

  inversion: {
    concepts: [
      { term: 'Inversion', meaning: 'Membalik urutan: auxiliary (do/does/did, have, be, can…) diletakkan SEBELUM subject, seperti kalimat tanya — padahal ini kalimat pernyataan.', example: 'Never **have I** seen…' },
      { term: 'Auxiliary', meaning: 'Kata bantu: do/does/did, have/has/had, am/is/are/was/were, can/will/should, dll.', example: 'did, has, is, can' },
      { term: 'Urutan normal vs terbalik', meaning: 'Normal: S + aux + V ("I have seen"). Terbalik: aux + S + V ("have I seen").', example: 'I have seen → have I seen' },
    ],
    rules: [
      {
        explain: [
          'Kalau kalimat **diawali** kata/frasa bermakna negatif atau "jarang", clause utamanya wajib inversi.',
          'Kata pemicu: Never, Rarely, Seldom, Hardly, Scarcely, Barely, Little, Not only, No sooner, Nowhere, At no time, Under no circumstances, In no way.',
          'Kalau kalimat aslinya tidak punya auxiliary (simple present/past), munculkan **do/does/did**: "She rarely smiles" → "Rarely **does she smile**".',
          'Catatan: kalau kata itu tidak di awal, tidak ada inversi: "I have never seen…".',
        ],
        parts: [['Never', 'C'], ['have', 'V'], ['I', 'S'], ['seen', 'V'], ['such a view', 'O']],
      },
      {
        explain: [
          '"Only" + keterangan (Only after…, Only when…, Only if…, Only by…, Only in…, Only then) di awal kalimat → inversi terjadi di **clause utama**, bukan di clause keterangannya.',
          '"Only after the test **did they** realize the mistake."',
          'Perhatikan: "after the test" tidak dibalik; yang dibalik adalah "they realized" → "did they realize".',
        ],
        parts: [['Only after the test', 'K'], ['did', 'V'], ['they', 'S'], ['realize', 'V'], ['the mistake', 'O']],
      },
      {
        explain: [
          'Dalam bahasa formal, "if" bisa dihilangkan dengan membalik auxiliary-nya ke depan:',
          '• If I **had** known → **Had I** known',
          '• If I **were** you → **Were I** you',
          '• If you **should** need help → **Should you** need help',
          'Jebakan TOEFL: "**If had I** known" ✗ (dobel) atau "**Had I know**" ✗ (lupa V3).',
        ],
        parts: [['Had I known,', 'K'], ['I', 'S'], ['would have come', 'V']],
      },
      {
        explain: [
          'Untuk berkata "juga" pada kalimat positif: **so + aux + S**. "I like tea, and **so does she**."',
          'Untuk "juga tidak" pada kalimat negatif: **neither + aux + S**. "I can\'t swim, and **neither can he**."',
          'Aux-nya mengikuti tense dan jenis verb kalimat pertama: like → does, liked → did, can → can, have gone → has.',
        ],
        parts: [['I like tea,', 'K'], ['and so', 'C'], ['does', 'V'], ['she', 'S']],
      },
    ],
    walkthrough: {
      q: 'Rarely ____ such a beautiful sunset.',
      options: ['I have seen', 'have I seen', 'I saw', 'seen I have'],
      answer: 1,
      steps: [
        'Kalimat diawali kata negatif "Rarely" → wajib inversi.',
        'Inversi = aux + S + V → "have I seen".',
        'A dan C urutan normal (salah setelah Rarely), D urutannya kacau.',
      ],
    },
  },

  'word-form-pronoun': {
    concepts: [
      { term: 'Noun', meaning: 'Kata benda/konsep. Akhiran umum: -tion, -ment, -ness, -ity, -ance/-ence, -er/-or, -ism.', example: 'construction, development, happiness' },
      { term: 'Adjective', meaning: 'Menjelaskan noun. Akhiran umum: -ive, -ous, -ful, -al, -able, -ic, -less.', example: 'a **creative** idea' },
      { term: 'Adverb', meaning: 'Menjelaskan verb, adjective, atau adverb lain. Umumnya adjective + -ly.', example: 'speaks **clearly**, **extremely** hot' },
      { term: 'Pronoun', meaning: 'Pengganti noun. Subject: I, he, she, it, we, they. Object: me, him, her, it, us, them. Possessive: my, his, her, its, our, their.', example: 'She gave **him** **her** book.' },
    ],
    rules: [
      {
        explain: [
          'Tanya: kata itu menjelaskan apa?',
          '• Menjelaskan **noun** → adjective: "a **rapid** growth", "a **careful** driver".',
          '• Menjelaskan **verb** → adverb: "grew **rapidly**", "drives **carefully**".',
          '• Menjelaskan **adjective/adverb** → adverb: "**extremely** difficult", "**very** quickly".',
          'Pengecualian: setelah verb "keadaan" (be, seem, look, feel, become, taste, sound) pakai **adjective**: "She looks **happy**", bukan "happily".',
        ],
        parts: [['The economy', 'S'], ['grew', 'V'], ['rapidly', 'K']],
      },
      {
        explain: [
          'Posisi tertentu hampir selalu meminta **noun**:',
          '• setelah article: **the / a / an** ___ (the **construction**)',
          '• setelah possessive: **his / its / their** ___ (their **decision**)',
          '• setelah preposisi: **of / in / for** ___ (of **importance**)',
          '• setelah adjective: a beautiful ___ (a beautiful **creation**)',
          'Di Written Expression, cek apakah kata di posisi itu berakhiran noun (-tion, -ment, -ness, -ity) atau malah adjective/verb.',
        ],
        parts: [['The construction', 'S'], ['of the bridge', 'K'], ['took', 'V'], ['three years', 'O']],
      },
      {
        explain: [
          'Pronoun harus cocok dengan noun yang diwakilinya: singular ↔ it/its/he/she, plural ↔ they/their/them.',
          '"Each country has **their** own culture" ✗ → "**its** own" ✓ (each country = satu).',
          '"The company announced **their** profits" ✗ → "**its** profits" ✓ (company = satu organisasi).',
          'Cari noun aslinya dulu — sering terletak jauh sebelum pronoun.',
        ],
        parts: [['Each country', 'S'], ['has', 'V'], ['its own traditions', 'O']],
      },
      {
        explain: [
          'Bentuk pronoun ditentukan posisinya:',
          '• Sebagai **subject** (sebelum verb): I, he, she, we, they.',
          '• Sebagai **object** (setelah verb atau preposisi): me, him, her, us, them.',
          '"between you and **I**" ✗ → "between you and **me**" ✓ (setelah preposisi between).',
          'Tes: hilangkan "you and". "between… me" terdengar benar; "Him and I went" → "Him went"? Salah → "He and I went".',
        ],
        parts: [['Between', 'C'], ['you and me,', 'O'], ['the plan', 'S'], ['is', 'V'], ['weak', 'O']],
      },
      {
        explain: [
          '**its** (tanpa apostrof) = miliknya (untuk benda/hewan): "The cat licked **its** paw."',
          '**it\'s** = singkatan **it is** atau **it has**: "**It\'s** raining."',
          'Tes: ganti dengan "it is". Kalau kalimatnya jadi aneh ("The cat licked it is paw"), pakai **its**.',
          'Pola yang sama: their (milik mereka) vs they\'re (they are); whose vs who\'s.',
        ],
        parts: [['The company', 'S'], ['announced', 'V'], ['its new policy', 'O']],
      },
    ],
    walkthrough: {
      q: 'The {{test}} was {{extreme}} difficult for {{most}} of the {{students}}.',
      answer: 1,
      steps: [
        'Lihat kata "extreme": ia menjelaskan "difficult" (adjective).',
        'Yang menjelaskan adjective harus **adverb** → "extremely".',
        'Jawaban: bagian B.',
      ],
    },
  },
}
