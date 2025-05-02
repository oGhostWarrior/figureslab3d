import React from 'react';
import { StatusPedido } from '../../types';

interface PedidoStatusProps {
  status: StatusPedido;
  onChange: (status: StatusPedido) => void;
}

const PedidoStatus: React.FC<PedidoStatusProps> = ({ status, onChange }) => {
  return (
    <select
      value={status}
      onChange={(e) => onChange(e.target.value as StatusPedido)}
      className="text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
    >
      <option value="pendente">Pendente</option>
      <option value="em_producao">Em Produção</option>
      <option value="concluido">Concluído</option>
    </select>
  );
};

export default PedidoStatus;