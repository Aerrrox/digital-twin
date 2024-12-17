import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/auth_api/",
});

export const login = (email, password) => api.post("login/", { email, password });
export const register = (email, username, password) =>
    api.post("register/", { email, username, password });
export const logout = () => api.post("logout/", { refresh: localStorage.getItem("refresh") });
