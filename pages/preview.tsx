import React, { useState } from "react";

// =============================================================
// PREVIEW-ONLY FILE (safe to render here)
// =============================================================
// Este arquivo mostra uma PRÉVIA funcional do layout (Home + Auth + cards de blog)
// sem dependências do Next.js. Os handlers apenas simulam requisições.
// Ao final do arquivo há um BLOCO GRANDE comentado com os **arquivos reais**
// prontos para copiar no seu projeto Next.js (App Router), incluindo SEO, feeds e robots.

// ------------------------
// Dados fictícios p/ prévia
// ------------------------
// IMPORTANTE: usamos **apenas** estas 3 URLs fixas (mesmo domínio/paths)
// para conservar as permissões de imagens no preview.
// Para evitar prompts de permissão no preview, geramos imagens inline (data URL)
// Assim, o carregamento é "permitido" automaticamente (sem rede).
const STABLE_IMAGES = {
  hp1: `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450'>
       <defs><linearGradient id='g1' x1='0' x2='1'><stop offset='0%' stop-color='#a78bfa'/><stop offset='100%' stop-color='#60a5fa'/></linearGradient></defs>
       <rect width='800' height='450' fill='url(#g1)'/>
       <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial' font-size='28' fill='white' opacity='0.9'>HP • Banner 01</text>
     </svg>`
  )}`,
  hp2: `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450'>
       <defs><linearGradient id='g2' x1='0' x2='1'><stop offset='0%' stop-color='#34d399'/><stop offset='100%' stop-color='#10b981'/></linearGradient></defs>
       <rect width='800' height='450' fill='url(#g2)'/>
       <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial' font-size='28' fill='white' opacity='0.9'>HP • Banner 02</text>
     </svg>`
  )}`,
  hp3: `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450'>
       <defs><linearGradient id='g3' x1='0' x2='1'><stop offset='0%' stop-color='#f472b6'/><stop offset='100%' stop-color='#fb7185'/></linearGradient></defs>
       <rect width='800' height='450' fill='url(#g3)'/>
       <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial' font-size='28' fill='white' opacity='0.9'>HP • Banner 03</text>
     </svg>`
  )}`,
};

// Fallback local (sem rede) caso o preview negue acesso ou a imagem falhe
const PLACEHOLDER_DATA_URL = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450'>
     <defs><linearGradient id='g' x1='0' x2='1'><stop offset='0%' stop-color='#e2e8f0'/><stop offset='100%' stop-color='#f8fafc'/></linearGradient></defs>
     <rect width='800' height='450' fill='url(#g)'/>
     <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial' font-size='20' fill='#475569'>Prévia — imagem não carregada</text>
   </svg>`
)}`;

// UID helper para prévia (fallback se randomUUID não existir)
function uid(){
  try { const c: any = (globalThis as any).crypto; if (c?.randomUUID) return c.randomUUID(); } catch {}
  return Math.random().toString(36).slice(2);
}

const samplePosts = [
  { slug: "hello-world", title: "Hello World", excerpt: "Boas-vindas ao blog!", coverImage: STABLE_IMAGES.hp1, publishedAt: new Date().toISOString() },
  { slug: "cloud-run-next", title: "Cloud Run + Next.js", excerpt: "Rodando Next no Google Cloud Run.", coverImage: STABLE_IMAGES.hp2, publishedAt: new Date().toISOString() },
  { slug: "auth-firestore", title: "Auth + Firestore", excerpt: "Sessões seguras, rate limit e auditoria.", coverImage: STABLE_IMAGES.hp3, publishedAt: new Date().toISOString() },
];

// =========================
// PREVIEW: Home + Auth + Blog
// =========================
export default function PreviewHome() {
  const [dark, setDark] = React.useState(false);
  return (
    <div className={dark ? "dark-mode min-h-screen bg-slate-950 text-slate-100" : "min-h-screen bg-gradient-to-b from-white to-slate-50"}>
      <Header dark={dark} toggle={()=>setDark(v=>!v)} />
      <ContrastStyles />

      {/* Custom Cache Loading Banner (prévia) */}
      <CacheBanner />

      <main className="container mx-auto px-4 max-w-6xl py-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <Hero />
        <section id="acesso" className="w-full">
          <AuthPanel />
          <div className="mt-4">
            <CacheControls />
          </div>
        </section>
      </main>

      <section className="container mx-auto px-4 max-w-6xl py-10">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl font-bold">Últimos artigos</h2>
          <a href="#" className="text-sm underline" onClick={(e)=>e.preventDefault()}>Ver todos</a>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {samplePosts.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      </section>

      {/* ===== Chat AI (prévia) ===== */}
      <section id="chat" className="container mx-auto px-4 max-w-6xl py-10">
        <ChatPanel />
      </section>

      {/* ===== Administração (prévia) ===== */}
      <section id="admin" className="container mx-auto px-4 max-w-6xl py-12">
        <AdminPanel />
      </section>

      <Footer />
    </div>
  );
}

function Header({dark, toggle}:{dark:boolean; toggle:()=>void}) {
  return (
    <header className={`sticky top-0 z-30 backdrop-blur border-b ${dark ? "bg-slate-900/70 border-slate-800" : "bg-white/70 border-slate-200/60"}`}>
      <div className="container mx-auto px-4 max-w-6xl h-14 flex items-center justify-between">
        <a href="#" onClick={(e)=>e.preventDefault()} className="flex items-center gap-2 no-underline">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-white font-bold">HP</span>
          <span className="font-semibold">Hebert Paes</span>
        </a>
        <nav className="hidden sm:flex items-center gap-6 text-sm">
          <a href="#acesso" className="hover:opacity-80">Entrar / Cadastrar</a>
          <a href="#" onClick={(e)=>e.preventDefault()} className="hover:opacity-80">Blog</a>
          <a href="#admin" className="hover:opacity-80">Admin</a>
          <a href="#chat" className="hover:opacity-80">Chat</a>
          <button onClick={toggle} className="ml-2 rounded-full border px-3 py-1 text-xs">{dark ? '☀️ Claro' : '🌙 Escuro'}</button>
        </nav>
      </div>
    </header>
  );
}

function ContrastStyles(){
  return (
    <style>{`
      /* Text contrast */
      .dark-mode{color:#E5E7EB}
      .dark-mode .text-slate-600{color:#D6DEE9 !important}
      .dark-mode .text-slate-500{color:#B8C4D2 !important}
      .dark-mode .text-slate-400{color:#A7B4C3 !important}
      .dark-mode a{color:#E2E8F0}

      /* Cards & surfaces */
      .dark-mode .bg-white, .dark-mode .bg-slate-50{background:#0f172a !important}
      .dark-mode .bg-white\/80{background:rgba(15,23,42,.80) !important}
      .dark-mode .bg-white\/90{background:rgba(15,23,42,.90) !important}
      .dark-mode .border-slate-200{border-color:#334155 !important}
      .dark-mode .border-slate-300{border-color:#475569 !important}

      /* Inputs */
      .dark-mode input, .dark-mode select, .dark-mode textarea{
        background:#0b1220 !important;
        color:#E5E7EB !important;
        border-color:#475569 !important;
      }
      .dark-mode input::placeholder, .dark-mode textarea::placeholder{color:#9AA7B6 !important; opacity:1}

      /* Chat assistant bubble */
      .dark-mode .bg-white.border{background:#0f172a !important; border-color:#334155 !important}

      /* Hover tweaks */
      .dark-mode .hover\:bg-slate-50:hover{background:#111827 !important}

      /* Post date high-contrast */
      .dark-mode .post-date{color:#C8D2DF !important}
    `}</style>
  );
}

function Hero() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
        Plataforma pessoal <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-500">Hebert Paes</span>
      </h1>
      <p className="text-slate-600 max-w-prose">
        Next.js no Cloud Run, com Firestore, autenticação segura e Blog otimizado para SEO e crawlers de LLMs.
      </p>

      {/* Carrossel de notícias (prévia — dados fictícios; a versão real puxa o portal ao vivo) */}
      <PreviewNewsSlider />

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        {["Cloud Run + SSL gerenciado","Firestore (ADC)","CI/CD GitHub Actions","Cache via Cloudflare"].map(t => (
          <li key={t} className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 bg-white/80">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500"/> {t}
          </li>
        ))}
      </ul>
    </section>
  );
}

// Slider de notícias da prévia (autossuficiente, sem rede).
// Reflete o carrossel real (app/components/NewsCarousel.tsx), que em
// produção puxa as manchetes e imagens reais do portal via API REST.
const previewNews = [
  { id: "n1", title: "Mutirão de cirurgias atende 100 pacientes nesta semana", cat: "Saúde", urgent: true, img: STABLE_IMAGES.hp1 },
  { id: "n2", title: "Cobertura regional atualizada minuto a minuto", cat: "Cidades", urgent: false, img: STABLE_IMAGES.hp2 },
  { id: "n3", title: "Acompanhe as transmissões ao vivo da redação", cat: "Ao vivo", urgent: false, img: STABLE_IMAGES.hp3 },
];

function PreviewNewsSlider() {
  const [i, setI] = React.useState(0);
  const [playing, setPlaying] = React.useState(true);
  const hover = React.useRef(false);
  const n = previewNews.length;
  React.useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => { if (!hover.current) setI(v => (v + 1) % n); }, 6000);
    return () => clearInterval(t);
  }, [playing, n]);
  const cur = previewNews[i];
  return (
    <div
      className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xl"
      onMouseEnter={() => (hover.current = true)}
      onMouseLeave={() => (hover.current = false)}
    >
      <div className="relative" style={{ aspectRatio: "16 / 10", background: "#0f172a" }}>
        {previewNews.map((s, idx) => (
          <img key={s.id} src={s.img} alt={s.title}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            style={{ opacity: idx === i ? 1 : 0 }} />
        ))}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          {cur.urgent
            ? <span className="bg-slate-900 text-white text-[11px] font-extrabold tracking-wide px-2.5 py-1 rounded-md">URGENTE</span>
            : <span />}
          <div className="flex items-center gap-2">
            <button onClick={() => setPlaying(p => !p)} aria-label={playing ? "Pausar" : "Reproduzir"}
              className="h-8 w-8 rounded-full text-white text-xs inline-flex items-center justify-center"
              style={{ background: "rgba(15,23,42,.55)" }}>
              {playing ? "❚❚" : "►"}
            </button>
            <div className="flex items-center gap-2">
              {previewNews.map((s, idx) => (
                <button key={s.id} onClick={() => setI(idx)} aria-label={`Slide ${idx + 1}`}
                  className="h-3 w-3 rounded-full border-2 border-white"
                  style={{ background: idx === i ? "#34d399" : "transparent", borderColor: idx === i ? "#34d399" : "#fff" }} />
              ))}
            </div>
          </div>
        </div>
        <button onClick={() => setI(v => (v - 1 + n) % n)} aria-label="Anterior"
          className="absolute left-3 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full text-white text-2xl inline-flex items-center justify-center"
          style={{ background: "rgba(15,23,42,.55)" }}>‹</button>
        <button onClick={() => setI(v => (v + 1) % n)} aria-label="Próxima"
          className="absolute right-3 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full text-white text-2xl inline-flex items-center justify-center"
          style={{ background: "rgba(15,23,42,.55)" }}>›</button>
      </div>
      <div className="p-4">
        <span className="text-[11px] font-bold uppercase tracking-wide text-sky-600">{cur.cat}</span>
        <h3 className="mt-1 font-bold leading-tight" style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "clamp(18px,2vw,24px)" }}>
          {cur.title}
        </h3>
        <p className="mt-2 text-xs text-slate-500">Prévia — a versão publicada exibe as notícias e fotos reais do portal.</p>
      </div>
    </div>
  );
}

// ======= Cache UX (Prévia) =======
const CacheContext = React.createContext<{state: 'miss'|'hit'|'refresh', set:(s:'miss'|'hit'|'refresh')=>void}>({state:'hit', set: () => {}});

function CacheBanner() {
  const [state, setState] = React.useState<'miss'|'hit'|'refresh'>('hit');
  // Simula SWR: carrega do cache -> atualiza em background -> pronto
  React.useEffect(() => {
    // inicia como hit (conteúdo do cache)
    setState('hit');
    const t1 = setTimeout(() => setState('refresh'), 800); // atualizando…
    const t2 = setTimeout(() => setState('hit'), 1800);    // atualizado
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <CacheContext.Provider value={{state, set: setState}}>
      <div className="sticky top-14 z-20">
        {state === 'miss' && (
          <div className="animate-pulse bg-amber-50 border-b border-amber-200 text-amber-800">
            <div className="max-w-6xl mx-auto px-4 py-2 text-sm">Carregando do servidor (cache MISS)…</div>
          </div>
        )}
        {state === 'refresh' && (
          <div className="bg-blue-50 border-b border-blue-200 text-blue-800">
            <div className="max-w-6xl mx-auto px-4 py-2 text-sm">⚡ Conteúdo do cache exibido — atualizando em segundo plano…</div>
          </div>
        )}
        {state === 'hit' && (
          <div className="bg-emerald-50 border-b border-emerald-200 text-emerald-800">
            <div className="max-w-6xl mx-auto px-4 py-2 text-sm">✅ Conteúdo atendido pelo cache (atualizado)</div>
          </div>
        )}
      </div>
    </CacheContext.Provider>
  );
}

function CacheControls() {
  const ctx = React.useContext(CacheContext);
  return (
    <div className="rounded-xl border border-slate-200 bg-white/80 p-3 text-sm flex items-center gap-3">
      <span className="font-medium">Simular cache:</span>
      <button onClick={()=>ctx.set('miss')} className={`px-2 py-1 rounded-md border ${ctx.state==='miss'?'bg-amber-100 border-amber-300':'border-slate-200'}`}>MISS</button>
      <button onClick={()=>ctx.set('refresh')} className={`px-2 py-1 rounded-md border ${ctx.state==='refresh'?'bg-blue-100 border-blue-300':'border-slate-200'}`}>REFRESH</button>
      <button onClick={()=>ctx.set('hit')} className={`px-2 py-1 rounded-md border ${ctx.state==='hit'?'bg-emerald-100 border-emerald-300':'border-slate-200'}`}>HIT</button>
      <span className="ml-auto opacity-70">(prévia)</span>
    </div>
  );
}

// ======= Admin (Prévia) =======
// Simula CRUD em memória. Na seção "ARQUIVOS REAIS" há o código Next.js + Firestore.
const sampleUsersAdmin = [
  { id: 'u1', email: 'admin@hebertpaes.com', role: 'admin', createdAt: new Date().toISOString() },
  { id: 'u2', email: 'user@hebertpaes.com', role: 'user', createdAt: new Date().toISOString() },
];
const sampleCategoriesAdmin = [
  { id: 'c1', name: 'Cloud', slug: 'cloud' },
  { id: 'c2', name: 'Dev', slug: 'dev' },
];
const sampleTagsAdmin = [
  { id: 't1', name: 'gcp', slug: 'gcp' },
  { id: 't2', name: 'nextjs', slug: 'nextjs' },
  { id: 't3', name: 'firestore', slug: 'firestore' },
];
const samplePagesAdmin = [
  { id: 'pg1', title: 'Sobre', slug: 'sobre', status: 'published' },
];
const samplePostsAdmin = [
  { id: 'p1', title: 'Hello World', slug: 'hello-world', status: 'published', categories: ['c2'], tags: ['t2'], publishedAt: new Date().toISOString() },
  { id: 'p2', title: 'Cloud Run + Next.js', slug: 'cloud-run-next', status: 'published', categories: ['c1'], tags: ['t1','t2'], publishedAt: new Date().toISOString() },
];

function AdminPanel(){
  const [tab, setTab] = React.useState<'users'|'posts'|'categories'|'tags'|'pages'|'blockchain'>('users');

  return (
    <div className="relative rounded-3xl border border-slate-200 bg-white/90 shadow-xl overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex items-center gap-3 flex-wrap">
        <h2 className="text-xl font-bold mr-auto">Administração</h2>
        {(['users','posts','categories','tags','pages','blockchain'] as const).map(k => (
          <button key={k} onClick={()=>setTab(k)}
            className={`px-3 py-1.5 rounded-full border text-sm ${tab===k? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 bg-white'}`}>
            {k==='users'?'Usuários':k==='posts'?'Posts':k==='categories'?'Categorias':k==='tags'?'Tags':k==='pages'?'Páginas':'Blockchain'}
          </button>
        ))}
        <span className="ml-2 text-xs text-slate-500">(prévia)</span>
      </div>
      <div className="p-6">
        {tab==='users' && <UsersAdmin/>}
        {tab==='posts' && <PostsAdmin/>}
        {tab==='categories' && <CategoriesAdmin/>}
        {tab==='tags' && <TagsAdmin/>}
        {tab==='pages' && <PagesAdmin/>}
        {tab==='blockchain' && <BlockchainAdminPreview/>}
      </div>
    </div>
  );
}

function UsersAdmin(){
  const [items, setItems] = React.useState<any[]>(sampleUsersAdmin);
  const [email, setEmail] = React.useState('');
  const [role, setRole] = React.useState<'admin'|'editor'|'user'>('user');
  function add(e: React.FormEvent){ e.preventDefault(); if(!email) return; setItems(prev=>[{ id: uid(), email, role, createdAt: new Date().toISOString() }, ...prev]); setEmail(''); setRole('user'); }
  function del(id:string){ setItems(prev=>prev.filter(i=>i.id!==id)); }
  return (
    <div>
      <h3 className="font-semibold mb-3">Usuários</h3>
      <form onSubmit={add} className="flex flex-col sm:flex-row gap-2 mb-4">
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email@exemplo.com" className="flex-1 rounded-xl border px-3 py-2"/>
        <select value={role} onChange={e=>setRole(e.target.value as any)} className="rounded-xl border px-3 py-2">
          <option value="admin">admin</option>
          <option value="editor">editor</option>
          <option value="user">user</option>
        </select>
        <button className="rounded-xl bg-slate-900 text-white px-4">Adicionar</button>
      </form>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-slate-500"><th className="py-2 pr-4">E-mail</th><th className="py-2 pr-4">Função</th><th className="py-2 pr-4">Criado</th><th></th></tr></thead>
          <tbody>
            {items.map(u=> (
              <tr key={u.id} className="border-t">
                <td className="py-2 pr-4">{u.email}</td>
                <td className="py-2 pr-4">{u.role}</td>
                <td className="py-2 pr-4">{new Date(u.createdAt).toLocaleString()}</td>
                <td className="py-2 text-right"><button onClick={()=>del(u.id)} className="text-red-600 underline">remover</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PostsAdmin(){
  const [items, setItems] = React.useState<any[]>(samplePostsAdmin);
  const [title, setTitle] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [status, setStatus] = React.useState<'draft'|'published'>('draft');
  const [cats, setCats] = React.useState('');
  const [tags, setTags] = React.useState('');
  function add(e: React.FormEvent){ e.preventDefault(); if(!title||!slug) return; setItems(prev=>[{ id: uid(), title, slug, status, categories: cats.split(',').map(s=>s.trim()).filter(Boolean), tags: tags.split(',').map(s=>s.trim()).filter(Boolean), publishedAt: new Date().toISOString() }, ...prev]); setTitle(''); setSlug(''); setStatus('draft'); setCats(''); setTags(''); }
  function del(id:string){ setItems(prev=>prev.filter(i=>i.id!==id)); }
  return (
    <div>
      <h3 className="font-semibold mb-3">Posts</h3>
      <form onSubmit={add} className="grid grid-cols-1 sm:grid-cols-6 gap-2 mb-4">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Título" className="rounded-xl border px-3 py-2 sm:col-span-2"/>
        <input value={slug} onChange={e=>setSlug(e.target.value)} placeholder="slug-exemplo" className="rounded-xl border px-3 py-2"/>
        <select value={status} onChange={e=>setStatus(e.target.value as any)} className="rounded-xl border px-3 py-2">
          <option value="draft">draft</option>
          <option value="published">published</option>
        </select>
        <input value={cats} onChange={e=>setCats(e.target.value)} placeholder="categorias (ids, vírgula)" className="rounded-xl border px-3 py-2"/>
        <input value={tags} onChange={e=>setTags(e.target.value)} placeholder="tags (ids, vírgula)" className="rounded-xl border px-3 py-2"/>
        <button className="rounded-xl bg-slate-900 text-white px-4 py-2 sm:col-span-6">Adicionar</button>
      </form>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-slate-500"><th className="py-2 pr-4">Título</th><th className="py-2 pr-4">Slug</th><th className="py-2 pr-4">Status</th><th className="py-2 pr-4">Categorias</th><th className="py-2 pr-4">Tags</th><th></th></tr></thead>
          <tbody>
            {items.map(p=> (
              <tr key={p.id} className="border-t">
                <td className="py-2 pr-4">{p.title}</td>
                <td className="py-2 pr-4">{p.slug}</td>
                <td className="py-2 pr-4">{p.status}</td>
                <td className="py-2 pr-4">{(p.categories||[]).join(', ')}</td>
                <td className="py-2 pr-4">{(p.tags||[]).join(', ')}</td>
                <td className="py-2 text-right"><button onClick={()=>del(p.id)} className="text-red-600 underline">remover</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CategoriesAdmin(){
  const [items, setItems] = React.useState<any[]>(sampleCategoriesAdmin);
  const [name, setName] = React.useState('');
  const [slug, setSlug] = React.useState('');
  function add(e: React.FormEvent){ e.preventDefault(); if(!name||!slug) return; setItems(prev=>[{ id: uid(), name, slug }, ...prev]); setName(''); setSlug(''); }
  function del(id:string){ setItems(prev=>prev.filter(i=>i.id!==id)); }
  return (
    <div>
      <h3 className="font-semibold mb-3">Categorias</h3>
      <form onSubmit={add} className="flex flex-col sm:flex-row gap-2 mb-4">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nome" className="rounded-xl border px-3 py-2"/>
        <input value={slug} onChange={e=>setSlug(e.target.value)} placeholder="slug" className="rounded-xl border px-3 py-2"/>
        <button className="rounded-xl bg-slate-900 text-white px-4">Adicionar</button>
      </form>
      <ul className="divide-y">
        {items.map(c => (
          <li key={c.id} className="py-2 flex items-center justify-between"><span>{c.name} <span className="text-slate-400">/ {c.slug}</span></span><button onClick={()=>del(c.id)} className="text-red-600 underline">remover</button></li>
        ))}
      </ul>
    </div>
  );
}

function TagsAdmin(){
  const [items, setItems] = React.useState<any[]>(sampleTagsAdmin);
  const [name, setName] = React.useState('');
  const [slug, setSlug] = React.useState('');
  function add(e: React.FormEvent){ e.preventDefault(); if(!name||!slug) return; setItems(prev=>[{ id: uid(), name, slug }, ...prev]); setName(''); setSlug(''); }
  function del(id:string){ setItems(prev=>prev.filter(i=>i.id!==id)); }
  return (
    <div>
      <h3 className="font-semibold mb-3">Tags</h3>
      <form onSubmit={add} className="flex flex-col sm:flex-row gap-2 mb-4">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nome" className="rounded-xl border px-3 py-2"/>
        <input value={slug} onChange={e=>setSlug(e.target.value)} placeholder="slug" className="rounded-xl border px-3 py-2"/>
        <button className="rounded-xl bg-slate-900 text-white px-4">Adicionar</button>
      </form>
      <ul className="divide-y">
        {items.map(t => (
          <li key={t.id} className="py-2 flex items-center justify-between"><span>{t.name} <span className="text-slate-400">/ {t.slug}</span></span><button onClick={()=>del(t.id)} className="text-red-600 underline">remover</button></li>
        ))}
      </ul>
    </div>
  );
}

function PagesAdmin(){
  const [items, setItems] = React.useState<any[]>(samplePagesAdmin);
  const [title, setTitle] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [status, setStatus] = React.useState<'draft'|'published'>('draft');
  function add(e: React.FormEvent){ e.preventDefault(); if(!title||!slug) return; setItems(prev=>[{ id: uid(), title, slug, status }, ...prev]); setTitle(''); setSlug(''); setStatus('draft'); }
  function del(id:string){ setItems(prev=>prev.filter(i=>i.id!==id)); }
  return (
    <div>
      <h3 className="font-semibold mb-3">Páginas</h3>
      <form onSubmit={add} className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-4">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Título" className="rounded-xl border px-3 py-2"/>
        <input value={slug} onChange={e=>setSlug(e.target.value)} placeholder="slug" className="rounded-xl border px-3 py-2"/>
        <select value={status} onChange={e=>setStatus(e.target.value as any)} className="rounded-xl border px-3 py-2">
          <option value="draft">draft</option>
          <option value="published">published</option>
        </select>
        <button className="rounded-xl bg-slate-900 text-white px-4">Adicionar</button>
      </form>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-slate-500"><th className="py-2 pr-4">Título</th><th className="py-2 pr-4">Slug</th><th className="py-2 pr-4">Status</th><th></th></tr></thead>
          <tbody>
            {items.map(p=> (
              <tr key={p.id} className="border-t">
                <td className="py-2 pr-4">{p.title}</td>
                <td className="py-2 pr-4">{p.slug}</td>
                <td className="py-2 pr-4">{p.status}</td>
                <td className="py-2 text-right"><button onClick={()=>del(p.id)} className="text-red-600 underline">remover</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ======= Blockchain (Prévia) =======
function BlockchainAdminPreview(){
  const [pub, setPub] = React.useState<string|undefined>();
  const [prv, setPrv] = React.useState<string|undefined>();
  const [slug, setSlug] = React.useState('hello-world');
  const [hash, setHash] = React.useState('sha256-do-conteudo');
  const [mempool, setMempool] = React.useState<any[]>([]);
  const [blocks, setBlocks] = React.useState<any[]>([]);

  function generateKeys(){
    // PRÉVIA: apenas simula PEMs (não usar em produção)
    setPub('-----BEGIN PUBLIC KEY-----\nPREVIEW-PUBLIC-KEY\n-----END PUBLIC KEY-----');
    setPrv('-----BEGIN PRIVATE KEY-----\nPREVIEW-PRIVATE-KEY\n-----END PRIVATE KEY-----');
  }
  function addTx(e: React.FormEvent){ e.preventDefault(); setMempool(prev=>[{ id: Math.random().toString(36).slice(2), type:'notarizePost', payload:{ slug, contentHash: hash }, timestamp: Date.now() }, ...prev]); }
  function mine(){ if(mempool.length===0) return; const tx = mempool.slice(0,5); const block = { height: blocks.length, hash: Math.random().toString(16).slice(2), tx, timestamp: Date.now() }; setBlocks(prev=>[block, ...prev]); setMempool(prev=>prev.slice(tx.length)); }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border p-4 bg-white/90">
        <h3 className="font-semibold mb-2">Chave do proponente (prévia)</h3>
        <p className="text-sm text-slate-600 mb-3">Gere um par de chaves para assinar blocos (apenas demonstração — a versão real fica no servidor).</p>
        <div className="flex gap-2 mb-3">
          <button onClick={generateKeys} className="rounded-xl bg-slate-900 text-white px-4 py-2">Gerar chaves</button>
          {pub && <button onClick={()=>navigator.clipboard.writeText(pub!)} className="rounded-xl border px-3">Copiar pública</button>}
          {prv && <button onClick={()=>navigator.clipboard.writeText(prv!)} className="rounded-xl border px-3">Copiar privada</button>}
        </div>
        {pub && (<pre className="text-xs whitespace-pre-wrap p-2 bg-slate-50 rounded border mb-2">{pub}</pre>)}
        {prv && (<pre className="text-xs whitespace-pre-wrap p-2 bg-slate-50 rounded border">{prv}</pre>)}
      </div>

      <div className="rounded-2xl border p-4 bg-white/90">
        <h3 className="font-semibold mb-2">Enviar transação (notarizar post)</h3>
        <form onSubmit={addTx} className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          <input value={slug} onChange={e=>setSlug(e.target.value)} placeholder="slug" className="rounded-xl border px-3 py-2"/>
          <input value={hash} onChange={e=>setHash(e.target.value)} placeholder="sha256 do conteúdo" className="rounded-xl border px-3 py-2 sm:col-span-2"/>
          <button className="rounded-xl bg-indigo-600 text-white px-4 py-2">Enviar</button>
        </form>
      </div>

      <div className="rounded-2xl border p-4 bg-white/90">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Mempool</h3>
          <button onClick={mine} className="rounded-xl bg-emerald-600 text-white px-3 py-1.5">Minerar bloco</button>
        </div>
        <ul className="divide-y text-sm">
          {mempool.map(m => (
            <li key={m.id} className="py-2 flex items-center justify-between"><span>{m.payload.slug}</span><span className="text-slate-500">{new Date(m.timestamp).toLocaleTimeString()}</span></li>
          ))}
          {mempool.length===0 && <li className="py-2 text-slate-500">(vazio)</li>}
        </ul>
      </div>

      <div className="rounded-2xl border p-4 bg-white/90">
        <h3 className="font-semibold mb-2">Blocos</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-slate-500"><th className="py-2 pr-4">Altura</th><th className="py-2 pr-4">Hash</th><th className="py-2 pr-4">TX</th><th className="py-2 pr-4">Quando</th></tr></thead>
            <tbody>
              {blocks.map(b => (
                <tr key={b.hash} className="border-t">
                  <td className="py-2 pr-4">{b.height}</td>
                  <td className="py-2 pr-4 font-mono text-xs break-all">{b.hash}</td>
                  <td className="py-2 pr-4">{b.tx?.length ?? 0}</td>
                  <td className="py-2 pr-4">{new Date(b.timestamp).toLocaleString()}</td>
                </tr>
              ))}
              {blocks.length===0 && (
                <tr><td colSpan={4} className="py-2 text-slate-500">(nenhum bloco ainda)</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ======= Chat (Prévia) =======
type ChatMsg = { id:string; role:'user'|'assistant'; content:string };

function ChatBubble({msg}:{msg:ChatMsg}){
  const isUser = msg.role === 'user';
  return (
    <div className={`flex ${isUser?'justify-end':''}`}>
      <div className={`${isUser?'bg-slate-900 text-white':'bg-white border'} max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-wrap`}>
        {!isUser && <div className="text-[11px] uppercase tracking-wide text-slate-500 mb-1">assistant</div>}
        {msg.content}
      </div>
    </div>
  );
}

function ChatPanel(){
  const [model,setModel] = React.useState<'gpt'|'gemini'|'meta'|'manus'|'deepseek'|'mistral'>('gpt');
  const [messages,setMessages] = React.useState<ChatMsg[]>([{id:uid(), role:'assistant', content:'Olá! Sou seu agente de chat. Como posso ajudar?'}]);
  const [input,setInput] = React.useState('');
  const [streamingId,setStreamingId]= React.useState<string|undefined>();
  const bottomRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:'smooth'}); },[messages, streamingId]);

  function send(text?:string){
    const content = (text ?? input).trim();
    if(!content) return;
    const um:ChatMsg = {id:uid(), role:'user', content};
    setMessages(prev=>[...prev, um]);
    setInput('');
    // Simula resposta do modelo selecionado
    const aid = uid();
    setStreamingId(aid);
    const target = `(${model.toUpperCase()}) Entendi: "${content}".

Resumo:
- Este é um chat de prévia local.
- Nenhuma chamada externa é feita.

Próximos passos:
1) Conectar sua API real (Gemini/GPT/Meta/DeepSeek/etc).
2) Proteger com autenticação.
3) Registrar logs e latência.

Dica: use o agente de busca integrado em /agente_busca_integrado.html para levantar fontes.`;
    let i=0; let t: any;
    const tick = () => {
      i += Math.max(3, Math.floor(target.length/40));
      const partial = target.slice(0,i);
      setMessages(prev=>{
        const others = prev.filter(m=>m.id!==aid);
        const current = prev.find(m=>m.id===aid);
        const a:ChatMsg = current ?? {id:aid, role:'assistant', content:''};
        a.content = partial;
        return [...others, a];
      });
      if(i < target.length) { t = setTimeout(tick, 30); } else { setStreamingId(undefined); }
    };
    t = setTimeout(tick, 120);
  }

  function onSubmit(e:React.FormEvent){ e.preventDefault(); send(); }
  function clear(){ setMessages([{id:uid(), role:'assistant', content:'Conversa limpa. O que deseja saber agora?'}]); }

  const quick = [
    'Como publicar Next.js no Cloud Run?',
    'O que é ISR e como cachear no Cloudflare?',
    'Gere um robots.txt e sitemap para meu blog.'
  ];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/90 shadow-xl overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center gap-2 flex-wrap">
        <h2 className="text-lg font-semibold mr-auto">Chat AI (prévia)</h2>
        <label className="text-sm">Modelo:&nbsp;
          <select value={model} onChange={e=>setModel(e.target.value as any)} className="border rounded-md px-2 py-1">
            <option value="gpt">GPT</option>
            <option value="gemini">Gemini</option>
            <option value="meta">Meta</option>
            <option value="deepseek">DeepSeek</option>
            <option value="mistral">Mistral</option>
            <option value="manus">Manus</option>
          </select>
        </label>
        <button onClick={clear} className="text-sm border rounded-md px-3 py-1">Limpar</button>
      </div>

      <div className="p-4 sm:p-6 max-h-[60vh] overflow-auto space-y-3 bg-gradient-to-b from-white/60 to-white">
        {messages.map(m => <ChatBubble key={m.id} msg={m} />)}
        <div ref={bottomRef} />
      </div>

      <div className="px-4 sm:px-6 pb-4">
        <div className="flex gap-2 flex-wrap mb-2">
          {quick.map(q => (
            <button key={q} onClick={()=>send(q)} className="text-xs px-2 py-1 rounded-full border hover:bg-slate-50">{q}</button>
          ))}
        </div>
        <form onSubmit={onSubmit} className="flex gap-2">
          <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Pergunte algo (prévia, sem chamadas externas)…" className="flex-1 rounded-xl border px-3 py-2"/>
          <button className="rounded-xl bg-slate-900 text-white px-4">Enviar</button>
        </form>
        <p className="text-xs text-slate-500 mt-2">Esta é uma simulação local de chat (sem rede). A versão real deve chamar suas APIs/LLMs.</p>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-200">
      <div className="container mx-auto px-4 max-w-6xl py-8 text-sm text-slate-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} Hebert Paes · Cloud Run · Firestore</p>
        <div className="flex items-center gap-4">
          <a href="#" onClick={(e)=>e.preventDefault()}>Sitemap</a>
          <a href="#" onClick={(e)=>e.preventDefault()}>Robots</a>
          <a href="#" onClick={(e)=>e.preventDefault()}>RSS</a>
        </div>
      </div>
    </footer>
  );
}

function AuthPanel() {
  const [mode, setMode] = useState<"login" | "register">("login");
  return (
    <div className="relative">
      <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-indigo-500 to-sky-500 opacity-30 blur-xl" aria-hidden />
      <div className="relative rounded-3xl border border-slate-200 bg-white/90 shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="md:col-span-2 p-6 sm:p-8 border-b md:border-b-0 md:border-r border-slate-200/80 bg-gradient-to-br from-slate-50 to-white">
            <h2 className="text-xl font-bold mb-2">Acesso</h2>
            <p className="text-sm text-slate-600">Entre com sua conta ou crie uma nova para acessar a área administrativa.</p>
            <div className="mt-6 inline-flex rounded-full bg-slate-100 p-1">
              <button onClick={() => setMode("login")} className={`px-4 py-1 text-sm rounded-full transition ${mode === "login" ? "bg-white shadow" : "opacity-70"}`}>Entrar</button>
              <button onClick={() => setMode("register")} className={`px-4 py-1 text-sm rounded-full transition ${mode === "register" ? "bg-white shadow" : "opacity-70"}`}>Cadastrar</button>
            </div>
            <ul className="mt-6 space-y-2 text-sm">
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500"/> Cookies seguros (httpOnly)</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500"/> Sessões com hash SHA-256</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500"/> Rate limiting & auditoria</li>
            </ul>
          </div>
          <div className="md:col-span-3 p-6 sm:p-8">
            {mode === "login" ? <LoginForm /> : <RegisterForm />}
          </div>
        </div>
      </div>
    </div>
  );
}

function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    // PRÉVIA: apenas simula sucesso
    await new Promise(r => setTimeout(r, 500));
    setMessage("Conta criada! (prévia)");
    setEmail(""); setPassword("");
    setLoading(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" aria-labelledby="cadastro-title">
      <h3 id="cadastro-title" className="text-lg font-semibold">Criar conta</h3>
      <div>
        <label className="block text-sm mb-1" htmlFor="reg-email">E-mail</label>
        <input id="reg-email" type="email" required autoComplete="email"
          value={email} onChange={(e)=>setEmail(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
      </div>
      <div>
        <label className="block text-sm mb-1" htmlFor="reg-pass">Senha (mín. 8)</label>
        <input id="reg-pass" type="password" required minLength={8} autoComplete="new-password"
          value={password} onChange={(e)=>setPassword(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
      </div>
      <button disabled={loading} className="w-full rounded-xl bg-indigo-600 text-white py-2.5 font-medium hover:bg-indigo-700 disabled:opacity-60">
        {loading ? "Criando…" : "Cadastrar"}
      </button>
      <Status message={message} />
    </form>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    // PRÉVIA: apenas simula sucesso
    await new Promise(r => setTimeout(r, 500));
    setMessage("Login ok! (prévia)");
    setLoading(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" aria-labelledby="login-title">
      <h3 id="login-title" className="text-lg font-semibold">Entrar</h3>
      <div>
        <label className="block text-sm mb-1" htmlFor="login-email">E-mail</label>
        <input id="login-email" type="email" required autoComplete="email"
          value={email} onChange={(e)=>setEmail(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
      </div>
      <div>
        <label className="block text-sm mb-1" htmlFor="login-pass">Senha</label>
        <input id="login-pass" type="password" required autoComplete="current-password"
          value={password} onChange={(e)=>setPassword(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
      </div>
      <button disabled={loading} className="w-full rounded-xl bg-slate-900 text-white py-2.5 font-medium hover:bg-slate-800 disabled:opacity-60">
        {loading ? "Entrando…" : "Entrar"}
      </button>
      <Status message={message} />
    </form>
  );
}

function Status({ message }: { message: string | null }) {
  return (
    <div role="status" aria-live="polite" className="min-h-[1.5rem] text-sm">
      {message && (
        <div className="mt-1 rounded-lg border border-slate-200 bg-white/80 px-3 py-2">
          {message}
        </div>
      )}
    </div>
  );
}

function PostCard({ post }: { post: { slug: string; title: string; excerpt?: string; coverImage?: string; publishedAt: string; } }) {
  const dateStr = new Date(post.publishedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  return (
    <article className="rounded-2xl border border-slate-200 bg-white/90 overflow-hidden hover:shadow">
      {post.coverImage ? (
        <a href="#" onClick={(e)=>e.preventDefault()} className="block aspect-[16/9] bg-slate-100">
          <img
            src={post.coverImage}
            alt={post.title}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={(e)=>{ (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_DATA_URL; }}
            className="w-full h-full object-cover"
          />
        </a>
      ) : (
        <div className="aspect-[16/9] bg-slate-100" />
      )}
      <div className="p-4">
        <h3 className="font-semibold leading-snug">
          <a href="#" onClick={(e)=>e.preventDefault()} className="no-underline hover:underline">{post.title}</a>
        </h3>
        {post.excerpt && <p className="mt-2 text-sm text-slate-600">{post.excerpt}</p>}
        <time className="post-date mt-3 block text-xs text-slate-500">{dateStr}</time>
      </div>
    </article>
  );
}
