<<<<<<< HEAD
//package com.example.backend.Controller;
//
//import com.example.backend.DTO.Response.Cart.VariationOptionDTO;
//import com.example.backend.Service.VariationOptionService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/variation-options")
//@CrossOrigin(origins = {"http://localhost:8080"})
//@RequiredArgsConstructor
//public class VariationOptionController {
//
//    private final VariationOptionService service;
//
//    @GetMapping
//    public ResponseEntity<List<VariationOptionDTO>> getAll() {
//        return ResponseEntity.ok(service.getAll());
//    }
//
//    @GetMapping("/variation/{variationId}")
//    public ResponseEntity<List<VariationOptionDTO>> byVariation(@PathVariable Integer variationId) {
//        return ResponseEntity.ok(service.getByVariationId(variationId));
//    }
//
//    @GetMapping("/category/{categoryId}")
//    public ResponseEntity<List<VariationOptionDTO>> byCategory(@PathVariable Integer categoryId) {
//        return ResponseEntity.ok(service.getByCategoryId(categoryId));
//    }
//
//    @GetMapping("/search")
//    public ResponseEntity<List<VariationOptionDTO>> search(@RequestParam String q) {
//        return ResponseEntity.ok(service.searchByValue(q));
//    }
//}
=======
package com.example.backend.Controller;

import com.example.backend.DTO.Response.VariationOptionResponse;
import com.example.backend.Service.VariationOptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/variation-options")
@RequiredArgsConstructor
public class VariationOptionController {

    private final VariationOptionService service;

    @GetMapping
    public ResponseEntity<List<VariationOptionResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/variation/{variationId}")
    public ResponseEntity<List<VariationOptionResponse>> byVariation(@PathVariable Integer variationId) {
        return ResponseEntity.ok(service.getByVariationId(variationId));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<VariationOptionResponse>> byCategory(@PathVariable Integer categoryId) {
        return ResponseEntity.ok(service.getByCategoryId(categoryId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<VariationOptionResponse>> search(@RequestParam String q) {
        return ResponseEntity.ok(service.searchByValue(q));
    }
}
>>>>>>> main
