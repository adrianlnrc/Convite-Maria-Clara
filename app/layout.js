import { Playfair_Display, Lora } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700', '900'],
  variable: '--font-playfair',
  display: 'swap',
})

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-lora',
  display: 'swap',
})

export const metadata = {
  title: '20 Anos — Maria Clara',
  description: 'Você está convidado para os 20 anos da Maria Clara!',
  openGraph: {
    title: '20 Anos — Maria Clara',
    description: 'Festa de aniversário de 20 anos • 01/05 às 19h30 • Residencial Impérium, Águas Claras',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${lora.variable}`}>
      <body>{children}</body>
    </html>
  )
}
