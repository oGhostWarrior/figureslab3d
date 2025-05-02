<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MateriaPrima extends Model
{
    use HasFactory;

    protected $table = 'materia_primas';

    protected $fillable = [
        'nome',
        'quantidade',
        'unidade_medida',
        'preco_unitario'
    ];

    protected $casts = [
        'quantidade' => 'float',
        'preco_unitario' => 'float'
    ];
}
