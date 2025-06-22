"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Header() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const router = useRouter();

  async function handleChange(e) {
    const value = e.target.value;
    setQuery(value);

    if (value.length < 2) {
      setResults([]);
      return;
    }

    // busca simultânea em animes e mangas
    const [{ data: animes }, { data: mangas }] = await Promise.all([
      supabase
        .from("animes")
        .select("mal_id, title")
        .ilike("title", `%${value}%`)
        .limit(5),
      supabase
        .from("mangas")
        .select("mal_id, title")
        .ilike("title", `%${value}%`)
        .limit(5),
    ]);

    // une resultados marcando tipo
    const combined = [
      ...(animes || []).map((a) => ({ type: "anime", ...a })),
      ...(mangas || []).map((m) => ({ type: "manga", ...m })),
    ];

    setResults(combined);
  }

  function selectItem(item) {
    router.push(`/obra/${item.type}/${item.mal_id}`);
    setQuery("");
    setResults([]);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && results.length > 0) {
      e.preventDefault();
      selectItem(results[0]);
    }
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center">
        <div className="ml-4 flex-grow relative">
          <input
            type="text"
            placeholder="Pesquisar obra"
            className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-100"
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          {results.length > 0 && (
            <ul className="absolute left-0 right-0 mt-1 bg-white border rounded-b shadow z-10">
              {results.map((r) => (
                <li
                  key={`${r.type}-${r.mal_id}`}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm flex justify-between"
                  onClick={() => selectItem(r)}
                >
                  <span>{r.title}</span>
                  <span className="text-gray-500 text-xs">{r.type}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </header>
  );
}
