import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useIsMobile } from '../hooks/useIsMobile'
import {
  Calendar, ChevronLeft, ChevronRight,
  Send, Heart, Target, BookOpen,
  TrendingUp, ArrowRight, Zap, Edit3,
  Check, Plus, Trash2, Moon,
  Sun, Wallet, ArrowUpRight, ArrowDownRight
} from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'

/* ── Helpers ── */
function getWeek(offset = 0) {
  const today = new Date()
  const dow = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1) + offset * 7)
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

const DAY_NAMES   = ['Min','Sen','Sel','Rab','Kam','Jum','Sab']
const DAY_FULL    = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu']
const MONTH_ID    = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
const MONTH_SHORT = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des']

function getCountdownDays(dateStr) {
  if (!dateStr) return null
  const diff = new Date(dateStr) - new Date()
  if (diff < 0) return null
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

const QUOTES = [
  'Setiap langkah kecil adalah kemajuan.',
  'Konsistensi mengalahkan intensitas.',
  'Mulai dari yang bisa kamu lakukan hari ini.',
  'Hari ini adalah kesempatan baru.',
  'Bangun versi terbaik dirimu, satu hari dalam satu waktu.',
  'Fokuslah pada proses, bukan hasil.',
  'Disiplin adalah jembatan antara tujuan dan pencapaian.',
]

/* ── Mini ring SVG ── */
function ProgressRing({ pct, size = 56, stroke = 5, color = '#fff', trackColor = 'rgba(255,255,255,0.2)' }) {
  const r = (size - stroke * 2) / 2
  const circ = 2 * Math.PI * r
  const dash = Math.max(0, Math.min(1, pct / 100)) * circ
  return (
    <svg width={size} height={size} style={{ display:'block', transform:'rotate(-90deg)', flexShrink:0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeLinecap="round" strokeDasharray={`${dash} ${circ}`} style={{ transition:'stroke-dasharray 0.6s ease' }}/>
    </svg>
  )
}

/* ── Compact task row ── */
function TaskRow({ task, onToggle, onRemove }) {
  const [hov, setHov] = useState(false)
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ display:'flex', alignItems:'center', gap:'10px', padding:'8px 14px', borderBottom:'1px solid var(--border-light)', background: task.done ? 'rgba(0,0,0,0.01)' : 'white', transition:'background 0.15s' }}>
      <button onClick={onToggle} style={{
        width:'18px', height:'18px', borderRadius:'5px', flexShrink:0,
        border:`1.5px solid ${task.done ? 'var(--accent)' : 'var(--border)'}`,
        background: task.done ? 'var(--accent)' : 'transparent',
        cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s',
      }}>
        {task.done && <Check size={10} color="white" strokeWidth={3}/>}
      </button>
      <span style={{ flex:1, fontSize:'12.5px', color: task.done ? 'var(--text-muted)' : 'var(--text)', textDecoration: task.done ? 'line-through' : 'none', lineHeight:'1.4' }}>{task.text}</span>
      {hov && <button onClick={onRemove} style={{ background:'none', border:'none', cursor:'pointer', color:'#FF375F', display:'flex', opacity:0.7 }}><Trash2 size={11}/></button>}
    </div>
  )
}

export default function Dashboard() {
  const [wedding, setWedding] = useLocalStorage('wedding', {
    weddingDate: '2028-06-15', partnerName: 'Harista', myName: 'Rafi',
    checklist: [], budget: { total: 0, categories: [] }, guests: [],
  })
  const [tasks, setTasks]   = useLocalStorage('dashboard-tasks', [])
  const [journal]           = useLocalStorage('journal-v2', [])
  const [lifePlan]          = useLocalStorage('life-plan', { plans: [], daily: {} })
  const [finance]           = useLocalStorage('finance-v1', { transactions: [] })
  const [weekOffset, setWeekOffset] = useState(0)
  const [quickTask, setQuickTask]   = useState('')

  useEffect(() => {
    setWedding(prev => ({
      ...prev,
      myName:      prev.myName      || 'Rafi',
      partnerName: prev.partnerName || 'Harista',
      weddingDate: prev.weddingDate || '2028-06-15',
    }))
  }, []) // eslint-disable-line

  const now        = new Date()
  const todayStr   = now.toISOString().split('T')[0]
  const todayLabel = `${DAY_FULL[now.getDay()]}, ${now.getDate()} ${MONTH_ID[now.getMonth()]} ${now.getFullYear()}`
  const todayShort = `${now.getDate()} ${MONTH_SHORT[now.getMonth()]}`
  const greetHour  = now.getHours()
  const greet      = greetHour < 11 ? 'Selamat pagi' : greetHour < 15 ? 'Selamat siang' : greetHour < 18 ? 'Selamat sore' : 'Selamat malam'
  const greetIcon  = greetHour < 11 ? <Sun size={14}/> : greetHour < 18 ? <Sun size={14}/> : <Moon size={14}/>
  const quote      = QUOTES[now.getDate() % QUOTES.length]

  const todayTasks = tasks.filter(t => t.date === todayStr)
  const doneTasks  = todayTasks.filter(t => t.done).length
  const allTasks   = [...tasks].reverse()

  const journalEntries = Array.isArray(journal?.entries) ? journal.entries : []
  const journalCnt  = journalEntries.length
  const lastJournal = journalEntries.sort((a,b)=>new Date(b.tanggal)-new Date(a.tanggal))[0]

  const weddingDays = getCountdownDays(wedding.weddingDate)
  const wCheckPct   = (() => {
    const total = (wedding.checklist || []).length
    const done  = (wedding.checklist || []).filter(c => c.done).length
    return total ? Math.round((done / total) * 100) : 0
  })()

  const plans = lifePlan?.plans || []
  const todayDaily = lifePlan?.daily?.[todayStr] || {}
  const completedIds = todayDaily.completed || []
  const lifeTotal = plans.reduce((s, p) => s + (p.rows?.length || 0), 0)
  const lifeDone  = plans.reduce((s, p) => s + (p.rows||[]).filter(r => completedIds.includes(r.id)).length, 0)
  const lifePct   = lifeTotal ? Math.round((lifeDone / lifeTotal) * 100) : 0

  const taskPct = todayTasks.length ? Math.round((doneTasks / todayTasks.length) * 100) : 0
  const overallPct = Math.round(([taskPct, lifePct, wCheckPct].reduce((a,b)=>a+b,0)) / 3)
  const isMobile = useIsMobile()

  const thisMonth = (() => {
    const txs = finance.transactions || []
    const y = now.getFullYear(), m = now.getMonth()
    const mtxs = txs.filter(t=>{ const d=new Date(t.date); return d.getFullYear()===y && d.getMonth()===m })
    const inc = mtxs.filter(t=>t.type==='income').reduce((s,t)=>s+Number(t.amount),0)
    const exp = mtxs.filter(t=>t.type==='expense').reduce((s,t)=>s+Number(t.amount),0)
    return { inc, exp, bal: inc-exp }
  })()
  const fmtK = n => n >= 1000000 ? `${(n/1000000).toFixed(1)}jt` : n >= 1000 ? `${(n/1000).toFixed(0)}rb` : `${n}`

  const addQuickTask = (e) => {
    e.preventDefault()
    if (!quickTask.trim()) return
    setTasks(prev => [...prev, { id: Date.now(), text: quickTask.trim(), done: false, date: todayStr }])
    setQuickTask('')
  }
  const toggleTask = (id) => setTasks(t => t.map(x => x.id === id ? { ...x, done: !x.done } : x))
  const removeTask = (id) => setTasks(t => t.filter(x => x.id !== id))

  const week = getWeek(weekOffset)
  const scheduleEvents = []
  if (wedding.weddingDate) {
    const wStr = new Date(wedding.weddingDate).toISOString().split('T')[0]
    if (week.some(d => d.toISOString().split('T')[0] === wStr)) {
      const col = week.findIndex(d => d.toISOString().split('T')[0] === wStr)
      scheduleEvents.push({ col, label: 'Hari Pernikahan', type: 'rose', row: 0 })
    }
  }
  tasks.forEach(t => {
    if (!t.done && week.some(d => d.toISOString().split('T')[0] === t.date)) {
      const col = week.findIndex(d => d.toISOString().split('T')[0] === t.date)
      const row = scheduleEvents.filter(e => e.col === col).length
      if (row < 2) scheduleEvents.push({ col, label: t.text, type: 'accent', row })
    }
  })

  const weekLabel = (() => {
    if (!week.length) return ''
    const m1 = week[0].getMonth(), m2 = week[4].getMonth()
    return m1 === m2
      ? `${MONTH_ID[m1]} ${week[0].getFullYear()}`
      : `${MONTH_SHORT[m1]} – ${MONTH_SHORT[m2]} ${week[0].getFullYear()}`
  })()

  return (
    <div className="page animate-in" style={{ padding: isMobile ? '0' : '8px' }}>
      <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1.55fr 1fr', gap:'14px', alignItems:'start' }}>

        {/* ══ LEFT ══ */}
        <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>

          {/* ── Hero ── */}
          <div style={{
            borderRadius: isMobile ? '16px' : '20px',
            padding: isMobile ? '18px 16px' : '24px 28px',
            background:'linear-gradient(135deg, #1A56DB 0%, #0071E3 50%, #2D9CDB 100%)',
            position:'relative', overflow:'hidden',
          }}>
            {/* Decorative circles */}
            <div style={{ position:'absolute', top:'-50px', right:'-30px', width:'220px', height:'220px', borderRadius:'50%', background:'rgba(255,255,255,0.05)', pointerEvents:'none' }}/>
            <div style={{ position:'absolute', bottom:'-40px', left:'30%', width:'160px', height:'160px', borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none' }}/>

            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'16px' }}>
              {/* Left: greeting */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'11px', fontWeight:600, color:'rgba(255,255,255,0.6)', letterSpacing:'0.8px', textTransform:'uppercase', marginBottom:'10px' }}>
                  {greetIcon}
                  {todayLabel}
                </div>
                <div style={{ fontSize: isMobile ? '22px' : '30px', fontWeight:800, lineHeight:1.15, letterSpacing:'-0.5px', marginBottom:'6px', color:'white', textShadow:'0 2px 16px rgba(0,0,0,0.15)' }}>
                  {greet},<br/><span style={{ fontWeight:900 }}>{wedding.myName || 'Rafi'}.</span>
                </div>
                <div style={{ fontSize:'13px', color:'rgba(255,255,255,0.65)', fontStyle:'italic', marginBottom:'16px' }}>
                  "{quote}"
                </div>
                {/* Stat pills row */}
                <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                  {[
                    { label:'Tugas', value:`${doneTasks}/${todayTasks.length||0}`, ok: doneTasks === todayTasks.length && todayTasks.length > 0, emoji:'✓' },
                    { label:'Jurnal', value:`${journalCnt} entri`, ok: journalCnt > 0, emoji:'📖' },
                    { label:'Goals', value:`${lifeDone}/${lifeTotal}`, ok: lifeDone > 0, emoji:'🎯' },
                    { label:'Nikah', value: weddingDays != null ? `${weddingDays}hr` : '–', ok:false, emoji:'💍' },
                  ].map(({ label, value, ok, emoji }) => (
                    <div key={label} style={{
                      display:'flex', alignItems:'center', gap:'5px',
                      background: ok ? 'rgba(52,199,89,0.22)' : 'rgba(255,255,255,0.12)',
                      borderRadius:'99px', padding:'4px 10px',
                      border:`1px solid ${ok ? 'rgba(52,199,89,0.35)' : 'rgba(255,255,255,0.18)'}`,
                    }}>
                      <span style={{ fontSize:'10px' }}>{emoji}</span>
                      <span style={{ fontSize:'11px', fontWeight:600, color:'rgba(255,255,255,0.8)' }}>{label}</span>
                      <span style={{ fontSize:'11px', color:'rgba(255,255,255,0.6)' }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: day progress ring */}
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'6px', flexShrink:0 }}>
                <div style={{ position:'relative', width:'72px', height:'72px' }}>
                  <ProgressRing pct={overallPct} size={72} stroke={6} color="white" trackColor="rgba(255,255,255,0.18)"/>
                  <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                    <span style={{ fontSize:'18px', fontWeight:900, color:'white', lineHeight:1 }}>{overallPct}<span style={{ fontSize:'10px' }}>%</span></span>
                  </div>
                </div>
                <span style={{ fontSize:'9.5px', fontWeight:600, color:'rgba(255,255,255,0.55)', textTransform:'uppercase', letterSpacing:'0.5px', textAlign:'center' }}>Hari ini</span>
              </div>
            </div>
          </div>

          {/* ── 4 compact metric cards ── */}
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap:'10px' }}>
            {[
              { label:'Tugas',     value: todayTasks.length ? `${doneTasks}/${todayTasks.length}` : '0', sub:'hari ini', color:'#0071E3', pct: taskPct },
              { label:'Life Goals',value: lifeTotal ? `${lifeDone}/${lifeTotal}` : '0', sub:'tercapai', color:'#34C759', pct: lifePct },
              { label:'Nikah',     value: weddingDays != null ? weddingDays : '–', sub:'hari lagi', color:'#C96FBB', pct: null },
              { label:'Jurnal',    value: journalCnt, sub:'total entri', color:'#FF9F0A', pct: null },
            ].map(({ label, value, sub, color, pct }) => (
              <div key={label} style={{ background:'white', borderRadius:'14px', padding:'14px 14px 12px', border:'1px solid var(--border)', boxShadow:'var(--shadow)' }}>
                <div style={{ fontSize:'22px', fontWeight:800, color, lineHeight:1, marginBottom:'2px' }}>{value}</div>
                <div style={{ fontSize:'11px', fontWeight:600, color:'var(--text)', marginBottom:'1px' }}>{label}</div>
                <div style={{ fontSize:'10.5px', color:'var(--text-muted)', marginBottom: pct !== null ? '8px' : 0 }}>{sub}</div>
                {pct !== null && (
                  <div style={{ height:'3px', background:'var(--border-light)', borderRadius:'99px', overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${pct}%`, background:color, borderRadius:'99px', transition:'width 0.6s' }}/>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ── Activity & Goals + Wedding row ── */}
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr', gap:'10px' }}>

            {/* Activity */}
            <Link to="/life" style={{ textDecoration:'none' }}>
              <div style={{
                background:'white', borderRadius:'16px', border:'1px solid var(--border)',
                boxShadow:'var(--shadow)', overflow:'hidden',
                transition:'transform 0.18s, box-shadow 0.18s', cursor:'pointer',
              }}
                onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(0,113,227,0.1)' }}
                onMouseLeave={e=>{ e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='var(--shadow)' }}>
                <div style={{ background:'linear-gradient(135deg,rgba(0,113,227,0.07),rgba(45,156,219,0.04))', padding:'14px 16px', borderBottom:'1px solid var(--border-light)' }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'9px' }}>
                      <div style={{ width:'32px', height:'32px', borderRadius:'9px', background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 8px rgba(0,113,227,0.3)' }}>
                        <Target size={16} color="white" strokeWidth={2}/>
                      </div>
                      <div>
                        <div style={{ fontSize:'14px', fontWeight:700, color:'var(--text)', lineHeight:1 }}>Activity & Goals</div>
                        <div style={{ fontSize:'11px', color:'var(--text-muted)', marginTop:'2px' }}>{plans.length} kategori aktif</div>
                      </div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <span style={{ fontSize:'22px', fontWeight:900, color:'var(--accent)' }}>{lifePct}<span style={{ fontSize:'12px' }}>%</span></span>
                    </div>
                  </div>
                </div>
                <div style={{ padding:'12px 16px', display:'flex', flexDirection:'column', gap:'8px' }}>
                  {plans.length === 0 ? (
                    <div style={{ fontSize:'12px', color:'var(--text-muted)', textAlign:'center', padding:'8px 0' }}>Tambahkan goals hidupmu →</div>
                  ) : plans.map(plan => {
                    const rowIds = (plan.rows||[]).map(r=>r.id)
                    const done   = rowIds.filter(id=>completedIds.includes(id)).length
                    const pct    = rowIds.length ? Math.round((done/rowIds.length)*100) : 0
                    return (
                      <div key={plan.id} style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                        <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:plan.color, flexShrink:0 }}/>
                        <span style={{ fontSize:'11.5px', fontWeight:600, color:'var(--text)', width:'90px', flexShrink:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{plan.target}</span>
                        <div style={{ flex:1, height:'4px', background:'var(--border-light)', borderRadius:'99px', overflow:'hidden' }}>
                          <div style={{ height:'100%', width:`${pct}%`, background:plan.color, borderRadius:'99px', transition:'width 0.5s' }}/>
                        </div>
                        <span style={{ fontSize:'10.5px', color: done===rowIds.length && rowIds.length>0 ? '#34C759' : 'var(--text-muted)', fontWeight:700, width:'26px', textAlign:'right', flexShrink:0 }}>{done}/{rowIds.length}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </Link>

            {/* Wedding countdown */}
            <Link to="/wedding" style={{ textDecoration:'none' }}>
              <div style={{
                background:'linear-gradient(135deg,rgba(201,111,187,0.08),rgba(108,63,196,0.06))',
                borderRadius:'16px', border:'1px solid rgba(155,89,196,0.2)',
                boxShadow:'var(--shadow)', padding:'16px',
                transition:'transform 0.18s, box-shadow 0.18s', cursor:'pointer', height:'100%',
              }}
                onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(155,89,196,0.15)' }}
                onMouseLeave={e=>{ e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='var(--shadow)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'12px' }}>
                  <div style={{ width:'30px', height:'30px', borderRadius:'9px', background:'rgba(201,111,187,0.15)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Heart size={14} color="#C96FBB" strokeWidth={1.75}/>
                  </div>
                  <div>
                    <div style={{ fontSize:'13px', fontWeight:700, color:'var(--text)' }}>{wedding.myName} & {wedding.partnerName}</div>
                    <div style={{ fontSize:'10.5px', color:'var(--text-muted)' }}>Wedding countdown</div>
                  </div>
                </div>
                <div style={{ textAlign:'center', padding:'8px 0' }}>
                  <div style={{ fontSize:'48px', fontWeight:900, color:'#9B59C4', lineHeight:1, letterSpacing:'-2px' }}>
                    {weddingDays != null ? weddingDays : '–'}
                  </div>
                  <div style={{ fontSize:'11px', fontWeight:600, color:'rgba(155,89,196,0.7)', textTransform:'uppercase', letterSpacing:'1px', marginTop:'4px' }}>
                    hari lagi
                  </div>
                </div>
                <div style={{ marginTop:'12px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:'10.5px', color:'var(--text-muted)', marginBottom:'4px' }}>
                    <span>Checklist</span>
                    <span style={{ fontWeight:700, color:'#9B59C4' }}>{wCheckPct}%</span>
                  </div>
                  <div style={{ height:'4px', background:'rgba(155,89,196,0.12)', borderRadius:'99px', overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${wCheckPct}%`, background:'linear-gradient(90deg,#C96FBB,#9B59C4)', borderRadius:'99px', transition:'width 0.6s' }}/>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* ── Weekly schedule (compact) ── */}
          <div style={{ background:'white', borderRadius:'16px', border:'1px solid var(--border)', boxShadow:'var(--shadow)', overflow:'hidden' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'13px 18px', borderBottom:'1px solid var(--border-light)' }}>
              <span style={{ fontWeight:700, fontSize:'13.5px' }}>Jadwal Minggu Ini</span>
              <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                <button className="month-nav-btn" onClick={()=>setWeekOffset(w=>w-1)}><ChevronLeft size={13}/></button>
                <span style={{ fontSize:'12px', fontWeight:600, color:'var(--text-sec)', display:'flex', alignItems:'center', gap:'4px' }}>
                  <Calendar size={11} color="var(--accent)"/> {weekLabel}
                </span>
                <button className="month-nav-btn" onClick={()=>setWeekOffset(w=>w+1)}><ChevronRight size={13}/></button>
                <button className="month-nav-btn" onClick={()=>setWeekOffset(0)}>
                  <div style={{ width:'7px', height:'7px', borderRadius:'50%', background:'var(--accent)' }}/>
                </button>
              </div>
            </div>
            {/* Compact day row */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', padding:'0' }}>
              {week.map(d => {
                const dStr = d.toISOString().split('T')[0]
                const isToday = dStr === todayStr
                const dayEvs = scheduleEvents.filter(e => e.col === week.findIndex(x=>x.toISOString().split('T')[0]===dStr))
                return (
                  <div key={dStr} style={{ borderRight:'1px solid var(--border-light)', padding:'10px 10px 12px', background: isToday ? 'rgba(0,113,227,0.03)' : 'white', minHeight:'70px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'5px', marginBottom:'8px' }}>
                      <span style={{ fontSize:'11px', fontWeight: isToday ? 700 : 500, color: isToday ? 'var(--accent)' : 'var(--text-muted)' }}>
                        {DAY_NAMES[d.getDay()]} {d.getDate()}
                      </span>
                      {isToday && <div style={{ width:'5px', height:'5px', borderRadius:'50%', background:'var(--accent)', flexShrink:0 }}/>}
                    </div>
                    {dayEvs.map((ev, i) => (
                      <div key={i} style={{ fontSize:'10px', fontWeight:600, padding:'2px 6px', borderRadius:'4px', marginBottom:'3px',
                        background: ev.type==='rose' ? 'rgba(255,55,95,0.1)' : 'rgba(0,113,227,0.1)',
                        color: ev.type==='rose' ? '#FF375F' : 'var(--accent)',
                        overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
                      }}>{ev.label}</div>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ══ RIGHT ══ */}
        <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>

          {/* ── Quick focus: input + task list combined ── */}
          <div style={{ background:'white', borderRadius:'18px', border:'1px solid var(--border)', boxShadow:'var(--shadow)', overflow:'hidden' }}>
            {/* Header */}
            <div style={{ padding:'14px 16px 10px', borderBottom:'1px solid var(--border-light)', background:'linear-gradient(135deg,rgba(0,113,227,0.04),transparent)' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg,var(--accent),#34C759)', borderRadius:'18px 18px 0 0' }}/>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'7px' }}>
                  <Zap size={14} color="var(--accent)" strokeWidth={2}/>
                  <span style={{ fontSize:'13.5px', fontWeight:700, color:'var(--text)' }}>Fokus Hari Ini</span>
                </div>
                {todayTasks.length > 0 && (
                  <span style={{ fontSize:'11px', fontWeight:700, color:'var(--accent)', background:'var(--accent-light)', padding:'2px 9px', borderRadius:'99px' }}>
                    {doneTasks}/{todayTasks.length}
                  </span>
                )}
              </div>
              <div style={{ fontSize:'11px', color:'var(--text-muted)', marginTop:'2px', marginLeft:'21px' }}>{todayLabel}</div>
            </div>

            {/* Add input */}
            <div style={{ padding:'10px 12px', borderBottom:'1px solid var(--border-light)' }}>
              <form onSubmit={addQuickTask} style={{ display:'flex', gap:'8px', alignItems:'center' }}>
                <div style={{ flex:1, display:'flex', alignItems:'center', gap:'8px', background:'var(--bg)', borderRadius:'10px', padding:'8px 12px', border:'1px solid var(--border)' }}>
                  <Plus size={13} color="var(--text-muted)"/>
                  <input
                    value={quickTask}
                    onChange={e=>setQuickTask(e.target.value)}
                    placeholder="Tambah tugas hari ini..."
                    style={{ flex:1, border:'none', background:'transparent', outline:'none', fontSize:'13px', color:'var(--text)', fontFamily:'inherit' }}
                  />
                </div>
                <button type="submit" style={{ width:'36px', height:'36px', borderRadius:'10px', background:'var(--accent)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 8px rgba(0,113,227,0.3)', flexShrink:0 }}>
                  <Send size={13} color="white"/>
                </button>
              </form>
            </div>

            {/* Task list */}
            {allTasks.length > 0 ? (
              <div style={{ maxHeight:'200px', overflowY:'auto' }}>
                {allTasks.slice(0,8).map(t => (
                  <TaskRow key={t.id} task={t} onToggle={()=>toggleTask(t.id)} onRemove={()=>removeTask(t.id)}/>
                ))}
              </div>
            ) : (
              <div style={{ padding:'20px 16px', textAlign:'center', color:'var(--text-muted)', fontSize:'12.5px' }}>
                Belum ada tugas hari ini. Mulai tambahkan!
              </div>
            )}

            {/* Day progress bar */}
            {todayTasks.length > 0 && (
              <div style={{ padding:'10px 16px', background:'var(--bg)', borderTop:'1px solid var(--border-light)' }}>
                <div style={{ height:'4px', background:'var(--border)', borderRadius:'99px', overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${taskPct}%`, background:'linear-gradient(90deg,var(--accent),#34C759)', borderRadius:'99px', transition:'width 0.6s' }}/>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', marginTop:'5px', fontSize:'10.5px', color:'var(--text-muted)' }}>
                  <span>{doneTasks} selesai</span>
                  <span style={{ fontWeight:700, color: taskPct===100 ? '#34C759' : 'var(--text-muted)' }}>{taskPct}%</span>
                </div>
              </div>
            )}
          </div>

          {/* ── Life plan mini progress ── */}
          <div style={{ background:'white', borderRadius:'16px', border:'1px solid var(--border)', boxShadow:'var(--shadow)', overflow:'hidden' }}>
            <div style={{ padding:'13px 16px', borderBottom:'1px solid var(--border-light)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'7px' }}>
                <Target size={14} color="var(--accent)" strokeWidth={2}/>
                <span style={{ fontSize:'13px', fontWeight:700, color:'var(--text)' }}>Goals Hari Ini</span>
              </div>
              <Link to="/life" style={{ fontSize:'11.5px', color:'var(--accent)', fontWeight:600, textDecoration:'none', display:'flex', alignItems:'center', gap:'3px' }}>
                Buka <ArrowRight size={10}/>
              </Link>
            </div>
            <div style={{ padding:'12px 16px', display:'flex', flexDirection:'column', gap:'9px' }}>
              {plans.length === 0 ? (
                <div style={{ fontSize:'12px', color:'var(--text-muted)', padding:'8px 0', textAlign:'center' }}>Buka Life Plan untuk menambahkan goals →</div>
              ) : plans.map(plan => {
                const rowIds = (plan.rows||[]).map(r=>r.id)
                const done   = rowIds.filter(id=>completedIds.includes(id)).length
                const pct    = rowIds.length ? Math.round((done/rowIds.length)*100) : 0
                return (
                  <div key={plan.id}>
                    <div style={{ display:'flex', alignItems:'center', gap:'7px', marginBottom:'4px' }}>
                      <div style={{ width:'7px', height:'7px', borderRadius:'50%', background:plan.color, flexShrink:0 }}/>
                      <span style={{ fontSize:'12px', fontWeight:600, color:'var(--text)', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{plan.target}</span>
                      <span style={{ fontSize:'11px', fontWeight:700, color: done===rowIds.length && rowIds.length>0 ? '#34C759' : 'var(--text-muted)' }}>{done}/{rowIds.length}</span>
                    </div>
                    <div style={{ height:'4px', background:'var(--border-light)', borderRadius:'99px', overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${pct}%`, background:plan.color, borderRadius:'99px', transition:'width 0.5s' }}/>
                    </div>
                  </div>
                )
              })}
              {/* Total */}
              {plans.length > 0 && (
                <div style={{ paddingTop:'4px', borderTop:'1px solid var(--border-light)', display:'flex', justifyContent:'space-between', fontSize:'11px', color:'var(--text-muted)' }}>
                  <span>Total progress</span>
                  <span style={{ fontWeight:700, color: lifePct===100 ? '#34C759' : 'var(--accent)' }}>{lifePct}%</span>
                </div>
              )}
            </div>
          </div>

          {/* ── Finance mini ── */}
          <Link to="/finance" style={{ textDecoration:'none' }}>
            <div style={{ background:'white', borderRadius:'16px', border:'1px solid var(--border)', boxShadow:'var(--shadow)', overflow:'hidden', transition:'all 0.18s', cursor:'pointer' }}
              onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(52,199,89,0.12)'; e.currentTarget.style.borderColor='rgba(52,199,89,0.25)' }}
              onMouseLeave={e=>{ e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='var(--shadow)'; e.currentTarget.style.borderColor='var(--border)' }}>
              <div style={{ padding:'13px 16px', borderBottom:'1px solid var(--border-light)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'7px' }}>
                  <Wallet size={14} color="#34C759" strokeWidth={2}/>
                  <span style={{ fontSize:'13px', fontWeight:700, color:'var(--text)' }}>Finance Bulan Ini</span>
                </div>
                <ArrowRight size={13} color="var(--text-muted)"/>
              </div>
              <div style={{ padding:'12px 16px', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'8px' }}>
                {[
                  { label:'Masuk', val:thisMonth.inc, color:'#34C759', Icon:ArrowUpRight },
                  { label:'Keluar', val:thisMonth.exp, color:'#FF375F', Icon:ArrowDownRight },
                  { label:'Saldo', val:thisMonth.bal, color:thisMonth.bal>=0?'#0071E3':'#FF375F', Icon:Wallet },
                ].map(({label,val,color,Icon})=>(
                  <div key={label} style={{ textAlign:'center' }}>
                    <div style={{ width:'24px', height:'24px', borderRadius:'7px', background:`${color}12`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 4px' }}>
                      <Icon size={11} color={color}/>
                    </div>
                    <div style={{ fontSize:'13px', fontWeight:800, color }}>{val===0?'–':`Rp${fmtK(Math.abs(val))}`}</div>
                    <div style={{ fontSize:'10px', color:'var(--text-muted)', fontWeight:500 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </Link>

          {/* ── Journal CTA ── */}
          <Link to="/journal" style={{ textDecoration:'none' }}>
            <div style={{ background:'white', borderRadius:'16px', border:'1px solid var(--border)', boxShadow:'var(--shadow)', overflow:'hidden', transition:'all 0.18s', cursor:'pointer' }}
              onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(155,123,160,0.12)'; e.currentTarget.style.borderColor='rgba(155,123,160,0.3)' }}
              onMouseLeave={e=>{ e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='var(--shadow)'; e.currentTarget.style.borderColor='var(--border)' }}>
              <div style={{ padding:'13px 16px', borderBottom:'1px solid var(--border-light)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'7px' }}>
                  <Moon size={14} color="#9B7BA0" strokeWidth={1.75}/>
                  <span style={{ fontSize:'13px', fontWeight:700, color:'var(--text)' }}>Jurnal Harian</span>
                </div>
                <ArrowRight size={13} color="var(--text-muted)"/>
              </div>
              {lastJournal ? (
                <div style={{ padding:'12px 16px' }}>
                  <div style={{ fontSize:'11px', color:'var(--text-muted)', marginBottom:'4px' }}>Entri terakhir</div>
                  <div style={{ fontSize:'13px', fontWeight:700, color:'var(--text)', marginBottom:'4px' }}>{lastJournal.judul}</div>
                  {lastJournal.pikiran && (
                    <div style={{ fontSize:'11.5px', color:'var(--text-muted)', lineHeight:'1.5', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                      {lastJournal.pikiran}
                    </div>
                  )}
                  {(lastJournal.perasaan||[]).length > 0 && (
                    <div style={{ display:'flex', gap:'4px', marginTop:'8px', flexWrap:'wrap' }}>
                      {lastJournal.perasaan.slice(0,3).map(p => (
                        <span key={p} style={{ fontSize:'10.5px', fontWeight:600, background:'rgba(155,123,160,0.1)', color:'#9B7BA0', padding:'2px 8px', borderRadius:'99px' }}>{p}</span>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ padding:'16px', textAlign:'center' }}>
                  <div style={{ fontSize:'12px', color:'var(--text-muted)', marginBottom:'8px' }}>Belum ada entri jurnal.</div>
                  <div style={{ display:'inline-flex', alignItems:'center', gap:'5px', background:'rgba(155,123,160,0.1)', color:'#9B7BA0', borderRadius:'8px', padding:'6px 12px', fontSize:'12px', fontWeight:700 }}>
                    <Edit3 size={11}/> Tulis sekarang
                  </div>
                </div>
              )}
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
