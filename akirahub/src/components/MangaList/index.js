import React from "react";
import MangaCard from "../../components/MangaCard";

const MangaList = () => {
  const mangas = [
    {
      id: 1,
      title: "Solo Leveling",
      chapters: 270,
      rating: 4.8,
      comments: 340,
      image: "/sololeveling.svg",
    },
    {
      id: 2,
      title: "Naruto",
      chapters: 700,
      rating: 4.9,
      comments: 830,
      image: "/naruto.svg",
    },
    {
      id: 3,
      title: "Akira",
      chapters: 120,
      rating: 4.9,
      comments: 123,
      image: "/akira.svg",
    },
    {
      id: 4,
      title: "Berserk",
      chapters: 372,
      rating: 4.8,
      comments: 634,
      image: "/berserk.svg",
    },
    {
      id: 5,
      title: "Vagabond",
      chapters: 327,
      rating: 5.0,
      comments: 288,
      image: "/vagabond.svg",
    },
    {
      id: 6,
      title: "Ajin",
      chapters: 86,
      rating: 4.7,
      comments: 98,
      image: "/ajin.svg",
    },
  ];

  return (
    <div className="space-y-4">
      {mangas.map((manga) => (
        <MangaCard key={manga.id} manga={manga} />
      ))}
    </div>
  );
};

export default MangaList;
