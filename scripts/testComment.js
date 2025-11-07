require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const profileId = process.env.TEST_PROFILE_UUID; 

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
  const identifier = `teste-${Date.now()}`;
  const { data, error } = await supabase
    .from('comments')
    .insert({ identifier, profile_id: profileId, username: 'Teste Automatizado', content: 'Testando comentario pai' })
    .select('id, content, created_at, profiles(username, avatar_url)')
    .single();

  if (error) {
    console.error('Falha ao inserir comentário:', error);
    process.exit(1);
  }

  console.log('Comentário inserido com sucesso:', data);

  const { data: reply, error: replyError } = await supabase
    .from('comments')
    .insert({ identifier, parent_id: data.id, profile_id: profileId, username: 'Teste Automatizado', content: 'Resposta comentario filho' })
    .select('id, parent_id')
    .single();

  if (replyError) {
    console.error('Falha ao inserir resposta:', replyError);
    process.exit(1);
  }

  console.log('Resposta inserida com sucesso:', reply);

  const { data: fetched, error: fetchError } = await supabase
    .from('comments')
    .select('id, content, created_at, profiles(username, avatar_url)')
    .eq('id', data.id)
    .single();

  if (fetchError) {
    console.error('Falha ao buscar comentário:', fetchError);
    process.exit(1);
  }

  console.log('Comentário buscado com sucesso:', fetched);
}

main().catch((err) => {
  console.error('Erro inesperado:', err);
  process.exit(1);
});