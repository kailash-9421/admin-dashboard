import api from "../lib/axios";

export const login = async (username, password) =>
  (await api.post("/auth/login", { username, password, expiresInMins: 60 })).data;
