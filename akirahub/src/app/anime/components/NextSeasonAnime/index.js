"use client";
import React from "react";

export default function SeasonAnime() {
  const fakeSeason = [
    { id: 1, title: "Fire Force Season 3", episodes: 12 },
    { id: 2, title: "Jujutsu Kaisen Season 2", episodes: 24 },
  ];

  return (
    <div className="bg-white p-4 rounded-md shadow-sm">
      <ul className="space-y-2">
        {fakeSeason.map((anime) => (
          <li key={anime.id} className="border p-2 rounded-md">
            <p className="font-medium text-sm">{anime.title}</p>
            <p className="text-xs text-gray-500">{anime.episodes} episódios</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
