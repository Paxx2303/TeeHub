//package com.example.backend.Controller;
//
//import com.example.backend.DTO.UserReviewDTO;
//import com.example.backend.Service.UserReviewService;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/reviews")
//public class UserReviewController {
//
//    private final UserReviewService userReviewService;
//
//    public UserReviewController(UserReviewService userReviewService) {
//        this.userReviewService = userReviewService;
//    }
//
//    @GetMapping
//    public List<UserReviewDTO> getAllReviews() {
//        return userReviewService.getAllReviews();
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<UserReviewDTO> getReviewById(@PathVariable Integer id) {
//        return userReviewService.getReviewById(id)
//                .map(ResponseEntity::ok)
//                .orElse(ResponseEntity.notFound().build());
//    }
//
//    @GetMapping("/user/{userId}")
//    public List<UserReviewDTO> getReviewsByUser(@PathVariable Integer userId) {
//        return userReviewService.getReviewsByUser(userId);
//    }
//
//    @GetMapping("/product/{productId}")
//    public List<UserReviewDTO> getReviewsByProduct(@PathVariable Integer productId) {
//        return userReviewService.getReviewsByProduct(productId);
//    }
//
//    @PostMapping
//    public ResponseEntity<UserReviewDTO> createReview(@RequestBody UserReviewDTO dto) {
//        return ResponseEntity.ok(userReviewService.saveReview(dto));
//    }
//
//    @PutMapping("/{id}")
//    public ResponseEntity<UserReviewDTO> updateReview(@PathVariable Integer id, @RequestBody UserReviewDTO dto) {
//        return userReviewService.updateReview(id, dto)
//                .map(ResponseEntity::ok)
//                .orElse(ResponseEntity.notFound().build());
//    }
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteReview(@PathVariable Integer id) {
//        userReviewService.deleteReview(id);
//        return ResponseEntity.noContent().build();
//    }
//}
