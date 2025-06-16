// components/SideBar.jsx
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function SideBar({ isOpen, onClose }) {
  // Previne rolagem quando o menu está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay transparente - apenas para capturar cliques fora do menu */}
      {isOpen && <div className="fixed inset-0 z-40" onClick={onClose} />}

      {/* Side Menu */}
      <div
        className={`fixed top-0 right-0 w-1/6 min-w-64 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-5 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src="/profileimage.svg"
                  alt="Profile"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-sm font-medium">Username</div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
        <nav className="mt-2">
          <ul>
            <li>
              <Link
                href="/profile"
                className="block px-5 py-4 hover:bg-gray-100 active:bg-gray-200 border-b border-gray-100"
              >
                Perfil
              </Link>
            </li>
            <li>
              <Link
                href="/settings"
                className="block px-5 py-4 hover:bg-gray-100 active:bg-gray-200 border-b border-gray-100"
              >
                Configurações
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="block px-5 py-4 hover:bg-gray-100 active:bg-gray-200 border-b border-gray-100"
              >
                Sobre
              </Link>
            </li>
            <li>
              <Link
                href="/favorites"
                className="block px-5 py-4 hover:bg-gray-100 active:bg-gray-200 border-b border-gray-100"
              >
                Favoritos
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
