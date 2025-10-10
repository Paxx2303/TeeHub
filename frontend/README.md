# T-Shirt Store - Trang web bán áo thun với AI

Một ứng dụng web hiện đại để bán áo thun với tính năng thử đồ bằng AI và thiết kế áo thun tùy chỉnh.

## 🚀 Tính năng chính

- **Thử đồ AI**: Sử dụng công nghệ AI để thử áo thun trước khi mua
- **Thiết kế áo thun**: Công cụ thiết kế mạnh mẽ để tạo ra những sản phẩm độc đáo
- **Quản lý sản phẩm**: Hệ thống quản lý sản phẩm đầy đủ
- **Giỏ hàng**: Tính năng giỏ hàng và thanh toán
- **Responsive Design**: Giao diện thân thiện trên mọi thiết bị
- **Dark Mode**: Hỗ trợ chế độ tối

## 🛠️ Công nghệ sử dụng

- **Frontend**: React 19, Vite
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **Styling**: CSS Modules, CSS Variables
- **UI Components**: Custom components với React Icons
- **File Upload**: React Dropzone
- **Notifications**: React Hot Toast
- **Animations**: Framer Motion

## 📁 Cấu trúc dự án

```
src/
├── components/
│   ├── common/
│   │   ├── Header/
│   │   └── Footer/
│   └── ui/
│       ├── Button/
│       ├── Input/
│       ├── Modal/
│       ├── ImageUploader/
│       ├── ColorPicker/
│       └── Canvas/
├── pages/
│   ├── Home/
│   ├── Products/
│   ├── AITryOn/
│   ├── Design/
│   ├── Cart/
│   └── Checkout/
├── hooks/
│   ├── useAuth.js
│   ├── useCart.js
│   ├── useLocalStorage.js
│   └── useApi.js
├── services/
│   ├── api.js
│   ├── authService.js
│   ├── productService.js
│   ├── aiService.js
│   ├── designService.js
│   └── httpClient.js
├── store/
│   ├── slices/
│   │   ├── authSlice.js
│   │   ├── cartSlice.js
│   │   ├── productSlice.js
│   │   ├── aiTryOnSlice.js
│   │   ├── designSlice.js
│   │   └── uiSlice.js
│   └── store.js
├── utils/
│   ├── constants.js
│   ├── helpers.js
│   └── validators.js
├── styles/
│   ├── globals.css
│   ├── variables.css
│   └── mixins.css
└── assets/
    ├── images/
    ├── icons/
    └── fonts/
```

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống

- Node.js >= 18.0.0
- npm >= 8.0.0

### Cài đặt

1. Clone repository:
```bash
git clone <repository-url>
cd perfect_react
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file `.env` từ `env.example`:
```bash
cp env.example .env
```

4. Cấu hình các biến môi trường trong file `.env`

5. Chạy ứng dụng:
```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173`

## 📝 Scripts có sẵn

- `npm run dev` - Chạy ứng dụng ở chế độ development
- `npm run build` - Build ứng dụng cho production
- `npm run preview` - Preview build production
- `npm run lint` - Chạy ESLint để kiểm tra code

## 🎨 Tính năng UI/UX

### Design System
- **Colors**: Hệ thống màu sắc nhất quán với CSS variables
- **Typography**: Font Inter với các kích thước và weight chuẩn
- **Spacing**: Hệ thống spacing 8px grid
- **Components**: Các component tái sử dụng với props linh hoạt

### Responsive Design
- Mobile-first approach
- Breakpoints: 640px, 768px, 1024px, 1280px, 1536px
- Flexible grid system
- Touch-friendly interface

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus management
- Color contrast compliance

## 🔧 Cấu hình

### Environment Variables

Tạo file `.env` với các biến sau:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3001/api

# AI Service Configuration
VITE_AI_SERVICE_URL=https://api.ai-service.com
VITE_AI_API_KEY=your_ai_api_key_here

# File Upload Configuration
VITE_MAX_FILE_SIZE=5242880
VITE_ALLOWED_FILE_TYPES=image/jpeg,image/jpg,image/png,image/webp
```

### Redux Store

Store được cấu hình với các slices:
- `auth`: Quản lý authentication
- `cart`: Quản lý giỏ hàng
- `products`: Quản lý sản phẩm
- `aiTryOn`: Quản lý AI try-on
- `design`: Quản lý thiết kế
- `ui`: Quản lý UI state

## 🧪 Testing

```bash
# Chạy tests (khi có)
npm test

# Chạy tests với coverage
npm run test:coverage
```

## 📦 Build và Deploy

### Build cho production

```bash
npm run build
```

Files build sẽ được tạo trong thư mục `dist/`

### Deploy

Có thể deploy lên các platform:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Liên hệ

- Email: info@tshirtstore.com
- Website: https://tshirtstore.com

## 🙏 Acknowledgments

- React team cho framework tuyệt vời
- Redux team cho state management
- React Router team cho routing
- Tất cả contributors của các thư viện open source được sử dụng