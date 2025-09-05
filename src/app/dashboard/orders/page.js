"use client";

import React, { useEffect, useState } from "react";
import PedidosTable from "./PedidosTable";
import styles from "./Pedidos.module.css";

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPedidos = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/orders");
      if (!res.ok) throw new Error("Erro ao buscar pedidos");
      const data = await res.json();
      setPedidos(data.orders);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
    const interval = setInterval(fetchPedidos, 5000); // Atualiza a cada 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Pedidos</h1>
      {loading ? (
        <p className={styles.loading}>Carregando pedidos...</p>
      ) : pedidos.length === 0 ? (
        <p className={styles.empty}>Nenhum pedido encontrado.</p>
      ) : (
        <PedidosTable pedidos={pedidos} />
      )}
    </div>
  );
}
