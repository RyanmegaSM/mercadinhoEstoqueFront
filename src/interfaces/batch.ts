export interface GetBatchesResponse {
  currentPage: number;
  total: number;
  totalPages: number;
  pageSize: number;
  data: {
    id: number;
    preco: number;
    quantidade: number;
    validade: string;
    fornecedor: {
      id: number;
      nome: string;
    };
  }[];
}

export interface GetBatchByIdRequest {
  id: number;
  preco: number;
  validade: string;
  quantidade: number;
  fornecedor: string;
  produtos: {
    nome: string;
    quantidade: number;
  }[];
}

export interface GetBatchesRequest {
  page?: number;
  pageSize?: number;
  validity?: string;
}

export interface CreateBatchRequest {
  price: number;
  quantity: number;
  validity: string;
  supplierId: number;
  products: {
    id: number;
    quantidade: number;
  }[];
}
