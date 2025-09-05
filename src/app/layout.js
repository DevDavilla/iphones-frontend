// src/app/layout.js

import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "../components/Toast/ToastContext";
import Footer from "../components/Footer/Footer"; // NOVO: Importa o componente Footer

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "iPhones PRO Store",
  description: "Gerenciamento e vendas de iPhones",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ToastProvider>
          {children}
          <Footer />{" "}
        </ToastProvider>
      </body>
    </html>
  );
}
