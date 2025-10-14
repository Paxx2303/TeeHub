package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "variation_option")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VariationOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer variation_option_id;

    @ManyToOne
    @JoinColumn(name = "variation_id")
    private Variation variation_id;

    private String value;
}