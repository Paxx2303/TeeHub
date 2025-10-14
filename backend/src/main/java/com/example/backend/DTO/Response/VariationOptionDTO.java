package com.example.backend.DTO.Response;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VariationOptionDTO {
    private Integer variation_option_id;

    private Integer variation_id;     // từ Variation
    private String  variation_name;   // từ Variation

    private Integer category_id;      // từ ProductCategory (qua Variation)
    private String  category_name;    // từ ProductCategory (qua Variation)

    private String value;             // giá trị option
}
