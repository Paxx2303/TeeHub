// backend/src/main/java/com/example/backend/Controller/UserController.java
package com.example.backend.Controller;

import com.example.backend.DTO.Request.SiteUserRequest;
import com.example.backend.DTO.Request.AddressRequest;
import com.example.backend.DTO.Response.SiteUserResponse;
import com.example.backend.DTO.Response.AddressResponse;
import com.example.backend.Sercurity.MyUserDetails;
import com.example.backend.Service.SiteUserService;
import com.example.backend.Service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
// ... (code còn lại giữ nguyên) ...
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
    @GetMapping("/me")
    public ResponseEntity<SiteUserResponse> getMyProfile(@AuthenticationPrincipal MyUserDetails userDetails) {

        // KIỂM TRA NULL (ĐỂ TRÁNH LỖI 500 NẾU TOKEN HẾT HẠN)
        if (userDetails == null) {
            // Sẽ không bao giờ chạy đến đây nếu SecurityConfig của bạn yêu cầu .authenticated()
            // Nhưng đây là một cách phòng vệ tốt
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Không tìm thấy thông tin xác thực");
        }

        // Dùng email (hoặc ID) từ principal để lấy thông tin
        // Giả sử MyUserDetails của bạn có hàm getUserId() hoặc getUsername()
        Integer currentUserId = userDetails.getUserId(); // HOẶC dùng getUsername()

        // Gọi service của bạn để lấy thông tin
        return ResponseEntity.ok(siteUserService.getUserById(currentUserId));
    }

    @PutMapping("/me")
    public ResponseEntity<SiteUserResponse> updateMyProfile(
            @AuthenticationPrincipal MyUserDetails userDetails,
            @Validated(SiteUserRequest.Update.class) @RequestBody SiteUserRequest req) {

        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token không hợp lệ");
        }
        Integer currentUserId = userDetails.getUserId();
        return ResponseEntity.ok(siteUserService.updateUser(currentUserId, req));
    }

    @GetMapping("/me/addresses")
    public ResponseEntity<List<AddressResponse>> getMyAddresses(@AuthenticationPrincipal MyUserDetails userDetails) {

        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token không hợp lệ hoặc đã hết hạn");
        }

        // Dùng hàm getUserId() từ MyUserDetails
        Integer currentUserId = userDetails.getUserId();

        // Gọi service address của bạn
        return ResponseEntity.ok(addressService.getAddressesOfUser(currentUserId));
    }
    @PostMapping("/me/addresses")
    public ResponseEntity<AddressResponse> createMyAddress(
            @AuthenticationPrincipal MyUserDetails userDetails,
            @Validated(AddressRequest.Create.class) @RequestBody AddressRequest req) {

        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token không hợp lệ");
        }
        Integer currentUserId = userDetails.getUserId();

        // Gọi service của bạn, dùng ID từ token
        var created = addressService.createAddressForUser(currentUserId, req);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // THÊM ENDPOINT NÀY ĐỂ SỬA ĐỊA CHỈ
    @PutMapping("/me/addresses/{addressId}")
    public ResponseEntity<AddressResponse> updateMyAddress(
            @AuthenticationPrincipal MyUserDetails userDetails,
            @PathVariable Integer addressId,
            @Validated @RequestBody AddressRequest req) { // <-- Dữ liệu đổ vào đây

        System.out.println(">>> Updating address. Received Request: " + req);
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token không hợp lệ");
        }
        Integer currentUserId = userDetails.getUserId();

        // Gọi service của bạn, nhưng dùng ID từ token (currentUserId)
        return ResponseEntity.ok(addressService.updateAddressForUser(currentUserId, addressId, req));
    }

    // THÊM ENDPOINT NÀY ĐỂ XÓA ĐỊA CHỈ
    @DeleteMapping("/me/addresses/{addressId}")
    public ResponseEntity<Void> deleteMyAddress(
            @AuthenticationPrincipal MyUserDetails userDetails,
            @PathVariable Integer addressId) {

        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token không hợp lệ");
        }
        Integer currentUserId = userDetails.getUserId();

        addressService.deleteAddressForUser(currentUserId, addressId);
        return ResponseEntity.noContent().build();
    }
    @PutMapping("/me/password")
    public ResponseEntity<String> changeMyPassword(
            @AuthenticationPrincipal MyUserDetails userDetails,
            @RequestBody SiteUserRequest req) { // Vẫn dùng SiteUserRequest nếu nó có password & new_password

        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token không hợp lệ");
        }
        if (req.getPassword() == null || req.getNew_password() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cần cung cấp mật khẩu cũ và mới");
        }
        Integer currentUserId = userDetails.getUserId();
        siteUserService.changePassword(currentUserId, req.getPassword(), req.getNew_password());
        return ResponseEntity.ok("Đổi mật khẩu thành công");
    }
}