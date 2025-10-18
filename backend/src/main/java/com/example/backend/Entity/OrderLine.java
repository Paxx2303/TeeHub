package com.example.backend.Entity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "order_line")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderLine {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer order_line_id;

    @ManyToOne
    @JoinColumn(name = "product_item_id")
    private ProductItem product_item_id;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private ShopOrder order_id;

    private Integer qty;

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    @ManyToOne
    @JoinColumn(name = "custom_product_id")
    private CustomProduct custom_product_id;
}