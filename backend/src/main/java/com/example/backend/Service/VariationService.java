package com.example.backend.Service;

import com.example.backend.DTO.VariationDTO;
import com.example.backend.Entity.ProductCategory;
import com.example.backend.Entity.Variation;
import com.example.backend.Exception.InvalidDataException;
import com.example.backend.Exception.ResourceNotFoundException;
import com.example.backend.Repos.ProductCategoryRepo;
import com.example.backend.Repos.VariationRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VariationService {

    private final VariationRepo variationRepository;
    private final ProductCategoryRepo productCategoryRepository;

    public VariationService(VariationRepo variationRepository,
                            ProductCategoryRepo productCategoryRepository) {
        this.variationRepository = variationRepository;
        this.productCategoryRepository = productCategoryRepository;
    }

    // 🟢 Lấy tất cả variations
    public List<VariationDTO> getAllVariations() {
        return variationRepository.findAll()
                .stream()
                .map(VariationDTO::new)
                .collect(Collectors.toList());
    }

    // 🟢 Lấy variation theo ID
    public VariationDTO getVariationById(Integer id) {
        Variation variation = variationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Variation not found with id: " + id));
        return new VariationDTO(variation);
    }



    // 🟢 Xóa variation
    public void deleteVariation(Integer id) {
        if (!variationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Variation not found with id: " + id);
        }
        variationRepository.deleteById(id);
    }
}
