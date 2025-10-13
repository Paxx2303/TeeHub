package com.example.backend.Repos;

import com.example.backend.Entity.Variation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VariationRepo extends JpaRepository<Variation, Integer> {

    // Lấy tất cả Variation theo category_id
    List<Variation> findByCategory_Id(Integer categoryId);

    // Tìm Variation theo tên (không phân biệt hoa thường)
    List<Variation> findByNameIgnoreCase(String name);

    // Kiểm tra Variation đã tồn tại trong 1 Category chưa
    boolean existsByNameIgnoreCaseAndCategory_Id(String name, Integer categoryId);
}
