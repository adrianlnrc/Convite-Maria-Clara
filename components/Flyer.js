'use client'

import dynamic from 'next/dynamic'

const CrownCanvas = dynamic(() => import('./CrownCanvas'), {
  ssr: false,
  loading: () => <div style={{ width: 200, height: 160 }} />,
})

// ── Google Calendar URL ───────────────────────────────────────
const calUrl = (() => {
  const u = new URL('https://www.google.com/calendar/render')
  u.searchParams.set('action', 'TEMPLATE')
  u.searchParams.set('text', '20 Anos Maria Clara 🎉')
  u.searchParams.set('dates', '20260501T193000/20260501T230000')
  u.searchParams.set('details', 'Festa de aniversário de 20 anos da Maria Clara! Venha comemorar!')
  u.searchParams.set('location', 'Quarta 204 lote 7, Residencial Impérium, Águas Claras')
  return u.toString()
})()

// ── SVG: Bandeirinhas (bunting) ──────────────────────────────
function Bunting() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        pointerEvents: 'none',
        zIndex: 3,
        animation: 'buntingSwing 4s ease-in-out infinite',
      }}
    >
      <svg
        viewBox="0 0 420 56"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: 56, display: 'block' }}
      >
        {/* string */}
        <path
          d="M8,6 Q105,28 210,6 Q315,28 412,6"
          stroke="rgba(240,230,211,0.55)"
          strokeWidth="1.5"
          fill="none"
        />
        {/* flags */}
        {[
          [28,  6, 40,  6, 34, 24],
          [63, 14, 75, 14, 69, 32],
          [98,  6,110,  6,104, 24],
          [138,18,150,18,144, 36],
          [175, 8,187,  8,181, 26],
          [208,18,220,18,214, 36],
          [245, 8,257,  8,251, 26],
          [282,18,294,18,288, 36],
          [316, 6,328,  6,322, 24],
          [350,16,362,16,356, 34],
          [383, 6,395,  6,389, 24],
        ].map(([x1, y1, x2, y2, xT, yT], i) => (
          <polygon
            key={i}
            points={`${x1},${y1} ${x2},${y2} ${xT},${yT}`}
            fill="rgba(240,230,211,0.12)"
            stroke="rgba(240,230,211,0.5)"
            strokeWidth="1.4"
          />
        ))}
      </svg>
    </div>
  )
}

// ── SVG: Bow ──────────────────────────────────────────────────
function Bow() {
  return (
    <svg
      width="88"
      height="46"
      viewBox="0 0 88 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', zIndex: 2 }}
    >
      {/* left loop */}
      <path
        d="M44,23 Q30,10 14,14 Q5,18 14,27 Q23,33 44,23Z"
        stroke="#f0e6d3"
        strokeWidth="1.8"
        fill="none"
        strokeLinejoin="round"
      />
      {/* right loop */}
      <path
        d="M44,23 Q58,10 74,14 Q83,18 74,27 Q65,33 44,23Z"
        stroke="#f0e6d3"
        strokeWidth="1.8"
        fill="none"
        strokeLinejoin="round"
      />
      {/* center knot */}
      <circle cx="44" cy="23" r="3.5" stroke="#f0e6d3" strokeWidth="1.5" fill="none" />
      {/* tails */}
      <line x1="44" y1="26.5" x2="40" y2="43" stroke="#f0e6d3" strokeWidth="1.3" />
      <line x1="44" y1="26.5" x2="48" y2="43" stroke="#f0e6d3" strokeWidth="1.3" />
    </svg>
  )
}

// ── SVG: Three Balloons ───────────────────────────────────────
function Balloons() {
  const balloons = [
    { cx: 50, rot: -10, delay: '0s', floatClass: 'balloon-float-1' },
    { cx: 50, rot:   0, delay: '0.4s', floatClass: 'balloon-float-2' },
    { cx: 50, rot:  10, delay: '0.8s', floatClass: 'balloon-float-3' },
  ]

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 16,
        zIndex: 2,
        marginTop: 4,
        marginBottom: 4,
      }}
    >
      {balloons.map(({ rot, delay, floatClass }, i) => (
        <svg
          key={i}
          className={floatClass}
          width="52"
          height="90"
          viewBox="0 0 52 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            transform: `rotate(${rot}deg)`,
            transformOrigin: 'bottom center',
            animationDelay: delay,
          }}
        >
          {/* balloon body */}
          <ellipse cx="26" cy="30" rx="20" ry="26" stroke="#f0e6d3" strokeWidth="1.8" fill="none" />
          {/* balloon tip */}
          <path d="M23,56 L26,62 L29,56" stroke="#f0e6d3" strokeWidth="1.4" fill="none" />
          {/* string */}
          <path
            d="M26,62 Q20,72 26,82"
            stroke="rgba(240,230,211,0.6)"
            strokeWidth="1.2"
            fill="none"
          />
          {/* small highlight */}
          <ellipse cx="18" cy="20" rx="4" ry="6" stroke="rgba(240,230,211,0.3)" strokeWidth="1" fill="none" />
        </svg>
      ))}
    </div>
  )
}

// ── SVG: Gift box ─────────────────────────────────────────────
function GiftBox({ style }) {
  return (
    <svg
      width="56"
      height="62"
      viewBox="0 0 56 62"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <rect x="6" y="24" width="44" height="34" rx="2" stroke="rgba(240,230,211,0.7)" strokeWidth="1.6" />
      <rect x="2" y="16" width="52" height="10" rx="2" stroke="rgba(240,230,211,0.7)" strokeWidth="1.6" />
      <line x1="28" y1="16" x2="28" y2="58" stroke="rgba(240,230,211,0.5)" strokeWidth="1.4" />
      {/* bow on lid */}
      <path d="M28,16 Q22,6 15,10 Q10,14 15,17" stroke="rgba(240,230,211,0.7)" strokeWidth="1.4" fill="none" />
      <path d="M28,16 Q34,6 41,10 Q46,14 41,17" stroke="rgba(240,230,211,0.7)" strokeWidth="1.4" fill="none" />
    </svg>
  )
}

// ── Scattered stars ───────────────────────────────────────────
const STARS = [
  { top: '88px', left: '22px', size: 14, delay: '0s' },
  { top: '114px', left: '46px', size: 10, delay: '0.6s' },
  { top: '78px', right: '24px', size: 14, delay: '0.3s' },
  { top: '110px', right: '48px', size: 10, delay: '0.9s' },
  { top: '340px', left: '18px', size: 10, delay: '1.2s' },
  { top: '360px', right: '20px', size: 10, delay: '0.7s' },
]

function Stars() {
  return (
    <>
      {STARS.map((s, i) => (
        <span
          key={i}
          className="star-deco"
          style={{
            top: s.top,
            left: s.left,
            right: s.right,
            fontSize: s.size,
            animationDelay: s.delay,
            animationDuration: `${2.2 + i * 0.3}s`,
          }}
        >
          ✦
        </span>
      ))}
    </>
  )
}

// ── Calendar icon SVG ─────────────────────────────────────────
function CalIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="18" height="17" rx="2" stroke="#7a1212" strokeWidth="2" />
      <line x1="3" y1="9" x2="21" y2="9" stroke="#7a1212" strokeWidth="2" />
      <line x1="8" y1="2" x2="8" y2="6" stroke="#7a1212" strokeWidth="2" strokeLinecap="round" />
      <line x1="16" y1="2" x2="16" y2="6" stroke="#7a1212" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// ── Main Flyer component ──────────────────────────────────────
export default function Flyer() {
  return (
    <article className="flyer-card">
      {/* Background decorations */}
      <Bunting />
      <Stars />

      {/* Gift boxes — decorative sides */}
      <GiftBox
        style={{
          position: 'absolute',
          left: 6,
          bottom: 72,
          opacity: 0.6,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <GiftBox
        style={{
          position: 'absolute',
          right: 6,
          bottom: 72,
          opacity: 0.5,
          zIndex: 0,
          transform: 'scaleX(-1)',
          pointerEvents: 'none',
        }}
      />

      {/* 3D Crown */}
      <div className="crown-container anim-1">
        <CrownCanvas />
      </div>

      {/* Main titles */}
      <div
        className="anim-2"
        style={{
          fontFamily: 'var(--font-playfair), serif',
          fontSize: 'clamp(56px, 16vw, 76px)',
          fontWeight: 900,
          color: '#f0e6d3',
          lineHeight: 1,
          letterSpacing: '-1px',
          textAlign: 'center',
          textShadow: '3px 3px 0px #3a0808, -1px -1px 0px #3a0808',
          zIndex: 2,
        }}
      >
        20 ANOS
      </div>

      <div
        className="anim-3"
        style={{
          fontFamily: 'var(--font-playfair), serif',
          fontSize: 'clamp(36px, 12vw, 54px)',
          fontWeight: 900,
          color: '#f0e6d3',
          lineHeight: 1,
          letterSpacing: '2px',
          textAlign: 'center',
          textShadow: '3px 3px 0px #3a0808, -1px -1px 0px #3a0808',
          marginTop: 4,
          zIndex: 2,
        }}
      >
        MARIA CLARA
      </div>

      {/* Bow */}
      <div className="anim-4" style={{ marginTop: 14, marginBottom: 10, zIndex: 2 }}>
        <Bow />
      </div>

      {/* Date */}
      <div className="date-box anim-5" style={{ zIndex: 2 }}>
        <span
          style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 26,
            fontWeight: 700,
            color: '#f0e6d3',
            letterSpacing: '1px',
          }}
        >
          01/05 às 19h30
        </span>
      </div>

      {/* Location */}
      <div
        className="anim-6"
        style={{
          textAlign: 'center',
          color: '#f0e6d3',
          fontFamily: 'var(--font-lora), serif',
          fontSize: 15,
          lineHeight: 1.7,
          marginTop: 14,
          zIndex: 2,
          opacity: 0.92,
        }}
      >
        Quarta 204 lote 7<br />
        Residencial Impérium<br />
        Águas Claras
      </div>

      {/* Balloons */}
      <div className="anim-6" style={{ marginTop: 18, zIndex: 2 }}>
        <Balloons />
      </div>

      {/* Divider */}
      <div
        style={{
          width: 56,
          height: 1,
          background: 'rgba(240,230,211,0.35)',
          margin: '14px auto',
          zIndex: 2,
        }}
      />

      {/* Google Calendar button */}
      <a
        className="cal-btn anim-7"
        href={calUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{ zIndex: 2 }}
      >
        <CalIcon />
        Salvar no Google Calendar
      </a>
    </article>
  )
}
