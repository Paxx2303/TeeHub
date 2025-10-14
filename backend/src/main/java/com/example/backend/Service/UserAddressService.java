package com.example.backend.Service;

import com.example.backend.DTO.Response.UserAddressDTO;
import com.example.backend.Entity.Address;
import com.example.backend.Entity.SiteUser;
import com.example.backend.Repos.SiteUserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserAddressService {

    @Autowired
    private SiteUserRepo siteUserRepo;
    @Autowired
    private AddressService addressService;


    public UserAddressDTO getUserWithAddressesById(Integer userId) {

        SiteUser user = siteUserRepo.findById(userId);


        Address address = addressService.findByUser(user);

        UserAddressDTO dto = new UserAddressDTO();
        dto.setId(user.getId());
        dto.setEmailAddress(user.getEmailAddress());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setUnitNumber(address.getUnitNumber());
        dto.setStreetNumber(address.getStreetNumber());
        dto.setAddressLine1(address.getAddressLine1());
        dto.setAddressLine2(address.getAddressLine2());
        dto.setCity(address.getCity());
        dto.setRegion(address.getRegion());
        dto.setPostalCode(address.getPostalCode());
        dto.setCountryName(address.getCountryName());
        dto.setIsDefault(address.getIsDefault());
        return dto;
    }
}


