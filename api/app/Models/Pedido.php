<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    use HasFactory;

    protected $fillable = [
        'cliente_id',
        'vendedor',
        'status',
        'documento_fiscal',
        'origem',
        'data_criacao',
        'data_atualizacao'
    ];

    protected $casts = [
        'data_criacao' => 'datetime',
        'data_atualizacao' => 'datetime'
    ];

    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }

    public function produtos()
    {
        return $this->belongsToMany(Produto::class, 'pedido_items')
            ->withPivot(['quantidade', 'preco_unitario'])
            ->withTimestamps();
    }
}
