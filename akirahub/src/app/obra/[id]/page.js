"use client";
import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  MessageSquare,
  Star,
  Clock,
  ThumbsUp,
  MoreHorizontal,
} from "lucide-react";

export default function MangaDetails({ params }) {
  const [commentText, setCommentText] = useState("");
  const [activeTab, setActiveTab] = useState("melhores");

  // Dados fictícios do mangá
  const manga = {
    id: 1,
    title: "Shuumatsu no Valkyrie",
    cover: "/manga-cover.jpg",
    date: "23/11/2024",
    type: "Manga",
    status: "Lançamento",
    synopsis:
      "A cada 1000 anos, as divindades se reúnem sob o conselho de Valhalla para decidir sobre o direito da humanidade de continuar vivendo, ou por fim à existência humana por se tornarem indignos. Desta vez, as divindades votam para exterminar a humanidade, porém uma única valquíria do conselho decide realizar o Ragnarök, uma batalha mortal entre humanos e deuses para decidir sob sua sobrevivência. 13 humanos enfrentarão 13 deuses. Serão estes humanos capazes de colidir com as poderosas divindades?",
    purchaseLinks: [
      { name: "Amazon", url: "#" },
      { name: "MyAnimeList", url: "#" },
      { name: "Licenciado em inglês", url: "#" },
    ],
    genres: ["Aventura", "Fantasia", "Artes Marciais", "Drama", "Ação"],
    chapters: [
      { number: 99, comments: 43, posted: "2 dias atrás", new: true },
      { number: 98, comments: 63, posted: "3 dias atrás", new: true },
      { number: 97, comments: 43, posted: "10 dias atrás" },
      { number: 96, comments: 43, posted: "23 dias atrás" },
      { number: 95, comments: 43, posted: "1 mês atrás" },
      { number: 94, comments: 43, posted: "1 mês atrás" },
      { number: 93, comments: 43, posted: "1 mês atrás" },
      { number: 92, comments: 43, posted: "1 mês atrás" },
    ],
    comments: [
      {
        id: 1,
        user: "Nome do usuario",
        avatar: "/user-avatar.png",
        time: "há 2 horas",
        text: "Comentário teste",
        rating: "legal",
      },
      {
        id: 2,
        user: "Nome do usuario",
        avatar: "/user-avatar.png",
        time: "há 4 horas",
        text: "Comentário teste",
        rating: "legal",
      },
      {
        id: 3,
        user: "Nome do usuario",
        avatar: "/user-avatar.png",
        time: "há 7 horas",
        text: "Comentário teste",
        rating: "legal",
      },
    ],
  };

  return (
    <div className="bg-gray-100 min-h-screen pb-8">
      <Head>
        <title>{manga.title} - Detalhes do Mangá</title>
        <meta name="description" content={manga.synopsis.substring(0, 160)} />
      </Head>

      {/* Header com capa e informações básicas */}
      <div className="bg-white shadow rounded-lg mb-4 mx-4 mt-4">
        <div className="flex flex-col md:flex-row p-4">
          {/* Capa do Mangá */}
          <div className="w-32 h-44 relative mr-4 flex-shrink-0">
            <div className="bg-gray-300 w-full h-full rounded-md overflow-hidden">
              <Image
                src="/api/placeholder/128/176"
                alt={manga.title}
                width={128}
                height={176}
                className="object-cover"
              />
            </div>
          </div>

          {/* Informações básicas */}
          <div className="flex-grow mt-4 md:mt-0">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
                {manga.date}
              </span>
              <span className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
                {manga.type}
              </span>
              <span className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
                {manga.status}
              </span>
            </div>

            <div className="w-full">
              <button className="w-full py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition">
                Comentar primeiro capítulo
              </button>
            </div>

            <div className="mt-3 flex justify-end">
              <select className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md text-sm">
                <option>Selecionar Status</option>
                <option>Lendo</option>
                <option>Completo</option>
                <option>Em espera</option>
                <option>Abandonado</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Sinopse */}
      <div className="bg-white shadow rounded-lg p-4 mb-4 mx-4">
        <h2 className="font-bold text-lg mb-2">Sinopse</h2>
        <p className="text-gray-700 text-sm">{manga.synopsis}</p>
      </div>

      {/* Links de compra */}
      <div className="bg-white shadow rounded-lg p-4 mb-4 mx-4">
        <h2 className="font-bold text-lg mb-2">
          Onde comprar, ler ou fazer tracking
        </h2>
        <div className="flex flex-wrap gap-2">
          {manga.purchaseLinks.map((link, index) => (
            <Link
              href={link.url}
              key={index}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 text-sm transition"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Gêneros */}
      <div className="bg-white shadow rounded-lg p-4 mb-4 mx-4">
        <h2 className="font-bold text-lg mb-2">Gêneros</h2>
        <div className="flex flex-wrap gap-2">
          {manga.genres.map((genre, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm"
            >
              {genre}
            </span>
          ))}
        </div>
      </div>

      {/* Capítulos */}
      <div className="bg-white shadow rounded-lg p-4 mb-4 mx-4">
        <h2 className="font-bold text-lg mb-2">Capítulos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {manga.chapters.slice(0, 8).map((chapter) => (
            <div
              key={chapter.number}
              className="border rounded-md p-3 hover:bg-gray-50 transition cursor-pointer"
            >
              <div className="flex justify-between items-center mb-1">
                <div className="font-medium">
                  Capítulo {chapter.number}
                  {chapter.new && (
                    <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded">
                      Novo
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center text-xs text-gray-500 justify-between">
                <div className="flex items-center">
                  <MessageSquare size={12} className="mr-1" />
                  <span>{chapter.comments} Comentários</span>
                </div>
                <div className="flex items-center">
                  <Clock size={12} className="mr-1" />
                  <span>{chapter.posted}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition">
            Ver mais
          </button>
        </div>
      </div>

      {/* Comentários */}
      <div className="bg-white shadow rounded-lg p-4 mx-4">
        <h2 className="font-bold text-lg mb-4">Comentários</h2>

        {/* Campo de comentário */}
        <div className="flex mb-6">
          <div className="w-10 h-10 mr-3">
            <div className="rounded-full bg-gray-300 w-full h-full overflow-hidden">
              <Image
                src="/api/placeholder/40/40"
                alt="Avatar"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
          </div>
          <div className="flex-grow">
            <textarea
              className="w-full border rounded-lg p-2 text-sm"
              placeholder="Escreva um comentário..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={2}
            />
          </div>
        </div>

        {/* Tabs de filtro */}
        <div className="flex justify-end mb-4">
          <div className="flex text-sm">
            <button
              className={`px-3 py-1 ${
                activeTab === "melhores"
                  ? "font-bold text-black"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("melhores")}
            >
              Melhores
            </button>
            <button
              className={`px-3 py-1 ${
                activeTab === "recentes"
                  ? "font-bold text-black"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("recentes")}
            >
              Mais recentes
            </button>
            <button
              className={`px-3 py-1 ${
                activeTab === "amigos"
                  ? "font-bold text-black"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("amigos")}
            >
              Meus amigos
            </button>
          </div>
        </div>

        {/* Lista de comentários */}
        <div className="space-y-4">
          {manga.comments.map((comment) => (
            <div key={comment.id} className="flex pb-4 border-b last:border-0">
              <div className="w-10 h-10 mr-3">
                <div className="rounded-full bg-gray-300 w-full h-full overflow-hidden">
                  <Image
                    src="/api/placeholder/40/40"
                    alt={comment.user}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="flex-grow">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium text-sm">{comment.user}</h4>
                    <p className="text-xs text-gray-500">{comment.time}</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-yellow-500 flex items-center text-xs mr-4">
                      <Star size={12} className="mr-1 fill-yellow-500" />
                      Comentário {comment.rating}
                    </span>
                    <button className="text-gray-400 hover:text-gray-600">
                      <ThumbsUp size={14} />
                    </button>
                  </div>
                </div>
                <p className="text-sm mt-1">{comment.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
