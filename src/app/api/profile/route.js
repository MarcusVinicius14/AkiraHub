import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceKey);
const PROFILE_ID = 1;

export async function GET() {
  let { data, error } = await supabase
    .from('profiles')
    .select('id, username, avatar_url')
    .eq('id', PROFILE_ID)
    .single();
  if (error && error.code === '42703') {
    // algumas colunas podem não existir, tentar somente as básicas
    ({ data, error } = await supabase
      .from('profiles')
      .select('id, username, avatar_url')
      .eq('id', PROFILE_ID)
      .single());
  }
  if (error && error.code === '42P01') {
    // tabela não existe, retornar perfil vazio
    return NextResponse.json({});
  }
  if (error && error.code !== 'PGRST116') {
    console.error('Erro ao buscar perfil', error);
    return NextResponse.json({ error: 'Erro ao buscar perfil' }, { status: 500 });
  }

  if (!data) {
    // cria um perfil básico caso nenhum registro seja encontrado
    const { data: inserted, error: insertError } = await supabase
      .from('profiles')
      .insert({ id: PROFILE_ID })
      .select('id, username, avatar_url')
      .single();
    if (insertError) {
      console.error('Erro ao criar perfil', insertError);
      return NextResponse.json({});
    }
    data = inserted;
  }

  return NextResponse.json(data || {});
}

export async function POST(request) {
  const body = await request.json();
  const {
    username,
    avatar_url,
    email,
    password,
    favorite_anime_id,
    favorite_manga_id,
  } = body;
  if (!username && !avatar_url && !email && !password) {
    return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
  }
  let { data, error } = await supabase
    .from('profiles')
    .upsert(
      {
        id: PROFILE_ID,
        username,
        avatar_url,
        email,
        password,
        favorite_anime_id,
        favorite_manga_id,
      },
      { onConflict: 'id' }
    )
    .select('id, username, avatar_url')
    .single();
  if (error && error.code === '42703') {
    ({ data, error } = await supabase
      .from('profiles')
      .upsert(
        {
          id: PROFILE_ID,
          username,
          avatar_url,
        },
        { onConflict: 'id' }
      )
      .select('id, username, avatar_url')
      .single());
  }
  if (error && error.code === '42P01') {
    // tabela inexistente, retornar dados sem salvar
    return NextResponse.json({ id: PROFILE_ID, username, avatar_url });
  }
  if (error) {
    console.error('Erro ao salvar perfil', error);
    return NextResponse.json({ error: 'Erro ao salvar perfil' }, { status: 500 });
  }
  return NextResponse.json(data);
}
