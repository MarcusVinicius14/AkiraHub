"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const MangaCard = ({ manga }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const imageContainerClasses = "w-20 h-28 relative flex-shrink-0 mr-4";
  const infoPadding = "p-3";
  const buttonPaddingY = "py-1";
  const titleClass = "font-medium text-base";
  const subtitleClass = "text-sm text-gray-600";

  // Dados
  const id = manga?.id;
  const imageUrl = manga?.large_image_url;
  const title = manga.title_english || manga.title;
  const chapters =
    manga.chapters != null
      ? `${manga.chapters} capítulo${manga.chapters === 1 ? "" : "s"}`
      : "lançando";
  const publishedFrom = manga.published?.from;
  const year = publishedFrom ? new Date(publishedFrom).getFullYear() : null;
  const score = manga.score;

  useEffect(() => {
    async function checkFavorite() {
      try {
        const res = await fetch(`/api/favorites?work_type=manga&work_id=${id}`);
        if (res.ok) {
          const data = await res.json();
          setIsFavorite(data.favorited);
        }
      } catch (err) {
        console.error('Erro ao verificar favorito', err);
      }
    }
    if (id) checkFavorite();
  }, [id]);

  async function toggleFavorite() {
    try {
      if (isFavorite) {
        await fetch('/api/favorites', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ work_type: 'manga', work_id: id }),
        });
      } else {
        await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ work_type: 'manga', work_id: id }),
        });
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Erro ao atualizar favorito', err);
    }
  }

  return (
    <div className=" bg-white rounded-lg shadow-md overflow-hidden flex hover:bg-gray-100 active:bg-gray-200 cursor-pointer justify-between items-center">
      <Link href={`/obra/manga/${id}`}>
        {/* Esquerda: imagem + infos */}
        <div className={`flex items-center ${infoPadding}`}>
          {imageUrl && (
            <div className={imageContainerClasses}>
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover rounded "
              />
            </div>
          )}
          <div>
            <h3 className={titleClass}>{title}</h3>
            <p className={`${subtitleClass} mt-1`}>{chapters}</p>
            {year && <p className={`${subtitleClass}`}>Ano: {year}</p>}
            <div className="flex items-center mt-1">
              <span className="text-sm font-medium">{score ?? "—"}</span>
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
      {/* direita: comentar + favoritar */}
      <div className="flex-col justify-center pr-6 pl-6 border-l-2 border-gray-200  ">
        <button
          className={`flex items-center text-xs font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-300 active:bg-gray-400 cursor-pointer rounded-md p-2 transition`}
          onClick={() => alert("Abrir comentários para: " + title)}
        >
          <svg
            className="w-5 h-5 mr-1"
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
        <div className="w-px bg-gray-200 my-2" />
        <button
          className={`flex items-center text-xs font-medium rounded-md p-2 transition ${
            isFavorite
              ? "text-red-500 hover:text-red-700 hover:bg-red-100"
              : "text-gray-600 hover:bg-gray-300 active:bg-gray-400 cursor-pointer"
          }`}
          onClick={toggleFavorite}
        >
          <svg
            className="w-5 h-5 mr-1"
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
};

export default MangaCard;
