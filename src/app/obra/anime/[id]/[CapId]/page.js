"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { supabase } from "../../../../../../lib/supabaseClient";
import profileimage from "../../../../../../public/profileimage.svg";
import {
  MessageSquare,
  Star,
  Clock,
  ThumbsUp,
  ArrowLeft,
  Play,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import TopNavbar from "@/components/TopNavbar";
import Header from "@/components/Header";
import Link from "next/link";

export default function EpisodeDetails() {
  const [commentText, setCommentText] = useState("");
  const [activeTab, setActiveTab] = useState("melhores");
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([
    {
      id: 1,
      user: "AnimeOtaku2024",
      time: "2 horas atrás",
      rating: 9.5,
      content: "Que episódio incrível! A animação estava perfeita nessa luta.",
      likes: 15,
    },
    {
      id: 2,
      user: "FullmetalFan",
      time: "5 horas atrás",
      rating: 10.0,
      content: "Edward nunca falha em me surpreender com sua determinação.",
      likes: 8,
    },
  ]);

  const params = useParams();
  const animeId = params.id;
  const episodeNumber = params.CapId;

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Primeira tentativa: procurar na tabela "animes"
        let { data, error } = await supabase
          .from("animes")
          .select("*")
          .eq("mal_id", animeId)
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
            .eq("mal_id", animeId)
            .single();

          if (seasonNowError?.code === "PGRST116" || !seasonNowData) {
            console.log(
              "Anime não encontrado na tabela 'season_now', buscando em 'season_upcoming'..."
            );
            // Terceira tentativa: procurar na tabela "season_upcoming"
            const { data: upcomingData, error: upcomingError } = await supabase
              .from("season_upcoming")
              .select("*")
              .eq("mal_id", animeId)
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
                  .eq("mal_id", animeId)
                  .single();

              if (topAnimeError) {
                // Se também houver erro na quarta tabela
                if (topAnimeError.code === "PGRST116") {
                  throw new Error(
                    `Anime com ID ${animeId} não encontrado em nenhuma tabela`
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
          setError(`Anime com ID ${animeId} não encontrado em nenhuma tabela`);
        }
      } catch (err) {
        console.error("EpisodeDetails:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [animeId]);

  const handleAddComment = () => {
    if (commentText.trim()) {
      const newComment = {
        id: comments.length + 1,
        user: "Você",
        time: "Agora",
        rating: 0,
        content: commentText,
        likes: 0,
      };
      setComments([newComment, ...comments]);
      setCommentText("");
    }
  };

  if (loading)
    return (
      <div className="bg-gray-100 min-h-screen">
        <TopNavbar />
        <Header />
        <div className="p-4">Carregando...</div>
      </div>
    );
  if (error)
    return (
      <div className="bg-gray-100 min-h-screen">
        <TopNavbar />
        <Header />
        <div className="p-4">Erro: {error}</div>
      </div>
    );
  if (!anime)
    return (
      <div className="bg-gray-100 min-h-screen">
        <TopNavbar />
        <Header />
        <div className="p-4">Anime não encontrado</div>
      </div>
    );

  return (
    <div className="bg-gray-100 min-h-screen pb-8">
      <TopNavbar />
      <Header />

      {/* Breadcrumb */}
      <div className="mx-4 mt-4 mb-2">
        <Link
          href={`/obra/anime/${animeId}`}
          className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="text-sm">Voltar para {anime.title}</span>
        </Link>
      </div>

      {/* Episode Info */}
      <div className="bg-white shadow rounded-lg mb-4 mx-4">
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

          {/* Informações do episódio */}
          <div className="flex-grow mt-4 md:mt-0">
            <h1 className="font-bold text-lg mb-2">
              Episódio {episodeNumber}: {anime.title}
            </h1>
            <div className="flex flex-wrap gap-2 mb-3">
              <p className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                24 min
              </p>
              <p className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full flex items-center">
                <Star className="w-3 h-3 mr-1 text-yellow-500" />
                {anime.score} ⭐
              </p>
              <p className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
                Ano: {anime.year}
              </p>
            </div>

            {/* Navigation between episodes */}
            <div className="flex justify-between items-center mb-4">
              <Link
                href={`/obra/anime/${animeId}/${parseInt(episodeNumber) - 1}`}
              >
                <button
                  className={`flex items-center px-4 py-2 rounded-md transition ${
                    parseInt(episodeNumber) <= 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-100 active:bg-gray-200 cursor-pointer"
                  }`}
                  disabled={parseInt(episodeNumber) <= 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Anterior
                </button>
              </Link>

              <div className="text-center">
                <span className="text-sm text-gray-500">Episódio</span>
                <div className="text-xl font-bold text-gray-900">
                  {episodeNumber} / {anime.episodes}
                </div>
              </div>

              <Link
                href={`/obra/anime/${animeId}/${parseInt(episodeNumber) + 1}`}
              >
                <button
                  className={`flex items-center px-4 py-2 rounded-md transition ${
                    parseInt(episodeNumber) >= anime.episodes
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 cursor-pointer"
                  }`}
                  disabled={parseInt(episodeNumber) >= anime.episodes}
                >
                  Próximo
                  <ChevronRight className="w-4 h-4 ml-1" />
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

      {/* Episode Description */}
      <div className="bg-white shadow rounded-lg p-4 mb-4 mx-4">
        <h2 className="font-bold text-lg mb-2">Sobre este episódio</h2>
        <p className="text-gray-700 text-sm">
          {anime.synopsis
            ? `Neste episódio de ${anime.title}, a história continua com desenvolvimentos importantes para o enredo principal.`
            : "Descrição do episódio não disponível"}
        </p>
      </div>

      {/* Onde assistir */}
      <div className="bg-white shadow rounded-lg p-4 mb-4 mx-4">
        <h2 className="font-bold text-lg mb-2">Onde assistir</h2>
        <div className="flex flex-wrap gap-2">
          <span className="text-gray-600 text-sm">
            Links de streaming serão adicionados em breve
          </span>
        </div>
      </div>

      {/* Comentários */}
      <div className="bg-white shadow rounded-lg p-4 mx-4">
        <h2 className="font-bold text-lg mb-4">Comentários do Episódio</h2>

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
              placeholder={`Escreva um comentário sobre o episódio ${episodeNumber}...`}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={2}
            />
            <button
              onClick={handleAddComment}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:bg-blue-700 cursor-pointer transition text-sm"
            >
              Comentar
            </button>
          </div>
        </div>

        {/* Tabs de filtro */}
        <div className="flex justify-end mb-4">
          <div className="flex text-sm">
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
          {comments.map((comment) => (
            <div key={comment.id} className="flex pb-4 border-b last:border-0">
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
                    <h4 className="font-medium text-sm">{comment.user}</h4>
                    <p className="text-xs text-gray-500">{comment.time}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {comment.rating > 0 && (
                      <span className="text-yellow-500 flex items-center text-xs">
                        <Star size={12} className="mr-1 fill-yellow-500" />
                        {comment.rating}
                      </span>
                    )}
                    <button className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 active:bg-gray-200 cursor-pointer p-1 rounded">
                      <ThumbsUp size={14} />
                      <span className="text-xs ml-1">{comment.likes}</span>
                    </button>
                  </div>
                </div>
                <p className="text-sm mt-1">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
