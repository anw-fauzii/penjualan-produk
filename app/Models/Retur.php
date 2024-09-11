<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Retur extends Model
{
    use HasFactory;

    protected $table = "retur";
    protected $primaryKey = 'id';

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'pesanan_id',
    ];

    public function pesanan(): BelongsTo
    {
        return $this->belongsTo(Pesanan::class);
    }

    public function retur_detail(): HasMany
    {
        return $this->hasMany(ReturDetail::class);
    }

    public static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $datePrefix = Carbon::now()->format('ymd');

            $latestCode = Retur::where('id', 'like', "%" . $datePrefix . "%")
                ->orderBy('id', 'desc')
                ->value('id');

            if ($latestCode) {
                $sequence = intval(substr($latestCode, -3)) + 1;
            } else {
                $sequence = 1;
            }

            $model->id = "RTR-" . $datePrefix . str_pad($sequence, 3, '0', STR_PAD_LEFT);
        });
    }
}
