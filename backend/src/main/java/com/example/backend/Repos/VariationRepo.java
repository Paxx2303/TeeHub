package com.example.backend.Repos;

import com.example.backend.DTO.Response.VariationDTO;
import com.example.backend.Entity.Variation;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VariationRepo extends JpaRepository<Variation, Integer> {

    @Query("""
        select new com.example.backend.DTO.Response.VariationDTO(
            v.variation_id,
            c.category_id,
            c.category_name,
            v.name
        )
        from Variation v
        left join v.category_id c
    """)
    List<VariationDTO> findAllAsDto();

    @Query("""
        select new com.example.backend.DTO.Response.VariationDTO(
            v.variation_id,
            c.category_id,
            c.category_name,
            v.name
        )
        from Variation v
        left join v.category_id c
        where c.category_id = :categoryId
    """)
    List<VariationDTO> findByCategoryIdAsDto(@Param("categoryId") Integer categoryId);

    @Query("""
        select new com.example.backend.DTO.Response.VariationDTO(
            v.variation_id,
            c.category_id,
            c.category_name,
            v.name
        )
        from Variation v
        left join v.category_id c
        where lower(v.name) like lower(concat('%', :keyword, '%'))
    """)
    List<VariationDTO> searchByNameAsDto(@Param("keyword") String keyword);
}
