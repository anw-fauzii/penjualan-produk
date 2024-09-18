<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('barang', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('kategori_id');
            $table->foreign('kategori_id')->references('id')->on('kategori');
            $table->string('supplier_id');
            $table->foreign('supplier_id')->references('id')->on('supplier');
            $table->string('nama_barang');
            $table->enum('unit', ["PG", "TK", "SD"]);
            $table->text('foto')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('barang');
    }
};
