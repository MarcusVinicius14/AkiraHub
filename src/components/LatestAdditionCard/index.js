"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function LatestAdditionCard({ item, type }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const { data: session } = useSession();

  const isLoggedIn = !!session;

  const id = item.mal_id;
  const imageUrl = item?.large_image_url;
  const title = item?.title_english || item?.title;
  const episodes =
    type === "anime"
      ? item?.episodes != null
        ? `${item.episodes} episódio${item.episodes === 1 ? "" : "s"}`
        : "lançando"
      : null;
  const score = item?.score;

  async function toggleFavorite() {
    try {
      if (isFavorite) {
        await fetch("/api/favorites", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ work_type: "manga", work_id: id }),
        });
      } else {
        await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ work_type: "manga", work_id: id }),
        });
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error("Erro ao atualizar favorito", err);
    }
  }

  const handleFavoriteClick = () => {
    if (isLoggedIn) {
      // If the user is logged in, call the real function
      toggleFavorite();
    } else {
      // If not logged in, trigger another action
      // For example: open a login modal, redirect to the login page, or show a notification.
      alert("Faça login para favoritar!");
      // or openLoginModal();
      // or history.push('/login');
    }
  };

  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden flex flex-col">
      <Link
        className="hover:bg-gray-100 active:bg-gray-200 cursor-pointer"
        href={`/obra/${type}/${id}`}
      >
        {/* Imagem */}
        <div className="w-full h-32 relative">
          {imageUrl && (
            <Image src={imageUrl} alt={title} fill className="object-cover" />
          )}
        </div>

        <div className="p-3 flex-grow">
          <h3 className="font-medium text-sm line-clamp-2">{title}</h3>
          {type === "anime" && (
            <p className="text-xs text-gray-600 mt-1">{episodes}</p>
          )}
          {score && (
            <div className="flex items-center text-xs text-black mt-1">
              <span>{score}</span>
              <svg
                className="w-4 h-4 text-yellow-400 ml-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 
                1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 
                2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 
                1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 
                0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 
                1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 
                1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
            </div>
          )}
        </div>
      </Link>
      {/* Botões */}
      <div className="flex border-t border-gray-200 mt-auto justify-between">
        {/* VERSÃO CORRIGIDA */}
        <Link
          href={`/obra/${type}/${id}`}
          // As classes de layout agora estão aqui no Link
          className="flex-1 flex items-center justify-center py-2 text-xs font-medium text-gray-600 hover:bg-gray-300 active:bg-gray-400 cursor-pointer transition"
        >
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
        </Link>

        <div className="w-px bg-gray-200" />

        {/* O botão de favoritar continua o mesmo, pois já estava correto */}
        <button
          className={`flex-1 flex items-center justify-center py-2 text-xs font-medium transition cursor-pointer hover:bg-gray-300 active:bg-gray-400 ${
            isFavorite
              ? "text-red-500 hover:bg-red-100"
              : "text-gray-600 hover:bg-gray-50"
          }`}
          onClick={handleFavoriteClick}
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
