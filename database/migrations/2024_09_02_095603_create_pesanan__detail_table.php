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
        Schema::create('pesanan__detail', function (Blueprint $table) {
            $table->id();
            $table->string('pesanan_id');
            $table->foreign('pesanan_id')->references('id')->on('pesanan');
            $table->string('barang_id');
            $table->foreign('barang_id')->references('id')->on('barang');
            $table->integer('kuantitas');
            $table->integer('harga');
            $table->integer('diskon');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pesanan__detail');
    }
};
