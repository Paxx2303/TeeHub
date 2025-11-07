// backend/src/main/java/com/example/backend/Repos/PromotionRepo.java
package com.example.backend.Repos;

import com.example.backend.DTO.Response.PromotionResponse;
import com.example.backend.Entity.Promotion;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PromotionRepo extends JpaRepository<Promotion, Integer> {
    Optional<Promotion> findByCategoryId(Integer categoryId);
}
