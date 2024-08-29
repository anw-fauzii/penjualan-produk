<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    use HasFactory;

    protected $table = "supplier";
    protected $primaryKey = 'id';

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'nama_supplier',
        'penanggung_jawab',
        'telepon',
        'alamat'
    ];

    public static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $datePrefix = Carbon::now()->format('ymd');

            $latestCode = Supplier::where('id', 'like', "%" . $datePrefix . "%")
                ->orderBy('id', 'desc')
                ->value('id');

            if ($latestCode) {
                $sequence = intval(substr($latestCode, -3)) + 1;
            } else {
                $sequence = 1;
            }

            $model->id = "SPLR-" . $datePrefix . str_pad($sequence, 3, '0', STR_PAD_LEFT);
        });
    }
}
