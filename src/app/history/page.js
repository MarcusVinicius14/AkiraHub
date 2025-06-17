"use client";
import { useEffect, useState } from "react";
import TopNavbar from "@/components/TopNavbar";
import Header from "@/components/Header";
import Link from "next/link";
import Image from "next/image";

export default function HistoryPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch('/api/history');
        if (res.ok) {
          const data = await res.json();
          setItems(data);
        }
      } catch (err) {
        console.error('Erro ao buscar histórico', err);
      }
    }
    fetchHistory();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <TopNavbar />
      <Header />
      <main className="p-4">
        <h1 className="text-2xl font-semibold mb-4">Histórico</h1>
        {items.length === 0 ? (
          <p className="text-gray-600">Nenhuma atividade recente.</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <Link
                key={item.identifier}
                href={item.url}
                className="flex items-center bg-white rounded shadow p-2 hover:bg-gray-50"
              >
                <div className="w-16 h-24 relative mr-3 flex-shrink-0 bg-gray-200 rounded overflow-hidden">
                  {item.image && (
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  )}
                </div>
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.subtitle}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
