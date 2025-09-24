"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./checkout.module.css";
import globalStoreStyles from "../page.module.css";
import Footer from "../../components/Footer";
import Loader from "../../components/Loader/Loader";
import { useToast } from "../../components/Toast/ToastContext";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export default function CheckoutPage() {
  const router = useRouter();
  const { showToast } = useToast();

  // Estados para gerenciar o estado da página
  const [loading, setLoading] = useState(true);
  const [iphone, setIphone] = useState(null);
  const [error, setError] = useState(null);

  // Estado do formulário de dados do cliente
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
  });

  // Efeito para buscar os detalhes do iPhone ao carregar a página
  useEffect(() => {
    // Acessa o ID do iPhone através da URL (query params)
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("iphoneId");

    if (!id) {
      showToast("Nenhum iPhone selecionado para a compra.", "error");
      router.push("/");
      return;
    }

    const fetchIphoneDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/iphones/${id}`);
        const data = await response.json();

        if (response.ok) {
          setIphone(data.iphone);
        } else {
          setError(data.message || "Erro ao carregar detalhes do iPhone.");
        }
      } catch (err) {
        console.error(`Erro ao buscar detalhes do iPhone ${id}:`, err);
        setError("Erro de conexão com o servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchIphoneDetails();
  }, [router, showToast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

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
      return;
    }

    // Constrói a mensagem para o WhatsApp
    const whatsappNumber = "5511999999999"; // Substitua pelo seu número de WhatsApp real
    const message = `Olá! Tenho interesse no iPhone ${iphone.nome} - ${
      iphone.armazenamento_gb
    }GB, pelo preço de R$ ${parseFloat(
      iphone.preco_promocional || iphone.preco_tabela
    )
      .toFixed(2)
      .replace(".", ",")}.
    
Meus dados para a compra são:
Nome: ${formData.nome}
Email: ${formData.email}
Telefone: ${formData.telefone}
Endereço: ${formData.endereco}`;

    const whatsappLink = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(
      message
    )}`;

    // Redireciona o usuário para o WhatsApp
    window.open(whatsappLink, "_blank");
  };

  // Renderizações condicionais
  if (loading) {
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
          <nav className={globalStoreStyles.mainNav}></nav>
        </header>
        <div className={globalStoreStyles.content}>
          <h2 className={globalStoreStyles.pageTitle}>
            Carregando Detalhes do Pedido...
          </h2>
          <Loader />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !iphone) {
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
          <nav className={globalStoreStyles.mainNav}></nav>
        </header>
        <div className={globalStoreStyles.content}>
          <h2 className={globalStoreStyles.pageTitle}>Erro no Checkout</h2>
          <p className={globalStoreStyles.errorMessage}>
            Erro: {error || "iPhone não encontrado para o checkout."}
          </p>
          <p className={globalStoreStyles.noProductsMessage}>
            Voltar para a <Link href="/">loja</Link>.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

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
        <nav className={globalStoreStyles.mainNav}></nav>
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

            <button type="submit" className={styles.placeOrderButton}>
              Finalizar Pedido (WhatsApp)
            </button>
          </form>

          <div className={styles.orderSummary}>
            <h3 className={styles.sectionTitle}>Resumo do Pedido</h3>
            <div className={styles.summaryItems}>
              <div className={styles.summaryItem}>
                <img
                  src={iphone?.imagens_urls?.[0]}
                  alt={iphone?.nome}
                  className={styles.summaryItemImage}
                />
                <div className={styles.summaryItemDetails}>
                  <p className={styles.summaryItemName}>{iphone?.nome}</p>
                  <p className={styles.summaryItemQuantity}>Quantidade: 1</p>
                  <p className={styles.summaryItemPrice}>
                    R${" "}
                    {parseFloat(
                      iphone?.preco_promocional || iphone?.preco_tabela
                    )
                      .toFixed(2)
                      .replace(".", ",")}
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.summaryTotalRow}>
              <span>Total:</span>
              <span>
                R${" "}
                {parseFloat(iphone?.preco_promocional || iphone?.preco_tabela)
                  .toFixed(2)
                  .replace(".", ",")}
              </span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
