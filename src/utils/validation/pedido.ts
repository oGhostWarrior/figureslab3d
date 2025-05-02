import { Pedido } from '../../types';

export const validatePedido = (data: Partial<Pedido>) => {
  const errors: Partial<Record<keyof Pedido, string>> = {};

  if (!data.clienteId) {
    errors.clienteId = 'Cliente é obrigatório';
  }

  if (!data.itens || !Array.isArray(data.itens) || data.itens.length === 0) {
    errors.itens = 'Pelo menos um item é obrigatório';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validatePedidoResponse = (data: any): boolean => {
  if (!data || typeof data !== 'object') {
    console.error('Invalid pedido response: data is null or not an object', data);
    return false;
  }

  const hasRequiredFields = (
    data.id !== undefined &&
    data.cliente_id !== undefined &&
    data.status !== undefined &&
    data.data_criacao !== undefined &&
    data.data_atualizacao !== undefined &&
    Array.isArray(data.produtos)
  );

  if (!hasRequiredFields) {
    console.error('Missing required fields in pedido response:', data);
    return false;
  }

  return true;
};