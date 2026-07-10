import React from "react";
import Testimonials from "./components/Testimonials";

// Landing do Comenta — SaaS de atendimento multicanal com IA (Claude).
// Server Component, estático. Visual colorido/vibrante com Tailwind.

const FEATURES = [
  {
    icon: "💬",
    title: "Tudo em uma caixa de entrada",
    desc: "WhatsApp, Instagram, e-mail e chat do site num só lugar. Nenhuma mensagem cai no vácuo.",
    color: "from-fuchsia-500 to-pink-500",
  },
  {
    icon: "✨",
    title: "IA que classifica e prioriza",
    desc: "Cada conversa é organizada e priorizada automaticamente pela IA da Anthropic (Claude).",
    color: "from-violet-500 to-indigo-500",
  },
  {
    icon: "⚡",
    title: "Respostas sugeridas",
    desc: "A IA escreve a melhor resposta com base no histórico. Você só revisa e envia.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: "📝",
    title: "Resumo de conversas",
    desc: "Entenda todo o histórico em segundos — qualquer pessoa do time assume sem se perder.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: "🔔",
    title: "Tempo real",
    desc: "Mensagens e métricas ao vivo via WebSocket. O time vê tudo acontecer na hora.",
    color: "from-sky-500 to-cyan-500",
  },
  {
    icon: "🔗",
    title: "Webhooks & automações",
    desc: "Conecte seu CRM e ferramentas com entregas assinadas (HMAC) e retry em fila.",
    color: "from-rose-500 to-red-500",
  },
];

const PLANOS = [
  {
    nome: "Free",
    preco: "R$0",
    periodo: "para sempre",
    desc: "Para começar e testar.",
    destaque: false,
    itens: ["1 usuário", "1 canal", "IA básica (classificação)", "500 conversas/mês"],
    cta: "Começar grátis",
  },
  {
    nome: "Pro",
    preco: "R$99",
    periodo: "/mês",
    desc: "Para equipes que atendem de verdade.",
    destaque: true,
    itens: ["Até 10 usuários", "Todos os canais", "IA completa (resumo + sugestão)", "Conversas ilimitadas", "Métricas e relatórios"],
    cta: "Assinar Pro",
  },
  {
    nome: "Business",
    preco: "R$299",
    periodo: "/mês",
    desc: "Para operações e multi-marca.",
    destaque: false,
    itens: ["Usuários ilimitados", "Multi-tenant", "Webhooks & API", "Auditoria e SLA", "Suporte prioritário"],
    cta: "Falar com vendas",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      {/* ===== Nav ===== */}
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <a href="#" className="flex items-center gap-2 font-extrabold text-lg">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-600 to-indigo-600 text-white">
              C
            </span>
            Comenta
          </a>
          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
            <a href="#recursos" className="hover:text-slate-900">Recursos</a>
            <a href="#ia" className="hover:text-slate-900">IA</a>
            <a href="#planos" className="hover:text-slate-900">Planos</a>
            <a href="https://app.comenta.com.br" className="hover:text-slate-900">Entrar</a>
          </nav>
          <a
            href="https://app.comenta.com.br"
            className="rounded-full bg-gradient-to-r from-fuchsia-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/25 transition hover:opacity-90"
          >
            Começar grátis
          </a>
        </div>
      </header>

      {/* ===== Hero ===== */}
      <section className="relative">
        <div className="blob left-[-6rem] top-[-4rem] h-72 w-72 bg-fuchsia-400" />
        <div className="blob right-[-5rem] top-10 h-80 w-80 bg-indigo-400" style={{ animationDelay: "-4s" }} />
        <div className="blob left-1/3 top-40 h-72 w-72 bg-amber-300" style={{ animationDelay: "-8s" }} />

        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 py-20 lg:grid-cols-2 lg:py-28">
          <div className="reveal">
            <span className="inline-flex items-center gap-2 rounded-full border border-fuchsia-200 bg-fuchsia-50 px-3 py-1 text-xs font-semibold text-fuchsia-700">
              <span className="h-2 w-2 rounded-full bg-fuchsia-500" />
              Atendimento com IA · WhatsApp, Instagram, e-mail e mais
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              Todo o seu atendimento em um só lugar — com{" "}
              <span className="text-gradient">IA que responde por você</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-600">
              O Comenta reúne seus canais, entende cada conversa e sugere a
              melhor resposta. Sua equipe atende mais rápido, sem perder o toque
              humano.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://app.comenta.com.br"
                className="rounded-full bg-gradient-to-r from-fuchsia-600 to-indigo-600 px-6 py-3 text-center font-semibold text-white shadow-xl shadow-fuchsia-500/30 transition hover:opacity-90"
              >
                Começar grátis
              </a>
              <a
                href="#recursos"
                className="rounded-full border border-slate-300 bg-white px-6 py-3 text-center font-semibold text-slate-700 transition hover:border-slate-400"
              >
                Ver como funciona
              </a>
            </div>
            <p className="mt-4 text-sm text-slate-500">
              Sem cartão de crédito · Configure em minutos
            </p>
          </div>

          {/* Mockup de caixa de entrada */}
          <div className="reveal" style={{ animationDelay: "0.15s" }}>
            <ChatMockup />
          </div>
        </div>
      </section>

      {/* ===== Métricas ===== */}
      <section className="border-y border-slate-200 bg-gradient-to-r from-fuchsia-50 via-white to-indigo-50">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 sm:grid-cols-4">
          {[
            ["−60%", "tempo de resposta"],
            ["5+", "canais integrados"],
            ["24/7", "atendimento com IA"],
            ["99,9%", "de disponibilidade"],
          ].map(([n, l]) => (
            <div key={l} className="text-center">
              <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-indigo-600 sm:text-4xl">
                {n}
              </div>
              <div className="mt-1 text-sm text-slate-600">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Recursos ===== */}
      <section id="recursos" className="mx-auto max-w-6xl px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Tudo para atender <span className="text-gradient">melhor e mais rápido</span>
          </h2>
          <p className="mt-4 text-slate-600">
            Uma plataforma completa de atendimento — com inteligência artificial
            em cada etapa da conversa.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group rounded-3xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div
                className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${f.color} text-2xl shadow-lg`}
              >
                {f.icon}
              </div>
              <h3 className="mt-4 text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Destaque IA ===== */}
      <section id="ia" className="relative overflow-hidden bg-slate-950 text-white">
        <div className="blob left-10 top-0 h-72 w-72 bg-fuchsia-600" />
        <div className="blob right-0 bottom-0 h-80 w-80 bg-indigo-600" style={{ animationDelay: "-6s" }} />
        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-fuchsia-200">
              ✨ IA da Anthropic (Claude) integrada
            </span>
            <h2 className="mt-5 text-3xl font-extrabold sm:text-4xl">
              A IA faz o trabalho pesado. Sua equipe dá o toque humano.
            </h2>
            <ul className="mt-8 space-y-4">
              {[
                ["Classifica", "prioriza e organiza cada nova conversa — modelo rápido e econômico (Haiku)."],
                ["Resume", "condensa históricos longos para o atendente entender na hora."],
                ["Sugere", "escreve a resposta ideal para você revisar e enviar (Sonnet)."],
              ].map(([t, d]) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-indigo-500 text-xs font-bold">
                    ✓
                  </span>
                  <span className="text-slate-200">
                    <strong className="text-white">{t}:</strong> {d}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-slate-400">
              Modelos configuráveis. Sem chave de IA, o restante da plataforma
              segue funcionando normalmente.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="text-xs font-semibold uppercase tracking-wide text-fuchsia-300">
              Sugestão da IA
            </div>
            <div className="mt-3 rounded-2xl bg-slate-900/80 p-4 text-sm text-slate-200">
              <p className="text-slate-400">Cliente:</p>
              <p className="mt-1">“Meu pedido #1043 ainda não chegou, já faz uma semana 😟”</p>
              <div className="my-4 h-px bg-white/10" />
              <p className="text-fuchsia-300">Comenta sugere:</p>
              <p className="mt-1">
                “Oi! Sinto muito pela demora 🙏 Localizei o pedido #1043 — ele
                saiu para entrega hoje e chega até amanhã. Quer que eu te envie o
                código de rastreio agora?”
              </p>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-4 py-2 text-sm font-semibold">
                Enviar
              </button>
              <button className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-slate-200">
                Editar
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Depoimentos ===== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-fuchsia-50 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-12 text-center text-3xl font-extrabold sm:text-4xl">
            Times que já atendem com o <span className="text-gradient">Comenta</span>
          </h2>
          <Testimonials />
        </div>
      </section>

      {/* ===== Planos ===== */}
      <section id="planos" className="mx-auto max-w-6xl px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Planos que crescem com você
          </h2>
          <p className="mt-4 text-slate-600">
            Comece grátis e evolua quando precisar. Valores ilustrativos.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {PLANOS.map((p) => (
            <div
              key={p.nome}
              className={`relative rounded-3xl border p-8 ${
                p.destaque
                  ? "border-transparent bg-gradient-to-b from-fuchsia-600 to-indigo-600 text-white shadow-2xl shadow-fuchsia-500/30 lg:-translate-y-4"
                  : "border-slate-200 bg-white"
              }`}
            >
              {p.destaque && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-slate-900">
                  Mais popular
                </span>
              )}
              <h3 className="text-lg font-bold">{p.nome}</h3>
              <p className={`mt-1 text-sm ${p.destaque ? "text-fuchsia-100" : "text-slate-500"}`}>
                {p.desc}
              </p>
              <div className="mt-5 flex items-end gap-1">
                <span className="text-4xl font-extrabold">{p.preco}</span>
                <span className={`mb-1 text-sm ${p.destaque ? "text-fuchsia-100" : "text-slate-500"}`}>
                  {p.periodo}
                </span>
              </div>
              <a
                href="https://app.comenta.com.br"
                className={`mt-6 block rounded-full px-4 py-3 text-center font-semibold transition ${
                  p.destaque
                    ? "bg-white text-fuchsia-700 hover:opacity-90"
                    : "bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white hover:opacity-90"
                }`}
              >
                {p.cta}
              </a>
              <ul className="mt-6 space-y-3 text-sm">
                {p.itens.map((it) => (
                  <li key={it} className="flex gap-2">
                    <span className={p.destaque ? "text-amber-300" : "text-fuchsia-500"}>✓</span>
                    <span className={p.destaque ? "text-white" : "text-slate-700"}>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA final ===== */}
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 px-6 py-16 text-center text-white">
          <div className="blob left-10 top-0 h-56 w-56 bg-amber-300" />
          <div className="blob right-10 bottom-0 h-56 w-56 bg-pink-400" style={{ animationDelay: "-5s" }} />
          <div className="relative">
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Pronto para atender melhor?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-fuchsia-100">
              Conecte seus canais em minutos e deixe a IA acelerar cada resposta.
            </p>
            <a
              href="https://app.comenta.com.br"
              className="mt-8 inline-block rounded-full bg-white px-8 py-3 font-semibold text-fuchsia-700 shadow-xl transition hover:opacity-90"
            >
              Começar grátis
            </a>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-10 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 font-extrabold">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-fuchsia-600 to-indigo-600 text-white">
              C
            </span>
            Comenta
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
            <a href="#recursos" className="hover:text-slate-900">Recursos</a>
            <a href="#planos" className="hover:text-slate-900">Planos</a>
            <a href="https://app.comenta.com.br" className="hover:text-slate-900">Entrar</a>
            <a href="https://api.comenta.com.br/docs" className="hover:text-slate-900">API</a>
          </div>
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} Comenta
          </p>
        </div>
      </footer>
    </div>
  );
}

// Mockup visual da caixa de entrada multicanal (estático).
function ChatMockup() {
  const convos = [
    { canal: "💬", nome: "Ana · WhatsApp", msg: "Oi, meu pedido chegou hoje?", tag: "Urgente", cor: "bg-rose-100 text-rose-700", ring: "ring-emerald-400" },
    { canal: "📸", nome: "João · Instagram", msg: "Vocês têm no tamanho M?", tag: "Vendas", cor: "bg-violet-100 text-violet-700", ring: "ring-fuchsia-400" },
    { canal: "✉️", nome: "Suporte · E-mail", msg: "Preciso da 2ª via da nota…", tag: "Financeiro", cor: "bg-amber-100 text-amber-700", ring: "ring-sky-400" },
  ];
  return (
    <div className="relative">
      <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-gradient-to-br from-fuchsia-500/30 to-indigo-500/30 blur-2xl" />
      <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-2xl">
        <div className="flex items-center justify-between px-2 pb-3">
          <div className="text-sm font-bold">Caixa de entrada</div>
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
            3 novas
          </span>
        </div>
        <div className="space-y-2">
          {convos.map((c) => (
            <div key={c.nome} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
              <span className={`inline-flex h-10 w-10 flex-none items-center justify-center rounded-full bg-white text-lg ring-2 ${c.ring}`}>
                {c.canal}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold">{c.nome}</span>
                  <span className={`flex-none rounded-full px-2 py-0.5 text-[10px] font-bold ${c.cor}`}>
                    {c.tag}
                  </span>
                </div>
                <p className="truncate text-sm text-slate-500">{c.msg}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 p-3 text-center text-sm font-semibold text-white">
          ✨ IA sugeriu 3 respostas
        </div>
      </div>
    </div>
  );
}
