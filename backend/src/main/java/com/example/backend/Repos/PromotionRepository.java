package com.example.backend.Repos;

import com.example.backend.Entity.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Integer> {
    // Có thể thêm các truy vấn tùy chỉnh tại đây, ví dụ:
    // List<Promotion> findByCategoryId(Integer categoryId);
}
