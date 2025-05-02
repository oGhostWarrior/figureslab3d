import { jsPDF } from 'jspdf';
import { COLORS, FONTS } from './reportStyles';

export const drawBarChart = (
  doc: jsPDF,
  data: { label: string; value: number }[],
  startX: number,
  startY: number,
  width: number,
  height: number,
  title: string
) => {

  doc.setFontSize(FONTS.subtitle.size);
  doc.setFont('helvetica', FONTS.subtitle.style);
  doc.text(title, startX, startY);
  startY += 20;

  const chartStartY = startY + height;
  const maxValue = Math.max(...data.map(d => d.value));
  const barWidth = (width - 20) / data.length;
  const scale = height / (maxValue * 1.2);

  doc.setDrawColor(...COLORS.chart.grid);
  doc.setLineWidth(0.5);
  doc.line(startX, chartStartY, startX, chartStartY - height);
  doc.line(startX, chartStartY, startX + width - 20, chartStartY);

  data.forEach((item, index) => {
    const barHeight = item.value * scale;
    const x = startX + (index * barWidth);
    
    doc.setFillColor(...COLORS.chart.bar);
    doc.rect(x + 5, chartStartY - barHeight, barWidth - 10, barHeight, 'F');
    
    doc.setFontSize(FONTS.small.size);
    doc.setTextColor(0, 0, 0);
    doc.text(
      item.value.toString(),
      x + (barWidth / 2),
      chartStartY - barHeight - 5,
      { align: 'center' }
    );
    
    doc.text(
      item.label,
      x + (barWidth / 2),
      chartStartY + 15,
      { 
        align: 'center',
        maxWidth: barWidth - 5,
        angle: 45
      }
    );
  });

  return chartStartY + 40;