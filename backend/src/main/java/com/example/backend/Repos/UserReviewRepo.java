package com.example.backend.Repos;

import com.example.backend.DTO.Response.UserReviewDTO;
import com.example.backend.Entity.UserReview;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserReviewRepo extends JpaRepository<UserReview, Integer> {

    @Query("""
        select new com.example.backend.DTO.Response.UserReviewDTO(
            ur.review_id,
            u.id,                
            u.email_address,    
            pi.product_item_id,  
            p.name,             
            ur.rating_value,
            ur.comment
        )
        from UserReview ur
        left join ur.user_id u
        left join ur.ordered_product_id pi
        left join pi.product_id p
    """)
    List<UserReviewDTO> findAllAsDto();

    @Query("""
        select new com.example.backend.DTO.Response.UserReviewDTO(
            ur.review_id,
            u.id,
            u.email_address,
            pi.product_item_id,
            p.name,
            ur.rating_value,
            ur.comment
        )
        from UserReview ur
        left join ur.user_id u
        left join ur.ordered_product_id pi
        left join pi.product_id p
        where u.id = :userId
    """)
    List<UserReviewDTO> findByUserIdAsDto(@Param("userId") Integer userId);

    @Query("""
        select new com.example.backend.DTO.Response.UserReviewDTO(
            ur.review_id,
            u.id,
            u.email_address,
            pi.product_item_id,
            p.name,
            ur.rating_value,
            ur.comment
        )
        from UserReview ur
        left join ur.user_id u
        left join ur.ordered_product_id pi
        left join pi.product_id p
        where pi.product_item_id = :productItemId
    """)
    List<UserReviewDTO> findByProductItemIdAsDto(@Param("productItemId") Integer productItemId);
}
