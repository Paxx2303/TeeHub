package com.example.backend.Service;

import com.example.backend.DTO.Request.ContactRequest;
import com.example.backend.DTO.Response.ContactMessageResponse;
import com.example.backend.Entity.ContactMessage;
import com.example.backend.Entity.SiteUser;
import com.example.backend.Repos.ContactMessageRepository;
import com.example.backend.Repos.SiteUserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContactService {
    @Autowired
    private ContactMessageRepository contactRepo;

    @Autowired
    private SiteUserRepo userRepo;

    public void saveMessage(ContactRequest request, Principal principal) {
        ContactMessage message = new ContactMessage();

        // Gán thông tin từ request DTO
        message.setSenderName(request.getName());
        message.setSenderEmail(request.getEmail());
        message.setSenderPhone(request.getPhone());
        message.setSubject(request.getSubject());
        message.setMessageBody(request.getMessage());

        // (Logic nâng cao): Nếu người dùng đã đăng nhập (principal != null),
        // thì tự động liên kết tin nhắn này với tài khoản của họ.
        if (principal != null) {
            String email = principal.getName();
            SiteUser user = userRepo.findByEmailAddress(email).orElse(null);
            message.setUser(user);
        }

        // (Status và CreatedAt đã được tự động gán)
        contactRepo.save(message);
    }
    public List<ContactMessageResponse> getAllMessages() {
        // Lấy Entity
        List<ContactMessage> messages = contactRepo.findAllByOrderByCreatedAtDesc();

        // Chuyển Entity -> DTO
        return messages.stream()
                .map(ContactMessageResponse::new) // Gọi constructor DTO
                .collect(Collectors.toList());
    }
}
