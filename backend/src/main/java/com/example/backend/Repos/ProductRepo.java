package com.example.backend.Repos;

import com.example.backend.Entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepo extends JpaRepository<Product, Integer> {
    // Find products by name (partial match, case-insensitive)
    List<Product> findByNameContainingIgnoreCase(String name);

    // Find products by exact name
    List<Product> findByName(String name);
}