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
  const generatePDF = () => {
    const doc = new jsPDF();
    const margin = 20;
    let yPos = margin;

    doc.setFontSize(20);
    doc.text('Pedido #' + pedido.id, margin, yPos);
    yPos += 10;

    // Informações do Cliente
    doc.setFontSize(12);
    yPos += 10;
    doc.text('Cliente:', margin, yPos);
    yPos += 7;
    doc.text(`Nome: ${cliente.nome}`, margin + 5, yPos);
    yPos += 7;
    doc.text(`Email: ${cliente.email}`, margin + 5, yPos);
    yPos += 7;
    doc.text(`Telefone: ${cliente.telefone}`, margin + 5, yPos);
    yPos += 7;
    doc.text(`Endereço: ${cliente.endereco}`, margin + 5, yPos);
    yPos += 15;

    // Status, Data e Origem
    doc.text(`Status: ${pedido.status.replace('_', ' ')}`, margin, yPos);
    yPos += 7;
    doc.text(`Data: ${new Date(pedido.dataCriacao).toLocaleDateString()}`, margin, yPos);
    yPos += 7;
    if (pedido.origem) {
      doc.text(`Origem: ${pedido.origem}`, margin, yPos);
      yPos += 7;
    }
    yPos += 8;

    // Itens do Pedido
    doc.text('Itens do Pedido:', margin, yPos);
    yPos += 10;

    let total = 0;
    pedido.itens.forEach(item => {
      const produto = produtos.find(p => p.id === item.produtoId);
      if (produto) {
        const subtotal = item.quantidade * item.precoUnitario;
        total += subtotal;
        
        doc.text(`${produto.nome}`, margin + 5, yPos);
        doc.text(`${item.quantidade}x`, margin + 80, yPos);
        doc.text(`${formatCurrency(item.precoUnitario)}`, margin + 110, yPos);
        doc.text(`${formatCurrency(subtotal)}`, margin + 150, yPos);
        yPos += 7;
      }
    });

    yPos += 10;
    doc.setFont('helvetica', 'bold');
    doc.text(`Total: ${formatCurrency(total)}`, margin, yPos);

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
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Produto</th>
                <th className="text-right">Qtd</th>
                <th className="text-right">Preço Unit.</th>
                <th className="text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {pedido.itens.map((item, index) => {
                const produto = produtos.find(p => p.id === item.produtoId);
                const subtotal = item.quantidade * item.precoUnitario;
                return (
                  <tr key={index}>
                    <td>{produto?.nome}</td>
                    <td className="text-right">{item.quantidade}</td>
                    <td className="text-right">{formatCurrency(item.precoUnitario)}</td>
                    <td className="text-right">{formatCurrency(subtotal)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="text-right font-bold">Total:</td>
                <td className="text-right font-bold">
                  {formatCurrency(
                    pedido.itens.reduce((sum, item) => sum + (item.quantidade * item.precoUnitario), 0)
                  )}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="flex justify-end">
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