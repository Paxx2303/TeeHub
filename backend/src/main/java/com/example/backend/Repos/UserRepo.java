package com.example.backend.Repos;

import com.example.backend.Entities.SiteUser;
import com.example.backend.Entities.SiteUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepo extends JpaRepository<SiteUser, Integer> {
    List<SiteUser> findByEmailAddressContaining(String email);
}