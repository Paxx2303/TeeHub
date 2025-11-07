package com.example.backend.Repos;

import com.example.backend.Entity.ShopOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShopOrderRepository extends JpaRepository<ShopOrder, Integer> {
//    public List<ShopOrder> findByUserId(Integer userId);
//    public List<ShopOrder> findByOrderStatus(String shopId);
}
