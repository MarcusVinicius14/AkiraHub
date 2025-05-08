"use client";
import React, { useState, useEffect } from "react";
import MangaCard from "../../../../components/MangaCard";
import { supabase } from "../../../../../lib/supabaseClient";

export default function MangaRecommendations() {
  const [base, setBase] = useState(null);
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleRecommendations, setVisibleRecommendations] = useState([]);
  const [page, setPage] = useState(1);
  const cardsPerPage = 4;

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
        const { data, error } = await supabase
          .from("mangas")
          .select("*")
          .limit(30);
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
        const selected = shuffled.slice(0, 30);

        const formatted = selected.map((m) => ({
          ...m,
          id: m.mal_id,
          title_english: m.title,
          images: { jpg: { image_url: m.image_url } },
        }));

        setRecs(formatted);
        setVisibleRecommendations(formatted.slice(0, cardsPerPage));
      } catch (err) {
        console.error("MangaRecommendations:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMangaAndRecs();
  }, []);

  const handleVerMais = () => {
    const nextPage = page + 1;
    const endIndex = nextPage * cardsPerPage;

    setVisibleRecommendations(recs.slice(0, endIndex));
    setPage(nextPage);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-pulse">Carregando recomendações...</div>
      </div>
    );

  if (error)
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">Erro: {error}</div>
    );

  return (
    <div className="space-y-6 mt-4">
      {/* Manga base */}
      {base && (
        <>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Mangá selecionado</h3>
            <MangaCard manga={base} />
          </div>
          <h3 className="text-lg font-semibold mt-6 mb-2">
            Recomendações com base no mangá acima
          </h3>
        </>
      )}
      <div>
        <div className="space-y-4">
          {visibleRecommendations.map((manga) => (
            <MangaCard key={manga.mal_id} manga={manga} />
          ))}
        </div>
        {visibleRecommendations.length < recs.length && (
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
    </div>
  );
}
