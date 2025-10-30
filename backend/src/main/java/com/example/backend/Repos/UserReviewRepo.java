package com.example.backend.Repos;

<<<<<<< HEAD
import com.example.backend.DTO.Response.UserReviewResponse;
=======
>>>>>>> origin/tan
import com.example.backend.Entity.UserReview;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserReviewRepo extends JpaRepository<UserReview, Integer> {

<<<<<<< HEAD
    @Query("""
        select new com.example.backend.DTO.Response.UserReviewResponse(
            ur.id,               
            u.id,              
            u.emailAddress,     
            op.id,                
            p.name,             
            ur.ratingValue,     
            ur.comment           
        )
        from UserReview ur
        left join ur.user u
        left join ur.orderedProduct op
        left join op.product p
        """)
    List<UserReviewResponse> findAllAsDto();

    @Query("""
        select new com.example.backend.DTO.Response.UserReviewResponse(
            ur.id,
            u.id,
            u.emailAddress,
            op.id,
            p.name,
            ur.ratingValue,
            ur.comment
        )
        from UserReview ur
        left join ur.user u
        left join ur.orderedProduct op
        left join op.product p
        where u.id = :userId
        """)
    List<UserReviewResponse> findByUserIdAsDto(@Param("userId") Integer userId);

    @Query("""
        select new com.example.backend.DTO.Response.UserReviewResponse(
            ur.id,
            u.id,
            u.emailAddress,
            op.id,
            p.name,
            ur.ratingValue,
            ur.comment
        )
        from UserReview ur
        left join ur.user u
        left join ur.orderedProduct op
        left join op.product p
        where op.id = :productItemId
        """)
    List<UserReviewResponse> findByProductItemIdAsDto(@Param("productItemId") Integer productItemId);
=======
    List<UserReview> findByOrderedProduct_Product_IdOrderByCreatedAtDesc(Integer productId);

    @Query("SELECT COALESCE(AVG(r.ratingValue), 0.0), COUNT(r) " +
            "FROM UserReview r " +
            "WHERE r.orderedProduct.product.id = :productId")
    List<Object[]> getRatingStatsForProduct(@Param("productId") Integer productId);
>>>>>>> origin/tan
}
