// app/api/profile/route.js

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

// O cliente admin do Supabase continua o mesmo
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    // 1. Usa o método nativo do Next.js para ler o FormData
    const formData = await req.formData();

    // 2. Pega os campos e o arquivo diretamente do formData
    const username = formData.get("username");
    const password = formData.get("password"); // Pode ser null se não for enviado
    const favorite_anime_id = formData.get("favorite_anime_id");
    const favorite_manga_id = formData.get("favorite_manga_id");
    const avatarFile = formData.get("avatarFile"); // O objeto do arquivo

    let avatarUrl = session.user.image;

    // 3. Lógica de upload atualizada
    if (avatarFile && typeof avatarFile.arrayBuffer === "function") {
      const fileBuffer = Buffer.from(await avatarFile.arrayBuffer());
      const filePath = `${userId}/${Date.now()}_${avatarFile.name}`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from("avatars")
        .upload(filePath, fileBuffer, {
          contentType: avatarFile.type,
          upsert: true,
        });

      if (uploadError)
        throw new Error(`Erro no upload do avatar: ${uploadError.message}`);

      const { data: urlData } = supabaseAdmin.storage
        .from("avatars")
        .getPublicUrl(filePath);
      avatarUrl = urlData.publicUrl;
    }

    // O resto da lógica para atualizar o perfil e a autenticação continua a mesma
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({
        username,
        avatar_url: avatarUrl,
        favorite_anime_id: favorite_anime_id || null,
        favorite_manga_id: favorite_manga_id || null,
      })
      .eq("id", userId);

    if (profileError)
      throw new Error(`Erro ao atualizar perfil: ${profileError.message}`);

    const userUpdateData = {};
    if (password) {
      userUpdateData.password = password;
    }

    if (Object.keys(userUpdateData).length > 0) {
      const { error: authError } =
        await supabaseAdmin.auth.admin.updateUserById(userId, userUpdateData);
      if (authError)
        throw new Error(`Erro ao atualizar autenticação: ${authError.message}`);
    }

    return NextResponse.json({
      message: "Perfil atualizado com sucesso!",
      newAvatarUrl: avatarUrl,
    });
  } catch (error) {
    console.error("Erro na API de perfil:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
