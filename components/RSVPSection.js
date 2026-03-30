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

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ScrollHint() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    function onScroll() {
      if (window.scrollY > 40) setVisible(false)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

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
        pointerEvents: 'none',
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
      <span>Ver detalhes da festa ↓</span>
    </div>
  )
}

export default function RSVPSection() {
  const [nomes, setNomes] = useState([''])
  const [confirmado, setConfirmado] = useState(null) // true | false | null
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [duplicados, setDuplicados] = useState([])

  function addNome() {
    if (nomes.length >= 10) return
    setNomes([...nomes, ''])
  }

  function removeNome(index) {
    if (nomes.length <= 1) return
    setNomes(nomes.filter((_, i) => i !== index))
  }

  function updateNome(index, value) {
    const updated = [...nomes]
    updated[index] = value
    setNomes(updated)
    if (duplicados.length > 0) setDuplicados([])
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const nomesValidos = nomes.map(n => n.trim()).filter(Boolean)
    if (nomesValidos.length === 0 || confirmado === null) return

    setStatus('loading')
    setDuplicados([])
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nomes: nomesValidos, confirmado }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.error === 'duplicate') {
          setDuplicados(data.duplicados)
          setStatus('idle')
          return
        }
        throw new Error()
      }
      setStatus('success')
      window.dispatchEvent(new CustomEvent('rsvp-lit'))
    } catch {
      setStatus('error')
    }
  }

  const isFormValid = nomes.some(n => n.trim()) && confirmado !== null

  return (
    <section
      id="rsvp"
      style={{
        minHeight: '100svh',
        height: 'auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'radial-gradient(ellipse at 50% 18%, #b02424 0%, #7a1212 32%, #3a0808 65%, #1a0505 100%)',
        padding: 'clamp(2.5rem, 6vh, 4rem) 1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: 'clamp(0.75rem, 2vh, 1.5rem)', width: '100%', maxWidth: 480 }}>
        <div style={{ flex: 1, height: 1, background: 'rgba(200,148,10,0.4)' }} />
        <span style={{ color: '#C8940A', fontSize: 18, opacity: 0.85 }}>✦</span>
        <div style={{ flex: 1, height: 1, background: 'rgba(200,148,10,0.4)' }} />
      </div>

      <h2
        style={{
          fontFamily: 'var(--font-playfair), serif',
          fontSize: 'clamp(1.8rem, 6vw, 3rem)',
          fontWeight: 700,
          color: '#ffffff',
          letterSpacing: '0.04em',
          textAlign: 'center',
          marginBottom: 'clamp(0.6rem, 2vh, 1.2rem)',
          textShadow: '3px 3px 0 #1a0a00, -1px -1px 0 #1a0a00',
        }}
      >
        Confirme sua Presença
      </h2>

      {/* Card de data e hora */}
      <div
        style={{
          width: '100%',
          maxWidth: 400,
          marginBottom: 'clamp(0.75rem, 2vh, 1.5rem)',
          border: '2px solid #1a0a00',
          borderRadius: 40,
          padding: '14px 28px',
          background: 'rgba(26,5,5,0.55)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '0.55rem',
          boxShadow: '3px 3px 0 #1a0a00',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-lora), serif',
            fontSize: 'clamp(1rem, 3vw, 1.2rem)',
            fontWeight: 600,
            color: '#ffffff',
            letterSpacing: '0.04em',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
          }}
        >
          <span style={{ fontSize: '1.1em' }}>📅</span>
          <span>01/05/2026 &mdash; Sexta-feira</span>
        </p>
        <p
          style={{
            fontFamily: 'var(--font-lora), serif',
            fontSize: 'clamp(1rem, 3vw, 1.2rem)',
            fontWeight: 600,
            color: '#ffffff',
            letterSpacing: '0.04em',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
          }}
        >
          <span style={{ fontSize: '1.1em' }}>🕢</span>
          <span>19:30 as 00:00 </span>
        </p>
      </div>

      {status === 'success' ? (
        <div style={{ textAlign: 'center', animation: 'fadeUp 0.6s ease both', maxWidth: 420 }}>
          <div style={{ fontSize: 48, marginBottom: '1rem' }}>
            {confirmado ? '🎉' : '😢'}
          </div>
          <p
            style={{
              fontFamily: 'var(--font-playfair), serif',
              fontSize: 'clamp(1.2rem, 4vw, 1.6rem)',
              color: '#f0e6d3',
              fontWeight: 700,
              marginBottom: '0.5rem',
            }}
          >
            {confirmado ? 'Presença confirmada!' : 'Que pena que não poderá ir!'}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-lora), serif',
              fontSize: '0.95rem',
              color: 'rgba(240,230,211,0.6)',
              marginBottom: '1.5rem',
            }}
          >
            {confirmado
              ? `Te esperamos lá, ${nomes[0].split(' ')[0]}!`
              : 'Obrigada por avisar! Vamos sentir sua falta.'}
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(0.65rem, 2vh, 1rem)',
            width: '100%',
            maxWidth: 420,
          }}
        >
          {/* Names */}
          <label
            style={{
              fontFamily: 'var(--font-lora), serif',
              fontSize: '0.85rem',
              color: 'rgba(255,245,230,0.85)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '-0.3rem',
            }}
          >
            Coloque seu nome e sobrenome
          </label>

          {nomes.map((nome, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                className="rsvp-input"
                type="text"
                placeholder={i === 0 ? 'Seu nome completo' : `Acompanhante ${i}`}
                value={nome}
                onChange={e => updateNome(i, e.target.value)}
                required={i === 0}
                disabled={status === 'loading'}
              />
              {nomes.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeNome(i)}
                  disabled={status === 'loading'}
                  style={{
                    background: 'rgba(240,230,211,0.08)',
                    border: '1.5px solid rgba(240,230,211,0.2)',
                    borderRadius: '50%',
                    width: 36,
                    height: 36,
                    minWidth: 36,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(240,230,211,0.5)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,120,120,0.5)'
                    e.currentTarget.style.color = 'rgba(255,120,120,0.8)'
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.borderColor = 'rgba(240,230,211,0.2)'
                    e.currentTarget.style.color = 'rgba(240,230,211,0.5)'
                  }}
                >
                  <TrashIcon />
                </button>
              )}
            </div>
          ))}

          {nomes.length < 10 && (
            <button
              type="button"
              onClick={addNome}
              disabled={status === 'loading'}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                background: 'transparent',
                border: '1.5px dashed rgba(240,230,211,0.25)',
                borderRadius: 40,
                padding: '10px 20px',
                color: 'rgba(240,230,211,0.5)',
                fontFamily: 'var(--font-lora), serif',
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                letterSpacing: '0.3px',
              }}
              onMouseOver={e => {
                e.currentTarget.style.borderColor = 'rgba(212,168,67,0.5)'
                e.currentTarget.style.color = '#C8940A'
              }}
              onMouseOut={e => {
                e.currentTarget.style.borderColor = 'rgba(240,230,211,0.25)'
                e.currentTarget.style.color = 'rgba(240,230,211,0.5)'
              }}
            >
              <PlusIcon />
              Adicionar acompanhante/membro da família 
            </button>
          )}

          {/* Attendance toggle */}
          <label
            style={{
              fontFamily: 'var(--font-lora), serif',
              fontSize: '0.85rem',
              color: 'rgba(255,245,230,0.85)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginTop: '0.5rem',
              marginBottom: '-0.3rem',
            }}
          >
            Você poderá ir?
          </label>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => setConfirmado(true)}
              disabled={status === 'loading'}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '14px 20px',
                borderRadius: 40,
                border: confirmado === true
                  ? '2px solid #C8940A'
                  : '1.5px solid rgba(240,230,211,0.25)',
                background: confirmado === true
                  ? 'rgba(200,148,10,0.12)'
                  : 'rgba(26,5,5,0.5)',
                color: confirmado === true ? '#C8940A' : 'rgba(240,230,211,0.6)',
                fontFamily: 'var(--font-lora), serif',
                fontSize: '0.95rem',
                fontWeight: confirmado === true ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.25s ease',
              }}
            >
              <CheckIcon />
              Vou conseguir ir
            </button>

            <button
              type="button"
              onClick={() => setConfirmado(false)}
              disabled={status === 'loading'}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '14px 20px',
                borderRadius: 40,
                border: confirmado === false
                  ? '2px solid rgba(255,120,120,0.6)'
                  : '1.5px solid rgba(240,230,211,0.25)',
                background: confirmado === false
                  ? 'rgba(255,120,120,0.08)'
                  : 'rgba(26,5,5,0.5)',
                color: confirmado === false ? 'rgba(255,140,140,0.9)' : 'rgba(240,230,211,0.6)',
                fontFamily: 'var(--font-lora), serif',
                fontSize: '0.95rem',
                fontWeight: confirmado === false ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.25s ease',
              }}
            >
              <XIcon />
              Não vou conseguir
            </button>
          </div>

          <button
            type="submit"
            className="cal-btn"
            disabled={status === 'loading' || !isFormValid}
            style={{
              justifyContent: 'center',
              marginTop: '0.5rem',
              opacity: (status === 'loading' || !isFormValid) ? 0.5 : 1,
              cursor: (status === 'loading' || !isFormValid) ? 'not-allowed' : 'pointer',
            }}
          >
            {status === 'loading' ? 'Enviando...' : 'Enviar Resposta'}
          </button>

          {duplicados.length > 0 && (
            <p
              style={{
                fontFamily: 'var(--font-lora), serif',
                fontSize: '0.85rem',
                color: 'rgba(255,180,80,0.95)',
                textAlign: 'center',
                lineHeight: 1.5,
              }}
            >
              {duplicados.length === 1
                ? `"${duplicados[0]}" já confirmou presença.`
                : `Os nomes ${duplicados.map(n => `"${n}"`).join(', ')} já confirmaram presença.`}
              {' '}Por favor, verifique os nomes informados.
            </p>
          )}

          {status === 'error' && (
            <p
              style={{
                fontFamily: 'var(--font-lora), serif',
                fontSize: '0.85rem',
                color: 'rgba(255,120,120,0.85)',
                textAlign: 'center',
              }}
            >
              Erro ao enviar. Tente novamente.
            </p>
          )}
        </form>
      )}

      <ScrollHint />
    </section>
  )
}
