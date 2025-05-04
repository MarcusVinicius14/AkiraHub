"use client";
import React, { useState, useEffect } from "react";
import MangaCard from "../../../../components/MangaCard";
import { supabase } from "../../../../../lib/supabaseClient";

export default function MangaRecommendations({ count = 3 }) {
  const [base, setBase] = useState(null);
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function shuffle(array) {
    const a = array.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  useEffect(() => {
    async function fetchMangaAndRecs() {
      try {
        const { data, error } = await supabase.from("mangas").select("*");
        if (error) throw error;
        if (!data || data.length === 0) {
          throw new Error("Nenhum mangá encontrado");
        }

        const all = data;
        const idx = Math.floor(Math.random() * all.length);
        const baseManga = all[idx];
        setBase({
          ...baseManga,
          id: baseManga.mal_id,
          title_english: baseManga.title,
          images: { jpg: { image_url: baseManga.image_url } },
        });

        const others = all.filter((m) => m.mal_id !== baseManga.mal_id);
        const shuffled = shuffle(others);
        const selected = shuffled.slice(0, count);
        setRecs(
          selected.map((m) => ({
            ...m,
            id: m.mal_id,
            title_english: m.title,
            images: { jpg: { image_url: m.image_url } },
          }))
        );
      } catch (err) {
        console.error("MangaRecommendations:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMangaAndRecs();
  }, [count]);

  if (loading) return <div>Carregando recomendações…</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className="space-y-6 mt-4">
      {/* Manga base */}
      {base && (
        <>
          <MangaCard manga={base} />
          <h3 className="text-lg font-semibold mt-4 mb-2">
            Recomendações com base no mangá acima
          </h3>
        </>
      )}

      <div className="space-y-4">
        {recs.map((manga) => (
          <MangaCard key={manga.mal_id} manga={manga} />
        ))}
      </div>
    </div>
  );
}
