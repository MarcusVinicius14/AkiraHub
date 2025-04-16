import React from "react";
import Image from "next/image";

const AnimeCard = ({ anime }) => {
  const imageUrl = anime?.images?.jpg?.image_url;
  const title = anime.title_english || anime.title;
  const episodes = anime.episodes;
  const score = anime.score;
  const year = anime.year;

  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden flex">
      <div className="w-16 h-20 relative flex-shrink-0">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={title}
            width={100}
            height={120}
            className="object-cover"
          />
        )}
      </div>
      <div className="p-3 flex-grow">
        <h3 className="font-medium text-sm">{title}</h3>
        
        {/* Se o número de episódios estiver disponível vai exibir, senao não */}
        {episodes !== null && episodes !== undefined ? (
          <p className="text-xs text-gray-600">
            {episodes} {episodes === 1 ? "episódio" : "episódios"}
          </p>
        ) : null}
        
        {/* Sempre exibe o ano */}
        {year && <p className="text-xs text-gray-500 mt-1">Ano: {year}</p>}

        <div className="flex items-center mt-1">
          <span className="text-sm font-medium">{score}</span>
          <svg
            className="w-4 h-4 text-yellow-400 ml-1"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AnimeCard;
