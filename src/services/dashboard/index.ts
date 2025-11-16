import api from "../api";
import {
  type TotalAmount,
  type TotalProducts,
  type ExpiringBatches,
  type LowStockProduct,
  type StockSummary,
} from "@/interfaces/dashboard";

const BASE_ROUTE = "dashboard";

export const getTotalProducts = async () => {
  return await api<TotalProducts>(`${BASE_ROUTE}/total-products`, {
    method: "GET",
  });
};

export const getTotalProductAmount = async () => {
  return await api<TotalAmount>(`${BASE_ROUTE}/total-amount`, {
    method: "GET",
  });
};

export const getExpiringBatches = async (limit?: number) => {
  return await api<ExpiringBatches>(
    `${BASE_ROUTE}/expiring-batches?limit=${limit}`,
    {
      method: "GET",
    }
  );
};

export const getLowStockProducts = async (threshold: number) => {
  return await api<LowStockProduct>(
    `${BASE_ROUTE}/low-stock?threshold=${threshold}`,
    {
      method: "GET",
    }
  );
};

export const getStockSummary = async () => {
  return api<StockSummary[]>(`${BASE_ROUTE}/stock-summary`, { method: "GET" });
};
