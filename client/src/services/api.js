import axiosInstance from "@/config/axios";

export const authAPI = {
  register: (data) => axiosInstance.post("/auth/register", data),
  login: (data) => axiosInstance.post("/auth/login", data),
  logout: () => axiosInstance.post("/auth/logout"),
  verifyToken: () => axiosInstance.get("/auth/verify"),
  resetPassword: (data) => axiosInstance.post("/auth/reset-password", data),
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
  cancelRequest: (userId) => axiosInstance.delete(`/request/${userId}`),
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
  getMessages: (chatId) => axiosInstance.get(`/message/${chatId}`),
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
