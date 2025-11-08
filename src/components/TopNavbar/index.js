import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SideBar from "../SideBar";
// --- PASSO 1: Importar os hooks e funções do NextAuth.js ---
import { useSession, signIn, signOut } from "next-auth/react";

const TopNavbar = () => {
  const [sideBarOpen, setSideBarOpen] = useState(false);

  // --- PASSO 2: Obter os dados da sessão ---
  // `data: session` renomeia `data` para `session` para clareza.
  // `status` pode ser 'loading', 'authenticated', ou 'unauthenticated'.
  const { data: session, status } = useSession();

  // Determina se o usuário está logado com base na presença da sessão.
  const isLoggedIn = !!session;

  const toggleSideBar = () => {
    if (!isLoggedIn) return;
    setSideBarOpen(!sideBarOpen);
  };

  const closeSideBar = () => {
    setSideBarOpen(false);
  };

  return (
    <nav className="bg-white py-3 px-6 flex items-center justify-between shadow-sm">
      <Link
        href={"/"}
        className="flex items-center hover:bg-gray-100 active:bg-gray-200 cursor-pointer rounded-sm pl-2 pr-2"
      >
        <h1 className="font-bold text-xl mr-2">ハブ</h1>
        <span className="font-medium">Akira Hub</span>
      </Link>

      <div className="flex space-x-4">
        {/* Links públicos */}
        <Link
          href={"/anime"}
          className="hover:bg-gray-100 active:bg-gray-200 cursor-pointer px-8 py-2 rounded-md font-medium"
        >
          Anime
        </Link>
        <Link
          href={"/manga"}
          className="px-8 py-2 rounded-md font-medium hover:bg-gray-100 active:bg-gray-200 cursor-pointer"
        >
          Manga
        </Link>

        {/* --- PASSO 3: Renderização Condicional baseada em `isLoggedIn` --- */}
        {isLoggedIn && (
          <>
            <Link
              href={"/favorites"}
              className="px-8 py-2 rounded-md font-medium hover:bg-gray-100 active:bg-gray-200 cursor-pointer"
            >
              Favoritos
            </Link>
            {/* <Link
              href={"/history"}
              className="px-8 py-2 rounded-md font-medium hover:bg-gray-100 active:bg-gray-200 cursor-pointer"
            >
              Histórico
            </Link> */}
          </>
        )}

        <Link
          href={"/about"}
          className="px-8 py-2 rounded-md font-medium hover:bg-gray-100 active:bg-gray-200 cursor-pointer"
        >
          Sobre
        </Link>
      </div>

      <div className="flex items-center">
        {/* Enquanto a sessão está carregando, podemos mostrar um placeholder ou nada */}
        {status !== "loading" && (
          <>
            {isLoggedIn ? (
              // Se logado, mostra o perfil do usuário
              <>
                {/* <button className="mr-4 hover:bg-gray-100 active:bg-gray-200 cursor-pointer rounded-sm">
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
                </button> */}
                <div
                  onClick={toggleSideBar}
                  className="flex items-center hover:bg-gray-100 active:bg-gray-200 cursor-pointer rounded-md p-1"
                >
                  <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                    {/* --- Usa a imagem da sessão do NextAuth.js --- */}
                    {session.user?.image && (
                      <Image
                        src={session.user.image}
                        alt="User profile"
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    )}
                  </div>
                  {/* --- Usa o nome da sessão do NextAuth.js --- */}
                  {session.user?.name && (
                    <span className="ml-2 text-sm font-medium">
                      {session.user.name}
                    </span>
                  )}
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
              </>
            ) : (
              // Se não logado, mostra o botão para entrar
              <button
                onClick={() => signIn()}
                className="px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600"
              >
                Entrar
              </button>
            )}
          </>
        )}
      </div>

      {/* A Sidebar deve receber a função signOut para que o usuário possa deslogar */}
      {isLoggedIn && (
        <SideBar
          isOpen={sideBarOpen}
          onClose={closeSideBar}
          onSignOut={() => signOut()}
        />
      )}
    </nav>
  );
};

export default TopNavbar;
