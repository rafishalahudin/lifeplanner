import { useState, useEffect, useRef } from 'react'
import { MapPin, ChevronDown, Music, Pause, ChevronLeft, ChevronRight, Maximize, Minimize } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useIsMobile } from '../hooks/useIsMobile'

const BASE = import.meta.env.BASE_URL
const IMG  = (f) => `${BASE}${f}`

const D = {
  bg:     '#0C0C0C',
  bgCard: '#141414',
  bgUp:   '#1C1C1C',
  gold:   '#C9A84C',
  goldL:  '#E8D080',
  cream:  '#F0E8D8',
  creamM: '#B8A890',
  white:  '#FFFFFF',
  forest: '#1A2E24',
  forestM:'#2C4838',
}

const W = {
  brideFirst:  'Harista',
  brideFull:   'Haristawidya Friantika Putri',
  brideParent: 'Putri kedua dari Bapak Hartoyo Rosad & Ibu Anafriani',
  groomFirst:  'Rafi',
  groomFull:   'Muhammad Rafi Shalahudin',
  groomParent: 'Putra pertama dari Bapak Sasa Widarsa & Ibu Susan Elisanti',
  date:        new Date('2028-06-03T09:00:00'),
  dateStr:     'Sabtu, 3 Juni 2028',
  akad:    { time:'09:00 – 11:00 WIB', venue:'Gedung Bea Cukai Jakarta', addr:'Jl. Ahmad Yani No.1, Rawamangun, Jakarta Timur' },
  resepsi: { time:'18:00 – 21:00 WIB', venue:'Gedung Bea Cukai Jakarta', addr:'Jl. Ahmad Yani No.1, Rawamangun, Jakarta Timur' },
  accounts:[
    { bank:'Bank BCA',    no:'1234 5678 90', name:'Haristawidya Friantika Putri' },
    { bank:'Bank Mandiri',no:'9876 543 210', name:'Muhammad Rafi Shalahudin'     },
  ],
  story: [
    { year:'2021', emoji:'🌸', title:'Pertama Bertemu', desc:'Pertemuan yang tidak direncanakan, tapi entah kenapa terasa seperti sudah lama ditakdirkan. Ada getaran kecil yang tidak bisa dijelaskan.' },
    { year:'2022', emoji:'💛', title:'Jatuh Cinta', desc:'Tanpa sadar, nama seseorang terus terlintas setiap hari. Hati sudah terlanjur jatuh — dan rasanya mau terus begitu.' },
    { year:'2024', emoji:'💍', title:'Lamaran', desc:'Dengan sepenuh keberanian dan cinta yang tulus, Rafi berlutut dan bertanya. Harista menjawab dengan air mata dan senyum yang tidak bisa disembunyikan.' },
    { year:'2028', emoji:'🤍', title:'Hari Pernikahan', desc:'Dua jiwa yang saling mencinta, akhirnya resmi menyatu. Ini bukan akhir cerita — ini adalah awal dari selamanya.' },
  ],
}

function useCountdown(t) {
  const calc = () => {
    const d = t - Date.now()
    if (d <= 0) return { days:0, hours:0, minutes:0, seconds:0 }
    return {
      days:    Math.floor(d / 86400000),
      hours:   Math.floor((d % 86400000) / 3600000),
      minutes: Math.floor((d % 3600000)  / 60000),
      seconds: Math.floor((d % 60000)    / 1000),
    }
  }
  const [v, set] = useState(calc)
  useEffect(() => { const id = setInterval(() => set(calc()), 1000); return () => clearInterval(id) }, [])
  return v
}

function useFadeIn(threshold = 0.12) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

function FadeIn({ children, delay = 0, y = 28, style = {} }) {
  const [ref, visible] = useFadeIn()
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : `translateY(${y}px)`,
      transition: `opacity .85s ease ${delay}ms, transform .85s ease ${delay}ms`,
      ...style,
    }}>{children}</div>
  )
}

function GLine({ my = 24, width = '120px' }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'10px', margin:`${my}px auto`, width }}>
      <div style={{ flex:1, height:'.5px', background:`linear-gradient(90deg,transparent,${D.gold})` }}/>
      <div style={{ width:'4px', height:'4px', borderRadius:'50%', background:D.gold, opacity:.8 }}/>
      <div style={{ flex:1, height:'.5px', background:`linear-gradient(90deg,${D.gold},transparent)` }}/>
    </div>
  )
}

function PF({ children, size = 48, italic = false, color = D.white, style = {} }) {
  return (
    <div style={{
      fontFamily:"'Playfair Display', Georgia, serif",
      fontSize:size, color, lineHeight:1.1,
      fontWeight: italic ? 400 : 700,
      fontStyle:  italic ? 'italic' : 'normal',
      ...style,
    }}>{children}</div>
  )
}

function Pill({ children, onClick, variant = 'dark', style = {} }) {
  const bg = variant === 'glass' ? 'rgba(255,255,255,0.15)' : variant === 'gold' ? D.gold : D.bgCard
  const border = variant === 'glass' ? '1px solid rgba(255,255,255,0.35)' : `1px solid ${D.gold}40`
  const color  = variant === 'gold' ? D.bg : D.white
  return (
    <button onClick={onClick} style={{
      background:bg, color, border, borderRadius:'99px',
      padding:'13px 36px', fontSize:'15px',
      fontFamily:"'Cormorant Garamond', Georgia, serif",
      backdropFilter: variant === 'glass' ? 'blur(12px)' : 'none',
      cursor:'pointer', letterSpacing:'1.5px', fontWeight:500,
      transition:'all .2s',
      boxShadow: variant === 'glass' ? '0 2px 16px rgba(0,0,0,0.25)' : 'none',
      ...style,
    }}
      onMouseEnter={e => { e.currentTarget.style.opacity='.82'; e.currentTarget.style.transform='translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.opacity='1';   e.currentTarget.style.transform='translateY(0)'   }}
    >{children}</button>
  )
}

function Sec({ bg = D.bg, style = {}, children }) {
  return (
    <div style={{
      position:'relative', overflow:'hidden',
      display:'flex', flexDirection:'column', alignItems:'center',
      background:bg,
      fontFamily:"'Cormorant Garamond', Georgia, serif",
      ...style,
    }}>{children}</div>
  )
}

/* ── Floating gold particles ─────────────────────────── */
function Particles({ count = 10 }) {
  const pts = Array.from({ length: count }, (_, i) => ({
    left: `${6 + (i * 9.3) % 88}%`,
    size: 1.5 + (i % 3) * 0.7,
    delay: `${(i * 1.1) % 7}s`,
    dur:   `${9 + (i % 4) * 2.5}s`,
  }))
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none', zIndex:0 }}>
      {pts.map((p, i) => (
        <div key={i} style={{
          position:'absolute', bottom:'-8px', left:p.left,
          width:`${p.size}px`, height:`${p.size}px`, borderRadius:'50%',
          background:D.gold, opacity:.18,
          animation:`inv-float ${p.dur} ease-in ${p.delay} infinite`,
        }}/>
      ))}
    </div>
  )
}

/* ── Scroll-next chevron ─────────────────────────────── */
function ScrollNext({ label = '' }) {
  return (
    <div onClick={() => window.scrollBy({ top: window.innerHeight * 0.88, behavior:'smooth' })}
      style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'3px',
        cursor:'pointer', opacity:.45, transition:'all .25s', marginTop:'36px', userSelect:'none',
        animation:'inv-bounce 2.4s ease-in-out infinite',
      }}
      onMouseEnter={e => { e.currentTarget.style.opacity='1'; e.currentTarget.style.animationPlayState='paused' }}
      onMouseLeave={e => { e.currentTarget.style.opacity='.45'; e.currentTarget.style.animationPlayState='running' }}
    >
      {label && <div style={{ fontSize:'9px', color:`${D.gold}90`, letterSpacing:'3px', textTransform:'uppercase' }}>{label}</div>}
      <ChevronDown size={18} color={D.gold} strokeWidth={1.5}/>
    </div>
  )
}

/* ── Corner ornaments helper ─────────────────────────── */
function Corners({ size = 14, opacity = '50', inset = 12 }) {
  return [['top','left'],['top','right'],['bottom','left'],['bottom','right']].map(([v,h]) => (
    <div key={v+h} style={{ position:'absolute', [v]:`${inset}px`, [h]:`${inset}px`,
      width:`${size}px`, height:`${size}px`,
      borderTop: v==='top' ? `1px solid ${D.gold}${opacity}` : 'none',
      borderBottom: v==='bottom' ? `1px solid ${D.gold}${opacity}` : 'none',
      borderLeft: h==='left' ? `1px solid ${D.gold}${opacity}` : 'none',
      borderRight: h==='right' ? `1px solid ${D.gold}${opacity}` : 'none',
    }}/>
  ))
}

/* ── Photo Carousel ──────────────────────────────────── */
function PhotoCarousel() {
  const photos = [
    { src: IMG('cover.jpg'),  caption: 'Together'  },
    { src: IMG('cover2.jpg'), caption: 'Forever'   },
    { src: IMG('cover3.jpg'), caption: 'Always'    },
  ]
  const [idx, setIdx] = useState(0)
  const prev = () => setIdx(i => (i - 1 + photos.length) % photos.length)
  const next = () => setIdx(i => (i + 1) % photos.length)
  useEffect(() => { const id = setInterval(() => setIdx(i => (i + 1) % photos.length), 4200); return () => clearInterval(id) }, [])

  return (
    <div style={{ position:'relative', width:'100%', maxWidth:'420px', aspectRatio:'4/5',
      borderRadius:'20px', overflow:'hidden', boxShadow:'0 8px 48px rgba(0,0,0,0.6)' }}>
      {photos.map((p, i) => (
        <div key={i} style={{ position:'absolute', inset:0, opacity: i === idx ? 1 : 0, transition:'opacity 1.4s ease' }}>
          <img src={p.src} alt={p.caption}
            style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center',
              filter:'brightness(0.72) saturate(0.85)' }}/>
          <div style={{ position:'absolute', inset:0,
            background:'linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.72) 100%)' }}/>
          <div style={{ position:'absolute', bottom:'28px', left:0, right:0, textAlign:'center',
            fontFamily:"'Playfair Display',serif", fontStyle:'italic',
            fontSize:'22px', color:`${D.gold}CC`, letterSpacing:'4px' }}>
            {p.caption}
          </div>
        </div>
      ))}
      <button onClick={prev} style={{ position:'absolute', top:'50%', left:'12px', transform:'translateY(-50%)',
        background:'rgba(0,0,0,0.45)', border:`1px solid ${D.gold}30`, borderRadius:'50%',
        width:'36px', height:'36px', display:'flex', alignItems:'center', justifyContent:'center',
        cursor:'pointer', backdropFilter:'blur(8px)', color:D.gold, transition:'all .2s' }}
        onMouseEnter={e => e.currentTarget.style.background='rgba(201,168,76,0.2)'}
        onMouseLeave={e => e.currentTarget.style.background='rgba(0,0,0,0.45)'}
      ><ChevronLeft size={16}/></button>
      <button onClick={next} style={{ position:'absolute', top:'50%', right:'12px', transform:'translateY(-50%)',
        background:'rgba(0,0,0,0.45)', border:`1px solid ${D.gold}30`, borderRadius:'50%',
        width:'36px', height:'36px', display:'flex', alignItems:'center', justifyContent:'center',
        cursor:'pointer', backdropFilter:'blur(8px)', color:D.gold, transition:'all .2s' }}
        onMouseEnter={e => e.currentTarget.style.background='rgba(201,168,76,0.2)'}
        onMouseLeave={e => e.currentTarget.style.background='rgba(0,0,0,0.45)'}
      ><ChevronRight size={16}/></button>
      <div style={{ position:'absolute', bottom:'8px', left:0, right:0,
        display:'flex', justifyContent:'center', gap:'6px', zIndex:2 }}>
        {photos.map((_, i) => (
          <div key={i} onClick={() => setIdx(i)} style={{
            width: i === idx ? '20px' : '6px', height:'6px', borderRadius:'99px',
            background: i === idx ? D.gold : `${D.gold}35`,
            transition:'all .45s', cursor:'pointer',
          }}/>
        ))}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════ */
export default function Undangan() {

  useEffect(() => {
    if (document.getElementById('inv-pf')) return
    const l = document.createElement('link')
    l.id='inv-pf'; l.rel='stylesheet'
    l.href='https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400;1,600&display=swap'
    document.head.appendChild(l)
    return () => { const e=document.getElementById('inv-pf'); if(e) e.remove() }
  }, [])

  useEffect(() => {
    if (document.getElementById('inv-kf')) return
    const s = document.createElement('style')
    s.id = 'inv-kf'
    s.textContent = [
      '@keyframes inv-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}',
      '@keyframes inv-fadeIn{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}',
      '@keyframes inv-fadeOut{0%{opacity:1}100%{opacity:0;pointer-events:none}}',
      '@keyframes inv-float{0%{transform:translateY(0) scale(1);opacity:.18}50%{opacity:.28}100%{transform:translateY(-105vh) scale(0.6);opacity:0}}',
      '@keyframes inv-bounce{0%,100%{transform:translateY(0)}55%{transform:translateY(6px)}}',
      '@keyframes inv-twinkle{0%,100%{opacity:.3;transform:scale(.85)}50%{opacity:1;transform:scale(1.2)}}',
      '@keyframes inv-heart{0%{opacity:1;transform:translateX(-50%) translateY(0) scale(1)}100%{opacity:0;transform:translateX(-50%) translateY(-70px) scale(1.4)}}',
      '@keyframes inv-shimmer{0%{background-position:200% center}100%{background-position:-200% center}}',
    ].join('\n')
    document.head.appendChild(s)
    return () => { const e=document.getElementById('inv-kf'); if(e) e.remove() }
  }, [])

  const isMobile = useIsMobile()
  const audioRef = useRef(null)
  const [playing,      setPlaying]      = useState(false)
  const [opened,       setOpened]       = useState(false)
  const [opening,      setOpening]      = useState(false)
  const [guestName,    setGuestName]    = useState('')
  const [rsvpChoice,   setRsvpChoice]   = useState(null)
  const [guests,       setGuests]       = useState(1)
  const [rsvpDone,     setRsvpDone]     = useState(false)
  const [wishText,     setWishText]     = useState('')
  const [showBank,     setShowBank]     = useState(false)
  const [showHeart,    setShowHeart]    = useState(false)
  const [copiedBank,   setCopiedBank]   = useState(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [wishes, setWishes] = useLocalStorage('rh-wishes-2028', [
    { name:'Keluarga Santosa',  time:'2 hari lalu',   msg:'Selamat & barakallahu fiikuma! Semoga menjadi keluarga yang sakinah mawaddah warahmah. 🤲' },
    { name:'Sahabat Rafi',      time:'seminggu lalu', msg:'Congrats bro! Semoga langgeng, selalu bahagia dan diberi keturunan yang shalih shalihah. 💛' },
  ])
  const cd = useCountdown(W.date)

  const startMusic = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(IMG('wedding-song.mp3'))
      audioRef.current.loop = true
      audioRef.current.volume = 0.5
    }
    audioRef.current.play().then(() => setPlaying(true)).catch(() => {})
  }

  const toggleMusic = () => {
    if (!audioRef.current) return
    if (playing) { audioRef.current.pause(); setPlaying(false) }
    else { audioRef.current.play().then(() => setPlaying(true)).catch(() => {}) }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {})
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {})
    }
  }

  useEffect(() => {
    const h = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', h)
    return () => document.removeEventListener('fullscreenchange', h)
  }, [])

  useEffect(() => () => { audioRef.current?.pause() }, [])

  const handleOpen = () => {
    setOpening(true)
    startMusic()
    setTimeout(() => { setOpened(true); setOpening(false) }, 2900)
  }

  const sendWish = () => {
    if (!wishText.trim()) return
    setWishes(p => [{ name, time:'baru saja', msg:wishText.trim() }, ...p])
    setWishText('')
    setShowHeart(true)
    setTimeout(() => setShowHeart(false), 1600)
  }

  const copyAccount = (no, bank) => {
    navigator.clipboard.writeText(no.replace(/\s/g, '')).then(() => {
      setCopiedBank(bank)
      setTimeout(() => setCopiedBank(null), 2200)
    }).catch(() => {})
  }

  const name = guestName.trim() || 'Tamu Undangan'

  const scrollDown = () => window.scrollBy({ top: window.innerHeight, behavior:'smooth' })

  const guestInput = !opened && !opening && (
    <div style={{ marginBottom:'18px', width:'100%', maxWidth:'300px' }}>
      <p style={{ color:`${D.cream}60`, fontSize:'13px', letterSpacing:'.5px',
        fontStyle:'italic', margin:'0 0 10px', textAlign:'center' }}>Kepada Yth.</p>
      <input value={guestName} onChange={e => setGuestName(e.target.value)}
        placeholder="Nama kamu..."
        style={{
          width:'100%', padding:'11px 18px', borderRadius:'99px',
          border:`1px solid ${D.gold}30`, background:'rgba(255,255,255,0.07)',
          color:D.cream, fontFamily:"'Cormorant Garamond', serif",
          fontSize:'15px', textAlign:'center', outline:'none', boxSizing:'border-box',
          backdropFilter:'blur(8px)', letterSpacing:'.5px',
        }}
      />
    </div>
  )

  /* floating heart on wish send */
  const heartOverlay = showHeart && (
    <div style={{ position:'fixed', bottom:'130px', left:'50%',
      fontSize:'30px', zIndex:999, pointerEvents:'none',
      animation:'inv-heart 1.6s ease-out forwards' }}>
      💕
    </div>
  )

  return (
    <div style={{ margin:'-4px', fontFamily:"'Cormorant Garamond', Georgia, serif" }}>

      {heartOverlay}

      {/* ── Opening overlay ────────────────────────────── */}
      {opening && (
        <div style={{
          position:'fixed', inset:0, zIndex:9999,
          background:'#000',
          display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'center',
          textAlign:'center', padding:'0 32px',
          animation:'inv-fadeOut .7s ease 2.2s forwards',
        }}>
          <Particles count={14}/>
          <div style={{ color:`${D.gold}60`, fontSize:'12px', letterSpacing:'8px',
            textTransform:'uppercase', marginBottom:'36px',
            animation:'inv-fadeIn .8s ease .2s both', position:'relative', zIndex:1 }}>
            Bismillahirrahmanirrahim
          </div>
          <div style={{ animation:'inv-fadeIn .9s ease .7s both', position:'relative', zIndex:1 }}>
            <PF size={isMobile ? 56 : 80} style={{ lineHeight:1 }}>{W.brideFirst}</PF>
            <div style={{ color:`${D.gold}BB`, fontSize:isMobile?'30px':'44px',
              fontFamily:"'Playfair Display',serif", fontStyle:'italic', margin:'8px 0', lineHeight:1 }}>&amp;</div>
            <PF size={isMobile ? 56 : 80} style={{ lineHeight:1 }}>{W.groomFirst}</PF>
          </div>
          <GLine my={30} width="110px"/>
          <div style={{ color:`${D.cream}70`, fontSize:'15px', fontStyle:'italic', letterSpacing:'1px',
            animation:'inv-fadeIn .8s ease 1.5s both', position:'relative', zIndex:1 }}>
            mengundangmu dengan sepenuh hati...
          </div>
        </div>
      )}

      {/* ══ 1. COVER ══════════════════════════════════ */}
      {!isMobile ? (
        <div style={{ display:'flex', minHeight:'calc(100vh - 56px)', background:D.bg }}>
          <div style={{ width:'33.333%', position:'relative', flexShrink:0, overflow:'hidden' }}>
            <img src={IMG('cover3.jpg')} alt=""
              style={{ position:'absolute', inset:0, width:'100%', height:'100%',
                objectFit:'cover', objectPosition:'center 20%',
                filter:'brightness(0.75) saturate(0.85)', display:'block' }}/>
            <div style={{ position:'absolute', inset:0,
              background:'linear-gradient(90deg, transparent 60%, rgba(12,12,12,0.95) 100%)' }}/>
          </div>
          <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center',
            justifyContent:'center', padding:'60px 80px', textAlign:'center',
            borderLeft:`1px solid ${D.gold}12` }}>
            <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-30%,-50%)',
              width:'500px', height:'500px', borderRadius:'50%',
              background:'radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)', pointerEvents:'none' }}/>
            <p style={{ color:`${D.gold}80`, fontSize:'11px', letterSpacing:'6px',
              textTransform:'uppercase', margin:'0 0 36px' }}>The Wedding Of</p>
            <div style={{ display:'flex', alignItems:'center', gap:'14px', marginBottom:'32px', width:'320px' }}>
              <div style={{ flex:1, height:'.5px', background:`linear-gradient(90deg,transparent,${D.gold}50)` }}/>
              <span style={{ color:D.gold, fontSize:'11px', opacity:.5 }}>✦</span>
              <div style={{ flex:1, height:'.5px', background:`linear-gradient(90deg,${D.gold}50,transparent)` }}/>
            </div>
            <PF size={80} style={{ lineHeight:1, marginBottom:'4px', textShadow:'0 4px 32px rgba(0,0,0,0.4)' }}>{W.brideFirst}</PF>
            <div style={{ color:`${D.gold}BB`, fontSize:'40px', fontFamily:"'Playfair Display',serif",
              fontStyle:'italic', margin:'6px 0', lineHeight:1 }}>&amp;</div>
            <PF size={80} style={{ lineHeight:1, marginBottom:'36px', textShadow:'0 4px 32px rgba(0,0,0,0.4)' }}>{W.groomFirst}</PF>
            <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'10px', width:'360px' }}>
              <div style={{ flex:1, height:'.5px', background:`linear-gradient(90deg,transparent,${D.gold}40)` }}/>
              <p style={{ color:`${D.cream}99`, fontSize:'14px', letterSpacing:'2px', margin:0, whiteSpace:'nowrap' }}>{W.dateStr}</p>
              <div style={{ flex:1, height:'.5px', background:`linear-gradient(90deg,${D.gold}40,transparent)` }}/>
            </div>
            <p style={{ color:`${D.creamM}60`, fontSize:'12px', letterSpacing:'3px',
              textTransform:'uppercase', margin:'0 0 40px' }}>Gedung Bea Cukai Jakarta</p>
            {guestInput}
            {opened
              ? <div onClick={scrollDown} style={{ color:`${D.gold}AA`, fontSize:'14px', display:'flex',
                  alignItems:'center', gap:'7px', justifyContent:'center', letterSpacing:'1px',
                  cursor:'pointer', userSelect:'none', transition:'opacity .2s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity='.65'}
                  onMouseLeave={e => e.currentTarget.style.opacity='1'}
                >
                  <ChevronDown size={16}/> Scroll ke bawah
                </div>
              : !opening && <Pill variant="glass" onClick={handleOpen}>Buka Undangan</Pill>
            }
          </div>
        </div>

      ) : (
        <div style={{ position:'relative', overflow:'hidden', minHeight:'calc(100vh - 110px)',
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
          <img src={IMG('cover3.jpg')} alt=""
            style={{ position:'absolute', inset:0, width:'100%', height:'100%',
              objectFit:'cover', objectPosition:'center 30%',
              filter:'brightness(0.42) saturate(0.7)', display:'block' }}/>
          <div style={{ position:'absolute', inset:0,
            background:'linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.58) 28%, rgba(0,0,0,0.65) 58%, rgba(0,0,0,0.95) 100%)' }}/>
          <Particles count={8}/>

          <div style={{ position:'relative', zIndex:1, width:'100%', display:'flex',
            flexDirection:'column', alignItems:'center', flex:1, justifyContent:'space-between',
            padding:'36px 24px 40px' }}>
            <div style={{ textAlign:'center' }}>
              <p style={{ color:`${D.gold}99`, fontSize:'11px', letterSpacing:'5px',
                textTransform:'uppercase', margin:0 }}>The Wedding Of</p>
            </div>
            <div style={{ textAlign:'center', background:'rgba(0,0,0,0.45)',
              backdropFilter:'blur(10px)', borderRadius:'20px', padding:'28px 22px',
              border:`1px solid ${D.gold}12` }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'20px' }}>
                <div style={{ flex:1, height:'.5px', background:`linear-gradient(90deg,transparent,${D.gold}60)` }}/>
                <span style={{ color:D.gold, fontSize:'10px', opacity:.6 }}>✦</span>
                <div style={{ flex:1, height:'.5px', background:`linear-gradient(90deg,${D.gold}60,transparent)` }}/>
              </div>
              <PF size={58} style={{ lineHeight:1.05, textShadow:'0 2px 8px rgba(0,0,0,1), 0 6px 32px rgba(0,0,0,0.95)', marginBottom:'4px' }}>{W.brideFirst}</PF>
              <div style={{ color:`${D.gold}CC`, fontSize:'32px', fontFamily:"'Playfair Display',serif",
                fontStyle:'italic', margin:'2px 0', lineHeight:1 }}>&amp;</div>
              <PF size={58} style={{ lineHeight:1.05, textShadow:'0 2px 8px rgba(0,0,0,1), 0 6px 32px rgba(0,0,0,0.95)', marginBottom:'20px' }}>{W.groomFirst}</PF>
              <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px' }}>
                <div style={{ flex:1, height:'.5px', background:`linear-gradient(90deg,transparent,${D.gold}40)` }}/>
                <p style={{ color:D.cream, fontSize:'13px', letterSpacing:'2px', margin:0, whiteSpace:'nowrap' }}>{W.dateStr}</p>
                <div style={{ flex:1, height:'.5px', background:`linear-gradient(90deg,${D.gold}40,transparent)` }}/>
              </div>
              <p style={{ color:D.creamM, fontSize:'12px', letterSpacing:'2.5px', textTransform:'uppercase', margin:0 }}>
                Gedung Bea Cukai Jakarta
              </p>
            </div>
            <div style={{ textAlign:'center', width:'100%', display:'flex', flexDirection:'column', alignItems:'center' }}>
              {guestInput}
              {opened
                ? <div onClick={scrollDown} style={{ color:`${D.gold}BB`, fontSize:'13px', display:'flex',
                    alignItems:'center', gap:'6px', justifyContent:'center', letterSpacing:'1px',
                    cursor:'pointer', userSelect:'none', transition:'opacity .2s' }}
                    onMouseEnter={e => e.currentTarget.style.opacity='.65'}
                    onMouseLeave={e => e.currentTarget.style.opacity='1'}
                  >
                    <ChevronDown size={15}/> Scroll ke bawah
                  </div>
                : !opening && <Pill variant="glass" onClick={handleOpen}>Buka Undangan</Pill>
              }
            </div>
          </div>
        </div>
      )}

      {/* ══ BODY ════════════════════════════════════════ */}
      {opened && <>

        {/* ══ 2. OPEN LETTER ══════════════════════════ */}
        <Sec style={{ padding:'64px 20px', textAlign:'center', justifyContent:'center' }}>
          <div style={{ position:'absolute', inset:0,
            background:'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(201,168,76,0.05) 0%, transparent 70%)' }}/>
          <Particles count={6}/>
          <FadeIn style={{ zIndex:1, width:'100%', maxWidth:'520px' }}>
            <div style={{
              background:D.bgCard, border:`1px solid ${D.gold}22`, borderRadius:'24px',
              padding: isMobile ? '36px 26px' : '48px 48px', position:'relative', overflow:'hidden',
            }}>
              <div style={{ position:'absolute', inset:0, borderRadius:'24px',
                background:'radial-gradient(ellipse 70% 50% at 50% 20%, rgba(201,168,76,0.06) 0%, transparent 70%)',
                pointerEvents:'none' }}/>
              <Corners size={16} opacity="45" inset={14}/>
              <div style={{ display:'flex', alignItems:'center', gap:'10px', justifyContent:'center', marginBottom:'26px' }}>
                <div style={{ flex:1, height:'.5px', background:`linear-gradient(90deg,transparent,${D.gold}40)` }}/>
                <span style={{ color:`${D.gold}70`, fontSize:'15px', letterSpacing:'6px',
                  animation:'inv-twinkle 3s ease-in-out infinite' }}>✦</span>
                <div style={{ flex:1, height:'.5px', background:`linear-gradient(90deg,${D.gold}40,transparent)` }}/>
              </div>
              <p style={{ color:`${D.gold}75`, fontSize:'10px', letterSpacing:'6px',
                textTransform:'uppercase', margin:'0 0 26px', textAlign:'center', position:'relative' }}>
                Dari Kami, Untuk Kamu
              </p>
              <div style={{ fontSize: isMobile ? '15.5px' : '17px', lineHeight:'2.15',
                color:D.cream, fontStyle:'italic', fontWeight:300, textAlign:'center', position:'relative' }}>
                <span style={{ color:`${D.cream}90` }}>Assalamu'alaikum,</span>
                <br/><br/>
                Kepada <span style={{ color:D.gold, fontWeight:500 }}>{name}</span> yang kami sayangi,
                <br/><br/>
                Di antara jutaan orang di dunia ini, kami bersyukur kamu termasuk
                dalam bagian hidup kami. Kehadiranmu bukan sekadar mengisi kursi —
                melainkan mengisi doa, kenangan, dan makna di hari paling istimewa
                dalam hidup kami.
                <br/><br/>
                Undangan ini ditulis dengan sepenuh hati, dan kami benar-benar
                ingin kamu ada di sana.
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'10px', margin:'28px 0', position:'relative' }}>
                <div style={{ flex:1, height:'.5px', background:`linear-gradient(90deg,transparent,${D.gold}40)` }}/>
                <div style={{ width:'5px', height:'5px', borderRadius:'50%', background:`${D.gold}60`,
                  boxShadow:`0 0 8px ${D.gold}40` }}/>
                <div style={{ flex:1, height:'.5px', background:`linear-gradient(90deg,${D.gold}40,transparent)` }}/>
              </div>
              <div style={{ textAlign:'center', position:'relative' }}>
                <PF size={34} italic style={{ color:D.gold }}>{W.brideFirst} &amp; {W.groomFirst}</PF>
                <div style={{ fontSize:'11px', color:`${D.gold}55`, letterSpacing:'4px',
                  textTransform:'uppercase', marginTop:'8px' }}>3 Juni 2028</div>
              </div>
            </div>
          </FadeIn>
          <ScrollNext/>
        </Sec>

        {/* ══ 3. VERSE ════════════════════════════════ */}
        <Sec style={{ padding:'72px 28px 64px', textAlign:'center', justifyContent:'center' }}>
          <div style={{ position:'absolute', inset:0,
            background:'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(201,168,76,0.04) 0%, transparent 70%)' }}/>
          <FadeIn style={{ zIndex:1, width:'100%', maxWidth:'440px', display:'flex', flexDirection:'column', alignItems:'center' }}>
            <div style={{ color:D.gold, fontSize:'12px', letterSpacing:'10px', marginBottom:'40px', opacity:.6 }}>
              ◆ &nbsp; ◆ &nbsp; ◆
            </div>
            <p style={{ color:`${D.gold}80`, fontSize:'12px', letterSpacing:'3px',
              textTransform:'uppercase', margin:'0 0 32px', opacity:.8 }}>QS. Ar-Rum : 21</p>
            <p style={{ maxWidth:'380px', fontSize:'19px', lineHeight:'2.1', color:D.cream,
              fontStyle:'italic', fontWeight:300, margin:'0 auto 24px' }}>
              "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu
              pasangan-pasangan dari jenismu sendiri, supaya kamu cenderung dan merasa
              tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang."
            </p>
            <GLine my={36} width="160px"/>
            <PF size={44} italic style={{ color:D.gold, marginTop:'8px' }}>Bride &amp; Groom</PF>
          </FadeIn>
          <ScrollNext/>
        </Sec>

        {/* ══ 4. BRIDE ════════════════════════════════ */}
        {isMobile ? (
          <div style={{ position:'relative', overflow:'hidden', minHeight:'calc(100vh - 110px)',
            display:'flex', flexDirection:'column', justifyContent:'flex-end' }}>
            <div style={{ position:'absolute', inset:0,
              backgroundImage:`url('${IMG('bride.png')}')`, backgroundSize:'cover', backgroundPosition:'center top',
              filter:'brightness(0.55) saturate(0.85)' }}/>
            <div style={{ position:'absolute', inset:0,
              background:'linear-gradient(0deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.05) 70%)' }}/>
            <div style={{ position:'relative', zIndex:1, padding:'0 28px 52px', textAlign:'center' }}>
              <div style={{ color:D.gold, fontSize:'11px', letterSpacing:'5px', textTransform:'uppercase',
                marginBottom:'14px', opacity:.7 }}>Mempelai Wanita</div>
              <PF size={58} italic style={{ color:D.white, marginBottom:'12px', textShadow:'0 2px 20px rgba(0,0,0,0.8)' }}>{W.brideFirst}</PF>
              <GLine my={14} width="100px"/>
              <div style={{ fontSize:'15px', fontWeight:600, color:D.cream, letterSpacing:'2px',
                textTransform:'uppercase', marginBottom:'10px' }}>{W.brideFull}</div>
              <div style={{ fontSize:'14px', color:D.creamM, lineHeight:'1.8', maxWidth:'300px', margin:'0 auto 32px' }}>{W.brideParent}</div>
              <ScrollNext/>
            </div>
          </div>
        ) : (
          <div style={{ display:'flex', minHeight:'calc(100vh - 56px)', background:D.bg }}>
            <div style={{ width:'33.333%', position:'relative', flexShrink:0, overflow:'hidden' }}>
              <div style={{ position:'absolute', inset:0, backgroundImage:`url('${IMG('bride.png')}')`,
                backgroundSize:'cover', backgroundPosition:'center top', filter:'brightness(0.65) saturate(0.85)' }}/>
              <div style={{ position:'absolute', inset:0,
                background:'linear-gradient(90deg, transparent 60%, rgba(12,12,12,0.95) 100%)' }}/>
            </div>
            <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center',
              justifyContent:'center', padding:'60px 80px', textAlign:'center',
              borderLeft:`1px solid ${D.gold}12` }}>
              <FadeIn>
                <p style={{ color:`${D.gold}80`, fontSize:'11px', letterSpacing:'6px',
                  textTransform:'uppercase', margin:'0 0 28px' }}>Mempelai Wanita</p>
                <PF size={76} italic style={{ color:D.white, marginBottom:'6px',
                  textShadow:'0 4px 32px rgba(0,0,0,0.4)', lineHeight:1 }}>{W.brideFirst}</PF>
                <GLine my={20} width="120px"/>
                <div style={{ fontSize:'16px', fontWeight:600, color:D.cream, letterSpacing:'3px',
                  textTransform:'uppercase', marginBottom:'14px' }}>{W.brideFull}</div>
                <div style={{ fontSize:'15px', color:D.creamM, lineHeight:'1.9', maxWidth:'340px' }}>{W.brideParent}</div>
              </FadeIn>
            </div>
          </div>
        )}

        {/* ══ 5. GROOM ════════════════════════════════ */}
        {isMobile ? (
          <div style={{ position:'relative', overflow:'hidden', minHeight:'calc(100vh - 110px)',
            display:'flex', flexDirection:'column', justifyContent:'flex-end' }}>
            <div style={{ position:'absolute', inset:0,
              backgroundImage:`url('${IMG('groom.png')}')`, backgroundSize:'cover', backgroundPosition:'center top',
              filter:'brightness(0.5) saturate(0.8)' }}/>
            <div style={{ position:'absolute', inset:0,
              background:'linear-gradient(0deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.05) 70%)' }}/>
            <div style={{ position:'relative', zIndex:1, padding:'0 28px 52px', textAlign:'center' }}>
              <div style={{ color:D.gold, fontSize:'11px', letterSpacing:'5px', textTransform:'uppercase',
                marginBottom:'14px', opacity:.7 }}>Mempelai Pria</div>
              <PF size={58} italic style={{ color:D.white, marginBottom:'12px', textShadow:'0 2px 20px rgba(0,0,0,0.8)' }}>{W.groomFirst}</PF>
              <GLine my={14} width="100px"/>
              <div style={{ fontSize:'15px', fontWeight:600, color:D.cream, letterSpacing:'2px',
                textTransform:'uppercase', marginBottom:'10px' }}>{W.groomFull}</div>
              <div style={{ fontSize:'14px', color:D.creamM, lineHeight:'1.8', maxWidth:'300px', margin:'0 auto 32px' }}>{W.groomParent}</div>
              <ScrollNext/>
            </div>
          </div>
        ) : (
          <div style={{ display:'flex', minHeight:'calc(100vh - 56px)', background:D.bg }}>
            <div style={{ width:'33.333%', position:'relative', flexShrink:0, overflow:'hidden' }}>
              <div style={{ position:'absolute', inset:0, backgroundImage:`url('${IMG('groom.png')}')`,
                backgroundSize:'cover', backgroundPosition:'center top', filter:'brightness(0.6) saturate(0.8)' }}/>
              <div style={{ position:'absolute', inset:0,
                background:'linear-gradient(90deg, transparent 60%, rgba(12,12,12,0.95) 100%)' }}/>
            </div>
            <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center',
              justifyContent:'center', padding:'60px 80px', textAlign:'center',
              borderLeft:`1px solid ${D.gold}12` }}>
              <FadeIn>
                <p style={{ color:`${D.gold}80`, fontSize:'11px', letterSpacing:'6px',
                  textTransform:'uppercase', margin:'0 0 28px' }}>Mempelai Pria</p>
                <PF size={76} italic style={{ color:D.white, marginBottom:'6px',
                  textShadow:'0 4px 32px rgba(0,0,0,0.4)', lineHeight:1 }}>{W.groomFirst}</PF>
                <GLine my={20} width="120px"/>
                <div style={{ fontSize:'16px', fontWeight:600, color:D.cream, letterSpacing:'3px',
                  textTransform:'uppercase', marginBottom:'14px' }}>{W.groomFull}</div>
                <div style={{ fontSize:'15px', color:D.creamM, lineHeight:'1.9', maxWidth:'340px' }}>{W.groomParent}</div>
              </FadeIn>
            </div>
          </div>
        )}

        {/* ══ 6. GALLERY ══════════════════════════════ */}
        <Sec style={{ padding:'72px 24px', textAlign:'center', justifyContent:'center' }}>
          <div style={{ position:'absolute', inset:0,
            background:'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(201,168,76,0.03) 0%, transparent 70%)' }}/>
          <FadeIn style={{ zIndex:1, width:'100%', display:'flex', flexDirection:'column', alignItems:'center' }}>
            <p style={{ color:`${D.gold}70`, fontSize:'10px', letterSpacing:'6px',
              textTransform:'uppercase', margin:'0 0 10px' }}>Our Moments</p>
            <PF size={44} italic style={{ color:D.white, marginBottom:'36px' }}>Gallery</PF>
            <PhotoCarousel/>
          </FadeIn>
          <ScrollNext/>
        </Sec>

        {/* ══ 7. LOVE STORY ═══════════════════════════ */}
        <Sec style={{ padding:'64px 24px 72px', textAlign:'center', justifyContent:'center' }}>
          <div style={{ position:'absolute', inset:0,
            background:'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(201,168,76,0.04) 0%, transparent 70%)' }}/>
          <Particles count={7}/>
          <FadeIn style={{ zIndex:1, width:'100%', maxWidth:'460px', display:'flex', flexDirection:'column', alignItems:'center' }}>
            <p style={{ color:`${D.gold}70`, fontSize:'10px', letterSpacing:'6px',
              textTransform:'uppercase', margin:'0 0 10px' }}>Perjalanan Kita</p>
            <PF size={44} italic style={{ color:D.white, marginBottom:'10px' }}>Our Story</PF>
            <p style={{ color:`${D.creamM}60`, fontSize:'14px', fontStyle:'italic',
              margin:'0 0 40px', lineHeight:1.6 }}>
              Karena cinta tidak datang sekaligus — ia tumbuh, perlahan, indah.
            </p>
            <div style={{ width:'100%' }}>
              {W.story.map(({ year, emoji, title, desc }, i) => (
                <FadeIn key={year} delay={i * 100}>
                  <div style={{ display:'flex', gap:'0', alignItems:'stretch' }}>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center',
                      flexShrink:0, width:'32px', marginRight:'16px' }}>
                      <div style={{ fontSize:'20px', lineHeight:1, marginTop:'1px', flexShrink:0 }}>{emoji}</div>
                      {i < W.story.length - 1 && (
                        <div style={{ flex:1, width:'1px', minHeight:'20px', marginTop:'6px',
                          background:`linear-gradient(180deg, ${D.gold}35, ${D.gold}08)` }}/>
                      )}
                    </div>
                    <div style={{ flex:1, textAlign:'left', paddingBottom: i < W.story.length-1 ? '26px' : 0 }}>
                      <div style={{ fontSize:'10px', color:`${D.gold}65`, letterSpacing:'3px',
                        textTransform:'uppercase', marginBottom:'3px' }}>{year}</div>
                      <div style={{ fontSize:'17px', fontWeight:600, color:D.cream,
                        marginBottom:'5px', letterSpacing:'.2px' }}>{title}</div>
                      <div style={{ fontSize:'13.5px', color:`${D.creamM}85`, lineHeight:'1.8',
                        fontStyle:'italic' }}>{desc}</div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
            <FadeIn delay={420} style={{ width:'100%', textAlign:'center', marginTop:'36px' }}>
              <GLine my={0} width="80px"/>
              <p style={{ color:`${D.gold}75`, fontSize:'15px', fontStyle:'italic',
                margin:'20px 0 0', lineHeight:'1.8' }}>
                Dan sekarang, kami siap memulai babak baru bersama. 💛
              </p>
            </FadeIn>
          </FadeIn>
          <ScrollNext/>
        </Sec>

        {/* ══ 8. EVENTS ═══════════════════════════════ */}
        <Sec style={{ padding:'56px 20px 64px', justifyContent:'center' }}>
          <div style={{ position:'absolute', inset:0,
            background:'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(201,168,76,0.03) 0%, transparent 70%)' }}/>
          <FadeIn style={{ textAlign:'center', zIndex:1, marginBottom:'44px', width:'100%' }}>
            <div style={{ color:`${D.gold}50`, fontSize:'13px', letterSpacing:'8px', marginBottom:'18px' }}>
              ◆ &nbsp; ◆ &nbsp; ◆
            </div>
            <p style={{ color:`${D.gold}70`, fontSize:'10px', letterSpacing:'6px',
              textTransform:'uppercase', margin:'0 0 12px' }}>Turut Mengundang</p>
            <PF size={44} italic style={{ color:D.white, lineHeight:1 }}>Hari Istimewa</PF>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', margin:'20px auto 0', width:'160px' }}>
              <div style={{ flex:1, height:'.5px', background:`linear-gradient(90deg,transparent,${D.gold}60)` }}/>
              <span style={{ color:`${D.gold}80`, fontSize:'12px' }}>✦</span>
              <div style={{ flex:1, height:'.5px', background:`linear-gradient(90deg,${D.gold}60,transparent)` }}/>
            </div>
          </FadeIn>
          {[
            { label:'Akad Nikah', roman:'I',  ...W.akad   },
            { label:'Resepsi',    roman:'II', ...W.resepsi },
          ].map(({ label, roman, time, venue, addr }, i) => (
            <FadeIn key={label} delay={i * 140} style={{ width:'100%', maxWidth:'420px', zIndex:1,
              marginBottom: i === 0 ? '24px' : 0 }}>
              <div style={{
                padding:'36px 32px', textAlign:'center',
                background:`linear-gradient(145deg, rgba(201,168,76,0.07) 0%, rgba(20,20,20,0.95) 60%)`,
                border:`1px solid ${D.gold}35`, borderRadius:'20px',
                position:'relative', overflow:'hidden',
              }}>
                <Corners size={14} opacity="55" inset={12}/>
                <div style={{ position:'absolute', top:0, left:'20%', right:'20%', height:'1px',
                  background:`linear-gradient(90deg, transparent, ${D.gold}70, transparent)` }}/>
                <div style={{ display:'flex', alignItems:'center', gap:'10px', justifyContent:'center', marginBottom:'20px' }}>
                  <div style={{ flex:1, height:'.5px', background:`linear-gradient(90deg,transparent,${D.gold}45)` }}/>
                  <span style={{ fontSize:'10px', color:`${D.gold}95`, letterSpacing:'5px', textTransform:'uppercase' }}>
                    {roman} &nbsp;·&nbsp; {label}
                  </span>
                  <div style={{ flex:1, height:'.5px', background:`linear-gradient(90deg,${D.gold}45,transparent)` }}/>
                </div>
                <div style={{ color:`${D.gold}60`, fontSize:'18px', letterSpacing:'10px', marginBottom:'16px' }}>◆</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize: isMobile ? '34px' : '40px',
                  fontWeight:400, color:D.white, lineHeight:1, marginBottom:'22px', letterSpacing:'-0.5px' }}>
                  {time}
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:'8px', justifyContent:'center', margin:'0 auto 22px' }}>
                  <div style={{ width:'32px', height:'.5px', background:`linear-gradient(90deg,transparent,${D.gold}55)` }}/>
                  <div style={{ width:'4px', height:'4px', borderRadius:'50%', background:`${D.gold}70` }}/>
                  <div style={{ width:'32px', height:'.5px', background:`linear-gradient(90deg,${D.gold}55,transparent)` }}/>
                </div>
                <div style={{ fontSize:'15px', fontWeight:600, color:D.cream, letterSpacing:'.5px', marginBottom:'6px' }}>{venue}</div>
                <div style={{ fontSize:'12.5px', color:`${D.creamM}80`, lineHeight:'1.7', marginBottom:'6px' }}>{addr}</div>
                <div style={{ fontSize:'11px', color:`${D.gold}65`, letterSpacing:'2.5px',
                  textTransform:'uppercase', marginBottom:'24px' }}>{W.dateStr}</div>
                <div style={{ display:'flex', alignItems:'center', gap:'8px', justifyContent:'center', marginBottom:'20px' }}>
                  <div style={{ width:'24px', height:'.5px', background:`${D.gold}35` }}/>
                  <div style={{ width:'3px', height:'3px', borderRadius:'50%', background:`${D.gold}50` }}/>
                  <div style={{ width:'24px', height:'.5px', background:`${D.gold}35` }}/>
                </div>
                <button style={{ background:'transparent', border:'none', padding:0,
                  fontFamily:"'Cormorant Garamond',serif", fontSize:'13px',
                  color:`${D.gold}75`, letterSpacing:'2.5px', textTransform:'uppercase',
                  cursor:'pointer', display:'inline-flex', alignItems:'center', gap:'8px', transition:'color .2s' }}
                  onMouseEnter={e=>e.currentTarget.style.color=D.gold}
                  onMouseLeave={e=>e.currentTarget.style.color=`${D.gold}75`}
                >
                  <MapPin size={11} strokeWidth={1.5}/>Open Maps
                  <span style={{ fontSize:'15px', lineHeight:1 }}>→</span>
                </button>
                <div style={{ position:'absolute', bottom:0, left:'20%', right:'20%', height:'1px',
                  background:`linear-gradient(90deg, transparent, ${D.gold}40, transparent)` }}/>
              </div>
            </FadeIn>
          ))}
          <ScrollNext/>
        </Sec>

        {/* ══ 9. SAVE THE DATE ════════════════════════ */}
        <Sec style={{ padding:'64px 24px 56px', minHeight:'calc(100vh - 110px)', justifyContent:'center', textAlign:'center' }}>
          <div style={{ position:'absolute', inset:0,
            background:'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(201,168,76,0.03) 0%, transparent 70%)' }}/>
          <FadeIn style={{ zIndex:1, width:'100%', display:'flex', flexDirection:'column', alignItems:'center' }}>
            <PF size={48} italic style={{ color:D.gold, marginBottom:'6px' }}>Save the Date</PF>
            <p style={{ color:`${D.creamM}70`, fontSize:'13px', letterSpacing:'1px',
              fontStyle:'italic', margin:'0 0 36px' }}>{W.dateStr} · Gedung Bea Cukai Jakarta</p>
            <div style={{ display:'flex', alignItems:'stretch', width:'100%', maxWidth:'380px', margin:'0 auto 44px' }}>
              {[{ v:cd.days, l:'Hari' },{ v:cd.hours, l:'Jam' },{ v:cd.minutes, l:'Menit' },{ v:cd.seconds, l:'Detik' }]
                .map(({ v, l }, i) => (
                <div key={l} style={{ flex:1, textAlign:'center',
                  borderLeft: i > 0 ? `1px solid rgba(255,255,255,0.08)` : 'none', padding:'0 4px' }}>
                  <div style={{ fontSize:'10px', color:`${D.gold}70`, letterSpacing:'3px',
                    textTransform:'uppercase', marginBottom:'10px' }}>{l}</div>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'52px',
                    fontWeight:300, color:D.white, lineHeight:1, letterSpacing:'-2px' }}>
                    {String(v).padStart(2,'0')}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ width:'100%', maxWidth:'380px', height:'.5px', margin:'0 auto 32px',
              background:`linear-gradient(90deg, transparent, ${D.gold}40, transparent)` }}/>
            <button style={{ background:'transparent', border:'none', padding:'0',
              fontFamily:"'Cormorant Garamond',serif", fontSize:'13px',
              color:`${D.gold}80`, letterSpacing:'3px', textTransform:'uppercase',
              cursor:'pointer', display:'inline-flex', alignItems:'center', gap:'10px', transition:'color .2s' }}
              onMouseEnter={e=>e.currentTarget.style.color=D.gold}
              onMouseLeave={e=>e.currentTarget.style.color=`${D.gold}80`}
            >
              <span style={{ display:'inline-block', width:'24px', height:'.5px', background:'currentColor', marginBottom:'1px' }}/>
              Add to Calendar
              <span style={{ display:'inline-block', width:'24px', height:'.5px', background:'currentColor', marginBottom:'1px' }}/>
            </button>
          </FadeIn>
          <ScrollNext/>
        </Sec>

        {/* ══ 10. RSVP ════════════════════════════════ */}
        <Sec style={{ padding:'64px 24px 56px', justifyContent:'center', textAlign:'center' }}>
          <div style={{ position:'absolute', inset:0,
            background:'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(201,168,76,0.03) 0%, transparent 70%)' }}/>
          <Particles count={5}/>
          <FadeIn style={{ zIndex:1, width:'100%', display:'flex', flexDirection:'column', alignItems:'center' }}>
            <p style={{ color:`${D.gold}70`, fontSize:'10px', letterSpacing:'6px',
              textTransform:'uppercase', margin:'0 0 10px' }}>Konfirmasi Kehadiran</p>
            <PF size={48} italic style={{ color:D.gold, marginBottom:'6px' }}>Reservation</PF>
            <p style={{ color:`${D.creamM}70`, fontSize:'14px', fontStyle:'italic', marginBottom:'4px' }}>
              Please confirm your attendance before,
            </p>
            <p style={{ color:D.cream, fontSize:'17px', fontWeight:600, letterSpacing:'.5px', marginBottom:'32px' }}>
              30 Mei 2028
            </p>

            {rsvpDone ? (
              <div style={{ textAlign:'center', maxWidth:'340px' }}>
                <div style={{ fontSize:'52px', marginBottom:'16px',
                  animation:'inv-twinkle 1.5s ease-in-out 3' }}>🕊️</div>
                <PF size={32} italic style={{ color:D.gold, marginBottom:'14px' }}>Terima Kasih</PF>
                <p style={{ fontSize:'15px', color:D.creamM, lineHeight:'1.9' }}>
                  {guestName.trim() && <><span style={{ color:D.gold }}>{guestName.trim()}</span>, </>}
                  konfirmasi kehadiranmu telah diterima.<br/>
                  Rafi &amp; Harista tidak sabar bertemu denganmu! 💛
                </p>
                <GLine my={24} width="80px"/>
              </div>
            ) : (
              <div style={{ width:'100%', maxWidth:'400px' }}>
                <div style={{
                  background:'rgba(255,255,255,0.025)',
                  border:`1px solid ${D.gold}22`,
                  borderRadius:'20px', padding:'28px 24px',
                  position:'relative',
                }}>
                  <Corners size={12} opacity="38" inset={10}/>
                  <p style={{ color:`${D.creamM}75`, fontSize:'14px', marginBottom:'20px',
                    letterSpacing:'.5px', fontStyle:'italic' }}>
                    Will you attend our wedding?
                  </p>
                  {[['attend','✓  Will Attend'],['absent','✗  Unable To Attend']].map(([v,l])=>(
                    <button key={v} onClick={()=>setRsvpChoice(v)} style={{
                      display:'block', width:'100%', padding:'13px', borderRadius:'99px',
                      marginBottom:'10px', cursor:'pointer', fontSize:'14px',
                      fontFamily:"'Cormorant Garamond', serif", letterSpacing:'1.5px',
                      background: rsvpChoice===v ? 'rgba(201,168,76,0.1)' : 'transparent',
                      color: rsvpChoice===v ? D.gold : `${D.creamM}65`,
                      border: rsvpChoice===v ? `1.5px solid ${D.gold}65` : `1px solid rgba(255,255,255,0.1)`,
                      transition:'all .25s',
                    }}>{l}</button>
                  ))}

                  {rsvpChoice==='attend' && (
                    <div style={{ margin:'8px 0 14px', textAlign:'center' }}>
                      <p style={{ color:`${D.creamM}55`, fontSize:'12px', marginBottom:'12px', letterSpacing:'.5px' }}>
                        Jumlah tamu (termasuk kamu)
                      </p>
                      <div style={{ display:'flex', alignItems:'center', gap:'14px', justifyContent:'center' }}>
                        <button onClick={()=>setGuests(n=>Math.max(1,n-1))} style={{ width:'36px', height:'36px',
                          borderRadius:'50%', background:'transparent', border:`1px solid ${D.gold}35`,
                          cursor:'pointer', color:D.gold, fontSize:'18px', fontWeight:700 }}>−</button>
                        <div style={{ width:'60px', textAlign:'center', color:D.white, fontSize:'24px',
                          fontWeight:600, fontFamily:"'Playfair Display',serif" }}>{guests}</div>
                        <button onClick={()=>setGuests(n=>n+1)} style={{ width:'36px', height:'36px',
                          borderRadius:'50%', background:'transparent', border:`1px solid ${D.gold}35`,
                          cursor:'pointer', color:D.gold, fontSize:'18px', fontWeight:700 }}>+</button>
                      </div>
                    </div>
                  )}

                  <button onClick={()=>rsvpChoice&&setRsvpDone(true)} style={{
                    display:'block', width:'100%', padding:'13px', borderRadius:'99px',
                    background: rsvpChoice ? 'rgba(201,168,76,0.1)' : 'transparent',
                    color: rsvpChoice ? D.gold : `${D.creamM}30`,
                    border: rsvpChoice ? `1.5px solid ${D.gold}55` : `1px solid rgba(255,255,255,0.06)`,
                    fontFamily:"'Cormorant Garamond', serif", fontSize:'15px', letterSpacing:'2px',
                    cursor: rsvpChoice ? 'pointer' : 'not-allowed', marginTop:'6px', transition:'all .25s',
                    textTransform:'uppercase',
                  }}>
                    {rsvpChoice ? 'Konfirmasi Kehadiran' : 'Confirm'}
                  </button>
                </div>
              </div>
            )}
          </FadeIn>
          <ScrollNext/>
        </Sec>

        {/* ══ 11. WEDDING WISH ════════════════════════ */}
        <Sec style={{ padding:'64px 24px 56px', justifyContent:'center' }}>
          <div style={{ position:'absolute', inset:0,
            background:'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(201,168,76,0.03) 0%, transparent 70%)' }}/>
          <FadeIn style={{ zIndex:1, width:'100%', display:'flex', flexDirection:'column', alignItems:'center' }}>
            <p style={{ color:`${D.gold}70`, fontSize:'10px', letterSpacing:'6px',
              textTransform:'uppercase', margin:'0 0 10px' }}>Titipkan Doa</p>
            <PF size={48} italic style={{ color:D.gold, marginBottom:'0' }}>Wedding Wish</PF>
            <GLine my={20} width="120px"/>

            <div style={{ width:'100%', maxWidth:'480px', marginBottom:'28px' }}>
              <textarea value={wishText} onChange={e=>setWishText(e.target.value)}
                placeholder="Tulis doa & harapanmu untuk Rafi & Harista..."
                rows={3}
                style={{
                  width:'100%', padding:'18px 20px', borderRadius:'16px',
                  border:`1px solid ${D.gold}${wishText ? '45' : '18'}`,
                  background:'rgba(255,255,255,0.025)', color:D.cream,
                  fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:'15px',
                  lineHeight:'1.7', resize:'none', outline:'none', boxSizing:'border-box',
                  transition:'border-color .3s',
                }}
                onFocus={e => e.target.style.borderColor=`${D.gold}55`}
                onBlur={e => e.target.style.borderColor=wishText ? `${D.gold}45` : `${D.gold}18`}
              />
              <button onClick={sendWish} style={{
                display:'block', width:'100%', padding:'13px',
                background: wishText.trim() ? 'rgba(201,168,76,0.08)' : 'transparent',
                color: wishText.trim() ? D.gold : `${D.creamM}35`,
                border: wishText.trim() ? `1.5px solid ${D.gold}55` : `1px solid rgba(255,255,255,0.07)`,
                borderRadius:'99px', marginTop:'10px',
                fontFamily:"'Cormorant Garamond', serif", fontSize:'15px', letterSpacing:'2px',
                cursor: wishText.trim() ? 'pointer' : 'default', transition:'all .25s',
                textTransform:'uppercase',
              }}>
                Kirim Doa 🤲
              </button>
            </div>

            <div style={{ width:'100%', maxWidth:'480px', display:'flex', flexDirection:'column', gap:'10px' }}>
              {wishes.map((w,i)=>(
                <div key={i} style={{ padding:'16px 20px', borderRadius:'14px',
                  background:D.bgCard,
                  border:`1px solid ${D.gold}12`,
                  borderLeft:`2.5px solid ${D.gold}50`,
                  textAlign:'left' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'6px' }}>
                    <div style={{ width:'26px', height:'26px', borderRadius:'50%', flexShrink:0,
                      background:`linear-gradient(135deg, ${D.gold}28, ${D.gold}0A)`,
                      border:`1px solid ${D.gold}35`,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:'11px', color:D.gold, fontWeight:700 }}>
                      {w.name[0]}
                    </div>
                    <span style={{ fontSize:'14px', fontWeight:700, color:D.gold }}>{w.name}</span>
                    <span style={{ fontSize:'11px', color:`${D.creamM}45`, marginLeft:'auto' }}>{w.time}</span>
                  </div>
                  <p style={{ fontSize:'14.5px', color:`${D.creamM}90`, lineHeight:'1.75',
                    margin:'0', paddingLeft:'36px' }}>{w.msg}</p>
                </div>
              ))}
            </div>
          </FadeIn>
          <ScrollNext/>
        </Sec>

        {/* ══ 12. WEDDING GIFT ════════════════════════ */}
        <Sec style={{ padding:'64px 24px 56px', justifyContent:'center', textAlign:'center' }}>
          <div style={{ position:'absolute', inset:0,
            background:'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(201,168,76,0.03) 0%, transparent 70%)' }}/>
          <FadeIn style={{ zIndex:1, width:'100%', display:'flex', flexDirection:'column', alignItems:'center' }}>
            <p style={{ color:`${D.gold}70`, fontSize:'10px', letterSpacing:'6px',
              textTransform:'uppercase', margin:'0 0 10px' }}>Amplop Digital</p>
            <PF size={48} italic style={{ color:D.gold, marginBottom:'14px' }}>Wedding Gift</PF>
            <p style={{ maxWidth:'360px', fontSize:'15px', color:`${D.creamM}80`, lineHeight:'1.85',
              fontStyle:'italic', marginBottom:'32px' }}>
              Your presence and blessings are the greatest gift we could ask for.
              However, should you wish to share a gift, a Digital Envelope has been
              provided for your convenience.
            </p>
            {!showBank
              ? <Pill variant="dark" onClick={()=>setShowBank(true)} style={{ border:`1px solid ${D.gold}40` }}>
                  Open Bank Information
                </Pill>
              : (
                <div style={{ width:'100%', maxWidth:'380px', display:'flex', flexDirection:'column', gap:'12px' }}>
                  {W.accounts.map(({ bank, no, name: accName })=>(
                    <div key={bank} style={{ background:D.bgCard, borderRadius:'16px', padding:'22px 24px',
                      border:`1px solid ${D.gold}28`, textAlign:'left', position:'relative' }}>
                      <Corners size={10} opacity="35" inset={8}/>
                      <div style={{ fontSize:'11px', fontWeight:700, color:`${D.gold}80`, letterSpacing:'2.5px',
                        textTransform:'uppercase', marginBottom:'8px' }}>{bank}</div>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'12px' }}>
                        <div style={{ fontSize:'21px', fontWeight:600, color:D.white, letterSpacing:'2.5px',
                          fontFamily:"'Playfair Display', serif" }}>{no}</div>
                        <button onClick={() => copyAccount(no, bank)} style={{
                          flexShrink:0,
                          background: copiedBank===bank ? `rgba(201,168,76,0.15)` : 'transparent',
                          border:`1px solid ${copiedBank===bank ? D.gold : `${D.gold}30`}`,
                          borderRadius:'8px', padding:'5px 12px',
                          color: copiedBank===bank ? D.gold : `${D.gold}60`,
                          fontSize:'11px', letterSpacing:'1px', cursor:'pointer',
                          fontFamily:"'Cormorant Garamond',serif",
                          transition:'all .2s',
                        }}>
                          {copiedBank===bank ? '✓ Tersalin' : 'Salin'}
                        </button>
                      </div>
                      <div style={{ fontSize:'13px', color:`${D.creamM}80`, marginTop:'6px' }}>a.n. {accName}</div>
                    </div>
                  ))}
                </div>
              )
            }
          </FadeIn>
          <ScrollNext/>
        </Sec>

        {/* ══ 13. CLOSING ═════════════════════════════ */}
        <div style={{ position:'relative', overflow:'hidden', minHeight:'55vh',
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center' }}>
          <img src={IMG('cover3.jpg')} alt=""
            style={{ position:'absolute', inset:0, width:'100%', height:'100%',
              objectFit:'cover', objectPosition:'center 30%',
              filter:'brightness(0.22) saturate(0.5)', display:'block' }}/>
          <div style={{ position:'absolute', inset:0,
            background:'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.65) 100%)' }}/>
          <Particles count={6}/>
          <FadeIn style={{ position:'relative', zIndex:1, padding:'48px 24px' }}>
            <div style={{ color:D.gold, fontSize:'20px', letterSpacing:'14px', marginBottom:'24px', opacity:.6 }}>✦ ✦ ✦</div>
            <PF size={44} italic style={{ color:D.white, marginBottom:'10px' }}>
              {W.brideFirst} &amp; {W.groomFirst}
            </PF>
            <GLine my={20} width="100px"/>
            <p style={{ fontSize:'14px', color:D.creamM, lineHeight:'1.9', maxWidth:'300px',
              fontStyle:'italic', margin:'0 auto 20px' }}>
              Merupakan suatu kebahagiaan dan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i
              berkenan hadir dan memberikan doa restu.
            </p>
            {guestName.trim() && (
              <p style={{ fontSize:'14px', color:`${D.gold}90`, fontStyle:'italic',
                margin:'0 0 16px', letterSpacing:'.5px' }}>
                Terima kasih, {guestName.trim()}. Sampai bertemu! 💛
              </p>
            )}
            <div style={{ fontSize:'13px', color:D.gold, opacity:.7, letterSpacing:'3px' }}>3 · 6 · 2028</div>
          </FadeIn>
        </div>

      </>}

      {/* ── Floating controls ─────────────────────────── */}
      {opened && (
        <div style={{ position:'fixed', bottom:'80px', left:'14px', zIndex:300,
          display:'flex', flexDirection:'column', gap:'8px' }}>
          {/* Music */}
          <div onClick={toggleMusic} style={{
            width:'44px', height:'44px', borderRadius:'50%',
            background:'#1A1A1A', border:`1px solid ${D.gold}${playing ? '80' : '30'}`,
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow: playing ? `0 0 14px ${D.gold}40` : '0 2px 16px rgba(0,0,0,0.5)',
            cursor:'pointer', transition:'border-color .3s, box-shadow .3s',
          }}>
            {playing
              ? <Pause size={15} color={D.gold} strokeWidth={1.8} style={{ flexShrink:0 }}/>
              : <Music  size={15} color={D.gold} strokeWidth={1.5}
                  style={{ animation:'inv-spin 4s linear infinite', flexShrink:0 }}/>
            }
          </div>
          {/* Fullscreen */}
          <div onClick={toggleFullscreen} style={{
            width:'44px', height:'44px', borderRadius:'50%',
            background:'#1A1A1A', border:`1px solid ${D.gold}${isFullscreen ? '70' : '25'}`,
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'0 2px 16px rgba(0,0,0,0.5)',
            cursor:'pointer', transition:'border-color .3s',
          }} title={isFullscreen ? 'Keluar fullscreen' : 'Fullscreen'}>
            {isFullscreen
              ? <Minimize size={14} color={D.gold} strokeWidth={1.5}/>
              : <Maximize size={14} color={`${D.gold}BB`} strokeWidth={1.5}/>
            }
          </div>
        </div>
      )}

    </div>
  )
}
