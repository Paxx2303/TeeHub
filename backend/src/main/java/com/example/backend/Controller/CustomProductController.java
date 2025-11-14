package com.example.backend.Controller;

import com.example.backend.DTO.Request.CreateCustomProductRequest;
import com.example.backend.DTO.Response.CustomProductResponse;
import com.example.backend.Service.CustomProductService;
import com.example.backend.Sercurity.MyUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CustomProductController {

    private final CustomProductService service;

    @PostMapping(value = "/custom-products", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CustomProductResponse> create(
            @RequestPart("payload") CreateCustomProductRequest payload,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal MyUserDetails me
    ) {
        Integer userId = me == null ? null : me.getUserId();
        CustomProductResponse resp = service.createWithImage(payload, image, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
    }
}
