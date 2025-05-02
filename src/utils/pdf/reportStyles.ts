import { jsPDF } from 'jspdf';

export const COLORS = {
  primary: [79, 70, 229], // Indigo
  white: [255, 255, 255],
  text: [31, 41, 55],
  background: [249, 250, 251],
  chart: {
    bar: [79, 70, 229],
    grid: [229, 231, 235]
  }
};

export const FONTS = {
  title: { size: 24, style: 'bold' },
  subtitle: { size: 16, style: 'bold' },
  normal: { size: 12, style: 'normal' },
  small: { size: 10, style: 'normal' }
};

export const setupPage = (doc: jsPDF) => {
  const pageWidth = doc.internal.pageSize.width;
  
  doc.setFillColor(...COLORS.background);
  doc.rect(0, 0, pageWidth, doc.internal.pageSize.height, 'F');

  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, pageWidth, 40, 'F');
};