package com.example.backend.DTO.Response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDetailsDTO {
    private Integer userId;
    private String emailAddress;
    private String password; // <-- Bắt buộc phải có
    private String role;
}