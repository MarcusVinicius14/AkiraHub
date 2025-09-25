import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { tokenize, normalizeSynonyms, parsePreferences } from "@/lib/reco/text";
import { rankWorks } from "@/lib/reco/score";

const TIP_MESSAGE =
  "Não encontrei nada com esse perfil. Tente dar 2–3 gêneros/temas e 1 exemplo que você goste.";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

const supabaseClient =
  supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;

function extractGenres(...genres) {
  return Array.from(new Set((genres ?? []).map(g => (g ?? "").trim()).filter(Boolean)));
}
function parseYear(v) {
  if (!v) return null;
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
}

function mapAnimeRowToWork(row) {
  return {
    id: row.mal_id,
    mal_id: row.mal_id,
    type: "anime",
    title: row.title ?? "",
    synopsis: "",
    genres: extractGenres(row.genre1, row.genre2, row.genre3),
    themes: [],
    demographic: null,
    year: parseYear(row.year ?? null),
    image: row.large_image_url ?? null,
    large_image_url: row.large_image_url ?? null,
  };
}
function mapMangaRowToWork(row) {
  const year = parseYear(row.year ?? row.published_from ?? null);
  return {
    id: row.mal_id,
    mal_id: row.mal_id,
    type: "manga",
    title: row.title ?? "",
    synopsis: "",
    genres: extractGenres(row.genre1, row.genre2, row.genre3),
    themes: [],
    demographic: null,
    year,
    image: row.large_image_url ?? null,
    large_image_url: row.large_image_url ?? null,
  };
}

async function fetchWorksFromSupabase(type) {
  if (!supabaseClient) throw new Error("Supabase não configurado.");
  const works = [];

  if (type !== "manga") {
    const { data, error } = await supabaseClient
      .from("animes")
      .select("mal_id, title, large_image_url, year, genre1, genre2, genre3");
    if (error) throw error;
    (data ?? []).forEach((row) => row?.mal_id && works.push(mapAnimeRowToWork(row)));
  }

  if (type !== "anime") {
    const { data, error } = await supabaseClient
      .from("mangas")
      .select("mal_id, title, large_image_url, year, published_from, genre1, genre2, genre3");
    if (error) throw error;
    (data ?? []).forEach((row) => row?.mal_id && works.push(mapMangaRowToWork(row)));
  }

  return works;
}

// Normaliza imagem p/ o cliente
function serializeForClient(w) {
  const imageUrl = w.image ?? w.large_image_url ?? null;
  return { ...w, image: imageUrl, imageUrl, large_image_url: imageUrl };
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Body inválido. Envie um JSON com o campo 'message'." },
      { status: 400 }
    );
  }

  const { message, type, count, excludeIds } = body ?? {};

  if (typeof message !== "string" || message.trim().length === 0) {
    return NextResponse.json({ error: "O campo 'message' é obrigatório." }, { status: 400 });
  }

  let typeFilter = null;
  if (typeof type !== "undefined") {
    if (type === "anime" || type === "manga") typeFilter = type;
    else if (type !== null) {
      return NextResponse.json(
        { error: "O campo 'type' deve ser 'anime', 'manga' ou omitido." },
        { status: 400 }
      );
    }
  }

  // quantidade pedida (1..12). default 3
  let qty = Number.isFinite(count) ? Number(count) : 3;
  if (qty < 1) qty = 1;
  if (qty > 12) qty = 12;

  const excludeSet = new Set(
    Array.isArray(excludeIds) ? excludeIds.map((x) => String(x)) : []
  );

  const baseTokens = normalizeSynonyms(tokenize(message));
  const { pos, anti } = parsePreferences(message);
  const fallbackLikes = baseTokens.filter((t) => !anti.includes(t));
  const likes = pos.length > 0 ? pos : fallbackLikes;

  let works;
  try {
    works = await fetchWorksFromSupabase(typeFilter);
  } catch (error) {
    console.error("Erro ao buscar obras no Supabase", error);
    return NextResponse.json(
      { error: "Não foi possível buscar as obras no momento. Tente novamente mais tarde." },
      { status: 500 }
    );
  }

  // pede um buffer maior para poder filtrar excluídos
  const buffer = Math.min(qty + excludeSet.size + 12, 50);
  const ranked = rankWorks(works, likes, anti, typeFilter, buffer);

  // remove já enviados nesta sessão e limita à quantidade solicitada
  const unique = ranked.filter((w) => !excludeSet.has(String(w.mal_id ?? w.id)));
  const picked = unique.slice(0, qty).map(serializeForClient);

  const responseBody = {
    query: { likes, dislikes: anti, type: typeFilter, requested: qty, served: picked.length },
    results: picked,
    message: picked.length === 0 ? TIP_MESSAGE : "ok",
  };

  return NextResponse.json(responseBody);
}
