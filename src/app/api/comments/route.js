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
    .select('id, username, avatar_url, content, created_at')
    .eq('identifier', identifier)
    .order('created_at', { ascending: false });
  if (error && error.code === '42703') {
    // coluna avatar_url não existe, buscar sem ela
    ({ data, error } = await supabase
      .from('comments')
      .select('id, username, content, created_at')
      .eq('identifier', identifier)
      .order('created_at', { ascending: false }));
  }

  if (error) {
    console.error('Erro ao buscar comentários', error);
    return NextResponse.json({ error: 'Erro ao buscar comentários' }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(request) {
  const body = await request.json();
  const { identifier, username, avatar_url, content } = body;
  if (!identifier || !content) {
    return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
  }
  let { data, error } = await supabase
    .from('comments')
    .insert({ identifier, username, avatar_url, content })
    .select()
    .single();
  if (error && error.code === 'PGRST204') {
    // coluna avatar_url pode não existir
    ({ data, error } = await supabase
      .from('comments')
      .insert({ identifier, username, content })
      .select()
      .single());
  }

  if (error) {
    console.error('Erro ao inserir comentário', error);
    return NextResponse.json({ error: 'Erro ao inserir comentário' }, { status: 500 });
  }
  return NextResponse.json(data);
}
