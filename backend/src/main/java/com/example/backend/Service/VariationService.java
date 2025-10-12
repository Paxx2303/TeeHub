package com.example.backend.Service;

import com.example.backend.Entity.Variation;
import com.example.backend.Repos.VariationRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VariationService {

    private final VariationRepo variationRepository;

    public VariationService(VariationRepo variationRepository) {
        this.variationRepository = variationRepository;
    }

    // Lấy tất cả variations
    public List<Variation> getAllVariations() {
        return variationRepository.findAll();
    }

    // Lấy variation theo ID
    public Optional<Variation> getVariationById(Integer id) {
        return variationRepository.findById(id);
    }

    // Lấy variations theo category_id
    public List<Variation> getVariationsByCategory(Integer categoryId) {
        return variationRepository.findByCategory_Id(categoryId);
    }

    // Lưu hoặc tạo mới variation
    public Variation saveVariation(Variation variation) {
        return variationRepository.save(variation);
    }

    // 🔧 Cập nhật variation theo ID (hàm còn thiếu)
    public Optional<Variation> updateVariation(Integer id, Variation updatedVariation) {
        return variationRepository.findById(id).map(existing -> {
            existing.setName(updatedVariation.getName());
            existing.setCategory(updatedVariation.getCategory());
            return variationRepository.save(existing);
        });
    }

    // Xóa variation theo ID
    public void deleteVariation(Integer id) {
        variationRepository.deleteById(id);
    }
}
