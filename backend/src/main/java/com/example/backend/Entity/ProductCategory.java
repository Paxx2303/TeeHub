package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_category")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer category_id;

    @ManyToOne
    @JoinColumn(name = "parent_category_id")
    private ProductCategory parent_category_id;

    private String category_name;
}