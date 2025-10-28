package com.example.backend.Repos;


import com.example.backend.Entity.Variation;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VariationRepo extends JpaRepository<Variation, Integer> {


}
