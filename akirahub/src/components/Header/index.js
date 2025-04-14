import React, { useState } from "react";

const Header = () => {
  const [selectedCategory, setSelectedCategory] = useState("Shonen");
  const categories = ["Shonen", "Seinen", "Shoujo", "Josei", "Isekai"];

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center">
        <div className="relative">
          <button
            className="flex items-center px-4 py-2 bg-gray-100 rounded-md"
            onClick={() =>
              document.getElementById("dropdown").classList.toggle("hidden")
            }
          >
            {selectedCategory}
            <svg
              className="w-4 h-4 ml-2"
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
          </button>

          <div
            id="dropdown"
            className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg hidden"
          >
            {categories.map((category) => (
              <button
                key={category}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  setSelectedCategory(category);
                  document.getElementById("dropdown").classList.add("hidden");
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="ml-4 flex-grow">
          <div className="relative">
            <input
              type="text"
              placeholder="Pesquisar Obra"
              className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-100"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
