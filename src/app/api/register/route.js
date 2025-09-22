// app/api/register/route.js

import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// IMPORTANTE: Este código roda apenas no servidor.
// Ele usa as variáveis de ambiente seguras.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY, // A chave de administrador!
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(request) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const username = formData.get("username");
  const dateOfBirth = formData.get("dateOfBirth");
  const avatarFile = formData.get("avatarFile");

  if (!email || !password || !username || !dateOfBirth || !avatarFile) {
    return NextResponse.json(
      { error: "Faltam dados no formulário." },
      { status: 400 }
    );
  }

  // 1. Criar o usuário usando o cliente de administrador
  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Garante que o usuário precise confirmar o email
    });

  if (authError) {
    console.error("Erro no Supabase Auth:", authError);
    return NextResponse.json({ error: authError.message }, { status: 500 });
  }

  const user = authData.user;

  // 2. Fazer o upload do avatar
  const filePath = `${user.id}/${avatarFile.name}`;
  const { error: uploadError } = await supabaseAdmin.storage
    .from("avatars")
    .upload(filePath, avatarFile);

  if (uploadError) {
    console.error("Erro no Upload do Storage:", uploadError);
    // Limpeza: se o upload falhar, delete o usuário recém-criado
    await supabaseAdmin.auth.admin.deleteUser(user.id);
    return NextResponse.json(
      { error: `Erro no upload do avatar: ${uploadError.message}` },
      { status: 500 }
    );
  }

  // 3. Obter a URL pública
  const { data: urlData } = supabaseAdmin.storage
    .from("avatars")
    .getPublicUrl(filePath);
  const avatarUrl = urlData.publicUrl;

  // 4. Inserir o perfil na tabela 'profiles'
  const { error: profileError } = await supabaseAdmin.from("profiles").insert({
    id: user.id,
    username,
    email,
    date_of_birth: dateOfBirth,
    avatar_url: avatarUrl,
  });

  if (profileError) {
    console.error("Erro na inserção do perfil:", profileError);
    // Limpeza
    await supabaseAdmin.auth.admin.deleteUser(user.id);
    return NextResponse.json(
      { error: `Erro ao criar o perfil: ${profileError.message}` },
      { status: 500 }
    );
  }

  // Se tudo deu certo:
  return NextResponse.json({
    message:
      "Cadastro realizado com sucesso! Verifique seu email para confirmar a conta.",
  });
}
