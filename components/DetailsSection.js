'use client'

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

// ── SVG: Bandeirinhas ─────────────────────────────────────────
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
        <path
          d="M8,6 Q105,28 210,6 Q315,28 412,6"
          stroke="rgba(240,230,211,0.45)"
          strokeWidth="1.5"
          fill="none"
        />
        {[
          [28,6,40,6,34,24],
          [63,14,75,14,69,32],
          [98,6,110,6,104,24],
          [138,18,150,18,144,36],
          [175,8,187,8,181,26],
          [208,18,220,18,214,36],
          [245,8,257,8,251,26],
          [282,18,294,18,288,36],
          [316,6,328,6,322,24],
          [350,16,362,16,356,34],
          [383,6,395,6,389,24],
        ].map(([x1,y1,x2,y2,xT,yT], i) => (
          <polygon
            key={i}
            points={`${x1},${y1} ${x2},${y2} ${xT},${yT}`}
            fill="rgba(240,230,211,0.10)"
            stroke="rgba(240,230,211,0.45)"
            strokeWidth="1.3"
          />
        ))}
      </svg>
    </div>
  )
}

// ── SVG: Bow ──────────────────────────────────────────────────
function Bow() {
  return (
    <svg width="88" height="46" viewBox="0 0 88 46" fill="none">
      <path
        d="M44,23 Q30,10 14,14 Q5,18 14,27 Q23,33 44,23Z"
        stroke="#f0e6d3"
        strokeWidth="1.8"
        fill="none"
        strokeLinejoin="round"
      />
      <path
        d="M44,23 Q58,10 74,14 Q83,18 74,27 Q65,33 44,23Z"
        stroke="#f0e6d3"
        strokeWidth="1.8"
        fill="none"
        strokeLinejoin="round"
      />
      <circle cx="44" cy="23" r="3.5" stroke="#f0e6d3" strokeWidth="1.5" fill="none" />
      <line x1="44" y1="26.5" x2="40" y2="43" stroke="#f0e6d3" strokeWidth="1.3" />
      <line x1="44" y1="26.5" x2="48" y2="43" stroke="#f0e6d3" strokeWidth="1.3" />
    </svg>
  )
}

// ── SVG: Balloons ─────────────────────────────────────────────
function Balloons() {
  const configs = [
    { rot: -10, cls: 'balloon-float-1', delay: '0s' },
    { rot:   0, cls: 'balloon-float-2', delay: '0.4s' },
    { rot:  10, cls: 'balloon-float-3', delay: '0.8s' },
  ]
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 4 }}>
      {configs.map(({ rot, cls, delay }, i) => (
        <svg
          key={i}
          className={cls}
          width="52"
          height="90"
          viewBox="0 0 52 90"
          fill="none"
          style={{
            transform: `rotate(${rot}deg)`,
            transformOrigin: 'bottom center',
            animationDelay: delay,
          }}
        >
          <ellipse cx="26" cy="30" rx="20" ry="26" stroke="#f0e6d3" strokeWidth="1.8" fill="none" />
          <path d="M23,56 L26,62 L29,56" stroke="#f0e6d3" strokeWidth="1.4" fill="none" />
          <path
            d="M26,62 Q20,72 26,82"
            stroke="rgba(240,230,211,0.55)"
            strokeWidth="1.2"
            fill="none"
          />
          <ellipse cx="18" cy="20" rx="4" ry="6" stroke="rgba(240,230,211,0.25)" strokeWidth="1" fill="none" />
        </svg>
      ))}
    </div>
  )
}

// ── SVG: Gift box ─────────────────────────────────────────────
function GiftBox({ style }) {
  return (
    <svg width="54" height="60" viewBox="0 0 56 62" fill="none" style={style}>
      <rect x="6" y="24" width="44" height="34" rx="2" stroke="rgba(240,230,211,0.6)" strokeWidth="1.6" />
      <rect x="2" y="16" width="52" height="10" rx="2" stroke="rgba(240,230,211,0.6)" strokeWidth="1.6" />
      <line x1="28" y1="16" x2="28" y2="58" stroke="rgba(240,230,211,0.4)" strokeWidth="1.4" />
      <path d="M28,16 Q22,6 15,10 Q10,14 15,17" stroke="rgba(240,230,211,0.6)" strokeWidth="1.4" fill="none" />
      <path d="M28,16 Q34,6 41,10 Q46,14 41,17" stroke="rgba(240,230,211,0.6)" strokeWidth="1.4" fill="none" />
    </svg>
  )
}

// ── SVG: Calendar icon ────────────────────────────────────────
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

// ── Main Details Section ──────────────────────────────────────
export default function DetailsSection() {
  return (
    <section
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'radial-gradient(ellipse at 50% 100%, #5c0d0d 0%, #2a0505 55%, #1a0a0a 100%)',
        position: 'relative',
        overflow: 'hidden',
        padding: '5rem 1rem 4rem',
      }}
    >
      <Bunting />

      {/* Decorative gift boxes */}
      <GiftBox
        style={{ position: 'absolute', left: 8, bottom: 64, opacity: 0.55, pointerEvents: 'none' }}
      />
      <GiftBox
        style={{
          position: 'absolute', right: 8, bottom: 64, opacity: 0.45,
          transform: 'scaleX(-1)', pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.1rem',
          maxWidth: 480,
          width: '100%',
          zIndex: 2,
        }}
      >
        {/* Bow */}
        <div style={{ animation: 'fadeUp 0.7s ease both' }}>
          <Bow />
        </div>

        {/* Event title */}
        <div style={{ animation: 'fadeUp 0.7s 0.1s ease both', textAlign: 'center' }}>
          <p
            style={{
              fontFamily: 'var(--font-lora), serif',
              fontSize: 'clamp(0.85rem, 2.2vw, 1rem)',
              color: 'rgba(240,230,211,0.7)',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
            }}
          >
            Festa de Aniversário
          </p>
        </div>

        {/* Date box */}
        <div
          className="date-box"
          style={{ animation: 'fadeUp 0.7s 0.2s ease both' }}
        >
          <span
            style={{
              fontFamily: 'var(--font-playfair), serif',
              fontSize: 'clamp(1.3rem, 4vw, 1.7rem)',
              fontWeight: 700,
              color: '#f0e6d3',
              letterSpacing: '1px',
            }}
          >
            01/05 às 19h30
          </span>
        </div>

        {/* Location */}
        <address
          style={{
            textAlign: 'center',
            color: 'rgba(240,230,211,0.88)',
            fontFamily: 'var(--font-lora), serif',
            fontSize: 'clamp(0.9rem, 2.5vw, 1.05rem)',
            lineHeight: 1.8,
            fontStyle: 'normal',
            animation: 'fadeUp 0.7s 0.3s ease both',
          }}
        >
          Quarta 204 lote 7<br />
          Residencial Impérium<br />
          Águas Claras
        </address>

        {/* Balloons */}
        <div style={{ animation: 'fadeUp 0.7s 0.4s ease both', width: '100%' }}>
          <Balloons />
        </div>

        {/* Divider */}
        <div
          style={{
            width: 52,
            height: 1,
            background: 'rgba(240,230,211,0.3)',
            margin: '0.2rem auto',
          }}
        />

        {/* Calendar button */}
        <a
          className="cal-btn"
          href={calUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ animation: 'fadeUp 0.7s 0.5s ease both' }}
        >
          <CalIcon />
          Salvar no Google Calendar
        </a>
      </div>
    </section>
  )
}
