import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, serviceKey);

const PROFILE_ID = 1;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const workType = searchParams.get('work_type');
  const workId = searchParams.get('work_id');

  // Check specific favorite
  if (workType && workId) {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('profile_id', PROFILE_ID)
      .eq('work_type', workType)
      .eq('work_id', workId)
      .single();
    if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
      console.error('Erro ao verificar favorito', error);
      return NextResponse.json({ error: 'Erro ao verificar favorito' }, { status: 500 });
    }
    return NextResponse.json({ favorited: !!data });
  }

  // List all favorites
  let { data, error } = await supabase
    .from('favorites')
    .select('id, work_type, work_id')
    .eq('profile_id', PROFILE_ID)
    .order('id');

  if (error && error.code === '42P01') {
    return NextResponse.json([]);
  }
  if (error) {
    console.error('Erro ao listar favoritos', error);
    return NextResponse.json({ error: 'Erro ao listar favoritos' }, { status: 500 });
  }

  const items = [];
  const animeTables = ['animes', 'season_now', 'season_upcoming', 'top_anime'];

  for (const fav of data) {
    if (fav.work_type === 'anime') {
      let anime = null;
      for (const table of animeTables) {
        const { data: found, error: err } = await supabase
          .from(table)
          .select('mal_id, title, large_image_url')
          .eq('mal_id', fav.work_id)
          .single();
        if (found) {
          anime = found;
          break;
        }
        if (err && err.code !== 'PGRST116') {
          console.error(`Erro ao consultar ${table}`, err);
        }
      }
      if (anime) {
        items.push({
          id: fav.id,
          type: 'anime',
          mal_id: anime.mal_id,
          title: anime.title_english || anime.title,
          image: anime.large_image_url,
        });
      }
    } else if (fav.work_type === 'manga') {
      const { data: manga } = await supabase
        .from('mangas')
        .select('mal_id, title, large_image_url')
        .eq('mal_id', fav.work_id)
        .single();
      if (manga) {
        items.push({
          id: fav.id,
          type: 'manga',
          mal_id: manga.mal_id,
          title: manga.title_english || manga.title,
          image: manga.large_image_url,
        });
      }
    }
  }
  return NextResponse.json(items);
}

export async function POST(request) {
  const body = await request.json();
  const { work_type, work_id } = body;
  if (!work_type || !work_id) {
    return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
  }
  const { error } = await supabase
    .from('favorites')
    .upsert({ profile_id: PROFILE_ID, work_type, work_id }, { onConflict: 'profile_id,work_type,work_id' });
  if (error && error.code !== '42P01') {
    console.error('Erro ao inserir favorito', error);
    return NextResponse.json({ error: 'Erro ao inserir favorito' }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(request) {
  const body = await request.json();
  const { work_type, work_id } = body;
  if (!work_type || !work_id) {
    return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
  }
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('profile_id', PROFILE_ID)
    .eq('work_type', work_type)
    .eq('work_id', work_id);
  if (error && error.code !== '42P01') {
    console.error('Erro ao remover favorito', error);
    return NextResponse.json({ error: 'Erro ao remover favorito' }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
