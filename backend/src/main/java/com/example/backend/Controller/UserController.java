package com.example.backend.Controller;

import com.example.backend.DTO.Response.UserAddressDTO;

import com.example.backend.Entity.Address;
import com.example.backend.Entity.SiteUser;
import com.example.backend.Service.AddressService;
import com.example.backend.Service.SiteUserService;

import com.example.backend.Service.UserAddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.swing.*;
import java.util.HashMap;
import java.util.Map;

@RestController

@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/users")


public class UserController {

    @Autowired
    private UserAddressService userAddressService;

    @Autowired
    private SiteUserService siteUserService;

    @Autowired
    private AddressService addressService;

    @GetMapping("/{id}")
    public ResponseEntity<UserAddressDTO> findById(@PathVariable Integer id) {
        try {
            UserAddressDTO userAddressDTO = userAddressService.getUserWithAddressesById(id);
            if (userAddressDTO == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(userAddressDTO);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserAddressDTO> updateUserAndAddress(
            @PathVariable Integer id ,
            @RequestBody UserAddressDTO userAddressDTO) {
        try {

            SiteUser siteUser = userAddressService.toSiteUser(userAddressDTO);
            Address address = userAddressService.toAddress(userAddressDTO);

            addressService.updateAddress(userAddressDTO.getAddress_id(), address);
            siteUserService.updateUser(userAddressDTO.getUser_id(), siteUser);
            UserAddressDTO updatedDTO = userAddressService.getUserWithAddressesById(id);
            return ResponseEntity.ok(updatedDTO);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
//    @PutMapping("/{id}")
//    public ResponseEntity<SiteUser> updateUserAndAddress(
//             @PathVariable Integer id,
//        @RequestBody SiteUser userDetails) {
//    try {
//        SiteUser updatedUser = siteUserService.updateUser(id, userDetails);
//        return ResponseEntity.ok(updatedUser);
//    } catch (Exception e) {
//        return ResponseEntity.status(500).body(null);
//    }

//    @GetMapping("/address/{addressId}")
//    public ResponseEntity<Address> updateAddress(
//            @PathVariable Integer addressId
//           ) {
//        try {
//            SiteUser siteUser = siteUserService.findById(addressId);
//            Address address = addressService.findByUser(siteUser);
//
//            return ResponseEntity.ok(address);
//        } catch (Exception e) {
//            return ResponseEntity.status(500).body(null);
//        }
//    }
//    @PutMapping("/address/{addressId}")
//    public ResponseEntity<Address> updateAddress(
//            @PathVariable Integer addressId,
//            @RequestBody Address address
//    ) {
//        try {
//            Address updatedAddress = addressService.updateAddress(addressId, address);
//            return ResponseEntity.ok(updatedAddress);
//        } catch (Exception e) {
//            return ResponseEntity.status(500).body(null);
//        }
//    }
}



