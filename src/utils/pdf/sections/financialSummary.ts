import { jsPDF } from 'jspdf';
import { formatCurrency } from '../../formatters';
import { FONTS } from '../reportStyles';

interface FinancialData {
  receitaBruta: number;
  custoProducao: number;
  lucroLiquido: number;
  valorEstoqueProdutos: number;
  valorEstoqueMP: number;
}

export const addFinancialSummary = (
  doc: jsPDF,
  data: FinancialData,
  startY: number
): number => {
  const margin = 20;
  const pageWidth = doc.internal.pageSize.width;
  let yPos = startY;

  doc.setFillColor(245, 247, 250);
  doc.rect(margin - 5, yPos - 5, pageWidth - (2 * margin) + 10, 100, 'F');

  doc.setFontSize(FONTS.subtitle.size);
  doc.setFont('helvetica', FONTS.subtitle.style);
  doc.text('Resumo Financeiro', margin, yPos);
  yPos += 20;

  const col1X = margin + 10;
  const col2X = (pageWidth / 2) + 20;
  const valueOffset = 120;

  const addFinancialRow = (label: string, value: number, x: number, y: number, isTotal = false) => {
    doc.setFont('helvetica', isTotal ? 'bold' : 'normal');
    doc.setFontSize(isTotal ? 12 : 10);
    doc.text(label, x, y);
    const formattedValue = formatCurrency(value);
    doc.text(formattedValue, x + valueOffset, y, { align: 'right' });
  };

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Resultados', col1X, yPos);
  yPos += 12;

  addFinancialRow('Receita Bruta:', data.receitaBruta, col1X, yPos);
  addFinancialRow('(-) Custo Produção:', data.custoProducao, col1X, yPos + 15);
  doc.line(col1X, yPos + 20, col1X + valueOffset + 20, yPos + 20);
  addFinancialRow('(=) Lucro Líquido:', data.lucroLiquido, col1X, yPos + 30, true);

  const col2Y = yPos - 12;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Estoque', col2X, col2Y);

  addFinancialRow('Produtos Acabados:', data.valorEstoqueProdutos, col2X, col2Y + 12);
  addFinancialRow('Matéria Prima:', data.valorEstoqueMP, col2X, col2Y + 27);
  doc.line(col2X, col2Y + 32, col2X + valueOffset + 20, col2Y + 32);
  addFinancialRow('Total em Estoque:', data.valorEstoqueProdutos + data.valorEstoqueMP, col2X, col2Y + 42, true);

  return startY + 110;
};