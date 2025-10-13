package com.example.backend.Repos;


import com.example.backend.Entity.ProductItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductItemRepo  extends JpaRepository<ProductItem, Long> {

}
