"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { supabase } from "../../../../../lib/supabaseClient";
import profileimage from "../../../../../public/profileimage.svg";
import { MessageSquare, Star, Clock, ThumbsUp } from "lucide-react";
import TopNavbar from "@/components/TopNavbar";
import Header from "@/components/Header";

export default function MangaDetails() {
  const [commentText, setCommentText] = useState("");
  const [activeTab, setActiveTab] = useState("melhores");
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
            "Anime não encontrado na tabela 'animes', buscando em 'season_upcoming'..."
          );

          // Segunda tentativa: procurar na tabela "season_upcoming"
          const { data: upcomingData, error: upcomingError } = await supabase
            .from("season_upcoming")
            .select("*")
            .eq("mal_id", userId)
            .single();

          if (upcomingError) {
            // Se também houver erro na segunda tabela
            if (upcomingError.code === "PGRST116") {
              throw new Error(
                `Anime com ID ${userId} não encontrado em nenhuma tabela`
              );
            } else {
              throw upcomingError;
            }
          }

          // Se encontrou na segunda tabela
          if (upcomingData) {
            data = upcomingData;
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
            images: { jpg: { image_url: data.image_url } },
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
        console.error("AnimeList:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [userId]); // Adicionei userId como dependência para recarregar quando mudar

  console.log(anime);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  if (!anime) return <div>anime não encontrado</div>;

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
                src={anime.image_url}
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
                episodios lançados: {anime.episodes}
              </p>
              <p className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
                Avaliação: {anime.score} ⭐
              </p>
            </div>

            <div className="w-full">
              <button className="w-full py-5 mt-2 active:bg-gray-200 cursor-pointer bg-gray-200 text-gray-700 rounded-md hover:bg-gray-100 transition">
                Comentar primeiro episodio
              </button>
            </div>

            <div className="mt-3 flex justify-end">
              <select className="bg-gray-200 hover:bg-gray-100 active:bg-gray-200 cursor-pointer text-gray-700 px-2 py-1 rounded-md text-sm">
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
        <p className="text-gray-700 text-sm">Verificar se vai ter sinopse</p>
      </div>

      {/* Links de compra */}
      <div className="bg-white shadow rounded-lg p-4 mb-4 mx-4">
        <h2 className="font-bold text-lg mb-2">Onde ver o anime</h2>
        <div className="flex flex-wrap gap-2">
          Fazer funcao para carregar links
        </div>
      </div>

      {/* Gêneros */}
      <div className="bg-white shadow rounded-lg p-4 mb-4 mx-4">
        <h2 className="font-bold text-lg mb-2">Gêneros</h2>
        Ver se ja tem as relacoes entre o banco de mangas e generos
      </div>

      {/* episodios */}
      <div className="bg-white  shadow rounded-lg p-4 mb-4 mx-4">
        <h2 className="font-bold text-lg mb-2">Episodios</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className=" border rounded-md p-3 hover:bg-gray-100 active:bg-gray-200 cursor-pointer">
            <div className="flex justify-between items-center mb-1">
              <div className="font-medium">
                Episodios 1
                <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded">
                  Novo
                </span>
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
        </div>
        <div className="mt-4 text-center">
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-100 active:bg-gray-200 cursor-pointer transition">
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
                src={profileimage}
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
          <div className="flex text-sm ">
            <button
              className={`px-3 py-1 hover:bg-gray-100 active:bg-gray-200 cursor-pointer ${
                activeTab === "melhores"
                  ? "font-bold text-black"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("melhores")}
            >
              Melhores
            </button>
            <button
              className={`px-3 py-1 hover:bg-gray-100 active:bg-gray-200 cursor-pointer ${
                activeTab === "recentes"
                  ? "font-bold text-black"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("recentes")}
            >
              Mais recentes
            </button>
            <button
              className={`px-3 py-1 hover:bg-gray-100 active:bg-gray-200 cursor-pointer ${
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
          <div className="flex pb-4 border-b last:border-0">
            <div className="w-10 h-10 mr-3">
              <div className="rounded-full bg-gray-300 w-full h-full overflow-hidden">
                <Image
                  src={profileimage}
                  alt="profileimage"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex-grow">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-medium text-sm">teste</h4>
                  <p className="text-xs text-gray-500">1 min</p>
                </div>
                <div className="flex items-center">
                  <span className="text-yellow-500 flex items-center text-xs mr-4">
                    <Star size={12} className="mr-1 fill-yellow-500" />
                    Comentário 5
                  </span>
                  <button className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 active:bg-gray-200 cursor-pointer">
                    <ThumbsUp size={14} />
                  </button>
                </div>
              </div>
              <p className="text-sm mt-1">comentario teste</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
