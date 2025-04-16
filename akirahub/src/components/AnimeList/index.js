"use client";
import React, { useState, useEffect } from "react";
import AnimeCard from "../AnimeCard";

const AnimeList = () => {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTopAnimes() {
      try {
        const res = await fetch("https://api.jikan.moe/v4/top/anime");
        if (!res.ok) {
          throw new Error(`Erro ao buscar os top animes. Status: ${res.status}`);
        }
        const json = await res.json();
        // Filtra removendo animes do tipo "TV Special" e "Movie" e pega os 6 primeiros
        const topAnimes = json.data
          .filter(
            (anime) =>
              anime.type !== "TV Special" && anime.type !== "Movie"
          )
          .slice(0, 6);
        setAnimes(topAnimes);
      } catch (err) {
        console.error("Erro:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTopAnimes();
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className="space-y-4">
      {animes.map((anime) => (
        <AnimeCard key={anime.mal_id} anime={anime} />
      ))}
    </div>
  );
};

export default AnimeList;
