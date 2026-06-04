/**
 * Script para criar o usuário admin no Supabase.
 *
 * Pré-requisitos:
 *   1. Copie .env.local.example para .env.local e preencha as variáveis:
 *      NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
 *      NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
 *      SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key  ← necessária para criar usuários
 *
 *   2. Execute: node scripts/create-admin.js
 *
 * A service_role key está disponível em:
 *   Supabase Dashboard → Project Settings → API → service_role (secret)
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// Carrega .env.local
require('fs').readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8')
  .split('\n')
  .forEach(line => {
    const [key, ...val] = line.split('=');
    if (key && val.length) process.env[key.trim()] = val.join('=').trim();
  });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_EMAIL = 'admin@admin.com';
const ADMIN_PASSWORD = 'admin';

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Erro: defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY em .env.local');
  process.exit(1);
}

const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function main() {
  console.log(`Criando usuário admin: ${ADMIN_EMAIL}`);

  // Tenta criar o usuário via Admin API
  const { data, error } = await adminClient.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
    user_metadata: {
      full_name: 'Admin',
      terms_accepted: true,
      consented_at: new Date().toISOString(),
      privacy_policy_version: '1.0',
    },
  });

  if (error) {
    if (error.message?.includes('already registered') || error.message?.includes('already exists')) {
      console.log('Usuário já existe. Atualizando role para admin...');
    } else {
      console.error('Erro ao criar usuário:', error.message);
      process.exit(1);
    }
  } else {
    console.log('Usuário criado com ID:', data.user.id);
  }

  // Promove para admin na tabela profiles
  const { error: updateError } = await adminClient
    .from('profiles')
    .update({ role: 'admin' })
    .eq('email', ADMIN_EMAIL);

  if (updateError) {
    console.error('Erro ao promover para admin:', updateError.message);
    process.exit(1);
  }

  console.log(`Sucesso! ${ADMIN_EMAIL} agora tem role='admin'.`);
}

main().catch(err => { console.error(err); process.exit(1); });
