import React, { useState } from 'react';
import { X } from 'lucide-react';
import Button from '../Button';
import { Produto, MateriaPrima } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import ProductCarousel from './ProductCarousel';

interface ProdutoModalProps {
  produto: Produto;
  materiasPrimas: MateriaPrima[];
  isOpen: boolean;
  onClose: () => void;
}

const ProdutoModal: React.FC<ProdutoModalProps> = ({
  produto,
  materiasPrimas,
  isOpen,
  onClose
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [produto.foto, ...(produto.fotos || [])];

  if (!isOpen) return null;

  const custoProducao = produto.materiaPrima.reduce((total, mp) => {
    const materiaPrima = materiasPrimas.find(m => m.id === mp.id);
    if (!materiaPrima) return total;
    return total + (mp.quantidade * materiaPrima.precoUnitario);
  }, 0);

  const lucroPorUnidade = produto.preco - custoProducao;
  const margemLucro = (lucroPorUnidade / produto.preco) * 100;

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">{produto.nome}</h2>
          <Button
            variant="secondary"
            onClick={onClose}
            icon={X}
          >
            Fechar
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid md:grid-cols-2 gap-6 p-6">
            <div className="space-y-4">
              <ProductCarousel
                images={images}
                currentIndex={currentImageIndex}
                onNext={handleNextImage}
                onPrevious={handlePreviousImage}
              />
            </div>

            <div className="space-y-6">
              {produto.descricao && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Descrição</h3>
                  <p className="text-gray-600">{produto.descricao}</p>
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <h3 className="font-semibold text-lg">Resumo Financeiro</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Preço de Venda</p>
                    <p className="text-lg font-semibold">{formatCurrency(produto.preco)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Custo de Produção</p>
                    <p className="text-lg font-semibold">{formatCurrency(custoProducao)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Lucro por Unidade</p>
                    <p className="text-lg font-semibold text-green-600">{formatCurrency(lucroPorUnidade)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Margem de Lucro</p>
                    <p className="text-lg font-semibold">{margemLucro.toFixed(2)}%</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Matérias-Primas Utilizadas</h3>
                <div className="space-y-2">
                  {produto.materiaPrima.map(mp => {
                    const materiaPrima = materiasPrimas.find(m => m.id === mp.id);
                    if (!materiaPrima) return null;
                    
                    const custoTotal = mp.quantidade * materiaPrima.precoUnitario;
                    
                    return (
                      <div key={mp.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">{materiaPrima.nome}</p>
                          <p className="text-sm text-gray-600">
                            {mp.quantidade} {materiaPrima.unidadeMedida}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(custoTotal)}</p>
                          <p className="text-sm text-gray-600">
                            {formatCurrency(materiaPrima.precoUnitario)}/{materiaPrima.unidadeMedida}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Situação do Estoque</h3>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">Quantidade Disponível</p>
                  <p className={`text-lg font-semibold ${produto.estoque < 5 ? 'text-red-600' : 'text-green-600'}`}>
                    {produto.estoque} unidades
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProdutoModal;
