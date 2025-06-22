"use client";
import { useEffect, useState, useMemo, useRef } from "react";

export default function CommentsSection({ identifier }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const replyRef = useRef(null);

  // callback ref: foca e posiciona cursor só quando o textarea aparece
  const setReplyRef = (el) => {
    replyRef.current = el;
    if (el) {
      const len = el.value.length;
      el.focus();
      el.setSelectionRange(len, len);
    }
  };

  // busca comentários iniciais
  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch(`/api/comments?identifier=${identifier}`);
        if (!res.ok) {
          console.error("Erro ao carregar comentários", await res.json());
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

  // agrupa respostas por parent_id
  const repliesByParent = useMemo(() => {
    const map = {};
    comments.forEach((c) => {
      if (c.parent_id) {
        if (!map[c.parent_id]) map[c.parent_id] = [];
        map[c.parent_id].push(c);
      }
    });
    return map;
  }, [comments]);

  // busca perfil do usuário
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          if (data.username) setUsername(data.username);
        }
      } catch (err) {
        console.error("Erro ao buscar perfil", err);
      }
    }
    fetchProfile();
  }, []);

  // envia comentário ou resposta
  async function handleSubmit(e, parentId = null) {
    e.preventDefault();
    const text = parentId ? replyText : content;
    if (!text.trim()) return;

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier,
          profile_id: profile?.id || null,
          username: username || profile?.username || null,
          avatar_url: profile?.avatar_url || null,
          content: text,
          parent_id: parentId,
        }),
      });
      if (!res.ok) {
        console.error("Erro ao enviar comentário", await res.json());
        return;
      }
      const data = await res.json();
      setComments([data, ...comments]);
      if (parentId) {
        setReplyText("");
        setReplyingTo(null);
      } else {
        setContent("");
      }
    } catch (err) {
      console.error("Erro inesperado ao enviar comentário", err);
    }
  }

  // renderiza um comentário (e suas respostas recursivamente)
  function CommentItem({ comment }) {
    const replies = repliesByParent[comment.id] || [];

    return (
      <div className="flex space-x-3">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0 overflow-hidden">
          {comment.avatar_url && (
            <img
              src={comment.avatar_url}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm">
            {comment.username || "Anônimo"}
            <span className="ml-2 text-xs text-gray-500">
              {new Date(comment.created_at).toLocaleString()}
            </span>
          </p>
          <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
          <button
            onClick={() => {
              setReplyingTo(replyingTo === comment.id ? null : comment.id);
              setReplyText("");
            }}
            className="text-xs text-blue-600 mt-1 cursor-pointer hover:underline"
          >
            Responder
          </button>

          {replyingTo === comment.id && (
            <form
              onSubmit={(e) => handleSubmit(e, comment.id)}
              className="mt-2 space-y-2"
            >
              <textarea
                ref={setReplyRef}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full border rounded p-2 text-sm"
                rows={2}
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-3 py-1 rounded text-xs disabled:opacity-50 cursor-pointer hover:bg-blue-600"
                  disabled={!replyText.trim()}
                >
                  Enviar
                </button>
              </div>
            </form>
          )}

          {replies.length > 0 && (
            <div className="mt-4 ml-6 space-y-4">
              {replies.map((r) => (
                <CommentItem key={r.id} comment={r} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // JSX principal
  return (
    <div className="mt-4">
      <form onSubmit={(e) => handleSubmit(e, null)} className="mb-6">
        <div className="flex space-x-3 mb-2">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0 overflow-hidden">
            {profile?.avatar_url && (
              <img
                src={profile.avatar_url}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="flex-1 space-y-2">
            {!profile?.username && (
              <input
                type="text"
                placeholder="Seu nome"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border rounded p-2 text-sm"
              />
            )}
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
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50 cursor-pointer hover:bg-blue-600"
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
        {comments
          .filter((c) => !c.parent_id)
          .map((comment) => (
            <div key={comment.id} className="border-t pt-4">
              <CommentItem comment={comment} />
            </div>
          ))}
      </div>
    </div>
  );
}
