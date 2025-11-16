export interface GetStockMovimentationResponse {
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  data: {
    id: number;
    data: string;
    tipo: string;
    quantidade: number;
    produtos: {
      id: number;
      nome: string;
    }[];
    usuario: string;
  }[];
}

export interface GetStockMovimentationRequest {
  page?: number;
  pageSize?: number;
}

export interface CreateStockMovimentationRequest {
  data: Date;
  tipo: string;
  quantidade: number;
  produtoId: number;
  usuarioId: number;
}
