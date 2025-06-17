"use client";
import { DiscussionEmbed } from "disqus-react";
import { useEffect, useState } from "react";

export default function DisqusComments({ identifier, title }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUrl(window.location.href);
    }
  }, []);

  const shortname = process.env.NEXT_PUBLIC_DISQUS_SHORTNAME || "example";
  const config = {
    url,
    identifier,
    title,
  };

  return (
    <div className="mt-8">
      <DiscussionEmbed shortname={shortname} config={config} />
    </div>
  );
}
