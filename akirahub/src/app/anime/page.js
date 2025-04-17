// src/app/anime/page.js
"use client";
import React, { useEffect, useState } from "react";
import TopNavbar         from "../../components/TopNavbar";
import Header            from "../../components/Header";
import AnimeFiltersRow   from "./components/AnimeFiltersRow";
import LatestAdditionCard from "../../components/LatestAdditionCard";
import NewsList          from "../../components/NewsList";
import AnimeCard         from "../../components/AnimeCard";

export default function AnimePage() {
  const [topAnimes, setTopAnimes] = useState([]);

  useEffect(() => {
    fetch("https://api.jikan.moe/v4/top/anime")
      .then((r) => {
        if (!r.ok) throw new Error(`Status: ${r.status}`);
        return r.json();
      })
      .then((json) => {
        // garante que json.data seja um array antes de usar slice
        const arr = Array.isArray(json?.data) ? json.data : [];
        setTopAnimes(arr.slice(0, 4));
      })
      .catch((err) => {
        console.error("Erro ao buscar top animes:", err);
        setTopAnimes([]); // fallback vazio
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <TopNavbar />
      <Header />

      {/* filtros */}
      <main className="container mx-auto px-4 pt-4">
        <AnimeFiltersRow />

        {/* grid de 3 colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          
          {/* coluna 1: próxima temporada */}
          <div className="space-y-4 overflow-auto">
            <h2 className="text-xl font-bold">Próxima temporada</h2>
            <SeasonList
              endpoint="https://api.jikan.moe/v4/seasons/upcoming"
              limit={4}
            />
          </div>

          {/* coluna 2: notícias + top 4 animes */}
          <div className="space-y-6 flex flex-col">
            <div>
              <h2 className="text-xl font-bold mb-2">Últimas notícias</h2>
              <NewsList />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Top Animes</h2>
              <div className="grid grid-cols-2 gap-4">
                {topAnimes.map((anime) => (
                  <LatestAdditionCard
                    key={anime.mal_id}
                    item={anime}
                    type="anime"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* coluna 3: temporada atual */}
          <div className="space-y-4 overflow-auto">
            <h2 className="text-xl font-bold">Temporada atual</h2>
            <SeasonList
              endpoint="https://api.jikan.moe/v4/seasons/now"
              limit={4}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

// Reaproveita AnimeCard para uniformizar o visual de cards
function SeasonList({ endpoint, limit }) {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    fetch(endpoint)
      .then((r) => {
        if (!r.ok) throw new Error(`Status: ${r.status}`);
        return r.json();
      })
      .then((json) => {
        const arr = Array.isArray(json?.data) ? json.data : [];
        setItems(arr.slice(0, limit));
      })
      .catch((e) => {
        console.error(`Erro ao buscar ${endpoint}:`, e);
        setError(e.message);
      })
      .finally(() => setLoading(false));
  }, [endpoint, limit]);

  if (loading) return <div>Carregando...</div>;
  if (error)   return <div>Erro: {error}</div>;

  return (
    <div className="space-y-4">
      {items.map((anime) => (
        <AnimeCard key={anime.mal_id} anime={anime} />
      ))}
    </div>
  );
}
