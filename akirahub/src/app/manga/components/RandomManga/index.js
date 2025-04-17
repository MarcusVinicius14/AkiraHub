"use client";
import React, { useState, useEffect } from "react";
import MangaCard from "../../../../components/MangaCard";

export default function RandomManga({ count = 4 }) {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const pause = ms => new Promise(res => setTimeout(res, ms));

  useEffect(() => {
    async function fetchRandoms() {
      try {
        const results = [];
        while (results.length < count) {
          // id aleatório
          const id = Math.floor(Math.random() * 5000) + 1;
          let res = await fetch(`https://api.jikan.moe/v4/manga/${id}`);
          if (res.status === 429) {
            await pause(1200);
            res = await fetch(`https://api.jikan.moe/v4/manga/${id}`);
          }
          if (!res.ok) continue;
          const json = await res.json();
          if (json.data) results.push(json.data);
          await pause(1200);
        }
        setItems(results);
      } catch (err) {
        console.error("RandomManga:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchRandoms();
  }, [count]);

  if (loading) return <div>Carregando mangas aleatórios…</div>;
  if (error)   return <div>Erro: {error}</div>;

  return (
    <div className="space-y-4">
      {items.map(m => (
        <MangaCard key={m.mal_id} manga={m} />
      ))}
    </div>
  );
}
