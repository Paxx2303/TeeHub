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

    @GetMapping
    public List<VariationOptionDTO> getAllOptions() {
        return variationOptionService.getAllOptions();
    }

    @GetMapping("/{id}")
    public ResponseEntity<VariationOptionDTO> getOptionById(@PathVariable Integer id) {
        return variationOptionService.getOptionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/variation/{variationId}")
    public List<VariationOptionDTO> getOptionsByVariation(@PathVariable Integer variationId) {
        return variationOptionService.getOptionsByVariation(variationId);
    }

    @PostMapping
    public ResponseEntity<VariationOptionDTO> createOption(@RequestBody VariationOptionDTO dto) {
        return ResponseEntity.ok(variationOptionService.saveOption(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VariationOptionDTO> updateOption(
            @PathVariable Integer id,
            @RequestBody VariationOptionDTO dto
    ) {
        return variationOptionService.updateOption(id, dto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOption(@PathVariable Integer id) {
        variationOptionService.deleteOption(id);
        return ResponseEntity.noContent().build();
    }
}
