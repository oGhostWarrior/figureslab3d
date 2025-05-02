import { Cliente } from '../../types';
import { validateCliente } from '../validation/cliente';

interface ClienteData {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
}

export const transformCliente = (data: ClienteData): Cliente => {
  if (!data || typeof data !== 'object') {
    throw new Error('Dados inválidos recebidos do servidor');
  }

  const transformed = {
    id: String(data.id),
    nome: String(data.nome || ''),
    email: String(data.email || ''),
    telefone: String(data.telefone || ''),
    endereco: String(data.endereco || '')
  };

  const { isValid, errors } = validateCliente(transformed);
  if (!isValid) {
    console.error('Validation errors:', errors);
    throw new Error('Dados transformados inválidos');
  }

  return transformed;
};

export const createClientePayload = (cliente: Omit<Cliente, 'id'>) => {
  const { isValid, errors } = validateCliente(cliente);
  if (!isValid) {
    console.error('Validation errors:', errors);
    throw new Error('Dados inválidos para criar payload');
  }

  return {
    nome: String(cliente.nome).trim(),
    email: String(cliente.email).trim(),
    telefone: String(cliente.telefone).trim(),
    endereco: String(cliente.endereco).trim()
  };
};