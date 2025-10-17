package com.example.backend.Controller;

import com.example.backend.DTO.Response.UserReviewDTO;
import com.example.backend.Service.Not_Done.UserReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = {"http://localhost:8080"})
@RequiredArgsConstructor
public class UserReviewController {

    private final UserReviewService service;

    @GetMapping
    public ResponseEntity<List<UserReviewDTO>> getAll() {
        var list = service.getAllReviews();
        return list.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(list);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserReviewDTO>> byUser(@PathVariable Integer userId) {
        var list = service.getReviewsByUserId(userId);
        return list.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(list);
    }

    @GetMapping("/product/{productItemId}")
    public ResponseEntity<List<UserReviewDTO>> byProductItem(@PathVariable Integer productItemId) {
        var list = service.getReviewsByProductItemId(productItemId);
        return list.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(list);
    }
}
