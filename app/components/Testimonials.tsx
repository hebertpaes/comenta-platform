"use client";

import React, { useEffect, useState } from "react";

type Depoimento = {
  quote: string;
  name: string;
  role: string;
  initials: string;
  color: string;
};

const ITEMS: Depoimento[] = [
  {
    quote:
      "A IA sugere a resposta e a gente só revisa. Cortamos o tempo de atendimento pela metade na primeira semana.",
    name: "Marina Alves",
    role: "Head de CX · Loja Norte",
    initials: "MA",
    color: "from-fuchsia-500 to-pink-500",
  },
  {
    quote:
      "Juntar WhatsApp, Instagram e e-mail numa caixa só mudou o jogo. Nada mais cai no vácuo.",
    name: "Rafael Souza",
    role: "Fundador · Clínica Vida",
    initials: "RS",
    color: "from-indigo-500 to-sky-500",
  },
  {
    quote:
      "Os resumos automáticos deixam qualquer pessoa do time assumir uma conversa em segundos.",
    name: "Beatriz Lima",
    role: "Operações · AgênciaX",
    initials: "BL",
    color: "from-emerald-500 to-teal-500",
  },
];

export default function Testimonials() {
  const [i, setI] = useState(0);
  const n = ITEMS.length;

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % n), 6000);
    return () => clearInterval(t);
  }, [n]);

  const cur = ITEMS[i];

  return (
    <div className="relative mx-auto max-w-3xl">
      <div className="rounded-3xl border border-white/60 bg-white/80 p-8 sm:p-10 shadow-xl backdrop-blur">
        <div className="text-5xl leading-none text-fuchsia-400">“</div>
        <p className="-mt-4 text-lg sm:text-xl font-medium text-slate-800">
          {cur.quote}
        </p>
        <div className="mt-6 flex items-center gap-3">
          <span
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br ${cur.color} text-white font-bold`}
          >
            {cur.initials}
          </span>
          <div>
            <div className="font-semibold text-slate-900">{cur.name}</div>
            <div className="text-sm text-slate-500">{cur.role}</div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex justify-center gap-2">
        {ITEMS.map((t, idx) => (
          <button
            key={t.name}
            aria-label={`Depoimento ${idx + 1}`}
            onClick={() => setI(idx)}
            className={`h-2.5 rounded-full transition-all ${
              idx === i ? "w-7 bg-fuchsia-500" : "w-2.5 bg-slate-300 hover:bg-slate-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
