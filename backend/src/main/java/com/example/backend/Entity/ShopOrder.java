package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "shop_order")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShopOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer order_id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private SiteUser user_id;

    private String payment_type_name;
    private String payment_provider;
    private String payment_account_number;
    private String payment_status;
    private LocalDateTime payment_date;

    @ManyToOne
    @JoinColumn(name = "shipping_address_id")
    private Address shipping_address_id;

    private String shipping_method_name;

    @Column(precision = 10, scale = 2)
    private BigDecimal shipping_price;

    private String order_status;

    @Column(columnDefinition = "timestamp default CURRENT_TIMESTAMP")
    private LocalDateTime order_date;

    @Column(precision = 10, scale = 2)
    private BigDecimal order_total;
}