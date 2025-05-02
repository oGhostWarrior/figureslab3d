import api from './api';
import { Pedido, StatusPedido } from '../types';
import { transformPedido } from '../utils/transformers/pedido';
import { validatePedidoResponse } from '../utils/validation/pedido';
import { handleApiError } from '../utils/api/errorHandler';

interface PedidoResponse {
  id: number;
  cliente_id: number;
  vendedor: string;
  status: StatusPedido;
  data_criacao: string;
  data_atualizacao: string;
  documento_fiscal?: string;
  origem?: string;
  produtos: Array<{
    id: number;
    nome: string;
    pivot: {
      quantidade: number;
      preco_unitario: number;
    };
  }>;
}

export const pedidoService = {
  listar: async () => {
    try {
      const response = await api.get<PedidoResponse[]>('/pedidos');
      return response.data.map(transformPedido);
    } catch (error) {
      return handleApiError(error, 'Erro ao listar pedidos');
    }
  },

  criar: async (formData: FormData) => {
    try {
      // Garantir que o campo origem seja incluído no FormData
      const origem = formData.get('origem');
      if (!origem && formData.has('origem')) {
        formData.delete('origem');
      }

      // Log para debug
      console.log('FormData antes do envio:', {
        clienteId: formData.get('cliente_id'),
        vendedor: formData.get('vendedor'),
        origem: formData.get('origem'),
        documentoFiscal: formData.get('documento_fiscal')
      });

      const response = await api.post<PedidoResponse>('/pedidos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!validatePedidoResponse(response.data)) {
        console.error('Invalid response data:', response.data);
        throw new Error('Dados inválidos recebidos do servidor');
      }

      return transformPedido(response.data);
    } catch (error) {
      return handleApiError(error, 'Erro ao criar pedido');
    }
  },

  obter: async (id: string) => {
    try {
      const response = await api.get<PedidoResponse>(`/pedidos/${id}`);
      
      if (!validatePedidoResponse(response.data)) {
        throw new Error('Dados inválidos recebidos do servidor');
      }

      return transformPedido(response.data);
    } catch (error) {
      return handleApiError(error, 'Erro ao buscar pedido');
    }
  },

  atualizarStatus: async (id: string, status: StatusPedido) => {
    try {
      const response = await api.post<PedidoResponse>(`/pedidos/${id}/status`, {
        _method: 'PATCH',
        status,      
      });
      
      if (!validatePedidoResponse(response.data)) {
        throw new Error('Dados inválidos recebidos do servidor');
      }

      return transformPedido(response.data);
    } catch (error) {
      return handleApiError(error, 'Erro ao atualizar status do pedido');
    }
  }
};