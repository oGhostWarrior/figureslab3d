<?php

namespace App\Services;

use App\Models\Pedido;
use App\Models\Produto;
use App\Models\MateriaPrima;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class PedidoService
{
    public function createPedido(array $data, ?UploadedFile $documento = null): Pedido
    {
        $documentoPath = $this->handleDocumentoUpload($documento);

        $pedido = Pedido::create([
            'cliente_id' => $data['cliente_id'],
            'vendedor' => $data['vendedor'],
            'status' => 'pendente',
            'documento_fiscal' => $documentoPath,
            'origem' => $data['origem'] ?? null,
            'data_criacao' => now(),
            'data_atualizacao' => now()
        ]);

        $this->processarItensPedido($pedido, $data['itens']);

        return $pedido;
    }

    private function handleDocumentoUpload(?UploadedFile $documento): ?string
    {
        if (!$documento) {
            return null;
        }

        try {
            return $documento->store('documentos_fiscais', 'public');
        } catch (\Exception $e) {
            Log::error('Erro ao fazer upload do documento', [
                'error' => $e->getMessage()
            ]);
            throw new \Exception('Erro ao processar documento fiscal');
        }
    }

    private function processarItensPedido(Pedido $pedido, array $itens): void
    {
        foreach ($itens as $item) {
            $produto = Produto::with('materiasPrimas')->findOrFail($item['produto_id']);

            $this->validarEstoque($produto, $item['quantidade']);
            $this->processarMateriasPrimas($produto, $item['quantidade']);

            $pedido->produtos()->attach($produto->id, [
                'quantidade' => $item['quantidade'],
                'preco_unitario' => $produto->preco
            ]);

            $produto->decrement('estoque', $item['quantidade']);
        }
    }

    private function validarEstoque(Produto $produto, int $quantidade): void
    {
        if ($produto->estoque < $quantidade) {
            throw new \Exception("Estoque insuficiente para o produto {$produto->nome}");
        }

        foreach ($produto->materiasPrimas as $materiaPrima) {
            $quantidadeNecessaria = $materiaPrima->pivot->quantidade * $quantidade;

            if ($materiaPrima->quantidade < $quantidadeNecessaria) {
                throw new \Exception("Matéria-prima insuficiente: {$materiaPrima->nome}");
            }
        }
    }

    private function processarMateriasPrimas(Produto $produto, int $quantidade): void
    {
        foreach ($produto->materiasPrimas as $materiaPrima) {
            $quantidadeNecessaria = $materiaPrima->pivot->quantidade * $quantidade;
            $materiaPrima->decrement('quantidade', $quantidadeNecessaria);
        }
    }

    public function updateStatus(Pedido $pedido, string $status): void
    {
        $pedido->update([
            'status' => $status,
            'data_atualizacao' => now()
        ]);
    }
}
