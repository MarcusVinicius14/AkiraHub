"use client";
import { useEffect, useState, useMemo } from "react";



export default function CommentsSection({ identifier }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState(null);
  const [replyContent, setReplyContent] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);

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
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          if (data.username) setUsername(data.username);
        }
      } catch (err) {
        console.error('Erro ao buscar perfil', err);
      }
    }
    fetchProfile();
  }, []);

  async function handleSubmit(e, parentId = null) {
    e.preventDefault();
    const text = parentId ? replyContent[parentId] : content;
    if (!text || !text.trim()) return;
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        const err = await res.json();
        console.error('Erro ao enviar comentário', err);
        return;
      }
      const data = await res.json();
      setComments([data, ...comments]);
      if (parentId) {
        setReplyContent({ ...replyContent, [parentId]: '' });
        setReplyingTo(null);
      } else {
        setContent('');
      }
    } catch (err) {
      console.error('Erro inesperado ao enviar comentário', err);
    }
  }

  function CommentItem({ comment }) {
    const replies = repliesByParent[comment.id] || [];
    return (
      <div className="flex space-x-3">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0 overflow-hidden">
          {comment.avatar_url && (
            <img src={comment.avatar_url} alt="avatar" className="w-full h-full object-cover" />
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
            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
            className="text-xs text-blue-600 mt-1"
          >
            Responder
          </button>
          {replyingTo === comment.id && (
            <form onSubmit={(e) => handleSubmit(e, comment.id)} className="mt-2 space-y-2">
              <textarea
                value={replyContent[comment.id] || ''}
                onChange={(e) =>
                  setReplyContent({ ...replyContent, [comment.id]: e.target.value })
                }
                className="w-full border rounded p-2 text-sm"
                rows={2}
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-3 py-1 rounded text-xs disabled:opacity-50"
                  disabled={!replyContent[comment.id] || !replyContent[comment.id].trim()}
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

  return (
    <div className="mt-4">
      <form onSubmit={handleSubmit} className="mb-6">
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
