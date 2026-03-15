'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const ALIEN = 'https://res.cloudinary.com/downrfwwt/image/upload/v1773432793/ChatGPT_Image_13_mar_2026_21_01_48_iwof3p.png'

export default function Sidebar() {
  const path = usePathname()
  const a = (href: string) => path === href

  const item = (href: string, label: string, border = false) => (
    <Link href={href} style={{
      display:'flex', alignItems:'center', padding:'10px 14px',
      background: a(href) ? 'rgba(41,212,245,0.1)' : 'transparent',
      borderBottom: border ? '1px solid rgba(41,212,245,0.08)' : 'none',
      color: a(href) ? '#29d4f5' : 'rgba(255,255,255,0.55)',
      fontFamily:"'Syne',sans-serif", fontSize:13,
      fontWeight: a(href) ? 700 : 500,
      letterSpacing:'0.04em', textDecoration:'none', transition:'all 0.2s',
    }}>{label}</Link>
  )

  return (
    <aside style={{
      width:200, minWidth:200, minHeight:'100vh',
      background:'rgba(5,13,24,0.98)',
      borderRight:'1px solid rgba(41,212,245,0.1)',
      display:'flex', flexDirection:'column',
      padding:'24px 0', gap:4,
      position:'sticky', top:0, zIndex:40,
    }}>
      <Link href="/" style={{
        display:'flex', alignItems:'center', padding:'11px 20px',
        background: a('/') ? 'rgba(41,212,245,0.08)' : 'transparent',
        borderLeft: a('/') ? '2px solid #29d4f5' : '2px solid transparent',
        color: a('/') ? '#29d4f5' : 'rgba(255,255,255,0.5)',
        fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight: a('/')?700:500,
        letterSpacing:'0.04em', textDecoration:'none', transition:'all 0.2s',
      }}>Home</Link>

      <div style={{margin:'12px 0 4px 20px', fontFamily:"'Space Mono',monospace", fontSize:8, color:'rgba(41,212,245,0.3)', letterSpacing:'0.12em'}}>
        TOKENS
      </div>

      <div style={{margin:'0 12px', border:'1px solid rgba(41,212,245,0.1)', borderRadius:10, overflow:'hidden'}}>
        {item('/new', 'New', true)}
        {item('/graduated', 'Graduated', true)}
        {item('/liftoff', 'Liftoff')}
      </div>

      <div style={{flex:1}} />

      <div style={{padding:'0 12px'}}>
        <Link href="/create" style={{
          display:'flex', alignItems:'center', justifyContent:'center', gap:8,
          padding:'12px 16px', borderRadius:10,
          background:'#29d4f5', color:'#050d18',
          fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:800,
          letterSpacing:'0.06em', textDecoration:'none', textTransform:'uppercase',
        }}>
          <img src={ALIEN} alt="" style={{width:20,height:20,borderRadius:'50%'}}/>
          Launch Token
        </Link>
      </div>

      <div style={{padding:'12px 20px'}}>
        <span style={{fontFamily:"'Space Mono',monospace", fontSize:9, color:'rgba(41,212,245,0.3)', letterSpacing:'0.1em'}}>
          99PERCENT.ONE
        </span>
      </div>
    </aside>
  )
}
