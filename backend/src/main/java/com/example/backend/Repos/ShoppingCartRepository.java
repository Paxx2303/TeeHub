package com.example.backend.Repos;

import com.example.backend.Entity.ShoppingCart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShoppingCartRepository extends JpaRepository<ShoppingCart, Integer> {

    // Lấy giỏ hàng theo user_id
//    Optional<ShoppingCart> findByUser_Id(Integer userId);
//
//    // Nếu bạn muốn hỗ trợ nhiều giỏ hàng trên 1 user
//    List<ShoppingCart> findAllByUser_Id(Integer userId);
}
