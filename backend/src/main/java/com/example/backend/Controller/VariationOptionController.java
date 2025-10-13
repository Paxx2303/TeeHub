package com.example.backend.Controller;

import com.example.backend.DTO.VariationOptionDTO;
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

    // 🟢 Lấy tất cả variation options
    @GetMapping
    public List<VariationOptionDTO> getAllOptions() {
        return variationOptionService.getAllOptions();
    }

    // 🟢 Lấy option theo ID (đã bỏ .map)
    @GetMapping("/{id}")
    public ResponseEntity<VariationOptionDTO> getOptionById(@PathVariable Integer id) {
        return ResponseEntity.ok(variationOptionService.getOptionById(id));
    }

    // 🟢 Lấy option theo variation ID
    @GetMapping("/variation/{variationId}")
    public List<VariationOptionDTO> getOptionsByVariation(@PathVariable Integer variationId) {
        return variationOptionService.getOptionsByVariation(variationId);
    }

    // 🟢 Tạo mới option
    @PostMapping
    public ResponseEntity<VariationOptionDTO> createOption(@RequestBody VariationOptionDTO dto) {
        return ResponseEntity.ok(variationOptionService.saveOption(dto));
    }

    // 🟢 Cập nhật option (đã bỏ .map)
    @PutMapping("/{id}")
    public ResponseEntity<VariationOptionDTO> updateOption(
            @PathVariable Integer id,
            @RequestBody VariationOptionDTO dto
    ) {
        return ResponseEntity.ok(variationOptionService.updateOption(id, dto));
    }

    // 🟢 Xóa option
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOption(@PathVariable Integer id) {
        variationOptionService.deleteOption(id);
        return ResponseEntity.noContent().build();
    }
}
