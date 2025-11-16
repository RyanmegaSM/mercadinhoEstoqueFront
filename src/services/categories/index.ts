import api from "../api";
import { type GetCategoriesResponse } from "@/interfaces/category";

const BASE_ROUTE = "categories";

export const getCategories = async () => {
  return await api<GetCategoriesResponse[]>(`${BASE_ROUTE}`, {
    method: "GET",
  });
};
