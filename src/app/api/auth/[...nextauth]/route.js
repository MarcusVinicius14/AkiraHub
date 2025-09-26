import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

const authOptions = {
  providers: [
    // GithubProvider({...}), // Seu provedor do Github, se ainda estiver usando
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        const { data: authData, error: authError } =
          await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          });

        if (authError || !authData.user) {
          return null;
        }

        const user = authData.user;

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError || !profileData) {
          return { id: user.id, email: user.email };
        }

        return {
          id: user.id,
          email: user.email,
          name: profileData.username,
          image: profileData.avatar_url,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // O callback 'jwt' é chamado para criar/atualizar o token
    jwt: async ({ token, user, trigger, session }) => {
      // No login inicial, o objeto 'user' do 'authorize' está disponível
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.picture = user.image;
      }
      // QUANDO A SESSÃO É ATUALIZADA (ex: no perfil)
      if (trigger === "update" && session) {
        // Atualiza o token com os novos dados passados pela função update()
        token.name = session.name;
        token.picture = session.image;
      }
      return token;
    },
    // O callback 'session' passa os dados do token para o cliente
    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.image = token.picture;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
