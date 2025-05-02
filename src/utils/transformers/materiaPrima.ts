import { MateriaPrima } from '../../types';
import { validateMateriaPrima } from '../validation/materiaPrima';

interface MateriaPrimaData {
  id: number;
  nome: string;
  quantidade: number | string;
  unidade_medida: string;
  preco_unitario: number | string;
}

export const transformMateriaPrima = (data: MateriaPrimaData): MateriaPrima => {
  if (!data || typeof data !== 'object') {
    throw new Error('Dados inválidos recebidos do servidor');
  }

  const transformed = {
    id: String(data.id),
    nome: String(data.nome || ''),
    quantidade: Number(data.quantidade || 0),
    unidadeMedida: String(data.unidade_medida || ''),
    precoUnitario: Number(data.preco_unitario || 0)
  };

  const { isValid, errors } = validateMateriaPrima(transformed);
  if (!isValid) {
    console.error('Validation errors:', errors);
    throw new Error('Dados transformados inválidos');
  }

  return transformed;
};

export const createMateriaPrimaPayload = (materiaPrima: Omit<MateriaPrima, 'id'>) => {
  const { isValid, errors } = validateMateriaPrima(materiaPrima);
  if (!isValid) {
    console.error('Validation errors:', errors);
    throw new Error('Dados inválidos para criar payload');
  }

  return {
    nome: String(materiaPrima.nome).trim(),
    quantidade: Number(materiaPrima.quantidade),
    unidade_medida: String(materiaPrima.unidadeMedida).trim(),
    preco_unitario: Number(materiaPrima.precoUnitario)
  };
};