import { useState, useMemo } from 'react'
import {
  Plus, X, TrendingDown, Wallet, ChevronLeft, ChevronRight,
  Trash2, Save, ArrowUpRight, ArrowDownRight, PiggyBank
} from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useIsMobile } from '../hooks/useIsMobile'

const uid = () => `_${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`

const EXPENSE_CATS = [
  { name:'Makanan',      color:'#FF9F0A', emoji:'🍜' },
  { name:'Transportasi', color:'#0071E3', emoji:'🚗' },
  { name:'Hiburan',      color:'#7060A8', emoji:'🎮' },
  { name:'Kesehatan',    color:'#34C759', emoji:'💊' },
  { name:'Belanja',      color:'#FF375F', emoji:'🛍️' },
  { name:'Tagihan',      color:'#5856D6', emoji:'📱' },
  { name:'Pendidikan',   color:'#30B0C7', emoji:'📚' },
  { name:'Lainnya',      color:'#8E8E93', emoji:'📦' },
]
const INCOME_CATS = [
  { name:'Gaji',      color:'#34C759', emoji:'💼' },
  { name:'Freelance', color:'#0071E3', emoji:'💻' },
  { name:'Investasi', color:'#FF9F0A', emoji:'📈' },
  { name:'Transfer',  color:'#30B0C7', emoji:'💸' },
  { name:'Bonus',     color:'#BF5AF2', emoji:'🎁' },
  { name:'Lainnya',   color:'#8E8E93', emoji:'💰' },
]
const MONTH_ID = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
const fmt = n => new Intl.NumberFormat('id-ID').format(n)
const getCat = (type, name) => (type==='expense'?EXPENSE_CATS:INCOME_CATS).find(c=>c.name===name) || { color:'#8E8E93', emoji:'💰' }

const EMPTY = { type:'expense', amount:'', category:'Makanan', note:'', date:new Date().toISOString().split('T')[0] }

export default function Finance() {
  const [data, setData]         = useLocalStorage('finance-v1', { transactions:[] })
  const [modal, setModal]       = useState(false)
  const [draft, setDraft]       = useState(EMPTY)
  const [filter, setFilter]     = useState('all')
  const [monthOffset, setMonthOffset] = useState(0)

  const now = new Date()
  const viewDate  = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1)
  const viewYear  = viewDate.getFullYear()
  const viewMonth = viewDate.getMonth()
  const monthLabel = `${MONTH_ID[viewMonth]} ${viewYear}`

  const txs = data.transactions || []

  const monthTxs = useMemo(()=>txs.filter(t=>{
    const d=new Date(t.date); return d.getFullYear()===viewYear && d.getMonth()===viewMonth
  }),[txs,viewYear,viewMonth])

  const totalIncome  = monthTxs.filter(t=>t.type==='income').reduce((s,t)=>s+Number(t.amount),0)
  const totalExpense = monthTxs.filter(t=>t.type==='expense').reduce((s,t)=>s+Number(t.amount),0)
  const balance      = totalIncome - totalExpense
  const savingsRate  = totalIncome>0 ? Math.round((balance/totalIncome)*100) : 0

  const shown = useMemo(()=>{
    let r=[...monthTxs].sort((a,b)=>new Date(b.date)-new Date(a.date))
    if(filter!=='all') r=r.filter(t=>t.type===filter)
    return r
  },[monthTxs,filter])

  const expByCat = useMemo(()=>{
    const m={}
    monthTxs.filter(t=>t.type==='expense').forEach(t=>{m[t.category]=(m[t.category]||0)+Number(t.amount)})
    return Object.entries(m).sort((a,b)=>b[1]-a[1]).slice(0,7)
  },[monthTxs])

  function openModal(type='expense') {
    setDraft({...EMPTY, type, date:new Date().toISOString().split('T')[0], category:type==='expense'?'Makanan':'Gaji'})
    setModal(true)
  }
  function save() {
    if(!draft.amount || !Number(draft.amount)) return
    setData(d=>({...d, transactions:[...(d.transactions||[]),{...draft,id:uid(),amount:Number(draft.amount)}]}))
    setModal(false)
  }
  function del(id){ setData(d=>({...d,transactions:d.transactions.filter(t=>t.id!==id)})) }

  const cats = draft.type==='expense' ? EXPENSE_CATS : INCOME_CATS
  const isMobile = useIsMobile()

  return (
    <div style={{margin:'-28px -28px -40px',background:'var(--bg)',minHeight:'calc(100vh - 68px)',fontFamily:"'Inter',sans-serif"}}>

      {/* HEADER */}
      <div style={{padding: isMobile ? '20px 16px 16px' : '36px 44px 24px',background:'white',borderBottom:'1px solid var(--border)'}}>
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'20px',flexWrap: isMobile ? 'wrap' : 'nowrap',gap: isMobile ? '12px' : '0'}}>
          <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
            <div style={{width:'40px',height:'40px',borderRadius:'12px',background:'rgba(52,199,89,0.12)',border:'1px solid rgba(52,199,89,0.25)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Wallet size={20} color="#34C759" strokeWidth={2}/>
            </div>
            <div>
              <h1 style={{fontSize: isMobile ? '22px' : '28px',fontWeight:900,color:'var(--text)',letterSpacing:'-0.5px',lineHeight:1}}>Finance</h1>
              <p style={{fontSize:'13px',color:'var(--text-muted)',marginTop:'3px'}}>Pantau keuangan pribadi harianmu</p>
            </div>
          </div>
          <div style={{display:'flex',gap:'8px'}}>
            <button onClick={()=>openModal('income')} style={{display:'flex',alignItems:'center',gap:'7px',padding:'10px 18px',borderRadius:'980px',background:'rgba(52,199,89,0.1)',color:'#34C759',border:'1.5px solid rgba(52,199,89,0.3)',cursor:'pointer',fontWeight:700,fontSize:'13.5px',transition:'all 0.15s'}}
              onMouseEnter={e=>{e.currentTarget.style.background='#34C759';e.currentTarget.style.color='white'}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(52,199,89,0.1)';e.currentTarget.style.color='#34C759'}}>
              <ArrowUpRight size={14}/> Pemasukan
            </button>
            <button onClick={()=>openModal('expense')} style={{display:'flex',alignItems:'center',gap:'7px',padding:'10px 18px',borderRadius:'980px',background:'rgba(255,55,95,0.08)',color:'#FF375F',border:'1.5px solid rgba(255,55,95,0.25)',cursor:'pointer',fontWeight:700,fontSize:'13.5px',transition:'all 0.15s'}}
              onMouseEnter={e=>{e.currentTarget.style.background='#FF375F';e.currentTarget.style.color='white'}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,55,95,0.08)';e.currentTarget.style.color='#FF375F'}}>
              <ArrowDownRight size={14}/> Pengeluaran
            </button>
          </div>
        </div>

        {/* Month nav */}
        <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'20px'}}>
          <button onClick={()=>setMonthOffset(o=>o-1)} style={{width:'28px',height:'28px',borderRadius:'8px',background:'var(--bg)',border:'1px solid var(--border)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--text-muted)'}}>
            <ChevronLeft size={14}/>
          </button>
          <span style={{fontSize:'14px',fontWeight:700,color:'var(--text)',minWidth:'160px',textAlign:'center'}}>{monthLabel}</span>
          <button onClick={()=>setMonthOffset(o=>Math.min(0,o+1))} disabled={monthOffset===0} style={{width:'28px',height:'28px',borderRadius:'8px',background:monthOffset===0?'transparent':'var(--bg)',border:'1px solid var(--border)',cursor:monthOffset===0?'default':'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:monthOffset===0?'var(--border)':'var(--text-muted)',opacity:monthOffset===0?0.4:1}}>
            <ChevronRight size={14}/>
          </button>
        </div>

        {/* Summary cards */}
        <div style={{display:'grid',gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)',gap:'12px'}}>
          {[
            {label:'Pemasukan', value:totalIncome, color:'#34C759', icon:<ArrowUpRight size={14} color="#34C759"/>, bg:'rgba(52,199,89,0.08)', border:'rgba(52,199,89,0.2)'},
            {label:'Pengeluaran', value:totalExpense, color:'#FF375F', icon:<ArrowDownRight size={14} color="#FF375F"/>, bg:'rgba(255,55,95,0.06)', border:'rgba(255,55,95,0.2)'},
            {label:'Saldo', value:balance, color:balance>=0?'#0071E3':'#FF375F', icon:<Wallet size={14} color={balance>=0?'#0071E3':'#FF375F'}/>, bg:'rgba(0,113,227,0.06)', border:'rgba(0,113,227,0.2)'},
            {label:'Saving Rate', value:`${savingsRate}%`, color:'#7060A8', icon:<PiggyBank size={14} color="#7060A8"/>, bg:'rgba(112,96,168,0.06)', border:'rgba(112,96,168,0.2)', isText:true},
          ].map(({label,value,color,icon,bg,border,isText})=>(
            <div key={label} style={{background:bg,border:`1px solid ${border}`,borderRadius:'14px',padding:'16px 18px'}}>
              <div style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'8px'}}>
                <div style={{width:'24px',height:'24px',borderRadius:'7px',background:'white',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 1px 4px rgba(0,0,0,0.08)'}}>{icon}</div>
                <span style={{fontSize:'11px',fontWeight:600,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.5px'}}>{label}</span>
              </div>
              <div style={{fontSize:'22px',fontWeight:900,color,letterSpacing:'-0.5px'}}>
                {isText ? value : `Rp ${fmt(value)}`}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BODY */}
      <div style={{padding: isMobile ? '16px 14px' : '24px 44px',display:'grid',gridTemplateColumns: isMobile ? '1fr' : '1fr 320px',gap:'20px',alignItems:'start'}}>

        {/* Left: transactions */}
        <div>
          {/* Filter tabs */}
          <div style={{display:'flex',gap:'2px',background:'white',borderRadius:'12px',padding:'4px',border:'1px solid var(--border)',boxShadow:'var(--shadow)',marginBottom:'16px',width:'fit-content'}}>
            {[['all','Semua','var(--accent)'],['income','Pemasukan','#34C759'],['expense','Pengeluaran','#FF375F']].map(([k,l,c])=>(
              <button key={k} onClick={()=>setFilter(k)} style={{padding:'7px 18px',borderRadius:'9px',border:'none',cursor:'pointer',fontSize:'13px',fontWeight:600,background:filter===k?c:'transparent',color:filter===k?'white':'var(--text-muted)',transition:'all 0.15s'}}>
                {l}
              </button>
            ))}
          </div>

          {shown.length===0 ? (
            <div style={{background:'white',borderRadius:'16px',border:'1px solid var(--border)',padding:'60px 40px',textAlign:'center'}}>
              <Wallet size={36} color="var(--border)" style={{marginBottom:'12px'}}/>
              <p style={{color:'var(--text-muted)',fontSize:'14px'}}>Belum ada transaksi {filter==='income'?'pemasukan':filter==='expense'?'pengeluaran':''} bulan ini</p>
              <button onClick={()=>openModal(filter==='income'?'income':'expense')} style={{marginTop:'14px',display:'inline-flex',alignItems:'center',gap:'6px',padding:'9px 18px',borderRadius:'980px',background:'var(--accent)',color:'white',border:'none',cursor:'pointer',fontWeight:700,fontSize:'13px'}}>
                <Plus size={13}/> Tambah Transaksi
              </button>
            </div>
          ) : (
            <div style={{background:'white',borderRadius:'16px',border:'1px solid var(--border)',boxShadow:'var(--shadow)',overflow:'hidden'}}>
              {shown.map((tx,i)=>{
                const cat=getCat(tx.type,tx.category)
                const isIncome=tx.type==='income'
                return (
                  <div key={tx.id}
                    style={{display:'flex',alignItems:'center',gap:'12px',padding:'14px 20px',borderBottom:i<shown.length-1?'1px solid var(--border-light)':'none',transition:'background 0.1s'}}
                    onMouseEnter={e=>{ e.currentTarget.style.background='var(--bg)'; e.currentTarget.querySelector('.del-btn').style.opacity='1' }}
                    onMouseLeave={e=>{ e.currentTarget.style.background='white'; e.currentTarget.querySelector('.del-btn').style.opacity='0' }}>
                    <div style={{width:'38px',height:'38px',borderRadius:'11px',background:isIncome?'rgba(52,199,89,0.1)':'rgba(255,55,95,0.08)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px',flexShrink:0}}>
                      {cat.emoji}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:'13.5px',fontWeight:600,color:'var(--text)'}}>{tx.category}</div>
                      {tx.note && <div style={{fontSize:'12px',color:'var(--text-muted)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{tx.note}</div>}
                    </div>
                    <div style={{textAlign:'right',flexShrink:0}}>
                      <div style={{fontSize:'14px',fontWeight:800,color:isIncome?'#34C759':'#FF375F'}}>
                        {isIncome?'+':'-'}Rp {fmt(tx.amount)}
                      </div>
                      <div style={{fontSize:'11px',color:'var(--text-muted)',marginTop:'1px'}}>
                        {new Date(tx.date).toLocaleDateString('id-ID',{day:'numeric',month:'short'})}
                      </div>
                    </div>
                    <button className="del-btn" onClick={()=>del(tx.id)} style={{width:'28px',height:'28px',borderRadius:'8px',background:'none',border:'none',cursor:'pointer',color:'rgba(255,55,95,0.5)',display:'flex',alignItems:'center',justifyContent:'center',opacity:0,transition:'opacity 0.15s,color 0.15s'}}
                      onMouseEnter={e=>e.currentTarget.style.color='#FF375F'}
                      onMouseLeave={e=>e.currentTarget.style.color='rgba(255,55,95,0.5)'}>
                      <Trash2 size={13}/>
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Right: breakdown */}
        <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
          {/* Expense breakdown */}
          {expByCat.length>0 && (
            <div style={{background:'white',borderRadius:'16px',border:'1px solid var(--border)',boxShadow:'var(--shadow)',overflow:'hidden'}}>
              <div style={{padding:'14px 18px',borderBottom:'1px solid var(--border-light)',display:'flex',alignItems:'center',gap:'7px'}}>
                <TrendingDown size={14} color="#FF375F"/>
                <span style={{fontSize:'13px',fontWeight:700,color:'var(--text)'}}>Breakdown Pengeluaran</span>
              </div>
              <div style={{padding:'14px 18px',display:'flex',flexDirection:'column',gap:'11px'}}>
                {expByCat.map(([cat,amt])=>{
                  const catObj=EXPENSE_CATS.find(c=>c.name===cat)||{color:'#8E8E93',emoji:'📦'}
                  const pct=totalExpense>0?(amt/totalExpense)*100:0
                  return (
                    <div key={cat}>
                      <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'5px'}}>
                        <span style={{fontSize:'13px'}}>{catObj.emoji}</span>
                        <span style={{fontSize:'12px',fontWeight:600,color:'var(--text)',flex:1}}>{cat}</span>
                        <span style={{fontSize:'12px',fontWeight:700,color:'var(--text)'}}>Rp {fmt(amt)}</span>
                        <span style={{fontSize:'11px',color:'var(--text-muted)',width:'32px',textAlign:'right'}}>{Math.round(pct)}%</span>
                      </div>
                      <div style={{height:'4px',borderRadius:'99px',background:'var(--border-light)',overflow:'hidden'}}>
                        <div style={{height:'100%',width:`${pct}%`,background:catObj.color,borderRadius:'99px',transition:'width 0.5s'}}/>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Saving gauge */}
          <div style={{background:'linear-gradient(135deg,rgba(112,96,168,0.08),rgba(0,113,227,0.06))',border:'1px solid rgba(112,96,168,0.2)',borderRadius:'16px',padding:'18px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'7px',marginBottom:'12px'}}>
              <PiggyBank size={14} color="#7060A8"/>
              <span style={{fontSize:'13px',fontWeight:700,color:'var(--text)'}}>Saving Rate</span>
            </div>
            <div style={{fontSize:'36px',fontWeight:900,color:savingsRate>=20?'#34C759':savingsRate>=0?'#FF9F0A':'#FF375F',letterSpacing:'-1px',marginBottom:'8px'}}>{savingsRate}%</div>
            <div style={{height:'6px',borderRadius:'99px',background:'rgba(0,0,0,0.08)',overflow:'hidden',marginBottom:'8px'}}>
              <div style={{height:'100%',width:`${Math.max(0,Math.min(100,savingsRate))}%`,background:savingsRate>=20?'#34C759':savingsRate>=0?'#FF9F0A':'#FF375F',borderRadius:'99px',transition:'width 0.5s'}}/>
            </div>
            <div style={{fontSize:'12px',color:'var(--text-muted)'}}>
              {savingsRate>=20?'Tabungan sehat! Pertahankan.':savingsRate>=10?'Cukup, tapi bisa lebih baik.':savingsRate>=0?'Coba kurangi pengeluaran.':'Pengeluaran melebihi pemasukan.'}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {modal && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.4)',backdropFilter:'blur(8px)',zIndex:300,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}
          onClick={()=>setModal(false)}>
          <div onClick={e=>e.stopPropagation()} style={{background:'white',borderRadius:'20px',border:'1px solid var(--border)',width:'100%',maxWidth:'440px',boxShadow:'0 24px 64px rgba(0,0,0,0.18)'}}>
            <div style={{padding:'20px 24px 16px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid var(--border)'}}>
              <div>
                <h2 style={{fontSize:'17px',fontWeight:800,color:'var(--text)'}}>Tambah Transaksi</h2>
                <p style={{fontSize:'12px',color:'var(--text-muted)',marginTop:'2px'}}>Catat pemasukan atau pengeluaran</p>
              </div>
              <button onClick={()=>setModal(false)} style={{width:'30px',height:'30px',borderRadius:'9px',background:'var(--bg)',border:'1px solid var(--border)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--text-muted)'}}>
                <X size={15}/>
              </button>
            </div>
            <div style={{padding:'20px 24px',display:'flex',flexDirection:'column',gap:'16px'}}>
              {/* Type toggle */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
                {[['expense','Pengeluaran','#FF375F'],['income','Pemasukan','#34C759']].map(([t,l,c])=>(
                  <button key={t} onClick={()=>setDraft(d=>({...d,type:t,category:t==='expense'?'Makanan':'Gaji'}))} style={{padding:'10px',borderRadius:'12px',border:`1.5px solid ${draft.type===t?c:'var(--border)'}`,background:draft.type===t?`${c}12`:'transparent',color:draft.type===t?c:'var(--text-muted)',fontWeight:700,fontSize:'13px',cursor:'pointer',transition:'all 0.15s'}}>
                    {l}
                  </button>
                ))}
              </div>
              {/* Amount */}
              <div>
                <label style={{fontSize:'11px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.8px',color:'var(--text-muted)',display:'block',marginBottom:'6px'}}>Jumlah (Rp)</label>
                <input type="number" value={draft.amount} onChange={e=>setDraft(d=>({...d,amount:e.target.value}))}
                  placeholder="0" autoFocus
                  style={{width:'100%',border:'1.5px solid var(--border)',borderRadius:'11px',padding:'11px 14px',fontSize:'18px',fontWeight:800,color:'var(--text)',outline:'none',background:'var(--bg)',transition:'border-color 0.15s'}}
                  onFocus={e=>e.target.style.borderColor='var(--accent)'}
                  onBlur={e=>e.target.style.borderColor='var(--border)'}/>
              </div>
              {/* Category */}
              <div>
                <label style={{fontSize:'11px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.8px',color:'var(--text-muted)',display:'block',marginBottom:'6px'}}>Kategori</label>
                <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>
                  {cats.map(cat=>(
                    <button key={cat.name} onClick={()=>setDraft(d=>({...d,category:cat.name}))} style={{padding:'6px 12px',borderRadius:'99px',border:`1.5px solid ${draft.category===cat.name?cat.color:'var(--border)'}`,background:draft.category===cat.name?`${cat.color}15`:'transparent',color:draft.category===cat.name?cat.color:'var(--text-muted)',fontSize:'12.5px',fontWeight:600,cursor:'pointer',transition:'all 0.15s'}}>
                      {cat.emoji} {cat.name}
                    </button>
                  ))}
                </div>
              </div>
              {/* Note + Date */}
              <div style={{display:'grid',gridTemplateColumns:'1fr auto',gap:'10px'}}>
                <div>
                  <label style={{fontSize:'11px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.8px',color:'var(--text-muted)',display:'block',marginBottom:'6px'}}>Catatan</label>
                  <input value={draft.note} onChange={e=>setDraft(d=>({...d,note:e.target.value}))} placeholder="Opsional..."
                    style={{width:'100%',border:'1.5px solid var(--border)',borderRadius:'11px',padding:'10px 13px',fontSize:'13.5px',color:'var(--text)',outline:'none',background:'var(--bg)',transition:'border-color 0.15s'}}
                    onFocus={e=>e.target.style.borderColor='var(--accent)'}
                    onBlur={e=>e.target.style.borderColor='var(--border)'}/>
                </div>
                <div>
                  <label style={{fontSize:'11px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.8px',color:'var(--text-muted)',display:'block',marginBottom:'6px'}}>Tanggal</label>
                  <input type="date" value={draft.date} onChange={e=>setDraft(d=>({...d,date:e.target.value}))}
                    style={{border:'1.5px solid var(--border)',borderRadius:'11px',padding:'10px 13px',fontSize:'13px',color:'var(--text)',outline:'none',background:'var(--bg)',transition:'border-color 0.15s'}}
                    onFocus={e=>e.target.style.borderColor='var(--accent)'}
                    onBlur={e=>e.target.style.borderColor='var(--border)'}/>
                </div>
              </div>
            </div>
            <div style={{padding:'14px 24px 20px',display:'flex',gap:'8px',justifyContent:'flex-end',borderTop:'1px solid var(--border)'}}>
              <button onClick={()=>setModal(false)} style={{padding:'10px 18px',borderRadius:'11px',background:'var(--bg)',border:'1px solid var(--border)',color:'var(--text-muted)',fontWeight:600,fontSize:'13.5px',cursor:'pointer'}}>
                Batal
              </button>
              <button onClick={save} style={{padding:'10px 22px',borderRadius:'11px',background:draft.type==='income'?'#34C759':'#FF375F',color:'white',border:'none',fontWeight:700,fontSize:'13.5px',cursor:'pointer',boxShadow:`0 3px 12px ${draft.type==='income'?'rgba(52,199,89,0.35)':'rgba(255,55,95,0.35)'}`,display:'flex',alignItems:'center',gap:'6px'}}>
                <Save size={14}/> Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
