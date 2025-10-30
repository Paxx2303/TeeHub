// backend/src/main/java/com/example/backend/Repos/PromotionRepo.java
package com.example.backend.Repos;

import com.example.backend.DTO.Response.PromotionResponse;
import com.example.backend.Entity.Promotion;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PromotionRepo extends JpaRepository<Promotion, Integer> {

    @Query("""
        select new com.example.backend.DTO.Response.PromotionResponse(
            pr.id,
            c.id,
            c.categoryName,
            pr.name,
            pr.description,
            pr.discountRate,
            pr.startDate,
            pr.endDate,
            (case when :today between pr.startDate and pr.endDate then true else false end)
        )
        from Promotion pr
        left join pr.category c
        """)
    List<PromotionResponse> findAllAsDto(@Param("today") LocalDate today);

    @Query("""
        select new com.example.backend.DTO.Response.PromotionResponse(
            pr.id,
            c.id,
            c.categoryName,
            pr.name,
            pr.description,
            pr.discountRate,
            pr.startDate,
            pr.endDate,
            (case when :today between pr.startDate and pr.endDate then true else false end)
        )
        from Promotion pr
        left join pr.category c
        where pr.id = :promotionId
        """)
    PromotionResponse findOneAsDto(@Param("promotionId") Integer promotionId,
                                   @Param("today") LocalDate today);

    @Query("""
        select new com.example.backend.DTO.Response.PromotionResponse(
            pr.id,
            c.id,
            c.categoryName,
            pr.name,
            pr.description,
            pr.discountRate,
            pr.startDate,
            pr.endDate,
            (case when :today between pr.startDate and pr.endDate then true else false end)
        )
        from Promotion pr
        left join pr.category c
        where c.id = :categoryId
        """)
    List<PromotionResponse> findByCategoryIdAsDto(@Param("categoryId") Integer categoryId,
                                                  @Param("today") LocalDate today);

    @Query("""
        select new com.example.backend.DTO.Response.PromotionResponse(
            pr.id,
            c.id,
            c.categoryName,
            pr.name,
            pr.description,
            pr.discountRate,
            pr.startDate,
            pr.endDate,
            true
        )
        from Promotion pr
        left join pr.category c
        where :today between pr.startDate and pr.endDate
        """)
    List<PromotionResponse> findActiveAsDto(@Param("today") LocalDate today);
}
