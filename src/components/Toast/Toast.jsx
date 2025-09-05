// src/components/Toast/Toast.jsx
"use client";

import React, { useState, useEffect } from "react";
import styles from "./Toast.module.css"; // Importa os estilos CSS Modules

// Componente Toast para exibir mensagens de feedback
const Toast = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Efeito para controlar a visibilidade e o tempo de exibição do Toast
  useEffect(() => {
    if (message) {
      setIsVisible(true); // Torna o Toast visível quando há uma mensagem
      const timer = setTimeout(() => {
        setIsVisible(false); // Esconde o Toast após 3 segundos
        onClose(); // Chama a função onClose para limpar a mensagem no provedor
      }, 3000); // Duração do Toast: 3 segundos

      // Função de limpeza: limpa o timer se o componente for desmontado ou a mensagem mudar
      return () => clearTimeout(timer);
    }
  }, [message, onClose]); // Depende da mensagem e da função onClose

  // Retorna null se não estiver visível para não renderizar nada
  if (!isVisible || !message) {
    return null;
  }

  // Define a classe CSS baseada no tipo de mensagem (sucesso, erro, info)
  const toastClass = `${styles.toastContainer} ${styles[type]}`;

  return (
    <div className={toastClass}>
      <p className={styles.toastMessage}>{message}</p>
      {/* Botão para fechar o Toast manualmente (opcional) */}
      <button
        onClick={() => {
          setIsVisible(false);
          onClose();
        }}
        className={styles.closeButton}
      >
        &times; {/* Símbolo 'x' para fechar */}
      </button>
    </div>
  );
};

export default Toast;
