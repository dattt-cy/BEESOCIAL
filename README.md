# 💻 DevShare Lite

Một mạng xã hội hiện đại, nơi người dùng có thể kết nối, chia sẻ nội dung, tương tác và xây dựng cộng đồng trực tuyến.

## 👨‍💻 Thông tin tác giả

-   **Trường**: Đại Học Bách Khoa Đại Học Đà Nẵng
-   **MSSV**: 102230063
-   **Họ tên**: Hoàng Văn Tấn Đạt

## 📋 Tổng quan dự án

**DevShare Lite** là một mạng xã hội được thiết kế để cho phép người dùng kết nối với bạn bè, chia sẻ nội dung cá nhân và tương tác trong một cộng đồng trực tuyến. Nền tảng tập trung vào việc tạo ra một môi trường mạng xã hội thân thiện và dễ sử dụng với các tính năng:

### 🎯 Chức năng chính đã thực hiện

#### 📝 Chia sẻ nội dung đa phương tiện

-   **Tạo bài viết**: Hỗ trợ Rich Text Editor cho nội dung phong phú
-   **Media upload**: Hỗ trợ hình ảnh, video (tích hợp Cloudinary)
-   **Chỉnh sửa**: Edit và xóa bài viết của chính mình

#### 💬 Hệ thống tương tác xã hội

-   **Comment threading**: Bình luận phân cấp đa cấp độ
-   **Like/Unlike**: Thả tim cho bài viết và bình luận
-   **Share**: Chia sẻ bài viết của người khác
-   **Reply**: Phản hồi và thảo luận

#### 👥 Kết nối cộng đồng

-   **Hệ thống tài khoản**: Đăng ký và quản lý profile cá nhân
-   **Profile management**: Quản lý thông tin cá nhân, avatar, background
-   **Follow system**: Theo dõi và kết nối với người dùng khác

#### 🔍 Khám phá và kết nối

-   **Newsfeed**: Feed bài viết từ bạn bè và người theo dõi
-   **Advanced search**: Tìm kiếm người dùng và bài viết
-   **Responsive design**: Tối ưu cho mobile và desktop
-   **Real-time interactions**: Cập nhật tương tác theo thời gian thực

## 🚀 Công nghệ sử dụng

### Frontend (`frontend`)

| Công nghệ             | Phiên bản | Lý do lựa chọn                                         |
| --------------------- | --------- | ------------------------------------------------------ |
| **Next.js**           | 14+       | Framework React modern với SSR/SSG, tối ưu performance |
| **TypeScript**        | Latest    | Type safety, giảm bug runtime, IDE support tốt         |
| **Material-UI (MUI)** | v5        | Component library phong phú, design system nhất quán   |
| **React Context API** | Built-in  | State management đơn giản, phù hợp với quy mô dự án    |
| **ReactQuill**        | Latest    | Rich text editor mạnh mẽ cho việc tạo nội dung         |
| **Axios**             | Latest    | HTTP client với interceptors, xử lý JWT tự động        |
| **Cloudinary**        | SDK       | Cloud storage cho media, tối ưu hình ảnh tự động       |

### Backend (`backend`)

| Công nghệ      | Phiên bản | Lý do lựa chọn                                     |
| -------------- | --------- | -------------------------------------------------- |
| **Node.js**    | 18+       | JavaScript runtime hiệu suất cao, cộng đồng lớn    |
| **Express.js** | Latest    | Web framework nhẹ, dễ cấu hình và mở rộng          |
| **MongoDB**    | Latest    | NoSQL database linh hoạt, phù hợp với social media |
| **Mongoose**   | Latest    | ODM cho MongoDB, schema validation mạnh mẽ         |
| **JWT**        | Latest    | Authentication stateless, bảo mật và scalable      |
| **Multer**     | Latest    | Middleware xử lý file upload                       |
| **bcryptjs**   | Latest    | Hash password an toàn                              |

## 📁 Cấu trúc thư mục dự án

### Frontend Structure (`frontend`)

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── home/              # Trang chủ với pagination
│   │   ├── login/             # Đăng nhập
│   │   ├── profile/           # Trang profile người dùng
│   │   ├── register/          # Đăng ký tài khoản
│   │   ├── search/            # Tìm kiếm với tabs
│   │   ├── verify/            # Xác thực tài khoản
│   │   ├── favicon.ico        # Icon trang web
│   │   └── layout.tsx         # Root layout
│   ├── assets/                # Static assets
│   ├── authorization/         # Authorization logic
│   ├── axios/                 # Axios configuration
│   ├── components/            # Reusable components
│   │   ├── ButtonFollow/      # Button theo dõi
│   │   ├── Comment/           # Comment components
│   │   ├── common/            # Shared components
│   │   ├── Posts/             # Post-related components
│   │   ├── SearchResult/      # Kết quả tìm kiếm
│   │
│   ├── config/                # Configuration files (urlConfig.ts)
│   ├── context/               # React Context providers
│   ├── hooks/                 # Custom hooks
│   ├── layouts/               # Layout components
│   ├── libs/                  # Library configurations
│   ├── locales/               # Internationalization
│   ├── providers/             # React providers
│   ├── styles/                # CSS styles
│   ├── theme/                 # Theme configuration
│   ├── types/                 # TypeScript definitions
│   └── utils/                 # Utility functions
├── public/                    # Public static files
├── .env                       # Environment variables
├── next.config.js             # Next.js configuration
├── package.json               # Dependencies
├── tailwind.config.js         # Tailwind CSS config
└── tsconfig.json              # TypeScript config
```

### Backend Structure (`backend`)

```
backend/
├── controllers/                # Route controllers
│   ├── authController.js       # Authentication logic
│   ├── commentController.js    # Comment handling
│   ├── errorController.js      # Error handling
│   ├── handlerFactory.js       # Factory pattern for CRUD
│   ├── postController.js       # Post CRUD operations
│   ├── searchController.js     # Search functionality
│   └── userController.js       # User management
├── models/                     # MongoDB models
│   ├── commentLikeModel.js     # Comment like schema
│   ├── commentModel.js         # Comment schema
│   ├── likePostModel.js        # Post like schema
│   ├── postModel.js            # Post schema
│   ├── profileModel.js         # User profile schema
│   ├── sharePostModel.js       # Share post schema
│   └── userModel.js            # User schema
├── routes/                     # API routes definition
│   ├── commentRoutes.js        # Comment endpoints
│   ├── postRoutes.js           # Post endpoints
│   ├── searchRoutes.js         # Search endpoints
│   └── userRoutes.js           # User endpoints
├── services/                   # Business logic
│   ├── authServices.js         # Authentication services
│   ├── commentServices.js      # Comment services
│   ├── handlerFactoryServices.js # Factory services
│   ├── postServices.js         # Post services
│   ├── profileServices.js      # Profile services
│   └── userServices.js         # User services
├── utils/                      # Utility functions
├── node_modules/               # Dependencies
├── public/                     # Static files
├── .gitignore                  # Git ignore rules
├── app.js                      # Express app configuration
├── config.env                  # Environment variables
├── package-lock.json           # Lock file
├── package.json                # Dependencies và scripts
└── server.js                   # Server entry point
```

## 🛠️ Hướng dẫn cài đặt và khởi chạy dự án

### Yêu cầu hệ thống

-   **Node.js**: Phiên bản 18 trở lên
-   **npm** hoặc **yarn**: Package manager
-   **MongoDB**: Database (local hoặc MongoDB Atlas)
-   **Cloudinary Account**: Để upload và quản lý media

### 1. Clone dự án

```bash
git clone [repository-url]
cd DuAnWebBee
```

### 2. Cài đặt Backend

#### Bước 1: Di chuyển vào thư mục backend

```bash
cd backend
```

#### Bước 2: Cài đặt dependencies

```bash
npm install
```

#### Bước 3: Cấu hình environment variables

Tạo file `config.env` trong thư mục backend:

```env
# Server Configuration
NODE_ENV=development
PORT=8000
CLIENT_URL=http://localhost:3000
BASE_URL=http://localhost:8000

# Database Configuration
DATABASE=mongodb+srv://victomblack2020:6vxRXjtvI2o2Qqm5@cluster0.vxdotmt.mongodb.net/bee-social?retryWrites=true&w=majority&appName=Cluster0

# JWT Configuration (localStorage-based)
JWT_SECRET=my-ultra-secure-and-ultra-long-secret
JWT_REFRESH_SECRET=my-ultra-secure-refresh-token-and-ultra-long-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary Configuration
CLOUDINARY_NAME=ds6hdw753
CLOUDINARY_API_KEY=894844815737539
CLOUDINARY_API_SECRET=***************************
CLOUDINARY_URL=cloudinary://${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}@${CLOUDINARY_NAME}

# Pusher Configuration (Real-time)
PUSHER_APP_ID=1726124
PUSHER_KEY=347a18ba158ea55c148d
PUSHER_SECRET=935e6d0a12fb024b0a0c
PUSHER_CLUSTER=ap1

# Timezone
TZ=Asia/Ho_Chi_Minh

```

#### Bước 4: Không cần khởi động MongoDB local

Sử dụng MongoDB Atlas, backend sẽ tự động kết nối đến database cloud.

#### Bước 5: Chạy backend server

```bash
npx nodemon server.js
```

**Note**: Backend sử dụng `nodemon` để auto-restart khi có thay đổi code.

Backend sẽ chạy tại: `http://localhost:8000`

### 3. Cài đặt Frontend

#### Bước 1: Mở terminal mới và di chuyển vào thư mục frontend

```bash
cd frontend
```

#### Bước 2: Cài đặt dependencies

```bash
npm install
```

#### Bước 3: Cấu hình environment variables

Tạo file `.env` trong thư mục frontend:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=gfYnuhTCUrhrVW1l

# API Configuration
NEXT_PUBLIC_BEEGIN_DOMAIN=http://localhost:8000
NEXT_APP_BEEGIN_DOMAIN=http://localhost:8000
NEXT_APP_BEEGIN_URL=http://localhost:3000

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=ds6hdw753
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=buq1gcyi
NEXT_PUBLIC_CLOUDINARY_SECRET=894844815737539
NEXT_PUBLIC_CLOUDINARY_URL=cloudinary://894844815737539:pzc5tM00o5WSt0y6fJSLowI94lc@ds6hdw753

# Pusher Configuration (Real-time)
NEXT_PUBLIC_PUSHER_APP_KEY=347a18ba158ea55c148d
```

#### Bước 4: Chạy frontend server

```bash
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:3000`

## 🚀 Quick Start

### Chạy toàn bộ project (2 terminals):

**Terminal 1 (Backend):**

```bash
cd backend
npx nodemon server.js
```

**Terminal 2 (Frontend):**

```bash
cd frontend
npm run dev
```

### Truy cập ứng dụng:

-   **Frontend**: http://localhost:3000
-   **Backend API**: http://localhost:8000
-   **MongoDB**: Local database `bee-social`

### 🔐 Authentication Flow:

1. **Login**: Frontend gửi credentials → Backend verify → Return JWT tokens
2. **Storage**: Tokens lưu trong `localStorage` (không dùng cookies)
3. **API Calls**: Frontend attach token vào `Authorization` header
4. **Refresh**: Auto refresh token khi gần hết hạn

### 📄 Tóm tắt Files Environment

-   **Backend**: `backend/config.env` (port 8000)
-   **Frontend**: `frontend/.env` (port 3000)
-   **Cloudinary**: Đã cấu hình sẵn trong cả 2 file
-   **Database**: MongoDB Atlas tại `DevShare-lite` (cloud, không cần cài local)
-   **Authentication**: JWT tokens lưu trong localStorage (không dùng cookies)

## 🎯 Features đã implement

### ✅ **Core Features:**

-   **Home page**: Newsfeed hiển thị bài viết từ bạn bè với pagination
-   **Search system**: Tìm kiếm người dùng và bài viết (Top, Latest, User, Media)
-   **Profile system**: Profile cá nhân với [slug] routing động
-   **Authentication**: JWT-based với localStorage
-   **Post management**: Tạo, sửa, xóa bài viết với media upload
-   **Social interactions**: Like, comment, share bài viết
-   **Real-time features**: Pusher integration cho cập nhật thời gian thực

### ✅ **Technical Features:**

-   **Environment-based URLs**: Cấu hình deployment linh hoạt
-   **Responsive design**: Tối ưu cho mobile và desktop
-   **TypeScript**: Type safety trong toàn bộ ứng dụng
-   **Error handling**: Xử lý lỗi và feedback người dùng tốt
-   **File upload**: Tích hợp Cloudinary cho lưu trữ media
