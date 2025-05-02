```
import React from 'react';
import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { FileText } from 'lucide-react';
import { useStore } from '../../store/useStore';
import Button from '../Button';
import { formatCurrency } from '../../utils/formatters';
import { getSellerName } from '../../config/sellers';
import { calculateTotalProfitsByVendedor } from '../../utils/profit';

const ReportGenerator: React.FC = () => {
  const { pedidos, produtos, materiasPrimas } = useStore();

  const drawBarChart = (
    doc: jsPDF,
    data: { label: string; value: number }[],
    startX: number,
    startY: number,
    width: number,
    height: number,
    title: string
  ) => {
    // Draw title
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(title, startX, startY - height - 10);
    
    const maxValue = Math.max(...data.map(d => d.value));
    const barWidth = width / data.length;
    const scale = height / maxValue;

    // Draw axis
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(startX, startY, startX, startY - height);
    doc.line(startX, startY, startX + width, startY);

    // Draw bars
    data.forEach((item, index) => {
      const barHeight = item.value * scale;
      const x = startX + (index * barWidth);
      
      // Draw bar
      doc.setFillColor(79, 70, 229);
      doc.rect(x + 2, startY - barHeight, barWidth - 4, barHeight, 'F');
      
      // Draw label
      doc.setFontSize(8);
      doc.text(
        item.label,
        x + (barWidth / 2),
        startY + 10,
        { align: 'center', maxWidth: barWidth }
      );
      
      // Draw value
      doc.text(
        item.value.toString(),
        x + (barWidth / 2),
        startY - barHeight - 5,
        { align: 'center' }
      );
    });
  };

  const generateReport = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    let yPos = 20;

    // Background and header styling
    doc.setFillColor(249, 250, 251);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Relatório Gerencial', pageWidth / 2, 25, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, pageWidth / 2, 35, { align: 'center' });

    // Reset text color
    doc.setTextColor(31, 41, 55);
    yPos = 60;

    // Resumo Financeiro
    const totalVendas = pedidos.reduce((total, pedido) => {
      return total + pedido.itens.reduce((subtotal, item) => {
        return subtotal + (item.quantidade * item.precoUnitario);
      }, 0);
    }, 0);

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

    // Análise de vendedores com participação nos lucros
    const analiseVendedores = calculateTotalProfitsByVendedor(pedidos, custosPorPedido);

    // Seção de Resumo Financeiro
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumo Financeiro', 20, yPos);
    yPos += 15;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Receita Total: ${formatCurrency(totalVendas)}`, 25, yPos);
    yPos += 10;

    // Análise de Vendedores
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

    // Produtos mais vendidos (gráfico de barras)
    yPos += 20;
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
      yPos + 60,
      pageWidth - 40,
      50,
      'Produtos Mais Vendidos'
    );

    // Salvar o PDF
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