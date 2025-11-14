package com.example.backend.Service;

import com.example.backend.DTO.Request.Cart.AddToCart;
import com.example.backend.DTO.Request.Cart.UpdateCart;
import com.example.backend.DTO.Response.Cart.*;
import com.example.backend.Entity.*;
import com.example.backend.Repos.*;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ShoppingCartService {

    @Autowired
    private ShoppingCartRepo cartRepository;
    @Autowired
    private ShoppingCartItemRepo cartItemRepository;
    @Autowired
    private VariationOptionRepo variationOptionRepo;
    @Autowired
    private CustomProductRepo customProductRepo; // ✅ Repo cho custom_product
    @Autowired
    private EntityManager entityManager;
    @Autowired
    private ProductRepo productRepo;

    // ====================== ADD TO CART ======================
    @Transactional
    public CartResponse addToCart(Integer userId, AddToCart request) {
        // Tìm hoặc tạo cart
        ShoppingCart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    ShoppingCart newCart = new ShoppingCart();
                    newCart.setUserId(userId);
                    return cartRepository.save(newCart);
                });

        ShoppingCartItem item = new ShoppingCartItem();
        item.setCart(cart);
        item.setQty(request.getQty());

        // ✅ Nếu là sản phẩm custom
        if (Boolean.TRUE.equals(request.getIsCustomed())) {
            if (request.getCustomProductId() == null) {
                throw new RuntimeException("Custom product ID cannot be null when isCustomed = true");
            }

            CustomProduct cp = customProductRepo.findById(request.getCustomProductId())
                    .orElseThrow(() -> new RuntimeException("Custom product not found with ID = " + request.getCustomProductId()));

            // Gán cả 2 ID
            item.setProductItemId(cp.getProductId());
            item.setCustomProductId(cp.getId());
            item.setIsCustomed(true);
        }
        // ✅ Nếu là sản phẩm thường
        else {
            if (request.getProductItemId() == null) {
                throw new RuntimeException("Product item ID is required for non-custom products");
            }
            item.setProductItemId(request.getProductItemId());
            item.setIsCustomed(false);
        }

        // Lưu item
        item = cartItemRepository.save(item);
        entityManager.flush();

        // ✅ Lưu variation options nếu có
        if (request.getSelectedOptions() != null && !request.getSelectedOptions().isEmpty()) {
            List<VariationOption> options = variationOptionRepo.findAllById(request.getSelectedOptions());
            item.setSelectedOptions(options);
            cartItemRepository.save(item);
        }

        return mapToCartResponse(cartRepository.findById(cart.getId()).get());
    }


    // ====================== GET CART ======================
    public CartResponse getCartByUserId(Integer userId) {
        ShoppingCart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        return mapToCartResponse(cart);
    }

    // ====================== UPDATE ITEM ======================
    public CartResponse updateCartItem(Integer cartItemId, UpdateCart request) {
        ShoppingCartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        item.setQty(request.getQty());
        cartItemRepository.save(item);
        return mapToCartResponse(item.getCart());
    }

    // ====================== REMOVE ITEM ======================
    public void removeCartItem(Integer cartItemId) {
        cartItemRepository.deleteById(cartItemId);
    }

    // ====================== MAP TO RESPONSE ======================
    private CartResponse mapToCartResponse(ShoppingCart cart) {
        CartResponse response = new CartResponse();
        response.setId(cart.getId());
        response.setUserId(cart.getUserId());

        response.setItems(cart.getItems().stream()
                .map(item -> {
                    ShoppingCartItemDTO dto = new ShoppingCartItemDTO();
                    dto.setId(item.getId());
                    dto.setCartId(cart.getId());
                    dto.setProductItemId(item.getProductItemId());
                    dto.setQty(item.getQty());
                    dto.setProductName(productRepo.findNameById((item.getProductItemId())));
                    // 🔍 Tìm xem có custom product tương ứng hay không
                    Optional<CustomProduct> customOpt = customProductRepo
                            .findByUserIdAndProductId(cart.getUserId(), item.getProductItemId());

                    if (customOpt.isPresent()) {
                        CustomProduct cp = customOpt.get();
                        dto.setIs_customed(true);
                        dto.setCustom_id(cp.getId());
                        dto.setProductImage(cp.getCustomImageUrl());
                    } else {
                        dto.setIs_customed(false);
                        dto.setProductImage(cartItemRepository.findProductImageByCartItemId(item.getId()));
                    }

                    // ✅ Lấy giá
                    dto.setPrice(cartItemRepository.findPriceByCartItemId(item.getId()));

                    // ✅ Mapping variation options nếu có
                    if (item.getSelectedOptions() != null) {
                        dto.setSelectedOptions(item.getSelectedOptions().stream()
                                .map(opt -> {
                                    VariationOptionDTO vo = new VariationOptionDTO();
                                    vo.setId(opt.getId());
                                    vo.setVariationId(opt.getVariation().getId());
                                    vo.setValue(opt.getValue());
                                    return vo;
                                })
                                .toList());
                    }

                    return dto;
                })
                .toList());

        return response;
    }
}
