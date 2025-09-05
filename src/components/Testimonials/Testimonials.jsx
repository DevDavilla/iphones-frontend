// src/components/Testimonials/Testimonials.jsx
"use client";

import React from "react";
import styles from "./Testimonials.module.css"; // Importa os estilos CSS Modules

// Dados de depoimentos estáticos (para demonstração)
const testimonialsData = [
  {
    id: 1,
    name: "Ana Carolina S.",
    text: "Comprei meu iPhone 15 Pro Max e a entrega foi super rápida! O atendimento é impecável e o aparelho veio perfeito. Recomendo demais!",
    rating: 5,
    avatar: "https://placehold.co/80x80/0A1C2B/FFFFFF?text=AS", // Placeholder para avatar
  },
  {
    id: 2,
    name: "Bruno M. Costa",
    text: "Nunca imaginei que comprar online seria tão seguro. Meu iPhone 14 Plus chegou em ótimas condições e o preço foi o melhor que encontrei. Confiança total!",
    rating: 5,
    avatar: "https://placehold.co/80x80/0A1C2B/FFFFFF?text=BC", // Placeholder para avatar
  },
  {
    id: 3,
    name: "Carla V. Lima",
    text: "Tive uma dúvida no pós-venda e fui prontamente atendida pelo WhatsApp. A equipe é muito atenciosa. Meu iPhone 13 é incrível!",
    rating: 3,
    avatar: "https://placehold.co/80x80/0A1C2B/FFFFFF?text=CL", // Placeholder para avatar
  },
];

// Componente de Depoimentos
const Testimonials = () => {
  return (
    <section className={styles.testimonialsSection}>
      <h2 className={styles.sectionTitle}>O que nossos clientes dizem</h2>
      <p className={styles.sectionSubtitle}>
        A satisfação dos nossos clientes é a nossa prioridade.
      </p>

      <div className={styles.testimonialsGrid}>
        {testimonialsData.map((testimonial) => (
          <div key={testimonial.id} className={styles.testimonialCard}>
            <div className={styles.cardHeader}>
              <img
                src={testimonial.avatar}
                alt={`Avatar de ${testimonial.name}`}
                className={styles.avatar}
              />
              <div className={styles.customerInfo}>
                <h3 className={styles.customerName}>{testimonial.name}</h3>
                <div className={styles.rating}>
                  {"★".repeat(testimonial.rating)}
                  {"☆".repeat(5 - testimonial.rating)} {/* Estrelas */}
                </div>
              </div>
            </div>
            <p className={styles.testimonialText}>{testimonial.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
