"use client";
import React, { useState, useEffect } from "react";
import AnimeCard from "../AnimeCard";
import { supabase } from "../../../lib/supabaseClient";

export default function AnimeList() {
  const [animes, setAnimes]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    async function fetchAnimes() {
      try {
        const { data, error } = await supabase
          .from("top_anime")
          .select("*")
          .order("score", { descending: true });
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

        const formatted = sorted.slice(0, 6).map((a) => ({
          mal_id: a.mal_id,
          title: a.title,
          title_english: a.title_english || a.title,
          images: { jpg: { large_image_url: a.large_image_url } },
          episodes: a.episodes,
          score: a.score,
          year: a.year,
          type: a.type,
        }));

        setAnimes(formatted);
      } catch (err) {
        console.error("AnimeList:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAnimes();
  }, []);

  if (loading) return <div>Carregando animes...</div>;
  if (error)   return <div className="text-red-500">Erro: {error}</div>;
  if (animes.length === 0) return <div>Nenhum anime encontrado em <code>top_anime</code>.</div>;

  return (
    <div className="space-y-4">
      {animes.map((anime) => (
        <AnimeCard key={anime.mal_id} anime={anime} />
      ))}
    </div>
  );
}
