"use client";
import React, { useEffect, useState } from "react";
import TopNavbar from "../../components/TopNavbar";
import Header from "../../components/Header";
import AnimeFiltersRow from "./components/AnimeFiltersRow";
import LatestAdditionCard from "../../components/LatestAdditionCard";
import NewsList from "../../components/NewsList";
import AnimeCard from "../../components/AnimeCard";
import { supabase } from "../../../lib/supabaseClient";

export default function AnimePage() {
  const [topAnimes, setTopAnimes] = useState([]);

  useEffect(() => {
    async function fetchTopAnimes() {
      try {
        // busca em 'top_anime' sem limit, para depois ordenar no cliente
        const { data, error } = await supabase
          .from("top_anime")
          .select("mal_id,title,large_image_url,episodes,score,year,genre1,genre2,genre3");
        if (error) throw error;

        const sorted = data
          .slice()
          .sort((a, b) => parseFloat(b.score) - parseFloat(a.score))
          .slice(0, 4);

        const formatted = sorted.map((a) => ({
          mal_id: a.mal_id,
          title: a.title,
          images: { jpg: { large_image_url: a.large_image_url } },
          episodes: a.episodes,
          score: a.score,
          year: a.year,
        }));

        setTopAnimes(formatted);
      } catch (err) {
        console.error("Erro ao buscar top_anime:", err);
        setTopAnimes([]);
      }
    }
    fetchTopAnimes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <TopNavbar />
      <Header />

      <main className="container mx-auto px-4 pt-4">
        <AnimeFiltersRow />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          <div className="space-y-4 overflow-auto">
            <h2 className="text-xl font-bold">Próxima temporada</h2>
            <SeasonList table="season_upcoming" limit={4} />
          </div>

          <div className="space-y-6 flex flex-col">
            <div>
              <h2 className="text-xl font-bold mb-2">Últimas notícias</h2>
              <NewsList />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Top Animes</h2>
              <div className="grid grid-cols-2 gap-4">
                {topAnimes.map((anime) => (
                  <LatestAdditionCard
                    key={anime.mal_id}
                    item={anime}
                    type="anime"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 overflow-auto">
            <h2 className="text-xl font-bold">Temporada atual</h2>
            <SeasonList table="season_now" limit={4} />
          </div>
        </div>
      </main>
    </div>
  );
}

function SeasonList({ table, limit }) {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    async function fetchSeasons() {
      try {
        const { data, error } = await supabase
          .from(table)
          .select("*");
        if (error) throw error;

        let processed = data.slice();
        if (table === "season_upcoming") {
          processed.sort((a, b) => a.mal_id - b.mal_id);
        } else if (table === "season_now") {
          processed.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
        }

        const limited = processed.slice(0, limit);
        const formatted = limited.map((a) => ({
          mal_id: a.mal_id,
          title: a.title,
          title_english: a.title_english || a.title,
          images: { jpg: { large_image_url: a.large_image_url } },
          episodes: a.episodes,
          score: a.score,
          year: a.year,
        }));

        setItems(formatted);
      } catch (err) {
        console.error(`Erro ao buscar ${table}:`, err);
        setError(err.message || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    }
    fetchSeasons();
  }, [table, limit]);

  if (loading) return <div>Carregando...</div>;
  if (error)   return <div className="text-red-500">Erro: {error}</div>;

  return (
    <div className="space-y-4">
      {items.map((anime) => (
        <AnimeCard key={anime.mal_id} anime={anime} />
      ))}
    </div>
  );
}
