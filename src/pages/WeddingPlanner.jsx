import { useState, useEffect, useRef } from 'react'
import {
  Plus, Trash2, Heart, Users, DollarSign, CheckSquare, X,
  Store, Clock, LayoutGrid, Check, MapPin, Phone,
  Image, Sparkles, Palmtree, ChevronDown, ChevronUp, Edit2, Save,
  TrendingUp, Settings2, Zap, Star, CalendarDays
} from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useIsMobile } from '../hooks/useIsMobile'

/* ─── helpers ─── */
function getCountdown(dateStr) {
  if (!dateStr) return null
  const diff = new Date(dateStr) - new Date()
  if (diff < 0) return { passed: true }
  const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24))
  const years  = Math.floor(totalDays / 365)
  const months = Math.floor((totalDays % 365) / 30)
  const days   = totalDays % 30
  return { totalDays, years, months, days }
}

/* ─── default data ─── */
const DEFAULT_CHECKLIST = [
  { id:'c1',  category:'12+ Bulan Sebelumnya', task:'Tentukan anggaran pernikahan', done:false },
  { id:'c2',  category:'12+ Bulan Sebelumnya', task:'Tentukan jumlah tamu (intim / sedang / besar)', done:false },
  { id:'c3',  category:'12+ Bulan Sebelumnya', task:'Pilih & booking venue', done:false },
  { id:'c4',  category:'12+ Bulan Sebelumnya', task:'Tentukan tanggal resmi pernikahan', done:false },
  { id:'c5',  category:'12+ Bulan Sebelumnya', task:'Mulai susun daftar tamu', done:false },
  { id:'c6',  category:'9–12 Bulan Sebelumnya', task:'Booking penghulu / KUA', done:false },
  { id:'c7',  category:'9–12 Bulan Sebelumnya', task:'Booking fotografer & videografer', done:false },
  { id:'c8',  category:'9–12 Bulan Sebelumnya', task:'Pilih anggota bridesmaid & groomsmen', done:false },
  { id:'c9',  category:'9–12 Bulan Sebelumnya', task:'Mulai cari gaun & busana pengantin', done:false },
  { id:'c10', category:'9–12 Bulan Sebelumnya', task:'Kirim save-the-date', done:false },
  { id:'c11', category:'6–9 Bulan Sebelumnya',  task:'Booking katering & pilih paket', done:false },
  { id:'c12', category:'6–9 Bulan Sebelumnya',  task:'Booking florist / dekorasi', done:false },
  { id:'c13', category:'6–9 Bulan Sebelumnya',  task:'Booking DJ / live band / musik', done:false },
  { id:'c14', category:'6–9 Bulan Sebelumnya',  task:'Rencanakan bulan madu', done:false },
  { id:'c15', category:'3–6 Bulan Sebelumnya',  task:'Pesan undangan pernikahan', done:false },
  { id:'c16', category:'3–6 Bulan Sebelumnya',  task:'Booking hair & make-up artist', done:false },
  { id:'c17', category:'3–6 Bulan Sebelumnya',  task:'Tasting kue pengantin', done:false },
  { id:'c18', category:'3–6 Bulan Sebelumnya',  task:'Booking transportasi pernikahan', done:false },
  { id:'c19', category:'1–3 Bulan Sebelumnya',  task:'Kirim undangan', done:false },
  { id:'c20', category:'1–3 Bulan Sebelumnya',  task:'Finalisasi menu dengan katering', done:false },
  { id:'c21', category:'1–3 Bulan Sebelumnya',  task:'Fitting gaun / busana pengantin', done:false },
  { id:'c22', category:'1–3 Bulan Sebelumnya',  task:'Buat denah meja tamu', done:false },
  { id:'c23', category:'1 Bulan Sebelumnya',    task:'Konfirmasi semua vendor', done:false },
  { id:'c24', category:'1 Bulan Sebelumnya',    task:'Urus dokumen pernikahan', done:false },
  { id:'c25', category:'1 Bulan Sebelumnya',    task:'Finalisasi naskah akad & janji', done:false },
  { id:'c26', category:'Minggu H',              task:'Fitting terakhir gaun / busana', done:false },
  { id:'c27', category:'Minggu H',              task:'Serahkan cincin ke best man / maid of honor', done:false },
  { id:'c28', category:'Minggu H',              task:'Konfirmasi jumlah tamu ke katering', done:false },
  { id:'c29', category:'Minggu H',              task:'Siapkan emergency kit hari H', done:false },
]
const DEFAULT_BUDGET_CATS = [
  { id:'b1',  name:'Venue',                allocated:0, spent:0, color:'#C4956A' },
  { id:'b2',  name:'Katering & Kue',       allocated:0, spent:0, color:'#D4857A' },
  { id:'b3',  name:'Foto & Video',         allocated:0, spent:0, color:'#7B9B80' },
  { id:'b4',  name:'Musik & Hiburan',      allocated:0, spent:0, color:'#B8860B' },
  { id:'b5',  name:'Bunga & Dekorasi',     allocated:0, spent:0, color:'#A07060' },
  { id:'b6',  name:'Gaun & Busana',        allocated:0, spent:0, color:'#C47D7D' },
  { id:'b7',  name:'Bulan Madu',           allocated:0, spent:0, color:'#7A8B9B' },
  { id:'b8',  name:'Undangan & Cetak',     allocated:0, spent:0, color:'#9B8E7E' },
  { id:'b9',  name:'Transportasi',         allocated:0, spent:0, color:'#8B7B6B' },
  { id:'b10', name:'Cincin',               allocated:0, spent:0, color:'#B8900B' },
  { id:'b11', name:'Lain-lain',            allocated:0, spent:0, color:'#A09590' },
]
const DEFAULT_RUNDOWN = [
  { id:'rd1', time:'06:00', event:'Persiapan Pengantin Wanita', location:'Rumah / Hotel',  notes:'' },
  { id:'rd2', time:'08:00', event:'Persiapan Pengantin Pria',   location:'Rumah / Hotel',  notes:'' },
  { id:'rd3', time:'09:00', event:'Prosesi Akad Nikah',         location:'Masjid / KUA',   notes:'' },
  { id:'rd4', time:'11:00', event:'Sesi Foto Keluarga',         location:'Lokasi Akad',    notes:'' },
  { id:'rd5', time:'12:00', event:'Istirahat & Makan Siang',    location:'',               notes:'' },
  { id:'rd6', time:'14:00', event:'Persiapan Resepsi',          location:'Venue',          notes:'' },
  { id:'rd7', time:'15:00', event:'Resepsi Pernikahan',         location:'Venue Resepsi',  notes:'' },
  { id:'rd8', time:'18:00', event:'Foto Bersama Tamu',          location:'Venue',          notes:'' },
  { id:'rd9', time:'19:00', event:'Penutupan Resepsi',          location:'Venue',          notes:'' },
]
const VENDOR_CATS = ['Foto','Videografi','Katering','Musik & Band','MUA','Dekorasi & Florist','Gaun & Busana','WO','Paket Pernikahan','Venue','Transportasi','Lainnya']
const VENDOR_STATUS_OPTS = [
  { label:'Shortlisted', color:'#707070', bg:'rgba(112,112,112,0.1)' },
  { label:'Negosiasi',   color:'#B8860B', bg:'rgba(184,134,11,0.1)'  },
  { label:'Booked',      color:'#4A90D9', bg:'rgba(74,144,217,0.1)'  },
  { label:'Confirmed',   color:'#388858', bg:'rgba(56,136,88,0.1)'   },
]
const VB_CATS = ['Venue','Gaun','Dekorasi','Bunga','Kue','Foto Style','Undangan','Honeymoon','Lainnya']
const BRIDESMAID_ROLES = ['Maid of Honor','Bridesmaid','Bridegroom','Groomsman','Best Man','Flower Girl','Ring Bearer','MC']

const uid = () => `_${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`

/* ─── Tab config ─── */
const TABS = [
  { id:'checklist',   label:'Checklist',   Icon:CheckSquare, color:'#9B59C4', bg:'rgba(155,89,196,0.12)' },
  { id:'budget',      label:'Budget',      Icon:DollarSign,  color:'#FF9F0A', bg:'rgba(255,159,10,0.12)'  },
  { id:'guests',      label:'Tamu',        Icon:Users,       color:'#4A90D9', bg:'rgba(74,144,217,0.12)'  },
  { id:'vendor',      label:'Vendor',      Icon:Store,       color:'#34C759', bg:'rgba(52,199,89,0.12)'   },
  { id:'rundown',     label:'Rundown',     Icon:Clock,       color:'#FF6B6B', bg:'rgba(255,107,107,0.12)' },
  { id:'visionboard', label:'Vision Board',Icon:LayoutGrid,  color:'#C96FBB', bg:'rgba(201,111,187,0.12)' },
]

/* ─── status chip ─── */
function StatusBadge({ label }) {
  const s = VENDOR_STATUS_OPTS.find(x => x.label === label) || VENDOR_STATUS_OPTS[0]
  return <span style={{ padding:'3px 10px', borderRadius:'99px', fontSize:'11.5px', fontWeight:700, color:s.color, background:s.bg }}>{s.label}</span>
}

/* ─── Animated checkbox ─── */
function AnimCheckbox({ done, color, onClick, size = 22 }) {
  const [animate, setAnimate] = useState(false)
  const handleClick = () => {
    setAnimate(true)
    setTimeout(() => setAnimate(false), 350)
    onClick()
  }
  return (
    <button onClick={handleClick} style={{
      width:`${size}px`, height:`${size}px`, borderRadius:'7px', flexShrink:0,
      border:`2px solid ${done ? color : 'var(--border)'}`,
      background: done ? color : 'transparent',
      cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
      transition:'border-color 0.2s, background 0.2s',
      boxShadow: done ? `0 2px 10px ${color}50` : 'none',
      transform: animate ? 'scale(1.3)' : 'scale(1)',
      transitionProperty: animate ? 'transform' : 'border-color, background, box-shadow',
    }}>
      {done && <Check size={size - 10} color="white" strokeWidth={3}/>}
    </button>
  )
}

export default function WeddingPlanner() {
  const [data, setData] = useLocalStorage('wedding', {
    weddingDate:'', partnerName:'', myName:'',
    checklist: DEFAULT_CHECKLIST,
    budget: { total:0, categories: DEFAULT_BUDGET_CATS },
    guests: [],
    vendors: [],
    rundown: DEFAULT_RUNDOWN,
    visionBoard: [],
    bridesmaids: [],
  })

  useEffect(() => {
    setData(prev => ({
      ...prev,
      checklist:   prev.checklist?.length   ? prev.checklist   : DEFAULT_CHECKLIST,
      rundown:     prev.rundown?.length     ? prev.rundown     : DEFAULT_RUNDOWN,
      vendors:     prev.vendors             || [],
      visionBoard: prev.visionBoard         || [],
      bridesmaids: prev.bridesmaids         || [],
      budget: {
        ...prev.budget,
        categories: prev.budget?.categories?.length ? prev.budget.categories : DEFAULT_BUDGET_CATS,
      },
    }))
  }, []) // eslint-disable-line

  const isMobile = useIsMobile()
  const [tab, setTab]               = useState('checklist')
  const [newTask, setNewTask]       = useState('')
  const [newGuest, setNewGuest]     = useState(null)
  const [newVendor, setNewVendor]   = useState(null)
  const [newRd, setNewRd]           = useState(null)
  const [newVB, setNewVB]           = useState(null)
  const [newBm, setNewBm]           = useState(null)
  const [editRd, setEditRd]         = useState(null)
  const [expandedVendor, setExpandedV] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [editingHero, setEditingHero]   = useState(null) // 'myName' | 'partnerName' | 'date'
  const [hoveredStat, setHoveredStat]   = useState(null)
  const heroInputRef = useRef(null)

  useEffect(() => { if (editingHero) heroInputRef.current?.focus() }, [editingHero])

  /* ─── checklist ─── */
  const toggleCheck = id => setData(d => ({ ...d, checklist: d.checklist.map(t => t.id===id ? {...t, done:!t.done} : t) }))
  const addTask = () => {
    if (!newTask.trim()) return
    setData(d => ({ ...d, checklist: [...d.checklist, { id:uid(), category:'Custom', task:newTask.trim(), done:false }] }))
    setNewTask('')
  }
  const removeTask = id => setData(d => ({ ...d, checklist: d.checklist.filter(t => t.id!==id) }))
  const categories = [...new Set((data.checklist||[]).map(t => t.category))]
  const completed = (data.checklist||[]).filter(t => t.done).length
  const total = (data.checklist||[]).length

  /* ─── budget ─── */
  const budgetCats     = data.budget?.categories?.length ? data.budget.categories : DEFAULT_BUDGET_CATS
  const totalAllocated = budgetCats.reduce((s,c) => s+Number(c.allocated||0), 0)
  const totalSpent     = budgetCats.reduce((s,c) => s+Number(c.spent||0), 0)
  const totalBudget    = Number(data.budget?.total||0)
  const updateCat = (id,field,val) => setData(d => ({
    ...d,
    budget: {
      ...d.budget,
      categories: (d.budget?.categories?.length ? d.budget.categories : DEFAULT_BUDGET_CATS)
        .map(c => c.id===id ? {...c,[field]:val} : c)
    }
  }))

  /* ─── guests ─── */
  const addGuest = () => {
    if (!newGuest?.name?.trim()) return
    setData(d => ({ ...d, guests: [...(d.guests||[]), { id:uid(), name:newGuest.name, email:newGuest.email||'', rsvp:'pending', plusOne:false, dietary:newGuest.dietary||'', meja:newGuest.meja||'' }] }))
    setNewGuest(null)
  }
  const updateGuest = (id,field,val) => setData(d => ({ ...d, guests: d.guests.map(g => g.id===id ? {...g,[field]:val} : g) }))
  const removeGuest = id => setData(d => ({ ...d, guests: d.guests.filter(g => g.id!==id) }))

  /* ─── bridesmaids ─── */
  const addBm = () => {
    if (!newBm?.name?.trim()) return
    setData(d => ({ ...d, bridesmaids: [...(d.bridesmaids||[]), { id:uid(), name:newBm.name, role:newBm.role||'Bridesmaid', contact:newBm.contact||'', notes:newBm.notes||'' }] }))
    setNewBm(null)
  }
  const removeBm = id => setData(d => ({ ...d, bridesmaids: d.bridesmaids.filter(b => b.id!==id) }))

  /* ─── vendors ─── */
  const addVendor = () => {
    if (!newVendor?.name?.trim()) return
    setData(d => ({ ...d, vendors: [...(d.vendors||[]), { id:uid(), name:newVendor.name, category:newVendor.category||'Lainnya', status:'Shortlisted', price:newVendor.price||'', contact:newVendor.contact||'', notes:newVendor.notes||'', link:newVendor.link||'' }] }))
    setNewVendor(null)
  }
  const updateVendor = (id,field,val) => setData(d => ({ ...d, vendors: d.vendors.map(v => v.id===id ? {...v,[field]:val} : v) }))
  const removeVendor = id => setData(d => ({ ...d, vendors: d.vendors.filter(v => v.id!==id) }))
  const bookedVendors = (data.vendors||[]).filter(v => v.status==='Booked'||v.status==='Confirmed')

  /* ─── rundown ─── */
  const addRd = () => {
    if (!newRd?.event?.trim()) return
    setData(d => ({ ...d, rundown: [...(d.rundown||[]), { id:uid(), time:newRd.time||'00:00', event:newRd.event, location:newRd.location||'', notes:newRd.notes||'' }].sort((a,b)=>a.time.localeCompare(b.time)) }))
    setNewRd(null)
  }
  const removeRd = id => setData(d => ({ ...d, rundown: (d.rundown||[]).filter(r => r.id!==id) }))
  const updateRd = (id,field,val) => setData(d => ({ ...d, rundown: d.rundown.map(r => r.id===id ? {...r,[field]:val} : r) }))

  /* ─── vision board ─── */
  const addVB = () => {
    if (!newVB?.title?.trim()) return
    setData(d => ({ ...d, visionBoard: [...(d.visionBoard||[]), { id:uid(), title:newVB.title, category:newVB.category||'Lainnya', imageUrl:newVB.imageUrl||'', notes:newVB.notes||'' }] }))
    setNewVB(null)
  }
  const removeVB = id => setData(d => ({ ...d, visionBoard: d.visionBoard.filter(v => v.id!==id) }))

  const fmtRp = v => v ? `Rp ${Number(v).toLocaleString('id-ID')}` : '—'
  const countdown = getCountdown(data.weddingDate)
  const weddingDateFmt = data.weddingDate
    ? new Date(data.weddingDate).toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' })
    : null
  const checkPct = total ? Math.round((completed/total)*100) : 0

  /* ─── Stat card data ─── */
  const STATS = [
    { id:'checklist', label:'Checklist', value:`${checkPct}%`, sub:`${completed}/${total} selesai`,    color:'#9B59C4', tabId:'checklist', Icon:CheckSquare },
    { id:'guests',    label:'Tamu',      value:(data.guests||[]).length, sub:'tamu diundang',           color:'#4A90D9', tabId:'guests',    Icon:Users       },
    { id:'vendor',    label:'Vendor',    value:(data.vendors||[]).length, sub:`${bookedVendors.length} confirmed`, color:'#34C759', tabId:'vendor', Icon:Store },
    { id:'budget',    label:'Budget',    value:totalBudget ? `${Math.round((totalSpent/totalBudget)*100)}%` : '–', sub:totalBudget ? `${fmtRp(totalSpent)} terpakai` : 'belum diset', color:'#FF9F0A', tabId:'budget', Icon:DollarSign },
  ]

  return (
    <div className="page" style={{ padding: isMobile ? '0' : '8px' }}>

      {/* ── Hero card ── */}
      <div style={{
        borderRadius:'24px', padding: isMobile ? '24px 20px 20px' : '32px 32px 26px', marginBottom:'16px',
        background:'linear-gradient(135deg, #C96FBB 0%, #9B59C4 45%, #6C3FC4 100%)',
        position:'relative', overflow:'hidden',
      }}>
        {/* Decorative rings */}
        <div style={{ position:'absolute', top:'-60px', right:'-40px', width:'260px', height:'260px', borderRadius:'50%', border:'1.5px solid rgba(255,255,255,0.08)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', top:'-30px', right:'-10px', width:'180px', height:'180px', borderRadius:'50%', border:'1.5px solid rgba(255,255,255,0.06)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:'-50px', left:'25%', width:'180px', height:'180px', borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', top:'20px', left:'42%', width:'6px', height:'6px', borderRadius:'50%', background:'rgba(255,255,255,0.3)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', top:'50px', left:'55%', width:'4px', height:'4px', borderRadius:'50%', background:'rgba(255,255,255,0.2)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:'30px', left:'60%', width:'5px', height:'5px', borderRadius:'50%', background:'rgba(255,255,255,0.25)', pointerEvents:'none' }}/>

        {/* Top row */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'22px' }}>
          {/* Left: names — inline editable */}
          <div style={{ color:'white', position:'relative' }}>
            <div style={{ fontSize:'10.5px', fontWeight:600, letterSpacing:'2.5px', textTransform:'uppercase', opacity:0.6, marginBottom:'12px' }}>
              Wedding Planner
            </div>

            <div style={{ display:'flex', alignItems:'center', gap:'0', fontSize: isMobile ? '24px' : '36px', fontWeight:800, lineHeight:1.05, letterSpacing:'-0.5px', marginBottom:'10px', flexWrap:'wrap' }}>
              {/* My name */}
              {editingHero === 'myName' ? (
                <input ref={heroInputRef}
                  value={data.myName||''}
                  onChange={e => setData(d=>({...d, myName:e.target.value}))}
                  onBlur={()=>setEditingHero(null)}
                  onKeyDown={e=>{ if(e.key==='Enter'||e.key==='Escape') setEditingHero(null) }}
                  style={{ background:'rgba(255,255,255,0.15)', border:'1.5px solid rgba(255,255,255,0.4)', borderRadius:'10px', padding:'4px 12px', color:'white', fontSize:'32px', fontWeight:800, width:'160px', outline:'none', backdropFilter:'blur(8px)' }}
                />
              ) : (
                <span onClick={()=>setEditingHero('myName')}
                  title="Klik untuk edit"
                  style={{ cursor:'pointer', borderBottom:'1.5px dashed rgba(255,255,255,0.3)', paddingBottom:'1px', transition:'border-color 0.15s' }}
                  onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.7)'}
                  onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.3)'}>
                  {data.myName||'Rafi'}
                </span>
              )}
              <span style={{ opacity:0.35, fontWeight:300, fontSize:'28px', margin:'0 12px', lineHeight:1 }}>×</span>
              {/* Partner name */}
              {editingHero === 'partnerName' ? (
                <input ref={heroInputRef}
                  value={data.partnerName||''}
                  onChange={e => setData(d=>({...d, partnerName:e.target.value}))}
                  onBlur={()=>setEditingHero(null)}
                  onKeyDown={e=>{ if(e.key==='Enter'||e.key==='Escape') setEditingHero(null) }}
                  style={{ background:'rgba(255,255,255,0.15)', border:'1.5px solid rgba(255,255,255,0.4)', borderRadius:'10px', padding:'4px 12px', color:'white', fontSize:'32px', fontWeight:800, width:'180px', outline:'none', backdropFilter:'blur(8px)' }}
                />
              ) : (
                <span onClick={()=>setEditingHero('partnerName')}
                  title="Klik untuk edit"
                  style={{ cursor:'pointer', borderBottom:'1.5px dashed rgba(255,255,255,0.3)', paddingBottom:'1px', transition:'border-color 0.15s' }}
                  onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.7)'}
                  onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.3)'}>
                  {data.partnerName||'Harista'}
                </span>
              )}
            </div>

            <div style={{ display:'flex', alignItems:'center', gap:'7px', fontSize:'13px', opacity:0.8, cursor:'pointer' }}
              onClick={()=>setEditingHero(editingHero==='date' ? null : 'date')}
              title="Klik untuk ubah tanggal">
              <Heart size={12} strokeWidth={2} fill="rgba(255,255,255,0.6)" color="white"/>
              {editingHero === 'date' ? (
                <input type="date"
                  ref={heroInputRef}
                  value={data.weddingDate||''}
                  onChange={e=>setData(d=>({...d,weddingDate:e.target.value}))}
                  onBlur={()=>setEditingHero(null)}
                  style={{ background:'rgba(255,255,255,0.15)', border:'1.5px solid rgba(255,255,255,0.4)', borderRadius:'8px', padding:'3px 10px', color:'white', fontSize:'13px', outline:'none', colorScheme:'dark' }}
                />
              ) : (
                <span style={{ borderBottom:'1px dashed rgba(255,255,255,0.3)', paddingBottom:'1px' }}>
                  {weddingDateFmt || 'Klik untuk set tanggal pernikahan'}
                </span>
              )}
            </div>
            <div style={{ fontSize:'10px', opacity:0.45, marginTop:'5px', marginLeft:'19px' }}>Klik nama atau tanggal untuk edit</div>
          </div>

          {/* Right: countdown */}
          {countdown && !countdown.passed ? (
            <div style={{ textAlign:'right', color:'white', flexShrink:0 }}>
              <div style={{ fontSize:'62px', fontWeight:900, lineHeight:1, letterSpacing:'-3px', textShadow:'0 4px 24px rgba(0,0,0,0.25)' }}>
                {countdown.totalDays.toLocaleString()}
              </div>
              <div style={{ fontSize:'11px', fontWeight:600, opacity:0.65, letterSpacing:'2px', textTransform:'uppercase', marginTop:'3px' }}>
                hari tersisa
              </div>
              <div style={{ display:'flex', gap:'6px', justifyContent:'flex-end', marginTop:'12px' }}>
                {[{ v:countdown.years, l:'thn' }, { v:countdown.months, l:'bln' }, { v:countdown.days, l:'hr' }].map(({ v, l }) => (
                  <div key={l} style={{ textAlign:'center', background:'rgba(255,255,255,0.14)', borderRadius:'10px', padding:'6px 11px', backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,0.22)' }}>
                    <div style={{ fontSize:'18px', fontWeight:800, lineHeight:1 }}>{v}</div>
                    <div style={{ fontSize:'10px', opacity:0.65, marginTop:'2px' }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ fontSize:'52px', filter:'drop-shadow(0 4px 12px rgba(0,0,0,0.2))' }}>💍</div>
          )}
        </div>

        {/* Progress bar with milestone dots */}
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:'11.5px', color:'rgba(255,255,255,0.7)', marginBottom:'7px', fontWeight:500 }}>
            <span>Wedding checklist</span>
            <span style={{ fontWeight:700, color:'white' }}>{completed}/{total} tugas · {checkPct}%</span>
          </div>
          <div style={{ position:'relative', height:'7px', background:'rgba(255,255,255,0.18)', borderRadius:'99px', overflow:'visible' }}>
            <div style={{ height:'100%', width:`${checkPct}%`, background:'linear-gradient(90deg,rgba(255,255,255,0.9),rgba(255,255,255,0.7))', borderRadius:'99px', transition:'width 0.8s ease', position:'relative' }}/>
            {/* Milestone dots */}
            {[25,50,75].map(m => (
              <div key={m} style={{ position:'absolute', top:'50%', left:`${m}%`, transform:'translate(-50%,-50%)', width:'11px', height:'11px', borderRadius:'50%', background: checkPct >= m ? 'white' : 'rgba(255,255,255,0.25)', border:'2px solid rgba(255,255,255,0.5)', boxShadow: checkPct >= m ? '0 0 8px rgba(255,255,255,0.6)' : 'none', transition:'all 0.4s', zIndex:2 }}/>
            ))}
          </div>
        </div>

        {/* Settings toggle */}
        <button onClick={()=>setShowSettings(s=>!s)} style={{
          position:'absolute', top:'20px', right:'20px',
          width:'34px', height:'34px', borderRadius:'11px', border:'none',
          background: showSettings ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.15)',
          color:'white', display:'flex', alignItems:'center', justifyContent:'center',
          cursor:'pointer', backdropFilter:'blur(8px)',
          border:'1px solid rgba(255,255,255,0.2)',
          transition:'background 0.2s',
        }}>
          <Settings2 size={14}/>
        </button>
      </div>

      {/* Settings strip */}
      {showSettings && (
        <div className="card animate-in" style={{ padding:'18px 22px', marginBottom:'16px', borderRadius:'16px', border:'1px solid rgba(155,89,196,0.2)', background:'rgba(155,89,196,0.03)' }}>
          <div style={{ fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'1.5px', color:'#9B59C4', marginBottom:'14px' }}>Pengaturan Pernikahan</div>
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap:'12px', alignItems:'end' }}>
            <div className="field"><label className="field-label">Namamu</label>
              <input value={data.myName||''} onChange={e=>setData(d=>({...d,myName:e.target.value}))} placeholder="Namamu"/></div>
            <div className="field"><label className="field-label">Nama Pasangan</label>
              <input value={data.partnerName||''} onChange={e=>setData(d=>({...d,partnerName:e.target.value}))} placeholder="Nama pasangan"/></div>
            <div className="field"><label className="field-label">Tanggal Pernikahan</label>
              <input type="date" value={data.weddingDate||''} onChange={e=>setData(d=>({...d,weddingDate:e.target.value}))}/></div>
          </div>
        </div>
      )}

      {/* ── Stat chips — clickable ── */}
      <div style={{ display:'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap:'10px', marginBottom:'20px' }}>
        {STATS.map(({ id, label, value, sub, color, tabId, Icon }) => {
          const isHov = hoveredStat === id
          return (
            <div key={id}
              onClick={() => setTab(tabId)}
              onMouseEnter={() => setHoveredStat(id)}
              onMouseLeave={() => setHoveredStat(null)}
              style={{
                padding:'18px 18px 16px',
                cursor:'pointer',
                background: isHov ? `${color}08` : 'white',
                border: `1px solid ${isHov ? color+'30' : 'var(--border)'}`,
                borderRadius:'16px',
                transform: isHov ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow: isHov ? `0 8px 28px ${color}18, 0 2px 8px rgba(0,0,0,0.04)` : '0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)',
                transition:'all 0.2s',
              }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'14px' }}>
                <div style={{ width:'36px', height:'36px', borderRadius:'11px', background:`${color}14`, border:`1px solid ${color}22`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Icon size={16} color={color} strokeWidth={2}/>
                </div>
                <span style={{ fontSize:'11px', fontWeight:700, color: isHov ? color : 'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.6px', transition:'color 0.2s' }}>{label}</span>
              </div>
              <div style={{ fontSize:'28px', fontWeight:900, color: isHov ? color : 'var(--text)', lineHeight:1, letterSpacing:'-0.5px', marginBottom:'5px', transition:'color 0.2s' }}>{value}</div>
              <div style={{ fontSize:'11.5px', color:'var(--text-muted)', fontWeight:500, lineHeight:'1.4' }}>{sub}</div>
              {isHov && (
                <div style={{ marginTop:'10px', fontSize:'11px', fontWeight:700, color, display:'flex', alignItems:'center', gap:'3px' }}>
                  Lihat detail <span style={{ fontSize:'13px' }}>→</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Tab bar — color-coded */}
      <div style={{ display:'flex', gap:'3px', marginBottom:'24px', background:'rgba(0,0,0,0.05)', padding:'4px', borderRadius:'13px', width: isMobile ? '100%' : 'fit-content', overflowX: isMobile ? 'auto' : 'visible' }}>
        {TABS.map(({ id, label, Icon, color, bg }) => {
          const active = tab === id
          return (
            <button key={id} onClick={()=>setTab(id)} style={{
              display:'flex', alignItems:'center', gap:'6px', padding:'8px 17px',
              borderRadius:'9px', border:'none', cursor:'pointer', whiteSpace:'nowrap',
              fontSize:'13px', fontWeight: active ? 700 : 500,
              background: active ? 'white' : 'transparent',
              color: active ? color : 'var(--text-sec)',
              boxShadow: active ? `0 1px 6px rgba(0,0,0,0.1), 0 0 0 0.5px rgba(0,0,0,0.04)` : 'none',
              transition:'all 0.18s', flexShrink:0,
            }}>
              <Icon size={13} color={active ? color : 'currentColor'}/> {label}
            </button>
          )
        })}
      </div>

      {/* ══ CHECKLIST ══ */}
      {tab==='checklist' && (
        <div className="animate-in">
          {/* Add task input */}
          <div style={{ display:'flex', gap:'10px', marginBottom:'24px', background:'white', borderRadius:'16px', padding:'8px 8px 8px 18px', border:'1.5px solid var(--border)', boxShadow:'var(--shadow)', alignItems:'center' }}>
            <Plus size={16} color="#9B59C4" strokeWidth={2.5}/>
            <input
              value={newTask}
              onChange={e=>setNewTask(e.target.value)}
              placeholder="Tambah tugas pernikahan..."
              onKeyDown={e=>e.key==='Enter'&&addTask()}
              style={{ flex:1, border:'none', outline:'none', fontSize:'14px', background:'transparent', color:'var(--text)', fontFamily:"'Inter',sans-serif" }}
            />
            <button onClick={addTask} style={{
              display:'flex', alignItems:'center', gap:'7px', padding:'9px 18px',
              background:'linear-gradient(135deg,#C96FBB,#9B59C4)', color:'white',
              border:'none', borderRadius:'10px', cursor:'pointer', fontWeight:700, fontSize:'13.5px',
              boxShadow:'0 2px 10px rgba(155,89,196,0.35)',
            }}>
              <Plus size={14}/> Tambah
            </button>
          </div>

          {categories.map(cat => {
            const items = (data.checklist||[]).filter(t => t.category===cat)
            const catDone = items.filter(t => t.done).length
            const catPct = Math.round((catDone/items.length)*100)
            const allCatDone = catDone === items.length
            return (
              <div key={cat} style={{ marginBottom:'20px' }}>
                {/* Category header */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'10px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'9px' }}>
                    <div style={{ width:'4px', height:'18px', borderRadius:'2px', background: allCatDone ? '#34C759' : '#9B59C4' }}/>
                    <span style={{ fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'1.3px', color: allCatDone ? '#34C759' : 'var(--text-muted)' }}>{cat}</span>
                    {allCatDone && <span style={{ fontSize:'11px', background:'rgba(52,199,89,0.12)', color:'#34C759', borderRadius:'20px', padding:'1px 8px', fontWeight:700, border:'1px solid rgba(52,199,89,0.2)' }}>✓ Selesai</span>}
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                    <div style={{ width:'80px', height:'4px', background:'var(--border-light)', borderRadius:'99px', overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${catPct}%`, background: allCatDone ? '#34C759' : 'linear-gradient(90deg,#C96FBB,#9B59C4)', borderRadius:'99px', transition:'width 0.5s' }}/>
                    </div>
                    <span style={{ fontSize:'11.5px', color: allCatDone ? '#34C759' : 'var(--text-muted)', fontWeight:700, minWidth:'32px', textAlign:'right' }}>{catDone}/{items.length}</span>
                  </div>
                </div>

                {/* Items */}
                <div style={{ background:'white', borderRadius:'14px', border:'1px solid var(--border)', overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
                  {items.map((item,i) => (
                    <div key={item.id}
                      style={{
                        display:'flex', alignItems:'center', gap:'13px', padding:'13px 16px',
                        borderBottom: i<items.length-1 ? '1px solid var(--border-light)' : 'none',
                        background: item.done ? 'rgba(52,199,89,0.04)' : 'white',
                        transition:'background 0.2s',
                      }}>
                      <AnimCheckbox
                        done={item.done}
                        color="#9B59C4"
                        onClick={() => toggleCheck(item.id)}
                      />
                      <span style={{
                        flex:1, fontSize:'13.5px', lineHeight:'1.45',
                        color: item.done ? 'var(--text-muted)' : 'var(--text)',
                        textDecoration: item.done ? 'line-through' : 'none',
                        transition:'all 0.2s',
                      }}>{item.task}</span>
                      {item.done && (
                        <span style={{ fontSize:'11px', color:'#34C759', fontWeight:700, flexShrink:0, background:'rgba(52,199,89,0.1)', padding:'2px 9px', borderRadius:'20px', border:'1px solid rgba(52,199,89,0.2)' }}>✓</span>
                      )}
                      <button className="btn btn-ghost btn-icon" onClick={()=>removeTask(item.id)}
                        style={{ opacity:0, transition:'opacity 0.2s', flexShrink:0 }}
                        onMouseEnter={e=>e.currentTarget.style.opacity='1'}
                        onMouseLeave={e=>e.currentTarget.style.opacity='0'}>
                        <Trash2 size={13} color="var(--rose)"/>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ══ BUDGET ══ */}
      {tab==='budget' && (
        <div className="animate-in">
          <div className="grid-3" style={{ marginBottom:'24px' }}>
            <div className="card stat-card" style={{ borderTop:'3px solid #9B59C4' }}>
              <span className="stat-label">Total Anggaran</span>
              <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                <span style={{ fontSize:'18px', color:'var(--text-muted)' }}>Rp</span>
                <input type="number" value={data.budget?.total||''} onChange={e=>setData(d=>({...d,budget:{...d.budget,total:e.target.value}}))} placeholder="0" style={{ fontSize:'28px', fontFamily:"'Inter',sans-serif", border:'none', background:'transparent', padding:'0', fontWeight:300, width:'100%' }}/>
              </div>
            </div>
            <div className="card stat-card" style={{ borderTop:'3px solid var(--sage)' }}>
              <span className="stat-label">Total Dialokasikan</span>
              <div className="stat-value" style={{ color:'var(--sage)' }}>Rp {totalAllocated.toLocaleString('id-ID')}</div>
              {totalBudget>0 && <p className="text-muted text-sm">Rp {(totalBudget-totalAllocated).toLocaleString('id-ID')} tersisa</p>}
            </div>
            <div className="card stat-card" style={{ borderTop:'3px solid var(--rose)' }}>
              <span className="stat-label">Total Dikeluarkan</span>
              <div className="stat-value" style={{ color:'var(--rose)' }}>Rp {totalSpent.toLocaleString('id-ID')}</div>
              {totalBudget>0 && <><div className="progress-track" style={{ marginTop:'4px' }}><div className="budget-fill" style={{ width:`${Math.min(100,(totalSpent/totalBudget)*100)}%`, background: totalSpent>totalBudget ? 'var(--rose)' : 'linear-gradient(90deg,var(--accent),var(--rose))' }}/></div><p className="text-muted text-sm" style={{ marginTop:'4px' }}>{Math.round((totalSpent/totalBudget)*100)}% dari anggaran terpakai</p></>}
            </div>
          </div>
          <div className="card" style={{ overflow:'hidden' }}>
            <div style={{ padding:'18px 24px', borderBottom:'1px solid var(--border)' }}>
              <h2 style={{ fontFamily:"'Inter',sans-serif", fontSize:'24px' }}>Rincian Anggaran</h2>
            </div>
            {budgetCats.map((cat,i) => {
              const allocated=Number(cat.allocated||0), spent=Number(cat.spent||0)
              const pct = allocated>0 ? Math.min(100,(spent/allocated)*100) : 0
              const over = spent>allocated && allocated>0
              return (
                <div key={cat.id} style={{ padding:'16px 24px', borderBottom: i<budgetCats.length-1 ? '1px solid var(--border-light)' : 'none' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                    <div style={{ width:'9px', height:'9px', borderRadius:'50%', background:cat.color, flexShrink:0 }}/>
                    <span style={{ flex:1, fontWeight:500, fontSize:'14px' }}>{cat.name}</span>
                    <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
                        <span style={{ fontSize:'11px', color:'var(--text-muted)' }}>Alokasi: Rp</span>
                        <input type="number" value={cat.allocated||''} onChange={e=>updateCat(cat.id,'allocated',e.target.value)} placeholder="0" style={{ width:'100px', padding:'4px 8px', fontSize:'13px', textAlign:'right' }}/>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
                        <span style={{ fontSize:'11px', color:'var(--text-muted)' }}>Keluar: Rp</span>
                        <input type="number" value={cat.spent||''} onChange={e=>updateCat(cat.id,'spent',e.target.value)} placeholder="0" style={{ width:'100px', padding:'4px 8px', fontSize:'13px', textAlign:'right', borderColor: over ? 'var(--rose)' : '' }}/>
                      </div>
                      {over && <span className="badge badge-rose" style={{ fontSize:'10px' }}>Over</span>}
                    </div>
                  </div>
                  {allocated>0 && (
                    <div style={{ marginTop:'9px', marginLeft:'21px', height:'5px', background:'var(--border-light)', borderRadius:'99px', overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${pct}%`, background: over ? 'var(--rose)' : cat.color, borderRadius:'99px', transition:'width 0.5s' }}/>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ══ TAMU (GUESTS) ══ */}
      {tab==='guests' && (
        <div className="animate-in">
          <div className="grid-4" style={{ marginBottom:'20px' }}>
            {[
              { label:'Total Diundang', value:(data.guests||[]).length,                                        color:'#4A90D9' },
              { label:'Hadir',          value:(data.guests||[]).filter(g=>g.rsvp==='confirmed').length,        color:'var(--sage)'   },
              { label:'Tidak Hadir',    value:(data.guests||[]).filter(g=>g.rsvp==='declined').length,         color:'var(--rose)'   },
              { label:'Menunggu',       value:(data.guests||[]).filter(g=>g.rsvp==='pending').length,          color:'var(--gold)'   },
            ].map(({ label, value, color }) => (
              <div key={label} className="card" style={{ padding:'16px 20px' }}>
                <div style={{ fontFamily:"'Inter',sans-serif", fontSize:'36px', fontWeight:300, color }}>{value}</div>
                <div style={{ fontSize:'11px', color:'var(--text-muted)', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.8px', marginTop:'2px' }}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:'14px', gap:'10px' }}>
            <button className="btn btn-outline" onClick={()=>setTab('bridesmaids_sub')} style={{ fontSize:'13px' }}>
              <Users size={13}/> Bridesmaid & Groomsmen
            </button>
            <button className="btn btn-primary" onClick={()=>setNewGuest({ name:'', email:'', dietary:'', meja:'' })}>
              <Plus size={15}/> Tambah Tamu
            </button>
          </div>
          {(data.guests||[]).length===0 ? (
            <div className="card"><div className="empty-state"><Users size={36} color="var(--border)" strokeWidth={1.5}/><h3 style={{ marginTop:'14px' }}>Belum ada tamu</h3><p>Mulai buat daftar tamu undanganmu</p></div></div>
          ) : (
            <div className="card" style={{ overflow:'hidden' }}>
              <table className="guest-table">
                <thead><tr><th>Nama</th><th>Email</th><th>RSVP / Kehadiran</th><th>+1</th><th>Meja</th><th>Pantangan</th><th></th></tr></thead>
                <tbody>
                  {(data.guests||[]).map(guest => (
                    <tr key={guest.id}>
                      <td style={{ fontWeight:500 }}>{guest.name}</td>
                      <td style={{ color:'var(--text-sec)' }}>{guest.email||'—'}</td>
                      <td>
                        <select value={guest.rsvp} onChange={e=>updateGuest(guest.id,'rsvp',e.target.value)} style={{ padding:'4px 8px', fontSize:'12px', width:'auto', color: guest.rsvp==='confirmed' ? 'var(--sage)' : guest.rsvp==='declined' ? 'var(--rose)' : 'var(--gold)' }}>
                          <option value="pending">Menunggu</option><option value="confirmed">Hadir</option><option value="declined">Tidak Hadir</option>
                        </select>
                      </td>
                      <td><div className={`check-box ${guest.plusOne?'checked':''}`} onClick={()=>updateGuest(guest.id,'plusOne',!guest.plusOne)} style={{ width:'16px', height:'16px' }}/></td>
                      <td><input value={guest.meja||''} onChange={e=>updateGuest(guest.id,'meja',e.target.value)} placeholder="Meja #" style={{ width:'70px', padding:'4px 8px', fontSize:'13px' }}/></td>
                      <td style={{ color:'var(--text-sec)', fontSize:'13px' }}>{guest.dietary||'—'}</td>
                      <td><button className="btn btn-ghost btn-icon" onClick={()=>removeGuest(guest.id)}><Trash2 size={14} color="var(--rose)"/></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ══ BRIDESMAID sub-section ══ */}
      {tab==='bridesmaids_sub' && (
        <div className="animate-in">
          <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px' }}>
            <button className="btn btn-ghost" onClick={()=>setTab('guests')} style={{ fontSize:'13px' }}>← Kembali ke Daftar Tamu</button>
            <span style={{ color:'var(--text-muted)' }}>|</span>
            <h2 style={{ fontFamily:"'Inter',sans-serif", fontSize:'24px' }}>Bridesmaid & Groomsmen</h2>
          </div>
          <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:'14px' }}>
            <button className="btn btn-primary" onClick={()=>setNewBm({ name:'', role:'Bridesmaid', contact:'', notes:'' })}>
              <Plus size={15}/> Tambah Anggota
            </button>
          </div>
          {(data.bridesmaids||[]).length===0 ? (
            <div className="card"><div className="empty-state"><Heart size={36} color="var(--border)" strokeWidth={1.5}/><h3 style={{ marginTop:'14px' }}>Belum ada bridesmaid</h3><p>Tambahkan anggota wedding party kamu</p></div></div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'14px' }}>
              {(data.bridesmaids||[]).map(bm => (
                <div key={bm.id} className="card" style={{ padding:'18px 20px' }}>
                  <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
                    <div>
                      <div style={{ fontWeight:700, fontSize:'15px', color:'var(--text)', marginBottom:'4px' }}>{bm.name}</div>
                      <span style={{ padding:'3px 10px', borderRadius:'99px', fontSize:'11px', fontWeight:700, background:'var(--accent-light)', color:'var(--accent)' }}>{bm.role}</span>
                    </div>
                    <button className="btn btn-ghost btn-icon" onClick={()=>removeBm(bm.id)}><Trash2 size={14} color="var(--rose)"/></button>
                  </div>
                  {bm.contact && <div style={{ display:'flex', alignItems:'center', gap:'6px', marginTop:'12px', fontSize:'13px', color:'var(--text-sec)' }}><Phone size={12}/>{bm.contact}</div>}
                  {bm.notes && <p style={{ fontSize:'12.5px', color:'var(--text-muted)', marginTop:'8px', lineHeight:'1.5' }}>{bm.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══ VENDOR ══ */}
      {tab==='vendor' && (
        <div className="animate-in">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'14px', marginBottom:'24px' }}>
            {[
              { label:'Total Vendor',    value:(data.vendors||[]).length,                                              color:'#34C759' },
              { label:'Booked',          value:bookedVendors.length,                                                   color:'#4A90D9' },
              { label:'Negosiasi',       value:(data.vendors||[]).filter(v=>v.status==='Negosiasi').length,            color:'var(--gold)' },
              { label:'Shortlisted',     value:(data.vendors||[]).filter(v=>v.status==='Shortlisted').length,          color:'var(--text-muted)' },
            ].map(({ label, value, color }) => (
              <div key={label} className="card" style={{ padding:'16px 20px' }}>
                <div style={{ fontFamily:"'Inter',sans-serif", fontSize:'36px', fontWeight:300, color }}>{value}</div>
                <div style={{ fontSize:'11px', color:'var(--text-muted)', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.8px', marginTop:'2px' }}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:'14px' }}>
            <button className="btn btn-primary" onClick={()=>setNewVendor({ name:'', category:'Foto', price:'', contact:'', notes:'', link:'' })}>
              <Plus size={15}/> Tambah Vendor
            </button>
          </div>
          {(data.vendors||[]).length===0 ? (
            <div className="card"><div className="empty-state"><Store size={36} color="var(--border)" strokeWidth={1.5}/><h3 style={{ marginTop:'14px' }}>Belum ada vendor</h3><p>Tambahkan vendor seperti fotografer, katering, MUA, dll.</p></div></div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              {(data.vendors||[]).map(v => (
                <div key={v.id} className="card" style={{ overflow:'hidden', borderLeft:`3px solid ${VENDOR_STATUS_OPTS.find(s=>s.label===v.status)?.color||'#707070'}` }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'14px', padding:'16px 20px', cursor:'pointer' }} onClick={()=>setExpandedV(expandedVendor===v.id?null:v.id)}>
                    <div style={{ width:'38px', height:'38px', borderRadius:'10px', background:`${VENDOR_STATUS_OPTS.find(s=>s.label===v.status)?.bg||'rgba(112,112,112,0.1)'}`, border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <Store size={16} color={VENDOR_STATUS_OPTS.find(s=>s.label===v.status)?.color||'#707070'}/>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:700, fontSize:'14.5px', color:'var(--text)', marginBottom:'3px' }}>{v.name}</div>
                      <div style={{ fontSize:'12px', color:'var(--text-muted)' }}>{v.category}</div>
                    </div>
                    <StatusBadge label={v.status}/>
                    {v.price && <span style={{ fontSize:'13px', fontWeight:600, color:'var(--text-sec)' }}>{fmtRp(v.price)}</span>}
                    <select value={v.status} onChange={e=>{ e.stopPropagation(); updateVendor(v.id,'status',e.target.value) }} onClick={e=>e.stopPropagation()} style={{ fontSize:'12px', padding:'4px 8px', width:'auto', borderColor:'var(--border)' }}>
                      {VENDOR_STATUS_OPTS.map(s=><option key={s.label} value={s.label}>{s.label}</option>)}
                    </select>
                    <button className="btn btn-ghost btn-icon" onClick={e=>{ e.stopPropagation(); removeVendor(v.id) }}><Trash2 size={14} color="var(--rose)"/></button>
                    {expandedVendor===v.id ? <ChevronUp size={15} color="var(--text-muted)"/> : <ChevronDown size={15} color="var(--text-muted)"/>}
                  </div>
                  {expandedVendor===v.id && (
                    <div style={{ padding:'0 20px 18px', borderTop:'1px solid var(--border-light)', paddingTop:'14px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                      <div className="field"><label className="field-label">Harga</label><input value={v.price||''} onChange={e=>updateVendor(v.id,'price',e.target.value)} placeholder="Rp 0"/></div>
                      <div className="field"><label className="field-label">Kontak</label><input value={v.contact||''} onChange={e=>updateVendor(v.id,'contact',e.target.value)} placeholder="No. HP / IG / Email"/></div>
                      <div className="field"><label className="field-label">Link / Website</label><input value={v.link||''} onChange={e=>updateVendor(v.id,'link',e.target.value)} placeholder="https://..."/></div>
                      <div className="field"><label className="field-label">Kategori</label>
                        <select value={v.category} onChange={e=>updateVendor(v.id,'category',e.target.value)}>
                          {VENDOR_CATS.map(c=><option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="field" style={{ gridColumn:'1/-1' }}><label className="field-label">Catatan</label>
                        <textarea value={v.notes||''} onChange={e=>updateVendor(v.id,'notes',e.target.value)} placeholder="Detail paket, catatan negosiasi, dll." rows={2} style={{ resize:'vertical' }}/>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══ RUNDOWN ══ */}
      {tab==='rundown' && (
        <div className="animate-in">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px' }}>
            <div>
              <h2 style={{ fontFamily:"'Inter',sans-serif", fontSize:'26px', marginBottom:'4px' }}>Rundown Hari H</h2>
              {data.weddingDate && <p style={{ fontSize:'13px', color:'var(--text-muted)' }}>{new Date(data.weddingDate).toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</p>}
            </div>
            <button className="btn btn-primary" onClick={()=>setNewRd({ time:'', event:'', location:'', notes:'' })}>
              <Plus size={15}/> Tambah Event
            </button>
          </div>

          <div style={{ position:'relative', paddingLeft:'28px' }}>
            <div style={{ position:'absolute', left:'8px', top:'24px', bottom:'24px', width:'2px', background:'linear-gradient(180deg,#FF6B6B,#FF9F0A,#9B59C4)', borderRadius:'1px', opacity:0.4 }}/>
            {(data.rundown||[]).map((rd, idx) => (
              <div key={rd.id} style={{ position:'relative', marginBottom:'14px', display:'flex', gap:'20px', alignItems:'flex-start' }}>
                <div style={{ position:'absolute', left:'-24px', top:'18px', width:'14px', height:'14px', borderRadius:'50%', background:'white', border:`3px solid #FF6B6B`, boxShadow:'0 0 0 3px rgba(255,107,107,0.2)', zIndex:1 }}/>
                <div className="card" style={{ flex:1, padding:'15px 20px', borderLeft:'3px solid rgba(255,107,107,0.3)' }}>
                  <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'12px' }}>
                    <div style={{ flex:1 }}>
                      {editRd===rd.id ? (
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
                          <div className="field"><label className="field-label">Waktu</label><input type="time" value={rd.time} onChange={e=>updateRd(rd.id,'time',e.target.value)}/></div>
                          <div className="field"><label className="field-label">Lokasi</label><input value={rd.location||''} onChange={e=>updateRd(rd.id,'location',e.target.value)} placeholder="Venue / Lokasi"/></div>
                          <div className="field" style={{ gridColumn:'1/-1' }}><label className="field-label">Event</label><input value={rd.event} onChange={e=>updateRd(rd.id,'event',e.target.value)} placeholder="Nama event"/></div>
                          <div className="field" style={{ gridColumn:'1/-1' }}><label className="field-label">Catatan</label><input value={rd.notes||''} onChange={e=>updateRd(rd.id,'notes',e.target.value)} placeholder="Detail tambahan"/></div>
                        </div>
                      ) : (
                        <>
                          <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'6px' }}>
                            <span style={{ background:'rgba(255,107,107,0.1)', color:'#FF6B6B', fontFamily:"'Inter',sans-serif", fontSize:'14px', fontWeight:800, padding:'4px 12px', borderRadius:'8px', border:'1px solid rgba(255,107,107,0.2)', flexShrink:0 }}>{rd.time}</span>
                            <span style={{ fontWeight:700, fontSize:'15px', color:'var(--text)' }}>{rd.event}</span>
                          </div>
                          {rd.location && <div style={{ display:'flex', alignItems:'center', gap:'5px', fontSize:'12.5px', color:'var(--text-sec)', marginLeft:'2px' }}><MapPin size={11}/>{rd.location}</div>}
                          {rd.notes && <p style={{ fontSize:'12px', color:'var(--text-muted)', marginTop:'6px', lineHeight:'1.5', marginLeft:'2px' }}>{rd.notes}</p>}
                        </>
                      )}
                    </div>
                    <div style={{ display:'flex', gap:'4px', flexShrink:0 }}>
                      <button className="btn btn-ghost btn-icon" onClick={()=>setEditRd(editRd===rd.id?null:rd.id)}>
                        {editRd===rd.id ? <Save size={14} color="var(--accent)"/> : <Edit2 size={14} color="var(--text-muted)"/>}
                      </button>
                      <button className="btn btn-ghost btn-icon" onClick={()=>removeRd(rd.id)}><Trash2 size={14} color="var(--rose)"/></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ VISION BOARD ══ */}
      {tab==='visionboard' && (
        <div className="animate-in">
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'24px' }}>
            <div>
              <h2 style={{ fontFamily:"'Inter',sans-serif", fontSize:'28px', marginBottom:'4px' }}>Vision Board</h2>
              <p style={{ fontSize:'13px', color:'var(--text-muted)' }}>Kumpulkan inspirasi pernikahan impianmu di satu tempat</p>
            </div>
            <button className="btn btn-primary" onClick={()=>setNewVB({ title:'', category:'Venue', imageUrl:'', notes:'' })}>
              <Plus size={15}/> Tambah Inspirasi
            </button>
          </div>
          {(data.visionBoard||[]).length===0 ? (
            <div className="card" style={{ padding:'60px 40px', textAlign:'center' }}>
              <Sparkles size={40} color="var(--border)" strokeWidth={1.5} style={{ marginBottom:'14px' }}/>
              <h3 style={{ fontFamily:"'Inter',sans-serif", fontSize:'24px', marginBottom:'8px' }}>Mulai Vision Board-mu</h3>
              <p style={{ color:'var(--text-muted)', marginBottom:'20px' }}>Tambahkan foto venue, gaun, dekorasi, dan semua inspirasi pernikahanmu</p>
              <button className="btn btn-primary" onClick={()=>setNewVB({ title:'', category:'Venue', imageUrl:'', notes:'' })}><Plus size={15}/> Tambah Pertama</button>
            </div>
          ) : (
            <div style={{ columns:'3 260px', gap:'16px' }}>
              {(data.visionBoard||[]).map(item => (
                <div key={item.id} className="card" style={{ breakInside:'avoid', marginBottom:'16px', overflow:'hidden' }}>
                  {item.imageUrl ? (
                    <div style={{ height:'180px', background:`url(${item.imageUrl}) center/cover no-repeat`, backgroundColor:'var(--bg)' }}/>
                  ) : (
                    <div style={{ height:'100px', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Image size={28} color="var(--border)" strokeWidth={1.5}/>
                    </div>
                  )}
                  <div style={{ padding:'14px 16px' }}>
                    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'8px', marginBottom:'6px' }}>
                      <span style={{ fontWeight:700, fontSize:'14px', color:'var(--text)', lineHeight:'1.35' }}>{item.title}</span>
                      <button className="btn btn-ghost btn-icon" onClick={()=>removeVB(item.id)} style={{ flexShrink:0 }}><Trash2 size={13} color="var(--rose)"/></button>
                    </div>
                    <span style={{ display:'inline-block', padding:'2px 9px', borderRadius:'99px', fontSize:'11px', fontWeight:600, background:'rgba(201,111,187,0.1)', color:'#C96FBB', marginBottom:'6px' }}>{item.category}</span>
                    {item.notes && <p style={{ fontSize:'12.5px', color:'var(--text-muted)', lineHeight:'1.5', marginTop:'4px' }}>{item.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{ marginTop:'36px', padding:'24px', borderRadius:'16px', background:'linear-gradient(135deg,rgba(122,139,155,0.08),rgba(74,144,217,0.06))', border:'1px solid rgba(74,144,217,0.15)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'12px' }}>
              <Palmtree size={20} color="#4A90D9" strokeWidth={1.75}/>
              <span style={{ fontFamily:"'Inter',sans-serif", fontSize:'22px', fontWeight:600 }}>Honeymoon Planner</span>
              <span style={{ padding:'2px 10px', borderRadius:'99px', fontSize:'11px', fontWeight:700, background:'rgba(74,144,217,0.1)', color:'#4A90D9' }}>BONUS</span>
            </div>
            <p style={{ fontSize:'13px', color:'var(--text-muted)', marginBottom:'14px' }}>Catat rencana bulan madu impianmu — destinasi, hotel, aktivitas, dan anggaran.</p>
            <textarea
              value={data.honeymoonNotes||''}
              onChange={e=>setData(d=>({...d,honeymoonNotes:e.target.value}))}
              placeholder="Destinasi impian: Bali? Paris? Santorini?&#10;Hotel: ...&#10;Aktivitas: ...&#10;Estimasi budget: Rp ..."
              rows={5}
              style={{ width:'100%', borderRadius:'12px', border:'1px solid rgba(74,144,217,0.25)', padding:'12px 16px', fontFamily:"'Inter',sans-serif", fontSize:'13.5px', resize:'vertical', outline:'none', background:'white', color:'var(--text)', lineHeight:'1.7' }}
            />
          </div>
        </div>
      )}

      {/* ══ MODALS ══ */}
      {newGuest!==null && (
        <div className="overlay" onClick={()=>setNewGuest(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header"><h2 className="modal-title">Tambah Tamu</h2><button className="btn btn-ghost btn-icon" onClick={()=>setNewGuest(null)}><X size={18}/></button></div>
            <div className="modal-body">
              <div className="field"><label className="field-label">Nama Lengkap *</label><input autoFocus value={newGuest.name} onChange={e=>setNewGuest(g=>({...g,name:e.target.value}))} placeholder="Nama tamu"/></div>
              <div className="field"><label className="field-label">Email</label><input type="email" value={newGuest.email} onChange={e=>setNewGuest(g=>({...g,email:e.target.value}))} placeholder="email@contoh.com"/></div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                <div className="field"><label className="field-label">Nomor Meja</label><input value={newGuest.meja||''} onChange={e=>setNewGuest(g=>({...g,meja:e.target.value}))} placeholder="Meja 1, VIP, dst."/></div>
                <div className="field"><label className="field-label">Pantangan Makanan</label><input value={newGuest.dietary} onChange={e=>setNewGuest(g=>({...g,dietary:e.target.value}))} placeholder="Vegetarian, Halal, dll."/></div>
              </div>
            </div>
            <div className="modal-footer"><button className="btn btn-outline" onClick={()=>setNewGuest(null)}>Batal</button><button className="btn btn-primary" onClick={addGuest}><Plus size={15}/> Tambah Tamu</button></div>
          </div>
        </div>
      )}

      {newBm!==null && (
        <div className="overlay" onClick={()=>setNewBm(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header"><h2 className="modal-title">Tambah Anggota</h2><button className="btn btn-ghost btn-icon" onClick={()=>setNewBm(null)}><X size={18}/></button></div>
            <div className="modal-body">
              <div className="field"><label className="field-label">Nama *</label><input autoFocus value={newBm.name} onChange={e=>setNewBm(b=>({...b,name:e.target.value}))} placeholder="Nama lengkap"/></div>
              <div className="field"><label className="field-label">Peran</label>
                <select value={newBm.role} onChange={e=>setNewBm(b=>({...b,role:e.target.value}))}>
                  {BRIDESMAID_ROLES.map(r=><option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="field"><label className="field-label">Kontak</label><input value={newBm.contact||''} onChange={e=>setNewBm(b=>({...b,contact:e.target.value}))} placeholder="No. HP / IG"/></div>
              <div className="field"><label className="field-label">Catatan</label><textarea value={newBm.notes||''} onChange={e=>setNewBm(b=>({...b,notes:e.target.value}))} placeholder="Detail tugas, ukuran seragam, dll." rows={2}/></div>
            </div>
            <div className="modal-footer"><button className="btn btn-outline" onClick={()=>setNewBm(null)}>Batal</button><button className="btn btn-primary" onClick={addBm}><Plus size={15}/> Tambah</button></div>
          </div>
        </div>
      )}

      {newVendor!==null && (
        <div className="overlay" onClick={()=>setNewVendor(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header"><h2 className="modal-title">Tambah Vendor</h2><button className="btn btn-ghost btn-icon" onClick={()=>setNewVendor(null)}><X size={18}/></button></div>
            <div className="modal-body">
              <div className="field"><label className="field-label">Nama Vendor *</label><input autoFocus value={newVendor.name} onChange={e=>setNewVendor(v=>({...v,name:e.target.value}))} placeholder="Nama studio / vendor"/></div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                <div className="field"><label className="field-label">Kategori</label>
                  <select value={newVendor.category} onChange={e=>setNewVendor(v=>({...v,category:e.target.value}))}>
                    {VENDOR_CATS.map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="field"><label className="field-label">Estimasi Harga (Rp)</label><input type="number" value={newVendor.price||''} onChange={e=>setNewVendor(v=>({...v,price:e.target.value}))} placeholder="0"/></div>
              </div>
              <div className="field"><label className="field-label">Kontak</label><input value={newVendor.contact||''} onChange={e=>setNewVendor(v=>({...v,contact:e.target.value}))} placeholder="No. HP / IG / Email"/></div>
              <div className="field"><label className="field-label">Link / Website</label><input value={newVendor.link||''} onChange={e=>setNewVendor(v=>({...v,link:e.target.value}))} placeholder="https://..."/></div>
              <div className="field"><label className="field-label">Catatan</label><textarea value={newVendor.notes||''} onChange={e=>setNewVendor(v=>({...v,notes:e.target.value}))} placeholder="Detail paket, hasil negosiasi, dll." rows={2}/></div>
            </div>
            <div className="modal-footer"><button className="btn btn-outline" onClick={()=>setNewVendor(null)}>Batal</button><button className="btn btn-primary" onClick={addVendor}><Plus size={15}/> Tambah Vendor</button></div>
          </div>
        </div>
      )}

      {newRd!==null && (
        <div className="overlay" onClick={()=>setNewRd(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header"><h2 className="modal-title">Tambah Event Rundown</h2><button className="btn btn-ghost btn-icon" onClick={()=>setNewRd(null)}><X size={18}/></button></div>
            <div className="modal-body">
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                <div className="field"><label className="field-label">Waktu</label><input type="time" value={newRd.time} onChange={e=>setNewRd(r=>({...r,time:e.target.value}))}/></div>
                <div className="field"><label className="field-label">Lokasi</label><input value={newRd.location||''} onChange={e=>setNewRd(r=>({...r,location:e.target.value}))} placeholder="Nama lokasi"/></div>
              </div>
              <div className="field"><label className="field-label">Nama Event *</label><input autoFocus value={newRd.event} onChange={e=>setNewRd(r=>({...r,event:e.target.value}))} placeholder="Misal: Prosesi Akad Nikah"/></div>
              <div className="field"><label className="field-label">Catatan</label><input value={newRd.notes||''} onChange={e=>setNewRd(r=>({...r,notes:e.target.value}))} placeholder="Detail tambahan"/></div>
            </div>
            <div className="modal-footer"><button className="btn btn-outline" onClick={()=>setNewRd(null)}>Batal</button><button className="btn btn-primary" onClick={addRd}><Plus size={15}/> Tambah Event</button></div>
          </div>
        </div>
      )}

      {newVB!==null && (
        <div className="overlay" onClick={()=>setNewVB(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header"><h2 className="modal-title">Tambah Inspirasi</h2><button className="btn btn-ghost btn-icon" onClick={()=>setNewVB(null)}><X size={18}/></button></div>
            <div className="modal-body">
              <div className="field"><label className="field-label">Judul *</label><input autoFocus value={newVB.title} onChange={e=>setNewVB(v=>({...v,title:e.target.value}))} placeholder="Misal: Dekorasi Bunga Putih Elegan"/></div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                <div className="field"><label className="field-label">Kategori</label>
                  <select value={newVB.category} onChange={e=>setNewVB(v=>({...v,category:e.target.value}))}>
                    {VB_CATS.map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="field"><label className="field-label">URL Gambar</label><input value={newVB.imageUrl||''} onChange={e=>setNewVB(v=>({...v,imageUrl:e.target.value}))} placeholder="https://gambar.jpg"/></div>
              </div>
              <div className="field"><label className="field-label">Catatan</label><textarea value={newVB.notes||''} onChange={e=>setNewVB(v=>({...v,notes:e.target.value}))} placeholder="Detail inspirasi, referensi vendor, dll." rows={2}/></div>
            </div>
            <div className="modal-footer"><button className="btn btn-outline" onClick={()=>setNewVB(null)}>Batal</button><button className="btn btn-primary" onClick={addVB}><Plus size={15}/> Simpan Inspirasi</button></div>
          </div>
        </div>
      )}
    </div>
  )
}
