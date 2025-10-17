package com.example.backend.Service;

import com.example.backend.DTO.Response.Cart.VariationOptionDTO;
import com.example.backend.Repos.VariationOptionRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VariationOptionService {

    private final VariationOptionRepo variationOptionRepo;

    public List<VariationOptionDTO> getAll() {
        var list = variationOptionRepo.findAllAsDto();
        if (list.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không có variation option nào.");
        }
        return list;
    }

    public List<VariationOptionDTO> getByVariationId(Integer variationId) {
        var list = variationOptionRepo.findByVariationIdAsDto(variationId);
        if (list.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Variation " + variationId + " chưa có option."
            );
        }
        return list;
    }

    public List<VariationOptionDTO> getByCategoryId(Integer categoryId) {
        var list = variationOptionRepo.findByCategoryIdAsDto(categoryId);
        if (list.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Category " + categoryId + " chưa có option."
            );
        }
        return list;
    }

    public List<VariationOptionDTO> searchByValue(String keyword) {
        var key = keyword == null ? "" : keyword.trim();
        var list = variationOptionRepo.searchByValueAsDto(key);
        if (list.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Không tìm thấy option với từ khóa: " + key
            );
        }
        return list;
    }
}
