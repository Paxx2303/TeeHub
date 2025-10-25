package com.example.backend.Service;

import com.example.backend.DTO.Request.SiteUserRequest;
import com.example.backend.DTO.Response.SiteUserResponse;
import com.example.backend.Entity.SiteUser;
import com.example.backend.Repos.SiteUserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SiteUserService {

    private final SiteUserRepo siteUserRepo;

    /* ===== Read ===== */

    public List<SiteUserResponse> getAllUsers() {
        // KHÔNG ném 404 khi rỗng — trả []
        return siteUserRepo.findAllAsDto();
    }

    public SiteUserResponse getUserById(Integer id) {
        return siteUserRepo.findDtoById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User " + id + " không tồn tại."));
    }

    public List<SiteUserResponse> searchUsers(String keyword) {
        if (keyword == null || keyword.isBlank()) return getAllUsers();
        // KHÔNG ném 404 khi không thấy — trả []
        return siteUserRepo.searchAsDto(keyword.trim());
    }

    /* ===== Create ===== */

    public SiteUserResponse createUser(SiteUserRequest req) {
        if (siteUserRepo.existsByEmailAddress(req.getEmail_address())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email đã tồn tại: " + req.getEmail_address());
        }
        SiteUser su = new SiteUser();
        su.setFullName(req.getFull_name());
        su.setUserAvatar(req.getUser_avatar());
        su.setEmailAddress(req.getEmail_address());
        su.setPhoneNumber(req.getPhone_number());
        // TODO: hash password (BCrypt) nếu có Spring Security
        su.setPassword(req.getPassword());
        su.setRole(req.getRole() != null ? req.getRole() : "USER");

        su = siteUserRepo.save(su);
        return mapToDto(su);
    }

    public void changePassword(Integer userId, String oldPassword, String newPassword) {
        SiteUser user = siteUserRepo.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User không tồn tại"));

        // kiểm tra mật khẩu cũ
        if (!user.getPassword().equals(oldPassword)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mật khẩu cũ không đúng");
        }

        user.setPassword(newPassword); // TODO: hash nếu dùng Spring Security
        siteUserRepo.save(user);
    }

    /* ===== Update ===== */

    public SiteUserResponse updateUser(Integer id, SiteUserRequest req) {
        SiteUser su = siteUserRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User " + id + " không tồn tại."));

        if (req.getFull_name() != null)    su.setFullName(req.getFull_name());
        if (req.getUser_avatar() != null)  su.setUserAvatar(req.getUser_avatar());
        if (req.getPhone_number() != null) su.setPhoneNumber(req.getPhone_number());
        if (req.getRole() != null)         su.setRole(req.getRole());
        if (req.getNew_password() != null && !req.getNew_password().isBlank()) {
            // TODO: hash password (BCrypt)
            su.setPassword(req.getNew_password());
        }

        su = siteUserRepo.save(su);
        return mapToDto(su);
    }

    /* ===== Delete ===== */

    public void deleteUser(Integer id) {
        if (!siteUserRepo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User " + id + " không tồn tại.");
        }
        siteUserRepo.deleteById(id);
    }

    /* ===== Helper mapping ===== */

    private SiteUserResponse mapToDto(SiteUser su) {
        return SiteUserResponse.builder()
                .id(su.getId())
                .full_name(su.getFullName())
                .user_avatar(su.getUserAvatar())
                .email_address(su.getEmailAddress())
                .phone_number(su.getPhoneNumber())
                .role(su.getRole())
                .build();
    }
}
