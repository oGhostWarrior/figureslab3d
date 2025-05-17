import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Search } from 'lucide-react';
import { Produto } from '../types';
import ProductCarousel from '../components/produtos/ProductCarousel';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Portfolio: React.FC = () => {
  const { produtos, loading, error } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const filteredProdutos = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNextImage = () => {
    if (!selectedProduto) return;
    const images = [selectedProduto.foto, ...(selectedProduto.fotos || [])];
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePreviousImage = () => {
    if (!selectedProduto) return;
    const images = [selectedProduto.foto, ...(selectedProduto.fotos || [])];
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Portfólio</h1>
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredProdutos.map((produto) => (
          <div
            key={produto.id}
            className="bg-white rounded-lg shadow overflow-hidden cursor-pointer transform transition-transform hover:scale-[1.02]"
            onClick={() => {
              setSelectedProduto(produto);
              setCurrentImageIndex(0);
            }}
          >
            <div className="aspect-square">
              <img
                src={produto.foto}
                alt={produto.nome}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold">{produto.nome}</h3>
              <p className="text-gray-600 font-medium">
                R$ {produto.preco.toFixed(2)}
              </p>
              {produto.descricao && (
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                  {produto.descricao}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                Disponível: {produto.estoque} unidades
              </p>
            </div>
          </div>
        ))}
      </div>

      {selectedProduto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">{selectedProduto.nome}</h2>
              <button
                onClick={() => setSelectedProduto(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="grid md:grid-cols-2 gap-6 p-6">
                <ProductCarousel
                  images={[selectedProduto.foto, ...(selectedProduto.fotos || [])]}
                  currentIndex={currentImageIndex}
                  onNext={handleNextImage}
                  onPrevious={handlePreviousImage}
                />

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Descrição</h3>
                    <p className="text-gray-600">
                      {selectedProduto.descricao || 'Sem descrição disponível'}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Preço:</span>
                      <span className="text-2xl font-bold text-indigo-600">
                        R$ {selectedProduto.preco.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Disponível: {selectedProduto.estoque} unidades
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
