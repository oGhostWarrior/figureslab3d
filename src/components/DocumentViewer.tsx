import React from 'react';
import Button from './Button';
import { X } from 'lucide-react';

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  documentUrl: string;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  isOpen,
  onClose,
  documentUrl
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 w-full max-w-4xl h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Visualizar Documento</h3>
          <Button
            variant="secondary"
            onClick={onClose}
            icon={X}
          >
            Fechar
          </Button>
        </div>
        
        <div className="flex-1 bg-gray-100 rounded">
          <object
            data={documentUrl}
            type="application/pdf"
            className="w-full h-full rounded"
          >
            <p>Não foi possível carregar o PDF. <a href={documentUrl} target="_blank" rel="noopener noreferrer">Clique aqui para baixar</a></p>
          </object>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;