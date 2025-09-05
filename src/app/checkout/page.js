// src/app/checkout/page.js
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./checkout.module.css";
import globalStoreStyles from "../page.module.css";
import Loader from "../../components/Loader/Loader";
import { useToast } from "../../components/Toast/ToastContext";

// Importa Firestore para carregar itens do carrinho (se necessário, ou simulamos)
import { db, auth, appId } from "../firebase/config";
import {
  collection,
  query,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

// Define a base da URL da API.
const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export default function CheckoutPage() {
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

  // Listener para o userId do Firebase (para carregar o carrinho)
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        // Se não há usuário, não pode ter carrinho. Redireciona para a loja.
        showToast(
          "Você precisa selecionar um iPhone para finalizar a compra.",
          "info"
        );
        router.push("/");
      }
    });
    return () => unsubscribeAuth();
  }, [router, showToast]);

  // Efeito para buscar os detalhes do iPhone quando a página de checkout carrega
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

    // Preparar os produtos para o backend
    const productsForOrder = [
      {
        iphoneId: iphone.id,
        name: iphone.nome,
        quantity: 1, // Sempre 1 para compra direta
        price: iphone.preco_promocional || iphone.preco_tabela,
        imageUrl:
          iphone.imagens_urls && iphone.imagens_urls.length > 0
            ? iphone.imagens_urls[0]
            : "https://placehold.co/100x100/e0e0e0/333333?text=iPhone",
      },
    ];

    const orderData = {
      cliente_nome: formData.nome,
      cliente_email: formData.email,
      cliente_telefone: formData.telefone,
      cliente_endereco: formData.endereco,
      produtos: productsForOrder, // Array com o item único
      total: total,
      status: "pendente", // Status inicial do pedido
    };

    try {
      // Envia o pedido para o backend
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok) {
        showToast(
          "Pedido registrado com sucesso! Redirecionando para o pagamento...",
          "success"
        );

        // --- NOVO: Redirecionamento para o link de pagamento do Mercado Pago ---
        // Este é um LINK DE PAGAMENTO DE EXEMPLO para o Mercado Pago.
        // Em um cenário real, você geraria um link dinâmico via API do Mercado Pago
        // ou usaria um link fixo de um produto/serviço que você criou no seu painel.
        // O Mercado Pago tem links de pagamento como:
        // https://mpago.la/xpto ou https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=...
        // Para testes, pode ser um link de um produto Mercado Pago que você criou no seu dashboard.

        const mercadoPagoPaymentLink = `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=SEU_ID_DE_PREFERENCIA_AQUI`;
        // Ou um link mais genérico para testes (pode não funcionar para valores dinâmicos sem API):
        const genericMercadoPagoLink = `https://www.mercadopago.com.br/pagar-online/checkout/v1/redirect?amount=${total.toFixed(
          2
        )}&description=${encodeURIComponent(iphone.nome)}`;

        window.location.href = genericMercadoPagoLink; // Redireciona o usuário para o Mercado Pago

        // Se você quiser a página de confirmação APÓS salvar o pedido E ANTES de ir para o Mercado Pago,
        // você teria que mudar o fluxo aqui (redirecionar para /order-confirmation e lá ter um botão "Pagar").
        // Por simplicidade, vamos direto para o Mercado Pago.
      } else {
        showToast(
          "Erro ao finalizar pedido: " + (data.message || "Erro desconhecido."),
          "error"
        );
        console.error("Detalhes do erro do pedido:", data.error);
      }
    } catch (error) {
      console.error("Erro na requisição de finalização do pedido:", error);
      showToast(
        "Erro de conexão ao finalizar o pedido. Tente novamente.",
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
