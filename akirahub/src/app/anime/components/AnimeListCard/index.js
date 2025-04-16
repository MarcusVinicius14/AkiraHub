"use client";
import React from "react";
import Image from "next/image";

export default function AnimeListCard({ anime }) {
  // Título: prioriza title_english se existir; senão, usa title
  const title = anime.title_english || anime.title;

  // Episódios: se definido, exibe o número; se não, "lançando"
  const episodes =
    anime.episodes !== null && anime.episodes !== undefined
      ? `${anime.episodes} episódio${anime.episodes === 1 ? "" : "s"}`
      : "lançando";

  // Ano: usa a propriedade "year"
  const year = anime.year || "—";

  // Nota: usa o score
  const score = anime.score || "—";

  // Imagem: extrai a URL da imagem, se existente
  const imageUrl = anime.images?.jpg?.image_url;

  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden flex p-4">
      {imageUrl && (
        <div className="w-40 h-48 relative flex-shrink-0">
          <Image 
            src={imageUrl}
            alt={title}
            fill
            className="object-cover rounded"
          />
        </div>
      )}
      <div className="flex-grow ml-6 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-2xl mb-2">{title}</h3>
          <p className="text-xl text-gray-600">Episódios: {episodes}</p>
          <p className="text-xl text-gray-500">Ano: {year}</p>
          <div className="flex items-center text-xl text-gray-500 mt-2">
            <span>Nota: {score}</span>
            <svg 
              className="w-5 h-5 text-yellow-400 ml-2" 
              fill="currentColor" 
              viewBox="0 0 20 20" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
          </div>
        </div>
        <div className="flex justify-end">
          <button className="mt-4 px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition">
            Favoritar
          </button>
        </div>
      </div>
    </div>
  );
}
