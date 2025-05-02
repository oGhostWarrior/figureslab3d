import { Produto } from '../../types';
import { validateProduto } from '../validation/produto';

interface ProdutoData {
  id: number;
  nome: string;
  preco: number | string;
  estoque: number | string;
  foto: string;
  materias_primas: Array<{
    id: number;
    pivot: {
      quantidade: number;
    };
  }>;
}

export const transformProduto = (data: ProdutoData): Produto => {
  if (!data || typeof data !== 'object') {
    throw new Error('Dados inválidos recebidos do servidor');
  }

  const transformed = {
    id: String(data.id),
    nome: String(data.nome || ''),
    preco: Number(data.preco || 0),
    estoque: Number(data.estoque || 0),
    foto: String(data.foto || ''),
    materiaPrima: data.materias_primas?.map(mp => ({
      id: String(mp.id),
      quantidade: Number(mp.pivot.quantidade)
    })) || []
  };

  const { isValid, errors } = validateProduto(transformed);
  if (!isValid) {
    console.error('Validation errors:', errors);
    throw new Error('Dados transformados inválidos');
  }

  return transformed;
};

export const createProdutoPayload = (produto: Omit<Produto, 'id'>) => {
  const { isValid, errors } = validateProduto(produto);
  if (!isValid) {
    console.error('Validation errors:', errors);
    throw new Error('Dados inválidos para criar payload');
  }

  return {
    nome: String(produto.nome).trim(),
    preco: Number(produto.preco),
    estoque: Number(produto.estoque),
    foto: String(produto.foto).trim(),
    materiaPrima: produto.materiaPrima.map(mp => ({
      id: mp.id,
      quantidade: Number(mp.quantidade)
    }))
  };
};