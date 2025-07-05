# 🧠 OOF Backend Feature Checklist with API Endpoints

## 👤 User Management
- [x] POST `/api/user/register` — Register user
- [x] POST `/api/user/login` — Login user
- [x] POST `/api/user/logout` — Logout user
- [x] PUT  `/api/user/update/:id` — Update user profile
- [x] DELETE `/api/user/delete/:id` — Delete user account
- [x] POST `/api/user/forgot-password` — Forgot password (update password via email)
- [x] GET  `/api/user/me` — Get logged-in user info (JWT protected)
- [ ] POST `/api/user/verify-phone` — Send & verify OTP via Twilio

## 🧑‍🤝‍🧑 Connection Requests
- [x] POST `/api/request/send/:toUserId` — Send connection request
- [x] PUT  `/api/request/accept/:requestId` — Accept request
- [x] PUT  `/api/request/reject/:requestId` — Reject request
- [x] DELETE `/api/request/cancel/:requestId` — Cancel sent request
- [x] GET  `/api/request/pending` — View pending incoming requests
- [x] GET  `/api/request/sent` — View sent requests

## 👫 Friends
- [x] GET `/api/user/friends` — Get friend list
- [x] DELETE `/api/user/unfriend/:userId` — Unfriend a user

## 📚 Bookmarks
- [x] POST `/api/bookmark/:userId` — Bookmark a user
- [x] DELETE `/api/bookmark/:userId` — Remove bookmark
- [x] GET `/api/bookmark` — Get all bookmarked users

## 🔍 Discovery & Feed
- [ ] GET `/api/user/feed` — Discover new people
- [ ] GET `/api/user/search?q=javascript` — Search users by tech, name, skills

## 💬 Chat & Messaging
- [ ] GET `/api/chat` — Get all chat rooms for logged-in user
- [ ] POST `/api/chat/:userId` — Create chat room with a user (if not exists)
- [ ] GET `/api/message/:chatId` — Get all messages in a chat
- [ ] POST `/api/message/:chatId` — Send a message (text/image/video)
- [ ] PUT `/api/message/:messageId/read` — Mark message as read

## 🧾 System & Utilities
- [ ] Implement rate limiting globally
- [ ] Implement `node-cache` or Redis caching for feed/search
- [ ] Setup JWT middleware (`isAuthenticated`)
- [ ] Setup error handling middleware
- [ ] Upload profile pics to Cloudinary
- [ ] Setup BullMQ queue (e.g., for welcome email)
- [ ] Integrate Firebase for health alerts
- [ ] Integrate Sentry for error monitoring

## Misc
- [ ] Implement image encryption with Steganography techniques

## 🧪 Testing
- [ ] Unit test for user controller & service (Vitest)
- [ ] Integration test for auth + request + chat flow
- [ ] Mock external services (Twilio, Cloudinary, Redis)

## 🚀 DevOps
- [ ] Setup `.env` for local/dev/prod
- [ ] Setup GitHub Actions for CI/CD
- [ ] Deploy backend to Render
- [ ] Monitor logs & alerts
