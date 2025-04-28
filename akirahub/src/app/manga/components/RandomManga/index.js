"use client";
import React, { useState, useEffect } from "react";
import MangaCard from "../../../../components/MangaCard";
import { supabase } from "../../../../../lib/supabaseClient";

export default function RandomManga({ count = 4 }) {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  function shuffle(array) {
    const a = array.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  useEffect(() => {
    async function fetchRandomMangas() {
      try {
        const { data, error } = await supabase
          .from("mangas")
          .select("*");
        if (error) throw error;
        if (!data || data.length === 0) {
          setItems([]);
          return;
        }

        const shuffled = shuffle(data);
        const selected = shuffled.slice(0, count);

        const formatted = selected.map((m) => ({
          ...m,
          title_english: m.title,
          images: { jpg: { image_url: m.image_url } },
        }));

        setItems(formatted);
      } catch (err) {
        console.error("RandomManga:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchRandomMangas();
  }, [count]);

  if (loading) return <div>Carregando mangas aleatórios…</div>;
  if (error)   return <div>Erro: {error}</div>;

  return (
    <div className="space-y-4">
      {items.map((m) => (
        <MangaCard key={m.mal_id} manga={m} />
      ))}
    </div>
  );
}
