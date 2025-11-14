package com.example.backend.Service;

import com.example.backend.DTO.Request.CreateCustomProductRequest;
import com.example.backend.DTO.Response.CustomProductResponse;
import com.example.backend.Entity.CustomProduct;
import com.example.backend.Repos.CustomProductRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.*;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CustomProductService {

    private final CustomProductRepo repo;

    @Value("${app.custom.dir}")
    private String customDir;

    @Value("${app.external.base-url}")
    private String externalBaseUrl;

    private String saveFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) return null;
        Path dir = Paths.get(customDir).toAbsolutePath().normalize();
        Files.createDirectories(dir);
        String ori = Optional.ofNullable(file.getOriginalFilename()).orElse("img.png");
        String ext = ori.contains(".") ? ori.substring(ori.lastIndexOf('.')) : "";
        String safe = UUID.randomUUID().toString().replace("-", "") + ext.toLowerCase();
        Path target = dir.resolve(safe);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        return safe; // trả tên file
    }

    /**
     * Tạo CustomProduct và (nếu có) lưu 1 ảnh.
     * Sử dụng getters: req.getName(), req.getDescription(), req.getPrice()
     */
    public CustomProductResponse createWithImage(CreateCustomProductRequest req, MultipartFile image, Integer currentUserId) {
        try {
            CustomProduct e = new CustomProduct();

            // Map DTO -> Entity (theo entity hiện có)
            // DTO has getName(); entity has setCustomName(...)
            if (req != null && req.getName() != null) {
                e.setCustomName(req.getName());
            }

            // If DTO contains a product reference, you could set it; otherwise leave null
            // e.setProductId(req.getProductId()); // uncomment if DTO has productId

            // set current user if provided
            e.setUserId(currentUserId);

            // Lưu file nếu truyền
            if (image != null && !image.isEmpty()) {
                String fileName = saveFile(image);
                String publicUrl = externalBaseUrl.endsWith("/") ?
                        externalBaseUrl + "CustomProduct/" + fileName :
                        externalBaseUrl + "/CustomProduct/" + fileName;
                e.setCustomImageUrl(publicUrl); // lưu full public URL (bạn có thể lưu fileName thay vào)
            }

            CustomProduct saved = repo.save(e);

            // Build response
            CustomProductResponse resp = CustomProductResponse.builder()
                    .id(saved.getId())
                    .customName(saved.getCustomName())
                    .productId(saved.getProductId())
                    .customImageUrl(saved.getCustomImageUrl())
                    .userId(saved.getUserId())
                    // nếu bạn muốn trả description/price mà chưa lưu, có thể lấy từ req
                    .description(req == null ? null : req.getDescription())
                    .price(req == null || req.getPrice() == null ? null : req.getPrice().toString())
                    .build();

            return resp;
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi lưu file", ex);
        }
    }
}
