    package com.example.backend.DTO.Response.Order;

    import com.example.backend.DTO.Response.Cart.VariationOptionDTO;
    import lombok.Getter;
    import lombok.Setter;

    import java.util.List;

    @Getter
    @Setter
    public class OrderItemDTO {
        private Integer id;
        private Integer cartId;
        private Integer productItemId;
        private Integer qty;
        private Integer price;
        private String productImage;
        private Boolean is_customed;
        private Integer custom_id;
        private List<VariationOptionDTO> selectedOptions;
    }
