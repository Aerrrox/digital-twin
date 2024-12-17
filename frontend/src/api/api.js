import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/",
});

export const getPlants = () => api.get("garden_api/plants/");
export const getPlots = () => api.get("garden_api/plots/");
export const getBeds = () => api.get("garden_api/beds/");