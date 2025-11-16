import { BuildUrlParams } from "@/helpers/build-url-params";
import api from "../api";
import {
  type CreateUserRequest,
  type GetUsersRequest,
  type GetUsersResponse,
  type User,
  type UpdateUserRequest,
} from "@/interfaces/user";

const BASE_ROUTE = "users";

export const getUsers = async (filters: GetUsersRequest = {}) => {
  const query = BuildUrlParams({ ...filters });
  return await api<GetUsersResponse>(`${BASE_ROUTE}?${query}`, {
    method: "GET",
  });
};

export const getUserById = async (id: number) => {
  return await api<User>(`${BASE_ROUTE}/${id}`, { method: "GET" });
};

export const createUser = async (data: CreateUserRequest) => {
  return await api(`${BASE_ROUTE}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateUser = async (data: UpdateUserRequest) => {
  return await api(`${BASE_ROUTE}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteUser = async (id: number) => {
  return await api(`${BASE_ROUTE}/${id}`, { method: "DELETE" });
};

export const getAccessTypeLabel = (type: number): string => {
  switch (type) {
    case 1:
      return "Administrador";
    case 2:
      return "Gerente";
    case 3:
      return "Funcionário";
    default:
      return "Desconhecido";
  }
};
