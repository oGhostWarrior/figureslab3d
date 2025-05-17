import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ConfirmDialog from '../components/ConfirmDialog';
import { Produto } from '../types';
import ProdutoModal from '../components/produtos/ProdutoModal';

interface FormData {
  nome: string;
  preco: number;
  estoque: number;
  foto: string;
  descricao: string;
  fotos: string[];
  materiaPrima: {
    id: string;
    quantidade: number;
  }[];
}

const initialFormData: FormData = {
  nome: '',
  preco: 0,
  estoque: 0,
  foto: '',
  descricao: '',
  fotos: [],
  materiaPrima: []
};

const Produtos: React.FC = () => {
  const { 
    produtos, 
    materiasPrimas,
    loading, 
    error, 
    adicionarProduto,
    editarProduto,
    excluirProduto,
    fetchProdutos 
  } = useStore();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>(['']);

  useEffect(() => {
    fetchProdutos();
  }, [fetchProdutos]);

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
    if (formData.preco <= 0) {
      newErrors.preco = 'Preço deve ser maior que zero';
    }
    if (formData.estoque < 0) {
      newErrors.estoque = 'Estoque não pode ser negativo';
    }
    if (!formData.foto.trim()) {
      newErrors.foto = 'URL da foto principal é obrigatória';
    }
    if (formData.materiaPrima.length === 0) {
      newErrors.materiaPrima = 'Selecione pelo menos uma matéria-prima';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const validImageUrls = imageUrls.filter(url => url.trim() !== '');
    const submitData = {
      ...formData,
      fotos: validImageUrls
    };

    try {
      if (editingId) {
        await editarProduto(editingId, submitData);
      } else {
        await adicionarProduto(submitData);
      }
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    }
  };

  const handleEdit = (produto: Produto) => {
    setFormData({
      nome: produto.nome,
      preco: produto.preco,
      estoque: produto.estoque,
      foto: produto.foto,
      descricao: produto.descricao || '',
      fotos: produto.fotos || [],
      materiaPrima: produto.materiaPrima
    });

    const existingFotos = produto.fotos || [];
    if (existingFotos.length > 0) {
      setImageUrls([...existingFotos, '']);
    } else {
      setImageUrls(['']);
    }

    //setImageUrls(produto.fotos || ['']);
    setEditingId(produto.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await excluirProduto(id);
      await fetchProdutos();
      setShowDeleteDialog(false);
      setDeletingId(null);
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setImageUrls(['']);
    setErrors({});
    setEditingId(null);
    setShowForm(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const processedValue = type === 'number' ? Number(value) || 0 : value;
    setFormData(prev => ({ ...prev, [name]: processedValue }));
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUrlChange = (index: number, value: string) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    if (index === imageUrls.length - 1 && value.trim() !== '') {
      newUrls.push('');
    }
    setImageUrls(newUrls);
  };

  const handleMateriaPrimaChange = (mpId: string, quantidade: number) => {
    setFormData(prev => ({
      ...prev,
      materiaPrima: [
        ...prev.materiaPrima.filter(mp => mp.id !== mpId),
        { id: mpId, quantidade }
      ].filter(mp => mp.quantidade > 0)
    }));
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
        <Button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          icon={Plus}
        >
          Novo Produto
        </Button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              error={errors.nome}
            />
            <Input
              label="Preço"
              type="number"
              step="0.01"
              name="preco"
              value={formData.preco}
              onChange={handleChange}
              error={errors.preco}
            />
            <Input
              label="Estoque"
              type="number"
              name="estoque"
              value={formData.estoque}
              onChange={handleChange}
              error={errors.estoque}
            />
            <Input
              label="URL da Foto Principal"
              name="foto"
              value={formData.foto}
              onChange={handleChange}
              error={errors.foto}
              placeholder="https://exemplo.com/foto.jpg"
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Fotos Adicionais
              </label>
              {imageUrls.map((url, index) => (
                <Input
                  key={index}
                  label={`Foto ${index + 1}`}
                  value={url}
                  onChange={(e) => handleImageUrlChange(index, e.target.value)}
                  placeholder="https://exemplo.com/foto.jpg"
                />
              ))}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Descrição
              </label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Descreva o produto..."
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Matérias-Primas Necessárias
              </label>
              {materiasPrimas?.map(mp => (
                <div key={mp.id} className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 w-1/3">{mp.nome}</span>
                  <Input
                    label=""
                    type="number"
                    step="0.01"
                    value={formData.materiaPrima.find(m => m.id === mp.id)?.quantidade || 0}
                    onChange={(e) => handleMateriaPrimaChange(mp.id, Number(e.target.value))}
                    className="w-1/3"
                  />
                  <span className="text-sm text-gray-600">{mp.unidadeMedida}</span>
                </div>
              ))}
              {errors.materiaPrima && (
                <p className="text-sm text-red-600">{errors.materiaPrima}</p>
              )}
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="secondary"
                onClick={resetForm}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {editingId ? 'Atualizar' : 'Salvar'}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {produtos?.map((produto) => (
          <div 
            key={produto.id} 
            className="bg-white rounded-lg shadow overflow-hidden cursor-pointer transform transition-transform hover:scale-[1.02]"
            onClick={() => setSelectedProduto(produto)}
          >
            <img 
              src={produto.foto} 
              alt={produto.nome} 
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{produto.nome}</h3>
              <p className="text-gray-600">R$ {produto.preco.toFixed(2)}</p>
              <p className="text-sm text-gray-500">Estoque: {produto.estoque}</p>
              
              {produto.descricao && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {produto.descricao}
                </p>
              )}
              
              <div className="mt-4 space-y-1">
                <p className="text-sm font-medium text-gray-700">Matérias-Primas:</p>
                {produto.materiaPrima?.map(mp => {
                  const materiaPrima = materiasPrimas?.find(m => m.id === mp.id);
                  return materiaPrima ? (
                    <p key={mp.id} className="text-sm text-gray-600">
                      {materiaPrima.nome}: {mp.quantidade.toFixed(2)} {materiaPrima.unidadeMedida}
                    </p>
                  ) : null;
                })}
              </div>

              <div className="mt-4 flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="secondary"
                  icon={Pencil}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(produto);
                  }}
                >
                  Editar
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  icon={Trash2}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeletingId(produto.id);
                    setShowDeleteDialog(true);
                  }}
                >
                  Excluir
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedProduto && (
        <ProdutoModal
          produto={selectedProduto}
          materiasPrimas={materiasPrimas}
          isOpen={!!selectedProduto}
          onClose={() => setSelectedProduto(null)}
        />
      )}

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setDeletingId(null);
        }}
        onConfirm={() => deletingId && handleDelete(deletingId)}
        title="Confirmar exclusão"
        message="Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita."
      />
    </div>
  );
};

export default Produtos;
