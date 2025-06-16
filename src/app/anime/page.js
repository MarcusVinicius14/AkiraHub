"use client";
import React, { useEffect, useState } from "react";
import TopNavbar from "../../components/TopNavbar";
import Header from "../../components/Header";
import AnimeFiltersRow from "./components/AnimeFiltersRow";
import NewsList from "../../components/NewsList";
import AnimeCard from "../../components/AnimeCard";
import { supabase } from "../../../lib/supabaseClient";
import AnimeList from "@/components/AnimeList";

export default function AnimePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <TopNavbar />
      <Header />

      <main className="container mx-auto px-4 pt-4">
        <AnimeFiltersRow />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          <div className="space-y-4 overflow-auto">
            <h2 className="text-xl font-bold">Próxima temporada</h2>
            <SeasonList table="season_upcoming" />
          </div>

          <div className="space-y-6 flex flex-col">
            <div>
              <h2 className="text-xl font-bold mb-2">Últimas notícias</h2>
              <NewsList />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Top Animes</h2>
              {/* <div className="grid grid-cols-2 gap-4">
                {topAnimes.map((anime) => (
                  <LatestAdditionCard
                    key={anime.mal_id}
                    item={anime}
                    type="anime"
                  />
                ))}
              </div> */}
              <AnimeList />
            </div>
          </div>

          <div className="space-y-4 overflow-auto">
            <h2 className="text-xl font-bold">Temporada atual</h2>
            <SeasonList table="season_now" />
          </div>
        </div>
      </main>
    </div>
  );
}

function SeasonList({ table }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleLatestAddiction, setvisibleLatestAddiction] = useState([]);
  const [page, setPage] = useState(1);
  const cardsPerPage = 6;

  useEffect(() => {
    async function fetchSeasons() {
      try {
        const { data, error } = await supabase
          .from(table)
          .select("*")
          .limit(30);
        if (error) throw error;

        let processed = data.slice();
        if (table === "season_upcoming") {
          processed.sort((a, b) => a.mal_id - b.mal_id);
        } else if (table === "season_now") {
          processed.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
        }

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
        console.error(`Erro ao buscar ${table}:`, err);
        setError(err.message || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    }
    fetchSeasons();
  }, [table]);

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
      <div className="space-y-4">
        {visibleLatestAddiction.map((anime) => (
          <AnimeCard key={anime.mal_id} anime={anime} />
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
