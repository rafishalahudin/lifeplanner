import { useState, useMemo } from 'react'
import {
  GraduationCap, ChevronLeft, ChevronRight, CheckCircle2, XCircle,
  Lightbulb, AlertTriangle, BookMarked, Shuffle, RotateCcw, Trophy, BookOpen, Target, Clock
} from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useIsMobile } from '../hooks/useIsMobile'
import { LESSONS, STRATEGY } from '../data/toeflGrammar'
import { EXPLAIN, ROLES } from '../data/toeflExplain'

const LETTERS = ['A', 'B', 'C', 'D']
const MIXED_SIZE = 15
const SIM_STRUCTURE = 15
const SIM_WRITTEN = 25

const shuffle = arr => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// '{{went}}' → { underlined, label }
function parseError(q) {
  let n = 0
  return q.split(/\{\{(.+?)\}\}/).map((text, i) =>
    i % 2 ? { text, label: LETTERS[n++] } : { text }
  )
}
const errorOptions = q => parseError(q).filter(p => p.label).map(p => p.text)

const card = { background: 'white', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }

export default function Toefl() {
  const [progress, setProgress] = useLocalStorage('toefl-v1', { lessons: {}, mixed: [] })
  const [view, setView] = useState({ mode: 'home' })
  const [tab, setTab] = useState('materi')
  const isMobile = useIsMobile()

  const lessonsProg = progress?.lessons || {}
  const mixedHist = progress?.mixed || []
  const done = LESSONS.filter(l => lessonsProg[l.id]?.best != null).length
  const avg = done ? Math.round(LESSONS.reduce((s, l) => s + (lessonsProg[l.id]?.best ?? 0), 0) / done) : 0
  const bestMixed = mixedHist.length ? Math.max(...mixedHist.map(m => m.pct)) : null

  function startLessonQuiz(lesson) {
    setView({ mode: 'quiz', run: Date.now(), source: lesson.id, title: lesson.title, questions: lesson.quiz.map(q => ({ ...q, lessonId: lesson.id })) })
  }
  function startMixed(sim = false) {
    const all = shuffle(LESSONS.flatMap(l => l.quiz.map(q => ({ ...q, lessonId: l.id }))))
    // Simulasi mengikuti susunan TOEFL ITP: Structure dulu, lalu Written Expression
    const questions = sim
      ? [...all.filter(q => q.type === 'structure').slice(0, SIM_STRUCTURE), ...all.filter(q => q.type === 'error').slice(0, SIM_WRITTEN)]
      : all.slice(0, MIXED_SIZE)
    setView({ mode: 'quiz', run: Date.now(), source: 'mixed', sim, title: sim ? 'Simulasi TOEFL' : 'Latihan Campuran', questions })
  }
  function saveResult(source, correct, total) {
    const pct = Math.round((correct / total) * 100)
    setProgress(p => {
      const base = { lessons: p?.lessons || {}, mixed: p?.mixed || [] }
      if (source === 'mixed') {
        return { ...base, mixed: [...base.mixed, { date: new Date().toISOString(), correct, total, pct }].slice(-20) }
      }
      const prev = base.lessons[source] || {}
      return { ...base, lessons: { ...base.lessons, [source]: { best: Math.max(prev.best ?? 0, pct), attempts: (prev.attempts || 0) + 1, last: pct } } }
    })
  }

  const pad = isMobile ? '20px 16px' : '32px 44px'

  return (
    <div style={{ margin: isMobile ? '0 -14px -40px' : '-28px -28px -40px', background: 'var(--bg)', minHeight: 'calc(100vh - 68px)', fontFamily: "'Inter',sans-serif" }}>

      {/* HEADER */}
      <div style={{ padding: isMobile ? '20px 16px 16px' : '36px 44px 24px', background: 'white', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(88,86,214,0.12)', border: '1px solid rgba(88,86,214,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GraduationCap size={20} color="#5856D6" strokeWidth={2} />
          </div>
          <div>
            <h1 style={{ fontSize: isMobile ? '22px' : '28px', fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.5px', lineHeight: 1 }}>TOEFL Grammar</h1>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '3px' }}>Structure & Written Expression — belajar per bab, lalu uji diri</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(3,1fr)' : 'repeat(3, minmax(0,200px))', gap: '10px' }}>
          <Stat icon={BookOpen} color="#0071E3" label="Bab selesai" value={`${done}/${LESSONS.length}`} />
          <Stat icon={Target} color="#34C759" label="Rata-rata" value={done ? `${avg}%` : '—'} />
          <Stat icon={Trophy} color="#FF9F0A" label="Best campuran" value={bestMixed != null ? `${bestMixed}%` : '—'} />
        </div>
      </div>

      <div style={{ padding: pad }}>
        {view.mode === 'home' && (
          <>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
              {[['materi', 'Materi'], ['strategi', 'Strategi Ujian']].map(([k, label]) => (
                <button key={k} onClick={() => setTab(k)} style={{ padding: '8px 16px', borderRadius: '980px', border: '1px solid ' + (tab === k ? 'var(--text)' : 'var(--border)'), background: tab === k ? 'var(--text)' : 'white', color: tab === k ? 'white' : 'var(--text-sec)', fontWeight: 600, fontSize: '13px' }}>
                  {label}
                </button>
              ))}
              <button onClick={() => startMixed()} style={{ marginLeft: isMobile ? 0 : 'auto', display: 'flex', alignItems: 'center', gap: '7px', padding: '8px 16px', borderRadius: '980px', border: 'none', background: '#5856D6', color: 'white', fontWeight: 700, fontSize: '13px' }}>
                <Shuffle size={14} /> Latihan Campuran ({MIXED_SIZE} soal)
              </button>
              <button onClick={() => startMixed(true)} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '8px 16px', borderRadius: '980px', border: 'none', background: '#FF375F', color: 'white', fontWeight: 700, fontSize: '13px' }}>
                <Clock size={14} /> Simulasi TOEFL ({SIM_STRUCTURE + SIM_WRITTEN} soal)
              </button>
            </div>

            {tab === 'materi' ? (
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                {LESSONS.map((l, i) => {
                  const p = lessonsProg[l.id]
                  return (
                    <button key={l.id} onClick={() => setView({ mode: 'lesson', id: l.id })}
                      style={{ ...card, padding: '16px', textAlign: 'left', display: 'flex', gap: '14px', alignItems: 'flex-start', transition: 'transform 0.15s, box-shadow 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow)' }}>
                      <div style={{ width: '42px', height: '42px', flexShrink: 0, borderRadius: '12px', background: l.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{l.emoji}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.5px' }}>BAB {i + 1}</div>
                        <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text)', margin: '2px 0 4px' }}>{l.title}</div>
                        <div style={{ fontSize: '12.5px', color: 'var(--text-sec)', lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{l.summary}</div>
                        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ flex: 1, height: '5px', borderRadius: '5px', background: 'var(--border-light)', overflow: 'hidden' }}>
                            <div style={{ width: `${p?.best ?? 0}%`, height: '100%', background: scoreColor(p?.best ?? 0) }} />
                          </div>
                          <span style={{ fontSize: '11.5px', fontWeight: 700, color: p ? scoreColor(p.best) : 'var(--text-muted)' }}>{p ? `${p.best}%` : 'Belum'}</span>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            ) : (
              <StrategyView isMobile={isMobile} mixedHist={mixedHist} />
            )}
          </>
        )}

        {view.mode === 'lesson' && (
          <LessonView
            lesson={LESSONS.find(l => l.id === view.id)}
            index={LESSONS.findIndex(l => l.id === view.id)}
            isMobile={isMobile}
            onBack={() => setView({ mode: 'home' })}
            onQuiz={startLessonQuiz}
            onNav={id => setView({ mode: 'lesson', id })}
          />
        )}

        {view.mode === 'quiz' && (
          <Quiz
            key={view.run}
            {...view}
            onFinish={saveResult}
            onExit={() => setView(view.source === 'mixed' ? { mode: 'home' } : { mode: 'lesson', id: view.source })}
            onRetry={() => view.source === 'mixed' ? startMixed(view.sim) : startLessonQuiz(LESSONS.find(l => l.id === view.source))}
          />
        )}
      </div>
    </div>
  )
}

const scoreColor = pct => pct >= 80 ? '#34C759' : pct >= 60 ? '#FF9F0A' : pct > 0 ? '#FF375F' : 'var(--border)'

function Stat({ icon: Icon, color, label, value }) {
  return (
    <div style={{ padding: '12px 14px', borderRadius: '12px', background: 'var(--bg)', border: '1px solid var(--border-light)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 600 }}>
        <Icon size={13} color={color} strokeWidth={2.2} /> {label}
      </div>
      <div style={{ fontSize: '20px', fontWeight: 900, color: 'var(--text)', marginTop: '4px', letterSpacing: '-0.3px' }}>{value}</div>
    </div>
  )
}

function SectionTitle({ children }) {
  return <h3 style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.8px', textTransform: 'uppercase', margin: '28px 0 12px' }}>{children}</h3>
}

function LessonView({ lesson, index, isMobile, onBack, onQuiz, onNav }) {
  const prev = LESSONS[index - 1]
  const next = LESSONS[index + 1]
  const deep = EXPLAIN[lesson.id]
  return (
    <div className="animate-in">
      <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '4px', border: 'none', background: 'none', color: 'var(--accent)', fontWeight: 600, fontSize: '13.5px', padding: 0, marginBottom: '16px' }}>
        <ChevronLeft size={16} /> Semua bab
      </button>

      <div style={{ ...card, padding: isMobile ? '20px' : '28px', borderTop: `4px solid ${lesson.color}` }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: lesson.color, letterSpacing: '0.5px' }}>BAB {index + 1}</div>
        <h2 style={{ fontSize: isMobile ? '22px' : '26px', fontWeight: 900, letterSpacing: '-0.5px', margin: '4px 0 10px' }}>{lesson.emoji} {lesson.title}</h2>
        <p style={{ fontSize: '14.5px', color: 'var(--text-sec)', lineHeight: 1.6 }}>{lesson.summary}</p>
      </div>

      {deep?.concepts && <>
        <SectionTitle>Kenali Istilahnya Dulu</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
          {deep.concepts.map(c => (
            <div key={c.term} style={{ ...card, padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13.5px', fontWeight: 800, color: lesson.color, marginBottom: '5px' }}>
                <BookMarked size={14} /> {c.term}
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-sec)', lineHeight: 1.55 }}>{c.meaning}</p>
              <div style={{ marginTop: '8px', fontSize: '13px', fontStyle: 'italic' }}>{rich(c.example)}</div>
            </div>
          ))}
        </div>
      </>}

      <SectionTitle>Aturan</SectionTitle>
      {deep && <RoleLegend />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {lesson.rules.map((r, i) => {
          const d = deep?.rules[i]
          return (
            <div key={i} style={{ ...card, padding: isMobile ? '16px' : '20px 22px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ width: '26px', height: '26px', flexShrink: 0, borderRadius: '8px', background: lesson.color, color: 'white', fontWeight: 800, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: 800, marginTop: '3px' }}>{r.title}</div>
                  <p style={{ fontSize: '13.5px', color: 'var(--text)', fontWeight: 600, lineHeight: 1.55, marginTop: '4px' }}>{r.body}</p>
                </div>
              </div>
              {d?.explain && (
                <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {d.explain.map((para, j) => (
                    <p key={j} style={{ fontSize: '13.5px', color: 'var(--text-sec)', lineHeight: 1.65 }}>{rich(para)}</p>
                  ))}
                </div>
              )}
              {d?.parts && <Breakdown parts={d.parts} />}
              <div style={{ marginTop: '12px', padding: '8px 12px', borderRadius: '8px', background: lesson.color + '12', color: 'var(--text)', fontSize: '13px', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', lineHeight: 1.5 }}>{r.formula}</div>
              {d?.more && (
                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {d.more.map((ex, j) => <ExampleRow key={j} ex={ex} />)}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <SectionTitle>Contoh</SectionTitle>
      <div style={{ ...card, overflow: 'hidden' }}>
        {lesson.examples.map((ex, i) => (
          <div key={i} style={{ padding: '14px 16px', borderTop: i ? '1px solid var(--border-light)' : 'none' }}>
            <ExampleRow ex={ex} />
          </div>
        ))}
      </div>

      {deep?.walkthrough && <Walkthrough key={lesson.id} w={deep.walkthrough} color={lesson.color} />}

      <SectionTitle>Jebakan Umum</SectionTitle>
      {lesson.traps.map((t, i) => (
        <div key={i} style={{ display: 'flex', gap: '10px', padding: '12px 14px', borderRadius: '12px', background: 'rgba(255,159,10,0.1)', border: '1px solid rgba(255,159,10,0.25)', marginBottom: '8px', fontSize: '13.5px', lineHeight: 1.5 }}>
          <AlertTriangle size={17} color="#FF9F0A" style={{ flexShrink: 0, marginTop: '1px' }} /> {t}
        </div>
      ))}

      <button onClick={() => onQuiz(lesson)} style={{ marginTop: '24px', width: '100%', padding: '14px', borderRadius: '14px', border: 'none', background: lesson.color, color: 'white', fontWeight: 800, fontSize: '15px' }}>
        Mulai Kuis Bab Ini ({lesson.quiz.length} soal)
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', gap: '8px' }}>
        {prev ? <NavBtn onClick={() => onNav(prev.id)} left>{prev.title}</NavBtn> : <span />}
        {next && <NavBtn onClick={() => onNav(next.id)}>{next.title}</NavBtn>}
      </div>
    </div>
  )
}

// Teks dengan **tebal**
function rich(text) {
  return text.split(/\*\*(.+?)\*\*/g).map((t, i) => i % 2 ? <strong key={i} style={{ color: 'var(--text)', fontWeight: 700 }}>{t}</strong> : t)
}

function RoleLegend() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px', marginBottom: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
      <span style={{ fontWeight: 700 }}>Warna bedah kalimat:</span>
      {Object.values(ROLES).map(r => (
        <span key={r.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: '9px', height: '9px', borderRadius: '3px', background: r.color }} />{r.label}
        </span>
      ))}
    </div>
  )
}

function Breakdown({ parts }) {
  return (
    <div style={{ marginTop: '14px', padding: '12px', borderRadius: '12px', background: 'var(--bg, #F5F5F7)', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {parts.map(([text, role], i) => {
        const r = ROLES[role]
        return (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <span style={{ padding: '5px 9px', borderRadius: '8px', background: r.color + '18', border: `1.5px solid ${r.color}55`, fontSize: '13.5px', fontWeight: 600, textDecoration: role === 'X' ? 'line-through' : 'none', textDecorationColor: r.color }}>{text}</span>
            <span style={{ fontSize: '10.5px', fontWeight: 800, color: r.color, letterSpacing: '0.3px', textTransform: 'uppercase' }}>{r.label}</span>
          </div>
        )
      })}
    </div>
  )
}

function ExampleRow({ ex }) {
  return (
    <div style={{ display: 'flex', gap: '12px' }}>
      {ex.ok ? <CheckCircle2 size={18} color="#34C759" style={{ flexShrink: 0, marginTop: '1px' }} /> : <XCircle size={18} color="#FF375F" style={{ flexShrink: 0, marginTop: '1px' }} />}
      <div>
        <div style={{ fontSize: '14px', fontWeight: 600, color: ex.ok ? 'var(--text)' : 'var(--text-sec)', textDecoration: ex.ok ? 'none' : 'line-through', textDecorationColor: 'rgba(255,55,95,0.5)' }}>{ex.text}</div>
        {ex.note && <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '3px' }}>{ex.note}</div>}
      </div>
    </div>
  )
}

function Walkthrough({ w, color }) {
  const [shown, setShown] = useState(false)
  const q = { type: w.options ? 'structure' : 'error', q: w.q }
  return (
    <>
      <SectionTitle>Contoh Soal Dibahas</SectionTitle>
      <div style={{ ...card, padding: '18px' }}>
        <div style={{ fontSize: '11.5px', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>
          {w.options ? 'STRUCTURE — pilih jawaban yang tepat' : 'WRITTEN EXPRESSION — cari bagian yang salah'}
        </div>
        <div style={{ fontSize: '15.5px', lineHeight: 1.8 }}><QuestionText q={q} revealAnswer={shown && !w.options ? w.answer : null} /></div>
        {w.options && (
          <div style={{ display: 'grid', gap: '6px', marginTop: '12px' }}>
            {w.options.map((o, i) => {
              const right = shown && i === w.answer
              return (
                <div key={i} style={{ padding: '9px 12px', borderRadius: '10px', fontSize: '13.5px', border: `1.5px solid ${right ? '#34C759' : 'var(--border)'}`, background: right ? 'rgba(52,199,89,0.08)' : 'white', fontWeight: right ? 700 : 500 }}>
                  <b style={{ marginRight: '8px', color: 'var(--text-muted)' }}>{LETTERS[i]}</b>{o}
                </div>
              )
            })}
          </div>
        )}
        {!shown ? (
          <button onClick={() => setShown(true)} style={{ marginTop: '14px', padding: '10px 14px', borderRadius: '10px', border: `1.5px solid ${color}`, background: 'white', color, fontWeight: 700, fontSize: '13.5px' }}>
            Coba jawab dulu, lalu lihat pembahasan
          </button>
        ) : (
          <ol style={{ margin: '16px 0 0', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {w.steps.map((st, i) => <li key={i} style={{ fontSize: '13.5px', lineHeight: 1.6, color: 'var(--text-sec)' }}>{rich(st)}</li>)}
          </ol>
        )}
      </div>
    </>
  )
}

function NavBtn({ onClick, left, children }) {
  return (
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--border)', background: 'white', color: 'var(--text-sec)', fontSize: '12.5px', fontWeight: 600, maxWidth: '48%' }}>
      {left && <ChevronLeft size={14} style={{ flexShrink: 0 }} />}
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{children}</span>
      {!left && <ChevronRight size={14} style={{ flexShrink: 0 }} />}
    </button>
  )
}

function QuestionText({ q, revealAnswer }) {
  if (q.type === 'structure') {
    const [a, b] = q.q.split('____')
    return <>{a}<span style={{ display: 'inline-block', minWidth: '70px', borderBottom: '2px solid var(--text)', margin: '0 4px' }}>&nbsp;</span>{b}</>
  }
  return parseError(q.q).map((p, i) => p.label ? (
    <span key={i} style={{ position: 'relative', textDecoration: 'underline', textUnderlineOffset: '4px', textDecorationThickness: '2px', textDecorationColor: revealAnswer != null && LETTERS[revealAnswer] === p.label ? '#FF375F' : 'var(--text)', fontWeight: 600 }}>
      {p.text}<sup style={{ fontSize: '10px', fontWeight: 800, color: '#5856D6', marginLeft: '1px' }}>{p.label}</sup>
    </span>
  ) : <span key={i}>{p.text}</span>)
}

function Quiz({ title, source, questions, onFinish, onExit, onRetry }) {
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState([])
  const [finished, setFinished] = useState(false)

  const q = questions[idx]
  const picked = answers[idx]
  const options = q.type === 'structure' ? q.options : errorOptions(q.q)
  const correct = useMemo(() => answers.filter((a, i) => a === questions[i].answer).length, [answers, questions])

  function pick(i) {
    if (picked != null) return
    const next = [...answers]; next[idx] = i; setAnswers(next)
  }
  function nextQ() {
    if (idx < questions.length - 1) return setIdx(idx + 1)
    onFinish(source, correct, questions.length)
    setFinished(true)
  }

  if (finished) {
    const pct = Math.round((correct / questions.length) * 100)
    const wrong = questions.map((q, i) => ({ q, a: answers[i] })).filter(x => x.a !== x.q.answer)
    return (
      <div className="animate-in">
        <div style={{ ...card, padding: '28px', textAlign: 'center' }}>
          <Trophy size={36} color={scoreColor(pct)} />
          <div style={{ fontSize: '40px', fontWeight: 900, letterSpacing: '-1px', marginTop: '8px', color: scoreColor(pct) }}>{pct}%</div>
          <div style={{ fontSize: '14px', color: 'var(--text-sec)' }}>{correct} dari {questions.length} benar — {title}</div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px' }}>
            {pct >= 80 ? 'Mantap! Lanjut ke bab berikutnya.' : pct >= 60 ? 'Lumayan — baca ulang bagian jebakan, lalu coba lagi.' : 'Pelajari lagi aturannya, lalu ulangi kuis ini.'}
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap' }}>
            <button onClick={onRetry} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', borderRadius: '980px', border: 'none', background: 'var(--text)', color: 'white', fontWeight: 700, fontSize: '13.5px' }}><RotateCcw size={14} /> Ulangi</button>
            <button onClick={onExit} style={{ padding: '10px 18px', borderRadius: '980px', border: '1px solid var(--border)', background: 'white', color: 'var(--text)', fontWeight: 700, fontSize: '13.5px' }}>{source === 'mixed' ? 'Kembali' : 'Kembali ke materi'}</button>
          </div>
        </div>

        {wrong.length > 0 && <>
          <SectionTitle>Review jawaban salah</SectionTitle>
          {wrong.map(({ q, a }, i) => {
            const opts = q.type === 'structure' ? q.options : errorOptions(q.q)
            return (
              <div key={i} style={{ ...card, padding: '16px', marginBottom: '10px' }}>
                <div style={{ fontSize: '14px', lineHeight: 1.9 }}><QuestionText q={q} revealAnswer={q.type === 'error' ? q.answer : null} /></div>
                <div style={{ fontSize: '13px', marginTop: '8px' }}>
                  <span style={{ color: '#FF375F', fontWeight: 600 }}>Jawabanmu: {LETTERS[a]}. {opts[a]}</span>{'  ·  '}
                  <span style={{ color: '#34C759', fontWeight: 700 }}>Benar: {LETTERS[q.answer]}. {opts[q.answer]}</span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-sec)', marginTop: '6px' }}>{q.explain}</div>
                {source === 'mixed' && <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '6px' }}>Bab: {LESSONS.find(l => l.id === q.lessonId)?.title}</div>}
              </div>
            )
          })}
        </>}
      </div>
    )
  }

  const isRight = picked === q.answer
  return (
    <div className="animate-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <button onClick={onExit} style={{ display: 'flex', alignItems: 'center', gap: '4px', border: 'none', background: 'none', color: 'var(--accent)', fontWeight: 600, fontSize: '13.5px', padding: 0 }}>
          <ChevronLeft size={16} /> Keluar
        </button>
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)' }}>{idx + 1} / {questions.length}</span>
      </div>
      <div style={{ height: '5px', borderRadius: '5px', background: 'var(--border)', overflow: 'hidden', marginBottom: '20px' }}>
        <div style={{ width: `${((idx + (picked != null ? 1 : 0)) / questions.length) * 100}%`, height: '100%', background: '#5856D6', transition: 'width 0.3s' }} />
      </div>

      <div style={{ ...card, padding: '22px' }}>
        <div style={{ fontSize: '11.5px', fontWeight: 800, letterSpacing: '0.6px', color: q.type === 'structure' ? '#0071E3' : '#FF375F', marginBottom: '10px' }}>
          {q.type === 'structure' ? 'STRUCTURE — pilih jawaban yang melengkapi kalimat' : 'WRITTEN EXPRESSION — pilih bagian yang SALAH'}
        </div>
        <div style={{ fontSize: '17px', lineHeight: 1.9, color: 'var(--text)' }}>
          <QuestionText q={q} revealAnswer={picked != null && q.type === 'error' ? q.answer : null} />
        </div>
      </div>

      <div style={{ display: 'grid', gap: '8px', marginTop: '14px' }}>
        {options.map((opt, i) => {
          const state = picked == null ? 'idle' : i === q.answer ? 'right' : i === picked ? 'wrong' : 'dim'
          const styles = {
            idle: { border: '1px solid var(--border)', background: 'white' },
            right: { border: '1.5px solid #34C759', background: 'rgba(52,199,89,0.08)' },
            wrong: { border: '1.5px solid #FF375F', background: 'rgba(255,55,95,0.06)' },
            dim: { border: '1px solid var(--border-light)', background: 'white', opacity: 0.55 },
          }[state]
          return (
            <button key={i} onClick={() => pick(i)} disabled={picked != null}
              style={{ ...styles, display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 16px', borderRadius: '12px', textAlign: 'left', fontSize: '14.5px', color: 'var(--text)', cursor: picked == null ? 'pointer' : 'default' }}>
              <span style={{ width: '26px', height: '26px', flexShrink: 0, borderRadius: '8px', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '12.5px', color: 'var(--text-sec)' }}>{LETTERS[i]}</span>
              <span style={{ flex: 1 }}>{opt}</span>
              {state === 'right' && <CheckCircle2 size={18} color="#34C759" />}
              {state === 'wrong' && <XCircle size={18} color="#FF375F" />}
            </button>
          )
        })}
      </div>

      {picked != null && (
        <div className="animate-in" style={{ marginTop: '14px', padding: '14px 16px', borderRadius: '12px', background: isRight ? 'rgba(52,199,89,0.08)' : 'rgba(255,159,10,0.1)', display: 'flex', gap: '10px', fontSize: '13.5px', lineHeight: 1.55 }}>
          <Lightbulb size={17} color={isRight ? '#34C759' : '#FF9F0A'} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div><b>{isRight ? 'Benar!' : `Kurang tepat — jawabannya ${LETTERS[q.answer]}.`}</b> {q.explain}</div>
        </div>
      )}

      <button onClick={nextQ} disabled={picked == null}
        style={{ marginTop: '16px', width: '100%', padding: '14px', borderRadius: '14px', border: 'none', background: picked == null ? 'var(--border)' : '#5856D6', color: 'white', fontWeight: 800, fontSize: '15px', cursor: picked == null ? 'default' : 'pointer' }}>
        {idx < questions.length - 1 ? 'Soal berikutnya' : 'Lihat hasil'}
      </button>
    </div>
  )
}

function StrategyView({ isMobile, mixedHist }) {
  return (
    <div className="animate-in">
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)', gap: '10px' }}>
        {STRATEGY.overview.map(o => (
          <div key={o.label} style={{ ...card, padding: '14px' }}>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 600 }}>{o.label}</div>
            <div style={{ fontSize: '15px', fontWeight: 800, marginTop: '3px' }}>{o.value}</div>
          </div>
        ))}
      </div>

      {[['Tips Structure', STRATEGY.structureTips, '#0071E3'], ['Tips Written Expression', STRATEGY.writtenTips, '#FF375F']].map(([t, tips, color]) => (
        <div key={t}>
          <SectionTitle>{t}</SectionTitle>
          <div style={{ ...card, overflow: 'hidden' }}>
            {tips.map((tip, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', padding: '13px 16px', borderTop: i ? '1px solid var(--border-light)' : 'none', fontSize: '13.5px', lineHeight: 1.55 }}>
                <span style={{ width: '22px', height: '22px', flexShrink: 0, borderRadius: '7px', background: color + '15', color, fontWeight: 800, fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                {tip}
              </div>
            ))}
          </div>
        </div>
      ))}

      <SectionTitle>Riwayat Latihan Campuran</SectionTitle>
      {mixedHist.length === 0 ? (
        <div style={{ ...card, padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13.5px' }}>
          <Clock size={22} style={{ opacity: 0.4, marginBottom: '6px' }} /><br />Belum ada latihan campuran.
        </div>
      ) : (
        <div style={{ ...card, overflow: 'hidden' }}>
          {[...mixedHist].reverse().map((m, i) => (
            <div key={m.date} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderTop: i ? '1px solid var(--border-light)' : 'none', fontSize: '13.5px' }}>
              <span style={{ color: 'var(--text-sec)' }}>{new Date(m.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              <span style={{ fontWeight: 800, color: scoreColor(m.pct) }}>{m.correct}/{m.total} · {m.pct}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
