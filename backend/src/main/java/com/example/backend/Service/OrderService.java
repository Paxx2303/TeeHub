package com.example.backend.Service;

import com.example.backend.DTO.Request.CreateOrderRequest;
import com.example.backend.DTO.Response.Order.OrderResponse;
import com.example.backend.Entity.*;
import com.example.backend.Repos.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepo orderRepo;
    private final OrderLineRepo orderLineRepo;
    private final CustomProductRepo customProductRepo;
    private final ShoppingCartRepo cartRepo;
    private final ShoppingCartItemRepo cartItemRepo;
    private final AddressRepo addressRepo;
    private final ProductItemRepo productItemRepo;

    public OrderService(
            OrderRepo orderRepo,
            OrderLineRepo orderLineRepo,
            CustomProductRepo customProductRepo,
            ShoppingCartRepo cartRepo,
            ShoppingCartItemRepo cartItemRepo,
            AddressRepo addressRepo,
            ProductItemRepo productItemRepo) {
        this.orderRepo = orderRepo;
        this.orderLineRepo = orderLineRepo;
        this.customProductRepo = customProductRepo;
        this.cartRepo = cartRepo;
        this.cartItemRepo = cartItemRepo;
        this.addressRepo = addressRepo;
        this.productItemRepo = productItemRepo;
    }

    // ✅ Lấy danh sách đơn hàng của user
    public List<OrderResponse> getOrdersByUserId(Integer userId) {
        List<ShopOrder> orders = orderRepo.findByUserId(userId);
        return orders.stream().map(this::mapToOrderResponse).toList();
    }

    // ✅ Lấy chi tiết 1 đơn hàng
    public OrderResponse getOrderDetail(Integer orderId) {
        ShopOrder order = orderRepo.findById(orderId)
                .orElseThrow(() -> new com.example.backend.Exception.ResourceNotFoundException("Order not found"));
        return mapToOrderResponse(order);
    }

    // ✅ Tạo order từ một số cart item được chọn
    @Transactional
    public ShopOrder createOrderFromCart(Integer userId, List<Integer> selectedCartItemIds) {
        ShoppingCart cart = cartRepo.findByUserId(userId)
                .orElseThrow(() -> new com.example.backend.Exception.ResourceNotFoundException("Cart not found for userId " + userId));

        // Validate ownership of all selected cart items
        validateCartItemOwnership(userId, selectedCartItemIds);

        ShopOrder order = new ShopOrder();
        order.setUserId(userId);
        order.setOrderDate(Instant.now());
        order.setPaymentStatus("Chưa thanh toán");
        order.setOrderStatus("Đang xử lý");

        List<OrderLine> orderLines = new ArrayList<>();

        for (Integer cartItemId : selectedCartItemIds) {
            ShoppingCartItem item = cartItemRepo.findById(cartItemId)
                    .orElseThrow(() -> new com.example.backend.Exception.ResourceNotFoundException("CartItem not found: " + cartItemId));

            Integer price = cartItemRepo.findPriceByCartItemId(cartItemId);

            OrderLine line = new OrderLine();
            line.setShopOrder(order);
            line.setQty(item.getQty());
            line.setPrice(price);
            line.setProductItemId(item.getProductItemId());

            // Ưu tiên sản phẩm custom của user cho productItemId này (nếu có)
            customProductRepo.findByUserIdAndProductId(cart.getUserId(), item.getProductItemId())
                    .ifPresent(line::setCustomProduct);

            orderLines.add(line);
        }

        order.setItems(orderLines);
        ShopOrder savedOrder = orderRepo.save(order);
        // Ensure order lines are persisted so IDs are available
        orderLineRepo.saveAll(orderLines);
        cartItemRepo.deleteAllById(selectedCartItemIds);

        return savedOrder;
    }

    // PHƯƠNG THỨC MỚI - DÙNG DTO
    @Transactional
    public OrderResponse createOrderFromRequest(CreateOrderRequest request) {
        if (request == null) {
            throw new com.example.backend.Exception.InvalidDataException("Request body cannot be null");
        }
        Integer userId = request.getUserId();
        if (userId == null) {
            throw new com.example.backend.Exception.InvalidDataException("userId is required");
        }
        List<Integer> selectedItemIds = request.getSelectedItemIds();
        if (selectedItemIds == null || selectedItemIds.isEmpty()) {
            throw new com.example.backend.Exception.InvalidDataException("selectedItemIds must not be empty");
        }
        // Remove duplicates while preserving order
        Set<Integer> dedup = new LinkedHashSet<>(selectedItemIds);
        selectedItemIds = new ArrayList<>(dedup);

        ShoppingCart cart = cartRepo.findByUserId(userId)
                .orElseThrow(() -> new com.example.backend.Exception.ResourceNotFoundException("Cart not found for userId " + userId));

        ShopOrder order = new ShopOrder();
        order.setUserId(userId);
        order.setOrderDate(Instant.now());
        order.setPaymentStatus("Chưa thanh toán");
        order.setOrderStatus("Đang xử lý");

        // Validate ownership first, then fetch items
        validateCartItemOwnership(userId, selectedItemIds);
        List<ShoppingCartItem> selectedCartItems = new ArrayList<>();
        for (Integer id : selectedItemIds) {
            ShoppingCartItem ci = cartItemRepo.findById(id)
                    .orElseThrow(() -> new com.example.backend.Exception.ResourceNotFoundException("CartItem not found: " + id));
            selectedCartItems.add(ci);
        }

        List<OrderLine> orderLines = new ArrayList<>();
        selectedCartItems.forEach(item -> {
            Integer price = cartItemRepo.findPriceByCartItemId(item.getId());
            if (price == null) {
                throw new com.example.backend.Exception.InvalidDataException("Price not found for cart item: " + item.getId());
            }

            OrderLine line = new OrderLine();
            line.setShopOrder(order);
            line.setQty(item.getQty());
            line.setPrice(price);
            line.setProductItemId(item.getProductItemId());

            // Ưu tiên sản phẩm custom của user cho productItemId này (nếu có)
            customProductRepo.findByUserIdAndProductId(cart.getUserId(), item.getProductItemId())
                    .ifPresent(line::setCustomProduct);

            orderLines.add(line);
        });

        order.setItems(orderLines);

        // Cập nhật địa chỉ nếu có
        if (request.getShippingAddressId() != null) {
            Address address = addressRepo.findById(request.getShippingAddressId())
                    .orElseThrow(() -> new com.example.backend.Exception.ResourceNotFoundException("Address not found"));
            // Address entity has no user ownership info; cannot enforce ownership here.
            order.setShippingAddress(address);
        }

        // Cập nhật thanh toán & vận chuyển
        order.setPaymentTypeName(request.getPaymentTypeName());
        order.setPaymentProvider(request.getPaymentProvider());
        order.setPaymentAccountNumber(request.getPaymentAccountNumber());
        order.setPaymentStatus(request.getPaymentStatus());
        order.setShippingMethodName(request.getShippingMethodName());
        order.setShippingPrice(request.getShippingPrice());

        if ("Đã thanh toán".equals(request.getPaymentStatus())) {
            order.setPaymentDate(Instant.now());
        }

        // Tính tổng tiền hoàn toàn phía server
        BigDecimal itemsTotal = orderLines.stream()
                .map(line -> BigDecimal.valueOf(line.getPrice()).multiply(BigDecimal.valueOf(line.getQty())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal shipping = request.getShippingPrice() != null ? request.getShippingPrice() : BigDecimal.ZERO;
        if (shipping.compareTo(BigDecimal.ZERO) < 0) {
            shipping = BigDecimal.ZERO;
        }
        BigDecimal finalTotal = itemsTotal.add(shipping);

        order.setOrderTotal(finalTotal);

        ShopOrder saved = orderRepo.save(order);

        // Xây OrderResponse ngay bây giờ và chép selectedOptions từ cartItem trước khi xoá
        OrderResponse response = new OrderResponse();
        response.setId(saved.getId());
        response.setUserId(saved.getUserId());
        response.setPaymentTypeName(saved.getPaymentTypeName());
        response.setPaymentProvider(saved.getPaymentProvider());
        response.setPaymentAccountNumber(saved.getPaymentAccountNumber());
        response.setPaymentStatus(saved.getPaymentStatus());
        response.setPaymentDate(saved.getPaymentDate());
        response.setShippingMethodName(saved.getShippingMethodName());
        response.setShippingPrice(saved.getShippingPrice());
        response.setOrderStatus(saved.getOrderStatus());
        response.setOrderDate(saved.getOrderDate());
        response.setOrderTotal(saved.getOrderTotal());

        // Ensure lines are saved so IDs are set
        orderLineRepo.saveAll(orderLines);

        // Batch fetch product images to avoid N+1
        List<Integer> nonCustomProductItemIds = orderLines.stream()
                .filter(l -> l.getCustomProduct() == null)
                .map(OrderLine::getProductItemId)
                .distinct()
                .toList();
        var productItems = nonCustomProductItemIds.isEmpty()
                ? java.util.List.<com.example.backend.Entity.ProductItem>of()
                : productItemRepo.findAllById(nonCustomProductItemIds);
        java.util.Map<Integer, String> productImageById = productItems.stream()
                .collect(java.util.stream.Collectors.toMap(com.example.backend.Entity.ProductItem::getId, com.example.backend.Entity.ProductItem::getProductImage));

        // Map items in aligned order without indexOf
        List<com.example.backend.DTO.Response.Order.OrderItemDTO> respItems = new ArrayList<>();
        for (int i = 0; i < orderLines.size(); i++) {
            OrderLine line = orderLines.get(i);
            ShoppingCartItem src = selectedCartItems.get(i);

            com.example.backend.DTO.Response.Order.OrderItemDTO itemDTO = new com.example.backend.DTO.Response.Order.OrderItemDTO();
            itemDTO.setId(line.getId());
            itemDTO.setQty(line.getQty());
            itemDTO.setPrice(line.getPrice());
            itemDTO.setProductItemId(line.getProductItemId());

            if (line.getCustomProduct() != null) {
                itemDTO.setIs_customed(true);
                itemDTO.setCustom_id(line.getCustomProduct().getId());
                itemDTO.setProductImage(line.getCustomProduct().getCustomImageUrl());
            } else {
                itemDTO.setIs_customed(false);
                String img = productImageById.get(line.getProductItemId());
                itemDTO.setProductImage(img);
            }

            if (src.getSelectedOptions() != null) {
                itemDTO.setSelectedOptions(src.getSelectedOptions().stream().map(opt -> {
                    var vo = new com.example.backend.DTO.Response.Cart.VariationOptionDTO();
                    vo.setId(opt.getId());
                    vo.setVariationId(opt.getVariation().getId());
                    vo.setValue(opt.getValue());
                    return vo;
                }).toList());
            } else {
                itemDTO.setSelectedOptions(new ArrayList<>());
            }

            respItems.add(itemDTO);
        }
        response.setItems(respItems);

        // Xoá các cart items đã dùng
        cartItemRepo.deleteAllById(selectedItemIds);

        return response;
    }

    // ✅ Map Entity → DTO
    private OrderResponse mapToOrderResponse(ShopOrder order) {
        OrderResponse dto = new OrderResponse();
        dto.setId(order.getId());
        dto.setUserId(order.getUserId());
        dto.setPaymentTypeName(order.getPaymentTypeName());
        dto.setPaymentProvider(order.getPaymentProvider());
        dto.setPaymentAccountNumber(order.getPaymentAccountNumber());
        dto.setPaymentStatus(order.getPaymentStatus());
        dto.setPaymentDate(order.getPaymentDate());
        dto.setShippingMethodName(order.getShippingMethodName());
        dto.setShippingPrice(order.getShippingPrice());
        dto.setOrderStatus(order.getOrderStatus());
        dto.setOrderDate(order.getOrderDate());
        dto.setOrderTotal(order.getOrderTotal());

        // Lấy tất cả OrderLine của đơn hàng
        List<OrderLine> lines = orderLineRepo.findByShopOrderId(order.getId());

        // === BATCH FETCH ảnh sản phẩm để tránh N+1 ===
        List<Integer> nonCustomProductItemIds = lines.stream()
                .filter(line -> line.getCustomProduct() == null && line.getProductItemId() != null)
                .map(OrderLine::getProductItemId)
                .distinct()
                .toList();

        Map<Integer, String> productImageMap = nonCustomProductItemIds.isEmpty()
                ? Map.of()
                : productItemRepo.findAllById(nonCustomProductItemIds).stream()
                .collect(Collectors.toMap(ProductItem::getId, ProductItem::getProductImage, (v1, v2) -> v1));

        // === Map từng OrderLine → OrderItemDTO ===
        List<com.example.backend.DTO.Response.Order.OrderItemDTO> itemDTOs = lines.stream()
                .map(line -> {
                    var itemDTO = new com.example.backend.DTO.Response.Order.OrderItemDTO();
                    itemDTO.setId(line.getId());
                    itemDTO.setQty(line.getQty());
                    itemDTO.setPrice(line.getPrice());
                    itemDTO.setProductItemId(line.getProductItemId());

                    // Xử lý ảnh
                    if (line.getCustomProduct() != null) {
                        itemDTO.setIs_customed(true);
                        itemDTO.setCustom_id(line.getCustomProduct().getId());
                        itemDTO.setProductImage(line.getCustomProduct().getCustomImageUrl());
                    } else {
                        itemDTO.setIs_customed(false);
                        Integer pid = line.getProductItemId();
                        itemDTO.setProductImage(pid != null ? productImageMap.get(pid) : null);
                    }

                    // Lấy selectedOptions từ ShoppingCartItem (nếu còn tồn tại)
                    // CẢNH BÁO: CartItem đã bị xóa khi tạo order → không thể lấy!
                    // Giải pháp: lưu selectedOptions vào OrderLine khi tạo order
                    itemDTO.setSelectedOptions(new ArrayList<>());

                    return itemDTO;
                })
                .toList();

        dto.setItems(itemDTOs);
        return dto;
    }

    private void validateCartItemOwnership(Integer userId, List<Integer> cartItemIds) {
        if (cartItemIds == null || cartItemIds.isEmpty()) return;
        for (Integer id : cartItemIds) {
            if (!cartItemRepo.existsByIdAndCart_UserId(id, userId)) {
                throw new com.example.backend.Exception.InvalidDataException("Cart item " + id + " does not belong to user " + userId);
            }
        }
    }

    public List<OrderResponse> getAllOrders() {
        List<ShopOrder> orders = orderRepo.findAll();
        return orders.stream().map(this::mapToOrderResponse).collect(Collectors.toList());
    }

    public OrderResponse updateOrderStatus(Integer orderId, String status) {
        ShopOrder order = orderRepo.findById(orderId)
                .orElseThrow(() -> new com.example.backend.Exception.ResourceNotFoundException("Order not found"));
        order.setOrderStatus(status);
        ShopOrder updatedOrder = orderRepo.save(order);
        return mapToOrderResponse(updatedOrder);
    }
}
