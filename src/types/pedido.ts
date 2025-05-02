import { SellerId } from './seller';

export interface PedidoFormData {
  clienteId: string;
  vendedor: string;
  itens: Array<{
    produtoId: string;
    quantidade: number;
  }>;
  documentoFiscal?: File;
  origem?: string;
}

export const initialPedidoFormData: PedidoFormData = {
  clienteId: '',
  vendedor: '',
  itens: [],
  documentoFiscal: undefined,
  origem: ''
};