import { NextResponse } from 'next/server'

export async function POST(req) {
  const { nome, telefone } = await req.json()

  if (!nome?.trim() || !telefone?.trim()) {
    return NextResponse.json({ error: 'Campos obrigatórios.' }, { status: 400 })
  }

  const payload = {
    nome: nome.trim(),
    telefone: telefone.trim(),
    data_criada: new Date().toLocaleString('pt-BR'),
  }

  const res = await fetch(process.env.N8N_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'Erro ao notificar.' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
