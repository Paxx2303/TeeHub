package com.example.backend.Repos;

import com.example.backend.Entity.ShopOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShopOrderRepository extends JpaRepository<ShopOrder, Integer> {

    // Lấy danh sách đơn hàng theo user_id
    List<ShopOrder> findByUser_Id(Integer userId);

    // Lấy danh sách theo trạng thái đơn hàng
    List<ShopOrder> findByOrderStatus(String orderStatus);
}
