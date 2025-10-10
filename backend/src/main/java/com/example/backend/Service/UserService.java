package com.example.backend.Service;

import com.example.backend.Entities.SiteUser;
import com.example.backend.Repos.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepo userRepository;

    public List<SiteUser> getAllUsers() {
        return userRepository.findAll();
    }

    public SiteUser getUserById(Integer id) {
        Optional<SiteUser> user = userRepository.findById(id);
        return user.orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
}