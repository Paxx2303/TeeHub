package com.example.backend.Controller;

import com.example.backend.DTO.Request.CreateProductRequest;
import com.example.backend.DTO.Request.UpdateProductRequest;
import com.example.backend.DTO.Response.ProductPageResponse;
import com.example.backend.DTO.Response.ProductResponse;
import com.example.backend.Service.ProductCreateService;
import com.example.backend.Service.ProductService;
import com.example.backend.Service.ProductUpdateService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;
    private final ProductUpdateService productWriteService;
    private final ProductCreateService productCreateService;
    @GetMapping
    public ResponseEntity<ProductPageResponse<ProductResponse>> getAllProducts(
            @PageableDefault(page = 0, size = 10) Pageable pageable,
            // THÊM THAM SỐ NÀY:
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) String searchTerm // <-- THÊM THAM SỐ NÀY
    ) {
        // Truyền categoryId vào service
        ProductPageResponse<ProductResponse> products = productService.getAllProducts(
                pageable, categoryId, searchTerm);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Integer id) {
        ProductResponse product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Integer id,
            @RequestBody UpdateProductRequest request
    ) {
        // Gọi service Ghi để cập nhật
        ProductResponse updatedProduct = productWriteService.updateProduct(id, request);
        return ResponseEntity.ok(updatedProduct);
    }

    //post
    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(
            @RequestBody CreateProductRequest request // Sử dụng DTO mới
    ) {
        ProductResponse newProduct = productCreateService.createProduct(request);

        // Trả về HTTP 201 Created
        return ResponseEntity.status(HttpStatus.CREATED).body(newProduct);
    }

    //xóa
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteProduct(@PathVariable Integer id) {

        // 1. Gọi service và nhận message
        String message = productService.deleteProduct(id);

        // 2. Tạo 1 object Map để chứa message
        Map<String, String> response = new HashMap<>();
        response.put("message", message);

        // 3. Trả về 200 OK với body là message
        return ResponseEntity.ok(response);
    }
}
