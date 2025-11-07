package com.example.backend.Controller;

import com.example.backend.DTO.Request.CreateProductRequest;
import com.example.backend.DTO.Request.UpdateProductRequest;
import com.example.backend.DTO.Response.ProductPageResponse;
import com.example.backend.DTO.Response.ProductResponse;
import com.example.backend.Service.ProductCreateService;
import com.example.backend.Service.ProductService;
import com.example.backend.Service.ProductUpdateService;
import com.fasterxml.jackson.core.type.TypeReference;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper; // <-- THÊM IMPORT NÀY
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
    private final ObjectMapper objectMapper;
    @GetMapping
    public ResponseEntity<ProductPageResponse<ProductResponse>> getAllProducts(
            // Giữ nguyên các filter
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) String searchTerm,

            // Sửa lại cách nhận Pageable để lấy sort
            @PageableDefault(size = 10, sort = "productId", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        // Lấy thông tin sort từ pageable
        String sortProperty = "productId"; // Mặc định
        if (pageable.getSort().isSorted()) {
            // Lấy thuộc tính sort đầu tiên
            sortProperty = pageable.getSort().iterator().next().getProperty();
        }

        ProductPageResponse<ProductResponse> response;

        if ("hot".equalsIgnoreCase(sortProperty)) {
            // === LỌC THEO "HOT" ===
            // Gọi service MỚI
            // (Chúng ta bỏ qua categoryId và searchTerm theo "Cách 1")
            response = productService.getHottestProducts(pageable);
        } else {
            // === LỌC THÔNG THƯỜNG ===
            // Gọi service CŨ (giữ nguyên logic của bạn)
            response = productService.getAllProducts(pageable, categoryId, searchTerm);
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Integer id) {
        ProductResponse product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"}) // Thêm {id} và consumes
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Integer id, // <-- Giữ @PathVariable

            // 1. Nhận các trường text
            @RequestParam("productName") String productName,
            @RequestParam("categoryId") Integer categoryId,
            @RequestParam("productDescription") String productDescription,
            @RequestParam("items") String itemsJson, // <-- Nhận items JSON string

            // 2. Nhận file ảnh chính (TÙY CHỌN)
            @RequestPart(value = "productMainImage", required = false) MultipartFile productMainImage,

            // 3. Nhận mảng file ảnh của items (TÙY CHỌN)
            @RequestPart(value = "itemImages", required = false) List<MultipartFile> itemImages
    ) {
        try {
            // 4. Parse 'itemsJson' thành List DTO
            UpdateProductRequest request = new UpdateProductRequest();
            request.setProductName(productName);
            request.setCategoryId(categoryId);
            request.setProductDescription(productDescription);

            // Dùng ObjectMapper để parse chuỗi JSON items (DTO này đã bỏ trường itemImage)
            List<UpdateProductRequest.ItemSaveRequest> items = objectMapper.readValue(
                    itemsJson,
                    new TypeReference<List<UpdateProductRequest.ItemSaveRequest>>() {}
            );
            request.setItems(items);

            // 5. Gọi service (cần tạo hàm mới)
            ProductResponse updatedProduct = productWriteService.updateProductWithImages(
                    id, // Truyền ID
                    request,
                    productMainImage, // File (hoặc null)
                    itemImages      // List file (hoặc null)
            );

            return ResponseEntity.ok(updatedProduct);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi xử lý request cập nhật sản phẩm: " + e.getMessage(), e);
        }
    }

    //post
    @PostMapping(consumes = {"multipart/form-data"}) // <-- Báo Spring nhận FormData
    public ResponseEntity<ProductResponse> createProduct(
            // 1. Nhận các trường dữ liệu text
            @RequestParam("productName") String productName,
            @RequestParam("categoryId") Integer categoryId,
            @RequestParam("productDescription") String productDescription,
            @RequestParam("items") String itemsJson, // <- Nhận mảng items (dưới dạng JSON string)

            // 2. Nhận file ảnh chính
            @RequestPart("productMainImage") MultipartFile productMainImage,

            // 3. Nhận mảng file ảnh của items (tùy chọn)
            // Frontend đang gửi 'itemImages[index]', cách này không chuẩn
            // Sửa lại: Frontend gửi 'itemImages' (nhiều lần)
            @RequestPart(value = "itemImages", required = false) List<MultipartFile> itemImages
    ) {
        try {
            // 3. Chuyển đổi (parse) chuỗi 'itemsJson' thành List<ItemCreateRequest>
            CreateProductRequest request = new CreateProductRequest();
            request.setProductName(productName);
            request.setCategoryId(categoryId);
            request.setProductDescription(productDescription);


            List<CreateProductRequest.ItemCreateRequest> items = objectMapper.readValue(
                    itemsJson,
                    new TypeReference<List<CreateProductRequest.ItemCreateRequest>>() {}
            );
            request.setItems(items);

            // 4. Gọi service (bạn cần có hàm createProductWithImages trong service)
            // Đảm bảo ProductCreateService có hàm này
            ProductResponse newProduct = productCreateService.createProductWithImages(
                    request,
                    productMainImage,
                    itemImages
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(newProduct);

        } catch (Exception e) {
            // Bắt lỗi (ví dụ: parse JSON thất bại, lưu file thất bại)
            // In lỗi ra log backend để debug
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi xử lý request tạo sản phẩm: " + e.getMessage(), e);
        }
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
