package com.example.backend.Repos;

import com.example.backend.Entity.ShoppingCart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShoppingCartRepo extends JpaRepository<ShoppingCart, Integer> {


    Integer findByUserId(Integer userId);
}
