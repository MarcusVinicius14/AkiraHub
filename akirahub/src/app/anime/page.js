"use client";
import React from "react";
import TopNavbar from "../../components/TopNavbar";
import Header from "../../components/Header";
import AnimeFiltersRow from "./components/AnimeFiltersRow";
import AnimeList from "./components/AnimeList";
import NewsList from "../../components/NewsList";
import SeasonAnime from "./components/SeasonAnime";
import NextSeasonAnime from "./components/NextSeasonAnime";

export default function AnimePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <TopNavbar />
      <Header />
      <main className="container mx-auto py-6 px-4">
        {/* Exibe os filtros em uma linha no topo da página */}
        <AnimeFiltersRow />
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
          {/* Coluna Esquerda: Lista de Animes */}
          <div className="lg:col-span-1">
            <AnimeList />
          </div>
          {/* Coluna Direita: Notícias e Cards de Temporada */}
          <div className="lg:col-span-1 xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Últimas notícias</h2>
              <NewsList />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-4">Animes da temporada</h2>
              <SeasonAnime />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-4">Animes da próxima temporada</h2>
              <NextSeasonAnime />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
