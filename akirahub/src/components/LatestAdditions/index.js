"use client";
import React, { useState, useEffect } from "react";
import LatestAdditionCard from "../LatestAdditionCard";
import { supabase } from "../../../lib/supabaseClient";

export default function LatestAdditions({ type }) {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    async function fetchLatest() {
      try {
        let response;
        if (type === "anime") {
          response = await supabase
            .from("top_anime")
            .select("*")
            .order("score", { descending: true })
            .limit(2);
        } else if (type === "manga") {
          response = await supabase
            .from("mangas")
            .select("mal_id, title, large_image_url, chapters, score, published_from, year")
            .gte("score", 9.0)
            .order("year", { ascending: false })
            .limit(2);
        } else {
          throw new Error(`Tipo inválido: ${type}`);
        }

        const { data, error } = response;
        if (error) throw error;

        const formatted = data.map((a) => ({
          mal_id: a.mal_id,
          title: a.title,
          title_english: a.title_english || a.title,
          images: { jpg: { large_image_url: a.large_image_url } },
          episodes: a.episodes,
          score: a.score,
          year: a.year,
        }));

        setItems(formatted);
      } catch (err) {
        console.error("LatestAdditions:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchLatest();
  }, [type]);

  if (loading) return <div>Carregando...</div>;
  if (error)   return <div className="text-red-500">Erro: {error}</div>;

  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((item) => (
        <LatestAdditionCard key={item.mal_id} item={item} type={type} />
      ))}
    </div>
  );
}
