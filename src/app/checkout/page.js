"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./checkout.module.css";
import globalStoreStyles from "../page.module.css";
import Loader from "../../components/Loader/Loader";
import { useToast } from "../../components/Toast/ToastContext";

import { auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";

function CheckoutInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  // 🔹 Pegando parâmetros da URL enviados pela página de detalhes
  const nome = searchParams.get("nome");
  const preco = searchParams.get("preco");
  const imagem = searchParams.get("imagem");

  const [iphone, setIphone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
  });

  // 🔹 Autenticação Firebase
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        showToast("Você precisa estar logado para finalizar a compra.", "info");
        router.push("/");
      }
    });
    return () => unsubscribeAuth();
  }, [router, showToast]);

  // 🔹 Inicializa o iPhone com dados da URL
  useEffect(() => {
    if (!nome || !preco) {
      showToast("Nenhum iPhone selecionado para compra.", "error");
      router.push("/");
      return;
    }

    setIphone({
      nome,
      preco: parseFloat(preco),
      imagem: imagem || "/iphone-sample.png",
      quantidade: 1,
    });
    setLoading(false);
  }, [nome, preco, imagem, router, showToast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePlaceOrder = (e) => {
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
      const whatsappNumber = "5511950887080"; // Número da loja
      const precoFormatado = iphone.preco.toFixed(2).replace(".", ",");

      const message = `
\u{1F6D2} *Novo Pedido*

\u{1F4F1} Produto: ${iphone.nome}
\u{1F4E6} Quantidade: ${iphone.quantidade}
\u{1F4B0} Preço: R$ ${precoFormatado}

\u{1F464} Nome: ${formData.nome}
\u{1F4E7} Email: ${formData.email}
\u{1F4DE} Telefone: ${formData.telefone}
\u{1F3E0} Endereço: ${formData.endereco}
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
              {isProcessingOrder ? "Processando..." : "Finalizar no WhatsApp"}
            </button>
          </form>

          {iphone && (
            <div className={styles.orderSummary}>
              <h3 className={styles.sectionTitle}>Resumo do Pedido</h3>
              <div className={styles.summaryItems}>
                <div className={styles.summaryItem}>
                  <img
                    src={iphone.imagem}
                    alt={iphone.nome}
                    className={styles.summaryItemImage}
                  />
                  <div className={styles.summaryItemDetails}>
                    <p className={styles.summaryItemName}>{iphone.nome}</p>
                    <p className={styles.summaryItemQuantity}>
                      Quantidade: {iphone.quantidade}
                    </p>
                    <p className={styles.summaryItemPrice}>
                      R$ {iphone.preco.toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                </div>
              </div>
              <div className={styles.summaryTotalRow}>
                <span>Total:</span>
                <span>R$ {iphone.preco.toFixed(2).replace(".", ",")}</span>
              </div>
            </div>
          )}
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
