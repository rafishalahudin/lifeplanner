import { useState, useMemo } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'
import {
  Plus, Search, X, ChevronDown, Moon,
  PenLine, BookHeart, Flame, Sparkles, RefreshCw,
  Heart, MessageCircle, BarChart2, Target, Star, Gift,
  CheckCircle2, ClipboardList, Calendar, Check, Save, Sun,
  LayoutGrid, CalendarDays, GitBranch, ArrowUpDown, Filter,
  Trash2, ChevronRight, Zap
} from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'

/* ── Apple-blue palette ── */
const C = {
  bg:        '#F5F5F7',
  surface:   '#FFFFFF',
  border:    '#E5E5EA',
  borderMid: '#D1D1D6',
  accent:    '#0071E3',
  accentDim: 'rgba(0,113,227,0.08)',
  accentGlow:'rgba(0,113,227,0.18)',
  moon:      '#FF9F0A',
  moonDim:   'rgba(255,159,10,0.1)',
  text:      '#1D1D1F',
  textSec:   '#6E6E73',
  textMuted: '#86868B',
  inputBg:   'rgba(0,0,0,0.03)',
  shadow:    '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)',
  shadowMd:  '0 4px 20px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
  shadowLg:  '0 8px 36px rgba(0,0,0,0.1)',
}

/* ── data ── */
const PERASAAN_OPTS = [
  { label:'Senang',    color:'#FF9F0A', bg:'rgba(255,159,10,0.1)',   emoji:'😊' },
  { label:'Sedih',     color:'#7060A8', bg:'rgba(112,96,168,0.1)',   emoji:'😢' },
  { label:'Cemas',     color:'#FF6B6B', bg:'rgba(255,107,107,0.1)',  emoji:'😰' },
  { label:'Lelah',     color:'#34C759', bg:'rgba(52,199,89,0.1)',    emoji:'😴' },
  { label:'Bingung',   color:'#5856D6', bg:'rgba(88,86,214,0.1)',    emoji:'😕' },
  { label:'Marah',     color:'#FF3B30', bg:'rgba(255,59,48,0.1)',    emoji:'😤' },
  { label:'Damai',     color:'#30D158', bg:'rgba(48,209,88,0.1)',    emoji:'😌' },
  { label:'Bersyukur', color:'#FF9F0A', bg:'rgba(255,159,10,0.1)',   emoji:'🙏' },
  { label:'Kecewa',    color:'#8E8E93', bg:'rgba(142,142,147,0.1)',  emoji:'😞' },
  { label:'Lega',      color:'#64D2FF', bg:'rgba(100,210,255,0.1)',  emoji:'😮‍💨' },
  { label:'Takut',     color:'#BF5AF2', bg:'rgba(191,90,242,0.1)',   emoji:'😨' },
  { label:'Semangat',  color:'#FF6B35', bg:'rgba(255,107,53,0.1)',   emoji:'🔥' },
]
const MOOD_PAGI_OPTS = [
  { label:'Baik',        color:'#30D158', bg:'rgba(48,209,88,0.1)',   emoji:'😊' },
  { label:'Cukup Baik',  color:'#FF9F0A', bg:'rgba(255,159,10,0.1)', emoji:'🙂' },
  { label:'Netral',      color:'#8E8E93', bg:'rgba(142,142,147,0.1)',emoji:'😐' },
  { label:'Kurang Baik', color:'#FF3B30', bg:'rgba(255,59,48,0.1)',   emoji:'😕' },
]
const AKTIVITAS_OPTS = [
  { label:'Olahraga',                    color:'#30D158', emoji:'🏃' },
  { label:'Waktu dengan Teman/Keluarga', color:'#FF9F0A', emoji:'👨‍👩‍👧' },
  { label:'Hobi Lain',                   color:'#5856D6', emoji:'🎨' },
  { label:'Menulis journal',             color:'#0071E3', emoji:'✍️' },
  { label:'Meditasi',                    color:'#64D2FF', emoji:'🧘' },
  { label:'Membaca',                     color:'#FF6B35', emoji:'📚' },
  { label:'Ibadah',                      color:'#BF5AF2', emoji:'🤲' },
]
const STATUS_OPTS = [
  { label:'Belum Direview', color:'#8E8E93', bg:'rgba(142,142,147,0.1)' },
  { label:'Perlu Diskusi',  color:'#FF9F0A', bg:'rgba(255,159,10,0.1)'  },
  { label:'Direview',       color:'#30D158', bg:'rgba(48,209,88,0.1)'   },
]

const EMPTY = {
  judul:'', tanggal:new Date().toISOString().split('T')[0],
  pikiran:'', perasaan:[], intensitas:5,
  perilaku:'', situasi:'', reframing:'',
  moodPagi:'', aktivitasPositif:[],
  gratitude:'', statusReview:'Belum Direview', evaluasi:'',
}

/* ── helpers ── */
const fP = l => { const o=PERASAAN_OPTS.find(p=>p.label===l); return o?{color:o.color,background:o.bg}:{} }
const fM = l => { const o=MOOD_PAGI_OPTS.find(m=>m.label===l); return o?{color:o.color,background:o.bg}:{} }
const fS = l => { const o=STATUS_OPTS.find(s=>s.label===l); return o?{color:o.color,background:o.bg}:{} }
const fDate = s => { if(!s) return ''; return new Date(s).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'}) }
const fDateShort = s => { if(!s) return ''; return new Date(s).toLocaleDateString('id-ID',{day:'numeric',month:'short'}) }
const weekStart = () => { const d=new Date(); d.setDate(d.getDate()-(d.getDay()===0?6:d.getDay()-1)); return d.toISOString().split('T')[0] }
const calcStreak = entries => {
  if(!entries.length) return 0
  const dates=[...(new Set(entries.map(e=>e.tanggal)))].sort((a,b)=>b.localeCompare(a))
  let s=1, ref=new Date(dates[0])
  for(let i=1;i<dates.length;i++){ const d=new Date(dates[i]); if((ref-d)/(864e5)===1){s++;ref=d}else break }
  return s
}

/* ── atoms ── */
function Chip({ label, style, small }) {
  return <span style={{ padding:small?'2px 8px':'3px 10px', borderRadius:'99px', fontSize:small?'10.5px':'12px', fontWeight:600, flexShrink:0, ...style }}>{label}</span>
}

function Label({ children, color }) {
  return <p style={{ fontSize:'10.5px', fontWeight:700, textTransform:'uppercase', letterSpacing:'1.3px', color:color||C.textMuted, marginBottom:'4px' }}>{children}</p>
}
function DField({ label, children, labelColor }) {
  return <div style={{ display:'flex', flexDirection:'column', gap:'5px' }}><Label color={labelColor}>{label}</Label>{children}</div>
}
function DInput({ value, onChange, placeholder, type='text', autoFocus }) {
  return <input type={type} value={value} autoFocus={autoFocus} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
    style={{ background:C.inputBg, border:`1.5px solid ${C.border}`, borderRadius:'11px', padding:'10px 14px', color:C.text, fontSize:'14px', outline:'none', width:'100%', fontFamily:'inherit', transition:'border-color 0.15s, box-shadow 0.15s' }}
    onFocus={e=>{ e.target.style.borderColor=C.accent; e.target.style.boxShadow=`0 0 0 3px ${C.accentGlow}` }}
    onBlur={e=>{ e.target.style.borderColor=C.border; e.target.style.boxShadow='none' }} />
}
function DTextarea({ value, onChange, placeholder, rows=3 }) {
  return <textarea value={value} rows={rows} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
    style={{ background:C.inputBg, border:`1.5px solid ${C.border}`, borderRadius:'11px', padding:'10px 14px', color:C.text, fontSize:'14px', outline:'none', width:'100%', fontFamily:'inherit', resize:'vertical', lineHeight:'1.7', transition:'border-color 0.15s, box-shadow 0.15s' }}
    onFocus={e=>{ e.target.style.borderColor=C.accent; e.target.style.boxShadow=`0 0 0 3px ${C.accentGlow}` }}
    onBlur={e=>{ e.target.style.borderColor=C.border; e.target.style.boxShadow='none' }} />
}
function MSection({ title, icon, children }) {
  return (
    <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:'20px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'7px', marginBottom:'16px' }}>
        {icon && <div style={{ width:'24px', height:'24px', borderRadius:'6px', background:C.accentDim, display:'flex', alignItems:'center', justifyContent:'center' }}>{icon}</div>}
        <p style={{ fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'1.5px', color:C.textMuted }}>{title}</p>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>{children}</div>
    </div>
  )
}

/* ── Entry Card ── */
function EntryCard({ entry, onClick, onDelete }) {
  const [hov, setHov] = useState(false)
  const domFeeling = PERASAAN_OPTS.find(p => p.label === entry.perasaan?.[0])
  const accentColor = domFeeling?.color || C.accent
  const moodPagi = MOOD_PAGI_OPTS.find(m => m.label === entry.moodPagi)
  return (
    <div onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: C.surface,
        borderRadius: '18px',
        border: `1px solid ${hov ? accentColor+'40' : C.border}`,
        borderTop: `3px solid ${accentColor}`,
        boxShadow: hov ? `0 8px 28px ${accentColor}18, 0 1px 4px rgba(0,0,0,0.04)` : C.shadow,
        cursor: 'pointer',
        transition: 'all 0.22s',
        transform: hov ? 'translateY(-3px)' : 'translateY(0)',
        overflow: 'hidden',
        position: 'relative',
      }}>

      {/* Date + delete */}
      <div style={{ padding:'14px 16px 0', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
          <div style={{ width:'7px', height:'7px', borderRadius:'50%', background:accentColor }}/>
          <span style={{ fontSize:'11.5px', color:C.textMuted, fontWeight:600 }}>{fDate(entry.tanggal)}</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
          {entry.intensitas && (
            <div style={{ background:C.bg, borderRadius:'6px', padding:'2px 8px', border:`1px solid ${C.border}` }}>
              <span style={{ fontSize:'11px', fontWeight:800, color:C.text }}>{entry.intensitas}</span>
              <span style={{ fontSize:'9px', color:C.textMuted }}>/10</span>
            </div>
          )}
          <button onClick={e=>{ e.stopPropagation(); onDelete() }}
            style={{ width:'26px', height:'26px', borderRadius:'7px', background:'transparent', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.textMuted, opacity: hov ? 1 : 0, transition:'opacity 0.15s' }}
            onMouseEnter={e=>e.currentTarget.style.color='#FF3B30'}
            onMouseLeave={e=>e.currentTarget.style.color=C.textMuted}>
            <Trash2 size={13}/>
          </button>
        </div>
      </div>

      {/* Title */}
      <div style={{ padding:'8px 16px 10px' }}>
        <h3 style={{ fontSize:'15px', fontWeight:700, color:C.text, lineHeight:'1.35', marginBottom:'6px' }}>{entry.judul || 'Untitled'}</h3>
        {entry.pikiran && (
          <p style={{ fontSize:'13px', color:C.textSec, lineHeight:'1.6', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
            {entry.pikiran}
          </p>
        )}
      </div>

      {/* Feelings */}
      {(entry.perasaan||[]).length > 0 && (
        <div style={{ padding:'0 16px 12px', display:'flex', gap:'4px', flexWrap:'wrap' }}>
          {(entry.perasaan||[]).slice(0,4).map(p => {
            const pOpt = PERASAAN_OPTS.find(x=>x.label===p)
            return (
              <span key={p} style={{ padding:'2px 9px', borderRadius:'99px', fontSize:'11px', fontWeight:600, color:pOpt?.color, background:pOpt?.bg, border:`1px solid ${pOpt?.color}30` }}>
                {pOpt?.emoji} {p}
              </span>
            )
          })}
          {(entry.perasaan||[]).length > 4 && <span style={{ fontSize:'11px', color:C.textMuted, padding:'2px 6px' }}>+{entry.perasaan.length-4}</span>}
        </div>
      )}

      {/* Footer */}
      {(entry.moodPagi || entry.gratitude || entry.statusReview) && (
        <div style={{ borderTop:`1px solid ${C.border}`, padding:'9px 16px', display:'flex', alignItems:'center', gap:'8px', background:C.bg }}>
          {entry.moodPagi && (
            <span style={{ fontSize:'11px', color:moodPagi?.color||C.textMuted, fontWeight:600, display:'flex', alignItems:'center', gap:'4px' }}>
              <Sun size={10}/> {entry.moodPagi}
            </span>
          )}
          {entry.gratitude && (
            <span style={{ fontSize:'11px', color:C.textMuted, flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              🙏 {entry.gratitude}
            </span>
          )}
          {entry.statusReview && entry.statusReview !== 'Belum Direview' && (
            <span style={{ ...fS(entry.statusReview), padding:'2px 8px', borderRadius:'99px', fontSize:'10px', fontWeight:700, flexShrink:0 }}>
              {entry.statusReview}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

/* ── main ── */
export default function Journal() {
  const isMobile = useIsMobile()
  const [data, setData]       = useLocalStorage('journal-v2', { entries:[] })
  const [tab, setTab]         = useState('semua')
  const [search, setSearch]   = useState('')
  const [modal, setModal]     = useState(null)
  const [draft, setDraft]     = useState(EMPTY)
  const [hovBtn, setHovBtn]   = useState(false)
  const [activeSection, setActiveSection] = useState(0) // modal section tabs

  const today = new Date().toISOString().split('T')[0]
  const all   = useMemo(()=>[...(data.entries||[])].sort((a,b)=>new Date(b.tanggal)-new Date(a.tanggal)),[data.entries])
  const shown = useMemo(()=>{
    let r=all
    if(tab==='minggu') r=r.filter(e=>e.tanggal>=weekStart())
    if(search.trim()){ const q=search.toLowerCase(); r=r.filter(e=>e.judul?.toLowerCase().includes(q)||e.pikiran?.toLowerCase().includes(q)||(e.perasaan||[]).some(p=>p.toLowerCase().includes(q))) }
    return r
  },[all,tab,search])

  const weekCount  = all.filter(e=>e.tanggal>=weekStart()).length
  const streakDays = calcStreak(all)
  const feelingCounts={}; all.forEach(e=>(e.perasaan||[]).forEach(p=>{feelingCounts[p]=(feelingCounts[p]||0)+1}))
  const topFeeling = Object.entries(feelingCounts).sort((a,b)=>b[1]-a[1])[0]?.[0]||null

  function openNew()  { setDraft({...EMPTY,tanggal:today}); setActiveSection(0); setModal('new') }
  function openEdit(e){ setDraft({...e}); setActiveSection(0); setModal('edit') }
  function save() {
    if(!draft.judul?.trim()) return
    if(draft.id) setData(d=>({...d,entries:d.entries.map(e=>e.id===draft.id?draft:e)}))
    else setData(d=>({...d,entries:[...(d.entries||[]),{...draft,id:`j_${Date.now()}`}]}))
    setModal(null)
  }
  function del(id){ setData(d=>({...d,entries:d.entries.filter(x=>x.id!==id)})) }
  function toggleP(l){ setDraft(d=>({...d,perasaan:d.perasaan.includes(l)?d.perasaan.filter(x=>x!==l):[...d.perasaan,l]})) }
  function toggleA(l){ setDraft(d=>({...d,aktivitasPositif:(d.aktivitasPositif||[]).includes(l)?(d.aktivitasPositif||[]).filter(x=>x!==l):[...(d.aktivitasPositif||[]),l]})) }

  const STATS = [
    { Icon:BookHeart,    value:all.length,   label:'Total Entri',     color:'#5856D6' },
    { Icon:CalendarDays, value:weekCount,     label:'Minggu Ini',      color:C.accent  },
    { Icon:Flame,        value:streakDays,    label:'Hari Berturut',   color:C.moon    },
    ...(topFeeling?[{ Icon:Sparkles, value:topFeeling, label:'Perasaan Dominan', color:PERASAAN_OPTS.find(p=>p.label===topFeeling)?.color||'#888' }]:[]),
  ]

  const MODAL_SECTIONS = ['Perasaan', 'Pikiran', 'Reframing', 'Pagi & Gratitude']

  return (
    <div style={{ margin:'-28px -28px -40px', minHeight:'calc(100vh - 68px)', background:C.bg, display:'flex', flexDirection:'column', fontFamily:'inherit' }}>

      {/* ══ HEADER ══ */}
      <div style={{ padding: isMobile ? '20px 16px 0' : '36px 40px 0', background:'white', borderBottom:`1px solid ${C.border}`, position:'relative', overflow:'hidden' }}>
        {/* Subtle blue gradient */}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:'3px', background:`linear-gradient(90deg,${C.accent},#34C759,${C.moon})` }}/>
        <div style={{ position:'absolute', top:'-60px', right:'80px', width:'240px', height:'240px', borderRadius:'50%', background:`radial-gradient(circle,${C.accentDim} 0%,transparent 70%)`, pointerEvents:'none' }}/>

        {/* Title row */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'20px', position:'relative', flexWrap: isMobile ? 'wrap' : 'nowrap', gap: isMobile ? '12px' : '0' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'14px', marginBottom:'6px' }}>
              <div style={{ width:'44px', height:'44px', borderRadius:'14px', background:C.moonDim, border:`1px solid rgba(255,159,10,0.25)`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 10px rgba(255,159,10,0.15)' }}>
                <Moon size={22} color={C.moon} strokeWidth={1.75}/>
              </div>
              <div>
                <h1 style={{ fontSize: isMobile ? '22px' : '30px', fontWeight:800, color:C.text, letterSpacing:'-0.6px', lineHeight:1 }}>
                  Jurnal Malam <span style={{ color:C.accent }}>Rafi</span>
                </h1>
                <p style={{ fontSize:'13px', color:C.textMuted, marginTop:'4px' }}>Eksplorasi pikiran, perasaan, dan pertumbuhan dirimu setiap malam</p>
              </div>
            </div>
          </div>

          <button onClick={openNew}
            onMouseEnter={()=>setHovBtn(true)}
            onMouseLeave={()=>setHovBtn(false)}
            style={{
              display:'flex', alignItems:'center', gap:'8px',
              padding:'12px 22px', borderRadius:'980px',
              background: hovBtn ? '#0077ED' : C.accent,
              color:'white', border:'none', cursor:'pointer',
              fontWeight:700, fontSize:'14px',
              boxShadow: hovBtn ? `0 6px 24px rgba(0,113,227,0.45)` : `0 3px 16px rgba(0,113,227,0.3)`,
              transition:'all 0.2s',
              transform: hovBtn ? 'translateY(-1px)' : 'translateY(0)',
            }}>
            <PenLine size={15}/> Tulis Entri Baru
          </button>
        </div>

        {/* Stats chips */}
        <div style={{ display:'flex', gap:'8px', marginBottom:'20px', flexWrap:'wrap' }}>
          {STATS.map(({ Icon, value, label, color })=>(
            <div key={label} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'7px 14px', borderRadius:'10px', background:C.bg, border:`1px solid ${C.border}`, boxShadow:C.shadow }}>
              <div style={{ width:'24px', height:'24px', borderRadius:'7px', background:`${color}12`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Icon size={12} color={color}/>
              </div>
              <span style={{ fontWeight:800, fontSize:'14px', color:C.text }}>{value}</span>
              <span style={{ fontSize:'12px', color:C.textMuted }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Segment tabs + search */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap: isMobile ? 'wrap' : 'nowrap', gap: isMobile ? '8px' : '0' }}>
          {/* Apple segment control */}
          <div style={{ display:'flex', background:C.bg, borderRadius:'10px', padding:'3px', border:`1px solid ${C.border}`, gap:'2px' }}>
            {[
              { id:'semua',    label:'Semua',    mLabel:'Semua',    Icon:LayoutGrid   },
              { id:'minggu',   label:'Minggu Ini', mLabel:'Minggu', Icon:CalendarDays },
              { id:'timeline', label:'Timeline', mLabel:'Timeline', Icon:GitBranch    },
              { id:'mood',     label:'Mood Chart', mLabel:'Mood',   Icon:BarChart2    },
            ].map(({ id, label, mLabel, Icon })=>(
              <button key={id} onClick={()=>setTab(id)} style={{
                display:'flex', alignItems:'center', gap:'6px', padding: isMobile ? '7px 10px' : '7px 16px',
                borderRadius:'8px', border:'none', cursor:'pointer', fontSize: isMobile ? '12px' : '13px', fontWeight:600,
                background: tab===id ? 'white' : 'transparent',
                color: tab===id ? C.text : C.textMuted,
                boxShadow: tab===id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                transition:'all 0.15s',
              }}>
                <Icon size={12} color={tab===id ? C.accent : 'currentColor'}/> {isMobile ? mLabel : label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{ display: isMobile ? 'none' : 'flex', alignItems:'center', gap:'8px', background:C.bg, border:`1.5px solid ${search ? C.accent : C.border}`, borderRadius:'10px', padding:'7px 13px', boxShadow:search?`0 0 0 3px ${C.accentGlow}`:'none', transition:'all 0.15s' }}>
            <Search size={13} color={search ? C.accent : C.textMuted}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari entri..."
              style={{ border:'none', background:'transparent', outline:'none', fontSize:'13px', color:C.text, width:'150px', fontFamily:'inherit' }}/>
            {search && <button onClick={()=>setSearch('')} style={{ background:'none', border:'none', cursor:'pointer', color:C.textMuted, display:'flex', padding:'0' }}><X size={13}/></button>}
          </div>
        </div>

        {/* Active tab underline */}
        <div style={{ height:'2px', background:C.border, marginTop:'12px', marginLeft:'-40px', marginRight:'-40px', position:'relative' }}>
          <div style={{ position:'absolute', bottom:0, left:'40px', height:'2px', width:'60px', background:C.accent, borderRadius:'1px', transition:'all 0.3s' }}/>
        </div>
      </div>

      {/* ══ CONTENT ══ */}

      {/* ── Card Grid ── */}
      {(tab==='semua'||tab==='minggu') && (
        shown.length === 0 ? (

          /* Empty state */
          <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'60px 40px', background:C.bg }}>
            <div style={{ position:'relative', marginBottom:'32px' }}>
              {/* Glow */}
              <div style={{ position:'absolute', inset:'-30px', borderRadius:'50%', background:`radial-gradient(circle,${C.accentDim} 0%,transparent 70%)`, pointerEvents:'none' }}/>
              {/* Sparkles */}
              {[[-36,-14,14],[ 92,-20,12],[-24,62,11],[ 94,62,10]].map(([l,t,s],i)=>(
                <div key={i} style={{ position:'absolute', left:l, top:t, color:C.moon, opacity:0.5 }}>
                  <Sparkles size={s} color={C.moon}/>
                </div>
              ))}
              {/* Moon */}
              <div style={{ width:'96px', height:'96px', borderRadius:'50%', background:`radial-gradient(circle at 35% 35%,#FFB830 0%,${C.moon} 55%,#C07800 100%)`, boxShadow:`0 0 40px rgba(255,159,10,0.3)`, display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
                <Moon size={42} color="rgba(80,40,0,0.3)" strokeWidth={1}/>
              </div>
            </div>

            <h2 style={{ fontSize:'26px', fontWeight:800, color:C.text, marginBottom:'10px', textAlign:'center' }}>
              {tab==='minggu' ? 'Belum ada jurnal minggu ini' : 'Mulai perjalanan refleksimu'}
            </h2>
            <p style={{ fontSize:'14px', color:C.textMuted, textAlign:'center', lineHeight:'1.8', maxWidth:'360px', marginBottom:'28px' }}>
              {tab==='minggu'
                ? 'Kamu belum menulis jurnal minggu ini. Luangkan waktu malam ini.'
                : 'Tulis pikiran, perasaan, dan momen berhargamu. Setiap malam adalah kesempatan baru.'}
            </p>

            <button onClick={openNew} style={{
              display:'flex', alignItems:'center', gap:'10px',
              padding:'14px 28px', borderRadius:'980px',
              background:C.accent, color:'white', border:'none', cursor:'pointer',
              fontWeight:700, fontSize:'15px',
              boxShadow:`0 4px 20px rgba(0,113,227,0.35)`, transition:'all 0.2s',
              marginBottom:'44px',
            }}
            onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow=`0 8px 28px rgba(0,113,227,0.45)` }}
            onMouseLeave={e=>{ e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=`0 4px 20px rgba(0,113,227,0.35)` }}>
              <PenLine size={17}/> Tulis Entri Pertama
            </button>

            {/* Feature cards */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px', maxWidth:'520px' }}>
              {[
                { Icon:MessageCircle, color:C.accent,  title:'Pikiran & Situasi', desc:'Dokumentasikan yang ada di pikiranmu' },
                { Icon:Heart,         color:'#FF3B30', title:'Emosi & Perasaan',  desc:'Kenali dan ekspresikan perasaanmu'   },
                { Icon:RefreshCw,     color:'#30D158', title:'Reframing & CBT',   desc:'Ubah perspektif jadi lebih positif'  },
              ].map(({ Icon, color, title, desc })=>(
                <div key={title} onClick={openNew} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:'16px', padding:'18px', textAlign:'center', boxShadow:C.shadow, cursor:'pointer', transition:'all 0.2s' }}
                  onMouseEnter={e=>{ e.currentTarget.style.boxShadow=`0 6px 20px ${color}20`; e.currentTarget.style.borderColor=`${color}40`; e.currentTarget.style.transform='translateY(-2px)' }}
                  onMouseLeave={e=>{ e.currentTarget.style.boxShadow=C.shadow; e.currentTarget.style.borderColor=C.border; e.currentTarget.style.transform='' }}>
                  <div style={{ width:'42px', height:'42px', borderRadius:'12px', background:`${color}12`, border:`1px solid ${color}22`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px' }}>
                    <Icon size={19} color={color} strokeWidth={1.75}/>
                  </div>
                  <div style={{ fontSize:'13px', fontWeight:700, color:C.text, marginBottom:'4px' }}>{title}</div>
                  <div style={{ fontSize:'11.5px', color:C.textMuted, lineHeight:'1.5' }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>

        ) : (

          /* Card grid */
          <div style={{ flex:1, padding: isMobile ? '16px 14px' : '28px 40px', overflowY:'auto' }}>
            {/* Toolbar row */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px' }}>
              <span style={{ fontSize:'13px', color:C.textMuted, fontWeight:500 }}>
                {shown.length} entri {tab==='minggu' ? 'minggu ini' : 'total'}
              </span>
              <button onClick={openNew} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 16px', borderRadius:'980px', background:C.accentDim, color:C.accent, border:`1px solid ${C.accent}30`, cursor:'pointer', fontSize:'13px', fontWeight:700, transition:'all 0.15s' }}
                onMouseEnter={e=>{ e.currentTarget.style.background=C.accent; e.currentTarget.style.color='white' }}
                onMouseLeave={e=>{ e.currentTarget.style.background=C.accentDim; e.currentTarget.style.color=C.accent }}>
                <Plus size={14}/> Entri Baru
              </button>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'14px', alignItems:'start' }}>
              {shown.map(entry => (
                <EntryCard key={entry.id} entry={entry} onClick={()=>openEdit(entry)} onDelete={()=>del(entry.id)}/>
              ))}
              {/* Add card */}
              <div onClick={openNew} style={{ background:'transparent', border:`1.5px dashed ${C.borderMid}`, borderRadius:'18px', padding:'36px 20px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'10px', cursor:'pointer', transition:'all 0.18s', color:C.textMuted, minHeight:'140px' }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor=C.accent; e.currentTarget.style.color=C.accent; e.currentTarget.style.background=C.accentDim }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.borderMid; e.currentTarget.style.color=C.textMuted; e.currentTarget.style.background='transparent' }}>
                <div style={{ width:'36px', height:'36px', borderRadius:'10px', border:'1.5px dashed currentColor', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Plus size={18}/>
                </div>
                <span style={{ fontSize:'13px', fontWeight:600 }}>Entri baru</span>
              </div>
            </div>
          </div>
        )
      )}

      {/* ── Timeline ── */}
      {tab==='timeline' && (
        <div style={{ flex:1, padding: isMobile ? '16px 14px' : '32px 40px', overflowY:'auto' }}>
          {all.length===0 ? (
            <div style={{ textAlign:'center', paddingTop:'80px', color:C.textMuted }}>
              <Moon size={48} color={C.border} style={{ marginBottom:'16px' }}/>
              <p style={{ fontSize:'15px' }}>Belum ada entri untuk ditampilkan</p>
            </div>
          ) : (
            <>
              <h2 style={{ fontSize:'20px', fontWeight:800, color:C.text, marginBottom:'24px' }}>Timeline Perasaan</h2>
              <div style={{ position:'relative', paddingLeft:'36px' }}>
                <div style={{ position:'absolute', left:'11px', top:'8px', bottom:'8px', width:'2px', background:`linear-gradient(180deg,${C.accent},${C.moon},transparent)`, borderRadius:'1px', opacity:0.3 }}/>
                {all.map((entry)=>{
                  const fc = PERASAAN_OPTS.find(p=>p.label===entry.perasaan?.[0])
                  return (
                    <div key={entry.id} onClick={()=>openEdit(entry)} style={{ position:'relative', marginBottom:'14px', cursor:'pointer' }}>
                      <div style={{ position:'absolute', left:'-30px', top:'20px', width:'14px', height:'14px', borderRadius:'50%', background:fc?.color||C.borderMid, border:`2.5px solid ${C.bg}`, zIndex:1, boxShadow:`0 0 8px ${fc?.color||'#ccc'}55` }}/>
                      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:'16px', padding:'16px 20px', transition:'all 0.18s', boxShadow:C.shadow }}
                        onMouseEnter={e=>{ e.currentTarget.style.borderColor=fc?.color+'50'||C.borderMid; e.currentTarget.style.transform='translateX(6px)'; e.currentTarget.style.boxShadow=C.shadowMd }}
                        onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=C.shadow }}>
                        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'8px' }}>
                          <div>
                            <p style={{ fontSize:'10.5px', color:C.textMuted, textTransform:'uppercase', letterSpacing:'1px', marginBottom:'3px' }}>{fDate(entry.tanggal)}</p>
                            <h3 style={{ fontSize:'15px', fontWeight:700, color:C.text }}>{entry.judul||'Untitled'}</h3>
                          </div>
                          {entry.intensitas && (
                            <div style={{ background:C.bg, borderRadius:'10px', padding:'6px 12px', textAlign:'center', border:`1px solid ${C.border}`, flexShrink:0 }}>
                              <div style={{ fontSize:'20px', fontWeight:900, color:C.text, lineHeight:1 }}>{entry.intensitas}</div>
                              <div style={{ fontSize:'9px', color:C.textMuted, marginTop:'2px', textTransform:'uppercase', letterSpacing:'0.5px' }}>int.</div>
                            </div>
                          )}
                        </div>
                        {entry.pikiran && <p style={{ fontSize:'13px', color:C.textSec, lineHeight:'1.6', marginBottom:'10px', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{entry.pikiran}</p>}
                        <div style={{ display:'flex', gap:'5px', flexWrap:'wrap' }}>
                          {(entry.perasaan||[]).map(p => {
                            const pOpt = PERASAAN_OPTS.find(x=>x.label===p)
                            return <span key={p} style={{ padding:'2px 9px', borderRadius:'99px', fontSize:'11px', fontWeight:600, color:pOpt?.color, background:pOpt?.bg }}>{pOpt?.emoji} {p}</span>
                          })}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Mood Chart ── */}
      {tab==='mood' && (
        <div style={{ flex:1, padding: isMobile ? '16px 14px' : '32px 40px', overflowY:'auto' }}>
          <h2 style={{ fontSize:'20px', fontWeight:800, color:C.text, marginBottom:'24px' }}>Mood Tracker</h2>

          {all.length===0 ? (
            <div style={{ textAlign:'center', paddingTop:'60px', color:C.textMuted }}>
              <BarChart2 size={48} color={C.border} style={{ marginBottom:'16px' }}/>
              <p style={{ fontSize:'15px' }}>Mulai tulis jurnal untuk melihat mood chart</p>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:'24px' }}>

              {/* 14-day intensitas bars */}
              <div style={{ background:C.surface, borderRadius:'18px', border:`1px solid ${C.border}`, padding:'20px 24px', boxShadow:C.shadow }}>
                <p style={{ fontSize:'13px', fontWeight:700, color:C.text, marginBottom:'16px' }}>Intensitas 14 Hari Terakhir</p>
                <div style={{ display:'flex', gap:'6px', alignItems:'flex-end', height:'80px' }}>
                  {Array.from({length:14},(_,i)=>{
                    const d=new Date(); d.setDate(d.getDate()-(13-i))
                    const dStr=d.toISOString().split('T')[0]
                    const entry=all.find(e=>e.tanggal===dStr)
                    const val=entry ? Number(entry.intensitas)||0 : 0
                    const isToday=i===13
                    const pct=val/10
                    const feelColor=entry ? (PERASAAN_OPTS.find(p=>p.label===entry.perasaan?.[0])?.color||C.accent) : C.border
                    return (
                      <div key={dStr} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:'4px', height:'100%', justifyContent:'flex-end' }} title={entry?`${dStr}: ${val}/10`:dStr}>
                        <div style={{ width:'100%', borderRadius:'4px 4px 0 0', background:entry?feelColor:C.border, height:`${Math.max(4,pct*100)}%`, opacity:isToday?1:0.7, transition:'height 0.5s', position:'relative' }}>
                          {isToday && <div style={{ position:'absolute', top:'-4px', left:'50%', transform:'translateX(-50%)', width:'6px', height:'6px', borderRadius:'50%', background:feelColor }}/>}
                        </div>
                        <span style={{ fontSize:'9px', color:isToday?C.accent:C.textMuted, fontWeight:isToday?700:400 }}>
                          {d.toLocaleDateString('id-ID',{day:'numeric',month:'short'}).replace(' ','/')}
                        </span>
                      </div>
                    )
                  })}
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', marginTop:'8px', fontSize:'10.5px', color:C.textMuted }}>
                  <span>1 = rendah</span><span>10 = tinggi</span>
                </div>
              </div>

              {/* Feeling frequency */}
              {Object.keys(feelingCounts).length>0 && (
                <div style={{ background:C.surface, borderRadius:'18px', border:`1px solid ${C.border}`, padding:'20px 24px', boxShadow:C.shadow }}>
                  <p style={{ fontSize:'13px', fontWeight:700, color:C.text, marginBottom:'16px' }}>Frekuensi Perasaan</p>
                  <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                    {Object.entries(feelingCounts).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([p,count])=>{
                      const opt=PERASAAN_OPTS.find(x=>x.label===p)
                      const maxCount=Math.max(...Object.values(feelingCounts))
                      return (
                        <div key={p} style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                          <span style={{ fontSize:'14px', flexShrink:0 }}>{opt?.emoji||'•'}</span>
                          <span style={{ fontSize:'12.5px', fontWeight:600, color:C.text, width:'90px', flexShrink:0 }}>{p}</span>
                          <div style={{ flex:1, height:'6px', borderRadius:'99px', background:C.bg, overflow:'hidden' }}>
                            <div style={{ height:'100%', width:`${(count/maxCount)*100}%`, background:opt?.color||C.accent, borderRadius:'99px', transition:'width 0.5s' }}/>
                          </div>
                          <span style={{ fontSize:'12px', fontWeight:700, color:opt?.color||C.accent, width:'24px', textAlign:'right', flexShrink:0 }}>{count}x</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Morning mood stats */}
              {(() => {
                const moodCounts={}
                all.forEach(e=>{ if(e.moodPagi) moodCounts[e.moodPagi]=(moodCounts[e.moodPagi]||0)+1 })
                if(!Object.keys(moodCounts).length) return null
                return (
                  <div style={{ background:C.surface, borderRadius:'18px', border:`1px solid ${C.border}`, padding:'20px 24px', boxShadow:C.shadow }}>
                    <p style={{ fontSize:'13px', fontWeight:700, color:C.text, marginBottom:'16px' }}>Mood Pagi</p>
                    <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
                      {Object.entries(moodCounts).sort((a,b)=>b[1]-a[1]).map(([m,count])=>{
                        const opt=MOOD_PAGI_OPTS.find(x=>x.label===m)
                        return (
                          <div key={m} style={{ display:'flex', alignItems:'center', gap:'8px', background:opt?.bg||C.bg, border:`1px solid ${opt?.color||C.border}30`, borderRadius:'12px', padding:'10px 16px' }}>
                            <span style={{ fontSize:'20px' }}>{opt?.emoji||'🙂'}</span>
                            <div>
                              <div style={{ fontSize:'13px', fontWeight:700, color:opt?.color||C.text }}>{m}</div>
                              <div style={{ fontSize:'11px', color:C.textMuted }}>{count}x dicatat</div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })()}
            </div>
          )}
        </div>
      )}

      {/* ══ MODAL ══ */}
      {modal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', backdropFilter:'blur(8px)', zIndex:200, display:'flex', alignItems: isMobile ? 'flex-end' : 'center', justifyContent:'center', padding: isMobile ? '0' : '20px' }}
          onClick={()=>setModal(null)}>
          <div onClick={e=>e.stopPropagation()} style={{
            background:C.surface, borderRadius: isMobile ? '22px 22px 0 0' : '22px',
            border:`1px solid ${C.border}`,
            width:'100%', maxWidth:'680px', maxHeight: isMobile ? '95svh' : '90vh', overflowY:'auto',
            boxShadow:'0 32px 80px rgba(0,0,0,0.2)',
            display:'flex', flexDirection:'column',
          }}>
            {/* Modal header */}
            <div style={{ padding:'22px 26px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:`1px solid ${C.border}`, position:'sticky', top:0, background:'white', zIndex:10, borderRadius:'22px 22px 0 0' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                <div style={{ width:'36px', height:'36px', borderRadius:'11px', background:C.accentDim, border:`1px solid ${C.accent}25`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <PenLine size={17} color={C.accent}/>
                </div>
                <div>
                  <h2 style={{ fontSize:'18px', fontWeight:800, color:C.text, lineHeight:1 }}>{modal==='new' ? 'Entri Baru' : 'Edit Entri'}</h2>
                  <p style={{ fontSize:'11.5px', color:C.textMuted, marginTop:'2px' }}>{modal==='new' ? new Date().toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long'}) : fDate(draft.tanggal)}</p>
                </div>
              </div>
              <button onClick={()=>setModal(null)} style={{ width:'32px', height:'32px', borderRadius:'9px', background:C.bg, border:`1px solid ${C.border}`, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.textMuted }}>
                <X size={16}/>
              </button>
            </div>

            {/* Section nav */}
            <div style={{ display:'flex', gap:'2px', padding:'10px 26px', background:C.bg, borderBottom:`1px solid ${C.border}` }}>
              {MODAL_SECTIONS.map((s,i) => (
                <button key={s} onClick={()=>setActiveSection(i)} style={{
                  padding:'6px 14px', borderRadius:'8px', border:'none', cursor:'pointer', fontSize:'12.5px', fontWeight:600,
                  background: activeSection===i ? 'white' : 'transparent',
                  color: activeSection===i ? C.text : C.textMuted,
                  boxShadow: activeSection===i ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                  transition:'all 0.15s',
                }}>
                  {s}
                </button>
              ))}
            </div>

            <div style={{ padding:'22px 26px', display:'flex', flexDirection:'column', gap:'18px' }}>
              {/* Always visible: title + date */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:'12px', alignItems:'end' }}>
                <DField label="Judul *">
                  <DInput value={draft.judul} onChange={v=>setDraft(d=>({...d,judul:v}))} placeholder="Judul jurnal malam ini..." autoFocus={modal==='new'}/>
                </DField>
                <DField label="Tanggal">
                  <DInput type="date" value={draft.tanggal} onChange={v=>setDraft(d=>({...d,tanggal:v}))}/>
                </DField>
              </div>

              {/* Section 0: Perasaan */}
              {activeSection === 0 && (
                <>
                  <DField label="Apa yang kamu rasakan? Pilih semua yang sesuai">
                    <div style={{ display:'flex', flexWrap:'wrap', gap:'7px', marginTop:'4px' }}>
                      {PERASAAN_OPTS.map(o => {
                        const sel = draft.perasaan.includes(o.label)
                        return (
                          <button key={o.label} onClick={()=>toggleP(o.label)} style={{
                            padding:'7px 14px', borderRadius:'99px', fontSize:'13px', fontWeight:600,
                            cursor:'pointer', transition:'all 0.15s',
                            border: sel ? `1.5px solid ${o.color}` : `1.5px solid ${C.border}`,
                            background: sel ? o.bg : C.inputBg,
                            color: sel ? o.color : C.textMuted,
                            transform: sel ? 'scale(1.05)' : 'scale(1)',
                          }}>{o.emoji} {o.label}</button>
                        )
                      })}
                    </div>
                  </DField>
                  <DField label={`Intensitas: ${draft.intensitas||5}/10`}>
                    <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
                      <div style={{ flex:1, position:'relative' }}>
                        <input type="range" min="1" max="10" value={draft.intensitas||5}
                          onChange={e=>setDraft(d=>({...d,intensitas:e.target.value}))}
                          style={{ width:'100%', accentColor:C.accent, height:'4px' }}/>
                      </div>
                      <div style={{ width:'48px', height:'48px', borderRadius:'12px', background:C.accentDim, border:`1.5px solid ${C.accent}30`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <span style={{ fontSize:'20px', fontWeight:900, color:C.accent }}>{draft.intensitas||5}</span>
                      </div>
                    </div>
                  </DField>
                </>
              )}

              {/* Section 1: Pikiran */}
              {activeSection === 1 && (
                <>
                  <DField label="Pikiran">
                    <DTextarea value={draft.pikiran} onChange={v=>setDraft(d=>({...d,pikiran:v}))} placeholder="Apa yang ada di pikiranmu malam ini?" rows={3}/>
                  </DField>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                    <DField label="Situasi">
                      <DTextarea value={draft.situasi} onChange={v=>setDraft(d=>({...d,situasi:v}))} placeholder="Apa yang terjadi?" rows={2}/>
                    </DField>
                    <DField label="Perilaku">
                      <DTextarea value={draft.perilaku} onChange={v=>setDraft(d=>({...d,perilaku:v}))} placeholder="Apa yang kamu lakukan?" rows={2}/>
                    </DField>
                  </div>
                </>
              )}

              {/* Section 2: Reframing */}
              {activeSection === 2 && (
                <DField label="Ubah perspektif negatif menjadi lebih konstruktif">
                  <DTextarea value={draft.reframing} onChange={v=>setDraft(d=>({...d,reframing:v}))} placeholder="Bagaimana cara lain melihat situasi ini?" rows={5}/>
                </DField>
              )}

              {/* Section 3: Pagi & Gratitude */}
              {activeSection === 3 && (
                <>
                  <DField label="Mood Pagi">
                    <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                      {MOOD_PAGI_OPTS.map(m=>(
                        <button key={m.label} onClick={()=>setDraft(d=>({...d,moodPagi:d.moodPagi===m.label?'':m.label}))} style={{ padding:'8px 16px', borderRadius:'99px', fontSize:'13px', fontWeight:600, cursor:'pointer', transition:'all 0.15s', border: draft.moodPagi===m.label?`1.5px solid ${m.color}`:`1.5px solid ${C.border}`, background: draft.moodPagi===m.label?m.bg:C.inputBg, color: draft.moodPagi===m.label?m.color:C.textMuted, transform: draft.moodPagi===m.label?'scale(1.05)':'scale(1)' }}>
                          {m.emoji} {m.label}
                        </button>
                      ))}
                    </div>
                  </DField>
                  <DField label="Aktivitas Positif">
                    <div style={{ display:'flex', flexWrap:'wrap', gap:'7px', marginTop:'4px' }}>
                      {AKTIVITAS_OPTS.map(o => {
                        const sel = (draft.aktivitasPositif||[]).includes(o.label)
                        return (
                          <button key={o.label} onClick={()=>toggleA(o.label)} style={{ padding:'7px 14px', borderRadius:'99px', fontSize:'12.5px', fontWeight:600, cursor:'pointer', transition:'all 0.15s', border:sel?`1.5px solid ${o.color}`:`1.5px solid ${C.border}`, background:sel?`${o.color}15`:C.inputBg, color:sel?o.color:C.textMuted, transform:sel?'scale(1.05)':'scale(1)' }}>
                            {o.emoji} {o.label}
                          </button>
                        )
                      })}
                    </div>
                  </DField>
                  <DField label="Gratitude — Apa yang kamu syukuri?">
                    <DTextarea value={draft.gratitude} onChange={v=>setDraft(d=>({...d,gratitude:v}))} placeholder="Aku bersyukur karena..." rows={2}/>
                  </DField>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                    <DField label="Status Review">
                      <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                        {STATUS_OPTS.map(s=>(
                          <button key={s.label} onClick={()=>setDraft(d=>({...d,statusReview:s.label}))} style={{ padding:'7px 14px', borderRadius:'99px', fontSize:'12.5px', fontWeight:600, cursor:'pointer', textAlign:'left', transition:'all 0.15s', border:draft.statusReview===s.label?`1.5px solid ${s.color}`:`1.5px solid ${C.border}`, background:draft.statusReview===s.label?s.bg:C.inputBg, color:draft.statusReview===s.label?s.color:C.textMuted }}>
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </DField>
                    <DField label="Evaluasi">
                      <DTextarea value={draft.evaluasi} onChange={v=>setDraft(d=>({...d,evaluasi:v}))} placeholder="Apa yang bisa dipelajari?" rows={4}/>
                    </DField>
                  </div>
                </>
              )}
            </div>

            {/* Section navigation + Save */}
            <div style={{ padding:'14px 26px 22px', display:'flex', alignItems:'center', justifyContent:'space-between', borderTop:`1px solid ${C.border}`, position:'sticky', bottom:0, background:'white', borderRadius:'0 0 22px 22px' }}>
              <div style={{ display:'flex', gap:'6px' }}>
                {MODAL_SECTIONS.map((_,i) => (
                  <button key={i} onClick={()=>setActiveSection(i)} style={{ width:'8px', height:'8px', borderRadius:'50%', border:'none', background: activeSection===i ? C.accent : C.borderMid, cursor:'pointer', transition:'all 0.2s', transform: activeSection===i ? 'scale(1.3)' : 'scale(1)' }}/>
                ))}
              </div>
              <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
                {activeSection < MODAL_SECTIONS.length - 1 && (
                  <button onClick={()=>setActiveSection(s=>s+1)} style={{ padding:'9px 18px', borderRadius:'11px', fontSize:'13px', fontWeight:600, background:C.bg, border:`1px solid ${C.border}`, color:C.text, cursor:'pointer', display:'flex', alignItems:'center', gap:'5px' }}>
                    Lanjut <ChevronRight size={14}/>
                  </button>
                )}
                <button onClick={()=>setModal(null)} style={{ padding:'9px 18px', borderRadius:'11px', fontSize:'13px', fontWeight:600, background:C.bg, border:`1px solid ${C.border}`, color:C.textSec, cursor:'pointer' }}>
                  Batal
                </button>
                <button onClick={save} style={{
                  display:'flex', alignItems:'center', gap:'7px',
                  padding:'10px 22px', borderRadius:'11px', fontSize:'13.5px', fontWeight:700,
                  background:C.accent, color:'white', border:'none', cursor:'pointer',
                  boxShadow:`0 3px 14px rgba(0,113,227,0.3)`, transition:'all 0.15s',
                }}
                onMouseEnter={e=>e.currentTarget.style.boxShadow=`0 6px 22px rgba(0,113,227,0.45)`}
                onMouseLeave={e=>e.currentTarget.style.boxShadow=`0 3px 14px rgba(0,113,227,0.3)`}>
                  <Save size={15}/> {modal==='new' ? 'Simpan' : 'Perbarui'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
