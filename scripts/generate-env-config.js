/**
 * Prebuild script: bakes Supabase public credentials into public/env-config.js
 * so that static HTML pages can initialize the Supabase client without
 * relying on an API route (which requires Next.js routing to be active).
 *
 * Run automatically via `npm run prebuild` before `next build`.
 * Reads NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY from the
 * build environment (set in Vercel project settings or .env.local).
 */
const fs = require('fs');
const path = require('path');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const content = [
  '/* Generated at build time by scripts/generate-env-config.js — do not edit manually */',
  `window.__SUPABASE_URL = ${JSON.stringify(url)};`,
  `window.__SUPABASE_ANON_KEY = ${JSON.stringify(key)};`,
].join('\n') + '\n';

const dest = path.join(__dirname, '..', 'public', 'env-config.js');
fs.writeFileSync(dest, content, 'utf8');

const status = url && key ? 'PRONTO' : 'AVISO: variáveis não definidas (o site não conectará ao Supabase)';
console.log(`✓ public/env-config.js gerado — ${status}`);
