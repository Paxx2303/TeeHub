package com.example.backend.Service;

import com.example.backend.Entity.CustomProduct;
import com.example.backend.Repos.CustomProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomProductService {
    @Autowired
    public List<CustomProduct> getCustomProducts() {
        return CustomProductRepo.findAll();
    }

    public CustomProduct findById(Integer id) {
        return null;
    }
}
