"use client";
import React, { useState, useEffect } from "react";
import NewsCard from "../NewsCard";

const NewsList = () => {
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch('/api/news');
        if (!response.ok) {
          throw new Error(`Erro ao buscar notícias: ${response.status}`);
        }
        const data = await response.json();
        // data deve ser um array de itens do feed
        // Filtra removendo notícias com categoria "Games" ou "Event"
        const filtered = data.filter((item) => {
          if (!item.categories || item.categories.length === 0) return true;
          // Converte as categorias para minúsculas para comparação
          const cats = item.categories.map((c) => c.toLowerCase());
          return !cats.includes("games") && !cats.includes("event");
        });
        // Seleciona o primeiro item filtrado quando tiver
        if (filtered.length > 0) {
          setNewsItem(filtered[0]);
        }
      } catch (err) {
        console.error("Erro na requisição de notícias:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  if (loading) return <div>Carregando notícias...</div>;
  if (error) return <div>Erro: {error}</div>;
  if (!newsItem) return <div>Nenhuma notícia disponível</div>;

  return (
    <div className="space-y-4">
      <NewsCard news={newsItem} />
    </div>
  );
};

export default NewsList;
