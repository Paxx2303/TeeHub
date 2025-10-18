package com.example.backend.Repos;

import com.example.backend.Entity.Address;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressRepo extends JpaRepository<Address, Integer> {

    @Query("""
        select a from Address a
        where (:q is null or :q = '')
           or lower(coalesce(a.addressLine, ''))  like lower(concat('%', :q, '%'))
           or lower(coalesce(a.unitNumber, ''))   like lower(concat('%', :q, '%'))
           or lower(coalesce(a.streetNumber, '')) like lower(concat('%', :q, '%'))
    """)
    List<Address> search(@Param("q") String q);
}
