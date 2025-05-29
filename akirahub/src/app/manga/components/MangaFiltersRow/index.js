"use client";
import React, { useState } from "react";

export default function MangaFiltersRow({
  genres,              // [{ mal_id, name, count }]
  selectedGenre,       // string or null
  onGenreChange        // setter: (string|null) => void
}) {
  const [openGenre, setOpenGenre] = useState(false);

  return (
    <div className="mb-4">
      <button
        onClick={() => setOpenGenre(!openGenre)}
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Gêneros
      </button>
      {openGenre && (
        <div className="mt-2 p-4 bg-white rounded-md shadow-md flex flex-wrap gap-2">
          <button
            className={`px-3 py-1 rounded-full ${
              selectedGenre === null
                ? "bg-blue-600 text-white"
                : "border hover:bg-blue-500 hover:text-white"
            }`}
            onClick={() => onGenreChange(null)}
          >
            Todos
          </button>
          {genres.map((g) => (
            <button
              key={g.mal_id}
              className={`px-3 py-1 rounded-full ${
                selectedGenre === g.name
                  ? "bg-blue-600 text-white"
                  : "border hover:bg-blue-500 hover:text-white"
              }`}
              onClick={() =>
                onGenreChange(selectedGenre === g.name ? null : g.name)
              }
            >
              {g.name} ({g.count})
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
