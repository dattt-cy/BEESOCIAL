# 💻 BEESOCIAL

A modern social network where users can connect, share content, interact, and build online communities.

**Account Test:**

**Gmail**: victomblack1602@gmail.com

**Password**: 123456@@
## 👨‍💻 Author information

-   **School**: University of Science and Technology - The University of Danang
-   **Student ID**: 102230063
-   **Full name**: Hoang Van Tan Dat

## 📋 Project overview

**BEESOCIAL** is a social network designed to allow users to connect with friends, share personal content, and interact within an online community. The platform focuses on creating a friendly and easy-to-use social environment with features:

### 🎯 Main implemented features

#### 🔐 Account management & authentication

-   4-step registration.
-   Login/logout using JWT.
-   Profile management: avatar, background, bio, contact information.
-   Protect routes that require auth and check permissions for editing content.

#### 📝 Create & manage content

-   Create posts.
-   Upload images/videos via Cloudinary; edit & delete posts.
-   Share other users' posts.

#### 💬 Social interactions

-   Nested comments (reply/thread), like/unlike for posts and comments.
-   View list of users who liked/shared.
-   Notifications: create notifications (Pusher/Realtime configured for future realtime expansion).

#### 🔍 Discover & search

-   Newsfeed with infinite scroll / pagination (cursor/page).
-   Search users and posts by keywords, categorized tabs (User/Post/Media).

#### 📱 User experience & performance

-   Responsive design (mobile & desktop).
-   Optimistic UI on the client for instant experience (realtime emit needs enabling to complete).
-   Basic backend optimizations: .lean(), APIFeatures (filter/sort/paginate). Note: N+1 issue exists for likes (bulk lookup recommended).

#### 🔒 Security & operations

-   User authorization (only edit your own content).
-   Protect routes requiring login.
-   Data validation and API security.

## 🚀 Technologies used

### Frontend (`frontend`)

| Technology            | Version  | Reason for choice                                              |
| --------------------- | -------- | -------------------------------------------------------------- |
| **Next.js**           | 14+      | Modern React framework with SSR/SSG, performance optimizations |
| **TypeScript**        | Latest   | Type safety, reduce runtime bugs, good IDE support             |
| **Material-UI (MUI)** | v5       | Rich component library, consistent design system               |
| **React Context API** | Built-in | Simple state management suitable for project scale             |
| **ReactQuill**        | Latest   | Powerful rich text editor for content creation                 |
| **Axios**             | Latest   | HTTP client with interceptors, automatic JWT handling          |
| **Cloudinary**        | SDK      | Cloud storage for media, automatic image optimization          |

### Backend (`backend`)

| Technology     | Version | Reason for choice                                       |
| -------------- | ------- | ------------------------------------------------------- |
| **Node.js**    | 18+     | High-performance JS runtime, large community            |
| **Express.js** | Latest  | Lightweight, easy-to-configure and extensible framework |
| **MongoDB**    | Latest  | Flexible NoSQL database suitable for social media       |
| **Mongoose**   | Latest  | ODM for MongoDB, strong schema validation               |
| **JWT**        | Latest  | Stateless authentication, secure and scalable           |
| **Multer**     | Latest  | Middleware for file uploads                             |
| **bcryptjs**   | Latest  | Secure password hashing                                 |

## Project structure (summary)

-   frontend/ — Next.js app (components, app, pages, hooks, utils, public)
-   backend/ — Express API (controllers, services, models, routes, utils)
-   config.env (backend), .env (frontend)

## 🛠️ Installation and running instructions

### System requirements

-   **Node.js**: Version 18 or higher
-   **npm** or **yarn**: Package manager
-   **MongoDB**: Database (local or MongoDB Atlas)
-   **Cloudinary Account**: For uploading and managing media

### 1. Clone the project

```bash
git clone [repository-url]
cd DuAnWebBee
```

### 2. Install Backend

#### Step 1: Go to the backend folder

```bash
cd backend
```

#### Step 2: Install dependencies

```bash
npm install
```

#### Step 3: Configure environment variables

Create `config.env` in the backend folder:

```env
# Server Configuration
NODE_ENV=development
PORT=8000
CLIENT_URL=http://localhost:3000
BASE_URL=http://localhost:8000

DATABASE=mongodb+srv://victomblack2020:xWoIYboijhEjLD1y@cluster0.ve9baim.mongodb.net/MXHBee

DATABASE_PASSWORD=xWoIYboijhEjLD1y

JWT_SECRET=my-ultra-secure-and-ultra-long-secret
JWT_REFRESH_SECRET=my-ultra-secure-refresh-token-and-ultra-long-secret
JWT_REFRESH_EXPIRES_IN=10d
JWT_REFRESH_COOKIE_EXPIRES_IN=30
JWT_EXPIRES_IN=10s
JWT_COOKIE_EXPIRES_IN=30
JWT_COOKIE_REFRESH_TOKEN_EXPIRES_IN=10


EMAIL_USERNAME=a124458539192a
EMAIL_PASSWORD=1e3caf48074eba
EMAIL_HOST=smtp.mailtrap.io
SERVICE=gmail
SECURE=true
USER=victomblack2020@gmail.com
PASS=ozkr jkqq dcwr rwee
EMAIL_PORT=587

CLOUDINARY_NAME=ds6hdw753
CLOUDINARY_API_KEY=894844815737539
CLOUDINARY_API_SECRET=***************************
CLOUDINARY_URL=cloudinary://${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}@${CLOUDINARY_NAME}

# PASS=Beegin123456
vnp_TmnCode=OQEE5RM5
vnp_HashSecret=ACQOPVZYUIZNDCJAMOAXUMTZBYUPHOZC
vnp_Url=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
vnp_Api=https://sandbox.vnpayment.vn/merchant_webapi/api/transaction
vnp_ReturnUrl=http://localhost:8888/order/vnpay_return
TZ=Asia/Ho_Chi_Minh
PRODUCTION_BASE_URL=https://beegin.onrender.com

PUSHER_APP_ID=1726124
PUSHER_KEY=347a18ba158ea55c148d
PUSHER_SECRET=935e6d0a12fb024b0a0c
PUSHER_CLUSTER=ap1
```

#### Step 4: No need to start local MongoDB

Use MongoDB Atlas; backend will automatically connect to the cloud database.

#### Step 5: Run backend server

```bash
npx nodemon server.js
```

**Note**: Backend uses `nodemon` for auto-restart on code changes.

Backend will run at: `http://localhost:8000`

### 3. Install Frontend

#### Step 1: Open a new terminal and go to the frontend folder

```bash
cd frontend
```

#### Step 2: Install dependencies

```bash
npm install
```

#### Step 3: Configure environment variables

Create `.env` in the frontend folder:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET='gfYnuhTCUrhrVW1l'
NEXT_PUBLIC_BEEGIN_DOMAIN=http://localhost:8000
NEXT_APP_BEEGIN_DOMAIN=http://localhost:8000
# NEXT_APP_BEEGIN_DOMAIN=http://localhost:8000
NEXT_APP_BEEGIN_URL=http://localhost:3000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = ds6hdw753
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET = buq1gcyi
NEXT_PUBLIC_CLOUDINARY_SECRET=894844815737539
NEXT_PUBLIC_CLOUDINARY_URL=cloudinary://894844815737539:pzc5tM00o5WSt0y6fJSLowI94lc@ds6hdw753
NEXT_PUBLIC_PUSHER_APP_KEY=347a18ba158ea55c148d
```

#### Step 4: Run frontend server

```bash
npm run dev
```

Frontend will run at: `http://localhost:3000`

## 🚀 Quick Start

### Run the whole project (2 terminals):

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

### Access the application:

-   **Frontend**: http://localhost:3000
-   **Backend API**: http://localhost:8000
-   **MongoDB**: Local database `MXHBEE`

### 📄 Environment files summary

-   **Backend**: `backend/config.env` (port 8000)
-   **Frontend**: `frontend/.env` (port 3000)
-   **Cloudinary**: Preconfigured in both files
-   **Database**: MongoDB Atlas at `DevShare-lite` (cloud, no local install required)
-   **Authentication**: JWT tokens stored in localStorage (not using cookies)

## 🎯 Implemented features

### ✅ **Core Features:**

-   **Home page**: Newsfeed showing posts from friends with pagination
-   **Search system**: Search users and posts (Top, Latest, User, Media)
-   **Profile system**: Personal profile with dynamic [slug] routing
-   **Authentication**: JWT-based
-   **Post management**: Create, edit, delete posts with media upload
-   **Social interactions**: Like, comment, share posts
-   **Real-time features**: Pusher integration for realtime updates

### ✅ **Technical Features:**

-   **Environment-based URLs**: Flexible deployment configuration
-   **Responsive design**: Optimized for desktop
-   **TypeScript**: Type safety across the app
-   **Error handling**: Good error handling and user feedback
-   **File upload**: Cloudinary integration for media storage
