package com.example.backend.Repos;

import com.example.backend.Entity.Address;
import com.example.backend.Entity.SiteUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AddressRepo extends JpaRepository<Address, Integer> {
    Address findByUser(SiteUser user);


}