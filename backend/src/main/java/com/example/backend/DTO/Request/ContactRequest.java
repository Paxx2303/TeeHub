package com.example.backend.DTO.Request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContactRequest {
    @NotEmpty(message = "Họ tên không được để trống")
    private String name; // Khớp với 'sender_name'

    @NotEmpty(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email; // Khớp với 'sender_email'

    private String phone; // Khớp với 'sender_phone'

    @NotEmpty(message = "Chủ đề không được để trống")
    private String subject; // Khớp với 'subject'

    @NotEmpty(message = "Tin nhắn không được để trống")
    private String message; // Khớp với 'message_body'
}
