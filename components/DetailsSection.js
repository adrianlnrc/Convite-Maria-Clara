'use client'

import { useState, useEffect } from 'react'

// ── Google Calendar URL ───────────────────────────────────────
const calUrl = (() => {
  const u = new URL('https://www.google.com/calendar/render')
  u.searchParams.set('action', 'TEMPLATE')
  u.searchParams.set('text', '20 Anos Maria Clara 🎉')
  u.searchParams.set('dates', '20260501T193000/20260502T000000')
  u.searchParams.set('details', 'Festa de aniversário de 20 anos, Venha comemorar comigo!')
  u.searchParams.set('location', 'Quarta 204 lote 7, Residencial Impérium, Águas Claras')
  return u.toString()
})()

const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=Q+204+Residencia+Imperium+%C3%81guas+Claras+Bras%C3%ADlia+DF+71900-000'

// ── Floating stars ─────────────────────────────────────────────
const STARS = [
  { top: '4%',  left: '5%',   size: 12, delay: '0s',   dur: '2.8s' },
  { top: '9%',  left: '14%',  size: 8,  delay: '0.5s', dur: '3.2s' },
  { top: '3%',  right: '6%',  size: 12, delay: '0.3s', dur: '2.5s' },
  { top: '8%',  right: '15%', size: 8,  delay: '0.9s', dur: '3.5s' },
  { top: '22%', left: '3%',   size: 7,  delay: '1.1s', dur: '2.9s' },
  { top: '24%', right: '3%',  size: 7,  delay: '0.7s', dur: '3.1s' },
]

function StarField() {
  return (
    <>
      {STARS.map((s, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            top: s.top, left: s.left, right: s.right,
            fontSize: s.size, color: '#f0e6d3', opacity: 0.4,
            pointerEvents: 'none',
            animation: `twinkle ${s.dur} ${s.delay} ease-in-out infinite`,
            zIndex: 1,
          }}
        >✦</span>
      ))}
    </>
  )
}

// ── 2D Line-art Cake (estilo do screenshot) ───────────────────
const CANDLES_CFG = [{ cx: 66 }, { cx: 100 }, { cx: 134 }]
const FLAME_DELAYS    = ['0s', '0.2s', '0.4s']
const FLAME_DUR_OUTER = ['0.65s', '0.72s', '0.60s']
const FLAME_DUR_INNER = ['0.55s', '0.61s', '0.51s']

function CakeSVG({ candlesLit }) {
  const stroke = '#f0e6d3'
  const sw = 2.1

  return (
    <svg
      viewBox="0 0 200 175"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: 'min(72vw, 300px)', height: 'auto' }}
    >
      <defs>
        <linearGradient id="flameGrad" x1="50%" y1="100%" x2="50%" y2="0%">
          <stop offset="0%"   stopColor="#ff4500" />
          <stop offset="55%"  stopColor="#ffd700" />
          <stop offset="100%" stopColor="#fff9c4" />
        </linearGradient>
        <filter id="flameGlow" x="-100%" y="-80%" width="300%" height="260%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── CANDLES ── */}
      {CANDLES_CFG.map((cv, i) => (
        <g key={i}>
          <rect x={cv.cx - 5} y={55} width={10} height={35} rx={3}
            stroke={stroke} strokeWidth={sw} fill="none" />
          <path d={`M ${cv.cx - 2},63 C ${cv.cx - 4},72 ${cv.cx - 3},81 ${cv.cx - 2},87`}
            stroke={stroke} strokeWidth={1.2} strokeLinecap="round" opacity={0.5} />
          <line x1={cv.cx} y1={55} x2={cv.cx} y2={50}
            stroke={stroke} strokeWidth={1.3} strokeLinecap="round" opacity={0.65} />
        </g>
      ))}

      {/* ── FROSTING BUMPS (top of cake, 6 humps) ── */}
      <path
        d="M 22,90 C 30,72 42,72 48,90
           C 56,72 68,72 74,90
           C 82,72 94,72 100,90
           C 108,72 120,72 126,90
           C 134,72 146,72 152,90
           C 160,72 172,72 178,90"
        stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
      />

      {/* ── CAKE SIDE WALLS ── */}
      <line x1="22"  y1="90"  x2="22"  y2="162" stroke={stroke} strokeWidth={sw} />
      <line x1="178" y1="90"  x2="178" y2="162" stroke={stroke} strokeWidth={sw} />

      {/* ── WAVY STRIPE ── */}
      <path
        d="M 22,122 Q 47,115 74,122 Q 101,129 128,122 Q 155,115 178,122"
        stroke={stroke} strokeWidth={1.7} strokeLinecap="round"
      />

      {/* ── SCALLOPED BOTTOM TRIM ── */}
      <path
        d="M 22,154 Q 35,145 48,154 Q 61,163 74,154 Q 87,145 100,154
           Q 113,163 126,154 Q 139,145 152,154 Q 165,163 178,154"
        stroke={stroke} strokeWidth={1.7} strokeLinecap="round"
      />

      {/* ── BOTTOM LINE ── */}
      <line x1="22" y1="162" x2="178" y2="162" stroke={stroke} strokeWidth={sw} />

      {/* ── FLAMES ── */}
      {CANDLES_CFG.map((cv, i) => (
        <g
          key={i}
          filter={candlesLit ? 'url(#flameGlow)' : undefined}
          style={{
            opacity: candlesLit ? 1 : 0,
            transition: `opacity 0.45s ease ${FLAME_DELAYS[i]}`,
          }}
        >
          <ellipse cx={cv.cx} cy={43} rx={8} ry={10} fill="#ff8c00" opacity={0.28} />
          <path
            d={`M ${cv.cx},28 C ${cv.cx-9},36 ${cv.cx-9},47 ${cv.cx},51
                C ${cv.cx+9},47 ${cv.cx+9},36 ${cv.cx},28 Z`}
            fill="#ff6b2b" opacity={0.75}
            style={candlesLit ? {
              transformBox: 'fill-box', transformOrigin: '50% 100%',
              animation: `flameWaver ${FLAME_DUR_OUTER[i]} ease-in-out ${FLAME_DELAYS[i]} infinite`,
            } : {}}
          />
          <path
            d={`M ${cv.cx},31 C ${cv.cx-6},38 ${cv.cx-6},47 ${cv.cx},51
                C ${cv.cx+6},47 ${cv.cx+6},38 ${cv.cx},31 Z`}
            fill="url(#flameGrad)"
            style={candlesLit ? {
              transformBox: 'fill-box', transformOrigin: '50% 100%',
              animation: `flameWaver ${FLAME_DUR_INNER[i]} ease-in-out ${FLAME_DELAYS[i]} infinite`,
            } : {}}
          />
        </g>
      ))}
    </svg>
  )
}

// ── Balloons ──────────────────────────────────────────────────
function Balloons() {
  const configs = [
    { rot: -10, cls: 'balloon-float-1' },
    { rot:   0, cls: 'balloon-float-2' },
    { rot:  10, cls: 'balloon-float-3' },
  ]
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 4 }}>
      {configs.map(({ rot, cls }, i) => (
        <svg key={i} className={cls} width="52" height="90" viewBox="0 0 52 90" fill="none"
          style={{ transform: `rotate(${rot}deg)`, transformOrigin: 'bottom center' }}>
          <ellipse cx="26" cy="30" rx="20" ry="26" stroke="#f0e6d3" strokeWidth="1.8" fill="none" />
          <path d="M23,56 L26,62 L29,56" stroke="#f0e6d3" strokeWidth="1.4" fill="none" />
          <path d="M26,62 Q20,72 26,82" stroke="rgba(240,230,211,0.55)" strokeWidth="1.2" fill="none" />
          <ellipse cx="18" cy="20" rx="4" ry="6" stroke="rgba(240,230,211,0.25)" strokeWidth="1" fill="none" />
        </svg>
      ))}
    </div>
  )
}

// ── Gift boxes ────────────────────────────────────────────────
function GiftBox({ style }) {
  return (
    <svg width="54" height="60" viewBox="0 0 56 62" fill="none" style={style}>
      <rect x="6" y="24" width="44" height="34" rx="2" stroke="rgba(240,230,211,0.55)" strokeWidth="1.6" />
      <rect x="2" y="16" width="52" height="10" rx="2" stroke="rgba(240,230,211,0.55)" strokeWidth="1.6" />
      <line x1="28" y1="16" x2="28" y2="58" stroke="rgba(240,230,211,0.35)" strokeWidth="1.4" />
      <path d="M28,16 Q22,6 15,10 Q10,14 15,17" stroke="rgba(240,230,211,0.55)" strokeWidth="1.4" fill="none" />
      <path d="M28,16 Q34,6 41,10 Q46,14 41,17" stroke="rgba(240,230,211,0.55)" strokeWidth="1.4" fill="none" />
    </svg>
  )
}

// ── Calendar icon ─────────────────────────────────────────────
function CalIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="17" rx="2" stroke="#7a1212" strokeWidth="2" />
      <line x1="3" y1="9" x2="21" y2="9" stroke="#7a1212" strokeWidth="2" />
      <line x1="8" y1="2" x2="8" y2="6" stroke="#7a1212" strokeWidth="2" strokeLinecap="round" />
      <line x1="16" y1="2" x2="16" y2="6" stroke="#7a1212" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// ── Map icon ──────────────────────────────────────────────────
function MapIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        stroke="#7a1212" strokeWidth="2" fill="none" />
      <circle cx="12" cy="9" r="2.5" stroke="#7a1212" strokeWidth="2" />
    </svg>
  )
}

// ── Scroll-to-RSVP floating alert ────────────────────────────
function ConfirmAlert() {
  const [visible, setVisible]     = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1800)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (dismissed) return
    function onScroll() {
      if (window.scrollY > window.innerHeight * 0.6) setDismissed(true)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [dismissed])

  function scrollToRSVP() {
    document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' })
    setDismissed(true)
  }

  const show = visible && !dismissed

  return (
    <button
      onClick={scrollToRSVP}
      aria-label="Confirmar presença"
      style={{
        position: 'fixed',
        bottom: '1.8rem',
        left: '50%',
        transform: show
          ? 'translateX(-50%) translateY(0)'
          : 'translateX(-50%) translateY(120px)',
        transition: 'transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease',
        opacity: show ? 1 : 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        background: 'linear-gradient(135deg, #C8940A 0%, #9e6e05 100%)',
        color: '#1a0a00',
        fontFamily: 'var(--font-lora), serif',
        fontWeight: 700,
        fontSize: '0.9rem',
        letterSpacing: '0.06em',
        padding: '13px 26px',
        borderRadius: 40,
        border: '2px solid #1a0a00',
        cursor: 'pointer',
        boxShadow: '2px 2px 0 #1a0a00, 0 6px 28px rgba(200,148,10,0.4)',
        whiteSpace: 'nowrap',
        animation: show ? 'scrollBounce 2.4s ease-in-out infinite' : 'none',
        pointerEvents: show ? 'auto' : 'none',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M20 6L9 17l-5-5" stroke="#1a0a00" strokeWidth="2.8"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Confirmar presença
      <svg width="14" height="14" viewBox="0 0 16 20" fill="none" style={{ marginLeft: 2 }}>
        <path d="M8 2 L8 14 M3 10 L8 15 L13 10"
          stroke="#1a0a00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}

// ── Main Section ──────────────────────────────────────────────
export default function DetailsSection() {
  const [candlesLit, setCandlesLit] = useState(false)

  useEffect(() => {
    function onRsvpLit() { setCandlesLit(true) }
    window.addEventListener('rsvp-lit', onRsvpLit)
    return () => window.removeEventListener('rsvp-lit', onRsvpLit)
  }, [])

  return (
    <section
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'radial-gradient(ellipse at 50% 18%, #b02424 0%, #7a1212 32%, #3a0808 65%, #1a0505 100%)',
        position: 'relative',
        overflow: 'hidden',
        padding: '5rem 1rem 4rem',
      }}
    >
      <StarField />

      <GiftBox style={{ position: 'absolute', left: 8, bottom: 64, opacity: 0.5, pointerEvents: 'none' }} />
      <GiftBox style={{ position: 'absolute', right: 8, bottom: 64, opacity: 0.4, transform: 'scaleX(-1)', pointerEvents: 'none' }} />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem',
          maxWidth: 480,
          width: '100%',
          zIndex: 2,
        }}
      >
        {/* Nome principal */}
        <h1
          style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 'clamp(3rem, 10vw, 6.5rem)',
            fontWeight: 900,
            color: '#f0e6d3',
            letterSpacing: '0.06em',
            textAlign: 'center',
            lineHeight: 1,
            textShadow: '3px 3px 0 #1a0a00, -1px -1px 0 #1a0a00, 0 0 60px rgba(200,148,10,0.2)',
            animation: 'fadeUp 0.8s 0.05s ease both',
            marginBottom: '0.1rem',
          }}
        >
          MARIA CLARA
        </h1>

        {/* Ornamentos */}
        <p
          style={{
            color: '#C8940A',
            fontSize: 'clamp(0.75rem, 2vw, 0.9rem)',
            letterSpacing: '0.55em',
            opacity: 0.85,
            animation: 'fadeUp 0.7s 0.12s ease both',
          }}
        >
          ✦✦✦✦✦✦✦✦✦✦
        </p>

        {/* Badge 20 ANOS */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: '#C8940A',
            color: '#1a0a00',
            border: '2.5px solid #1a0a00',
            borderRadius: 40,
            padding: '7px 28px',
            fontFamily: 'var(--font-playfair), serif',
            fontWeight: 900,
            fontSize: 'clamp(0.95rem, 3vw, 1.25rem)',
            letterSpacing: '0.32em',
            boxShadow: '3px 3px 0 #1a0a00',
            animation: 'fadeUp 0.8s 0.18s ease both',
          }}
        >
          20 ANOS
        </div>

        {/* Divider dourado */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: '0.9rem',
            width: '100%', animation: 'fadeUp 0.7s 0.24s ease both',
            marginTop: '0.2rem',
          }}
        >
          <div style={{ flex: 1, height: 1, background: 'rgba(200,148,10,0.4)' }} />
          <span style={{ color: '#C8940A', fontSize: 16, opacity: 0.85 }}>✦</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(200,148,10,0.4)' }} />
        </div>

        {/* Bolo 2D */}
        <div style={{ animation: 'cakeFloat 4s ease-in-out infinite', marginTop: '0.3rem' }}>
          <CakeSVG candlesLit={candlesLit} />
        </div>

        {/* Evento */}
        <p
          style={{
            fontFamily: 'var(--font-lora), serif',
            fontSize: 'clamp(0.75rem, 2vw, 0.9rem)',
            color: 'rgba(240,230,211,0.65)',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            textAlign: 'center',
            animation: 'fadeUp 0.7s 0.3s ease both',
          }}
        >
          Festa de Aniversário
        </p>

        {/* Date box */}
        <div className="date-box" style={{ animation: 'fadeUp 0.7s 0.36s ease both' }}>
          <span
            style={{
              fontFamily: 'var(--font-playfair), serif',
              fontSize: 'clamp(1.2rem, 3.8vw, 1.6rem)',
              fontWeight: 700,
              color: '#f0e6d3',
              letterSpacing: '1px',
            }}
          >
            01/05 às 19h30
          </span>
        </div>

        {/* Endereço */}
        <address
          style={{
            textAlign: 'center',
            color: 'rgba(240,230,211,0.85)',
            fontFamily: 'var(--font-lora), serif',
            fontSize: 'clamp(0.9rem, 2.4vw, 1.05rem)',
            lineHeight: 1.8,
            fontStyle: 'normal',
            animation: 'fadeUp 0.7s 0.42s ease both',
          }}
        >
          Quarta 204 lote 7<br />
          Residencial Impérium<br />
          Águas Claras
        </address>

        {/* Balões */}
        <div style={{ animation: 'fadeUp 0.7s 0.48s ease both', width: '100%' }}>
          <Balloons />
        </div>

        {/* Divider fino */}
        <div style={{ width: 48, height: 1, background: 'rgba(240,230,211,0.25)', margin: '0.1rem auto' }} />

        {/* Botões CTA */}
        <div
          style={{
            display: 'flex', gap: '0.75rem', flexWrap: 'wrap',
            justifyContent: 'center', animation: 'fadeUp 0.7s 0.54s ease both',
          }}
        >
          <a className="cal-btn" href={calUrl} target="_blank" rel="noopener noreferrer">
            <CalIcon />
            Salvar no Google Calendar
          </a>
          <a className="cal-btn" href={mapsUrl} target="_blank" rel="noopener noreferrer">
            <MapIcon />
            Ver endereço
          </a>
        </div>
      </div>

      <ConfirmAlert />
    </section>
  )
}
