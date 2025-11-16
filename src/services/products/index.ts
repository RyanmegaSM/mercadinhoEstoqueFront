import { BuildUrlParams } from "@/helpers/build-url-params";
import api from "../api";
import {
  type CreateProductRequest,
  type GetProductBySupplieResponse,
  type GetProductsRequest,
  type GetProductsResponse,
  type UpdateProductRequest,
} from "@/interfaces/product";

const BASE_ROUTE = "products";

export const getProducts = async (filters: GetProductsRequest = {}) => {
  const query = BuildUrlParams({ ...filters });
  return await api<GetProductsResponse>(`${BASE_ROUTE}?${query}`, {
    method: "GET",
  });
};

export const getProductsBySupplier = async (supplierId: number) => {
  return await api<GetProductBySupplieResponse[]>(
    `${BASE_ROUTE}/supplier/${supplierId}`,
    {
      method: "GET",
    }
  );
};

export const createProduct = async (data: CreateProductRequest) => {
  return await api(`${BASE_ROUTE}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateProduct = async (data: UpdateProductRequest) => {
  return await api(`${BASE_ROUTE}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const getProductById = async (id: number) => {
  return await api<{
    id: number;
    nome: string;
    descricao: string;
    precoUnitario: number;
    categoriaId: number;
  }>(`${BASE_ROUTE}/${id}`, { method: "GET" });
};

export const deleteProduct = async (id: number) => {
  return await api(`${BASE_ROUTE}/${id}`, { method: "DELETE" });
};
