"use client";
import React from "react";
import Image from "next/image";

const NewsCard = ({ news }) => {
  const imageUrl = "/news.webp";
  const link = news?.link || "#";
  const title = news?.title || "Exemplo de Notícia";

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <div className="relative w-full h-40 bg-gray-200 overflow-hidden rounded-md shadow-sm">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 400px"
        />
        {/* Overlay: opacidade 0 por padrão, 50% no hover */}
        <div className="absolute inset-0 flex items-center justify-center bg-black opacity-10 hover:opacity-50 transition duration-300">
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm">{title}</h3>
      </div>
    </a>
  );
};

export default NewsCard;
