import { NextResponse } from "next/server";
import Parser from "rss-parser";

export async function GET() {
  const parser = new Parser();
  try {
    const feed = await parser.parseURL("https://www.animenewsnetwork.com/all/rss.xml");
    // Aqui você pode transformar "feed.items" conforme desejar, filtrando ou limitando o número de notícias.
    return NextResponse.json(feed.items.slice(0, 2));
  } catch (err) {
    return NextResponse.json({ error: "Erro ao buscar notícias" }, { status: 500 });
  }
}
