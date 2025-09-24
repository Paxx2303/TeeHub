export const MOCK_PRODUCTS = [
  {
    id: 'demo-tee-001',
    name: 'Áo thun Perfect React',
    price: 199000,
    description:
      'Áo thun cotton 100% mềm mịn, form unisex. Phù hợp in thiết kế AI Try-On. Vải dày dặn, thấm hút tốt, co giãn 4 chiều.',
    image:
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop',
    sku: 'PR-Tee-001',
    stock: 42,
    colors: [
      { code: 'white', name: 'Trắng' },
      { code: 'black', name: 'Đen' },
      { code: 'blue', name: 'Xanh navy' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    specs: [
      { label: 'Chất liệu', value: '100% Cotton Compact' },
      { label: 'Định lượng vải', value: '220 GSM' },
      { label: 'Form', value: 'Unisex Regular' },
      { label: 'Công nghệ in', value: 'DTF/Screen Printing' },
      { label: 'Bảo hành', value: '30 ngày' },
    ],
    care: [
      'Giặt ở nhiệt độ dưới 30°C',
      'Không dùng thuốc tẩy',
      'Lộn trái khi ủi, ủi ở nhiệt độ thấp',
      'Không sấy khô ở nhiệt độ cao',
    ],
  },
];

export function getMockProductById(id) {
  return MOCK_PRODUCTS.find((p) => String(p.id) === String(id));
}

