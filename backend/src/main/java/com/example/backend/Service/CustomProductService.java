package com.example.backend.Service;

import com.example.backend.Entity.CustomProduct;
import com.example.backend.Entity.ProductItem;
import com.example.backend.Entity.SiteUser;
import com.example.backend.Repos.CustomProductRepo;
import com.example.backend.Repos.ProductItemRepo;
import com.example.backend.Repos.SiteUserRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class CustomProductService {
    private final CustomProductRepo customProductRepository;
    private final ProductItemRepo productItemRepository;
    private final SiteUserRepo UserRepo ;

    public CustomProductService(CustomProductRepo customProductRepository, ProductItemRepo productItemRepository, SiteUserRepo userRepo) {
        this.customProductRepository = customProductRepository;
        this.productItemRepository = productItemRepository;
        UserRepo = userRepo;
    }

    @Transactional
    public CustomProduct createCustomProduct(CustomProduct customProduct) {
        customProduct.setCreatedAt(Instant.now());
        return customProductRepository.save(customProduct);
    }

    /**
     * Tạo custom product với userId và productItemId
     */
    @Transactional
    public CustomProduct createCustomProduct(Integer userId, Integer productItemId,
                                             String customName, String customDescription,
                                             String customColor, String customText,
                                             String customImageUrl, String previewImage) {
        SiteUser user = UserRepo.findById(Long.valueOf(userId))
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        ProductItem productItem = productItemRepository.findById(Long.valueOf(productItemId))
                .orElseThrow(() -> new RuntimeException("Product Item not found with id: " + productItemId));

        CustomProduct customProduct = new CustomProduct();
        customProduct.setUser(user);
        customProduct.setProductItem(productItem);
        customProduct.setCustomName(customName);
        customProduct.setCustomDescription(customDescription);
        customProduct.setCustomColor(customColor);
        customProduct.setCustomText(customText);
        customProduct.setCustomImageUrl(customImageUrl);
        customProduct.setPreviewImage(previewImage);
        customProduct.setCreatedAt(Instant.now());

        return customProductRepository.save(customProduct);
    }

    /**
     * Lấy custom product theo id
     */
    public Optional<CustomProduct> getCustomProductById(Integer id) {
        return customProductRepository.findById(id);
    }

    /**
     * Lấy tất cả custom product
     */
    public List<CustomProduct> getAllCustomProducts() {
        return customProductRepository.findAll();
    }

    /**
     * Lấy custom product theo user
     */
    public List<CustomProduct> getCustomProductsByUserId(Integer userId) {
        return customProductRepository.findByUserId(userId);
    }

    /**
     * Lấy custom product theo product item
     */
    public List<CustomProduct> getCustomProductsByProductItemId(Integer productItemId) {
        return customProductRepository.findByProductItemId(productItemId);
    }

    /**
     * Lấy custom product theo user và product item
     */
    public Optional<CustomProduct> getCustomProductByUserAndProductItem(Integer userId, Integer productItemId) {
        return customProductRepository.findByUserIdAndProductItemId(userId, productItemId);
    }

    /**
     * Tìm kiếm custom product theo keyword
     */
    public List<CustomProduct> searchCustomProducts(String keyword) {
        return customProductRepository.findByCustomNameContainingIgnoreCase(keyword);
    }

    @Transactional
    public CustomProduct updateCustomProduct(Integer id, CustomProduct updatedProduct) {
        CustomProduct existingProduct = customProductRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Custom Product not found with id: " + id));

        if (updatedProduct.getCustomName() != null) {
            existingProduct.setCustomName(updatedProduct.getCustomName());
        }
        if (updatedProduct.getCustomDescription() != null) {
            existingProduct.setCustomDescription(updatedProduct.getCustomDescription());
        }
        if (updatedProduct.getCustomColor() != null) {
            existingProduct.setCustomColor(updatedProduct.getCustomColor());
        }
        if (updatedProduct.getCustomText() != null) {
            existingProduct.setCustomText(updatedProduct.getCustomText());
        }
        if (updatedProduct.getCustomImageUrl() != null) {
            existingProduct.setCustomImageUrl(updatedProduct.getCustomImageUrl());
        }
        if (updatedProduct.getPreviewImage() != null) {
            existingProduct.setPreviewImage(updatedProduct.getPreviewImage());
        }

        return customProductRepository.save(existingProduct);
    }

    /**
     * Xóa custom product
     */
    @Transactional
    public void deleteCustomProduct(Integer id) {
        if (!customProductRepository.existsById(id)) {
            throw new RuntimeException("Custom Product not found with id: " + id);
        }
        customProductRepository.deleteById(id);
    }

    /**
     * Xóa tất cả custom product của user
     */
    @Transactional
    public void deleteAllCustomProductsByUserId(Integer userId) {
        customProductRepository.deleteByUserId(userId);
    }

    /**
     * Đếm số lượng custom product của user
     */
    public long countCustomProductsByUserId(Integer userId) {
        return customProductRepository.countByUserId(userId);
    }

    /**
     * Kiểm tra user có custom product không
     */
    public boolean hasCustomProducts(Integer userId) {
        return customProductRepository.existsByUserId(userId);
    }

    /**
     * Lấy custom product mới nhất của user
     */
    public Optional<CustomProduct> getLatestCustomProduct(Integer userId) {
        return customProductRepository.findFirstByUserIdOrderByCreatedAtDesc(userId);
    }
}