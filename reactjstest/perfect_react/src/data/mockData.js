// src/data/mockData.js

export const userData = {
  name: 'Nguyễn Văn An',
  email: 'nguyenvanan@email.com',
  phone: '0123456789',
  address: '123 Đường ABC, Quận 1, TP.HCM',
  birthDate: '15/08/1995',
  gender: 'Nam'
};

export const ordersData = [
  {
    id: '#TS001',
    date: '25/09/2024',
    status: 'Đã giao',
    total: '450.000đ',
    items: 2,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=60&h=60&fit=crop'
  },
  {
    id: '#TS002', 
    date: '20/09/2024',
    status: 'Đang giao',
    total: '320.000đ',
    items: 1,
    image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=60&h=60&fit=crop'
  },
  {
    id: '#TS003',
    date: '15/09/2024', 
    status: 'Đã hủy',
    total: '280.000đ',
    items: 1,
    image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=60&h=60&fit=crop'
  }
];

export const favoritesData = [
  {
    id: 1,
    name: 'Áo Thun Basic Trắng',
    price: '199.000đ',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop'
  },
  {
    id: 2,
    name: 'Áo Thun Vintage Đen',
    price: '249.000đ',
    image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=200&h=200&fit=crop'
  },
  {
    id: 3,
    name: 'Áo Thun Oversize Xám',
    price: '299.000đ',
    image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=200&h=200&fit=crop'
  }
];