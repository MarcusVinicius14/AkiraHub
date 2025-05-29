"use client";
import React, { useState, useEffect } from "react";
import TopNavbar from "../../components/TopNavbar";
import Header from "../../components/Header";
import MangaFiltersRow from "./components/MangaFiltersRow";
import TopMangaList from "./components/TopMangaList";
import MangaRecommendations from "./components/MangaRecommendations";
import RandomManga from "./components/RandomManga";
import { supabase } from "../../../lib/supabaseClient";

export default function MangaPage() {
  // 1) Estado do gênero selecionado
  const [selectedGenre, setSelectedGenre] = useState(null);
  // 2) Lista de todos os gêneros (para o dropdown)
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    // Busca os gêneros uma única vez
    supabase
      .from("manga_genres")
      .select("mal_id,name,count")
      .order("name", { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setGenres(data);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <TopNavbar />
      <Header />

      <main className="w-full px-2 lg:px-10 pt-4">
        {/* 3) Passa ao filtro */}
        <MangaFiltersRow
          genres={genres}
          selectedGenre={selectedGenre}
          onGenreChange={setSelectedGenre}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-4">
          {/* Top Mangás */}
          <div className="space-y-4 overflow-auto">
            <h2 className="text-xl font-bold">Top Mangás</h2>
<<<<<<< HEAD
            <TopMangaList limit={5} selectedGenre={selectedGenre} />
=======
            <TopMangaList />
>>>>>>> a5e7dae38d6c2a3e772c1f29615581fd40500ead
          </div>

          {/* Recomendação */}
          <div className="space-y-4 overflow-auto">
<<<<<<< HEAD
            <h2 className="text-xl font-bold">
              Recomendação com base nesse mangá
            </h2>
            <MangaRecommendations count={4} selectedGenre={selectedGenre} />
=======
            <section>
              <h2 className="text-xl font-bold">
                Recomendação com base nesse mangá
              </h2>
              <MangaRecommendations />
            </section>
>>>>>>> a5e7dae38d6c2a3e772c1f29615581fd40500ead
          </div>

          {/* Aleatórios */}
          <div className="space-y-4 overflow-auto">
            <h2 className="text-xl font-bold">Mangás Aleatórios</h2>
            <RandomManga count={5} selectedGenre={selectedGenre} />
          </div>
        </div>
      </main>
    </div>
  );
}
