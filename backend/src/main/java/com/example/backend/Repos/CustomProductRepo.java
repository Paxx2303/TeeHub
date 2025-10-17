package com.example.backend.Repos;

import com.example.backend.Entity.CustomProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomProductRepo extends JpaRepository<CustomProduct, Integer> {

}