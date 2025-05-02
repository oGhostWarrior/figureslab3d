<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMateriaPrimasTable extends Migration
{
    public function up()
    {
        Schema::create('materia_primas', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->decimal('quantidade', 10, 2);
            $table->string('unidade_medida');
            $table->decimal('preco_unitario', 10, 2);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('materia_primas');
    }
}