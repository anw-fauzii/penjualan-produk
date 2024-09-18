<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
        'unit',
        'foto',
    ];
    public function kategori(): BelongsTo
    {
        return $this->belongsTo(Kategori::class);
    }
    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }
    public function ukuran(): HasMany
    {
        return $this->hasMany(BarangUkuran::class);
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
                $sequence = intval(substr($latestCode, -2)) + 1;
            } else {
                $sequence = 1;
            }

            $model->id = $model->unit . "-" . $datePrefix . str_pad($sequence, 2, '0', STR_PAD_LEFT);
        });
    }
}
