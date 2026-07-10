"use client";

// EngagementDock — consentimento (LGPD) + DUAS filas de atendimento.
//  1. 1ª visita: banner de cookies/termos. Ao ACEITAR, o assistente abre
//     sozinho e pergunta: falar com a IA ou com um humano?
//  2. FILA DA IA (✨): atendida na hora pela IA, que resolve dúvidas comuns
//     (planos, IA, começar) e pode encaminhar a um humano.
//  3. FILA HUMANA: escolhe o time (Suporte/Vendas/Financeiro/Marketing),
//     entra na fila com posição/tempo e um dos vários atendentes assume.
//  A qualquer momento dá pra continuar no WhatsApp.

import React, { useCallback, useEffect, useRef, useState } from "react";

type Consent = "unknown" | "accepted" | "declined";
type Phase = "inicio" | "fila" | "queue" | "agent";
type Modo = "ia" | "humano" | null;
type From = "bot" | "user" | "agent" | "system";
type Fila = { id: string; nome: string; emoji: string; agents: string[] };
type Msg = { id: number; from: From; text: string; author?: string; cta?: { label: string; href: string } };

const STORAGE_KEY = "comenta_consent";
const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP || "5566999999999";

const FILA_IA: Fila = { id: "ia", nome: "Atendimento IA", emoji: "✨", agents: ["Assistente IA"] };
const FILAS_HUMANAS: Fila[] = [
  { id: "suporte", nome: "Suporte", emoji: "🛟", agents: ["Camila", "Diego"] },
  { id: "vendas", nome: "Vendas", emoji: "💼", agents: ["Priscila", "Marcos"] },
  { id: "financeiro", nome: "Financeiro", emoji: "💳", agents: ["Rafaela"] },
  { id: "marketing", nome: "Marketing", emoji: "📣", agents: ["Letícia", "Bruno"] },
];
const TOTAL_HUMANOS = FILAS_HUMANAS.reduce((n, f) => n + f.agents.length, 0);

let _id = 1;
const nid = () => _id++;

function botAnswer(key: string): Msg {
  switch (key) {
    case "planos":
      return { id: nid(), from: "agent", author: "Assistente IA", text: "Temos 3 planos: Free (R$0), Pro (R$99/mês) e Business (R$299/mês).", cta: { label: "Ver planos", href: "#planos" } };
    case "ia":
      return { id: nid(), from: "agent", author: "Assistente IA", text: "Eu (Claude) classifico, resumo e sugiro a resposta — você só revisa e envia. 👇", cta: { label: "Ver a IA em ação", href: "#ia" } };
    case "comecar":
      return { id: nid(), from: "agent", author: "Assistente IA", text: "É só criar sua conta no painel — sem cartão de crédito. 🚀", cta: { label: "Criar conta grátis", href: "https://app.comenta.com.br" } };
    default:
      return { id: nid(), from: "agent", author: "Assistente IA", text: "Posso ajudar com planos, como a IA funciona ou te passar para um humano. O que prefere?" };
  }
}

function waLink(contexto: string) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Olá! Vim do site do Comenta e gostaria de falar sobre: ${contexto}`)}`;
}

export default function EngagementDock() {
  const [consent, setConsent] = useState<Consent>("unknown");
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState<false | { author: string }>(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");

  const [phase, setPhase] = useState<Phase>("inicio");
  const [modo, setModo] = useState<Modo>(null);
  const [fila, setFila] = useState<Fila | null>(null);
  const [agent, setAgent] = useState<string | null>(null);
  const [queuePos, setQueuePos] = useState(0);

  const greeted = useRef(false);
  const timers = useRef<number[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const clearTimers = () => { timers.current.forEach((t) => clearTimeout(t)); timers.current = []; };
  const later = (fn: () => void, ms: number) => { const t = window.setTimeout(fn, ms); timers.current.push(t); };

  useEffect(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY) as Consent | null;
      if (v === "accepted" || v === "declined") setConsent(v);
    } catch {}
    setReady(true);
    return clearTimers;
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing, open, phase]);

  const persist = (v: Consent) => {
    try {
      localStorage.setItem(STORAGE_KEY, v);
      document.cookie = `${STORAGE_KEY}=${v}; max-age=31536000; path=/; SameSite=Lax`;
    } catch {}
  };

  const addMsg = (m: Msg) => setMessages((prev) => [...prev, m]);
  const say = useCallback((m: Msg, delay = 700, author?: string) => {
    setTyping({ author: author ?? m.author ?? "Assistente" });
    later(() => { setTyping(false); addMsg(m); }, delay);
  }, []);

  const startConversation = useCallback(() => {
    if (greeted.current) return;
    greeted.current = true;
    setOpen(true);
    setPhase("inicio");
    say({ id: nid(), from: "bot", text: "Olá! 👋 Sou o assistente do Comenta. Você quer falar com a IA ou com um humano?" }, 600);
  }, [say]);

  const accept = () => { persist("accepted"); setConsent("accepted"); later(startConversation, 800); };
  const decline = () => { persist("declined"); setConsent("declined"); };

  // ---- entra numa fila (IA ou humana) ----
  const entrarNaFila = (f: Fila, m: Modo, instant = false) => {
    clearTimers();
    setFila(f); setModo(m); setPhase("queue");
    const pos = instant ? 1 : 1 + Math.floor(Math.random() * 3);
    setQueuePos(pos);
    addMsg({ id: nid(), from: "system", text: `Você entrou na fila de ${f.nome} ${f.emoji} — ${f.agents.length} atendente(s).` });
    const stepMs = instant ? 800 : 1600;
    const step = (p: number) => {
      if (p <= 0) {
        const nome = f.agents[Math.floor(Math.random() * f.agents.length)];
        setAgent(nome); setPhase("agent");
        addMsg({ id: nid(), from: "system", text: `${nome} assumiu o seu atendimento.` });
        const greet = m === "ia"
          ? { id: nid(), from: "agent" as From, author: nome, text: `Oi! Sou o ${nome} ✨. Posso resolver por aqui: me pergunte sobre planos, a IA ou como começar.` }
          : { id: nid(), from: "agent" as From, author: nome, text: `Oi! Aqui é ${nome}, do time de ${f.nome}. 👋 Como posso te ajudar?` };
        say(greet, 900, nome);
        return;
      }
      setQueuePos(p);
      later(() => step(p - 1), stepMs);
    };
    later(() => step(pos - 1), stepMs);
  };

  const falarComIA = () => entrarNaFila(FILA_IA, "ia", true);
  const pedirFilaHumana = () => {
    setPhase("fila");
    say({ id: nid(), from: "bot", text: `Certo! Temos ${TOTAL_HUMANOS} atendentes humanos online. Com qual time você quer falar?` }, 500);
  };

  const respostaAgente = (nome: string, fnome: string): Msg => {
    const opts = [
      "Perfeito, já estou verificando isso pra você. 🙌",
      "Entendi! Consigo resolver por aqui mesmo. Me dá 1 minutinho?",
      "Boa pergunta — vou te explicar certinho.",
      `Se preferir, posso continuar com você no WhatsApp do time de ${fnome}.`,
    ];
    return { id: nid(), from: "agent", author: nome, text: opts[Math.floor(Math.random() * opts.length)] };
  };

  const encerrar = () => {
    clearTimers();
    addMsg({ id: nid(), from: "system", text: "Atendimento encerrado ✅ Obrigado pelo contato!" });
    setPhase("inicio"); setModo(null); setFila(null); setAgent(null);
    say({ id: nid(), from: "bot", text: "Precisa de mais alguma coisa? Quer falar com a IA ou com um humano?" }, 700);
  };

  const respIA = (t: string) => {
    const l = t.toLowerCase();
    if (/plano|preç|preco|valor/.test(l)) say(botAnswer("planos"), 700);
    else if (/\bia\b|intelig|claude|autom/.test(l)) say(botAnswer("ia"), 700);
    else if (/começ|comec|cadastr|conta|grátis|gratis/.test(l)) say(botAnswer("comecar"), 700);
    else say({ id: nid(), from: "agent", author: "Assistente IA", text: "Consigo te ajudar com isso ou posso chamar um atendente humano. Quer falar com o time?" }, 700);
  };

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    addMsg({ id: nid(), from: "user", text: t });
    setInput("");
    if (phase === "agent" && modo === "humano" && agent && fila) say(respostaAgente(agent, fila.nome), 900, agent);
    else respIA(t); // IA responde na fila da IA e antes de escolher
  };

  if (!ready) return null;

  const headerTitle = phase === "agent" && agent ? agent : phase === "queue" && fila ? `Na fila · ${fila.nome}` : "Assistente Comenta";
  const headerSub =
    phase === "agent" && modo === "ia" ? "Atendimento IA" :
    phase === "agent" && fila ? `Atendente · ${fila.nome}` :
    phase === "queue" ? `Posição ${queuePos} · aguarde` :
    `IA + ${TOTAL_HUMANOS} humanos online`;

  return (
    <>
      {/* ===== Banner LGPD ===== */}
      {consent === "unknown" && (
        <div className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-4">
          <div className="mx-auto flex max-w-4xl flex-col gap-4 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur sm:flex-row sm:items-center sm:p-5">
            <div className="text-2xl">🍪</div>
            <p className="flex-1 text-sm text-slate-600">
              Usamos cookies para melhorar sua experiência, analisar o tráfego e
              personalizar conteúdo. Ao aceitar, você concorda com nossa{" "}
              <a href="#" className="font-medium text-fuchsia-600 underline">Política de Privacidade</a>{" "}
              e os <a href="#" className="font-medium text-fuchsia-600 underline">Termos de Uso</a>.
            </p>
            <div className="flex flex-none gap-2">
              <button onClick={decline} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">Recusar</button>
              <button onClick={accept} className="rounded-full bg-gradient-to-r from-fuchsia-600 to-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/25 transition hover:opacity-90">Aceitar e continuar</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Chat ===== */}
      {consent !== "unknown" && (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
          {open && (
            <div className="flex h-[32rem] w-[23rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
              <div className="flex items-center gap-3 bg-gradient-to-r from-fuchsia-600 to-indigo-600 px-4 py-3 text-white">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-lg">
                  {phase === "agent" && modo === "humano" && agent ? agent[0] : "✨"}
                </span>
                <div className="flex-1">
                  <div className="text-sm font-bold leading-tight">{headerTitle}</div>
                  <div className="flex items-center gap-1 text-xs text-fuchsia-100">
                    <span className="h-2 w-2 rounded-full bg-emerald-300" /> {headerSub}
                  </div>
                </div>
                {phase === "agent" && (
                  <button onClick={encerrar} className="rounded-full bg-white/15 px-2 py-1 text-xs font-semibold hover:bg-white/25">Encerrar</button>
                )}
                <button onClick={() => setOpen(false)} aria-label="Fechar chat" className="rounded-full p-1 text-white/90 hover:bg-white/10">✕</button>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
                {messages.map((m) => {
                  if (m.from === "system") {
                    return (
                      <div key={m.id} className="flex justify-center">
                        <span className="rounded-full bg-slate-200 px-3 py-1 text-center text-[11px] font-medium text-slate-600">{m.text}</span>
                      </div>
                    );
                  }
                  const mine = m.from === "user";
                  return (
                    <div key={m.id} className={`flex ${mine ? "justify-end" : ""}`}>
                      <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${mine ? "bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white" : "border border-slate-200 bg-white text-slate-700"}`}>
                        {m.from === "agent" && m.author && (<div className="mb-0.5 text-[11px] font-bold text-fuchsia-600">{m.author}</div>)}
                        {m.text}
                        {m.cta && (<a href={m.cta.href} className="mt-2 block rounded-lg bg-slate-900 px-3 py-1.5 text-center text-xs font-semibold text-white hover:opacity-90">{m.cta.label}</a>)}
                      </div>
                    </div>
                  );
                })}

                {/* seleção de time (fila humana) */}
                {phase === "fila" && !typing && (
                  <div className="flex flex-col gap-2">
                    {FILAS_HUMANAS.map((f) => (
                      <button key={f.id} onClick={() => entrarNaFila(f, "humano")} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:border-fuchsia-300 hover:bg-fuchsia-50">
                        <span className="text-lg">{f.emoji}</span> {f.nome}
                        <span className="ml-auto text-xs text-slate-400">{f.agents.length} online</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* card da fila */}
                {phase === "queue" && fila && (
                  <div className={`rounded-2xl border p-4 text-center ${modo === "ia" ? "border-indigo-200 bg-indigo-50" : "border-fuchsia-200 bg-fuchsia-50"}`}>
                    <div className={`text-3xl font-extrabold ${modo === "ia" ? "text-indigo-600" : "text-fuchsia-600"}`}>{queuePos}º</div>
                    <div className="text-xs text-slate-600">na fila de {fila.nome} · ~{queuePos} min</div>
                    {modo === "humano" && (
                      <a href={waLink(`fila de ${fila.nome}`)} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-white hover:opacity-90">💬 Continuar no WhatsApp</a>
                    )}
                  </div>
                )}

                {typing && (
                  <div className="flex">
                    <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-400">{typing.author} digitando…</div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* ações rápidas por fase */}
              <div className="flex flex-wrap gap-2 border-t border-slate-100 bg-white px-3 pt-3">
                {phase === "inicio" && (
                  <>
                    <button onClick={falarComIA} className="qr border-indigo-300 text-indigo-700">Falar com a IA ✨</button>
                    <button onClick={pedirFilaHumana} className="qr border-fuchsia-300 text-fuchsia-700">Falar com um humano 🧑‍💼</button>
                  </>
                )}
                {phase === "agent" && modo === "ia" && (
                  <>
                    <button onClick={() => say(botAnswer("planos"), 600)} className="qr">Ver planos 💳</button>
                    <button onClick={() => say(botAnswer("ia"), 600)} className="qr">Como a IA funciona? ✨</button>
                    <button onClick={pedirFilaHumana} className="qr">Falar com um humano 🧑‍💼</button>
                    <button onClick={encerrar} className="qr">Encerrar</button>
                  </>
                )}
                {phase === "agent" && modo === "humano" && fila && (
                  <>
                    <a href={waLink(`atendimento de ${fila.nome}`)} target="_blank" rel="noopener noreferrer" className="qr border-emerald-300 text-emerald-700">💬 Continuar no WhatsApp</a>
                    <button onClick={encerrar} className="qr">Encerrar atendimento</button>
                  </>
                )}
                {(phase === "queue" || phase === "fila") && (<button onClick={encerrar} className="qr">Cancelar</button>)}
              </div>

              <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2 bg-white p-3">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={phase === "agent" && modo === "humano" ? "Fale com o atendente…" : "Escreva uma mensagem…"}
                  className="flex-1 rounded-full border border-slate-300 px-4 py-2 text-sm focus:border-fuchsia-400 focus:outline-none"
                />
                <button type="submit" aria-label="Enviar" className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white">➤</button>
              </form>
            </div>
          )}

          <button
            onClick={() => { setOpen((o) => !o); if (!greeted.current) startConversation(); }}
            aria-label={open ? "Fechar chat" : "Abrir chat"}
            className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-600 to-indigo-600 text-2xl text-white shadow-xl shadow-fuchsia-500/30 transition hover:scale-105"
          >
            {open ? "✕" : "💬"}
          </button>
        </div>
      )}

      <style jsx>{`
        .qr {
          border-radius: 9999px;
          border: 1px solid #e2e8f0;
          padding: 0.25rem 0.75rem;
          font-size: 0.75rem;
          font-weight: 500;
          color: #475569;
          transition: all 0.15s;
        }
        .qr:hover { border-color: #f0abfc; color: #a21caf; }
      `}</style>
    </>
  );
}
