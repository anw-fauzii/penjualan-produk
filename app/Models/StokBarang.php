<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StokBarang extends Model
{
    use HasFactory;
    protected $table = "stok_barang";
    protected $fillable = [
        'barang_ukuran_id',
        'stok',
    ];

    public function barang_ukuran(): BelongsTo
    {
        return $this->belongsTo(BarangUkuran::class);
    }
}
