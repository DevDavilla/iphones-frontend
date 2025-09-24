// src/components/Footer/Footer.jsx
"use client";

import React from "react";
import Link from "next/link";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footerContainer}>
      <div className={styles.footerContent}>
        {/* Identidade e Credibilidade */}
        <div className={styles.footerSection}>
          <h3 className={styles.sectionTitle}>iPhones PRO Store</h3>
          <p className={styles.sectionText}>
            A loja referência em iPhones seminovos e novos. Garantia de
            procedência, entrega rápida e o melhor preço do Brasil.
          </p>
        </div>

        {/* Navegação Rápida */}
        <div className={styles.footerSection}>
          <h3 className={styles.sectionTitle}>Navegação</h3>
          <ul className={styles.navList}>
            <li>
              <Link href="/" className={styles.navLink}>
                Página Inicial
              </Link>
            </li>
            <li>
              <Link href="/" className={styles.navLink}>
                Nossos iPhones
              </Link>
            </li>
            <li>
              <Link href="/suporte-garantia" className={styles.navLink}>
                Suporte & Garantia
              </Link>
            </li>
            <li>
              <Link href="/sobre-nos" className={styles.navLink}>
                Sobre Nós
              </Link>
            </li>
            <li>
              <Link href="/politica-de-privacidade" className={styles.navLink}>
                Política de Privacidade
              </Link>
            </li>
            <li>
              <Link href="/termos-de-uso" className={styles.navLink}>
                Termos de Uso
              </Link>
            </li>
          </ul>
        </div>

        {/* Contato e Suporte */}
        <div className={styles.footerSection}>
          <h3 className={styles.sectionTitle}>Atendimento</h3>
          <p className={styles.sectionText}>
            E-mail:{" "}
            <a href="mailto:contato@iphonespro.com.br">
              contato@iphonespro.com.br
            </a>
            <br />
            WhatsApp:{" "}
            <a
              href="https://wa.me/5511950887080"
              target="_blank"
              rel="noopener noreferrer"
            >
              (11) 95088-7080
            </a>
            <br />
            Endereço: Rua Santa Ifigênia 600, Loja 17, São Paulo/SP
          </p>

          {/* Redes Sociais relevantes para vendas */}
          <div className={styles.socialLinks}>
            <a
              href="https://www.instagram.com/natan_iphonesoficial/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
            >
              {/* Instagram */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
            <a
              href="https://facebook.com/seuperfil"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
            >
              {/* Facebook */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Parte de baixo: segurança + direitos */}
      <div className={styles.footerBottom}>
        <p>
          &copy; {new Date().getFullYear()} iPhones PRO Store. Todos os direitos
          reservados.
        </p>
        <p className={styles.securityText}>
          ✅ Compra 100% Segura | 🔒 Site protegido por SSL | 📦 Entrega
          garantida
        </p>
      </div>
    </footer>
  );
};

export default Footer;
