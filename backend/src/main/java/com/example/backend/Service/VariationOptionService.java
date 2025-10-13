package com.example.backend.Service;

import com.example.backend.DTO.VariationOptionDTO;
import com.example.backend.Entity.Variation;
import com.example.backend.Entity.VariationOption;
import com.example.backend.Exception.InvalidDataException;
import com.example.backend.Exception.ResourceNotFoundException;
import com.example.backend.Repos.VariationOptionRepo;
import com.example.backend.Repos.VariationRepo;
import org.springframework.stereotype.Service;

import java.util.List;
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

    // 🟢 Lấy tất cả options
    public List<VariationOptionDTO> getAllOptions() {
        return variationOptionRepository.findAll()
                .stream()
                .map(VariationOptionDTO::new)
                .collect(Collectors.toList());
    }

    // 🟢 Lấy option theo ID
    public VariationOptionDTO getOptionById(Integer id) {
        VariationOption option = variationOptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Variation option not found with id: " + id));
        return new VariationOptionDTO(option);
    }

    // 🟢 Lấy option theo variation_id
    public List<VariationOptionDTO> getOptionsByVariation(Integer variationId) {
        if (!variationRepository.existsById(variationId)) {
            throw new ResourceNotFoundException("Variation not found with id: " + variationId);
        }

        return variationOptionRepository.findByVariation_Id(variationId)
                .stream()
                .map(VariationOptionDTO::new)
                .collect(Collectors.toList());
    }

    // 🟢 Thêm option mới
    public VariationOptionDTO saveOption(VariationOptionDTO dto) {
        if (dto.getValue() == null || dto.getValue().isBlank()) {
            throw new InvalidDataException("Option value cannot be empty");
        }

        Variation variation = variationRepository.findById(dto.getVariationId())
                .orElseThrow(() -> new ResourceNotFoundException("Variation not found with id: " + dto.getVariationId()));

        // Kiểm tra trùng lặp value trong cùng variation
        boolean exists = variationOptionRepository.existsByValueIgnoreCaseAndVariation_Id(dto.getValue(), dto.getVariationId());
        if (exists) {
            throw new InvalidDataException("Option value already exists in this variation");
        }

        VariationOption option = new VariationOption();
        option.setValue(dto.getValue());
        option.setVariation(variation);

        return new VariationOptionDTO(variationOptionRepository.save(option));
    }

    // 🟢 Cập nhật option theo ID
    public VariationOptionDTO updateOption(Integer id, VariationOptionDTO dto) {
        VariationOption existing = variationOptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Variation option not found with id: " + id));

        if (dto.getValue() != null && dto.getValue().isBlank()) {
            throw new InvalidDataException("Option value cannot be blank");
        }

        if (dto.getVariationId() != null) {
            Variation variation = variationRepository.findById(dto.getVariationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Variation not found with id: " + dto.getVariationId()));
            existing.setVariation(variation);
        }

        if (dto.getValue() != null) {
            // Kiểm tra trùng lặp nếu thay đổi value
            boolean exists = variationOptionRepository.existsByValueIgnoreCaseAndVariation_Id(dto.getValue(),
                    existing.getVariation().getId());
            if (exists && !dto.getValue().equalsIgnoreCase(existing.getValue())) {
                throw new InvalidDataException("Option value already exists in this variation");
            }
            existing.setValue(dto.getValue());
        }

        return new VariationOptionDTO(variationOptionRepository.save(existing));
    }

    // 🟢 Xóa option
    public void deleteOption(Integer id) {
        if (!variationOptionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Variation option not found with id: " + id);
        }
        variationOptionRepository.deleteById(id);
    }
}
