"use client";
import React, { useState, useEffect } from "react";
import MangaCard from "../../../../components/MangaCard";

export default function TopMangaList({ limit = 4 }) {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // pausa de retry em ms
  const pause = ms => new Promise(res => setTimeout(res, ms));

  useEffect(() => {
    async function fetchTop() {
      try {
        let res = await fetch("https://api.jikan.moe/v4/manga");
        if (res.status === 429) {
          await pause(2000);
          res = await fetch("https://api.jikan.moe/v4/manga");
        }
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        const json = await res.json();
        const arr  = Array.isArray(json.data) ? json.data : [];
        setItems(arr.slice(0, limit));
      } catch (err) {
        console.error("TopMangaList:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTop();
  }, [limit]);

  if (loading) return <div>Carregando top mangás…</div>;
  if (error)   return <div>Erro: {error}</div>;

  return (
    <div className="space-y-4">
      {items.map(manga => (
        <MangaCard key={manga.mal_id} manga={manga} />
      ))}
    </div>
  );
}
