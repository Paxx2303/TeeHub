//package com.example.backend.Controller;
//
//import com.example.backend.DTO.Response.VariationDTO;
//import com.example.backend.Service.VariationService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/variations")
//@CrossOrigin(origins = {"http://localhost:8080"})
//@RequiredArgsConstructor
//public class VariationController {
//
//    private final VariationService service;
//
//    @GetMapping
//    public ResponseEntity<List<VariationDTO>> getAll() {
//        return ResponseEntity.ok(service.getAll());
//    }
//
//    @GetMapping("/category/{categoryId}")
//    public ResponseEntity<List<VariationDTO>> getByCategory(@PathVariable Integer categoryId) {
//        return ResponseEntity.ok(service.getByCategoryId(categoryId));
//    }
//
//    @GetMapping("/search")
//    public ResponseEntity<List<VariationDTO>> search(@RequestParam String q) {
//        return ResponseEntity.ok(service.searchByName(q));
//    }
//}
