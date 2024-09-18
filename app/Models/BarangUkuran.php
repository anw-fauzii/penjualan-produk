<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BarangUkuran extends Model
{
    use HasFactory;

    protected $table = "barang_ukuran";
    protected $primaryKey = 'id';

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'barang_id',
        'ukuran',
        'harga_jual',
        'harga_dasar',
        'diskon',
        'stok',
    ];
    public function barang(): BelongsTo
    {
        return $this->belongsTo(Barang::class);
    }
}
