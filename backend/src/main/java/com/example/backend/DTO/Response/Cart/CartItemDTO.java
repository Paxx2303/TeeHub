package com.example.backend.DTO.Response.Cart;

import com.example.backend.DTO.Response.VariationDTO;
import lombok.Data;

import java.util.List;

@Data
public class CartItemDTO {
    private Integer cart_item_id;
    private Integer product_item_id;
    private String product_name;
    private Integer quantity;
    private Double price;
    private List<VariationDTO> variations;

}
