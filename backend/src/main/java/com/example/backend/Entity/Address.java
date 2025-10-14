package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
@Entity
@Table(name = "address")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class  Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer address_id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id",nullable = false)
    private SiteUser user;

    private String unit_number;
    private String street_number;
    private String address_line1;
    private String address_line2;
    private String city;
    private String region;
    private String postal_code;
    private String country_name;

    @Column(columnDefinition = "boolean default false")
    private Boolean is_default;

}