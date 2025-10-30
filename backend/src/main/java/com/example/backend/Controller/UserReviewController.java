package com.example.backend.Controller;

import com.example.backend.DTO.Request.UserReviewCreateRequest;
import com.example.backend.DTO.Response.ReviewStatsResponse;
import com.example.backend.DTO.Response.UserReviewResponse;
import com.example.backend.Service.UserReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserReviewController {

    @Autowired
    private UserReviewService reviewService;

    /**
     * API: Lấy tất cả review của 1 sản phẩm
     * GET /api/products/1/reviews
     */
    @GetMapping("/products/{productId}/reviews")
    public ResponseEntity<List<UserReviewResponse>> getProductReviews(
            @PathVariable Integer productId
    ) {
        return ResponseEntity.ok(reviewService.getReviewsForProduct(productId));
    }

    /**
     * API: Lấy thông số rating của 1 sản phẩm
     * GET /api/products/1/rating-stats
     */
    @GetMapping("/products/{productId}/rating-stats")
    public ResponseEntity<ReviewStatsResponse> getProductRatingStats(
            @PathVariable Integer productId
    ) {
        // Gọi service, nó trả về ReviewStatsResponse
        ReviewStatsResponse stats = reviewService.getRatingStatsForProduct(productId);
        // Trả về ResponseEntity gói ReviewStatsResponse
        return ResponseEntity.ok(stats);
    }

    /**
     * API: Post 1 review mới
     * POST /api/reviews
     */
    @PostMapping("/reviews")
    public ResponseEntity<UserReviewResponse> createProductReview(
            @RequestBody UserReviewCreateRequest request
    ) {
        UserReviewResponse newReview = reviewService.createReview(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(newReview);
    }
}