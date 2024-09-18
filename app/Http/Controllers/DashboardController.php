<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\BarangUkuran;
use App\Models\Pesanan;
use App\Models\Supplier;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function dashboard()
    {
        $supplier = Supplier::count();
        $barang = BarangUkuran::count();
        $stok = BarangUkuran::sum('stok');
        $stokKecil = BarangUkuran::with('barang')->orderBy('stok', 'asc')->limit('10')->get();

        $today = Carbon::today();
        $tomorrow = $today->copy()->addDay();

        $lastWeek = $today->copy()->subDays(6);

        $hargaDasar = Pesanan::join('pesanan_detail', 'pesanan.id', '=', 'pesanan_detail.pesanan_id')
            ->join('barang_ukuran', 'pesanan_detail.barang_ukuran_id', '=', 'barang_ukuran.id')
            ->selectRaw('DATE(pesanan.created_at) as date, DAYNAME(pesanan.created_at) as day_name, SUM(barang_ukuran.harga_dasar * pesanan_detail.kuantitas) as total_sales')
            ->whereBetween('pesanan.created_at', [$lastWeek, $tomorrow])
            ->groupBy('date', 'day_name')
            ->orderBy('date')
            ->get();
        $hargaJual = Pesanan::join('pesanan_detail', 'pesanan.id', '=', 'pesanan_detail.pesanan_id')
            ->join('barang_ukuran', 'pesanan_detail.barang_ukuran_id', '=', 'barang_ukuran.id')
            ->selectRaw('DATE(pesanan.created_at) as date, DAYNAME(pesanan.created_at) as day_name, SUM((barang_ukuran.harga_jual * (1 - (barang_ukuran.diskon / 100))) * pesanan_detail.kuantitas) as total_sales')
            ->whereBetween('pesanan.created_at', [$lastWeek, $tomorrow])
            ->groupBy('date', 'day_name')
            ->orderBy('date')
            ->get();

        $laba = Pesanan::join('pesanan_detail', 'pesanan.id', '=', 'pesanan_detail.pesanan_id')
            ->join('barang_ukuran', 'pesanan_detail.barang_ukuran_id', '=', 'barang_ukuran.id')
            ->selectRaw('DATE(pesanan.created_at) as date, DAYNAME(pesanan.created_at) as day_name, SUM(((barang_ukuran.harga_jual * (1 - (barang_ukuran.diskon / 100))) * pesanan_detail.kuantitas)-(barang_ukuran.harga_dasar * pesanan_detail.kuantitas)) as total_sales')
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
