// src/app/page.js
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion"; // animações
import styles from "./page.module.css";
import Testimonials from "../components/Testimonials/Testimonials";
import Loader from "../components/Loader/Loader";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export default function HomePage() {
  const [iphones, setIphones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterModel, setFilterModel] = useState("");
  const [filterStorage, setFilterStorage] = useState("");
  const [sortOrder, setSortOrder] = useState("latest");

  useEffect(() => {
    const fetchIphones = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/iphones`);
        const data = await response.json();

        if (response.ok) {
          let fetchedIphones = data.iphones;

          if (searchTerm) {
            fetchedIphones = fetchedIphones.filter(
              (iphone) =>
                iphone.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                iphone.modelo
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                (iphone.descricao_detalhada &&
                  iphone.descricao_detalhada
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()))
            );
          }

          if (filterModel) {
            fetchedIphones = fetchedIphones.filter(
              (iphone) => iphone.modelo === filterModel
            );
          }

          if (filterStorage) {
            fetchedIphones = fetchedIphones.filter(
              (iphone) => iphone.armazenamento_gb === parseInt(filterStorage)
            );
          }

          fetchedIphones.sort((a, b) => {
            if (sortOrder === "price_asc") {
              return (
                (a.preco_promocional || a.preco_tabela) -
                (b.preco_promocional || b.preco_tabela)
              );
            }
            if (sortOrder === "price_desc") {
              return (
                (b.preco_promocional || b.preco_tabela) -
                (a.preco_promocional || a.preco_tabela)
              );
            }
            return new Date(b.data_criacao) - new Date(a.data_criacao);
          });

          setIphones(fetchedIphones);
        } else {
          setError(data.message || "Erro ao carregar iPhones.");
        }
      } catch (err) {
        console.error("Erro ao buscar iPhones:", err);
        setError("Erro de conexão com o servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchIphones();
  }, [searchTerm, filterModel, filterStorage, sortOrder]);

  if (loading) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <Link href="/" className={styles.logoLink}>
            <img
              src="iphone-logo.png"
              alt="iPhones Pro Store Logo"
              className={styles.logoImage}
            />
          </Link>
        </header>
        <div className={styles.content}>
          <h2 className={styles.pageTitle}>Carregando iPhones...</h2>
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
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
        <div className={styles.content}>
          <h2 className={styles.pageTitle}>Erro ao carregar iPhones</h2>
          <p className={styles.errorMessage}>Erro: {error}</p>
        </div>
      </div>
    );
  }

  const uniqueModels = [...new Set(iphones.map((iphone) => iphone.modelo))];
  const uniqueStorages = [
    ...new Set(iphones.map((iphone) => iphone.armazenamento_gb)),
  ].sort((a, b) => a - b);

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <header className={styles.header}>
        <Link href="/" className={styles.logoLink}>
          <img
            src="iphone-logo.png"
            alt="iPhones Pro Store Logo"
            className={styles.logoImage}
          />
        </Link>
        <nav className={styles.mainNav}>
          <Link href="/dashboard" className={styles.dashboardButton}>
            Dashboard
          </Link>
        </nav>
      </header>

      <div className={styles.content}>
        <h2 className={styles.pageTitle}>Descubra a inovação</h2>

        <motion.div
          className={styles.filtersContainer}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <input
            type="text"
            placeholder="Buscar iPhone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <select
            value={filterModel}
            onChange={(e) => setFilterModel(e.target.value)}
            className={styles.selectFilter}
          >
            <option value="">Todos os Modelos</option>
            {uniqueModels.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
          <select
            value={filterStorage}
            onChange={(e) => setFilterStorage(e.target.value)}
            className={styles.selectFilter}
          >
            <option value="">Todo Armazenamento</option>
            {uniqueStorages.map((storage) => (
              <option key={storage} value={storage}>
                {storage}GB
              </option>
            ))}
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className={styles.selectFilter}
          >
            <option value="latest">Mais Recentes</option>
            <option value="price_asc">Preço: Menor para Maior</option>
            <option value="price_desc">Preço: Maior para Menor</option>
          </select>
        </motion.div>

        {iphones.length === 0 ? (
          <p className={styles.noProductsMessage}>
            Nenhum iPhone encontrado com os critérios selecionados.
          </p>
        ) : (
          <motion.div
            className={styles.productsGrid}
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: {
                opacity: 1,
                y: 0,
                transition: { staggerChildren: 0.1 },
              },
            }}
          >
            {iphones.map((iphone) => (
              <motion.div
                key={iphone.id}
                className={styles.productCard}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Link href={`/iphones/${iphone.id}`}>
                  <img
                    src={
                      iphone.imagens_urls && iphone.imagens_urls.length > 0
                        ? iphone.imagens_urls[0]
                        : "https://placehold.co/300x300/e0e0e0/333333?text=iPhone"
                    }
                    alt={iphone.nome}
                    className={styles.productImage}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/300x300/e0e0e0/333333?text=iPhone";
                    }}
                  />
                  <h3 className={styles.productName}>{iphone.nome}</h3>
                  <p className={styles.productModel}>
                    {iphone.modelo} - {iphone.armazenamento_gb}GB
                  </p>
                  {iphone.preco_promocional && (
                    <p className={styles.originalPrice}>
                      R${" "}
                      {parseFloat(iphone.preco_tabela)
                        .toFixed(2)
                        .replace(".", ",")}
                    </p>
                  )}
                  <p className={styles.currentPrice}>
                    R${" "}
                    {parseFloat(iphone.preco_promocional || iphone.preco_tabela)
                      .toFixed(2)
                      .replace(".", ",")}
                  </p>
                  <button className={styles.viewDetailsButton}>
                    Ver Detalhes
                  </button>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
      <Testimonials />
    </motion.div>
  );
}
