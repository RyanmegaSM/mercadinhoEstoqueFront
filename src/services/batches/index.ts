import { BuildUrlParams } from "@/helpers/build-url-params";
import api from "../api";

import type {
  CreateBatchRequest,
  GetBatchByIdRequest,
  GetBatchesRequest,
  GetBatchesResponse,
} from "@/interfaces/batch";

const BASE_ROUTE = "batches";

export const getBatches = async (filters: GetBatchesRequest = {}) => {
  const query = BuildUrlParams({ ...filters });

  return await api<GetBatchesResponse>(`${BASE_ROUTE}?${query}`, {
    method: "GET",
  });
};

export const getBatchById = async (id: number) => {
  return api<GetBatchByIdRequest>(`${BASE_ROUTE}/${id}`, {
    method: "GET",
  });
};

export const createBatch = async (data: CreateBatchRequest) => {
  return await api(`${BASE_ROUTE}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};
