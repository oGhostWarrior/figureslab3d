import { Cliente } from '../../types';

export const validateCliente = (data: Partial<Cliente>) => {
  const errors: Partial<Record<keyof Cliente, string>> = {};

  if (!data.nome?.trim()) {
    errors.nome = 'Nome é obrigatório';
  }

  if (!data.email?.trim()) {
    errors.email = 'Email é obrigatório';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Email inválido';
  }

  if (!data.telefone?.trim()) {
    errors.telefone = 'Telefone é obrigatório';
  }

  if (!data.endereco?.trim()) {
    errors.endereco = 'Endereço é obrigatório';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateClienteResponse = (data: any): boolean => {
  if (!data || typeof data !== 'object') return false;
  
  return (
    typeof data.id === 'number' &&
    typeof data.nome === 'string' &&
    typeof data.email === 'string' &&
    typeof data.telefone === 'string' &&
    typeof data.endereco === 'string'
  );
};