#!/usr/bin/env node
// Generates Tynderella-styled catalog pages as standalone HTML files.
// Run: node scripts/generate-catalog.js
// Output: scripts/output/catalog-*.html  (open in browser → print/screenshot)

const fs = require('fs');
const path = require('path');
const data = require('./catalog-data.json');

const OUT = path.join(__dirname, 'output');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT);

// ─── design tokens ───────────────────────────────────────────────────────────
const T = {
  bg:        '#09090b',
  card:      '#18181b',
  rose:      '#f43f5e',
  roseAlpha: 'rgba(244,63,94,0.12)',
  roseBdr:   'rgba(244,63,94,0.25)',
  teal:      '#2dd4bf',
  tealAlpha: 'rgba(45,212,191,0.10)',
  tealDim:   'rgba(45,212,191,0.45)',
  white:     '#fafafa',
  muted:     '#a1a1aa',
  dim:       '#52525b',
  bdr:       'rgba(255,255,255,0.07)',
  bdrHi:     'rgba(255,255,255,0.13)',
};

// ─── SVG library ─────────────────────────────────────────────────────────────
// Each SVG is 72×90px, dark bg, teal glass, rose airflow arrows.
const cylinder = (inner = '') => `
<rect x="8" y="18" width="56" height="64" rx="4"
  fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.4"/>
<rect x="8" y="62" width="56" height="20" rx="0 0 4 4"
  fill="rgba(45,212,191,0.18)" stroke="none"/>
${inner}`;

const arrowUp = (x, y) =>
  `<path d="M${x} ${y} v-12 M${x-3} ${y-9} l3-4 3 4"
    stroke="${T.rose}" stroke-width="1.3" fill="none" stroke-linecap="round"/>`;

const SVGS = {
  dome: () => cylinder(`
    <path d="M24 62 Q24 38 36 34 Q48 38 48 62 Z"
      fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.3"/>
    <line x1="36" y1="62" x2="36" y2="75" stroke="${T.teal}" stroke-width="1.3"/>
    ${arrowUp(36, 34)}`),

  tree: () => cylinder(`
    <line x1="36" y1="72" x2="36" y2="38" stroke="${T.teal}" stroke-width="1.4"/>
    <line x1="36" y1="44" x2="22" y2="38" stroke="${T.teal}" stroke-width="1.2"/>
    <line x1="36" y1="50" x2="22" y2="44" stroke="${T.teal}" stroke-width="1.2"/>
    <line x1="36" y1="44" x2="50" y2="38" stroke="${T.teal}" stroke-width="1.2"/>
    <line x1="36" y1="50" x2="50" y2="44" stroke="${T.teal}" stroke-width="1.2"/>
    ${arrowUp(22, 38)}${arrowUp(50, 38)}`),

  sprinkler: () => cylinder(`
    <line x1="36" y1="72" x2="36" y2="50" stroke="${T.teal}" stroke-width="1.4"/>
    <line x1="36" y1="50" x2="20" y2="40" stroke="${T.teal}" stroke-width="1.2"/>
    <line x1="36" y1="50" x2="52" y2="40" stroke="${T.teal}" stroke-width="1.2"/>
    ${arrowUp(20, 40)}${arrowUp(52, 40)}`),

  reti: () => cylinder(`
    <line x1="36" y1="72" x2="36" y2="30" stroke="${T.teal}" stroke-width="1.4"/>
    <circle cx="36" cy="72" r="3" fill="${T.teal}"/>
    ${[38,46,54].map(y => `<line x1="36" y1="${y}" x2="28" y2="${y}" stroke="${T.rose}" stroke-width="1"/>`).join('')}
    ${[38,46,54].map(y => `<line x1="36" y1="${y}" x2="44" y2="${y}" stroke="${T.rose}" stroke-width="1"/>`).join('')}
    ${arrowUp(36, 30)}`),

  honeycomb: () => cylinder(`
    <rect x="14" y="46" width="44" height="8" rx="2"
      fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.3"/>
    ${[18,24,30,36,42,50].map(x => `<circle cx="${x}" cy="50" r="2.5" fill="${T.bg}" stroke="${T.teal}" stroke-width="0.8"/>`).join('')}
    ${arrowUp(24,46)}${arrowUp(36,46)}${arrowUp(50,46)}`),

  cyclone: () => cylinder(`
    <ellipse cx="36" cy="50" rx="16" ry="8"
      fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.2"/>
    <path d="M22 50 Q28 36 50 46" stroke="${T.rose}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    ${arrowUp(36, 34)}`),

  frit: () => cylinder(`
    <rect x="14" y="46" width="44" height="10" rx="3"
      fill="rgba(45,212,191,0.22)" stroke="${T.teal}" stroke-width="1.3"
      stroke-dasharray="2 1.5"/>
    ${arrowUp(24,46)}${arrowUp(36,46)}${arrowUp(48,46)}`),

  swiss: () => cylinder(`
    ${[24,36,48].map(x => `<circle cx="${x}" cy="50" r="8"
      fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.2"/>`).join('')}
    ${[24,36,48].map(x => `<circle cx="${x}" cy="50" r="3" fill="${T.bg}"/>`).join('')}
    ${arrowUp(24,42)}${arrowUp(48,42)}`),

  shower: () => cylinder(`
    <rect x="20" y="42" width="32" height="22" rx="3"
      fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.3"/>
    ${[24,28,32,36,40,44,48].map(x => [46,50].map(y =>
      `<circle cx="${x}" cy="${y}" r="1.2" fill="${T.teal}"/>`
    ).join('')).join('')}
    ${arrowUp(30,42)}${arrowUp(42,42)}`),

  inline: () => cylinder(`
    <rect x="12" y="52" width="48" height="8" rx="4"
      fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.3"/>
    ${[18,24,30,36,42,54].map(x => `<line x1="${x}" y1="52" x2="${x-1}" y2="44" stroke="${T.rose}" stroke-width="1"/>`).join('')}
    ${arrowUp(24,44)}${arrowUp(42,44)}`),

  spiral: () => cylinder(`
    <path d="M44 72 Q54 66 50 54 Q46 42 36 40 Q26 38 22 48 Q18 58 28 62 Q38 66 40 56"
      fill="none" stroke="${T.teal}" stroke-width="1.4" stroke-linecap="round"/>
    ${arrowUp(36, 36)}`),

  incycler: () => cylinder(`
    <path d="M20 72 Q12 52 20 40 Q28 28 36 32 Q44 36 44 52 Q44 68 36 72"
      fill="none" stroke="${T.teal}" stroke-width="1.4"/>
    <path d="M44 52 Q52 52 52 40 Q52 28 44 40"
      fill="none" stroke="${T.teal}" stroke-width="1.2" stroke-dasharray="3 2"/>
    ${arrowUp(36, 30)}`),

  // Nail & Domeless
  'nail-glass': () => `
    <line x1="36" y1="20" x2="36" y2="55" stroke="${T.teal}" stroke-width="2.5" stroke-linecap="round"/>
    <rect x="22" y="55" width="28" height="8" rx="2" fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.3"/>
    <path d="M28 63 L28 72 L44 72 L44 63" fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.3"/>`,

  'nail-adjustable': () => `
    <line x1="36" y1="20" x2="36" y2="50" stroke="${T.teal}" stroke-width="2.5" stroke-linecap="round"/>
    <rect x="20" y="50" width="32" height="10" rx="2" fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.3"/>
    <path d="M24 60 L24 72 L48 72 L48 60" fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.3"/>
    <line x1="26" y1="52" x2="46" y2="52" stroke="${T.rose}" stroke-width="0.8" stroke-dasharray="2 2"/>`,

  domebowl: () => `
    <path d="M18 70 Q18 42 36 36 Q54 42 54 70 Z"
      fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.4"/>
    <line x1="36" y1="36" x2="36" y2="25" stroke="${T.teal}" stroke-width="2"/>`,

  'domeless-center': () => `
    <path d="M20 70 Q14 52 20 42 L52 42 Q58 52 52 70 Z"
      fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.4"/>
    <circle cx="36" cy="50" r="5" fill="${T.bg}" stroke="${T.rose}" stroke-width="1.2"/>
    <line x1="36" y1="42" x2="36" y2="28" stroke="${T.teal}" stroke-width="1.8"/>`,

  'domeless-side': () => `
    <path d="M22 70 Q16 54 22 44 L50 44 Q56 54 50 70 Z"
      fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.4"/>
    <path d="M50 54 Q62 50 60 40" fill="none" stroke="${T.teal}" stroke-width="1.4" stroke-linecap="round"/>
    <line x1="36" y1="44" x2="36" y2="28" stroke="${T.teal}" stroke-width="1.8"/>`,

  'domeless-holes': () => `
    <path d="M20 72 Q14 54 20 44 L52 44 Q58 54 52 72 Z"
      fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.4"/>
    ${[26,36,46].map(x => `<circle cx="${x}" cy="56" r="3" fill="${T.bg}" stroke="${T.rose}" stroke-width="1"/>`).join('')}
    <line x1="36" y1="44" x2="36" y2="28" stroke="${T.teal}" stroke-width="1.8"/>`,

  'domeless-cup': () => `
    <path d="M26 70 Q20 58 24 46 L48 46 Q52 58 46 70 Z"
      fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.4"/>
    <rect x="28" y="34" width="16" height="12" rx="2 2 0 0"
      fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.3"/>`,

  adapter: () => `
    <rect x="24" y="24" width="24" height="10" rx="2"
      fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.3"/>
    <rect x="28" y="34" width="16" height="32" rx="0"
      fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.3"/>
    <rect x="24" y="66" width="24" height="10" rx="2"
      fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.3"/>`,

  // Bowl & Downstem
  'bowl-round': () => `
    <path d="M16 60 Q16 40 36 36 Q56 40 56 60 L50 66 L22 66 Z"
      fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.4"/>
    <rect x="30" y="66" width="12" height="16" rx="0 0 4 4"
      fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.3"/>`,

  'bowl-conical': () => `
    <path d="M20 38 L36 66 L52 38 Z"
      fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.4"/>
    <rect x="30" y="66" width="12" height="16" rx="0 0 4 4"
      fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.3"/>`,

  'bowl-straight': () => `
    <rect x="20" y="36" width="32" height="30" rx="3"
      fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.4"/>
    <rect x="30" y="66" width="12" height="16" rx="0 0 4 4"
      fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.3"/>
    <line x1="20" y1="51" x2="10" y2="51" stroke="${T.teal}" stroke-width="2" stroke-linecap="round"/>`,

  'bowl-bubbler': () => `
    <path d="M14 60 Q14 36 36 32 Q58 36 58 60 Q58 70 50 72 L22 72 Q14 70 14 60 Z"
      fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.4"/>
    <line x1="36" y1="72" x2="36" y2="85" stroke="${T.teal}" stroke-width="1.8"/>`,

  downstem: () => `
    <path d="M26 22 L46 22 L40 42" stroke="${T.teal}" stroke-width="1.4" fill="none"/>
    <rect x="32" y="22" width="8" height="6" rx="0" fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.2"/>
    <line x1="36" y1="28" x2="36" y2="78" stroke="${T.teal}" stroke-width="2.2" stroke-linecap="round"/>`,

  'bowl-downstem-short': () => `
    <path d="M22 28 L50 28 L42 46" stroke="${T.teal}" stroke-width="1.4" fill="none"/>
    <rect x="28" y="28" width="16" height="8" rx="2" fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.2"/>
    <line x1="36" y1="36" x2="36" y2="66" stroke="${T.teal}" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M28 66 Q24 58 28 52 L44 52 Q48 58 44 66 Z"
      fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.3"/>`,

  'bowl-downstem-long': () => `
    <path d="M22 22 L50 22 L42 40" stroke="${T.teal}" stroke-width="1.4" fill="none"/>
    <rect x="28" y="22" width="16" height="8" rx="2" fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.2"/>
    <line x1="36" y1="30" x2="36" y2="72" stroke="${T.teal}" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M28 72 Q24 64 28 58 L44 58 Q48 64 44 72 Z"
      fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.3"/>`,

  // Connections
  'joint-male': (size = '14.5') => `
    <rect x="28" y="22" width="16" height="36" rx="2"
      fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.3"/>
    <rect x="22" y="58" width="28" height="8" rx="2"
      fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.3"/>
    <text x="36" y="80" text-anchor="middle" fill="${T.rose}"
      font-size="10" font-family="Inter,system-ui">${size}</text>`,

  'joint-female': (size = '14.5') => `
    <rect x="22" y="22" width="28" height="8" rx="2"
      fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.3"/>
    <rect x="28" y="30" width="16" height="38" rx="2"
      fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.3"/>
    <text x="36" y="80" text-anchor="middle" fill="${T.rose}"
      font-size="10" font-family="Inter,system-ui">${size}</text>`,

  'rubber-ring': (size = '10mm') => `
    <ellipse cx="36" cy="48" rx="22" ry="8"
      fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.4"/>
    <ellipse cx="36" cy="48" rx="10" ry="3.5"
      fill="${T.bg}" stroke="${T.teal}" stroke-width="1"/>
    <text x="36" y="72" text-anchor="middle" fill="${T.rose}"
      font-size="10" font-family="Inter,system-ui">${size}</text>`,

  'adapter-male-straight': () => `
    <rect x="30" y="20" width="12" height="16" rx="2" fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.3"/>
    <rect x="26" y="36" width="20" height="8" rx="2" fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.3"/>
    <rect x="30" y="44" width="12" height="28" rx="2" fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.3"/>`,

  'adapter-male-angled': () => `
    <rect x="30" y="20" width="12" height="16" rx="2" fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.3"/>
    <path d="M26 36 L46 36 L46 42 L42 50 L26 50 Z" fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.3"/>
    <rect x="30" y="50" width="12" height="26" rx="2" fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.3"/>`,

  'adapter-female-straight': () => `
    <rect x="26" y="20" width="20" height="8" rx="2" fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.3"/>
    <rect x="30" y="28" width="12" height="16" rx="2" fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.3"/>
    <rect x="26" y="44" width="20" height="8" rx="2" fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.3"/>
    <rect x="30" y="52" width="12" height="22" rx="2" fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.3"/>`,

  'adapter-female-angled': () => `
    <rect x="26" y="20" width="20" height="8" rx="2" fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.3"/>
    <path d="M30 28 L42 28 L46 38 L46 44 L26 44 L26 38 Z" fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.3"/>
    <rect x="30" y="44" width="12" height="28" rx="2" fill="${T.tealAlpha}" stroke="${T.teal}" stroke-width="1.3"/>`,
};

function svg(type, label = '') {
  const fn = SVGS[type];
  const inner = fn ? fn() : `<text x="36" y="50" text-anchor="middle" fill="${T.muted}" font-size="8">${type}</text>`;
  return `<svg viewBox="0 0 72 90" width="72" height="90" xmlns="http://www.w3.org/2000/svg">
    <rect width="72" height="90" fill="${T.bg}" rx="6"/>
    ${inner}
  </svg>`;
}

// ─── HTML shell ───────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${T.bg}; font-family: 'Inter', system-ui, sans-serif; color: ${T.white}; }
  .page {
    width: 800px; min-height: 1100px; margin: 0 auto 48px;
    background: ${T.bg}; padding: 52px 56px 48px;
    position: relative; overflow: hidden;
  }
  .page::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse 60% 40% at 90% 10%, rgba(244,63,94,0.07), transparent),
                radial-gradient(ellipse 50% 30% at 10% 80%, rgba(45,212,191,0.04), transparent);
    pointer-events: none;
  }
  .page-header {
    display: flex; justify-content: space-between; align-items: flex-start;
    margin-bottom: 32px; padding-bottom: 24px;
    border-bottom: 1px solid ${T.bdr};
  }
  .page-header h1 {
    font-size: 28px; font-weight: 900; letter-spacing: -0.03em;
    color: ${T.white}; line-height: 1;
  }
  .page-header .subtitle {
    font-size: 12px; color: ${T.muted}; letter-spacing: 0.1em;
    text-transform: uppercase; margin-top: 6px;
  }
  .logo-mark {
    text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 4px;
  }
  .logo-mark span {
    font-size: 11px; font-weight: 700; letter-spacing: 0.18em;
    text-transform: uppercase; color: ${T.rose};
  }
  .logo-mark .pg { font-size: 10px; color: ${T.dim}; font-variant-numeric: tabular-nums; }
  .section-divider {
    display: flex; align-items: center; gap: 12px;
    margin: 28px 0 24px;
  }
  .section-divider::before, .section-divider::after {
    content: ''; flex: 1; height: 1px; background: ${T.roseBdr};
  }
  .section-divider span {
    font-size: 10px; font-weight: 600; letter-spacing: 0.14em;
    text-transform: uppercase; color: ${T.rose}; white-space: nowrap;
  }
  .section-label {
    font-size: 13px; font-weight: 600; color: ${T.rose};
    letter-spacing: -0.01em; margin-bottom: 6px;
  }
  .section-note {
    font-size: 11px; color: ${T.muted}; line-height: 1.5;
    margin-bottom: 18px; max-width: 480px;
  }
  .grid { display: grid; gap: 10px; }
  .grid-4 { grid-template-columns: repeat(4, 1fr); }
  .grid-3 { grid-template-columns: repeat(3, 1fr); }
  .grid-2 { grid-template-columns: repeat(2, 1fr); }
  .card {
    background: rgba(24,24,27,0.6); border: 1px solid ${T.bdr};
    border-radius: 12px; padding: 14px 12px 12px;
    display: flex; flex-direction: column; align-items: center; gap: 10px;
    transition: border-color 0.2s;
  }
  .card:hover { border-color: ${T.bdrHi}; }
  .card .card-name {
    font-size: 11px; font-weight: 600; color: ${T.white};
    text-align: center; letter-spacing: -0.01em;
  }
  .card .card-desc {
    font-size: 10px; color: ${T.muted}; text-align: center; line-height: 1.4;
  }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; margin-top: 8px; }
  .size-row { display: flex; gap: 12px; align-items: flex-end; margin-bottom: 20px; }
  .size-item { display: flex; flex-direction: column; align-items: center; gap: 6px; }
  .size-label { font-size: 10px; color: ${T.muted}; }
  .size-type { font-size: 11px; font-weight: 600; color: ${T.white}; margin-bottom: 8px; }
  .bullets { list-style: none; display: flex; flex-direction: column; gap: 6px; margin: 12px 0; }
  .bullets li {
    font-size: 11px; color: ${T.muted}; line-height: 1.5; padding-left: 14px; position: relative;
  }
  .bullets li::before { content: '–'; position: absolute; left: 0; color: ${T.rose}; }
  .exploded {
    display: flex; gap: 32px; align-items: center;
    background: rgba(24,24,27,0.5); border: 1px solid ${T.bdr};
    border-radius: 16px; padding: 28px; margin-top: 16px;
  }
  .exploded-diagram {
    flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px;
  }
  .exploded-note {
    font-size: 11px; color: ${T.muted}; line-height: 1.5; max-width: 220px;
  }
  .annotation {
    font-size: 10px; color: ${T.rose}; font-weight: 500; letter-spacing: 0.02em;
  }
  .callout {
    background: ${T.roseAlpha}; border: 1px solid ${T.roseBdr};
    border-radius: 10px; padding: 14px 16px; max-width: 200px;
  }
  .callout .callout-label { font-size: 12px; font-weight: 700; color: ${T.rose}; }
  .callout .callout-note { font-size: 10px; color: ${T.muted}; margin-top: 4px; line-height: 1.4; }
  @media print { .page { margin: 0; page-break-after: always; } }
`;

// ─── page builders ────────────────────────────────────────────────────────────
function header(page) {
  return `
  <div class="page-header">
    <div>
      <h1>${page.title}</h1>
      ${page.subtitle ? `<p class="subtitle">${page.subtitle}</p>` : ''}
    </div>
    <div class="logo-mark">
      <span>Tynderella</span>
      <span class="pg">pág. ${page.pageNumber}</span>
    </div>
  </div>`;
}

function divider(title) {
  return `<div class="section-divider"><span>${title}</span></div>`;
}

function itemCard(item) {
  const icon = svg(item.svgType, item.name);
  return `
  <div class="card">
    ${icon}
    <span class="card-name">${item.name}</span>
    ${item.description ? `<span class="card-desc">${item.description}</span>` : ''}
  </div>`;
}

function buildPage(page) {
  const sections = page.sections.map(sec => {
    const cols = sec.layout === 'grid-4x3' || sec.layout === 'grid-4' ? 'grid-4'
               : sec.layout === 'grid-3' ? 'grid-3'
               : 'grid-3';

    let body = '';

    if (sec.subsections) {
      body = sec.subsections.map(sub => `
        <div>
          <div class="size-type">${sub.label}</div>
          <div class="size-row">
            ${sub.sizes.map(sz => `
              <div class="size-item">
                ${svg(`${sub.svgType}`, sz)}
                <span class="size-label">${sz}</span>
              </div>`).join('')}
          </div>
        </div>`).join('');
    } else if (sec.layout === 'exploded-diagram') {
      body = `
        <p class="section-note">${sec.note || ''}</p>
        <div class="exploded">
          <div class="exploded-diagram">
            ${svg('spiral', 'bong')}
            ${sec.annotations?.map(a =>
              `<span class="annotation">${a.label}</span>`
            ).join('') || ''}
          </div>
          ${sec.callout ? `
          <div class="callout">
            <div class="callout-label">${sec.callout.label}</div>
            <div class="callout-note">${sec.callout.note}</div>
          </div>` : ''}
        </div>`;
    } else {
      body = `
        ${sec.note ? `<p class="section-note">${sec.note}</p>` : ''}
        ${sec.bullets ? `<ul class="bullets">${sec.bullets.map(b => `<li>${b}</li>`).join('')}</ul>` : ''}
        <div class="grid ${cols}">${(sec.items || []).map(itemCard).join('')}</div>`;
    }

    return `
    ${sec.title ? divider(sec.title) : ''}
    <div class="section-label">${sec.title || ''}</div>
    ${body}`;
  }).join('');

  return `
  <div class="page">
    ${header(page)}
    ${sections}
  </div>`;
}

// ─── write output ─────────────────────────────────────────────────────────────
const allPages = data.pages.map(buildPage).join('\n');
const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=800"/>
  <title>Tynderella — Catálogo de Peças</title>
  <style>${css}</style>
</head>
<body>
${allPages}
</body>
</html>`;

const outFile = path.join(OUT, 'catalog-tynderella.html');
fs.writeFileSync(outFile, html, 'utf8');
console.log(`✓ Generated: ${outFile}`);
console.log(`  Open in browser → File > Print > Save as PDF`);
console.log(`  Or: npx puppeteer-cli screenshot ${outFile} output.png`);
