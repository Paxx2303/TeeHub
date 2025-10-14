//package com.example.backend.Controller;
//
//import com.example.backend.Entity.ShoppingCartItem;
//import com.example.backend.Service.ShoppingCartItemService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/cart-items")
//@CrossOrigin(origins = "*")
//public class ShoppingCartItemController {
//
//    @Autowired
//    private ShoppingCartItemService shoppingCartItemService;
//
//    // Lấy toàn bộ cart item
//    @GetMapping
//    public List<ShoppingCartItem> getAllItems() {
//        return shoppingCartItemService.getAllItems();
//    }
//
//    // Lấy cart item theo id
//    @GetMapping("/{id}")
//    public ResponseEntity<ShoppingCartItem> getItemById(@PathVariable Integer id) {
//        return shoppingCartItemService.getItemById(id)
//                .map(ResponseEntity::ok)
//                .orElse(ResponseEntity.notFound().build());
//    }
//
//    // Lấy danh sách item theo cart_id
//    @GetMapping("/cart/{cartId}")
//    public List<ShoppingCartItem> getItemsByCartId(@PathVariable Integer cartId) {
//        return shoppingCartItemService.getItemsByCartId(cartId);
//    }
//
//    // Lấy item cụ thể trong giỏ (cart_id + product_item_id)
//    @GetMapping("/cart/{cartId}/product/{productItemId}")
//    public ResponseEntity<ShoppingCartItem> getItemByCartAndProduct(
//            @PathVariable Integer cartId,
//            @PathVariable Integer productItemId
//    ) {
//        return shoppingCartItemService.getItemByCartAndProduct(cartId, productItemId)
//                .map(ResponseEntity::ok)
//                .orElse(ResponseEntity.notFound().build());
//    }
//
//    // Thêm item mới vào giỏ hàng
//    @PostMapping
//    public ShoppingCartItem addItem(@RequestBody ShoppingCartItem item) {
//        return shoppingCartItemService.addItem(item);
//    }
//
//
//    // Xóa item theo id
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteItem(@PathVariable Integer id) {
//        shoppingCartItemService.deleteItem(id);
//        return ResponseEntity.noContent().build();
//    }
//
//    // Xóa toàn bộ item trong giỏ hàng
//    @DeleteMapping("/cart/{cartId}")
//    public ResponseEntity<Void> deleteItemsByCart(@PathVariable Integer cartId) {
//        shoppingCartItemService.deleteItemsByCartId(cartId);
//        return ResponseEntity.noContent().build();
//    }
//}
