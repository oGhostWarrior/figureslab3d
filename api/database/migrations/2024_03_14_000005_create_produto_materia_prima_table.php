<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProdutoMateriaPrimaTable extends Migration
{
    public function up()
    {
        Schema::create('produto_materia_prima', function (Blueprint $table) {
            $table->id();
            $table->foreignId('produto_id')->constrained()->onDelete('cascade');
            $table->foreignId('materia_prima_id')->constrained()->onDelete('cascade');
            $table->decimal('quantidade', 10, 2);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('produto_materia_prima');
    }
}