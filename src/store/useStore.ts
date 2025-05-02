import { create } from 'zustand';
import { Cliente, MateriaPrima, Pedido, Produto } from '../types';
import { clienteService } from '../services/clienteService';
import { materiaPrimaService } from '../services/materiaPrimaService';
import { produtoService } from '../services/produtoService';
import { pedidoService } from '../services/pedidoService';
import toast from 'react-hot-toast';

interface Store {
  clientes: Cliente[];
  materiasPrimas: MateriaPrima[];
  produtos: Produto[];
  pedidos: Pedido[];
  loading: boolean;
  error: string | null;

  fetchClientes: () => Promise<void>;
  fetchMateriasPrimas: () => Promise<void>;
  fetchProdutos: () => Promise<void>;
  fetchPedidos: () => Promise<void>;
  
  adicionarCliente: (cliente: Omit<Cliente, 'id'>) => Promise<void>;
  editarCliente: (id: string, cliente: Omit<Cliente, 'id'>) => Promise<void>;
  excluirCliente: (id: string) => Promise<void>;
  
  adicionarMateriaPrima: (materiaPrima: Omit<MateriaPrima, 'id'>) => Promise<void>;
  editarMateriaPrima: (id: string, materiaPrima: Omit<MateriaPrima, 'id'>) => Promise<void>;
  excluirMateriaPrima: (id: string) => Promise<void>;
  
  adicionarProduto: (produto: Omit<Produto, 'id'>) => Promise<void>;
  editarProduto: (id: string, produto: Omit<Produto, 'id'>) => Promise<void>;
  excluirProduto: (id: string) => Promise<void>;
  
  adicionarPedido: (pedido: Omit<Pedido, 'id' | 'status' | 'dataCriacao' | 'dataAtualizacao'>) => Promise<void>;
  atualizarStatusPedido: (pedidoId: string, status: Pedido['status']) => Promise<void>;
  atualizarEstoqueMateriaPrima: (id: string, quantidade: number) => Promise<void>;
}

export const useStore = create<Store>((set, get) => ({
  clientes: [],
  materiasPrimas: [],
  produtos: [],
  pedidos: [],
  loading: false,
  error: null,

  fetchClientes: async () => {
    try {
      set({ loading: true, error: null });
      const clientes = await clienteService.listar();
      set({ clientes });
    } catch (error) {
      set({ error: 'Erro ao carregar clientes' });
      toast.error('Erro ao carregar clientes');
    } finally {
      set({ loading: false });
    }
  },

  fetchMateriasPrimas: async () => {
    try {
      set({ loading: true, error: null });
      const materiasPrimas = await materiaPrimaService.listar();
      set({ materiasPrimas });
    } catch (error) {
      set({ error: 'Erro ao carregar matérias-primas' });
      toast.error('Erro ao carregar matérias-primas');
    } finally {
      set({ loading: false });
    }
  },

  fetchProdutos: async () => {
    try {
      set({ loading: true, error: null });
      const produtos = await produtoService.listar();
      set({ produtos });
    } catch (error) {
      set({ error: 'Erro ao carregar produtos' });
      toast.error('Erro ao carregar produtos');
    } finally {
      set({ loading: false });
    }
  },

  fetchPedidos: async () => {
    try {
      set({ loading: true, error: null });
      const pedidos = await pedidoService.listar();
      set({ pedidos });
    } catch (error) {
      set({ error: 'Erro ao carregar pedidos' });
      toast.error('Erro ao carregar pedidos');
    } finally {
      set({ loading: false });
    }
  },

  adicionarCliente: async (cliente) => {
    try {
      set({ loading: true, error: null });
      const novoCliente = await clienteService.criar(cliente);
      set(state => ({ clientes: [...state.clientes, novoCliente] }));
      toast.success('Cliente adicionado com sucesso');
    } catch (error) {
      set({ error: 'Erro ao adicionar cliente' });
      toast.error('Erro ao adicionar cliente');
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  editarCliente: async (id, cliente) => {
    try {
      set({ loading: true, error: null });
      const clienteAtualizado = await clienteService.atualizar(id, cliente);
      set(state => ({
        clientes: state.clientes.map(c => c.id === id ? clienteAtualizado : c)
      }));
      toast.success('Cliente atualizado com sucesso');
    } catch (error) {
      set({ error: 'Erro ao atualizar cliente' });
      toast.error('Erro ao atualizar cliente');
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  excluirCliente: async (id) => {
    try {
      set({ loading: true, error: null });
      await clienteService.excluir(id);
      set(state => ({
        clientes: state.clientes.filter(c => c.id !== id)
      }));
      toast.success('Cliente excluído com sucesso');
    } catch (error) {
      set({ error: 'Erro ao excluir cliente' });
      toast.error('Erro ao excluir cliente');
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  adicionarMateriaPrima: async (materiaPrima) => {
    try {
      set({ loading: true, error: null });
      const novaMateriaPrima = await materiaPrimaService.criar(materiaPrima);
      set(state => ({ materiasPrimas: [...state.materiasPrimas, novaMateriaPrima] }));
      toast.success('Matéria-prima adicionada com sucesso');
    } catch (error) {
      set({ error: 'Erro ao adicionar matéria-prima' });
      toast.error('Erro ao adicionar matéria-prima');
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  editarMateriaPrima: async (id, materiaPrima) => {
    try {
      set({ loading: true, error: null });
      
      const materiaPrimaAtualizada = await materiaPrimaService.atualizar(id, materiaPrima);
      
      if (!materiaPrimaAtualizada || !materiaPrimaAtualizada.id) {
        throw new Error('Falha ao atualizar matéria-prima: resposta inválida do servidor');
      }

      set(state => ({
        materiasPrimas: state.materiasPrimas.map(mp => 
          mp.id === id ? materiaPrimaAtualizada : mp
        )
      }));
      
      toast.success('Matéria-prima atualizada com sucesso');
      await get().fetchMateriasPrimas();
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao atualizar matéria-prima';
      set({ error: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  excluirMateriaPrima: async (id) => {
    try {
      set({ loading: true, error: null });
      await materiaPrimaService.excluir(id);
      set(state => ({
        materiasPrimas: state.materiasPrimas.filter(mp => mp.id !== id)
      }));
      toast.success('Matéria-prima excluída com sucesso');
    } catch (error) {
      set({ error: 'Erro ao excluir matéria-prima' });
      toast.error('Erro ao excluir matéria-prima');
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  adicionarProduto: async (produto) => {
    try {
      set({ loading: true, error: null });
      const novoProduto = await produtoService.criar(produto);
      set(state => ({ produtos: [...state.produtos, novoProduto] }));
      toast.success('Produto adicionado com sucesso');
    } catch (error) {
      set({ error: 'Erro ao adicionar produto' });
      toast.error('Erro ao adicionar produto');
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  editarProduto: async (id, produto) => {
    try {
      set({ loading: true, error: null });
      const produtoAtualizado = await produtoService.atualizar(id, produto);
      set(state => ({
        produtos: state.produtos.map(p => p.id === id ? produtoAtualizado : p)
      }));
      toast.success('Produto atualizado com sucesso');
    } catch (error) {
      set({ error: 'Erro ao atualizar produto' });
      toast.error('Erro ao atualizar produto');
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  excluirProduto: async (id) => {
    try {
      set({ loading: true, error: null });
      await produtoService.excluir(id);
      set(state => ({
        produtos: state.produtos.filter(p => p.id !== id)
      }));
      toast.success('Produto excluído com sucesso');
    } catch (error) {
      set({ error: 'Erro ao excluir produto' });
      toast.error('Erro ao excluir produto');
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  adicionarPedido: async (pedido) => {
    try {
      set({ loading: true, error: null });
      const novoPedido = await pedidoService.criar(pedido);
      set(state => ({ pedidos: [...state.pedidos, novoPedido] }));
      toast.success('Pedido criado com sucesso');
    } catch (error) {
      set({ error: 'Erro ao criar pedido' });
      toast.error('Erro ao criar pedido');
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  atualizarStatusPedido: async (pedidoId, status) => {
    try {
      set({ loading: true, error: null });
      const pedidoAtualizado = await pedidoService.atualizarStatus(pedidoId, status);
      set(state => ({
        pedidos: state.pedidos.map(p => 
          p.id === pedidoId ? pedidoAtualizado : p
        )
      }));
      toast.success('Status do pedido atualizado');
    } catch (error) {
      set({ error: 'Erro ao atualizar status do pedido' });
      toast.error('Erro ao atualizar status do pedido');
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  atualizarEstoqueMateriaPrima: async (id, quantidade) => {
    try {
      set({ loading: true, error: null });
      const materiaPrimaAtualizada = await materiaPrimaService.atualizarEstoque(id, quantidade);
      set(state => ({
        materiasPrimas: state.materiasPrimas.map(mp => 
          mp.id === id ? materiaPrimaAtualizada : mp
        )
      }));
      toast.success('Estoque atualizado com sucesso');
    } catch (error) {
      set({ error: 'Erro ao atualizar estoque' });
      toast.error('Erro ao atualizar estoque');
      throw error;
    } finally {
      set({ loading: false });
    }
  }
}));