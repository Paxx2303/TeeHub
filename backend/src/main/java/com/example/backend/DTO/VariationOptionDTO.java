package com.example.backend.DTO;

import com.example.backend.Entity.VariationOption;
import lombok.Data;

@Data
public class VariationOptionDTO {
    private Integer id;
    private String value;
    private Integer variationId;
    private String variationName;

    // Constructor nhận Entity -> tự map
    public VariationOptionDTO(VariationOption option) {
        this.id = option.getId();
        this.value = option.getValue();

        if (option.getVariation() != null) {
            this.variationId = option.getVariation().getId();
            this.variationName = option.getVariation().getName();
        }
    }
}
