"use client";
import React, { useState, useEffect } from "react";
import MangaCard from "../../../../components/MangaCard";
import { supabase } from "../../../../../lib/supabaseClient";

export default function RandomManga() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleRecommendations, setVisibleRecommendations] = useState([]);
  const [page, setPage] = useState(1);
  const cardsPerPage = 6;

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
          .select("*")
          .limit(30);
        if (error) throw error;
        if (!data || data.length === 0) {
          setItems([]);
          return;
        }

        const shuffled = shuffle(data);
        const selected = shuffled.slice(0, 30);

        const formatted = selected.map((m) => ({
          ...m,
          id: m.mal_id,
          title_english: m.title,
          images: { jpg: { image_url: m.image_url } },
        }));

        setItems(formatted);
        setVisibleRecommendations(formatted.slice(0, cardsPerPage));
      } catch (err) {
        console.error("RandomManga:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchRandomMangas();
  }, []);

  const handleVerMais = () => {
    const nextPage = page + 1;
    const endIndex = nextPage * cardsPerPage;

    setVisibleRecommendations(items.slice(0, endIndex));
    setPage(nextPage);
  };

  if (loading) return <div>Carregando mangas aleatórios…</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      <div className="space-y-4">
        {visibleRecommendations.map((manga) => (
          <MangaCard key={manga.mal_id} manga={manga} />
        ))}
      </div>
      {visibleRecommendations.length < items.length && (
        <div className="flex items-center justify-center mt-5">
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
