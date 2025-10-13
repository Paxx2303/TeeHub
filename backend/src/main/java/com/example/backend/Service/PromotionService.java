
package com.example.backend.Service;

import com.example.backend.Entity.Promotion;
import com.example.backend.Repos.PromotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PromotionService {

    @Autowired
    private PromotionRepository promotionRepository;

    public List<Promotion> getAllPromotions() {
        return promotionRepository.findAll();
    }

    public Optional<Promotion> getPromotionById(Integer id) {
        return promotionRepository.findById(id);
    }

    public Promotion createPromotion(Promotion promotion) {
        return promotionRepository.save(promotion);
    }

    public Promotion updatePromotion(Integer id, Promotion promotionDetails) {
        return promotionRepository.findById(id)
                .map(promotion -> {
                    promotion.setName(promotionDetails.getName());
                    promotion.setDescription(promotionDetails.getDescription());
                    promotion.setDiscountRate(promotionDetails.getDiscountRate());
                    promotion.setStartDate(promotionDetails.getStartDate());
                    promotion.setEndDate(promotionDetails.getEndDate());
                    promotion.setCategory(promotionDetails.getCategory());
                    return promotionRepository.save(promotion);
                })
                .orElseThrow(() -> new RuntimeException("Promotion not found with id " + id));
    }

    public void deletePromotion(Integer id) {
        promotionRepository.deleteById(id);
    }
}

