package com.example.backend.DTO.Response;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VariationDTO {
    private Integer variation_id;
    private Integer category_id;     // từ ProductCategory
    private String category_name;    // từ ProductCategory
    private String name;             // tên variation
}
