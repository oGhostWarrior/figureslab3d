import api from './api';
import { Cliente } from '../types';
import { transformCliente, createClientePayload } from '../utils/transformers/cliente';
import { validateClienteResponse } from '../utils/validation/cliente';
import { handleApiError } from '../utils/api/errorHandler';

interface ClienteResponse {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
}

export const clienteService = {
  listar: async () => {
    try {
      const response = await api.get<ClienteResponse[]>('/clientes');
      return response.data.map(transformCliente);
    } catch (error) {
      return handleApiError(error, 'Erro ao listar clientes');
    }
  },

  criar: async (cliente: Omit<Cliente, 'id'>) => {
    try {
      const payload = createClientePayload(cliente);
      const response = await api.post<ClienteResponse>('/clientes', payload);

      if (!validateClienteResponse(response.data)) {
        throw new Error('Dados inválidos recebidos do servidor');
      }

      return transformCliente(response.data);
    } catch (error) {
      return handleApiError(error, 'Erro ao criar cliente');
    }
  },

  atualizar: async (id: string, cliente: Omit<Cliente, 'id'>) => {
    try {
      const payload = createClientePayload(cliente);
      const response = await api.put<ClienteResponse>(`/clientes/${id}`, payload);
      
      if (!validateClienteResponse(response.data)) {
        throw new Error('Dados inválidos recebidos do servidor');
      }

      return transformCliente(response.data);
    } catch (error) {
      return handleApiError(error, 'Erro ao atualizar cliente');
    }
  },

  excluir: async (id: string) => {
    try {
      await api.delete(`/clientes/${id}`);
    } catch (error) {
      return handleApiError(error, 'Erro ao excluir cliente');
    }
  }
};