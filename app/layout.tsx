import "./globals.css";
import type { Metadata } from "next";
import EngagementDock from "./components/EngagementDock";

export const metadata: Metadata = {
  title: "Comenta — Atendimento multicanal com IA",
  description:
    "O Comenta reúne WhatsApp, Instagram, e-mail e chat em um só lugar, com IA que classifica, resume e sugere respostas. Atenda mais rápido, com o toque humano.",
  openGraph: {
    title: "Comenta — Atendimento multicanal com IA",
    description:
      "Todos os seus canais em uma caixa de entrada, com IA que responde por você.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <EngagementDock />
      </body>
    </html>
  );
}
