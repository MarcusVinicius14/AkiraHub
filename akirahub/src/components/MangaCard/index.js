import Image from "next/image";
import React, { useState } from "react";
const MangaCard = ({ manga }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden flex hover:bg-gray-100 active:bg-gray-200 cursor-pointer justify-between items-center">
      <div className="flex items-center">
        <div className="w-16 h-full relative flex-shrink-0">
          <Image
            src={manga.image}
            alt={manga.title}
            width={100}
            height={120}
            className="object-cover"
          />
        </div>
        <div className="p-3 flex-grow">
          <h3 className="font-medium text-sm">{manga.title}</h3>
          <p className="text-xs text-gray-600">{manga.chapters} capítulos</p>
          <div className="flex items-center mt-1">
            <span className="text-sm font-medium">{manga.rating}</span>
            <svg
              className="w-4 h-4 text-yellow-400 ml-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {manga.comments} comentarios
          </p>
        </div>
      </div>

      <div className=" flex-col pr-8 pl-8 border-l border-gray-400 ">
        <button
          className="flex-1 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 flex items-center rounded-md p-2 justify-center hover:bg-gray-300 active:bg-gray-400 cursor-pointer"
          onClick={() => alert("Abrir comentários para: " + manga.title)}
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            ></path>
          </svg>
          Comentar
        </button>

        <div className="w-px bg-gray-200"></div>

        <button
          className={`flex-1 py-2 text-xs hover:bg-gray-300 active:bg-gray-400 rounded-md p-2 cursor-pointer font-medium flex items-center justify-center ${
            isFavorite ? "text-red-500" : "text-gray-600 hover:bg-gray-50"
          }`}
          onClick={() => setIsFavorite(!isFavorite)}
        >
          <svg
            className="w-4 h-4 mr-1"
            fill={isFavorite ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            ></path>
          </svg>
          {isFavorite ? "Favoritado" : "Favoritar"}
        </button>
      </div>
    </div>
  );
};

export default MangaCard;
