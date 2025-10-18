package com.example.backend.Repos;

import com.example.backend.DTO.Response.Cart.VariationOptionDTO;
import com.example.backend.Entity.VariationOption;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VariationOptionRepo extends JpaRepository<VariationOption, Integer> {


}
