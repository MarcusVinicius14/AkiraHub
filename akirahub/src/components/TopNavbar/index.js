import React from "react";
import Image from "next/image";

const TopNavbar = () => {
  return (
    <nav className="bg-white py-3 px-6 flex items-center justify-between  shadow-sm">
      <div className="flex items-center">
        <h1 className="font-bold text-xl mr-2">ハブ</h1>
        <span className="font-medium">Akira Hub</span>
      </div>

      <div className="flex space-x-4">
        <button className="bg-gray-100 px-8 py-2 rounded-md font-medium">
          Anime
        </button>
        <button className="px-8 py-2 rounded-md font-medium">Manga</button>
      </div>

      <div className="flex items-center">
        <button className="mr-4">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            ></path>
          </svg>
        </button>
        <div className="flex items-center">
          <div className="mr-2 text-right">
            <div className="text-sm font-medium">Marcus Adm</div>
            <div className="text-xs text-gray-500">Português - BR</div>
          </div>
          <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
            <Image
              src="/api/placeholder/32/32"
              alt="User profile"
              width={32}
              height={32}
              className="object-cover"
            />
          </div>
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
