import { MateriaPrima } from '../../types';

export const validateMateriaPrima = (data: Partial<MateriaPrima>) => {
  const errors: Partial<Record<keyof MateriaPrima, string>> = {};

  if (!data.nome?.trim()) {
    errors.nome = 'Nome é obrigatório';
  }

  if (typeof data.quantidade !== 'number' || data.quantidade < 0) {
    errors.quantidade = 'Quantidade deve ser maior ou igual a zero';
  }

  if (!data.unidadeMedida?.trim()) {
    errors.unidadeMedida = 'Unidade de medida é obrigatória';
  }

  if (typeof data.precoUnitario !== 'number' || data.precoUnitario <= 0) {
    errors.precoUnitario = 'Preço unitário deve ser maior que zero';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateMateriaPrimaResponse = (data: any): boolean => {
  if (!data || typeof data !== 'object') return false;
  
  return (
    typeof data.id === 'number' &&
    typeof data.nome === 'string' &&
    (typeof data.quantidade === 'number' || typeof data.quantidade === 'string') &&
    typeof data.unidade_medida === 'string' &&
    (typeof data.preco_unitario === 'number' || typeof data.preco_unitario === 'string')
  );
};