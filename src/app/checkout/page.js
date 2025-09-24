// src/app/checkout/page.js
"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./checkout.module.css";
import globalStoreStyles from "../page.module.css";
import Loader from "../../components/Loader/Loader";
import { useToast } from "../../components/Toast/ToastContext";

import { db, auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";

// Define a base da URL da API.
const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

// 🔹 Componente interno que usa `useSearchParams`
function CheckoutInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const iphoneId = searchParams.get("iphoneId");
  const { showToast } = useToast();

  const [iphone, setIphone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
  });

  // Listener para o userId do Firebase
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        showToast(
          "Você precisa selecionar um iPhone para finalizar a compra.",
          "info"
        );
        router.push("/");
      }
    });
    return () => unsubscribeAuth();
  }, [router, showToast]);

  // Efeito para buscar os detalhes do iPhone
  useEffect(() => {
    if (!iphoneId) {
      showToast("Nenhum iPhone selecionado para compra.", "error");
      router.push("/");
      return;
    }

    const fetchIphoneDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/iphones/${iphoneId}`);
        const data = await response.json();

        if (response.ok) {
          setIphone(data.iphone);
        } else {
          setError(
            data.message || "Erro ao carregar detalhes do iPhone para checkout."
          );
        }
      } catch (err) {
        console.error(`Erro ao buscar iPhone ${iphoneId} para checkout:`, err);
        setError("Erro de conexão ao carregar iPhone para checkout.");
      } finally {
        setLoading(false);
      }
    };

    fetchIphoneDetails();
  }, [iphoneId, router, showToast]);

  const total = iphone ? iphone.preco_promocional || iphone.preco_tabela : 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsProcessingOrder(true);

    if (!iphone) {
      showToast("Nenhum iPhone disponível para finalizar a compra.", "error");
      setIsProcessingOrder(false);
      return;
    }

    if (
      !formData.nome ||
      !formData.email ||
      !formData.telefone ||
      !formData.endereco
    ) {
      showToast(
        "Por favor, preencha todos os seus dados para finalizar a compra.",
        "error"
      );
      setIsProcessingOrder(false);
      return;
    }

    try {
      // Número de WhatsApp da loja (DDI + DDD + número)
      const whatsappNumber = "5511950887080"; // 🔹 Substitua pelo seu número
      const message = `
Olá, quero finalizar meu pedido:

📱 Produto: ${iphone.nome}
📦 Quantidade: 1
💰 Preço: R$ ${total.toFixed(2).replace(".", ",")}

👤 Nome: ${formData.nome}
📧 Email: ${formData.email}
📞 Telefone: ${formData.telefone}
🏠 Endereço: ${formData.endereco}
`;

      const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        message
      )}`;

      showToast(
        "Pedido registrado com sucesso! Redirecionando para o WhatsApp...",
        "success"
      );

      window.location.href = whatsappLink;
    } catch (error) {
      console.error("Erro ao gerar link do WhatsApp:", error);
      showToast(
        "Erro ao redirecionar para o WhatsApp. Tente novamente.",
        "error"
      );
    } finally {
      setIsProcessingOrder(false);
    }
  };

  // 🔹 Loading
  if (loading) {
    return (
      <div className={globalStoreStyles.container}>
        <header className={globalStoreStyles.header}>
          <Link href="/" className={globalStoreStyles.logoLink}>
            <img
              src="/iphone-logo.png"
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
        <div className={globalStoreStyles.content}>
          <h2 className={globalStoreStyles.pageTitle}>
            Carregando Checkout...
          </h2>
          <Loader />
        </div>
      </div>
    );
  }

  // 🔹 Erro
  if (error) {
    return (
      <div className={globalStoreStyles.container}>
        <header className={globalStoreStyles.header}>
          <Link href="/" className={globalStoreStyles.logoLink}>
            <img
              src="/iphone-logo.png"
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
        <div className={globalStoreStyles.content}>
          <h2 className={globalStoreStyles.pageTitle}>Erro no Checkout</h2>
          <p className={globalStoreStyles.errorMessage}>Erro: {error}</p>
          <p className={globalStoreStyles.noProductsMessage}>
            Voltar para a <Link href="/">loja</Link>.
          </p>
        </div>
      </div>
    );
  }

  // 🔹 Produto não encontrado
  if (!iphone && !loading) {
    return (
      <div className={globalStoreStyles.container}>
        <header className={globalStoreStyles.header}>
          <Link href="/" className={globalStoreStyles.logoLink}>
            <img
              src="/iphone-logo.png"
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
        <div className={globalStoreStyles.content}>
          <h2 className={globalStoreStyles.pageTitle}>
            iPhone não encontrado para Checkout.
          </h2>
          <p className={globalStoreStyles.noProductsMessage}>
            O produto selecionado não foi encontrado. Voltar para a{" "}
            <Link href="/">loja</Link>.
          </p>
        </div>
      </div>
    );
  }

  // 🔹 Render principal
  return (
    <div className={globalStoreStyles.container}>
      <header className={globalStoreStyles.header}>
        <Link href="/" className={globalStoreStyles.logoLink}>
          <img
            src="/iphone-logo.png"
            alt="iPhones Pro Stopre Logo"
            className={globalStoreStyles.logoImage}
          />
        </Link>
        <nav className={globalStoreStyles.mainNav}>
          <Link href="/dashboard" className={globalStoreStyles.navLink}>
            Dashboard
          </Link>
        </nav>
      </header>

      <div className={globalStoreStyles.content}>
        <h2 className={styles.pageTitle}>Finalizar Compra</h2>

        <div className={styles.checkoutContainer}>
          <form onSubmit={handlePlaceOrder} className={styles.checkoutForm}>
            <h3 className={styles.sectionTitle}>Seus Dados</h3>
            <div className={styles.formGroup}>
              <label htmlFor="nome">Nome Completo *</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
                className={styles.inputField}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">E-mail *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={styles.inputField}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="telefone">Telefone *</label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                required
                className={styles.inputField}
                placeholder="(XX) XXXXX-XXXX"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="endereco">Endereço Completo *</label>
              <textarea
                id="endereco"
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
                required
                className={styles.textareaField}
                rows="3"
                placeholder="Rua, Número, Bairro, Cidade - Estado, CEP"
              ></textarea>
            </div>

            <button
              type="submit"
              className={styles.placeOrderButton}
              disabled={isProcessingOrder}
            >
              {isProcessingOrder ? "Processando..." : "Finalizar Pedido"}
            </button>
          </form>

          <div className={styles.orderSummary}>
            <h3 className={styles.sectionTitle}>Resumo do Pedido</h3>
            {iphone && (
              <div className={styles.summaryItems}>
                <div className={styles.summaryItem}>
                  <img
                    src={
                      iphone.imagens_urls?.[0] ||
                      "https://placehold.co/60x60/e0e0e0/333333?text=iPhone"
                    }
                    alt={iphone.nome}
                    className={styles.summaryItemImage}
                  />
                  <div className={styles.summaryItemDetails}>
                    <p className={styles.summaryItemName}>{iphone.nome}</p>
                    <p className={styles.summaryItemQuantity}>Quantidade: 1</p>
                    <p className={styles.summaryItemPrice}>
                      R${" "}
                      {parseFloat(
                        iphone.preco_promocional || iphone.preco_tabela
                      )
                        .toFixed(2)
                        .replace(".", ",")}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className={styles.summaryTotalRow}>
              <span>Total:</span>
              <span>
                R${" "}
                {total
                  ? parseFloat(total).toFixed(2).replace(".", ",")
                  : "0,00"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 🔹 Exporta a página com Suspense
export default function CheckoutPageWrapper() {
  return (
    <Suspense fallback={<div>Carregando checkout...</div>}>
      <CheckoutInner />
    </Suspense>
  );
}
