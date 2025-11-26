import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceKey);

function normalizeComment(row) {
  if (!row) return null;
  return {
    id: row.id,
    content: row.content,
    created_at: row.created_at,
    username: row.profiles?.username || row.username,
    avatar_url: row.profiles?.avatar_url || row.avatar_url,
    parent_id: row.parent_id || null,
    profile_id: row.profile_id ?? null,
  };
}

async function assertOwnership(commentId, profileId, username) {
  if (!commentId) {
    return { ok: false, status: 400, message: 'Comentario obrigatorio' };
  }

  let query = supabase
    .from('comments')
    .select('id, profile_id, username')
    .eq('id', commentId)
    .single();

  let { data, error } = await query;

  if (error && error.code === '42703') {
    ({ data, error } = await supabase.from('comments').select('id, username').eq('id', commentId).single());
  }

  if (error && error.code === 'PGRST116') {
    return { ok: false, status: 404, message: 'Comentario nao encontrado' };
  }
  if (error) {
    console.error('Erro ao validar proprietario do comentario', error);
    return { ok: false, status: 500, message: 'Falha ao validar comentario' };
  }
  if (!data) {
    return { ok: false, status: 404, message: 'Comentario nao encontrado' };
  }

  const matchesProfile =
    data.profile_id != null &&
    profileId != null &&
    String(data.profile_id) === String(profileId);
  const matchesUsername = data.profile_id == null && username && data.username === username;

  if (!matchesProfile && !matchesUsername) {
    return { ok: false, status: 403, message: 'Sem permissao para alterar este comentario' };
  }

  return { ok: true };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const identifier = searchParams.get('identifier');
  if (!identifier) {
    return NextResponse.json({ error: 'identifier e obrigatorio' }, { status: 400 });
  }

  let { data, error } = await supabase
    .from('comments')
    .select(
      'id, content, created_at, username, avatar_url, parent_id, profile_id, profiles(username, avatar_url)'
    )
    .eq('identifier', identifier)
    .order('created_at', { ascending: false });

  if (error && error.code === '42703') {
    ({ data, error } = await supabase
      .from('comments')
      .select('id, username, avatar_url, content, created_at, parent_id, profile_id')
      .eq('identifier', identifier)
      .order('created_at', { ascending: false }));
  }

  if (error && error.code === '42P01') {
    return NextResponse.json([]);
  }

  if (error) {
    console.error('Erro ao buscar comentarios', error);
    return NextResponse.json({ error: 'Erro ao buscar comentarios' }, { status: 500 });
  }

  const formatted = (data || []).map((row) => normalizeComment(row));
  return NextResponse.json(formatted);
}

export async function POST(request) {
  const body = await request.json();
  const { identifier, content, profile_id, username, avatar_url, parent_id } = body;
  if (!identifier || !content) {
    return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
  }

  let { data, error } = await supabase
    .from('comments')
    .insert({ identifier, profile_id, username, avatar_url, content, parent_id })
    .select(
      'id, content, created_at, username, avatar_url, parent_id, profile_id, profiles(username, avatar_url)'
    )
    .single();

  if (error && error.code === 'PGRST204') {
    ({ data, error } = await supabase
      .from('comments')
      .insert({ identifier, username, avatar_url, content, parent_id })
      .select('id, content, created_at, username, avatar_url, parent_id, profile_id')
      .single());
  }

  if (error) {
    console.error('Erro ao inserir comentario', error);
    return NextResponse.json({ error: 'Erro ao inserir comentario' }, { status: 500 });
  }

  const result = normalizeComment(data);
  return NextResponse.json(result);
}

export async function PATCH(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Corpo invalido' }, { status: 400 });
  }

  const { id, content, profile_id, username } = body || {};
  const sanitized = typeof content === 'string' ? content.trim() : '';
  if (!id || !sanitized) {
    return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
  }

  const ownership = await assertOwnership(id, profile_id, username);
  if (!ownership.ok) {
    return NextResponse.json({ error: ownership.message }, { status: ownership.status });
  }

  let { data, error } = await supabase
    .from('comments')
    .update({ content })
    .eq('id', id)
    .select(
      'id, content, created_at, username, avatar_url, parent_id, profile_id, profiles(username, avatar_url)'
    )
    .single();

  if (error && error.code === '42703') {
    ({ data, error } = await supabase
      .from('comments')
      .update({ content })
      .eq('id', id)
      .select('id, content, created_at, username, avatar_url, parent_id, profile_id')
      .single());
  }

  if (error) {
    console.error('Erro ao atualizar comentario', error);
    return NextResponse.json({ error: 'Erro ao atualizar comentario' }, { status: 500 });
  }

  const result = normalizeComment(data);
  return NextResponse.json(result);
}

export async function DELETE(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Corpo invalido' }, { status: 400 });
  }

  const { id, profile_id, username } = body || {};
  if (!id) {
    return NextResponse.json({ error: 'Comentario obrigatorio' }, { status: 400 });
  }

  const ownership = await assertOwnership(id, profile_id, username);
  if (!ownership.ok) {
    return NextResponse.json({ error: ownership.message }, { status: ownership.status });
  }

  const { error } = await supabase.from('comments').delete().eq('id', id);
  if (error) {
    console.error('Erro ao excluir comentario', error);
    return NextResponse.json({ error: 'Erro ao excluir comentario' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}