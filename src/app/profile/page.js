"use client";
import { useEffect, useState } from "react";
import TopNavbar from "@/components/TopNavbar";
import Header from "@/components/Header";

export default function ProfilePage() {
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setUsername(data.username || "");
          setAvatarUrl(data.avatar_url || "");
          setPreview(data.avatar_url || "");
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

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, avatar_url: avatarUrl }),
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
    <div className="bg-gray-100 min-h-screen pb-8">
      <TopNavbar />
      <Header />
      <div className="max-w-md mx-auto mt-6 bg-white p-4 shadow rounded">
        <h1 className="text-lg font-bold mb-4">Seu Perfil</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-4">
            {preview ? (
              <img
                src={preview}
                alt="avatar"
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-300" />
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          <input
            type="text"
            placeholder="Seu nome"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border rounded p-2 w-full"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Salvar
          </button>
        </form>
        {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
      </div>
    </div>
  );
}
