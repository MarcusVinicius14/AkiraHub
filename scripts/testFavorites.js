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
  const { error } = await supabase
    .from('favorites')
    .upsert({ profile_id: 1, work_type: 'anime', work_id: 999999 }, { onConflict: 'profile_id,work_type,work_id' });
  if (error) {
    console.error('Insert failed:', error);
    process.exit(1);
  }
  console.log('Insert succeeded');
  const { data, error: fetchError } = await supabase
    .from('favorites')
    .select('work_id')
    .eq('profile_id', 1)
    .eq('work_type', 'anime')
    .eq('work_id', 999999)
    .single();
  if (fetchError) {
    console.error('Fetch failed:', fetchError);
    process.exit(1);
  }
  console.log('Fetch succeeded', data);
  await supabase
    .from('favorites')
    .delete()
    .eq('profile_id', 1)
    .eq('work_type', 'anime')
    .eq('work_id', 999999);
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
