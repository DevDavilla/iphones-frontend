// src/app/iphones/[id]/page.js
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image"; // ✅ Substitui <img> por <Image> para corrigir warnings do Next
import styles from "./details.module.css";
import globalStoreStyles from "../../page.module.css";
import Footer from "../../../components/Footer/Footer";
import Loader from "../../../components/Loader/Loader";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export default function IPhoneDetailsPage({ params }) {
  // ✅ Corrigido: nome do componente com letra maiúscula
  const router = useRouter();
  const { id } = params;

  const [iphone, setIphone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("ID do iPhone não fornecido na URL.");
      return;
    }

    const fetchIphoneDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/iphones/${id}`);
        const data = await response.json();

        if (response.ok) {
          setIphone(data.iphone);
          if (data.iphone.imagens_urls && data.iphone.imagens_urls.length > 0) {
            setMainImage(data.iphone.imagens_urls[0]);
          }
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
  }, [id]);

  const handleGoToCheckout = () => {
    if (iphone) {
      router.push(`/checkout?iphoneId=${iphone.id}`);
    } else {
      alert("Não foi possível iniciar a compra: iPhone não carregado.");
    }
  };

  if (loading) {
    return (
      <div className={globalStoreStyles.container}>
        <header className={globalStoreStyles.header}>
          <Link href="/" className={globalStoreStyles.logoLink}>
            <Image
              src="/iphone-logo.png"
              alt="iPhones Pro Store Logo"
              width={120}
              height={50}
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
          <h2 className={globalStoreStyles.pageTitle}>Detalhes do iPhone</h2>
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
            <Image
              src="/iphone-logo.png"
              alt="iPhones Pro Store Logo"
              width={120}
              height={50}
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
            Erro ao carregar iPhone
          </h2>
          <p className={globalStoreStyles.errorMessage}>Erro: {error}</p>
          <p className={globalStoreStyles.noProductsMessage}>
            Voltar para a <Link href="/">loja</Link>.
          </p>
        </div>
      </div>
    );
  }

  if (!iphone) {
    return (
      <div className={globalStoreStyles.container}>
        <header className={globalStoreStyles.header}>
          <Link href="/" className={globalStoreStyles.logoLink}>
            <Image
              src="/iphone-logo.png"
              alt="iPhones Pro Store Logo"
              width={120}
              height={50}
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
            iPhone não encontrado.
          </h2>
          <p className={globalStoreStyles.noProductsMessage}>
            O produto que você procura não existe ou foi removido. Voltar para a{" "}
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
          <Image
            src="/iphone-logo.png"
            alt="iPhones Pro Store Logo"
            width={120}
            height={50}
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
        <h2 className={styles.productTitle}>{iphone.nome}</h2>

        <div className={styles.detailsContainer}>
          <div className={styles.imageGallery}>
            <Image
              src={
                mainImage ||
                "https://placehold.co/500x500/e0e0e0/333333?text=iPhone"
              }
              alt={iphone.nome}
              width={500}
              height={500}
              className={styles.mainImage}
            />
            <div className={styles.thumbnailGallery}>
              {iphone.imagens_urls &&
                iphone.imagens_urls.length > 0 &&
                iphone.imagens_urls.map((url, index) => (
                  <Image
                    key={index}
                    src={url}
                    alt={`${iphone.nome} - ${index + 1}`}
                    width={100}
                    height={100}
                    className={`${styles.thumbnail} ${
                      url === mainImage ? styles.activeThumbnail : ""
                    }`}
                    onClick={() => setMainImage(url)}
                  />
                ))}
            </div>
            {iphone.video_url && (
              <div className={styles.videoContainer}>
                <h3 className={styles.sectionHeading}>Vídeo do Produto</h3>
                <iframe
                  width="100%"
                  height="315"
                  src={iphone.video_url.replace("watch?v=", "embed/")}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className={styles.videoFrame}
                ></iframe>
              </div>
            )}
          </div>

          <div className={styles.infoSection}>
            <p className={styles.modelInfo}>
              {iphone.modelo} - {iphone.armazenamento_gb}GB
            </p>
            {iphone.preco_promocional ? (
              <>
                <p className={styles.originalPrice}>
                  R${" "}
                  {parseFloat(iphone.preco_tabela).toFixed(2).replace(".", ",")}
                </p>
                <p className={styles.currentPrice}>
                  R${" "}
                  {parseFloat(iphone.preco_promocional)
                    .toFixed(2)
                    .replace(".", ",")}
                </p>
              </>
            ) : (
              <p className={styles.currentPrice}>
                R${" "}
                {parseFloat(iphone.preco_tabela).toFixed(2).replace(".", ",")}
              </p>
            )}
            {iphone.opcoes_parcelamento && (
              <p className={styles.installmentOptions}>
                {iphone.opcoes_parcelamento}
              </p>
            )}

            <button
              onClick={handleGoToCheckout}
              className={styles.addToCartButton}
            >
              Finalizar Compra
            </button>

            <div className={styles.trustBadges}>
              <h3 className={styles.badgesTitle}>Compra 100% Segura</h3>
              <div className={styles.badgesGrid}>
                <Image
                  src="https://xadmin.s3.us-east-2.amazonaws.com/1/news/15042/image/7222d1c16ce25b203d0504ea00db3773.jpg"
                  alt="Certificado SSL"
                  width={80}
                  height={50}
                  className={styles.badgeImage}
                />
                <Image
                  src="/compra-segura.jpg"
                  alt="Site Seguro"
                  width={80}
                  height={50}
                  className={styles.badgeImage}
                />
                <Image
                  src="/logo-pagseguro.png"
                  alt="PagSeguro"
                  width={80}
                  height={50}
                  className={styles.badgeImage}
                />
                <Image
                  src="/mercado-pago-seguro.png"
                  alt="Mercado Pago"
                  width={80}
                  height={50}
                  className={styles.badgeImage}
                />
                <Image
                  src="/logo-visa.png"
                  alt="Visa"
                  width={80}
                  height={50}
                  className={styles.badgeImage}
                />
                <Image
                  src="/logo-mastercard.png"
                  alt="Mastercard"
                  width={80}
                  height={50}
                  className={styles.badgeImage}
                />
              </div>
            </div>

            <div className={styles.productDescription}>
              <h3 className={styles.sectionHeading}>Descrição</h3>
              <p className={styles.fullDescription}>
                {iphone.descricao_detalhada}
              </p>
            </div>

            <div className={styles.specsSection}>
              <h3 className={styles.sectionHeading}>Especificações Técnicas</h3>
              <ul>
                {iphone.tamanho_tela_polegadas && (
                  <li>
                    <span className={styles.negrito}>Tela:</span>{" "}
                    {iphone.tamanho_tela_polegadas} polegadas
                  </li>
                )}
                {iphone.processador_chip && (
                  <li>
                    <span className={styles.negrito}>Chip:</span>{" "}
                    {iphone.processador_chip}
                  </li>
                )}
                {iphone.capacidade_bateria && (
                  <li>
                    <span className={styles.negrito}>Bateria:</span>{" "}
                    {iphone.capacidade_bateria}
                  </li>
                )}
                {iphone.tipo_conexao && iphone.tipo_conexao.length > 0 && (
                  <li>
                    <span className={styles.negrito}>Conectividade:</span>{" "}
                    {iphone.tipo_conexao.join(", ")}
                  </li>
                )}
                {iphone.tipo_conector && (
                  <li>
                    <span className={styles.negrito}>Conector:</span>{" "}
                    {iphone.tipo_conector}
                  </li>
                )}
                {iphone.recursos_camera &&
                  iphone.recursos_camera.length > 0 && (
                    <li>
                      <span className={styles.negrito}>Câmera:</span>{" "}
                      {iphone.recursos_camera.join(", ")}
                    </li>
                  )}
                {iphone.resistencia_agua_poeira && (
                  <li>
                    <span className={styles.negrito}>Resistência:</span>{" "}
                    {iphone.resistencia_agua_poeira}
                  </li>
                )}
                {iphone.sistema_operacional && (
                  <li>
                    <span className={styles.negrito}>OS:</span>{" "}
                    {iphone.sistema_operacional}
                  </li>
                )}
                {iphone.biometria && iphone.biometria.length > 0 && (
                  <li>
                    <span className={styles.negrito}>Biometria:</span>{" "}
                    {iphone.biometria.join(", ")}
                  </li>
                )}
                {iphone.dimensoes_axlxc && (
                  <li>
                    <span className={styles.negrito}>Dimensões (AxLxP):</span>{" "}
                    {iphone.dimensoes_axlxc} cm
                  </li>
                )}
                {iphone.peso_g && (
                  <li>
                    <span className={styles.negrito}>Peso:</span>{" "}
                    {iphone.peso_g}g
                  </li>
                )}
                {iphone.garantia_meses && (
                  <li>
                    <span className={styles.negrito}>Garantia:</span>{" "}
                    {iphone.garantia_meses} meses
                  </li>
                )}
                {iphone.condicao_aparelho && (
                  <li>
                    <span className={styles.negrito}>Condição:</span>{" "}
                    {iphone.condicao_aparelho}
                  </li>
                )}
                {iphone.cores_disponiveis &&
                  iphone.cores_disponiveis.length > 0 && (
                    <li>
                      {" "}
                      <span className={styles.negrito}>Cores:</span>{" "}
                      {iphone.cores_disponiveis.join(", ")}
                    </li>
                  )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
