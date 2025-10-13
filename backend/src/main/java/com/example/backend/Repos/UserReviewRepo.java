package com.example.backend.Repos;

import com.example.backend.Entity.UserReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserReviewRepo extends JpaRepository<UserReview, Integer> {

    // Lấy danh sách review theo user_id
    List<UserReview> findByUser_Id(Integer userId);

    // Lấy danh sách review theo product_id
    List<UserReview> findByOrderedProduct_Id(Integer productId);

    // Lấy danh sách review theo rating
    List<UserReview> findByRatingValue(Integer ratingValue);

    // Kiểm tra xem user đã review một sản phẩm chưa
    boolean existsByUser_IdAndOrderedProduct_Id(Integer userId, Integer productId);
}
