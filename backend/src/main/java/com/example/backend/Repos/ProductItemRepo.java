package com.example.backend.Repos;


import com.example.backend.Entity.ProductItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductItemRepo  extends JpaRepository<ProductItem, Integer> {
    List<ProductItem> findByProductId(Integer productId);
}
