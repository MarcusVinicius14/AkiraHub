"use client";
import React, { useState, useEffect } from "react";
import MangaCard from "../MangaCard";

const MangaList = () => {
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTopMangas() {
      try {
        const res = await fetch("https://api.jikan.moe/v4/top/manga");
        if (!res.ok) {
          throw new Error(`Erro ao buscar os top mangas. Status: ${res.status}`);
        }
        const json = await res.json();
        const topMangas = json.data.slice(0, 6);
        setMangas(topMangas);
      } catch (err) {
        console.error("Erro:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTopMangas();
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className="space-y-4">
      {mangas.map((manga) => (
        <MangaCard key={manga.mal_id} manga={manga} />
      ))}
    </div>
  );
};

export default MangaList;
