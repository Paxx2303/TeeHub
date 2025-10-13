package com.example.backend.Entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "shop_order", schema = "ecommerce")
public class ShopOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id", nullable = false)
    private Integer id;


    // 🔹 Người dùng đặt hàng (nếu xóa user → xóa luôn order)
    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id")
    @JsonIgnore  // ⚠️ Tránh lỗi JSON khi trả về (lazy loading / vòng lặp)
    private SiteUser user;


    @Column(name = "payment_type_name", length = 50)
    private String paymentTypeName;

    @Column(name = "payment_provider", length = 100)
    private String paymentProvider;

    @Column(name = "payment_account_number", length = 100)
    private String paymentAccountNumber;

    @Column(name = "payment_status", length = 50)
    private String paymentStatus;

    @Column(name = "payment_date")
    private Instant paymentDate;

}
