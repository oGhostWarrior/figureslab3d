import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Printer, Users, Package, Box, ClipboardList, FileText, Image } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-900 transition-colors">
      <nav className="bg-indigo-600 dark:bg-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2">
                <Printer className="h-6 w-6" />
                <span className="font-bold text-lg">FiguresLab3D</span>
              </Link>
              
              <div className="flex space-x-4">
                <Link to="/clientes" className="flex items-center space-x-1 hover:text-indigo-200">
                  <Users className="h-4 w-4" />
                  <span>Clientes</span>
                </Link>
                <Link to="/produtos" className="flex items-center space-x-1 hover:text-indigo-200">
                  <Package className="h-4 w-4" />
                  <span>Produtos</span>
                </Link>
                <Link to="/portfolio" className="flex items-center space-x-1 hover:text-indigo-200">
                  <Image className="h-4 w-4" />
                  <span>Portfólio</span>
                </Link>
                <Link to="/materias-primas" className="flex items-center space-x-1 hover:text-indigo-200">
                  <Box className="h-4 w-4" />
                  <span>Matéria Prima</span>
                </Link>
                <Link to="/pedidos" className="flex items-center space-x-1 hover:text-indigo-200">
                  <ClipboardList className="h-4 w-4" />
                  <span>Pedidos</span>
                </Link>
                <Link to="/relatorios" className="flex items-center space-x-1 hover:text-indigo-200">
                  <FileText className="h-4 w-4" />
                  <span>Relatórios</span>
                </Link>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
