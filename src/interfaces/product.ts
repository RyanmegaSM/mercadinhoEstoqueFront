export interface Product {
  id: number;
  nome: string;
  descricao: string;
  precoUnitario: number;
  categoria: string;
}

export interface GetProductsResponse {
  currentPage: number;
  total: number;
  totalPages: number;
  pageSize: number;
  data: {
    id: number;
    nome: string;
    descricao: string;
    precoUnitario: number;
    Categoria: {
      id: number;
      nome: string;
    };
  }[];
}

export interface GetProductBySupplieResponse {
  id: number;
  descricao: string;
  nome: string;
  precoUnitario: number;
  categoriaId: number;
}

export interface GetProductsRequest {
  page?: number;
  pageSize?: number;
  name?: string;
  category?: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  unitPrice: number;
  categoryId: number;
}

export type UpdateProductRequest = CreateProductRequest & { id: number };
