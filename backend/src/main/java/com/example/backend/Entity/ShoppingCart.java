package com.example.backend.Entity;


import jakarta.persistence.*;

import lombok.*;

import java.util.Collection;

@Entity
@Table(name = "shopping_cart")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class ShoppingCart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer cart_id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private SiteUser user_id;


}