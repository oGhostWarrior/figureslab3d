import { SellerId } from '../types/seller';

export const SELLER_CONFIG = {
  vendedor1: {
    id: 'vendedor1' as SellerId,
    name: 'nome1',
    active: true
  },
  vendedor2: {
    id: 'vendedor2' as SellerId,
    name: 'nome2',
    active: true
  }
};

export const getSellerOptions = () => {
  return Object.values(SELLER_CONFIG)
    .filter(seller => seller.active)
    .map(seller => ({
      value: seller.id,
      label: seller.name
    }));
};

export const getSellerName = (sellerId: SellerId): string => {
  return SELLER_CONFIG[sellerId]?.name || sellerId;
};

export const updateSellerName = (sellerId: SellerId, newName: string) => {
  if (SELLER_CONFIG[sellerId]) {
    SELLER_CONFIG[sellerId].name = newName;
  }
};

export const toggleSellerActive = (sellerId: SellerId, active: boolean) => {
  if (SELLER_CONFIG[sellerId]) {
    SELLER_CONFIG[sellerId].active = active;
  }
};