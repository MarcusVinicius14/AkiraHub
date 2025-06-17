"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { supabase } from "../../../../../../lib/supabaseClient";
import { ArrowLeft } from "lucide-react";
import CommentsSection from "@/components/CommentsSection";
import TopNavbar from "@/components/TopNavbar";
import Header from "@/components/Header";
import Link from "next/link";

export default function ChapterDetails() {
  const [manga, setManga] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const params = useParams();
  const mangaId = params.id;
  const chapterNumber = params.CapId;

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("mangas")
          .select("*")
          .eq("mal_id", mangaId)
          .single();
        if (error) throw error;
        if (data) {
          setManga({
            ...data,
            id: data.mal_id,
            title: data.title,
            large_image_url: data.large_image_url,
          });
        } else {
          setManga(null);
          setError(`Mangá com ID ${mangaId} não encontrado`);
        }
      } catch (err) {
        console.error("ChapterDetails:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [mangaId]);

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
  if (!manga)
    return (
      <div className="bg-gray-100 min-h-screen">
        <TopNavbar />
        <Header />
        <div className="p-4">Mangá não encontrado</div>
      </div>
    );

  return (
    <div className="bg-gray-100 min-h-screen pb-8">
      <TopNavbar />
      <Header />

      {/* Breadcrumb */}
      <div className="mx-4 mt-4 mb-2">
        <Link
          href={`/obra/manga/${mangaId}`}
          className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="text-sm">Voltar para {manga.title}</span>
        </Link>
      </div>

      {/* Chapter Info */}
      <div className="bg-white shadow rounded-lg mb-4 mx-4 p-4 flex">
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
        <div className="flex-grow">
          <h1 className="font-bold text-lg mb-2">
            Capítulo {chapterNumber}: {manga.title}
          </h1>
        </div>
      </div>

      {/* Comentários */}
      <div className="bg-white shadow rounded-lg p-4 mx-4">
        <h2 className="font-bold text-lg mb-4">Comentários do Capítulo</h2>
        <CommentsSection identifier={`manga-${mangaId}-cap-${chapterNumber}`} />
      </div>
    </div>
  );
}
