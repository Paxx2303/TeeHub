-- Creating table for site users
CREATE TABLE site_user (
    user_id INT PRIMARY KEY,
    email_address VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    password VARCHAR(255) NOT NULL
);

-- Creating table for user addresses
CREATE TABLE address (
    address_id INT PRIMARY KEY,
    user_id INT,
    unit_number VARCHAR(50),
    street_number VARCHAR(50),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    region VARCHAR(100),
    postal_code VARCHAR(20),
    country_name VARCHAR(100),
    is_default BOOLEAN,
    FOREIGN KEY (user_id) REFERENCES site_user(user_id)
);

-- Creating table for user payment methods
CREATE TABLE user_payment_method (
    payment_method_id INT PRIMARY KEY,
    user_id INT,
    payment_type_name VARCHAR(50),
    provider VARCHAR(100),
    account_number VARCHAR(100),
    expiry_date DATE,
    is_default BOOLEAN,
    FOREIGN KEY (user_id) REFERENCES site_user(user_id)
);

-- Creating table for shopping carts
CREATE TABLE shopping_cart (
    cart_id INT PRIMARY KEY,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES site_user(user_id)
);

-- Creating table for product categories
CREATE TABLE product_category (
    category_id INT PRIMARY KEY,
    parent_category_id INT,
    category_name VARCHAR(100),
    FOREIGN KEY (parent_category_id) REFERENCES product_category(category_id)
);

-- Creating table for products
CREATE TABLE product (
    product_id INT PRIMARY KEY,
    category_id INT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    product_image VARCHAR(255),
    FOREIGN KEY (category_id) REFERENCES product_category(category_id)
);

-- Creating table for product items
CREATE TABLE product_item (
    product_item_id INT PRIMARY KEY,
    product_id INT,
    SKU VARCHAR(100) NOT NULL,
    qty_in_stock INT,
    product_image VARCHAR(255),
    price DECIMAL(10,2),
    FOREIGN KEY (product_id) REFERENCES product(product_id)
);

-- Creating table for shopping cart items
CREATE TABLE shopping_cart_item (
    cart_item_id INT PRIMARY KEY,
    cart_id INT,
    product_item_id INT,
    qty INT,
    FOREIGN KEY (cart_id) REFERENCES shopping_cart(cart_id),
    FOREIGN KEY (product_item_id) REFERENCES product_item(product_item_id)
);

-- Creating table for shop orders
CREATE TABLE shop_order (
    order_id INT PRIMARY KEY,
    user_id INT,
    payment_type_name VARCHAR(50),
    payment_provider VARCHAR(100),
    payment_account_number VARCHAR(100),
    payment_status VARCHAR(50),
    payment_date DATETIME,
    shipping_address_id INT,
    shipping_method_name VARCHAR(100),
    shipping_price DECIMAL(10,2),
    order_status VARCHAR(50),
    order_date DATETIME,
    order_total DECIMAL(10,2),
    FOREIGN KEY (user_id) REFERENCES site_user(user_id),
    FOREIGN KEY (shipping_address_id) REFERENCES address(address_id)
);

-- Creating table for order lines
CREATE TABLE order_line (
    order_line_id INT PRIMARY KEY,
    product_item_id INT,
    order_id INT,
    qty INT,
    price DECIMAL(10,2),
    custom_product_id INT,
    FOREIGN KEY (product_item_id) REFERENCES product_item(product_item_id),
    FOREIGN KEY (order_id) REFERENCES shop_order(order_id),
    FOREIGN KEY (custom_product_id) REFERENCES custom_product(custom_product_id)
);

-- Creating table for user reviews
CREATE TABLE user_review (
    review_id INT PRIMARY KEY,
    user_id INT,
    ordered_product_id INT,
    rating_value INT,
    comment TEXT,
    FOREIGN KEY (user_id) REFERENCES site_user(user_id),
    FOREIGN KEY (ordered_product_id) REFERENCES product_item(product_item_id)
);

-- Creating table for variations
CREATE TABLE variation (
    variation_id INT PRIMARY KEY,
    category_id INT,
    name VARCHAR(100),
    FOREIGN KEY (category_id) REFERENCES product_category(category_id)
);

-- Creating table for variation options
CREATE TABLE variation_option (
    variation_option_id INT PRIMARY KEY,
    variation_id INT,
    value VARCHAR(100),
    FOREIGN KEY (variation_id) REFERENCES variation(variation_id)
);

-- Creating table for product configurations
CREATE TABLE product_configuration (
    product_item_id INT,
    variation_option_id INT,
    PRIMARY KEY (product_item_id, variation_option_id),
    FOREIGN KEY (product_item_id) REFERENCES product_item(product_item_id),
    FOREIGN KEY (variation_option_id) REFERENCES variation_option(variation_option_id)
);

-- Creating table for promotions
CREATE TABLE promotion (
    promotion_id INT PRIMARY KEY,
    category_id INT,
    name VARCHAR(255),
    description TEXT,
    discount_rate DECIMAL(5,2),
    start_date DATE,
    end_date DATE,
    FOREIGN KEY (category_id) REFERENCES product_category(category_id)
);

-- Creating table for custom products
CREATE TABLE custom_product (
    custom_product_id INT PRIMARY KEY,
    product_item_id INT,
    user_id INT,
    custom_name VARCHAR(255),
    custom_description TEXT,
    custom_color VARCHAR(50),
    custom_text VARCHAR(255),
    custom_image_url VARCHAR(255),
    preview_image VARCHAR(255),
    created_at DATETIME,
    FOREIGN KEY (product_item_id) REFERENCES product_item(product_item_id),
    FOREIGN KEY (user_id) REFERENCES site_user(user_id)
);