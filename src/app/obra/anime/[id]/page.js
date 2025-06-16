"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { supabase } from "../../../../../lib/supabaseClient";
import { MessageSquare, Clock } from "lucide-react";
import DisqusComments from "@/components/DisqusComments";
import TopNavbar from "@/components/TopNavbar";
import Header from "@/components/Header";
import Link from "next/link";

export default function AnimeDetails() {
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const params = useParams();
  const userId = params.id;
  console.log({ userId });

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Primeira tentativa: procurar na tabela "animes"
        let { data, error } = await supabase
          .from("animes")
          .select("*")
          .eq("mal_id", userId)
          .single();

        // Se houver erro de "não encontrado" ou data for null, tenta na segunda tabela
        if (error?.code === "PGRST116" || !data) {
          console.log(
            "Anime não encontrado na tabela 'animes', buscando em 'season_now'..."
          );
          // Segunda tentativa: procurar na tabela "season_now"
          const { data: seasonNowData, error: seasonNowError } = await supabase
            .from("season_now")
            .select("*")
            .eq("mal_id", userId)
            .single();

          if (seasonNowError?.code === "PGRST116" || !seasonNowData) {
            console.log(
              "Anime não encontrado na tabela 'season_now', buscando em 'season_upcoming'..."
            );
            // Terceira tentativa: procurar na tabela "season_upcoming"
            const { data: upcomingData, error: upcomingError } = await supabase
              .from("season_upcoming")
              .select("*")
              .eq("mal_id", userId)
              .single();

            if (upcomingError?.code === "PGRST116" || !upcomingData) {
              console.log(
                "Anime não encontrado na tabela 'season_upcoming', buscando em 'top_anime'..."
              );
              // Quarta tentativa: procurar na tabela "top_anime"
              const { data: topAnimeData, error: topAnimeError } =
                await supabase
                  .from("top_anime")
                  .select("*")
                  .eq("mal_id", userId)
                  .single();

              if (topAnimeError) {
                // Se também houver erro na quarta tabela
                if (topAnimeError.code === "PGRST116") {
                  throw new Error(
                    `Anime com ID ${userId} não encontrado em nenhuma tabela`
                  );
                } else {
                  throw topAnimeError;
                }
              }
              // Se encontrou na quarta tabela
              if (topAnimeData) {
                data = topAnimeData;
              }
            } else if (upcomingError) {
              // Se for outro tipo de erro na terceira consulta
              throw upcomingError;
            } else {
              // Se encontrou na terceira tabela
              data = upcomingData;
            }
          } else if (seasonNowError) {
            // Se for outro tipo de erro na segunda consulta
            throw seasonNowError;
          } else {
            // Se encontrou na segunda tabela
            data = seasonNowData;
          }
        } else if (error) {
          // Se for outro tipo de erro na primeira consulta
          throw error;
        }

        // Se encontrou o anime em alguma das tabelas
        if (data) {
          const formatted = {
            ...data,
            id: data.mal_id,
            title: data.title,
            large_image_url: data.large_image_url,
            episodios: data?.episodes,
            score: data?.score,
            year: data?.year,
          };
          setAnime(formatted);
        } else {
          // Se não encontrou em nenhuma tabela
          setAnime(null);
          setError(`Anime com ID ${userId} não encontrado em nenhuma tabela`);
        }
      } catch (err) {
        console.error("AnimeDetails:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [userId]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  if (!anime) return <div>Anime não encontrado</div>;

  return (
    <div className="bg-gray-100 min-h-screen pb-8">
      <TopNavbar />
      <Header />
      <div className="bg-white shadow rounded-lg mb-4 mx-4 mt-4">
        <div className="flex flex-col md:flex-row p-4">
          {/* Capa do anime */}
          <div className="w-32 h-44 relative mr-4 flex-shrink-0">
            <div className="bg-gray-300 w-full h-full rounded-md overflow-hidden">
              <Image
                src={anime.large_image_url}
                alt={anime.title}
                width={128}
                height={176}
                className="object-cover"
              />
            </div>
          </div>

          {/* Informações básicas */}
          <div className="flex-grow mt-4 md:mt-0">
            <h1 className="font-bold text-lg mb-2">{anime.title}</h1>
            <div className="flex flex-wrap gap-2 mb-3">
              <p className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
                Ano de lançamento: {anime.year}
              </p>
              <p className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
                Episódios lançados: {anime.episodes}
              </p>
              <p className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
                Avaliação: {anime.score} ⭐
              </p>
            </div>

            <div className="w-full">
              <Link href={`/obra/anime/${userId}/${1}`}>
                <button className="w-full py-5 mt-2 active:bg-gray-200 cursor-pointer bg-gray-200 text-gray-700 rounded-md hover:bg-gray-100 transition">
                  Comentar primeiro episódio
                </button>
              </Link>
            </div>

            <div className="mt-3 flex justify-end">
              <select className="bg-gray-200 hover:bg-gray-100 active:bg-gray-200 cursor-pointer text-gray-700 px-2 py-1 rounded-md text-sm">
                <option>Selecionar Status</option>
                <option>Assistindo</option>
                <option>Completo</option>
                <option>Em espera</option>
                <option>Abandonado</option>
                <option>Pretendo assistir</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Sinopse */}
      <div className="bg-white shadow rounded-lg p-4 mb-4 mx-4">
        <h2 className="font-bold text-lg mb-2">Sinopse</h2>
        <p className="text-gray-700 text-sm">
          {anime.synopsis || "Sinopse não disponível"}
        </p>
      </div>

      {/* Links de streaming */}
      <div className="bg-white shadow rounded-lg p-4 mb-4 mx-4">
        <h2 className="font-bold text-lg mb-2">Onde assistir</h2>
        <div className="flex flex-wrap gap-2">
          <span className="text-gray-600 text-sm">
            Links de streaming serão adicionados em breve
          </span>
        </div>
      </div>

      {/* Gêneros */}
      <div className="bg-white shadow rounded-lg p-4 mb-4 mx-4">
        <h2 className="font-bold text-lg mb-2">Gêneros</h2>
        <div className="flex flex-wrap gap-2">
          {anime.genres ? (
            anime.genres.split(", ").map((genre, index) => (
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
          )}
        </div>
      </div>

      {/* Episódios */}
      <div className="bg-white shadow rounded-lg p-4 mb-4 mx-4">
        <h2 className="font-bold text-lg mb-2">Episódios</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: anime.episodes || 1 }, (_, index) => (
            <Link key={index} href={`/obra/anime/${userId}/${index + 1}`}>
              <div
                key={index + 1}
                className="border rounded-md p-3 hover:bg-gray-100 active:bg-gray-200 cursor-pointer"
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="font-medium">
                    Episódio {index + 1}
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
                    <span>0 Comentários</span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={12} className="mr-1" />
                    <span>24 min</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {anime.episodes > 4 && (
          <div className="mt-4 text-center">
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-100 active:bg-gray-200 cursor-pointer transition">
              Ver mais
            </button>
          </div>
        )}
      </div>

      {/* Comentários */}
      <div className="bg-white shadow rounded-lg p-4 mx-4">
        <h2 className="font-bold text-lg mb-4">Comentários</h2>
        <DisqusComments identifier={`anime-${userId}`} title={anime.title} />
      </div>
    </div>
  );
}
