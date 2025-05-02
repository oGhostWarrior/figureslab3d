<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ClienteController extends Controller
{
    public function index()
    {
        return response()->json(Cliente::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'email' => 'required|email|unique:clientes',
            'telefone' => 'required|string|max:20',
            'endereco' => 'required|string|max:255'
        ]);

        $cliente = Cliente::create($validated);

        return response()->json($cliente, 201);
    }

    public function show(Cliente $cliente)
    {
        return response()->json($cliente);
    }

    public function update(Request $request, Cliente $cliente)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('clientes')->ignore($cliente->id)],
            'telefone' => 'required|string|max:20',
            'endereco' => 'required|string|max:255'
        ]);

        $cliente->update($validated);

        return response()->json($cliente);
    }

    public function destroy(Cliente $cliente)
    {
        
        $cliente->delete();
        return response()->json(null, 204);
    }
}
