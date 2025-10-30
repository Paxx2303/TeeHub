// backend/src/main/java/com/example/backend/Service/PromotionService.java
package com.example.backend.Service;

import com.example.backend.DTO.Request.PromotionRequest;
import com.example.backend.DTO.Response.PromotionResponse;
import com.example.backend.Entity.ProductCategory;
import com.example.backend.Entity.Promotion;
import com.example.backend.Repos.ProductCategoryRepo;
import com.example.backend.Repos.PromotionRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PromotionService {

    private final PromotionRepo promotionRepo;
    private final ProductCategoryRepo categoryRepo;

    public List<PromotionResponse> getAll() {
        var list = promotionRepo.findAllAsDto(LocalDate.now());
        if (list.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không có khuyến mãi nào.");
        }
        return list;
    }

    public PromotionResponse getOne(Integer id) {
        var dto = promotionRepo.findOneAsDto(id, LocalDate.now());
        if (dto == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy khuyến mãi " + id);
        }
        return dto;
    }

    public List<PromotionResponse> getByCategory(Integer categoryId) {
        var list = promotionRepo.findByCategoryIdAsDto(categoryId, LocalDate.now());
        if (list.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Danh mục " + categoryId + " chưa có khuyến mãi.");
        }
        return list;
    }

    public List<PromotionResponse> getActive() {
        var list = promotionRepo.findActiveAsDto(LocalDate.now());
        if (list.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Hiện không có khuyến mãi đang hoạt động.");
        }
        return list;
    }

    public PromotionResponse create(PromotionRequest req) {
        validateDateRange(req);

        Promotion p = new Promotion();
        apply(p, req);
        p = promotionRepo.save(p);

        return promotionRepo.findOneAsDto(p.getId(), LocalDate.now());
    }

    public PromotionResponse update(Integer id, PromotionRequest req) {
        validateDateRange(req);

        Promotion p = promotionRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy khuyến mãi " + id));

        apply(p, req);
        promotionRepo.save(p);

        return promotionRepo.findOneAsDto(id, LocalDate.now());
    }

    public void delete(Integer id) {
        if (!promotionRepo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy khuyến mãi " + id);
        }
        promotionRepo.deleteById(id);
    }

    /* helpers */

    private void validateDateRange(PromotionRequest req) {
        if (req.getStartDate() != null && req.getEndDate() != null
                && req.getEndDate().isBefore(req.getStartDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "endDate phải >= startDate");
        }
    }

    private void apply(Promotion p, PromotionRequest req) {
        p.setName(req.getName());
        p.setDescription(req.getDescription());
        p.setDiscountRate(req.getDiscountRate());
        p.setStartDate(req.getStartDate());
        p.setEndDate(req.getEndDate());

        if (req.getCategoryId() == null) {
            p.setCategory(null);
        } else {
            ProductCategory cat = categoryRepo.findById(req.getCategoryId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Category " + req.getCategoryId() + " không tồn tại"));
            p.setCategory(cat);
        }
    }
}
