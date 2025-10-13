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
//    // 🟢 Lấy tất cả review
//    @GetMapping
//    public List<UserReviewDTO> getAllReviews() {
//        return userReviewService.getAllReviews();
//    }
//
//    // 🟢 Lấy review theo ID (đã bỏ Optional + map)
//    @GetMapping("/{id}")
//    public ResponseEntity<UserReviewDTO> getReviewById(@PathVariable Integer id) {
//        return ResponseEntity.ok(userReviewService.getReviewById(id));
//    }
//
//    // 🟢 Lấy review theo user ID
//    @GetMapping("/user/{userId}")
//    public List<UserReviewDTO> getReviewsByUser(@PathVariable Integer userId) {
//        return userReviewService.getReviewsByUser(userId);
//    }
//
//    // 🟢 Lấy review theo product ID
//    @GetMapping("/product/{productId}")
//    public List<UserReviewDTO> getReviewsByProduct(@PathVariable Integer productId) {
//        return userReviewService.getReviewsByProduct(productId);
//    }
//
//    // 🟢 Tạo mới review
//    @PostMapping
//    public ResponseEntity<UserReviewDTO> createReview(@RequestBody UserReviewDTO dto) {
//        return ResponseEntity.ok(userReviewService.saveReview(dto));
//    }
//
//    // 🟢 Cập nhật review (đã bỏ Optional + map)
//    @PutMapping("/{id}")
//    public ResponseEntity<UserReviewDTO> updateReview(
//            @PathVariable Integer id,
//            @RequestBody UserReviewDTO dto
//    ) {
//        return ResponseEntity.ok(userReviewService.updateReview(id, dto));
//    }
//
//    // 🟢 Xóa review
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteReview(@PathVariable Integer
