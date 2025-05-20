import fs from 'fs/promises';

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchJson(url, retries = 5, delayMs = 2000) {
  const res = await fetch(url);
  if (res.status === 429 && retries > 0) {
    console.warn(`⚠️ 429 recebido. Retry em ${delayMs/1000}s... (${retries} left)`);
    await wait(delayMs);
    return fetchJson(url, retries - 1, delayMs * 2);
  }
  if (!res.ok) throw new Error(`Erro ${res.status} ao buscar ${url}`);
  return res.json();
}

async function main() {
  const BASE        = 'https://api.jikan.moe/v4/anime';
  const PER_PAGE    = 25;
  const TARGET      = 3000;
  const SEGMENTS    = 100;
  const MAX_PAGE    = 1146;

  console.log('🔍 Descobrindo total de páginas…');
  const meta       = await fetchJson(`${BASE}?page=1&limit=1`);
  const rawLast    = meta.pagination.last_visible_page;
  const lastPage   = Math.min(rawLast, MAX_PAGE);
  console.log(`Total de páginas oficiais: ${rawLast}, usando até: ${lastPage}`);

  const pages = new Set([1, lastPage]);
  for (let i = 0; i < SEGMENTS; i++) {
    const p = Math.floor((i / (SEGMENTS - 1)) * (lastPage - 1)) + 1;
    pages.add(p);
  }
  const pageList = Array.from(pages).sort((a,b)=>a-b);

  const seen  = new Set();
  const items = [];
  console.log(`Buscando em ${pageList.length} páginas (até a ${lastPage})…`);

  for (const page of pageList) {
    if (items.length >= TARGET) break;
    console.log(`🔍 Página ${page}/${lastPage}`);
    let json;
    try {
      json = await fetchJson(`${BASE}?page=${page}&limit=${PER_PAGE}`);
    } catch (err) {
      console.error(`❌ Falha página ${page}:`, err.message);
      continue;
    }
    for (const m of json.data) {
      if (items.length >= TARGET) break;
      if (['TV Special','Movie','OVA','Special','ONA'].includes(m.type)) continue;
      if (seen.has(m.mal_id)) continue;
      seen.add(m.mal_id);

      const genres = (m.genres||[]).map(g=>g.name||'').slice(0,3);
      const rawDate = m.published?.from || '';
      const published_from = rawDate.split('T')[0] || '';
      const year           = published_from.split('-')[0] || '';

      items.push({
        mal_id:          m.mal_id,
        title:           m.title,
        large_image_url: m.images.jpg.large_image_url,
        episodes:        m.episodes ?? '',
        score:           m.score   ?? '',
        year,
        genre1:          genres[0]||'',
        genre2:          genres[1]||'',
        genre3:          genres[2]||'',
      });
    }
    await wait(500);
  }

  console.log(`\n🎯 Obtivemos ${items.length} mangás. Gerando CSV…`);
  const header = [
    'mal_id','title','large_image_url',
    'episodes','score','year',
    'genre1','genre2','genre3'
  ];
  const esc = v => `"${String(v).replace(/"/g,'""')}"`;
  const csv = [
    header.join(','),
    ...items.map(r => header.map(f => esc(r[f])).join(','))
  ].join('\n');

  await fs.writeFile('export_all_anime.csv', csv);
  console.log('✅ CSV gerado em export_all_anime.csv');
}

main().catch(err => {
  console.error('Erro inesperado:', err);
  process.exit(1);
});
