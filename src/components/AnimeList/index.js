"use client";
import React, { useState, useEffect } from "react";
import AnimeCard from "../AnimeCard";
import { supabase } from "../../../lib/supabaseClient";

export default function AnimeList({ genre = "" }) {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleAnimes, setVisibleAnimes] = useState([]);
  const [page, setPage] = useState(1);
  const cardsPerPage = 6;

  useEffect(() => {
    async function fetchAnimes() {
      try {
        let query = supabase.from("animes").select("*").limit(30);
        if (genre) {
          query = query.or(
            `genre1.eq.${genre},genre2.eq.${genre},genre3.eq.${genre}`
          );
        }
        const { data, error } = await query.order("score", { descending: true });
        if (error) throw error;

        if (!data || data.length === 0) {
          setAnimes([]);
          return;
        }

        const sorted = data.slice().sort((a, b) => {
          const sa = parseFloat(a.score);
          const sb = parseFloat(b.score);
          return sb - sa; // maior score primeiro
        });

        const formatted = sorted.map((a) => ({
          mal_id: a.mal_id,
          title: a.title,
          title_english: a.title_english || a.title,
          large_image_url: a.large_image_url, // Corrigido para usar large_image_url
          episodes: a.episodes,
          score: a.score,
          year: a.year,
          type: a.type,
        }));

        setAnimes(formatted);
        setVisibleAnimes(formatted.slice(0, cardsPerPage));
        setPage(1);
      } catch (err) {
        console.error("AnimeList:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAnimes();
  }, [genre]);

  const handleVerMais = () => {
    const nextPage = page + 1;
    const startIndex = 0;
    const endIndex = nextPage * cardsPerPage;

    setVisibleAnimes(animes.slice(startIndex, endIndex));
    setPage(nextPage);
  };

  if (loading) return <div>Carregando animes...</div>;
  if (error) return <div className="text-red-500">Erro: {error}</div>;
  if (animes.length === 0)
    return <div>Nenhum anime encontrado.</div>;

  return (
    <div>
      <div className="space-y-4">
        {visibleAnimes.map((anime) => (
          <AnimeCard key={anime.mal_id} anime={anime} />
        ))}
      </div>
      {visibleAnimes.length < animes.length && (
        <div className=" flex items-center justify-center mt-5 ">
          <button
            onClick={handleVerMais}
            className="bg-gray-200 hover:bg-gray-100 active:bg-gray-200 cursor-pointer text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Ver mais
          </button>
        </div>
      )}
    </div>
  );
}
