// src/app/dashboard/page.js
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./dashboard.module.css";
import { auth } from "../firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useToast } from "../../components/Toast/ToastContext";

export default function DashboardPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [loadingAuth, setLoadingAuth] = useState(true);
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && !currentUser.isAnonymous) {
        setUser(currentUser);
        setLoadingAuth(false);
      } else {
        console.log(
          "DashboardPage: Usuário não autenticado ou anônimo, redirecionando para login."
        );
        router.push("/dashboard/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      showToast("Logout realizado com sucesso!", "info");
      router.push("/dashboard/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      showToast("Erro ao fazer logout. Tente novamente.", "error");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loadingAuth) {
    return (
      <div className={styles.dashboardLayout}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2 className={styles.logoText}>iPhones Pro</h2>
          </div>
          <nav className={styles.navMenu}>
            <p className={styles.loadingText}>Carregando...</p>
          </nav>
        </aside>
        <main className={styles.mainContent}>
          <h1 className={styles.pageTitle}>Carregando Dashboard...</h1>
        </main>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.dashboardLayout}>
      <button onClick={toggleSidebar} className={styles.hamburgerMenu}>
        ☰
      </button>

      <aside
        className={`${styles.sidebar} ${isSidebarOpen ? "" : styles.closed}`}
        onClick={toggleSidebar}
      >
        <div className={styles.sidebarHeader}>
          <Link href="/dashboard" className={styles.logoLinkDashboard}>
            <img
              src="/iphone-logo.png"
              alt="iPhones Pro Dashboard Logo"
              className={styles.logoImageDashboard}
            />
          </Link>
        </div>
        <nav className={styles.navMenu}>
          <Link href="/" className={styles.navLink}>
            Ver Loja
          </Link>
          <Link
            href="/dashboard"
            className={`${styles.navItem} ${styles.activeNavItem}`}
          >
            Visão Geral
          </Link>
          <Link href="/dashboard/products" className={styles.navItem}>
            Meus Produtos
          </Link>
          <Link href="/dashboard/products/new" className={styles.navItem}>
            Cadastrar Novo Produto
          </Link>
          <Link href="/dashboard/orders" className={styles.navItem}>
            Pedidos
          </Link>
          <Link href="/dashboard/settings" className={styles.navItem}>
            Configurações
          </Link>
          <button
            onClick={handleLogout}
            className={`${styles.navItem} ${styles.logoutButton}`}
          >
            Sair
          </button>
        </nav>
      </aside>

      <main
        className={`${styles.mainContent} ${
          isSidebarOpen ? styles.expanded : ""
        }`}
      >
        <h1 className={styles.pageTitle}>Visão Geral do Dashboard</h1>
        <p className={styles.welcomeText}>
          Bem-vindo, {user.email || "Usuário"}!
        </p>
        <p className={styles.welcomeText}>
          Seu painel de controle de iPhones está aqui.
        </p>
      </main>
    </div>
  );
}
