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
            $table->integer('harga_dasar');
            $table->integer('harga_jual');
            $table->enum('unit', ["PG", "TK", "SD"]);
            $table->integer('stok');
            $table->integer('diskon');
            $table->text('foto')->nullable();
            $table->text('barcode')->nullable();
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
