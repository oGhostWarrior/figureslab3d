import { Produto } from '../../types';

export const validateProduto = (data: Partial<Produto>) => {
  const errors: Partial<Record<keyof Produto, string>> = {};

  if (!data.nome?.trim()) {
    errors.nome = 'Nome é obrigatório';
  }

  if (typeof data.preco !== 'number' || data.preco <= 0) {
    errors.preco = 'Preço deve ser maior que zero';
  }

  if (typeof data.estoque !== 'number' || data.estoque < 0) {
    errors.estoque = 'Estoque não pode ser negativo';
  }

  if (!data.foto?.trim()) {
    errors.foto = 'URL da foto é obrigatória';
  }

  if (!data.materiaPrima || !Array.isArray(data.materiaPrima) || data.materiaPrima.length === 0) {
    errors.materiaPrima = 'Pelo menos uma matéria-prima é obrigatória';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateProdutoResponse = (data: any): boolean => {
  if (!data || typeof data !== 'object') return false;
  
  return (
    typeof data.id === 'number' &&
    typeof data.nome === 'string' &&
    (typeof data.preco === 'number' || typeof data.preco === 'string') &&
    (typeof data.estoque === 'number' || typeof data.estoque === 'string') &&
    typeof data.foto === 'string' &&
    Array.isArray(data.materias_primas) &&
    (typeof data.descricao === 'string' || data.descricao === null) &&
    (Array.isArray(data.fotos))
  );
};
