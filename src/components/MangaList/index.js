"use client";
import React, { useState, useEffect } from "react";
import MangaCard from "../MangaCard";
import { supabase } from "../../../lib/supabaseClient";

export default function MangaList() {
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleMangas, setVisibleMangas] = useState([]);
  const [page, setPage] = useState(1);
  const cardsPerPage = 6;

  useEffect(() => {
    async function fetchMangas() {
      try {
        const { data, error } = await supabase
          .from("mangas")
          .select("*")
          .order("mal_id", { ascending: true })
          .limit(30);
        if (error) throw error;

        const formatted = data.map((m) => ({
          ...m,
          id: m.mal_id,
          title_english: m.title,
          large_image_url: m.large_image_url,
        }));

        setMangas(formatted);
        setVisibleMangas(formatted.slice(0, cardsPerPage));
      } catch (err) {
        console.error("MangaList:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMangas();
  }, []);

  const handleVerMais = () => {
    const nextPage = page + 1;
    const startIndex = 0;
    const endIndex = nextPage * cardsPerPage;

    setVisibleMangas(mangas.slice(startIndex, endIndex));
    setPage(nextPage);
  };

  //  if (loading) {
  //    return (
  //      <div className="w-full flex justify-center py-10">
  //       <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
  //     </div>
  //    );
  // }

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      <div className="space-y-4">
        {visibleMangas.map((manga) => (
          <MangaCard key={manga.mal_id} manga={manga} />
        ))}
      </div>

      {visibleMangas.length < mangas.length && (
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
