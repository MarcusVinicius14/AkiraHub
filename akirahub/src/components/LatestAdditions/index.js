"use client";
import React, { useState, useEffect } from "react";
import LatestAdditionCard from "../LatestAdditionCard";
import { supabase } from "../../../lib/supabaseClient";

export default function LatestAdditions({ type }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleLatestAddiction, setvisibleLatestAddiction] = useState([]);
  const [page, setPage] = useState(1);
  const cardsPerPage = 2;

  useEffect(() => {
    async function fetchLatest() {
      try {
        let response;
        if (type === "anime") {
          response = await supabase
            .from("top_anime")
            .select("*")
            .order("score", { descending: true })
            .limit(30);
        } else if (type === "manga") {
          response = await supabase
            .from("mangas")
            .select("*")
            .eq("year", 2024)
            .order("year", { descending: true })
            .limit(30);
        } else {
          throw new Error(`Tipo inválido: ${type}`);
        }

        const { data, error } = response;
        if (error) throw error;

        const formatted = data.map((a) => ({
          mal_id: a.mal_id,
          title: a.title,
          title_english: a.title_english || a.title,
          large_image_url: a.large_image_url,
          episodes: a.episodes,
          score: a.score,
          year: a.year,
        }));

        setItems(formatted);
        setvisibleLatestAddiction(formatted.slice(0, cardsPerPage));
      } catch (err) {
        console.error("LatestAdditions:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchLatest();
  }, [type]);

  const handleVerMais = () => {
    const nextPage = page + 1;
    const startIndex = 0;
    const endIndex = nextPage * cardsPerPage;

    setvisibleLatestAddiction(items.slice(startIndex, endIndex));
    setPage(nextPage);
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div className="text-red-500">Erro: {error}</div>;

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        {visibleLatestAddiction.map((item) => (
          <LatestAdditionCard key={item.mal_id} item={item} type={type} />
        ))}
      </div>
      {visibleLatestAddiction.length < items.length && (
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
