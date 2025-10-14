package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "product_item")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer product_item_id;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product_id;

    @Column(nullable = false, name = "sku")
    private String SKU;

    @Column(columnDefinition = "int default 0")
    private Integer qty_in_stock;

    private String product_image;

    @Column(precision = 10, scale = 2)
    private BigDecimal price;
}