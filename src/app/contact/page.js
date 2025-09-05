// src/app/contact/page.js
"use client";

import React from "react";
import Link from "next/link";
import styles from "./contact.module.css"; // Estilos específicos para a página de contato
import Footer from "../../components/Footer/Footer"; // Importa o rodapé

export default function ContactPage() {
  // Seus contatos de WhatsApp
  const whatsappContact1 = {
    number: "5511987654321", // Substitua pelo seu primeiro número
    label: "WhatsApp Vendas (Atendimento Geral)",
    message: "Olá! Gostaria de mais informações sobre os iPhones.",
  };

  const whatsappContact2 = {
    number: "5511912345678", // Substitua pelo seu segundo número
    label: "WhatsApp Suporte (Pós-Venda)",
    message: "Olá! Preciso de suporte para um iPhone que comprei.",
  };

  const websiteLink = {
    url: "/", // Link para a página inicial da sua loja
    label: "Visite Nossa Loja Online",
  };

  const handleWhatsappClick = (contact) => {
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${
      contact.number
    }&text=${encodeURIComponent(contact.message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.logoLink}>
          <img
            src="/iphone-logo.png"
            alt="iPhones Pro Store Logo"
            className={styles.logoImage}
          />
        </Link>
      </header>

      <main className={styles.mainContent}>
        <h1 className={styles.pageTitle}>Conecte-se Conosco</h1>
        <p className={styles.subtitle}>
          Escolha a melhor forma de falar com a iPhones Pro Store.
        </p>

        <div className={styles.linktree}>
          <button
            onClick={() => handleWhatsappClick(whatsappContact1)}
            className={`${styles.linkButton} ${styles.whatsappButton}`}
          >
            {whatsappContact1.label}
          </button>

          <button
            onClick={() => handleWhatsappClick(whatsappContact2)}
            className={`${styles.linkButton} ${styles.whatsappButton}`}
          >
            {whatsappContact2.label}
          </button>

          <Link
            href={websiteLink.url}
            className={`${styles.linkButton} ${styles.websiteButton}`}
          >
            {websiteLink.label}
          </Link>

          {/* Você pode adicionar mais links aqui, se necessário */}
          {/* <a href="https://instagram.com/seuperfil" target="_blank" rel="noopener noreferrer" className={`${styles.linkButton} ${styles.socialButton}`}>
            Nosso Instagram
          </a> */}
        </div>
      </main>
    </div>
  );
}
