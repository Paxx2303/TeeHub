package com.example.backend.Controller;

import com.example.backend.DTO.Response.UserAddressDTO;
import com.example.backend.Entity.SiteUser;
import com.example.backend.Service.SiteUserService;
import com.example.backend.Service.UserAddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
    @Autowired
    UserAddressService userAddressService;

    @Autowired
    SiteUserService SiteUserService;
    @GetMapping("/users/{id}")
    public UserAddressDTO findById(@PathVariable Integer id) {
        return userAddressService.getUserWithAddressesById(id);
    }

    @GetMapping("/test/{id}")
    public SiteUser test(@PathVariable Integer id) {
        return SiteUserService.findById(id);
    }
}
