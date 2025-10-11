package com.example.backend.Entities;

import com.example.backend.Entities.SiteUser;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "user_payment_method", schema = "ecommerce")
public class UserPaymentMethod {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_method_id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id")
    private SiteUser user;

    @Column(name = "payment_type_name", length = 50)
    private String paymentTypeName;

    @Column(name = "provider", length = 100)
    private String provider;

    @Column(name = "account_number", length = 100)
    private String accountNumber;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @ColumnDefault("false")
    @Column(name = "is_default")
    private Boolean isDefault;

}