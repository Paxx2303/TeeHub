package com.example.backend.Controller;

// Import DTO đăng ký
import com.example.backend.DTO.Request.RegisterRequest;
// Import Entity User của bạn
import com.example.backend.Entity.SiteUser;
// Import Service User của bạn
import com.example.backend.Service.SiteUserService;
import com.example.backend.Sercurity.JwtUtil;
import com.example.backend.Sercurity.MyUserDetails;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;
// Import để bắt lỗi email trùng
import org.springframework.dao.DataIntegrityViolationException;

import java.time.Duration;
import java.util.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtUtil jwt;

    // Sử dụng Service của bạn: SiteUserService
    private final SiteUserService siteUserService;

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    // --- DTOs ---
    public record LoginRequest(String email, String password) {}
    // (RegisterRequest DTO được import từ file riêng)
    public record LoginResponse(String accessToken, String email, String role, Integer userId) {}


    /**
     * Endpoint đăng ký user mới.
     * Tự động đăng nhập sau khi đăng ký thành công.
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req, HttpServletResponse res) {
        log.info("Attempting registration for email: {}", req.email());
        try {
            // 1. Gọi phương thức 'registerNewUser' từ Service
            SiteUser newUser = siteUserService.registerNewUser(req);
            log.info("New user created with ID: {}", newUser.getId());

            // 2. Tự động đăng nhập cho user mới
            log.debug("Calling AuthenticationManager.authenticate for new user {}", req.email());
            var auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.email(), req.password()));
            log.info("Authentication successful for new user: {}", req.email());

            // 3. Lấy thông tin chi tiết (bao gồm ID)
            var user = (MyUserDetails) auth.getPrincipal();
            var roles = user.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();

            log.info("Generating tokens for new user...");
            String access = jwt.generateToken(user.getUsername(), roles, Duration.ofMinutes(15));
            String refresh = jwt.generateToken(user.getUsername(), roles, Duration.ofDays(7));

            log.info("Setting refresh token cookie for new user.");
            var cookie = ResponseCookie.from("refresh_token", refresh)
                    .httpOnly(true).secure(false) // dev=false; prod=true
                    .sameSite("Lax").path("/auth").maxAge(Duration.ofDays(7)).build();
            res.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

            log.info("Registration successful, returning response with userId.");
            // 4. Trả về response thành công
            return ResponseEntity.status(HttpStatus.CREATED).body(
                    new LoginResponse(access, user.getUsername(), roles.isEmpty()? "ROLE_USER" : roles.get(0), user.getId())
            );
            // AuthController.java (bên trong @PostMapping("/register"))
        } catch (DataIntegrityViolationException e) {
            log.warn("!!! Registration FAILED for {}: Email already exists.", req.email());
            // Trả về một message chi tiết hơn TẠM THỜI để debug
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "LỖI DB: Email này đã được DB từ chối."));
        } catch (AuthenticationException ae) {
            log.error("!!! Auth FAILED immediately after registration for {}: {}", req.email(), ae.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Lỗi xác thực sau khi tạo tài khoản."));

        } catch (Exception e) {
            log.error("!!! UNEXPECTED ERROR during registration for {}: {}", req.email(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Đã xảy ra lỗi không mong muốn."));
        }

    }


    /**
     * Endpoint đăng nhập.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req, HttpServletResponse res) {
        log.info("Attempting login for email: {}", req.email());
        try {
            // 1. Xác thực
            log.debug("Calling AuthenticationManager.authenticate for {}", req.email());
            var auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.email(), req.password()));
            log.info("Authentication successful for: {}", req.email());

            // 2. Lấy thông tin chi tiết (bao gồm ID)
            var user = (MyUserDetails) auth.getPrincipal();
            log.info("Principal obtained with ID: {}", user.getId());

            var roles = user.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();
            log.info("Roles obtained: {}", roles);

            // 3. Tạo tokens
            log.info("Generating access token...");
            String access = jwt.generateToken(user.getUsername(), roles, Duration.ofMinutes(15));
            log.info("Access token generated.");

            log.info("Generating refresh token...");
            String refresh = jwt.generateToken(user.getUsername(), roles, Duration.ofDays(7));
            log.info("Refresh token generated.");

            // 4. Đặt cookie
            log.info("Setting refresh token cookie.");
            var cookie = ResponseCookie.from("refresh_token", refresh)
                    .httpOnly(true).secure(false) // dev=false; prod=true + HTTPS
                    .sameSite("Lax").path("/auth").maxAge(Duration.ofDays(7)).build();
            res.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

            log.info("Login successful, returning response with userId.");
            // 5. Trả về response
            return ResponseEntity.ok(
                    new LoginResponse(access, user.getUsername(), roles.isEmpty()? "ROLE_USER" : roles.get(0), user.getId())
            );

        } catch (AuthenticationException ae) {
            log.warn("!!! Authentication FAILED for {}: {}", req.email(), ae.getMessage());
            // Trả về 401 với message cho frontend
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Sai email hoặc mật khẩu."));
        } catch (Exception e) {
            log.error("!!! UNEXPECTED ERROR during login for {}: {}", req.email(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Lỗi máy chủ nội bộ."));
        }
    }

    /**
     * Endpoint làm mới access token bằng refresh token.
     */
    @PostMapping("/refresh")
    public ResponseEntity<Map<String,String>> refresh(@CookieValue(name="refresh_token", required=false) String refresh) {
        log.debug("Received request to refresh token.");
        if (refresh == null) {
            log.warn("Refresh token cookie not found.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            String email = jwt.extractUsername(refresh);
            log.info("Extracted email {} from refresh token. Generating new access token.", email);

            // Tạm thời dùng ROLE_USER:
            // TODO: Để an toàn hơn, bạn nên gọi UserDetailsService ở đây để lấy roles
            // UserDetails userDetails = userDetailsService.loadUserByUsername(email);
            // Collection<String> roles = userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();
            Collection<String> roles = List.of("ROLE_USER");

            String access = jwt.generateToken(email, roles, Duration.ofMinutes(15));
            log.info("New access token generated for {}.", email);
            return ResponseEntity.ok(Map.of("accessToken", access));
        } catch (Exception e) {
            log.error("!!! Error during token refresh: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    /**
     * Endpoint đăng xuất.
     * Xóa refresh token cookie.
     */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse res) {
        log.info("Processing logout request.");
        // Tạo một cookie hết hạn ngay lập tức
        var expired = ResponseCookie.from("refresh_token", "")
                .httpOnly(true).secure(false).sameSite("Lax").path("/auth").maxAge(0).build();
        res.addHeader(HttpHeaders.SET_COOKIE, expired.toString());
        log.info("Cleared refresh token cookie.");
        return ResponseEntity.noContent().build();
    }
}