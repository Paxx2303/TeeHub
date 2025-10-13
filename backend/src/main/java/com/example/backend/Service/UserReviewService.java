//package com.example.backend.Service;
//
//import com.example.backend.DTO.UserReviewDTO;
//import com.example.backend.Entity.ProductItem;
//import com.example.backend.Entity.SiteUser;
//import com.example.backend.Entity.UserReview;
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
//    // Lấy tất cả review
//    public List<UserReviewDTO> getAllReviews() {
//        return userReviewRepository.findAll()
//                .stream()
//                .map(UserReviewDTO::new)
//                .collect(Collectors.toList());
//    }
//
//    // Lấy review theo ID
//    public Optional<UserReviewDTO> getReviewById(Integer id) {
//        return userReviewRepository.findById(id).map(UserReviewDTO::new);
//    }
//
//    // Lấy review theo user_id
//    public List<UserReviewDTO> getReviewsByUser(Integer userId) {
//        return userReviewRepository.findByUser_Id(userId)
//                .stream()
//                .map(UserReviewDTO::new)
//                .collect(Collectors.toList());
//    }
//
//    // Lấy review theo product_id
//    public List<UserReviewDTO> getReviewsByProduct(Integer productId) {
//        return userReviewRepository.findByOrderedProduct_Id(productId)
//                .stream()
//                .map(UserReviewDTO::new)
//                .collect(Collectors.toList());
//    }
//
//    // Tạo mới review
//    public UserReviewDTO saveReview(UserReviewDTO dto) {
//        SiteUser user = siteUserRepository.findById(dto.getUserId())
//                .orElseThrow(() -> new RuntimeException("User not found"));
//        ProductItem product = productItemRepository.findById(dto.getProductId())
//                .orElseThrow(() -> new RuntimeException("Product not found"));
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
//    // Cập nhật review
//    public Optional<UserReviewDTO> updateReview(Integer id, UserReviewDTO dto) {
//        return userReviewRepository.findById(id).map(existing -> {
//            existing.setRatingValue(dto.getRatingValue());
//            existing.setComment(dto.getComment());
//            return new UserReviewDTO(userReviewRepository.save(existing));
//        });
//    }
//
//    // Xóa review
//    public void deleteReview(Integer id) {
//        userReviewRepository.deleteById(id);
//    }
//}
