"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import TopNavbar from "@/components/TopNavbar";
import Header from "@/components/Header";
import { supabase } from "../../../lib/supabaseClient"; // Ajuste o caminho se necessário
import Image from "next/image";

export default function ProfilePage() {
  // Hook do NextAuth para obter a sessão, status e a função de update
  const { data: session, status, update } = useSession();

  // Estados para controlar o formulário
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState(null); // Armazena o ARQUIVO da imagem
  const [preview, setPreview] = useState(""); // Armazena a URL de PREVIEW da imagem

  // Estados para as sugestões de animes e mangas
  const [favAnime, setFavAnime] = useState({ id: null, title: "" });
  const [favManga, setFavManga] = useState({ id: null, title: "" });
  const [animeSug, setAnimeSug] = useState([]);
  const [mangaSug, setMangaSug] = useState([]);

  // Estados para feedback da UI
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Efeito para popular o formulário quando a sessão carregar
  useEffect(() => {
    if (session?.user) {
      // Popula os campos básicos com os dados da sessão
      setUsername(session.user.name || "");
      setEmail(session.user.email || "");
      setPreview(session.user.image || "");

      // Busca dados adicionais (favoritos) que não estão na sessão
      async function fetchFavorites() {
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("favorite_anime_id, favorite_manga_id")
            .eq("id", session.user.id)
            .single();

          if (profile?.favorite_anime_id) {
            const { data: anime } = await supabase
              .from("animes")
              .select("mal_id,title")
              .eq("mal_id", profile.favorite_anime_id)
              .single();
            if (anime) setFavAnime({ id: anime.mal_id, title: anime.title });
          }
          if (profile?.favorite_manga_id) {
            const { data: manga } = await supabase
              .from("mangas")
              .select("mal_id,title")
              .eq("mal_id", profile.favorite_manga_id)
              .single();
            if (manga) setFavManga({ id: manga.mal_id, title: manga.title });
          }
        } catch (error) {
          console.error("Erro ao buscar favoritos:", error);
        }
      }
      fetchFavorites();
    }
  }, [session]); // Roda sempre que a sessão mudar

  // Função para lidar com a seleção de um novo arquivo de avatar
  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file); // Armazena o objeto do arquivo para o upload
    setPreview(URL.createObjectURL(file)); // Cria uma URL de preview local e temporária
  }

  // Função para enviar as atualizações para a nossa API segura
  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("username", username);
    // formData.append("email", email);
    if (password) formData.append("password", password);
    if (avatarFile) formData.append("avatarFile", avatarFile);
    if (favAnime.id) formData.append("favorite_anime_id", favAnime.id);
    if (favManga.id) formData.append("favorite_manga_id", favManga.id);

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      setMessage("Perfil salvo com sucesso.");

      // Atualiza a sessão do NextAuth em tempo real com os novos dados
      await update({
        name: username,
        email: email,
        image: result.newAvatarUrl || session.user.image, // Usa a nova URL do avatar se houver
      });
    } catch (err) {
      setMessage(err.message || "Erro inesperado ao salvar.");
    } finally {
      setIsLoading(false);
      setPassword(""); // Limpa o campo de senha após a tentativa
    }
  }

  // --- Funções de busca por anime/manga (sem alteração) ---
  async function handleAnimeInput(e) {
    const value = e.target.value;
    setFavAnime({ id: null, title: value });
    if (value.length < 2) {
      setAnimeSug([]);
      return;
    }
    const { data } = await supabase
      .from("animes")
      .select("mal_id,title")
      .ilike("title", `%${value}%`)
      .limit(5);
    setAnimeSug(data || []);
  }
  function selectAnime(anime) {
    setFavAnime({ id: anime.mal_id, title: anime.title });
    setAnimeSug([]);
  }
  async function handleMangaInput(e) {
    const value = e.target.value;
    setFavManga({ id: null, title: value });
    if (value.length < 2) {
      setMangaSug([]);
      return;
    }
    const { data } = await supabase
      .from("mangas")
      .select("mal_id,title")
      .ilike("title", `%${value}%`)
      .limit(5);
    setMangaSug(data || []);
  }
  function selectManga(manga) {
    setFavManga({ id: manga.mal_id, title: manga.title });
    setMangaSug([]);
  }

  // --- Estados de Carregamento e Autenticação ---
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Carregando perfil...</p>
      </div>
    );
  }
  if (status === "unauthenticated") {
    // Idealmente, você pode redirecionar para o login
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Acesso negado. Por favor, faça o login para ver seu perfil.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <TopNavbar />
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-semibold mb-6 text-center">
            Editar Perfil
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center">
              {preview ? (
                <Image
                  src={preview}
                  alt="Preview do avatar"
                  width={128}
                  height={128}
                  className="w-32 h-32 rounded-full object-cover ring-2 ring-blue-500"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  Foto
                </div>
              )}
              <label
                htmlFor="avatarUpload"
                className="mt-3 text-sm font-medium text-blue-600 cursor-pointer hover:underline"
              >
                Escolher foto
              </label>
              <input
                id="avatarUpload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Campos do formulário */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nome
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border rounded w-full p-2"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nova senha (deixe em branco para não alterar)
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border rounded w-full p-2"
              />
            </div>

            {/* Campo Anime Favorito */}
            <div className="relative">
              <label
                htmlFor="favAnime"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Anime favorito
              </label>
              <input
                id="favAnime"
                type="text"
                placeholder="Busque um anime"
                value={favAnime.title}
                onChange={handleAnimeInput}
                className="border rounded w-full p-2"
              />
              {animeSug.length > 0 && (
                <ul className="border rounded-b bg-white shadow absolute z-10 w-full max-h-48 overflow-y-auto">
                  {animeSug.map((a) => (
                    <li
                      key={a.mal_id}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => selectAnime(a)}
                    >
                      {a.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Campo Mangá Favorito */}
            <div className="relative">
              <label
                htmlFor="favManga"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mangá favorito
              </label>
              <input
                id="favManga"
                type="text"
                placeholder="Busque um mangá"
                value={favManga.title}
                onChange={handleMangaInput}
                className="border rounded w-full p-2"
              />
              {mangaSug.length > 0 && (
                <ul className="border rounded-b bg-white shadow absolute z-10 w-full max-h-48 overflow-y-auto">
                  {mangaSug.map((m) => (
                    <li
                      key={m.mal_id}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => selectManga(m)}
                    >
                      {m.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="text-right pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
              >
                {isLoading ? "Salvando..." : "Salvar Alterações"}
              </button>
            </div>
          </form>
          {message && (
            <p className="text-center mt-4 text-sm text-gray-600">{message}</p>
          )}
        </div>
      </main>
    </div>
  );
}
