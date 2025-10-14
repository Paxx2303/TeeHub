package com.example.backend.Repos;


import com.example.backend.Entity.SiteUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SiteUserRepo extends JpaRepository<SiteUser, Long> {

    public SiteUser findById(Integer id);

}
