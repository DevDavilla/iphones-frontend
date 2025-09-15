"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import styles from "./details.module.css";
import globalStoreStyles from "../../page.module.css";
import Footer from "../../../components/Footer/Footer";
import Loader from "../../../components/Loader/Loader";
import { useToast } from "../../../components/Toast/ToastContext";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export default function iPhoneDetailsPage({ params }) {
  const router = useRouter();
  const { id } = params;
  const { showToast } = useToast();

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

  const handleBuyNow = () => {
    const whatsappNumber = "5511999999999";
    const message = `Olá! Tenho interesse no iPhone ${iphone.nome} - ${
      iphone.armazenamento_gb
    }GB. Preço: R$ ${parseFloat(iphone.preco_promocional || iphone.preco_tabela)
      .toFixed(2)
      .replace(".", ",")}. Poderíamos conversar sobre a compra?`;
    const whatsappLink = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappLink, "_blank");
  };

  if (loading) {
    return (
      <div className={globalStoreStyles.container}>
        <header className={globalStoreStyles.header}>
          <Link href="/" className={globalStoreStyles.logoLink}>
            <Image
              src="/sua-logo-da-loja.png"
              alt="iPhones Pro Store Logo"
              className={globalStoreStyles.logoImage}
              width={200}
              height={60}
            />
          </Link>
          <nav className={globalStoreStyles.mainNav}>
            <Link
              href="/dashboard"
              className={globalStoreStyles.dashboardButton}
            >
              Dashboard
            </Link>
          </nav>
        </header>
        <div className={globalStoreStyles.content}>
          <h2 className={globalStoreStyles.pageTitle}>Detalhes do iPhone</h2>
          <Loader />
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className={globalStoreStyles.container}>
        <header className={globalStoreStyles.header}>
          <Link href="/" className={globalStoreStyles.logoLink}>
            <Image
              src="/sua-logo-da-loja.png"
              alt="iPhones Pro Store Logo"
              className={globalStoreStyles.logoImage}
              width={200}
              height={60}
            />
          </Link>
          <nav className={globalStoreStyles.mainNav}>
            <Link
              href="/dashboard"
              className={globalStoreStyles.dashboardButton}
            >
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
        <Footer />
      </div>
    );
  }

  if (!iphone) {
    return (
      <div className={globalStoreStyles.container}>
        <header className={globalStoreStyles.header}>
          <Link href="/" className={globalStoreStyles.logoLink}>
            <Image
              src="/sua-logo-da-loja.png"
              alt="iPhones Pro Store Logo"
              className={globalStoreStyles.logoImage}
              width={200}
              height={60}
            />
          </Link>
          <nav className={globalStoreStyles.mainNav}>
            <Link
              href="/dashboard"
              className={globalStoreStyles.dashboardButton}
            >
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
        <Footer />
      </div>
    );
  }

  return (
    <div className={globalStoreStyles.container}>
      <header className={globalStoreStyles.header}>
        <Link href="/" className={globalStoreStyles.logoLink}>
          <Image
            src="/sua-logo-da-loja.png"
            alt="iPhones Pro Store Logo"
            className={globalStoreStyles.logoImage}
            width={200}
            height={60}
          />
        </Link>
        <nav className={globalStoreStyles.mainNav}>
          <Link href="/dashboard" className={globalStoreStyles.dashboardButton}>
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
              className={styles.mainImage}
              width={500}
              height={500}
            />
            <div className={styles.thumbnailGallery}>
              {iphone.imagens_urls?.map((url, index) => (
                <Image
                  key={index}
                  src={url}
                  alt={`${iphone.nome} - ${index + 1}`}
                  className={`${styles.thumbnail} ${
                    url === mainImage ? styles.activeThumbnail : ""
                  }`}
                  onClick={() => setMainImage(url)}
                  width={80}
                  height={80}
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

            <button onClick={handleBuyNow} className={styles.addToCartButton}>
              Comprar Agora!
            </button>

            <div className={styles.trustBadges}>
              <h3 className={styles.badgesTitle}>Compra 100% Segura</h3>
              <div className={styles.badgeImages}>
                <Image
                  src="/images/logo-mercadopago.png"
                  alt="Mercado Pago"
                  className={styles.badgeImage}
                  width={60}
                  height={30}
                />
                <Image
                  src="/images/logo-visa.png"
                  alt="Visa"
                  className={styles.badgeImage}
                  width={60}
                  height={30}
                />
                <Image
                  src="/images/logo-mastercard.png"
                  alt="Mastercard"
                  className={styles.badgeImage}
                  width={60}
                  height={30}
                />
                <Image
                  src="/images/logo-ssl.png"
                  alt="Certificado SSL"
                  className={styles.badgeImage}
                  width={60}
                  height={30}
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
                {iphone.tipo_conexao && (
                  <li>
                    <span className={styles.negrito}>Conectividade:</span>{" "}
                    {formatArrayData(iphone.tipo_conexao)}
                  </li>
                )}
                {iphone.tipo_conector && (
                  <li>
                    <span className={styles.negrito}>Conector:</span>{" "}
                    {iphone.tipo_conector}
                  </li>
                )}
                {iphone.recursos_camera && (
                  <li>
                    <span className={styles.negrito}>Câmera:</span>{" "}
                    {formatArrayData(iphone.recursos_camera)}
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
                    <span className={styles.negrito}>Sistema Operacional:</span>{" "}
                    {iphone.sistema_operacional}
                  </li>
                )}
                {iphone.biometria && (
                  <li>
                    <span className={styles.negrito}>Biometria:</span>{" "}
                    {formatArrayData(iphone.biometria)}
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
                {iphone.cores_disponiveis && (
                  <li>
                    {" "}
                    <span className={styles.negrito}>Cores:</span>{" "}
                    {formatArrayData(iphone.cores_disponiveis)}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
