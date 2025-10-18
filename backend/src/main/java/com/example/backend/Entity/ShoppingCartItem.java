package com.example.backend.Entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "shopping_cart_item")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShoppingCartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer cart_item_id;

    @ManyToOne
    @JoinColumn(name = "cart_id")
    private ShoppingCart cart_id;

    @ManyToOne
    @JoinColumn(name = "product_item_id")
    private ProductItem product_item_id;

    @Column(columnDefinition = "int default 1")
    private Integer qty;
}