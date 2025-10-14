package com.example.backend.Service;

import com.example.backend.Entity.SiteUser;
import com.example.backend.Repos.SiteUserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class SiteUserService {
    @Autowired
    private SiteUserRepo siteUserRepo;

    public SiteUser findById(Integer id) {
        return siteUserRepo.findById(id);
    }


}

