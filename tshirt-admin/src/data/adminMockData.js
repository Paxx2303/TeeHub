// src/data/adminMockData.js

export const adminMockData = {
  stats: {
    totalRevenue: '2.450.000.000đ',
    totalOrders: 1248,
    totalProducts: 156,
    totalUsers: 3429
  },

  recentOrders: [
    {
      id: '#TS001',
      customer: 'Nguyễn Văn An',
      product: 'Áo Thun Basic Trắng',
      quantity: 2,
      total: '398.000đ',
      status: 'completed',
      date: '2024-09-26',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=60&h=60&fit=crop'
    },
    {
      id: '#TS002',
      customer: 'Trần Thị Bình',
      product: 'Áo Thun Vintage Đen',
      quantity: 1,
      total: '249.000đ',
      status: 'pending',
      date: '2024-09-26',
      image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=60&h=60&fit=crop'
    },
    {
      id: '#TS003',
      customer: 'Lê Minh Châu',
      product: 'Áo Thun Oversize Xám',
      quantity: 3,
      total: '897.000đ',
      status: 'shipping',
      date: '2024-09-25',
      image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=60&h=60&fit=crop'
    },
    {
      id: '#TS004',
      customer: 'Phạm Đức Nam',
      product: 'Áo Thun Premium Black',
      quantity: 1,
      total: '399.000đ',
      status: 'completed',
      date: '2024-09-25',
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=60&h=60&fit=crop'
    },
    {
      id: '#TS005',
      customer: 'Hoàng Thị Mai',
      product: 'Áo Thun Limited Edition',
      quantity: 2,
      total: '798.000đ',
      status: 'cancelled',
      date: '2024-09-24',
      image: 'https://images.unsplash.com/photo-1583743814966-8936f37f4036?w=60&h=60&fit=crop'
    }
  ],

  topProducts: [
    {
      id: 1,
      name: 'Áo Thun Basic Trắng',
      sales: 234,
      revenue: '46.800.000đ',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=60&h=60&fit=crop'
    },
    {
      id: 2,
      name: 'Áo Thun Vintage Đen',
      sales: 189,
      revenue: '47.061.000đ',
      image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=60&h=60&fit=crop'
    },
    {
      id: 3,
      name: 'Áo Thun Oversize Xám',
      sales: 156,
      revenue: '46.644.000đ',
      image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=60&h=60&fit=crop'
    },
    {
      id: 4,
      name: 'Áo Thun Premium Black',
      sales: 142,
      revenue: '56.658.000đ',
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=60&h=60&fit=crop'
    }
  ],

  products: [
    {
      id: 1,
      name: 'Áo Thun Basic Trắng',
      price: '199.000đ',
      stock: 45,
      sold: 234,
      category: 'Basic',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=80&h=80&fit=crop'
    },
    {
      id: 2,
      name: 'Áo Thun Vintage Đen',
      price: '249.000đ',
      stock: 23,
      sold: 189,
      category: 'Vintage',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=80&h=80&fit=crop'
    },
    {
      id: 3,
      name: 'Áo Thun Oversize Xám',
      price: '299.000đ',
      stock: 0,
      sold: 156,
      category: 'Oversize',
      status: 'out_of_stock',
      image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=80&h=80&fit=crop'
    },
    {
      id: 4,
      name: 'Áo Thun Premium Black',
      price: '399.000đ',
      stock: 67,
      sold: 142,
      category: 'Premium',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=80&h=80&fit=crop'
    },
    {
      id: 5,
      name: 'Áo Thun Limited Edition',
      price: '499.000đ',
      stock: 12,
      sold: 98,
      category: 'Limited',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1583743814966-8936f37f4036?w=80&h=80&fit=crop'
    },
    {
      id: 6,
      name: 'Áo Thun Polo Classic',
      price: '329.000đ',
      stock: 34,
      sold: 76,
      category: 'Polo',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=80&h=80&fit=crop'
    },
    {
      id: 7,
      name: 'Áo Thun Graphic Print',
      price: '279.000đ',
      stock: 8,
      sold: 124,
      category: 'Graphic',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=80&h=80&fit=crop'
    },
    {
      id: 8,
      name: 'Áo Thun V-Neck Navy',
      price: '219.000đ',
      stock: 0,
      sold: 67,
      category: 'Basic',
      status: 'out_of_stock',
      image: 'https://images.unsplash.com/photo-1618453292282-c636d2195cb0?w=80&h=80&fit=crop'
    }
  ],

  users: [
    {
      id: 1,
      name: 'Nguyễn Văn An',
      email: 'nguyenvanan@email.com',
      phone: '0123456789',
      orders: 12,
      totalSpent: '2.400.000đ',
      joinDate: '2024-01-15',
      status: 'active',
      lastOrder: '2024-09-26'
    },
        {
          id: 2,
          name: 'Trần Thị Bình',
          email: 'tranthib@email.com',
          phone: '0987654321',
          orders: 8,
          totalSpent: '1.200.000đ',
          joinDate: '2024-03-22',
          status: 'active',
          lastOrder: '2024-09-26'
        }
      ]
    };