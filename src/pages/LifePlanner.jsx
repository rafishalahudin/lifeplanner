import { useState, useRef, useEffect } from 'react'
import {
  Plus, Trash2, X, Flag, ListChecks, TrendingUp, Sparkles,
  Check, CalendarCheck, Sun, Zap, Target, ChevronDown, ChevronUp,
  MoreHorizontal, Edit3, Flame, LayoutList, Repeat2
} from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useIsMobile } from '../hooks/useIsMobile'

const PALETTE = ['#34C759','#0071E3','#7060A8','#FF9F0A','#4A90D9','#30B0C7','#FF375F','#688030','#307898','#905840']
const uid = () => `_${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`

const DEFAULT_PLANS = [
  { id:'p1', target:'Healthy Life', color:'#34C759', rows:[
    { id:'r11', indicator:'Reach ideal body weight', strategy:'Consistent workout + healthy nutrition', actionPlan:'Exercise every morning before any screen time' },
    { id:'r12', indicator:'Minimum 7 hours of sleep', strategy:'Fixed sleep schedule & wind-down routine', actionPlan:'No phone after 10pm — lights out by 11pm' },
  ]},
  { id:'p2', target:'Career Growth', color:'#0071E3', rows:[
    { id:'r21', indicator:'Get promoted within this year', strategy:'Maintain consistently high-quality output', actionPlan:'Weekly self-review of all deliverables' },
    { id:'r22', indicator:'Grow income by 20%', strategy:'Upskill & expand professional network', actionPlan:'Complete one online course per month' },
    { id:'r23', indicator:'Zero missed deadlines', strategy:'Proactive scheduling & early planning', actionPlan:'Set every reminder 10 minutes early' },
  ]},
  { id:'p3', target:'Self-Development', color:'#7060A8', rows:[
    { id:'r31', indicator:'Read 12 books this year', strategy:'30 minutes of focused reading daily', actionPlan:'Read before bed instead of scrolling social media' },
    { id:'r32', indicator:'Excellent time management', strategy:'Plan each day the night before', actionPlan:'10-min planning session every night before sleep' },
  ]},
  { id:'p4', target:'Financial Health', color:'#FF9F0A', rows:[
    { id:'r41', indicator:'Save 30% of monthly income', strategy:'Automate savings on payday', actionPlan:'Auto-transfer to savings account every payday' },
    { id:'r42', indicator:'No consumer debt', strategy:'Spend strictly within monthly income', actionPlan:'Track every expense weekly in a spreadsheet' },
  ]},
]

/* ── SVG Progress ring ── */
function Ring({ percent, size = 52, color, strokeW = 5 }) {
  const r    = size / 2 - strokeW - 1
  const circ = 2 * Math.PI * r
  const dash = Math.max(0, Math.min(1, percent / 100)) * circ
  return (
    <div style={{ position:'relative', width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size} style={{ display:'block', transform:'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={`${color}20`} strokeWidth={strokeW}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={strokeW} strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`} style={{ transition:'stroke-dasharray 0.45s ease' }}/>
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <span style={{ fontSize: size > 80 ? '20px' : '12px', fontWeight:900, color:'var(--text)', lineHeight:1 }}>{percent}%</span>
      </div>
    </div>
  )
}

/* ── Day dot ── */
function DayDot({ percent, isToday, dayName, color }) {
  const full = percent === 1, part = percent > 0 && percent < 1
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'4px' }}>
      <div style={{ width:'26px', height:'26px', borderRadius:'50%', background: full ? color : part ? `${color}28` : 'transparent', border: isToday ? `2px solid ${color}` : full ? 'none' : '1.5px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}>
        {full && <Check size={12} color="white" strokeWidth={2.5}/>}
        {part && <div style={{ width:'7px', height:'7px', borderRadius:'50%', background:color }}/>}
      </div>
      <span style={{ fontSize:'10px', color: isToday ? color : 'var(--text-muted)', fontWeight: isToday ? 700 : 500 }}>{dayName}</span>
    </div>
  )
}

const HABIT_PALETTE = ['#34C759','#0071E3','#7060A8','#FF9F0A','#FF375F','#30B0C7','#BF5AF2','#FF6B35']
const HABIT_EMOJIS  = ['💪','🏃','📚','💧','🧘','🌿','⚡','🎯','🍎','🛏','✍️','🎨','🧴','🚶','🍵']

function HabitsTab() {
  const isMobile = useIsMobile()
  const [habitsData, setHabitsData] = useLocalStorage('habits-v1', { habits:[], log:{} })
  const [showNew, setShowNew]   = useState(false)
  const [newName, setNewName]   = useState('')
  const [newColor, setNewColor] = useState('#34C759')
  const [newEmoji, setNewEmoji] = useState('💪')
  const [hov, setHov]           = useState(null)
  const nameRef = useRef(null)

  useEffect(()=>{ if(showNew) nameRef.current?.focus() },[showNew])

  const habits   = habitsData.habits || []
  const log      = habitsData.log    || {}
  const todayStr = new Date().toISOString().split('T')[0]
  const todayDone = new Set(log[todayStr] || [])

  const weekDays = Array.from({length:7},(_,i)=>{
    const d=new Date(); d.setDate(d.getDate()-(6-i))
    return { str:d.toISOString().split('T')[0], isToday:i===6, name:d.toLocaleDateString('id-ID',{weekday:'short'}).slice(0,2) }
  })

  function toggle(id){
    setHabitsData(d=>{
      const cur=new Set(d.log?.[todayStr]||[])
      cur.has(id)?cur.delete(id):cur.add(id)
      return {...d,log:{...d.log,[todayStr]:[...cur]}}
    })
  }
  function addHabit(){
    if(!newName.trim()) return
    setHabitsData(d=>({...d,habits:[...(d.habits||[]),{id:uid(),name:newName.trim(),color:newColor,emoji:newEmoji}]}))
    setNewName(''); setShowNew(false)
  }
  function delHabit(id){
    setHabitsData(d=>({...d,habits:d.habits.filter(h=>h.id!==id)}))
  }
  function getStreak(id){
    let s=0
    for(let i=6;i>=0;i--){
      const d=new Date(); d.setDate(d.getDate()-i)
      const ds=d.toISOString().split('T')[0]
      if((log[ds]||[]).includes(id)) s++; else if(i<6) break
    }
    return s
  }

  const doneToday  = habits.filter(h=>todayDone.has(h.id)).length
  const totalHabits = habits.length
  const pctToday   = totalHabits>0 ? Math.round((doneToday/totalHabits)*100) : 0

  return (
    <div style={{margin:'-28px -28px -40px',background:'var(--bg)',minHeight:'calc(100vh - 68px)'}}>
      {/* Header */}
      <div style={{padding: isMobile ? '20px 16px 16px' : '32px 44px 20px',background:'white',borderBottom:'1px solid var(--border)'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'16px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
            <div style={{width:'40px',height:'40px',borderRadius:'12px',background:'rgba(255,159,10,0.1)',border:'1px solid rgba(255,159,10,0.25)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Repeat2 size={20} color="#FF9F0A" strokeWidth={2}/>
            </div>
            <div>
              <h2 style={{fontSize:'22px',fontWeight:900,color:'var(--text)',letterSpacing:'-0.4px',lineHeight:1}}>Daily Habits</h2>
              <p style={{fontSize:'12.5px',color:'var(--text-muted)',marginTop:'3px'}}>Kebiasaan kecil yang membentuk dirimu</p>
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
            {totalHabits>0 && (
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:'22px',fontWeight:900,color:pctToday===100?'#34C759':'var(--accent)',lineHeight:1}}>{pctToday}%</div>
                <div style={{fontSize:'11px',color:'var(--text-muted)'}}>{doneToday}/{totalHabits} hari ini</div>
              </div>
            )}
            <button onClick={()=>setShowNew(true)} style={{display:'flex',alignItems:'center',gap:'7px',padding:'10px 18px',borderRadius:'980px',background:'rgba(255,159,10,0.12)',color:'#FF9F0A',border:'1.5px solid rgba(255,159,10,0.3)',cursor:'pointer',fontWeight:700,fontSize:'13px',transition:'all 0.15s'}}
              onMouseEnter={e=>{e.currentTarget.style.background='#FF9F0A';e.currentTarget.style.color='white'}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,159,10,0.12)';e.currentTarget.style.color='#FF9F0A'}}>
              <Plus size={14}/> Tambah Habit
            </button>
          </div>
        </div>
        {totalHabits>0 && (
          <div style={{height:'5px',borderRadius:'99px',background:'var(--border)',overflow:'hidden'}}>
            <div style={{height:'100%',width:`${pctToday}%`,background:pctToday===100?'#34C759':'linear-gradient(90deg,#FF9F0A,#0071E3)',borderRadius:'99px',transition:'width 0.6s ease'}}/>
          </div>
        )}
      </div>

      <div style={{padding: isMobile ? '14px 14px 24px' : '24px 44px'}}>
        {/* New habit form */}
        {showNew && (
          <div style={{background:'white',borderRadius:'16px',border:'1.5px solid var(--accent)',boxShadow:'0 4px 20px rgba(0,113,227,0.1)',padding:'20px',marginBottom:'16px'}}>
            <p style={{fontSize:'11px',fontWeight:700,textTransform:'uppercase',letterSpacing:'1px',color:'var(--text-muted)',marginBottom:'12px'}}>Habit Baru</p>
            <div style={{display:'flex',gap:'8px',alignItems:'center',marginBottom:'14px'}}>
              <div style={{width:'40px',height:'40px',borderRadius:'12px',background:`${newColor}15`,border:`2px solid ${newColor}40`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px',flexShrink:0}}>
                {newEmoji}
              </div>
              <input ref={nameRef} value={newName} onChange={e=>setNewName(e.target.value)}
                onKeyDown={e=>{if(e.key==='Enter')addHabit();if(e.key==='Escape'){setShowNew(false);setNewName('')}}}
                placeholder="Nama habit, misal: Minum 8 gelas air..."
                style={{flex:1,border:'1.5px solid var(--border)',borderRadius:'10px',padding:'10px 14px',fontFamily:'inherit',fontSize:'14px',outline:'none',color:'var(--text)',background:'var(--bg)',transition:'border-color 0.15s'}}
                onFocus={e=>e.target.style.borderColor='var(--accent)'}
                onBlur={e=>e.target.style.borderColor='var(--border)'}/>
            </div>
            {/* Emoji picker */}
            <div style={{display:'flex',gap:'6px',flexWrap:'wrap',marginBottom:'10px'}}>
              {HABIT_EMOJIS.map(em=>(
                <button key={em} onClick={()=>setNewEmoji(em)} style={{width:'32px',height:'32px',borderRadius:'8px',background:newEmoji===em?`${newColor}20`:'var(--bg)',border:`1.5px solid ${newEmoji===em?newColor:'var(--border)'}`,cursor:'pointer',fontSize:'16px',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.1s'}}>
                  {em}
                </button>
              ))}
            </div>
            {/* Color picker */}
            <div style={{display:'flex',gap:'7px',marginBottom:'14px'}}>
              {HABIT_PALETTE.map(c=>(
                <button key={c} onClick={()=>setNewColor(c)} style={{width:'24px',height:'24px',borderRadius:'50%',background:c,border:newColor===c?`3px solid ${c}`:'2px solid transparent',outline:newColor===c?`2px solid white`:'none',cursor:'pointer',transition:'all 0.1s',boxShadow:newColor===c?`0 0 0 2px ${c}`:'none'}}/>
              ))}
            </div>
            <div style={{display:'flex',gap:'8px'}}>
              <button onClick={addHabit} style={{flex:1,padding:'9px',borderRadius:'980px',background:'var(--accent)',color:'white',border:'none',cursor:'pointer',fontWeight:700,fontSize:'13.5px'}}>Tambah</button>
              <button onClick={()=>{setShowNew(false);setNewName('')}} style={{padding:'9px 12px',borderRadius:'980px',background:'none',border:'1px solid var(--border)',cursor:'pointer',color:'var(--text-muted)',display:'flex',alignItems:'center'}}><X size={15}/></button>
            </div>
          </div>
        )}

        {habits.length===0 && !showNew ? (
          <div style={{background:'white',borderRadius:'18px',border:'1px solid var(--border)',padding:'60px 40px',textAlign:'center'}}>
            <div style={{width:'52px',height:'52px',borderRadius:'14px',background:'rgba(255,159,10,0.1)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px'}}>
              <Flame size={24} color="#FF9F0A" strokeWidth={1.5}/>
            </div>
            <h3 style={{fontSize:'18px',fontWeight:800,color:'var(--text)',marginBottom:'7px'}}>Belum ada habits</h3>
            <p style={{fontSize:'13.5px',color:'var(--text-muted)',marginBottom:'20px'}}>Tambahkan kebiasaan harian pertamamu.</p>
            <button onClick={()=>setShowNew(true)} style={{display:'inline-flex',alignItems:'center',gap:'8px',padding:'10px 20px',borderRadius:'980px',background:'#FF9F0A',color:'white',border:'none',cursor:'pointer',fontWeight:700,fontSize:'13.5px'}}>
              <Plus size={14}/> Tambah Habit
            </button>
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
            {habits.map(h=>{
              const done    = todayDone.has(h.id)
              const streak  = getStreak(h.id)
              const isHov   = hov===h.id
              return (
                <div key={h.id}
                  onMouseEnter={()=>setHov(h.id)} onMouseLeave={()=>setHov(null)}
                  style={{background:'white',borderRadius:'16px',border:`1px solid ${isHov?h.color+'40':'var(--border)'}`,boxShadow:isHov?`0 4px 20px ${h.color}18`:'var(--shadow)',padding:'16px 20px',display:'flex',alignItems:'center',gap:'16px',transition:'all 0.2s'}}>
                  {/* Checkbox */}
                  <button onClick={()=>toggle(h.id)} style={{width:'42px',height:'42px',borderRadius:'13px',flexShrink:0,border:`2px solid ${done?h.color:isHov?h.color+'70':'var(--border)'}`,background:done?h.color:`${h.color}08`,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.2s',boxShadow:done?`0 2px 10px ${h.color}40`:'none',fontSize:done?undefined:'20px'}}>
                    {done ? <Check size={18} color="white" strokeWidth={2.5}/> : h.emoji}
                  </button>
                  {/* Info */}
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:'14px',fontWeight:700,color:done?'var(--text-muted)':'var(--text)',textDecoration:done?'line-through':'none',marginBottom:'6px'}}>{h.name}</div>
                    {/* 7-day dots */}
                    <div style={{display:'flex',gap:'5px',alignItems:'center'}}>
                      {weekDays.map(day=>{
                        const d=(log[day.str]||[]).includes(h.id)
                        return (
                          <div key={day.str} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'3px'}}>
                            <div style={{width:'18px',height:'18px',borderRadius:'50%',background:d?h.color:'transparent',border:day.isToday?`2px solid ${h.color}`:`1.5px solid ${d?h.color+'60':'var(--border)'}`,display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.2s'}}>
                              {d && <Check size={9} color="white" strokeWidth={3}/>}
                            </div>
                            <span style={{fontSize:'9px',color:day.isToday?h.color:'var(--text-muted)',fontWeight:day.isToday?700:400}}>{day.name}</span>
                          </div>
                        )
                      })}
                      {streak>1 && (
                        <div style={{marginLeft:'6px',display:'flex',alignItems:'center',gap:'3px',background:`${h.color}12`,border:`1px solid ${h.color}25`,borderRadius:'6px',padding:'2px 7px'}}>
                          <Flame size={10} color={h.color} strokeWidth={2}/>
                          <span style={{fontSize:'10px',fontWeight:700,color:h.color}}>{streak}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Color dot */}
                  <div style={{width:'8px',height:'8px',borderRadius:'50%',background:h.color,flexShrink:0}}/>
                  {/* Delete */}
                  <button onClick={()=>delHabit(h.id)} style={{background:'none',border:'none',cursor:'pointer',color:'rgba(255,55,95,0.4)',padding:'4px',borderRadius:'6px',display:'flex',alignItems:'center',opacity:isHov?1:0,transition:'opacity 0.15s,color 0.15s'}}
                    onMouseEnter={e=>e.currentTarget.style.color='#FF375F'}
                    onMouseLeave={e=>e.currentTarget.style.color='rgba(255,55,95,0.4)'}>
                    <Trash2 size={14}/>
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default function LifePlanner() {
  const isMobile = useIsMobile()
  const [data, setData]         = useLocalStorage('life-plan', { plans: DEFAULT_PLANS, daily: {} })
  const [activeTab, setActiveTab] = useState('plan')
  const [editing, setEditing]   = useState(null)
  const [editVal, setEditVal]   = useState('')
  const [showNewCat, setShowNewCat] = useState(false)
  const [newCatName, setNewCatName] = useState('')
  const [expandedRows, setExpanded] = useState({})
  const [hoverItem, setHoverItem]   = useState(null)
  const inputRef = useRef(null)

  useEffect(() => { if (editing) inputRef.current?.focus() }, [editing])

  const plans    = data.plans || []
  const allRows  = plans.flatMap(p => p.rows)
  const todayStr = new Date().toISOString().split('T')[0]
  const todayDone = new Set(data.daily?.[todayStr]?.completed || [])

  const todayDoneCount = allRows.filter(r => todayDone.has(r.id)).length
  const todayPercent   = allRows.length > 0 ? Math.round((todayDoneCount / allRows.length) * 100) : 0
  const progressColor  = todayPercent === 100 ? '#34C759' : '#0071E3'
  const dayLabel       = new Date().toLocaleDateString('id-ID', { weekday:'long', day:'numeric', month:'long', year:'numeric' })
  const motivation     =
    todayPercent === 100 ? 'Luar biasa! Semua rencana hari ini selesai.' :
    todayPercent >= 50   ? 'Hampir sampai! Terus semangat.' :
    todayDoneCount > 0   ? 'Bagus! Jaga momentum-mu.' :
    'Mulai hari yang produktif — centang aksimu!'

  const weekDots = Array.from({ length:7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i))
    const dStr = d.toISOString().split('T')[0]
    const done = (data.daily?.[dStr]?.completed || []).length
    return { dStr, isToday: i===6, percent: allRows.length > 0 ? done / allRows.length : 0, dayName: d.toLocaleDateString('id-ID',{ weekday:'short' }).slice(0,2) }
  })

  const streak = (() => {
    let s = 0
    for (let i = weekDots.length - 1; i >= 0; i--) { if (weekDots[i].percent > 0) s++; else break }
    return s
  })()

  function toggleToday(rowId) {
    setData(d => {
      const cur = new Set(d.daily?.[todayStr]?.completed || [])
      cur.has(rowId) ? cur.delete(rowId) : cur.add(rowId)
      return { ...d, daily: { ...d.daily, [todayStr]: { completed: [...cur] } } }
    })
  }

  function startEdit(planId, rowId, field, val) { setEditing({ planId, rowId, field }); setEditVal(val || '') }

  function commitEdit() {
    if (!editing) return
    const { planId, rowId, field } = editing
    setData(d => ({
      ...d,
      plans: d.plans.map(p => {
        if (p.id !== planId) return p
        if (rowId === null) return { ...p, target: editVal.trim() || p.target }
        return { ...p, rows: p.rows.map(r => r.id === rowId ? { ...r, [field]: editVal } : r) }
      })
    }))
    setEditing(null)
  }

  function addRow(planId) {
    const nr = { id: uid(), indicator:'', strategy:'', actionPlan:'' }
    setData(d => ({ ...d, plans: d.plans.map(p => p.id === planId ? { ...p, rows: [...p.rows, nr] } : p) }))
    setTimeout(() => startEdit(planId, nr.id, 'actionPlan', ''), 40)
  }

  function deleteRow(planId, rowId) {
    setData(d => ({
      ...d,
      plans: d.plans
        .map(p => p.id !== planId ? p : { ...p, rows: p.rows.filter(r => r.id !== rowId) })
        .filter(p => p.rows.length > 0)
    }))
  }

  function deletePlan(planId) { setData(d => ({ ...d, plans: d.plans.filter(p => p.id !== planId) })) }

  function addCategory() {
    if (!newCatName.trim()) return
    const color = PALETTE[plans.length % PALETTE.length]
    const nr    = { id: uid(), indicator:'', strategy:'', actionPlan:'' }
    const np    = { id: uid(), target: newCatName.trim(), color, rows: [nr] }
    setData(d => ({ ...d, plans: [...(d.plans || []), np] }))
    setShowNewCat(false); setNewCatName('')
    setTimeout(() => startEdit(np.id, nr.id, 'actionPlan', ''), 60)
  }

  function ec(planId, rowId, field, value, placeholder, xStyle = {}) {
    const isEd = editing?.planId === planId && editing?.rowId === rowId && editing?.field === field
    if (isEd) return (
      <input ref={inputRef} value={editVal} onChange={e => setEditVal(e.target.value)}
        onBlur={commitEdit}
        onKeyDown={e => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') setEditing(null) }}
        style={{ border:'none', outline:'none', background:'rgba(0,113,227,0.07)', padding:'1px 5px', borderRadius:'4px', fontFamily:"'Inter',sans-serif", color:'var(--text)', width:'100%', ...xStyle }}
      />
    )
    return (
      <span onClick={() => startEdit(planId, rowId, field, value)}
        style={{ cursor:'text', color: value ? 'inherit' : 'var(--text-muted)', ...xStyle }}>
        {value || placeholder}
      </span>
    )
  }

  const totalActs  = allRows.length
  const filledActs = allRows.filter(r => r.actionPlan?.trim()).length
  const completion = totalActs > 0 ? Math.round((filledActs / totalActs) * 100) : 0

  if(activeTab==='habits') return <HabitsTab/>

  return (
    <div style={{ margin: isMobile ? '-14px -14px -40px' : '-28px -28px -40px', background:'var(--bg)', minHeight:'calc(100vh - 68px)', fontFamily:"'Inter',sans-serif" }}>

      {/* ══ HEADER ══ */}
      <div style={{ padding: isMobile ? '20px 16px 16px' : '36px 44px 24px', background:'white', borderBottom:'1px solid var(--border)' }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap: isMobile ? 'wrap' : 'nowrap', gap: isMobile ? '12px' : '0' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'6px' }}>
              <div style={{ width:'40px', height:'40px', borderRadius:'12px', background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 2px 8px rgba(0,113,227,0.3)' }}>
                <TrendingUp size={20} color="white" strokeWidth={2}/>
              </div>
              <h1 style={{ fontSize: isMobile ? '22px' : '32px', fontWeight:900, color:'var(--text)', letterSpacing:'-0.6px', lineHeight:1 }}>Future Plan</h1>
            </div>
            <p style={{ fontSize:'13px', color:'var(--text-muted)', marginLeft: isMobile ? '0' : '52px' }}>Tujuan hidup, strategi, dan aksi konkret — semuanya di satu tempat.</p>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'8px', flexShrink:0 }}>
            {/* Tab switcher */}
            <div style={{ display:'flex', background:'var(--bg)', borderRadius:'10px', padding:'3px', border:'1px solid var(--border)', gap:'2px' }}>
              {[['plan','Future Plan',<LayoutList size={12}/>],['habits','Habits',<Repeat2 size={12}/>]].map(([id,label,icon])=>(
                <button key={id} onClick={()=>setActiveTab(id)} style={{ display:'flex', alignItems:'center', gap:'5px', padding:'6px 14px', borderRadius:'8px', border:'none', cursor:'pointer', fontSize:'12.5px', fontWeight:600, background:activeTab===id?'white':'transparent', color:activeTab===id?'var(--text)':'var(--text-muted)', boxShadow:activeTab===id?'0 1px 4px rgba(0,0,0,0.08)':'none', transition:'all 0.15s' }}>
                  {icon} {label}
                </button>
              ))}
            </div>
            <button onClick={()=>setShowNewCat(true)} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px 18px', borderRadius:'980px', background:'var(--accent)', color:'white', border:'none', cursor:'pointer', fontWeight:700, fontSize:'13.5px', boxShadow:'0 2px 10px rgba(0,113,227,0.25)', transition:'all 0.2s' }}
              onMouseEnter={e=>e.currentTarget.style.background='var(--accent-dark)'} onMouseLeave={e=>e.currentTarget.style.background='var(--accent)'}>
              <Plus size={15}/> Add Category
            </button>
          </div>
        </div>
        <div style={{ display:'flex', gap:'20px', marginTop:'16px', marginLeft: isMobile ? '0' : '52px', alignItems:'center', flexWrap:'wrap' }}>
          {[
            { Icon:Flag,       val:plans.length, label:'Life Areas',   color:'#0071E3' },
            { Icon:ListChecks, val:totalActs,    label:'Action Plans', color:'#34C759' },
            { Icon:Sparkles,   val:`${completion}%`, label:'Defined',  color:'#7060A8' },
          ].map(({ Icon, val, label, color })=>(
            <div key={label} style={{ display:'flex', alignItems:'center', gap:'9px' }}>
              <div style={{ width:'32px', height:'32px', borderRadius:'9px', background:`${color}12`, border:`1px solid ${color}20`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Icon size={14} color={color} strokeWidth={2}/>
              </div>
              <div>
                <div style={{ fontSize:'18px', fontWeight:900, color:'var(--text)', lineHeight:1 }}>{val}</div>
                <div style={{ fontSize:'11px', color:'var(--text-muted)', marginTop:'1px' }}>{label}</div>
              </div>
            </div>
          ))}
          <div style={{ marginLeft: isMobile ? '0' : 'auto', width: isMobile ? '100%' : 'auto', display:'flex', flexDirection:'column', minWidth:'160px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'5px' }}>
              <span style={{ fontSize:'11px', fontWeight:600, color:'var(--text-muted)' }}>Plan completion</span>
              <span style={{ fontSize:'11px', fontWeight:700, color:'var(--text)' }}>{completion}%</span>
            </div>
            <div style={{ height:'5px', borderRadius:'99px', background:'var(--border)', overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${completion}%`, borderRadius:'99px', background:'linear-gradient(90deg,#34C759,#0071E3)', transition:'width 0.5s' }}/>
            </div>
          </div>
        </div>
      </div>

      {/* ══ DAILY PROGRESS PANEL ══ */}
      <div style={{ margin: isMobile ? '16px 16px 0' : '20px 44px 0', background:'white', borderRadius:'18px', border:'1px solid var(--border)', boxShadow:'var(--shadow)', overflow:'hidden' }}>
        <div style={{ padding:'16px 24px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:'8px' }}>
          <CalendarCheck size={15} color={progressColor} strokeWidth={2}/>
          <span style={{ fontWeight:700, fontSize:'13px', color:'var(--text)' }}>Progress Harian</span>
          <span style={{ fontSize:'12px', color:'var(--text-muted)', marginLeft:'4px' }}>{dayLabel}</span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns: isMobile ? 'auto 1fr' : 'auto 1fr auto', alignItems:'stretch' }}>
          {/* Ring */}
          <div style={{ padding: isMobile ? '16px 16px' : '24px 28px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'8px', borderRight:'1px solid var(--border)' }}>
            <Ring percent={todayPercent} size={isMobile ? 72 : 96} color={progressColor} strokeW={isMobile ? 6 : 8}/>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:'12.5px', fontWeight:700, color:progressColor }}>{todayDoneCount}/{allRows.length}</div>
              <div style={{ fontSize:'11px', color:'var(--text-muted)' }}>selesai hari ini</div>
            </div>
          </div>
          {/* Bars */}
          <div style={{ padding:'20px 24px', display:'flex', flexDirection:'column', gap:'0' }}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:'10px', marginBottom:'16px' }}>
              <div style={{ width:'30px', height:'30px', borderRadius:'8px', background:`${progressColor}12`, border:`1px solid ${progressColor}20`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                {todayPercent === 100 ? <Zap size={14} color={progressColor}/> : <Sun size={14} color={progressColor}/>}
              </div>
              <div>
                <div style={{ fontSize:'13px', fontWeight:700, color:'var(--text)', marginBottom:'2px' }}>{motivation}</div>
                <div style={{ fontSize:'12px', color:'var(--text-muted)' }}>
                  {todayPercent === 100 ? 'Kamu konsisten hari ini!' : `${allRows.length - todayDoneCount} aksi lagi untuk diselesaikan`}
                </div>
              </div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'9px' }}>
              {plans.map(plan => {
                const done = plan.rows.filter(r => todayDone.has(r.id)).length
                const pct  = plan.rows.length > 0 ? (done / plan.rows.length) * 100 : 0
                return (
                  <div key={plan.id} style={{ display:'flex', alignItems:'center', gap:'11px' }}>
                    <div style={{ width:'3px', height:'13px', borderRadius:'2px', background:plan.color, flexShrink:0 }}/>
                    <span style={{ fontSize:'12px', fontWeight:600, color:'var(--text)', width:'110px', flexShrink:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{plan.target}</span>
                    <div style={{ flex:1, height:'5px', borderRadius:'99px', background:'var(--border)', overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${pct}%`, background:plan.color, borderRadius:'99px', transition:'width 0.4s' }}/>
                    </div>
                    <span style={{ fontSize:'11px', fontWeight:700, color: done===plan.rows.length ? plan.color : 'var(--text-muted)', width:'28px', textAlign:'right', flexShrink:0 }}>{done}/{plan.rows.length}</span>
                  </div>
                )
              })}
            </div>
          </div>
          {/* 7-day dots */}
          <div style={{ padding: isMobile ? '14px 16px' : '20px 24px', borderLeft: isMobile ? 'none' : '1px solid var(--border)', borderTop:'1px solid var(--border)', gridColumn: isMobile ? '1 / -1' : 'auto', display:'flex', flexDirection: isMobile ? 'row' : 'column', alignItems:'center', justifyContent: isMobile ? 'space-between' : 'center', gap:'10px' }}>
            <span style={{ fontSize:'10px', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', color:'var(--text-muted)' }}>7 Hari Terakhir</span>
            <div style={{ display:'flex', gap:'7px' }}>
              {weekDots.map(dot=><DayDot key={dot.dStr} {...dot} color={progressColor}/>)}
            </div>
            {streak > 1 && (
              <div style={{ display:'flex', alignItems:'center', gap:'5px', background:`${progressColor}10`, border:`1px solid ${progressColor}20`, borderRadius:'8px', padding:'4px 10px' }}>
                <Zap size={11} color={progressColor} strokeWidth={2}/>
                <span style={{ fontSize:'11px', fontWeight:700, color:progressColor }}>{streak} hari streak!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══ CARDS GRID ══ */}
      <div style={{ padding: isMobile ? '16px 16px 24px' : '20px 44px 44px' }}>
        {plans.length === 0 ? (
          <div style={{ textAlign:'center', paddingTop:'60px', paddingBottom:'60px', background:'white', borderRadius:'18px', border:'1px solid var(--border)' }}>
            <div style={{ width:'52px', height:'52px', borderRadius:'14px', background:'var(--bg)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
              <TrendingUp size={24} color="var(--text-muted)" strokeWidth={1.5}/>
            </div>
            <h3 style={{ fontSize:'18px', fontWeight:800, color:'var(--text)', marginBottom:'7px' }}>Belum ada rencana</h3>
            <p style={{ fontSize:'13.5px', color:'var(--text-muted)', marginBottom:'20px' }}>Tambahkan kategori hidupmu yang pertama.</p>
            <button onClick={()=>setShowNewCat(true)} style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'10px 20px', borderRadius:'980px', background:'var(--accent)', color:'white', border:'none', cursor:'pointer', fontWeight:700, fontSize:'13.5px' }}>
              <Plus size={14}/> Tambah Kategori
            </button>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(360px, 1fr))', gap: isMobile ? '14px' : '20px', alignItems:'start' }}>
            {plans.map(plan => {
              const done       = plan.rows.filter(r => todayDone.has(r.id)).length
              const planPct    = plan.rows.length > 0 ? Math.round((done / plan.rows.length) * 100) : 0
              const allDone    = done === plan.rows.length && plan.rows.length > 0

              return (
                <div key={plan.id}
                  style={{ background:'white', borderRadius:'20px', border:'1px solid var(--border)', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', overflow:'hidden', transition:'box-shadow 0.25s, transform 0.25s' }}
                  onMouseEnter={e=>{ e.currentTarget.style.boxShadow=`0 8px 32px ${plan.color}22`; e.currentTarget.style.transform='translateY(-2px)' }}
                  onMouseLeave={e=>{ e.currentTarget.style.boxShadow='0 2px 12px rgba(0,0,0,0.06)'; e.currentTarget.style.transform='translateY(0)' }}>

                  {/* Top accent bar */}
                  <div style={{ height:'4px', background:`linear-gradient(90deg, ${plan.color}, ${plan.color}88)` }}/>

                  {/* Card header */}
                  <div style={{ padding:'20px 20px 16px', background:`linear-gradient(135deg, ${plan.color}0d 0%, ${plan.color}04 100%)`, position:'relative', overflow:'hidden' }}>
                    {/* Decorative circle */}
                    <div style={{ position:'absolute', right:'-28px', top:'-28px', width:'110px', height:'110px', borderRadius:'50%', background:`${plan.color}08`, pointerEvents:'none' }}/>
                    <div style={{ position:'absolute', right:'30px', bottom:'-40px', width:'70px', height:'70px', borderRadius:'50%', background:`${plan.color}05`, pointerEvents:'none' }}/>

                    <div style={{ display:'flex', alignItems:'flex-start', gap:'14px', marginBottom:'14px', position:'relative' }}>
                      {/* Ring */}
                      <div style={{ position:'relative', width:'54px', height:'54px', flexShrink:0 }}>
                        <svg width="54" height="54" style={{ transform:'rotate(-90deg)', display:'block' }}>
                          <circle cx="27" cy="27" r="21" fill="none" stroke={`${plan.color}20`} strokeWidth="5"/>
                          <circle cx="27" cy="27" r="21" fill="none" stroke={plan.color} strokeWidth="5" strokeLinecap="round"
                            strokeDasharray={`${(planPct/100)*2*Math.PI*21} ${2*Math.PI*21}`} style={{ transition:'stroke-dasharray 0.4s' }}/>
                        </svg>
                        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                          {allDone
                            ? <Check size={18} color={plan.color} strokeWidth={2.5}/>
                            : <span style={{ fontSize:'11px', fontWeight:900, color:plan.color }}>{planPct}%</span>
                          }
                        </div>
                      </div>

                      <div style={{ flex:1, minWidth:0 }}>
                        {/* Category badge */}
                        <div style={{ display:'inline-flex', alignItems:'center', gap:'5px', background:`${plan.color}18`, border:`1px solid ${plan.color}35`, borderRadius:'20px', padding:'2px 10px 2px 7px', marginBottom:'6px' }}>
                          <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:plan.color, flexShrink:0 }}/>
                          <span style={{ fontSize:'10px', fontWeight:700, color:plan.color, textTransform:'uppercase', letterSpacing:'0.6px' }}>Life Area</span>
                        </div>
                        <div style={{ fontSize:'16px', fontWeight:800, color:'var(--text)', lineHeight:1.25 }}>
                          {ec(plan.id, null, 'target', plan.target, 'Category name', { fontSize:'16px', fontWeight:800 })}
                        </div>
                      </div>

                      <button onClick={()=>deletePlan(plan.id)} style={{ background:'none', border:'none', cursor:'pointer', opacity:0.2, color:'var(--rose)', padding:'4px', borderRadius:'6px', transition:'opacity 0.15s', display:'flex', alignItems:'center', flexShrink:0 }}
                        onMouseEnter={e=>e.currentTarget.style.opacity='1'} onMouseLeave={e=>e.currentTarget.style.opacity='0.2'}>
                        <Trash2 size={14}/>
                      </button>
                    </div>

                    {/* Progress bar + count */}
                    <div style={{ position:'relative' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'6px' }}>
                        <span style={{ fontSize:'11.5px', color: allDone ? plan.color : 'var(--text-muted)', fontWeight:600 }}>
                          {allDone ? '✓ Semua selesai hari ini!' : `${done} / ${plan.rows.length} selesai hari ini`}
                        </span>
                        <span style={{ fontSize:'11px', fontWeight:800, color:plan.color }}>{planPct}%</span>
                      </div>
                      <div style={{ height:'5px', borderRadius:'99px', background:`${plan.color}18`, overflow:'hidden' }}>
                        <div style={{ height:'100%', width:`${planPct}%`, background:`linear-gradient(90deg, ${plan.color}, ${plan.color}cc)`, borderRadius:'99px', transition:'width 0.5s ease' }}/>
                      </div>
                    </div>
                  </div>

                  {/* Action items */}
                  <div>
                    {plan.rows.map((row, rIdx) => {
                      const isDone     = todayDone.has(row.id)
                      const isExpanded = expandedRows[row.id]
                      const isHov      = hoverItem === row.id
                      return (
                        <div key={row.id}
                          onMouseEnter={()=>setHoverItem(row.id)} onMouseLeave={()=>setHoverItem(null)}
                          style={{ borderBottom: rIdx < plan.rows.length - 1 ? `1px solid ${plan.color}12` : 'none', background: isDone ? `${plan.color}06` : isHov ? `${plan.color}04` : 'white', transition:'background 0.15s' }}>

                          <div style={{ padding:'13px 16px 13px 18px', display:'flex', alignItems:'flex-start', gap:'12px' }}>
                            {/* Rounded square checkbox */}
                            <button onClick={()=>toggleToday(row.id)} style={{
                              width:'22px', height:'22px', borderRadius:'7px', flexShrink:0, marginTop:'1px',
                              border: `2px solid ${isDone ? plan.color : isHov ? plan.color+'70' : 'var(--border)'}`,
                              background: isDone ? plan.color : 'transparent',
                              cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                              transition:'all 0.2s', boxShadow: isDone ? `0 2px 8px ${plan.color}40` : 'none',
                            }}>
                              {isDone && <Check size={11} color="white" strokeWidth={3}/>}
                            </button>

                            <div style={{ flex:1, minWidth:0 }}>
                              <div style={{ fontSize:'13.5px', fontWeight: isDone ? 400 : 600, color: isDone ? 'var(--text-muted)' : 'var(--text)', textDecoration: isDone ? 'line-through' : 'none', lineHeight:'1.45', marginBottom:(row.indicator || row.strategy || isExpanded) ? '8px' : 0 }}>
                                {ec(plan.id, row.id, 'actionPlan', row.actionPlan, 'Add action plan...')}
                              </div>

                              {(row.indicator || row.strategy || isExpanded) && (
                                <div style={{ display:'flex', flexDirection:'column', gap:'5px' }}>
                                  {(row.indicator || isExpanded) && (
                                    <div style={{ display:'inline-flex', alignItems:'center', gap:'5px', background:`${plan.color}10`, border:`1px solid ${plan.color}20`, borderRadius:'6px', padding:'3px 9px', alignSelf:'flex-start', maxWidth:'100%' }}>
                                      <div style={{ width:'5px', height:'5px', borderRadius:'50%', background:plan.color, flexShrink:0 }}/>
                                      <span style={{ fontSize:'11.5px', color:plan.color, fontWeight:500, lineHeight:'1.4' }}>
                                        {ec(plan.id, row.id, 'indicator', row.indicator, 'Add indicator...', { fontSize:'11.5px', color:plan.color })}
                                      </span>
                                    </div>
                                  )}
                                  {(row.strategy || isExpanded) && (
                                    <div style={{ display:'inline-flex', alignItems:'center', gap:'5px', background:'rgba(0,0,0,0.03)', border:'1px solid rgba(0,0,0,0.07)', borderRadius:'6px', padding:'3px 9px', alignSelf:'flex-start', maxWidth:'100%' }}>
                                      <TrendingUp size={9} color="var(--text-muted)" strokeWidth={2.5} style={{ flexShrink:0 }}/>
                                      <span style={{ fontSize:'11.5px', color:'var(--text-muted)', fontWeight:500, lineHeight:'1.4' }}>
                                        {ec(plan.id, row.id, 'strategy', row.strategy, 'Add strategy...', { fontSize:'11.5px', color:'var(--text-muted)' })}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            <div style={{ display:'flex', gap:'2px', flexShrink:0, opacity: isHov ? 1 : 0, transition:'opacity 0.15s' }}>
                              <button onClick={()=>setExpanded(p=>({ ...p, [row.id]: !p[row.id] }))} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', padding:'3px', borderRadius:'5px', display:'flex', alignItems:'center', transition:'color 0.15s' }}
                                onMouseEnter={e=>e.currentTarget.style.color='var(--text)'} onMouseLeave={e=>e.currentTarget.style.color='var(--text-muted)'}>
                                {isExpanded ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                              </button>
                              <button onClick={()=>deleteRow(plan.id, row.id)} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,55,95,0.4)', padding:'3px', borderRadius:'5px', display:'flex', alignItems:'center', transition:'color 0.15s' }}
                                onMouseEnter={e=>e.currentTarget.style.color='var(--rose)'} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,55,95,0.4)'}>
                                <Trash2 size={13}/>
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Card footer */}
                  <div style={{ padding:'10px 18px 12px', borderTop:`1px solid ${plan.color}12` }}>
                    <button onClick={()=>addRow(plan.id)} style={{
                      display:'flex', alignItems:'center', gap:'6px',
                      background:'none', border:'none', cursor:'pointer',
                      color:'var(--text-muted)', fontSize:'12.5px', fontWeight:600,
                      padding:'4px 0', transition:'color 0.15s',
                    }}
                    onMouseEnter={e=>e.currentTarget.style.color=plan.color}
                    onMouseLeave={e=>e.currentTarget.style.color='var(--text-muted)'}>
                      <Plus size={13}/> Add action plan
                    </button>
                  </div>
                </div>
              )
            })}

            {/* New category card */}
            {showNewCat ? (
              <div style={{ background:'white', borderRadius:'16px', border:`1.5px solid var(--accent)`, boxShadow:'0 4px 20px rgba(0,113,227,0.1)', padding:'20px' }}>
                <p style={{ fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', color:'var(--text-muted)', marginBottom:'10px' }}>New Category</p>
                <input value={newCatName} onChange={e=>setNewCatName(e.target.value)}
                  onKeyDown={e=>{ if(e.key==='Enter') addCategory(); if(e.key==='Escape'){ setShowNewCat(false); setNewCatName('') } }}
                  placeholder="e.g. Study Abroad, Entrepreneurship..."
                  autoFocus
                  style={{ width:'100%', border:'1.5px solid var(--border)', borderRadius:'10px', padding:'10px 14px', fontFamily:"'Inter',sans-serif", fontSize:'14px', outline:'none', color:'var(--text)', marginBottom:'12px', boxSizing:'border-box', background:'var(--bg)' }}
                />
                <div style={{ display:'flex', gap:'8px' }}>
                  <button onClick={addCategory} style={{ flex:1, padding:'9px', borderRadius:'980px', background:'var(--accent)', color:'white', border:'none', cursor:'pointer', fontWeight:700, fontSize:'13.5px' }}>Add</button>
                  <button onClick={()=>{ setShowNewCat(false); setNewCatName('') }} style={{ padding:'9px 12px', borderRadius:'980px', background:'none', border:'1px solid var(--border)', cursor:'pointer', color:'var(--text-muted)', display:'flex', alignItems:'center' }}><X size={15}/></button>
                </div>
              </div>
            ) : (
              <button onClick={()=>setShowNewCat(true)} style={{
                display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'10px',
                background:'transparent', border:'1.5px dashed var(--border)', borderRadius:'16px',
                cursor:'pointer', color:'var(--text-muted)', fontSize:'13px', fontWeight:600,
                padding:'36px 20px', transition:'all 0.2s', minHeight:'120px',
              }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor='var(--accent)'; e.currentTarget.style.color='var(--accent)'; e.currentTarget.style.background='rgba(0,113,227,0.03)' }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text-muted)'; e.currentTarget.style.background='transparent' }}>
                <div style={{ width:'36px', height:'36px', borderRadius:'10px', border:'1.5px dashed currentColor', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Plus size={18}/>
                </div>
                Add new category
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
