package com.example.backend.Repos;

import com.example.backend.Entity.ShoppingCartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShoppingCartItemRepository extends JpaRepository<ShoppingCartItem, Integer> {

//    // Lấy danh sách item theo cart_id
//    List<ShoppingCartItem> findByCart_Id(Integer cartId);
//
//    // Lấy item cụ thể theo cart_id và product_item_id
//    ShoppingCartItem findByCart_IdAndProductItem_Id(Integer cartId, Integer productItemId);
}
