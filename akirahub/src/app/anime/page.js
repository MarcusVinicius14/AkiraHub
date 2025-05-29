// src/app/anime/page.js
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
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [filters, setFilters]             = useState([]);

  useEffect(() => {
    supabase
      .from("anime_genres")
      .select("mal_id,name,count")
      .order("name", { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setFilters(data);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <TopNavbar />
      <Header />

      <main className="container mx-auto px-4 pt-4">
        <AnimeFiltersRow
          genres={filters}
          selectedGenre={selectedGenre}
          onGenreChange={setSelectedGenre}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          {/* Próxima temporada */}
          <div className="space-y-4 overflow-auto">
            <h2 className="text-xl font-bold">Próxima temporada</h2>
            <SeasonList
              table="season_upcoming"
              limit={4}
              selectedGenre={selectedGenre}
            />
          </div>

          {/* Notícias + Top Animes */}
          <div className="space-y-6 flex flex-col">
            <div>
              <h2 className="text-xl font-bold mb-2">Últimas notícias</h2>
              <NewsList />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Top Animes</h2>
              <TopAnimeList selectedGenre={selectedGenre} />
            </div>
          </div>

          {/* Temporada atual */}
          <div className="space-y-4 overflow-auto">
            <h2 className="text-xl font-bold">Temporada atual</h2>
            <SeasonList
              table="season_now"
              limit={4}
              selectedGenre={selectedGenre}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

// TopAnimeList busca no supabase e preenche até 4 itens, sem fallback se não houver matches
function TopAnimeList({ selectedGenre }) {
  const [items, setItems] = useState([]);
  const LIMIT = 4;

  useEffect(() => {
    async function fetchTop() {
      try {
        let query = supabase
          .from("top_anime")
          .select("mal_id,title,large_image_url,episodes,score,year,genre1,genre2,genre3");
        if (selectedGenre) {
          query = query.or(
            `genre1.eq.${selectedGenre},genre2.eq.${selectedGenre},genre3.eq.${selectedGenre}`
          );
        }
        const { data: matched, error } = await query
          .order("score", { descending: true })
          .limit(LIMIT);
        if (error) throw error;

        // se não houver nenhum matched e há um filtro, limpa itens
        if (selectedGenre && (!matched || matched.length === 0)) {
          setItems([]);
          return;
        }

        // se houver alguns matched, mas menos que o limite, preenche o restante
        let combined = matched || [];
        if (combined.length > 0 && combined.length < LIMIT) {
          const exclude = combined.map((x) => x.mal_id);
          let fb = supabase
            .from("top_anime")
            .select("mal_id,title,large_image_url,episodes,score,year,genre1,genre2,genre3")
            .order("score", { descending: true })
            .limit(LIMIT - combined.length);
          if (exclude.length) {
            fb = fb.not("mal_id", "in", `(${exclude.join(",")})`);
          }
          const { data: extra, error: err2 } = await fb;
          if (err2) throw err2;
          combined = combined.concat(extra || []);
        }

        setItems(
          (combined || []).map((a) => ({
            mal_id: a.mal_id,
            title: a.title,
            images: { jpg: { large_image_url: a.large_image_url } },
            episodes: a.episodes ?? "",
            score: a.score ?? "",
            year: a.year,
            genres: [a.genre1, a.genre2, a.genre3].filter(Boolean),
          }))
        );
      } catch (err) {
        console.error("Erro ao buscar top_anime:", err);
        setItems([]);
      }
    }
    fetchTop();
  }, [selectedGenre]);

  if (selectedGenre && items.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        Nenhum anime no gênero “{selectedGenre}” encontrado em Top Animes.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((anime) => (
        <LatestAdditionCard key={anime.mal_id} item={anime} type="anime" />
      ))}
    </div>
  );
}

// SeasonList busca upcoming/now e preenche até `limit`, sem fallback se não houver matches
function SeasonList({ table, limit, selectedGenre }) {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleLatestAddiction, setvisibleLatestAddiction] = useState([]);
  const [page, setPage] = useState(1);
  const cardsPerPage = 6;

  useEffect(() => {
    async function fetchSeasons() {
      setLoading(true);
      try {
        const cols =
          "mal_id,title,large_image_url,year,genre1,genre2,genre3" +
          (table === "season_now" ? ",episodes,score" : "");
        let query = supabase.from(table).select(cols);
        if (selectedGenre) {
          query = query.or(
            `genre1.eq.${selectedGenre},genre2.eq.${selectedGenre},genre3.eq.${selectedGenre}`
          );
        }
        query = table === "season_now"
          ? query.order("score", { descending: true })
          : query.order("year", { descending: true });
        query = query.limit(limit);
        const { data: matched, error: err1 } = await query;
        if (err1) throw err1;

        // se nenhum match e com filtro, cleanup
        if (selectedGenre && (!matched || matched.length === 0)) {
          setItems([]);
        } else {
          setItems(
            (matched || []).map((a) => ({
              mal_id: a.mal_id,
              title: a.title,
              images: { jpg: { large_image_url: a.large_image_url } },
              year: a.year,
              episodes: table === "season_now" ? a.episodes ?? "" : undefined,
              score:    table === "season_now" ? a.score    ?? "" : undefined,
              genres: [a.genre1, a.genre2, a.genre3].filter(Boolean),
            }))
          );
        }
      } catch (err) {
        console.error(`Erro ao buscar ${table}:`, err);
        setError(err.message || "Erro");
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    fetchSeasons();
  }, [table, limit, selectedGenre]);

  if (loading) return <div>Carregando...</div>;
  if (error)   return <div className="text-red-500">Erro: {error}</div>;
  if (selectedGenre && items.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        Nenhum anime no gênero “{selectedGenre}” encontrado em{" "}
        {table === "season_upcoming" ? "Próxima Temporada" : "Temporada Atual"}.
      </div>
    );
  }

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
