export interface TotalProducts {
  totalProducts: number;
}

export interface TotalAmount {
  amount: number;
}

export interface ApiBatch {
  id: number;
  validade: string;
  fornecedor: string;
  produtos: {
    id: number;
    nome: string;
    quantidade: number;
  }[];
}

export interface ExpiringBatches {
  total: number;
  batches: ApiBatch[];
}

export interface LowStockProduct {
  products: {
    quantidade: number;
    produto: {
      id: number;
      nome: string;
    };
  }[];
  total: number;
}

export interface StockSummary {
  id: number;
  nome: string;
  totalQuantidade: number;
  precoUnitarioCentavos: number;
  totalValorCentavos: number;
}
