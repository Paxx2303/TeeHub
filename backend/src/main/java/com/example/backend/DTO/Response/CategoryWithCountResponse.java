package com.example.backend.DTO.Response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor // Cần constructor không tham số cho Jackson
@AllArgsConstructor // Constructor với tất cả tham số
public class CategoryWithCountResponse {
    private Integer categoryId;
    private String categoryName;
    // Thêm các trường khác của Category nếu cần (vd: parentCategoryId)
    private long productCount; // Số lượng sản phẩm
}
