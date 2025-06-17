require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials are missing.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const identifier = `test-${Date.now()}`;
  const { data, error } = await supabase
    .from('comments')
    .insert({ identifier, profile_id: 1, username: 'Test Runner', content: 'Hello from test' })
    .select('id, content, created_at, profiles(username, avatar_url)')
    .single();

  if (error) {
    console.error('Insert failed:', error);
    process.exit(1);
  }

  console.log('Insert succeeded:', data);

  const { data: reply, error: replyError } = await supabase
    .from('comments')
    .insert({ identifier, parent_id: data.id, profile_id: 1, username: 'Test Runner', content: 'Reply from test' })
    .select('id, parent_id')
    .single();

  if (replyError) {
    console.error('Reply insert failed:', replyError);
    process.exit(1);
  }

  console.log('Reply insert succeeded:', reply);

  const { data: fetched, error: fetchError } = await supabase
    .from('comments')
    .select('id, content, created_at, profiles(username, avatar_url)')
    .eq('id', data.id)
    .single();

  if (fetchError) {
    console.error('Fetch failed:', fetchError);
    process.exit(1);
  }

  console.log('Fetch succeeded:', fetched);
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
