import { useState, useEffect, useRef } from 'react'
import { Timer, X, Play, Pause, RotateCcw, Coffee, Brain, SkipForward, Zap } from 'lucide-react'

const MODES = {
  work:  { label:'Fokus',            duration:25*60, color:'#0071E3', bg:'rgba(0,113,227,0.1)'  },
  break: { label:'Istirahat',        duration:5*60,  color:'#34C759', bg:'rgba(52,199,89,0.1)'  },
  long:  { label:'Istirahat Panjang',duration:15*60, color:'#FF9F0A', bg:'rgba(255,159,10,0.1)' },
}

function pad(n){ return String(n).padStart(2,'0') }

export default function PomodoroTimer() {
  const [open, setOpen]         = useState(false)
  const [mode, setMode]         = useState('work')
  const [timeLeft, setTime]     = useState(MODES.work.duration)
  const [running, setRunning]   = useState(false)
  const [sessions, setSessions] = useState(0)
  const intervalRef = useRef(null)
  const modeRef     = useRef(mode)
  const sessionsRef = useRef(sessions)

  modeRef.current    = mode
  sessionsRef.current = sessions

  useEffect(()=>{
    if(running){
      intervalRef.current = setInterval(()=>{
        setTime(t=>{
          if(t<=1){
            clearInterval(intervalRef.current)
            setRunning(false)
            const cur = modeRef.current
            if(cur==='work'){
              const newSessions = sessionsRef.current + 1
              setSessions(newSessions)
              const next = newSessions % 4 === 0 ? 'long' : 'break'
              setMode(next)
              return MODES[next].duration
            } else {
              setMode('work')
              return MODES.work.duration
            }
          }
          return t-1
        })
      },1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return ()=>clearInterval(intervalRef.current)
  },[running])

  function switchMode(m){
    setRunning(false)
    setMode(m)
    setTime(MODES[m].duration)
  }
  function reset(){
    setRunning(false)
    setTime(MODES[mode].duration)
  }

  const m     = MODES[mode]
  const pct   = ((m.duration - timeLeft) / m.duration) * 100
  const mins  = Math.floor(timeLeft/60)
  const secs  = timeLeft % 60
  const SIZE  = 160
  const R     = 60
  const CIRC  = 2*Math.PI*R
  const dash  = (pct/100)*CIRC

  return (
    <>
      {/* Trigger button */}
      <button onClick={()=>setOpen(o=>!o)} title="Pomodoro Timer" style={{
        width:'36px',height:'36px',borderRadius:'10px',
        background:running?`${m.color}18`:'var(--bg)',
        border:running?`1.5px solid ${m.color}40`:'1px solid var(--border)',
        cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',
        color:running?m.color:'var(--text-muted)',transition:'all 0.2s',
        position:'relative',
      }}>
        <Timer size={16}/>
        {running && (
          <div style={{position:'absolute',top:'7px',right:'7px',width:'5px',height:'5px',borderRadius:'50%',background:m.color,animation:'pomodoro-pulse 1.2s ease-in-out infinite'}}/>
        )}
      </button>

      {/* Floating panel */}
      {open && (
        <div style={{
          position:'fixed',bottom:'80px',right:'20px',zIndex:500,
          background:'white',borderRadius:'22px',
          boxShadow:'0 16px 48px rgba(0,0,0,0.18),0 4px 16px rgba(0,0,0,0.08)',
          border:'1px solid var(--border)',width:'280px',overflow:'hidden',
        }}>
          {/* Header */}
          <div style={{padding:'16px 18px 12px',display:'flex',alignItems:'center',justifyContent:'space-between',background:`linear-gradient(135deg,${m.bg},transparent)`,borderBottom:'1px solid var(--border-light)'}}>
            <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
              <div style={{width:'28px',height:'28px',borderRadius:'8px',background:m.bg,border:`1px solid ${m.color}30`,display:'flex',alignItems:'center',justifyContent:'center'}}>
                {mode==='work'?<Brain size={13} color={m.color}/>:<Coffee size={13} color={m.color}/>}
              </div>
              <span style={{fontSize:'13px',fontWeight:700,color:'var(--text)'}}>Pomodoro Timer</span>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:'4px'}}>
              {sessions>0 && (
                <div style={{display:'flex',alignItems:'center',gap:'4px',background:'rgba(0,113,227,0.08)',borderRadius:'7px',padding:'3px 8px',marginRight:'4px'}}>
                  <Zap size={10} color="var(--accent)"/>
                  <span style={{fontSize:'11px',fontWeight:700,color:'var(--accent)'}}>{sessions}</span>
                </div>
              )}
              <button onClick={()=>setOpen(false)} style={{width:'26px',height:'26px',borderRadius:'7px',background:'var(--bg)',border:'1px solid var(--border)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--text-muted)'}}>
                <X size={13}/>
              </button>
            </div>
          </div>

          {/* Mode tabs */}
          <div style={{display:'flex',gap:'4px',padding:'10px 14px 8px'}}>
            {Object.entries(MODES).map(([k,v])=>(
              <button key={k} onClick={()=>switchMode(k)} style={{flex:1,padding:'5px 4px',borderRadius:'8px',border:'none',cursor:'pointer',fontSize:'10.5px',fontWeight:700,background:mode===k?v.color:'var(--bg)',color:mode===k?'white':'var(--text-muted)',transition:'all 0.15s'}}>
                {k==='work'?'Fokus':k==='break'?'Break':'Long'}
              </button>
            ))}
          </div>

          {/* Ring timer */}
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'4px 0 20px'}}>
            <div style={{position:'relative',width:SIZE,height:SIZE}}>
              <svg width={SIZE} height={SIZE} style={{transform:'rotate(-90deg)',display:'block'}}>
                <circle cx={SIZE/2} cy={SIZE/2} r={R} fill="none" stroke={`${m.color}18`} strokeWidth="8"/>
                <circle cx={SIZE/2} cy={SIZE/2} r={R} fill="none" stroke={m.color} strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${dash} ${CIRC}`}
                  style={{transition:'stroke-dasharray 0.5s ease,stroke 0.3s'}}/>
              </svg>
              <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                <div style={{fontSize:'36px',fontWeight:900,color:'var(--text)',letterSpacing:'-1px',lineHeight:1}}>
                  {pad(mins)}:{pad(secs)}
                </div>
                <div style={{fontSize:'11px',fontWeight:600,color:m.color,marginTop:'5px',textTransform:'uppercase',letterSpacing:'0.8px'}}>
                  {m.label}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div style={{display:'flex',gap:'10px',marginTop:'12px',alignItems:'center'}}>
              <button onClick={reset} title="Reset" style={{width:'36px',height:'36px',borderRadius:'10px',background:'var(--bg)',border:'1px solid var(--border)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--text-muted)',transition:'border-color 0.15s'}}
                onMouseEnter={e=>e.currentTarget.style.borderColor=m.color}
                onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
                <RotateCcw size={14}/>
              </button>
              <button onClick={()=>setRunning(r=>!r)} style={{width:'56px',height:'56px',borderRadius:'18px',background:m.color,border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'white',boxShadow:`0 4px 16px ${m.color}50`,transition:'transform 0.15s'}}
                onMouseEnter={e=>e.currentTarget.style.transform='scale(1.06)'}
                onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}>
                {running?<Pause size={22} fill="white"/>:<Play size={22} fill="white"/>}
              </button>
              <button onClick={()=>switchMode(mode==='work'?'break':'work')} title="Skip" style={{width:'36px',height:'36px',borderRadius:'10px',background:'var(--bg)',border:'1px solid var(--border)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--text-muted)',transition:'border-color 0.15s'}}
                onMouseEnter={e=>e.currentTarget.style.borderColor=m.color}
                onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
                <SkipForward size={14}/>
              </button>
            </div>

            {sessions>0 && (
              <div style={{marginTop:'12px',display:'flex',gap:'5px',alignItems:'center'}}>
                {Array.from({length:Math.min(8,sessions)}).map((_,i)=>(
                  <div key={i} style={{width:'8px',height:'8px',borderRadius:'50%',background:(i+1)%4===0?'#FF9F0A':'var(--accent)',opacity:0.7}}/>
                ))}
                {sessions>8 && <span style={{fontSize:'10px',color:'var(--text-muted)',fontWeight:600}}>+{sessions-8}</span>}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
