package com.example.backend.Service;

import com.example.backend.Entity.UserReview;
import com.example.backend.Repos.UserReviewRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserReviewService {

    private final UserReviewRepo userReviewRepository;

    public UserReviewService(UserReviewRepo userReviewRepository) {
        this.userReviewRepository = userReviewRepository;
    }

    // Lấy tất cả review
    public List<UserReview> getAllReviews() {
        return userReviewRepository.findAll();
    }

    // Lấy review theo ID
    public Optional<UserReview> getReviewById(Integer id) {
        return userReviewRepository.findById(id);
    }

    // Lấy review theo user_id
    public List<UserReview> getReviewsByUser(Integer userId) {
        return userReviewRepository.findByUser_Id(userId);
    }

    // Lấy review theo product_id
    public List<UserReview> getReviewsByProduct(Integer productId) {
        return userReviewRepository.findByOrderedProduct_Id(productId);
    }

    // Thêm hoặc cập nhật review mới
    public UserReview saveReview(UserReview review) {
        return userReviewRepository.save(review);
    }

    // Cập nhật review theo ID
    public Optional<UserReview> updateReview(Integer id, UserReview updatedReview) {
        return userReviewRepository.findById(id).map(existing -> {
            existing.setRatingValue(updatedReview.getRatingValue());
            existing.setComment(updatedReview.getComment());
            existing.setUser(updatedReview.getUser());
            existing.setOrderedProduct(updatedReview.getOrderedProduct());
            return userReviewRepository.save(existing);
        });
    }

    // Xóa review theo ID
    public void deleteReview(Integer id) {
        userReviewRepository.deleteById(id);
    }
}
