"use client";
import { useEffect, useState } from "react";
import TopNavbar from "@/components/TopNavbar";
import Header from "@/components/Header";
import { supabase } from "../../../lib/supabaseClient";

export default function ProfilePage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [preview, setPreview] = useState("");
  const [favAnime, setFavAnime] = useState({ id: null, title: "" });
  const [favManga, setFavManga] = useState({ id: null, title: "" });
  const [animeSug, setAnimeSug] = useState([]);
  const [mangaSug, setMangaSug] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setUsername(data.username || "");
          setEmail(data.email || "");
          setAvatarUrl(data.avatar_url || "");
          setPreview(data.avatar_url || "");
          if (data.favorite_anime_id) {
            const { data: anime } = await supabase
              .from("animes")
              .select("mal_id,title")
              .eq("mal_id", data.favorite_anime_id)
              .single();
            if (anime) setFavAnime({ id: anime.mal_id, title: anime.title });
          }
          if (data.favorite_manga_id) {
            const { data: manga } = await supabase
              .from("mangas")
              .select("mal_id,title")
              .eq("mal_id", data.favorite_manga_id)
              .single();
            if (manga) setFavManga({ id: manga.mal_id, title: manga.title });
          }
        }
      } catch (err) {
        console.error("Erro ao buscar perfil", err);
      }
    }
    fetchProfile();
  }, []);

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarUrl(reader.result.toString());
      setPreview(reader.result.toString());
    };
    reader.readAsDataURL(file);
  }

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

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          avatar_url: avatarUrl,
          email,
          password,
          favorite_anime_id: favAnime.id,
          favorite_manga_id: favManga.id,
        }),
      });
      if (res.ok) {
        setMessage("Perfil salvo com sucesso.");
      } else {
        const err = await res.json();
        setMessage(err.error || "Erro ao salvar");
      }
    } catch (err) {
      console.error("Erro ao salvar perfil", err);
      setMessage("Erro inesperado");
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <TopNavbar />
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-semibold mb-6 text-center">Editar Perfil</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center">
              {preview ? (
                <img
                  src={preview}
                  alt="avatar"
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
            <div className="relative">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Nome
              </label>
              <input
                id="username"
                type="text"
                placeholder="Seu nome"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border rounded w-full p-2"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border rounded w-full p-2"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Nova senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border rounded w-full p-2"
              />
            </div>
            <div>
              <label htmlFor="favAnime" className="block text-sm font-medium text-gray-700 mb-1">
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
                <ul className="border rounded-b bg-white shadow absolute z-10 w-full">
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
            <div className="pt-6 relative">
              <label htmlFor="favManga" className="block text-sm font-medium text-gray-700 mb-1">
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
                <ul className="border rounded-b bg-white shadow absolute z-10 w-full">
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
            <div className="text-right">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Salvar
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
