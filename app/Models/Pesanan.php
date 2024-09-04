<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pesanan extends Model
{
    use HasFactory;

    protected $table = "pesanan";
    protected $primaryKey = 'id';

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'nama_pemesan',
        'kelas',
        'nama_siswa',
        'user_id',
        'total_harga',
        'status'
    ];

    public function pesanan_detail(): HasMany
    {
        return $this->hasMany(PesananDetail::class);
    }

    public static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $datePrefix = Carbon::now()->format('ymd');

            $latestCode = Pesanan::where('id', 'like', "%" . $datePrefix . "%")
                ->orderBy('id', 'desc')
                ->value('id');

            if ($latestCode) {
                $sequence = intval(substr($latestCode, -3)) + 1;
            } else {
                $sequence = 1;
            }

            $model->id = "INV-" . $datePrefix . str_pad($sequence, 3, '0', STR_PAD_LEFT);
        });
    }
}
