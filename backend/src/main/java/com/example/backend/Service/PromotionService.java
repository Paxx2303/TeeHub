package com.example.backend.Service;

import com.example.backend.DTO.Request.PromotionRequest;
import com.example.backend.DTO.Response.PromotionResponse;
import com.example.backend.Entity.ProductCategory;
import com.example.backend.Entity.Promotion;
import com.example.backend.Exception.ResourceNotFoundException;
import com.example.backend.Repos.ProductCategoryRepo;
import com.example.backend.Repos.PromotionRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PromotionService {
    private final PromotionRepo promotionRepo;
    private final ProductCategoryRepo categoryRepo; // Cần repo này để tìm category

    // LẤY TẤT CẢ
    public List<PromotionResponse> getAllPromotions() {
        return promotionRepo.findAll().stream()
                .map(PromotionResponse::new) // Chuyển Entity -> DTO
                .collect(Collectors.toList());
    }

    // LẤY MỘT
    public PromotionResponse getPromotionById(Integer promotionId) {
        Promotion promotion = promotionRepo.findById(promotionId)
                .orElseThrow(() -> new ResourceNotFoundException("Promotion not found"));
        return new PromotionResponse(promotion);
    }

    // TẠO MỚI
    @Transactional
    public PromotionResponse createPromotion(PromotionRequest request) {
        // Tìm Category mà request muốn áp dụng
        ProductCategory category = categoryRepo.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Promotion promotion = new Promotion();
        promotion.setName(request.getName());
        promotion.setDescription(request.getDescription());
        promotion.setDiscountRate(request.getDiscountRate());
        promotion.setStartDate(request.getStartDate());
        promotion.setEndDate(request.getEndDate());
        promotion.setCategory(category); // Gán category

        Promotion savedPromotion = promotionRepo.save(promotion);
        return new PromotionResponse(savedPromotion);
    }

    // CẬP NHẬT
    @Transactional
    public PromotionResponse updatePromotion(Integer promotionId, PromotionRequest request) {
        Promotion promotion = promotionRepo.findById(promotionId)
                .orElseThrow(() -> new ResourceNotFoundException("Promotion not found"));

        // Tìm Category
        ProductCategory category = categoryRepo.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        promotion.setName(request.getName());
        promotion.setDescription(request.getDescription());
        promotion.setDiscountRate(request.getDiscountRate());
        promotion.setStartDate(request.getStartDate());
        promotion.setEndDate(request.getEndDate());
        promotion.setCategory(category);

        Promotion updatedPromotion = promotionRepo.save(promotion);
        return new PromotionResponse(updatedPromotion);
    }

    // XÓA
    @Transactional
    public void deletePromotion(Integer promotionId) {
        if (!promotionRepo.existsById(promotionId)) {
            throw new ResourceNotFoundException("Promotion not found");
        }
        promotionRepo.deleteById(promotionId);
    }
    public PromotionResponse getPromotionByCategoryId(Integer categoryId) {
        // Tìm khuyến mãi
        Optional<Promotion> promotionOpt = promotionRepo.findByCategoryId(categoryId);

        if (promotionOpt.isEmpty()) {
            // Nếu không có, ném lỗi 404 (để frontend biết là "chưa có")
            throw new ResourceNotFoundException("No promotion found for category id: " + categoryId);
        }

        // Nếu có, chuyển sang DTO và trả về
        return new PromotionResponse(promotionOpt.get());
    }
}
