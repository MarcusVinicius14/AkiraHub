require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const profileId = process.env.TEST_PROFILE_UUID; // deve ser um UUID válido de profiles.id

if (!supabaseUrl || !supabaseKey) {
  console.error('Credenciais do Supabase ausentes.');
  process.exit(1);
}

if (!profileId) {
  console.error('TEST_PROFILE_UUID ausente. Defina com um UUID válido de profiles.id.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { error } = await supabase
    .from('favorites')
    .upsert({ profile_id: profileId, work_type: 'anime', work_id: 999999 }, { onConflict: 'profile_id,work_type,work_id' });
  if (error) {
    console.error('Falha ao inserir favorito:', error);
    process.exit(1);
  }
  console.log('Favorito inserido com sucesso');
  const { data, error: fetchError } = await supabase
    .from('favorites')
    .select('work_id')
    .eq('profile_id', profileId)
    .eq('work_type', 'anime')
    .eq('work_id', 999999)
    .single();
  if (fetchError) {
    console.error('Falha ao buscar favorito:', fetchError);
    process.exit(1);
  }
  console.log('Favorito encontrado', data);
  await supabase
    .from('favorites')
    .delete()
    .eq('profile_id', profileId)
    .eq('work_type', 'anime')
    .eq('work_id', 999999);
}

main().catch((err) => {
  console.error('Erro inesperado:', err);
  process.exit(1);
});