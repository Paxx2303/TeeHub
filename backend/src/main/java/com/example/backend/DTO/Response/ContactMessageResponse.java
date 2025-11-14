package com.example.backend.DTO.Response;
import com.example.backend.Entity.ContactMessage;
import lombok.Getter;
import java.time.Instant;

@Getter
public class ContactMessageResponse {
    private Integer messageId;
    private String senderName;
    private String senderEmail;
    private String senderPhone;
    private String subject;
    private String messageBody;
    private String status;
    private Instant createdAt;

    // Chúng ta chỉ lấy tên, không lấy toàn bộ object User
    private String userName;
    private Integer userId;

    // Constructor (Hàm khởi tạo)
    public ContactMessageResponse(ContactMessage message) {
        this.messageId = message.getMessageId();
        this.senderName = message.getSenderName();
        this.senderEmail = message.getSenderEmail();
        this.senderPhone = message.getSenderPhone();
        this.subject = message.getSubject();
        this.messageBody = message.getMessageBody();
        this.status = message.getStatus();
        this.createdAt = message.getCreatedAt();

        // Xử lý 'user' (có thể null nếu là khách)
        if (message.getUser() != null) {
            this.userName = message.getUser().getFullName(); // Lấy tên
            this.userId = message.getUser().getUserId(); // Lấy ID
        } else {
            this.userName = null; // Hoặc "Khách"
            this.userId = null;
        }
    }
}
