# 🗄️ Thiết kế Cơ sở Dữ liệu - DevShare Lite

## 📋 Tổng quan

**DevShare Lite** sử dụng **MongoDB** - một NoSQL document database để lưu trữ dữ liệu. Hệ thống được thiết kế với **7 collections chính**, tối ưu cho việc lưu trữ và truy xuất dữ liệu của một mạng xã hội với các tính năng tương tác đa dạng.

## 🎯 Lý do lựa chọn MongoDB

### Ưu điểm cho DevShare Lite:

-   **Linh hoạt Schema**: Dễ dàng thêm/sửa fields mà không cần migration phức tạp
-   **Hiệu suất cao**: Truy vấn nhanh với indexing tối ưu
-   **Scalability**: Dễ mở rộng horizontal khi người dùng tăng
-   **JSON-like Structure**: Phù hợp với Node.js và React ecosystem
-   **Rich Queries**: Hỗ trợ aggregate, population, virtual fields
-   **Social Media Ready**: Tối ưu cho data structure của mạng xã hội

---

## 🏗️ Kiến trúc Collections

### Sơ đồ mối quan hệ (Collections Relationship Diagram)

```
┌─────────────┐     1:1     ┌─────────────┐
│    User     │ ◄─────────► │   Profile   │
│   (_id)     │             │    (user)   │
└─────────────┘             └─────────────┘
       │                           │
       │ 1:N                       │
       ▼                           ▼
┌─────────────┐             ┌─────────────┐
│    Post     │             │   Comment   │
│   (user)    │ ◄─────────► │   (user)    │
│  (parent)   │     1:N     │   (post)    │
└─────────────┘             │  (parent)   │
       │                    └─────────────┘
       │ 1:N                       │
       ▼                           │ 1:N
┌─────────────┐                    ▼
│  LikePost   │             ┌─────────────┐
│   (user)    │             │CommentLike  │
│   (post)    │             │   (user)    │
└─────────────┘             │  (comment)  │
       │                    └─────────────┘
       │ 1:N
       ▼
┌─────────────┐
│ SharePost   │
│  (sharer)   │
│   (post)    │
└─────────────┘
```

---

## 📊 Chi tiết Collections

### 1. 👤 User Collection

**Mục đích**: Lưu trữ thông tin đăng nhập và quyền hạn người dùng.

```javascript
{
  _id: ObjectId,           // Primary Key
  email: String,           // Unique, Required
  phonenumber: String,     // Optional
  role: String,            // Enum: ["user", "admin"]
  isActived: Boolean,      // Default: true
  password: String,        // Hashed, Select: false
  passwordConfirm: String, // Validation only
  passwordChangedAt: Date, // Password change tracking
  preferences: [ObjectId], // Reference to Category
  refreshToken: String,    // JWT refresh token
  verifyToken: String,     // Email verification
  verify: Boolean,         // Default: true
  createdAt: Date         // Auto timestamp
}
```

#### Indexes:

-   `email`: Unique index
-   `role`: Performance index
-   `isActived`: Query optimization

#### Virtual Population:

```javascript
profile: {
  ref: "Profile",
  foreignField: "user",
  localField: "_id",
  justOne: true
}
```

#### Middleware:

-   **Pre-save**: Hash password với bcrypt (cost: 12)
-   **Pre-find**: Auto populate profile, exclude sensitive fields

---

### 2. 📝 Profile Collection

**Mục đích**: Lưu trữ thông tin cá nhân và hiển thị của người dùng.

```javascript
{
  _id: ObjectId,        // Primary Key
  firstname: String,    // Required, 2-20 chars
  lastname: String,     // Required, 2-20 chars
  slug: String,         // Unique, 4-30 chars, URL-friendly
  gender: Boolean,      // Required (true/false)
  avatar: String,       // Cloudinary URL
  background: String,   // Background image URL
  address: String,      // Optional
  bio: String,          // User description
  birthday: Date,       // Optional
  user: ObjectId        // Reference to User (1:1)
}
```

#### Constraints:

-   **firstname/lastname**: Regex validation `^[a-zA-Z0-9_\p{L}]+$`
-   **slug**: Regex validation `^[a-zA-Z0-9_]+$`, unique
-   **user**: Unique index (1:1 relationship)

#### Business Rules:

-   Slug được sử dụng cho URL profile: `/profile/{slug}`
-   Avatar và background được lưu trên Cloudinary

---

### 3. 📄 Post Collection

**Mục đích**: Lưu trữ bài viết, nội dung chia sẻ và các hoạt động trên mạng xã hội.

```javascript
{
  _id: ObjectId,        // Primary Key
  title: String,        // Optional
  content: String,      // Max: 8192 chars
  images: [String],     // Max: 4 images, Cloudinary URLs
  user: ObjectId,       // Reference to User
  parent: ObjectId,     // Reference to parent post (for sharing)
  numLikes: Number,     // Auto calculated
  numComments: Number,  // Auto calculated
  numShares: Number,    // Auto calculated
  createdAt: Date,      // Auto timestamp
  isActived: Boolean    // Default: true, soft delete
}
```

#### Validation:

-   **content**: Max 8192 characters, trimmed
-   **images**: Max 4 images per post
-   **user**: Required reference

#### Auto Population:

```javascript
user: {
  path: "user",
  select: "_id email profile role",
  populate: {
    path: "profile",
    select: "avatar firstname lastname slug"
  }
}
```

#### Sharing Feature:

-   **Original posts**: `parent = null`
-   **Shared posts**: `parent = originalPostId`
-   Auto update `numShares` counter

---

### 4. 💬 Comment Collection

**Mục đích**: Hệ thống comment có cấu trúc cây (threaded comments).

```javascript
{
  _id: ObjectId,        // Primary Key
  content: String,      // Required, 1-1000 chars
  user: ObjectId,       // Reference to User
  post: ObjectId,       // Reference to Post
  numLikes: Number,     // Auto calculated
  parent: ObjectId,     // Self-reference for replies
  numReplies: Number,   // Auto calculated
  createdAt: Date       // Auto timestamp
}
```

#### Hierarchical Structure:

-   **Root comments**: `parent = null`
-   **Replies**: `parent = commentId`
-   **Nested replies**: Support unlimited depth

#### Auto Calculation Middleware:

-   **Post hooks**: Update `numComments` in Post
-   **Delete hooks**: Recalculate counts when deleted

---

### 5. ❤️ LikePost Collection

**Mục đích**: Theo dõi like/unlike của bài viết.

```javascript
{
  _id: ObjectId,        // Primary Key
  user: ObjectId,       // Reference to User
  post: ObjectId,       // Reference to Post
  createdAt: Date       // Auto timestamp
}
```

#### Constraints:

-   **Composite Unique Index**: `{user: 1, post: 1}`
-   Một user chỉ like được 1 lần cho mỗi post

#### Auto Update Logic:

```javascript
// Tự động cập nhật numLikes trong Post
post.numLikes = await LikePost.countDocuments({ post: postId });
```

---

### 6. 💝 CommentLike Collection

**Mục đích**: Theo dõi like/unlike của comment.

```javascript
{
  _id: ObjectId,        // Primary Key
  comment: ObjectId,    // Reference to Comment
  user: ObjectId,       // Reference to User
  createdAt: Date       // Auto timestamp
}
```

#### Constraints:

-   **Composite Unique Index**: `{user: 1, comment: 1}`
-   Một user chỉ like được 1 lần cho mỗi comment

#### Auto Update Logic:

```javascript
// Tự động cập nhật numLikes trong Comment
comment.numLikes = await CommentLike.countDocuments({ comment: commentId });
```

---

### 7. 🔄 SharePost Collection

**Mục đích**: Theo dõi việc chia sẻ bài viết.

```javascript
{
  _id: ObjectId,        // Primary Key
  sharer: ObjectId,     // Reference to User (người share)
  post: ObjectId,       // Reference to Post (bài được share)
  createdAt: Date       // Auto timestamp
}
```

#### Business Logic:

-   Cho phép user share nhiều lần cùng một bài viết
-   Tự động cập nhật `numShares` trong Post model
-   Tạo shared post với `parent` reference

---

## 🔍 Query Patterns & Indexing Strategy

### Performance Indexes

```javascript
// User Collection
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });
db.users.createIndex({ isActived: 1 });

// Profile Collection
db.profiles.createIndex({ user: 1 }, { unique: true });
db.profiles.createIndex({ slug: 1 }, { unique: true });

// Post Collection
db.posts.createIndex({ user: 1 });
db.posts.createIndex({ createdAt: -1 });
db.posts.createIndex({ isActived: 1 });
db.posts.createIndex({ parent: 1 });

// Comment Collection
db.comments.createIndex({ post: 1 });
db.comments.createIndex({ parent: 1 });
db.comments.createIndex({ user: 1 });

// LikePost Collection
db.likeposts.createIndex({ user: 1, post: 1 }, { unique: true });
db.likeposts.createIndex({ post: 1 });

// CommentLike Collection
db.commentlikes.createIndex({ user: 1, comment: 1 }, { unique: true });
db.commentlikes.createIndex({ comment: 1 });

// SharePost Collection
db.shareposts.createIndex({ post: 1 });
db.shareposts.createIndex({ sharer: 1 });
```

### Common Query Patterns

#### 1. Feed Timeline (Newsfeed)

```javascript
// Lấy bài viết mới nhất với thông tin user và interaction counts
Post.find({ isActived: true })
    .populate("user", "email profile")
    .populate("parent") // For shared posts
    .sort({ createdAt: -1 })
    .limit(20);
```

#### 2. Post with Comments (Threaded)

```javascript
// Lấy bài viết với comments và replies
const post = await Post.findById(postId);
const rootComments = await Comment.find({
    post: postId,
    parent: null,
}).sort({ createdAt: -1 });

const replies = await Comment.find({
    post: postId,
    parent: { $in: rootCommentIds },
});
```

#### 3. User Profile with Posts

```javascript
// Profile page với posts của user
const profile = await Profile.findOne({ slug: userSlug }).populate("user");

const userPosts = await Post.find({
    user: profile.user._id,
    isActived: true,
}).sort({ createdAt: -1 });
```

#### 4. Check Like Status

```javascript
// Kiểm tra user đã like post/comment chưa
const isLiked = await LikePost.exists({
    user: userId,
    post: postId,
});

const commentLiked = await CommentLike.exists({
    user: userId,
    comment: commentId,
});
```

#### 5. Share Post Flow

```javascript
// Chia sẻ bài viết
const sharedPost = await Post.create({
    content: shareContent,
    user: sharerId,
    parent: originalPostId,
});

// Track sharing activity
await SharePost.create({
    sharer: sharerId,
    post: originalPostId,
});

// Update share count
await Post.setNumShares(originalPostId);
```

---

## 🚀 Optimization Strategies

### 1. **Denormalization for Performance**

-   `numLikes`, `numComments`, `numShares` được lưu trực tiếp trong Post
-   `numLikes`, `numReplies` được lưu trực tiếp trong Comment
-   Giảm expensive COUNT queries

### 2. **Soft Delete Pattern**

-   `isActived: false` thay vì xóa hard
-   Có thể khôi phục data và maintain referential integrity

### 3. **Virtual Population**

-   User ↔ Profile relationship qua virtual fields
-   Giảm số lượng queries cần thiết

### 4. **Middleware Automation**

-   Auto hash password
-   Auto update counters
-   Auto populate related data

### 5. **Composite Indexes**

-   `{user, post}` cho LikePost
-   `{user, comment}` cho CommentLike
-   Đảm bảo uniqueness và performance

---

## 📈 Scalability Considerations

### 1. **Horizontal Scaling**

-   MongoDB sharding trên `user` field
-   Distribute data based on user activity

### 2. **Read Replicas**

-   Master-Slave setup cho read-heavy operations
-   Feed queries đọc từ replicas

### 3. **Caching Strategy**

-   Redis cache cho:
    -   User sessions (JWT)
    -   Popular posts
    -   User profiles
    -   Comment trees

### 4. **Archive Strategy**

-   Move old posts (>1 year) to archive collections
-   Keep active data small and fast

---

## 🔒 Security & Data Integrity

### 1. **Password Security**

-   bcrypt hashing với cost factor 12
-   Password strength validation
-   Password change tracking

### 2. **Data Validation**

-   Mongoose schema validation
-   Custom validators cho business rules
-   Input sanitization

### 3. **Access Control**

-   Role-based permissions
-   User can only edit own content
-   Admin override capabilities

### 4. **Audit Trail**

-   `createdAt` timestamps
-   `passwordChangedAt` tracking
-   Soft delete preserves history

---

## 🔄 Business Logic Implementation

### 1. **Auto Counter Updates**

```javascript
// Trong postModel.js
PostSchema.statics.setNumShares = async function (postId) {
    let numShares = 0;
    if (postId) {
        numShares = await this.countDocuments({ parent: postId });
    }
    await this.findByIdAndUpdate(postId, { numShares: numShares });
};

// Trong commentModel.js
CommentSchema.statics.setNumComments = async function (postId) {
    let numComments = 0;
    if (postId) {
        numComments = await this.countDocuments({ post: postId });
    }
    await Post.findByIdAndUpdate(postId, { numComments: numComments });
};
```

### 2. **Middleware Hooks**

```javascript
// Auto update sau khi save
CommentSchema.post("save", async function (doc, next) {
    if (doc) {
        await doc.constructor.setNumComments(doc.post);
        if (doc.parent) {
            await doc.constructor.setNumReplies(doc.parent);
        }
    }
    next();
});

// Auto update sau khi delete
CommentSchema.post(/^findOneAndDelete/, async function (doc, next) {
    if (doc) {
        await this.deletedComment.constructor.setNumComments(
            this.deletedComment.post
        );
    }
    next();
});
```

### 3. **Population Strategy**

```javascript
// Auto populate trong pre-find middleware
PostSchema.pre(/^find/, function (next) {
    this.populate({
        path: "user",
        select: "_id email profile role",
        populate: {
            path: "profile",
            model: "Profile",
            select: "avatar firstname lastname -user slug",
        },
    }).populate({
        path: "parent", // Populate shared post
        populate: {
            path: "user",
            populate: { path: "profile" },
        },
    });
    next();
});
```

---

## 🏁 Kết luận

Thiết kế database này tối ưu cho:

-   **Performance**: Fast queries với proper indexing và denormalization
-   **Scalability**: Dễ mở rộng khi user base tăng với sharding strategy
-   **Flexibility**: Schema linh hoạt cho feature mới như sharing posts
-   **Integrity**: Referential integrity và data consistency qua middleware
-   **User Experience**: Real-time updates và responsive interactions
-   **Social Features**: Hỗ trợ đầy đủ like, comment, share với hierarchical structure

Database structure hỗ trợ đầy đủ các tính năng của một mạng xã hội hiện đại với khả năng mở rộng trong tương lai, bao gồm cả tính năng chia sẻ bài viết và comment có cấu trúc
