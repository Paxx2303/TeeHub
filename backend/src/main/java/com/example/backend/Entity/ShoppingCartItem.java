package com.example.backend.Entity;





import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "shopping_cart_item", schema = "ecommerce")
// 👇 Bỏ qua các thuộc tính lazy-loading của Hibernate khi chuyển sang JSON
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ShoppingCartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_item_id", nullable = false)
    private Integer id;

    // 👇 Ngăn Jackson đọc trực tiếp object cart (vì nó là lazy)
    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "cart_id")
    @JsonIgnore
    private ShoppingCart cart;

    // 👇 Ngăn Jackson serialize proxy của productItem
    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "product_item_id")
    @JsonIgnore
    private ProductItem productItem;

    @ColumnDefault("1")
    @Column(name = "qty")
    private Integer qty;
}
