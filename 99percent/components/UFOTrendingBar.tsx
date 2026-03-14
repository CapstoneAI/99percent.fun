"use client";
import { useEffect, useRef, useState, useCallback } from "react";

const ALIEN = "https://res.cloudinary.com/downrfwwt/image/upload/v1773432793/ChatGPT_Image_13_mar_2026_21_01_48_iwof3p.png";
interface Token { id: string; name: string; symbol: string; image_url?: string; imageUrl?: string; }

function UFOSVG({ on }: { on: boolean }) {
  return (
    <svg width="100" viewBox="0 0 110 60" xmlns="http://www.w3.org/2000/svg" style={{overflow:'visible',display:'block'}}>
      <defs>
        <radialGradient id="ud"><stop offset="0%" stopColor="#2a3d5c"/><stop offset="55%" stopColor="#111e30"/><stop offset="100%" stopColor="#07101c"/></radialGradient>
        <radialGradient id="ug" cx="50%" cy="50%"><stop offset="0%" stopColor="#29d4f5" stopOpacity="1"/><stop offset="55%" stopColor="#29d4f5" stopOpacity=".4"/><stop offset="100%" stopColor="#29d4f5" stopOpacity="0"/></radialGradient>
        <radialGradient id="udm" cx="38%" cy="28%"><stop offset="0%" stopColor="#3a5a7a" stopOpacity=".95"/><stop offset="100%" stopColor="#0a1726" stopOpacity=".98"/></radialGradient>
        <filter id="ugf"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <ellipse cx="55" cy="42" rx="52" ry="9" fill="#29d4f5" opacity={on?0.13:0.04}/>
      <ellipse cx="55" cy="34" rx="50" ry="13" fill="url(#ud)"/>
      <path d="M 9 29 Q 55 19 101 29" fill="none" stroke="rgba(100,170,230,0.2)" strokeWidth="1.5"/>
      <ellipse cx="55" cy="34" rx="50" ry="13" fill="none" stroke="#1a3050" strokeWidth="0.8"/>
      <ellipse cx="55" cy="37" rx="38" ry="9.5" fill="#060f1c"/>
      <ellipse cx="55" cy="38" rx="27" ry="7" fill="url(#ug)" filter="url(#ugf)" opacity={on?1:0.3} style={{transition:'opacity .4s'}}/>
      <ellipse cx="55" cy="38" rx="19" ry="5" fill="none" stroke="#29d4f5" strokeWidth="2.5" opacity={on?0.95:0.2} style={{transition:'opacity .4s'}}/>
      <ellipse cx="55" cy="38" rx="16" ry="4" fill="#29d4f5" opacity={on?0.22:0.05} style={{transition:'opacity .4s'}}/>
      {[{x:20,c:"#29d4f5"},{x:35,c:"#7f77dd"},{x:55,c:"#29d4f5"},{x:75,c:"#7f77dd"},{x:90,c:"#29d4f5"}].map((l,i)=>(
        <circle key={i} cx={l.x} cy={34} r="2" fill={l.c} opacity={on?1:0.25} style={{filter:on?`drop-shadow(0 0 3px ${l.c})`:'none',transition:'opacity .4s'}}/>
      ))}
      <ellipse cx="55" cy="27" rx="20" ry="6" fill="#0d1b2a"/>
      <ellipse cx="55" cy="19" rx="18" ry="14" fill="url(#udm)"/>
      <ellipse cx="55" cy="27" rx="18" ry="5.5" fill="none" stroke="#1c3452" strokeWidth="0.8"/>
      <ellipse cx="49" cy="14" rx="6" ry="4" fill="white" opacity="0.1"/>
      <ellipse cx="47" cy="13" rx="3" ry="2" fill="white" opacity="0.15"/>
    </svg>
  );
}

function Beam({ h }: { h: number }) {
  if (h <= 0) return null;
  return (
    <svg width="64" height={h} viewBox={`0 0 64 ${h}`} preserveAspectRatio="none" style={{display:'block'}}>
      <defs><linearGradient id="bgg" x1=".5" y1="0" x2=".5" y2="1"><stop offset="0%" stopColor="#29d4f5" stopOpacity=".65"/><stop offset="55%" stopColor="#7f77dd" stopOpacity=".28"/><stop offset="100%" stopColor="#0052ff" stopOpacity="0"/></linearGradient></defs>
      <polygon points={`32,0 0,${h} 64,${h}`} fill="url(#bgg)"/>
    </svg>
  );
}

export default function UFOTrendingBar({ tokens, cardIdPrefix = "trending-card" }: { tokens: Token[], cardIdPrefix?: string }) {
  const [left, setLeft]   = useState("110%");
  const [top, setTop]     = useState(-120);
  const [trans, setTrans] = useState("none");
  const [on, setOn]       = useState(false);
  const [beamH, setBeamH] = useState(0);
  const [carried, setCarried] = useState<Token|null>(null);
  const [cSt, setCSt]     = useState<"hidden"|"show"|"pull"|"drop">("hidden");
  const [ghostIdx, setGhostIdx] = useState(-1);
  const [flashIdx, setFlashIdx] = useState(-1);
  const zoneRef = useRef<HTMLDivElement>(null);
  const busy    = useRef(false);
  const prevRef = useRef<Token[]>([]);
  const raf     = useRef(0);
  const sleep   = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

  const getCenter = useCallback((idx: number) => {
    const zone = zoneRef.current;
    if (!zone) return 80 + idx * 170;
    const zr   = zone.getBoundingClientRect();
    const card = document.getElementById(`${cardIdPrefix}-${idx}`);
    if (!card) return 80 + idx * 170;
    const cr = card.getBoundingClientRect();
    return cr.left - zr.left + cr.width / 2;
  }, []);

  const growBeam = (target: number) => new Promise<void>(res => {
    let h = 0;
    const step = () => { h = Math.min(h+13,target); setBeamH(h); if(h<target) raf.current=requestAnimationFrame(step); else res(); };
    raf.current = requestAnimationFrame(step);
  });

  const shrinkBeam = () => new Promise<void>(res => {
    let h = 0;
    setBeamH(prev => { h = prev; return prev; });
    setTimeout(() => {
      const step = () => { h = Math.max(h-16,0); setBeamH(h); if(h>0) raf.current=requestAnimationFrame(step); else res(); };
      raf.current = requestAnimationFrame(step);
    }, 16);
  });

  const animate = useCallback(async (fromIdx: number, toIdx: number, tok: Token) => {
    if (busy.current) return;
    busy.current = true;
    setCarried(tok);
    const srcX = getCenter(fromIdx);
    const dstX = getCenter(toIdx);

    setTrans("none"); setLeft("110%"); setTop(-120); await sleep(80);
    setTrans("left .75s cubic-bezier(.68,-.3,.27,1.4),top .5s cubic-bezier(.22,1,.36,1)");
    setLeft(srcX+"px"); setTop(4); await sleep(820);
    setOn(true); await growBeam(72); setCSt("show"); await sleep(480);
    setCSt("pull"); setGhostIdx(fromIdx); await sleep(720);
    await shrinkBeam(); setOn(false); setCSt("hidden");
    setTrans("top .4s ease"); setTop(-32); await sleep(380);
    setTrans("left .8s cubic-bezier(.25,.46,.45,.94),top .3s ease");
    setLeft(dstX+"px"); setTop(4); await sleep(880);
    setOn(true); await growBeam(72); setCSt("show"); await sleep(340);
    setCSt("drop"); setGhostIdx(-1); setFlashIdx(toIdx); await sleep(620);
    await shrinkBeam(); setOn(false); setCSt("hidden");
    setTimeout(() => setFlashIdx(-1), 700);
    setTrans("top .55s cubic-bezier(.55,0,1,.45)"); setTop(-130); await sleep(350);
    setLeft("110%"); await sleep(450);
    busy.current = false;
  }, [getCenter]);

  // Idle: UFO hovera sopra la prima card quando non sta animando
  useEffect(() => {
    if (tokens.length === 0) return;
    const idleTimer = setTimeout(() => {
      if (!busy.current) {
        const cx = getCenter(0);
        setTrans("left .8s cubic-bezier(.68,-.3,.27,1.4), top .6s cubic-bezier(.22,1,.36,1)");
        setLeft(cx + "px");
        setTop(4);
      }
    }, 600);
    return () => clearTimeout(idleTimer);
  }, [tokens, getCenter]);

  useEffect(() => {
    const prev = prevRef.current;
    if (prev.length > 0 && tokens.length > 0) {
      for (let i = 0; i < tokens.length; i++) {
        const prevPos = prev.findIndex(t => t.id === tokens[i].id);
        if (prevPos > i) { animate(prevPos, i, prev[prevPos]); break; }
      }
    }
    prevRef.current = [...tokens];
  }, [tokens, animate]);

  useEffect(() => {
    tokens.forEach((_, i) => {
      const el = document.getElementById(`${cardIdPrefix}-${i}`);
      if (!el) return;
      el.style.opacity      = i === ghostIdx ? '0.2' : '';
      el.style.borderStyle  = i === ghostIdx ? 'dashed' : '';
    });
  }, [ghostIdx, tokens]);

  useEffect(() => {
    if (flashIdx < 0) return;
    const el = document.getElementById(`${cardIdPrefix}-${flashIdx}`);
    if (!el) return;
    el.style.transition  = 'box-shadow .75s ease-out';
    el.style.boxShadow   = '0 0 0 0 rgba(41,212,245,0.6)';
    requestAnimationFrame(() => {
      el.style.boxShadow = '0 0 0 14px rgba(41,212,245,0)';
      setTimeout(() => { el.style.boxShadow = ''; el.style.transition = ''; }, 800);
    });
  }, [flashIdx]);

  return (
    <>
      <style>{`@keyframes ufo-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}`}</style>
      <div ref={zoneRef} style={{position:'absolute',inset:0,pointerEvents:'none',overflow:'visible',zIndex:20}}>
        <div style={{position:'absolute',left,top,transform:'translateX(-50%)',transition:trans,filter:'drop-shadow(0 0 18px rgba(41,212,245,.6))',pointerEvents:'none',zIndex:30}}>
          <div style={{animation:'ufo-bob 2.4s ease-in-out infinite'}}>
            <UFOSVG on={on}/>
          </div>
          <div style={{position:'absolute',left:'50%',top:52,transform:'translateX(-50%)',opacity:beamH>0?1:0,transition:'opacity .3s',pointerEvents:'none'}}>
            <Beam h={beamH}/>
          </div>
          {carried && (
            <div style={{
              position:'absolute',left:'50%',bottom:-64,
              transform: cSt==='pull'?'translateX(-50%) translateY(-100px) scale(.15)'
                        :cSt==='drop'?'translateX(-50%) translateY(18px)'
                        :'translateX(-50%) translateY(0)',
              opacity:   cSt==='show'?1:0,
              transition:'transform .75s cubic-bezier(.22,1,.36,1),opacity .65s ease',
              pointerEvents:'none',zIndex:40
            }}>
              <div style={{display:'inline-flex',alignItems:'center',gap:7,background:'rgba(5,13,24,.96)',border:'1px solid rgba(41,212,245,.5)',borderRadius:9,padding:'6px 10px',whiteSpace:'nowrap',boxShadow:'0 0 22px rgba(41,212,245,.25)'}}>
                <img src={carried.image_url||carried.imageUrl||ALIEN} alt={carried.symbol} style={{width:24,height:24,borderRadius:'50%',border:'1px solid rgba(41,212,245,.45)',objectFit:'cover'}}/>
                <div>
                  <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,fontWeight:700,color:'#29d4f5',lineHeight:1}}>${carried.symbol}</div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:9,color:'rgba(255,255,255,.4)',lineHeight:1.2}}>{carried.name}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
