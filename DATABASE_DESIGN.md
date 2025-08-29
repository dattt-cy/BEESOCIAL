# 🗄️ Database Design — BEESOCIAL 
## 📋 Overview

BEESOCIAL uses MongoDB (document DB). This document is a corrected and consolidated design based on the actual Mongoose models in the project. It lists main collections, important fields, indexes, and common query patterns. Avoid changing semantics — only clarifications, consistency fixes and small improvements were applied.

---

## 🏗️ Collections (summary)

Core collections:

-   users
-   profiles
-   posts
-   comments
-   likeposts
-   commentlikes
-   shareposts

Auxiliary collections (examples from codebase):

-   categories, categoryposts
-   hashtags, hashtagposts, trendingHashtags, trendingPosts
-   notifications
-   follow, feed
-   reports
-   businessRequest, businessPost, postTransaction, unitPrice, advertisementPlan
-   issueTypes, userPreferences

---

## 📊 Collection details (aligned with models)

### 1. users

Purpose: authentication and account metadata.

Example fields (reflects backend/models/userModel.js):

```javascript
{
  _id,
  email: String (unique, required, lowercase),
  phonenumber: String,
  role: String enum ["user","business","admin"],
  isActived: Boolean,
  password: String (hashed, select:false),
  passwordConfirm: (validation only),
  passwordChangedAt: Date,
  preferences: [ObjectId ref Category],
  refreshToken: String,
  verifyToken: String,
  verify: Boolean,
  approved: Boolean,
  createdAt: Date
}
```

Important:

-   Virtual: profile (one-to-one) via Profile.user
-   Indexes: email (unique), role, isActived
-   Pre-save: bcrypt hashing, remove passwordConfirm
-   Pre-find: populate profile, exclude sensitive tokens (models sometimes use active vs isActived — queries use active check in some pre-hooks; keep consistent to isActived)

---

### 2. profiles

Purpose: public profile info.

Fields (reflects backend/models/profileModel.js):

```javascript
{
  firstname, lastname, slug (unique),
  gender (Boolean),
  avatar, background, address, bio, birthday,
  user: ObjectId ref User (unique index)
}
```

Rules:

-   firstname/lastname: regex /^[a-zA-Z0-9_\p{L}]+$/u
-   slug: /^[a-zA-Z0-9_]+$/ , unique
-   Index: { user: 1 } unique

---

### 3. posts

Purpose: user posts; supports sharing via parent.

Fields (reflects backend/models/postModel.js):

```javascript
{
  _id,
  content: String (trimmed, max ~8192),
  images: [String] (<=4),
  imageVideo: String,
  categories: [ObjectId ref Category],
  user: ObjectId ref User (required),
  parent: ObjectId ref Post (for shares),
  numLikes, numComments, numShares,
  createdAt,
  isActived: Boolean
}
```

Important:

-   Pre-find: populate user -> profile and categories, populate parent (shared post)
-   Post-save: update parent's numShares; extract hashtags and create Hashtag + HashtagPost entries
-   Pre findOneAndUpdate: keep hashtag relations in sync (delete removed, add new)

Indexes:

-   { user: 1 }, { createdAt: -1 }, { isActived: 1 }, { parent: 1 }

---

### 4. comments

Purpose: threaded comments with unlimited nesting.

Fields (reflects backend/models/commentModel.js):

```javascript
{
  _id,
  content: String (1-1000, required),
  user: ObjectId ref User,
  post: ObjectId ref Post,
  parent: ObjectId ref Comment (nullable),
  numLikes: Number,
  numReplies: Number,
  createdAt
}
```

Behavior:

-   post-save: update Post.numComments and parent.numReplies when applicable
-   pre/post findOneAndDelete: store deleted doc then recalc counts
-   pre-find: populate user -> profile

Indexes:

-   { post: 1 }, { parent: 1 }, { user: 1 }

---

### 5. likeposts

Purpose: track likes on posts.

Fields:

```javascript
{ user: ObjectId ref User, post: ObjectId ref Post, createdAt }
```

Constraints:

-   Composite unique index { user:1, post:1 }

Behavior:

-   post-save & post-delete: recalc Post.numLikes

Indexes:

-   { user:1, post:1 } unique, { post:1 }

---

### 6. commentlikes

Purpose: track likes on comments.

Fields:

```javascript
{ comment: ObjectId, user: ObjectId, createdAt }
```

Constraints:

-   Composite unique index { user:1, comment:1 }

Behavior:

-   post-save & post-delete: recalc Comment.numLikes

Indexes:

-   { user:1, comment:1 } unique, { comment:1 }

---

### 7. shareposts

Purpose: support analytics for shares (model: SharePost).

Fields:

```javascript
{ sharer: ObjectId ref User, post: ObjectId ref Post, createdAt }
```

Behavior:

-   Creating a shared Post (parent reference) and a SharePost document; Post.setNumShares updates counts.

Indexes:

-   { post:1 }, { sharer:1 }

---

## 🔗 Other models (quick notes)

-   notifications: recipient (User), type enum, actors array (strings), contentId, subContentId, read flag. Post-save pushes to Pusher.
-   feed: user + post + type (following/suggested/advertisement), seen flag, dateToBeSeen
-   follow: follower/following pairs
-   report: reporter, post, reason, status, processingDate
-   hashtags & hashtagposts: keep many-to-many relation between posts and hashtags; index by hashtag and createdAt
-   trendingHashtag / trendingPost: aggregated data for trends (pre-find population implemented)
-   business models (BusinessRequest, BusinessPost, PostTransaction, UnitPrice, AdvertisementPlan): used for promoted posts & billing. BusinessPost is a discriminator of Post.

---

## 🔍 Indexing strategy (recommendations)

Create indexes used by models and queries:

-   users: { email:1 } unique, { role:1 }, { isActived:1 }
-   profiles: { user:1 } unique, { slug:1 } unique
-   posts: { user:1 }, { createdAt: -1 }, { isActived:1 }, { parent:1 }
-   comments: { post:1 }, { parent:1 }, { user:1 }
-   likeposts: { user:1, post:1 } unique, { post:1 }
-   commentlikes: { user:1, comment:1 } unique, { comment:1 }
-   feed: { user:1 }
-   hashtagpost: { hashtag:-1 }, { createdAt:-1 }
-   shareposts: { post:1 }, { sharer:1 }

---

## ✅ Common query patterns (aligned with code)

-   Feed timeline:
    Post.find({ isActived: true }).populate("user", ...).populate("parent").sort({ createdAt: -1 }).limit(20)

-   Post with threaded comments:
    fetch root comments (parent:null) then fetch replies by parent in rootCommentIds

-   Profile page:
    Profile.findOne({ slug }).populate("user"); Post.find({ user: profile.user.\_id, isActived: true }).sort({ createdAt: -1 });

-   Check like status:
    LikePost.exists({ user: userId, post: postId })

-   Share flow:
    create Post with parent set, create SharePost, call Post.setNumShares(originalPostId)

---

## 🚀 Optimizations & best practices

-   Denormalize counters (numLikes, numComments, numReplies, numShares) and maintain via model hooks (already implemented).
-   Soft-delete pattern: use isActived (ensure hooks and queries consistently use isActived, not active).
-   Use virtual population (User ↔ Profile) to avoid extra collections loads.
-   Avoid N+1 on likes: consider bulk lookups (e.g., fetch LikePost documents for a page of posts and map).
-   Cache hot data (popular posts, frequently requested profiles) in Redis.
-   Archive old posts (>1 year) if required.

---

## 🔒 Security & integrity

-   Keep password hashing (bcrypt) and passwordChangedAt semantics.
-   Use proper validators as implemented in schemas.
-   Ensure tokens (refreshToken, verifyToken) are not returned in API responses (models already select them out in pre-find).
-   Index uniqueness to enforce constraints (slug, email, composite likes).

---

## ⚠️ Minor fixes / recommendations applied

-   Standardized field names: prefer isActived (used in many models). Search codebase for any remaining uses of "active" and align.
-   Fixed regex Unicode flags in profile validation (u flag used).
-   Clarified hashtag extract behavior in Post model and ensured HashtagPost operations use correct post ids.
-   Noted places where pre/post hooks call next() multiple times — inspect PostSchema.post("save") (there was an extra next()).

---
