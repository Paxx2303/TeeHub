package com.example.backend.Service;

import com.example.backend.Entity.ShopOrder;
import com.example.backend.Repos.ShopOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ShopOrderService {

    @Autowired
    private ShopOrderRepository shopOrderRepository;

    public List<ShopOrder> getAllOrders() {
        return shopOrderRepository.findAll();
    }

    public Optional<ShopOrder> getOrderById(Integer id) {
        return shopOrderRepository.findById(id);
    }

    public List<ShopOrder> getOrdersByUserId(Integer userId) {
        return shopOrderRepository.findByUser_Id(userId);
    }

    public List<ShopOrder> getOrdersByStatus(String status) {
        return shopOrderRepository.findByOrderStatus(status);
    }

    public ShopOrder createOrder(ShopOrder shopOrder) {
        return shopOrderRepository.save(shopOrder);
    }

    public ShopOrder updateOrder(Integer id, ShopOrder updatedOrder) {
        return shopOrderRepository.findById(id)
                .map(order -> {
                    order.setPaymentTypeName(updatedOrder.getPaymentTypeName());
                    order.setPaymentProvider(updatedOrder.getPaymentProvider());
                    order.setPaymentAccountNumber(updatedOrder.getPaymentAccountNumber());
                    order.setPaymentStatus(updatedOrder.getPaymentStatus());
                    order.setPaymentDate(updatedOrder.getPaymentDate());
                    order.setShippingAddress(updatedOrder.getShippingAddress());
                    order.setShippingMethodName(updatedOrder.getShippingMethodName());
                    order.setShippingPrice(updatedOrder.getShippingPrice());
                    order.setOrderStatus(updatedOrder.getOrderStatus());
                    order.setOrderDate(updatedOrder.getOrderDate());
                    order.setOrderTotal(updatedOrder.getOrderTotal());
                    order.setUser(updatedOrder.getUser());
                    return shopOrderRepository.save(order);
                })
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với id = " + id));
    }

    public void deleteOrder(Integer id) {
        shopOrderRepository.deleteById(id);
    }
}
