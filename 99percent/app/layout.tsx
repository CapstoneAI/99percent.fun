import type { Metadata } from 'next'
import { Syne, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: '99percent.fun — Cook your token. On Base.',
  description: 'The first Human vs AI Agent token launchpad on Base.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-[#050d18] text-white min-h-screen font-mono antialiased flex flex-col">
        <Providers>
          <Navbar />
        <TickerStrip />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
