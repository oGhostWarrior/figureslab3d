<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldsToPedidosTable extends Migration
{
    public function up()
    {
        Schema::table('pedidos', function (Blueprint $table) {
            $table->string('documento_fiscal')->nullable()->after('status');
            $table->string('origem')->nullable()->after('documento_fiscal');
        });
    }

    public function down()
    {
        Schema::table('pedidos', function (Blueprint $table) {
            $table->dropColumn('documento_fiscal');
            $table->dropColumn('origem');
        });
    }
}
