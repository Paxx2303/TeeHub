package com.example.backend.DTO.Response;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class UserAddressDTO {
    @Id
    private Integer id;
    private String unitNumber;
    private String streetNumber;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String region;
    private String postalCode;
    private String countryName;
    private Boolean isDefault;
    private  String emailAddress;
    private String phoneNumber;
}
