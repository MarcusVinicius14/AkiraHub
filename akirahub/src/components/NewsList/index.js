"use client";
import React, { useState, useEffect } from "react";
import NewsCard from "../NewsCard";

export default function NewsList() {
  const [news, setNews]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch("/api/news");
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        const data = await res.json();

        const filtered = data.filter(item => {
          const cat = (item.category || "").toLowerCase();
          return cat !== "games" && cat !== "event";
        });

        let finalList;
        if (filtered.length === 0) {
          finalList = [{
            id: "fallback",
            title: "Ainda não há notícias disponíveis",
            image: "/news.webp",
            url: null,
          }];
        } else {
          finalList = [ filtered[0] ];
        }

        setNews(finalList);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  if (loading) return <div>Carregando notícias...</div>;
  if (error)   return <div>Erro: {error}</div>;

  return (
    <div className="space-y-4">
      {news.map((item, index) => (
        <NewsCard
          key={item.id ?? index}
          news={item}
          onClick={() => item.url && window.open(item.url, "_blank")}
        />
      ))}
    </div>
  );
}
