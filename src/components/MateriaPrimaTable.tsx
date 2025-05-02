import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import Button from './Button';
import { MateriaPrima } from '../types';

interface MateriaPrimaTableProps {
  materiasPrimas: MateriaPrima[];
  onEdit: (materiaPrima: MateriaPrima) => void;
  onDelete: (id: string) => void;
}

const MateriaPrimaTable: React.FC<MateriaPrimaTableProps> = ({
  materiasPrimas,
  onEdit,
  onDelete
}) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nome
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantidade
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Unidade
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Preço Unit.
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {materiasPrimas.map((mp) => (
            <tr key={mp.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {mp.nome}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {Number(mp.quantidade).toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {mp.unidadeMedida}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                R$ {Number(mp.precoUnitario).toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Button
                  type="button"
                  variant="secondary"
                  className="mr-2"
                  icon={Pencil}
                  onClick={() => onEdit(mp)}
                >
                  Editar
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  icon={Trash2}
                  onClick={() => onDelete(mp.id)}
                >
                  Excluir
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MateriaPrimaTable;