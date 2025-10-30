package com.example.backend.DTO.Response;

<<<<<<< HEAD
=======
import com.example.backend.Entity.UserReview;
>>>>>>> origin/tan
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserReviewResponse {
<<<<<<< HEAD
    private Integer review_id;
    private Integer user_id;
    private String email_address;
    private Integer product_item_id;
    private String product_name;
    private Integer rating_value;
    private String comment;
=======
    private Integer id;
    private Integer ratingValue;
    private String comment;
    private String userName;     // Sửa thành fullName
    private String userAvatar; // Thêm avatar
    private String createdAt;

    public UserReviewResponse(UserReview entity) {
        this.id = entity.getId();
        this.ratingValue = entity.getRatingValue();
        this.comment = entity.getComment();

        // Kiểm tra an toàn: tránh gọi getter trên proxy chưa được nạp
        try {
            if (entity.getUser() != null) {
                this.userName = entity.getUser().getFullName();
                this.userAvatar = entity.getUser().getUserAvatar();
            } else {
                this.userName = "Anonymous";
            }
        } catch (org.hibernate.LazyInitializationException ex) {
            // user chưa được nạp — đặt giá trị mặc định
            this.userName = "Anonymous";
            this.userAvatar = null;
        }

        this.createdAt = entity.getCreatedAt() != null ? entity.getCreatedAt().toString() : null;
    }

>>>>>>> origin/tan
}
