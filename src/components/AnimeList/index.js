"use client";

import React, { useState, useEffect } from "react";
import AnimeCard from "../AnimeCard";
import { supabase } from "../../../lib/supabaseClient";

export default function AnimeList() {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleAnimes, setVisibleAnimes] = useState([]);
  const [page, setPage] = useState(1);
  const cardsPerPage = 6;

  useEffect(() => {
    async function fetchTopAnimes() {
      try {
        const { data, error } = await supabase
          .from("animes")
          .select("mal_id, title, episodes, score, year, large_image_url, genre1, genre2")
          .not("score", "is", null)
          .order("score", { ascending: false })
          .limit(30);

        if (error) throw error;

        const list = data || [];
        setAnimes(list);
        setVisibleAnimes(list.slice(0, cardsPerPage));
        setPage(1);
      } catch (err) {
        console.error("AnimeList:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTopAnimes();
  }, []);

  const handleVerMais = () => {
    const nextPage = page + 1;
    const endIndex = nextPage * cardsPerPage;
    setVisibleAnimes(animes.slice(0, endIndex));
    setPage(nextPage);
  };

  if (loading) return <div>Carregando animes...</div>;
  if (error) return <div className="text-red-500">Erro: {error}</div>;
  if (animes.length === 0) return <div>Nenhum anime encontrado.</div>;

  return (
    <div>
      <div className="space-y-4">
        {visibleAnimes.map((anime) => (
          <AnimeCard key={anime.mal_id} anime={anime} />
        ))}
      </div>
      {visibleAnimes.length < animes.length && (
        <div className="flex items-center justify-center mt-5">
          <button
            onClick={handleVerMais}
            className="bg-gray-200 hover:bg-gray-100 active:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Ver mais
          </button>
        </div>
      )}
    </div>
  );
}
