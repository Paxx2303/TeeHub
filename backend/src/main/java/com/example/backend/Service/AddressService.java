package com.example.backend.Service;


import com.example.backend.Entity.Address;
import com.example.backend.Repos.AddressRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service

public class AddressService {
    @Autowired
    private AddressRepo addressRepos;

    public List<Address> getAddresses() {
        return addressRepos.findAll();
    }

    public Address saveAddress(Address address) {
        return addressRepos.save(address);
    }

    public void deleteAddress(Address address) {
        addressRepos.delete(address);
    }

    public Address getAddressById(Integer id) {
        return addressRepos.findById(id).orElse(null);
    }
    public Address updateAddress(int id,Address address) {
        return addressRepos.findById(id).map(
                order-> {
                    order.setCity(address.getCity());
                    order.setUser(address.getUser());
                    order.setUnitNumber(address.getUnitNumber());
                    order.setStreetNumber(address.getStreetNumber());
                    order.setAddressLine1(address.getAddressLine1());
                    order.setAddressLine2(address.getAddressLine2());
                    order.setRegion(address.getRegion());
                    order.setPostalCode(address.getPostalCode());
                    order.setCountryName(address.getCountryName());
                    order.setIsDefault(address.getIsDefault());
                    return addressRepos.save(order);
                }
        ).orElse(null);
    }

}
