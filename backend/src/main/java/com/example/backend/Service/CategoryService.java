package com.example.backend.Service;

import com.example.backend.DTO.Response.CategoryResponse;
import com.example.backend.DTO.Response.CategoryWithCountResponse;
import com.example.backend.Entity.ProductCategory;
import com.example.backend.Exception.ResourceNotFoundException;
import com.example.backend.Repos.ProductCategoryRepo;
import com.example.backend.Repos.ProductRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final ProductCategoryRepo categoryRepo; // Repo để lấy danh mục
    private final ProductRepo productRepo;   // Repo để đếm sản phẩm

    /**
     * Lấy tất cả danh mục cùng với số lượng sản phẩm tương ứng.
     * @return List các CategoryWithCountResponse DTO
     */
    public List<CategoryWithCountResponse> getAllCategoriesWithCount() {
        // 1. Lấy tất cả các Entity ProductCategory từ database
        List<ProductCategory> categories = categoryRepo.findAll();

        // 2. Sử dụng Stream API để xử lý danh sách categories
        return categories.stream()
                .map(category -> {
                    // 3. Với mỗi category entity, gọi hàm countByCategoryId trong ProductRepo
                    //    để lấy số lượng sản phẩm thuộc category đó.
                    long count = productRepo.countByCategoryId(category.getId()); // Đảm bảo entity có getCategoryId()

                    // 4. Tạo một đối tượng DTO CategoryWithCountResponse mới,
                    //    truyền vào thông tin từ entity và số lượng vừa đếm được.
                    return new CategoryWithCountResponse(
                            category.getId(),
                            category.getCategoryName(), // Đảm bảo entity có getCategoryName()
                            // Thêm các trường khác từ ProductCategory nếu cần (vd: parentCategoryId)
                            count // Số lượng sản phẩm
                    );
                })
                .collect(Collectors.toList()); // 5. Thu thập tất cả các DTO đã tạo thành một List mới
    }

    /**
     * Lấy thông tin chi tiết của một danh mục theo ID.
     * (Hàm này giữ nguyên, vẫn trả về CategoryResponse cũ không có count)
     * @param categoryId ID của danh mục cần lấy
     * @return CategoryResponse DTO
     * @throws ResourceNotFoundException Nếu không tìm thấy danh mục
     */
    public CategoryResponse getCategoryById(Integer categoryId) {
        // 1. Tìm Entity ProductCategory trong database bằng ID
        ProductCategory category = categoryRepo.findById(categoryId)
                // Nếu không tìm thấy, ném ra exception ResourceNotFoundException
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));

        // 2. Chuyển đổi Entity sang CategoryResponse DTO (dùng constructor của DTO)
        return new CategoryResponse(category);
    }

}
