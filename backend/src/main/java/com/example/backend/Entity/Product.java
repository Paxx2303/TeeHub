package com.example.backend.Entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class

Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer product_id;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private ProductCategory category_id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String product_image;
}