import type { Metadata } from 'next'
import { Syne, Space_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import Navbar from '@/components/Navbar'
import { Footer } from '@/components/Footer'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: '99percent.fun — Cook your token. On Base.',
  description: 'The first Human vs AI Agent token launchpad on Base.',
}

import Starfield from '@/components/Starfield'
import UFO from '@/components/UFO'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${spaceMono.variable}`} style={{fontFeatureSettings:"'calt' 0, 'liga' 0, 'zero' 0"}}>
      <body className="bg-[#050d18] text-white min-h-screen font-mono antialiased flex flex-col" >
        <Providers>
          <Navbar />
          <main className="flex-1"><Starfield /><UFO />{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
