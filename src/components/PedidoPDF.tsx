import React from 'react';
import { jsPDF } from 'jspdf';
import { Printer } from 'lucide-react';
import Button from './Button';
import { formatCurrency } from '../utils/formatters';
import { Pedido, Cliente, Produto } from '../types';

interface PedidoPDFProps {
  pedido: Pedido;
  cliente: Cliente;
  produtos: Produto[];
  onClose: () => void;
}

const PedidoPDF: React.FC<PedidoPDFProps> = ({ pedido, cliente, produtos, onClose }) => {
  const generatePDF = async () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    let yPos = margin;

    // Header with logo and company info
    doc.setFillColor(79, 70, 229); // Indigo color
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('FiguresLab3D', margin, 28);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Pedido #' + pedido.id, pageWidth - margin, 28, { align: 'right' });

    // Reset text color
    doc.setTextColor(0, 0, 0);
    yPos = 60;

    // Customer information box
    doc.setFillColor(249, 250, 251);
    doc.rect(margin - 5, yPos - 5, pageWidth - 2 * margin + 10, 45, 'F');
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Informações do Cliente', margin, yPos);
    yPos += 7;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nome: ${cliente.nome}`, margin + 5, yPos + 7);
    doc.text(`Email: ${cliente.email}`, margin + 5, yPos + 14);
    doc.text(`Telefone: ${cliente.telefone}`, margin + 5, yPos + 21);
    doc.text(`Endereço: ${cliente.endereco}`, margin + 5, yPos + 28);
    
    yPos += 55;

    // Order details
    doc.setFillColor(249, 250, 251);
    doc.rect(margin - 5, yPos - 5, pageWidth - 2 * margin + 10, 30, 'F');
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Detalhes do Pedido', margin, yPos);
    yPos += 7;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Status: ${pedido.status.replace('_', ' ')}`, margin + 5, yPos + 7);
    doc.text(`Data: ${new Date(pedido.dataCriacao).toLocaleDateString()}`, margin + 5, yPos + 14);
    if (pedido.origem) {
      doc.text(`Origem: ${pedido.origem}`, pageWidth - margin - 50, yPos + 7);
    }
    
    yPos += 40;

    // Products
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Produtos', margin, yPos);
    yPos += 15;

    let total = 0;
    for (const item of pedido.itens) {
      const produto = produtos.find(p => p.id === item.produtoId);
      if (!produto) continue;

      const subtotal = item.quantidade * item.precoUnitario;
      total += subtotal;

      // Product box with image
      doc.setFillColor(249, 250, 251);
      doc.rect(margin - 5, yPos - 5, pageWidth - 2 * margin + 10, 50, 'F');

      // Load and draw product image
      try {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = `https://BackendHere/api/v1/proxy-image?url=${encodeURIComponent(produto.foto)}`;
        });
        doc.addImage(img, 'JPEG', margin, yPos, 40, 40, undefined, 'FAST');
      } catch (error) {
        console.error('Error loading product image:', error);
      }

      // Product details
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(produto.nome, margin + 50, yPos + 10);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Quantidade: ${item.quantidade}`, margin + 50, yPos + 20);
      doc.text(`Preço unitário: ${formatCurrency(item.precoUnitario)}`, margin + 50, yPos + 30);
      
      doc.setFont('helvetica', 'bold');
      doc.text(
        `Subtotal: ${formatCurrency(subtotal)}`,
        pageWidth - margin,
        yPos + 20,
        { align: 'right' }
      );

      yPos += 60;

      // Add new page if needed
      if (yPos > doc.internal.pageSize.height - 60) {
        doc.addPage();
        yPos = margin;
      }
    }

    // Total
    doc.setFillColor(79, 70, 229);
    doc.rect(pageWidth - 100, yPos, 80, 30, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Total:', pageWidth - 90, yPos + 12);
    doc.text(formatCurrency(total), pageWidth - 20, yPos + 12, { align: 'right' });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(
        `Página ${i} de ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }

    doc.save(`pedido-${pedido.id}.pdf`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Pedido #{pedido.id}</h2>
          <Button variant="secondary" onClick={onClose}>
            Fechar
          </Button>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Cliente</h3>
          <p>Nome: {cliente.nome}</p>
          <p>Email: {cliente.email}</p>
          <p>Telefone: {cliente.telefone}</p>
          <p>Endereço: {cliente.endereco}</p>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Detalhes do Pedido</h3>
          <p>Status: {pedido.status.replace('_', ' ')}</p>
          <p>Data: {new Date(pedido.dataCriacao).toLocaleDateString()}</p>
          {pedido.origem && <p>Origem: {pedido.origem}</p>}
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Itens</h3>
          <div className="space-y-4">
            {pedido.itens.map((item, index) => {
              const produto = produtos.find(p => p.id === item.produtoId);
              const subtotal = item.quantidade * item.precoUnitario;
              return produto ? (
                <div key={index} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                  <img
                    src={produto.foto}
                    alt={produto.nome}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{produto.nome}</h4>
                    <p className="text-sm text-gray-600">
                      Quantidade: {item.quantidade} x {formatCurrency(item.precoUnitario)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(subtotal)}</p>
                  </div>
                </div>
              ) : null;
            })}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-xl font-bold">
            Total: {formatCurrency(
              pedido.itens.reduce((sum, item) => sum + (item.quantidade * item.precoUnitario), 0)
            )}
          </p>
          <Button 
            onClick={generatePDF}
            icon={Printer}
          >
            Baixar PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PedidoPDF;
