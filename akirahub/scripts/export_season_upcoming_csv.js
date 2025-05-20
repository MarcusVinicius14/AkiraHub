import fs from 'fs/promises';

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchJson(url, retries = 5, delayMs = 2000) {
  const res = await fetch(url);
  if (res.status === 429 && retries > 0) {
    console.warn(`⚠️ 429 recebido. Retentando em ${delayMs/1000}s... (${retries} retries restantes)`);
    await wait(delayMs);
    return fetchJson(url, retries - 1, delayMs * 2);
  }
  if (!res.ok) {
    throw new Error(`Erro ao buscar JSON: ${res.status}`);
  }
  return res.json();
}

async function main() {
  const BASE_URL  = 'https://api.jikan.moe/v4/seasons/upcoming';
  const PAGE_SIZE = 25;
  const TARGET    = 100;

  const seen      = new Set();
  const rows      = [];
  let page        = 1;

  while (rows.length < TARGET) {
    const url = `${BASE_URL}?page=${page}&limit=${PAGE_SIZE}`;
    console.log(`🔍 Buscando página ${page}...`);
    let json;
    try {
      json = await fetchJson(url);
    } catch (err) {
      console.error(`❌ Falha na página ${page}:`, err.message);
      break;
    }
    const data = json.data || [];
    if (data.length === 0) break;

    for (const item of data) {
      if (rows.length >= TARGET) break;

      if (['TV Special','Movie','Special','ONA','OVA'].includes(item.type)) {
        continue;
      }
      if (seen.has(item.mal_id)) continue;
      seen.add(item.mal_id);

      const genres = (item.genres || [])
        .map(g => g.name || '')
        .slice(0, 3);

      rows.push({
        mal_id:          item.mal_id,
        title:           item.title,
        large_image_url: item.images.jpg.large_image_url,
        year:            item.year     != null ? item.year     : '',
        genre1:          genres[0] || '',
        genre2:          genres[1] || '',
        genre3:          genres[2] || '',
      });
    }

    page++;
  }

  const header = [
    'mal_id','title','large_image_url',
    'year','genre1','genre2','genre3'
  ];
  const escape = str => `"${String(str).replace(/"/g, '""')}"`;
  const csv = [
    header.join(','),
    ...rows.map(r => header.map(f => escape(r[f])).join(','))
  ].join('\n');

  await fs.writeFile('anime_season_upcoming.csv', csv);
  console.log(`✅ anime_season_upcoming.csv gerado com ${rows.length} registros.`);
}

main().catch(err => {
  console.error('Erro inesperado:', err);
  process.exit(1);
});
