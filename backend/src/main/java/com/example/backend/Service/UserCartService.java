package com.example.backend.Service;

import com.example.backend.DTO.Response.Cart.CartItemDTO;
import com.example.backend.DTO.Response.Cart.UserCartDTO;
import com.example.backend.DTO.Response.Cart.VariationDTO;
import com.example.backend.Entity.ShoppingCart;
import com.example.backend.Repos.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
public class UserCartService {

    private final UserCartRepo userCartRepo;
    private final ShoppingCartRepo shoppingCartRepo;

    public UserCartService(UserCartRepo userCartRepo, ShoppingCartRepo shoppingCartRepo) {
        this.userCartRepo = userCartRepo;
        this.shoppingCartRepo = shoppingCartRepo;
    }

    private static Integer asInteger(Object o) {
        if (o == null) return null;
        if (o instanceof Integer i) return i;
        if (o instanceof Long l) return Math.toIntExact(l);
        if (o instanceof Short s) return (int) s;
        if (o instanceof BigDecimal bd) return bd.intValue();
        if (o instanceof Number n) return n.intValue();
        return Integer.valueOf(o.toString());
    }

    private static String asString(Object o) {
        return o == null ? null : String.valueOf(o);
    }

    private static BigDecimal asBigDecimal(Object o) {
        if (o == null) return null;
        if (o instanceof BigDecimal bd) return bd;
        if (o instanceof Integer i) return BigDecimal.valueOf(i);
        if (o instanceof Long l) return BigDecimal.valueOf(l);
        if (o instanceof Double d) return BigDecimal.valueOf(d);
        if (o instanceof Number n) return BigDecimal.valueOf(n.doubleValue());
        try {
            return new BigDecimal(o.toString());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    public UserCartDTO getUserCart(Integer userId) {
        Optional<ShoppingCart> cartOpt = shoppingCartRepo.findByUserId(userId);
        if (cartOpt.isEmpty()) return null;
        Integer cartId = cartOpt.get().getId();

        List<Object[]> rawData = userCartRepo.getCartItemsByCartId(cartId);
        Map<Integer, CartItemDTO> itemMap = new LinkedHashMap<>();

        for (Object[] row : rawData) {
            Integer productId = asInteger(row[0]);
            String productName = asString(row[1]);
            BigDecimal priceBd = asBigDecimal(row[2]);
            Integer quantity = asInteger(row[3]);
            String variationName = asString(row[4]);
            String variationValue = asString(row[5]);

            CartItemDTO item = itemMap.get(productId);
            if (item == null) {
                double priceDouble = priceBd != null ? priceBd.doubleValue() : 0.0d;
                item = new CartItemDTO(productId, productName, priceDouble, quantity != null ? quantity : 0, new ArrayList<>());
                itemMap.put(productId, item);
            } else {
                int currentQty = item.getQuantity() != null ? item.getQuantity() : 0;
                int add = quantity != null ? quantity : 0;
                item.setQuantity(currentQty + add);
            }

            if (variationName != null && variationValue != null) {
                VariationDTO v = new VariationDTO();
                v.setName(variationName + ": " + variationValue);
                item.getVariations().add(v);
            }
        }

        return new UserCartDTO(userId, cartId, new ArrayList<>(itemMap.values()));
    }
}

