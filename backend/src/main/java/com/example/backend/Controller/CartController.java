package com.example.backend.Controller;


import com.example.backend.DTO.Response.Cart.UserCartDTO;
import com.example.backend.Service.UserCartService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private UserCartService cartService;


    @Autowired
    private UserCartService userCartService;

    @GetMapping("/{userId}")
    public ResponseEntity<UserCartDTO> getUserCart(@PathVariable Integer userId) {
        UserCartDTO dto = userCartService.getUserCart(userId);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dto);
    }
}
