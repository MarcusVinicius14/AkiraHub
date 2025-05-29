"use client";
import React, { useEffect, useState } from "react";
import MangaCard from "../../../../components/MangaCard";
import { supabase } from "../../../../../lib/supabaseClient";

export default function TopMangaList({ limit = 5, selectedGenre }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function fetchTop() {
      try {
        let query = supabase
          .from("mangas")
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
      } catch (err) {
        console.error("TopMangaList:", err);
        setItems([]);
      }
    }
    fetchTop();
  }, [limit, selectedGenre]);

  if (selectedGenre && items.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        Nenhum mangá encontrado em “{selectedGenre}”.
      </div>
    );
  }

  return (
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
    </div>
  );
}
