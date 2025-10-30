// backend/src/main/java/com/example/backend/DTO/Response/PromotionResponse.java
package com.example.backend.DTO.Response;

import java.math.BigDecimal;
import java.time.LocalDate;

public class PromotionResponse {

    private Integer id;

    private Integer categoryId;
    private String categoryName;

    private String name;
    private String description;
    private BigDecimal discountRate;
    private LocalDate startDate;
    private LocalDate endDate;

    private Boolean active; // tiện cho FE

    public PromotionResponse(
            Integer id,
            Integer categoryId,
            String categoryName,
            String name,
            String description,
            BigDecimal discountRate,
            LocalDate startDate,
            LocalDate endDate,
            Boolean active
    ) {
        this.id = id;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.name = name;
        this.description = description;
        this.discountRate = discountRate;
        this.startDate = startDate;
        this.endDate = endDate;
        this.active = active;
    }

    // getters
    public Integer getId() { return id; }
    public Integer getCategoryId() { return categoryId; }
    public String getCategoryName() { return categoryName; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public BigDecimal getDiscountRate() { return discountRate; }
    public LocalDate getStartDate() { return startDate; }
    public LocalDate getEndDate() { return endDate; }
    public Boolean getActive() { return active; }
}
