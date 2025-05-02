import React from 'react';
import { useStore } from '../store/useStore';
import ReportGenerator from '../components/reports/ReportGenerator';
import Card from '../components/ui/Card';
import { formatCurrency } from '../utils/formatters';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SellerConfig from '../components/SellerConfig';
import { getSellerName } from '../config/sellers';

const Relatorios: React.FC = () => {
  const { pedidos, produtos, materiasPrimas, loading, error } = useStore();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  const totalVendas = pedidos.reduce((total, pedido) => {
    return total + pedido.itens.reduce((subtotal, item) => {
      return subtotal + (item.quantidade * item.precoUnitario);
    }, 0);
  }, 0);

  const valorTotalEstoque = produtos.reduce((total, produto) => {
    return total + (produto.preco * produto.estoque);
  }, 0);

  const valorTotalMateriasPrimas = materiasPrimas.reduce((total, mp) => {
    return total + (mp.precoUnitario * mp.quantidade);
  }, 0);

  const vendasPorVendedor = pedidos.reduce((acc, pedido) => {
    const vendedor = pedido.vendedor;
    const total = pedido.itens.reduce((sum, item) => sum + (item.quantidade * item.precoUnitario), 0);
    
    acc[vendedor] = {
      total: (acc[vendedor]?.total || 0) + total,
      quantidade: (acc[vendedor]?.quantidade || 0) + 1
    };
    
    return acc;
  }, {} as Record<string, { total: number; quantidade: number }>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
        <ReportGenerator />
      </div>

      <SellerConfig />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Vendas</h3>
          <div className="space-y-2">
            <p>Total de Vendas: {formatCurrency(totalVendas)}</p>
            <p>Pedidos Concluídos: {pedidos.filter(p => p.status === 'concluido').length}</p>
            <p>Pedidos Pendentes: {pedidos.filter(p => p.status === 'pendente').length}</p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Vendas por Vendedor</h3>
          <div className="space-y-2">
            {Object.entries(vendasPorVendedor).map(([vendedor, dados]) => (
              <div key={vendedor} className="flex justify-between items-center">
                <span>{getSellerName(vendedor)}</span>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(dados.total)}</p>
                  <p className="text-sm text-gray-500">{dados.quantidade} pedidos</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Estoque</h3>
          <div className="space-y-2">
            <p>Valor Total em Estoque: {formatCurrency(valorTotalEstoque)}</p>
            <p>Produtos com Estoque Baixo: {produtos.filter(p => p.estoque < 5).length}</p>
            <p>Total de Produtos: {produtos.length}</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Produtos com Estoque Baixo</h3>
          <div className="space-y-2">
            {produtos.filter(p => p.estoque < 5).map(produto => (
              <div key={produto.id} className="flex justify-between items-center">
                <span>{produto.nome}</span>
                <span className="text-red-600 font-medium">{produto.estoque} unidades</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Análise Financeira</h3>
          <div className="space-y-2">
            <p>Custo Total (Matérias-Primas): {formatCurrency(valorTotalMateriasPrimas)}</p>
            <p>Receita Total: {formatCurrency(totalVendas)}</p>
            <p className="font-semibold">
              Lucro Estimado: {formatCurrency(totalVendas - valorTotalMateriasPrimas)}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Relatorios;