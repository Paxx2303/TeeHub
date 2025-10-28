package com.example.backend.Controller;

import com.example.backend.DTO.Request.CreateOrderRequest;
import com.example.backend.DTO.Response.Order.OrderResponse;
import com.example.backend.Entity.ShopOrder;
import com.example.backend.Service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // ✅ Lấy tất cả đơn hàng của user
    @GetMapping("/user/{userId}")
    public List<OrderResponse> getOrdersByUser(@PathVariable Integer userId) {
        return orderService.getOrdersByUserId(userId);
    }

    // ✅ Lấy chi tiết đơn hàng
    @GetMapping("/{orderId}")
    public OrderResponse getOrderDetail(@PathVariable Integer orderId) {
        return orderService.getOrderDetail(orderId);
    }


}
