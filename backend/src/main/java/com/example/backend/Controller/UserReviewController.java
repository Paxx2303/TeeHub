package com.example.backend.Controller;

import com.example.backend.Entity.UserReview;
import com.example.backend.Service.UserReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class UserReviewController {

    private final UserReviewService userReviewService;

    public UserReviewController(UserReviewService userReviewService) {
        this.userReviewService = userReviewService;
    }

    // Lấy tất cả review
    @GetMapping
    public List<UserReview> getAllReviews() {
        return userReviewService.getAllReviews();
    }

    // Lấy review theo ID
    @GetMapping("/{id}")
    public ResponseEntity<UserReview> getReviewById(@PathVariable Integer id) {
        return userReviewService.getReviewById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Lấy review theo user
    @GetMapping("/user/{userId}")
    public List<UserReview> getReviewsByUser(@PathVariable Integer userId) {
        return userReviewService.getReviewsByUser(userId);
    }

    // Lấy review theo product
    @GetMapping("/product/{productId}")
    public List<UserReview> getReviewsByProduct(@PathVariable Integer productId) {
        return userReviewService.getReviewsByProduct(productId);
    }

    // Thêm mới review
    @PostMapping
    public UserReview createReview(@RequestBody UserReview review) {
        return userReviewService.saveReview(review);
    }

    // Cập nhật review
    @PutMapping("/{id}")
    public ResponseEntity<UserReview> updateReview(
            @PathVariable Integer id,
            @RequestBody UserReview review
    ) {
        return userReviewService.updateReview(id, review)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Xóa review
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Integer id) {
        userReviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }
}
