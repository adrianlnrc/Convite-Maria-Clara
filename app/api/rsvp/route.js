import { google } from 'googleapis'

export async function POST(req) {
  const { nomes, confirmado } = await req.json()

  const nomesValidos = Array.isArray(nomes) ? nomes.map(n => String(n).trim()).filter(Boolean) : []
  if (nomesValidos.length === 0 || confirmado === null || confirmado === undefined) {
    return Response.json({ error: 'Dados inválidos.' }, { status: 400 })
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  const sheets = google.sheets({ version: 'v4', auth })
  const timestamp = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID,
    range: 'Sheet1!A:C',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[timestamp, nomesValidos.join(', '), confirmado ? 'Sim' : 'Não']],
    },
  })

  return Response.json({ ok: true })
}
