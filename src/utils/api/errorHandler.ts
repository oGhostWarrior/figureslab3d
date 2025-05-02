import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

export const handleApiError = (error: unknown, defaultMessage: string): never => {
  console.error('Original error:', error);
  
  const axiosError = error as AxiosError<{ message: string }>;
  let errorMessage = defaultMessage;

  if (axiosError.response?.data?.message) {
    errorMessage = axiosError.response.data.message;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }
  
  console.error('API Error:', {
    message: errorMessage,
    status: axiosError.response?.status,
    data: axiosError.response?.data
  });
  
  toast.error(errorMessage);
  throw new Error(errorMessage);
};