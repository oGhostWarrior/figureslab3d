import React from 'react';
import { FileUp } from 'lucide-react';
import Button from '../Button';
import Input from '../Input';
import { Cliente, Produto } from '../../types';
import { getSellerOptions } from '../../config/sellers';
import { formatCurrency } from '../../utils/formatters';
import ProductCarousel from './ProductCarousel';

interface FormData {
  clienteId: string;
  vendedor: string;
  documentoFiscal?: File;
  origem?: string;
  itens: {
    produtoId: string;
    quantidade: number;
  }[];
}

interface PedidoFormProps {
  clientes: Cliente[];
  produtos: Produto[];
  onSubmit: (e: React.FormEvent) => void;
  formData: FormData;
  errors: Record<string, string>;
  onChange: (field: keyof FormData, value: any) => void;
  onCancel: () => void;
}

const PedidoForm: React.FC<PedidoFormProps> = ({
  clientes,
  produtos,
  onSubmit,
  formData,
  errors,
  onChange,
  onCancel
}) => {
  const sellerOptions = getSellerOptions();

  const handleFileSelect = (file: File) => {
    onChange('documentoFiscal', file);
  };

  const handleQuantityChange = (produtoId: string, quantidade: number) => {
    const newItens = formData.itens.filter(item => item.produtoId !== produtoId);
    if (quantidade > 0) {
      newItens.push({ produtoId, quantidade });
    }
    onChange('itens', newItens);
  };

  const calculateTotal = () => {
    return formData.itens.reduce((total, item) => {
      const produto = produtos.find(p => p.id === item.produtoId);
      return total + (produto?.preco || 0) * item.quantidade;
    }, 0);
  };

  const selectedQuantities = formData.itens.reduce((acc, item) => {
    acc[item.produtoId] = item.quantidade;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Cliente, Vendedor e Origem */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Cliente</label>
            <select
              value={formData.clienteId}
              onChange={(e) => onChange('clienteId', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Selecione um cliente</option>
              {clientes.map(cliente => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome}
                </option>
              ))}
            </select>
            {errors.clienteId && (
              <p className="mt-1 text-sm text-red-600">{errors.clienteId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Vendedor</label>
            <select
              value={formData.vendedor}
              onChange={(e) => onChange('vendedor', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Selecione um vendedor</option>
              {sellerOptions.map(seller => (
                <option key={seller.value} value={seller.value}>
                  {seller.label}
                </option>
              ))}
            </select>
            {errors.vendedor && (
              <p className="mt-1 text-sm text-red-600">{errors.vendedor}</p>
            )}
          </div>

          <div>
            <Input
              label="Origem"
              value={formData.origem || ''}
              onChange={(e) => onChange('origem', e.target.value)}
              placeholder="Digite a origem do pedido"
              error={errors.origem}
            />
          </div>
        </div>

        {/* Documento Fiscal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Documento Fiscal (opcional)
          </label>
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="secondary"
              icon={FileUp}
              onClick={() => document.getElementById('documento')?.click()}
            >
              {formData.documentoFiscal ? formData.documentoFiscal.name : 'Anexar PDF'}
            </Button>
            <input
              id="documento"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            />
          </div>
        </div>

        {/* Produtos Carousel */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Produtos</h3>
          <ProductCarousel
            produtos={produtos}
            selectedQuantities={selectedQuantities}
            onQuantityChange={handleQuantityChange}
          />
          {errors.itens && (
            <p className="mt-1 text-sm text-red-600">{errors.itens}</p>
          )}
        </div>

        {/* Total */}
        <div className="border-t pt-4">
          <p className="text-xl font-semibold text-right">
            Total: {formatCurrency(calculateTotal())}
          </p>
        </div>

        {/* Ações */}
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button type="submit">
            Criar Pedido
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PedidoForm;
