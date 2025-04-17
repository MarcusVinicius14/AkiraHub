// src/app/manga/components/MangaRecommendations/index.js
"use client";
import React, { useState, useEffect } from "react";
import MangaCard from "../../../../components/MangaCard";

const pause = (ms) => new Promise((res) => setTimeout(res, ms));

export default function MangaRecommendations({ count = 3 }) {
  const [base, setBase] = useState(null);
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAll() {
      try {
        // 1. Escolhe um ID aleatório entre 1 e 100
        const id = Math.floor(Math.random() * 100) + 1;

        // 2. Busca o mangá base
        let res = await fetch(`https://api.jikan.moe/v4/manga/${id}`);
        if (res.status === 429) {
          await pause(2000);
          res = await fetch(`https://api.jikan.moe/v4/manga/${id}`);
        }
        if (!res.ok) throw new Error(`Erro ao buscar mangá base: ${res.status}`);
        const jsonBase = await res.json();
        const baseManga = jsonBase.data;

        // 3. Busca as recomendações desse mesmo ID
        res = await fetch(`https://api.jikan.moe/v4/manga/${id}/recommendations`);
        if (res.status === 429) {
          await pause(2000);
          res = await fetch(`https://api.jikan.moe/v4/manga/${id}/recommendations`);
        }
        if (!res.ok) throw new Error(`Erro nas recomendações: ${res.status}`);
        const jsonRec = await res.json();
        const recEntries = Array.isArray(jsonRec.data) ? jsonRec.data : [];

        // 4. Extrai apenas os `entry` dos primeiros `count`
        const list = recEntries.slice(0, count).map((r) => r.entry);

        setBase(baseManga);
        setRecs(list);
      } catch (err) {
        console.error("MangaRecommendations:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, [count]);

  if (loading) return <div>Carregando recomendações…</div>;
  if (error)   return <div>Erro: {error}</div>;

  return (
    <div className="space-y-6 mt-4">
      {/*Mangá Base*/}
      {base && (
        <div>
          <h3 className="text-lg font-semibold mb-2">
            Mangá base para recomendações
          </h3>
          <MangaCard manga={base} />
        </div>
      )}

      {/*Título das Recomendações, da pra tirar isso dps se quiser*/}
      <div>
        <h3 className="text-lg font-semibold mb-2">
          Recomendações com base no mangá acima
        </h3>
      </div>

      {/*Cartões de recomendação*/}
      <div className="space-y-4">
        {recs.map((m) => (
          <MangaCard key={m.mal_id} manga={m} />
        ))}
      </div>
    </div>
  );
}
