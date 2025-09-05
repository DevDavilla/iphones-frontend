// src/app/dashboard/login/page.js
"use client"; // Indica que este é um componente do lado do cliente

import React, { useState, useEffect } from "react"; // Importa React e hooks de estado/efeito
import { useRouter } from "next/navigation"; // Para redirecionar após o login
import Link from "next/link"; // Para links internos
import styles from "./login.module.css"; // Estilos específicos para o login
import { useToast } from "../../../components/Toast/ToastContext"; // Para mensagens de feedback

// Importa auth do Firebase e funções de autenticação
import { auth } from "../../firebase/config"; // Importa a instância de autenticação
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth"; // Funções de autenticação

export default function LoginPage() {
  const router = useRouter(); // Inicializa o hook de roteamento
  const { showToast } = useToast(); // Usa o hook para exibir Toasts

  // Estados para os campos de e-mail e senha do formulário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Estado para controlar o carregamento inicial da autenticação
  const [loading, setLoading] = useState(true);
  // Estado para controlar o botão de login (evitar múltiplos cliques)
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Efeito para verificar o estado de autenticação do usuário ao carregar a página
  useEffect(() => {
    // onAuthStateChanged: Listener que é disparado sempre que o estado de autenticação muda
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Se um usuário estiver logado, redireciona para a página principal do dashboard
        console.log(
          "LoginPage: Usuário já logado, redirecionando para /dashboard. UID:",
          user.uid
        );
        router.push("/dashboard");
      } else {
        // Se nenhum usuário estiver logado, finaliza o estado de carregamento
        console.log(
          "LoginPage: Nenhum usuário logado. Exibindo formulário de login."
        );
        setLoading(false);
      }
    });
    // Função de limpeza: desinscreve o listener ao desmontar o componente
    return () => unsubscribe();
  }, [router]); // Dependência 'router' para garantir que o efeito rode corretamente

  // Função para lidar com o envio do formulário de login
  const handleLogin = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão de recarregar a página
    setIsAuthenticating(true); // Define o estado de autenticação como verdadeiro (para desabilitar o botão)

    try {
      // Tenta autenticar o usuário com e-mail e senha
      await signInWithEmailAndPassword(auth, email, password);
      // Se o login for bem-sucedido, exibe um Toast de sucesso
      showToast("Login realizado com sucesso!", "success");
      // O redirecionamento para /dashboard será tratado pelo useEffect do onAuthStateChanged
    } catch (error) {
      console.error("Erro no login:", error.code, error.message); // Loga o erro completo no console
      let errorMessage = "Erro ao fazer login. Verifique suas credenciais."; // Mensagem de erro padrão

      // Mensagens de erro mais amigáveis baseadas nos códigos de erro do Firebase
      if (
        error.code === "auth/invalid-email" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        errorMessage = "E-mail ou senha inválidos.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage =
          "Muitas tentativas de login. Tente novamente mais tarde.";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Erro de conexão. Verifique sua internet.";
      }
      // Exibe um Toast de erro com a mensagem apropriada
      showToast(errorMessage, "error");
    } finally {
      setIsAuthenticating(false); // Finaliza o estado de autenticação (reabilita o botão)
    }
  };

  // Renderização condicional: Exibe um estado de carregamento enquanto verifica a autenticação
  if (loading) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <h1 className={styles.loginTitle}>Carregando...</h1>
          <p className={styles.loadingText}>Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Renderização principal da página de login
  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1 className={styles.loginTitle}>Login do Dashboard</h1>
        <p className={styles.loginSubtitle}>
          Acesse sua área de gerenciamento de iPhones.
        </p>

        <form onSubmit={handleLogin} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.inputField}
              placeholder="seu.email@exemplo.com"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.inputField}
              placeholder="********"
            />
          </div>
          <button
            type="submit"
            className={styles.loginButton}
            disabled={isAuthenticating}
          >
            {isAuthenticating ? "Entrando..." : "Entrar"}
          </button>
        </form>
        <p className={styles.forgotPassword}>
          <Link href="/">Voltar para a Loja</Link>
        </p>
      </div>
    </div>
  );
}
