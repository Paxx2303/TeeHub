//package com.example.backend.Service;
//
////import com.example.backend.DTO.UserReviewDTO;
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
//
//
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
