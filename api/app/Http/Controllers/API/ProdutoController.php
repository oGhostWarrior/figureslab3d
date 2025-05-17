<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Produto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProdutoController extends Controller
{
    public function index()
    {
        return response()->json(
            Produto::with(['materiasPrimas:id,nome,unidade_medida'])->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'preco' => 'required|numeric|min:0',
            'estoque' => 'required|numeric|min:0',
            'foto' => 'required|url',
            'descricao' => 'nullable|string',
            'fotos' => 'nullable|array',
            'fotos.*' => 'url',
            'materiaPrima' => 'required|array',
            'materiaPrima.*.id' => 'required|exists:materia_primas,id',
            'materiaPrima.*.quantidade' => 'required|numeric|min:0'
        ]);

        DB::beginTransaction();

        try {
            $produto = Produto::create([
                'nome' => $validated['nome'],
                'preco' => $validated['preco'],
                'estoque' => $validated['estoque'],
                'foto' => $validated['foto'],
                'descricao' => $validated['descricao'] ?? null,
                'fotos' => $validated['fotos'] ?? []
            ]);

            foreach ($validated['materiaPrima'] as $mp) {
                $produto->materiasPrimas()->attach($mp['id'], [
                    'quantidade' => $mp['quantidade']
                ]);
            }

            DB::commit();
            return response()->json($produto->load('materiasPrimas'), 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Erro ao criar produto'], 500);
        }
    }

    public function show(Produto $produto)
    {
        return response()->json($produto->load('materiasPrimas'));
    }

    public function update(Request $request, Produto $produto)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'preco' => 'required|numeric|min:0',
            'estoque' => 'required|numeric|min:0',
            'foto' => 'required|url',
            'descricao' => 'nullable|string',
            'fotos' => 'nullable|array',
            'fotos.*' => 'url',
            'materiaPrima' => 'required|array',
            'materiaPrima.*.id' => 'required|exists:materia_primas,id',
            'materiaPrima.*.quantidade' => 'required|numeric|min:0'
        ]);

        DB::beginTransaction();

        try {
            $produto->update([
                'nome' => $validated['nome'],
                'preco' => $validated['preco'],
                'estoque' => $validated['estoque'],
                'foto' => $validated['foto'],
                'descricao' => $validated['descricao'] ?? null,
                'fotos' => $validated['fotos'] ?? []
            ]);

            $produto->materiasPrimas()->detach();

            foreach ($validated['materiaPrima'] as $mp) {
                $produto->materiasPrimas()->attach($mp['id'], [
                    'quantidade' => $mp['quantidade']
                ]);
            }

            DB::commit();
            return response()->json($produto->load('materiasPrimas'));

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Erro ao atualizar produto'], 500);
        }
    }

    public function destroy(Produto $produto)
    {
        DB::beginTransaction();

        try {
            $produto->materiasPrimas()->detach();
            $produto->delete();

            DB::commit();
            return response()->json(null, 204);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Erro ao excluir produto'], 500);
        }
    }
}
