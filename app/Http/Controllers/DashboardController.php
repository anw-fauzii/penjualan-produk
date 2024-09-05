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

        $salesData = Pesanan::selectRaw('DATE(created_at) as date, DAYNAME(created_at) as day_name, SUM(total_harga) as total_sales')
            ->whereBetween('created_at', [$lastWeek, $tomorrow])
            ->groupBy('date', 'day_name')
            ->orderBy('date')
            ->get();
        return Inertia::render('Dashboard', [
            'supplier' => $supplier,
            'barang' => $barang,
            'stok' => $stok,
            'stokKecil' => $stokKecil,
            'salesData' => $salesData,
        ]);
    }
}
