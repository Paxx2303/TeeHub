package com.example.backend.Entity;
<<<<<<< HEAD


import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

=======

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

>>>>>>> main
@Getter
@Setter
@Entity
@Table(name = "product_configuration", schema = "ecommerce")
public class ProductConfiguration {
    @EmbeddedId
    private ProductConfigurationId id;

<<<<<<< HEAD
    //TODO [Reverse Engineering] generate columns from DB
=======
    @MapsId("productItemId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "product_item_id", nullable = false)
    private ProductItem productItem;

<<<<<<< HEAD
=======
    @MapsId("variationOptionId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "variation_option_id", nullable = false)
    private VariationOption variationOption;
>>>>>>> origin/tan
>>>>>>> main
}