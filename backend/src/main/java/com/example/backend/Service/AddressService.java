package com.example.backend.Service;


import com.example.backend.Entity.Address;
import com.example.backend.Entity.SiteUser;
import com.example.backend.Repos.AddressRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;


@Service

public class AddressService {
    @Autowired
    private AddressRepo addressRepo;
    public Address findByUser(SiteUser user) {
        return addressRepo.findByUser(user);
    }
    public Address updateAddress(Integer addressId, Address newAddressData) {
        // Tìm address theo id
        Optional<Address> optionalAddress = addressRepo.findById(addressId);
        if (optionalAddress.isEmpty()) {
            throw new RuntimeException("Address with id " + addressId + " not found");
        }

        Address existingAddress = optionalAddress.get();

        // Cập nhật các trường


        // Nếu bạn muốn cập nhật cả user:
        if (newAddressData.getUser() != null) {
            existingAddress.setUser(newAddressData.getUser());
        }

        // Lưu lại
        return addressRepo.save(existingAddress);
    }
}
