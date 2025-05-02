import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { Printer, Package, Users, AlertCircle, FileDown } from 'lucide-react';
import Button from '../components/Button';
import SearchBar from '../components/SearchBar';
import PedidoPDF from '../components/PedidoPDF';
import Tooltip from '../components/ui/Tooltip';
import { Pedido } from '../types';
import { formatDate } from '../utils/formatters';

const Dashboard: React.FC = () => {
  const { pedidos, produtos, clientes } = useStore();
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const pedidosPendentes = pedidos.filter(p => p.status === 'pendente');
  const produtosBaixoEstoque = produtos.filter(p => p.estoque < 5);

  const pedidosOrdenados = useMemo(() => {
    return [...pedidos].sort((a, b) => 
      new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime()
    );
  }, [pedidos]);

  const pedidosFiltrados = useMemo(() => {
    const searchTermLower = searchTerm.toLowerCase().trim();
    
    if (!searchTermLower) return pedidosOrdenados;

    return pedidosOrdenados.filter(pedido => {
      const cliente = clientes.find(c => c.id === pedido.clienteId);
      
      return (
        pedido.id.toLowerCase().includes(searchTermLower) ||
        cliente?.nome.toLowerCase().includes(searchTermLower) ||
        cliente?.email.toLowerCase().includes(searchTermLower)
      );
    });
  }, [pedidosOrdenados, searchTerm, clientes]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Tooltip
          content={
            <div className="space-y-2">
              <p className="font-semibold">Pedidos Pendentes:</p>
              {pedidosPendentes.length > 0 ? (
                <ul className="list-disc list-inside">
                  {pedidosPendentes.map(pedido => {
                    const cliente = clientes.find(c => c.id === pedido.clienteId);
                    return (
                      <li key={pedido.id}>
                        #{pedido.id} - {cliente?.nome}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p>Nenhum pedido pendente</p>
              )}
            </div>
          }
        >
          <div className="bg-white p-6 rounded-lg shadow cursor-help">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pedidos Pendentes</p>
                <p className="text-2xl font-semibold">{pedidosPendentes.length}</p>
              </div>
              <Printer className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
        </Tooltip>

        <Tooltip
          content={
            <div className="space-y-2">
              <p className="font-semibold">Produtos com Estoque Baixo:</p>
              {produtosBaixoEstoque.length > 0 ? (
                <ul className="list-disc list-inside">
                  {produtosBaixoEstoque.map(produto => (
                    <li key={produto.id}>
                      {produto.nome} - {produto.estoque} unidades
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Nenhum produto com estoque baixo</p>
              )}
            </div>
          }
        >
          <div className="bg-white p-6 rounded-lg shadow cursor-help">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Produtos com Estoque Baixo</p>
                <p className="text-2xl font-semibold">{produtosBaixoEstoque.length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </Tooltip>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Produtos</p>
              <p className="text-2xl font-semibold">{produtos.length}</p>
            </div>
            <Package className="h-8 w-8 text-indigo-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Clientes</p>
              <p className="text-2xl font-semibold">{clientes.length}</p>
            </div>
            <Users className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Pedidos</h2>
          <div className="w-72">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Buscar por ID ou cliente..."
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pedidosFiltrados.map((pedido) => {
                const cliente = clientes.find(c => c.id === pedido.clienteId);
                return (
                  <tr key={pedido.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      #{pedido.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{cliente?.nome}</div>
                        <div className="text-gray-500">{cliente?.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${pedido.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' : 
                          pedido.status === 'em_producao' ? 'bg-blue-100 text-blue-800' : 
                          'bg-green-100 text-green-800'}`}>
                        {pedido.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(pedido.dataCriacao)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="secondary"
                        icon={FileDown}
                        onClick={() => setSelectedPedido(pedido)}
                      >
                        Ver PDF
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {pedidosFiltrados.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              Nenhum pedido encontrado com os critérios de busca.
            </div>
          )}
        </div>
      </div>

      {selectedPedido && (
        <PedidoPDF
          pedido={selectedPedido}
          cliente={clientes.find(c => c.id === selectedPedido.clienteId)!}
          produtos={produtos}
          onClose={() => setSelectedPedido(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;