package com.example.backend.Service;

import com.example.backend.Entity.Product;
import com.example.backend.Repos.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {
    @Autowired
    ProductRepo productRepo;

    public List<Product> findAll() {
        return productRepo.findAll();
    }
    public Product findById(Integer id) {
        return productRepo.findById(id).orElse(null);
    }
    public Product save(Product product) {
        return productRepo.save(product);}
    public Product update(Product product) {
        return productRepo.save(product);}
    public void deleteById(Integer id) {
        productRepo.deleteById(id);}
    public List<Product> findByNameContainingIgnoreCase(String name) {
        return productRepo.findByNameContainingIgnoreCase(name);
    }
    public List<Product> findByName(String name) {
        return productRepo.findByName(name);
    }
}
