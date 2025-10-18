package com.example.backend.DTO.Response.Cart;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VariationDTO {
    private String variationName;
    private String optionValue;
}
