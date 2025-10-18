//package com.example.backend.Service;
//
//import com.example.backend.DTO.Response.VariationDTO;
//import com.example.backend.Repos.VariationRepo;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.HttpStatus;
//import org.springframework.stereotype.Service;
//import org.springframework.web.server.ResponseStatusException;
//
//import java.util.List;
//
//@Service
//@RequiredArgsConstructor
//public class VariationService {
//    private final VariationRepo variationRepo;
//
//    public List<VariationDTO> getAll() {
//        var list = variationRepo.findAllAsDto();
//        if (list.isEmpty()) {
//            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không có variation nào.");
//        }
//        return list;
//    }
//
//    public List<VariationDTO> getByCategoryId(Integer categoryId) {
//        var list = variationRepo.findByCategoryIdAsDto(categoryId);
//        if (list.isEmpty()) {
//            throw new ResponseStatusException(
//                    HttpStatus.NOT_FOUND,
//                    "Category " + categoryId + " chưa có variation."
//            );
//        }
//        return list;
//    }
//
//    public List<VariationDTO> searchByName(String keyword) {
//        var key = keyword == null ? "" : keyword.trim();
//        var list = variationRepo.searchByNameAsDto(key);
//        if (list.isEmpty()) {
//            throw new ResponseStatusException(
//                    HttpStatus.NOT_FOUND,
//                    "Không tìm thấy variation với từ khóa: " + key
//            );
//        }
//        return list;
//    }
//}
