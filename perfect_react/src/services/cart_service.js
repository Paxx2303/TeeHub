// src/services/cart_service.js
import api from "./httpClient.js";
import { getUserId } from "../utils/auth.js";

/**
 * CartService (default export) — đảm bảo các function tồn tại
 */
const CartService = {
    // Lấy giỏ hàng của user hiện tại
    async getCart() {
        const userId = getUserId();
        if (!userId) throw new Error("User chưa đăng nhập!");
        const res = await api.get(`/api/cart/users/${userId}`);
        return res.data;
    },

    // Thêm sản phẩm vào giỏ
    async addToCart(productItemId, quantity = 1) {
        const userId = getUserId();
        if (!userId) throw new Error("User chưa đăng nhập!");
        const payload = { userId, productItemId, quantity };
        const res = await api.post("/api/cart/add", payload);
        return res.data;
    },

    // Cập nhật một item (theo backend của bạn có thể khác)
    async updateCart(cartItemId, quantity) {
        const userId = getUserId();
        if (!userId) throw new Error("User chưa đăng nhập!");
        const payload = { userId, cartItemId, quantity };
        const res = await api.put("/api/cart/update", payload);
        return res.data;
    },

    // Xóa 1 item khỏi giỏ
    async removeFromCart(cartItemId) {
        const userId = getUserId();
        if (!userId) throw new Error("User chưa đăng nhập!");
        const res = await api.delete(`/api/cart/remove/${cartItemId}?userId=${userId}`);
        return res.data;
    },

    // Xóa toàn bộ giỏ
    async clearCart() {
        const userId = getUserId();
        if (!userId) throw new Error("User chưa đăng nhập!");
        const res = await api.delete(`/api/cart/clear/${userId}`);
        return res.data;
    },
};

export default CartService;
