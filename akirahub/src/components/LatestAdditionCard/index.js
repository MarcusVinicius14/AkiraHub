import React from "react";
import Image from "next/image";

const LatestAdditionCard = ({ item, type }) => {
  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden">
      <div className="w-full h-32 relative">
        <Image
          src={item.image}
          alt={item.title}
          width={200}
          height={150}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="p-2">
        <h3 className="font-medium text-xs">{item.title}</h3>
        {type === "anime" && (
          <p className="text-xs text-gray-600">{item.episodes} episodios</p>
        )}
        <div className="flex items-center mt-1">
          <span className="text-xs font-medium">{item.rating}</span>
          <svg
            className="w-3 h-3 text-yellow-400 ml-1"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default LatestAdditionCard;
