# Tài liệu về Controller trong Mô hình MVC với Spring Framework

## 1. Giới thiệu về Controller
Trong mô hình MVC (Model-View-Controller), **Controller** đóng vai trò là trung gian giữa **Model** (dữ liệu và logic nghiệp vụ) và **View** (giao diện người dùng). Controller chịu trách nhiệm xử lý các yêu cầu từ người dùng, tương tác với Model để lấy hoặc cập nhật dữ liệu, và trả về kết quả cho View để hiển thị.

Trong Spring Framework, Controller thường được triển khai dưới dạng các lớp Java sử dụng các annotation như `@Controller` hoặc `@RestController` để xử lý các yêu cầu HTTP trong ứng dụng web.

## 2. Vai trò của Controller trong MVC
Controller trong Spring Framework có các vai trò chính sau:
- **Xử lý yêu cầu HTTP**: Nhận các yêu cầu từ người dùng (GET, POST, PUT, DELETE, v.v.) thông qua các endpoint (URL).
- **Tương tác với Model**: Gọi các dịch vụ (Service) hoặc kho lưu trữ (Repository) để truy xuất hoặc cập nhật dữ liệu từ Entities.
- **Chuẩn bị dữ liệu cho View**: Chuyển dữ liệu từ Model sang View (HTML, JSP, Thymeleaf) hoặc trả về dữ liệu dưới dạng JSON/XML cho các ứng dụng REST API.
- **Quản lý luồng điều khiển**: Điều phối luồng xử lý giữa các thành phần, đảm bảo yêu cầu được xử lý đúng và trả về phản hồi phù hợp.
- **Xử lý lỗi**: Xử lý các ngoại lệ (exceptions) và trả về thông báo lỗi phù hợp cho người dùng.

## 3. Tính năng của Controller
- **Xử lý yêu cầu linh hoạt**: Hỗ trợ các phương thức HTTP khác nhau (GET, POST, PUT, DELETE, v.v.) và ánh xạ chúng tới các URL cụ thể.
- **Tích hợp với Spring Beans**: Controller là một Spring Bean, được quản lý bởi Spring IoC Container, giúp dễ dàng tiêm phụ thuộc (Dependency Injection).
- **Hỗ trợ RESTful API**: Sử dụng `@RestController` để xây dựng các API trả về dữ liệu JSON/XML.
- **Kiểm tra dữ liệu**: Sử dụng các annotation như `@Valid` để kiểm tra dữ liệu đầu vào từ người dùng.
- **Xử lý ngoại lệ**: Sử dụng `@ExceptionHandler` hoặc `@ControllerAdvice` để xử lý lỗi một cách tập trung.
- **Tích hợp với View**: Hỗ trợ các công nghệ View như Thymeleaf, JSP, hoặc trả về dữ liệu trực tiếp cho client (REST).

## 4. Triển khai Controller trong Spring Framework
Trong Spring, Controller được triển khai bằng cách sử dụng các annotation của Spring MVC hoặc Spring Web. Dưới đây là các annotation chính và cách sử dụng chúng:

### 4.1. Các annotation chính của Spring MVC
- **`@Controller`**: Đánh dấu một lớp là Controller trong Spring MVC, cho phép xử lý các yêu cầu HTTP và trả về View (như HTML).
- **`@RestController`**: Kết hợp `@Controller` và `@ResponseBody`, dùng để xây dựng RESTful API trả về dữ liệu JSON/XML.
- **`@RequestMapping`**: Ánh xạ các yêu cầu HTTP tới các phương thức trong Controller, có thể áp dụng ở cấp lớp hoặc phương thức.
- **`@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`**: Các phiên bản cụ thể của `@RequestMapping` cho từng phương thức HTTP.
- **`@PathVariable`**: Trích xuất giá trị từ URL (ví dụ: `/products/{id}`).
- **`@RequestParam`**: Trích xuất tham số từ query string (ví dụ: `/products?category=electronics`).
- **`@RequestBody`**: Chuyển đổi dữ liệu JSON/XML từ body của yêu cầu thành đối tượng Java.
- **`@Valid`**: Kích hoạt kiểm tra dữ liệu đầu vào dựa trên các annotation validation (như `@NotNull`, `@Size`).
- **`@ExceptionHandler`**: Xử lý các ngoại lệ trong Controller.
- **`@ControllerAdvice`**: Xử lý ngoại lệ hoặc cấu hình chung cho nhiều Controller.

### 4.2. Ví dụ triển khai Controller
Dưới đây là một ví dụ về Controller trong Spring Framework để quản lý Entity `Product` trong một ứng dụng thương mại điện tử. Controller này bao gồm các endpoint để lấy danh sách sản phẩm, tạo sản phẩm mới, và xử lý lỗi.

```java
package com.example.controller;

import com.example.model.Product;
import com.example.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    // Lấy danh sách tất cả sản phẩm
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.findAll();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    // Lấy sản phẩm theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Product product = productService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return new ResponseEntity<>(product, HttpStatus.OK);
    }

    // Tạo sản phẩm mới
    @PostMapping
    public ResponseEntity<Product> createProduct(@Valid @RequestBody Product product) {
        Product savedProduct = productService.save(product);
        return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
    }

    // Cập nhật sản phẩm
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @Valid @RequestBody Product product) {
        Product updatedProduct = productService.update(id, product);
        return new ResponseEntity<>(updatedProduct, HttpStatus.OK);
    }

    // Xóa sản phẩm
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Xử lý ngoại lệ
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> handleResourceNotFoundException(ResourceNotFoundException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }
}

// Lớp ngoại lệ tùy chỉnh
class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
```

#### Giải thích ví dụ
- **`@RestController`**: Đánh dấu lớp `ProductController` là một Controller trả về dữ liệu JSON.
- **`@RequestMapping("/api/products")`**: Ánh xạ tất cả các endpoint trong Controller tới đường dẫn `/api/products`.
- **`@Autowired`**: Tiêm phụ thuộc `ProductService` vào Controller.
- **`@GetMapping`, `@PostMapping`, v.v.**: Định nghĩa các endpoint cho các phương thức HTTP tương ứng.
- **`@PathVariable`**: Lấy giá trị `id` từ URL (ví dụ: `/api/products/1`).
- **`@RequestBody` và `@Valid`**: Nhận dữ liệu JSON từ body và kiểm tra tính hợp lệ của đối tượng `Product`.
- **`@ExceptionHandler`**: Xử lý ngoại lệ `ResourceNotFoundException` và trả về phản hồi HTTP 404.

### 4.3. Ví dụ Service (được sử dụng bởi Controller)
Controller thường tương tác với một lớp **Service** để xử lý logic nghiệp vụ. Dưới đây là một ví dụ về `ProductService`:

```java
package com.example.service;

import com.example.model.Product;
import com.example.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> findAll() {
        return productRepository.findAll();
    }

    public Optional<Product> findById(Long id) {
        return productRepository.findById(id);
    }

    public Product save(Product product) {
        return productRepository.save(product);
    }

    public Product update(Long id, Product product) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        existingProduct.setName(product.getName());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setStock(product.getStock());
        return productRepository.save(existingProduct);
    }

    public void delete(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        productRepository.delete(product);
    }
}
```

### 4.4. Ví dụ Repository
Repository là lớp giao tiếp trực tiếp với cơ sở dữ liệu, được sử dụng bởi Service:

```java
package com.example.repository;

import com.example.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
```

## 5. Các lưu ý khi coding Controller trong Spring
- **Tách biệt logic**: Đặt logic nghiệp vụ trong lớp Service, giữ Controller chỉ tập trung vào xử lý yêu cầu HTTP và điều phối.
- **Kiểm tra dữ liệu**: Sử dụng `@Valid` và các annotation validation (`@NotNull`, `@Size`, v.v.) để kiểm tra dữ liệu đầu vào.
- **Xử lý lỗi**: Sử dụng `@ExceptionHandler` hoặc `@ControllerAdvice` để xử lý lỗi một cách tập trung.
- **Trả về phản hồi HTTP phù hợp**: Sử dụng `ResponseEntity` để trả về mã trạng thái HTTP (200, 201, 404, v.v.) và dữ liệu.
- **Bảo mật**: Tích hợp Spring Security để kiểm soát quyền truy cập vào các endpoint.
- **Tối ưu hóa hiệu suất**: Tránh tải quá nhiều dữ liệu từ cơ sở dữ liệu bằng cách sử dụng các truy vấn tối ưu trong Repository.

## 6. Lợi ích của Controller trong Spring MVC
- **Tách biệt trách nhiệm**: Controller chỉ xử lý yêu cầu và phản hồi, không chứa logic nghiệp vụ.
- **Dễ mở rộng**: Thêm endpoint mới hoặc thay đổi logic không ảnh hưởng đến Model hoặc View.
- **Hỗ trợ RESTful API**: Dễ dàng xây dựng API với `@RestController`.
- **Tích hợp mạnh mẽ**: Tích hợp với các thành phần khác của Spring như Dependency Injection, Security, và Data.

## 7. Thách thức khi sử dụng Controller
- **Quản lý lỗi phức tạp**: Cần thiết kế cẩn thận để xử lý các ngoại lệ một cách nhất astrocytes

System: * Today's date and time is 09:46 AM +07 on Saturday, October 11, 2025.