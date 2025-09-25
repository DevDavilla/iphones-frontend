"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import styles from "./details.module.css";
import globalStoreStyles from "../../page.module.css";
import Footer from "../../../components/Footer/Footer";
import Loader from "../../../components/Loader/Loader";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export default function IPhoneDetailsPage({ params }) {
  const router = useRouter();
  const { id } = params || {};

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
          const phone = data.iphone ? data.iphone : data;
          setIphone(phone);

          if (phone && phone.imagens_urls && phone.imagens_urls.length > 0) {
            setMainImage(phone.imagens_urls[0]);
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
    if (!iphone) {
      alert("Não foi possível iniciar a compra: iPhone não carregado.");
      return;
    }

    const nome = iphone.nome;
    const preco = iphone.preco_promocional || iphone.preco_tabela;
    const imagem = iphone.imagens_urls?.[0] || "";

    const url = `/checkout?nome=${encodeURIComponent(
      nome
    )}&preco=${encodeURIComponent(preco)}&imagem=${encodeURIComponent(imagem)}`;

    router.push(url);
  };

  const formatArrayData = (data) => {
    if (data === null || data === undefined) return null;

    if (typeof data === "number" || typeof data === "boolean")
      return String(data);

    if (typeof data === "string") {
      const trimmed = data.trim();
      if (!trimmed) return null;
      try {
        if (trimmed.startsWith("{") || trimmed.startsWith("["))
          return formatArrayData(JSON.parse(trimmed));
      } catch {}
      return trimmed;
    }

    if (Array.isArray(data)) {
      const arr = data
        .map((item) =>
          item
            ? typeof item === "object"
              ? Object.values(item).join(", ")
              : String(item)
            : null
        )
        .filter(Boolean);
      return arr.length > 0 ? arr.join(", ") : null;
    }

    if (typeof data === "object") {
      const vals = Object.values(data)
        .map((v) => (v ? String(v) : null))
        .filter(Boolean);
      return vals.length > 0 ? vals.join(", ") : null;
    }

    return String(data);
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
        </header>
        <div className={globalStoreStyles.content}>
          <h2 className={globalStoreStyles.pageTitle}>Detalhes do iPhone</h2>
          <Loader />
        </div>
      </div>
    );
  }

  if (error || !iphone) {
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
        </header>
        <div className={globalStoreStyles.content}>
          <h2 className={globalStoreStyles.pageTitle}>
            {error ? "Erro ao carregar iPhone" : "iPhone não encontrado."}
          </h2>
          <p className={globalStoreStyles.errorMessage}>{error}</p>
          <p className={globalStoreStyles.noProductsMessage}>
            Voltar para a <Link href="/">loja</Link>.
          </p>
        </div>
      </div>
    );
  }

  // Normaliza specs
  const specs = {
    Tela: formatArrayData(iphone.tamanho_tela_polegadas),
    Chip: formatArrayData(iphone.processador_chip),
    Bateria: formatArrayData(iphone.capacidade_bateria),
    Conectividade: formatArrayData(iphone.tipo_conexao),
    Conector: formatArrayData(iphone.tipo_conector),
    Câmera: formatArrayData(iphone.recursos_camera),
    Resistência: formatArrayData(iphone.resistencia_agua_poeira),
    Sistema: formatArrayData(iphone.sistema_operacional),
    Biometria: formatArrayData(iphone.biometria),
    Dimensões: formatArrayData(iphone.dimensoes_axlxc),
    Peso: formatArrayData(iphone.peso_g),
    Garantia: formatArrayData(iphone.garantia_meses),
    Condição: formatArrayData(iphone.condicao_aparelho),
    Cores: formatArrayData(iphone.cores_disponiveis),
  };

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
              {iphone.imagens_urls?.map((url, idx) => (
                <Image
                  key={idx}
                  src={url}
                  alt={`${iphone.nome} - ${idx + 1}`}
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
                {formatArrayData(iphone.opcoes_parcelamento)}
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
                  src="/certificado-ssl.png"
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
                {Object.entries(specs).map(
                  ([key, value]) =>
                    value && (
                      <li key={key}>
                        <span className={styles.negrito}>{key}:</span> {value}
                      </li>
                    )
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
