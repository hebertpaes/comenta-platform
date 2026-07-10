"use client";

// EngagementDock — consentimento (LGPD) + atendimento dentro do chat.
// Fluxo:
//  1. 1ª visita: banner de cookies/termos. Ao ACEITAR, o assistente abre
//     sozinho e puxa conversa.
//  2. O bot resolve dúvidas comuns (planos, IA, começar).
//  3. "Falar com um atendente" -> escolhe uma FILA (Suporte/Vendas/Financeiro)
//     -> entra na FILA (posição + tempo) -> um dos VÁRIOS ATENDENTES assume
//     -> conversa humana. A qualquer momento dá pra continuar no WHATSAPP.

import React, { useCallback, useEffect, useRef, useState } from "react";

type Consent = "unknown" | "accepted" | "declined";
type Phase = "bot" | "fila" | "queue" | "agent";
type From = "bot" | "user" | "agent" | "system";
type Msg = { id: number; from: From; text: string; author?: string; cta?: { label: string; href: string } };

const STORAGE_KEY = "comenta_consent";
const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP || "5566999999999";

const FILAS = [
  { id: "suporte", nome: "Suporte", emoji: "🛟", agents: ["Camila", "Diego"] },
  { id: "vendas", nome: "Vendas", emoji: "💼", agents: ["Priscila", "Marcos"] },
  { id: "financeiro", nome: "Financeiro", emoji: "💳", agents: ["Rafaela"] },
];
const TOTAL_AGENTS = FILAS.reduce((n, f) => n + f.agents.length, 0);

let mid = 1;
const nid = () => mid++;

function botAnswer(key: string): Msg {
  switch (key) {
    case "planos":
      return { id: nid(), from: "bot", text: "Temos 3 planos: Free (R$0), Pro (R$99/mês) e Business (R$299/mês).", cta: { label: "Ver planos", href: "#planos" } };
    case "ia":
      return { id: nid(), from: "bot", text: "A IA (Claude) classifica, resume e sugere a resposta — você só revisa e envia. 👇", cta: { label: "Ver a IA em ação", href: "#ia" } };
    case "comecar":
      return { id: nid(), from: "bot", text: "É só criar sua conta no painel — sem cartão de crédito. 🚀", cta: { label: "Criar conta grátis", href: "https://app.comenta.com.br" } };
    default:
      return { id: nid(), from: "bot", text: "Posso te ajudar com planos, como a IA funciona ou te passar para um atendente. O que prefere?" };
  }
}

function waLink(contexto: string) {
  const text = `Olá! Vim do site do Comenta e gostaria de falar sobre: ${contexto}`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}

export default function EngagementDock() {
  const [consent, setConsent] = useState<Consent>("unknown");
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState<false | { author: string }>(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");

  const [phase, setPhase] = useState<Phase>("bot");
  const [fila, setFila] = useState<(typeof FILAS)[number] | null>(null);
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
    setTyping({ author: author ?? (m.from === "agent" ? m.author ?? "Atendente" : "Assistente") });
    later(() => { setTyping(false); addMsg(m); }, delay);
  }, []);

  const startConversation = useCallback(() => {
    if (greeted.current) return;
    greeted.current = true;
    setOpen(true);
    say({ id: nid(), from: "bot", text: "Olá! 👋 Sou o assistente do Comenta. Posso resolver por aqui ou te levar a um atendente. Como posso ajudar?" }, 600);
  }, [say]);

  const accept = () => { persist("accepted"); setConsent("accepted"); later(startConversation, 800); };
  const decline = () => { persist("declined"); setConsent("declined"); };

  // ---- fluxo de atendimento ----
  const pedirFila = () => {
    setPhase("fila");
    say({ id: nid(), from: "bot", text: `Claro! Temos ${TOTAL_AGENTS} atendentes online agora. Com qual time você quer falar?` }, 500);
  };

  const entrarNaFila = (f: (typeof FILAS)[number]) => {
    setFila(f);
    setPhase("queue");
    const pos = 1 + Math.floor(Math.random() * 3); // 1..3
    setQueuePos(pos);
    addMsg({ id: nid(), from: "system", text: `Você entrou na fila de ${f.nome} ${f.emoji} — ${f.agents.length} atendente(s) neste time.` });

    // conta regressiva da fila
    const step = (p: number) => {
      if (p <= 0) {
        const nome = f.agents[Math.floor(Math.random() * f.agents.length)];
        setAgent(nome);
        setPhase("agent");
        addMsg({ id: nid(), from: "system", text: `${nome} assumiu o seu atendimento.` });
        say({ id: nid(), from: "agent", author: nome, text: `Oi! Aqui é ${nome}, do time de ${f.nome}. 👋 Como posso te ajudar?` }, 900, nome);
        return;
      }
      setQueuePos(p);
      later(() => step(p - 1), 1600);
    };
    later(() => step(pos - 1), 1600);
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
    setPhase("bot"); setFila(null); setAgent(null);
    say({ id: nid(), from: "bot", text: "Precisa de mais alguma coisa? Posso ajudar com planos, IA ou chamar um atendente." }, 700);
  };

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    addMsg({ id: nid(), from: "user", text: t });
    setInput("");
    if (phase === "agent" && agent && fila) {
      say(respostaAgente(agent, fila.nome), 900, agent);
    } else {
      // bot tenta resolver; se não for FAQ, oferece atendente
      const lower = t.toLowerCase();
      if (/plano|preç|preco|valor/.test(lower)) say(botAnswer("planos"), 700);
      else if (/\bia\b|intelig|claude|autom/.test(lower)) say(botAnswer("ia"), 700);
      else if (/começ|comec|cadastr|conta|grátis|gratis/.test(lower)) say(botAnswer("comecar"), 700);
      else say({ id: nid(), from: "bot", text: "Posso te passar para um atendente para resolver isso. Quer falar com o time?" }, 700);
    }
  };

  if (!ready) return null;

  const headerTitle =
    phase === "agent" && agent ? agent : phase === "queue" && fila ? `Na fila · ${fila.nome}` : "Assistente Comenta";
  const headerSub =
    phase === "agent" && fila ? `Atendente · ${fila.nome}` :
    phase === "queue" ? `Posição ${queuePos} · aguarde` :
    `${TOTAL_AGENTS} atendentes online`;

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
              {/* header */}
              <div className="flex items-center gap-3 bg-gradient-to-r from-fuchsia-600 to-indigo-600 px-4 py-3 text-white">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-lg">
                  {phase === "agent" && agent ? agent[0] : "✨"}
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

              {/* mensagens */}
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
                        {m.from === "agent" && m.author && (
                          <div className="mb-0.5 text-[11px] font-bold text-fuchsia-600">{m.author}</div>
                        )}
                        {m.text}
                        {m.cta && (
                          <a href={m.cta.href} className="mt-2 block rounded-lg bg-slate-900 px-3 py-1.5 text-center text-xs font-semibold text-white hover:opacity-90">{m.cta.label}</a>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* seleção de fila */}
                {phase === "fila" && !typing && (
                  <div className="flex flex-col gap-2">
                    {FILAS.map((f) => (
                      <button key={f.id} onClick={() => entrarNaFila(f)} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:border-fuchsia-300 hover:bg-fuchsia-50">
                        <span className="text-lg">{f.emoji}</span> {f.nome}
                        <span className="ml-auto text-xs text-slate-400">{f.agents.length} online</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* card da fila */}
                {phase === "queue" && fila && (
                  <div className="rounded-2xl border border-fuchsia-200 bg-fuchsia-50 p-4 text-center">
                    <div className="text-3xl font-extrabold text-fuchsia-600">{queuePos}º</div>
                    <div className="text-xs text-slate-600">na fila de {fila.nome} · ~{queuePos} min</div>
                    <a href={waLink(`fila de ${fila.nome}`)} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-white hover:opacity-90">
                      💬 Continuar no WhatsApp
                    </a>
                  </div>
                )}

                {typing && (
                  <div className="flex">
                    <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-400">
                      {typing.author} digitando…
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* ações rápidas conforme a fase */}
              <div className="flex flex-wrap gap-2 border-t border-slate-100 bg-white px-3 pt-3">
                {phase === "bot" && (
                  <>
                    <button onClick={() => say(botAnswer("planos"), 600)} className="qr">Ver planos 💳</button>
                    <button onClick={() => say(botAnswer("ia"), 600)} className="qr">Como a IA funciona? ✨</button>
                    <button onClick={pedirFila} className="qr border-fuchsia-300 text-fuchsia-700">Falar com um atendente 🧑‍💼</button>
                  </>
                )}
                {phase === "agent" && fila && (
                  <>
                    <a href={waLink(`atendimento de ${fila.nome}`)} target="_blank" rel="noopener noreferrer" className="qr border-emerald-300 text-emerald-700">💬 Continuar no WhatsApp</a>
                    <button onClick={encerrar} className="qr">Encerrar atendimento</button>
                  </>
                )}
                {(phase === "queue" || phase === "fila") && (
                  <button onClick={encerrar} className="qr">Cancelar</button>
                )}
              </div>

              {/* input */}
              <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2 bg-white p-3">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={phase === "agent" ? "Fale com o atendente…" : "Escreva uma mensagem…"}
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
