<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReturDetail extends Model
{
    use HasFactory;
    protected $table = "retur_detail";

    protected $fillable = [
        'id',
        'retur_id',
        'pesanan_detail_id',
        'kuantitas',
    ];

    public function retur(): BelongsTo
    {
        return $this->belongsTo(Retur::class);
    }

    public function pesanan_detail(): BelongsTo
    {
        return $this->belongsTo(PesananDetail::class);
    }
}
