"use client";

import React from "react";
import { motion } from "framer-motion";
import styles from "./SobreNos.module.css";
import { Users, Award, Heart } from "lucide-react";

export default function SobreNosPage() {
  return (
    <main className={styles.container}>
      {/* Hero Section */}
      <motion.section
        className={styles.hero}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className={styles.title}>Sobre Nós</h1>
        <p className={styles.subtitle}>
          Conheça nossa história, valores e o propósito que nos guia todos os
          dias.
        </p>
      </motion.section>

      {/* História */}
      <motion.section
        className={styles.section}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className={styles.sectionTitle}>Nossa História</h2>
        <p className={styles.text}>
          Desde o início, nossa missão sempre foi oferecer produtos e serviços
          de qualidade com foco em confiança, inovação e proximidade com nossos
          clientes. Ao longo dos anos, crescemos com base em valores sólidos,
          construindo uma marca respeitada e reconhecida.
        </p>
      </motion.section>

      {/* Missão, Visão e Valores */}
      <motion.section
        className={styles.grid}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className={styles.card}>
          <Users className={styles.icon} />
          <h3>Missão</h3>
          <p>
            Levar confiança, inovação e qualidade em cada produto, criando
            experiências que realmente importam.
          </p>
        </div>
        <div className={styles.card}>
          <Award className={styles.icon} />
          <h3>Visão</h3>
          <p>
            Ser referência no mercado, reconhecida pelo nosso compromisso com
            excelência e credibilidade.
          </p>
        </div>
        <div className={styles.card}>
          <Heart className={styles.icon} />
          <h3>Valores</h3>
          <p>
            Ética, transparência, inovação, respeito às pessoas e foco na
            satisfação do cliente.
          </p>
        </div>
      </motion.section>
    </main>
  );
}
