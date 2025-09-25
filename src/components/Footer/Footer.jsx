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
              href="https://wa.me/5511950887080"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
            >
              {/* WhatsApp */}
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
                <path d="M21 11.5a9 9 0 1 0-2.18 5.83L21 21l-3.67-1.18A8.93 8.93 0 0 0 21 11.5z" />
                <path d="M16.5 13a2.5 2.5 0 0 1-1.5.5c-.5 0-1-.5-1-1s.5-1 1-1 1 .5 1 1" />
              </svg>
            </a>

            <a
              href="mailto:contato@iphonespro.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
            >
              {/* Email */}
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
                <path d="M4 4h16v16H4z" />
                <polyline points="22,6 12,13 2,6" />
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
