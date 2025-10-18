package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "custom_product", schema = "ecommerce")
public class CustomProduct {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "custom_product_id", nullable = false)
    private Integer id;

    @Column(name = "custom_name")
    private String customName;

    @Column(name = "custom_description", length = Integer.MAX_VALUE)
    private String customDescription;

    @Column(name = "custom_color", length = 50)
    private String customColor;

    @Column(name = "custom_text")
    private String customText;

    @Column(name = "custom_image_url")
    private String customImageUrl;

    @Column(name = "preview_image")
    private String previewImage;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    private Instant createdAt;

}