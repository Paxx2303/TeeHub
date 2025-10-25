package com.example.backend.Controller;

import com.example.backend.Sercurity.JwtUtil;
import com.example.backend.Sercurity.MyUserDetails; // <-- 1. Import MyUserDetails
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger; // <-- Thêm log
import org.slf4j.LoggerFactory; // <-- Thêm log
import org.springframework.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.AuthenticationException; // <-- Thêm import
import org.springframework.security.core.GrantedAuthority;
// Bỏ import User chuẩn: import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtUtil jwt;
    // Thêm Logger
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    // --- DTOs ---
    public record LoginRequest(String email, String password) {}
    // 2. Thêm userId vào LoginResponse
    public record LoginResponse(String accessToken, String email, String role, Integer userId) {}

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest req, HttpServletResponse res) {
        log.info("Attempting login for email: {}", req.email());
        try {
            log.debug("Calling AuthenticationManager.authenticate for {}", req.email());
            var auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.email(), req.password()));
            log.info("Authentication successful for: {}", req.email());

            // 3. Ép kiểu sang MyUserDetails
            var user = (MyUserDetails) auth.getPrincipal();
            log.info("Principal obtained with ID: {}", user.getId());

            var roles = user.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();
            log.info("Roles obtained: {}", roles);

            log.info("Generating access token...");
            String access = jwt.generateToken(user.getUsername(), roles, Duration.ofMinutes(15));
            log.info("Access token generated.");

            log.info("Generating refresh token...");
            String refresh = jwt.generateToken(user.getUsername(), roles, Duration.ofDays(7));
            log.info("Refresh token generated.");

            log.info("Setting refresh token cookie.");
            var cookie = ResponseCookie.from("refresh_token", refresh)
                    .httpOnly(true).secure(false) // dev=false; prod=true + HTTPS
                    .sameSite("Lax").path("/auth").maxAge(Duration.ofDays(7)).build();
            res.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

            log.info("Login successful, returning response with userId.");
            // 4. Trả về cả userId
            return ResponseEntity.ok(
                    new LoginResponse(access, user.getUsername(), roles.isEmpty()? "ROLE_USER" : roles.get(0), user.getId())
            );

        } catch (AuthenticationException ae) { // Bắt lỗi xác thực cụ thể
            log.warn("!!! Authentication FAILED for {}: {}", req.email(), ae.getMessage());
            // Trả về 401 rõ ràng
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (Exception e) { // Bắt các lỗi khác (như ClassCastException tiềm ẩn nếu MyUserDetailsService sai)
            log.error("!!! UNEXPECTED ERROR during login for {}: {}", req.email(), e.getMessage(), e);
            // Trả về 500
            return ResponseEntity.internalServerError().build();
        }
    }

    // --- /refresh và /logout giữ nguyên ---
    @PostMapping("/refresh")
    public ResponseEntity<Map<String,String>> refresh(@CookieValue(name="refresh_token", required=false) String refresh) {
        log.debug("Received request to refresh token.");
        if (refresh == null) {
            log.warn("Refresh token cookie not found.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            // (có thể check hạn ở đây nếu muốn)
            String email = jwt.extractUsername(refresh);
            log.info("Extracted email {} from refresh token. Generating new access token.", email);
            // Lấy roles từ đâu? Tạm thời hardcode ROLE_USER hoặc cần gọi lại UserDetailsService
            // Hoặc lưu roles vào refresh token (nhưng không an toàn bằng)
            // Lựa chọn an toàn nhất là gọi lại UserDetailsService nếu cần roles chính xác
            // UserDetails userDetails = userDetailsService.loadUserByUsername(email);
            // Collection<String> roles = userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();
            // Tạm thời dùng ROLE_USER như cũ:
            Collection<String> roles = List.of("ROLE_USER");

            String access = jwt.generateToken(email, roles, Duration.ofMinutes(15));
            log.info("New access token generated for {}.", email);
            return ResponseEntity.ok(Map.of("accessToken", access));
        } catch (Exception e) {
            log.error("!!! Error during token refresh: {}", e.getMessage(), e);
            // Trả về lỗi nếu refresh token không hợp lệ
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse res) {
        log.info("Processing logout request.");
        var expired = ResponseCookie.from("refresh_token", "")
                .httpOnly(true).secure(false).sameSite("Lax").path("/auth").maxAge(0).build();
        res.addHeader(HttpHeaders.SET_COOKIE, expired.toString());
        log.info("Cleared refresh token cookie.");
        return ResponseEntity.noContent().build();
    }
}