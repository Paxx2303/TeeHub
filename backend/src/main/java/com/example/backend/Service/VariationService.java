//package com.example.backend.Service;
//
//import com.example.backend.DTO.VariationDTO;
//import com.example.backend.Entity.ProductCategory;
//import com.example.backend.Entity.Variation;
//import com.example.backend.Exception.InvalidDataException;
//import com.example.backend.Exception.ResourceNotFoundException;
//import com.example.backend.Repos.ProductCategoryRepo;
//import com.example.backend.Repos.VariationRepo;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
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
//    // 🟢 Lấy tất cả variations
//    public List<VariationDTO> getAllVariations() {
//        return variationRepository.findAll()
//                .stream()
//                .map(VariationDTO::new)
//                .collect(Collectors.toList());
//    }
//
//    // 🟢 Lấy variation theo ID
//    public VariationDTO getVariationById(Integer id) {
//        Variation variation = variationRepository.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Variation not found with id: " + id));
//        return new VariationDTO(variation);
//    }
//
//    // 🟢 Lấy variations theo category_id
//    public List<VariationDTO> getVariationsByCategory(Integer categoryId) {
//        if (!productCategoryRepository.existsById(categoryId)) {
//            throw new ResourceNotFoundException("Category not found with id: " + categoryId);
//        }
//
//        return variationRepository.findByCategory_Id(categoryId)
//                .stream()
//                .map(VariationDTO::new)
//                .collect(Collectors.toList());
//    }
//
//    // 🟢 Tạo mới variation
//    public VariationDTO saveVariation(VariationDTO dto) {
//        if (dto.getName() == null || dto.getName().isBlank()) {
//            throw new InvalidDataException("Variation name cannot be empty");
//        }
//
//        ProductCategory category = productCategoryRepository.findById(dto.getCategoryId())
//                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dto.getCategoryId()));
//
//        // Kiểm tra trùng tên variation trong cùng category
//        boolean exists = variationRepository.existsByNameIgnoreCaseAndCategory_Id(dto.getName(), dto.getCategoryId());
//        if (exists) {
//            throw new InvalidDataException("Variation with name '" + dto.getName() + "' already exists in this category");
//        }
//
//        Variation variation = new Variation();
//        variation.setName(dto.getName());
//        variation.setCategory(category);
//
//        return new VariationDTO(variationRepository.save(variation));
//    }
//
//    // 🟢 Cập nhật variation theo ID
//    public VariationDTO updateVariation(Integer id, VariationDTO dto) {
//        Variation existing = variationRepository.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Variation not found with id: " + id));
//
//        if (dto.getName() != null && dto.getName().isBlank()) {
//            throw new InvalidDataException("Variation name cannot be blank");
//        }
//
//        if (dto.getCategoryId() != null) {
//            ProductCategory category = productCategoryRepository.findById(dto.getCategoryId())
//                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dto.getCategoryId()));
//            existing.setCategory(category);
//        }
//
//        if (dto.getName() != null) {
//            boolean exists = variationRepository.existsByNameIgnoreCaseAndCategory_Id(dto.getName(),
//                    existing.getCategory().getId());
//            if (exists && !dto.getName().equalsIgnoreCase(existing.getName())) {
//                throw new InvalidDataException("Variation with name '" + dto.getName() + "' already exists in this category");
//            }
//            existing.setName(dto.getName());
//        }
//
//        return new VariationDTO(variationRepository.save(existing));
//    }
//
//    // 🟢 Xóa variation
//    public void deleteVariation(Integer id) {
//        if (!variationRepository.existsById(id)) {
//            throw new ResourceNotFoundException("Variation not found with id: " + id);
//        }
//        variationRepository.deleteById(id);
//    }
//}
