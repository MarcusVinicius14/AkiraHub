"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { supabase } from "../../../../../lib/supabaseClient";
import { MessageSquare, Star, Clock } from "lucide-react";
import CommentsSection from "@/components/CommentsSection";
import TopNavbar from "@/components/TopNavbar";
import Header from "@/components/Header";
import Link from "next/link";

export default function MangaDetails() {
  const [manga, setManga] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const params = useParams();
  const userId = params.id;

  useEffect(() => {
    async function fetchManga() {
      try {
        const { data, error } = await supabase
          .from("mangas")
          .select("*")
          .eq("mal_id", userId) // Filtro para buscar apenas o mangá com mal_id presente na URL
          .single(); // Usa single() para retornar um objeto único em vez de um array

        if (error) throw error;

        if (data) {
          // Formata o único mangá retornado
          const formatted = {
            ...data,
            id: data.mal_id,
            title_english: data.title,
            large_image_url: data.large_image_url,
          };

          // Definir o mangá em um array para manter a consistência com o estado anterior
          setManga(formatted);
        } else {
          // Se não encontrar o mangá com ID 1
          setManga(null);
          setError("Mangá com ID 1 não encontrado");
        }
      } catch (err) {
        console.error("MangaList:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchManga();
  }, [userId]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  if (!manga) return <div>Mangá não encontrado</div>;

  return (
    <div className="bg-gray-100 min-h-screen pb-8">
      <TopNavbar />
      <Header />
      <div className="bg-white shadow rounded-lg mb-4 mx-4 mt-4">
        <div className="flex flex-col md:flex-row p-4">
          {/* Capa do Mangá */}
          <div className="w-32 h-44 relative mr-4 flex-shrink-0">
            <div className="bg-gray-300 w-full h-full rounded-md overflow-hidden">
              <Image
                src={manga.large_image_url}
                alt={manga.title}
                width={128}
                height={176}
                className="object-cover"
              />
            </div>
          </div>

          {/* Informações básicas */}
          <div className="flex-grow mt-4 md:mt-0">
            <h1 className="font-bold text-lg mb-2">{manga.title}</h1>
            <div className="flex flex-wrap gap-2 mb-3">
              <p className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
                Ano de lançamento: {manga.year}
              </p>
              <p className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
                Capitulos publicados: {manga.chapters}
              </p>
              <p className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
                Avaliação: {manga.score} ⭐
              </p>
            </div>

            <div className="w-full">
              <button className="w-full py-5 mt-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-100 active:bg-gray-200 cursor-pointer transition">
                Comentar primeiro capítulo
              </button>
            </div>

            {/* <div className="mt-3 flex justify-end">
              <select className="bg-gray-200 text-gray-700 hover:bg-gray-100 active:bg-gray-200 cursor-pointer px-2 py-1 rounded-md text-sm">
                <option>Selecionar Status</option>
                <option>Lendo</option>
                <option>Completo</option>
                <option>Em espera</option>
                <option>Abandonado</option>
              </select>
            </div> */}
          </div>
        </div>
      </div>

      {/* Sinopse */}
      <div className="bg-white shadow rounded-lg p-4 mb-4 mx-4">
        <h2 className="font-bold text-lg mb-2">Sinopse</h2>
        <p className="text-gray-700 text-sm">Verificar se vai ter sinopse</p>
      </div>

      {/* Links de compra */}
      <div className="bg-white shadow rounded-lg p-4 mb-4 mx-4">
        <h2 className="font-bold text-lg mb-2">
          Onde comprar, ler ou fazer tracking
        </h2>
        <div className="flex flex-wrap gap-2">
          Fazer funcao para carregar link de compra
        </div>
      </div>

      {/* Gêneros */}
      <div className="bg-white shadow rounded-lg p-4 mb-4 mx-4">
        <h2 className="font-bold text-lg mb-2">Gêneros</h2>
        <div className="flex flex-wrap gap-2">
          {(() => {
            const genres = [
              manga.genre1,
              manga.genre2,
              manga.genre3,
            ].filter(Boolean);

            return genres.length > 0 ? (
              genres.map((genre, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {genre}
                </span>
              ))
            ) : (
              <span className="text-gray-600 text-sm">
                Gêneros não disponíveis
              </span>
            );
          })()}
        </div>
      </div>

      {/* Capítulos */}
      <div className="bg-white shadow rounded-lg p-4 mb-4 mx-4">
        <h2 className="font-bold text-lg mb-2">Capítulos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: manga.chapters || 1 }, (_, index) => (
            <Link key={index} href={`/obra/manga/${userId}/${index + 1}`}>
              <div className="border rounded-md p-3 hover:bg-gray-100 active:bg-gray-200 cursor-pointer">
                <div className="flex justify-between items-center mb-1">
                  <div className="font-medium">
                    Capítulo {index + 1}
                    {index === 0 && (
                      <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded">
                        Novo
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center text-xs text-gray-500 justify-between">
                  <div className="flex items-center">
                    <MessageSquare size={12} className="mr-1" />
                    <span> Comentários</span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={12} className="mr-1" />
                    <span>1 min</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {manga.chapters > 4 && (
          <div className="mt-4 text-center">
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-100 active:bg-gray-200 cursor-pointer transition">
              Ver mais
            </button>
          </div>
        )}
      </div>

      <div className="bg-white shadow rounded-lg p-4 mx-4">
        <h2 className="font-bold text-lg mb-4">Comentários</h2>
        <CommentsSection identifier={`manga-${userId}`} />
      </div>
    </div>
  );
}
