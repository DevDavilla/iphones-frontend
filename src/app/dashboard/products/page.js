// src/app/dashboard/products/page.js
"use client"; // Indica que este é um componente do lado do cliente

import React, { useState, useEffect } from "react"; // Importa React e hooks de estado/efeito
import Link from "next/link"; // Para links internos do Next.js
import productsStyles from "./products.module.css"; // Estilos específicos para a listagem
import dashboardStyles from "../dashboard.module.css"; // Estilos do layout do dashboard
import { useToast } from "../../../components/Toast/ToastContext"; // Importa useToast

// Define a base da URL da API.
const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export default function ProductsPage() {
  const [iphones, setIphones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { showToast } = useToast(); // Usa o hook useToast

  // Função para buscar os iPhones da API (refatorada para ser reutilizável)
  const fetchIphones = async () => {
    try {
      setLoading(true); // Inicia o loading antes de cada fetch
      setError(null); // Limpa erros anteriores
      // Usa a API_BASE_URL definida para a requisição
      const response = await fetch(`${API_BASE_URL}/api/iphones`);
      const data = await response.json();

      if (response.ok) {
        setIphones(data.iphones);
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

  // Hook para buscar iPhones ao montar o componente
  useEffect(() => {
    fetchIphones();
  }, []); // O array vazio garante que o useEffect rode apenas uma vez ao montar o componente

  // Função para lidar com a exclusão de um iPhone
  const handleDelete = async (id, nome) => {
    // Confirmação antes de deletar (usando confirm provisório)
    if (
      !confirm(`Tem certeza que deseja excluir o iPhone "${nome}" (ID: ${id})?`)
    ) {
      return; // Cancela a operação se o usuário não confirmar
    }

    try {
      // Usa a API_BASE_URL definida para a requisição
      const response = await fetch(`${API_BASE_URL}/api/iphones/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        showToast(data.message, "success"); // Usa showToast para sucesso
        fetchIphones(); // Recarrega a lista de iPhones após a exclusão
      } else {
        showToast(
          "Erro ao excluir iPhone: " + (data.message || "Erro desconhecido."),
          "error"
        ); // Usa showToast para erro
        console.error("Detalhes do erro:", data.error);
      }
    } catch (err) {
      console.error(`Erro na requisição de exclusão do iPhone ${id}:`, err);
      showToast("Erro na conexão com o servidor ao excluir iPhone.", "error"); // Usa showToast para erro
    }
  };

  // Renderização condicional: Carregando, Erro ou Conteúdo da Página
  if (loading) {
    return (
      <div className={dashboardStyles.dashboardLayout}>
        <aside className={dashboardStyles.sidebar}>
          <div className={dashboardStyles.sidebarHeader}>
            <Link
              href="/dashboard"
              className={dashboardStyles.logoLinkDashboard}
            >
              <img
                src="/iphone-logo.png"
                alt="iPhones Pro Dashboard Logo"
                className={dashboardStyles.logoImageDashboard}
              />
            </Link>
          </div>
          <nav className={dashboardStyles.navMenu}>
            <Link href="/" className={dashboardStyles.navLink}>
              Ver Loja
            </Link>
            <Link href="/dashboard" className={dashboardStyles.navItem}>
              Visão Geral
            </Link>
            <Link
              href="/dashboard/products"
              className={`${dashboardStyles.navItem} ${dashboardStyles.activeNavItem}`}
            >
              Meus Produtos
            </Link>
            <Link
              href="/dashboard/products/new"
              className={dashboardStyles.navItem}
            >
              Cadastrar Novo Produto
            </Link>
            <Link href="/dashboard/orders" className={dashboardStyles.navItem}>
              Pedidos
            </Link>
            <Link
              href="/dashboard/settings"
              className={dashboardStyles.navItem}
            >
              Configurações
            </Link>
            <Link href="/" className={dashboardStyles.navItem}>
              Sair
            </Link>
          </nav>
        </aside>
        <main className={dashboardStyles.mainContent}>
          <h1 className={dashboardStyles.pageTitle}>Meus Produtos</h1>
          <p>Carregando iPhones...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className={dashboardStyles.dashboardLayout}>
        <aside className={dashboardStyles.sidebar}>
          <div className={dashboardStyles.sidebarHeader}>
            <Link
              href="/dashboard"
              className={dashboardStyles.logoLinkDashboard}
            >
              <img
                src="/iphone-logo.png"
                alt="iPhones Pro Dashboard Logo"
                className={dashboardStyles.logoImageDashboard}
              />
            </Link>
          </div>
          <nav className={dashboardStyles.navMenu}>
            <Link href="/" className={dashboardStyles.navLink}>
              Ver Loja
            </Link>
            <Link href="/dashboard" className={dashboardStyles.navItem}>
              Visão Geral
            </Link>
            <Link
              href="/dashboard/products"
              className={`${dashboardStyles.navItem} ${dashboardStyles.activeNavItem}`}
            >
              Meus Produtos
            </Link>
            <Link
              href="/dashboard/products/new"
              className={dashboardStyles.navItem}
            >
              Cadastrar Novo Produto
            </Link>
            <Link href="/dashboard/orders" className={dashboardStyles.navItem}>
              Pedidos
            </Link>
            <Link
              href="/dashboard/settings"
              className={dashboardStyles.navItem}
            >
              Configurações
            </Link>
            <Link href="/" className={dashboardStyles.navItem}>
              Sair
            </Link>
          </nav>
        </aside>
        <main className={dashboardStyles.mainContent}>
          <h1 className={dashboardStyles.pageTitle}>Meus Produtos</h1>
          <p className={productsStyles.errorMessage}>Erro: {error}</p>
        </main>
      </div>
    );
  }

  return (
    <div className={dashboardStyles.dashboardLayout}>
      <aside className={dashboardStyles.sidebar}>
        <div className={dashboardStyles.sidebarHeader}>
          <Link href="/dashboard" className={dashboardStyles.logoLinkDashboard}>
            <img
              src="/iphone-logo.png"
              alt="iPhones Pro Dashboard Logo"
              className={dashboardStyles.logoImageDashboard}
            />
          </Link>
        </div>
        <nav className={dashboardStyles.navMenu}>
          <Link href="/" className={dashboardStyles.navLink}>
            Ver Loja
          </Link>
          <Link href="/dashboard" className={dashboardStyles.navItem}>
            Visão Geral
          </Link>
          <Link
            href="/dashboard/products"
            className={`${dashboardStyles.navItem} ${dashboardStyles.activeNavItem}`}
          >
            Meus Produtos
          </Link>
          <Link
            href="/dashboard/products/new"
            className={dashboardStyles.navItem}
          >
            Cadastrar Novo Produto
          </Link>
          <Link href="/dashboard/orders" className={dashboardStyles.navItem}>
            Pedidos
          </Link>
          <Link href="/dashboard/settings" className={dashboardStyles.navItem}>
            Configurações
          </Link>
          <Link href="/" className={dashboardStyles.navItem}>
            Sair
          </Link>
        </nav>
      </aside>

      <main className={dashboardStyles.mainContent}>
        <h1 className={dashboardStyles.pageTitle}>Meus Produtos</h1>

        <div className={productsStyles.productsHeader}>
          <p className={productsStyles.productCount}>
            Total de iPhones: {iphones.length}
          </p>
          <Link
            href="/dashboard/products/new"
            className={productsStyles.addNewButton}
          >
            + Adicionar Novo iPhone
          </Link>
        </div>

        {iphones.length === 0 ? (
          <p className={productsStyles.noProductsMessage}>
            Nenhum iPhone cadastrado ainda.{" "}
            <Link href="/dashboard/products/new">Adicione um agora!</Link>
          </p>
        ) : (
          <div className={productsStyles.productsTableContainer}>
            <table className={productsStyles.productsTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Modelo</th>
                  <th>Armazenamento</th>
                  <th>Preço Tabela</th>
                  <th>Preço Promo.</th>
                  <th>Estoque</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {iphones.map((iphone) => (
                  <tr key={iphone.id}>
                    <td>{iphone.id}</td>
                    <td>{iphone.nome}</td>
                    <td>{iphone.modelo}</td>
                    <td>{iphone.armazenamento_gb}GB</td>
                    <td>
                      R${" "}
                      {parseFloat(iphone.preco_tabela)
                        .toFixed(2)
                        .replace(".", ",")}
                    </td>
                    <td>
                      {iphone.preco_promocional
                        ? `R$ ${parseFloat(iphone.preco_promocional)
                            .toFixed(2)
                            .replace(".", ",")}`
                        : "-"}
                    </td>
                    <td>{iphone.estoque}</td>
                    <td>
                      <span
                        className={`${productsStyles.statusBadge} ${
                          productsStyles[iphone.status_produto.toLowerCase()]
                        }`}
                      >
                        {iphone.status_produto}
                      </span>
                    </td>
                    <td>
                      <div className={productsStyles.actions}>
                        <Link
                          href={`/dashboard/products/edit/${iphone.id}`}
                          className={productsStyles.actionButton}
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => handleDelete(iphone.id, iphone.nome)} // Conecta o botão à função
                          className={`${productsStyles.actionButton} ${productsStyles.deleteButton}`}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
