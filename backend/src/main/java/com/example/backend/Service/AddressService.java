package com.example.backend.Service;


import com.example.backend.Entity.Address;
import com.example.backend.Entity.SiteUser;
import com.example.backend.Repos.AddressRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service

public class AddressService {
    @Autowired
    private AddressRepo addressRepos;
    public Address findByUser(SiteUser user) {
        return addressRepos.findByUser(user);
    }
}
