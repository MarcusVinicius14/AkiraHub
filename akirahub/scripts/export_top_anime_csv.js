import fs from 'fs/promises';

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Erro ao buscar JSON: ${res.status}`);
  return res.json();
}

async function main() {
  const url = 'https://api.jikan.moe/v4/top/anime?limit=25';
  const { data } = await fetchJson(url);

  const rows = data
    .filter(
      item =>
        item.type !== 'TV Special' &&
        item.type !== 'Movie' &&
        item.year != null
    )
    .map(item => {
      const genres = (item.genres || [])
        .filter(g => g.name)
        .slice(0, 3)
        .map(g => g.name);

      return {
        mal_id: item.mal_id,
        title: item.title,
        large_image_url: item.images.jpg.large_image_url,
        episodes: item.episodes,
        score: item.score,
        year: item.year,
        genre1: genres[0] || '',
        genre2: genres[1] || '',
        genre3: genres[2] || '',
      };
    });

  const header = [
    'mal_id',
    'title',
    'large_image_url',
    'episodes',
    'score',
    'year',
    'genre1',
    'genre2',
    'genre3',
  ];
  const escape = str => `"${String(str).replace(/"/g, '""')}"`;
  const csv =
    header.join(',') +
    '\n' +
    rows
      .map(r => header.map(field => escape(r[field])).join(','))
      .join('\n');

  await fs.writeFile('top_anime.csv', csv);
  console.log('✅ CSV gerado em top_anime.csv (sem TV Specials, Movies ou anos nulos)');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
