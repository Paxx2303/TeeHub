package com.example.backend.Service;

import com.example.backend.Entity.ShoppingCartItem;
import com.example.backend.Repos.ShoppingCartItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ShoppingCartItemService {

    @Autowired
    private ShoppingCartItemRepository shoppingCartItemRepository;

    // Lấy tất cả item
    public List<ShoppingCartItem> getAllItems() {
        return shoppingCartItemRepository.findAll();
    }

    // Lấy item theo id
    public Optional<ShoppingCartItem> getItemById(Integer id) {
        return shoppingCartItemRepository.findById(id);
    }

    // Lấy danh sách item theo cart_id
    public List<ShoppingCartItem> getItemsByCartId(Integer cartId) {
        return shoppingCartItemRepository.findByCart_Id(cartId);
    }

    // Lấy item cụ thể theo cart_id và product_item_id
    public Optional<ShoppingCartItem> getItemByCartAndProduct(Integer cartId, Integer productItemId) {
        return Optional.ofNullable(shoppingCartItemRepository.findByCart_IdAndProductItem_Id(cartId, productItemId));
    }

    // Thêm mới item
    public ShoppingCartItem addItem(ShoppingCartItem item) {
        return shoppingCartItemRepository.save(item);
    }

    // Cập nhật item (ví dụ: cập nhật số lượng)
    public ShoppingCartItem updateItem(Integer id, ShoppingCartItem updatedItem) {
        return shoppingCartItemRepository.findById(id)
                .map(item -> {
                    item.setCart(updatedItem.getCart());
                    item.setProductItem(updatedItem.getProductItem());
                    item.setQty(updatedItem.getQty());
                    return shoppingCartItemRepository.save(item);
                })
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm trong giỏ với id = " + id));
    }

    // Xóa item
    public void deleteItem(Integer id) {
        shoppingCartItemRepository.deleteById(id);
    }

    // Xóa toàn bộ item theo cart_id (ví dụ khi người dùng xóa giỏ hàng)
    public void deleteItemsByCartId(Integer cartId) {
        List<ShoppingCartItem> items = shoppingCartItemRepository.findByCart_Id(cartId);
        shoppingCartItemRepository.deleteAll(items);
    }
}
