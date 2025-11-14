package com.example.backend.DTO.Response;
import com.example.backend.Entity.SiteUser;
import lombok.Getter;

@Getter
public class UserReviewUserResponse {
    private Integer userId;
    private String fullName;
    private String userAvatar;

    // Constructor: Chuyển từ Entity -> DTO
    public UserReviewUserResponse(SiteUser user) {
        if (user != null) {
            this.userId = user.getUserId(); // Lấy ID
            this.fullName = user.getFullName(); // Lấy Tên
            this.userAvatar = user.getUserAvatar(); // Lấy Avatar
        }
    }
}
