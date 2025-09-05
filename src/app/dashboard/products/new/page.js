// src/app/dashboard/products/new/page.js
"use client";

import React, { useState, useEffect } from "react"; // Adicionado useEffect
import { useRouter } from "next/navigation"; // Adicionado useRouter
import styles from "./new.module.css";
import dashboardStyles from "/Users/Thulio/projeto-iphones/frontend-iphones/src/app/dashboard/dashboard.module.css"; // Ajuste o caminho se necessário
import Link from "next/link";
import { useToast } from "../../../../components/Toast/ToastContext";

// Importa auth do Firebase e onAuthStateChanged
import { auth } from "../../../firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth"; // Adicionado signOut

// Define a base da URL da API.
const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export default function NewProductPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    nome: "",
    modelo: "",
    armazenamento_gb: "",
    cores_disponiveis: [],
    condicao_aparelho: "",
    preco_tabela: "",
    preco_promocional: "",
    opcoes_parcelamento: "",
    estoque: "",
    sku: "",
    descricao_detalhada: "",
    tamanho_tela_polegadas: "",
    processador_chip: "",
    capacidade_bateria: "",
    tipo_conexao: [],
    tipo_conector: "",
    recursos_camera: [],
    resistencia_agua_poeira: "",
    sistema_operacional: "",
    biometria: [],
    imagens_urls: [],
    video_url: "",
    dimensoes_axlxc: "",
    peso_g: "",
    garantia_meses: "",
    status_produto: "Ativo",
  });

  const [loadingAuth, setLoadingAuth] = useState(true); // NOVO: Carregamento da autenticação
  const [user, setUser] = useState(null); // NOVO: Estado para o usuário logado

  // Efeito para verificar o estado de autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoadingAuth(false);
      } else {
        router.push("/dashboard/login"); // Redireciona para login
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleAddItem = (fieldName) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: [...prevData[fieldName], ""],
    }));
  };

  const handleRemoveItem = (fieldName, index) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: prevData[fieldName].filter((_, i) => i !== index),
    }));
  };

  const handleItemChange = (fieldName, index, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: prevData[fieldName].map((item, i) =>
        i === index ? value : item
      ),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      ...formData,
      armazenamento_gb: Number(formData.armazenamento_gb),
      preco_tabela: Number(formData.preco_tabela),
      preco_promocional: formData.preco_promocional
        ? Number(formData.preco_promocional)
        : null,
      estoque: Number(formData.estoque),
      tamanho_tela_polegadas: formData.tamanho_tela_polegadas
        ? Number(formData.tamanho_tela_polegadas)
        : null,
      peso_g: formData.peso_g ? Number(formData.peso_g) : null,
      garantia_meses: formData.garantia_meses
        ? Number(formData.garantia_meses)
        : null,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/iphones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (response.ok) {
        showToast(data.message, "success");
        setFormData({
          nome: "",
          modelo: "",
          armazenamento_gb: [],
          cores_disponiveis: [],
          condicao_aparelho: "",
          preco_tabela: "",
          preco_promocional: "",
          opcoes_parcelamento: "",
          estoque: "",
          sku: "",
          descricao_detalhada: "",
          tamanho_tela_polegadas: "",
          processador_chip: "",
          capacidade_bateria: "",
          tipo_conexao: [],
          tipo_conector: "",
          recursos_camera: [],
          resistencia_agua_poeira: "",
          sistema_operacional: "",
          biometria: [],
          imagens_urls: [],
          video_url: "",
          dimensoes_axlxc: "",
          peso_g: "",
          garantia_meses: "",
          status_produto: "Ativo",
        });
      } else {
        showToast(
          "Erro ao cadastrar iPhone: " + (data.message || "Erro desconhecido."),
          "error"
        );
        console.error("Detalhes do erro da API:", data);
      }
    } catch (error) {
      console.error("Erro na requisição de cadastro:", error);
      showToast("Erro na conexão com o servidor ou na requisição.", "error");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/dashboard/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      showToast("Erro ao fazer logout. Tente novamente.", "error");
    }
  };

  if (loadingAuth) {
    return (
      <div className={dashboardStyles.dashboardLayout}>
        <aside className={dashboardStyles.sidebar}>
          <div className={dashboardStyles.sidebarHeader}>
            <h2 className={dashboardStyles.logoText}>iPhones Pro</h2>
          </div>
          <nav className={dashboardStyles.navMenu}>
            <p className={dashboardStyles.loadingText}>Carregando...</p>
          </nav>
        </aside>
        <main className={dashboardStyles.mainContent}>
          <h1 className={dashboardStyles.pageTitle}>
            Carregando Formulário...
          </h1>
        </main>
      </div>
    );
  }

  if (!user) {
    return null;
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
          <Link href="/dashboard/products" className={dashboardStyles.navItem}>
            Meus Produtos
          </Link>
          <Link
            href="/dashboard/products/new"
            className={`${dashboardStyles.navItem} ${dashboardStyles.activeNavItem}`}
          >
            Cadastrar Novo Produto
          </Link>
          <Link href="/dashboard/orders" className={dashboardStyles.navItem}>
            Pedidos
          </Link>
          <Link href="/dashboard/settings" className={dashboardStyles.navItem}>
            Configurações
          </Link>
          <button
            onClick={handleLogout}
            className={`${dashboardStyles.navItem} ${dashboardStyles.logoutButton}`}
          >
            Sair
          </button>
        </nav>
      </aside>

      <main className={dashboardStyles.mainContent}>
        <h1 className={dashboardStyles.pageTitle}>Cadastrar Novo iPhone</h1>

        <form onSubmit={handleSubmit} className={styles.productForm}>
          {/* Bloco 1: Informações Básicas do Produto */}
          <section className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Informações Básicas</h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="nome">Nome do Produto *</label>
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
                <label htmlFor="modelo">Modelo Específico *</label>
                <select
                  id="modelo"
                  name="modelo"
                  value={formData.modelo}
                  onChange={handleChange}
                  required
                  className={styles.selectField}
                >
                  <option value="">Selecione o Modelo</option>
                  <option value="Pro Max">Pro Max</option>
                  <option value="Pro">Pro</option>
                  <option value="Plus">Plus</option>
                  <option value="Standard">Standard</option>
                  <option value="SE">SE</option>
                  <option value="Mini">Mini</option>
                  <option value="Normal">Normal</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="armazenamento_gb">Armazenamento (GB) *</label>
                <select
                  id="armazenamento_gb"
                  name="armazenamento_gb"
                  value={formData.armazenamento_gb}
                  onChange={handleChange}
                  required
                  className={styles.selectField}
                >
                  <option value="">Selecione</option>
                  <option value="32">32GB</option>
                  <option value="64">64GB</option>
                  <option value="128">128GB</option>
                  <option value="256">256GB</option>
                  <option value="512">512GB</option>
                  <option value="1024">1TB</option>
                </select>
              </div>
              {/* Cores Disponíveis - Agora com múltiplos inputs */}
              <div className={styles.formGroup}>
                <label>Cores Disponíveis</label>
                {formData.cores_disponiveis.map((color, index) => (
                  <div key={index} className={styles.dynamicInputRow}>
                    <input
                      type="text"
                      value={color}
                      onChange={(e) =>
                        handleItemChange(
                          "cores_disponiveis",
                          index,
                          e.target.value
                        )
                      }
                      className={styles.inputField}
                      placeholder="Ex: Prata"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveItem("cores_disponiveis", index)
                      }
                      className={styles.removeButton}
                    >
                      -
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddItem("cores_disponiveis")}
                  className={styles.addButton}
                >
                  + Adicionar Cor
                </button>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="condicao_aparelho">
                  Condição do Aparelho *
                </label>
                <select
                  id="condicao_aparelho"
                  name="condicao_aparelho"
                  value={formData.condicao_aparelho}
                  onChange={handleChange}
                  required
                  className={styles.selectField}
                >
                  <option value="">Selecione</option>
                  <option value="Novo">Novo</option>
                  <option value="Seminovo">Seminovo</option>
                  <option value="Recondicionado">Recondicionado</option>
                  <option value="Usado">Usado</option>
                </select>
              </div>
            </div>
          </section>

          {/* Bloco 2: Preços e Estoque */}
          <section className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Preços e Estoque</h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="preco_tabela">Preço de Tabela (R$) *</label>
                <input
                  type="number"
                  id="preco_tabela"
                  name="preco_tabela"
                  value={formData.preco_tabela}
                  onChange={handleChange}
                  step="0.01"
                  required
                  className={styles.inputField}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="preco_promocional">
                  Preço Promocional (R$)
                </label>
                <input
                  type="number"
                  id="preco_promocional"
                  name="preco_promocional"
                  value={formData.preco_promocional}
                  onChange={handleChange}
                  step="0.01"
                  className={styles.inputField}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="opcoes_parcelamento">
                  Opções de Parcelamento
                </label>
                <input
                  type="text"
                  id="opcoes_parcelamento"
                  name="opcoes_parcelamento"
                  value={formData.opcoes_parcelamento}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="estoque">Disponibilidade em Estoque *</label>
                <input
                  type="number"
                  id="estoque"
                  name="estoque"
                  value={formData.estoque}
                  onChange={handleChange}
                  required
                  className={styles.inputField}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="sku">Código SKU (Opcional)</label>
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </div>
            </div>
          </section>

          {/* Bloco 3: Detalhes e Descrição */}
          <section className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Detalhes e Descrição</h2>
            <div className={styles.formGroup}>
              <label htmlFor="descricao_detalhada">Descrição Detalhada *</label>
              <textarea
                id="descricao_detalhada"
                name="descricao_detalhada"
                value={formData.descricao_detalhada}
                onChange={handleChange}
                rows="5"
                required
                className={styles.textareaField}
              ></textarea>
            </div>
          </section>

          {/* Bloco 4: Especificações Técnicas (Todos Opcionais) */}
          <section className={styles.formSection}>
            <h2 className={styles.sectionTitle}>
              Especificações Técnicas (Opcional)
            </h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="tamanho_tela_polegadas">
                  Tamanho da Tela (Polegadas)
                </label>
                <input
                  type="number"
                  id="tamanho_tela_polegadas"
                  name="tamanho_tela_polegadas"
                  value={formData.tamanho_tela_polegadas}
                  onChange={handleChange}
                  step="0.1"
                  className={styles.inputField}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="processador_chip">Processador/Chip</label>
                <input
                  type="text"
                  id="processador_chip"
                  name="processador_chip"
                  value={formData.processador_chip}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="capacidade_bateria">
                  Capacidade da Bateria
                </label>
                <input
                  type="text"
                  id="capacidade_bateria"
                  name="capacidade_bateria"
                  value={formData.capacidade_bateria}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </div>
              {/* Tipo de Conexão - Agora com múltiplos inputs */}
              <div className={styles.formGroup}>
                <label>Tipo de Conexão</label>
                {formData.tipo_conexao.map((conn, index) => (
                  <div key={index} className={styles.dynamicInputRow}>
                    <input
                      type="text"
                      value={conn}
                      onChange={(e) =>
                        handleItemChange("tipo_conexao", index, e.target.value)
                      }
                      className={styles.inputField}
                      placeholder="Ex: 5G"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveItem("tipo_conexao", index)}
                      className={styles.removeButton}
                    >
                      -
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddItem("tipo_conexao")}
                  className={styles.addButton}
                >
                  + Adicionar Conexão
                </button>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="tipo_conector">Tipo de Conector</label>
                <select
                  id="tipo_conector"
                  name="tipo_conector"
                  value={formData.tipo_conector}
                  onChange={handleChange}
                  className={styles.selectField}
                >
                  <option value="">Selecione</option>
                  <option value="USB-C">USB-C</option>
                  <option value="Lightning">Lightning</option>
                </select>
              </div>
              {/* Recursos da Câmera - Agora com múltiplos inputs */}
              <div className={styles.formGroup}>
                <label>Recursos da Câmera</label>
                {formData.recursos_camera.map((feature, index) => (
                  <div key={index} className={styles.dynamicInputRow}>
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) =>
                        handleItemChange(
                          "recursos_camera",
                          index,
                          e.target.value
                        )
                      }
                      className={styles.inputField}
                      placeholder="Ex: Modo Cinema"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveItem("recursos_camera", index)}
                      className={styles.removeButton}
                    >
                      -
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddItem("recursos_camera")}
                  className={styles.addButton}
                >
                  + Adicionar Recurso
                </button>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="resistencia_agua_poeira">
                  Resistência à Água/Poeira
                </label>
                <input
                  type="text"
                  id="resistencia_agua_poeira"
                  name="resistencia_agua_poeira"
                  value={formData.resistencia_agua_poeira}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="sistema_operacional">Sistema Operacional</label>
                <input
                  type="text"
                  id="sistema_operacional"
                  name="sistema_operacional"
                  value={formData.sistema_operacional}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </div>
              {/* Biometria - Agora com múltiplos inputs */}
              <div className={styles.formGroup}>
                <label>Biometria</label>
                {formData.biometria.map((bio, index) => (
                  <div key={index} className={styles.dynamicInputRow}>
                    <input
                      type="text"
                      value={bio}
                      onChange={(e) =>
                        handleItemChange("biometria", index, e.target.value)
                      }
                      className={styles.inputField}
                      placeholder="Ex: Face ID"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveItem("biometria", index)}
                      className={styles.removeButton}
                    >
                      -
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddItem("biometria")}
                  className={styles.addButton}
                >
                  + Adicionar Biometria
                </button>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="dimensoes_axlxc">Dimensões (AxLxP em cm)</label>
                <input
                  type="text"
                  id="dimensoes_axlxc"
                  name="dimensoes_axlxc"
                  value={formData.dimensoes_axlxc}
                  onChange={handleChange}
                  placeholder="Ex: 14.6x7.1x0.7"
                  className={styles.inputField}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="peso_g">Peso (g)</label>
                <input
                  type="number"
                  id="peso_g"
                  name="peso_g"
                  value={formData.peso_g}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="garantia_meses">Garantia (Meses)</label>
                <input
                  type="number"
                  id="garantia_meses"
                  name="garantia_meses"
                  value={formData.garantia_meses}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </div>
            </div>
          </section>

          {/* Bloco 5: Mídia (Imagens e Vídeos) */}
          <section className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Mídia (Opcional)</h2>
            {/* Imagens URLs - Agora com múltiplos inputs */}
            <div className={styles.formGroup}>
              <label>URLs das Imagens</label>
              {formData.imagens_urls.map((url, index) => (
                <div key={index} className={styles.dynamicInputRow}>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) =>
                      handleItemChange("imagens_urls", index, e.target.value)
                    }
                    className={styles.inputField}
                    placeholder="Ex: http://img.com/iphone.jpg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveItem("imagens_urls", index)}
                    className={styles.removeButton}
                  >
                    -
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddItem("imagens_urls")}
                className={styles.addButton}
              >
                + Adicionar Imagem URL
              </button>
              <p className={styles.hintText}>
                *O upload real de arquivos será implementado em breve.*
              </p>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="video_url">URL do Vídeo (Opcional)</label>
              <input
                type="text"
                id="video_url"
                name="video_url"
                value={formData.video_url}
                onChange={handleChange}
                className={styles.inputField}
              />
            </div>
          </section>

          {/* Bloco 6: Status do Produto */}
          <section className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Status do Produto</h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="status_produto">Status do Produto *</label>
                <select
                  id="status_produto"
                  name="status_produto"
                  value={formData.status_produto}
                  onChange={handleChange}
                  required
                  className={styles.selectField}
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                  <option value="Rascunho">Rascunho</option>
                  <option value="Vendido">Vendido</option>
                </select>
              </div>
            </div>
          </section>

          {/* Botões de Ação */}
          <div className={styles.formActions}>
            <button type="button" className={styles.cancelButton}>
              Cancelar
            </button>
            <button type="submit" className={styles.submitButton}>
              Salvar iPhone
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
