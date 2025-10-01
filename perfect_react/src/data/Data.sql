
-- Bảng Customer
CREATE TABLE Customer (
    id_customer SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    billing_address TEXT,
    shipping_address TEXT,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL
);

-- Bảng Supplier
CREATE TABLE Supplier (
    id_supplier SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact_info TEXT
);

-- Bảng Fabric
CREATE TABLE Fabric (
    id_fabric SERIAL PRIMARY KEY,
    fabric_type VARCHAR(100) NOT NULL,
    fabric_cost NUMERIC(12,2) NOT NULL,
    id_supplier INT REFERENCES Supplier(id_supplier) ON DELETE SET NULL
);

-- Bảng Design
CREATE TABLE Design (
    id_design SERIAL PRIMARY KEY,
    design_name VARCHAR(100) NOT NULL,
    id_customer INT REFERENCES Customer(id_customer) ON DELETE CASCADE,
    image_url TEXT,
    description TEXT
);

-- Bảng Product
CREATE TABLE Product (
    id_product SERIAL PRIMARY KEY,
    price NUMERIC(12,2) NOT NULL,
    size VARCHAR(50),
    id_design INT REFERENCES Design(id_design) ON DELETE SET NULL,
    id_fabric INT REFERENCES Fabric(id_fabric) ON DELETE SET NULL,
    available BOOLEAN DEFAULT TRUE
);

-- Bảng Billing
CREATE TABLE Billing (
    id_billing SERIAL PRIMARY KEY,
    tax_amount NUMERIC(12,2) DEFAULT 0,
    discount_amount NUMERIC(12,2) DEFAULT 0,
    total_amount NUMERIC(12,2) NOT NULL,
    id_customer INT REFERENCES Customer(id_customer) ON DELETE CASCADE,
    order_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Order
CREATE TABLE "Order" (
    id_order SERIAL PRIMARY KEY,
    id_billing INT REFERENCES Billing(id_billing) ON DELETE CASCADE,
    id_product INT REFERENCES Product(id_product) ON DELETE CASCADE,
    id_supplier INT REFERENCES Supplier(id_supplier) ON DELETE SET NULL,
    quantity INT NOT NULL,
    order_status VARCHAR(50) DEFAULT 'Pending',
    all_amount NUMERIC(12,2) NOT NULL
);


-- Customer
INSERT INTO Customer (full_name, phone_number, billing_address, shipping_address, email, password)
VALUES 
('Nguyen Van A', '0901234567', '123 Le Loi, HCM', '123 Le Loi, HCM', 'a@example.com', '123456'),
('Tran Thi B', '0912345678', '456 Nguyen Trai, HN', '789 Tran Hung Dao, HN', 'b@example.com', 'abcdef');

-- Supplier
INSERT INTO Supplier (name, contact_info)
VALUES
('Fabric Co', 'fabricco@gmail.com | 0987654321'),
('Textile Supply', 'textile@supplier.com | 0978123456');

-- Fabric
INSERT INTO Fabric (fabric_type, fabric_cost, id_supplier)
VALUES
('Cotton', 50000, 1),
('Silk', 120000, 2);

-- Design
INSERT INTO Design (design_name, id_customer, image_url, description)
VALUES
('Summer T-Shirt', 1, 'http://example.com/tshirt.png', 'Cool cotton T-shirt for summer'),
('Luxury Dress', 2, 'http://example.com/dress.png', 'Elegant silk dress for party');

-- Product
INSERT INTO Product (price, size, id_design, id_fabric, available)
VALUES
(150000, 'M', 1, 1, TRUE),
(500000, 'L', 2, 2, TRUE);

-- Billing
INSERT INTO Billing (tax_amount, discount_amount, total_amount, id_customer, order_time)
VALUES
(15000, 0, 165000, 1, NOW()),
(50000, 50000, 500000, 2, NOW());

-- Order
INSERT INTO "Order" (id_billing, id_product, id_supplier, quantity, order_status, all_amount)
VALUES
(1, 1, 1, 2, 'Completed', 300000),
(2, 2, 2, 1, 'Pending', 500000);
