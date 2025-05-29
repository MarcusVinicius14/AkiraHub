"use client";
import React, { useEffect, useState } from "react";
import MangaCard from "../../../../components/MangaCard";
import { supabase } from "../../../../../lib/supabaseClient";

<<<<<<< HEAD
export default function RandomManga({ selectedGenre, count = 5 }) {
  const [items, setItems] = useState([]);
=======
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
>>>>>>> a5e7dae38d6c2a3e772c1f29615581fd40500ead

  useEffect(() => {
    async function fetchRandom() {
      try {
<<<<<<< HEAD
        let query = supabase
          .from("mangas")
          .select(
            "mal_id,title,large_image_url,chapters,score,published_from,genre1,genre2,genre3"
          );
        if (selectedGenre) {
          query = query.or(
            `genre1.eq.${selectedGenre},genre2.eq.${selectedGenre},genre3.eq.${selectedGenre}`
          );
        }
        const { data = [], error } = await query;
        if (error) throw error;
        const shuffled = data.sort(() => 0.5 - Math.random()).slice(0, count);
        const formatted = shuffled.map((m) => ({
=======
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
>>>>>>> a5e7dae38d6c2a3e772c1f29615581fd40500ead
          id: m.mal_id,
          title_english: m.title,
          images: { jpg: { image_url: m.large_image_url } },
          chapters: m.chapters,
          published: { from: m.published_from },
          score: m.score,
        }));
        setItems(formatted);
        setVisibleRecommendations(formatted.slice(0, cardsPerPage));
      } catch (err) {
        console.error("RandomManga:", err);
        setItems([]);
      }
    }
<<<<<<< HEAD
    fetchRandom();
  }, [selectedGenre, count]);
=======
    fetchRandomMangas();
  }, []);

  const handleVerMais = () => {
    const nextPage = page + 1;
    const endIndex = nextPage * cardsPerPage;

    setVisibleRecommendations(items.slice(0, endIndex));
    setPage(nextPage);
  };
>>>>>>> a5e7dae38d6c2a3e772c1f29615581fd40500ead

  if (selectedGenre && items.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        Nenhum mangá aleatório disponível para “{selectedGenre}”.
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className="space-y-4">
      {items.map((m) => (
        <MangaCard key={m.id} manga={m} />
      ))}
=======
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
>>>>>>> a5e7dae38d6c2a3e772c1f29615581fd40500ead
    </div>
  );
}
