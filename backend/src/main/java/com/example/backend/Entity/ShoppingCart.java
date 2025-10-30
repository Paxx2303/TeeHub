package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "shopping_cart", schema = "ecommerce")
public class ShoppingCart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_id", nullable = false)
<<<<<<< HEAD
    private Integer cartId;
    @Column(name = "user_id")
    private Integer userId;
=======
    private Integer id;

    //TODO [Reverse Engineering] generate columns from DB
>>>>>>> main
}