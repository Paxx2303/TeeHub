
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE SCHEMA IF NOT EXISTS ecommerce;
SET search_path TO ecommerce;

-- 1) USERS & AUTH
CREATE TABLE site_user (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(255),
    user_avatar VARCHAR(255),
    email_address VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER'
    CHECK (role IN ('USER', 'ADMIN'))
);

-- 2) ADDRESSES
CREATE TABLE address (
    address_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES site_user(user_id) ON DELETE CASCADE,
    street_number VARCHAR(50),
    address_line VARCHAR(255)
);

-- 3) SHOPPING CARTS
CREATE TABLE shopping_cart (
    cart_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES site_user(user_id) ON DELETE CASCADE
);

-- 4) PRODUCT CATEGORIES
CREATE TABLE product_category (
    category_id SERIAL PRIMARY KEY,
    parent_category_id INT REFERENCES product_category(category_id) ON DELETE SET NULL,
    category_name VARCHAR(100)
);

-- 5) PRODUCTS
CREATE TABLE product (
    product_id SERIAL PRIMARY KEY,
    category_id INT REFERENCES product_category(category_id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    product_image VARCHAR(255)
);

-- 6) PRODUCT ITEMS
CREATE TABLE product_item (
    product_item_id SERIAL PRIMARY KEY,
    product_id INT REFERENCES product(product_id) ON DELETE CASCADE,
    SKU VARCHAR(100) NOT NULL UNIQUE,
    qty_in_stock INT DEFAULT 0 CHECK (qty_in_stock >= 0),
    product_image VARCHAR(255),
    price DECIMAL(10,2) CHECK (price IS NULL OR price >= 0)
);

-- 7) CUSTOM PRODUCTS
CREATE TABLE custom_product (
    custom_product_id SERIAL PRIMARY KEY,
    product_item_id INT REFERENCES product_item(product_item_id) ON DELETE CASCADE,
    user_id INT REFERENCES site_user(user_id) ON DELETE CASCADE,
    custom_name VARCHAR(255),
    custom_image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8) CART ITEMS
CREATE TABLE shopping_cart_item (
    cart_item_id SERIAL PRIMARY KEY,
    cart_id INT REFERENCES shopping_cart(cart_id) ON DELETE CASCADE,
    product_item_id INT REFERENCES product_item(product_item_id) ON DELETE CASCADE,
    qty INT DEFAULT 1 CHECK (qty > 0)
);

-- 9) ORDERS
CREATE TABLE shop_order (
    order_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES site_user(user_id) ON DELETE CASCADE,
    payment_type_name VARCHAR(50),
    payment_provider VARCHAR(100),
    payment_account_number VARCHAR(100),
    payment_status VARCHAR(50),
    payment_date TIMESTAMP,
    shipping_address_id INT REFERENCES address(address_id) ON DELETE SET NULL,
    shipping_method_name VARCHAR(100),
    shipping_price DECIMAL(10,2) CHECK (shipping_price IS NULL OR shipping_price >= 0),
    order_status VARCHAR(50),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    order_total DECIMAL(10,2) CHECK (order_total IS NULL OR order_total >= 0)
);

-- 10) ORDER LINES
CREATE TABLE order_line (
    order_line_id SERIAL PRIMARY KEY,
    product_item_id INT REFERENCES product_item(product_item_id) ON DELETE SET NULL,
    order_id INT REFERENCES shop_order(order_id) ON DELETE CASCADE,
    qty INT NOT NULL CHECK (qty > 0),
    price DECIMAL(10,2) CHECK (price IS NULL OR price >= 0),
    custom_product_id INT REFERENCES custom_product(custom_product_id) ON DELETE SET NULL
);

-- 11) USER REVIEWS
CREATE TABLE user_review (
    review_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES site_user(user_id) ON DELETE CASCADE,
    ordered_product_id INT REFERENCES product_item(product_item_id) ON DELETE CASCADE,
    rating_value INT CHECK (rating_value BETWEEN 1 AND 5),
    comment TEXT
);

-- 12) VARIATIONS
CREATE TABLE variation (
    variation_id SERIAL PRIMARY KEY,
    category_id INT REFERENCES product_category(category_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL
);

-- 13) VARIATION OPTIONS
CREATE TABLE variation_option (
    variation_option_id SERIAL PRIMARY KEY,
    variation_id INT REFERENCES variation(variation_id) ON DELETE CASCADE,
    value VARCHAR(100) NOT NULL
);

-- 14) PRODUCT CONFIGURATIONS
CREATE TABLE product_configuration (
    product_item_id INT REFERENCES product_item(product_item_id) ON DELETE CASCADE,
    variation_option_id INT REFERENCES variation_option(variation_option_id) ON DELETE CASCADE,
    PRIMARY KEY (product_item_id, variation_option_id)
);

-- 15) PROMOTIONS
CREATE TABLE promotion (
    promotion_id SERIAL PRIMARY KEY,
    category_id INT REFERENCES product_category(category_id) ON DELETE SET NULL,
    name VARCHAR(255),
    description TEXT,
    discount_rate DECIMAL(5,2) CHECK (discount_rate >= 0 AND discount_rate <= 100),
    start_date DATE,
    end_date DATE,
    CONSTRAINT ck_promo_dates CHECK (start_date IS NULL OR end_date IS NULL OR end_date >= start_date)
);


INSERT INTO ecommerce.product_category (category_id, parent_category_id, category_name)
VALUES (1, NULL, 'Áo thun cotton')
ON CONFLICT (category_id) DO NOTHING;


-- Users
INSERT INTO ecommerce.site_user (user_id, full_name, email_address, phone_number, password, role) VALUES
-- 1..30: USER
(1 , 'Nguyễn Văn An',        'an.nguyen@gmail.com',         '0912345670', 'AnNguyen#2025',     'USER'),
(2 , 'Trần Thị Bích',        'bich.tran@gmail.com',         '0938123456', 'BichTran!2025',     'USER'),
(3 , 'Lê Hoàng Long',        'long.le@gmail.com',           '0973555123', 'LongLe@123',        'USER'),
(4 , 'Phạm Minh Đức',        'duc.pham@gmail.com',          '0906789123', 'DucPham*2025',      'USER'),
(5 , 'Hoàng Thị Lan',        'lan.hoang@gmail.com',         '0886123456', 'LanHoang_2025',     'USER'),
(6 , 'Bùi Quang Huy',        'huy.bui@gmail.com',           '0967123987', 'HuyBui#987',        'USER'),
(7 , 'Đỗ Thị Hương',         'huong.do@gmail.com',          '0357891234', 'HuongDo!88',        'USER'),
(8 , 'Phan Anh Tuấn',        'tuan.phan@gmail.com',         '0794567891', 'TuanPhan@2025',     'USER'),
(9 , 'Đặng Thu Trang',       'trang.dang@gmail.com',        '0812233445', 'TrangDang#12',      'USER'),
(10, 'Vũ Minh Anh',          'anh.vu@gmail.com',            '0849988776', 'AnhVu*2025',        'USER'),
(11, 'Ngô Thanh Hà',         'ha.ngo@gmail.com',            '0912233446', 'HaNgo!456',         'USER'),
(12, 'Đinh Quang Vinh',      'vinh.dinh@gmail.com',         '0934667788', 'VinhDinh@2025',     'USER'),
(13, 'Cao Thị Mai',          'mai.cao@gmail.com',           '0978111222', 'MaiCao#321',        'USER'),
(14, 'Ngô Văn Hiếu',         'hieu.ngo@gmail.com',          '0905111555', 'HieuNgo*abc',       'USER'),
(15, 'Trương Mỹ Linh',       'linh.truong@gmail.com',       '0885333777', 'LinhTruong!2025',   'USER'),
(16, 'Hà Tuấn Kiệt',         'kiet.ha@gmail.com',           '0967444333', 'KietHa@888',        'USER'),
(17, 'Mai Phương Thảo',      'thao.mai@gmail.com',          '0359001122', 'ThaoMai#2025',      'USER'),
(18, 'Lý Gia Bảo',           'bao.ly@gmail.com',            '0796007788', 'BaoLy!777',         'USER'),
(19, 'Lâm Thu Thảo',         'thao.lam@gmail.com',          '0815566778', 'ThaoLam@xyz',       'USER'),
(20, 'Võ Trường Sơn',        'son.vo@gmail.com',            '0847008899', 'SonVo#2025',        'USER'),
(21, 'Nguyễn Thị Thu',       'thu.nguyen@gmail.com',        '0914555666', 'ThuNguyen!abc',     'USER'),
(22, 'Trần Đức Anh',         'anh.tran@gmail.com',          '0934111999', 'AnhTran@2025',      'USER'),
(23, 'Lê Khánh Linh',        'linh.le@gmail.com',           '0973004455', 'LinhLe#@12',        'USER'),
(24, 'Phạm Quốc Việt',       'viet.pham@gmail.com',         '0908333555', 'VietPham*2025',     'USER'),
(25, 'Hoàng Bảo Ngọc',       'ngoc.hoang@gmail.com',        '0886444666', 'NgocHoang!999',     'USER'),
(26, 'Bùi Hữu Nghĩa',        'nghia.bui@gmail.com',         '0967999666', 'NghiaBui@pass',     'USER'),
(27, 'Đỗ Anh Khoa',          'khoa.do@gmail.com',           '0355677788', 'KhoaDo#2025',       'USER'),
(28, 'Phan Gia Hân',         'han.phan@gmail.com',          '0794777889', 'HanPhan!456',       'USER'),
(29, 'Đặng Khả Nhi',         'nhi.dang@gmail.com',          '0814666999', 'NhiDang@2025',      'USER'),
(30, 'Vũ Thanh Phong',       'phong.vu@gmail.com',          '0844555666', 'PhongVu#abc',       'USER'),
-- 31: ADMIN 
(31, NULL,                   'admin@gmail.com',              '0901999000', 'Admin#2025!',       'ADMIN');

-- Addresses (aligned to table structure)
INSERT INTO ecommerce.address (address_id, user_id, street_number, address_line) VALUES
(1 , 1 , '12', 'Đường Lê Lợi, P. Bến Nghé, TP. Hồ Chí Minh'),
(2 , 2 , '45', 'Đường Trần Hưng Đạo, P. Phú Nhuận, TP. Hồ Chí Minh'),
(3 , 3 , '78', 'Đường Nguyễn Trãi, P. Mỹ Đình, Hà Nội'),
(4 , 4 , '21', 'Đường Hoàng Diệu, P. Hải Châu 1, Đà Nẵng'),
(5 , 5 , '56', 'Đường Trần Phú, P. Lộc Thọ, Nha Trang'),
(6 , 6 , '33', 'Đường Điện Biên Phủ, P. 25, TP. Hồ Chí Minh'),
(7 , 7 , '14', 'Đường Nguyễn Huệ, P. Bến Nghé, TP. Hồ Chí Minh'),
(8 , 8 , '90', 'Đường Lý Thường Kiệt, P. Cửa Nam, Hà Nội'),
(9 , 9 , '27', 'Đường Bạch Đằng, P. Hải Châu 2, Đà Nẵng'),
(10,10 , '63', 'Đường Nguyễn Thái Học, P. Phước Tiến, Nha Trang'),
(11,11 , '18', 'Đường Quang Trung, P. Hồng Bàng, Hải Phòng'),
(12,12 , '52', 'Đường Cách Mạng Tháng 8, P. An Thới, Cần Thơ'),
(13,13 , '36', 'Đường Hùng Vương, P. Trường An, Huế'),
(14,14 , '11', 'Đường Lê Duẩn, P. Tràng Tiền, Hà Nội'),
(15,15 , '75', 'Đường 30/4, P. Hưng Lợi, Cần Thơ'),
(16,16 , '29', 'Đường Trần Quang Khải, P. Thống Nhất, Biên Hòa'),
(17,17 , '44', 'Đường Nguyễn Công Trứ, P. Vĩnh Ninh, Huế'),
(18,18 , '68', 'Đường Phan Chu Trinh, P. Hải Cảng, Quy Nhơn'),
(19,19 , '22', 'Đường Nguyễn Văn Cừ, P. An Khánh, Cần Thơ'),
(20,20 , '39', 'Phố Huế, P. Phố Huế, Hà Nội'),
(21,21 , '47', 'Đường Trường Chinh, P. Tây Thạnh, TP. Hồ Chí Minh'),
(22,22 , '58', 'Đường Võ Văn Tần, P. 6, TP. Hồ Chí Minh'),
(23,23 , '13', 'Đường Kim Mã, P. Kim Mã, Hà Nội'),
(24,24 , '41', 'Đường Nguyễn Trãi, P. Lộc Thọ, Nha Trang'),
(25,25 , '24', 'Đường Nguyễn Đình Chiểu, P. Đa Kao, TP. Hồ Chí Minh'),
(26,26 , '34', 'Đường Lạch Tray, P. Lạch Tray, Hải Phòng'),
(27,27 , '55', 'Đường Trần Hưng Đạo, P. Quyết Thắng, Biên Hòa'),
(28,28 , '17', 'Đường Bà Triệu, P. Vĩnh Ninh, Huế'),
(29,29 , '66', 'Đường Nguyễn Thị Minh Khai, P. Bến Thành, TP. Hồ Chí Minh'),
(30,30 , '19', 'Đường Phạm Văn Đồng, P. Dịch Vọng, Hà Nội');

-- Products
INSERT INTO ecommerce.product (product_id, category_id, name, description, product_image) VALUES
(1 , 1 , 'Áo thun trơn trắng',         'Áo thun cotton 100%, trơn màu trắng, chất vải dày mịn, thấm hút mồ hôi tốt, ảnh mặt trước áo trơn.', '1a.png'),
(2 , 1 , 'Áo thun trơn đen',           'Áo thun cotton màu đen, trơn, form rộng unisex, ảnh mặt trước áo trơn.', '2a.png'),
(3 , 1 , 'Áo thun trơn nâu',           'Áo thun cotton màu nâu đất, không in hình, phong cách tối giản.', '3a.png'),
(4 , 1 , 'Áo thun trơn hồng',          'Áo thun cotton màu hồng pastel, trơn, mềm mại, phù hợp nữ.', '4a.png'),
(5 , 1 , 'Áo thun trơn xám',           'Áo thun cotton màu xám nhạt, trơn, dễ phối đồ, form basic.', '5a.png'),
(6 , 1 , 'Áo thun trơn xanh nước biển','Áo thun cotton màu xanh nước biển, trơn, chất vải thoáng mát.', '6a.png'),
(7 , 1 , 'Áo thun trơn xanh lá',       'Áo thun cotton màu xanh lá cây, trơn, năng động và trẻ trung.', '7a.png'),
(8 , 1 , 'Áo thun đen logo hoa cúc',   'Áo thun đen cotton, logo hoa cúc nhỏ in ở ngực trái, ảnh mặt trước logo nhỏ.', '8a.png'),
(9 , 1 , 'Áo thun đen hình Goku',      'Áo thun đen cotton, in hình Goku to chính giữa áo, ảnh mặt trước hình rõ nét.', '9a.png'),
(10, 1 , 'Áo thun đen hình Pepe',      'Áo thun đen cotton, in hình Pepe ở giữa áo, phong cách vui nhộn.', '10a.png'),
(11, 1 , 'Áo thun đỏ hình Goku',       'Áo thun đỏ cotton, in hình Goku ở trung tâm áo, hình in to.', '11a.png'),
(12, 1 , 'Áo thun trơn đỏ',            'Áo thun cotton đỏ, trơn, không hình in, form unisex.', '12a.png'),
(13, 1 , 'Áo thun đỏ hình Guts',       'Áo thun đỏ cotton, in hình Guts (Berserk) giữa áo, ảnh mặt trước hình rõ.', '13a.png'),
(14, 1 , 'Áo thun trắng hình Goku',    'Áo thun trắng cotton, in hình Goku ở giữa ngực, ảnh chính diện.', '14a.png'),
(15, 1 , 'Áo thun đỏ hoa cúc',         'Áo thun đỏ cotton, logo hoa cúc nhỏ in ở ngực trái.', '15a.png'),
(16, 1 , 'Áo thun trắng hoa cúc',      'Áo thun trắng cotton, logo hoa cúc nhỏ in ở ngực trái.', '16a.png'),
(17, 1 , 'Áo thun đen chữ Tokyo',      'Áo thun đen cotton, in chữ “TOKYO” ở giữa áo, phong cách streetwear.', '17a.png'),
(18, 1 , 'Áo thun trắng chữ Seoul',    'Áo thun trắng cotton, in chữ “SEOUL VIBES” chính giữa áo.', '18a.png'),
(19, 1 , 'Áo thun đen oversize',       'Áo thun đen form oversize, không in hình, ảnh mặt trước trơn.', '19a.png'),
(20, 1 , 'Áo thun tie-dye nhiều màu',  'Áo thun cotton nhuộm loang nhiều màu, ảnh mặt trước họa tiết loang.', '20a.png'),
(21, 1 , 'Áo thun trắng cổ tim',       'Áo thun cổ tim, trơn màu trắng, form slimfit, ảnh mặt trước.', '21a.png'),
(22, 1 , 'Áo thun đen cổ tròn',        'Áo thun cổ tròn cổ điển, trơn, vải cotton dày.', '22a.png'),
(23, 1 , 'Áo thun trắng tay lỡ',       'Áo thun tay lỡ form rộng, in nhẹ logo nhỏ giữa áo.', '23a.png'),
(24, 1 , 'Áo thun màu be',             'Áo thun cotton màu be nhạt, không in hình, phong cách tối giản.', '24a.png'),
(25, 1 , 'Áo thun đen in chữ Việt Nam','Áo thun đen cotton, in chữ “VIỆT NAM” trắng to ở giữa áo.', '25a.png'),
(26, 1 , 'Áo thun xám cổ trụ',         'Áo thun polo màu xám, logo nhỏ ở ngực trái.', '26a.png'),
(27, 1 , 'Áo thun trắng cổ trụ',       'Áo polo trắng, vải cotton pha, logo nhỏ bên ngực trái.', '27a.png'),
(28, 1 , 'Áo thun xanh navy cổ trụ',   'Áo polo màu xanh navy, logo nhỏ ngực trái.', '28a.png'),
(29, 1 , 'Áo thun trắng in slogan',    'Áo thun trắng in chữ “KEEP IT SIMPLE” to giữa áo.', '29a.png'),
(30, 1 , 'Áo thun đen in logo nhỏ',    'Áo thun đen cotton, logo nhỏ in bên ngực trái.', '30a.png');

-- Product items
INSERT INTO ecommerce.product_item (product_item_id, product_id, SKU, qty_in_stock, product_image, price) VALUES
(1 , 1 , 'AT-TRON-TRANG',       120, '1a.png', 190000),
(2 , 2 , 'AT-TRON-DEN',         150, '2a.png', 190000),
(3 , 3 , 'AT-TRON-NAU',         80,  '3a.png', 190000),
(4 , 4 , 'AT-TRON-HONG',        90,  '4a.png', 185000),
(5 , 5 , 'AT-TRON-XAM',         100, '5a.png', 185000),
(6 , 6 , 'AT-TRON-XANH-NB',     110, '6a.png', 195000),
(7 , 7 , 'AT-TRON-XANH-LA',     95,  '7a.png', 185000),
(8 , 8 , 'AT-DEN-HOA-CUC',      70,  '8a.png', 250000),
(9 , 9 , 'AT-DEN-GOKU',         60,  '9a.png', 280000),
(10,10 , 'AT-DEN-PEPE',         50,  '10a.png', 260000),
(11,11 , 'AT-DO-GOKU',          55,  '11a.png', 280000),
(12,12 , 'AT-TRON-DO',          120, '12a.png', 190000),
(13,13 , 'AT-DO-GUTS',          50,  '13a.png', 290000),
(14,14 , 'AT-TRANG-GOKU',       65,  '14a.png', 280000),
(15,15 , 'AT-DO-HOA-CUC',       85,  '15a.png', 250000),
(16,16 , 'AT-TRANG-HOA-CUC',    100, '16a.png', 250000),
(17,17 , 'AT-DEN-TOKYO',        90,  '17a.png', 230000),
(18,18 , 'AT-TRANG-SEOUL',      85,  '18a.png', 230000),
(19,19 , 'AT-DEN-OVERSIZE',     200, '19a.png', 200000),
(20,20 , 'AT-TIEDYE',           70,  '20a.png', 300000),
(21,21 , 'AT-COTIM-TRANG',      150, '21a.png', 200000),
(22,22 , 'AT-DEN-COTRON',       160, '22a.png', 200000),
(23,23 , 'AT-TRANG-TAYLO',      90,  '23a.png', 220000),
(24,24 , 'AT-MAUBE',            100, '24a.png', 200000),
(25,25 , 'AT-DEN-VIETNAM',      75,  '25a.png', 250000),
(26,26 , 'AT-XAM-COTRU',        80,  '26a.png', 230000),
(27,27 , 'AT-TRANG-COTRU',      90,  '27a.png', 230000),
(28,28 , 'AT-NAVY-COTRU',       95,  '28a.png', 230000),
(29,29 , 'AT-TRANG-SLOGAN',     100, '29a.png', 240000),
(30,30 , 'AT-DEN-LOGONHO',      130, '30a.png', 250000);

-- Orders
INSERT INTO ecommerce.shop_order
(order_id, user_id, payment_type_name, payment_provider, payment_account_number,
 payment_status, payment_date, shipping_method_name, shipping_price,
 order_status, order_date, order_total)
VALUES
(1 , 3 , 'Thẻ tín dụng', 'VISA', '4111111111111111', 'Đã thanh toán', CURRENT_TIMESTAMP - INTERVAL '30 day', 'Giao hàng tiêu chuẩn', 25000, 'Đã giao', CURRENT_TIMESTAMP - INTERVAL '27 day', 255000),
(2 , 4 , 'Ví điện tử', 'Momo', '0989123456', 'Đã thanh toán', CURRENT_TIMESTAMP - INTERVAL '28 day', 'Giao nhanh', 35000, 'Đang giao', CURRENT_TIMESTAMP - INTERVAL '26 day', 290000),
(3 , 5 , 'Chuyển khoản', 'Techcombank', '1903219988888', 'Đã thanh toán', CURRENT_TIMESTAMP - INTERVAL '25 day', 'Giao hàng tiêu chuẩn', 25000, 'Đã giao', CURRENT_TIMESTAMP - INTERVAL '23 day', 310000),
(4 , 6 , 'Thanh toán khi nhận hàng', 'COD', NULL, 'Chờ thanh toán', NULL, 'Giao hàng tiêu chuẩn', 25000, 'Đang xử lý', CURRENT_TIMESTAMP - INTERVAL '22 day', 215000),
(5 , 7 , 'Thẻ tín dụng', 'MasterCard', '5555555555554444', 'Đã thanh toán', CURRENT_TIMESTAMP - INTERVAL '21 day', 'Giao nhanh', 35000, 'Đã giao', CURRENT_TIMESTAMP - INTERVAL '19 day', 320000),
(6 , 8 , 'Ví điện tử', 'ZaloPay', '0908999222', 'Đã thanh toán', CURRENT_TIMESTAMP - INTERVAL '20 day', 'Giao hàng tiêu chuẩn', 25000, 'Đã giao', CURRENT_TIMESTAMP - INTERVAL '18 day', 260000),
(7 , 9 , 'Thẻ tín dụng', 'VISA', '4111222233334444', 'Đã thanh toán', CURRENT_TIMESTAMP - INTERVAL '19 day', 'Giao nhanh', 35000, 'Đang giao', CURRENT_TIMESTAMP - INTERVAL '17 day', 275000),
(8 , 10, 'Ví điện tử', 'ShopeePay', '0903777333', 'Đã thanh toán', CURRENT_TIMESTAMP - INTERVAL '18 day', 'Giao hàng tiêu chuẩn', 25000, 'Đã giao', CURRENT_TIMESTAMP - INTERVAL '16 day', 210000),
(9 , 11, 'Chuyển khoản', 'Vietcombank', '1019988777', 'Đã thanh toán', CURRENT_TIMESTAMP - INTERVAL '17 day', 'Giao hàng tiêu chuẩn', 25000, 'Đã giao', CURRENT_TIMESTAMP - INTERVAL '15 day', 295000),
(10, 12, 'Thẻ ghi nợ', 'JCB', '3530111333300000', 'Đã thanh toán', CURRENT_TIMESTAMP - INTERVAL '16 day', 'Giao nhanh', 35000, 'Đang xử lý', CURRENT_TIMESTAMP - INTERVAL '14 day', 330000),
(11, 13, 'Ví điện tử', 'Momo', '0905666888', 'Đã thanh toán', CURRENT_TIMESTAMP - INTERVAL '15 day', 'Giao hàng tiêu chuẩn', 25000, 'Đã giao', CURRENT_TIMESTAMP - INTERVAL '13 day', 285000),
(12, 14, 'Thẻ tín dụng', 'VISA', '4111333344445555', 'Đã thanh toán', CURRENT_TIMESTAMP - INTERVAL '14 day', 'Giao nhanh', 35000, 'Đang giao', CURRENT_TIMESTAMP - INTERVAL '12 day', 320000),
(13, 15, 'Ví điện tử', 'Momo', '0905222111', 'Đã thanh toán', CURRENT_TIMESTAMP - INTERVAL '13 day', 'Giao hàng tiêu chuẩn', 25000, 'Đã giao', CURRENT_TIMESTAMP - INTERVAL '11 day', 270000),
(14, 16, 'Chuyển khoản', 'Agribank', '220011110000', 'Đã thanh toán', CURRENT_TIMESTAMP - INTERVAL '12 day', 'Giao nhanh', 35000, 'Đã giao', CURRENT_TIMESTAMP - INTERVAL '10 day', 310000),
(15, 17, 'Thẻ tín dụng', 'VISA', '4000000000000002', 'Đã thanh toán', CURRENT_TIMESTAMP - INTERVAL '11 day', 'Giao hàng tiêu chuẩn', 25000, 'Đã giao', CURRENT_TIMESTAMP - INTERVAL '9 day', 260000),
(16, 18, 'Ví điện tử', 'ZaloPay', '0909999000', 'Đã thanh toán', CURRENT_TIMESTAMP - INTERVAL '10 day', 'Giao nhanh', 35000, 'Đang giao', CURRENT_TIMESTAMP - INTERVAL '8 day', 275000),
(17, 19, 'Chuyển khoản', 'MB Bank', '9704228888888', 'Đã thanh toán', CURRENT_TIMESTAMP - INTERVAL '9 day', 'Giao hàng tiêu chuẩn', 25000, 'Đã giao', CURRENT_TIMESTAMP - INTERVAL '7 day', 300000),
(18, 20, 'Thẻ tín dụng', 'MasterCard', '5105105105105100', 'Đã thanh toán', CURRENT_TIMESTAMP - INTERVAL '8 day', 'Giao nhanh', 35000, 'Đang giao', CURRENT_TIMESTAMP - INTERVAL '6 day', 315000),
(19, 21, 'Ví điện tử', 'Momo', '0909777666', 'Đã thanh toán', CURRENT_TIMESTAMP - INTERVAL '7 day', 'Giao hàng tiêu chuẩn', 25000, 'Đã giao', CURRENT_TIMESTAMP - INTERVAL '5 day', 295000),
(20, 22, 'Thanh toán khi nhận hàng', 'COD', NULL, 'Chờ thanh toán', NULL, 'Giao hàng tiêu chuẩn', 25000, 'Đang xử lý', CURRENT_TIMESTAMP - INTERVAL '4 day', 220000),
(21, 23, 'Thẻ tín dụng', 'VISA', '4111444455556666', 'Đã thanh toán', CURRENT_TIMESTAMP - INTERVAL '4 day', 'Giao nhanh', 35000, 'Đang giao', CURRENT_TIMESTAMP - INTERVAL '3 day', 310000),
(22, 24, 'Ví điện tử', 'ShopeePay', '0903888999', 'Đã thanh toán', CURRENT_TIMESTAMP - INTERVAL '3 day', 'Giao hàng tiêu chuẩn', 25000, 'Đang giao', CURRENT_TIMESTAMP - INTERVAL '2 day', 265000),
(23, 25, 'Chuyển khoản', 'Techcombank', '1903123456789', 'Đã thanh toán', CURRENT_TIMESTAMP - INTERVAL '2 day', 'Giao hàng tiêu chuẩn', 25000, 'Đã giao', CURRENT_TIMESTAMP - INTERVAL '1 day', 285000),
(24, 26, 'Ví điện tử', 'Momo', '0909123123', 'Đã thanh toán', CURRENT_TIMESTAMP - INTERVAL '1 day', 'Giao hàng tiêu chuẩn', 25000, 'Đang xử lý', CURRENT_TIMESTAMP, 250000),
(25, 27, 'Thẻ tín dụng', 'VISA', '4000000000000005', 'Đã thanh toán', CURRENT_TIMESTAMP - INTERVAL '1 day', 'Giao nhanh', 35000, 'Đã giao', CURRENT_TIMESTAMP, 295000),
(26, 28, 'Ví điện tử', 'ZaloPay', '0909456789', 'Đã thanh toán', CURRENT_TIMESTAMP - INTERVAL '1 day', 'Giao hàng tiêu chuẩn', 25000, 'Đã giao', CURRENT_TIMESTAMP, 280000),
(27, 29, 'Thẻ ghi nợ', 'JCB', '3530111333300009', 'Đã thanh toán', CURRENT_TIMESTAMP, 'Giao nhanh', 35000, 'Đang giao', CURRENT_TIMESTAMP, 310000),
(28, 30, 'Ví điện tử', 'ShopeePay', '0904777666', 'Đã thanh toán', CURRENT_TIMESTAMP, 'Giao hàng tiêu chuẩn', 25000, 'Đã giao', CURRENT_TIMESTAMP, 290000),
(29, 19, 'Chuyển khoản', 'VietinBank', '1009999999', 'Đã thanh toán', CURRENT_TIMESTAMP, 'Giao hàng tiêu chuẩn', 25000, 'Đang xử lý', CURRENT_TIMESTAMP, 270000),
(30, 20, 'Thanh toán khi nhận hàng', 'COD', NULL, 'Chờ thanh toán', NULL, 'Giao hàng tiêu chuẩn', 25000, 'Đang xử lý', CURRENT_TIMESTAMP, 215000);

-- Order lines
INSERT INTO ecommerce.order_line (order_line_id, product_item_id, order_id, qty, price, custom_product_id) VALUES
(1 ,  1 , 1 , 1 , 190000, NULL),
(2 ,  8 , 2 , 1 , 250000, NULL),
(3 ,  9 , 3 , 1 , 280000, NULL),
(4 ,  5 , 4 , 1 , 185000, NULL),
(5 , 11 , 5 , 1 , 280000, NULL),
(6 ,  2 , 6 , 1 , 190000, NULL),
(7 , 10 , 7 , 1 , 260000, NULL),
(8 ,  4 , 8 , 1 , 185000, NULL),
(9 ,  6 , 9 , 1 , 195000, NULL),
(10, 12 ,10 , 1 , 190000, NULL),
(11, 13 ,11 , 1 , 290000, NULL),
(12, 14 ,12 , 1 , 280000, NULL),
(13,  7 ,13 , 1 , 185000, NULL),
(14, 15 ,14 , 1 , 250000, NULL),
(15, 16 ,15 , 1 , 250000, NULL),
(16, 17 ,16 , 1 , 230000, NULL),
(17, 18 ,17 , 1 , 230000, NULL),
(18, 19 ,18 , 1 , 200000, NULL),
(19, 20 ,19 , 1 , 300000, NULL),
(20, 21 ,20 , 1 , 200000, NULL),
(21, 22 ,21 , 1 , 200000, NULL),
(22, 23 ,22 , 1 , 220000, NULL),
(23, 24 ,23 , 1 , 200000, NULL),
(24, 25 ,24 , 1 , 250000, NULL),
(25, 26 ,25 , 1 , 230000, NULL),
(26, 27 ,26 , 1 , 230000, NULL),
(27, 28 ,27 , 1 , 230000, NULL),
(28, 29 ,28 , 1 , 240000, NULL),
(29, 30 ,29 , 1 , 250000, NULL),
(30,  3 ,30 , 1 , 190000, NULL);

-- Reviews
INSERT INTO ecommerce.user_review (review_id, user_id, ordered_product_id, rating_value, comment) VALUES
(1 , 3 , 1 , 5, 'Áo đẹp, vải dày dặn, mặc thoải mái lắm.'),
(2 , 4 , 8 , 4, 'Chất vải ok, logo hoa cúc in rõ, nhưng giao hơi chậm.'),
(3 , 5 , 9 , 5, 'Hình Goku in rất đẹp, màu chuẩn như hình.'),
(4 , 6 , 5 , 4, 'Áo thun trơn xám dễ phối đồ, vải hơi mỏng một chút.'),
(5 , 7 , 11, 5, 'Áo đỏ Goku nhìn ngoài còn đẹp hơn ảnh.'),
(6 , 8 , 2 , 4, 'Áo đen basic, chất lượng ổn, form vừa vặn.'),
(7 , 9 , 10, 5, 'Hình Pepe dễ thương, vải co giãn tốt.'),
(8 , 10, 4 , 4, 'Áo hồng pastel nhẹ nhàng, giao hàng nhanh.'),
(9 , 11, 6 , 5, 'Màu xanh navy sang trọng, form áo đẹp.'),
(10, 12, 12, 5, 'Áo đỏ trơn đơn giản mà chất lượng tốt.'),
(11, 13, 13, 5, 'Hình in Guts cực chất, fan Berserk ưng lắm!'),
(12, 14, 14, 4, 'Áo trắng in Goku đẹp, nhưng hơi dễ dính bẩn.'),
(13, 15, 15, 5, 'Áo đỏ hoa cúc xinh, vải mịn, logo nhỏ tinh tế.'),
(14, 16, 16, 5, 'Áo trắng hoa cúc form chuẩn, logo sắc nét.'),
(15, 17, 17, 4, 'Áo đen in chữ Tokyo khá ngầu, hơi dày xíu.'),
(16, 18, 18, 5, 'Áo trắng chữ Seoul đẹp, form rộng, mặc mát.'),
(17, 19, 19, 5, 'Áo oversize cực kỳ thoải mái, đúng kiểu mình thích.'),
(18, 20, 20, 5, 'Áo tie-dye màu siêu đẹp, nhìn rất nổi bật.'),
(19, 21, 21, 4, 'Áo cổ tim form đẹp, chất vải ổn, mặc mát.'),
(20, 22, 22, 5, 'Áo đen cổ tròn cơ bản nhưng cực kỳ dễ phối.'),
(21, 23, 23, 5, 'Áo tay lỡ phong cách Hàn, mặc nhìn trẻ ra hẳn.'),
(22, 24, 24, 4, 'Áo màu be nhã nhặn, đường may chắc chắn.'),
(23, 25, 25, 5, 'Áo in chữ Việt Nam cực đẹp, ý nghĩa, vải mịn.'),
(24, 26, 26, 4, 'Áo polo xám form vừa, cổ đứng, mặc đi làm hợp.'),
(25, 27, 27, 5, 'Áo polo trắng tinh tế, logo nhỏ đẹp.'),
(26, 28, 28, 5, 'Áo polo navy sang, logo thêu rất chắc chắn.'),
(27, 29, 29, 5, 'Áo slogan tối giản, in rõ ràng, rất ưng.'),
(28, 30, 30, 5, 'Áo đen logo nhỏ nhìn đơn giản mà sang.'),
(29, 20, 7 , 4, 'Áo xanh lá tươi, chất ổn, mặc thoáng mát.'),
(30, 23, 3 , 5, 'Áo nâu vintage, chất dày, form rộng vừa đẹp.');

-- Carts (deduped so each user has at most one cart)
INSERT INTO ecommerce.shopping_cart (cart_id, user_id) VALUES
(1 ,  3 ),
(2 ,  4 ),
(3 ,  5 ),
(4 ,  6 ),
(5 ,  7 ),
(6 ,  8 ),
(7 ,  9 ),
(8 , 10 ),
(9 , 11 ),
(10, 12 ),
(11, 13 ),
(12, 14 ),
(13, 15 ),
(14, 16 ),
(15, 17 ),
(16, 18 ),
(17, 19 ),
(18, 20 ),
(19, 21 ),
(20, 22 ),
(21, 23 ),
(22, 24 ),
(23, 25 ),
(24, 26 ),
(25, 27 ),
(26, 28 ),
(27, 29 ),
(28, 30 );

-- Cart items
INSERT INTO ecommerce.shopping_cart_item (cart_item_id, cart_id, product_item_id, qty) VALUES
(1 ,  1 ,  1 , 2),
(2 ,  2 ,  2 , 1),
(3 ,  3 ,  8 , 1),
(4 ,  4 ,  9 , 1),
(5 ,  5 ,  5 , 2),
(6 ,  6 , 11 , 1),
(7 ,  7 , 10 , 2),
(8 ,  8 ,  4 , 1),
(9 ,  9 ,  6 , 2),
(10, 10 , 12 , 1),
(11, 11 , 13 , 1),
(12, 12 , 14 , 1),
(13, 13 , 15 , 2),
(14, 14 , 16 , 1),
(15, 15 , 17 , 1),
(16, 16 , 18 , 2),
(17, 17 , 19 , 1),
(18, 18 , 20 , 1),
(19, 19 , 21 , 1),
(20, 20 , 22 , 2),
(21, 21 , 23 , 1),
(22, 22 , 24 , 1),
(23, 23 , 25 , 2),
(24, 24 , 26 , 1),
(25, 25 , 27 , 2),
(26, 26 , 28 , 1),
(27, 27 , 29 , 1),
(28, 28 , 30 , 1);

-- Custom products (aligned to table cols)
INSERT INTO ecommerce.custom_product 
(custom_product_id, product_item_id, user_id, custom_name, custom_image_url, created_at) VALUES
(1 , 1 , 3 ,  'Áo Hello World',     'cp1.png',  CURRENT_TIMESTAMP - INTERVAL '25 day'),
(2 , 2 , 4 ,  'Áo Stay Cool',        'cp2.png',  CURRENT_TIMESTAMP - INTERVAL '23 day'),
(3 , 3 , 5 ,  'Áo Brown Mood',       'cp3.png',  CURRENT_TIMESTAMP - INTERVAL '21 day'),
(4 , 8 , 6 ,  'Áo Hoa Cúc Peace',    'cp4.png',  CURRENT_TIMESTAMP - INTERVAL '20 day'),
(5 , 9 , 7 ,  'Áo Goku Fire',        'cp5.png',  CURRENT_TIMESTAMP - INTERVAL '18 day'),
(6 , 10, 8 ,  'Áo Pepe Chill',       'cp6.png',  CURRENT_TIMESTAMP - INTERVAL '15 day'),
(7 , 13, 9 ,  'Áo Guts Hero',        'cp7.png',  CURRENT_TIMESTAMP - INTERVAL '14 day'),
(8 , 15, 10,  'Áo Red Daisy',        'cp8.png',  CURRENT_TIMESTAMP - INTERVAL '12 day'),
(9 , 16, 11,  'Áo White Daisy',      'cp9.png',  CURRENT_TIMESTAMP - INTERVAL '10 day'),
(10, 25, 12,  'Áo Việt Nam Pride',   'cp10.png', CURRENT_TIMESTAMP - INTERVAL '8 day'),
(11, 14, 13,  'Áo Goku Spirit',      'cp11.png', CURRENT_TIMESTAMP - INTERVAL '6 day'),
(12, 17, 14,  'Áo Tokyo Style',      'cp12.png', CURRENT_TIMESTAMP - INTERVAL '5 day'),
(13, 18, 15,  'Áo Seoul Vibes',      'cp13.png', CURRENT_TIMESTAMP - INTERVAL '4 day'),
(14, 29, 16,  'Áo Keep It Simple',   'cp14.png', CURRENT_TIMESTAMP - INTERVAL '3 day'),
(15, 20, 17,  'Áo Tie-Dye Art',      'cp15.png', CURRENT_TIMESTAMP - INTERVAL '2 day'),
(16, 22, 18,  'Áo Classic Black',    'cp16.png', CURRENT_TIMESTAMP - INTERVAL '1 day'),
(17, 23, 19,  'Áo Tay Lỡ Chill',     'cp17.png', CURRENT_TIMESTAMP),
(18, 26, 20,  'Áo Polo Xám Elegant', 'cp18.png', CURRENT_TIMESTAMP),
(19, 28, 21,  'Áo Polo Navy Sport',  'cp19.png', CURRENT_TIMESTAMP),
(20, 27, 22,  'Áo Polo Trắng Basic', 'cp20.png', CURRENT_TIMESTAMP);

-- Variations
INSERT INTO ecommerce.variation (variation_id, category_id, name) VALUES
(1, 1, 'Màu sắc'),
(2, 1, 'Kích cỡ');

-- Variation options
INSERT INTO ecommerce.variation_option (variation_option_id, variation_id, value) VALUES
-- Màu sắc
(1 , 1, 'Trắng'),
(2 , 1, 'Đen'),
(3 , 1, 'Đỏ'),
(4 , 1, 'Hồng'),
(5 , 1, 'Xám'),
(6 , 1, 'Nâu'),
(7 , 1, 'Xanh nước biển'),
(8 , 1, 'Xanh lá'),
(9 , 1, 'Navy'),
-- Kích cỡ
(10, 2, 'S'),
(11, 2, 'M'),
(12, 2, 'L'),
(13, 2, 'XL'),
(14, 2, 'XXL');

-- Product configurations
INSERT INTO ecommerce.product_configuration (product_item_id, variation_option_id) VALUES
(1 , 1 ), (1 , 11),
(2 , 2 ), (2 , 12),
(3 , 6 ), (3 , 11),
(4 , 4 ), (4 , 12),
(5 , 5 ), (5 , 11),
(6 , 7 ), (6 , 12),
(7 , 8 ), (7 , 11),
(8 , 2 ), (8 , 12),
(9 , 2 ), (9 , 13),
(10, 2 ), (10, 12),
(11, 3 ), (11, 12),
(12, 3 ), (12, 11),
(13, 3 ), (13, 13),
(14, 1 ), (14, 12),
(15, 3 ), (15, 11),
(16, 1 ), (16, 10),
(17, 2 ), (17, 13),
(18, 1 ), (18, 12),
(19, 2 ), (19, 14),
(20, 1 ), (20, 13),
(21, 1 ), (21, 11),
(22, 2 ), (22, 11),
(23, 1 ), (23, 12),
(24, 5 ), (24, 11),
(25, 2 ), (25, 13),
(26, 5 ), (26, 11),
(27, 1 ), (27, 12),
(28, 9 ), (28, 13),
(29, 1 ), (29, 12),
(30, 2 ), (30, 12);

-- Promotions
INSERT INTO ecommerce.promotion (promotion_id, category_id, name, description, discount_rate, start_date, end_date) VALUES
(1 , 1, 'Ưu đãi tháng 1', 'Giảm 10% toàn bộ áo thun cotton.', 10.00, '2025-01-01', '2025-01-31'),
(2 , 1, 'Sale Valentine', 'Giảm 20% cho áo đôi và áo hoa cúc.', 20.00, '2025-02-10', '2025-02-20'),
(3 , 1, 'Flash Sale 3/3', 'Giảm 33% cho 5 sản phẩm ngẫu nhiên.', 33.00, '2025-03-03', '2025-03-05'),
(4 , 1, 'Ưu đãi 30/4', 'Giảm 25% tất cả áo in hình Goku.', 25.00, '2025-04-20', '2025-05-01'),
(5 , 1, 'Back To School', 'Giảm 15% cho học sinh sinh viên.', 15.00, '2025-08-01', '2025-09-01'),
(6 , 1, 'Giảm cuối năm', 'Ưu đãi 30% toàn shop cuối năm.', 30.00, '2025-12-01', '2025-12-31');

