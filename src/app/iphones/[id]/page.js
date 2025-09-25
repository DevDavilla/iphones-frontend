"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image"; // Mantido para logos e imagens internas
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

    if (typeof data === "number" || typeof data === "boolean") {
      return String(data);
    }

    if (typeof data === "string") {
      const trimmed = data.trim();
      if (trimmed === "") return null;

      if (
        trimmed.startsWith("{") ||
        trimmed.startsWith("[") ||
        trimmed.startsWith('"') ||
        trimmed.startsWith("'") ||
        /\\\"/.test(trimmed)
      ) {
        try {
          const parsed = JSON.parse(trimmed);
          return formatArrayData(parsed);
        } catch (e) {
          const cleaned = trimmed
            .replace(/\\+/g, "")
            .replace(/^\{/, "")
            .replace(/\}$/, "")
            .replace(/^\[/, "")
            .replace(/\]$/, "")
            .replace(/^"+|"+$/g, "")
            .replace(/^'+|'+$/g, "")
            .trim();
          return cleaned === "" ? null : cleaned;
        }
      }

      return trimmed;
    }

    if (Array.isArray(data)) {
      const arr = data
        .map((item) => {
          if (item === null || item === undefined) return null;
          if (typeof item === "object") {
            const v = Object.values(item)
              .map((vv) => (vv === null || vv === undefined ? "" : String(vv)))
              .filter(Boolean)
              .join(", ");
            return v || null;
          }
          return String(item).trim();
        })
        .filter(Boolean);

      return arr.length > 0 ? arr.join(", ") : null;
    }

    if (typeof data === "object") {
      const vals = Object.values(data)
        .map((v) => {
          if (v === null || v === undefined) return null;
          if (typeof v === "object") return JSON.stringify(v);
          return String(v).trim();
        })
        .filter(Boolean);

      return vals.length > 0 ? vals.join(", ") : null;
    }

    try {
      return String(data);
    } catch {
      return null;
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

  // Normaliza specs
  const specTela = formatArrayData(iphone.tamanho_tela_polegadas);
  const specChip = formatArrayData(iphone.processador_chip);
  const specBateria = formatArrayData(iphone.capacidade_bateria);
  const specConectividade = formatArrayData(iphone.tipo_conexao);
  const specConector = formatArrayData(iphone.tipo_conector);
  const specCamera = formatArrayData(iphone.recursos_camera);
  const specResistencia = formatArrayData(iphone.resistencia_agua_poeira);
  const specSO = formatArrayData(iphone.sistema_operacional);
  const specBiometria = formatArrayData(iphone.biometria);
  const specDimensoes = formatArrayData(iphone.dimensoes_axlxc);
  const specPeso = formatArrayData(iphone.peso_g);
  const specGarantia = formatArrayData(iphone.garantia_meses);
  const specCondicao = formatArrayData(iphone.condicao_aparelho);
  const specCores = formatArrayData(iphone.cores_disponiveis);

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
            <img
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
                Array.isArray(iphone.imagens_urls) &&
                iphone.imagens_urls.map((url, index) => (
                  <img
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
                {formatArrayData(iphone.opcoes_parcelamento) ||
                  JSON.stringify(iphone.opcoes_parcelamento)}
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
                {specTela && (
                  <li>
                    <span className={styles.negrito}>Tela:</span> {specTela}{" "}
                    polegadas
                  </li>
                )}
                {specChip && (
                  <li>
                    <span className={styles.negrito}>Chip:</span> {specChip}
                  </li>
                )}
                {specBateria && (
                  <li>
                    <span className={styles.negrito}>Bateria:</span>{" "}
                    {specBateria}
                  </li>
                )}
                {specConectividade && (
                  <li>
                    <span className={styles.negrito}>Conectividade:</span>{" "}
                    {specConectividade}
                  </li>
                )}
                {specConector && (
                  <li>
                    <span className={styles.negrito}>Conector:</span>{" "}
                    {specConector}
                  </li>
                )}
                {specCamera && (
                  <li>
                    <span className={styles.negrito}>Câmera:</span> {specCamera}
                  </li>
                )}
                {specResistencia && (
                  <li>
                    <span className={styles.negrito}>Resistência:</span>{" "}
                    {specResistencia}
                  </li>
                )}
                {specSO && (
                  <li>
                    <span className={styles.negrito}>Sistema Operacional:</span>{" "}
                    {specSO}
                  </li>
                )}
                {specBiometria && (
                  <li>
                    <span className={styles.negrito}>Biometria:</span>{" "}
                    {specBiometria}
                  </li>
                )}
                {specDimensoes && (
                  <li>
                    <span className={styles.negrito}>Dimensões (AxLxP):</span>{" "}
                    {specDimensoes} cm
                  </li>
                )}
                {specPeso && (
                  <li>
                    <span className={styles.negrito}>Peso:</span> {specPeso}g
                  </li>
                )}
                {specGarantia && (
                  <li>
                    <span className={styles.negrito}>Garantia:</span>{" "}
                    {specGarantia} meses
                  </li>
                )}
                {specCondicao && (
                  <li>
                    <span className={styles.negrito}>Condição:</span>{" "}
                    {specCondicao}
                  </li>
                )}
                {specCores && (
                  <li>
                    <span className={styles.negrito}>Cores:</span> {specCores}
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
