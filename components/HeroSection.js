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

      {/* Name */}
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
          margin: '0.6rem 1rem 0',
          zIndex: 2,
          animation: 'fadeUp 0.8s 0.12s ease both',
        }}
      >
        MARIA CLARA
      </h1>

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
