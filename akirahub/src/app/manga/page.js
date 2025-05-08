"use client";
import React from "react";
import TopNavbar from "../../components/TopNavbar";
import Header from "../../components/Header";
import MangaFiltersRow from "./components/MangaFiltersRow";
import TopMangaList from "./components/TopMangaList";
import MangaRecommendations from "./components/MangaRecommendations";
import RandomManga from "./components/RandomManga";

export default function MangaPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <TopNavbar />
      <Header />

      <main className="w-full px-2 lg:px-10 pt-4">
        <MangaFiltersRow />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-4">
          <div className="space-y-4 overflow-auto">
            <h2 className="text-xl font-bold">Top Mangás</h2>
            <TopMangaList />
          </div>

          <div className="space-y-4 overflow-auto">
            <section>
              <h2 className="text-xl font-bold">
                Recomendação com base nesse mangá
              </h2>
              <MangaRecommendations />
            </section>
          </div>

          <div className="space-y-4 overflow-auto">
            <h2 className="text-xl font-bold">Mangás Aleatórios</h2>
            <RandomManga count={5} />
          </div>
        </div>
      </main>
    </div>
  );
}
