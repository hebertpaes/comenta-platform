"use client";

// =============================================================
// Carrossel de notícias do hero — foto real + manchete
// =============================================================
// Espelha o layout do portal: slide grande com imagem real, manchete,
// setas ‹ ›, botão pausar/tocar, pontinhos indicadores e selo URGENTE.
// Auto-rotação a cada 6s, pausando ao passar o mouse. Recebe os itens já
// carregados no servidor (ver app/lib/news.ts) via prop `items`.

import React, { useCallback, useEffect, useRef, useState } from "react";
import type { NewsItem } from "../lib/news";

const ROTATE_MS = 6000;
const FALLBACK_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='675'>" +
      "<rect width='1200' height='675' fill='#e2e8f0'/>" +
      "<text x='50%' y='50%' text-anchor='middle' dominant-baseline='middle' " +
      "font-family='system-ui' font-size='28' fill='#64748b'>Imagem indisponível</text></svg>"
  );

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function NewsCarousel({ items }: { items: NewsItem[] }) {
  const slides = items?.length ? items : [];
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const hoverRef = useRef(false);
  const count = slides.length;

  const go = useCallback(
    (n: number) => setIndex((i) => ((n % count) + count) % count),
    [count]
  );
  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  useEffect(() => {
    if (!playing || count <= 1) return;
    const t = setInterval(() => {
      if (!hoverRef.current) setIndex((i) => (i + 1) % count);
    }, ROTATE_MS);
    return () => clearInterval(t);
  }, [playing, count]);

  if (!count) return null;

  const active = slides[index];

  return (
    <section
      className="nc"
      aria-roledescription="carrossel"
      aria-label="Últimas notícias"
      onMouseEnter={() => (hoverRef.current = true)}
      onMouseLeave={() => (hoverRef.current = false)}
    >
      <div className="nc-stage">
        {slides.map((s, i) => (
          <a
            key={s.id}
            className={`nc-slide${i === index ? " is-active" : ""}`}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-hidden={i === index ? undefined : true}
            tabIndex={i === index ? 0 : -1}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={s.image || FALLBACK_IMG}
              alt={s.title}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
              }}
            />
          </a>
        ))}

        {/* Controles no topo: URGENTE + pausar + pontinhos */}
        <div className="nc-top">
          {active.urgent && <span className="nc-urgent">URGENTE</span>}
          <div className="nc-top-right">
            <button
              type="button"
              className="nc-play"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? "Pausar" : "Reproduzir"}
              title={playing ? "Pausar" : "Reproduzir"}
            >
              {playing ? "❚❚" : "►"}
            </button>
            <div className="nc-dots" role="tablist" aria-label="Selecionar slide">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Ir para notícia ${i + 1}`}
                  className={`nc-dot${i === index ? " is-active" : ""}`}
                  onClick={() => go(i)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Setas */}
        {count > 1 && (
          <>
            <button
              type="button"
              className="nc-arrow nc-prev"
              onClick={prev}
              aria-label="Notícia anterior"
            >
              ‹
            </button>
            <button
              type="button"
              className="nc-arrow nc-next"
              onClick={next}
              aria-label="Próxima notícia"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Manchete */}
      <div className="nc-caption">
        {active.category && <span className="nc-cat">{active.category}</span>}
        <a className="nc-title" href={active.url} target="_blank" rel="noopener noreferrer">
          {active.title}
        </a>
        {active.excerpt && <p className="nc-excerpt">{active.excerpt}</p>}
        {formatDate(active.date) && <time className="nc-date">{formatDate(active.date)}</time>}
      </div>

      <style jsx>{`
        .nc {
          width: 100%;
          border-radius: 18px;
          overflow: hidden;
          background: #fff;
          box-shadow: 0 10px 30px rgba(2, 6, 23, 0.12);
          border: 1px solid rgba(15, 23, 42, 0.08);
        }
        .nc-stage {
          position: relative;
          aspect-ratio: 16 / 10;
          background: #0f172a;
        }
        .nc-slide {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.6s ease;
          pointer-events: none;
        }
        .nc-slide.is-active {
          opacity: 1;
          pointer-events: auto;
        }
        .nc-slide img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .nc-top {
          position: absolute;
          top: 12px;
          left: 12px;
          right: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          pointer-events: none;
        }
        .nc-urgent {
          pointer-events: auto;
          background: #0f172a;
          color: #fff;
          font-weight: 800;
          font-size: 12px;
          letter-spacing: 0.06em;
          padding: 6px 12px;
          border-radius: 8px;
        }
        .nc-top-right {
          pointer-events: auto;
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .nc-play {
          width: 34px;
          height: 34px;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          background: rgba(15, 23, 42, 0.55);
          color: #fff;
          font-size: 12px;
          line-height: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(4px);
        }
        .nc-play:hover {
          background: rgba(15, 23, 42, 0.75);
        }
        .nc-dots {
          display: inline-flex;
          gap: 8px;
          align-items: center;
        }
        .nc-dot {
          width: 12px;
          height: 12px;
          border-radius: 999px;
          border: 2px solid #fff;
          background: transparent;
          cursor: pointer;
          padding: 0;
        }
        .nc-dot.is-active {
          background: #34d399;
          border-color: #34d399;
        }
        .nc-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 46px;
          height: 46px;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          background: rgba(15, 23, 42, 0.55);
          color: #fff;
          font-size: 26px;
          line-height: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(4px);
        }
        .nc-arrow:hover {
          background: rgba(15, 23, 42, 0.78);
        }
        .nc-prev {
          left: 12px;
        }
        .nc-next {
          right: 12px;
        }
        .nc-caption {
          padding: 18px 20px 22px;
        }
        .nc-cat {
          display: inline-block;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #0ea5e9;
          margin-bottom: 8px;
        }
        .nc-title {
          display: block;
          font-family: Georgia, "Times New Roman", serif;
          font-weight: 700;
          font-size: clamp(20px, 2.4vw, 30px);
          line-height: 1.18;
          color: #0f172a;
          text-decoration: none;
        }
        .nc-title:hover {
          text-decoration: underline;
        }
        .nc-excerpt {
          margin: 10px 0 0;
          color: #475569;
          font-size: 15px;
          line-height: 1.5;
        }
        .nc-date {
          display: block;
          margin-top: 10px;
          font-size: 13px;
          color: #94a3b8;
        }
        :global(.dark-mode) .nc {
          background: #0f172a;
          border-color: #334155;
        }
        :global(.dark-mode) .nc-title {
          color: #e5e7eb;
        }
        :global(.dark-mode) .nc-excerpt {
          color: #cbd5e1;
        }
      `}</style>
    </section>
  );
}
