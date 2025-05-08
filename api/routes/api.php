<?php

use App\Http\Controllers\API\ClienteController;
use App\Http\Controllers\API\MateriaPrimaController;
use App\Http\Controllers\API\PedidoController;
use App\Http\Controllers\API\ProdutoController;
use App\Http\Controllers\API\ImageProxyController;
use Illuminate\Support\Facades\Route;

header('Access-Control-Allow-Origin: http://10.10.10.146:5173');
header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Rota alternativa para exclusão
Route::post('/v1/produtos/delete/{id}', [ProdutoController::class, 'destroy']);

Route::prefix('v1')->group(function () {
    // Clientes
    Route::apiResource('clientes', ClienteController::class);

    // Matérias-Primas
    Route::get('/materias-primas', [MateriaPrimaController::class, 'index']);
    Route::post('/materias-primas', [MateriaPrimaController::class, 'store']);
    Route::get('/materias-primas/{id}', [MateriaPrimaController::class, 'show']);
    Route::put('/materias-primas/{id}', [MateriaPrimaController::class, 'update']);
    Route::delete('/materias-primas/{id}', [MateriaPrimaController::class, 'destroy']);
    Route::patch('/materias-primas/{id}/estoque', [MateriaPrimaController::class, 'atualizarEstoque']);

    // Produtos
    Route::apiResource('produtos', ProdutoController::class);

    // Pedidos
    Route::apiResource('pedidos', PedidoController::class)->except(['update', 'destroy']);
    Route::patch('pedidos/{pedido}/status', [PedidoController::class, 'atualizarStatus']);
    Route::get('pedidos/{pedido}/documento', [PedidoController::class, 'getDocumento']);

    // Proxy Imagem jsPDF
    Route::get('/proxy-image', [ImageProxyController::class, 'fetch']);
});
