package com.example.backend.Repos;

import com.example.backend.Entity.VariationOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VariationOptionRepo extends JpaRepository<VariationOption, Integer> {

    // Lấy tất cả option theo variation_id
    List<VariationOption> findByVariation_Id(Integer variationId);

    // Tìm các option có value (không phân biệt hoa thường)
    List<VariationOption> findByValueIgnoreCase(String value);

    // Kiểm tra option có tồn tại trong variation cụ thể không
    boolean existsByValueIgnoreCaseAndVariation_Id(String value, Integer variationId);
}
