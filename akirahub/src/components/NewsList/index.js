import React from "react";
import NewsCard from "../../components/NewsCard";

const NewsList = () => {
  const news = [
    {
      id: 1,
      title: "Demon slayer anuncia filme para 2025",
      image: "/demon-slayer.svg",
    },
  ];

  return (
    <div className="space-y-4">
      {news.map((item) => (
        <NewsCard key={item.id} news={item} />
      ))}
    </div>
  );
};

export default NewsList;
