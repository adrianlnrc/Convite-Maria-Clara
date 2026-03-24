'use client'

import dynamic from 'next/dynamic'

const CrownCanvas = dynamic(() => import('./CrownCanvas'), {
  ssr: false,
  loading: () => <div style={{ width: '100%', height: '100%' }} />,
})

const STARS = [
  { top: '8%',  left: '6%',   size: 13, delay: '0s',    dur: '2.8s' },
  { top: '14%', left: '14%',  size: 9,  delay: '0.5s',  dur: '3.2s' },
  { top: '6%',  right: '7%',  size: 13, delay: '0.3s',  dur: '2.5s' },
  { top: '12%', right: '15%', size: 9,  delay: '0.9s',  dur: '3.5s' },
  { top: '55%', left: '4%',   size: 10, delay: '1.1s',  dur: '2.9s' },
  { top: '60%', right: '5%',  size: 10, delay: '0.7s',  dur: '3.1s' },
  { top: '80%', left: '10%',  size: 8,  delay: '1.4s',  dur: '2.6s' },
  { top: '75%', right: '11%', size: 8,  delay: '0.2s',  dur: '3.4s' },
  { top: '35%', left: '2%',   size: 7,  delay: '1.8s',  dur: '2.2s' },
  { top: '40%', right: '3%',  size: 7,  delay: '1.6s',  dur: '2.7s' },
]

function StarField() {
  return (
    <>
      {STARS.map((s, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            top: s.top,
            left: s.left,
            right: s.right,
            fontSize: s.size,
            color: '#f0e6d3',
            opacity: 0.5,
            pointerEvents: 'none',
            animation: `twinkle ${s.dur} ${s.delay} ease-in-out infinite`,
            zIndex: 1,
          }}
        >
          ✦
        </span>
      ))}
    </>
  )
}

function ScrollIndicator() {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.4rem',
        color: 'rgba(240,230,211,0.45)',
        fontFamily: 'var(--font-lora), serif',
        fontSize: '0.7rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        animation: 'scrollBounce 2.2s ease-in-out infinite',
        zIndex: 2,
      }}
    >
      <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
        <path
          d="M8 2 L8 14 M3 10 L8 15 L13 10"
          stroke="rgba(240,230,211,0.5)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>Role para ver os detalhes</span>
    </div>
  )
}

export default function HeroSection() {
  return (
    <section
      style={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background:
          'radial-gradient(ellipse at 50% 15%, #b02424 0%, #7a1212 38%, #3a0808 72%, #1a0505 100%)',
        overflow: 'hidden',
      }}
    >
      <StarField />

      {/* Crown */}
      <div
        style={{
          width: 'min(62vw, 640px)',
          height: 'min(38vw, 390px)',
          minWidth: 280,
          minHeight: 180,
          zIndex: 2,
          animation: 'fadeUp 0.8s ease both',
        }}
      >
        <CrownCanvas />
      </div>

      {/* Name + floating tiara */}
      <div style={{ position: 'relative', zIndex: 2, margin: '0.6rem 1rem 0' }}>
        {/* Floating diagonal tiara */}
        <svg
          viewBox="0 0 160 88"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: 'absolute',
            top: '-52px',
            right: '-18px',
            width: 'clamp(90px, 14vw, 148px)',
            pointerEvents: 'none',
            animation: 'tiaraFloat 3.4s ease-in-out infinite',
            filter: 'drop-shadow(0 0 8px rgba(212,168,67,0.55))',
            zIndex: 3,
          }}
        >
          {/* Base band */}
          <path
            d="M8,67 Q80,78 152,67 L152,74 Q80,84 8,74 Z"
            fill="rgba(212,168,67,0.12)"
            stroke="#D4A843"
            strokeWidth="1.6"
          />

          {/* Studs along band */}
          {[18,28,38,50,62,72,80,88,98,110,122,132,142].map((x, i) => (
            <circle key={i} cx={x} cy={67} r="1.8" fill="#D4A843" opacity="0.8" />
          ))}

          {/* Outer left arch */}
          <path
            d="M14,67 C14,56 18,42 30,38 C42,42 46,56 46,67 Z"
            fill="rgba(212,168,67,0.08)"
            stroke="#D4A843"
            strokeWidth="1.5"
          />
          {/* Inner left arch */}
          <path
            d="M40,67 C39,50 44,28 56,22 C68,28 73,50 72,67 Z"
            fill="rgba(212,168,67,0.08)"
            stroke="#D4A843"
            strokeWidth="1.6"
          />
          {/* Center arch (tallest, gothic pointed) */}
          <path
            d="M64,67 C62,42 68,14 80,6 C92,14 98,42 96,67 Z"
            fill="rgba(212,168,67,0.10)"
            stroke="#D4A843"
            strokeWidth="1.8"
          />
          {/* Inner right arch */}
          <path
            d="M88,67 C87,50 92,28 104,22 C116,28 121,50 120,67 Z"
            fill="rgba(212,168,67,0.08)"
            stroke="#D4A843"
            strokeWidth="1.6"
          />
          {/* Outer right arch */}
          <path
            d="M114,67 C114,56 118,42 130,38 C142,42 146,56 146,67 Z"
            fill="rgba(212,168,67,0.08)"
            stroke="#D4A843"
            strokeWidth="1.5"
          />

          {/* Left scroll end */}
          <path
            d="M8,67 C4,62 2,54 6,49 C10,45 15,50 12,57"
            fill="none"
            stroke="#D4A843"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          {/* Right scroll end */}
          <path
            d="M152,67 C156,62 158,54 154,49 C150,45 145,50 148,57"
            fill="none"
            stroke="#D4A843"
            strokeWidth="1.4"
            strokeLinecap="round"
          />

          {/* Center teardrop gem (hanging inside center arch) */}
          <path
            d="M80,18 C86,23 86,36 80,41 C74,36 74,23 80,18 Z"
            fill="rgba(232,244,255,0.75)"
            stroke="#f0e6d3"
            strokeWidth="1.2"
          />
          {/* Gem highlight */}
          <ellipse cx="77" cy="24" rx="1.8" ry="3" fill="rgba(255,255,255,0.6)" />

          {/* Small circle gems at arch peaks */}
          <circle cx="80" cy="6"  r="3.2" fill="#D4A843" stroke="#f0e6d3" strokeWidth="1" />
          <circle cx="56" cy="22" r="2.6" fill="#D4A843" stroke="#f0e6d3" strokeWidth="0.9" />
          <circle cx="104" cy="22" r="2.6" fill="#D4A843" stroke="#f0e6d3" strokeWidth="0.9" />
          <circle cx="30" cy="38" r="2.2" fill="#D4A843" stroke="#f0e6d3" strokeWidth="0.8" />
          <circle cx="130" cy="38" r="2.2" fill="#D4A843" stroke="#f0e6d3" strokeWidth="0.8" />
        </svg>

        <h1
          style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 'clamp(2.6rem, 8.5vw, 6.2rem)',
            fontWeight: 900,
            color: '#f0e6d3',
            letterSpacing: '0.06em',
            textAlign: 'center',
            lineHeight: 1,
            textShadow:
              '2px 2px 0px #3a0808, -1px -1px 0px #3a0808, 0 0 50px rgba(212,168,67,0.18)',
            animation: 'fadeUp 0.8s 0.12s ease both',
          }}
        >
          MARIA CLARA
        </h1>
      </div>

      {/* Subtitle */}
      <p
        style={{
          fontFamily: 'var(--font-lora), serif',
          fontSize: 'clamp(1rem, 3vw, 1.7rem)',
          color: '#D4A843',
          letterSpacing: '0.38em',
          marginTop: '0.5rem',
          textAlign: 'center',
          zIndex: 2,
          animation: 'fadeUp 0.8s 0.24s ease both',
          opacity: 0.9,
        }}
      >
        20 ANOS
      </p>

      <ScrollIndicator />
    </section>
  )
}
