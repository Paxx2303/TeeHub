package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Getter
@Setter
@Entity
@Table(name = "site_user", schema = "ecommerce")
public class SiteUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", nullable = false)
    private Integer id;

    @Column(name = "email_address", nullable = false)
    private String email_address;

    @Column(name = "phone_number", length = 20)
    private String phone_number;

    @Column(name = "password", nullable = false)
    private String password;

    @ColumnDefault("'USER'")
    @Column(name = "role", length = 20)
    private String role;

}