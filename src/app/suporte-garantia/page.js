"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  RefreshCcw,
  Headphones,
  Phone,
  Mail,
  MessageSquare,
  ChevronDown,
} from "lucide-react";
import styles from "./suporte.module.css";

const faqs = [
  {
    q: "Qual é o prazo de garantia dos iPhones?",
    a: "Oferecemos garantia de 12 meses contra defeitos de fabricação, além de suporte especializado durante todo o período.",
  },
  {
    q: "Como funciona a troca ou devolução?",
    a: "Você tem até 7 dias após o recebimento para solicitar devolução sem custo. Para troca por defeito, seguimos o prazo legal e garantimos substituição ágil.",
  },
  {
    q: "O suporte é via WhatsApp?",
    a: "Sim! Oferecemos suporte prioritário via WhatsApp, e também por e-mail e telefone comercial.",
  },
  {
    q: "O aparelho é testado antes do envio?",
    a: "Sim. Todo aparelho passa por checklist completo de diagnóstico, bateria, câmera, áudio e conectividade antes do envio.",
  },
];

export default function SuporteGarantiaPage() {
  const [open, setOpen] = useState(null);

  const toggle = (idx) => {
    setOpen((prev) => (prev === idx ? null : idx));
  };

  // Defina seu contato real aqui
  const WHATSAPP_NUMBER = "5511950887080";
  const whatsappLink = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(
    "Olá! Preciso de ajuda com suporte/garantia."
  )}`;

  return (
    <div className={styles.pageWrap}>
      {/* HERO */}
      <motion.section
        className={styles.hero}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className={styles.heroInner}>
          <div className={styles.kicker}>Suporte & Garantia</div>
          <h1 className={styles.title}>
            Confiança que acompanha você <span>de ponta a ponta</span>
          </h1>
          <p className={styles.subtitle}>
            Atendimento humano, garantia real e processos claros. A gente
            resolve rápido para você aproveitar seu iPhone sem dor de cabeça.
          </p>

          <div className={styles.heroCTAs}>
            <Link
              href={whatsappLink}
              target="_blank"
              className={styles.ctaPrimary}
            >
              <MessageSquare size={18} />
              Falar no WhatsApp
            </Link>
            <Link href="/#produtos" className={styles.ctaSecondary}>
              Ver produtos
            </Link>
          </div>
        </div>
      </motion.section>

      {/* CARDS */}
      <section className={styles.cardsGrid}>
        <motion.article
          className={styles.card}
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
        >
          <div className={styles.cardIconWrap}>
            <ShieldCheck className={styles.cardIcon} />
          </div>
          <h3 className={styles.cardTitle}>Garantia de 12 meses</h3>
          <p className={styles.cardText}>
            Cobertura contra defeitos de fabricação. Diagnóstico ágil e solução
            sem burocracia.
          </p>
        </motion.article>

        <motion.article
          className={styles.card}
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
        >
          <div className={styles.cardIconWrap}>
            <RefreshCcw className={styles.cardIcon} />
          </div>
          <h3 className={styles.cardTitle}>Troca & Devolução</h3>
          <p className={styles.cardText}>
            Até 7 dias para arrependimento. Em casos elegíveis, trocamos seu
            aparelho com prioridade.
          </p>
        </motion.article>

        <motion.article
          className={styles.card}
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
        >
          <div className={styles.cardIconWrap}>
            <Headphones className={styles.cardIcon} />
          </div>
          <h3 className={styles.cardTitle}>Suporte dedicado</h3>
          <p className={styles.cardText}>
            WhatsApp, e-mail e telefone comercial. Fale com especialistas de
            verdade.
          </p>
        </motion.article>
      </section>

      {/* CONTATO RÁPIDO */}
      <section className={styles.contactBlock}>
        <div className={styles.contactCard}>
          <div className={styles.contactRow}>
            <Phone size={18} />
            <span>(11) 95088-7080</span>
          </div>
          <div className={styles.contactRow}>
            <Mail size={18} />
            <span>contato@iphonespro.com.br</span>
          </div>
          <Link href={whatsappLink} target="_blank" className={styles.ctaWhats}>
            <MessageSquare size={18} />
            Atendimento via WhatsApp
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.faqSection}>
        <h2 className={styles.faqTitle}>Perguntas frequentes</h2>
        <div className={styles.faqList} role="list">
          {faqs.map((item, idx) => {
            const isOpen = open === idx;
            return (
              <div key={idx} className={styles.faqItem} role="listitem">
                <button
                  className={styles.faqButton}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${idx}`}
                  onClick={() => toggle(idx)}
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`${styles.chevron} ${
                      isOpen ? styles.chevronOpen : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>
                <motion.div
                  id={`faq-panel-${idx}`}
                  initial={false}
                  animate={{
                    height: isOpen ? "auto" : 0,
                    opacity: isOpen ? 1 : 0,
                  }}
                  transition={{ duration: 0.25 }}
                  className={styles.faqPanel}
                >
                  <p className={styles.faqAnswer}>{item.a}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className={styles.finalCTA}>
        <h3>Precisa de ajuda agora?</h3>
        <p>Fale com nosso time e resolva em minutos.</p>
        <Link href={whatsappLink} target="_blank" className={styles.ctaPrimary}>
          <MessageSquare size={18} />
          Abrir WhatsApp
        </Link>
      </section>
    </div>
  );
}
