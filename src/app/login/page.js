// app/login/page.js

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
// 1. Importe o signIn do NextAuth.js e remova o cliente supabase daqui
import { signIn } from "next-auth/react";
import TopNavbar from "@/components/TopNavbar";
import Header from "@/components/Header";

// A função de cadastro ainda pode usar o cliente Supabase
import { supabase } from "../../../lib/supabaseClient";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // 2. Atualize a função de login
  async function handleLogin(e) {
    e.preventDefault();
    setMessage(""); // Limpa a mensagem anterior

    const result = await signIn("credentials", {
      // Use o provider 'credentials' que configuramos
      redirect: false, // Não redireciona automaticamente, para podermos tratar o erro
      email,
      password,
    });

    if (result.error) {
      // Se houver um erro, o NextAuth.js o retornará aqui
      setMessage("Email ou senha incorretos. Tente novamente!");
    } else {
      // Se o login for bem-sucedido, o resultado será ok e sem erro
      setMessage("Login realizado com sucesso!");
      router.push("/"); // Redireciona para a home
      router.refresh(); // Opcional: força a atualização do estado da sessão no servidor
    }
  }

  // A função de cadastro pode continuar a mesma, pois apenas cria o usuário no banco
  async function handleSignup(e) {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage(
        "Cadastro criado! Por favor, verifique seu e-mail para confirmar e depois faça o login."
      );
    }
  }

  // O seu JSX (return) pode permanecer exatamente o mesmo
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <TopNavbar />
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <h1 className="text-xl font-semibold mb-6 text-center">Entrar</h1>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="email"
              >
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
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="pass"
              >
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
              {/* ALTERE ESTE BOTÃO */}
              <Link href="/register">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cadastrar
                </button>
              </Link>

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
