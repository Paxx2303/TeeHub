package com.example.backend.Entity;
import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;

@Entity
@Table(name = "product_configuration")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@IdClass(ProductConfigurationId.class)
public class ProductConfiguration {

    @Id
    @ManyToOne
    @JoinColumn(name = "product_item_id")
    private ProductItem product_item_id;

    @Id
    @ManyToOne
    @JoinColumn(name = "variation_option_id")
    private VariationOption variation_option_id;
}

// Composite Key Class
@Data
@NoArgsConstructor
@AllArgsConstructor
class ProductConfigurationId implements Serializable {
    private Integer product_item_id;
    private Integer variation_option_id;
}