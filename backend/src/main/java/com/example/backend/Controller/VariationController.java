package com.example.backend.Controller;

import com.example.backend.Entity.Variation;
import com.example.backend.Service.VariationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/variations")
public class VariationController {

    private final VariationService variationService;

    public VariationController(VariationService variationService) {
        this.variationService = variationService;
    }

    // Lấy tất cả variations
    @GetMapping
    public List<Variation> getAllVariations() {
        return variationService.getAllVariations();
    }

    // Lấy variation theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Variation> getVariationById(@PathVariable Integer id) {
        return variationService.getVariationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Lấy variation theo category
    @GetMapping("/category/{categoryId}")
    public List<Variation> getVariationsByCategory(@PathVariable Integer categoryId) {
        return variationService.getVariationsByCategory(categoryId);
    }

    // Thêm variation
    @PostMapping
    public Variation createVariation(@RequestBody Variation variation) {
        return variationService.saveVariation(variation);
    }

    // Cập nhật variation
    @PutMapping("/{id}")
    public ResponseEntity<Variation> updateVariation(
            @PathVariable Integer id,
            @RequestBody Variation variation
    ) {
        return variationService.updateVariation(id, variation)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Xóa variation
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVariation(@PathVariable Integer id) {
        variationService.deleteVariation(id);
        return ResponseEntity.noContent().build();
    }
}
