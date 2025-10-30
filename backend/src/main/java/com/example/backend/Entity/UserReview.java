package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
<<<<<<< HEAD
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

=======
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

>>>>>>> origin/tan
@Getter
@Setter
@Entity
@Table(name = "user_review", schema = "ecommerce")
public class UserReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id")
    private SiteUser user;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "ordered_product_id")
    private ProductItem orderedProduct;

    @Column(name = "rating_value", nullable = false)
    private Integer ratingValue;

    @Column(name = "comment", length = Integer.MAX_VALUE)
    private String comment;
<<<<<<< HEAD

=======
    @CreationTimestamp // Tự động gán thời gian khi tạo
    @Column(name = "created_at", nullable = false, updatable = false) // Map với cột DB
    private LocalDateTime createdAt; // Kiểu dữ liệu thời gian
>>>>>>> origin/tan
}