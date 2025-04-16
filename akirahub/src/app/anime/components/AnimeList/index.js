"use client";
import React, { useState, useEffect } from "react";
import AnimeListCard from "../AnimeListCard";

export default function AnimeList() {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAnimes() {
      try {
        // Buscamos mais itens para filtrar e depois pegamos 5 itens válidos.
        const res = await fetch("https://api.jikan.moe/v4/top/anime?limit=15");
        if (!res.ok) {
          throw new Error(`Erro ao buscar animes. Status: ${res.status}`);
        }
        const json = await res.json();
        // Filtra para remover os animes do tipo "Movie" ou "TV Special"
        const filtered = json.data.filter(
          (anime) => anime.type !== "Movie" && anime.type !== "TV Special"
        );
        // Pega os 5 primeiros itens do json
        const data = filtered.slice(0, 5);
        setAnimes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAnimes();
  }, []);

  if (loading) return <div>Carregando animes...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className="space-y-4">
      {animes.map((anime) => (
        <AnimeListCard key={anime.mal_id} anime={anime} />
      ))}
    </div>
  );
}
