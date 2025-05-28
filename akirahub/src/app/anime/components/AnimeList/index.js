"use client";
import React, { useState, useEffect } from "react";
import AnimeListCard from "../AnimeListCard";
import { supabase } from "../../../../../lib/supabaseClient";

export default function AnimeList() {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAnimes() {
      try {
        const { data, error } = await supabase
          .from("animes")
          .select("*")
          .order("score", { descending: true })
          .limit(5);

        if (error) throw error;

        const formatted = data.map((a) => ({
          mal_id: a.mal_id,
          title: a.title,
          title_english: a.title,
          large_image_url: a.large_image_url,
          episodes: a.episodes,
          score: a.score,
          year: a.year,
        }));

        setAnimes(formatted);
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
