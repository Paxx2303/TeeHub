// src/services/cart_service.js
import api from "./httpClient.js";
import { getUserId } from "../utils/auth.js";

/**
 * CartService — xử lý mọi thao tác giỏ hàng (frontend ↔ backend)
 */
const CartService = {
    // 🔹 Lấy giỏ hàng hiện tại của user
    async getCart() {
        const userId = getUserId();
        if (!userId) throw new Error("User chưa đăng nhập!");
        const res = await api.get(`/api/cart/users/${userId}`);
        return res.data;
    },

    // 🔹 Thêm sản phẩm vào giỏ hàng
    async addToCart({
        productItemId,
        price,
        qty = 1,
        isCustomed = false,
        productImage = null,
        selectedOptions = [],
        customProductId = null
    }) {
        const userId = getUserId();
        if (!userId) throw new Error("User chưa đăng nhập!");

        // payload phải khớp với AddToCart.java (có @JsonProperty)
        const payload = {
            productItemId: productItemId,
            qty,
            price: Number(price),
            is_customed: isCustomed,
            productImage,
            selectedOptions,
            custom_product_id: customProductId
        };

        console.log("📦 Payload gửi lên:", payload);

        const res = await api.post(`/api/cart/users/${userId}/add`, payload);
        return res.data;
    },

    // 🔹 Cập nhật số lượng của 1 item trong giỏ
    async updateCartItem(cartItemId, qty) {
        const payload = { qty };
        const res = await api.put(`/api/cart/item/${cartItemId}`, payload);
        return res.data;
    },

    // 🔹 Xóa 1 item khỏi giỏ
    async removeCartItem(cartItemId) {
        const res = await api.delete(`/api/cart/item/${cartItemId}`);
        return res.data;
    },
};

export default CartService;
