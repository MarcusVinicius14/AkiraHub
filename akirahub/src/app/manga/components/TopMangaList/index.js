"use client";
import React, { useState, useEffect } from "react";
import MangaCard from "../../../../components/MangaCard";
import { supabase } from "../../../../../lib/supabaseClient";

export default function TopMangaList({ limit = 4 }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTopMangas() {
      try {
        const { data, error } = await supabase
          .from("mangas")
          .select("*")
          .order("mal_id", { ascending: true })
          .limit(limit);
        if (error) throw error;

        const formatted = data.map((m) => ({
          ...m,
          id: m.mal_id,
          title_english: m.title,
          images: { jpg: { image_url: m.image_url } },
        }));

        setItems(formatted);
      } catch (err) {
        console.error("TopMangaList:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTopMangas();
  }, [limit]);

  if (loading) return <div>Carregando top mangás…</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className="space-y-4">
      {items.map((manga) => (
        <MangaCard key={manga.mal_id} manga={manga} />
      ))}
    </div>
  );
}
