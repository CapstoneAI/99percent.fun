'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const ALIEN = 'https://res.cloudinary.com/downrfwwt/image/upload/v1773432793/ChatGPT_Image_13_mar_2026_21_01_48_iwof3p.png'

const links = [
  { href: '/',           label: 'Home',       icon: '⬡' },
  { href: '/new',        label: 'New',         icon: '✦' },
  { href: '/graduated',  label: 'Graduated',   icon: '◈' },
]

export default function Sidebar() {
  const path = usePathname()
  return (
    <aside style={{
      width: 200, minWidth: 200, minHeight: '100vh',
      background: 'rgba(5,13,24,0.98)',
      borderRight: '1px solid rgba(41,212,245,0.1)',
      display: 'flex', flexDirection: 'column',
      padding: '24px 0', gap: 4,
      position: 'sticky', top: 0, zIndex: 40,
    }}>
      {links.map(l => {
        const active = path === l.href
        return (
          <Link key={l.href} href={l.href} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '11px 20px',
            background: active ? 'rgba(41,212,245,0.08)' : 'transparent',
            borderLeft: active ? '2px solid #29d4f5' : '2px solid transparent',
            color: active ? '#29d4f5' : 'rgba(255,255,255,0.5)',
            fontFamily: "'Syne', sans-serif",
            fontSize: 14, fontWeight: active ? 700 : 500,
            letterSpacing: '0.04em',
            textDecoration: 'none',
            transition: 'all 0.2s',
          }}>
            <span style={{ fontSize: 16, opacity: active ? 1 : 0.5 }}>{l.icon}</span>
            {l.label}
          </Link>
        )
      })}

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Launch Token */}
      <div style={{ padding: '0 16px' }}>
        <Link href="/create" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 8, padding: '12px 16px', borderRadius: 10,
          background: '#29d4f5', color: '#050d18',
          fontFamily: "'Syne', sans-serif",
          fontSize: 13, fontWeight: 800,
          letterSpacing: '0.06em', textDecoration: 'none',
          textTransform: 'uppercase',
        }}>
          <img src={ALIEN} alt="" style={{ width: 20, height: 20, borderRadius: '50%' }} />
          Launch Token
        </Link>
      </div>

      {/* Version */}
      <div style={{ padding: '12px 20px' }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: 'rgba(41,212,245,0.3)', letterSpacing: '0.1em' }}>
          99PERCENT.ONE
        </span>
      </div>
    </aside>
  )
}
