package com.example.backend.Service;

import com.example.backend.DTO.Response.Order.*;
import com.example.backend.Entity.*;
import com.example.backend.Repos.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepo orderRepo;

    @Autowired
    private OrderLineRepo orderLineRepo;

    @Autowired
    private CustomProductRepo customProductRepo;

    @Autowired
    private ShoppingCartItemRepo cartItemRepo;

    @Autowired
    private final ShoppingCartRepo cartRepo;
    @Autowired
    private final ShoppingCartItemRepo itemRepo;


    public OrderService(ShoppingCartRepo cartRepo, ShoppingCartItemRepo itemRepo, OrderLineRepo orderLineRepo) {
        this.cartRepo = cartRepo;
        this.itemRepo = itemRepo;
        this.orderLineRepo = orderLineRepo;
    }

    // ✅ Lấy tất cả đơn hàng của user
    public List<OrderResponse> getOrdersByUserId(Integer userId) {
        List<ShopOrder> orders = orderRepo.findByUserId(userId);
        return orders.stream().map(this::mapToOrderResponse).toList();
    }

    // ✅ Lấy chi tiết đơn hàng
    public OrderResponse getOrderDetail(Integer orderId) {
        ShopOrder order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return mapToOrderResponse(order);
    }

    // ✅ Map từ Entity sang DTO
    private OrderResponse mapToOrderResponse(ShopOrder order) {
        OrderResponse dto = new OrderResponse();
        dto.setId(order.getId());
        dto.setPaymentTypeName(order.getPaymentTypeName());
        dto.setPaymentProvider(order.getPaymentProvider());
        dto.setPaymentAccountNumber(order.getPaymentAccountNumber());
        dto.setPaymentStatus(order.getPaymentStatus());
        dto.setPaymentDate(order.getPaymentDate());
        dto.setShippingMethodName(order.getShippingMethodName());
        dto.setShippingPrice(order.getShippingPrice());
        dto.setOrderStatus(order.getOrderStatus());
        dto.setOrderDate(order.getOrderDate());
        dto.setOrderTotal(order.getOrderTotal());

        // ✅ Lấy các OrderLine
        List<OrderLine> lines = orderLineRepo.findByShopOrderId(order.getId());

        dto.setItems(lines.stream().map(line -> {
            OrderItemDTO itemDTO = new OrderItemDTO();
            itemDTO.setId(line.getId());
            itemDTO.setQty(line.getQty());
            itemDTO.setPrice(line.getPrice().intValue());

            if (line.getCustomProduct() != null) {
                CustomProduct cp = line.getCustomProduct();
                itemDTO.setIs_customed(true);
                itemDTO.setCustom_id(cp.getId());
                itemDTO.setProductItemId(cp.getProductId());
                itemDTO.setProductImage(cp.getCustomImageUrl());
            } else {
                itemDTO.setIs_customed(false);
                // có thể gọi thêm query từ ShoppingCartItemRepo nếu cần ảnh gốc
            }

            return itemDTO;
        }).toList());

        return dto;
    }
}
