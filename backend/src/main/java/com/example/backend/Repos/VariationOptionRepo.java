package com.example.backend.Repos;

import com.example.backend.DTO.Response.VariationOptionDTO;
import com.example.backend.Entity.VariationOption;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VariationOptionRepo extends JpaRepository<VariationOption, Integer> {

    @Query("""
        select new com.example.backend.DTO.Response.VariationOptionDTO(
            vo.variation_option_id,
            v.variation_id,
            v.name,
            c.category_id,
            c.category_name,
            vo.value
        )
        from VariationOption vo
        left join vo.variation_id v
        left join v.category_id c
    """)
    List<VariationOptionDTO> findAllAsDto();

    @Query("""
        select new com.example.backend.DTO.Response.VariationOptionDTO(
            vo.variation_option_id,
            v.variation_id,
            v.name,
            c.category_id,
            c.category_name,
            vo.value
        )
        from VariationOption vo
        left join vo.variation_id v
        left join v.category_id c
        where v.variation_id = :variationId
    """)
    List<VariationOptionDTO> findByVariationIdAsDto(@Param("variationId") Integer variationId);

    @Query("""
        select new com.example.backend.DTO.Response.VariationOptionDTO(
            vo.variation_option_id,
            v.variation_id,
            v.name,
            c.category_id,
            c.category_name,
            vo.value
        )
        from VariationOption vo
        left join vo.variation_id v
        left join v.category_id c
        where c.category_id = :categoryId
    """)
    List<VariationOptionDTO> findByCategoryIdAsDto(@Param("categoryId") Integer categoryId);

    @Query("""
        select new com.example.backend.DTO.Response.VariationOptionDTO(
            vo.variation_option_id,
            v.variation_id,
            v.name,
            c.category_id,
            c.category_name,
            vo.value
        )
        from VariationOption vo
        left join vo.variation_id v
        left join v.category_id c
        where lower(vo.value) like lower(concat('%', :keyword, '%'))
    """)
    List<VariationOptionDTO> searchByValueAsDto(@Param("keyword") String keyword);
}
