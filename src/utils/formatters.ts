import { format } from 'date-fns';

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatDate = (date: Date | string): string => {
  return format(new Date(date), 'dd/MM/yyyy HH:mm');
};

export const formatStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    pendente: 'Pendente',
    em_producao: 'Em Produção',
    concluido: 'Concluído'
  };
  return statusMap[status] || status;
};