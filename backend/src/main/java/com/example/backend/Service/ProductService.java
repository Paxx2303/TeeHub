package com.example.backend.Service;

import com.example.backend.DTO.Response.ProductPageResponse;
import com.example.backend.DTO.Response.ProductResponse;
import com.example.backend.Exception.ResourceNotFoundException;
import com.example.backend.Repos.ProductRepo;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;


@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepo productRepo;
    private final ObjectMapper objectMapper;

    public ProductPageResponse<ProductResponse> getAllProducts(Pageable pageable, Integer categoryId, String searchTerm) {
        try {
            // 1. Lấy tham số phân trang
            int pageNumber = pageable.getPageNumber();
            int pageSize = pageable.getPageSize();
            int offset = pageNumber * pageSize;

            // Xử lý sort (hiện tại chỉ hỗ trợ productId)
            String sortColumn = "p_sub.product_id";
            String sortDirection = "DESC";
            Sort sort = pageable.getSort();
            if (sort.isSorted()) {
                Sort.Order order = sort.iterator().next();
                if ("productId".equalsIgnoreCase(order.getProperty())) {
                    sortColumn = "p_sub.product_id";
                    sortDirection = order.isAscending() ? "ASC" : "DESC";
                }
                // Bỏ qua các sort khác cho native query này
            }

            // 2. Gọi query đếm (COUNT)

            long totalElements = productRepo.countAllProducts(categoryId, searchTerm);
            // 3. Gọi query lấy dữ liệu (DATA)
            String jsonData = productRepo.getAllProductsAsJsonPaged(pageSize, offset, categoryId, searchTerm);
            // 4. Deserialize JSON (giống như cũ)
            List<ProductResponse> content;
            if (jsonData == null || jsonData.equals("[]")) {
                content = Collections.emptyList();
            } else {
                content = objectMapper.readValue(jsonData, new TypeReference<List<ProductResponse>>() {});
            }

            // 5. Tính toán thông tin phân trang
            int totalPages = (int) Math.ceil((double) totalElements / (double) pageSize);

            // 6. Xây dựng PagedResponse
            ProductPageResponse<ProductResponse> response = new ProductPageResponse<>();
            response.setContent(content);
            response.setPageNumber(pageNumber);
            response.setPageSize(pageSize);
            response.setTotalElements(totalElements);
            response.setTotalPages(totalPages);
            response.setLast(pageNumber >= (totalPages - 1));

            return response;

        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error parsing product data", e);
        }
    }

    public ProductResponse getProductById(Integer productId) {
        try {
            String jsonData = productRepo.getProductDetailAsJson(productId);

            if (jsonData == null || jsonData.equals("null")) {
                throw new ResourceNotFoundException("Product not found with id: " + productId);
            }

            return objectMapper.readValue(jsonData, ProductResponse.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error parsing product data", e);
        }
    }

    /**
     * XOÁ một sản phẩm (DELETE)
     */
    @Transactional
    public String deleteProduct(Integer productId) {

        // 1. Kiểm tra xem sản phẩm có tồn tại không
        if (!productRepo.existsById(productId)) {
            throw new ResourceNotFoundException("Product not found with id: " + productId);
        }

        // 2. Xoá
        productRepo.deleteById(productId);
        return "Deleted product successful with id: " + productId;
    }
}
