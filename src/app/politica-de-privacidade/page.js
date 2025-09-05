"use client";

import React from "react";
import { motion } from "framer-motion";
import styles from "./PoliticaPrivacidade.module.css";
import { Shield, Lock, FileText } from "lucide-react";

export default function PoliticaPrivacidadePage() {
  return (
    <main className={styles.container}>
      {/* Hero Section */}
      <motion.section
        className={styles.hero}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className={styles.title}>Política de Privacidade</h1>
        <p className={styles.subtitle}>
          Sua privacidade é prioridade. Saiba como protegemos seus dados e
          garantimos segurança em cada interação.
        </p>
      </motion.section>

      {/* Introdução */}
      <motion.section
        className={styles.section}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className={styles.sectionTitle}>Compromisso com a privacidade</h2>
        <p className={styles.text}>
          Nós levamos a segurança dos seus dados a sério. Todas as informações
          coletadas são utilizadas de forma ética e responsável, com total
          transparência e respeito à sua privacidade.
        </p>
      </motion.section>

      {/* Blocos principais */}
      <motion.section
        className={styles.grid}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className={styles.card}>
          <Shield className={styles.icon} />
          <h3>Proteção de Dados</h3>
          <p>
            Utilizamos padrões avançados de segurança para proteger suas
            informações pessoais contra acessos não autorizados.
          </p>
        </div>
        <div className={styles.card}>
          <Lock className={styles.icon} />
          <h3>Uso Responsável</h3>
          <p>
            Seus dados são usados apenas para melhorar sua experiência, nunca
            sendo compartilhados sem sua permissão.
          </p>
        </div>
        <div className={styles.card}>
          <FileText className={styles.icon} />
          <h3>Transparência</h3>
          <p>
            Todas as práticas de coleta, uso e armazenamento de dados são
            descritas de forma clara nesta política.
          </p>
        </div>
      </motion.section>

      {/* Direitos do usuário */}
      <motion.section
        className={styles.section}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className={styles.sectionTitle}>Seus Direitos</h2>
        <p className={styles.text}>
          Você pode solicitar a qualquer momento a atualização, correção ou
          exclusão dos seus dados pessoais. Nosso compromisso é garantir que
          você tenha controle total sobre suas informações.
        </p>
      </motion.section>
    </main>
  );
}
