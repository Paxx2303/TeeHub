package com.example.backend.Repos;

import com.example.backend.Entity.ShoppingCartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShoppingCartItemRepository extends JpaRepository<ShoppingCartItem, Integer> {
    List<ShoppingCartItem> findByCart_Id(Integer cartId);

    ShoppingCartItem findByCart_IdAndProductItem_Id(Integer cartId, Integer productItemId);


}
