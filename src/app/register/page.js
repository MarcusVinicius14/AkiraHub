// app/register/page.js

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient"; // Ajuste o caminho se necessário
import Link from "next/link";
import TopNavbar from "@/components/TopNavbar";
import Header from "@/components/Header";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    if (password !== confirmPassword) {
      setMessage("As senhas não coincidem.");
      setIsLoading(false);
      return;
    }
    if (!avatarFile) {
      setMessage("Por favor, selecione uma imagem de avatar.");
      setIsLoading(false);
      return;
    }

    // 1. Montar os dados do formulário para enviar para a API
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("username", username);
    formData.append("dateOfBirth", dateOfBirth);
    formData.append("avatarFile", avatarFile);

    try {
      // 2. Enviar os dados para o nosso endpoint de API
      const response = await fetch("/api/register", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        // Se a API retornar um erro, mostre-o
        throw new Error(result.error || "Algo deu errado");
      }

      // Se a API retornar sucesso
      setMessage(result.message);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <TopNavbar />
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">Criar Conta</h1>
          <form className="space-y-4" onSubmit={handleRegister}>
            {/* Campo Nome de Usuário */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome de Usuário
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="border rounded w-full p-2"
              />
            </div>

            {/* Campo Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border rounded w-full p-2"
              />
            </div>

            {/* Campo Data de Nascimento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Nascimento
              </label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
                className="border rounded w-full p-2"
              />
            </div>

            {/* Campo Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border rounded w-full p-2"
              />
            </div>

            {/* Campo Confirmar Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Senha
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="border rounded w-full p-2"
              />
            </div>

            {/* Campo Foto de Avatar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Foto de Avatar
              </label>
              <input
                type="file"
                onChange={(e) => setAvatarFile(e.target.files[0])}
                accept="image/*"
                required
                className="border rounded w-full p-2"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isLoading ? "Cadastrando..." : "Cadastrar"}
            </button>
          </form>
          {message && <p className="text-center text-sm mt-4">{message}</p>}
          <p className="text-center text-sm mt-4">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Faça o login
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
