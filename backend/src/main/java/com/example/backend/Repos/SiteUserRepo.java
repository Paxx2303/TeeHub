package com.example.backend.Repos;


import com.example.backend.Entity.SiteUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SiteUserRepo extends JpaRepository<SiteUser, Integer> {



}
