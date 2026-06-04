const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://zzjnbsckeottbnyfvhea.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6am5ic2NrZW90dGJueWZ2aGVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1MTU5NjIsImV4cCI6MjA5NjA5MTk2Mn0.vkSvxopKxgIqYmYZk3g2xYqgl65PBNEE0QKdtrKjAPo';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const products = [
  { name: 'Bong Straight Crystal', description: 'Bong reto em vidro borosilicato com percolador tree e base disco. Filtragem superior para uma sessão suave.', price: 189.90, image_url: 'assets/produto-bong-cylinder.jpeg', category: 'bong', stock: 15 },
  { name: 'Sapatinho Crystal Bong', description: 'O icônico bong em formato de sapato de cristal com detalhe joia dourado — a peça mais exclusiva da coleção Tynderella.', price: 249.90, image_url: 'assets/produto-bong-heel.jpeg', category: 'bong', stock: 5 },
  { name: 'Bong Maçã Encantada', description: 'Bong artesanal em formato de maçã com corpo em vidro vermelho e folha verde soprada à mão.', price: 169.90, image_url: 'assets/produto-bong-apple.jpeg', category: 'bong', stock: 10 },
  { name: 'Bong Sapphire Tower', description: 'Bong cilíndrico em vidro borosilicato com câmara dupla e percolador tree.', price: 219.90, image_url: 'assets/produto-bong-blue.png', category: 'bong', stock: 8 },
  { name: 'Bowl Cobra Azul', description: 'Bowl artesanal em vidro azul cobalto com design curvo estilo cobra. Encaixe 14mm.', price: 49.90, image_url: 'assets/produto-bowl-blue.png', category: 'bowl', stock: 30 },
  { name: 'Maçarico Slim Trio', description: 'Maçarico slim de chama azul intensa disponível em dourado, preto e azul. Recarregável e compacto.', price: 59.90, image_url: 'assets/produto-torch-slim.png', category: 'macarico', stock: 25 },
  { name: 'Maçarico Titanium Pro', description: 'Maçarico tático em titânio escovado com dupla chama e clip de bolso.', price: 89.90, image_url: 'assets/produto-torch-silver.png', category: 'macarico', stock: 20 },
  { name: 'Bowl Caveira Crystal Blue', description: 'Bowl em vidro azul safira com escultura de caveira detalhada. Encaixe 14mm.', price: 54.90, image_url: 'assets/produto-bowl-skull.png', category: 'bowl', stock: 18 }
];

async function main() {
  console.log('Fazendo login como admin...');
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email: 'admin@admin.com', password: 'admin' });
  if (signInError) {
    console.error('Erro ao fazer login:', signInError.message);
    console.log('Tentando inserir diretamente com anon key...');
    const { data: existing } = await supabase.from('products').select('count').single();
    console.log('Produtos existentes:', existing);
  } else {
    console.log('Logado como admin!');
  }
  for (const p of products) {
    const { error } = await supabase.from('products').upsert(p, { onConflict: 'name' });
    if (error) console.error('Erro ao inserir ' + p.name + ':', error.message);
    else console.log('✓ ' + p.name);
  }
  console.log('\nVerificando produtos no banco...');
  const { data, error } = await supabase.from('products').select('name, price, category, stock');
  if (error) console.error('Erro ao listar:', error.message);
  else console.table(data);
}
main().catch(console.error);
