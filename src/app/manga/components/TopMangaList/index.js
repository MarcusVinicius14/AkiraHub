"use client";
import React, { useState, useEffect } from "react";
import MangaCard from "../../../../components/MangaCard";
import { supabase } from "../../../../../lib/supabaseClient";

export default function TopMangaList({ genre = "" }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleMangas, setVisibleMangas] = useState([]);
  const [page, setPage] = useState(1);
  const cardsPerPage = 6;

  useEffect(() => {
    async function fetchTopMangas() {
      try {
        setLoading(true);
        let query = supabase.from("mangas").select("*").limit(30);
        if (genre) {
          query = query.or(
            `genre1.eq.${genre},genre2.eq.${genre},genre3.eq.${genre}`
          );
        }
        const { data, error } = await query.order("mal_id", { ascending: true });
        if (error) throw error;

        const formatted = data.map((m) => ({
          ...m,
          id: m.mal_id,
          title_english: m.title,
          images: { jpg: { image_url: m.image_url } },
        }));

        setItems(formatted);
        setVisibleMangas(formatted.slice(0, cardsPerPage));
        setPage(1);
      } catch (err) {
        console.error("TopMangaList:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTopMangas();
  }, [genre]);

  const handleVerMais = () => {
    const nextPage = page + 1;
    const startIndex = 0;
    const endIndex = nextPage * cardsPerPage;

    setVisibleMangas(items.slice(startIndex, endIndex));
    setPage(nextPage);
  };

  if (loading) return <div>Carregando top mangás…</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      <div className="space-y-4">
        {visibleMangas.map((manga) => (
          <MangaCard key={manga.mal_id} manga={manga} />
        ))}
      </div>
      {visibleMangas.length < items.length && (
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
