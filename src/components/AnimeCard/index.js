"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function AnimeCard({ anime }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const cardMaxWidth = "max-w-md";
  const imageWidth = "w-20";
  const imageHeight = "h-28";
  const contentPadding = "p-3";
  const maxTitleLen = 30; // Caracteres antes de truncar o título

  const id = anime?.mal_id;
  const rawTitle = anime?.title_english || anime?.title;
  const title =
    rawTitle > maxTitleLen ? rawTitle.slice(0, maxTitleLen) + "..." : rawTitle;

  const episodes =
    anime?.episodes != null
      ? `${anime.episodes} episódio${anime.episodes === 1 ? "" : "s"}`
      : "lançando";
  const year = anime?.year || "—";
  const score = anime?.score != null ? anime.score : "—";
  const imageUrl = anime?.large_image_url;

  return (
    <div
      className={`${cardMaxWidth} bg-white rounded-md shadow-sm overflow-hidden flex hover:bg-gray-100 active:bg-gray-200 cursor-pointer justify-between items-center`}
    >
      <Link href={`/obra/anime/${id}`}>
        <div className={`flex items-center ${contentPadding}`}>
          {imageUrl && (
            <div
              className={`${imageWidth} ${imageHeight} relative flex-shrink-0 mr-4`}
            >
              <Image
                src={imageUrl}
                alt={rawTitle}
                fill
                className="object-cover rounded"
              />
            </div>
          )}
          <div>
            <h3 className="font-medium text-sm" title={rawTitle}>
              {title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{episodes}</p>
            <p className="text-sm text-gray-600">Ano: {year}</p>
            <div className="flex items-center mt-1">
              <span className="text-sm font-medium">{score}</span>
              <svg
                className="w-4 h-4 text-yellow-400 ml-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
      <div className="flex flex-col justify-center pr-6 pl-6 border-l-2 border-gray-200 my-2 space-y-3">
        {/* Botão “Comentar” */}
        <Link href={`/obra/anime/${id}/${1}`}>
          <button className="flex items-center text-xs font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-300 active:bg-gray-400 cursor-pointer rounded-md p-2 transition">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            Comentar
          </button>
        </Link>

        {/* Botão “Favoritar” */}
        <button
          className={`flex items-center text-xs font-medium rounded-md p-2 transition ${
            isFavorite
              ? "text-red-500 hover:text-red-700 hover:bg-red-100"
              : "text-gray-600 hover:bg-gray-300 active:bg-gray-400 cursor-pointer"
          }`}
          onClick={() => setIsFavorite(!isFavorite)}
        >
          <svg
            className="w-4 h-4 mr-1"
            fill={isFavorite ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          {isFavorite ? "Favoritado" : "Favoritar"}
        </button>
      </div>
    </div>
  );
}
