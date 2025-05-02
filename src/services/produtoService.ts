import api from './api';
import { Produto } from '../types';
import { transformProduto, createProdutoPayload } from '../utils/transformers/produto';
import { validateProdutoResponse } from '../utils/validation/produto';
import { handleApiError } from '../utils/api/errorHandler';

interface ProdutoResponse {
  id: number;
  nome: string;
  preco: number;
  estoque: number;
  foto: string;
  materias_primas: Array<{
    id: number;
    nome: string;
    unidade_medida: string;
    pivot: {
      quantidade: number;
    };
  }>;
}

export const produtoService = {
  listar: async () => {
    try {
      const response = await api.get<ProdutoResponse[]>('/produtos');
      return response.data.map(transformProduto);
    } catch (error) {
      return handleApiError(error, 'Erro ao listar produtos');
    }
  },

  criar: async (produto: Omit<Produto, 'id'>) => {
    try {
      const payload = createProdutoPayload(produto);
      const response = await api.post<ProdutoResponse>('/produtos', payload);

      if (!validateProdutoResponse(response.data)) {
        throw new Error('Dados inválidos recebidos do servidor');
      }

      return transformProduto(response.data);
    } catch (error) {
      return handleApiError(error, 'Erro ao criar produto');
    }
  },

  atualizar: async (id: string, produto: Omit<Produto, 'id'>) => {
    try {
      const payload = createProdutoPayload(produto);
      const response = await api.post<ProdutoResponse>(`/produtos/${id}`, {
        _method: 'PUT',
        ...payload,
      });

      if (!validateProdutoResponse(response.data)) {
        throw new Error('Dados inválidos recebidos do servidor');
      }

      return transformProduto(response.data);
    } catch (error) {
      return handleApiError(error, 'Erro ao atualizar produto');
    }
  },

  excluir: async (id: string) => {
    try {
      const response = await fetch(`/api/v1/produtos/delete/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      });

      if (!response.ok) throw new Error('Erro HTTP: ' + response.status);
      
      return await response.json();
      
    } catch (error) {
      console.error('Erro definitivo na exclusão:', error);
      throw new Error('Não foi possível excluir. Tente novamente mais tarde.');
    }
  }
}