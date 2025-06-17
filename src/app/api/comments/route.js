import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceKey);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const identifier = searchParams.get('identifier');
  if (!identifier) {
    return NextResponse.json({ error: 'identifier é obrigatório' }, { status: 400 });
  }
  let { data, error } = await supabase
    .from('comments')
    .select(
      'id, content, created_at, username, avatar_url, profiles(username, avatar_url)'
    )
    .eq('identifier', identifier)
    .order('created_at', { ascending: false });
  if (error && error.code === '42703') {
    // tabela ou coluna ausente, tentar sem o join
    ({ data, error } = await supabase
      .from('comments')
      .select('id, username, avatar_url, content, created_at')
      .eq('identifier', identifier)
      .order('created_at', { ascending: false }));
  }

  if (error) {
    console.error('Erro ao buscar comentários', error);
    return NextResponse.json({ error: 'Erro ao buscar comentários' }, { status: 500 });
  }

  const formatted = (data || []).map((c) => ({
    id: c.id,
    content: c.content,
    created_at: c.created_at,
    username: c.profiles?.username || c.username,
    avatar_url: c.profiles?.avatar_url || c.avatar_url,
  }));

  return NextResponse.json(formatted);

}

export async function POST(request) {
  const body = await request.json();
  const { identifier, content, profile_id, username, avatar_url } = body;

  if (!identifier || !content) {
    return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
  }
  let { data, error } = await supabase
    .from('comments')
    .insert({ identifier, profile_id, username, avatar_url, content })
    .select('id, content, created_at, username, avatar_url, profiles(username, avatar_url)')
    .single();
  if (error && error.code === 'PGRST204') {
    // coluna profile_id ou avatar_url pode não existir
    ({ data, error } = await supabase
      .from('comments')
      .insert({ identifier, username, avatar_url, content })
      .select()
      .single());
  }

  if (error) {
    console.error('Erro ao inserir comentário', error);
    return NextResponse.json({ error: 'Erro ao inserir comentário' }, { status: 500 });
  }
  const result = {
    id: data.id,
    content: data.content,
    created_at: data.created_at,
    username: data.profiles?.username || data.username,
    avatar_url: data.profiles?.avatar_url || data.avatar_url,
  };

  return NextResponse.json(result);

}
