"use client";
import React, { useEffect, useState } from "react";
import MangaCard from "../../../../components/MangaCard";
import { supabase } from "../../../../../lib/supabaseClient";

export default function RandomManga({ selectedGenre, count = 5 }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function fetchRandom() {
      try {
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
          id: m.mal_id,
          title_english: m.title,
          images: { jpg: { image_url: m.large_image_url } },
          chapters: m.chapters,
          published: { from: m.published_from },
          score: m.score,
        }));
        setItems(formatted);
      } catch (err) {
        console.error("RandomManga:", err);
        setItems([]);
      }
    }
    fetchRandom();
  }, [selectedGenre, count]);

  if (selectedGenre && items.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        Nenhum mangá aleatório disponível para “{selectedGenre}”.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((m) => (
        <MangaCard key={m.id} manga={m} />
      ))}
    </div>
  );
}
