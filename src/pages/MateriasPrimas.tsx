import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useStore } from '../store/useStore';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ConfirmDialog from '../components/ConfirmDialog';
import MateriaPrimaForm from '../components/MateriaPrimaForm';
import MateriaPrimaTable from '../components/MateriaPrimaTable';
import { MateriaPrima } from '../types';

interface FormData {
  nome: string;
  quantidade: number;
  unidadeMedida: string;
  precoUnitario: number;
}

const initialFormData: FormData = {
  nome: '',
  quantidade: 0,
  unidadeMedida: '',
  precoUnitario: 0
};

const MateriasPrimas: React.FC = () => {
  const { 
    materiasPrimas, 
    loading, 
    error, 
    adicionarMateriaPrima,
    editarMateriaPrima,
    excluirMateriaPrima,
    fetchMateriasPrimas 
  } = useStore();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchMateriasPrimas();
  }, [fetchMateriasPrimas]);

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
    if (formData.quantidade <= 0) {
      newErrors.quantidade = 'Quantidade deve ser maior que zero';
    }
    if (!formData.unidadeMedida.trim()) {
      newErrors.unidadeMedida = 'Unidade de medida é obrigatória';
    }
    if (formData.precoUnitario <= 0) {
      newErrors.precoUnitario = 'Preço unitário deve ser maior que zero';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const payload = {
        nome: formData.nome,
        quantidade: Number(formData.quantidade),
        unidadeMedida: formData.unidadeMedida,
        precoUnitario: Number(formData.precoUnitario)
      };

      if (editingId) {
        await editarMateriaPrima(editingId, payload);
      } else {
        await adicionarMateriaPrima(payload);
      }
      resetForm();
      await fetchMateriasPrimas();
    } catch (error) {
      console.error('Erro ao salvar matéria-prima:', error);
    }
  };

  const handleEdit = (materiaPrima: MateriaPrima) => {
    setFormData({
      nome: materiaPrima.nome,
      quantidade: Number(materiaPrima.quantidade),
      unidadeMedida: materiaPrima.unidadeMedida,
      precoUnitario: Number(materiaPrima.precoUnitario)
    });
    setEditingId(materiaPrima.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await excluirMateriaPrima(id);
      setShowDeleteDialog(false);
      setDeletingId(null);
      await fetchMateriasPrimas();
    } catch (error) {
      console.error('Erro ao excluir matéria-prima:', error);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
    setEditingId(null);
    setShowForm(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const processedValue = type === 'number' ? Number(value) || 0 : value;
    setFormData(prev => ({ ...prev, [name]: processedValue }));
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Matérias-Primas</h1>
        <Button
          type="button"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          icon={Plus}
        >
          Nova Matéria-Prima
        </Button>
      </div>

      {showForm && (
        <MateriaPrimaForm
          formData={formData}
          errors={errors}
          isEditing={!!editingId}
          onSubmit={handleSubmit}
          onChange={handleChange}
          onCancel={resetForm}
        />
      )}

      <MateriaPrimaTable
        materiasPrimas={materiasPrimas || []}
        onEdit={handleEdit}
        onDelete={(id) => {
          setDeletingId(id);
          setShowDeleteDialog(true);
        }}
      />

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setDeletingId(null);
        }}
        onConfirm={() => deletingId && handleDelete(deletingId)}
        title="Confirmar exclusão"
        message="Tem certeza que deseja excluir esta matéria-prima? Esta ação não pode ser desfeita."
      />
    </div>
  );
};

export default MateriasPrimas;