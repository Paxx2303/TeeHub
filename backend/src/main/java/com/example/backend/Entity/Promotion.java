package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "promotion")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Promotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer promotion_id;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private ProductCategory category_id;

    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(precision = 5, scale = 2, columnDefinition = "decimal(5,2) check (discount_rate >= 0 and discount_rate <= 100)")
    private BigDecimal discount_rate;

    private LocalDate start_date;
    private LocalDate end_date;
}