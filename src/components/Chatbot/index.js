"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

// extrai um número (1..12) do texto: "3 recomendações", "manda 5", etc.
function extractDesiredCount(text) {
  const m = String(text || "").match(/(?<!\d)(\d{1,2})(?!\d)/);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  if (!Number.isFinite(n)) return null;
  return Math.max(1, Math.min(12, n));
}

const INITIAL_MESSAGES = [
  {
    id: "welcome",
    role: "bot",
    text:
      "Olá! Conte o que você está afim de assistir ou ler e eu busco recomendações no nosso catálogo.",
  },
];

const TYPE_OPTIONS = [
  { label: "Tudo", value: "all" },
  { label: "Anime", value: "anime" },
  { label: "Mangá", value: "manga" },
];

// mensagem sem citar nomes
function formatResultsMessage(results, served, requested) {
  if (!results || results.length === 0) {
    return "Não encontrei nada com esse perfil. Tente mencionar 2–3 gêneros/temas e, se quiser, um exemplo que você goste.";
  }
  const plural = served > 1;
  const diffNote = served < requested ? ` (enviei ${served}/${requested})` : "";
  return `Acho que você vai gostar ${plural ? "destas obras" : "desta obra"} 😉${diffNote}`;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(3);             // quantidade desejada (default 3)
  const [seenIds, setSeenIds] = useState(new Set()); // ids já enviados nesta sessão

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const wasAtBottomRef = useRef(true);

  // restaura/persiste filtro e quantidade
  useEffect(() => {
    const savedType = typeof window !== "undefined" ? localStorage.getItem("ak_chat_type") : null;
    if (savedType === "anime" || savedType === "manga" || savedType === "all") setTypeFilter(savedType);
    const savedCount = parseInt((typeof window !== "undefined" ? localStorage.getItem("ak_chat_count") : "3") || "3", 10);
    if (Number.isFinite(savedCount)) setCount(Math.max(1, Math.min(12, savedCount)));
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("ak_chat_type", typeFilter);
  }, [typeFilter]);
  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("ak_chat_count", String(count));
  }, [count]);

  // detecta se usuário está perto do fim para decidir auto scroll
  const onScrollContainer = () => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const threshold = 32;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - threshold;
    wasAtBottomRef.current = atBottom;
  };

  const scrollToBottomIfNeeded = useCallback(() => {
    if (!isOpen) return;
    if (wasAtBottomRef.current) {
      // só rola se usuário já estava no final
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 60);
    }
  }, [isOpen]);

  // auto-scroll quando chegam novas mensagens
  useEffect(() => {
    scrollToBottomIfNeeded();
  }, [messages, isOpen, scrollToBottomIfNeeded]);

  // foco ao abrir e inicializa "no fundo"
  useEffect(() => {
    if (!isOpen) return;
    setTimeout(() => {
      inputRef.current?.focus();
      wasAtBottomRef.current = true;
      messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
    }, 50);
  }, [isOpen]);

  const handleToggle = () => setIsOpen((p) => !p);

  const handleSubmit = async (event) => {
    event?.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed || isLoading) return;

    // deixa o usuário dizer a quantidade na própria mensagem
    const msgCount = extractDesiredCount(trimmed);
    const desired = msgCount ?? count;

    const userMessage = { id: `user-${Date.now()}`, role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const payload = { message: trimmed };
      if (typeFilter !== "all") payload.type = typeFilter;
      payload.count = desired;
      payload.excludeIds = Array.from(seenIds); // evita repetidos na API

      const response = await fetch("/api/recomendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Falha ao buscar recomendações.");

      const data = await response.json();

      // registra ids vistos para próximas consultas
      const newIds = new Set(seenIds);
      (data.results ?? []).forEach((it) => newIds.add(String(it.mal_id ?? it.id)));
      setSeenIds(newIds);

      const served = data?.query?.served ?? (data.results?.length ?? 0);
      const botMessage = {
        id: `bot-${Date.now()}`,
        role: "bot",
        text: formatResultsMessage(data.results, served, desired),
        results: data.results ?? [],
        query: data.query,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const botMessage = {
        id: `bot-error-${Date.now()}`,
        role: "bot",
        text:
          error instanceof Error
            ? `${error.message} Tente novamente em instantes.`
            : "Algo inesperado aconteceu. Por favor, tente novamente.",
        results: [],
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Ctrl+Enter envia
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleSubmit();
  };

  const typeLabel = useMemo(() => {
    const option = TYPE_OPTIONS.find((item) => item.value === typeFilter);
    return option ? option.label.toLowerCase() : "tudo";
  }, [typeFilter]);

  const isSendDisabled = isLoading || inputValue.trim().length === 0;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end space-y-3">
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        className="flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-base font-semibold text-white shadow-lg transition hover:bg-indigo-500"
      >
        <span>{isOpen ? "Fechar" : "Abrir"} Chatbot</span>
        <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs capitalize">
          {typeLabel}
        </span>
      </button>

      {isOpen && (
        <div
          className="flex w-[28rem] max-w-[94vw] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
          role="dialog"
          aria-label="Recomendador AkiraHub"
        >
          <header className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Recomendador AkiraHub</h2>
              <p className="text-[13px] text-slate-600">
                Diga seus gêneros favoritos que eu sugiro algo pra você.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                className="rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-700 shadow-sm"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                aria-label="Filtrar por tipo"
              >
                {TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {/* seletor de quantidade (1..12) */}
              <input
                type="number"
                min={1}
                max={12}
                value={count}
                onChange={(e) => setCount(Math.max(1, Math.min(12, Number(e.target.value) || 1)))}
                className="w-14 rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-700 shadow-sm"
                title="Quantidade de recomendações (1–12)"
              />
            </div>
          </header>

          <div
            ref={messagesContainerRef}
            onScroll={onScrollContainer}
            className="max-h-[70vh] overscroll-contain space-y-4 overflow-y-auto px-5 py-4 text-[15px] leading-relaxed"
            aria-live="polite"
          >
            {messages.map((message) => {
              const suggestionsCount = message.results?.length ?? 0;
              return (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                      message.role === "user" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-900"
                    }`}
                  >
                    <p className="whitespace-pre-line">{message.text}</p>

                    {message.results && suggestionsCount > 0 && (
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Sugestões</p>
                          <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] text-slate-600">
                            {suggestionsCount}
                          </span>
                        </div>

                        <ul className="space-y-2 text-[13px]">
                          {message.results.map((item) => {
                            const workId = item.mal_id ?? item.id;
                            const href = `/obra/${item.type}/${workId}`;
                            const img = item.imageUrl ?? item.large_image_url ?? item.image ?? null;

                            return (
                              <li key={`${message.id}-${item.id}`}>
                                <Link
                                  href={href}
                                  className="group flex gap-3 rounded-lg bg-white/60 p-2.5 text-left text-slate-800 shadow transition hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                  aria-label={`Abrir página de ${item.type === "anime" ? "anime" : "mangá"} ${item.title}`}
                                >
                                  {img && (
                                    <Image
                                      src={img}
                                      alt={item.title}
                                      width={56}
                                      height={80}
                                      className="h-20 w-14 flex-shrink-0 rounded-md object-cover"
                                    />
                                  )}
                                  <div className="min-w-0">
                                    <p className="truncate font-semibold group-hover:underline">{item.title}</p>
                                    <p className="text-[12px] text-slate-500">
                                      {item.type === "anime" ? "Anime" : "Mangá"} · Ano: {item.year ?? "—"} · Score{" "}
                                      {item.score?.toFixed?.(2) ?? "—"}
                                    </p>
                                    {item.genres?.length > 0 && (
                                      <p className="text-[12px] text-slate-500">Gêneros: {item.genres.join(", ")}</p>
                                    )}
                                  </div>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-slate-100 px-3 py-2 text-[14px] text-slate-600">
                  Buscando recomendações...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="border-t border-slate-200 bg-white p-4">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                rows={2}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleSubmit(); }}
                placeholder="Ex.: 5 recomendações de romance e drama, sem ação"
                className="h-20 flex-1 resize-none rounded-xl border border-slate-300 px-3 py-2 text-[15px] text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                aria-label="Mensagem ao recomendador"
              />
              <button
                type="submit"
                disabled={isLoading || inputValue.trim().length === 0}
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-400"
                title={inputValue.trim().length === 0 ? "Digite uma mensagem" : "Enviar"}
              >
                {isLoading ? "Enviando" : "Enviar"}
              </button>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Dica: diga “3 recomendações” (1–12) ou ajuste no seletor. Use Ctrl/⌘+Enter para enviar.
            </p>
          </form>
        </div>
      )}
    </div>
  );
}
