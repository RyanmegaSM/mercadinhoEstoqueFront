import { BuildUrlParams } from "@/helpers/build-url-params";
import api from "../api";
import {
  type CreateStockMovimentationRequest,
  type GetStockMovimentationRequest,
  type GetStockMovimentationResponse,
} from "@/interfaces/stockMovimentation";

const BASE_ROUTE = "movement";

export const getStockMovimentation = async (
  filters: GetStockMovimentationRequest = {}
) => {
  const query = BuildUrlParams({ ...filters });
  return await api<GetStockMovimentationResponse>(`${BASE_ROUTE}?${query}`, {
    method: "GET",
  });
};

export const createStockMovimentation = async (
  data: CreateStockMovimentationRequest
) => {
  return await api(`${BASE_ROUTE}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const deleteStockMovimentation = async (id: number) => {
  return api(`${BASE_ROUTE}/${id}`);
};
