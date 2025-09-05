// src/components/Toast/ToastContext.jsx
"use client"; // Indica que este é um componente do lado do cliente

import React, { createContext, useContext, useState, useCallback } from "react";
import Toast from "./Toast"; // Importa o componente Toast que acabamos de criar

// Cria o Contexto do Toast
const ToastContext = createContext(null);

// Hook personalizado para usar o Toast em qualquer componente
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

// Provedor do Toast que envolverá a aplicação
export const ToastProvider = ({ children }) => {
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState("info"); // 'info', 'success', 'error'

  // Função para exibir um Toast
  const showToast = useCallback((message, type = "info") => {
    setToastMessage(message);
    setToastType(type);
  }, []);

  // Função para limpar o Toast (chamada pelo componente Toast quando ele desaparece)
  const hideToast = useCallback(() => {
    setToastMessage(null);
    setToastType("info");
  }, []);

  // O valor do contexto que será fornecido aos componentes filhos
  const contextValue = { showToast };

  return (
    <ToastContext.Provider value={contextValue}>
      {children} {/* Renderiza os componentes filhos */}
      {/* O componente Toast real, que exibe a mensagem */}
      <Toast message={toastMessage} type={toastType} onClose={hideToast} />
    </ToastContext.Provider>
  );
};
