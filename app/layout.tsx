import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hebert Paes - Plataforma Pessoal",
  description:
    "Next.js no Cloud Run, com Firestore, autenticação segura e Blog otimizado para SEO",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
