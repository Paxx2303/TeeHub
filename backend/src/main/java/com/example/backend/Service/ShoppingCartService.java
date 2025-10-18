package com.example.backend.Service;

import com.example.backend.Entity.ShoppingCart;
import com.example.backend.Repos.ShoppingCartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ShoppingCartService {

//    @Autowired
//    private ShoppingCartRepository shoppingCartRepository;
//
//    public List<ShoppingCart> getAllCarts() {
//        return shoppingCartRepository.findAll();
//    }
//
//    public Optional<ShoppingCart> getCartById(Integer id) {
//        return shoppingCartRepository.findById(id);
//    }
//
////    public Optional<ShoppingCart> getCartByUserId(Integer userId) {
////        return shoppingCartRepository.findByUser_Id(userId);
////    }
////
////    public List<ShoppingCart> getAllCartsByUserId(Integer userId) {
////        return shoppingCartRepository.findAllByUser_Id(userId);
////    }
//
//    public ShoppingCart createCart(ShoppingCart cart) {
//        return shoppingCartRepository.save(cart);
//    }
//
//    public ShoppingCart updateCart(Integer id, ShoppingCart updatedCart) {
//        return shoppingCartRepository.findById(id)
//                .map(cart -> {
//                    cart.setUser(updatedCart.getUser());
//                    return shoppingCartRepository.save(cart);
//                })
//                .orElseThrow(() -> new RuntimeException("Không tìm thấy giỏ hàng với id = " + id));
//    }
//
//    public void deleteCart(Integer id) {
//        shoppingCartRepository.deleteById(id);
//    }
}
