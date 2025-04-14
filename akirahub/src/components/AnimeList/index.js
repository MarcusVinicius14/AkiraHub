import React from "react";
import AnimeCard from "../../components/AnimeCard";

const AnimeList = () => {
  const animes = [
    {
      id: 1,
      title: "Jujutsu Kaisen",
      episodes: 24,
      rating: 4.9,
      comments: 63,
      image: "/jujutsu.svg",
    },
    {
      id: 2,
      title: "Tensei shitara slime",
      episodes: 48,
      rating: 4.6,
      comments: 32,
      image: "/tenseishitara.svg",
    },
    {
      id: 3,
      title: "Castelvania",
      episodes: 32,
      rating: 4.5,
      comments: 22,
      image: "/castelvania.svg",
    },
    {
      id: 4,
      title: "CyberPunk",
      episodes: 10,
      rating: 4.3,
      comments: 30,
      image: "/cyberpunk.svg",
    },
    {
      id: 5,
      title: "Cowboy Bebop",
      episodes: 26,
      rating: 5.0,
      comments: 78,
      image: "/cowboy.svg",
    },
    {
      id: 6,
      title: "Code Geass",
      episodes: 24,
      rating: 4.9,
      comments: 51,
      image: "/codegeass.svg",
    },
  ];

  return (
    <div className="space-y-4">
      {animes.map((anime) => (
        <AnimeCard key={anime.id} anime={anime} />
      ))}
    </div>
  );
};

export default AnimeList;
