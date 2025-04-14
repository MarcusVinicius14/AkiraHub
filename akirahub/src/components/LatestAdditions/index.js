import React from "react";
import LatestAdditionCard from "../../components/LatestAdditionCard";

const LatestAdditions = ({ type }) => {
  const animes = [
    {
      id: 1,
      title: "Fire Force III",
      episodes: 12,
      rating: 4.6,
      image: "/fireforce.svg",
    },
    {
      id: 2,
      title: "Lazarus",
      episodes: 13,
      rating: 4.3,
      image: "/lazarus.svg",
    },
  ];

  const mangas = [
    {
      id: 1,
      title: "Elden Ring Volume 8",
      rating: 4.7,
      image: "/eldenring.svg",
    },
    {
      id: 2,
      title: "Kaiju nº8 Volume 8",
      rating: 4.9,
      image: "/kaiju.svg",
    },
  ];

  const items = type === "anime" ? animes : mangas;

  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((item) => (
        <LatestAdditionCard key={item.id} item={item} type={type} />
      ))}
    </div>
  );
};

export default LatestAdditions;
