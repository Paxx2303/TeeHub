package com.example.backend.Controller;

import com.example.backend.Entity.ShoppingCart;
import com.example.backend.Service.ShoppingCartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carts")
@CrossOrigin(origins = "*")
public class ShoppingCartController {

    @Autowired
    private ShoppingCartService shoppingCartService;

    // Lấy tất cả giỏ hàng
    @GetMapping
    public List<ShoppingCart> getAllCarts() {
        return shoppingCartService.getAllCarts();
    }

    // Lấy giỏ hàng theo ID
    @GetMapping("/{id}")
    public ResponseEntity<ShoppingCart> getCartById(@PathVariable Integer id) {
        return shoppingCartService.getCartById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Lấy giỏ hàng theo user_id
    @GetMapping("/user/{userId}")
    public ResponseEntity<ShoppingCart> getCartByUserId(@PathVariable Integer userId) {
        return shoppingCartService.getCartByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Tạo mới giỏ hàng
    @PostMapping
    public ShoppingCart createCart(@RequestBody ShoppingCart cart) {
        return shoppingCartService.createCart(cart);
    }

    // Cập nhật giỏ hàng
    @PutMapping("/{id}")
    public ResponseEntity<ShoppingCart> updateCart(@PathVariable Integer id, @RequestBody ShoppingCart updatedCart) {
        try {
            ShoppingCart updated = shoppingCartService.updateCart(id, updatedCart);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Xóa giỏ hàng
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCart(@PathVariable Integer id) {
        shoppingCartService.deleteCart(id);
        return ResponseEntity.noContent().build();
    }
}
