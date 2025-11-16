import { BuildUrlParams } from "@/helpers/build-url-params";
import api from "../api";
import {
  type CreateSupplierRequest,
  type GetSupplierRequest,
  type GetSuppliersResponse,
  type Supplier,
  type UpdateSupplierRequest,
} from "@/interfaces/supplier";

const BASE_ROUTE = "suppliers";

export const getSuppliers = async (filters: GetSupplierRequest = {}) => {
  const query = BuildUrlParams({ ...filters });
  return await api<GetSuppliersResponse>(`${BASE_ROUTE}?${query}`, {
    method: "GET",
  });
};

export const getSupplierById = async (id: number) => {
  return await api<Supplier>(`${BASE_ROUTE}/${id}`, { method: "GET" });
};

export const createSupplier = async (data: CreateSupplierRequest) => {
  return await api(`${BASE_ROUTE}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateSupplier = async (data: UpdateSupplierRequest) => {
  return await api(`${BASE_ROUTE}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteSupplier = async (id: number) => {
  return await api(`${BASE_ROUTE}/${id}`, { method: "DELETE" });
};
