<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Pedido;
use App\Services\PedidoService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PedidoController extends Controller
{
    protected $pedidoService;

    public function __construct(PedidoService $pedidoService)
    {
        $this->pedidoService = $pedidoService;
    }

    public function index()
    {
        return response()->json(
            Pedido::with(['cliente:id,nome', 'produtos:id,nome,preco'])->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $this->validatePedido($request);

        DB::beginTransaction();
        try {
            $pedido = $this->pedidoService->createPedido(
                $validated,
                $request->file('documento_fiscal')
            );

            DB::commit();
            return response()->json($pedido->load(['cliente', 'produtos']), 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erro ao criar pedido', [
                'error' => $e->getMessage(),
                'data' => $validated
            ]);
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function show(Pedido $pedido)
    {
        return response()->json($pedido->load(['cliente', 'produtos']));
    }

    public function atualizarStatus(Request $request, Pedido $pedido)
    {
        $validated = $request->validate([
            'status' => 'required|in:pendente,em_producao,concluido'
        ]);

        try {
            $this->pedidoService->updateStatus($pedido, $validated['status']);
            return response()->json($pedido->fresh()->load(['cliente', 'produtos']));
        } catch (\Exception $e) {
            Log::error('Erro ao atualizar status do pedido', [
                'pedido_id' => $pedido->id,
                'error' => $e->getMessage()
            ]);
            return response()->json(['message' => 'Erro ao atualizar status'], 500);
        }
    }

    private function validatePedido(Request $request): array
    {
        return $request->validate([
            'cliente_id' => 'required|exists:clientes,id',
            'vendedor' => 'required|in:vendedor1,vendedor2',
            'documento_fiscal' => 'nullable|mimes:pdf|max:2048',
            'origem' => 'nullable|string|max:255',
            'itens' => 'required|array',
            'itens.*.produto_id' => 'required|exists:produtos,id',
            'itens.*.quantidade' => 'required|integer|min:1'
        ], [
            'documento_fiscal.mimes' => 'O documento fiscal deve ser um arquivo PDF.',
            'documento_fiscal.max' => 'O documento fiscal não pode ser maior que 2MB.',
            'cliente_id.required' => 'O cliente é obrigatório.',
            'cliente_id.exists' => 'O cliente selecionado não existe.',
            'itens.required' => 'É necessário incluir pelo menos um item no pedido.',
            'itens.array' => 'O formato dos itens é inválido.',
            'itens.*.produto_id.required' => 'O produto é obrigatório para cada item.',
            'itens.*.produto_id.exists' => 'Um dos produtos selecionados não existe.',
            'itens.*.quantidade.required' => 'A quantidade é obrigatória para cada item.',
            'itens.*.quantidade.integer' => 'A quantidade deve ser um número inteiro.',
            'itens.*.quantidade.min' => 'A quantidade deve ser maior que zero.',
        ]);
    }
}
