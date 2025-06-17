import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceKey);
const PROFILE_ID = 1;

const animeTables = ['animes', 'season_now', 'season_upcoming', 'top_anime'];

async function findAnime(id) {
  for (const table of animeTables) {
    const { data, error } = await supabase
      .from(table)
      .select('mal_id, title, large_image_url')
      .eq('mal_id', id)
      .single();
    if (data) return data;
    if (error && error.code !== 'PGRST116') console.error(`Erro em ${table}`, error);
  }
  return null;
}

export async function GET() {
  let { data, error } = await supabase
    .from('comments')
    .select('identifier, created_at')
    .eq('profile_id', PROFILE_ID)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error && error.code === '42P01') return NextResponse.json([]);
  if (error) {
    console.error('Erro ao buscar histórico', error);
    return NextResponse.json({ error: 'Erro ao buscar histórico' }, { status: 500 });
  }

  const seen = new Set();
  const unique = [];
  for (const c of data) {
    if (!seen.has(c.identifier)) {
      seen.add(c.identifier);
      unique.push(c);
    }
  }

  const items = [];
  for (const c of unique) {
    const parts = c.identifier.split('-');
    if (parts[0] === 'anime' && parts[2] === 'ep') {
      const animeId = parts[1];
      const ep = parts[3];
      const anime = await findAnime(animeId);
      if (anime) {
        items.push({
          identifier: c.identifier,
          url: `/obra/anime/${animeId}/${ep}`,
          title: anime.title,
          image: anime.large_image_url,
          subtitle: `Episódio ${ep}`,
          created_at: c.created_at,
        });
      }
    } else if (parts[0] === 'manga' && parts[2] === 'cap') {
      const mangaId = parts[1];
      const cap = parts[3];
      const { data: manga } = await supabase
        .from('mangas')
        .select('mal_id, title, large_image_url')
        .eq('mal_id', mangaId)
        .single();
      if (manga) {
        items.push({
          identifier: c.identifier,
          url: `/obra/manga/${mangaId}/${cap}`,
          title: manga.title,
          image: manga.large_image_url,
          subtitle: `Capítulo ${cap}`,
          created_at: c.created_at,
        });
      }
    }
  }

  items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return NextResponse.json(items);
}
