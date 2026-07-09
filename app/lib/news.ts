// =============================================================
// Loader de notícias — puxa as notícias e imagens REAIS ao vivo
// =============================================================
// Fonte padrão: portal WordPress (hojemt.com.br) via API REST pública
// `/wp-json/wp/v2/posts?_embed`. Em produção (Cloud Run) o app alcança o
// portal e mostra sempre as últimas notícias com as fotos reais.
// Configure outra fonte com a env `NEXT_PUBLIC_NEWS_SOURCE`.
//
// A busca é feita no servidor (Server Component), então não há problema de
// CORS e as imagens vêm direto do portal. Revalida a cada 10 minutos
// (`revalidate: 600`) para manter "sempre" atualizado sem refazer a cada hit.
// Se a fonte estiver indisponível, cai no conjunto embutido (FALLBACK_NEWS).

export type NewsItem = {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  image: string;
  date: string;
  category?: string;
  urgent?: boolean;
};

const SOURCE = (process.env.NEXT_PUBLIC_NEWS_SOURCE || "https://hojemt.com.br").replace(/\/$/, "");
const COUNT = 5;
const REVALIDATE_SECONDS = 600;

function decodeEntities(s: string): string {
  return s
    .replace(/<[^>]*>/g, "")
    .replace(/&#8230;|&hellip;/g, "…")
    .replace(/&#8217;|&rsquo;/g, "’")
    .replace(/&#8216;|&lsquo;/g, "‘")
    .replace(/&#8220;|&ldquo;/g, "“")
    .replace(/&#8221;|&rdquo;/g, "”")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function mapPost(p: any): NewsItem | null {
  if (!p) return null;
  const media = p._embedded?.["wp:featuredmedia"]?.[0];
  const sizes = media?.media_details?.sizes;
  const image =
    sizes?.large?.source_url ||
    sizes?.medium_large?.source_url ||
    media?.source_url ||
    FALLBACK_IMAGE;

  const terms: any[] = Array.isArray(p._embedded?.["wp:term"])
    ? p._embedded["wp:term"].flat()
    : [];
  const category = terms.find((t) => t?.taxonomy === "category")?.name;

  const title = decodeEntities(p.title?.rendered ?? "");
  if (!title) return null;

  return {
    id: String(p.id ?? p.slug ?? title),
    title,
    excerpt: decodeEntities(p.excerpt?.rendered ?? "").slice(0, 180),
    url: typeof p.link === "string" ? p.link : SOURCE,
    image,
    date: p.date_gmt ? `${p.date_gmt}Z` : p.date ?? new Date().toISOString(),
    category,
    urgent: Boolean(p.sticky),
  };
}

export async function getLatestNews(): Promise<NewsItem[]> {
  try {
    const res = await fetch(
      `${SOURCE}/wp-json/wp/v2/posts?per_page=${COUNT}&_embed=1`,
      {
        next: { revalidate: REVALIDATE_SECONDS },
        headers: { "User-Agent": "ComentaPlatform/1.0 (+news-carousel)" },
      }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const posts = await res.json();
    const items = (Array.isArray(posts) ? posts : [])
      .map(mapPost)
      .filter((x): x is NewsItem => Boolean(x));
    if (items.length) return items;
    throw new Error("resposta vazia");
  } catch {
    // Offline / fonte bloqueada / erro de rede -> conteúdo embutido.
    return FALLBACK_NEWS;
  }
}

// ------------------------------------------------------------------
// Fallback local, autossuficiente (sem rede). Usado quando a fonte de
// notícias não está acessível. Capas em SVG (data URI) para não depender
// de rede no fallback; em produção as imagens reais substituem estas.
// ------------------------------------------------------------------
function cover(label: string, from: string, to: string): string {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='675'>` +
    `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>` +
    `<stop offset='0%' stop-color='${from}'/><stop offset='100%' stop-color='${to}'/>` +
    `</linearGradient></defs>` +
    `<rect width='1200' height='675' fill='url(#g)'/>` +
    `<text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' ` +
    `font-family='system-ui, -apple-system, Segoe UI, Roboto, Arial' font-size='34' ` +
    `fill='white' opacity='0.85'>${label}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const FALLBACK_IMAGE = cover("Imagem indisponível", "#94a3b8", "#cbd5e1");

export const FALLBACK_NEWS: NewsItem[] = [
  {
    id: "fb-1",
    title: "Portal de notícias em tempo real",
    excerpt:
      "As manchetes mais recentes aparecem aqui automaticamente assim que o portal estiver acessível.",
    url: SOURCE,
    image: cover("Últimas notícias", "#0ea5e9", "#2563eb"),
    date: new Date().toISOString(),
    category: "Geral",
    urgent: true,
  },
  {
    id: "fb-2",
    title: "Cobertura regional atualizada minuto a minuto",
    excerpt:
      "Economia, cidades, saúde e esporte — tudo em um só lugar, com fotos reais das reportagens.",
    url: SOURCE,
    image: cover("Cidades", "#10b981", "#059669"),
    date: new Date().toISOString(),
    category: "Cidades",
  },
  {
    id: "fb-3",
    title: "Acompanhe as transmissões ao vivo",
    excerpt:
      "Programas e coberturas especiais direto da redação, com atualização contínua.",
    url: SOURCE,
    image: cover("Ao vivo", "#f472b6", "#db2777"),
    date: new Date().toISOString(),
    category: "Ao vivo",
  },
  {
    id: "fb-4",
    title: "Serviço e utilidade pública",
    excerpt:
      "Campanhas, mutirões e informações essenciais para a população da região.",
    url: SOURCE,
    image: cover("Serviço", "#f59e0b", "#d97706"),
    date: new Date().toISOString(),
    category: "Serviço",
  },
];
