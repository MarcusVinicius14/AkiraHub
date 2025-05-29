"use client";
import React, { useEffect, useState } from "react";
import MangaCard from "../../../../components/MangaCard";
import { supabase } from "../../../../../lib/supabaseClient";

<<<<<<< HEAD
export default function TopMangaList({ limit = 5, selectedGenre }) {
  const [items, setItems] = useState([]);
=======
export default function TopMangaList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleMangas, setVisibleMangas] = useState([]);
  const [page, setPage] = useState(1);
  const cardsPerPage = 6;
>>>>>>> a5e7dae38d6c2a3e772c1f29615581fd40500ead

  useEffect(() => {
    async function fetchTop() {
      try {
        let query = supabase
          .from("mangas")
<<<<<<< HEAD
          .select(
            "mal_id,title,large_image_url,chapters,score,published_from,year,genre1,genre2,genre3"
          );

        if (selectedGenre) {
          query = query.or(
            `genre1.eq.${selectedGenre},genre2.eq.${selectedGenre},genre3.eq.${selectedGenre}`
          );
        }

        const { data = [], error } = await query
          .order("score", { descending: true })
          .limit(limit);
        if (error) throw error;

        setItems(data);
=======
          .select("*")
          .order("mal_id", { ascending: true })
          .limit(30);
        if (error) throw error;

        const formatted = data.map((m) => ({
          ...m,
          id: m.mal_id,
          title_english: m.title,
          images: { jpg: { image_url: m.image_url } },
        }));

        setItems(formatted);
        setVisibleMangas(formatted.slice(0, cardsPerPage));
>>>>>>> a5e7dae38d6c2a3e772c1f29615581fd40500ead
      } catch (err) {
        console.error("TopMangaList:", err);
        setItems([]);
      }
    }
<<<<<<< HEAD
    fetchTop();
  }, [limit, selectedGenre]);
=======
    fetchTopMangas();
  }, []);

  const handleVerMais = () => {
    const nextPage = page + 1;
    const startIndex = 0;
    const endIndex = nextPage * cardsPerPage;

    setVisibleMangas(items.slice(startIndex, endIndex));
    setPage(nextPage);
  };
>>>>>>> a5e7dae38d6c2a3e772c1f29615581fd40500ead

  if (selectedGenre && items.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        Nenhum mangá encontrado em “{selectedGenre}”.
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className="space-y-4">
      {items.map((m) => (
        <MangaCard
          key={m.mal_id}
          manga={{
            mal_id: m.mal_id,
            title: m.title,
            images: { jpg: { image_url: m.large_image_url } },
            chapters: m.chapters,
            published: { from: m.published_from },
            score: m.score,
            year: m.year,
          }}
        />
      ))}
=======
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
>>>>>>> a5e7dae38d6c2a3e772c1f29615581fd40500ead
    </div>
  );
}
