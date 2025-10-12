package com.example.backend.Service;

import com.example.backend.Entity.VariationOption;
import com.example.backend.Repos.VariationOptionRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VariationOptionService {

    private final VariationOptionRepo variationOptionRepository;

    public VariationOptionService(VariationOptionRepo variationOptionRepository) {
        this.variationOptionRepository = variationOptionRepository;
    }

    // Lấy tất cả options
    public List<VariationOption> getAllOptions() {
        return variationOptionRepository.findAll();
    }

    // Lấy option theo ID
    public Optional<VariationOption> getOptionById(Integer id) {
        return variationOptionRepository.findById(id);
    }

    // Lấy option theo variation_id
    public List<VariationOption> getOptionsByVariation(Integer variationId) {
        return variationOptionRepository.findByVariation_Id(variationId);
    }

    // Lưu hoặc thêm mới option
    public VariationOption saveOption(VariationOption option) {
        return variationOptionRepository.save(option);
    }

    // 🔧 Cập nhật option theo ID (hàm bạn đang thiếu)
    public Optional<VariationOption> updateOption(Integer id, VariationOption updatedOption) {
        return variationOptionRepository.findById(id).map(existing -> {
            existing.setValue(updatedOption.getValue());
            existing.setVariation(updatedOption.getVariation());
            return variationOptionRepository.save(existing);
        });
    }

    // Xóa option
    public void deleteOption(Integer id) {
        variationOptionRepository.deleteById(id);
    }
}
