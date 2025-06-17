"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import TopNavbar from "@/components/TopNavbar";
import Header from "@/components/Header";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      // Mensagem personalizada para falha de autenticação
      alert("Email ou senha incorretos. Tente novamente!");
      setMessage("Email ou senha incorretos. Tente novamente!");
    } else {
      setMessage("Login realizado");
      router.push("/profile");
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setMessage(error.message);
    else setMessage("Cadastro criado, verifique seu email");
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <TopNavbar />
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <h1 className="text-xl font-semibold mb-6 text-center">Entrar</h1>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border rounded w-full p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="pass">
                Senha
              </label>
              <input
                id="pass"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border rounded w-full p-2"
              />
            </div>
            <div className="flex space-x-2 justify-end pt-2">
              <button
                type="button"
                onClick={handleSignup}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cadastrar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Entrar
              </button>
            </div>
          </form>
          {message && <p className="text-center text-sm mt-4">{message}</p>}
        </div>
      </main>
    </div>
  );
}
