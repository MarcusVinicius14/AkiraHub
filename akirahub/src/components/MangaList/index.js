"use client";
import React, { useState, useEffect } from "react";
import MangaCard from "../MangaCard";
import { supabase } from "../../../lib/supabaseClient";

export default function MangaList() {
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMangas() {
      try {
        const { data, error } = await supabase
          .from("mangas")
          .select("*")
          .order("mal_id", { ascending: true })
          .limit(6);
        if (error) throw error;

        const formatted = data.map((m) => ({
          ...m,
          title_english: m.title,
          images: { jpg: { image_url: m.image_url } },
        }));

        setMangas(formatted);
      } catch (err) {
        console.error("MangaList:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMangas();
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
}
