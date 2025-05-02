import React from 'react';
import Button from './Button';
import Input from './Input';

interface FormData {
  nome: string;
  quantidade: number;
  unidadeMedida: string;
  precoUnitario: number;
}

interface MateriaPrimaFormProps {
  formData: FormData;
  errors: Partial<FormData>;
  isEditing: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
}

const MateriaPrimaForm: React.FC<MateriaPrimaFormProps> = ({
  formData,
  errors,
  isEditing,
  onSubmit,
  onChange,
  onCancel
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Nome"
          name="nome"
          value={formData.nome}
          onChange={onChange}
          error={errors.nome}
        />
        <Input
          label="Quantidade"
          type="number"
          step="0.01"
          min="0"
          name="quantidade"
          value={formData.quantidade}
          onChange={onChange}
          error={errors.quantidade}
        />
        <Input
          label="Unidade de Medida"
          name="unidadeMedida"
          value={formData.unidadeMedida}
          onChange={onChange}
          error={errors.unidadeMedida}
          placeholder="Ex: kg, g, m, cm"
        />
        <Input
          label="Preço Unitário"
          type="number"
          step="0.01"
          min="0"
          name="precoUnitario"
          value={formData.precoUnitario}
          onChange={onChange}
          error={errors.precoUnitario}
        />
        
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button type="submit">
            {isEditing ? 'Atualizar' : 'Salvar'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MateriaPrimaForm;