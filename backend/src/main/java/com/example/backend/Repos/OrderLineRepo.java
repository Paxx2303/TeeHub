package com.example.backend.Repos;

import com.example.backend.Entity.OrderLine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderLineRepo extends JpaRepository<OrderLine, Integer> {

}