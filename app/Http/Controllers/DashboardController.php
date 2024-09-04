<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\Supplier;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function dashboard()
    {
        $supplier = Supplier::count();
        $barang = Barang::count();
        $stok = Barang::sum('stok');
        $stokKecil = Barang::orderBy('stok', 'asc')->limit('10')->get();
        return Inertia::render('Dashboard', [
            'supplier' => $supplier,
            'barang' => $barang,
            'stok' => $stok,
            'stokKecil' => $stokKecil
        ]);
    }
}
