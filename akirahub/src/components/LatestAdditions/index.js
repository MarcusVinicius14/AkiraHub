"use client";
import React, { useState, useEffect } from "react";
import LatestAdditionCard from "../LatestAdditionCard";

const LatestAdditions = ({ type }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const url = "https://api.jikan.moe/v4/seasons/now";
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Erro ao buscar os dados. Status: ${res.status}`);
        }
        const json = await res.json();
        const data = json.data.slice(0, 2);
        setItems(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [type]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((item) => (
        <LatestAdditionCard key={item.mal_id} item={item} type={type} />
      ))}
    </div>
  );
};

export default LatestAdditions;
