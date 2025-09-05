// src/components/Loader/Loader.jsx
"use client";

import React from "react";
import styles from "./Loader.module.css"; // Importa os estilos CSS Modules

// Componente Loader para indicar carregamento
const Loader = () => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.spinner}></div>
      <p className={styles.loadingText}>Carregando...</p>
    </div>
  );
};

export default Loader;
