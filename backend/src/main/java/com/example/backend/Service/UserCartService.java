package com.example.backend.Service;

import com.example.backend.DTO.Response.Cart.CartItemDTO;
import com.example.backend.DTO.Response.Cart.UserCartDTO;
import com.example.backend.DTO.Response.Cart.VariationDTO;
import com.example.backend.Entity.ShoppingCart;
import com.example.backend.Repos.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserCartService {

    @Autowired
    private UserCartRepo userCartRepo;
    @Autowired
    private UserCartRepo cartRepository;


    @Autowired
    private ShoppingCartRepo shoppingCartRepo;



    public UserCartDTO getUserCart(Integer userId) {
        Integer cartId = shoppingCartRepo.findByUserId((userId));
        if (cartId == null) return null;

        List<Object[]> rawData = userCartRepo.getCartItemsByCartId(cartId);
        Map<Integer, CartItemDTO> itemMap = new LinkedHashMap<>();

        for (Object[] row : rawData) {
            Integer productId = (Integer) row[0];
            String productName = (String) row[1];
            Double price = (Double) row[2];
            Integer quantity = (Integer) row[3];
            String variationName = (String) row[4];
            String variationValue = (String) row[5];

            CartItemDTO item = itemMap.get(productId);
            if (item == null) {
                item = new CartItemDTO(productId, productName, price, quantity, new ArrayList<>());
                itemMap.put(productId, item);
            }

            if (variationName != null && variationValue != null) {
                item.getVariations().add(new VariationDTO(variationName, variationValue));
            }
        }

        return new UserCartDTO(userId, cartId, new ArrayList<>(itemMap.values()));
    }
}

