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
        Schema::create('barang_ukuran', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('barang_id');
            $table->foreign('barang_id')->references('id')->on('barang');
            $table->string('ukuran');
            $table->integer('harga_dasar');
            $table->integer('harga_jual');
            $table->integer('stok')->nullable();
            $table->integer('diskon')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('barang_ukuran');
    }
};
