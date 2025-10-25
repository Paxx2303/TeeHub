// backend/src/main/java/com/example/backend/Controller/UserController.java
package com.example.backend.Controller;

import com.example.backend.DTO.Request.SiteUserRequest;
import com.example.backend.DTO.Request.AddressRequest;
import com.example.backend.DTO.Response.SiteUserResponse;
import com.example.backend.DTO.Response.AddressResponse;
import com.example.backend.Service.SiteUserService;
import com.example.backend.Service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.*;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final SiteUserService siteUserService;
    private final AddressService addressService;

    /* ===== Users ===== */

    @GetMapping
    public ResponseEntity<List<SiteUserResponse>> getUsers() {
        return ResponseEntity.ok(siteUserService.getAllUsers()); // trả [] khi rỗng
    }

    @GetMapping("/{userId}")
    public ResponseEntity<SiteUserResponse> getUser(@PathVariable Integer userId) {
        return ResponseEntity.ok(siteUserService.getUserById(userId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<SiteUserResponse>> searchUsers(@RequestParam("kw") String kw) {
        return ResponseEntity.ok(siteUserService.searchUsers(kw)); // trả [] khi không match
    }

    @PutMapping("/{userId}/password")
    public ResponseEntity<String> changePassword(
            @PathVariable Integer userId,
            @RequestBody SiteUserRequest req) {

        if (req.getPassword() == null || req.getNew_password() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cần cung cấp mật khẩu cũ và mới");
        }

        siteUserService.changePassword(userId, req.getPassword(), req.getNew_password());
        return ResponseEntity.ok("Đổi mật khẩu thành công");
    }


    @PostMapping
    public ResponseEntity<SiteUserResponse> createUser(
            @Validated(SiteUserRequest.Create.class) @RequestBody SiteUserRequest req) {
        var created = siteUserService.createUser(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<SiteUserResponse> updateUser(
            @PathVariable Integer userId,
            @Validated(SiteUserRequest.Update.class) @RequestBody SiteUserRequest req) {
        return ResponseEntity.ok(siteUserService.updateUser(userId, req));
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer userId) {
        siteUserService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    /* ===== Addresses (nested under user) ===== */

    @GetMapping("/{userId}/addresses")
    public ResponseEntity<List<AddressResponse>> getAddresses(@PathVariable Integer userId) {
        return ResponseEntity.ok(addressService.getAddressesOfUser(userId)); // trả [] khi rỗng
    }

    // NEW: get one address theo user (tiện cho màn hình chi tiết)
    @GetMapping("/{userId}/addresses/{addressId}")
    public ResponseEntity<AddressResponse> getAddress(
            @PathVariable Integer userId,
            @PathVariable Integer addressId) {
        return ResponseEntity.ok(addressService.getAddressByIdForUser(userId, addressId));
    }

    @PostMapping("/{userId}/addresses")
    public ResponseEntity<AddressResponse> addAddress(
            @PathVariable Integer userId,
            @Validated(AddressRequest.Create.class) @RequestBody AddressRequest req) {
        var created = addressService.createAddressForUser(userId, req);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{userId}/addresses/{addressId}")
    public ResponseEntity<AddressResponse> updateAddress(
            @PathVariable Integer userId,
            @PathVariable Integer addressId,
            @Validated(AddressRequest.Update.class) @RequestBody AddressRequest req) {
        return ResponseEntity.ok(addressService.updateAddressForUser(userId, addressId, req));
    }

    @DeleteMapping("/{userId}/addresses/{addressId}")
    public ResponseEntity<Void> deleteAddress(
            @PathVariable Integer userId,
            @PathVariable Integer addressId) {
        addressService.deleteAddressForUser(userId, addressId);
        return ResponseEntity.noContent().build();
    }
}
