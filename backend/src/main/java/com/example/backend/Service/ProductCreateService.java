package com.example.backend.Service;

import com.example.backend.DTO.Request.CreateProductRequest;
import com.example.backend.DTO.Response.ProductResponse;
import com.example.backend.Entity.*;
import com.example.backend.Exception.ResourceNotFoundException;
import com.example.backend.Repos.*;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service
public class ProductCreateService {
    // Tiêm (Inject) tất cả các Repo cần thiết
    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private ProductCategoryRepo categoryRepo;

    @Autowired
    private ProductItemRepo itemRepo;

    @Autowired
    private ProductConfigurationRepo configRepo;

    @Autowired
    private VariationOptionRepo variationOptionRepo;

    // Tiêm service Đọc (GET) để gọi lại sau khi tạo xong
    @Autowired
    private ProductService productService;

    /**
     * TẠO MỚI một sản phẩm (POST)
     */
    @Transactional // Rất quan trọng!
    public ProductResponse createProduct(CreateProductRequest request) {

        // --- 1. Tạo Product chính ---
        Product product = new Product();
        product.setName(request.getProductName());
        product.setDescription(request.getProductDescription());
        product.setProductImage(request.getProductMainImage());

        // --- 2. Lấy và Gán Category ---
        if (request.getCategoryId() != null) {
            ProductCategory category = categoryRepo.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));
            product.setCategory(category);
        }

        // --- 3. LƯU Product (Quan trọng!) ---
        Product savedProduct = productRepo.save(product);

        // --- 4. Tạo các ProductItem (và Configuration lồng nhau) ---
        if (request.getItems() != null) {
            for (CreateProductRequest.ItemCreateRequest reqItem : request.getItems()) {

                // 4a. Tạo ProductItem
                ProductItem newItem = new ProductItem();
                newItem.setProduct(savedProduct); // Gán vào Product cha
                newItem.setSku(reqItem.getSku());
                newItem.setQtyInStock(reqItem.getQtyInStock());
                newItem.setProductImage(reqItem.getItemImage());
                newItem.setPrice(reqItem.getPrice());

                // 4b. LƯU ProductItem
                ProductItem savedItem = itemRepo.save(newItem);

                // 4c. Tạo các ProductConfiguration (bảng join)
                if (reqItem.getVariationOptionIds() != null) {
                    for (Integer optionId : reqItem.getVariationOptionIds()) {

                        VariationOption option = variationOptionRepo.findById(optionId)
                                .orElseThrow(() -> new ResourceNotFoundException("VariationOption not found with id: " + optionId));

                        ProductConfiguration newConfig = new ProductConfiguration();

                        // 4d. Tạo Composite ID
                        ProductConfigurationId configId = new ProductConfigurationId();
                        configId.setProductItemId(savedItem.getId()); // ID từ item vừa lưu
                        configId.setVariationOptionId(optionId);

                        newConfig.setId(configId);
                        newConfig.setProductItem(savedItem);
                        newConfig.setVariationOption(option);

                        configRepo.save(newConfig);
                    }
                }
            }
        }

        // --- 5. Trả về DTO hoàn chỉnh ---
        // Gọi lại hàm GET để lấy dữ liệu mới nhất
        return productService.getProductById(savedProduct.getId());
    }
}
