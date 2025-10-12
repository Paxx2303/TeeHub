package com.example.backend.Controller;

import com.example.backend.Repos.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @Autowired
    private UserRepo userRepository;

    @GetMapping("/test-db")
    public String testDatabaseConnection() {
        try {
            userRepository.count(); // Simple query to test connection
            return "Database connection successful!";
        } catch (Exception e) {
            return "Database connection failed: " + e.getMessage();
        }
    }
}