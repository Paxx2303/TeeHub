package com.example.backend.Service;

import com.example.backend.DTO.Request.SiteUserRequest;
import com.example.backend.DTO.Response.SiteUserResponse;
import com.example.backend.Entity.SiteUser;
import com.example.backend.Repos.SiteUserRepo;
import com.example.backend.DTO.Request.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SiteUserService {

    private final SiteUserRepo siteUserRepo;

    /* =========================
       Helpers
       ========================= */
    /** Chuẩn hoá role về dạng ROLE_* hợp lệ */
    private String normalizeRole(String rolePlain) {
        if (rolePlain == null || rolePlain.isBlank()) {
            return "ROLE_USER";
        }
        String up = rolePlain.trim().toUpperCase();
        if (up.startsWith("ROLE_")) up = up.substring(5);
        switch (up) {
            case "ADMIN":     return "ROLE_ADMIN";
            case "USER":      return "ROLE_USER";
            case "MODERATOR": return "ROLE_MODERATOR";
            default:
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role không hợp lệ: " + rolePlain);
        }
    }

    /* =========================
       Đăng ký public (AuthController dùng)
       ========================= */
    public SiteUser registerNewUser(RegisterRequest req) {
        String normalizedEmail = req.email().toLowerCase();

        if (siteUserRepo.existsByEmailAddress(normalizedEmail)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email đã tồn tại: " + req.email());
        }

        var newUser = new SiteUser();
        newUser.setFullName(req.fullName());
        newUser.setEmailAddress(normalizedEmail);

        // KHÔNG mã hoá: lưu plain text
        newUser.setPassword(req.password());
        newUser.setRole("ROLE_USER");

        return siteUserRepo.save(newUser);
    }

    /* ===== Read ===== */

    public List<SiteUserResponse> getAllUsers() {
        return siteUserRepo.findAllAsDto();
    }

    public SiteUserResponse getUserById(Integer id) {
        return siteUserRepo.findDtoById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User " + id + " không tồn tại."));
    }

    public List<SiteUserResponse> searchUsers(String keyword) {
        if (keyword == null || keyword.isBlank()) return getAllUsers();
        return siteUserRepo.searchAsDto(keyword.trim());
    }

    /* ===== Create (For Admin) ===== */

    public SiteUserResponse createUser(SiteUserRequest req) {
        if (req.getEmail_address() == null || req.getEmail_address().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email là bắt buộc");
        }
        String emailLower = req.getEmail_address().trim().toLowerCase();

        if (siteUserRepo.existsByEmailAddress(emailLower)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email đã tồn tại: " + req.getEmail_address());
        }
        if (req.getPassword() == null || req.getPassword().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mật khẩu là bắt buộc");
        }

        SiteUser su = new SiteUser();
        su.setFullName(req.getFull_name());
        su.setUserAvatar(req.getUser_avatar());
        su.setEmailAddress(emailLower);
        su.setPhoneNumber(req.getPhone_number());

        // KHÔNG mã hoá
        su.setPassword(req.getPassword());

        su.setRole(normalizeRole(req.getRole()));

        su = siteUserRepo.save(su);
        return mapToDto(su);
    }

    /* ===== Change password (User tự đổi) ===== */

    public void changePassword(Integer userId, String oldPassword, String newPassword) {
        SiteUser user = siteUserRepo.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User không tồn tại"));

        // So sánh plain text
        if (!oldPassword.equals(user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mật khẩu cũ không đúng");
        }

        // Lưu plain text
        user.setPassword(newPassword);
        siteUserRepo.save(user);
    }

    /* ===== Update (For Admin/Profile) ===== */

    public SiteUserResponse updateUser(Integer id, SiteUserRequest req) {
        SiteUser su = siteUserRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User " + id + " không tồn tại."));

        if (req.getFull_name() != null)    su.setFullName(req.getFull_name());
        if (req.getUser_avatar() != null)  su.setUserAvatar(req.getUser_avatar());
        if (req.getPhone_number() != null) su.setPhoneNumber(req.getPhone_number());

        // Nếu muốn cho update email:
        // if (req.getEmail_address() != null) {
        //     String newEmail = req.getEmail_address().trim().toLowerCase();
        //     if (!newEmail.equalsIgnoreCase(su.getEmailAddress()) && siteUserRepo.existsByEmailAddress(newEmail)) {
        //         throw new ResponseStatusException(HttpStatus.CONFLICT, "Email đã tồn tại: " + newEmail);
        //     }
        //     su.setEmailAddress(newEmail);
        // }

        if (req.getRole() != null) {
            su.setRole(normalizeRole(req.getRole()));
        }

        // Admin đặt lại mật khẩu (plain text)
        if (req.getNew_password() != null && !req.getNew_password().isBlank()) {
            su.setPassword(req.getNew_password());
        }

        su = siteUserRepo.save(su);
        return mapToDto(su);
    }

    /* ===== Đổi vai trò dành riêng cho ADMIN ===== */
    public SiteUserResponse changeUserRole(Integer userId, String rolePlain) {
        SiteUser su = siteUserRepo.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User " + userId + " không tồn tại."));
        su.setRole(normalizeRole(rolePlain));
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

    public SiteUser findById(Integer id) {
        return siteUserRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User " + id + " không tồn tại."));
    }
}
