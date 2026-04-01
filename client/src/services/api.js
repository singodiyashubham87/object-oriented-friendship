import axiosInstance from "@/config/axios";

export const authAPI = {
  register: (data) => axiosInstance.post("/auth/register", data),
  login: (data) => axiosInstance.post("/auth/login", data),
  logout: () => axiosInstance.post("/auth/logout"),
  verifyToken: () => axiosInstance.get("/auth/verify"),
  forgotPassword: (data) => axiosInstance.post("/auth/forgot-password", data),
  resetPassword: (data) => axiosInstance.post("/auth/reset-password", data),
  getSessions: () => axiosInstance.get("/auth/sessions"),
  revokeSession: (sessionId) =>
    axiosInstance.delete(`/auth/sessions/${sessionId}`),
  revokeAllOtherSessions: () =>
    axiosInstance.delete("/auth/sessions/all-others"),
};

export const userAPI = {
  getCurrentUser: () => axiosInstance.get("/user/me"),
  getUserById: (userId) => axiosInstance.get(`/user/${userId}`),
  updateUser: (userId, data) => axiosInstance.put(`/user/${userId}`, data),
  deleteUser: (userId) => axiosInstance.delete(`/user/${userId}`),
  verifyPhone: (userId, data) =>
    axiosInstance.post(`/user/verify-phone/${userId}`, data),

  getFriends: () => axiosInstance.get("/user/friends"),
  unfriend: (friendId) => axiosInstance.delete(`/user/unfriend/${friendId}`),
  getUserFeed: () => axiosInstance.get("/user/feed"),
  searchUsers: (query) =>
    axiosInstance.get(`/user/search?q=${encodeURIComponent(query)}`),

  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append("avatar", file);
    return axiosInstance.post("/user/upload-avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export const requestAPI = {
  sendRequest: (toUserId) => axiosInstance.post(`/request/send/${toUserId}`),
  acceptRequest: (requestId) =>
    axiosInstance.put(`/request/accept/${requestId}`),
  rejectRequest: (requestId) =>
    axiosInstance.put(`/request/reject/${requestId}`),
  cancelRequest: (requestId) => axiosInstance.delete(`/request/${requestId}`),
  getPendingRequests: () => axiosInstance.get("/request/pending"),
  getSentRequests: () => axiosInstance.get("/request/sent"),
};

export const bookmarkAPI = {
  addBookmark: (userId) => axiosInstance.post(`/bookmark/${userId}`),
  removeBookmark: (userId) => axiosInstance.delete(`/bookmark/${userId}`),
  getBookmarks: () => axiosInstance.get("/bookmark"),
};

export const chatAPI = {
  getAllChats: () => axiosInstance.get("/chat"),
  createChat: (userId) => axiosInstance.post(`/chat/${userId}`),
  getUnreadCount: () => axiosInstance.get("/chat/unread-count"),
  getMessages: (chatId, cursor) => {
    const params = cursor ? `?cursor=${encodeURIComponent(cursor)}` : "";
    return axiosInstance.get(`/message/${chatId}${params}`);
  },
  sendMessage: (chatId, data) => axiosInstance.post(`/message/${chatId}`, data),
  markAsRead: (messageId) => axiosInstance.put(`/message/${messageId}/read`),
};

export default {
  auth: authAPI,
  user: userAPI,
  request: requestAPI,
  bookmark: bookmarkAPI,
  chat: chatAPI,
};
