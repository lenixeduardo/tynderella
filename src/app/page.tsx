'use client'

import { useEffect, useRef } from 'react'

const PRODUCTS = [
  '/assets/produto-bong-heel.jpeg',
  '/assets/produto-bong-apple.jpeg',
  '/assets/produto-bong-cylinder.jpeg',
  '/assets/produto-bong-blue.png',
  '/assets/produto-bowl-blue.png',
  '/assets/produto-bowl-skull.png',
  '/assets/produto-torch-slim.png',
  '/assets/produto-torch-silver.png',
]

// Duplicate to get 16 floating items
const ITEMS = [...PRODUCTS, ...PRODUCTS]

// Pre-defined positions to scatter items around the viewport edges
// Format: [top%, left%, delay(s), duration(s), rotation(deg)]
const POSITIONS: [number, number, number, number, number][] = [
  [4,   2,   0,    3.2, -12],
  [4,   18,  0.6,  3.8,  8],
  [4,   72,  1.1,  3.5, -6],
  [4,   88,  0.3,  4.1,  14],
  [22,  1,   1.4,  3.7, -18],
  [22,  93,  0.8,  3.3,  10],
  [44,  0,   0.2,  4.2, -8],
  [44,  92,  1.6,  3.6,  16],
  [64,  2,   0.9,  3.9, -14],
  [64,  90,  0.4,  3.4,  6],
  [78,  6,   1.2,  4.0,  12],
  [78,  85,  0.7,  3.5, -10],
  [88,  20,  1.5,  3.7,  8],
  [88,  50,  0.1,  4.3, -16],
  [88,  68,  1.0,  3.8,  4],
  [88,  82,  0.5,  3.2, -6],
]

export default function HeroPage() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const handler = () => { window.location.href = '/store.html' }
    el.addEventListener('click', handler)
    return () => el.removeEventListener('click', handler)
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');

        .ty-hero {
          position: fixed;
          inset: 0;
          background: #0B0B0F;
          overflow: hidden;
          cursor: pointer;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Radial pink glow behind center */
        .ty-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(55% 55% at 50% 50%, rgba(120,18,66,.5) 0%, transparent 70%);
          pointer-events: none;
        }

        /* Grid overlay */
        .ty-hero-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
          background-size: 64px 64px;
          -webkit-mask-image: radial-gradient(70% 70% at 50% 50%, #000, transparent 80%);
          mask-image: radial-gradient(70% 70% at 50% 50%, #000, transparent 80%);
          pointer-events: none;
        }

        /* Floating product items */
        .ty-float-item {
          position: absolute;
          width: 72px;
          height: 72px;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(242,134,198,.25);
          box-shadow: 0 4px 24px rgba(0,0,0,.5), 0 0 12px rgba(242,134,198,.12);
          animation: ty-float-bob var(--dur) ease-in-out var(--delay) infinite;
          transform: rotate(var(--rot));
          opacity: 0.85;
          transition: opacity .3s;
        }
        .ty-float-item:hover { opacity: 1; }
        .ty-float-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          pointer-events: none;
        }

        @keyframes ty-float-bob {
          0%, 100% { transform: rotate(var(--rot)) translateY(0px); }
          50%       { transform: rotate(var(--rot)) translateY(-14px); }
        }

        /* Center content */
        .ty-center {
          position: relative;
          z-index: 10;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          pointer-events: none;
          user-select: none;
        }

        .ty-crown {
          width: 64px;
          height: 64px;
          color: #EBD687;
          filter: drop-shadow(0 0 20px rgba(235,214,135,.6));
          animation: ty-float-bob 3.5s ease-in-out infinite;
          --rot: 0deg;
          --dur: 3.5s;
          --delay: 0s;
        }

        .ty-title {
          font-family: 'Great Vibes', cursive;
          font-size: clamp(52px, 8vw, 96px);
          font-weight: 400;
          color: #F5F5F5;
          line-height: 1;
          text-shadow: 0 0 40px rgba(242,134,198,.4), 0 0 80px rgba(242,134,198,.2);
          margin: 0;
        }

        .ty-tagline {
          font-family: 'Outfit', system-ui, sans-serif;
          font-size: clamp(13px, 1.6vw, 17px);
          font-weight: 300;
          letter-spacing: .28em;
          text-transform: uppercase;
          color: rgba(245,245,245,.45);
          margin: 0;
        }

        .ty-hint {
          font-family: 'Outfit', system-ui, sans-serif;
          font-size: 11px;
          letter-spacing: .2em;
          text-transform: uppercase;
          color: rgba(242,134,198,.35);
          margin-top: 8px;
          animation: ty-blink 2s ease-in-out infinite;
        }

        @keyframes ty-blink {
          0%, 100% { opacity: .35; }
          50%       { opacity: .8; }
        }

        /* Stars */
        .ty-star {
          position: absolute;
          pointer-events: none;
          color: rgba(242,134,198,.6);
          animation: ty-twinkle var(--dur) ease-in-out var(--delay) infinite;
        }
        @keyframes ty-twinkle {
          0%, 100% { opacity: .2; transform: scale(.8); }
          50%       { opacity: .9; transform: scale(1.2); }
        }
      `}</style>

      <div className="ty-hero" ref={containerRef}>
        <div className="ty-hero-grid" />

        {/* Stars */}
        {[
          { top: '14%', left: '8%',  size: 18, delay: '0s',   dur: '2.2s' },
          { top: '18%', left: '88%', size: 14, delay: '1.4s', dur: '2.8s' },
          { top: '72%', right: '6%', size: 20, delay: '2.8s', dur: '2.4s' },
          { top: '65%', left: '4%',  size: 12, delay: '0.8s', dur: '3.0s' },
          { top: '30%', right: '4%', size: 16, delay: '2.0s', dur: '2.6s' },
        ].map((s, i) => (
          <svg
            key={i}
            className="ty-star"
            style={{ top: s.top, left: (s as any).left, right: (s as any).right, '--dur': s.dur, '--delay': s.delay } as React.CSSProperties}
            width={s.size} height={s.size} viewBox="0 0 24 24" fill="currentColor"
          >
            <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z"/>
          </svg>
        ))}

        {/* Floating product images */}
        {ITEMS.map((src, i) => {
          const [top, left, delay, dur, rot] = POSITIONS[i] ?? [50, 50, 0, 4, 0]
          return (
            <div
              key={i}
              className="ty-float-item"
              style={{
                top: `${top}%`,
                left: `${left}%`,
                '--delay': `${delay}s`,
                '--dur': `${dur}s`,
                '--rot': `${rot}deg`,
              } as React.CSSProperties}
            >
              <img src={src} alt="" />
            </div>
          )
        })}

        {/* Center */}
        <div className="ty-center">
          {/* Crown SVG */}
          <svg
            className="ty-crown"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M2 19h20v2H2v-2zM2 17l4-8 6 4 4-7 4 7-2 4H2zM12 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/>
          </svg>

          <h1 className="ty-title">Tynderella Store</h1>
          <p className="ty-tagline">Break the spell.</p>
          <span className="ty-hint">toque para entrar</span>
        </div>
      </div>
    </>
  )
}
