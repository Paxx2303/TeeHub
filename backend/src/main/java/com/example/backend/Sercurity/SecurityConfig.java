package com.example.backend.Sercurity;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.*;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.NoOpPasswordEncoder; // <-- Dùng NoOp
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;
    private final UserDetailsService myUserDetailsService; // MyUserDetailsService của bạn

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Chỉ định rõ bean cors
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // ... bên trong SecurityFilterChain ...
                .authorizeHttpRequests(auth -> auth
                        // === PHẦN PUBLIC (permitAll) ===
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/api/cart/**").permitAll()
                        .requestMatchers("/api/orders/**").permitAll()
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/products/**", "/api/categories/**", "/api/reviews/**").permitAll()

                        // === PHẦN USER (authenticated) ===
                        // SỬA Ở ĐÂY: Thêm quy tắc CỤ THỂ cho user
                        // Cho phép USER (hoặc ADMIN) đã đăng nhập được GET/PUT thông tin của CHÍNH HỌ
                        // cho phép preflight OPTIONS (quan trọng)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // cho phép public route location proxy
                        .requestMatchers("/api/locations/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/users/me").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/users/me").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/users/me/addresses").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/users/me/password").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/users/me/addresses/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/users/me/addresses/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/users/me/addresses").hasAnyRole("USER", "ADMIN") // (Dùng để tạo mới)
                        // Gửi review, xem giỏ hàng...
                        .requestMatchers(HttpMethod.POST, "/api/reviews/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers("/api/cart/**", "/api/orders/**").hasAnyRole("USER", "ADMIN")


                        // === PHẦN ADMIN (hasRole) ===
                        // QUY TẮC TỔNG QUÁT (phải nằm SAU quy tắc /me)
                        // Chỉ ADMIN mới được truy cập các đường dẫn /api/users/ CÒN LẠI (ví dụ: lấy tất cả user, xóa user)
                        .requestMatchers("/api/users/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.POST, "/api/products/**", "/api/categories/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/products/**", "/api/categories/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/products/**", "/api/categories/**").hasRole("ADMIN")

                        // Tất cả các request còn lại BẮT BUỘC phải xác thực
                        .anyRequest().authenticated()
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // ⚠️ SỬ DỤNG NoOpPasswordEncoder (KHÔNG BẢO MẬT) THEO YÊU CẦU
        return NoOpPasswordEncoder.getInstance();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider p = new DaoAuthenticationProvider();
        p.setUserDetailsService(myUserDetailsService);
        p.setPasswordEncoder(passwordEncoder()); // Sẽ tự động dùng NoOp
        return p;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration cfg) throws Exception {
        return cfg.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        var conf = new CorsConfiguration();
        conf.setAllowCredentials(true);
        conf.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:8080"));
        conf.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        conf.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        var src = new UrlBasedCorsConfigurationSource();
        src.registerCorsConfiguration("/**", conf);
        return src;
    }
}