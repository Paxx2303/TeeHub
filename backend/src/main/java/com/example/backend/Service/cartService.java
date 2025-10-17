package com.example.backend.Service;

import com.example.backend.DTO.Response.Cart.CartDTO;
import com.example.backend.DTO.Response.Cart.CartItemDTO;
import com.example.backend.DTO.Response.VariationDTO;
import com.example.backend.Entity.ProductItem;
import com.example.backend.Entity.ShoppingCart;
import com.example.backend.Entity.SiteUser;
import com.example.backend.Repos.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class cartService {
    @Autowired
    private CartRepo cartRepo;

    @Autowired
    private CartItemRepo cartItemRepo;

    @Autowired
    private ProductItemRepo productItemRepo;

    @Autowired
    private VariationOptionRepo variationOptionRepo;

    // 🔹 Lấy giỏ hàng theo userId
    public CartDTO getCartByUserId(Integer userId) {
        ShoppingCart cart = cartRepo.findByUser_id(userId);

        List<CartItemDTO> items = cart.getCart_id()2.stream().map(item -> {
            ProductItem pItem = item.getProductItem();
            CartItemDTO dto = new CartItemDTO();
            dto.setCartItemId(item.getId());
            dto.setProductId(pItem.getProduct().getId());
            dto.setProductName(pItem.getProduct().getName());
            dto.setProductImage(pItem.getImage());
            dto.setQuantity(item.getQuantity());
            dto.setPrice(pItem.getPrice());
            dto.setSubtotal(pItem.getPrice() * item.getQuantity());

            dto.setVariations(pItem.getProductConfigurations()
                    .stream()
                    .map(pc -> {
                        VariationValueDTO v = new VariationValueDTO();
                        v.setName(pc.getVariationOption().getVariation().getName());
                        v.setValue(pc.getVariationOption().getValue());
                        return v;
                    })
                    .toList()
            );

            return dto;
        }).toList();

        CartDTO cartDTO = new CartDTO();
        cartDTO.setCartId(cart.getId());
        cartDTO.setUserId(cart.getUser().getId());
        cartDTO.setStatus(cart.getStatus());
        cartDTO.setItems(items);
        cartDTO.setTotalPrice(items.stream().mapToDouble(CartItemDTO::getSubtotal).sum());

        return cartDTO;
    }


    // 🔹 Thêm sản phẩm vào giỏ
//    public CartDTO addItemToCart(Integer userId, Integer productItemId, Integer quantity) {
//        Cart cart = cartRepo.findByUserId(userId).orElseGet(() -> {
//            Cart newCart = new Cart();
//            newCart.setUser(new SiteUser(userId));
//            newCart.setStatus("ACTIVE");
//            return cartRepo.save(newCart);
//        });
//
//        ProductItem productItem = productItemRepo.findById(productItemId)
//                .orElseThrow(() -> new RuntimeException("Product item not found"));
//
//        // Kiểm tra xem item này đã có trong giỏ chưa
//        Optional<CartItem> existingItem = cart.getCartItems().stream()
//                .filter(ci -> ci.getProductItem().getId().equals(productItemId))
//                .findFirst();
//
//        if (existingItem.isPresent()) {
//            CartItem item = existingItem.get();
//            item.setQuantity(item.getQuantity() + quantity);
//            cartItemRepo.save(item);
//        } else {
//            CartItem newItem = new CartItem();
//            newItem.setCart(cart);
//            newItem.setProductItem(productItem);
//            newItem.setQuantity(quantity);
//            cartItemRepo.save(newItem);
//        }
//
//        return getCartByUserId(userId);
//    }
//
//    // 🔹 Cập nhật số lượng sản phẩm
//    public CartDTO updateItemQuantity(Integer userId, Integer productItemId, Integer quantity) {
//        Cart cart = cartRepo.findByUserId(userId)
//                .orElseThrow(() -> new RuntimeException("Cart not found"));
//
//        CartItem item = cart.getCartItems().stream()
//                .filter(ci -> ci.getProductItem().getId().equals(productItemId))
//                .findFirst()
//                .orElseThrow(() -> new RuntimeException("Item not found in cart"));
//
//        item.setQuantity(quantity);
//        cartItemRepo.save(item);
//
//        return getCartByUserId(userId);
//    }
//
//    // 🔹 Xóa 1 item khỏi giỏ
//    public CartDTO removeItem(Integer userId, Integer productItemId) {
//        Cart cart = cartRepo.findByUserId(userId)
//                .orElseThrow(() -> new RuntimeException("Cart not found"));
//
//        cart.getCartItems().removeIf(ci -> ci.getProductItem().getId().equals(productItemId));
//        cartRepo.save(cart);
//
//        return getCartByUserId(userId);
//    }
//
//    // 🔹 Xóa toàn bộ giỏ hàng
//    public void clearCart(Integer userId) {
//        Cart cart = cartRepo.findByUserId(userId)
//                .orElseThrow(() -> new RuntimeException("Cart not found"));
//
//        cartItemRepo.deleteAll(cart.getCartItems());
//    }
}

