import React from 'react';
import { FileText } from 'lucide-react';
import { Pedido, Cliente } from '../../types';
import { formatDate, formatCurrency } from '../../utils/formatters';
import Button from '../Button';
import PedidoStatus from './PedidoStatus';
import { getSellerName } from '../../config/sellers';

interface PedidoTableProps {
  pedidos: Pedido[];
  clientes: Cliente[];
  onStatusChange: (pedidoId: string, status: Pedido['status']) => void;
  onViewPDF: (pedido: Pedido) => void;
}

const PedidoTable: React.FC<PedidoTableProps> = ({
  pedidos,
  clientes,
  onStatusChange,
  onViewPDF
}) => {
  const sortedPedidos = [...pedidos].sort((a, b) => 
    new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime()
  );

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Pedido #
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cliente
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vendedor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedPedidos.map((pedido) => {
            const cliente = clientes.find(c => c.id === pedido.clienteId);
            const total = pedido.itens.reduce((sum, item) => 
              sum + (item.quantidade * item.precoUnitario), 0
            );

            return (
              <tr key={pedido.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">
                    #{pedido.id}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{cliente?.nome}</div>
                  <div className="text-sm text-gray-500">{cliente?.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getSellerName(pedido.vendedor)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <PedidoStatus
                    status={pedido.status}
                    onChange={(status) => onStatusChange(pedido.id, status)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(pedido.dataCriacao)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(total)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button
                    variant="secondary"
                    icon={FileText}
                    onClick={() => onViewPDF(pedido)}
                  >
                    Ver PDF
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PedidoTable;