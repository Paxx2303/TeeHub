package com.example.backend.Service;

<<<<<<< HEAD
import com.example.backend.DTO.Response.UserReviewResponse;
import com.example.backend.Repos.UserReviewRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserReviewService {

    private final UserReviewRepo userReviewRepo;

    public List<UserReviewResponse> getAllReviews() {
        var list = userReviewRepo.findAllAsDto();
        if (list.isEmpty()) {
            // 404 khi không có dữ liệu
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không có đánh giá nào.");
        }
        return list;
    }

    public List<UserReviewResponse> getReviewsByUserId(Integer userId) {
        var list = userReviewRepo.findByUserIdAsDto(userId);
        if (list.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "User " + userId + " chưa có đánh giá."
            );
        }
        return list;
    }

    public List<UserReviewResponse> getReviewsByProductItemId(Integer productItemId) {
        var list = userReviewRepo.findByProductItemIdAsDto(productItemId);
        if (list.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Sản phẩm (item) " + productItemId + " chưa có đánh giá."
            );
        }
        return list;
=======
import com.example.backend.DTO.Request.UserReviewCreateRequest;
import com.example.backend.DTO.Response.ReviewStatsResponse;
import com.example.backend.DTO.Response.UserReviewResponse;
import com.example.backend.Entity.ProductItem;
import com.example.backend.Entity.SiteUser;
import com.example.backend.Entity.UserReview;
import com.example.backend.Exception.ResourceNotFoundException;
import com.example.backend.Repos.ProductItemRepo;
import com.example.backend.Repos.SiteUserRepo;
import com.example.backend.Repos.UserReviewRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service

public class UserReviewService {
    @Autowired
    private UserReviewRepo reviewRepo;

    @Autowired
    private ProductItemRepo itemRepo;

    @Autowired
    private SiteUserRepo userRepo;


    public List<UserReviewResponse> getReviewsForProduct(Integer productId) {
        return reviewRepo.findByOrderedProduct_Product_IdOrderByCreatedAtDesc(productId)
                .stream()
                .map(UserReviewResponse::new) // Chuyển Entity -> DTO
                .collect(Collectors.toList());
    }


    public ReviewStatsResponse getRatingStatsForProduct(Integer productId) {
        // Kiểm tra xem query có trả về kết quả không
        List<Object[]> results = reviewRepo.getRatingStatsForProduct(productId);
        if (results == null || results.isEmpty() || results.get(0) == null) {
            // Trả về giá trị mặc định nếu không có review nào
            return new ReviewStatsResponse(0.0, 0L);
        }

        Object[] stats = results.get(0);
        Double average = (stats[0] instanceof Number) ? ((Number) stats[0]).doubleValue() : 0.0;
        Long count = (stats[1] instanceof Number) ? ((Number) stats[1]).longValue() : 0L;

        return new ReviewStatsResponse(average, count);
    }



    @Transactional
    public UserReviewResponse createReview(UserReviewCreateRequest request) {
        ProductItem item = itemRepo.findById(request.getProductItemId())
                .orElseThrow(() -> new ResourceNotFoundException("ProductItem not found"));
        SiteUser user = userRepo.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        UserReview review = new UserReview();
        review.setOrderedProduct(item);
        review.setUser(user);
        review.setRatingValue(request.getRatingValue());
        review.setComment(request.getComment());
        UserReview savedReview = reviewRepo.save(review);
        return new UserReviewResponse(savedReview);
>>>>>>> origin/tan
    }
}
