// src/app/dashboard/orders/PedidosTable.js
"use client";

import React, { useState } from "react";
import styles from "./PedidosTable.module.css";

export default function PedidosTable({ pedidos, onStatusChange, onDelete }) {
  const [updatingId, setUpdatingId] = useState(null);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    await onStatusChange(id, newStatus);
    setUpdatingId(null);
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Produtos</th>
            <th>Total</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => (
            <tr key={pedido.id}>
              <td>{pedido.id}</td>
              <td>
                {pedido.cliente_nome}
                <br />
                <small>{pedido.cliente_email}</small>
              </td>
              <td>
                <pre className={styles.produtos}>
                  {JSON.stringify(pedido.produtos, null, 2)}
                </pre>
              </td>
              <td>R$ {pedido.total.toFixed(2)}</td>
              <td>
                <select
                  value={pedido.status}
                  onChange={(e) =>
                    handleStatusChange(pedido.id, e.target.value)
                  }
                  disabled={updatingId === pedido.id}
                  className={styles.selectStatus}
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Em processamento">Em processamento</option>
                  <option value="Concluído">Concluído</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </td>
              <td>
                <button
                  className={styles.deleteButton}
                  onClick={() => onDelete(pedido.id)}
                >
                  Deletar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
