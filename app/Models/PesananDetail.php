<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PesananDetail extends Model
{
    use HasFactory;
    protected $table = "pesanan_detail";

    protected $fillable = [
        'id',
        'pesanan_id',
        'barang_ukuran_id',
        'kuantitas',
        'harga',
        'diskon',
        'subtotal'
    ];

    public function pesanan(): BelongsTo
    {
        return $this->belongsTo(Pesanan::class);
    }

    public function barang_ukuran(): BelongsTo
    {
        return $this->belongsTo(BarangUkuran::class);
    }
}
