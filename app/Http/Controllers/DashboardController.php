<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\Pesanan;
use App\Models\Supplier;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function dashboard()
    {
        $supplier = Supplier::count();
        $barang = Barang::count();
        $stok = Barang::sum('stok');
        $stokKecil = Barang::orderBy('stok', 'asc')->limit('10')->get();

        $today = Carbon::today();
        $tomorrow = $today->copy()->addDay();

        $lastWeek = $today->copy()->subDays(6);

        $hargaDasar = Pesanan::join('pesanan_detail', 'pesanan.id', '=', 'pesanan_detail.pesanan_id')
            ->join('barang', 'pesanan_detail.barang_id', '=', 'barang.id')
            ->selectRaw('DATE(pesanan.created_at) as date, DAYNAME(pesanan.created_at) as day_name, SUM(barang.harga_dasar * pesanan_detail.kuantitas) as total_sales')
            ->whereBetween('pesanan.created_at', [$lastWeek, $tomorrow])
            ->groupBy('date', 'day_name')
            ->orderBy('date')
            ->get();
        $hargaJual = Pesanan::join('pesanan_detail', 'pesanan.id', '=', 'pesanan_detail.pesanan_id')
            ->join('barang', 'pesanan_detail.barang_id', '=', 'barang.id')
            ->selectRaw('DATE(pesanan.created_at) as date, DAYNAME(pesanan.created_at) as day_name, SUM((barang.harga_jual * (1 - (barang.diskon / 100))) * pesanan_detail.kuantitas) as total_sales')
            ->whereBetween('pesanan.created_at', [$lastWeek, $tomorrow])
            ->groupBy('date', 'day_name')
            ->orderBy('date')
            ->get();

        $laba = Pesanan::join('pesanan_detail', 'pesanan.id', '=', 'pesanan_detail.pesanan_id')
            ->join('barang', 'pesanan_detail.barang_id', '=', 'barang.id')
            ->selectRaw('DATE(pesanan.created_at) as date, DAYNAME(pesanan.created_at) as day_name, SUM(((barang.harga_jual * (1 - (barang.diskon / 100))) * pesanan_detail.kuantitas)-(barang.harga_dasar * pesanan_detail.kuantitas)) as total_sales')
            ->whereBetween('pesanan.created_at', [$lastWeek, $tomorrow])
            ->groupBy('date', 'day_name')
            ->orderBy('date')
            ->get();
        return Inertia::render('Dashboard', [
            'supplier' => $supplier,
            'barang' => $barang,
            'stok' => $stok,
            'stokKecil' => $stokKecil,
            'hargaDasar' => $hargaDasar,
            'hargaJual' => $hargaJual,
            'laba' => $laba,
        ]);
    }
}
