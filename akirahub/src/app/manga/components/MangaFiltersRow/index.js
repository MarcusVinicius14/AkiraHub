"use client";
import React, { useState, useEffect } from "react";

export default function MangaFiltersRow() {
  const [openGenre, setOpenGenre]   = useState(false);
  const [openStatus, setOpenStatus] = useState(false);

  const [genres, setGenres]         = useState([]);
  const [loadingGenres, setLoadingGenres] = useState(true);
  const [errorGenres, setErrorGenres]     = useState(null);

  // status fixo
  const statusOptions = ["Lançando", "Hiato", "Finalizado"];

  useEffect(() => {
    async function fetchGenres() {
      try {
        const res = await fetch("https://api.jikan.moe/v4/genres/manga");
        if (!res.ok) throw new Error(`Erro: ${res.status}`);
        const json = await res.json();
        setGenres(json.data);
      } catch (err) {
        setErrorGenres(err.message);
      } finally {
        setLoadingGenres(false);
      }
    }
    fetchGenres();
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
              {loadingGenres
                ? <div>Carregando gêneros…</div>
                : errorGenres
                  ? <div className="text-red-500">Erro: {errorGenres}</div>
                  : (
                    <div className="flex flex-wrap gap-2 max-h-40 overflow-auto">
                      {genres.map(g => (
                        <button
                          key={g.mal_id}
                          className="px-3 py-1 border rounded-full text-sm hover:bg-blue-500 hover:text-white transition"
                        >
                          {g.name} ({g.count})
                        </button>
                      ))}
                    </div>
                  )
              }
            </div>
          )}
        </div>

        <div>
          <button
            onClick={() => setOpenStatus(!openStatus)}
            className="px-4 py-2 bg-green-500 text-white rounded-md"
          >
            Status
          </button>
          {openStatus && (
            <div className="mt-2 p-2 bg-white rounded-md shadow-md">
              <div className="flex flex-col gap-2">
                {statusOptions.map((s,i) => (
                  <button
                    key={i}
                    className="px-3 py-1 border rounded-full text-sm hover:bg-green-500 hover:text-white transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
