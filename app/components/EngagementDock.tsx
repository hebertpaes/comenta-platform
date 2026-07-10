"use client";

// EngagementDock — consentimento (LGPD) + interação automática.
// Fluxo:
//  1. Na 1ª visita mostra o banner de cookies/termos.
//  2. Ao ACEITAR, guarda o consentimento e, em seguida, o assistente de
//     chat abre sozinho e puxa conversa (respostas rápidas).
//  3. Se recusar, o chat não abre sozinho — fica disponível pelo botão.

import React, { useCallback, useEffect, useRef, useState } from "react";

type Consent = "unknown" | "accepted" | "declined";
type Msg = { id: number; from: "bot" | "user"; text: string; cta?: { label: string; href: string } };

const STORAGE_KEY = "comenta_consent";

const QUICK = [
  { label: "Ver planos 💳", key: "planos" },
  { label: "Como a IA funciona? ✨", key: "ia" },
  { label: "Começar grátis 🚀", key: "comecar" },
  { label: "Falar com atendimento 💬", key: "humano" },
];

function botReply(key: string): Msg {
  switch (key) {
    case "planos":
      return {
        id: Date.now(),
        from: "bot",
        text: "Temos 3 planos: Free (R$0), Pro (R$99/mês) e Business (R$299/mês). Quer ver a tabela completa?",
        cta: { label: "Ver planos", href: "#planos" },
      };
    case "ia":
      return {
        id: Date.now(),
        from: "bot",
        text: "A IA (Claude) classifica, resume e sugere a resposta automaticamente — você só revisa e envia. 👇",
        cta: { label: "Ver a IA em ação", href: "#ia" },
      };
    case "comecar":
      return {
        id: Date.now(),
        from: "bot",
        text: "Perfeito! É só criar sua conta no painel — sem cartão de crédito. 🚀",
        cta: { label: "Criar conta grátis", href: "https://app.comenta.com.br" },
      };
    case "humano":
      return {
        id: Date.now(),
        from: "bot",
        text: "Posso te conectar com o time. Me conta seu nome e o que você precisa que já encaminho. 🙂",
      };
    default:
      return {
        id: Date.now(),
        from: "bot",
        text: "Boa! Posso te ajudar com planos, como a IA funciona ou criar sua conta. O que prefere?",
      };
  }
}

export default function EngagementDock() {
  const [consent, setConsent] = useState<Consent>("unknown");
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const greeted = useRef(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Lê o consentimento salvo (só no cliente).
  useEffect(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY) as Consent | null;
      if (v === "accepted" || v === "declined") setConsent(v);
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, open]);

  const persist = (v: Consent) => {
    try {
      localStorage.setItem(STORAGE_KEY, v);
      document.cookie = `${STORAGE_KEY}=${v}; max-age=31536000; path=/; SameSite=Lax`;
    } catch {}
  };

  const pushBot = useCallback((msg: Msg, delay = 700) => {
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, msg]);
    }, delay);
  }, []);

  // Interação automática: abre e cumprimenta assim que aceita.
  const startConversation = useCallback(() => {
    if (greeted.current) return;
    greeted.current = true;
    setOpen(true);
    pushBot(
      {
        id: Date.now(),
        from: "bot",
        text: "Olá! 👋 Sou o assistente do Comenta. Quer que eu te mostre como atender todos os seus canais com IA?",
      },
      600
    );
  }, [pushBot]);

  const accept = () => {
    persist("accepted");
    setConsent("accepted");
    window.setTimeout(startConversation, 800); // deixa o usuário “respirar” após aceitar
  };
  const decline = () => {
    persist("declined");
    setConsent("declined");
  };

  const send = (text: string, quickKey?: string) => {
    const t = text.trim();
    if (!t && !quickKey) return;
    setMessages((m) => [...m, { id: Date.now(), from: "user", text: t || text }]);
    setInput("");
    pushBot(botReply(quickKey ?? "default"), 800);
  };

  if (!ready) return null;

  return (
    <>
      {/* ===== Banner de consentimento (LGPD) ===== */}
      {consent === "unknown" && (
        <div className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-4">
          <div className="mx-auto flex max-w-4xl flex-col gap-4 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur sm:flex-row sm:items-center sm:p-5">
            <div className="text-2xl">🍪</div>
            <p className="flex-1 text-sm text-slate-600">
              Usamos cookies para melhorar sua experiência, analisar o tráfego e
              personalizar conteúdo. Ao aceitar, você concorda com nossa{" "}
              <a href="#" className="font-medium text-fuchsia-600 underline">
                Política de Privacidade
              </a>{" "}
              e os{" "}
              <a href="#" className="font-medium text-fuchsia-600 underline">
                Termos de Uso
              </a>
              .
            </p>
            <div className="flex flex-none gap-2">
              <button
                onClick={decline}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Recusar
              </button>
              <button
                onClick={accept}
                className="rounded-full bg-gradient-to-r from-fuchsia-600 to-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/25 transition hover:opacity-90"
              >
                Aceitar e continuar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Chat (aparece após decidir o consentimento) ===== */}
      {consent !== "unknown" && (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
          {open && (
            <div className="flex h-[30rem] w-[22rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
              {/* header */}
              <div className="flex items-center gap-3 bg-gradient-to-r from-fuchsia-600 to-indigo-600 px-4 py-3 text-white">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-lg">
                  ✨
                </span>
                <div className="flex-1">
                  <div className="text-sm font-bold leading-tight">Assistente Comenta</div>
                  <div className="flex items-center gap-1 text-xs text-fuchsia-100">
                    <span className="h-2 w-2 rounded-full bg-emerald-300" /> online agora
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Fechar chat"
                  className="rounded-full p-1 text-white/90 hover:bg-white/10"
                >
                  ✕
                </button>
              </div>

              {/* mensagens */}
              <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : ""}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${
                        m.from === "user"
                          ? "bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white"
                          : "border border-slate-200 bg-white text-slate-700"
                      }`}
                    >
                      {m.text}
                      {m.cta && (
                        <a
                          href={m.cta.href}
                          className="mt-2 block rounded-lg bg-slate-900 px-3 py-1.5 text-center text-xs font-semibold text-white hover:opacity-90"
                        >
                          {m.cta.label}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
                {typing && (
                  <div className="flex">
                    <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-400">
                      digitando…
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* respostas rápidas */}
              <div className="flex flex-wrap gap-2 border-t border-slate-100 bg-white px-3 pt-3">
                {QUICK.map((q) => (
                  <button
                    key={q.key}
                    onClick={() => send(q.label, q.key)}
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-fuchsia-300 hover:text-fuchsia-700"
                  >
                    {q.label}
                  </button>
                ))}
              </div>

              {/* input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="flex gap-2 bg-white p-3"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escreva uma mensagem…"
                  className="flex-1 rounded-full border border-slate-300 px-4 py-2 text-sm focus:border-fuchsia-400 focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Enviar"
                  className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white"
                >
                  ➤
                </button>
              </form>
            </div>
          )}

          {/* botão flutuante */}
          <button
            onClick={() => {
              setOpen((o) => !o);
              if (!greeted.current) startConversation();
            }}
            aria-label={open ? "Fechar chat" : "Abrir chat"}
            className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-600 to-indigo-600 text-2xl text-white shadow-xl shadow-fuchsia-500/30 transition hover:scale-105"
          >
            {open ? "✕" : "💬"}
          </button>
        </div>
      )}
    </>
  );
}
