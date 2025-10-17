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
    @Autowired
    private SiteUserService siteUserService;


    public UserAddressDTO getUserWithAddressesById(Integer userId) {

        SiteUser user = siteUserRepo.findById(userId).orElse(null);
        Address address = addressService.findByUser(user);

        UserAddressDTO dto = new UserAddressDTO();
        dto.setUser_id(user.getId());
        dto.setAddress_id(address.getAddressId());
        dto.setEmailAddress(user.getEmail_address());
        dto.setPhoneNumber(user.getPhone_number());
        dto.setUnitNumber(address.getUnit_number());
        dto.setAddressLine1(address.getAddress_line1());
        dto.setCity(address.getCity());
        return dto;
    }

    public SiteUser toSiteUser(UserAddressDTO dto) {
        if (dto == null) return null;

        SiteUser user = new SiteUser();
        user.setId(dto.getUser_id());
        user.setEmail_address(dto.getEmailAddress());
        user.setPhone_number(dto.getPhoneNumber());

        SiteUser U = siteUserService.findById(user.getId());


        // Không có password và role trong DTO -> có thể để null hoặc mặc định
        user.setPassword(U.getPassword());
        user.setRole(U.getRole());

        return user;
    }

    public Address toAddress(UserAddressDTO dto) {
        if (dto == null) return null;

        Address address = new Address();
        address.setAddressId(dto.getAddress_id());
        address.setUnit_number(dto.getUnitNumber());
        address.setAddress_line1(dto.getAddressLine1());
        address.setCity(dto.getCity());

        // Các trường khác nếu cần gán mặc định:
        address.setStreet_number(null);
        address.setAddress_line2(null);
        address.setRegion(null);
        address.setPostal_code(null);
        address.setCountry_name(null);
        address.setIs_default(false);

        return address;
    }


}


