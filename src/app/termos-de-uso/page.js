"use client";

import React from "react";
import Link from "next/link";
import styles from "./TermosDeUso.module.css";

export default function TermsOfUsePage() {
  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <Link href="/" className={styles.logoLink}>
          <img
            src="/iphone-logo.png"
            alt="iPhones Pro Logo"
            className={styles.logoImage}
          />
        </Link>
        <h1 className={styles.pageTitle}>Termos de Uso</h1>
      </header>

      <main className={styles.content}>
        <section className={styles.section}>
          <h2>1. Aceitação dos Termos</h2>
          <p>
            Ao acessar e utilizar os serviços da iPhones Pro Store, você
            concorda com todos os termos e condições descritos nesta página. Se
            não concordar com algum termo, recomendamos que não utilize nossos
            serviços.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Uso do Site e dos Produtos</h2>
          <p>
            Você concorda em usar o site apenas para fins legais e de acordo com
            as políticas estabelecidas. É proibida qualquer ação que possa
            prejudicar o funcionamento da loja ou violar direitos de terceiros.
          </p>
        </section>

        <section className={styles.section}>
          <h2>3. Compras e Pagamentos</h2>
          <p>
            Todas as compras realizadas na iPhones Pro Store estão sujeitas à
            disponibilidade de estoque e aos termos de pagamento apresentados
            durante a finalização da compra.
          </p>
        </section>

        <section className={styles.section}>
          <h2>4. Garantia e Suporte</h2>
          <p>
            Todos os produtos possuem garantia conforme descrito na página de
            suporte e garantia. Para acionar a garantia ou suporte técnico,
            entre em contato pelo nosso e-mail ou WhatsApp.
          </p>
        </section>

        <section className={styles.section}>
          <h2>5. Privacidade</h2>
          <p>
            Seus dados são tratados de acordo com a nossa Política de
            Privacidade. Recomendamos a leitura completa antes de realizar
            qualquer cadastro ou compra.
          </p>
        </section>

        <section className={styles.section}>
          <h2>6. Alterações nos Termos</h2>
          <p>
            A iPhones Pro Store se reserva o direito de atualizar estes termos a
            qualquer momento. As alterações serão publicadas nesta página.
          </p>
        </section>

        <section className={styles.section}>
          <p>
            Para dúvidas adicionais, entre em contato conosco através do e-mail
            contato@iphonespro.com.br.
          </p>
        </section>
      </main>
    </div>
  );
}
