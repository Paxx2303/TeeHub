//package com.example.backend.Service;
//
//import com.example.backend.DTO.UserReviewDTO;
//import com.example.backend.Entity.ProductItem;
//import com.example.backend.Entity.SiteUser;
//import com.example.backend.Entity.UserReview;
//import com.example.backend.Exception.InvalidDataException;
//import com.example.backend.Exception.ResourceNotFoundException;
//import com.example.backend.Repos.ProductItemRepo;
//import com.example.backend.Repos.SiteUserRepo;
//import com.example.backend.Repos.UserReviewRepo;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//import java.util.Optional;
//import java.util.stream.Collectors;
//
//@Service
//public class UserReviewService {
//
//    private final UserReviewRepo userReviewRepository;
//    private final SiteUserRepo siteUserRepository;
//    private final ProductItemRepo productItemRepository;
//
//    public UserReviewService(UserReviewRepo userReviewRepository,
//                             SiteUserRepo siteUserRepository,
//                             ProductItemRepo productItemRepository) {
//        this.userReviewRepository = userReviewRepository;
//        this.siteUserRepository = siteUserRepository;
//        this.productItemRepository = productItemRepository;
//    }
//
//    // 🟢 Lấy tất cả review
//    public List<UserReviewDTO> getAllReviews() {
//        return userReviewRepository.findAll()
//                .stream()
//                .map(UserReviewDTO::new)
//                .collect(Collectors.toList());
//    }
//
//    // 🟢 Lấy review theo ID
//    public UserReviewDTO getReviewById(Integer id) {
//        UserReview review = userReviewRepository.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + id));
//        return new UserReviewDTO(review);
//    }
//
//    // 🟢 Lấy review theo user_id
//    public List<UserReviewDTO> getReviewsByUser(Integer userId) {
//        if (!siteUserRepository.existsById(userId)) {
//            throw new ResourceNotFoundException("User not found with id: " + userId);
//        }
//
//        return userReviewRepository.findByUser_Id(userId)
//                .stream()
//                .map(UserReviewDTO::new)
//                .collect(Collectors.toList());
//    }
//
//    // 🟢 Lấy review theo product_id
//    public List<UserReviewDTO> getReviewsByProduct(Integer productId) {
//        if (!productItemRepository.existsById(productId)) {
//            throw new ResourceNotFoundException("Product not found with id: " + productId);
//        }
//
//        return userReviewRepository.findByOrderedProduct_Id(productId)
//                .stream()
//                .map(UserReviewDTO::new)
//                .collect(Collectors.toList());
//    }
//
//    // 🟢 Tạo mới review
//    public UserReviewDTO saveReview(UserReviewDTO dto) {
//        if (dto.getRatingValue() == null || dto.getRatingValue() < 1 || dto.getRatingValue() > 5) {
//            throw new InvalidDataException("Rating value must be between 1 and 5");
//        }
//
//        SiteUser user = siteUserRepository.findById(dto.getUserId())
//                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + dto.getUserId()));
//
//        ProductItem product = productItemRepository.findById(dto.getProductId())
//                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + dto.getProductId()));
//
//        UserReview review = new UserReview();
//        review.setUser(user);
//        review.setOrderedProduct(product);
//        review.setRatingValue(dto.getRatingValue());
//        review.setComment(dto.getComment());
//
//        return new UserReviewDTO(userReviewRepository.save(review));
//    }
//
//    // 🟢 Cập nhật review
//    public UserReviewDTO updateReview(Integer id, UserReviewDTO dto) {
//        UserReview existing = userReviewRepository.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + id));
//
//        if (dto.getRatingValue() != null && (dto.getRatingValue() < 1 || dto.getRatingValue() > 5)) {
//            throw new InvalidDataException("Rating value must be between 1 and 5");
//        }
//
//        existing.setRatingValue(dto.getRatingValue());
//        existing.setComment(dto.getComment());
//
//        return new UserReviewDTO(userReviewRepository.save(existing));
//    }
//
//    // 🟢 Xóa review
//    public void deleteReview(Integer id) {
//        if (!userReviewRepository.existsById(id)) {
//            throw new ResourceNotFoundException("Review not found with id: " + id);
//        }
//        userReviewRepository.deleteById(id);
//    }
//}
