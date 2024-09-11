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
        Schema::create('retur_detail', function (Blueprint $table) {
            $table->id();
            $table->string('retur_id');
            $table->foreign('retur_id')->references('id')->on('retur');
            $table->bigInteger('pesanan_detail_id')->unsigned();
            $table->foreign('pesanan_detail_id')->references('id')->on('pesanan_detail');
            $table->integer('kuantitas');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('retur_detail');
    }
};
