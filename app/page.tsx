import React from "react";
import NewsCarousel from "./components/NewsCarousel";
import { getLatestNews } from "./lib/news";

// Server Component: carrega as últimas notícias (com imagens reais) no
// servidor e passa para o carrossel do hero. Revalida periodicamente,
// então o hero fica "sempre" com as manchetes mais novas do portal.
export const revalidate = 600;

export default async function HomePage() {
  const news = await getLatestNews();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <header className="sticky top-0 z-30 backdrop-blur border-b bg-white/70 border-slate-200/60">
        <div className="container mx-auto px-4 max-w-6xl h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-white font-bold">
              HP
            </span>
            <span className="font-semibold">Hebert Paes</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 max-w-6xl py-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <section className="space-y-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Plataforma pessoal{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-500">
              Hebert Paes
            </span>
          </h1>
          <p className="text-slate-600 max-w-prose">
            Next.js no Cloud Run, com Firestore, autenticação segura e Blog
            otimizado para SEO e crawlers de LLMs.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {[
              "Cloud Run + SSL gerenciado",
              "Firestore (ADC)",
              "CI/CD GitHub Actions",
              "Cache via Cloudflare",
            ].map((t) => (
              <div
                key={t}
                className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 bg-white/80"
              >
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />{" "}
                {t}
              </div>
            ))}
          </div>
        </section>

        {/* Carrossel de notícias (imagens reais, sempre atualizado) */}
        <section aria-label="Últimas notícias" className="w-full">
          <NewsCarousel items={news} />
        </section>
      </main>

      <footer className="border-t border-slate-200">
        <div className="container mx-auto px-4 max-w-6xl py-8 text-sm text-slate-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Hebert Paes · Cloud Run · Firestore</p>
          <div className="flex items-center gap-4">
            <span>Sitemap</span>
            <span>Robots</span>
            <span>RSS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
