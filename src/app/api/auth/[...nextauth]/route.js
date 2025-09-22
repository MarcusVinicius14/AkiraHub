// app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
// 1. Importe o CredentialsProvider
import CredentialsProvider from "next-auth/providers/credentials";
// 2. Importe o cliente Supabase (crie este arquivo se ainda não o tiver)
import { createClient } from "@supabase/supabase-js";

// Crie uma instância do cliente Supabase para usar no backend
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY, // Use a chave de serviço segura aqui
  { auth: { persistSession: false } }
);

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // 3. Adicione o CredentialsProvider
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // Esta função é chamada quando você usa signIn('credentials', ...)
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        // 4. Use o Supabase para verificar o email e senha
        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        // Se o Supabase retornar um usuário, a autorização foi um sucesso
        if (data.user) {
          // O objeto retornado aqui será salvo na sessão (JWT)
          return data.user;
        } else {
          // Se houver erro ou nenhum usuário, retorne null
          // NextAuth.js saberá que o login falhou
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
