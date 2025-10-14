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

        SiteUser user = siteUserRepo.findById(userId).orElse(null);



        Address address = addressService.findByUser(user);

        UserAddressDTO dto = new UserAddressDTO();
        dto.setId(user.getId());
        dto.setEmailAddress(user.getEmail_address());
        dto.setPhoneNumber(user.getPhone_number());
        dto.setUnitNumber(address.getUnit_number());
        dto.setStreetNumber(address.getStreet_number());
        dto.setAddressLine1(address.getAddress_line1());
        dto.setAddressLine2(address.getAddress_line2());
        dto.setCity(address.getCity());
        dto.setRegion(address.getRegion());
        dto.setPostalCode(address.getPostal_code());
        dto.setCountryName(address.getCountry_name());
        dto.setIsDefault(address.getIs_default());
        return dto;
    }
}


