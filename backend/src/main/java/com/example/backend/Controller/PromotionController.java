package com.example.backend.Controller;

import com.example.backend.DTO.Request.PromotionRequest;
import com.example.backend.DTO.Response.PromotionResponse;
import com.example.backend.Service.PromotionService;
//import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promotions")
@RequiredArgsConstructor
public class PromotionController {

    private final PromotionService service;

    @GetMapping
    public ResponseEntity<List<PromotionResponse>> getAll() {
        var list = service.getAll();
        return list.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PromotionResponse> getOne(@PathVariable Integer id) {
        return ResponseEntity.ok(service.getOne(id));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<PromotionResponse>> byCategory(@PathVariable Integer categoryId) {
        var list = service.getByCategory(categoryId);
        return list.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(list);
    }

    @GetMapping("/active")
    public ResponseEntity<List<PromotionResponse>> active() {
        var list = service.getActive();
        return list.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(list);
    }

    @PostMapping
    public ResponseEntity<PromotionResponse> create(@RequestBody PromotionRequest req) {
        var created = service.create(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PromotionResponse> update(@PathVariable Integer id,
                                                    @RequestBody PromotionRequest req) {
        return ResponseEntity.ok(service.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
