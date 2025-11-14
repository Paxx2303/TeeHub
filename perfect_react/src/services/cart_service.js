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

  // helper: normalize selectedOptions to comparable string
  _normalizeOptions(opts) {
    try {
      // ensure deterministic order for comparison
      if (!opts) return "";
      // if opts is array of {name,value} or {value} etc -> stringify sorted keys
      const normalized = Array.isArray(opts)
        ? opts.map(o => {
            if (o && typeof o === "object") {
              // sort object keys for determinism
              const keys = Object.keys(o).sort();
              const out = {};
              for (const k of keys) out[k] = o[k];
              return out;
            }
            return o;
          })
        : opts;
      return JSON.stringify(normalized);
    } catch (e) {
      return String(opts);
    }
  },

  // 🔹 Thêm sản phẩm vào giỏ hàng
  // Nếu đã có dòng tương tự -> update (tăng qty) thay vì tạo mới
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

    // chuẩn hoá payload gửi lên (giữ tương thích backend hiện tại)
    const payload = {
      productItemId: productItemId,
      qty,
      price: Number(price),
      is_customed: isCustomed,
      productImage,
      selectedOptions,
      custom_product_id: customProductId
    };

    console.log("📦 addToCart called with payload:", payload);

    try {
      // 1) Lấy giỏ hàng hiện tại và tìm xem có item "tương đương" không
      const cart = await this.getCart().catch(err => {
        console.warn("Không thể lấy cart khi addToCart:", err);
        return null;
      });

      if (cart && Array.isArray(cart.items) && cart.items.length > 0) {
        const wantOptStr = this._normalizeOptions(selectedOptions);

        const found = cart.items.find((it) => {
          // nhiều backend trả về tên trường khác nhau -> kiểm tra nhiều key
          const itProductItemId = it?.productItemId ?? it?.product_item_id ?? it?.productItem ?? it?.itemId ?? null;
          const itIsCustomed = (it?.is_customed ?? it?.isCustomed ?? it?.custom ?? false);
          const itOpts = it?.selectedOptions ?? it?.selected_options ?? it?.options ?? [];
          const itOptStr = this._normalizeOptions(itOpts);

          // điều kiện khớp:
          const sameProduct =
            (productItemId != null && String(itProductItemId) === String(productItemId)) ||
            (productItemId == null && (it?.sku ?? it?.SKU ?? it?.productCode ?? it?.product_code) == null ? false : false);

          // match selectedOptions and is_customed exactly
          const sameOptions = itOptStr === wantOptStr;
          const sameCustom = Boolean(itIsCustomed) === Boolean(isCustomed);

          // nếu muốn mở rộng so sánh (ví dụ price), có thể thêm
          return sameProduct && sameOptions && sameCustom;
        });

        if (found) {
          // found existing line -> tăng qty
          // find id trường cart item (tên có thể khác)
          const existingId = found?.id ?? found?.cartItemId ?? found?.cart_item_id ?? found?.originalId ?? null;
          const existingQty = Number(found?.qty ?? found?.quantity ?? found?.qtyTotal ?? 0);

          const newQty = Math.max(1, existingQty + qty);

          console.log(`🔁 Item tồn tại trong cart (id=${existingId}), cập nhật qty ${existingQty} -> ${newQty}`);

          // Gọi API update (sử dụng updateCartItem)
          if (existingId == null) {
            console.warn("Không tìm thấy id của cart item để update; sẽ fallback tạo mới.");
          } else {
            // gọi update API
            // updateCartItem trả về res.data
            const resUpdate = await this.updateCartItem(existingId, newQty).catch(err => {
              console.warn("Update qty thất bại, sẽ fallback tạo mới:", err);
              return null;
            });
            if (resUpdate != null) {
              return resUpdate;
            }
            // nếu update fail -> fallback xuống tạo mới
          }
        }
      }

      // nếu không có dòng tương tự hoặc không update được -> tạo mới
      console.log("➕ Tạo mới cart item (POST):", payload);
      const res = await api.post(`/api/cart/users/${userId}/add`, payload);
      return res.data;
    } catch (err) {
      console.error("Lỗi addToCart:", err);
      throw err;
    }
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
