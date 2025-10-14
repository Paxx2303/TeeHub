package com.example.backend.Controller;

import com.example.backend.Entity.Product;
import com.example.backend.Service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.ArrayList;
import java.util.List;

@Controller
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {
    @Autowired
    ProductService ProductService;

    @GetMapping("/products")
    public List<Product> getProductsPage() {
        return ProductService.findAll();
    }

}
