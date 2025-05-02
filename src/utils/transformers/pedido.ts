import { Pedido } from '../../types';
import { validatePedido } from '../validation/pedido';

interface PedidoData {
  id: number;
  cliente_id: number;
  vendedor: string;
  status: string;
  data_criacao: string;
  data_atualizacao: string;
  documento_fiscal?: string;
  origem?: string;
  produtos: Array<{
    id: number;
    pivot: {
      quantidade: number;
      preco_unitario: number;
    };
  }>;
}

export const transformPedido = (data: PedidoData): Pedido => {
  if (!data || typeof data !== 'object') {
    console.error('Invalid pedido data:', data);
    throw new Error('Dados inválidos recebidos do servidor');
  }

  try {
    const transformed = {
      id: String(data.id),
      clienteId: String(data.cliente_id),
      vendedor: data.vendedor.toLowerCase(),
      status: data.status as Pedido['status'],
      dataCriacao: new Date(data.data_criacao),
      dataAtualizacao: new Date(data.data_atualizacao),
      documentoFiscal: data.documento_fiscal,
      origem: data.origem,
      itens: data.produtos?.map(produto => ({
        produtoId: String(produto.id),
        quantidade: Number(produto.pivot.quantidade),
        precoUnitario: Number(produto.pivot.preco_unitario)
      })) || []
    };

    const { isValid, errors } = validatePedido(transformed);
    if (!isValid) {
      console.error('Validation errors:', errors);
      throw new Error('Dados transformados inválidos');
    }

    return transformed;
  } catch (error) {
    console.error('Error transforming pedido:', error);
    throw new Error('Erro ao processar dados do pedido');
  }
};