package com.example.backend.Service;

import com.example.backend.DTO.VariationOptionDTO;
import com.example.backend.Entity.Variation;
import com.example.backend.Entity.VariationOption;
import com.example.backend.Repos.VariationOptionRepo;
import com.example.backend.Repos.VariationRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class VariationOptionService {

    private final VariationOptionRepo variationOptionRepository;
    private final VariationRepo variationRepository;

    public VariationOptionService(VariationOptionRepo variationOptionRepository,
                                  VariationRepo variationRepository) {
        this.variationOptionRepository = variationOptionRepository;
        this.variationRepository = variationRepository;
    }

    // Lấy tất cả options
    public List<VariationOptionDTO> getAllOptions() {
        return variationOptionRepository.findAll()
                .stream()
                .map(VariationOptionDTO::new)
                .collect(Collectors.toList());
    }

    // Lấy option theo ID
    public Optional<VariationOptionDTO> getOptionById(Integer id) {
        return variationOptionRepository.findById(id).map(VariationOptionDTO::new);
    }

    // Lấy option theo variation_id
    public List<VariationOptionDTO> getOptionsByVariation(Integer variationId) {
        return variationOptionRepository.findByVariation_Id(variationId)
                .stream()
                .map(VariationOptionDTO::new)
                .collect(Collectors.toList());
    }

    // Thêm option mới
    public VariationOptionDTO saveOption(VariationOptionDTO dto) {
        Variation variation = variationRepository.findById(dto.getVariationId())
                .orElseThrow(() -> new RuntimeException("Variation not found"));

        VariationOption option = new VariationOption();
        option.setValue(dto.getValue());
        option.setVariation(variation);

        return new VariationOptionDTO(variationOptionRepository.save(option));
    }

    // Cập nhật option theo ID
    public Optional<VariationOptionDTO> updateOption(Integer id, VariationOptionDTO dto) {
        return variationOptionRepository.findById(id).map(existing -> {
            existing.setValue(dto.getValue());

            if (dto.getVariationId() != null) {
                Variation variation = variationRepository.findById(dto.getVariationId())
                        .orElseThrow(() -> new RuntimeException("Variation not found"));
                existing.setVariation(variation);
            }

            return new VariationOptionDTO(variationOptionRepository.save(existing));
        });
    }

    // Xóa option
    public void deleteOption(Integer id) {
        variationOptionRepository.deleteById(id);
    }
}
