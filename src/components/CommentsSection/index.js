"use client";
import { useEffect, useState } from "react";


export default function CommentsSection({ identifier }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch(`/api/comments?identifier=${identifier}`);
        if (!res.ok) {
          const err = await res.json();
          console.error("Erro ao carregar comentários", err);
          return;
        }
        const data = await res.json();
        setComments(data || []);
      } catch (err) {
        console.error("Erro inesperado ao carregar comentários", err);
      }
    }
    fetchComments();
  }, [identifier]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, username: username || null, content }),
      });
      if (!res.ok) {
        const err = await res.json();
        console.error('Erro ao enviar comentário', err);
        return;
      }
      const data = await res.json();
      setComments([data, ...comments]);
      setContent('');
    } catch (err) {
      console.error('Erro inesperado ao enviar comentário', err);
    }
  }

  return (
    <div className="mt-4">
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex space-x-3 mb-2">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <input
              type="text"
              placeholder="Seu nome"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border rounded p-2 text-sm"
            />
            <textarea
              placeholder="Escreva um comentário"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border rounded p-2 text-sm"
              rows={3}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={!content.trim()}
          >
            Comentar
          </button>
        </div>
      </form>
      <div className="space-y-6">
        {comments.length === 0 && (
          <p className="text-gray-600">Seja o primeiro a comentar!</p>
        )}
        {comments.map((comment) => (
          <div key={comment.id} className="flex space-x-3 border-t pt-4">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-sm">
                {comment.username || "Anônimo"}
                <span className="ml-2 text-xs text-gray-500">
                  {new Date(comment.created_at).toLocaleString()}
                </span>
              </p>
              <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
