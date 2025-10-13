package com.example.backend.DTO;

import com.example.backend.Entity.UserReview;
import lombok.Data;

@Data
public class UserReviewDTO {
    private Integer id;
    private Integer ratingValue;
    private String comment;
    private Integer userId;
    private String userEmail;
    private Integer productId;
    private String productName;

    // Constructor nhận Entity → tự map
    public UserReviewDTO(UserReview review) {
        this.id = review.getId();
        this.ratingValue = review.getRatingValue();
        this.comment = review.getComment();

        if (review.getUser() != null) {
            this.userId = review.getUser().getId();
            this.userEmail = review.getUser().getEmailAddress();
        }

        if (review.getOrderedProduct() != null) {
            this.productId = review.getOrderedProduct().getId();
            if (review.getOrderedProduct().getProduct() != null)
                this.productName = review.getOrderedProduct().getProduct().getName();
        }
    }
}
