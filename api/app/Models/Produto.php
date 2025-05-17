<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produto extends Model
{
    use HasFactory;

    protected $fillable = [
        'nome',
        'preco',
        'estoque',
        'foto',
        'descricao',
        'fotos'
    ];

    protected $casts = [
        'preco' => 'float',
        'estoque' => 'integer',
        'fotos' => 'array'
    ];

    public function materiasPrimas()
    {
        return $this->belongsToMany(MateriaPrima::class, 'produto_materia_prima')
            ->withPivot('quantidade')
            ->withTimestamps();
    }

    public function pedidos()
    {
        return $this->belongsToMany(Pedido::class, 'pedido_items')
            ->withPivot(['quantidade', 'preco_unitario'])
            ->withTimestamps();
    }
}
