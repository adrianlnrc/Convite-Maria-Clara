'use client'

import { useState } from 'react'

function formatPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return digits
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 11)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  return value
}

export default function RSVPSection() {
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  function handlePhone(e) {
    setTelefone(formatPhone(e.target.value))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!nome.trim() || !telefone.trim()) return
    setStatus('loading')
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, telefone }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'radial-gradient(ellipse at 50% 0%, #7a1212 0%, #3a0808 55%, #1a0505 100%)',
        padding: '4rem 1.5rem',
      }}
    >
      {/* Decorative divider */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '2.5rem',
          width: '100%',
          maxWidth: 480,
        }}
      >
        <div style={{ flex: 1, height: 1, background: 'rgba(212,168,67,0.35)' }} />
        <span style={{ color: '#D4A843', fontSize: 18, opacity: 0.8 }}>✦</span>
        <div style={{ flex: 1, height: 1, background: 'rgba(212,168,67,0.35)' }} />
      </div>

      <h2
        style={{
          fontFamily: 'var(--font-playfair), serif',
          fontSize: 'clamp(1.8rem, 6vw, 3rem)',
          fontWeight: 700,
          color: '#f0e6d3',
          letterSpacing: '0.04em',
          textAlign: 'center',
          marginBottom: '0.5rem',
        }}
      >
        Confirme sua Presença
      </h2>

      <p
        style={{
          fontFamily: 'var(--font-lora), serif',
          fontSize: 'clamp(0.85rem, 2.5vw, 1rem)',
          color: 'rgba(212,168,67,0.8)',
          letterSpacing: '0.15em',
          textAlign: 'center',
          marginBottom: '2.5rem',
          textTransform: 'uppercase',
        }}
      >
        01 de Maio · 19h30
      </p>

      {status === 'success' ? (
        <div
          style={{
            textAlign: 'center',
            animation: 'fadeUp 0.6s ease both',
            maxWidth: 400,
          }}
        >
          <div style={{ fontSize: 48, marginBottom: '1rem' }}>🎉</div>
          <p
            style={{
              fontFamily: 'var(--font-playfair), serif',
              fontSize: 'clamp(1.2rem, 4vw, 1.6rem)',
              color: '#f0e6d3',
              fontWeight: 700,
              marginBottom: '0.5rem',
            }}
          >
            Presença confirmada!
          </p>
          <p
            style={{
              fontFamily: 'var(--font-lora), serif',
              fontSize: '0.95rem',
              color: 'rgba(240,230,211,0.6)',
            }}
          >
            Te esperamos lá, {nome.split(' ')[0]}!
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            width: '100%',
            maxWidth: 420,
          }}
        >
          <input
            className="rsvp-input"
            type="text"
            placeholder="Seu nome completo"
            value={nome}
            onChange={e => setNome(e.target.value)}
            required
            disabled={status === 'loading'}
          />
          <input
            className="rsvp-input"
            type="tel"
            placeholder="WhatsApp (ex: 61 9xxxx-xxxx)"
            value={telefone}
            onChange={handlePhone}
            required
            disabled={status === 'loading'}
          />

          <button
            type="submit"
            className="cal-btn"
            disabled={status === 'loading'}
            style={{
              justifyContent: 'center',
              marginTop: '0.5rem',
              opacity: status === 'loading' ? 0.7 : 1,
              cursor: status === 'loading' ? 'not-allowed' : 'pointer',
            }}
          >
            {status === 'loading' ? 'Enviando...' : 'Confirmar Presença'}
          </button>

          {status === 'error' && (
            <p
              style={{
                fontFamily: 'var(--font-lora), serif',
                fontSize: '0.85rem',
                color: 'rgba(255,120,120,0.85)',
                textAlign: 'center',
              }}
            >
              Erro ao confirmar. Tente novamente.
            </p>
          )}
        </form>
      )}

      {/* Bottom decorative divider */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginTop: '3rem',
          width: '100%',
          maxWidth: 480,
        }}
      >
        <div style={{ flex: 1, height: 1, background: 'rgba(212,168,67,0.2)' }} />
        <span style={{ color: '#D4A843', fontSize: 14, opacity: 0.5 }}>✦</span>
        <div style={{ flex: 1, height: 1, background: 'rgba(212,168,67,0.2)' }} />
      </div>
    </section>
  )
}
