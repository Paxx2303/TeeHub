package com.example.backend.Repos;

import com.example.backend.Entity.ProductConfiguration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductConfigurationRepo extends JpaRepository<ProductConfiguration, Integer> {
    
}
