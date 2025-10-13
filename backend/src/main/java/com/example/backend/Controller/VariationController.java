//package com.example.backend.Controller;
//
//import com.example.backend.DTO.VariationDTO;
//import com.example.backend.Service.VariationService;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/variations")
//public class VariationController {
//
//    private final VariationService variationService;
//
//    public VariationController(VariationService variationService) {
//        this.variationService = variationService;
//    }
//
//    // 🟢 Lấy tất cả variations
//    @GetMapping
//    public List<VariationDTO> getAllVariations() {
//        return variationService.getAllVariations();
//    }
//
//    // 🟢 Lấy variation theo ID (đã bỏ Optional + map)
//    @GetMapping("/{id}")
//    public ResponseEntity<VariationDTO> getVariationById(@PathVariable Integer id) {
//        return ResponseEntity.ok(variationService.getVariationById(id));
//    }
//
//    // 🟢 Lấy variations theo category
//    @GetMapping("/category/{categoryId}")
//    public List<VariationDTO> getVariationsByCategory(@PathVariable Integer categoryId) {
//        return variationService.getVariationsByCategory(categoryId);
//    }
//
//    // 🟢 Thêm variation mới
//    @PostMapping
//    public ResponseEntity<VariationDTO> createVariation(@RequestBody VariationDTO dto) {
//        return ResponseEntity.ok(variationService.saveVariation(dto));
//    }
//
//    // 🟢 Cập nhật variation (đã bỏ Optional + map)
//    @PutMapping("/{id}")
//    public ResponseEntity<VariationDTO> updateVariation(
//            @PathVariable Integer id,
//            @RequestBody VariationDTO dto
//    ) {
//        return ResponseEntity.ok(variationService.updateVariation(id, dto));
//    }
//
//    // 🟢 Xóa variation
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteVariation(@PathVariable Integer id) {
//        variationService.deleteVariation(id);
//        return ResponseEntity.noContent().build();
//    }
//}
