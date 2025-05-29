"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "../../../../../lib/supabaseClient";

export default function AnimeFiltersRow({
  genres,              // lista [{ name, count, mal_id }]
  selectedGenre,       // string ou null
  onGenreChange,       // setter (string|null) => void
}) {
  const [openGenre, setOpenGenre] = useState(false);
  const [errorGenres, setError]   = useState(null);
  const [loading, setLoading]     = useState(false);
  const [list, setList]           = useState([]);

  useEffect(() => {
    // Se já veio a prop `genres`, evita recarregar.
    if (genres && genres.length) {
      setList(genres);
      return;
    }
    setLoading(true);
    supabase
      .from("anime_genres")
      .select("mal_id,name,count")
      .order("name", { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          setError(error.message);
        } else {
          setList(data);
        }
      })
      .finally(() => setLoading(false));
  }, [genres]);

  return (
    <div className="mb-4">
      <div className="flex flex-wrap gap-4">
        {/* Gêneros */}
        <div>
          <button
            onClick={() => setOpenGenre(!openGenre)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Gêneros
          </button>
          {openGenre && (
            <div className="mt-2 p-2 bg-white rounded-md shadow-md">
              {loading ? (
                <div>Carregando gêneros...</div>
              ) : errorGenres ? (
                <div className="text-red-500">Erro: {errorGenres}</div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {/* Botão “Todos” */}
                  <button
                    className={`px-3 py-1 rounded-full text-sm transition ${
                      selectedGenre === null
                        ? "bg-blue-600 text-white"
                        : "border hover:bg-blue-500 hover:text-white"
                    }`}
                    onClick={() => onGenreChange(null)}
                  >
                    Todos
                  </button>
                  {/* Botões para cada gênero */}
                  {list.map((g) => (
                    <button
                      key={g.mal_id}
                      className={`px-3 py-1 rounded-full text-sm transition ${
                        selectedGenre === g.name
                          ? "bg-blue-600 text-white"
                          : "border hover:bg-blue-500 hover:text-white"
                      }`}
                      onClick={() =>
                        onGenreChange(
                          selectedGenre === g.name ? null : g.name
                        )
                      }
                    >
                      {g.name} ({g.count})
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Status e Temporadas continuam idênticos */}
        {/* ...seu código de Status e Temporadas aqui... */}
      </div>
    </div>
  );
}
