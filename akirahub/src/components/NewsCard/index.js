import React from "react";
import Image from "next/image";

const NewsCard = ({ news }) => {
  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden">
      <div className="w-full h-40 relative">
        <Image
          src={news.image}
          alt={news.title}
          width={400}
          height={200}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm">{news.title}</h3>
      </div>
    </div>
  );
};

export default NewsCard;
