// src/app/order-confirmation/page.js
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation"; // Para ler parâmetros da URL
import styles from "./confirmation.module.css"; // Estilos específicos da confirmação
import globalStoreStyles from "../page.module.css"; // Reutiliza header da loja

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId"); // Obtém o orderId da URL

  const [displayOrderId, setDisplayOrderId] = useState(null);

  useEffect(() => {
    if (orderId) {
      setDisplayOrderId(orderId);
    }
  }, [orderId]);

  return (
    <div className={globalStoreStyles.container}>
      <header className={globalStoreStyles.header}>
        <Link href="/" className={globalStoreStyles.logoLink}>
          <img
            src="/sua-logo-da-loja.png"
            alt="iPhones Pro Store Logo"
            className={globalStoreStyles.logoImage}
          />
        </Link>
        <nav className={globalStoreStyles.mainNav}>
          <Link href="/dashboard" className={globalStoreStyles.navLink}>
            Dashboard
          </Link>
        </nav>
      </header>

      <main className={styles.confirmationContent}>
        <div className={styles.confirmationCard}>
          <h1 className={styles.confirmationTitle}>
            Pedido Realizado com Sucesso!
          </h1>
          <p className={styles.confirmationMessage}>
            Obrigado por sua compra na iPhones Pro Store. Seu pedido foi
            processado e será enviado em breve.
          </p>
          {displayOrderId && (
            <p className={styles.orderIdText}>
              Número do seu Pedido: <strong>#{displayOrderId}</strong>
            </p>
          )}
          <div className={styles.actionButtons}>
            <Link href="/" className={styles.continueShoppingButton}>
              Continuar Comprando
            </Link>
            {/* Futuramente, link para "Meus Pedidos" se houver autenticação de cliente */}
            {/* <Link href="/my-orders" className={styles.viewOrdersButton}>
              Ver Meus Pedidos
            </Link> */}
          </div>
        </div>
      </main>
    </div>
  );
}
