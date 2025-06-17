"use client";
import { useEffect, useState } from "react";
import TopNavbar from "@/components/TopNavbar";
import Header from "@/components/Header";
import Link from "next/link";
import Image from "next/image";

export default function FavoritesPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const res = await fetch('/api/favorites');
        if (res.ok) {
          const data = await res.json();
          setItems(data);
        }
      } catch (err) {
        console.error('Erro ao buscar favoritos', err);
      }
    }
    fetchFavorites();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <TopNavbar />
      <Header />
      <main className="p-4">
        <h1 className="text-2xl font-semibold mb-4">Favoritos</h1>
        {items.length === 0 && (
          <p className="text-gray-600">Você ainda não favoritou nenhuma obra.</p>
        )}
        {items.length > 0 && (
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {items.map((item) => (
              <Link key={item.id} href={`/obra/${item.type}/${item.mal_id}`} className="flex-shrink-0 w-40">
                <div className="w-40 h-56 relative bg-gray-200 rounded-md overflow-hidden">
                  {item.image && (
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  )}
                </div>
                <p className="mt-2 text-sm text-center line-clamp-2">{item.title}</p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
