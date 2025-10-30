package com.example.backend.Repos;

import com.example.backend.Entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface ProductRepo extends JpaRepository<Product, Integer> {
    @Query(value = """
        SELECT json_build_object(
            'productId', p.product_id,
            'productName', p.name,
            'productDescription', p.description,
            'productMainImage', p.product_image,
            'category', json_build_object(
                'categoryId', pc.category_id,
                'categoryName', pc.category_name,
                'parentCategoryId', pc.parent_category_id
            ),
            'items', json_agg(DISTINCT jsonb_build_object(
                'productItemId', pi.product_item_id,
                'sku', pi.sku,
                'qtyInStock', pi.qty_in_stock,
                'itemImage', pi.product_image,
                'price', pi.price,
                'configurations', (
                    SELECT json_agg(jsonb_build_object(
                        'variationOptionId', pconf.variation_option_id,
                        'variationName', v.name,
                        'value', vo.value
                    ))
                    FROM product_configuration pconf
                    JOIN variation_option vo ON pconf.variation_option_id = vo.variation_option_id
                    JOIN variation v ON vo.variation_id = v.variation_id
                    WHERE pconf.product_item_id = pi.product_item_id
                )
            ))
        )::text as json_data
        FROM product p
        JOIN product_category pc ON p.category_id = pc.category_id
        JOIN product_item pi ON p.product_id = pi.product_id
        WHERE p.product_id = :productId
        GROUP BY p.product_id, p.name, p.description, p.product_image,
                 pc.category_id, pc.category_name, pc.parent_category_id
        """, nativeQuery = true)
    String getProductDetailAsJson(@Param("productId") Integer productId);

    @Query(value = """
        SELECT COALESCE(jsonb_agg(
            jsonb_build_object(
                'productId', p.product_id,
                'productName', p.name,
                'productDescription', p.description,
                'productMainImage', p.product_image,
                'category', jsonb_build_object(
                    'categoryId', pc.category_id,
                    'categoryName', pc.category_name,
                    'parentCategoryId', pc.parent_category_id
                ),
                'items', COALESCE((
                    SELECT jsonb_agg(jsonb_build_object(
                        'productItemId', pi.product_item_id,
                        'sku', pi.sku,
                        'qtyInStock', pi.qty_in_stock,
                        'itemImage', pi.product_image,
                        'price', pi.price,
                        'configurations', COALESCE((
                            SELECT jsonb_agg(jsonb_build_object(
                                'variationOptionId', pconf.variation_option_id,
                                'variationName', v.name,
                                'value', vo.value
                            ))
                            FROM ecommerce.product_configuration pconf
                            JOIN ecommerce.variation_option vo ON pconf.variation_option_id = vo.variation_option_id
                            JOIN ecommerce.variation v ON vo.variation_id = v.variation_id
                            WHERE pconf.product_item_id = pi.product_item_id
                        ), '[]'::jsonb)
                    ))
                    FROM ecommerce.product_item pi
                    WHERE pi.product_id = p.product_id
                ), '[]'::jsonb)
            )
        ), '[]'::jsonb)::text as json_data
        FROM (
            -- Subquery để phân trang và LỌC trước
            SELECT * FROM ecommerce.product p_sub
            -- ?3 tương ứng với tham số thứ 3 (categoryId)
            WHERE (?3 IS NULL OR p_sub.category_id = ?3)
            AND (?4 IS NULL OR LOWER(p_sub.name) LIKE LOWER(CONCAT('%', ?4, '%'))) -- <-- THÊM ĐIỀU KIỆN TÌM KIẾM
            ORDER BY p_sub.product_id DESC
            -- ?1 tương ứng với tham số thứ 1 (limit)
            LIMIT ?1
            -- ?2 tương ứng với tham số thứ 2 (offset)
            OFFSET ?2
        ) p
        LEFT JOIN ecommerce.product_category pc ON p.category_id = pc.category_id
        """, nativeQuery = true)
        // Thứ tự tham số PHẢI KHỚP với ?1, ?2, ?3
        // Không cần @Param cho positional parameters
    String getAllProductsAsJsonPaged(int limit, int offset, Integer categoryId, String searchTerm);

    //phân trang
    @Query(value = """
            SELECT count(*)
            FROM ecommerce.product p
            WHERE (:categoryId IS NULL OR p.category_id = :categoryId)
            AND (:searchTerm IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) -- <-- THÊM ĐIỀU KIỆN TÌM KIẾM
            """, nativeQuery = true)
    long countAllProducts(
            @Param("categoryId") Integer categoryId,
            @Param("searchTerm") String searchTerm // <-- THÊM THAM SỐ
    ); // <-- THÊM THAM SỐ categoryId

    long countByCategoryId(Integer categoryId);
}