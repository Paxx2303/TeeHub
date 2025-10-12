package com.example.backend.Controller;

import com.example.backend.Entity.VariationOption;
import com.example.backend.Service.VariationOptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/variation-options")
public class VariationOptionController {

    private final VariationOptionService variationOptionService;

    public VariationOptionController(VariationOptionService variationOptionService) {
        this.variationOptionService = variationOptionService;
    }

    // Lấy tất cả variation options
    @GetMapping
    public List<VariationOption> getAllOptions() {
        return variationOptionService.getAllOptions();
    }

    // Lấy option theo ID
    @GetMapping("/{id}")
    public ResponseEntity<VariationOption> getOptionById(@PathVariable Integer id) {
        return variationOptionService.getOptionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Lấy option theo variation
    @GetMapping("/variation/{variationId}")
    public List<VariationOption> getOptionsByVariation(@PathVariable Integer variationId) {
        return variationOptionService.getOptionsByVariation(variationId);
    }

    // Thêm option
    @PostMapping
    public VariationOption createOption(@RequestBody VariationOption option) {
        return variationOptionService.saveOption(option);
    }

    // Cập nhật option
    @PutMapping("/{id}")
    public ResponseEntity<VariationOption> updateOption(
            @PathVariable Integer id,
            @RequestBody VariationOption option
    ) {
        return variationOptionService.updateOption(id, option)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Xóa option
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOption(@PathVariable Integer id) {
        variationOptionService.deleteOption(id);
        return ResponseEntity.noContent().build();
    }
}
