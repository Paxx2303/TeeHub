package com.example.backend.Service;

import com.example.backend.DTO.Request.UpdateProductRequest;
import com.example.backend.DTO.Response.ProductResponse;
import com.example.backend.Entity.*;
import com.example.backend.Exception.ResourceNotFoundException;
import com.example.backend.Repos.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;
@Service
public class ProductUpdateService {
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

    // Tiêm service Đọc (GET) để gọi lại sau khi cập nhật xong
    @Autowired
    private ProductService productService;

    /**
     * Cập nhật một sản phẩm (PUT)
     */
    @Transactional // Rất quan trọng!
    public ProductResponse updateProduct(Integer productId, UpdateProductRequest request) {

        // --- 1. Cập nhật Product chính ---
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        product.setName(request.getProductName());
        product.setDescription(request.getProductDescription());
        product.setProductImage(request.getProductMainImage());

        // --- 2. Cập nhật Category ---
        if (request.getCategoryId() != null) {
            ProductCategory category = categoryRepo.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));
            product.setCategory(category);
        } else {
            product.setCategory(null);
        }

        // --- 3. Hòa giải ProductItems (Tạo, Cập nhật, Xoá) ---
        reconcileProductItems(product, request.getItems());

        // --- 4. Trả về DTO đã cập nhật ---
        // Gọi lại hàm GET từ service cũ để lấy dữ liệu mới nhất
        return productService.getProductById(productId);
    }

    /**
     * Hàm helper để xử lý logic Create, Update, Delete cho ProductItems
     */
    private void reconcileProductItems(Product product, List<UpdateProductRequest.ItemSaveRequest> requestItems) {

        List<ProductItem> existingItems = itemRepo.findByProductId(product.getId());

        Map<Integer, ProductItem> existingItemMap = existingItems.stream()
                .collect(Collectors.toMap(ProductItem::getId, item -> item));

        Set<Integer> requestItemIds = requestItems.stream()
                .map(UpdateProductRequest.ItemSaveRequest::getProductItemId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        // --- 3a. XOÁ (Delete) ---
        List<ProductItem> itemsToDelete = existingItemMap.values().stream()
                .filter(item -> !requestItemIds.contains(item.getId()))
                .collect(Collectors.toList());

        itemRepo.deleteAll(itemsToDelete);

        // --- 3b. TẠO MỚI (Create) hoặc CẬP NHẬT (Update) ---
        for (UpdateProductRequest.ItemSaveRequest reqItem : requestItems) {
            ProductItem itemToSave;

            if (reqItem.getProductItemId() == null) {
                // TẠO MỚI
                itemToSave = new ProductItem();
                itemToSave.setProduct(product);
            } else {
                // CẬP NHẬT
                itemToSave = existingItemMap.get(reqItem.getProductItemId());
                if (itemToSave == null) {
                    throw new ResourceNotFoundException("ProductItem not found with id: " + reqItem.getProductItemId());
                }
            }

            itemToSave.setSku(reqItem.getSku());
            itemToSave.setQtyInStock(reqItem.getQtyInStock());
            itemToSave.setProductImage(reqItem.getItemImage());
            itemToSave.setPrice(reqItem.getPrice());

            ProductItem savedItem = itemRepo.save(itemToSave);

            // --- 4. Hòa giải ProductConfiguration ---
            reconcileConfigurations(savedItem, reqItem.getVariationOptionIds());
        }
    }

    /**
     * Hàm helper để xử lý logic Create, Delete cho bảng join ProductConfiguration
     */
    private void reconcileConfigurations(ProductItem item, List<Integer> requestOptionIds) {

        List<ProductConfiguration> existingConfigs = configRepo.findByProductItemId(item.getId());

        Set<Integer> existingOptionIds = existingConfigs.stream()
                .map(config -> config.getVariationOption().getId())
                .collect(Collectors.toSet());

        Set<Integer> requestOptionIdSet = new HashSet<>(requestOptionIds);

        // --- 4a. XOÁ (Delete) ---
        List<ProductConfiguration> configsToDelete = existingConfigs.stream()
                .filter(config -> !requestOptionIdSet.contains(config.getVariationOption().getId()))
                .collect(Collectors.toList());

        configRepo.deleteAll(configsToDelete);

        // --- 4b. TẠO MỚI (Create) ---
        for (Integer optionId : requestOptionIds) {
            if (!existingOptionIds.contains(optionId)) {
                VariationOption option = variationOptionRepo.findById(optionId)
                        .orElseThrow(() -> new ResourceNotFoundException("VariationOption not found with id: " + optionId));

                ProductConfiguration newConfig = new ProductConfiguration();
                newConfig.setProductItem(item);
                newConfig.setVariationOption(option);

                ProductConfigurationId configId = new ProductConfigurationId();
                configId.setProductItemId(item.getId());
                configId.setVariationOptionId(optionId);
                newConfig.setId(configId);

                configRepo.save(newConfig);
            }
        }
    }
}
