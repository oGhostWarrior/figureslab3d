import React, { useState } from 'react';
import { SELLER_CONFIG, updateSellerName, toggleSellerActive } from '../config/sellers';
import Button from './Button';
import Input from './Input';

const SellerConfig: React.FC = () => {
  const [sellers, setSellers] = useState(SELLER_CONFIG);

  const handleNameChange = (sellerId: string, newName: string) => {
    updateSellerName(sellerId as keyof typeof SELLER_CONFIG, newName);
    setSellers({
      ...sellers,
      [sellerId]: { ...sellers[sellerId as keyof typeof sellers], name: newName }
    });
  };

  const handleActiveToggle = (sellerId: string, active: boolean) => {
    toggleSellerActive(sellerId as keyof typeof SELLER_CONFIG, active);
    setSellers({
      ...sellers,
      [sellerId]: { ...sellers[sellerId as keyof typeof sellers], active }
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Configuração de Vendedores</h2>
      <div className="space-y-4">
        {Object.entries(sellers).map(([id, seller]) => (
          <div key={id} className="flex items-center space-x-4">
            <Input
              label="Nome do Vendedor"
              value={seller.name}
              onChange={(e) => handleNameChange(id, e.target.value)} readOnly
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={seller.active}
                onChange={(e) => handleActiveToggle(id, e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-600">Ativo</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerConfig;