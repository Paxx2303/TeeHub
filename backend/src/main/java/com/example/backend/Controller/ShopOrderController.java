package com.example.backend.Controller;

import com.example.backend.Entity.ShopOrder;
import com.example.backend.Service.ShopOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class ShopOrderController {

    @Autowired
    private ShopOrderService shopOrderService;

    // Lấy tất cả đơn hàng
    @GetMapping
    public List<ShopOrder> getAllOrders() {
        return shopOrderService.getAllOrders();
    }

    // Lấy đơn hàng theo ID
    @GetMapping("/{id}")
    public ResponseEntity<ShopOrder> getOrderById(@PathVariable Integer id) {
        return shopOrderService.getOrderById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Lấy đơn hàng theo user_id
    @GetMapping("/user/{userId}")
    public List<ShopOrder> getOrdersByUserId(@PathVariable Integer userId) {
        return shopOrderService.getOrdersByUserId(userId);
    }

    // Lấy đơn hàng theo trạng thái
    @GetMapping("/status/{status}")
    public List<ShopOrder> getOrdersByStatus(@PathVariable String status) {
        return shopOrderService.getOrdersByStatus(status);
    }

    // Tạo mới đơn hàng
    @PostMapping
    public ShopOrder createOrder(@RequestBody ShopOrder shopOrder) {
        return shopOrderService.createOrder(shopOrder);
    }

    // Cập nhật đơn hàng
    @PutMapping("/{id}")
    public ResponseEntity<ShopOrder> updateOrder(@PathVariable Integer id, @RequestBody ShopOrder updatedOrder) {
        try {
            ShopOrder updated = shopOrderService.updateOrder(id, updatedOrder);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Xóa đơn hàng
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Integer id) {
        shopOrderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }
}
