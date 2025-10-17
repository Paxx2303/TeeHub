package com.example.backend.Repos;

import com.example.backend.DTO.Response.Cart.CartDTO;
import com.example.backend.Entity.ShoppingCart;
import lombok.Getter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@SuppressWarnings("ALL")
@Repository
@Getter
public interface CartRepo extends JpaRepository<CartDTO, Integer> {

    CartDTO findByUserId(Integer userId);

    ShoppingCart findByUser_id(Integer userId);
}
