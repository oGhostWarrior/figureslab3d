export type SellerId = 'vendedor1' | 'vendedor2';

export interface ProfitSharing {
  vendedor1: number;
  vendedor2: number;
}

export const PROFIT_SHARING_RULES: Record<SellerId, ProfitSharing> = {
  vendedor1: { vendedor1: 0.5, vendedor2: 0.5 },
  vendedor2: { vendedor1: 0.35, vendedor2: 0.65 }
};

export const SELLERS: SellerId[] = ['vendedor1', 'vendedor2'];