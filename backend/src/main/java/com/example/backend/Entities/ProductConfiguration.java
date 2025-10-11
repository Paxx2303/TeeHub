package com.example.backend.Entities;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "product_configuration", schema = "ecommerce")
public class ProductConfiguration {
    @EmbeddedId
    private ProductConfigurationId id;

    //TODO [Reverse Engineering] generate columns from DB
}