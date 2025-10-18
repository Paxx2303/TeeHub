package com.example.backend.DTO.Response;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserReviewResponse {
    private Integer review_id;
    private Integer user_id;
    private String email_address;
    private Integer product_item_id;
    private String product_name;
    private Integer rating_value;
    private String comment;
}
