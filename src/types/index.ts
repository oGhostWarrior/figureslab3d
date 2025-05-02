import { SellerId } from './seller';

export interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
}

export interface MateriaPrima {
  id: string;
  nome: string;
  quantidade: number;
  unidadeMedida: string;
  precoUnitario: number;
}

export interface Produto {
  id: string;
  nome: string;
  preco: number;
  estoque: number;
  foto: string;
  materiaPrima: {
    id: string;
    quantidade: number;
  }[];
}

export type StatusPedido = 'pendente' | 'em_producao' | 'concluido';
export type OrigemPedido = 'site' | 'marketplace' | 'local' | 'outro';

export interface Pedido {
  id: string;
  clienteId: string;
  vendedor: SellerId;
  status: StatusPedido;
  dataCriacao: Date;
  dataAtualizacao: Date;
  documentoFiscal?: string;
  origem?: OrigemPedido;
  itens: {
    produtoId: string;
    quantidade: number;
    precoUnitario: number;
  }[];
}