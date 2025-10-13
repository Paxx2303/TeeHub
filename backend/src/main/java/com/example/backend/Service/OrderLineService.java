package com.example.backend.Service;

import com.example.backend.Entity.OrderLine;
import com.example.backend.Repos.OrderLineRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderLineService {

    final OrderLineRepo orderLineRepo;
    public OrderLineService(OrderLineRepo orderLineRepo) {
        this.orderLineRepo = orderLineRepo;
    }

    List<OrderLine> findAll() {
        return orderLineRepo.findAll();
    }

    public OrderLine findById(Integer order_Id) {
        return orderLineRepo.findById(order_Id).get();
    }
    public OrderLine save(OrderLine orderLine) {
        return orderLineRepo.save(orderLine);
    }
    public  OrderLine update(OrderLine orderLine) {
        return orderLineRepo.save(orderLine);
    }
    public void deleteById(Integer order_Id) {
        orderLineRepo.deleteById(order_Id);
    }
    public void CreateOrderLine(OrderLine orderLine) {
        orderLineRepo.save(orderLine);
    }
}
