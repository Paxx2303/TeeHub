//package com.example.backend.Service;
//
//import com.example.backend.DTO.VariationDTO;
//import com.example.backend.Entity.ProductCategory;
//import com.example.backend.Entity.Variation;
//import com.example.backend.Repos.ProductCategoryRepo;
//import com.example.backend.Repos.VariationRepo;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//import java.util.Optional;
//import java.util.stream.Collectors;
//
//@Service
//public class VariationService {
//
//    private final VariationRepo variationRepository;
//    private final ProductCategoryRepo productCategoryRepository;
//
//    public VariationService(VariationRepo variationRepository,
//                            ProductCategoryRepo productCategoryRepository) {
//        this.variationRepository = variationRepository;
//        this.productCategoryRepository = productCategoryRepository;
//    }
//
//    // Lấy tất cả variations
//    public List<VariationDTO> getAllVariations() {
//        return variationRepository.findAll()
//                .stream()
//                .map(VariationDTO::new)
//                .collect(Collectors.toList());
//    }
//
//    // Lấy variation theo ID
//    public Optional<VariationDTO> getVariationById(Integer id) {
//        return variationRepository.findById(id).map(VariationDTO::new);
//    }
//
//    // Lấy variations theo category_id
//    public List<VariationDTO> getVariationsByCategory(Integer categoryId) {
//        return variationRepository.findByCategory_Id(categoryId)
//                .stream()
//                .map(VariationDTO::new)
//                .collect(Collectors.toList());
//    }
//
//    // Tạo mới variation
//    public VariationDTO saveVariation(VariationDTO dto) {
//        ProductCategory category = productCategoryRepository.findById(dto.getCategoryId())
//                .orElseThrow(() -> new RuntimeException("Category not found"));
//
//        Variation variation = new Variation();
//        variation.setName(dto.getName());
//        variation.setCategory(category);
//
//        return new VariationDTO(variationRepository.save(variation));
//    }
//
//    // Cập nhật variation theo ID
//    public Optional<VariationDTO> updateVariation(Integer id, VariationDTO dto) {
//        return variationRepository.findById(id).map(existing -> {
//            existing.setName(dto.getName());
//
//            if (dto.getCategoryId() != null) {
//                ProductCategory category = productCategoryRepository.findById(dto.getCategoryId())
//                        .orElseThrow(() -> new RuntimeException("Category not found"));
//                existing.setCategory(category);
//            }
//
//            return new VariationDTO(variationRepository.save(existing));
//        });
//    }
//
//    // Xóa variation
//    public void deleteVariation(Integer id) {
//        variationRepository.deleteById(id);
//    }
//}
