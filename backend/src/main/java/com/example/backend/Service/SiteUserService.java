package com.example.backend.Service;

import com.example.backend.Entity.SiteUser;
import com.example.backend.Repos.SiteUserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class SiteUserService {
    @Autowired
    private SiteUserRepo siteUserRepo;

    public SiteUser findById(Integer id) {
        return siteUserRepo.findById(id).orElse(null);    }

    public SiteUser createUser(SiteUser user) {
        return siteUserRepo.save(user);
    }

    public SiteUser updateUser(Integer id, SiteUser userDetails) {
        Optional<SiteUser> optionalUser = siteUserRepo.findById(id);
        if (optionalUser.isPresent()) {
            SiteUser user = optionalUser.get();
            user.setPassword(userDetails.getPassword());

            return siteUserRepo.save(user);
        }
        return null;
    }

    public void deleteUser(Integer id) {
        siteUserRepo.deleteById(id);
    }
}

