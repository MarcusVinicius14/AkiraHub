"use client";
import TopNavbar from "@/components/TopNavbar";
import Header from "@/components/Header";

export default function AboutPage() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <TopNavbar />
      <Header />
      <main className="flex-grow container mx-auto p-4 flex flex-col items-center">
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-3xl space-y-6">
          <h1 className="text-3xl font-bold text-center">Sobre o AkiraHub</h1>
          <p>
            O <strong>AkiraHub</strong> é uma plataforma dedicada aos amantes de
            animes e mangás. Aqui reunimos novidades, listas de obras e um espaço
            para a comunidade comentar e compartilhar suas experiências.
          </p>
          <section>
            <h2 className="text-2xl font-semibold mb-2">Nossa missão</h2>
            <p>
              Facilitar o acesso a conteúdo de qualidade sobre cultura pop japonesa,
              proporcionando um ambiente acolhedor para fãs discutirem e descobrirem
              novas obras.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-2">Nossa visão</h2>
            <p>
              Tornar-se a principal referência nacional em curadoria de animes e
              mangás, conectando criadores, leitores e espectadores em um só lugar.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-2">O que oferecemos</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Catálogo sempre atualizado de animes e mangás.</li>
              <li>Área de notícias para ficar por dentro das novidades.</li>
              <li>Ferramentas de perfil para personalizar suas preferências.</li>
              <li>Seção de comentários para interagir com outros usuários.</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
