import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Produto } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import Button from '../Button';

interface ProductCarouselProps {
  produtos: Produto[];
  selectedQuantities: Record<string, number>;
  onQuantityChange: (produtoId: string, quantidade: number) => void;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({
  produtos,
  selectedQuantities,
  onQuantityChange,
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const itemsPerPage = 3;

  const nextSlide = () => {
    setCurrentIndex(current => 
      current + itemsPerPage >= produtos.length ? 0 : current + itemsPerPage
    );
  };

  const prevSlide = () => {
    setCurrentIndex(current => 
      current - itemsPerPage < 0 ? Math.max(0, produtos.length - itemsPerPage) : current - itemsPerPage
    );
  };

  const visibleProducts = produtos.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <div className="relative">
      <div className="flex items-center">
        <Button
          variant="secondary"
          onClick={prevSlide}
          className="absolute left-0 z-10"
          icon={ChevronLeft}
        />
        
        <div className="flex justify-center items-stretch space-x-4 mx-12">
          {visibleProducts.map((produto) => (
            <div
              key={produto.id}
              className="flex-1 bg-white rounded-lg shadow-md overflow-hidden max-w-xs"
            >
              <img
                src={produto.foto}
                alt={produto.nome}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{produto.nome}</h3>
                <p className="text-gray-600 mb-2">{formatCurrency(produto.preco)}</p>
                <p className="text-sm text-gray-500 mb-4">
                  Estoque: {produto.estoque} unidades
                </p>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Quantidade:
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={produto.estoque}
                    value={selectedQuantities[produto.id] || 0}
                    onChange={(e) => onQuantityChange(produto.id, parseInt(e.target.value) || 0)}
                    className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="secondary"
          onClick={nextSlide}
          className="absolute right-0 z-10"
          icon={ChevronRight}
        />
      </div>
      
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: Math.ceil(produtos.length / itemsPerPage) }).map((_, idx) => (
          <button
            key={idx}
            className={`w-2 h-2 rounded-full ${
              Math.floor(currentIndex / itemsPerPage) === idx
                ? 'bg-indigo-600'
                : 'bg-gray-300'
            }`}
            onClick={() => setCurrentIndex(idx * itemsPerPage)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;
