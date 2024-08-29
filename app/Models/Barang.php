<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Barang extends Model
{
    use HasFactory;

    protected $table = "barang";
    protected $primaryKey = 'id';

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'nama_barang',
        'kategori_id',
        'supplier_id',
        'harga_jual',
        'harga_dasar',
        'unit',
        'foto',
        'diskon',
        'stok',
        'barcode'
    ];
    public function kategori(): BelongsTo
    {
        return $this->belongsTo(Kategori::class);
    }
    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $datePrefix = Carbon::now()->format('ymd');

            $latestCode = Barang::where('id', 'like', "%" . $datePrefix . "%")
                ->orderBy('id', 'desc')
                ->value('id');

            if ($latestCode) {
                $sequence = intval(substr($latestCode, -3)) + 1;
            } else {
                $sequence = 1;
            }

            $model->id = "PRD-" . $datePrefix . str_pad($sequence, 3, '0', STR_PAD_LEFT);
        });
    }
}
