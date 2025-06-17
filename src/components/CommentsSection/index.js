"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function CommentsSection({ identifier }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    async function fetchComments() {
      const { data, error } = await supabase
        .from("comments")
        .select("id, username, content, created_at")
        .eq("identifier", identifier)
        .order("created_at", { ascending: false });
      if (!error) {
        setComments(data || []);
      } else {
        console.error("Erro ao carregar comentários", error);
      }
    }
    fetchComments();
  }, [identifier]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim()) return;
    const { data, error } = await supabase.from("comments").insert({
      identifier,
      username: username || null,
      content,
    });
    if (error) {
      console.error("Erro ao enviar comentário", error);
      return;
    }
    setComments([{ ...data[0] }, ...comments]);
    setContent("");
  }

  return (
    <div className="mt-4">
      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        <input
          type="text"
          placeholder="Seu nome"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border rounded p-2"
        />
        <textarea
          placeholder="Escreva um comentário"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border rounded p-2"
          rows={3}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={!content.trim()}
        >
          Comentar
        </button>
      </form>
      <div className="space-y-4">
        {comments.length === 0 && (
          <p className="text-gray-600">Seja o primeiro a comentar!</p>
        )}
        {comments.map((comment) => (
          <div key={comment.id} className="border-t pt-2">
            <p className="font-semibold">
              {comment.username || "Anônimo"}
              <span className="ml-2 text-xs text-gray-500">
                {new Date(comment.created_at).toLocaleString()}
              </span>
            </p>
            <p>{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
