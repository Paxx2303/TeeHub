package com.example.backend.Sercurity; // Hoặc package đúng của bạn

import com.example.backend.DTO.Response.UserDetailsDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

/**
 * Lớp UserDetails tùy chỉnh, giữ thông tin người dùng cần thiết cho Spring Security.
 * Nó nhận UserDetailsDTO thay vì SiteUser entity trực tiếp.
 */
@RequiredArgsConstructor // Lombok tạo constructor nhận DTO
public class MyUserDetails implements UserDetails {

    private final UserDetailsDTO userDetailsDTO; // Giữ tham chiếu đến DTO

    /**
     * Trả về ID người dùng.
     * Cần thiết cho @PreAuthorize("principal.id == #userId").
     * @return ID người dùng (Integer).
     */
    public Integer getId() {
        // Gọi getter từ UserDetailsDTO (Lombok đã tạo)
        return userDetailsDTO.getUserId();
    }

    /**
     * Trả về danh sách quyền (roles) của người dùng.
     * Spring Security yêu cầu tiền tố "ROLE_".
     * @return Collection chứa các GrantedAuthority.
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        String role = userDetailsDTO.getRole(); // Lấy role từ DTO

        // Xử lý role null hoặc rỗng, mặc định là USER
        if (role == null || role.trim().isEmpty()) {
            role = "USER";
        } else {
            role = role.trim().toUpperCase();
        }

        // Đảm bảo có tiền tố "ROLE_"
        if (!role.startsWith("ROLE_")) {
            role = "ROLE_" + role;
        }

        // Trả về danh sách chỉ chứa một quyền
        return Collections.singletonList(new SimpleGrantedAuthority(role));
    }

    /**
     * Trả về mật khẩu đã được mã hóa (hoặc plaintext nếu dùng NoOpPasswordEncoder).
     * @return Mật khẩu người dùng.
     */
    @Override
    public String getPassword() {
        // Lấy password từ DTO
        return userDetailsDTO.getPassword();
    }

    /**
     * Trả về username (trong trường hợp này là địa chỉ email).
     * @return Email người dùng.
     */
    @Override
    public String getUsername() {
        // Lấy email từ DTO
        return userDetailsDTO.getEmailAddress();
    }

    // Các phương thức còn lại của UserDetails thường trả về true
    // nếu bạn không cần kiểm tra tài khoản hết hạn, bị khóa, v.v.

    @Override
    public boolean isAccountNonExpired() {
        return true; // Tài khoản không bao giờ hết hạn
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Tài khoản không bao giờ bị khóa
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Mật khẩu không bao giờ hết hạn
    }

    @Override
    public boolean isEnabled() {
        return true; // Tài khoản luôn được kích hoạt
    }
}