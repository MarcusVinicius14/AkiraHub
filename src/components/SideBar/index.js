// components/SideBar.jsx

// --- PASSO 1: Importar o hook useSession ---
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

// --- PASSO 2: Aceitar a prop `onSignOut` ---
export default function SideBar({ isOpen, onClose, onSignOut }) {
  // --- PASSO 3: Usar os dados da sessão do NextAuth ---
  // Isso substitui a necessidade de buscar o perfil manualmente
  const { data: session } = useSession();

  // O useEffect para controlar a rolagem da página continua o mesmo
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

  // O useEffect para buscar o perfil foi REMOVIDO, pois não é mais necessário.

  return (
    <>
      {/* Overlay */}
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
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                {/* --- PASSO 4: Usar a imagem da sessão --- */}
                {session?.user?.image && (
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="text-sm font-medium">
                {/* --- PASSO 4: Usar o nome da sessão --- */}
                {session?.user?.name || "Username"}
              </div>
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
        <nav className="mt-2 flex flex-col h-[calc(100%-100px)]">
          <ul className="flex-grow">
            {/* ... seus outros links ... */}
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
            {/* ... etc ... */}
          </ul>

          {/* --- PASSO 5: Adicionar o botão de Sair --- */}
          <div className="p-5 border-t border-gray-100">
            <button
              onClick={onSignOut}
              className="w-full flex items-center justify-center px-4 py-2 bg-red-500 text-white font-medium rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sair
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}
