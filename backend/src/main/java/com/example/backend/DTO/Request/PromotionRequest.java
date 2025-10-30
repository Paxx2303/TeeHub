// backend/src/main/java/com/example/backend/DTO/Request/PromotionRequest.java
package com.example.backend.DTO.Request;

//import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public class PromotionRequest {

    private Integer categoryId; // có thể null (khuyến mãi toàn shop)

//    @NotBlank(message = "Tên khuyến mãi không được để trống.")
    private String name;

    private String description;
//
//    @NotNull(message = "Tỷ lệ giảm giá không được null.")
//    @DecimalMin(value = "0.00", message = "Tỷ lệ giảm phải >= 0.")
//    @DecimalMax(value = "100.00", message = "Tỷ lệ giảm phải <= 100.")
    private BigDecimal discountRate; // % (0..100)

//    @NotNull(message = "Ngày bắt đầu không được null.")
    private LocalDate startDate;

//    @NotNull(message = "Ngày kết thúc không được null.")
    private LocalDate endDate;

    // getters/setters
    public Integer getCategoryId() { return categoryId; }
    public void setCategoryId(Integer categoryId) { this.categoryId = categoryId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getDiscountRate() { return discountRate; }
    public void setDiscountRate(BigDecimal discountRate) { this.discountRate = discountRate; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
}
