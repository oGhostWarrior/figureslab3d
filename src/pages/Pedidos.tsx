import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useStore } from '../store/useStore';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import PedidoForm from '../components/pedidos/PedidoForm';
import PedidoTable from '../components/pedidos/PedidoTable';
import PedidoPDF from '../components/PedidoPDF';
import { Pedido } from '../types';
import { initialPedidoFormData } from '../types/pedido';

const Pedidos: React.FC = () => {
  const { 
    pedidos, 
    clientes, 
    produtos,
    loading, 
    error,
    adicionarPedido,
    atualizarStatusPedido,
    fetchPedidos 
  } = useStore();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(initialPedidoFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);

  useEffect(() => {
    fetchPedidos();
  }, [fetchPedidos]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
      
    const newErrors: Record<string, string> = {};
    if (!formData.clienteId) newErrors.clienteId = 'Cliente é obrigatório';
    if (!formData.vendedor) newErrors.vendedor = 'Vendedor é obrigatório';
    if (!formData.itens.length) newErrors.itens = 'Adicione pelo menos um item';
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    try {
      const formDataObj = new FormData();
      formDataObj.append('cliente_id', formData.clienteId);
      formDataObj.append('vendedor', formData.vendedor);
      
      if (formData.origem) {
        formDataObj.append('origem', formData.origem);
      }
      
      formData.itens.forEach((item, index) => {
        formDataObj.append(`itens[${index}][produto_id]`, item.produtoId);
        formDataObj.append(`itens[${index}][quantidade]`, String(item.quantidade));
      });
      
      if (formData.documentoFiscal) {
        formDataObj.append('documento_fiscal', formData.documentoFiscal);
      }
  
      await adicionarPedido(formDataObj);
      setShowForm(false);
      setFormData(initialPedidoFormData);
      setErrors({});
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
    }
  };

  const handleStatusChange = async (pedidoId: string, novoStatus: Pedido['status']) => {
    try {
      await atualizarStatusPedido(pedidoId, novoStatus);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
        <Button
          onClick={() => {
            setFormData(initialPedidoFormData);
            setShowForm(true);
          }}
          icon={Plus}
        >
          Novo Pedido
        </Button>
      </div>

      {showForm && (
        <PedidoForm
          clientes={clientes}
          produtos={produtos}
          onSubmit={handleSubmit}
          formData={formData}
          errors={errors}
          onChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
          onCancel={() => {
            setShowForm(false);
            setFormData(initialPedidoFormData);
          }}
        />
      )}

      <PedidoTable
        pedidos={pedidos}
        clientes={clientes}
        onStatusChange={handleStatusChange}
        onViewPDF={setSelectedPedido}
      />

      {selectedPedido && (
        <PedidoPDF
          pedido={selectedPedido}
          cliente={clientes.find(c => c.id === selectedPedido.clienteId)!}
          produtos={produtos}
          onClose={() => setSelectedPedido(null)}
        />
      )}
    </div>
  );
};

export default Pedidos;