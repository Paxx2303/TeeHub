package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "variation")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Variation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer variation_id;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private ProductCategory category_id;

    private String name;
}