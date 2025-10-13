package com.example.backend.DTO;

import com.example.backend.Entity.Variation;
import lombok.Data;

@Data
public class VariationDTO {
    private Integer id;
    private String name;
    private Integer categoryId;
    private String categoryName;

    // Constructor nhận Entity -> tự động map
    public VariationDTO(Variation variation) {
        this.id = variation.getId();
        this.name = variation.getName();

        if (variation.getCategory() != null) {
            this.categoryId = variation.getCategory().getId();
            this.categoryName = variation.getCategory().getCategoryName();
        }
    }
}
