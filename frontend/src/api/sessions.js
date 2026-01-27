import axiosInstance from "../lib/axios";

export const sessionApi = {
  createSession: async (data) => {
    const response = await axiosInstance.post("/sessions", data);
    return response.data;
  },

  getActiveSessions: async () => {
    const response = await axiosInstance.get("/sessions/active");
    return response.data;
  },
  getMyRecentSessions: async () => {
    const response = await axiosInstance.get("/sessions/my-recent");
    return response.data;
  },

  getSessionById: async (id) => {
    const response = await axiosInstance.get(`/sessions/${id}`);
    return response.data;
  },

  joinSession: async (args) => {
    // args can be just ID string (legacy/auto-join) or object { id, guestName }
    const id = typeof args === "string" ? args : args.id;
    const body = typeof args === "object" ? { guestName: args.guestName } : {}; 
    
    const response = await axiosInstance.post(`/sessions/${id}/join`, body);
    return response.data;
  },
  endSession: async ({ id, code }) => {
    const response = await axiosInstance.post(`/sessions/${id}/end`, { code });
    return response.data;
  },
  admitSession: async (id) => {
    const response = await axiosInstance.post(`/sessions/${id}/admit`);
    return response.data;
  },
  getStreamToken: async () => {
    const response = await axiosInstance.get(`/chat/token`);
    return response.data;
  },
  deleteSession: async (id) => {
    const response = await axiosInstance.delete(`/sessions/${id}`);
    return response.data;
  },
};
