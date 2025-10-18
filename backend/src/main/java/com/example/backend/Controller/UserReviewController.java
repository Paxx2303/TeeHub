package com.example.backend.Controller;

import com.example.backend.DTO.Response.UserReviewResponse;
import com.example.backend.Service.UserReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class UserReviewController {

    private final UserReviewService service;

    @GetMapping
    public ResponseEntity<List<UserReviewResponse>> getAll() {
        var list = service.getAllReviews();
        return list.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(list);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserReviewResponse>> byUser(@PathVariable Integer userId) {
        var list = service.getReviewsByUserId(userId);
        return list.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(list);
    }

    @GetMapping("/product/{productItemId}")
    public ResponseEntity<List<UserReviewResponse>> byProductItem(@PathVariable Integer productItemId) {
        var list = service.getReviewsByProductItemId(productItemId);
        return list.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(list);
    }
}
