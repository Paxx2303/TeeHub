package com.example.backend.Controller;


import com.example.backend.DTO.Response.Cart.CartDTO;
import com.example.backend.Service.cartService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private cartService cartService;

    // 🔹 Lấy giỏ hàng theo user
    @GetMapping("/{userId}")
    public ResponseEntity<CartDTO> getCart(@PathVariable Integer userId) {
        return ResponseEntity.ok(cartService.getCartByUserId(userId));
    }

//    // 🔹 Thêm sản phẩm vào giỏ
//    @PostMapping("/{userId}/add")
//    public ResponseEntity<CartDTO> addToCart(
//            @PathVariable Integer userId,
//            @RequestParam Integer productItemId,
//            @RequestParam Integer quantity
//    ) {
//        return ResponseEntity.ok(cartService.addItemToCart(userId, productItemId, quantity));
//    }
//
//    // 🔹 Cập nhật số lượng sản phẩm
//    @PutMapping("/{userId}/update")
//    public ResponseEntity<CartDTO> updateQuantity(
//            @PathVariable Integer userId,
//            @RequestParam Integer productItemId,
//            @RequestParam Integer quantity
//    ) {
//        return ResponseEntity.ok(cartService.updateItemQuantity(userId, productItemId, quantity));
//    }
//
//    // 🔹 Xóa sản phẩm khỏi giỏ
//    @DeleteMapping("/{userId}/remove")
//    public ResponseEntity<CartDTO> removeItem(
//            @PathVariable Integer userId,
//            @RequestParam Integer productItemId
//    ) {
//        return ResponseEntity.ok(cartService.removeItem(userId, productItemId));
//    }
//
//    // 🔹 Xóa toàn bộ giỏ
//    @DeleteMapping("/{userId}/clear")
//    public ResponseEntity<Void> clearCart(@PathVariable Integer userId) {
//        cartService.clearCart(userId);
//        return ResponseEntity.ok().build();
//    }
}
