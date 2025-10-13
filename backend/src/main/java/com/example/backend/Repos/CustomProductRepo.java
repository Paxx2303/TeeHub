package com.example.backend.Repos;

import com.example.backend.Entity.CustomProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomProductRepo extends JpaRepository<CustomProduct, Integer> {

    // Tìm tất cả custom product của một user
    List<CustomProduct> findByUserId(Integer userId);

    // Tìm custom product theo product item
    List<CustomProduct> findByProductItemId(Integer productItemId);

    // Tìm custom product theo user và product item
    Optional<CustomProduct> findByUserIdAndProductItemId(Integer userId, Integer productItemId);

    // Tìm custom product có custom name chứa keyword
    List<CustomProduct> findByCustomNameContainingIgnoreCase(String keyword);



    // Đếm số lượng custom product của user
    long countByUserId(Integer userId);

    // Kiểm tra user có custom product nào không
    boolean existsByUserId(Integer userId);

    // Xóa tất cả custom product của user
    void deleteByUserId(Integer userId);

    // Lấy custom product mới nhất của user
    Optional<CustomProduct> findFirstByUserIdOrderByCreatedAtDesc(Integer userId);
}