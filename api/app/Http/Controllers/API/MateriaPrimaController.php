<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\MateriaPrima;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class MateriaPrimaController extends Controller
{
    public function index()
    {
        try {
            $materiasPrimas = MateriaPrima::all();
            return response()->json($materiasPrimas);
        } catch (\Exception $e) {
            Log::error('Error fetching MateriaPrimas: ' . $e->getMessage());
            return response()->json(['message' => 'Erro ao buscar matérias-primas'], 500);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'quantidade' => 'required|numeric|min:0',
            'unidade_medida' => 'required|string|max:20',
            'preco_unitario' => 'required|numeric|min:0'
        ]);

        try {
            DB::beginTransaction();

            $materiaPrima = MateriaPrima::create([
                'nome' => $validated['nome'],
                'quantidade' => (float) $validated['quantidade'],
                'unidade_medida' => $validated['unidade_medida'],
                'preco_unitario' => (float) $validated['preco_unitario']
            ]);

            DB::commit();
            return response()->json($materiaPrima, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating MateriaPrima: ' . $e->getMessage());
            return response()->json(['message' => 'Erro ao criar matéria-prima'], 500);
        }
    }

    public function show($id)
    {
        try {
            $materiaPrima = MateriaPrima::findOrFail($id);
            return response()->json($materiaPrima);
        } catch (\Exception $e) {
            Log::error('Error fetching MateriaPrima: ' . $e->getMessage());
            return response()->json(['message' => 'Erro ao buscar matéria-prima'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $materiaPrima = MateriaPrima::findOrFail($id);

            $validated = $request->validate([
                'nome' => 'required|string|max:255',
                'quantidade' => 'required|numeric|min:0',
                'unidade_medida' => 'required|string|max:20',
                'preco_unitario' => 'required|numeric|min:0'
            ]);

            Log::info('Updating MateriaPrima', [
                'id' => $id,
                'current_data' => $materiaPrima->toArray(),
                'new_data' => $validated
            ]);

            DB::beginTransaction();

            $materiaPrima->update([
                'nome' => $validated['nome'],
                'quantidade' => (float) $validated['quantidade'],
                'unidade_medida' => $validated['unidade_medida'],
                'preco_unitario' => (float) $validated['preco_unitario']
            ]);

            DB::commit();

            $updated = $materiaPrima->fresh();
            Log::info('MateriaPrima updated successfully', ['data' => $updated->toArray()]);

            return response()->json($updated);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('MateriaPrima not found:', ['id' => $id]);
            return response()->json(['message' => 'Matéria-prima não encontrada'], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating MateriaPrima:', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Erro ao atualizar matéria-prima'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            DB::beginTransaction();

            $materiaPrima = MateriaPrima::findOrFail($id);
            $materiaPrima->delete();

            DB::commit();
            return response()->json(null, 204);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deleting MateriaPrima: ' . $e->getMessage());
            return response()->json(['message' => 'Erro ao excluir matéria-prima'], 500);
        }
    }

    public function atualizarEstoque(Request $request, $id)
    {
        try {
            $materiaPrima = MateriaPrima::findOrFail($id);

            $validated = $request->validate([
                'quantidade' => 'required|numeric|min:0'
            ]);

            DB::beginTransaction();

            $materiaPrima->quantidade = (float) $validated['quantidade'];
            $materiaPrima->save();

            DB::commit();
            return response()->json($materiaPrima->fresh());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating MateriaPrima stock: ' . $e->getMessage());
            return response()->json(['message' => 'Erro ao atualizar estoque'], 500);
        }
    }
}
