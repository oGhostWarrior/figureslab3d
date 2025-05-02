import React from 'react';
import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { FileText } from 'lucide-react';
import Button from '../Button';
import { useStore } from '../../store/useStore';
import { setupPage } from '../../utils/pdf/reportStyles';
import { drawBarChart } from '../../utils/pdf/charts';
import { addFinancialSummary } from '../../utils/pdf/sections/financialSummary';
import { calculateTotalProfitsByVendedor } from '../../utils/profit';
import { formatCurrency } from '../../utils/formatters';
import { getSellerName } from '../../config/sellers';

const ReportGenerator: React.FC = () => {
  const { pedidos, produtos, materiasPrimas } = useStore();

  const generateReport = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm'
    });

    let yPos = 20;
    setupPage(doc);
    
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Relatório Gerencial', pageWidth / 2, 25, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, pageWidth / 2, 35, { align: 'center' });

    doc.setTextColor(31, 41, 55);
    yPos = 50;

    const receitaBruta = pedidos.reduce((total, pedido) => 
      total + pedido.itens.reduce((sum, item) => sum + (item.quantidade * item.precoUnitario), 0), 0);

    const custoProducao = pedidos.reduce((total, pedido) => {
      return total + pedido.itens.reduce((subtotal, item) => {
        const produto = produtos.find(p => p.id === item.produtoId);
        if (!produto) return subtotal;
        
        const custoProduto = produto.materiaPrima.reduce((custoMP, mp) => {
          const materiaPrima = materiasPrimas.find(m => m.id === mp.id);
          if (!materiaPrima) return custoMP;
          return custoMP + (mp.quantidade * materiaPrima.precoUnitario);
        }, 0);

        return subtotal + (custoProduto * item.quantidade);
      }, 0);
    }, 0);

    const lucroLiquido = receitaBruta - custoProducao;
    const valorEstoqueProdutos = produtos.reduce((total, produto) => 
      total + (produto.preco * produto.estoque), 0);
    const valorEstoqueMP = materiasPrimas.reduce((total, mp) => 
      total + (mp.precoUnitario * mp.quantidade), 0);

    yPos = addFinancialSummary(doc, {
      receitaBruta,
      custoProducao,
      lucroLiquido,
      valorEstoqueProdutos,
      valorEstoqueMP
    }, yPos);

    if (yPos > pageHeight - 60) {
      doc.addPage();
      yPos = 20;
    }

    const custosPorPedido = pedidos.reduce((acc, pedido) => {
      const custoPedido = pedido.itens.reduce((custo, item) => {
        const produto = produtos.find(p => p.id === item.produtoId);
        if (!produto) return custo;
        
        const custoProduto = produto.materiaPrima.reduce((total, mp) => {
          const materiaPrima = materiasPrimas.find(m => m.id === mp.id);
          if (!materiaPrima) return total;
          return total + (mp.quantidade * materiaPrima.precoUnitario);
        }, 0);

        return custo + (custoProduto * item.quantidade);
      }, 0);

      return { ...acc, [pedido.id]: custoPedido };
    }, {} as Record<string, number>);

    const analiseVendedores = calculateTotalProfitsByVendedor(pedidos, custosPorPedido);
    
    yPos += 20;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Análise por Vendedor', 20, yPos);
    yPos += 15;

    Object.entries(analiseVendedores).forEach(([vendedor, dados]) => {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(getSellerName(vendedor), 25, yPos);
      yPos += 10;
      
      doc.setFont('helvetica', 'normal');
      doc.text(`Total de Vendas: ${dados.totalVendas}`, 30, yPos);
      yPos += 7;
      doc.text(`Lucro Total: ${formatCurrency(dados.lucroTotal)}`, 30, yPos);
      yPos += 7;
      doc.text(`Participação nos Lucros: ${formatCurrency(dados.participacaoLucro)}`, 30, yPos);
      yPos += 15;
    });

    if (yPos > pageHeight - 100) {
      doc.addPage();
      yPos = 20;
    }

    const produtosVendidos = pedidos.reduce((acc, pedido) => {
      pedido.itens.forEach(item => {
        const produto = produtos.find(p => p.id === item.produtoId);
        if (produto) {
          acc[produto.nome] = (acc[produto.nome] || 0) + item.quantidade;
        }
      });
      return acc;
    }, {} as Record<string, number>);

    const topProdutos = Object.entries(produtosVendidos)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([nome, valor]) => ({ label: nome, value: valor }));

    drawBarChart(
      doc,
      topProdutos,
      20,
      yPos + 20,
      pageWidth - 40,
      80,
      'Produtos Mais Vendidos'
    );

    const dataFormatada = format(new Date(), 'dd-MM-yyyy_HH-mm');
    doc.save(`relatorio-gerencial_${dataFormatada}.pdf`);
  };

  return (
    <Button onClick={generateReport} icon={FileText}>
      Gerar Relatório PDF
    </Button>
  );
};

export default ReportGenerator;