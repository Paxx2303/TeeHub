package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;


@Entity
@Table(name = "custom_product")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer custom_product_id;

    @ManyToOne
    @JoinColumn(name = "product_item_id")
    private ProductItem product_item_id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private SiteUser user_id;

    private String custom_name;

    @Column(columnDefinition = "TEXT")
    private String custom_description;

    private String custom_color;
    private String custom_text;
    private String custom_image_url;
    private String preview_image;

    @Column(columnDefinition = "timestamp default CURRENT_TIMESTAMP")
    private LocalDateTime created_at;
}