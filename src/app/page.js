"use client";
import React from "react";
import TopNavbar from "../components/TopNavbar";
import Header from "../components/Header";
import MangaList from "../components/MangaList";
import AnimeList from "../components/AnimeList";
import NewsList from "../components/NewsList";
import LatestAdditions from "../components/LatestAdditions";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <TopNavbar />
      <Header />
      <main className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold mb-4">Lista de Mangas</h2>
            <MangaList />
          </div>

          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold mb-4">Últimas notícias</h2>
            <NewsList />

            <h2 className="text-xl font-bold mb-4 mt-8">Últimos animes adicionados</h2>
            <LatestAdditions type="anime" />

            <h2 className="text-xl font-bold mb-4 mt-8">Últimos mangas adicionados</h2>
            <LatestAdditions type="manga" />
          </div>

          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold mb-4">Lista de Anime</h2>
            <AnimeList />
          </div>
        </div>
      </main>
    </div>
  );
}
