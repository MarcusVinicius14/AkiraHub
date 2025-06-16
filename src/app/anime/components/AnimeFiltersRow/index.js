"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "../../../../../lib/supabaseClient";

export default function AnimeFiltersRow() {
  const [openGenre, setOpenGenre] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [openSeason, setOpenSeason] = useState(false);

  const [genres, setGenres] = useState([]);
  const [loadingGenres, setLoadingGenres] = useState(true);
  const [errorGenres, setErrorGenres] = useState(null);

  const statusOptions = ["Lançando", "Hiato", "Finalizado"];

  const [seasonsData, setSeasonsData] = useState([]);
  const [loadingSeasons, setLoadingSeasons] = useState(true);
  const [errorSeasons, setErrorSeasons] = useState(null);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("");

  useEffect(() => {
    async function fetchGenres() {
      try {
        const { data, error } = await supabase
          .from("anime_genres")
          .select("*")
          .order("name", { ascending: true });
        if (error) throw error;
        setGenres(data);
      } catch (err) {
        setErrorGenres(err.message);
      } finally {
        setLoadingGenres(false);
      }
    }
    fetchGenres();
  }, []);

  useEffect(() => {
    async function fetchSeasons() {
      try {
        const { data, error } = await supabase
          .from("seasons")
          .select("year, seasons")
          .order("year", { ascending: false });
        if (error) throw error;
        const filtered = data.filter((item) => item.year >= 1990);
        setSeasonsData(filtered);
      } catch (err) {
        setErrorSeasons(err.message);
      } finally {
        setLoadingSeasons(false);
      }
    }
    fetchSeasons();
  }, []);

  return (
    <div className="mb-4">
      <div className="flex flex-wrap gap-4">
        <div>
          <button
            onClick={() => setOpenGenre(!openGenre)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Gêneros
          </button>
          {openGenre && (
            <div className="mt-2 p-2 bg-white rounded-md shadow-md">
              {loadingGenres ? (
                <div>Carregando gêneros...</div>
              ) : errorGenres ? (
                <div className="text-red-500">Erro: {errorGenres}</div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <button
                      key={genre.mal_id}
                      className="px-3 py-1 border rounded-full text-sm hover:bg-blue-500 hover:text-white transition"
                    >
                      {genre.name} ({genre.count})
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <button
            onClick={() => setOpenStatus(!openStatus)}
            className="px-4 py-2 bg-green-500 text-white rounded-md"
          >
            {openStatus ? "Esconder Status" : "Ver Status"}
          </button>
          {openStatus && (
            <div className="mt-2 p-2 bg-white rounded-md shadow-md">
              <div className="flex flex-col gap-2">
                {statusOptions.map((status, idx) => (
                  <button
                    key={idx}
                    className="px-3 py-1 border rounded-full text-sm hover:bg-green-500 hover:text-white transition"
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <button
            onClick={() => setOpenSeason(!openSeason)}
            className="px-4 py-2 bg-purple-500 text-white rounded-md"
          >
            Temporadas
          </button>
          {openSeason && (
            <div className="mt-2 p-2 bg-white rounded-md shadow-md">
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ano
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                    setSelectedSeason("");
                  }}
                  className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Selecione um ano</option>
                  {seasonsData.map((item) => (
                    <option key={item.year} value={item.year}>
                      {item.year}
                    </option>
                  ))}
                </select>
              </div>

              {selectedYear && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Temporada
                  </label>
                  <select
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(e.target.value)}
                    className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Selecione uma temporada</option>
                    {seasonsData
                      .find((item) => item.year === Number(selectedYear))
                      ?.seasons.map((season) => (
                        <option key={season} value={season}>
                          {season.charAt(0).toUpperCase() + season.slice(1)}
                        </option>
                      ))}
                  </select>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
