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
//    @GetMapping
//    public List<VariationDTO> getAllVariations() {
//        return variationService.getAllVariations();
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<VariationDTO> getVariationById(@PathVariable Integer id) {
//        return variationService.getVariationById(id)
//                .map(ResponseEntity::ok)
//                .orElse(ResponseEntity.notFound().build());
//    }
//
//    @GetMapping("/category/{categoryId}")
//    public List<VariationDTO> getVariationsByCategory(@PathVariable Integer categoryId) {
//        return variationService.getVariationsByCategory(categoryId);
//    }
//
//    @PostMapping
//    public ResponseEntity<VariationDTO> createVariation(@RequestBody VariationDTO dto) {
//        return ResponseEntity.ok(variationService.saveVariation(dto));
//    }
//
//    @PutMapping("/{id}")
//    public ResponseEntity<VariationDTO> updateVariation(
//            @PathVariable Integer id,
//            @RequestBody VariationDTO dto
//    ) {
//        return variationService.updateVariation(id, dto)
//                .map(ResponseEntity::ok)
//                .orElse(ResponseEntity.notFound().build());
//    }
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteVariation(@PathVariable Integer id) {
//        variationService.deleteVariation(id);
//        return ResponseEntity.noContent().build();
//    }
//}
