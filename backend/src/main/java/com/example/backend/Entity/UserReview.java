package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_review")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer review_id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private SiteUser user_id;

    @ManyToOne
    @JoinColumn(name = "ordered_product_id")
    private ProductItem ordered_product_id;

    @Column(columnDefinition = "int check (rating_value between 1 and 5)")
    private Integer rating_value;

    @Column(columnDefinition = "TEXT")
    private String comment;
}