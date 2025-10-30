package com.example.backend.Service;

import com.example.backend.DTO.Request.SiteUserRequest;
import com.example.backend.DTO.Response.SiteUserResponse;
import com.example.backend.Entity.SiteUser;
import com.example.backend.Repos.SiteUserRepo;
// [MỚI] Import DTO đăng ký công khai
import com.example.backend.DTO.Request.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
// [MỚI] Import PasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SiteUserService {

    private final SiteUserRepo siteUserRepo;
    // [MỚI] Inject PasswordEncoder
    private final PasswordEncoder passwordEncoder;


    /**
     * [PHƯƠNG THỨC MỚI] - Dành cho AuthController
     * Phương thức này dành riêng cho việc đăng ký công khai (public registration).
     * Nó nhận DTO đơn giản và trả về Entity (cho AuthController xử lý).
     */
    public SiteUser registerNewUser(RegisterRequest req) {

        // [SỬA ĐỔI] Chuẩn hóa email về chữ thường
        String normalizedEmail = req.email().toLowerCase();

        // Kiểm tra tính tồn tại bằng email đã chuẩn hóa
        if (siteUserRepo.existsByEmailAddress(normalizedEmail)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email đã tồn tại: " + req.email());
        }

        var newUser = new SiteUser();
        newUser.setFullName(req.fullName());
        // [SỬA ĐỔI] Lưu email đã chuẩn hóa
        newUser.setEmailAddress(normalizedEmail);

        // ... (phần còn lại)
        newUser.setPassword(passwordEncoder.encode(req.password()));
        newUser.setRole("ROLE_USER");

        return siteUserRepo.save(newUser);
    }

    /* ==========================================================================
     PHẦN CÒN LẠI CỦA FILE (DÀNH CHO ADMIN CRUD)
     ==========================================================================
    */

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

    /* ===== Create (For Admin) ===== */

    /**
     * Phương thức này dành cho Admin tạo user
     * Nó nhận SiteUserRequest (nhiều trường hơn) và trả về DTO.
     */
    public SiteUserResponse createUser(SiteUserRequest req) {
        if (siteUserRepo.existsByEmailAddress(req.getEmail_address())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email đã tồn tại: " + req.getEmail_address());
        }
        SiteUser su = new SiteUser();
        su.setFullName(req.getFull_name());
        su.setUserAvatar(req.getUser_avatar());
        su.setEmailAddress(req.getEmail_address());
        su.setPhoneNumber(req.getPhone_number());

        // [SỬA] Luôn mã hóa mật khẩu
        su.setPassword(passwordEncoder.encode(req.getPassword()));

        su.setRole(req.getRole() != null ? req.getRole() : "USER");

        su = siteUserRepo.save(su);
        return mapToDto(su);
    }

    /**
     * Phương thức này cho phép người dùng tự đổi mật khẩu
     */
    public void changePassword(Integer userId, String oldPassword, String newPassword) {
        SiteUser user = siteUserRepo.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User không tồn tại"));

        // [SỬA] Dùng .matches() để so sánh mật khẩu thô với mật khẩu đã hash
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mật khẩu cũ không đúng");
        }

        // [SỬA] Mã hóa mật khẩu mới
        user.setPassword(passwordEncoder.encode(newPassword));
        siteUserRepo.save(user);
    }

    /* ===== Update (For Admin/Profile) ===== */

    public SiteUserResponse updateUser(Integer id, SiteUserRequest req) {
        SiteUser su = siteUserRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User " + id + " không tồn tại."));

        if (req.getFull_name() != null)    su.setFullName(req.getFull_name());
        if (req.getUser_avatar() != null)  su.setUserAvatar(req.getUser_avatar());
        if (req.getPhone_number() != null) su.setPhoneNumber(req.getPhone_number());
        if (req.getRole() != null)         su.setRole(req.getRole());

        // Cho phép Admin đặt lại mật khẩu
        if (req.getNew_password() != null && !req.getNew_password().isBlank()) {
            // [SỬA] Mã hóa mật khẩu mới
            su.setPassword(passwordEncoder.encode(req.getNew_password()));
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

    public SiteUser findById(Integer id) {
        return siteUserRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User " + id + " không tồn tại."));
    }
}