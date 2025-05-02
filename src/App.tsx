import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useStore } from './store/useStore';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Produtos from './pages/Produtos';
import MateriasPrimas from './pages/MateriasPrimas';
import Pedidos from './pages/Pedidos';
import Relatorios from './pages/Relatorios';

function App() {
  const { fetchClientes, fetchMateriasPrimas, fetchProdutos, fetchPedidos } = useStore();

  useEffect(() => {
    fetchClientes();
    fetchMateriasPrimas();
    fetchProdutos();
    fetchPedidos();
  }, [fetchClientes, fetchMateriasPrimas, fetchProdutos, fetchPedidos]);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="clientes" element={<Clientes />} />
            <Route path="produtos" element={<Produtos />} />
            <Route path="materias-primas" element={<MateriasPrimas />} />
            <Route path="pedidos" element={<Pedidos />} />
            <Route path="relatorios" element={<Relatorios />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;