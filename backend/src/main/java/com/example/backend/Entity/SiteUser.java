package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "site_user")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SiteUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", nullable = false)
    private Integer id;


    @Column(nullable = false, unique = true)
    private String email_address;

    private String phone_number;

    @Column(nullable = false)
    private String password;

    @Column(columnDefinition = "varchar(50) default 'USER'")
    private String role;
}