import { Pedido } from '../types';
import { SellerId } from '../types/seller';

const PROFIT_SHARING = {
  vendedor1: { vendedor1: 0.5, vendedor2: 0.5 },
  vendedor2: { vendedor1: 0.35, vendedor2: 0.65 }
} as const;

export interface ProfitCalculation {
  totalProfit: number;
  vendedor1Share: number;
  vendedor2Share: number;
}

export const calculateOrderProfit = (pedido: Pedido, custoProdutos: number): ProfitCalculation => {
  const totalVenda = pedido.itens.reduce((total, item) => 
    total + (item.quantidade * item.precoUnitario), 0);
  
  const lucroTotal = totalVenda - custoProdutos;
  
  const vendedor = String(pedido.vendedor).toLowerCase() as SellerId;
  console.log('Processing order for vendedor:', vendedor);
  
  const divisao = PROFIT_SHARING[vendedor];

  if (!divisao) {
    console.warn(`Vendedor inválido: ${vendedor}, usando divisão padrão`);
    return {
      totalProfit: lucroTotal,
      vendedor1Share: lucroTotal * 0.5,
      vendedor2Share: lucroTotal * 0.5
    };
  }

  return {
    totalProfit: lucroTotal,
    vendedor1Share: lucroTotal * divisao.vendedor1,
    vendedor2Share: lucroTotal * divisao.vendedor2
  };
};

export const calculateTotalProfitsByVendedor = (
  pedidos: Pedido[],
  custosPorPedido: Record<string, number>
): Record<SellerId, {
  totalVendas: number;
  lucroTotal: number;
  participacaoLucro: number;
}> => {
  console.log('Processing pedidos:', pedidos);

  const result = {
    vendedor1: { totalVendas: 0, lucroTotal: 0, participacaoLucro: 0 },
    vendedor2: { totalVendas: 0, lucroTotal: 0, participacaoLucro: 0 }
  };

  pedidos.forEach(pedido => {
    const custoPedido = custosPorPedido[pedido.id] || 0;

    const vendedor = String(pedido.vendedor).toLowerCase() as SellerId;
    console.log('Processing pedido:', { id: pedido.id, vendedor });

    const { totalProfit, vendedor1Share, vendedor2Share } = calculateOrderProfit(pedido, custoPedido);

    if (vendedor === 'vendedor2') {
      result.vendedor2.totalVendas++;
      result.vendedor2.lucroTotal += totalProfit;
    } else {
      result.vendedor1.totalVendas++;
      result.vendedor1.lucroTotal += totalProfit;
    }

    result.vendedor1.participacaoLucro += vendedor1Share;
    result.vendedor2.participacaoLucro += vendedor2Share;
  });

  console.log('Final result:', result);
  return result;
};