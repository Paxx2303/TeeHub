package com.example.backend.Repos;

import com.example.backend.Entity.CustomProduct;
import com.example.backend.Entity.ShoppingCartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShoppingCartItemRepo extends JpaRepository<ShoppingCartItem, Integer> {

    // 🔸 Lấy giá sản phẩm (từ product_item)
    @Query("""
        SELECT pi.price
        FROM ProductItem pi
        JOIN ShoppingCartItem sci ON sci.productItemId = pi.id
        WHERE sci.id = :cartItemId
    """)
    Integer findPriceByCartItemId(Integer cartItemId);


    // 🔸 Lấy ảnh mặc định (product_image trong product_item)
    @Query("""
        SELECT pi.productImage
        FROM ProductItem pi
        JOIN ShoppingCartItem sci ON sci.productItemId = pi.id
        WHERE sci.id = :cartItemId
    """)
    String findProductImageByCartItemId(Integer cartItemId);






    List<ShoppingCartItem> findByCartId(Integer id);

    // Ownership validation: ensure a cart item belongs to a user's cart
    boolean existsByIdAndCart_UserId(Integer id, Integer userId);
}
