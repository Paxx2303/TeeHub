//package com.example.backend.Service.Not_Done;
//
//import com.example.backend.DTO.Response.UserReviewDTO;
//import com.example.backend.Repos.UserReviewRepo;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.HttpStatus;
//import org.springframework.stereotype.Service;
//import org.springframework.web.server.ResponseStatusException;
//
//import java.util.List;
//
//@Service
//@RequiredArgsConstructor
//public class UserReviewService {
//
//    private final UserReviewRepo userReviewRepo;
//
//    public List<UserReviewDTO> getAllReviews() {
//        var list = userReviewRepo.findAllAsDto();
//        if (list.isEmpty()) {
//            // 404 khi không có dữ liệu
//            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không có đánh giá nào.");
//        }
//        return list;
//    }
//
//    public List<UserReviewDTO> getReviewsByUserId(Integer userId) {
//        var list = userReviewRepo.findByUserIdAsDto(userId);
//        if (list.isEmpty()) {
//            throw new ResponseStatusException(
//                    HttpStatus.NOT_FOUND,
//                    "User " + userId + " chưa có đánh giá."
//            );
//        }
//        return list;
//    }
//
//    public List<UserReviewDTO> getReviewsByProductItemId(Integer productItemId) {
//        var list = userReviewRepo.findByProductItemIdAsDto(productItemId);
//        if (list.isEmpty()) {
//            throw new ResponseStatusException(
//                    HttpStatus.NOT_FOUND,
//                    "Sản phẩm (item) " + productItemId + " chưa có đánh giá."
//            );
//        }
//        return list;
//    }
//}
