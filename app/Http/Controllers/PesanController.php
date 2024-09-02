<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\Pesanan;
use App\Models\PesananDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PesanController extends Controller
{
    public function index()
    {
        $barang = Barang::All();
        return Inertia('Pemesanan/Index', [
            'title' => "Pemesanan",
            'barang' => $barang
        ]);
    }

    public function store(Request $request)
    {
        $cart = $request->input('cart');
        $order = Pesanan::create([
            'user_id' => Auth::user()->id,
            'nama_pemesan' => $request->input('name'),
            'kelas' => $request->input('className'),
            'total_harga' => array_sum(array_map(function ($item) {
                return $item['harga_jual'] * $item['kuantitas'] - ($item['harga_jual'] * ($item['diskon'] / 100)) * $item['kuantitas'];
            }, $cart)),
        ]);

        return redirect()->route('pemesanan.index');
    }
}
