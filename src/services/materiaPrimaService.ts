import api from './api';
import { MateriaPrima } from '../types';
import { transformMateriaPrima, createMateriaPrimaPayload } from '../utils/transformers/materiaPrima';
import { validateMateriaPrimaResponse } from '../utils/validation/materiaPrima';
import { handleApiError } from '../utils/api/errorHandler';

interface MateriaPrimaResponse {
  id: number;
  nome: string;
  quantidade: number;
  unidade_medida: string;
  preco_unitario: number;
  created_at?: string;
  updated_at?: string;
}

export const materiaPrimaService = {
  listar: async () => {
    try {
      const response = await api.get<MateriaPrimaResponse[]>('/materias-primas');
      return response.data.map(transformMateriaPrima);
    } catch (error) {
      return handleApiError(error, 'Erro ao listar matérias-primas');
    }
  },

  criar: async (materiaPrima: Omit<MateriaPrima, 'id'>) => {
    try {
      const payload = createMateriaPrimaPayload(materiaPrima);
      const response = await api.post<MateriaPrimaResponse>('/materias-primas', payload);

      if (!validateMateriaPrimaResponse(response.data)) {
        throw new Error('Dados inválidos recebidos do servidor');
      }

      return transformMateriaPrima(response.data);
    } catch (error) {
      return handleApiError(error, 'Erro ao criar matéria-prima');
    }
  },

  atualizar: async (id: string, materiaPrima: Omit<MateriaPrima, 'id'>) => {
    try {
      const payload = createMateriaPrimaPayload(materiaPrima);
      console.log('Atualizando MateriaPrima:', { id, materiaPrima: payload });

      const response = await api.put<MateriaPrimaResponse>(`/materias-primas/${id}`, payload);
      
      if (!response.data || !validateMateriaPrimaResponse(response.data)) {
        throw new Error('Dados inválidos recebidos do servidor');
      }

      return transformMateriaPrima(response.data);
    } catch (error) {
      return handleApiError(error, 'Erro ao atualizar matéria-prima');
    }
  },

  excluir: async (id: string) => {
    try {
      await api.delete(`/materias-primas/${id}`);
    } catch (error) {
      return handleApiError(error, 'Erro ao excluir matéria-prima');
    }
  },

  atualizarEstoque: async (id: string, quantidade: number) => {
    try {
      const response = await api.patch<MateriaPrimaResponse>(
        `/materias-primas/${id}/estoque`, 
        { quantidade: Number(quantidade) }
      );

      if (!validateMateriaPrimaResponse(response.data)) {
        throw new Error('Dados inválidos recebidos do servidor');
      }

      return transformMateriaPrima(response.data);
    } catch (error) {
      return handleApiError(error, 'Erro ao atualizar estoque');
    }
  }
};