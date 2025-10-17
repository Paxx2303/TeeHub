package com.example.backend.DTO.Response.Cart;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartDTO {
    private Integer cart_id;
    private Integer user_id;
    private List<CartItemDTO> items;
    private Double total_price;


}
