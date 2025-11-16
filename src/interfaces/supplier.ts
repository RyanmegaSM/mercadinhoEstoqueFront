export interface Supplier {
  id: number;
  nome: string;
  telefone: string;
  endereco: string;
  cnpj: string;
}

export interface GetSuppliersResponse {
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  data: Supplier[];
}

export interface GetSupplierRequest {
  page?: number;
  pageSize?: number;
  name?: string;
  cnpj?: string;
}

export interface CreateSupplierRequest {
  name: string;
  telephone: string;
  address: string;
  cnpj: string;
}

export type UpdateSupplierRequest = CreateSupplierRequest & { id: number };
